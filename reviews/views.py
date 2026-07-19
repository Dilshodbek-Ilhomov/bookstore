from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import Review
from .serializers import (
    ReviewSerializer,
    ReviewCreateSerializer,
)

# Create your views here.

class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all().select_related("user", "book").order_by("-created_at")
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["book", "user"]

    def get_serializer_class(self):
        if self.action == "create":
            return ReviewCreateSerializer

        return ReviewSerializer
