from django.db import models
from usuario_mascota.models import Mascota
from post.models import Posts
from django.utils.timezone import now

class Comentarios(models.Model):
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
    texto = models.TextField()
    fecha_comentario = models.DateTimeField(default=now)
