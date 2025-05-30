from django import forms
from allauth.account.forms import SignupForm
from doctors.models import Specialization, Category

class ClientSignupForm(SignupForm):
    first_name = forms.CharField(label="Имя", max_length=50)
    last_name = forms.CharField(label="Фамилия", max_length=50)
    address = forms.CharField(label="Адрес", max_length=255)
    birth_date = forms.DateField(label="Дата рождения", widget=forms.DateInput(attrs={'type': 'date'}))

    def save(self, request):
        user = super().save(request)
        from .models import Profile
        from clients.models import ClientProfile
        Profile.objects.create(user=user, role='client')
        ClientProfile.objects.create(
            user=user,
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'],
            address=self.cleaned_data['address'],
            birth_date=self.cleaned_data['birth_date'],
        )
        return user

class DoctorSignupForm(SignupForm):
    first_name = forms.CharField(label="Имя", max_length=50)
    last_name = forms.CharField(label="Фамилия", max_length=50)
    phone = forms.CharField(label="Телефон", max_length=20, required=False)
    address = forms.CharField(label="Адрес", max_length=255, required=False)
    birth_date = forms.DateField(label="Дата рождения", widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    specialization = forms.ModelChoiceField(label="Специализация", queryset=Specialization.objects.all(), required=False)
    category = forms.ModelChoiceField(label="Категория", queryset=Category.objects.all(), required=False)

    def save(self, request):
        user = super().save(request)
        from .models import Profile
        from doctors.models import DoctorProfile
        Profile.objects.create(user=user, role='doctor')
        DoctorProfile.objects.create(
            user=user,
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'],
            phone=self.cleaned_data.get('phone', ''),
            address=self.cleaned_data.get('address', ''),
            birth_date=self.cleaned_data.get('birth_date', None),
            specialization=self.cleaned_data.get('specialization', None),
            category=self.cleaned_data.get('category', None),
        )
        return user