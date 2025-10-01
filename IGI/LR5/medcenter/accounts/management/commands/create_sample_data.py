from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, date, time, timedelta
from decimal import Decimal

from accounts.models import Profile
from services.models import Service, ServiceCategory
from doctors.models import DoctorProfile, Specialization, Category
from clients.models import ClientProfile
from news.models import News, NewsCategory
from company.models import CompanyInfo
from glossary.models import GlossaryTerm, GlossaryCategory, FAQ
from reviews.models import Review
from promotions.models import PromoCode, Banner
from orders.models import Order, OrderItem


class Command(BaseCommand):
    help = 'Create sample data for the medical center application'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting sample data creation...'))
        
        # Create superuser
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_superuser(
                username='admin',
                email='admin@medcenter.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            Profile.objects.create(
                user=admin,
                role='admin',
                phone='+375291234567'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user'))

        # Create service categories
        categories_data = [
            {'name': 'Диагностика', 'description': 'Диагностические услуги'},
            {'name': 'Консультации', 'description': 'Консультации специалистов'},
            {'name': 'Лабораторные исследования', 'description': 'Анализы и лабораторная диагностика'}
        ]

        categories = []
        for cat_data in categories_data:
            category, created = ServiceCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create services
        services_data = [
            {
                'category': categories[1],  # Консультации
                'name': 'Общий медицинский осмотр',
                'description': 'Комплексное обследование состояния здоровья',
                'price': Decimal('50.00'),
                'duration': timedelta(hours=1)
            },
            {
                'category': categories[1],  # Консультации
                'name': 'Кардиологическое обследование',
                'description': 'Полное обследование сердечно-сосудистой системы',
                'price': Decimal('80.00'),
                'duration': timedelta(minutes=45)
            },
            {
                'category': categories[0],  # Диагностика
                'name': 'УЗИ диагностика',
                'description': 'Ультразвуковое исследование внутренних органов',
                'price': Decimal('40.00'),
                'duration': timedelta(minutes=30)
            },
            {
                'category': categories[2],  # Лабораторные исследования
                'name': 'Лабораторные анализы',
                'description': 'Общий и биохимический анализ крови',
                'price': Decimal('25.00'),
                'duration': timedelta(minutes=15)
            },
            {
                'category': categories[1],  # Консультации
                'name': 'Консультация эндокринолога',
                'description': 'Диагностика и лечение эндокринных заболеваний',
                'price': Decimal('70.00'),
                'duration': timedelta(minutes=40)
            }
        ]

        services = []
        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                name=service_data['name'],
                defaults=service_data
            )
            services.append(service)
            if created:
                self.stdout.write(f'Created service: {service.name}')

        # Create specializations
        specializations_data = [
            {'name': 'Кардиолог', 'description': 'Специалист по сердечно-сосудистым заболеваниям'},
            {'name': 'Эндокринолог', 'description': 'Специалист по эндокринным заболеваниям'},
            {'name': 'УЗИ-диагност', 'description': 'Специалист по ультразвуковой диагностике'}
        ]

        specializations = []
        for spec_data in specializations_data:
            specialization, created = Specialization.objects.get_or_create(
                name=spec_data['name'],
                defaults=spec_data
            )
            specializations.append(specialization)
            if created:
                self.stdout.write(f'Created specialization: {specialization.name}')

        # Create doctor categories
        doctor_categories_data = [
            {'name': 'Первая категория', 'description': 'Врач первой категории'},
            {'name': 'Высшая категория', 'description': 'Врач высшей категории'}
        ]

        doctor_categories = []
        for cat_data in doctor_categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            doctor_categories.append(category)
            if created:
                self.stdout.write(f'Created doctor category: {category.name}')

        # Create doctors
        doctors_data = [
            {
                'user': {
                    'username': 'dr_smith',
                    'email': 'smith@medcenter.com',
                    'password': 'doctor123',
                    'first_name': 'Джон',
                    'last_name': 'Смит'
                },
                'profile': {
                    'phone': '+375291234568',
                    'role': 'doctor'
                },
                'doctor_profile': {
                    'specialization': specializations[0],  # Кардиолог
                    'category': doctor_categories[1],  # Высшая категория
                    'experience_years': 15,
                    'education': 'Белорусский государственный медицинский университет',
                    'achievements': 'Опытный кардиолог с 15-летним стажем работы.',
                    'work_start': time(9, 0),
                    'work_end': time(17, 0),
                    'consultation_price': Decimal('80.00'),
                    'license_number': 'LIC001',
                    'services': [1, 2]  # Will be set after creation
                }
            },
            {
                'user': {
                    'username': 'dr_johnson',
                    'email': 'johnson@medcenter.com',
                    'password': 'doctor123',
                    'first_name': 'Мария',
                    'last_name': 'Джонсон'
                },
                'profile': {
                    'phone': '+375291234569',
                    'role': 'doctor'
                },
                'doctor_profile': {
                    'specialization': specializations[1],  # Эндокринолог
                    'category': doctor_categories[0],  # Первая категория
                    'experience_years': 12,
                    'education': 'Витебский государственный медицинский университет',
                    'achievements': 'Специалист по диагностике и лечению эндокринных заболеваний.',
                    'work_start': time(8, 0),
                    'work_end': time(16, 0),
                    'consultation_price': Decimal('70.00'),
                    'license_number': 'LIC002',
                    'services': [0, 4]  # Will be set after creation
                }
            },
            {
                'user': {
                    'username': 'dr_brown',
                    'email': 'brown@medcenter.com',
                    'password': 'doctor123',
                    'first_name': 'Анна',
                    'last_name': 'Браун'
                },
                'profile': {
                    'phone': '+375291234570',
                    'role': 'doctor'
                },
                'doctor_profile': {
                    'specialization': specializations[2],  # УЗИ-диагност
                    'category': doctor_categories[0],  # Первая категория
                    'experience_years': 8,
                    'education': 'Гродненский государственный медицинский университет',
                    'achievements': 'Специалист по ультразвуковой диагностике.',
                    'work_start': time(10, 0),
                    'work_end': time(18, 0),
                    'consultation_price': Decimal('60.00'),
                    'license_number': 'LIC003',
                    'services': [2, 3]  # Will be set after creation
                }
            }
        ]

        doctors = []
        for doctor_data in doctors_data:
            # Create user
            user, created = User.objects.get_or_create(
                username=doctor_data['user']['username'],
                defaults={
                    'email': doctor_data['user']['email'],
                    'first_name': doctor_data['user']['first_name'],
                    'last_name': doctor_data['user']['last_name']
                }
            )
            if created:
                user.set_password(doctor_data['user']['password'])
                user.save()
                self.stdout.write(f'Created doctor user: {user.username}')

            # Create profile
            profile, created = Profile.objects.get_or_create(
                user=user,
                defaults=doctor_data['profile']
            )

            # Create doctor profile
            doctor_profile, created = DoctorProfile.objects.get_or_create(
                user=user,
                defaults={
                    'specialization': doctor_data['doctor_profile']['specialization'],
                    'category': doctor_data['doctor_profile']['category'],
                    'experience_years': doctor_data['doctor_profile']['experience_years'],
                    'education': doctor_data['doctor_profile']['education'],
                    'achievements': doctor_data['doctor_profile']['achievements'],
                    'work_start': doctor_data['doctor_profile']['work_start'],
                    'work_end': doctor_data['doctor_profile']['work_end'],
                    'consultation_price': doctor_data['doctor_profile']['consultation_price'],
                    'license_number': doctor_data['doctor_profile']['license_number']
                }
            )
            
            if created:
                # Add services
                service_indices = doctor_data['doctor_profile']['services']
                for index in service_indices:
                    if index < len(services):
                        doctor_profile.services.add(services[index])
                
                self.stdout.write(f'Created doctor profile: {doctor_profile.specialization.name}')
            
            doctors.append(doctor_profile)

        # Create clients
        clients_data = [
            {
                'user': {
                    'username': 'client1',
                    'email': 'client1@example.com',
                    'password': 'client123',
                    'first_name': 'Иван',
                    'last_name': 'Петров'
                },
                'profile': {
                    'phone': '+375291234571',
                    'role': 'client'
                },
                'client': {
                    'emergency_contact': 'Петрова Анна',
                    'emergency_phone': '+375291234572',
                    'allergies': 'Нет известных аллергий',
                    'medical_history': 'Общее состояние здоровья хорошее'
                }
            },
            {
                'user': {
                    'username': 'client2',
                    'email': 'client2@example.com',
                    'password': 'client123',
                    'first_name': 'Мария',
                    'last_name': 'Иванова'
                },
                'profile': {
                    'phone': '+375291234573',
                    'role': 'client'
                },
                'client': {
                    'emergency_contact': 'Иванов Петр',
                    'emergency_phone': '+375291234574',
                    'allergies': 'Аллергия на пенициллин',
                    'medical_history': 'Перенесенные заболевания: ОРВИ'
                }
            }
        ]

        clients = []
        for client_data in clients_data:
            # Create user
            user, created = User.objects.get_or_create(
                username=client_data['user']['username'],
                defaults={
                    'email': client_data['user']['email'],
                    'first_name': client_data['user']['first_name'],
                    'last_name': client_data['user']['last_name']
                }
            )
            if created:
                user.set_password(client_data['user']['password'])
                user.save()
                self.stdout.write(f'Created client user: {user.username}')

            # Create profile
            profile, created = Profile.objects.get_or_create(
                user=user,
                defaults=client_data['profile']
            )

            # Create client profile
            client, created = ClientProfile.objects.get_or_create(
                user=user,
                defaults=client_data['client']
            )
            
            if created:
                self.stdout.write(f'Created client: {client.user.get_full_name()}')
            
            clients.append(client)

        # Create news categories
        news_categories_data = [
            {'name': 'Медицинские новости', 'description': 'Последние новости в области медицины'},
            {'name': 'Акции и скидки', 'description': 'Специальные предложения и акции'},
            {'name': 'События центра', 'description': 'Новости и события медицинского центра'}
        ]

        news_categories = []
        for category_data in news_categories_data:
            category, created = NewsCategory.objects.get_or_create(
                name=category_data['name'],
                defaults=category_data
            )
            news_categories.append(category)
            if created:
                self.stdout.write(f'Created news category: {category.name}')

        # Create news articles
        news_data = [
            {
                'title': 'Новое оборудование для диагностики',
                'slug': 'novoe-oborudovanie-dlya-diagnostiki',
                'content': '''Мы рады сообщить о поступлении современного диагностического оборудования 
                в наш медицинский центр. Новые аппараты позволят проводить более точную и быструю 
                диагностику различных заболеваний.''',
                'category': news_categories[2],
                'is_published': True,
                'featured': True
            },
            {
                'title': 'Скидка 20% на комплексное обследование',
                'slug': 'skidka-20-na-kompleksnoe-obsledovanie',
                'content': '''В течение месяца действует специальная акция - скидка 20% на комплексное 
                медицинское обследование. Акция действует для всех пациентов при предварительной записи.''',
                'category': news_categories[1],
                'is_published': True,
                'featured': False
            },
            {
                'title': 'Важность регулярных медицинских осмотров',
                'slug': 'vazhnost-regulyarnyh-medicinskih-osmotrov',
                'content': '''Регулярные медицинские осмотры являются ключом к поддержанию здоровья. 
                Раннее выявление заболеваний позволяет проводить более эффективное лечение.''',
                'category': news_categories[0],
                'is_published': True,
                'featured': False
            }
        ]

        for news_item in news_data:
            article, created = News.objects.update_or_create(
                slug=news_item['slug'],
                defaults={
                    'title': news_item['title'],
                    'summary': news_item['content'][:250] + '...',
                    'content': news_item['content'],
                    'category': news_item['category'],
                    'author': User.objects.get(username='admin'),
                    'is_published': news_item['is_published'],
                    'is_featured': news_item['featured']
                }
            )
            if created:
                self.stdout.write(f'Created news article: {article.title}')

        # Create company info
        company_info, created = CompanyInfo.objects.get_or_create(
            defaults={
                'name': 'Медицинский центр "Здоровье+"',
                'description': '''Современный медицинский центр, предоставляющий широкий спектр 
                медицинских услуг. Наша команда опытных специалистов использует передовые 
                технологии для диагностики и лечения.''',
                'phone': '+375 17 123-45-67',
                'email': 'info@medcenter.com',
                'address': 'ул. Медицинская, 15, Минск, Беларусь',
                'registration_number': '123456789',
                'tax_number': '987654321',
                'bank_account': '1234567890123456789',
                'bank_name': 'ОАО "Белинвестбанк"',
                'certificate_text': 'Медицинский центр сертифицирован в соответствии с государственными стандартами.'
            }
        )
        if created:
            self.stdout.write('Created company info')

        # Create FAQ
        faq_data = [
            {
                'question': 'Как записаться на прием?',
                'answer': '''Вы можете записаться на прием через наш сайт, позвонив по телефону 
                +375 17 123-45-67 или обратившись в регистратуру медицинского центра.'''
            },
            {
                'question': 'Какие документы нужны для приема?',
                'answer': '''Для первичного приема необходим паспорт. Если у вас есть медицинская 
                карта или результаты предыдущих обследований, рекомендуем взять их с собой.'''
            },
            {
                'question': 'Можно ли отменить или перенести запись?',
                'answer': '''Да, вы можете отменить или перенести запись не позднее чем за 24 часа 
                до назначенного времени, связавшись с нами по телефону.'''
            }
        ]

        for faq_item in faq_data:
            faq, created = FAQ.objects.get_or_create(
                question=faq_item['question'],
                defaults={'answer': faq_item['answer']}
            )
            if created:
                self.stdout.write(f'Created FAQ: {faq.question}')

        # Create glossary categories
        glossary_categories_data = [
            {'name': 'Диагностика', 'description': 'Медицинские термины по диагностике'},
            {'name': 'Специализации', 'description': 'Медицинские специализации и направления'},
            {'name': 'Общие термины', 'description': 'Общие медицинские термины'}
        ]

        glossary_categories = []
        for cat_data in glossary_categories_data:
            category, created = GlossaryCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            glossary_categories.append(category)
            if created:
                self.stdout.write(f'Created glossary category: {category.name}')

        # Create glossary terms
        glossary_data = [
            {
                'term': 'УЗИ',
                'definition': '''Ультразвуковое исследование - метод диагностики, использующий 
                ультразвуковые волны для создания изображения внутренних органов.''',
                'category': glossary_categories[0]  # Диагностика
            },
            {
                'term': 'ЭКГ',
                'definition': '''Электрокардиография - метод регистрации электрической активности 
                сердца для диагностики сердечно-сосудистых заболеваний.''',
                'category': glossary_categories[0]  # Диагностика
            },
            {
                'term': 'Эндокринология',
                'definition': '''Раздел медицины, изучающий строение, функции и заболевания 
                эндокринных желез и гормональной системы организма.''',
                'category': glossary_categories[1]  # Специализации
            }
        ]

        for term_data in glossary_data:
            term, created = GlossaryTerm.objects.get_or_create(
                term=term_data['term'],
                defaults={
                    'definition': term_data['definition'],
                    'category': term_data['category']
                }
            )
            if created:
                self.stdout.write(f'Created glossary term: {term.term}')

        # Create reviews
        if clients and doctors:
            reviews_data = [
                {
                    'user': clients[0].user,
                    'doctor': doctors[0],
                    'service': services[1],
                    'rating': 5,
                    'text': '''Отличный врач! Очень внимательно отнесся к моим жалобам, 
                    провел тщательное обследование. Рекомендую!''',
                    'is_published': True
                },
                {
                    'user': clients[1].user,
                    'doctor': doctors[1],
                    'service': services[4],
                    'rating': 4,
                    'text': '''Хороший специалист, понятно объяснил результаты анализов и 
                    назначил эффективное лечение.''',
                    'is_published': True
                }
            ]

            for review_data in reviews_data:
                review, created = Review.objects.get_or_create(
                    user=review_data['user'],
                    doctor=review_data['doctor'],
                    defaults={
                        'service': review_data['service'],
                        'rating': review_data['rating'],
                        'text': review_data['text'],
                        'is_published': review_data['is_published']
                    }
                )
                if created:
                    self.stdout.write(f'Created review from {review.user.get_full_name()}')

        # Create promo codes
        promo_codes_data = [
            {
                'code': 'SENIOR15',
                'name': 'Скидка для пенсионеров',
                'description': '''Специальная скидка 15% на все медицинские услуги 
                для пенсионеров при предъявлении соответствующих документов.''',
                'discount_type': 'percentage',
                'discount_value': Decimal('15.00'),
                'min_order_amount': Decimal('50.00'),
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=90),
                'is_active': True
            },
            {
                'code': 'CHECKUP20',
                'name': 'Комплексное обследование со скидкой',
                'description': '''При прохождении комплексного обследования скидка 20% 
                на все дополнительные услуги.''',
                'discount_type': 'percentage',
                'discount_value': Decimal('20.00'),
                'min_order_amount': Decimal('100.00'),
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=30),
                'is_active': True
            }
        ]

        for promo_data in promo_codes_data:
            promo_code, created = PromoCode.objects.get_or_create(
                code=promo_data['code'],
                defaults=promo_data
            )
            if created:
                self.stdout.write(f'Created promo code: {promo_code.code}')

        # Create banners
        banners_data = [
            {
                'title': 'Добро пожаловать в медицинский центр "Здоровье+"',
                'subtitle': 'Качественная медицинская помощь для всей семьи',
                'is_active': True,
                'order': 1
            },
            {
                'title': 'Скидка 20% на первое посещение',
                'subtitle': 'Для новых пациентов действует специальное предложение',
                'link_text': 'Записаться',
                'is_active': True,
                'order': 2
            }
        ]

        for banner_data in banners_data:
            banner, created = Banner.objects.get_or_create(
                title=banner_data['title'],
                defaults=banner_data
            )
            if created:
                self.stdout.write(f'Created banner: {banner.title}')

        # Create sample orders
        if clients and services:
            order_data = [
                {
                    'user': clients[0].user,
                    'status': 'pending',
                    'items': [
                        {'service': services[0], 'quantity': 1},
                        {'service': services[2], 'quantity': 1}
                    ]
                },
                {
                    'user': clients[1].user,
                    'status': 'completed',
                    'items': [
                        {'service': services[1], 'quantity': 1}
                    ]
                }
            ]

            for order_info in order_data:
                order, created = Order.objects.get_or_create(
                    user=order_info['user'],
                    status=order_info['status'],
                    defaults={'notes': 'Sample order created by management command'}
                )
                
                if created:
                    for item_data in order_info['items']:
                        item, item_created = OrderItem.objects.get_or_create(
                            order=order,
                            service=item_data['service'],
                            defaults={
                                'quantity': item_data['quantity'],
                                'price': item_data['service'].price
                            }
                        )
                    
                    order.calculate_total()
                    
                    self.stdout.write(f'Created order for {order.user.get_full_name()}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created all sample data!')
        )
        self.stdout.write('\nCreated accounts:')
        self.stdout.write('- Admin: admin / admin123')
        self.stdout.write('- Doctors: dr_smith, dr_johnson, dr_brown / doctor123')
        self.stdout.write('- Clients: client1, client2 / client123')