from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import Mascota

class MascotaCreationForm(UserCreationForm):
    class Meta:
        model = Mascota
        fields = ['nombre_usuario', 'especie', 'edad', 'raza', 'fecha_nacimiento', 
                  'sexo', 'ubicacion', 'foto_perfil', 'preferencias', 
                  'password1', 'password2']

class MascotaLoginForm(AuthenticationForm):
    pass  
