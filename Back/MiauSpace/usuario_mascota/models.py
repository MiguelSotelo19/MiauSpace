from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.timezone import now

class MascotaManager(BaseUserManager):
    def create_user(self, nombre_usuario, password=None, **extra_fields):
        if not nombre_usuario:
            raise ValueError('El nombre de usuario es obligatorio')
        
        user = self.model(nombre_usuario=nombre_usuario, **extra_fields)
        if password:
            user.set_password(password)  # Encripta la contraseña
        else:
            raise ValueError('La contraseña es obligatoria')
            
        user.save(using=self._db)
        return user

    def create_superuser(self, nombre_usuario, password=None, **extra_fields):
        extra_fields.setdefault('es_admin', True)
        return self.create_user(nombre_usuario, password, **extra_fields)

class Mascota(AbstractBaseUser):
    nombre_usuario = models.CharField(max_length=50, unique=True)
    especie = models.CharField(max_length=50, blank=True, null=True)  
    edad = models.PositiveIntegerField(blank=True, null=True)
    raza = models.CharField(max_length=50, blank=True, null=True)
    fecha_nacimiento = models.DateField()
    sexo = models.CharField(max_length=50, blank=True, null=True)
    ubicacion = models.CharField(max_length=250, blank=True, null=True)
    foto_perfil = models.TextField(null=True, blank=True) 
    preferencias = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    es_admin = models.BooleanField(default=False)
    join_date = models.DateTimeField(default=now)

    objects = MascotaManager()  # Manager para crear usuarios

    USERNAME_FIELD = 'nombre_usuario'  # Campo usado para autenticación
    REQUIRED_FIELDS = ['fecha_nacimiento']

    def __str__(self):
        return self.nombre_usuario

    @property
    def is_staff(self):
        return self.es_admin  # Indica si el usuario es admin