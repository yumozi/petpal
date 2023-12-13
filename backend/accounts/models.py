"""Models for the accounts app."""
from typing import Any, Union

from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser

from phonenumber_field.modelfields import PhoneNumberField

from accounts.helpers import RandomFileName


class User(AbstractUser):
    """A user of petpal, either a seeker or shelter owner."""
    is_seeker = models.BooleanField(default=True)

    @property
    def profile(self) -> Union['SeekerProfile', 'ShelterProfile']:
        """Return the correct profile for this user."""
        if self.is_seeker:
            return self.seeker_profile
        else:
            return self.shelter_profile

    @staticmethod
    @receiver(post_save, sender='accounts.User')
    def _post_save(
        sender: 'User', instance: 'User', created: bool, **kwargs: Any
    ) -> None:
        """Create or update a profile when a user is created or updated."""
        # New users: create a profile based on the user's type
        if created:
            if instance.is_seeker:
                SeekerProfile.objects.create(user=instance)
            else:
                ShelterProfile.objects.create(owner=instance)

        # Existing users: save the associated profile, if it exists
        if hasattr(instance, 'seeker_profile'):
            instance.seeker_profile.save()
        elif hasattr(instance, 'shelter_profile'):
            instance.shelter_profile.save()


class BaseProfile(models.Model):
    """A base class for seeker and shelter profiles."""
    phone_number = PhoneNumberField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(
        blank=True,
        upload_to=RandomFileName('profile_images/'),
        max_length=None,
    )


class SeekerProfile(BaseProfile):
    """A pet seeker's profile."""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        related_name='seeker_profile'
    )


class ShelterProfile(BaseProfile):
    """A pet shelter's profile."""
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        related_name='shelter_profile'
    )
    name = models.CharField(max_length=100)
    contact_email = models.EmailField(blank=True)
    website = models.URLField(blank=True)

