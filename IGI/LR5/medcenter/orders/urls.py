from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.cart_view, name='cart'),
    path('cart/add/<int:service_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/update/<int:item_id>/', views.update_cart_quantity, name='update_cart_quantity'),
    path('checkout/', views.checkout, name='checkout'),
    path('order/<uuid:order_id>/', views.order_detail, name='order_detail'),
    path('order/<uuid:order_id>/success/', views.order_success, name='order_success'),
    path('order/<uuid:order_id>/payment/', views.payment, name='payment'),
]