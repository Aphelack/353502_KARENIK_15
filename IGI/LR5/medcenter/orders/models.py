from django.db import models
from django.contrib.auth.models import User
from services.models import Service
from promotions.models import PromoCode
import uuid


class Order(models.Model):
    """Orders for services."""
    STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('paid', 'Оплачен'),
        ('processing', 'В обработке'),
        ('confirmed', 'Подтвержден'),
        ('cancelled', 'Отменен'),
        ('completed', 'Завершен'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('card', 'Банковская карта'),
        ('cash', 'Наличные'),
        ('transfer', 'Банковский перевод'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders',
                           verbose_name='Пользователь')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending',
                            verbose_name='Статус')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES,
                                    blank=True, null=True, verbose_name='Способ оплаты')
    promo_code = models.ForeignKey(PromoCode, on_delete=models.SET_NULL, blank=True, null=True,
                                 related_name='orders', verbose_name='Промокод')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                 verbose_name='Подытог')
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                        verbose_name='Размер скидки')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                              verbose_name='Итого')
    notes = models.TextField(blank=True, null=True, verbose_name='Примечания')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    paid_at = models.DateTimeField(blank=True, null=True, verbose_name='Дата оплаты')
    
    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Заказ {self.id} - {self.user.username}"
    
    def calculate_total(self):
        """Calculate order total with discounts."""
        self.subtotal = sum(item.total_price for item in self.items.all())
        self.discount_amount = 0
        
        if self.promo_code and self.promo_code.is_valid:
            if self.subtotal >= self.promo_code.min_order_amount:
                if self.promo_code.discount_type == 'percentage':
                    self.discount_amount = self.subtotal * (self.promo_code.discount_value / 100)
                else:  # fixed
                    self.discount_amount = self.promo_code.discount_value
                
                if self.promo_code.max_discount_amount:
                    self.discount_amount = min(self.discount_amount, self.promo_code.max_discount_amount)
        
        self.total = self.subtotal - self.discount_amount
        self.save()


class OrderItem(models.Model):
    """Individual items in an order."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items',
                            verbose_name='Заказ')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, verbose_name='Услуга')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Количество')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    
    class Meta:
        verbose_name = 'Элемент заказа'
        verbose_name_plural = 'Элементы заказа'
        unique_together = ['order', 'service']
    
    def __str__(self):
        return f"{self.service.name} x{self.quantity}"
    
    @property
    def total_price(self):
        return self.price * self.quantity
    
    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.service.price
        super().save(*args, **kwargs)