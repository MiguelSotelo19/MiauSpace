from django.shortcuts import render
from rest_framework import viewsets
from .models import Posts, Imagenes
from rest_framework.renderers import JSONRenderer
from .serializers import PostsSerializer, PostImagenSerializer
class PostsViewset(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostsSerializer
    renderer_classes = [JSONRenderer]
    
    
class PostsImgViewset(viewsets.ModelViewSet):
    queryset = Imagenes.objects.all()
    serializer_class = PostImagenSerializer
    renderer_classes = [JSONRenderer]