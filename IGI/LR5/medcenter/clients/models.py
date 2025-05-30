from django.db import models
from accounts.models import User

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    birth_date = models.DateField()

    def __str__(self):
        return f"{self.user.last_name} {self.user.first_name} ({self.user.username})"

