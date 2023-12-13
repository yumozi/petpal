from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ApplicationSerializer
from .models import Application
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from pets.models import PetModel
from django.urls import reverse
from notifications.serializers import NotificationSerializer
from django.contrib.contenttypes.models import ContentType

class ApplicationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pet_id):
        user = request.user

        if not user.profile.__class__.__name__ == "SeekerProfile":
            return Response({"error": "You do not have permission to create this application"}, status=status.HTTP_403_FORBIDDEN)
        
        pet = get_object_or_404(PetModel, id=pet_id)
        data = {
            'seeker': user.profile.id,
            'pet': pet_id,
        }

        # Check if user has already applied for this pet
        if Application.objects.filter(seeker=user.profile, pet=pet).exists():
            return Response({"error": "You have already applied for this pet"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ApplicationSerializer(data=data)
        
        # Checks if pet is available
        if serializer.is_valid(): 
            application = serializer.save()

            # CREATION OF A NOTIFICATION
            # Generate the link to the application detail view
            app_detail_url = request.build_absolute_uri(reverse('application-delete', kwargs={'id': application.id}))
            # Create a notification for the shelter associated with the pet
            content_type = ContentType.objects.get_for_model(application)
            print(ContentType.objects.get_for_model(Application).id)
            notification_data = {
                'user': pet.shelter.id,
                'content_object': application,
                'content_type': content_type.id,
                'object_id': application.id,
                'associated_link': app_detail_url,
            }

            notification_serializer = NotificationSerializer(data=notification_data)
            if notification_serializer.is_valid():
                notification_serializer.save()
            else:
                print(notification_serializer.errors)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplicationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        application = get_object_or_404(Application, id=id)
        user = request.user

        # Get a notification ready to be updated
        # NOTIFICATION CREATION
        app_detail_url = request.build_absolute_uri(reverse('application-delete', kwargs={'id': application.id}))

        # Create a notification for the seeker of the application
        content_type = ContentType.objects.get_for_model(application)
        notification_data = {
            'user': application.seeker.user.id,  # 
            'content_type': content_type.id,
            'object_id': application.id,
            'associated_link': app_detail_url,
        }

        # If user is shelter, they can update status to accept or denied, from pending
        if user.profile.__class__.__name__ == "ShelterProfile":
            if application.status == "pending" and request.data['status'] in ["accepted", "denied"]:
                application.status = request.data['status']
                application.save()

                notification_serializer = NotificationSerializer(data=notification_data)
                if notification_serializer.is_valid():
                    notification_serializer.save()
                else:
                    print(notification_serializer.errors)
                    return Response({"error": "Failed to create notification"}, status=status.HTTP_400_INTERNAL_SERVER_ERROR)
                return Response({"success": "Application updated and notification sent"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid status update"}, status=status.HTTP_400_BAD_REQUEST)

        # If user is seeker, they can update status to withdrawn, from pending or accepted
        elif user.profile.__class__.__name__ == "SeekerProfile":
            if application.status in ["pending", "accepted"] and request.data['status'] == "withdrawn":
                application.status = request.data['status']
                application.save()

                # Since we are a seeker updating, change the notification to the shelter
                notification_data['user'] = application.shelter.id
                notification_serializer = NotificationSerializer(data=notification_data)
                if notification_serializer.is_valid():
                    notification_serializer.save()
                else:
                    print(notification_serializer.errors)
                    return Response({"error": "Failed to create notification"}, status=status.HTTP_400_INTERNAL_SERVER_ERROR)
                return Response({"success": "Application updated and notification sent"}, status=status.HTTP_200_OK)

            else:
                return Response({"error": "Invalid status update"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({"error": "You do not have permission to update this application"}, status=status.HTTP_403_FORBIDDEN)

        return Response(ApplicationSerializer(application).data, status=status.HTTP_200_OK)
    

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user = self.request.user
        queryset = Application.objects.all()

        # Shelters can only view their own applications
        if user.profile.__class__.__name__ == "ShelterProfile":
            queryset = queryset.filter(shelter=user.profile)

        # Assume seekers can only view their own applications too
        if user.profile.__class__.__name__ == "SeekerProfile":
            queryset = queryset.filter(seeker=user.profile)

        # Filter by status if provided
        status = self.request.query_params.get('status')
        if status is not None:
            queryset = queryset.filter(status=status)

        # Sort by creation time and last update time
        sort_by = self.request.query_params.get('sort_by', 'created_at')  # Default is 'created_at'
        if sort_by not in ['created_at', 'updated_at', '-created_at', '-updated_at']:
            sort_by = 'created_at'
        queryset = queryset.order_by(sort_by)

        return queryset


class ApplicationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        application = get_object_or_404(Application, id=id)
        user = request.user

        if user.profile.__class__.__name__ == "ShelterProfile":
            if application.shelter != user.profile:
                return Response({"error": "You do not have permission to view this application"}, status=status.HTTP_403_FORBIDDEN)
            
        if user.profile.__class__.__name__ == "SeekerProfile":
            if application.seeker != user.profile:
                return Response({"error": "You do not have permission to view this application"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)