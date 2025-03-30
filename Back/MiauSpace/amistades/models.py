from django.db import models
from django.utils.timezone import now
from usuario_mascota.models import Mascota

class Amistades(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('rechazado', 'Rechazado'),
    ]
    
    mascota_solicitante = models.ForeignKey(
        Mascota,
        on_delete=models.CASCADE,
        related_name="solicitudes_enviadas"
    )
    mascota_receptora = models.ForeignKey(
        Mascota,
        on_delete=models.CASCADE,
        related_name="solicitudes_recibidas"
    )
    estado = models.CharField(max_length=10, choices=ESTADOS, default='pendiente')
    fecha_solicitud = models.DateTimeField(default=now)

    class Meta:
        unique_together = ('mascota_solicitante', 'mascota_receptora')

    def __str__(self):
        return f"{self.mascota_solicitante} → {self.mascota_receptora} ({self.estado})"

    def aceptar(self):
        """Acepta la solicitud de amistad."""
        if self.estado == 'pendiente':
            self.estado = 'aceptado'
            self.save()

    def rechazar(self):
        """Rechaza la solicitud de amistad."""
        if self.estado == 'pendiente':
            self.estado = 'rechazado'
            self.save()
            
    def eliminar(self):
        """Elimina la relación de amistad si está aceptada."""
        if self.estado == 'aceptado':
            self.delete()