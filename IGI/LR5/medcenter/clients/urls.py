from django.urls import path
from .views import client_detail, client_cabinet, service_list, order_service, conform_order

urlpatterns = [
    path('cabinet/', client_cabinet, name='client_cabinet'),
    path('<int:pk>/', client_detail, name='client_detail'),
    path('services/', service_list, name='service_list'),
    path('order/<int:service_id>/', order_service, name='order_service'),
    path('confirm/<int:doctor_id>/<int:service_id>/<str:date_str>/<str:hour_str>/', conform_order, name='confirm_order'),
]