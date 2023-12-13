from django.urls import path
from .views import ShelterCommentCreateView, ApplicationCommentCreateView, ShelterCommentListView, ApplicationCommentListView

urlpatterns = [
    path('shelters/<int:shelter_id>/comment/', ShelterCommentCreateView.as_view(), name='shelter-comment-create'),
    path('application/<int:application_id>/comment/', ApplicationCommentCreateView.as_view(), name='application-comment-create'),
    path('shelters/<int:shelter_id>/comments/', ShelterCommentListView.as_view(), name='shelter-comment-list'),
    path('application/<int:application_id>/comments/', ApplicationCommentListView.as_view(), name='application-comment-list'),
]