from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title

class CustomUser(AbstractUser):
    credits = models.IntegerField(default=100, null=True, blank=True)
    plate_number = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.username  # Direct access to the username field of AbstractUser
    
class Vehicle(models.Model):
    license_plate = models.CharField(max_length=20,unique=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="vehicles") #settings may need to change
    def __str__(self):
        return self.license_plate
    
class ParkingRecord(models.Model):
    Vehicle=models.ForeignKey(Vehicle,on_delete=models.CASCADE,related_name='parking_records')
    entry_time = models.DateTimeField(null=False, blank=False)
    exit_time = models.DateTimeField(null=True, blank=True)
    charge = models.FloatField(null=True, blank=True)
