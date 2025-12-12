from django.contrib import admin
from .models import ClientProfile, Cart, CartItem


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'medical_card_number', 'emergency_contact')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'medical_card_number')
    list_filter = ('preferred_language',)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('client', 'items_count', 'total_price', 'created_at')
    readonly_fields = ('items_count', 'total_price')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'service', 'quantity', 'total_price', 'added_at')
    list_filter = ('added_at',)

