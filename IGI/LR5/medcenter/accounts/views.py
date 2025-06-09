from django.shortcuts import render
from allauth.account.views import SignupView, LoginView
from .forms import ClientSignupForm, DoctorSignupForm
from django.contrib.admin.views.decorators import staff_member_required
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

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

@login_required
def client_cabinet(request):
    if not hasattr(request.user, 'profile') or request.user.profile.role != 'client':
        return redirect('account_login')
    return render(request, 'accounts/client_cabinet.html')

@login_required
def doctor_cabinet(request):
    if not hasattr(request.user, 'profile') or request.user.profile.role != 'doctor':
        return redirect('account_login')
    return render(request, 'accounts/doctor_cabinet.html')

@staff_member_required
def admin_cabinet(request):
    return render(request, 'accounts/admin_cabinet.html')

class CustomLoginView(LoginView):
    template_name = "account/login.html"

    def get_success_url(self):

        user = self.request.user
        if user.is_staff:
            return reverse('admin:index')
        if hasattr(user, 'profile'):
            if user.profile.role == 'client':
                return reverse('client_cabinet')
            elif user.profile.role == 'doctor':
                return reverse('doctor_cabinet')
        return super().get_success_url()