from django.db import models
from django.contrib.auth.models import User


class GlossaryCategory(models.Model):
    """Categories for glossary terms."""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Категория терминов'
        verbose_name_plural = 'Категории терминов'
    
    def __str__(self):
        return self.name


class GlossaryTerm(models.Model):
    """Medical terms and definitions."""
    term = models.CharField(max_length=200, unique=True, verbose_name='Термин')
    definition = models.TextField(verbose_name='Определение')
    category = models.ForeignKey(GlossaryCategory, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='terms', verbose_name='Категория')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')
    
    class Meta:
        verbose_name = 'Термин'
        verbose_name_plural = 'Термины'
        ordering = ['term']
    
    def __str__(self):
        return self.term


class FAQ(models.Model):
    """Frequently Asked Questions."""
    question = models.CharField(max_length=300, verbose_name='Вопрос')
    answer = models.TextField(verbose_name='Ответ')
    category = models.ForeignKey(GlossaryCategory, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='faqs', verbose_name='Категория')
    is_published = models.BooleanField(default=True, verbose_name='Опубликован')
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')
    
    class Meta:
        verbose_name = 'Часто задаваемый вопрос'
        verbose_name_plural = 'Часто задаваемые вопросы'
        ordering = ['order', 'question']
    
    def __str__(self):
        return self.question