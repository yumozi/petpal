from django.db import models
from accounts.models import ShelterProfile
from django.utils import timezone

class BlogPost(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    date_posted = models.DateTimeField(default=timezone.now)
    shelter = models.ForeignKey(ShelterProfile, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-date_posted']

    def __str__(self):
        return self.title