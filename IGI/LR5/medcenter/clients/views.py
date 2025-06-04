from django.shortcuts import render, get_object_or_404, redirect
from .models import ClientProfile
from django.contrib.auth.decorators import login_required
from appointments.models import Appointment
from services.models import ServiceCategory, Service
from doctors.models import DoctorProfile
import datetime
from django.utils import timezone

def client_detail(request, pk):
    client = get_object_or_404(ClientProfile, pk=pk)
    return render(request, 'clients/client_detail.html', {'client': client})

@login_required
def client_cabinet(request):
    client = getattr(request.user, 'clientprofile', None)
    if not client:
        return render(request, 'no_access.html')
    appointments = Appointment.objects.filter(client=client).order_by('appointment_date')
    return render(request, 'clients/client_cabinet.html', {'appointments': appointments})

def service_list(request):
    categories = ServiceCategory.objects.all()
    selected_category_id = request.GET.get('category')
    services = None
    selected_category = None
    if selected_category_id:
        selected_category = ServiceCategory.objects.filter(id=selected_category_id).first()
        services = Service.objects.filter(category=selected_category)
    return render(request, 'clients/service_list.html', {
        'categories': categories,
        'services': services,
        'selected_category': selected_category,
    })

@login_required
def conform_order(request, doctor_id, service_id, date_str, hour_str):
    doctor = get_object_or_404(DoctorProfile, pk=doctor_id)
    service = get_object_or_404(Service, pk=service_id)
    # hour_str теперь в формате 'HH:MM'
    appointment_date = datetime.datetime.strptime(f"{date_str} {hour_str}", "%Y-%m-%d %H:%M")

    
    if request.method == 'POST':
        Appointment.objects.create(
            client=request.user.clientprofile,
            doctor=doctor,
            service=service,
            appointment_date=appointment_date
        )
        return render(request, 'clients/order_success.html', {'service': service})
    
    return render(request, 'clients/conform_order.html', {
        'doctor': doctor,
        'service': service,
        'appointment_date': appointment_date,
    })


@login_required
def order_service(request, service_id):
    service = get_object_or_404(Service, pk=service_id)
    # Найти всех врачей, оказывающих эту услугу
    doctors = DoctorProfile.objects.filter(services=service)
    # Слоты: будние дни, часы с 9 до 16
    today = timezone.localdate()
    days = [today + datetime.timedelta(days=i) for i in range(7) if (today + datetime.timedelta(days=i)).weekday() < 5]
    hours = [9,10,11,12,13,14,15,16]
    slots = []
    for day in days:
        start_time = datetime.datetime.combine(day, datetime.time(9, 0))
        end_time = datetime.datetime.combine(day, datetime.time(17, 0))
        current_time = start_time
        while current_time + service.duration <= end_time:
            slot_time = current_time
            # Проверяем, есть ли свободный врач на это время
            busy = Appointment.objects.filter(
                appointment_date=slot_time,
                doctor__in=doctors
            ).count()
            free_doctor = doctors.exclude(appointments__appointment_date=slot_time).first()
            slot = {
                'date': day,
                'time': slot_time.time(),
                'start': slot_time.time(),
                'end': (slot_time + service.duration).time(),
                'busy': busy == doctors.count(),
                'free_doctor': free_doctor.id if free_doctor else None,
                'display': f"{slot_time.time().strftime('%H:%M')} - {(slot_time + service.duration).time().strftime('%H:%M')}",
            }
            slots.append(slot)
            current_time += service.duration
    if request.method == 'POST':
        slot = request.POST.get('slot')
        if slot:
            date_str, hour_str, doctor_id = slot.split('|')
            # dt = datetime.datetime.strptime(f"{date_str} {hour_str}", "%Y-%m-%d %H")
            # doctor = DoctorProfile.objects.get(id=doctor_id)
            # Appointment.objects.create(
            #     client=request.user.clientprofile,
            #     doctor=doctor,
            #     service=service,
            #     appointment_date=dt
            # )
            return redirect('confirm_order', doctor_id=doctor_id, service_id=service_id, date_str=date_str, hour_str=hour_str)
            return render(request, 'clients/order_success.html', {'service': service})
    return render(request, 'clients/order_service.html', {
        'service': service,
        'slots': slots,
        'days': days,
        'hours': hours,
    })

