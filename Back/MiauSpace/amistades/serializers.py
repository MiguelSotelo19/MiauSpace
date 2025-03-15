from rest_framework import serializers
from .models import Amistades

class AmistadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amistades
        fields = '__all__'
