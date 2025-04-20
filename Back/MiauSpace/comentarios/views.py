from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer
from .models import Comentarios
from .serializers import ComentariosSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


#IMPORTAR ESTAS LIBRERIAS PARA LA CONSULTA PERSONALIZADA
from django.db import connection
from rest_framework.response import Response
from rest_framework.views import APIView

class ComentariosViewset(viewsets.ModelViewSet):
    queryset = Comentarios.objects.all()
    serializer_class = ComentariosSerializer
    renderer_classes =[JSONRenderer]
    
    renderer_classes = [JSONRenderer]
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method in ['GET','POST','PUT', 'DELETE', 'PATCH']:
            # Checar si tenemos sesión 
            return [IsAuthenticated()]
        #Dar acceso a todo lo demas sin estar logueado
        return []
    
class ConsultaPersonalizadaAPIView(APIView):
    authentication_classes = [JWTAuthentication] #esta linea es necesaria para aplicar JWT
    permission_classes=[IsAuthenticated] #esta linea es necesaria para aplicar JWT
    def get(self, request, id):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM acciones_log WHERE usuario1 = %s", [id]) #tu consulta (obviamente crear la tabla en la bd)
            rows = cursor.fetchall()
            # Convertimos a lista de diccionarios
            data = [{'id': row[0], 'reaccion': row[1], 'usuario1': row[2], 'usuario2': row[3], 'post_id': row[4], 'estado': row[5], 'fecha': row[6]} for row in rows]
        return Response(data)