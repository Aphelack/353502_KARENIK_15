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
        return reverse('client_cabinet')


class DoctorRegisterView(SignupView):
    template_name = 'accounts/doctor_register.html'
    form_class = DoctorSignupForm
    
    def get_success_url(self):
        return reverse('doctor_cabinet')


@client_required
def client_cabinet(request):
    """Client dashboard view."""
    return render(request, 'clients/client_cabinet.html', {
        'user_profile': request.user.profile
    })


@doctor_required
def doctor_cabinet(request):
    """Doctor dashboard view."""
    return render(request, 'doctors/doctor_cabinet.html', {
        'user_profile': request.user.profile
    })


@admin_required
def admin_cabinet(request):
    """Admin dashboard view."""
    return render(request, 'accounts/admin_cabinet.html', {
        'user_profile': request.user.profile
    })


class CustomLoginView(LoginView):
    template_name = "account/login.html"

    def get_success_url(self):
        user = self.request.user
        if user.is_staff or (hasattr(user, 'profile') and user.profile.is_admin):
            return reverse('admin:index')
        
        if hasattr(user, 'profile'):
            if user.profile.is_client:
                return reverse('client_cabinet')
            elif user.profile.is_doctor:
                return reverse('doctor_cabinet')
        
        return super().get_success_url()


def no_access(request):
    """View for users who don't have access to a page."""
    return render(request, 'no_access.html')