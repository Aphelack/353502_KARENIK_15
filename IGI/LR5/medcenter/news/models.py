from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils.text import slugify


class NewsCategory(models.Model):
    """Categories for news articles."""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Категория новостей'
        verbose_name_plural = 'Категории новостей'
    
    def __str__(self):
        return self.name


class News(models.Model):
    """News articles for the medical center."""
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name='URL')
    category = models.ForeignKey(NewsCategory, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='news', verbose_name='Категория')
    summary = models.CharField(max_length=300, verbose_name='Краткое содержание')
    content = models.TextField(verbose_name='Содержание')
    image = models.ImageField(upload_to='news/', blank=True, null=True, verbose_name='Изображение')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='news_articles',
                             verbose_name='Автор')
    is_published = models.BooleanField(default=False, verbose_name='Опубликовано')
    is_featured = models.BooleanField(default=False, verbose_name='Рекомендуемая')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    published_at = models.DateTimeField(blank=True, null=True, verbose_name='Дата публикации')
    
    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        ordering = ['-published_at', '-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('news_detail', kwargs={'slug': self.slug})