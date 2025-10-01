from django import forms
from .models import Order
from promotions.models import PromoCode


class OrderForm(forms.ModelForm):
    """Form for creating orders."""
    
    class Meta:
        model = Order
        fields = ['payment_method', 'notes']
        widgets = {
            'payment_method': forms.Select(attrs={'class': 'form-select'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Дополнительные пожелания (необязательно)'}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['notes'].required = False


class PromoCodeForm(forms.Form):
    """Form for applying promo codes."""
    code = forms.CharField(
        max_length=50,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Введите промокод'
        })
    )
    
    def clean_code(self):
        code = self.cleaned_data.get('code')
        if code:
            try:
                promo_code = PromoCode.objects.get(code=code)
                if not promo_code.is_valid:
                    raise forms.ValidationError('Промокод недействителен или истек.')
                return promo_code
            except PromoCode.DoesNotExist:
                raise forms.ValidationError('Промокод не найден.')
        return None