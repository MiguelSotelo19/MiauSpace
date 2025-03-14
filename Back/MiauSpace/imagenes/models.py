from django.db import models

class Imagenes(models.Model):
    imagen = models.URLField()
    