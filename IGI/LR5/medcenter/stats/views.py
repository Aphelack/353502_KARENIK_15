import io
import base64
from django.shortcuts import render
from clients.models import ClientProfile  # Импортируйте свою модель клиента
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from datetime import date

def stats_list(request):
    # Получаем данные возрастов клиентов
    birth_dates = list(ClientProfile.objects.values_list('birth_date', flat=True))
    today = date.today()
    ages = []

    for bd in birth_dates:
        if bd is not None:
            # bd может быть datetime.date или datetime.datetime
            # если bd - datetime.datetime, возьмём только дату
            if hasattr(bd, 'date'):
                birth = bd.date()
            else:
                birth = bd
            # вычисление возраста
            age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
            ages.append(age)

    # Генерируем гистограмму
    fig, ax = plt.subplots()
    ax.hist(ages, bins=range(0, 100, 10), color='skyblue', edgecolor='black')
    ax.set_title('Распределение возрастов клиентов')
    ax.set_xlabel('Возраст')
    ax.set_ylabel('Число клиентов')

    # Сохраняем картинку в буфер
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()

    return render(request, 'stats/stats_list.html', {'chart': image_base64})