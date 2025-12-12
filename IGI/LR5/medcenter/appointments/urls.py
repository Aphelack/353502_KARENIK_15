from django.urls import path
from . import views

urlpatterns = [
    path('', views.appointment_list, name='appointment_list'),
    path('create/', views.create_appointment, name='create_appointment'),
    path('<int:appointment_id>/', views.appointment_detail, name='appointment_detail'),
    path('<int:appointment_id>/edit/', views.edit_appointment, name='edit_appointment'),
    path('<int:appointment_id>/cancel/', views.cancel_appointment, name='cancel_appointment'),
]