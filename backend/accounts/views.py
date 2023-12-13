"""Views for the accounts app."""
from typing import Any, Callable, Optional, Type

from rest_framework import permissions
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import View

from accounts.models import User, SeekerProfile, ShelterProfile
from accounts.serializers import (
    UserSerializer,
    CreateUserSerializer,
    UpdateUserSerializer,
    SeekerProfileSerializer,
    ShelterProfileSerializer
)
from applications.models import Application


class UnauthenticatedPost(permissions.BasePermission):
    """Allow POST requests from unauthenticated users."""
    def has_permission(self, request: Request, _: View) -> bool:
        """Return True if the request is a POST request."""
        return request.method == 'POST'


class IsOwner(permissions.BasePermission):
    """Allow access to owners of an object.

    Class Attributes:
        OWNER_ATTRIBUTE_NAMES: A list of attribute names that can be used to
            retrieve the owner of an object.
    """
    OWNER_ATTRIBUTE_NAMES: list[str] = [
        'user', 'owner', 'author', 'creator', 'created_by', 'created_by_user'
    ]

    def __init__(self, key: Optional[Callable[[Any], Optional[User]]] = None) \
            -> None:
        """Initialize the permission.

        Args:
            key: A function that takes an object and returns its owner.
                Because the owner is a User object, the function must take
                a single argument of any type and return a User object,
                or ``None`` if the object has no owner.
        """
        self.key = key or self._default_key

    def has_object_permission(self, request: Request, _: View, obj: Any) -> bool:
        """Return True if the request is from the owner of the object."""
        return request.user == self.key(obj)

    def __call__(self, *args: Any, **kwds: Any) -> Any:
        """Return this object, so that it can be used like a function."""
        return self

    @staticmethod
    def _default_key(obj: Any) -> Optional[User]:
        """The default key function.

        If ``obj`` is a User object, return it. Otherwise, this function
        looks for one of the attributes in ``OWNER_ATTRIBUTE_NAMES`` and
        returns its value.
        """
        if isinstance(obj, User):
            return obj
        for name in IsOwner.OWNER_ATTRIBUTE_NAMES:
            if hasattr(obj, name):
                return getattr(obj, name)
        return None


class ReadOnly(permissions.BasePermission):
    """Allow read-only access."""
    def has_permission(self, request: Request, _: View) -> bool:
        """Return True if the request is a GET request."""
        return request.method in permissions.SAFE_METHODS


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    """API endpoint for creating, retrieving, updating, and deleting users."""
    queryset = User.objects.all()
    permission_classes = [
        # Allow admins to do anything
        permissions.IsAdminUser |
        # Allow authenticated users to view their own data
        permissions.IsAuthenticated & IsOwner |
        # Allow unauthenticated users to create accounts
        UnauthenticatedPost
    ]

    def get_serializer_class(self) -> Type[UserSerializer]:
        """Return the serializer class to use for this request."""
        if self.action == 'create':
            return CreateUserSerializer
        elif self.action in ['update', 'partial_update']:
            return UpdateUserSerializer
        else:
            return UserSerializer

    @action(detail=False, methods=['GET'])
    def me(self, request: Request) -> Response:
        """Return the currently logged in user."""
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


class HasActiveApplicationWithShelter(permissions.BasePermission):
    """Allow access to shelters that have an active application with the seeker.

    This permission is intended to be used with the ShelterProfileViewSet.
    """
    def has_object_permission(
        self, request: Request, _: View, obj: SeekerProfile
    ) -> bool:
        """Return whether ``request.user`` can access ``obj``.

        Args:
            request: The request object.
            obj: The seeker profile object.

        Returns:
            True if ``request.user`` is a shelter that has an active
            application with the seeker profile represented by ``obj``,
            and False otherwise.
        """
        # Ensure that the user is a shelter
        print(f'profile pic url: {obj.profile_image.url}')
        if request.user.is_seeker:
            return False

        # Get all the applications associated with the seeker,
        # that have a status of pending
        applications = Application.objects.filter(
            seeker=obj.user,
            status=Application.PENDING
        )

        # If any of the applications are with the shelter, return True
        return any(
            application.shelter == request.user.profile
            for application in applications
        )


class SeekerProfileViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    """API endpoint for retrieving and updating seeker profiles."""
    queryset = SeekerProfile.objects.all()
    serializer_class = SeekerProfileSerializer
    permission_classes = [
        # Allow admins to do anything
        permissions.IsAdminUser |
        # Allow authenticated users to view their own data
        # Allow shelters to view pet seekers' profiles if they have an active application with the shelter
        (permissions.IsAuthenticated & (IsOwner | HasActiveApplicationWithShelter))
    ]


class ShelterProfileViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    """API endpoint for retrieving and updating shelter profiles."""
    queryset = ShelterProfile.objects.all()
    serializer_class = ShelterProfileSerializer
    permission_classes = [
        # Allow admins to do anything
        permissions.IsAdminUser |
        # Allow unauthenticated users access to read-only views
        ReadOnly |
        # Allow authenticated users to edit their own data
        (permissions.IsAuthenticated & IsOwner)
    ]
