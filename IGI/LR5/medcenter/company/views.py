from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from .models import CompanyInfo, CompanyHistory, Partner, Contact, Vacancy


def company_info(request):
    """Display company information page."""
    try:
        company_info = CompanyInfo.objects.first()
    except CompanyInfo.DoesNotExist:
        company_info = None
    
    context = {
        'company_info': company_info,
    }
    
    return render(request, 'company/company_info.html', context)


def company_history(request):
    """Display company history by years."""
    history = CompanyHistory.objects.all().order_by('-year')
    
    context = {
        'history': history,
    }
    
    return render(request, 'company/company_history.html', context)


def contacts(request):
    """Display contacts/employees."""
    contacts = Contact.objects.filter(is_public=True).order_by('position', 'last_name')
    
    # Group contacts by position
    contacts_by_position = {}
    for contact in contacts:
        position = contact.get_position_display()
        if position not in contacts_by_position:
            contacts_by_position[position] = []
        contacts_by_position[position].append(contact)
    
    context = {
        'contacts_by_position': contacts_by_position,
    }
    
    return render(request, 'company/contacts.html', context)


def vacancies(request):
    """Display active job vacancies."""
    vacancies = Vacancy.objects.filter(is_active=True).order_by('-created_at')
    
    # Pagination
    paginator = Paginator(vacancies, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
    }
    
    return render(request, 'company/vacancies.html', context)


def vacancy_detail(request, pk):
    """Display single vacancy details."""
    vacancy = get_object_or_404(Vacancy, pk=pk, is_active=True)
    
    context = {
        'vacancy': vacancy,
    }
    
    return render(request, 'company/vacancy_detail.html', context)


def privacy_policy(request):
    """Display privacy policy page."""
    return render(request, 'company/privacy_policy.html')