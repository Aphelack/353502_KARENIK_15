# Generated migration for company data

from django.db import migrations
from django.utils import timezone


def create_company_data(apps, schema_editor):
    CompanyInfo = apps.get_model('company', 'CompanyInfo')
    CompanyHistory = apps.get_model('company', 'CompanyHistory')
    Partner = apps.get_model('company', 'Partner')
    Contact = apps.get_model('company', 'Contact')
    Vacancy = apps.get_model('company', 'Vacancy')
    
    # Create company info
    CompanyInfo.objects.create(
        name='Медицинский центр "Здоровье+"',
        description='''Наш медицинский центр работает с 2010 года, предоставляя качественные медицинские услуги жителям города и области. 
        
Мы специализируемся на диагностике, лечении и профилактике широкого спектра заболеваний. В нашем центре работают высококвалифицированные специалисты с многолетним опытом.

Наша миссия - обеспечить доступную и качественную медицинскую помощь для каждого пациента, используя современное оборудование и передовые методики лечения.''',
        address='г. Минск, ул. Медицинская, д. 15',
        phone='+375 (17) 345-67-89',
        email='info@zdravplus.by',
        website='https://zdravplus.by',
        registration_number='987654321',
        tax_number='123456789',
        bank_account='BY12 3456 7890 1234 5678 9012',
        bank_name='ОАО "БелВЭБ"',
        certificate_text='''Настоящий сертификат подтверждает, что медицинский центр "Здоровье+" соответствует требованиям международного стандарта ISO 9001:2015 в области предоставления медицинских услуг населению.'''
    )
    
    # Create company history
    history_data = [
        (2010, 'Основание медицинского центра', 'Открытие первого филиала в центре города с командой из 5 врачей'),
        (2012, 'Расширение спектра услуг', 'Открытие отделения функциональной диагностики, приобретение современного УЗИ-оборудования'),
        (2015, 'Открытие второго филиала', 'Расширение географии присутствия, увеличение штата до 15 специалистов'),
        (2018, 'Внедрение электронной записи', 'Запуск онлайн-платформы для записи на прием и получения результатов анализов'),
        (2020, 'Модернизация оборудования', 'Обновление парка медицинского оборудования, внедрение телемедицины'),
        (2023, 'Сертификация ISO', 'Получение международного сертификата качества ISO 9001:2015'),
    ]
    
    for year, title, description in history_data:
        CompanyHistory.objects.create(
            year=year,
            title=title,
            description=description
        )
    
    # Create partners
    partners_data = [
        ('Медтехника Плюс', 'https://medtechplus.example.com', 'Поставщик медицинского оборудования'),
        ('Лаборатория "БиоАнализ"', 'https://bioanalysis.example.com', 'Партнер по лабораторным исследованиям'),
        ('Фармацевтическая компания "Здоровье"', 'https://pharma-health.example.com', 'Поставщик лекарственных препаратов'),
        ('Страховая компания "МедГарант"', 'https://medgarant.example.com', 'Партнер по медицинскому страхованию'),
        ('Клиника "Семейный доктор"', 'https://family-doctor.example.com', 'Партнерская клиника'),
    ]
    
    for name, website, description in partners_data:
        Partner.objects.create(
            name=name,
            website=website,
            description=description,
            is_active=True
        )
    
    # Create contacts
    contacts_data = [
        ('Иванов', 'Иван', 'Иванович', 'director', 'Главный врач, терапевт высшей категории', 
         '+375 (17) 345-67-89', 'ivanov@zdravplus.by'),
        ('Петрова', 'Мария', 'Сергеевна', 'doctor', 'Врач-кардиолог, кандидат медицинских наук',
         '+375 (17) 345-67-90', 'petrova@zdravplus.by'),
        ('Сидоров', 'Петр', 'Александрович', 'doctor', 'Врач-невролог',
         '+375 (17) 345-67-91', 'sidorov@zdravplus.by'),
        ('Козлова', 'Елена', 'Викторовна', 'administrator', 'Администратор регистратуры',
         '+375 (17) 345-67-92', 'reception@zdravplus.by'),
        ('Николаева', 'Ольга', 'Ивановна', 'manager', 'Менеджер по работе с клиентами',
         '+375 (17) 345-67-93', 'nikolaeva@zdravplus.by'),
    ]
    
    for last_name, first_name, middle_name, position, description, phone, email in contacts_data:
        Contact.objects.create(
            first_name=first_name,
            last_name=last_name,
            middle_name=middle_name,
            position=position,
            description=description,
            phone=phone,
            email=email,
            is_public=True
        )
    
    # Create vacancies
    vacancies_data = [
        ('Врач-терапевт', '''В медицинский центр требуется врач-терапевт.''', 
         '''Требования:
• Высшее медицинское образование
• Сертификат специалиста по терапии
• Опыт работы от 3 лет
• Ответственность, коммуникабельность

Обязанности:
• Прием и консультирование пациентов
• Постановка диагноза
• Назначение лечения''',
         1500.00, 2500.00, 'hr@zdravplus.by', '+375 (17) 345-67-99'),
        
        ('Медсестра', '''Приглашаем на работу медсестру.''',
         '''Требования:
• Среднее медицинское образование
• Опыт работы приветствуется
• Аккуратность, внимательность

Обязанности:
• Выполнение медицинских процедур
• Помощь врачу на приеме
• Ведение документации''',
         800.00, 1200.00, 'hr@zdravplus.by', '+375 (17) 345-67-99'),
        
        ('Администратор регистратуры', '''Открыта вакансия администратора.''',
         '''Требования:
• Среднее специальное или высшее образование
• Опыт работы с клиентами
• Знание ПК
• Грамотная речь

Обязанности:
• Запись пациентов на прием
• Работа с документами
• Консультирование по телефону''',
         700.00, 1000.00, 'hr@zdravplus.by', '+375 (17) 345-67-99'),
    ]
    
    for title, description, requirements, salary_min, salary_max, email, phone in vacancies_data:
        Vacancy.objects.create(
            title=title,
            description=description,
            requirements=requirements,
            salary_min=salary_min,
            salary_max=salary_max,
            contact_email=email,
            contact_phone=phone,
            is_active=True
        )


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_alter_partner_logo'),
    ]

    operations = [
        migrations.RunPython(create_company_data),
    ]
