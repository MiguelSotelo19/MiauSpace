from django.db import models

class Mascota(models.Model):
    nombre_usuario = models.CharField(max_length=50)
    especie = models.CharField(max_length=50)    
    edad = models.PositiveIntegerField()
    raza = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    sexo = models.CharField(max_length=50)
    ubicacion = models.CharField(max_length=250)
    foto_perfil = models.URLField()
    preferencias = models.TextField()
    contraseña = models.CharField(max_length=250)
    es_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre_usuario
