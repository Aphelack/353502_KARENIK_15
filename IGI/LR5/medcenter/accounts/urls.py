from django.urls import path, include
from .views import (
    ClientRegisterView, DoctorRegisterView, client_cabinet, doctor_cabinet, 
    admin_cabinet, CustomLoginView, no_access, cabinet_redirect
)

urlpatterns = [
    path('register/client/', ClientRegisterView.as_view(), name='client_register'),
    path('register/doctor/', DoctorRegisterView.as_view(), name='doctor_register'),
    path('cabinet/redirect/', cabinet_redirect, name='cabinet_redirect'),
    path('cabinet/client/', client_cabinet, name='client_cabinet'),
    path('cabinet/doctor/', doctor_cabinet, name='doctor_cabinet'),
    path('cabinet/admin/', admin_cabinet, name='admin_cabinet'),
    path('login/', CustomLoginView.as_view(), name='account_login'),
    path('no-access/', no_access, name='no_access'),
    path('doctor/', include('doctors.urls')),
]