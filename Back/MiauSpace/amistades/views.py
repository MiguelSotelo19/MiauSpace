from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer
from .models import Amistades
from .serializers import AmistadesSerializer

class AmistadesViewset(viewsets.ModelViewSet):
    queryset = Amistades.objects.all()
    serializer_class = AmistadesSerializer
    renderer_classes = [JSONRenderer]