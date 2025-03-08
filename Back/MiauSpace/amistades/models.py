from django.db import models
from django.utils.timezone import now
from usuario_mascota.models import Mascota

class Amistades(models.Model):
    estado = models.CharField(max_length=100)
    fecha_solicitud = models.DateTimeField(default=now)
    mascota_id = models.ForeignKey(
        Mascota,
        on_delete = models.SET_NULL,
        null=True,
        blank=True
        )

