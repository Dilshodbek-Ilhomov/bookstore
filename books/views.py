from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Category, Author, Book
from .serializers import CategorySerializer, AuthorSerializer, BookSerializer


# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = AuthorSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BookSerializer

    filterset_fields = ["category"]
    search_fields = ["title", "description", "authors__full_name",]
    ordering_fields = ["price", "created_at", "stock"]