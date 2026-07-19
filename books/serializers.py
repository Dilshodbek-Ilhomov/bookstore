import os
from django.db.models import Avg, Count
from rest_framework import serializers
from .models import Category, Author, Book


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"


class BookSerializer(serializers.ModelSerializer):
    # Nested read representations
    category_detail = CategorySerializer(source='category', read_only=True)
    authors_detail  = AuthorSerializer(source='authors', many=True, read_only=True)

    # Real rating data aggregated from reviews
    avg_rating   = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    def get_avg_rating(self, obj):
        result = obj.books.aggregate(avg=Avg('rating'))['avg']
        if result is None:
            return None
        return round(result, 1)

    def get_review_count(self, obj):
        return obj.books.aggregate(cnt=Count('id'))['cnt']

    def validate_book_file(self, value):
        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError(
                "Kitob fayli 50 MB dan katta bo'lishi mumkin emas."
            )
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in [".pdf"]:
            raise serializers.ValidationError(
                "Faqat PDF formatdagi kitoblarni yuklash mumkin."
            )
        return value

    def validate_cover_image(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                "Rasm 5 MB dan katta bo'lishi mumkin emas."
            )
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            raise serializers.ValidationError(
                "Faqat JPG, JPEG, PNG yoki WEBP formatdagi rasmlar yuklash mumkin."
            )
        return value

    class Meta:
        model = Book
        fields = [
            'id',
            'cover_image',
            'book_file',
            'title',
            'description',
            'price',
            'stock',
            'category',
            'category_detail',
            'authors',
            'authors_detail',
            'avg_rating',
            'review_count',
            'created_at',
        ]