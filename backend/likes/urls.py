from django.urls import path
from .views import LikeCreateView, GetLikesView, UnlikeView

urlpatterns = [
    path('like/<int:post_id>/', LikeCreateView.as_view(), name='like-create'),
    path('get-likes/<int:post_id>/', GetLikesView.as_view(), name='get-likes'),  # Add this line
    path('unlike/<int:post_id>/', UnlikeView.as_view(), name='unlike-post'),  # Add this line

]