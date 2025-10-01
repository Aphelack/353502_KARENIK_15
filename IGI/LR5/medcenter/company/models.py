from django.db import models


class CompanyInfo(models.Model):
    """Company information singleton model."""
    name = models.CharField(max_length=200, verbose_name='Название компании')
    description = models.TextField(verbose_name='Описание')
    logo = models.ImageField(upload_to='company/', blank=True, null=True, verbose_name='Логотип')
    video_url = models.URLField(blank=True, null=True, verbose_name='Ссылка на видео')
    address = models.TextField(verbose_name='Адрес')
    phone = models.CharField(max_length=50, verbose_name='Телефон')
    email = models.EmailField(verbose_name='Email')
    website = models.URLField(blank=True, null=True, verbose_name='Веб-сайт')
    registration_number = models.CharField(max_length=100, verbose_name='Регистрационный номер')
    tax_number = models.CharField(max_length=100, verbose_name='Налоговый номер')
    bank_account = models.CharField(max_length=100, verbose_name='Банковский счет')
    bank_name = models.CharField(max_length=200, verbose_name='Название банка')
    certificate_text = models.TextField(verbose_name='Текст сертификата')
    
    class Meta:
        verbose_name = 'Информация о компании'
        verbose_name_plural = 'Информация о компании'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and CompanyInfo.objects.exists():
            raise ValueError('Only one CompanyInfo instance is allowed')
        super().save(*args, **kwargs)


class CompanyHistory(models.Model):
    """Company history by years."""
    year = models.PositiveIntegerField(unique=True, verbose_name='Год')
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    description = models.TextField(verbose_name='Описание')
    image = models.ImageField(upload_to='company/history/', blank=True, null=True, 
                            verbose_name='Изображение')
    
    class Meta:
        verbose_name = 'История компании'
        verbose_name_plural = 'История компании'
        ordering = ['-year']
    
    def __str__(self):
        return f"{self.year}: {self.title}"


class Partner(models.Model):
    """Company partners."""
    name = models.CharField(max_length=200, verbose_name='Название')
    logo = models.ImageField(upload_to='partners/', verbose_name='Логотип')
    website = models.URLField(verbose_name='Веб-сайт')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    is_active = models.BooleanField(default=True, verbose_name='Активный')
    
    class Meta:
        verbose_name = 'Партнер'
        verbose_name_plural = 'Партнеры'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Contact(models.Model):
    """Company contacts/employees."""
    POSITION_CHOICES = [
        ('director', 'Директор'),
        ('doctor', 'Врач'),
        ('nurse', 'Медсестра'),
        ('administrator', 'Администратор'),
        ('manager', 'Менеджер'),
        ('other', 'Другое'),
    ]
    
    first_name = models.CharField(max_length=100, verbose_name='Имя')
    last_name = models.CharField(max_length=100, verbose_name='Фамилия')
    middle_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='Отчество')
    position = models.CharField(max_length=20, choices=POSITION_CHOICES, verbose_name='Должность')
    custom_position = models.CharField(max_length=100, blank=True, null=True, 
                                     verbose_name='Другая должность')
    photo = models.ImageField(upload_to='contacts/', blank=True, null=True, verbose_name='Фото')
    phone = models.CharField(max_length=50, verbose_name='Телефон')
    email = models.EmailField(verbose_name='Email')
    description = models.TextField(verbose_name='Описание работы')
    is_public = models.BooleanField(default=True, verbose_name='Показывать на сайте')
    
    class Meta:
        verbose_name = 'Контакт'
        verbose_name_plural = 'Контакты'
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.last_name} {self.first_name}"
    
    @property
    def full_name(self):
        parts = [self.last_name, self.first_name]
        if self.middle_name:
            parts.append(self.middle_name)
        return ' '.join(parts)
    
    @property
    def position_display(self):
        if self.position == 'other' and self.custom_position:
            return self.custom_position
        return self.get_position_display()


class Vacancy(models.Model):
    """Job vacancies."""
    title = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    requirements = models.TextField(verbose_name='Требования')
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,
                                   verbose_name='Зарплата от')
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,
                                   verbose_name='Зарплата до')
    contact_email = models.EmailField(verbose_name='Email для связи')
    contact_phone = models.CharField(max_length=50, blank=True, null=True, 
                                   verbose_name='Телефон для связи')
    is_active = models.BooleanField(default=True, verbose_name='Активная')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Вакансия'
        verbose_name_plural = 'Вакансии'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title