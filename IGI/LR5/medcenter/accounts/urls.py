from django.urls import path, include
from .views import (
    ClientRegisterView, DoctorRegisterView, client_cabinet, 
    admin_cabinet, CustomLoginView, ClientLoginView, DoctorLoginView,
    no_access, cabinet_redirect
)

urlpatterns = [
    path('register/client/', ClientRegisterView.as_view(), name='client_register'),
    path('register/doctor/', DoctorRegisterView.as_view(), name='doctor_register'),
    path('cabinet/redirect/', cabinet_redirect, name='cabinet_redirect'),
    path('cabinet/client/', client_cabinet, name='client_cabinet'),
    path('cabinet/admin/', admin_cabinet, name='admin_cabinet'),
    path('login/', CustomLoginView.as_view(), name='account_login'),
    path('login/client/', ClientLoginView.as_view(), name='client_login'),
    path('login/doctor/', DoctorLoginView.as_view(), name='doctor_login'),
    path('no-access/', no_access, name='no_access'),
]