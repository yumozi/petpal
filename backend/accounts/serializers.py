"""Serializers for the accounts app."""
from typing import Any

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from accounts.models import User, SeekerProfile, ShelterProfile


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the User model."""
    class Meta:
        model = User
        fields = ['id', 'url', 'username', 'email', 'is_seeker', 'profile_id', 'profile', 'shelter_id', 'shelter']

    id = serializers.PrimaryKeyRelatedField(read_only=True)
    profile_id = serializers.PrimaryKeyRelatedField(
        read_only=True,
        source='seeker_profile'
    )
    profile = serializers.HyperlinkedRelatedField(
        view_name='seekerprofile-detail',
        allow_null=True,
        read_only=True,
        source='seeker_profile'
    )
    shelter_id = serializers.PrimaryKeyRelatedField(
        read_only=True,
        source='shelter_profile'
    )
    shelter = serializers.HyperlinkedRelatedField(
        view_name='shelterprofile-detail',
        allow_null=True,
        read_only=True,
        source='shelter_profile'
    )

    def to_representation(self, instance: User) -> dict[str, Any]:
        """Return a representation of the user."""
        data = super().to_representation(instance)
        # Remove `shelter` when the user is a seeker, and vice versa
        if instance.is_seeker:
            data.pop('shelter_id')
            data.pop('shelter')
        else:
            data.pop('profile_id')
            data.pop('profile')
        return data

    def get_extra_kwargs(self) -> dict[str, Any]:
        """Return the extra keyword arguments for this serializer."""
        extra_kwargs = super().get_extra_kwargs()

        # Add uniqueness validators to the username and email fields
        validator = UniqueValidator(queryset=User.objects.all())
        extra_kwargs['username'] = {
            **extra_kwargs.get('username', {}),
            'validators': [validator]
        }
        extra_kwargs['email'] = {
            **extra_kwargs.get('email', {}),
            'validators': [validator]
        }

        return extra_kwargs


class CreateUserSerializer(UserSerializer):
    """Serializer for the User model when creating a new user."""
    class Meta:
        model = User
        fields = UserSerializer.Meta.fields + ['password']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'is_seeker': {'required': False},
        }

    password = serializers.CharField(min_length=8, write_only=True)

    def create(self, validated_data: dict[str, Any]) -> User:
        """Create a new user."""
        user = super().create(validated_data)  # type: User
        user.set_password(validated_data['password'])
        user.save()
        return user


class UpdateUserSerializer(UserSerializer):
    """Serializer for the User model when updating an existing user.

    This serializer does not allow the user to change their password or account
    type (i.e. the ``is_seeker`` field).
    """
    class Meta(UserSerializer.Meta):
        model = User
        fields = UserSerializer.Meta.fields
        extra_kwargs = {
            # No fields are required when updating an existing user
            'username': {'required': False, 'allow_blank': True},
            'email': {'required': False, 'allow_blank': True},
            'is_seeker': {'required': False, 'read_only': True},
        }

    def update(self, instance: User, validated_data: dict[str, Any]) -> User:
        """Update an existing user."""
        # Remove fields that the user is not allowed to change
        validated_data.pop('is_seeker', None)
        validated_data.pop('password', None)
        # Remove empty fields so that they cannot be used to overwrite
        # existing values, i.e. can't clear the email or username
        if validated_data.get('username') == '':
            validated_data.pop('username')
        if validated_data.get('email') == '':
            validated_data.pop('email')

        return super().update(instance, validated_data)


class SeekerProfileSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the Profile model."""
    class Meta:
        model = SeekerProfile
        fields = '__all__'


class ShelterProfileSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the Profile model."""
    class Meta:
        model = ShelterProfile
        fields = '__all__'
