from rest_framework import serializers
from .models import Mascota

class MascotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascota
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}  # Asegúrate de que la contraseña no se devuelva en las respuestas
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)  # Encripta la contraseña
        instance.save()
        return instance