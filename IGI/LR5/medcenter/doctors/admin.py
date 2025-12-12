from django.contrib import admin
from .models import DoctorProfile, Specialization, Category


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'specialization', 'category', 'experience_years', 'is_available')
    list_filter = ('specialization', 'category', 'is_available')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'license_number')
    filter_horizontal = ('services',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'specialization', 'category')
        }),
        ('Professional Details', {
            'fields': ('license_number', 'experience_years', 'education', 'achievements')
        }),
        ('Work Schedule', {
            'fields': ('work_start', 'work_end', 'is_available')
        }),
        ('Services & Pricing', {
            'fields': ('services', 'consultation_price')
        }),
    )


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
