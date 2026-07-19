from django.db import transaction
from rest_framework import serializers
from .models import Review
from books.models import Book

class ReviewSerializer(serializers.ModelSerializer):
    user_detail = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = '__all__'

    def get_user_detail(self, obj):
        if not obj.user:
            return None
        return {
            "id": obj.user.id,
            "first_name": getattr(obj.user, "first_name", ""),
            "last_name": getattr(obj.user, "last_name", ""),
            "email": getattr(obj.user, "email", ""),
        }

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

    def to_representation(self, instance):
        return ReviewSerializer(instance).data

class ReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rating', 'comment']

    def update(self, instance, validated_data):
        with transaction.atomic():
            instance.rating = validated_data.get('rating', instance.rating)
            instance.comment = validated_data.get('comment', instance.comment)
            instance.save()
            return instance

    def to_representation(self, instance):
        return ReviewSerializer(instance).data