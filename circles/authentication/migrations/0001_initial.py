# Generated by Django 4.2.4 on 2023-10-03 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=32)),
                ('password', models.CharField(max_length=10000)),
                ('email', models.CharField(max_length=256)),
                ('display_name', models.CharField(blank=True, max_length=128)),
                ('x', models.IntegerField(default=0)),
                ('y', models.IntegerField(default=0)),
                ('online', models.BooleanField(default=0)),
                ('current_conversation_type', models.CharField(default='normal', max_length=16)),
                ('date_created', models.DateField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='WhitelistedEmails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=256)),
            ],
            options={
                'verbose_name_plural': 'Whitelisted Emails',
            },
        ),
    ]
