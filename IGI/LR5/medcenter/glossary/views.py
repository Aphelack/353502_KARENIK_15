from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from .models import GlossaryCategory, GlossaryTerm, FAQ


def faq_list(request):
    """Display FAQ list with categories."""
    faqs = FAQ.objects.filter(is_published=True).select_related('category').order_by('order', 'question')
    
    # Filter by category
    category_id = request.GET.get('category')
    if category_id:
        faqs = faqs.filter(category_id=category_id)
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        faqs = faqs.filter(
            Q(question__icontains=search_query) | 
            Q(answer__icontains=search_query)
        )
    
    categories = GlossaryCategory.objects.all()
    
    context = {
        'faqs': faqs,
        'categories': categories,
        'current_category': category_id,
        'search_query': search_query,
    }
    
    return render(request, 'glossary/faq_list.html', context)


def glossary_list(request):
    """Display medical terms glossary."""
    terms = GlossaryTerm.objects.select_related('category').order_by('term')
    
    # Filter by category
    category_id = request.GET.get('category')
    if category_id:
        terms = terms.filter(category_id=category_id)
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        terms = terms.filter(
            Q(term__icontains=search_query) | 
            Q(definition__icontains=search_query)
        )
    
    # Filter by first letter
    letter = request.GET.get('letter')
    if letter:
        terms = terms.filter(term__istartswith=letter)
    
    # Pagination
    paginator = Paginator(terms, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    categories = GlossaryCategory.objects.all()
    
    # Get available first letters
    first_letters = []
    for term in GlossaryTerm.objects.all():
        first_letter = term.term[0].upper()
        if first_letter not in first_letters:
            first_letters.append(first_letter)
    first_letters.sort()
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'current_category': category_id,
        'search_query': search_query,
        'current_letter': letter,
        'first_letters': first_letters,
    }
    
    return render(request, 'glossary/glossary_list.html', context)


def term_detail(request, pk):
    """Display single term details."""
    term = get_object_or_404(GlossaryTerm, pk=pk)
    
    # Get related terms from same category
    related_terms = GlossaryTerm.objects.filter(
        category=term.category
    ).exclude(id=term.id).order_by('term')[:5]
    
    context = {
        'term': term,
        'related_terms': related_terms,
    }
    
    return render(request, 'glossary/term_detail.html', context)