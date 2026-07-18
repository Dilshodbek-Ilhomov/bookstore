from django.urls import path
from .views import RegisterAPIView, UserDetailAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('me/', UserDetailAPIView.as_view(), name='user-detail'),
]