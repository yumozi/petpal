from django.contrib.auth.models import User
from django.db import models
from blogs.models import BlogPost  # Assuming you need to access BlogPost
from django.utils import timezone
from petpal import settings


class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    date_liked = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} likes {self.post.title}"
