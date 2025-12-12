from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    """
    Extended user profile with role-based access control.
    """
    ROLE_CHOICES = [
        ('client', 'Клиент'),
        ('doctor', 'Врач'),
        ('admin', 'Администратор'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Телефон')
    address = models.TextField(blank=True, null=True, verbose_name='Адрес')
    birth_date = models.DateField(blank=True, null=True, verbose_name='Дата рождения')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name='Аватар')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
    
    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"
    
    @property
    def full_name(self):
        """Returns the full name of the user."""
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
    
    @property
    def is_client(self):
        """Check if user is a client."""
        return self.role == 'client'
    
    @property
    def is_doctor(self):
        """Check if user is a doctor."""
        return self.role == 'doctor'
    
    @property
    def is_admin(self):
        """Check if user is an admin."""
        return self.role == 'admin'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a profile instance whenever a user is created."""
    if created:
        # Check if profile already exists before creating
        if not Profile.objects.filter(user=instance).exists():
            Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save the profile instance whenever the user is saved."""
    # Only save if profile exists
    if Profile.objects.filter(user=instance).exists():
        instance.profile.save()


