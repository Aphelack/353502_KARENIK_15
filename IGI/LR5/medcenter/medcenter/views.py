from django.shortcuts import render
from services.models import ServiceCategory

def home(request):
    categories = ServiceCategory.objects.prefetch_related('services').all()
    return render(request, 'home.html', {'categories': categories})


def client_auth(request):
    return render(request, 'client_auth.html')

def doctor_auth(request):
    return render(request, 'doctor_auth.html')