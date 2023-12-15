# blog/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import BlogPost
from .serializers import BlogPostSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from accounts.models import ShelterProfile

class BlogListView(generics.ListAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]

class BlogDetailView(APIView):

    def get(self, request, id):
        blog_post = get_object_or_404(BlogPost, id=id)
        serializer = BlogPostSerializer(blog_post)
        return Response(serializer.data)

    def put(self, request, id):
        blog_post = get_object_or_404(BlogPost, id=id)
        if blog_post.shelter.user != request.user:
            return Response({"error": "You do not have permission to edit this blog post"}, status=status.HTTP_403_FORBIDDEN)
        serializer = BlogPostSerializer(blog_post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ShelterBlogListView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        shelter_id = self.kwargs['shelter_id']
        return BlogPost.objects.filter(shelter=shelter_id)
    
class CreateBlogPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, shelter_id):
        user = request.user

        # Check if user is anonymous
        if user.is_anonymous:
            return Response({"error": "You do not have permission to create a blog post"}, status=status.HTTP_403_FORBIDDEN)

        # Check if user is associated with the ShelterProfile
        if user.profile.__class__.__name__ != "ShelterProfile":
            return Response({"error": "You do not have permission to create a blog post for this shelter"}, status=status.HTTP_403_FORBIDDEN)
        
        # Ensure the shelter exists
        get_object_or_404(ShelterProfile, id=shelter_id)

        # Copy request data and add shelter information
        data = request.data.copy()
        data['shelter'] = user.profile.id

        # Create a new BlogPost instance
        serializer = BlogPostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)