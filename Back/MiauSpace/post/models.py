from django.db import models
from django.utils.timezone import now
from usuario_mascota.models import Mascota

class Posts(models.Model):
    mascota = models.ForeignKey(
        Mascota,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    titulo = models.CharField(max_length=250)
    fecha_creacion = models.DateTimeField(default=now)
    contenido = models.TextField()

    def __str__(self):
        return self.titulo

class Imagenes(models.Model):
    post = models.ForeignKey(
        Posts,
        on_delete=models.CASCADE,  # Si se elimina un post, se eliminan sus imágenes
        related_name='imagenes',  # Permite acceder a las imágenes con post.imagenes.all()
        null=True, 
        blank=True
    )
    imagen = models.ImageField(upload_to='imagenes/')

    def __str__(self):
        return f"Imagen de {self.post.titulo if self.post else 'Sin post'}"