from django.urls import re_path

from . import consumers

# Thanks to LittleCabbage's answer here https://stackoverflow.com/questions/54107099/django-channels-no-route-found-for-path

websocket_urlpatterns = [
    re_path("main", consumers.MainConsumer.as_asgi()),
]