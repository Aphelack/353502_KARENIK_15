from django.contrib import admin
from .models import NewsCategory, News


@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'is_published', 'is_featured', 'published_at', 'created_at')
    list_filter = ('is_published', 'is_featured', 'category', 'created_at', 'published_at')
    search_fields = ('title', 'summary', 'content')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'category')
        }),
        ('Content', {
            'fields': ('summary', 'content', 'image')
        }),
        ('Publishing', {
            'fields': ('author', 'is_published', 'is_featured', 'published_at')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)