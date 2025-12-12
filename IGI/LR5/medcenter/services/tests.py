from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from services.models import Service, ServiceCategory

class ServiceModelTests(TestCase):
    def setUp(self):
        self.category = ServiceCategory.objects.create(name='Терапия')
        self.service = Service.objects.create(
            name='Консультация',
            price=50,
            category=self.category,
            description='Тестовое описание'
        )

    def test_service_str(self):
        self.assertEqual(str(self.service), 'Консультация')

    def test_service_category(self):
        self.assertEqual(self.service.category, self.category)

class ServiceListViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.category = ServiceCategory.objects.create(name='Терапия')
        self.service = Service.objects.create(
            name='Консультация',
            price=50,
            category=self.category,
            description='Тестовое описание'
        )

    def test_service_list_view(self):
        response = self.client.get(reverse('service_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.service.name)
        self.assertContains(response, self.category.name)
