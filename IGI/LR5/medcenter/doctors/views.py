from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from appointments.models import Appointment
from services.models import Service
from .models import DoctorProfile

@login_required
def doctor_cabinet(request):
    # Check if user has doctor role
    user_profile = getattr(request.user, 'profile', None)
    if not user_profile or user_profile.role != 'doctor':
        return render(request, 'no_access.html')
    
    # Get or create DoctorProfile
    doctor, created = DoctorProfile.objects.get_or_create(user=request.user)
    
    # Добавление услуги
    if request.method == 'POST':
        service_id = request.POST.get('service_id')
        print(f"POST received - service_id: {service_id}")  # Debug
        if service_id:
            try:
                service = Service.objects.get(pk=service_id)
                print(f"Adding service: {service.name} to doctor: {doctor}")  # Debug
                doctor.services.add(service)
                print(f"Services count after add: {doctor.services.count()}")  # Debug
            except Service.DoesNotExist:
                print("Service not found!")  # Debug
            return redirect('doctor_cabinet')
    
    appointments = Appointment.objects.filter(doctor=doctor).order_by('appointment_date')
    services = Service.objects.exclude(doctors=doctor)  # услуги, которые ещё не добавлены врачу

    return render(request, 'doctors/doctor_cabinet.html', {
        'appointments': appointments,
        'doctor': doctor,
        'available_services': services,
        'user_profile': user_profile,
    })

def doctor_detail(request, pk):
    doctor = get_object_or_404(DoctorProfile, pk=pk)
    return render(request, 'doctors/doctor_detail.html', {'doctor': doctor})



