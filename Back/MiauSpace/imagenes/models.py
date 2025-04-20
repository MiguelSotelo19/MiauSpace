from django.db import models
from post.models import Posts

class Imagenes(models.Model):
    imagen = models.URLField()