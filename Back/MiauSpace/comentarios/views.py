from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer
from .models import Comentarios
from .serializers import ComentariosSerializer

class ComentariosViewset(viewsets.ModelViewSet):
    queryset = Comentarios.objects.all()
    serializer_class = ComentariosSerializer
    renderer_classes =[JSONRenderer]