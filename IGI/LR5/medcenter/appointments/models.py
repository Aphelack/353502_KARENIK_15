from django.db import models
from clients.models import ClientProfile
from doctors.models import DoctorProfile
from services.models import Service

class Appointment(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='appointments', blank=True, null=True)
    appointment_date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Appointment: {self.client} with {self.doctor} on {self.appointment_date}"

    def get_service_price(self):
        return self.service.price if self.service else None

    class Meta:
        ordering = ['appointment_date']
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'
