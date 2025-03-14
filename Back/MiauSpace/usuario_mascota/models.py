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

class Mascota(AbstractBaseUser):  # Se eliminó PermissionsMixin
    nombre_usuario = models.CharField(max_length=50, unique=True)
    especie = models.CharField(max_length=50)    
    edad = models.PositiveIntegerField()
    raza = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    sexo = models.CharField(max_length=50)
    ubicacion = models.CharField(max_length=250)
    foto_perfil = models.URLField()
    preferencias = models.TextField()
    is_active = models.BooleanField(default=True)  # Activo por defecto
    es_admin = models.BooleanField(default=False)  # Administrador o no
    join_date = models.DateTimeField(default=now)  # Fecha de registro

    objects = MascotaManager()  # Manager para crear usuarios

    USERNAME_FIELD = 'nombre_usuario'  # Campo usado para autenticación
    REQUIRED_FIELDS = ['especie', 'edad', 'raza', 'fecha_nacimiento', 'sexo', 'ubicacion', 'foto_perfil', 'preferencias']

    def __str__(self):
        return self.nombre_usuario

    @property
    def is_staff(self):
        return self.es_admin  # Indica si el usuario es admin