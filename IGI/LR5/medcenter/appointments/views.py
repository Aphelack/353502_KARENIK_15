from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from accounts.permissions import client_required, doctor_required
from .models import Appointment


@client_required
def appointment_list(request):
    """List user's appointments."""
    appointments = Appointment.objects.filter(
        client__user=request.user
    ).select_related('doctor__user', 'service').order_by('-appointment_date')
    
    context = {
        'appointments': appointments,
    }
    
    return render(request, 'appointments/appointment_list.html', context)


@client_required
def create_appointment(request):
    """Create a new appointment."""
    if request.method == 'POST':
        # This is a placeholder - in a real app you'd use a form
        messages.success(request, 'Appointment booking functionality will be implemented.')
        return redirect('appointment_list')
    
    return render(request, 'appointments/create_appointment.html')


@login_required
def appointment_detail(request, appointment_id):
    """View appointment details."""
    appointment = get_object_or_404(Appointment, id=appointment_id)
    
    # Check permissions
    if hasattr(request.user, 'client_profile') and appointment.client.user != request.user:
        messages.error(request, 'You can only view your own appointments.')
        return redirect('appointment_list')
    elif hasattr(request.user, 'doctor_profile') and appointment.doctor.user != request.user:
        messages.error(request, 'You can only view your own appointments.')
        return redirect('appointment_list')
    
    context = {
        'appointment': appointment,
    }
    
    return render(request, 'appointments/appointment_detail.html', context)


@client_required
def edit_appointment(request, appointment_id):
    """Edit an appointment."""
    appointment = get_object_or_404(Appointment, id=appointment_id, client__user=request.user)
    
    if request.method == 'POST':
        # This is a placeholder - in a real app you'd use a form
        messages.success(request, 'Appointment edit functionality will be implemented.')
        return redirect('appointment_detail', appointment_id=appointment.id)
    
    context = {
        'appointment': appointment,
    }
    
    return render(request, 'appointments/edit_appointment.html', context)


@client_required
def cancel_appointment(request, appointment_id):
    """Cancel an appointment."""
    appointment = get_object_or_404(Appointment, id=appointment_id, client__user=request.user)
    
    if request.method == 'POST':
        appointment.delete()
        messages.success(request, 'Appointment cancelled successfully.')
        return redirect('appointment_list')
    
    context = {
        'appointment': appointment,
    }
    
    return render(request, 'appointments/cancel_appointment.html', context)
