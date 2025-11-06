from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from services.models import Service
import uuid


class PromoCode(models.Model):
    """Promotional codes for discounts."""
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Процент'),
        ('fixed', 'Фиксированная сумма'),
    ]
    
    code = models.CharField(max_length=50, unique=True, verbose_name='Промокод')
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPE_CHOICES,
                                   verbose_name='Тип скидки')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2,
                                       verbose_name='Размер скидки')
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                         verbose_name='Минимальная сумма заказа')
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,
                                            verbose_name='Максимальная сумма скидки')
    usage_limit = models.PositiveIntegerField(blank=True, null=True,
                                            verbose_name='Лимит использований')
    usage_limit_per_user = models.PositiveIntegerField(default=1,
                                                      verbose_name='Лимит на пользователя')
    applicable_services = models.ManyToManyField(Service, blank=True,
                                               verbose_name='Применимые услуги')
    is_active = models.BooleanField(default=True, verbose_name='Активный')
    valid_from = models.DateTimeField(verbose_name='Действителен с')
    valid_until = models.DateTimeField(verbose_name='Действителен до')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Промокод'
        verbose_name_plural = 'Промокоды'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.valid_until
    
    @property
    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return self.is_active and self.valid_from <= now <= self.valid_until
    
    def get_usage_count(self):
        return self.usages.count()
    
    def get_user_usage_count(self, user):
        return self.usages.filter(user=user).count()
    
    def can_be_used_by(self, user):
        if not self.is_valid:
            return False, "Промокод недействителен"
        
        if self.usage_limit and self.get_usage_count() >= self.usage_limit:
            return False, "Превышен лимит использований промокода"
        
        if self.get_user_usage_count(user) >= self.usage_limit_per_user:
            return False, "Превышен лимит использований для пользователя"
        
        return True, "OK"


class PromoCodeUsage(models.Model):
    """Track promo code usage."""
    promo_code = models.ForeignKey(PromoCode, on_delete=models.CASCADE, related_name='usages',
                                 verbose_name='Промокод')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='promo_usages',
                           verbose_name='Пользователь')
    order_id = models.CharField(max_length=100, verbose_name='ID заказа')
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2,
                                        verbose_name='Размер скидки')
    used_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата использования')
    
    class Meta:
        verbose_name = 'Использование промокода'
        verbose_name_plural = 'Использования промокодов'
        ordering = ['-used_at']
    
    def __str__(self):
        return f"{self.promo_code.code} - {self.user.username}"


class Banner(models.Model):
    """Advertising banners for the homepage."""
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    subtitle = models.CharField(max_length=300, blank=True, null=True, verbose_name='Подзаголовок')
    image = models.ImageField(upload_to='banners/', blank=True, null=True, verbose_name='Изображение')
    link_url = models.URLField(blank=True, null=True, verbose_name='Ссылка')
    link_text = models.CharField(max_length=100, blank=True, null=True, verbose_name='Текст ссылки')
    is_active = models.BooleanField(default=True, verbose_name='Активный')
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')
    start_date = models.DateTimeField(blank=True, null=True, verbose_name='Дата начала показа')
    end_date = models.DateTimeField(blank=True, null=True, verbose_name='Дата окончания показа')
    
    class Meta:
        verbose_name = 'Баннер'
        verbose_name_plural = 'Баннеры'
        ordering = ['order', '-id']
    
    def __str__(self):
        return self.title
    
    @property
    def is_visible(self):
        from django.utils import timezone
        now = timezone.now()
        if not self.is_active:
            return False
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        return True