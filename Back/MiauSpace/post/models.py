from django.db import models
from django.utils.timezone import now
from usuario_mascota.models import Mascota

class Posts(models.Model):
    mascota = models.ForeignKey(
        Mascota,
        on_delete = models.SET_NULL,
        null=True,
        blank=True
        )
    titulo = models.CharField(max_length=250)
    fecha_creacion = models.DateTimeField(default=now)
    contenido = models.TextField()
    img = models.ForeignKey(
        'imagenes.Imagenes',
        on_delete = models.SET_NULL,
        null=True,
        blank=True
        )
    
