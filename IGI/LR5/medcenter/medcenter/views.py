from django.shortcuts import render
from django.http import JsonResponse
from services.models import ServiceCategory
from news.models import News
from company.models import Partner
from promotions.models import Banner
from appointments.models import Appointment
from orders.models import Order
from reviews.models import Review
from clients.models import ClientProfile
from doctors.models import DoctorProfile
import requests
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime, timedelta
from django.db.models import Count, Q
from django.utils import timezone
import calendar as cal


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


def statistics(request):
    """Statistics page with charts and calendar."""
    
    # Get current date info
    now = timezone.now()
    current_year = now.year
    current_month = now.month
    
    # Generate calendar
    month_calendar = cal.monthcalendar(current_year, current_month)
    month_name = cal.month_name[current_month]
    weekday_names = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    
    # Get statistics data
    total_appointments = Appointment.objects.count()
    total_orders = Order.objects.count()
    total_reviews = Review.objects.count()
    total_clients = ClientProfile.objects.count()
    total_doctors = DoctorProfile.objects.count()
    
    # Appointments by month (last 6 months)
    months_data = []
    appointments_data = []
    for i in range(5, -1, -1):
        month_date = now - timedelta(days=30*i)
        month_str = month_date.strftime('%b')
        count = Appointment.objects.filter(
            appointment_date__year=month_date.year,
            appointment_date__month=month_date.month
        ).count()
        months_data.append(month_str)
        appointments_data.append(count)
    
    # Create appointments chart
    fig1, ax1 = plt.subplots(figsize=(8, 5))
    ax1.plot(months_data, appointments_data, marker='o', linewidth=2, markersize=8, color='#007bff')
    ax1.set_xlabel('Месяц', fontsize=12)
    ax1.set_ylabel('Количество записей', fontsize=12)
    ax1.set_title('Записи на прием (последние 6 месяцев)', fontsize=14, fontweight='bold')
    ax1.grid(True, alpha=0.3)
    
    # Save to base64
    buffer1 = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buffer1, format='png', dpi=100, bbox_inches='tight')
    buffer1.seek(0)
    chart1_base64 = base64.b64encode(buffer1.read()).decode()
    plt.close(fig1)
    
    # Create pie chart for payment methods
    payment_methods = Order.objects.values('payment_method').annotate(count=Count('id'))
    payment_labels = []
    payment_values = []
    payment_colors = ['#007bff', '#28a745', '#ffc107']
    
    for pm in payment_methods:
        payment_values.append(pm['count'])
        if pm['payment_method'] == 'cash':
            payment_labels.append('Наличные')
        elif pm['payment_method'] == 'card':
            payment_labels.append('Карта')
        elif pm['payment_method'] == 'bank_transfer':
            payment_labels.append('Перевод')
        else:
            payment_labels.append(pm['payment_method'])  # Fallback
    
    if payment_values and len(payment_values) == len(payment_labels):
        fig2, ax2 = plt.subplots(figsize=(7, 5))
        ax2.pie(payment_values, labels=payment_labels, autopct='%1.1f%%', 
                startangle=90, colors=payment_colors[:len(payment_values)])
        ax2.set_title('Способы оплаты заказов', fontsize=14, fontweight='bold')
        
        buffer2 = io.BytesIO()
        plt.tight_layout()
        plt.savefig(buffer2, format='png', dpi=100, bbox_inches='tight')
        buffer2.seek(0)
        chart2_base64 = base64.b64encode(buffer2.read()).decode()
        plt.close(fig2)
    else:
        chart2_base64 = None
    
    # Create bar chart for reviews ratings
    ratings = Review.objects.values('rating').annotate(count=Count('id')).order_by('rating')
    rating_labels = [str(r['rating']) for r in ratings]
    rating_values = [r['count'] for r in ratings]
    
    if rating_values:
        fig3, ax3 = plt.subplots(figsize=(8, 5))
        bars = ax3.bar(rating_labels, rating_values, color='#28a745', alpha=0.7)
        ax3.set_xlabel('Оценка', fontsize=12)
        ax3.set_ylabel('Количество отзывов', fontsize=12)
        ax3.set_title('Распределение оценок в отзывах', fontsize=14, fontweight='bold')
        ax3.grid(True, axis='y', alpha=0.3)
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax3.text(bar.get_x() + bar.get_width()/2., height,
                    f'{int(height)}',
                    ha='center', va='bottom', fontsize=10)
        
        buffer3 = io.BytesIO()
        plt.tight_layout()
        plt.savefig(buffer3, format='png', dpi=100, bbox_inches='tight')
        buffer3.seek(0)
        chart3_base64 = base64.b64encode(buffer3.read()).decode()
        plt.close(fig3)
    else:
        chart3_base64 = None
    
    context = {
        'total_appointments': total_appointments,
        'total_orders': total_orders,
        'total_reviews': total_reviews,
        'total_clients': total_clients,
        'total_doctors': total_doctors,
        'chart1': chart1_base64,
        'chart2': chart2_base64,
        'chart3': chart3_base64,
        'month_calendar': month_calendar,
        'month_name': month_name,
        'current_year': current_year,
        'weekday_names': weekday_names,
        'current_day': now.day,
    }
    
    return render(request, 'statistics.html', context)