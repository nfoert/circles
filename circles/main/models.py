from django.db import models
from django.utils import timezone
from authentication.models import User
from django.core.exceptions import ValidationError

class Server(models.Model):
    name = models.CharField(max_length=256)
    ip = models.CharField(max_length=256)
    admins = models.ManyToManyField(User, blank=True)
    production = models.BooleanField(default=1)
    account_creation = models.BooleanField(default=1)
    websocket_accept = models.BooleanField(default=1)

    def __str__(self):
        return(self.name)
    
    class Meta:
        verbose_name_plural = "Server"


class Circle(models.Model): # Any circle within the server. Circles can also be inside a Circle
    name = models.CharField(max_length=256, default="no-name")
    parent_circle = models.ForeignKey("self", on_delete=models.CASCADE, blank=True, null=True)
    parent_server = models.ForeignKey(Server, on_delete=models.SET_NULL, blank=True, null=True)
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="circle_creator")

    def __str__(self):
        if self.parent_circle:
            string = self.parent_circle or ""
            return(f"{string} / {self.name}")
        
        elif self.parent_server:
            string = self.parent_server or ""
            return(f"{string} / {self.name}")
        
        else:
            return(f"/!\ --- {self.name}")

class Conversation(models.Model): # A private conversation between users. Has a list of the users in it
    name = models.CharField(max_length=256, default="no-name")
    date_time_created = models.DateTimeField(default=timezone.now)
    users = models.ManyToManyField(User, blank=True)
    creator = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL, related_name="conversation_creator")
    

    def __str__(self):
        if self.users.count() == 1:
            return(f"'{self.name}' with {self.users.count()} person")
        
        else:
            return(f"'{self.name}' with {self.users.count()} people")
        

class Message(models.Model): # A message from a user. Has date, time, username and Conversation / Circle information (Message can belong to a specific Circle or a specific Conversation)
    text = models.CharField(max_length=2000, default="Empty Message")
    date_time_created = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, blank=True, null=True)
    circle = models.ForeignKey(Circle, on_delete=models.SET_NULL, blank=True, null=True)
    current_conversation_type = models.CharField(max_length=16, default="normal")

    def __str__(self):
        if len(self.text) > 75:
            return(f"[{self.user.username}] {self.text[:75]}...")
        
        else:
            return(f"[{self.user.username}] {self.text[:75]}")
        
    def clean(self, *args, **kwargs):
        if self.conversation and self.circle:
            raise ValidationError("Message should be in a Conversation or a Circle, but not both.")
        
        if not self.user:
            raise ValidationError("A user is required.")
        
        return super().clean()