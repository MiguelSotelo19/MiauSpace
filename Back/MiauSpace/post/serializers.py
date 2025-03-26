from rest_framework import serializers
from .models import Posts, Imagenes

class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = '__all__'
        
class PostImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model= Imagenes
        fields = '__all__'