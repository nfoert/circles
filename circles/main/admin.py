from django.contrib import admin
from main.models import Server, Circle, Conversation, Message

admin.site.register(Server)
admin.site.register(Circle)
admin.site.register(Conversation)
admin.site.register(Message)