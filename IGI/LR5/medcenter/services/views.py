from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Service, ServiceCategory


def service_list(request):
    """List all services with filtering and pagination."""
    services = Service.objects.select_related('category').all()
    
    # Filter by category
    category_id = request.GET.get('category')
    if category_id:
        services = services.filter(category_id=category_id)
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        services = services.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(services, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    categories = ServiceCategory.objects.all()
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'current_category': category_id,
        'search_query': search_query,
    }
    
    return render(request, 'services/service_list.html', context)


def service_category(request, category_id):
    """Display services for a specific category."""
    category = get_object_or_404(ServiceCategory, id=category_id)
    services = Service.objects.filter(category=category)
    
    # Pagination
    paginator = Paginator(services, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'category': category,
        'page_obj': page_obj,
    }
    
    return render(request, 'services/service_category.html', context)


def service_detail(request, service_id):
    """Display single service details."""
    service = get_object_or_404(Service, id=service_id)
    
    # Get related services from same category
    related_services = Service.objects.filter(
        category=service.category
    ).exclude(id=service.id)[:4]
    
    context = {
        'service': service,
        'related_services': related_services,
    }
    
    return render(request, 'services/service_detail.html', context)
