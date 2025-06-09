from django.db import models
from accounts.models import User
from services.models import Service
import datetime

class Specialization(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=20, blank=True, null=True, help_text="Введите номер телефона в формате +375XXXXXXXXX")
    address = models.CharField(max_length=255, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    specialization = models.ForeignKey('Specialization', on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True)
    services = models.ManyToManyField(Service, blank=True, related_name='doctors', verbose_name="Оказываемые услуги")
    work_start = models.TimeField(default=datetime.time(9, 0))
    work_end = models.TimeField(default=datetime.time(17, 0))


    def __str__(self):
        return f"{self.user.last_name} {self.user.first_name} ({self.user.username})"

    def services_list(self):
        return ", ".join([s.name for s in self.services.all()])
    services_list.short_description = "Оказываемые услуги"
