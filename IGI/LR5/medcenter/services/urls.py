from django.urls import path
from . import views

urlpatterns = [
    path('', views.service_list, name='service_list'),
    path('api/', views.service_list_api, name='service_list_api'),
    path('category/<int:category_id>/', views.service_category, name='service_category'),
    path('<int:service_id>/', views.service_detail, name='service_detail'),
]