from django.db import models

class Imagenes(models.Model):
    imagen = models.URLField()
    post = models.ForeignKey(
        'post.Posts',
        on_delete = models.SET_NULL,
        null=True,
        blank=True
        )