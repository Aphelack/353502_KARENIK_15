from django.shortcuts import render, get_object_or_404
from .models import ClientProfile
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from appointments.models import Appointment

def client_detail(request, pk):
    client = get_object_or_404(ClientProfile, pk=pk)
    return render(request, 'clients/client_detail.html', {'client': client})

@login_required
def client_cabinet(request):
    client = getattr(request.user, 'clientprofile', None)
    if not client:
        return render(request, 'no_access.html')
    appointments = Appointment.objects.filter(client=client).order_by('appointment_date')
    return render(request, 'clients/client_cabinet.html', {'appointments': appointments})

