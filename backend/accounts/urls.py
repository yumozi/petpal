"""URL configuration for accounts app."""
from django.urls import include, path
from rest_framework_nested import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from accounts import views

router = routers.SimpleRouter()
router.register(r'users', views.UserViewSet)
router.register(r'seekers', views.SeekerProfileViewSet)
router.register(r'shelters', views.ShelterProfileViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path(r'', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
