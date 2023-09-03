from django.db import models
from django.utils import timezone
from authentication.models import User
    
class Server(models.Model): # The entire server. Should be merged with ServerInfo
    name = models.CharField(max_length=256)
    ip = models.CharField(max_length=256)

    def __str__(self):
         return(self.name)
    
    class Meta:
        verbose_name_plural = "Server"


class Circle(models.Model): # Any circle within the server. Circles can also be inside a Circle
    name = models.CharField(max_length=256, default="no-name")
    parent_circle = models.ForeignKey("self", on_delete=models.CASCADE, blank=True, null=True)
    parent_server = models.ForeignKey(Server, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        if self.parent_circle:
            return(f"{self.parent_circle} / {self.name}")
        
        elif self.parent_server:
            return(f"{self.parent_server} / {self.name}")

class Conversation(models.Model): # Any conversation. Has a list of the users in it
    name = models.CharField(max_length=256, default="no-name")
    date_time_created = models.DateTimeField(default=timezone.now)
    users = models.ManyToManyField(User, blank=True)
    parent_circle = models.ForeignKey(Circle, on_delete=models.CASCADE, blank=True, null=True)
    parent_server = models.ForeignKey(Server, on_delete=models.CASCADE, blank=True, null=True)
    

    def __str__(self):
        if self.parent_circle:
            return(f"{self.parent_circle} / '{self.name}'")
        
        elif self.parent_server:
            return(f"{self.parent_server} / '{self.name}'")

class Message(models.Model): # A message from a user. Has date, time, username and Conversation / Circle information (Message can belong to a specific Circle or a specific Conversation)
    text = models.CharField(max_length=2000, default="Empty Message")
    date_time_created = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        if len(self.text) > 75:
            return(f"[{self.user.username}] {self.text[:75]}...")
        
        else:
            return(f"[{self.user.username}] {self.text[:75]}")