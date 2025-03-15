from django.shortcuts import render
from rest_framework.renderers import JSONRenderer
from .models import Mascota
from .serializers import MascotaSerializer
from rest_framework import viewsets
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import json

class MascotaViewset(viewsets.ModelViewSet):
    queryset = Mascota.objects.all()
    serializer_class = MascotaSerializer
    renderer_classes = [JSONRenderer]

@csrf_exempt
def login_mascota(request):
    if request.method == "POST":
        data = json.loads(request.body)

        nombre_usuario = data.get("nombre_usuario")
        password = data.get("password")

        user = authenticate(username=nombre_usuario, password=password)

        if user is not None:
            login(request, user)

            request.session["usuario"] = {
                "nombre_usuario": user.nombre_usuario,
                "especie": user.especie,
                "edad": user.edad,
                "raza": user.raza,
                "fecha_nacimiento": str(user.fecha_nacimiento),
                "sexo": user.sexo,
                "ubicacion": user.ubicacion,
                "foto_perfil": user.foto_perfil,
                "preferencias": user.preferencias
            }

            return JsonResponse({
                "mensaje": "Login exitoso",
                "sessionid": request.session.session_key  
            })
        else:
            return JsonResponse({"error": "Credenciales incorrectas"}, status=401)

    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def logout_mascota(request):
    logout(request)
    request.session.flush()  
    return JsonResponse({"mensaje": "Logout exitoso"})


