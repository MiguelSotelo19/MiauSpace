from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer
from .models import Reaccion
from .serializers import ReaccionSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

class ReaccionViewset(viewsets.ModelViewSet):
    queryset = Reaccion.objects.all()
    serializer_class = ReaccionSerializer
    renderer_classes = [JSONRenderer]
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method in ['GET','POST','PUT', 'DELETE', 'PATCH']:
            # Checar si tenemos sesión 
            return [IsAuthenticated()]
        #Dar acceso a todo lo demas sin estar logueado
        return []