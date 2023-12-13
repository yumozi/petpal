from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'seeker', 'shelter', 'pet', 'reason', 'previous_pets', 'previous_experience', 'status', 'created_at', 'updated_at']

    def validate(self, data):
        if data['pet'].status != 'available':
            raise serializers.ValidationError("This pet is not available for adoption.")
        return data
