# Generated by Django 4.2.8 on 2023-12-10 21:28

import accounts.helpers
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pets', '0007_alter_petmodel_colour'),
    ]

    operations = [
        migrations.AddField(
            model_name='petmodel',
            name='image',
            field=models.ImageField(blank=True, upload_to=accounts.helpers.RandomFileName('pet_images/')),
        ),
    ]
