from django.shortcuts import render
from django.http import JsonResponse
from services.models import ServiceCategory
from news.models import News
from company.models import Partner
from promotions.models import Banner
import requests


def home(request):
    """Enhanced homepage with banners, services, news, and partners."""
    context = {
        'categories': ServiceCategory.objects.prefetch_related('services').all()[:6],
        'banners': Banner.objects.filter(is_active=True).order_by('order')[:5],
        'latest_news': News.objects.filter(is_published=True).select_related('author', 'category').order_by('-published_at')[:3],
        'partners': Partner.objects.filter(is_active=True).order_by('name')[:8],
    }
    
    # Add joke and quote from external APIs
    try:
        # Get joke from API
        joke_response = requests.get('https://official-joke-api.appspot.com/random_joke', timeout=5)
        if joke_response.status_code == 200:
            context['joke'] = joke_response.json()
    except:
        context['joke'] = None
    
    try:
        # Get quote from API
        quote_response = requests.get('https://api.quotable.io/random', timeout=5)
        if quote_response.status_code == 200:
            context['quote'] = quote_response.json()
    except:
        context['quote'] = None
    
    return render(request, 'home.html', context)


def client_auth(request):
    return render(request, 'client_auth.html')

def doctor_auth(request):
    return render(request, 'doctor_auth.html')