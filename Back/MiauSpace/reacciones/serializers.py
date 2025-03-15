from rest_framework import serializers
from .models import Reaccion

class ReaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaccion
        fields = '__all__'