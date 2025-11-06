from django import forms
from allauth.account.forms import SignupForm
from doctors.models import Specialization, Category
import logging
import random
import string

logger = logging.getLogger(__name__)

class ClientSignupForm(SignupForm):
    first_name = forms.CharField(label="Имя", max_length=50)
    last_name = forms.CharField(label="Фамилия", max_length=50)
    address = forms.CharField(label="Адрес", max_length=255, required=False)
    birth_date = forms.DateField(label="Дата рождения", widget=forms.DateInput(attrs={'type': 'date'}), required=False)

    def save(self, request):
        try:
            user = super().save(request)
            logger.info(f"User created: {user.username}")
            
            # Save basic user info
            user.first_name = self.cleaned_data['first_name']
            user.last_name = self.cleaned_data['last_name']
            user.save()
            logger.info(f"User name saved: {user.first_name} {user.last_name}")
            
            # Update the profile created by signal with role and additional info
            profile = user.profile
            profile.role = 'client'
            profile.address = self.cleaned_data.get('address', '')
            profile.birth_date = self.cleaned_data.get('birth_date', None)
            profile.save()
            logger.info(f"Profile updated: role={profile.role}, address={profile.address}, birth_date={profile.birth_date}")
            
            # Create ClientProfile only if needed for specific client fields
            from clients.models import ClientProfile
            if not hasattr(user, 'client_profile'):
                # Generate unique medical card number
                medical_card_number = f"MC{user.id:06d}{''.join(random.choices(string.digits, k=4))}"
                ClientProfile.objects.create(
                    user=user,
                    medical_card_number=medical_card_number
                )
                logger.info(f"ClientProfile created with card number: {medical_card_number}")
            
            return user
        except Exception as e:
            logger.error(f"Registration failed for user {user.username if 'user' in locals() else 'unknown'}: {str(e)}", exc_info=True)
            raise

class DoctorSignupForm(SignupForm):
    first_name = forms.CharField(label="Имя", max_length=50)
    last_name = forms.CharField(label="Фамилия", max_length=50)
    phone = forms.CharField(label="Телефон", max_length=20, required=False)
    address = forms.CharField(label="Адрес", max_length=255, required=False)
    birth_date = forms.DateField(label="Дата рождения", widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    specialization = forms.ModelChoiceField(label="Специализация", queryset=Specialization.objects.all(), required=False)
    category = forms.ModelChoiceField(label="Категория", queryset=Category.objects.all(), required=False)

    def save(self, request):
        try:
            user = super().save(request)
            logger.info(f"Doctor user created: {user.username}")
            
            # Save basic user info
            user.first_name = self.cleaned_data['first_name']
            user.last_name = self.cleaned_data['last_name']
            user.save()
            logger.info(f"Doctor name saved: {user.first_name} {user.last_name}")
            
            # Update the profile created by signal with role and additional info
            profile = user.profile
            profile.role = 'doctor'
            profile.phone = self.cleaned_data.get('phone', '')
            profile.address = self.cleaned_data.get('address', '')
            profile.birth_date = self.cleaned_data.get('birth_date', None)
            profile.save()
            logger.info(f"Doctor profile updated: role={profile.role}")
            
            # Create DoctorProfile with specialization and category
            from doctors.models import DoctorProfile
            if not hasattr(user, 'doctor_profile'):
                DoctorProfile.objects.create(
                    user=user,
                    specialization=self.cleaned_data.get('specialization', None),
                    category=self.cleaned_data.get('category', None),
                )
                logger.info("DoctorProfile created")
            
            return user
        except Exception as e:
            logger.error(f"Doctor registration failed for user {user.username if 'user' in locals() else 'unknown'}: {str(e)}", exc_info=True)
            raise