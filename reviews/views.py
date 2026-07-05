from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Review
from .serializers import (
    ReviewSerializer,
    ReviewCreateSerializer,
)

# Create your views here.

class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return ReviewCreateSerializer

        return ReviewSerializer
