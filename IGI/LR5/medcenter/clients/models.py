from django.db import models
from django.contrib.auth.models import User
from services.models import Service


class ClientProfile(models.Model):
    """
    Extended profile information specific to clients.
    Links to the main Profile model through User.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    medical_card_number = models.CharField(max_length=50, unique=True, blank=True, null=True, 
                                         verbose_name='Номер медицинской карты')
    emergency_contact = models.CharField(max_length=100, blank=True, null=True,
                                       verbose_name='Контакт в экстренной ситуации')
    emergency_phone = models.CharField(max_length=20, blank=True, null=True,
                                     verbose_name='Телефон экстренного контакта')
    allergies = models.TextField(blank=True, null=True, verbose_name='Аллергии')
    medical_history = models.TextField(blank=True, null=True, verbose_name='Медицинская история')
    preferred_language = models.CharField(max_length=50, default='русский', verbose_name='Предпочитаемый язык')
    
    class Meta:
        verbose_name = 'Профиль клиента'
        verbose_name_plural = 'Профили клиентов'

    def __str__(self):
        return f"Клиент: {self.user.profile.full_name}"

    @property
    def full_name(self):
        """Returns the full name from the main profile."""
        return self.user.profile.full_name


class Cart(models.Model):
    """Shopping cart for services."""
    client = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'
    
    def __str__(self):
        return f"Корзина {self.client.username}"
    
    @property
    def total_price(self):
        """Calculate total price of all items in cart."""
        return sum(item.total_price for item in self.items.all())
    
    @property
    def items_count(self):
        """Get total number of items in cart."""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """Individual item in shopping cart."""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Элемент корзины'
        verbose_name_plural = 'Элементы корзины'
        unique_together = ['cart', 'service']
    
    def __str__(self):
        return f"{self.service.name} x{self.quantity}"
    
    @property
    def total_price(self):
        """Calculate total price for this cart item."""
        return self.service.price * self.quantity

