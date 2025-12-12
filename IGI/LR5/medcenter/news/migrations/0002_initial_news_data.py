# Generated migration for news and promotions

from django.db import migrations
from django.utils import timezone
from datetime import timedelta


def create_news_and_promotions(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    NewsCategory = apps.get_model('news', 'NewsCategory')
    News = apps.get_model('news', 'News')
    Banner = apps.get_model('promotions', 'Banner')
    PromoCode = apps.get_model('promotions', 'PromoCode')
    
    # Get or create admin user for author
    admin_user, _ = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    # Create news categories
    categories_data = [
        ('Новости клиники', 'Новости и события нашего медицинского центра'),
        ('Здоровье', 'Полезные статьи о здоровье и профилактике'),
        ('Акции и скидки', 'Специальные предложения и акции'),
    ]
    
    categories = {}
    for name, description in categories_data:
        category = NewsCategory.objects.create(
            name=name,
            description=description
        )
        categories[name] = category
    
    # Create news articles
    news_data = [
        ('Открытие нового отделения функциональной диагностики',
         'Рады сообщить об открытии нового отделения!',
         '''В нашем медицинском центре открылось новое отделение функциональной диагностики, оснащенное современным оборудованием экспертного класса.

Теперь мы можем предложить нашим пациентам:
• УЗИ исследования на аппаратах последнего поколения
• Расширенную ЭКГ-диагностику
• Холтер-мониторирование
• Суточный мониторинг артериального давления

Запись на исследования уже доступна!''',
         'Новости клиники'),
        
        ('Профилактика сердечно-сосудистых заболеваний',
         'Как сохранить здоровье сердца',
         '''Сердечно-сосудистые заболевания остаются одной из главных причин смертности. Однако многие из них можно предотвратить, соблюдая простые правила:

1. Регулярные физические нагрузки
2. Здоровое питание с ограничением соли и жиров
3. Отказ от курения
4. Контроль артериального давления
5. Регулярные медицинские осмотры

Наши кардиологи готовы помочь вам разработать индивидуальную программу профилактики.''',
         'Здоровье'),
        
        ('Скидка 20% на комплексное обследование',
         'Специальное предложение на комплексную диагностику',
         '''До конца месяца действует специальное предложение - скидка 20% на комплексное обследование организма!

В комплекс входит:
• Консультация терапевта
• Общий и биохимический анализ крови
• ЭКГ
• УЗИ органов брюшной полости

Стоимость со скидкой: 120 руб. вместо 150 руб.

Не упустите возможность проверить свое здоровье по выгодной цене!''',
         'Акции и скидки'),
        
        ('Вакцинация от гриппа',
         'Начался сезон вакцинации от гриппа',
         '''Уважаемые пациенты! В нашем медицинском центре началась вакцинация от гриппа.

Мы используем современные вакцины, прошедшие все необходимые испытания и разрешенные к применению в РБ.

Особенно рекомендуем пройти вакцинацию:
• Людям старше 65 лет
• Беременным женщинам
• Людям с хроническими заболеваниями
• Медицинским работникам

Записаться можно по телефону или через сайт.''',
         'Новости клиники'),
        
        ('10 правил здорового питания',
         'Простые правила для поддержания здоровья',
         '''Правильное питание - основа крепкого здоровья. Наши диетологи составили список из 10 простых правил:

1. Ешьте разнообразную пищу
2. Включайте в рацион больше овощей и фруктов
3. Ограничьте потребление сахара и соли
4. Выбирайте цельнозерновые продукты
5. Употребляйте достаточно белка
6. Пейте достаточно воды
7. Ограничьте фаст-фуд
8. Ешьте регулярно, небольшими порциями
9. Избегайте переедания
10. Обращайте внимание на качество продуктов

Записаться на консультацию к диетологу можно на нашем сайте.''',
         'Здоровье'),
    ]
    
    now = timezone.now()
    for i, (title, summary, content, category_name) in enumerate(news_data):
        News.objects.create(
            title=title,
            slug=f'news-{i+1}',
            summary=summary,
            content=content,
            category=categories.get(category_name),
            author=admin_user,
            is_published=True,
            published_at=now - timedelta(days=10-i)
        )
    
    # Create banners
    banners_data = [
        ('Добро пожаловать в наш медицинский центр!',
         'Качественная медицинская помощь для всей семьи',
         '/services/', 'Наши услуги', 1),
        ('Акция! Скидка 20% на комплексное обследование',
         'Проверьте свое здоровье по выгодной цене',
         '/news/', 'Подробнее', 2),
        ('Запись онлайн - это удобно!',
         'Запишитесь на прием через сайт в любое время',
         '/services/', 'Записаться', 3),
    ]
    
    for title, subtitle, link_url, link_text, order in banners_data:
        Banner.objects.create(
            title=title,
            subtitle=subtitle,
            link_url=link_url,
            link_text=link_text,
            order=order,
            is_active=True
        )
    
    # Create promo codes
    promo_data = [
        ('FIRST20', 'Скидка 20% на первое посещение', 20.00, 100),
        ('HEALTH10', 'Скидка 10% на все услуги', 10.00, 200),
        ('ANALYSIS15', 'Скидка 15% на лабораторные анализы', 15.00, 150),
    ]
    
    for code, name, discount, usage_limit in promo_data:
        PromoCode.objects.create(
            code=code,
            name=name,
            discount_type='percentage',
            discount_value=discount,
            valid_from=now,
            valid_until=now + timedelta(days=60),
            usage_limit=usage_limit,
            is_active=True
        )


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0001_initial'),
        ('promotions', '0002_alter_banner_image'),
        ('auth', '__latest__'),
    ]

    operations = [
        migrations.RunPython(create_news_and_promotions),
    ]
