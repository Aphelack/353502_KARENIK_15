# Migration to link doctors to their services based on specialization

from django.db import migrations


def link_doctors_to_services(apps, schema_editor):
    DoctorProfile = apps.get_model('doctors', 'DoctorProfile')
    Service = apps.get_model('services', 'Service')
    
    # Mapping of specializations to service names
    specialization_to_services = {
        'Терапевт': ['Первичный прием терапевта', 'Повторный прием терапевта', 'Вызов терапевта на дом'],
        'Кардиолог': ['Прием кардиолога', 'ЭКГ', 'Холтер-мониторинг', 'УЗИ сердца'],
        'Невролог': ['Прием невролога', 'Электроэнцефалография'],
        'Гастроэнтеролог': ['Прием гастроэнтеролога', 'ФГДС', 'УЗИ органов брюшной полости'],
        'Эндокринолог': ['Прием эндокринолога', 'УЗИ щитовидной железы'],
    }
    
    for doctor in DoctorProfile.objects.all():
        if doctor.specialization and doctor.specialization.name in specialization_to_services:
            service_names = specialization_to_services[doctor.specialization.name]
            services = Service.objects.filter(name__in=service_names)
            doctor.services.set(services)


def unlink_doctors_from_services(apps, schema_editor):
    DoctorProfile = apps.get_model('doctors', 'DoctorProfile')
    for doctor in DoctorProfile.objects.all():
        doctor.services.clear()


class Migration(migrations.Migration):

    dependencies = [
        ('doctors', '0005_create_doctors_and_clients'),
        ('services', '0003_initial_service_data'),
    ]

    operations = [
        migrations.RunPython(link_doctors_to_services, unlink_doctors_from_services),
    ]
