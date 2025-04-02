from django.shortcuts import render
from rest_framework.renderers import JSONRenderer
from .models import Mascota
from .serializers import MascotaSerializer
from rest_framework import viewsets
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
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


@csrf_exempt
def actualizar_foto_perfil(request, id):
    if request.method == "PATCH":
        try:
            data = json.loads(request.body)
            nueva_foto = data.get("foto_perfil", None)  
            mascota = get_object_or_404(Mascota, id=id)

            if nueva_foto is not None:  
                mascota.foto_perfil = nueva_foto
                mascota.save()
                return JsonResponse({"mensaje": "Foto de perfil actualizada exitosamente.", "foto_perfil": mascota.foto_perfil}, status=200)
            else:
                return JsonResponse({"mensaje": "No se realizó ningún cambio. Campo 'foto_perfil' no enviado."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Formato JSON inválido."}, status=400)

    return JsonResponse({"error": "Método no permitido."}, status=405)

@csrf_exempt
def actualizar_mascota(request, id):
    if request.method == "PUT":
        mascota = get_object_or_404(Mascota, id=id)
        try:
            data = json.loads(request.body)
            
            mascota.especie = data.get("especie", mascota.especie)
            mascota.edad = data.get("edad", mascota.edad)
            mascota.raza = data.get("raza", mascota.raza)
            mascota.sexo = data.get("sexo", mascota.sexo)
            mascota.ubicacion = data.get("ubicacion", mascota.ubicacion)
            mascota.preferencias = data.get("preferencias", mascota.preferencias)
            
            mascota.save()
            
            return JsonResponse({"mensaje": "Mascota actualizada exitosamente."}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON inválido"}, status=400)
    
    return JsonResponse({"error": "Método no permitido"}, status=405)