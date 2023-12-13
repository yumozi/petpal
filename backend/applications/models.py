from django.db import models
from django.contrib.auth.models import User
from accounts.models import SeekerProfile, ShelterProfile
from pets.models import PetModel
from django.utils import timezone
from django.conf import settings

# Create your models here.
class Application(models.Model):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    DENIED = 'denied'
    WITHDRAWN = 'withdrawn'

    STATUS = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (DENIED, 'Denied'),
        (WITHDRAWN, 'Withdrawn'),
    ]

    seeker = models.ForeignKey(SeekerProfile, on_delete=models.CASCADE, related_name='applications')
    shelter = models.ForeignKey(ShelterProfile, on_delete=models.CASCADE, related_name='applications', null=True, blank=True)
    pet = models.ForeignKey(PetModel, on_delete=models.CASCADE, related_name='applications')
    reason = models.TextField(max_length=500, null=True, blank=True)
    previous_pets = models.TextField(max_length=500, null=True, blank=True)
    previous_experience = models.TextField(max_length=500, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-updated_at']

    def save(self, *args, **kwargs):
        if not self.pk and self.pet.status != 'available':
            raise ValueError("Cannot create application for a pet that is not available.")
        
        if not self.shelter and self.pet:
            self.shelter = self.pet.shelter
        super().save(*args, **kwargs)
