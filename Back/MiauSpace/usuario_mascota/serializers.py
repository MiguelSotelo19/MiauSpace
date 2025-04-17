from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Mascota
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['nombre_usuario'] = user.nombre_usuario
        #todos los atributos del modelo
        return token

class MascotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascota
        fields = '__all__'
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)  # Encripta la contraseña
        instance.save()
        return instance

    def update(self, instance, validated_data):
        validated_data.pop('password', None) 
        return super().update(instance, validated_data)

    def update_password(self, instance, password):
        if password:
            instance.set_password(password) 
            instance.save()
        return instance