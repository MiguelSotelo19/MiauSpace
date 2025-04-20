from django.db import models
from django.utils.timezone import now
from usuario_mascota.models import Mascota

class Posts(models.Model):
    mascota = models.ForeignKey(
        Mascota, on_delete=models.SET_NULL, null=True, blank=True
    )
    titulo = models.CharField(max_length=250)
    fecha_creacion = models.DateTimeField(default=now)
    contenido = models.TextField(null=True, blank=True)


    def __str__(self):
        return self.titulo


class Imagenes(models.Model):
    post = models.ForeignKey(
        Posts,
        on_delete=models.CASCADE,
        related_name='imagenes',
        null=True,
        blank=True,
    )
    imagen_base64 = models.TextField(null=True, blank=True)  # Permitir null

    def __str__(self):
        return f"Imagen de {self.post.titulo if self.post else 'Sin post'}"
