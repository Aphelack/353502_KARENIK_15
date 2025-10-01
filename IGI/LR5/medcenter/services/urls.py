from django.urls import path
from . import views

urlpatterns = [
    path('', views.service_list, name='service_list'),
    path('category/<int:category_id>/', views.service_category, name='service_category'),
    path('<int:service_id>/', views.service_detail, name='service_detail'),
]