from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Avg, Count
from .models import Review
from .forms import ReviewForm
from services.models import Service
from doctors.models import DoctorProfile


def reviews_list(request):
    """Display published reviews with filtering."""
    reviews = Review.objects.filter(is_published=True).select_related(
        'user', 'service', 'doctor'
    ).order_by('-created_at')
    
    # Filter by rating
    rating = request.GET.get('rating')
    if rating:
        reviews = reviews.filter(rating=rating)
    
    # Filter by service or doctor
    service_id = request.GET.get('service')
    doctor_id = request.GET.get('doctor')
    
    if service_id:
        reviews = reviews.filter(service_id=service_id)
    elif doctor_id:
        reviews = reviews.filter(doctor_id=doctor_id)
    
    # Pagination
    paginator = Paginator(reviews, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get statistics
    stats = Review.objects.filter(is_published=True).aggregate(
        avg_rating=Avg('rating'),
        total_reviews=Count('id')
    )
    
    # Rating distribution
    rating_distribution = {}
    for i in range(1, 6):
        rating_distribution[i] = Review.objects.filter(
            is_published=True, rating=i
        ).count()
    
    services = Service.objects.all()
    doctors = DoctorProfile.objects.all()
    
    context = {
        'page_obj': page_obj,
        'stats': stats,
        'rating_distribution': rating_distribution,
        'services': services,
        'doctors': doctors,
        'current_rating': rating,
        'current_service': service_id,
        'current_doctor': doctor_id,
    }
    
    return render(request, 'reviews/reviews_list.html', context)


@login_required
def add_review(request):
    """Add a new review."""
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user
            review.save()
            messages.success(request, 'Ваш отзыв отправлен на модерацию.')
            return redirect('reviews_list')
    else:
        form = ReviewForm()
        
        # Pre-select service or doctor from URL parameters
        service_id = request.GET.get('service')
        doctor_id = request.GET.get('doctor')
        
        if service_id:
            form.fields['service'].initial = service_id
        elif doctor_id:
            form.fields['doctor'].initial = doctor_id
    
    context = {
        'form': form,
    }
    
    return render(request, 'reviews/add_review.html', context)


def review_detail(request, pk):
    """Display single review details."""
    review = get_object_or_404(Review, pk=pk, is_published=True)
    
    context = {
        'review': review,
    }
    
    return render(request, 'reviews/review_detail.html', context)