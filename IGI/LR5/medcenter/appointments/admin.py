from django.contrib import admin
from .models import Appointment
from django.utils.html import format_html
from django.urls import reverse
from django.contrib import messages
from collections import defaultdict
from decimal import Decimal
from rangefilter.filters import DateRangeFilter

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('appointment_date', 'client_link', 'doctor_link', 'service', 'get_service_price', 'notes')
    list_filter = (
        'client',
        'doctor',
        ('appointment_date', DateRangeFilter),
    )
    search_fields = ('client__user__username', 'doctor__user__username', 'notes')
    ordering = ('appointment_date',)
    actions = ['calculate_patient_costs', 'patients_for_doctor_and_date']

    def client_link(self, obj):
        if obj.client and hasattr(obj.client, 'user'):
            url = reverse('admin:clients_clientprofile_change', args=[obj.client.id])
            name = f"{obj.client.user.last_name} {obj.client.user.first_name} ({obj.client.user.username})"
            return format_html('<a href="{}">{}</a>', url, name)
        return "-"
    client_link.short_description = 'Клиент'

    def doctor_link(self, obj):
        if obj.doctor and hasattr(obj.doctor, 'user'):
            url = reverse('admin:doctors_doctorprofile_change', args=[obj.doctor.id])
            name = f"{obj.doctor.user.last_name} {obj.doctor.user.first_name} ({obj.doctor.user.username})"
            return format_html('<a href="{}">{}</a>', url, name)
        return "-"
    doctor_link.short_description = 'Врач'

    def get_service_price(self, obj):
        return obj.get_service_price()
    get_service_price.short_description = 'Цена услуги'

    def calculate_patient_costs(self, request, queryset):
        costs = defaultdict(Decimal)
        for app in queryset:
            if app.doctor:
                price = app.get_service_price() or Decimal('0')
                costs[app.doctor] += price
        message_lines = []
        for doctor, total in costs.items():
            message_lines.append(format_html(
                "{}: {} BYN",
                doctor,
                total
            ))
        full_message = format_html(
            "Стоимость посещений по врачам:<br>{}",
            format_html("<br>".join(message_lines))
        )
        self.message_user(request, full_message, messages.INFO, extra_tags='safe')
    calculate_patient_costs.short_description = "Посчитать стоимость посещений по врачам"



    def patients_for_doctor_and_date(self, request, queryset):
        result = defaultdict(set)
        for app in queryset:
            if app.doctor and app.appointment_date:
                key = (app.doctor, app.appointment_date.date())
                result[key].add(app.client)

        message_lines = []
        for (doctor, date), clients in result.items():
            clients_list = ", ".join(str(client) for client in clients)
            message_lines.append(format_html(
                "{} — {}: {}",
                doctor,
                date,
                clients_list
            ))

        full_message = format_html(
            "Пациенты по врачу и дате:<br>{}",
            format_html("<br>".join(message_lines))
        )

        self.message_user(request, full_message, messages.INFO, extra_tags='safe')
    patients_for_doctor_and_date.short_description = "Пациенты по врачу и дате"

