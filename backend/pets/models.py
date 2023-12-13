from django.db import models
from django import forms
from django.contrib.auth.models import User

from accounts.models import ShelterProfile
from accounts.helpers import RandomFileName


class PetModel(models.Model):
    name = models.CharField(max_length=200)
    status = models.CharField(max_length=200, default="available")
    breed = models.CharField(max_length=200, null=False)
    gender = models.CharField(
        choices=[('male', 'Male'), ('female', 'Female')],
        max_length=10,
        null=False
    )
    size = models.IntegerField(null=False)
    age = models.IntegerField(null=False)
    description = models.CharField(max_length=200, null=True)
    colour = models.CharField(
        choices=[
            ('black', 'Black'),
            ('brown', 'Brown'),
            ('white', 'White'),
            ('grey', 'Grey'),
            ('blonde', 'Blonde'),
            ('orange', 'Orange'),
            ('other', 'Other')
        ],
        max_length=10,
        null=True
    )
    image = models.ImageField(
        blank=True,
        upload_to=RandomFileName('pet_images/'),
        max_length=None,
    )

    # Each pet listing belongs to a single shelter
    shelter = models.ForeignKey(
        ShelterProfile,
        on_delete=models.CASCADE,
        related_name='pet_listings'
    )