from django.urls import path
from . import views

urlpatterns = [
    path('faq/', views.faq_list, name='faq_list'),
    path('terms/', views.glossary_list, name='glossary_list'),
    path('terms/<int:pk>/', views.term_detail, name='term_detail'),
]