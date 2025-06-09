from django.urls import path
from . import views

urlpatterns = [
    path('', views.stats_list, name='stats_list'),
]