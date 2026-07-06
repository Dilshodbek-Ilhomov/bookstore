import os
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

    def validate_book_file(self, value):
        # 50 MB limit
        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError(
                "Kitob fayli 50 MB dan katta bo'lishi mumkin emas."
            )

        # Only PDF
        ext = os.path.splitext(value.name)[1].lower()
        allowed_extensions = [".pdf"]

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                "Faqat PDF formatdagi kitoblarni yuklash mumkin."
            )

        return value

    def validate_cover_image(self, value):
        # 5 MB limit
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                "Rasm 5 MB dan katta bo'lishi mumkin emas."
            )

        # Allowed image formats
        ext = os.path.splitext(value.name)[1].lower()
        allowed_extensions = [".jpg", ".jpeg", ".png", ".webp"]

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                "Faqat JPG, JPEG, PNG yoki WEBP formatdagi rasmlar yuklash mumkin."
            )

        return value

    class Meta:
        model = Book
        fields = "__all__"