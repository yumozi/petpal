# Generated by Django 4.2.8 on 2023-12-10 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pets', '0002_alter_petmodel_age_alter_petmodel_gender_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='petmodel',
            name='gender',
            field=models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='other', max_length=10),
        ),
    ]
