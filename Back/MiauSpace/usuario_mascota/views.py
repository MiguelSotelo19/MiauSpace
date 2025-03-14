from django.shortcuts import render
from rest_framework.renderers import JSONRenderer
from .models import Mascota
from .serializers import MascotaSerializer
from rest_framework import viewsets

class MascotaViewset(viewsets.ModelViewSet):
    queryset = Mascota.objects.all()

    serializer_class = MascotaSerializer

    renderer_classes = [JSONRenderer]