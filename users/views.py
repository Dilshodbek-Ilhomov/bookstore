from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer, PublicUserSerializer
from .models import User

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class PublicUserDetailAPIView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = PublicUserSerializer
    permission_classes = [permissions.AllowAny]