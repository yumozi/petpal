from django.urls import path, include
from .views import ApplicationCreateView, ApplicationUpdateView, ApplicationListView, ApplicationDetailView

urlpatterns = [
    path('pet/<int:pet_id>/application/', ApplicationCreateView.as_view(), name='application-create'),
    path('application/<int:id>/', ApplicationUpdateView.as_view(), name='application-update'),
    path('application/detail/<int:id>/', ApplicationDetailView.as_view(), name='application-delete'),
    path('applications/', ApplicationListView.as_view(), name='application-list'),
]