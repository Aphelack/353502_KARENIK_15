from django import forms
from .models import Review


class ReviewForm(forms.ModelForm):
    """Form for creating reviews."""
    
    class Meta:
        model = Review
        fields = ['service', 'doctor', 'rating', 'title', 'text']
        widgets = {
            'rating': forms.Select(choices=Review.RATING_CHOICES, attrs={'class': 'form-select'}),
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Заголовок отзыва (необязательно)'}),
            'text': forms.Textarea(attrs={'class': 'form-control', 'rows': 5, 'placeholder': 'Напишите ваш отзыв...'}),
            'service': forms.Select(attrs={'class': 'form-select'}),
            'doctor': forms.Select(attrs={'class': 'form-select'}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['service'].empty_label = "Выберите услугу"
        self.fields['doctor'].empty_label = "Выберите врача"
        self.fields['service'].required = False
        self.fields['doctor'].required = False
        self.fields['title'].required = False
    
    def clean(self):
        cleaned_data = super().clean()
        service = cleaned_data.get('service')
        doctor = cleaned_data.get('doctor')
        
        if not service and not doctor:
            raise forms.ValidationError('Необходимо выбрать услугу или врача.')
        
        if service and doctor:
            raise forms.ValidationError('Нельзя оставлять отзыв одновременно на услугу и врача.')
        
        return cleaned_data