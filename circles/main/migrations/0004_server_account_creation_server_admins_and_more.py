# Generated by Django 4.2.6 on 2023-11-01 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0008_alter_user_primary_color_alter_user_secondary_color'),
        ('main', '0003_conversation_creator_alter_circle_creator'),
    ]

    operations = [
        migrations.AddField(
            model_name='server',
            name='account_creation',
            field=models.BooleanField(default=1),
        ),
        migrations.AddField(
            model_name='server',
            name='admins',
            field=models.ManyToManyField(blank=True, to='authentication.user'),
        ),
        migrations.AddField(
            model_name='server',
            name='websocket_accept',
            field=models.BooleanField(default=1),
        ),
    ]
