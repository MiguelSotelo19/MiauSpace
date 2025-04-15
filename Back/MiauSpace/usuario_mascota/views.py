import json

from django.conf import settings
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt

from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer

from .models import Mascota
from .serializers import MascotaSerializer

User = get_user_model()
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MascotaViewset(viewsets.ModelViewSet):
    queryset = Mascota.objects.all()
    serializer_class = MascotaSerializer
    renderer_classes = [JSONRenderer]
    
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method in ['GET','POST','PUT', 'DELETE', 'PATCH']:
            # Checar si tenemos sesión 
            return [IsAuthenticated()]
        #Dar acceso a todo lo demas sin estar logueado
        return []

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

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
                return JsonResponse({
                    "mensaje": "Foto de perfil actualizada exitosamente.",
                    "foto_perfil": mascota.foto_perfil
                }, status=200)
            else:
                return JsonResponse({
                    "mensaje": "No se realizó ningún cambio. Campo 'foto_perfil' no enviado."
                }, status=200)

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

@csrf_exempt
def enviar_correo_recuperacion(request):
    if request.method == "POST":
        data = json.loads(request.body)
        correo = data.get("correo")

        try:
            user = User.objects.get(correo=correo)
        except User.DoesNotExist:
            return JsonResponse({"error": "Correo no encontrado"}, status=404)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        frontend_url = "http://localhost:5173"

        reset_url = f"{frontend_url}/recuperar-contraseña/{uid}/{token}/"

        message = f"""
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 30px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
                        <div style="text-align: center;">
                            <img src="https://clinicaveterinariaelrincon.com/wp-content/uploads/2025/02/IMG-20250131-WA0012.png" alt="Logo" style="width: 120px; margin-bottom: 20px;"/>
                            <h2 style="color: #007bff; font-size: 24px; font-weight: bold;">¡Recupera tu Contraseña!</h2>
                        </div>
                        <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                            Estimado usuario,
                        </p>
                        <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                            Hemos recibido una solicitud para restablecer tu contraseña. Si tú hiciste esta solicitud, haz clic en el siguiente enlace para restablecer tu contraseña:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="{reset_url}" style="background-color: #28a745; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
                                Restablecer Contraseña
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #777777; text-align: center; line-height: 1.5;">
                            Si no solicitaste este cambio, por favor ignora este correo.
                        </p>
                        <footer style="text-align: center; font-size: 12px; color: #999999; margin-top: 30px;">
                            <p>Gracias por usar nuestro servicio.</p>
                            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                        </footer>
                    </div>
                </body>
            </html>
        """

        subject = "Recuperación de contraseña"

        send_mail(
            subject,
            "",
            settings.EMAIL_HOST_USER,
            [correo],
            fail_silently=False,
            html_message=message,
        )

        return JsonResponse({"mensaje": "Correo enviado exitosamente para recuperación de contraseña."})

    return JsonResponse({"error": "Método no permitido."}, status=405)


@csrf_exempt
def restablecer_contrasenia(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, ValueError, TypeError):
        return JsonResponse({"error": "Usuario no válido"}, status=400)

    if not default_token_generator.check_token(user, token):
        return JsonResponse({"error": "Token inválido o expirado"}, status=400)

    if request.method == "POST":
        data = json.loads(request.body)
        nueva_contraseña = data.get("nueva_contraseña")
        if nueva_contraseña:
            user.set_password(nueva_contraseña)
            user.save()
            return JsonResponse({"mensaje": "Contraseña actualizada correctamente"})
        return JsonResponse({"error": "Contraseña no proporcionada"}, status=400)

    return JsonResponse({"mensaje": "Token válido. Puedes restablecer tu contraseña."})
