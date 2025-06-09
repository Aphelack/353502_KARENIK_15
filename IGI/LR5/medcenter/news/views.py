from django.shortcuts import render, redirect
from django.contrib.auth.decorators import user_passes_test
from .models import News
from .forms import NewsForm

def news_list(request):
    news = News.objects.all().order_by('-created_at')
    return render(request, 'news/news_list.html', {'news': news})

@user_passes_test(lambda u: u.is_superuser)
def add_news(request):
    if request.method == 'POST':
        form = NewsForm(request.POST)
        if form.is_valid():
            news = form.save(commit=False)
            news.author = request.user
            news.save()
            return redirect('news_list')
    else:
        form = NewsForm()
    return render(request, 'news/add_news.html', {'form': form})