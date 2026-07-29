from django.urls import path
from .views import RegisterAPIView, UserDetailAPIView, PublicUserDetailAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('me/', UserDetailAPIView.as_view(), name='user-detail'),
    path('profile/<int:pk>/', PublicUserDetailAPIView.as_view(), name='public-profile'),
]