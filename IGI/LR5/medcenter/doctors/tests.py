from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from doctors.models import DoctorProfile
from services.models import Service, ServiceCategory

class DoctorCabinetViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='doctor', password='docpass')
        self.doctor = DoctorProfile.objects.create(user=self.user)
        self.category = ServiceCategory.objects.create(name='Терапия')
        self.service = Service.objects.create(name='Консультация', price=50, category=self.category)
        self.doctor.services.add(self.service)

    def test_doctor_cabinet_requires_login(self):
        response = self.client.get(reverse('doctor_cabinet'))
        self.assertEqual(response.status_code, 302)

    def test_doctor_cabinet_view_logged_in(self):
        self.client.login(username='doctor', password='docpass')
        response = self.client.get(reverse('doctor_cabinet'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.user.get_full_name())
