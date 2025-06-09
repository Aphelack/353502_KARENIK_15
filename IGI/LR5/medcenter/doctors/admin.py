from django.contrib import admin
from .models import DoctorProfile, Specialization, Category

@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'specialization', 'category', 'services_list')
    filter_horizontal = ('services',)


admin.site.register(Specialization)
admin.site.register(Category)
