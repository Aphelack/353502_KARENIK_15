from django.urls import path
from . import views

urlpatterns = [
    path('info/', views.company_info, name='company_info'),
    path('history/', views.company_history, name='company_history'),
    path('contacts/', views.contacts, name='contacts'),
    path('vacancies/', views.vacancies, name='vacancies'),
    path('vacancies/<int:pk>/', views.vacancy_detail, name='vacancy_detail'),
    path('privacy-policy/', views.privacy_policy, name='privacy_policy'),
]