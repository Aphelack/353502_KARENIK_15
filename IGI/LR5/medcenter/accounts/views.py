from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.urls import reverse
from django.contrib import messages
from allauth.account.views import SignupView, LoginView
from .forms import ClientSignupForm, DoctorSignupForm
from .permissions import client_required, doctor_required, admin_required


class ClientRegisterView(SignupView):
    template_name = 'accounts/client_register.html'
    form_class = ClientSignupForm
    
    def get_success_url(self):
        return reverse('cabinet_redirect')


class DoctorRegisterView(SignupView):
    template_name = 'accounts/doctor_register.html'
    form_class = DoctorSignupForm
    
    def get_success_url(self):
        return reverse('cabinet_redirect')


@client_required
def client_cabinet(request):
    """Client dashboard view."""
    from clients.models import ClientProfile
    from appointments.models import Appointment
    
    # Get client profile
    client_profile = getattr(request.user, 'client_profile', None)
    
    # Get appointments for this client
    appointments = Appointment.objects.filter(client=client_profile).order_by('appointment_date') if client_profile else []
    
    context = {
        'user_profile': request.user.profile,
        'client': client_profile,
        'appointments': appointments,
    }
    return render(request, 'clients/client_cabinet.html', context)


@doctor_required
def doctor_cabinet(request):
    """Doctor dashboard view."""
    from doctors.models import DoctorProfile
    from appointments.models import Appointment
    from services.models import Service
    
    # Get doctor profile
    doctor_profile = getattr(request.user, 'doctor_profile', None)
    
    # Get appointments for this doctor
    appointments = Appointment.objects.filter(doctor=doctor_profile).order_by('appointment_date') if doctor_profile else []
    
    # Get services not yet added to this doctor
    services = Service.objects.exclude(doctors=doctor_profile) if doctor_profile else Service.objects.none()
    
    context = {
        'user_profile': request.user.profile,
        'doctor': doctor_profile,
        'appointments': appointments,
        'available_services': services,
    }
    return render(request, 'doctors/doctor_cabinet.html', context)


@admin_required
def admin_cabinet(request):
    """Admin dashboard view."""
    return render(request, 'accounts/admin_cabinet.html', {
        'user_profile': request.user.profile
    })


class CustomLoginView(LoginView):
    template_name = "account/login.html"

    def get_success_url(self):
        # Always redirect to the cabinet_redirect view which handles role-based routing
        return reverse('cabinet_redirect')


def no_access(request):
    """View for users who don't have access to a page."""
    return render(request, 'no_access.html')


@login_required
def cabinet_redirect(request):
    """Redirect user to appropriate cabinet based on their role."""
    if not hasattr(request.user, 'profile'):
        messages.error(request, 'Профиль не найден. Пожалуйста, обратитесь к администратору.')
        return redirect('home')
    
    profile = request.user.profile
    
    if profile.is_admin or request.user.is_staff:
        return redirect('admin:index')
    elif profile.is_client:
        return redirect('client_cabinet')
    elif profile.is_doctor:
        return redirect('doctor_cabinet')
    else:
        messages.warning(request, 'Роль пользователя не определена.')
        return redirect('home')