from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Mascota

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
        # Si hay una nueva contraseña en la solicitud, la encripta antes de guardarla
        if "password" in validated_data:
            instance.password = make_password(validated_data.pop("password"))

        return super().update(instance, validated_data)
