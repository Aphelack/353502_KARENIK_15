from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from services.models import Service
from doctors.models import DoctorProfile


class Review(models.Model):
    """User reviews for services and doctors."""
    RATING_CHOICES = [
        (1, '1 - Очень плохо'),
        (2, '2 - Плохо'),
        (3, '3 - Удовлетворительно'),
        (4, '4 - Хорошо'),
        (5, '5 - Отлично'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews',
                           verbose_name='Пользователь')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, blank=True, null=True,
                              related_name='reviews', verbose_name='Услуга')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, blank=True, null=True,
                             related_name='reviews', verbose_name='Врач')
    rating = models.PositiveIntegerField(
        choices=RATING_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name='Оценка'
    )
    title = models.CharField(max_length=200, blank=True, null=True, verbose_name='Заголовок')
    text = models.TextField(verbose_name='Текст отзыва')
    is_published = models.BooleanField(default=False, verbose_name='Опубликован')
    is_recommended = models.BooleanField(default=False, verbose_name='Рекомендуемый')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']
        unique_together = [['user', 'service'], ['user', 'doctor']]
    
    def __str__(self):
        target = self.service.name if self.service else self.doctor.full_name
        return f"Отзыв от {self.user.username} на {target}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.service and not self.doctor:
            raise ValidationError('Необходимо указать услугу или врача.')
        if self.service and self.doctor:
            raise ValidationError('Нельзя указывать одновременно услугу и врача.')