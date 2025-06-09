from django.urls import path
from .views import doctor_cabinet, doctor_detail

urlpatterns = [
    path('cabinet/', doctor_cabinet, name='doctor_cabinet'),
    path('<int:pk>/', doctor_detail, name='doctor_detail'),
]