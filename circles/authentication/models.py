from django.db import models

class User(models.Model):
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=10000)
    email = models.CharField(max_length=256)
    display_name = models.CharField(max_length=128, blank=True)
    date_created = models.DateField(blank=True)
    
    def __str__(self):
         return(self.username)

class WhitelistedEmails(models.Model):
    email = models.CharField(max_length=256)

    class Meta:
        verbose_name_plural = "Whitelisted Emails"

    def __str__(self):
         return(self.email)