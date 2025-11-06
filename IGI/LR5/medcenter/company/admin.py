from django.contrib import admin
from .models import CompanyInfo, CompanyHistory, Partner, Contact, Vacancy


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'logo', 'video_url')
        }),
        ('Contact Information', {
            'fields': ('address', 'phone', 'email', 'website')
        }),
        ('Legal Information', {
            'fields': ('registration_number', 'tax_number', 'bank_account', 'bank_name')
        }),
        ('Certificate', {
            'fields': ('certificate_text',)
        }),
    )


@admin.register(CompanyHistory)
class CompanyHistoryAdmin(admin.ModelAdmin):
    list_display = ('year', 'title', 'description')
    list_filter = ('year',)
    ordering = ('-year',)


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'position', 'phone', 'email', 'is_public')
    list_filter = ('position', 'is_public')
    search_fields = ('first_name', 'last_name', 'email')
    ordering = ('last_name', 'first_name')


@admin.register(Vacancy)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ('title', 'salary_min', 'salary_max', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('-created_at',)