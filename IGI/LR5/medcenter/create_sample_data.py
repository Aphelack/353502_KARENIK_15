"""
Create sample data for the medical center application.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import Profile
from services.models import ServiceCategory, Service
from doctors.models import Specialization, Category, DoctorProfile
from clients.models import ClientProfile
from news.models import NewsCategory, News
from company.models import CompanyInfo, CompanyHistory, Partner, Contact, Vacancy
from glossary.models import GlossaryCategory, GlossaryTerm, FAQ
from promotions.models import Banner, PromoCode
import random
from datetime import datetime, timedelta
from django.utils import timezone


class Command(BaseCommand):
    help = 'Create sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create service categories and services
        self.create_services()
        
        # Create specializations and categories for doctors
        self.create_doctor_categories()
        
        # Create sample users
        self.create_sample_users()
        
        # Create company info
        self.create_company_data()
        
        # Create news
        self.create_news()
        
        # Create glossary data
        self.create_glossary()
        
        # Create promo codes
        self.create_promotions()
        
        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))

    def create_services(self):
        categories_data = [
            ("Диагностика", "Современные методы диагностики"),
            ("Лечение", "Эффективные методы лечения"),
            ("Профилактика", "Профилактические мероприятия"),
            ("Консультации", "Консультации специалистов"),
        ]
        
        for name, desc in categories_data:
            category, created = ServiceCategory.objects.get_or_create(
                name=name,
                defaults={'description': desc}
            )
            
            if created:
                # Create services for each category
                services_data = {
                    "Диагностика": [
                        ("УЗИ", "Ультразвуковое исследование", 50.00),
                        ("МРТ", "Магнитно-резонансная томография", 200.00),
                        ("КТ", "Компьютерная томография", 150.00),
                        ("ЭКГ", "Электрокардиография", 30.00),
                    ],
                    "Лечение": [
                        ("Физиотерапия", "Физиотерапевтическое лечение", 80.00),
                        ("Массаж", "Лечебный массаж", 60.00),
                        ("Инъекции", "Лечебные инъекции", 40.00),
                    ],
                    "Профилактика": [
                        ("Профосмотр", "Профилактический осмотр", 100.00),
                        ("Вакцинация", "Вакцинация", 70.00),
                    ],
                    "Консультации": [
                        ("Терапевт", "Консультация терапевта", 90.00),
                        ("Кардиолог", "Консультация кардиолога", 120.00),
                        ("Невролог", "Консультация невролога", 110.00),
                    ]
                }
                
                for service_name, service_desc, price in services_data.get(name, []):
                    Service.objects.create(
                        category=category,
                        name=service_name,
                        description=service_desc,
                        price=price,
                        duration=timedelta(minutes=30)
                    )

    def create_doctor_categories(self):
        specs = [
            ("Терапия", "Общая терапия"),
            ("Кардиология", "Заболевания сердца"),
            ("Неврология", "Заболевания нервной системы"),
            ("Педиатрия", "Детская медицина"),
        ]
        
        categories = [
            ("Первая категория", "Врачи первой категории"),
            ("Высшая категория", "Врачи высшей категории"),
        ]
        
        for name, desc in specs:
            Specialization.objects.get_or_create(
                name=name,
                defaults={'description': desc}
            )
        
        for name, desc in categories:
            Category.objects.get_or_create(
                name=name,
                defaults={'description': desc}
            )

    def create_sample_users(self):
        # Create doctors
        doctor_data = [
            ("doctor1", "Иван", "Петров", "ivan.petrov@example.com", "Терапия"),
            ("doctor2", "Мария", "Сидорова", "maria.sidorova@example.com", "Кардиология"),
            ("doctor3", "Александр", "Козлов", "alex.kozlov@example.com", "Неврология"),
        ]
        
        for username, first_name, last_name, email, spec_name in doctor_data:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'password': 'password123'
                }
            )
            
            if created:
                user.set_password('password123')
                user.save()
                
                # Set profile role to doctor
                profile = user.profile
                profile.role = 'doctor'
                profile.save()
                
                # Create doctor profile
                specialization = Specialization.objects.get(name=spec_name)
                category = Category.objects.first()
                
                DoctorProfile.objects.create(
                    user=user,
                    specialization=specialization,
                    category=category,
                    license_number=f"LIC-{random.randint(10000, 99999)}",
                    experience_years=random.randint(5, 20),
                    education=f"Медицинский университет, специальность {spec_name}",
                    consultation_price=random.randint(80, 150)
                )
        
        # Create clients
        client_data = [
            ("client1", "Анна", "Иванова", "anna.ivanova@example.com"),
            ("client2", "Петр", "Смирнов", "petr.smirnov@example.com"),
        ]
        
        for username, first_name, last_name, email in client_data:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'password': 'password123'
                }
            )
            
            if created:
                user.set_password('password123')
                user.save()
                
                # Set profile role to client
                profile = user.profile
                profile.role = 'client'
                profile.save()
                
                # Create client profile
                ClientProfile.objects.create(
                    user=user,
                    medical_card_number=f"MC-{random.randint(10000, 99999)}",
                    emergency_contact=f"{first_name} {last_name} (родственник)",
                    emergency_phone=f"+375-29-{random.randint(100, 999)}-{random.randint(10, 99)}-{random.randint(10, 99)}"
                )

    def create_company_data(self):
        # Company info
        company_info, created = CompanyInfo.objects.get_or_create(
            name="Медицинский центр 'Здоровье'",
            defaults={
                'description': 'Современный медицинский центр с полным спектром услуг.',
                'address': 'г. Минск, ул. Примерная, 1',
                'phone': '+375 (17) 123-45-67',
                'email': 'info@medcenter.by',
                'website': 'https://medcenter.by',
                'registration_number': '123456789',
                'tax_number': '987654321',
                'bank_account': '123456789012345678901234567890',
                'bank_name': 'Беларусбанк',
                'certificate_text': 'Лицензия на осуществление медицинской деятельности №12345 от 01.01.2020'
            }
        )
        
        # Company history
        history_data = [
            (2020, "Основание клиники", "Открытие медицинского центра"),
            (2021, "Расширение услуг", "Добавление новых специализаций"),
            (2022, "Модернизация", "Обновление медицинского оборудования"),
            (2023, "Новые технологии", "Внедрение современных методов диагностики"),
        ]
        
        for year, title, desc in history_data:
            CompanyHistory.objects.get_or_create(
                year=year,
                defaults={'title': title, 'description': desc}
            )
        
        # Partners
        partners_data = [
            ("Партнер 1", "https://google.com", "Описание партнера 1"),
            ("Партнер 2", "https://partner2.example.com", "Описание партнера 2"),
        ]
        
        for name, website, desc in partners_data:
            Partner.objects.get_or_create(
                name=name,
                defaults={'website': website, 'description': desc}
            )
        
        # Contacts
        contacts_data = [
            ("Иван", "Иванов", "Иванович", "director", "Главный врач", "+375-29-123-45-67", "director@medcenter.by"),
            ("Мария", "Петрова", "Сергеевна", "administrator", "Администратор", "+375-29-765-43-21", "admin@medcenter.by"),
        ]
        
        for first_name, last_name, middle_name, position, description, phone, email in contacts_data:
            Contact.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'middle_name': middle_name,
                    'position': position,
                    'phone': phone,
                    'description': description
                }
            )
        
        # Vacancies
        vacancy_data = [
            ("Врач-терапевт", "Требуется врач-терапевт", "Высшее медицинское образование", 1500, 2500),
            ("Медсестра", "Требуется медсестра", "Среднее медицинское образование", 800, 1200),
        ]
        
        for title, desc, req, sal_min, sal_max in vacancy_data:
            Vacancy.objects.get_or_create(
                title=title,
                defaults={
                    'description': desc,
                    'requirements': req,
                    'salary_min': sal_min,
                    'salary_max': sal_max,
                    'contact_email': 'hr@medcenter.by'
                }
            )

    def create_news(self):
        # News categories
        categories = [
            ("Новости клиники", "Новости медицинского центра"),
            ("Медицинские новости", "Новости медицины"),
            ("Акции", "Акции и скидки"),
        ]
        
        for name, desc in categories:
            NewsCategory.objects.get_or_create(
                name=name,
                defaults={'description': desc}
            )
        
        # Sample news
        admin_user = User.objects.get(username='admin')
        category = NewsCategory.objects.first()
        
        news_data = [
            ("Открытие нового отделения", "В нашем центре открылось новое отделение диагностики", "Мы рады сообщить об открытии нового отделения..."),
            ("Скидки на услуги", "Специальные скидки для постоянных клиентов", "В течение месяца действуют скидки..."),
            ("Новое оборудование", "Поступление современного медицинского оборудования", "В клинику поступило новое оборудование..."),
        ]
        
        for title, summary, content in news_data:
            News.objects.get_or_create(
                title=title,
                defaults={
                    'summary': summary,
                    'content': content,
                    'category': category,
                    'author': admin_user,
                    'is_published': True,
                    'published_at': timezone.now() - timedelta(days=random.randint(1, 30))
                }
            )

    def create_glossary(self):
        # Glossary categories
        GlossaryCategory.objects.get_or_create(
            name="Медицинские термины",
            defaults={'description': 'Основные медицинские термины'}
        )
        
        category = GlossaryCategory.objects.first()
        
        # Terms
        terms_data = [
            ("Анамнез", "Совокупность сведений о больном и его заболевании"),
            ("Диагноз", "Краткое медицинское заключение о состоянии здоровья"),
            ("Симптом", "Признак заболевания"),
        ]
        
        for term, definition in terms_data:
            GlossaryTerm.objects.get_or_create(
                term=term,
                defaults={'definition': definition, 'category': category}
            )
        
        # FAQ
        faq_data = [
            ("Как записаться на прием?", "Записаться можно по телефону или через сайт"),
            ("Какие документы нужны?", "Паспорт и медицинская карта"),
            ("Есть ли парковка?", "Да, бесплатная парковка для пациентов"),
        ]
        
        for question, answer in faq_data:
            FAQ.objects.get_or_create(
                question=question,
                defaults={'answer': answer, 'category': category}
            )

    def create_promotions(self):
        # Promo codes
        promo_data = [
            ("WELCOME10", "Скидка для новых клиентов", "percentage", 10, 0, None),
            ("SUMMER20", "Летняя акция", "percentage", 20, 100, 100),
        ]
        
        for code, name, discount_type, value, min_amount, max_discount in promo_data:
            PromoCode.objects.get_or_create(
                code=code,
                defaults={
                    'name': name,
                    'discount_type': discount_type,
                    'discount_value': value,
                    'min_order_amount': min_amount,
                    'max_discount_amount': max_discount,
                    'valid_from': timezone.now(),
                    'valid_until': timezone.now() + timedelta(days=90)
                }
            )