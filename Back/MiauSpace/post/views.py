from django.shortcuts import render
from rest_framework import viewsets
from .models import Posts
from rest_framework.renderers import JSONRenderer
from .serializers import PostsSerializer
class PostsViewset(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostsSerializer
    renderer_classes = [JSONRenderer]