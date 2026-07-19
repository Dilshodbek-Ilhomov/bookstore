from rest_framework import viewsets
from .permissions import IsAdminOrReadOnly
from .models import Category, Author, Book
from .serializers import CategorySerializer, AuthorSerializer, BookSerializer
from rest_framework.parsers import MultiPartParser, FormParser


# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = CategorySerializer
    pagination_class = None


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = AuthorSerializer
    pagination_class = None

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = BookSerializer

    # To upload images and PDF files
    parser_classes = [MultiPartParser, FormParser]

    filterset_fields = ["category"]
    search_fields = ["title", "description", "authors__full_name",]
    ordering_fields = ["price", "created_at", "stock"]