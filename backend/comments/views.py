from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Comment
from applications.models import Application
from .serializers import CommentSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from accounts.models import ShelterProfile


class ApplicationCommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, application_id):

        # Make sure the user is the seeker or the shelter associated with the application
        if request.user.is_seeker:
            application = get_object_or_404(Application, id=application_id, seeker=request.user.profile)
        
        else:
            application = get_object_or_404(Application, id=application_id, shelter=request.user.profile)
        
        content_type = ContentType.objects.get_for_model(Application)
        comment_data = {
            'content_type': content_type.id,
            'object_id': application.id,
            'text': request.data.get('comment'),
        }

        serializer = CommentSerializer(data=comment_data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ShelterCommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, shelter_id):
        shelter = get_object_or_404(ShelterProfile, id=shelter_id)
        content_type = ContentType.objects.get_for_model(ShelterProfile)
        comment_data = {
            'content_type': content_type.id,
            'object_id': shelter.id,
            'text': request.data.get('comment'),
        }

        serializer = CommentSerializer(data=comment_data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ShelterCommentListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination()

    def get(self, request, shelter_id):
        shelter = get_object_or_404(ShelterProfile, id=shelter_id)
        content_type = ContentType.objects.get_for_model(ShelterProfile)
        comments = Comment.objects.filter(
            content_type=content_type, object_id=shelter.id
        ).order_by('-created_at')

        page = self.pagination_class.paginate_queryset(comments, request)
        if page is not None:
            serializer = CommentSerializer(page, many=True)
            return self.pagination_class.get_paginated_response(serializer.data)

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
class ApplicationCommentListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination()

    def get(self, request, application_id):
        application = get_object_or_404(Application, id=application_id)

        # Ensure only specific shelter and pet seeker can view comments
        if not (request.user.id == application.seeker.id or request.user.id == application.shelter.id):
            return Response({'detail': 'Not authorized to view these comments'}, status=403)

        content_type = ContentType.objects.get_for_model(Application)
        comments = Comment.objects.filter(
            content_type=content_type, object_id=application.id
        ).order_by('-created_at')

        page = self.pagination_class.paginate_queryset(comments, request)
        if page is not None:
            serializer = CommentSerializer(page, many=True)
            return self.pagination_class.get_paginated_response(serializer.data)

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
