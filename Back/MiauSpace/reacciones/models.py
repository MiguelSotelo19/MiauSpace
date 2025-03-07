from django.db import models
from usuario_mascota.models import Mascota
from post.models import Posts
from django.utils.timezone import now

class Reaccion(models.Model):
    post = models.ForeignKey(
        Posts,
        on_delete = models.SET_NULL,
        null=True,
        blank=True
        )
    mascota = models.ForeignKey(
        Mascota,
        on_delete = models.SET_NULL,
        null=True,
        blank=True
        )
    tipo_reaccion = models.CharField(max_length=50)
    fecha_reaccion = models.DateTimeField(default=now)
