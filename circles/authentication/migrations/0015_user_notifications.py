# Generated by Django 4.2.6 on 2023-11-27 01:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0014_alter_user_settings_alter_user_stats'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='notifications',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
