from django.urls import path
from pets import views

urlpatterns = [
    path('shelters/<int:shelter_id>/pets/', views.PetListingsManage.as_view()),
    path('pets/', views.PetListingsFilter.as_view()),
    path('pets/breeds', views.get_breeds),
    path('pets/<pk>', views.PetListings.as_view()),
]