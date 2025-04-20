import base64
from rest_framework import serializers
from .models import Imagenes, Posts

class ImagenesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagenes
        fields = ['id', 'post', 'imagen_base64']
        read_only_fields = ['id', 'post']

    def to_representation(self, instance):
        """Optimiza la representación de la imagen para la respuesta API"""
        representation = super().to_representation(instance)
        
        return representation
from .models import Posts, Imagenes

class PostsSerializer(serializers.ModelSerializer):
    imagenes = ImagenesSerializer(many=True, read_only=True)

    class Meta:
        model = Posts
        fields = ['id', 'titulo', 'fecha_creacion', 'contenido', 'mascota', 'imagenes']
        read_only_fields = ['id', 'fecha_creacion']

    def validate(self, validated_data):
        contenido = validated_data.get('contenido', '')
        imagenes_data = self.context.get('request').data.get('imagenes', [])

        if not contenido and not imagenes_data:
            raise serializers.ValidationError("La publicación debe tener contenido o al menos una imagen.")
        return validated_data

    def create(self, validated_data):
        imagenes_data = self.context.get('request').data.get('imagenes', [])

        post = Posts.objects.create(**validated_data)

        for imagen_base64 in imagenes_data:
            Imagenes.objects.create(
                post=post,
                imagen_base64=imagen_base64
            )

        return post


        
class PostImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model= Imagenes
        fields = '__all__'