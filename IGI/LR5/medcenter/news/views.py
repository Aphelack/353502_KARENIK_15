from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from .models import News, NewsCategory


def news_list(request):
    """List all published news with pagination and filtering."""
    news_list = News.objects.filter(is_published=True).select_related('author', 'category').order_by('-published_at')
    
    # Filter by category
    category_id = request.GET.get('category')
    if category_id:
        news_list = news_list.filter(category_id=category_id)
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        news_list = news_list.filter(
            Q(title__icontains=search_query) | 
            Q(summary__icontains=search_query) |
            Q(content__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(news_list, 9)  # Show 9 news per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    categories = NewsCategory.objects.all()
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'current_category': category_id,
        'search_query': search_query,
    }
    
    return render(request, 'news/news_list.html', context)


def news_detail(request, slug):
    """Display single news article."""
    news = get_object_or_404(News, slug=slug, is_published=True)
    
    # Get related news from same category
    related_news = News.objects.filter(
        category=news.category,
        is_published=True
    ).exclude(id=news.id).order_by('-published_at')[:3]
    
    context = {
        'news': news,
        'related_news': related_news,
    }
    
    return render(request, 'news/news_detail.html', context)