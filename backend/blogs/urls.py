# blog/urls.py

from django.urls import path
from .views import BlogListView, BlogDetailView, ShelterBlogListView, CreateBlogPostView

urlpatterns = [
    path('blogs/', BlogListView.as_view(), name='blog-list'),
    path('blogs/<int:id>/', BlogDetailView.as_view(), name='blog-detail'),
    path('shelters/<int:shelter_id>/blogs/', ShelterBlogListView.as_view(), name='shelter-blog-list'),
    path('shelters/<int:shelter_id>/create-blog/', CreateBlogPostView.as_view(), name='create-blog-post'),
]
