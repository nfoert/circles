from django.apps import AppConfig



class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):
        from authentication.models import User

        # Set all users as offline when server starts up
        # If the server had stopped while they were connected this prevents incorrect online user counts
        User.objects.filter(online=True).update(online=False)
