# Generated by Django 4.2.8 on 2023-12-10 19:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pets', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='petmodel',
            name='age',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='petmodel',
            name='gender',
            field=models.CharField(choices=[('male', 'Male'), ('female', 'Female')], max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='petmodel',
            name='size',
            field=models.IntegerField(default=0),
        ),
    ]
