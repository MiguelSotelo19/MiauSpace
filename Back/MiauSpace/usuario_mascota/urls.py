from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import *


router = SimpleRouter()
router.register(r'api',MascotaViewset) 

urlpatterns=[
    path('', include(router.urls)),
    path("login/", login_mascota, name="login_mascota"),
    path("logout/", logout_mascota, name="logout_mascota"),
    path("foto_perfil/<int:id>/", actualizar_foto_perfil, name="actualizar_foto_perfil"),
    path("actualizar/<int:id>/", actualizar_mascota, name="actualizar_mascota"),
    path("enviar_correo_recuperacion/", enviar_correo_recuperacion, name='enviar_correo_recuperacion'),
    path('recuperar-contrasenia/<uidb64>/<token>/', restablecer_contrasenia, name='restablecer_contrasenia'),
]
