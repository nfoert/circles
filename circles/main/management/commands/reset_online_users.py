from django.core.management.base import BaseCommand, CommandError
from authentication.models import User


class Command(BaseCommand):
    help = "Sets all Users as offline"

    def handle(self, *args, **options):
        
        # Sets all Users as offline
        # If the server had stopped while they were connected this prevents incorrect online user counts

        try:
            self.stdout.write(
                self.style.HTTP_INFO("\nⵔ Setting all Users as offline...")
            )

            User.objects.filter(online=True).update(online=False)


            self.stdout.write(
                self.style.SUCCESS("✓ Set all Users as offline.")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"✗ There was a problem setting all Users as offline! '{e}'")
            )