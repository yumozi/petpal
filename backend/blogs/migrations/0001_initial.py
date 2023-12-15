# Generated by Django 5.0 on 2023-12-15 22:53

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0006_alter_baseprofile_location_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlogPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('content', models.TextField()),
                ('date_posted', models.DateTimeField(default=django.utils.timezone.now)),
                ('shelter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.shelterprofile')),
            ],
            options={
                'ordering': ['-date_posted'],
            },
        ),
    ]