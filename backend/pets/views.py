from rest_framework.response import Response
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from .models import PetModel
from .serializers import PetSerializer
from rest_framework import generics
from rest_framework import filters
from rest_framework import pagination
from accounts.models import ShelterProfile
import math


class OnePage(pagination.PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ContainsFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        fields = getattr(view, 'filter_fields', [])
        for field in fields:
            values = request.query_params.get(field, None)
            if not values or values == '':
                continue

            # construct a regex for case-insensitive search whole word
            # matches for each value
            values = values.split(',')
            pattern = [rf'(^{value}$)' for value in values]
            queryset = queryset.filter(**{
                field + '__iregex': r'(' + '|'.join(pattern) + ')'
            })
        return queryset


class AgeGroupFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        age_groups = request.query_params.get('age_group', None)
        if not age_groups or age_groups == '':
            return queryset

        age_groups = age_groups.split(',')
        querysets = []

        for age_group in age_groups:
            if age_group == 'puppy':  # 0-1 years old
                querysets.append(queryset.filter(age__lte=1))
            elif age_group == 'young':  # 1-3 years old
                querysets.append(queryset.filter(age__gt=1, age__lte=3))
            elif age_group == 'adult':  # 3-7 years old
                querysets.append(queryset.filter(age__gt=3, age__lte=7))
            elif age_group == 'senior':  # 7+ years old
                querysets.append(queryset.filter(age__gt=7))

        queryset = queryset.none()
        for i in range(len(querysets)):
            queryset = queryset | querysets[i]

        return queryset


class SizeGroupFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        size_groups = request.query_params.get('size_group', None)
        if not size_groups or size_groups == '':
            return queryset

        size_groups = size_groups.split(',')
        querysets = []

        for size_group in size_groups:
            if size_group == 'small':  # 0-12 kg
                querysets.append(queryset.filter(size__lte=12))
            elif size_group == 'medium':  # 12-25 kg
                querysets.append(queryset.filter(size__gt=12, size__lte=25))
            elif size_group == 'large':  # 25-45 kg
                querysets.append(queryset.filter(size__gt=25, size__lte=45))
            elif size_group == 'xlarge':  # 45+ kg
                querysets.append(queryset.filter(size__gt=45))

        queryset = queryset.none()
        for i in range(len(querysets)):
            queryset = queryset | querysets[i]

        return queryset


class PetListingsFilter(generics.ListAPIView):
    serializer_class = PetSerializer
    pagination_class = OnePage
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        ContainsFilterBackend,
        AgeGroupFilterBackend,
        SizeGroupFilterBackend,
    ]
    filter_fields = ['gender', 'breed', 'colour']
    search_fields = [
        # Pet attributes
        'name', 'breed', 'gender', 'size', 'age', 'description',
        # Shelter attributes
        'shelter__name', 'shelter__location', 'shelter__bio'
    ]
    ordering_fields = ['name', 'age', 'size']

    def get_queryset(self):
        return PetModel.objects.all().filter(status='available')

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if self.paginator is not None and self.paginator.page is not None:
            extra_data = {
                'num_results': self.paginator.page.paginator.count,
                'num_pages': self.paginator.page.paginator.num_pages,
            }
        else:
            extra_data = {}

        return Response({**response.data, **extra_data})


class PetListingsManage(APIView):
    def get(self, request, shelter_id, pk='None'):
        """Return all pets belonging to a shelter."""
        shelter = ShelterProfile.objects.get(pk=shelter_id)
        if not shelter:
            return Response({"error": "Could not find shelter"}, status=status.HTTP_404_NOT_FOUND)

        pets = PetModel.objects.filter(shelter=shelter)
        serializer = PetSerializer(pets, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, shelter_id, pk='None'):
        """Add a pet to a shelter. Only the shelter owner can add a pet to the shelter."""
        shelter = ShelterProfile.objects.get(pk=shelter_id)
        if not shelter:
            return Response({"error": "Could not find shelter"}, status=status.HTTP_404_NOT_FOUND)
        if shelter.owner != request.user:
            return Response({"error": "You do not have permission to add a pet to this shelter"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['shelter'] = str(shelter.id)
        serializer = PetSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get pet given id
class PetListings(APIView):
    def get(self, request, pk):
        """Return a pet given its id."""
        pet = PetModel.objects.filter(pk=pk).first()
        if not pet:
            return Response({"error": "Could not find pet"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PetSerializer(pet, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        """Update a pet given its id. Only the shelter that owns the pet can update it."""
        pet = PetModel.objects.filter(pk=pk).first()
        if not pet:
            return Response({"error": "Could not find pet"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if pet.shelter.owner != user:
            return Response({"error": "You do not have permission to edit this pet"}, status=status.HTTP_403_FORBIDDEN)

        try:
            data = request.data.copy()
            if 'shelter' not in data:
                data['shelter'] = str(pet.shelter.id)
            serializer = PetSerializer(pet, data=data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"error": str(e)})

    def delete(self, request, pk):
        """Delete a pet given its id. Only the shelter owner can delete a pet."""
        pet = PetModel.objects.filter(pk=pk).first()
        if not pet:
            return Response({"error": "Could not find pet"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if pet.shelter.owner != user:
            return Response({"error": "You do not have permission to delete this pet"}, status=status.HTTP_403_FORBIDDEN)

        pet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"success": "Pet deleted"})


def get_breeds(request):
    """Return a JSON list of all the breeds."""
    breeds = PetModel.objects.values_list('breed', flat=True).distinct()
    return JsonResponse(list(breeds), safe=False)

