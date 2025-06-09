from django.shortcuts import render
from services.models import ServiceCategory
import requests

def home(request):
    categories = ServiceCategory.objects.prefetch_related('services').all()

    joke = None
    try:
        response = requests.get("https://official-joke-api.appspot.com/random_joke", timeout=5)
        if response.status_code == 200:
            joke = response.json()
    except requests.RequestException:
        joke = {"setup": "Не удалось загрузить шутку.", "punchline": ""}
    quote = None
    try:
        response = requests.get("https://favqs.com/api/qotd", timeout=5)
        if response.status_code == 200:
            data = response.json()
            quote_data = data.get("quote", {})
            quote = {
                "body": quote_data.get("body", ""),
                "author": quote_data.get("author", "Неизвестный автор")
            }
    except requests.RequestException:
        quote = {"body": "Не удалось загрузить цитату.", "author": ""}
    return render(request, 'home.html', {
        'categories': categories,
        'joke': joke,
        'quote' : quote,
    })


def client_auth(request):
    return render(request, 'client_auth.html')

def doctor_auth(request):
    return render(request, 'doctor_auth.html')