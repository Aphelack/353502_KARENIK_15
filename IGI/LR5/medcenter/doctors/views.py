from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from appointments.models import Appointment
from services.models import Service
from .models import DoctorProfile

@login_required
def doctor_cabinet(request):
    doctor = getattr(request.user, 'doctorprofile', None)
    if not doctor:
        return render(request, 'doctors/no_access.html')
    appointments = Appointment.objects.filter(doctor=doctor).order_by('appointment_date')
    services = Service.objects.exclude(doctors=doctor)  # услуги, которые ещё не добавлены врачу

    # Добавление услуги
    if request.method == 'POST':
        service_id = request.POST.get('service_id')
        if service_id:
            service = Service.objects.get(pk=service_id)
            doctor.services.add(service)
            return redirect('doctor_cabinet')

    return render(request, 'doctors/doctor_cabinet.html', {
        'appointments': appointments,
        'doctor': doctor,
        'available_services': services,
    })

def doctor_detail(request, pk):
    doctor = get_object_or_404(DoctorProfile, pk=pk)
    return render(request, 'doctors/doctor_detail.html', {'doctor': doctor})



