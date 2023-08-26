from django.db import models

class ServerInfo(models.Model):
    name = models.CharField(max_length=256)
    ip = models.CharField(max_length=256)

    def __str__(self):
         return(self.name)
    
    class Meta:
        verbose_name_plural = "Server Info"