from django.urls import path
from .views import NotificationListView, NotificationDetailView, NotificationReadView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('notifications/mark-as-read/<int:notification_id>/', NotificationReadView.as_view(), name='notification-mark-read'),
]
