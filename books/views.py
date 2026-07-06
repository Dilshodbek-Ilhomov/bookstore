from rest_framework import viewsets
from .permissions import IsAdminOrReadOnly
from .models import Category, Author, Book
from .serializers import CategorySerializer, AuthorSerializer, BookSerializer


# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = CategorySerializer


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = AuthorSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = BookSerializer

    filterset_fields = ["category"]
    search_fields = ["title", "description", "authors__full_name",]
    ordering_fields = ["price", "created_at", "stock"]