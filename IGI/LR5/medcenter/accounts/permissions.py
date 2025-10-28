"""
Custom permissions and decorators for the medcenter application.
"""
from functools import wraps
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse
import logging

logger = logging.getLogger(__name__)


def role_required(*roles):
    """
    Decorator that checks if user has one of the specified roles.
    Usage: @role_required('client', 'doctor')
    """
    def decorator(view_func):
        @wraps(view_func)
        @login_required
        def _wrapped_view(request, *args, **kwargs):
            logger.info(f"Role check for user {request.user.username}")
            logger.info(f"Has profile: {hasattr(request.user, 'profile')}")
            
            if not hasattr(request.user, 'profile'):
                logger.error(f"User {request.user.username} has no profile")
                messages.error(request, 'Профиль пользователя не найден.')
                return redirect('account_login')
            
            user_role = request.user.profile.role
            logger.info(f"User role: {user_role}, Required roles: {roles}")
            logger.info(f"Role check result: {user_role in roles}")
            
            if user_role not in roles:
                logger.warning(f"Access denied for user {request.user.username} with role {user_role}")
                messages.error(request, 'У вас нет доступа к этой странице.')
                return redirect('no_access')
            
            logger.info(f"Access granted for user {request.user.username}")
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator


def client_required(view_func):
    """Decorator that requires user to be a client."""
    return role_required('client')(view_func)


def doctor_required(view_func):
    """Decorator that requires user to be a doctor."""
    return role_required('doctor')(view_func)


def admin_required(view_func):
    """Decorator that requires user to be an admin."""
    return role_required('admin')(view_func)


def client_or_doctor_required(view_func):
    """Decorator that requires user to be either a client or doctor."""
    return role_required('client', 'doctor')(view_func)


class RoleRequiredMixin:
    """
    Mixin for class-based views that requires specific roles.
    Usage: class MyView(RoleRequiredMixin, View):
               allowed_roles = ['client', 'doctor']
    """
    allowed_roles = []
    
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('account_login')
        
        if not hasattr(request.user, 'profile'):
            messages.error(request, 'Профиль пользователя не найден.')
            return redirect('account_login')
        
        if request.user.profile.role not in self.allowed_roles:
            messages.error(request, 'У вас нет доступа к этой странице.')
            return redirect('no_access')
        
        return super().dispatch(request, *args, **kwargs)