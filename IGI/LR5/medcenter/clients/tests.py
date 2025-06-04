from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from services.models import Service, ServiceCategory
from doctors.models import DoctorProfile
from appointments.models import Appointment
from .models import ClientProfile
import datetime

class OrderServiceViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client_profile = ClientProfile.objects.create(
            user=self.user,
            birth_date=datetime.date(2000, 1, 1)
        )
        self.category = ServiceCategory.objects.create(name='Терапия')
        self.service = Service.objects.create(name='Консультация', price=50, category=self.category)
        self.doctor_user = User.objects.create_user(username='doctor', password='docpass')
        self.doctor = DoctorProfile.objects.create(user=self.doctor_user)
        self.doctor.services.add(self.service)

    def test_service_list_view(self):
        response = self.client.get(reverse('service_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.service.name)

    def test_order_service_requires_login(self):
        response = self.client.get(reverse('order_service', args=[self.service.id]))
        self.assertEqual(response.status_code, 302)

    def test_order_service_view_logged_in(self):
        self.client.login(username='testuser', password='testpass')
        response = self.client.get(reverse('order_service', args=[self.service.id]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.service.name)

    def test_confirm_order_flow(self):
        self.client.login(username='testuser', password='testpass')
        today = datetime.date.today()
        hour = 9
        date_str = today.strftime('%Y-%m-%d')
        url = reverse('confirm_order', args=[self.doctor.id, self.service.id, date_str, str(hour)])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.service.name)

        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Appointment.objects.filter(
            client=self.user.clientprofile,
            doctor=self.doctor,
            service=self.service,
            appointment_date=datetime.datetime.strptime(f"{date_str} {hour}", "%Y-%m-%d %H")
        ).exists())
