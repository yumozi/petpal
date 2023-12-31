# Generated by Django 4.2.7 on 2023-11-12 22:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import phonenumber_field.modelfields


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0003_profile_remove_shelterprofile_user_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="BaseProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "phone_number",
                    phonenumber_field.modelfields.PhoneNumberField(
                        blank=True, max_length=128, region=None
                    ),
                ),
                ("location", models.CharField(max_length=100)),
                ("bio", models.TextField(blank=True)),
                (
                    "profile_image",
                    models.ImageField(blank=True, upload_to="seeker_profile_images"),
                ),
            ],
        ),
        migrations.RemoveField(
            model_name="user",
            name="profile",
        ),
        migrations.CreateModel(
            name="SeekerProfile",
            fields=[
                (
                    "baseprofile_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="accounts.baseprofile",
                    ),
                ),
            ],
            bases=("accounts.baseprofile",),
        ),
        migrations.CreateModel(
            name="ShelterProfile",
            fields=[
                (
                    "baseprofile_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="accounts.baseprofile",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("contact_email", models.EmailField(blank=True, max_length=254)),
                ("website", models.URLField(blank=True)),
            ],
            bases=("accounts.baseprofile",),
        ),
        migrations.DeleteModel(
            name="Profile",
        ),
        migrations.AddField(
            model_name="baseprofile",
            name="user",
            field=models.OneToOneField(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="seeker_profile",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
