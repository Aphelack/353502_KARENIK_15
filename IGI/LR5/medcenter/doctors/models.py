from django.db import models
from django.contrib.auth.models import User
from services.models import Service
import datetime


class Specialization(models.Model):
    """Medical specializations for doctors."""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Специализация'
        verbose_name_plural = 'Специализации'
    
    def __str__(self):
        return self.name


class Category(models.Model):
    """Medical categories for doctors."""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
    
    def __str__(self):
        return self.name


class DoctorProfile(models.Model):
    """
    Extended profile information specific to doctors.
    Links to the main Profile model through User.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.ForeignKey(Specialization, on_delete=models.SET_NULL, null=True, blank=True,
                                     verbose_name='Специализация')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True,
                               verbose_name='Категория')
    services = models.ManyToManyField(Service, blank=True, related_name='doctors', 
                                    verbose_name="Оказываемые услуги")
    work_start = models.TimeField(default=datetime.time(9, 0), verbose_name='Начало работы')
    work_end = models.TimeField(default=datetime.time(17, 0), verbose_name='Конец работы')
    license_number = models.CharField(max_length=100, unique=True, blank=True, null=True,
                                    verbose_name='Номер лицензии')
    experience_years = models.PositiveIntegerField(default=0, verbose_name='Опыт работы (лет)')
    education = models.TextField(blank=True, null=True, verbose_name='Образование')
    achievements = models.TextField(blank=True, null=True, verbose_name='Достижения')
    consultation_price = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                           verbose_name='Стоимость консультации')
    is_available = models.BooleanField(default=True, verbose_name='Доступен для записи')
    
    class Meta:
        verbose_name = 'Профиль врача'
        verbose_name_plural = 'Профили врачей'

    def __str__(self):
        return f"Врач: {self.user.profile.full_name}"

    @property
    def full_name(self):
        """Returns the full name from the main profile."""
        return self.user.profile.full_name

    def services_list(self):
        """Returns a comma-separated list of services."""
        return ", ".join([s.name for s in self.services.all()])
    services_list.short_description = "Оказываемые услуги"
