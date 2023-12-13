from rest_framework.serializers import ModelSerializer
from .models import PetModel

class PetSerializer(ModelSerializer):
    class Meta:
        model = PetModel
        fields = '__all__'