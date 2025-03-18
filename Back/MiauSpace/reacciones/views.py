from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer
from .models import Reaccion
from .serializers import ReaccionSerializer

class ReaccionViewset(viewsets.ModelViewSet):
    queryset = Reaccion.objects.all()
    serializer_class = ReaccionSerializer
    renderer_classes = [JSONRenderer]