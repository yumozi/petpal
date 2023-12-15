# views.py
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from .models import Like
from .serializers import LikeSerializer
from blogs.models import BlogPost  # Assuming you need to access BlogPost

class LikeCreateView(APIView):
    def post(self, request, post_id):
        try:
            # Get the BlogPost object
            post = BlogPost.objects.get(pk=post_id)

            # Check if the user has already liked the post
            existing_like = Like.objects.filter(user=request.user, post=post).first()

            if existing_like:
                # User has already liked the post, return an error
                return JsonResponse({'detail': 'You have already liked this post.'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a new Like object with the current user
            like = Like(user=request.user, post=post)
            like.save()

            # Return a success response
            serializer = LikeSerializer(like)
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Blog post does not exist.'}, status=status.HTTP_404_NOT_FOUND)


class UnlikeView(APIView):
    def post(self, request, post_id):
        try:
            # Get the BlogPost object
            post = BlogPost.objects.get(pk=post_id)

            # Check if the user has liked the post
            existing_like = Like.objects.filter(user=request.user, post=post).first()

            if not existing_like:
                # User hasn't liked the post, return an error
                return JsonResponse({'detail': 'You have not liked this post.'}, status=status.HTTP_400_BAD_REQUEST)

            # Delete the Like object
            existing_like.delete()

            # Return a success response
            return JsonResponse({'detail': 'You have unliked this post.'}, status=status.HTTP_200_OK)

        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Blog post does not exist.'}, status=status.HTTP_404_NOT_FOUND)

class GetLikesView(APIView):
    def get(self, request, post_id):
        try:
            # Get the BlogPost object
            post = BlogPost.objects.get(pk=post_id)

            # Get all the Likes related to this BlogPost
            likes = Like.objects.filter(post=post)

            # Extract usernames from the likes
            usernames = [like.user.username for like in likes]

            # Return the list of usernames in the response
            return JsonResponse({'likes': usernames}, status=status.HTTP_200_OK)

        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Blog post does not exist.'}, status=status.HTTP_404_NOT_FOUND)
