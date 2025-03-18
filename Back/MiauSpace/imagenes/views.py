from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer
from .models import Imagenes
from .serializers import ImagenesSerializer

class ImagenesViewset(viewsets.ModelViewSet):
    queryset = Imagenes.objects.all()
    serializer_class = ImagenesSerializer
    renderer_classes = [JSONRenderer]
