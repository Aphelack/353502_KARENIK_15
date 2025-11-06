# Generated migration for doctors and clients

from django.db import migrations
from django.contrib.auth.hashers import make_password


def create_users_data(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Profile = apps.get_model('accounts', 'Profile')
    DoctorProfile = apps.get_model('doctors', 'DoctorProfile')
    ClientProfile = apps.get_model('clients', 'ClientProfile')
    Category = apps.get_model('doctors', 'Category')
    Specialization = apps.get_model('doctors', 'Specialization')
    Service = apps.get_model('services', 'Service')
    
    # Create doctor categories
    categories_data = [
        ('Первая категория', 'Врачи первой квалификационной категории'),
        ('Высшая категория', 'Врачи высшей квалификационной категории'),
        ('Без категории', 'Врачи без квалификационной категории'),
    ]
    
    categories = {}
    for name, description in categories_data:
        category, _ = Category.objects.get_or_create(
            name=name,
            defaults={'description': description}
        )
        categories[name] = category
    
    # Create specializations
    specializations_data = [
        ('Терапевт', 'Врач общей практики'),
        ('Кардиолог', 'Специалист по сердечно-сосудистым заболеваниям'),
        ('Невролог', 'Специалист по заболеваниям нервной системы'),
        ('Гастроэнтеролог', 'Специалист по заболеваниям ЖКТ'),
        ('Эндокринолог', 'Специалист по эндокринным заболеваниям'),
    ]
    
    specializations = {}
    for name, description in specializations_data:
        spec, _ = Specialization.objects.get_or_create(
            name=name,
            defaults={'description': description}
        )
        specializations[name] = spec
    
    # Create 10 doctors
    doctors_data = [
        {
            'username': 'ivanov_doctor',
            'email': 'ivanov.doctor@zdravplus.by',
            'first_name': 'Иван',
            'last_name': 'Иванов',
            'specialization': 'Терапевт',
            'category': 'Высшая категория',
            'bio': 'Опыт работы более 15 лет. Специализируется на лечении хронических заболеваний.',
            'education': 'БГМУ, 2005 г. Интернатура по терапии, 2006 г.',
            'experience_years': 18,
            'phone': '+375 29 111-11-11',
        },
        {
            'username': 'petrova_doctor',
            'email': 'petrova.doctor@zdravplus.by',
            'first_name': 'Мария',
            'last_name': 'Петрова',
            'specialization': 'Кардиолог',
            'category': 'Высшая категория',
            'bio': 'Кандидат медицинских наук. Специализируется на диагностике и лечении ишемической болезни сердца.',
            'education': 'БГМУ, 2003 г. Ординатура по кардиологии, 2005 г. Защита диссертации, 2012 г.',
            'experience_years': 20,
            'phone': '+375 29 222-22-22',
        },
        {
            'username': 'sidorov_doctor',
            'email': 'sidorov.doctor@zdravplus.by',
            'first_name': 'Петр',
            'last_name': 'Сидоров',
            'specialization': 'Невролог',
            'category': 'Первая категория',
            'bio': 'Специализируется на лечении головных болей, головокружений и заболеваний позвоночника.',
            'education': 'БГМУ, 2010 г. Ординатура по неврологии, 2012 г.',
            'experience_years': 13,
            'phone': '+375 29 333-33-33',
        },
        {
            'username': 'kozlova_doctor',
            'email': 'kozlova.doctor@zdravplus.by',
            'first_name': 'Елена',
            'last_name': 'Козлова',
            'specialization': 'Гастроэнтеролог',
            'category': 'Высшая категория',
            'bio': 'Опыт работы в гастроэнтерологии более 16 лет. Специализируется на функциональных расстройствах ЖКТ.',
            'education': 'БГМУ, 2007 г. Ординатура по гастроэнтерологии, 2009 г.',
            'experience_years': 16,
            'phone': '+375 29 444-44-44',
        },
        {
            'username': 'nikolaev_doctor',
            'email': 'nikolaev.doctor@zdravplus.by',
            'first_name': 'Александр',
            'last_name': 'Николаев',
            'specialization': 'Эндокринолог',
            'category': 'Первая категория',
            'bio': 'Специализируется на диагностике и лечении заболеваний щитовидной железы и сахарного диабета.',
            'education': 'БГМУ, 2011 г. Ординатура по эндокринологии, 2013 г.',
            'experience_years': 12,
            'phone': '+375 29 555-55-55',
        },
        {
            'username': 'smirnova_doctor',
            'email': 'smirnova.doctor@zdravplus.by',
            'first_name': 'Ольга',
            'last_name': 'Смирнова',
            'specialization': 'Терапевт',
            'category': 'Первая категория',
            'bio': 'Врач общей практики. Принимает пациентов всех возрастов.',
            'education': 'БГМУ, 2012 г. Интернатура по терапии, 2013 г.',
            'experience_years': 11,
            'phone': '+375 29 666-66-66',
        },
        {
            'username': 'volkov_doctor',
            'email': 'volkov.doctor@zdravplus.by',
            'first_name': 'Дмитрий',
            'last_name': 'Волков',
            'specialization': 'Кардиолог',
            'category': 'Первая категория',
            'bio': 'Специализируется на функциональной диагностике сердечно-сосудистой системы.',
            'education': 'БГМУ, 2013 г. Ординатура по кардиологии, 2015 г.',
            'experience_years': 10,
            'phone': '+375 29 777-77-77',
        },
        {
            'username': 'lebedeva_doctor',
            'email': 'lebedeva.doctor@zdravplus.by',
            'first_name': 'Анна',
            'last_name': 'Лебедева',
            'specialization': 'Невролог',
            'category': 'Без категории',
            'bio': 'Молодой специалист с современным подходом к лечению неврологических заболеваний.',
            'education': 'БГМУ, 2018 г. Ординатура по неврологии, 2020 г.',
            'experience_years': 5,
            'phone': '+375 29 888-88-88',
        },
        {
            'username': 'sokolov_doctor',
            'email': 'sokolov.doctor@zdravplus.by',
            'first_name': 'Сергей',
            'last_name': 'Соколов',
            'specialization': 'Гастроэнтеролог',
            'category': 'Без категории',
            'bio': 'Специализируется на эндоскопической диагностике заболеваний ЖКТ.',
            'education': 'БГМУ, 2017 г. Ординатура по гастроэнтерологии, 2019 г.',
            'experience_years': 6,
            'phone': '+375 29 999-99-99',
        },
        {
            'username': 'morozova_doctor',
            'email': 'morozova.doctor@zdravplus.by',
            'first_name': 'Татьяна',
            'last_name': 'Морозова',
            'specialization': 'Эндокринолог',
            'category': 'Без категории',
            'bio': 'Молодой специалист, ведет прием взрослых и детей.',
            'education': 'БГМУ, 2019 г. Ординатура по эндокринологии, 2021 г.',
            'experience_years': 4,
            'phone': '+375 29 000-00-00',
        },
    ]
    
    for doctor_data in doctors_data:
        # Create user
        user = User.objects.create(
            username=doctor_data['username'],
            email=doctor_data['email'],
            first_name=doctor_data['first_name'],
            last_name=doctor_data['last_name'],
            password=make_password('doctor123'),  # Default password
            is_active=True
        )
        
        # Create profile
        profile = Profile.objects.create(
            user=user,
            phone=doctor_data['phone'],
            role='doctor'
        )
        
        # Create doctor profile
        doctor_profile = DoctorProfile.objects.create(
            user=user,
            specialization=specializations[doctor_data['specialization']],
            category=categories[doctor_data['category']],
            education=doctor_data['education'],
            experience_years=doctor_data['experience_years'],
            is_available=True
        )
    
    # Create 3 clients
    clients_data = [
        {
            'username': 'client1',
            'email': 'client1@example.com',
            'first_name': 'Андрей',
            'last_name': 'Васильев',
            'phone': '+375 29 111-00-11',
            'birth_date': '1985-03-15',
            'address': 'г. Минск, ул. Ленина, д. 10, кв. 5',
        },
        {
            'username': 'client2',
            'email': 'client2@example.com',
            'first_name': 'Екатерина',
            'last_name': 'Павлова',
            'phone': '+375 29 222-00-22',
            'birth_date': '1990-07-22',
            'address': 'г. Минск, пр-т Победителей, д. 25, кв. 100',
        },
        {
            'username': 'client3',
            'email': 'client3@example.com',
            'first_name': 'Максим',
            'last_name': 'Орлов',
            'phone': '+375 29 333-00-33',
            'birth_date': '1978-11-08',
            'address': 'г. Минск, ул. Немига, д. 3, кв. 42',
        },
    ]
    
    for client_data in clients_data:
        # Create user
        user = User.objects.create(
            username=client_data['username'],
            email=client_data['email'],
            first_name=client_data['first_name'],
            last_name=client_data['last_name'],
            password=make_password('client123'),  # Default password
            is_active=True
        )
        
        # Create profile
        profile = Profile.objects.create(
            user=user,
            phone=client_data['phone'],
            address=client_data['address'],
            birth_date=client_data['birth_date'],
            role='client'
        )
        
        # Create client profile
        client_profile = ClientProfile.objects.create(
            user=user,
            medical_card_number=f'MC-{user.id:06d}'
        )


def delete_users_data(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    # Delete created users (profiles will be deleted via CASCADE)
    User.objects.filter(username__in=[
        'ivanov_doctor', 'petrova_doctor', 'sidorov_doctor', 'kozlova_doctor',
        'nikolaev_doctor', 'smirnova_doctor', 'volkov_doctor', 'lebedeva_doctor',
        'sokolov_doctor', 'morozova_doctor',
        'client1', 'client2', 'client3'
    ]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('doctors', '0004_alter_category_options_alter_doctorprofile_options_and_more'),
        ('clients', '0002_alter_clientprofile_options_and_more'),
        ('accounts', '0006_alter_profile_options_profile_address_profile_avatar_and_more'),
        ('services', '0003_initial_service_data'),
        ('auth', '__latest__'),
    ]

    operations = [
        migrations.RunPython(create_users_data, delete_users_data),
    ]
