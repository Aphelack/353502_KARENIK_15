from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils import timezone
from accounts.permissions import client_required
from .models import Order, OrderItem
from clients.models import Cart, CartItem
from services.models import Service
from promotions.models import PromoCode
from .forms import OrderForm, PromoCodeForm


@client_required
def cart_view(request):
    """Display shopping cart."""
    cart, created = Cart.objects.get_or_create(client=request.user)
    
    context = {
        'cart': cart,
    }
    
    return render(request, 'orders/cart.html', context)


@client_required
@require_POST
def add_to_cart(request, service_id):
    """Add service to cart via AJAX."""
    service = get_object_or_404(Service, id=service_id)
    cart, created = Cart.objects.get_or_create(client=request.user)
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        service=service,
        defaults={'quantity': 1}
    )
    
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'message': f'{service.name} добавлен в корзину',
            'cart_items_count': cart.items_count,
            'cart_total': float(cart.total_price)
        })
    
    messages.success(request, f'{service.name} добавлен в корзину')
    return redirect('service_detail', service_id=service_id)


@client_required
@require_POST
def remove_from_cart(request, item_id):
    """Remove item from cart."""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__client=request.user)
    service_name = cart_item.service.name
    cart_item.delete()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        cart = request.user.cart
        return JsonResponse({
            'success': True,
            'message': f'{service_name} удален из корзины',
            'cart_items_count': cart.items_count,
            'cart_total': float(cart.total_price)
        })
    
    messages.success(request, f'{service_name} удален из корзины')
    return redirect('cart')


@client_required
@require_POST
def update_cart_quantity(request, item_id):
    """Update cart item quantity."""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__client=request.user)
    quantity = int(request.POST.get('quantity', 1))
    
    if quantity > 0:
        cart_item.quantity = quantity
        cart_item.save()
    else:
        cart_item.delete()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        cart = request.user.cart
        return JsonResponse({
            'success': True,
            'cart_items_count': cart.items_count,
            'cart_total': float(cart.total_price),
            'item_total': float(cart_item.total_price) if quantity > 0 else 0
        })
    
    return redirect('cart')


@client_required
def checkout(request):
    """Checkout process."""
    cart = get_object_or_404(Cart, client=request.user)
    
    if not cart.items.exists():
        messages.error(request, 'Ваша корзина пуста')
        return redirect('cart')
    
    if request.method == 'POST':
        form = OrderForm(request.POST)
        promo_form = PromoCodeForm(request.POST)
        payment_method = request.POST.get('payment_method', 'cash')
        
        if form.is_valid():
            order = form.save(commit=False)
            order.user = request.user
            order.payment_method = payment_method
            
            # Apply promo code if provided
            if promo_form.is_valid() and promo_form.cleaned_data['code']:
                promo_code = promo_form.cleaned_data['code']
                can_use, message = promo_code.can_be_used_by(request.user)
                if can_use:
                    order.promo_code = promo_code
                else:
                    messages.error(request, message)
                    return render(request, 'orders/checkout.html', {
                        'form': form,
                        'promo_form': promo_form,
                        'cart': cart
                    })
            
            order.save()
            
            # Create order items from cart and appointments immediately
            from appointments.models import Appointment
            client_profile = request.user.client_profile
            
            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    service=cart_item.service,
                    quantity=cart_item.quantity,
                    price=cart_item.service.price,
                    doctor=cart_item.doctor,
                    appointment_time=cart_item.appointment_time
                )
                
                # Create appointment immediately (for all payment methods including cash)
                if cart_item.doctor and cart_item.appointment_time:
                    Appointment.objects.create(
                        client=client_profile,
                        doctor=cart_item.doctor,
                        service=cart_item.service,
                        appointment_date=cart_item.appointment_time,
                        notes=order.notes or ''
                    )
            
            # Calculate total
            order.calculate_total()
            
            # Mark order as paid (since appointment is confirmed)
            order.status = 'paid'
            order.is_paid = True
            order.paid_at = timezone.now()
            order.save()
            
            # Clear cart
            cart.items.all().delete()
            
            messages.success(request, f'Заказ #{order.id} успешно оформлен! Ваши записи добавлены в личный кабинет.')
            return redirect('order_success', order_id=order.id)
    else:
        form = OrderForm()
        promo_form = PromoCodeForm()
    
    context = {
        'form': form,
        'promo_form': promo_form,
        'cart': cart,
    }
    
    return render(request, 'orders/checkout.html', context)


@client_required
def order_success(request, order_id):
    """Order success page."""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    context = {
        'order': order,
    }
    
    return render(request, 'orders/order_success.html', context)


@client_required
def order_detail(request, order_id):
    """Display order details."""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    context = {
        'order': order,
    }
    
    return render(request, 'orders/order_detail.html', context)


@client_required
def payment(request, order_id):
    """Payment page (simplified)."""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    if order.status != 'pending':
        messages.error(request, 'Этот заказ уже обработан')
        return redirect('order_detail', order_id=order.id)
    
    if request.method == 'POST':
        # Simulate payment processing
        payment_method = request.POST.get('payment_method')
        if payment_method in ['card', 'cash', 'transfer']:
            order.payment_method = payment_method
            order.status = 'paid'
            from django.utils import timezone
            from appointments.models import Appointment
            order.paid_at = timezone.now()
            order.save()
            
            # Create appointments for each order item with doctor and time
            for order_item in order.items.all():
                if order_item.doctor and order_item.appointment_time:
                    # Check if user has client_profile
                    client_profile = getattr(request.user, 'client_profile', None)
                    if client_profile:
                        Appointment.objects.create(
                            client=client_profile,
                            doctor=order_item.doctor,
                            service=order_item.service,
                            appointment_date=order_item.appointment_time,
                            notes=f'Заказ #{order.id}'
                        )
            
            messages.success(request, 'Оплата прошла успешно! Записи на прием созданы.')
            return redirect('order_detail', order_id=order.id)
    
    context = {
        'order': order,
    }
    
    return render(request, 'orders/payment.html', context)