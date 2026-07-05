from django.db import transaction
from rest_framework import serializers
from .models import Review
from books.models import Book

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ReviewCreateSerializer(serializers.Serializer):
    book = serializers.IntegerField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField()

    def create(self, validated_data):
        with transaction.atomic():

            request = self.context['request']
            user = request.user

            try:
                book = Book.objects.get(id=validated_data['book'])
            except Book.DoesNotExist:
                raise serializers.ValidationError({
                    "book": "Bunday kitob mavjud emas."
                })

            review = Review.objects.create(
                user = user,
                book = book,
                rating = validated_data["rating"],
                comment = validated_data["comment"]
            )


            return review