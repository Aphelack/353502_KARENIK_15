from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from appointments.models import Appointment
from django.shortcuts import render, get_object_or_404
from .models import DoctorProfile

@login_required
def doctor_cabinet(request):
    doctor = getattr(request.user, 'doctorprofile', None)
    if not doctor:
        return render(request, 'no_access.html')
    appointments = Appointment.objects.filter(doctor=doctor).order_by('appointment_date')
    return render(request, 'doctors/doctor_cabinet.html', {'appointments': appointments})

def doctor_detail(request, pk):
    doctor = get_object_or_404(DoctorProfile, pk=pk)
    return render(request, 'doctors/doctor_detail.html', {'doctor': doctor})



