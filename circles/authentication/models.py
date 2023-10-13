from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Thanks to Stefan Collier's answer here https://stackoverflow.com/questions/13747886/how-do-i-stop-this-cascading-delete-from-happening-in-django
# Thanks to blue-hope's answer here https://stackoverflow.com/questions/51308530/attributeerror-type-object-myuser-has-no-attribute-username-field
class User(AbstractBaseUser):
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=10000)
    email = models.CharField(max_length=256)
    display_name = models.CharField(max_length=128, blank=True)
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    online = models.BooleanField(default=0)
    location_server = models.ForeignKey("main.Server", on_delete=models.SET_NULL, blank=True, null=True)
    location_circle = models.ForeignKey("main.Circle", on_delete=models.SET_NULL, blank=True, null=True)
    current_conversation = models.ForeignKey("main.Conversation", on_delete=models.SET_NULL, blank=True, null=True)
    current_conversation_type = models.CharField(max_length=16, default="normal")
    followers = models.ManyToManyField("self", blank=True)
    date_created = models.DateField(blank=True)

    USERNAME_FIELD = "username"
    
    def __str__(self):
        return(self.username)

class WhitelistedEmails(models.Model):
    email = models.CharField(max_length=256)

    class Meta:
        verbose_name_plural = "Whitelisted Emails"

    def __str__(self):
        return(self.email)