from django.urls import path
from .views import client_detail, client_cabinet


urlpatterns = [
    path('<int:pk>/', client_detail, name='client_detail'),
    path('cabinet/', client_cabinet, name='client_cabinet'),
]