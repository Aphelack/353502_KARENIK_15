from django.shortcuts import render, get_object_or_404, redirect
from .models import ClientProfile
from django.contrib.auth.decorators import login_required
from appointments.models import Appointment
from services.models import ServiceCategory, Service
from doctors.models import DoctorProfile
import datetime
from django.utils import timezone
from django.contrib import messages

def client_detail(request, pk):
    client = get_object_or_404(ClientProfile, pk=pk)
    return render(request, 'clients/client_detail.html', {'client': client})

@login_required
def client_cabinet(request):
    # Check if user has client role
    user_profile = getattr(request.user, 'profile', None)
    if not user_profile or user_profile.role != 'client':
        return render(request, 'no_access.html')
    
    # Get or create ClientProfile
    client, created = ClientProfile.objects.get_or_create(user=request.user)
    
    appointments = Appointment.objects.filter(client=client).order_by('appointment_date')
    
    return render(request, 'clients/client_cabinet.html', {
        'appointments': appointments,
        'client': client,
        'user_profile': user_profile,
    })

def service_list(request):
    categories = ServiceCategory.objects.all()
    selected_category_id = request.GET.get('category')
    services = None
    selected_category = None
    if selected_category_id:
        selected_category = ServiceCategory.objects.filter(id=selected_category_id).first()
        services = Service.objects.filter(category=selected_category)
    return render(request, 'clients/service_list.html', {
        'categories': categories,
        'services': services,
        'selected_category': selected_category,
    })

@login_required
def conform_order(request, doctor_id, service_id, date_str, hour_str):
    doctor = get_object_or_404(DoctorProfile, pk=doctor_id)
    service = get_object_or_404(Service, pk=service_id)
    # hour_str now in 'HH:MM' format
    appointment_date = datetime.datetime.strptime(f"{date_str} {hour_str}", "%Y-%m-%d %H:%M")
    appointment_date = timezone.make_aware(appointment_date)
    
    if request.method == 'POST':
        # Import Cart and CartItem models
        from clients.models import Cart, CartItem
        
        # Get or create cart for the user
        cart, created = Cart.objects.get_or_create(client=request.user)
        
        # Create a new cart item with doctor and appointment time
        # Since we removed unique_together, we can have multiple items with same service but different times
        cart_item = CartItem.objects.create(
            cart=cart,
            service=service,
            quantity=1,
            doctor=doctor,
            appointment_time=appointment_date
        )
        
        messages.success(request, f'Услуга "{service.name}" добавлена в корзину! Врач: {doctor.full_name}, Время: {appointment_date.strftime("%d.%m.%Y %H:%M")}')
        return redirect('cart')
    
    return render(request, 'clients/conform_order.html', {
        'doctor': doctor,
        'service': service,
        'appointment_date': appointment_date,
    })

@login_required
def order_service(request, service_id):
    service = get_object_or_404(Service, pk=service_id)
    doctors = DoctorProfile.objects.filter(services=service)
    
    if not doctors.exists():
        messages.error(request, 'Нет доступных врачей для этой услуги')
        return redirect('service_list')
    
    today = timezone.localdate()
    # Generate next 7 weekdays (excluding weekends)
    days = []
    current_day = today
    while len(days) < 7:
        if current_day.weekday() < 5:  # Monday=0, Friday=4
            days.append(current_day)
        current_day += datetime.timedelta(days=1)
    
    slots = []
    for day in days:
        # Create timezone-aware datetime objects
        start_time = timezone.make_aware(datetime.datetime.combine(day, datetime.time(9, 0)))
        end_time = timezone.make_aware(datetime.datetime.combine(day, datetime.time(17, 0)))
        current_time = start_time
        
        while current_time + service.duration <= end_time:
            slot_time = current_time
            
            # Find doctors available for this slot (not having an appointment at this time)
            available_doctors = doctors.exclude(
                appointments__appointment_date=slot_time
            )
            
            free_doctor = available_doctors.first()
            is_busy = not available_doctors.exists()
            
            slot = {
                'date': day,
                'time': slot_time.time(),
                'start': slot_time.time(),
                'end': (slot_time + service.duration).time(),
                'busy': is_busy,
                'free_doctor': free_doctor.id if free_doctor else None,
                'display': f"{slot_time.time().strftime('%H:%M')} - {(slot_time + service.duration).time().strftime('%H:%M')}",
            }
            slots.append(slot)
            current_time += service.duration
    
    if request.method == 'POST':
        slot = request.POST.get('slot')
        if slot:
            date_str, hour_str, doctor_id = slot.split('|')
            return redirect('confirm_order', doctor_id=doctor_id, service_id=service_id, date_str=date_str, hour_str=hour_str)
    
    return render(request, 'clients/order_service.html', {
        'service': service,
        'slots': slots,
        'days': days,
    })

@login_required
def delete_appointment(request, appointment_id):
    appointment = get_object_or_404(Appointment, pk=appointment_id, client=request.user.client_profile)
    if request.method == 'POST':
        appointment.delete()
        messages.success(request, 'Appointment successfully deleted!')
        return redirect('client_cabinet')
    return render(request, 'clients/confirm_delete.html', {'appointment': appointment})

@login_required
def edit_appointment(request, appointment_id):
    appointment = get_object_or_404(Appointment, pk=appointment_id, client=request.user.client_profile)
    service = appointment.service
    doctors = DoctorProfile.objects.filter(services=service)
    
    if request.method == 'POST':
        # Handle form submission for editing
        new_doctor_id = request.POST.get('doctor')
        new_date_str = request.POST.get('date')
        new_time_str = request.POST.get('time')
        
        try:
            new_doctor = get_object_or_404(DoctorProfile, pk=new_doctor_id)
            new_datetime = datetime.datetime.strptime(f"{new_date_str} {new_time_str}", "%Y-%m-%d %H:%M")
            
            # Check if the new slot is available
            if Appointment.objects.filter(doctor=new_doctor, appointment_date=new_datetime).exists():
                messages.error(request, 'This time slot is already booked. Please choose another time.')
            else:
                appointment.doctor = new_doctor
                appointment.appointment_date = new_datetime
                appointment.save()
                messages.success(request, 'Appointment successfully updated!')
                return redirect('client_cabinet')
                
        except Exception as e:
            messages.error(request, f'Error updating appointment: {str(e)}')
    
    # Generate available slots for editing
    today = timezone.localdate()
    days = [today + datetime.timedelta(days=i) for i in range(7) if (today + datetime.timedelta(days=i)).weekday() < 5]
    hours = [9,10,11,12,13,14,15,16]
    
    return render(request, 'clients/edit_appointment.html', {
        'appointment': appointment,
        'doctors': doctors,
        'days': days,
        'hours': hours,
        'current_date': appointment.appointment_date.date(),
        'current_time': appointment.appointment_date.time(),
    })