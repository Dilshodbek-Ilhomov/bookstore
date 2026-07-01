from rest_framework import serializers
from books.models import Book
from .models import OrderItem, Order
from django.db import transaction

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'book', 'quantity', 'price', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'created_at', 'items']

    read_only_fields = ['id', 'created_at']

class OrderItemCreateSerializer(serializers.Serializer):
    book = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemCreateSerializer(many=True)

    def validate(self, attrs):
        items = attrs.get("items")

        if not items:
            raise serializers.ValidationError({
                "items": "Order kamida bitta kitobdan iborat bo'lishi kerak."
            })

        for item in items:
            try:
                book = Book.objects.get(id=item["book"])
            except Book.DoesNotExist:
                raise serializers.ValidationError({
                    "book": f"ID={item['book']} bo'lgan kitob topilmadi."
                })

            if book.stock < item["quantity"]:
                raise serializers.ValidationError({
                    "stock": f"{book.title} kitobidan yetarli miqdor mavjud emas."
                })

        return attrs

    def create(self, validated_data):
        with transaction.atomic():

            request = self.context['request']
            user = request.user

            items_data = validated_data.pop('items')

            order = Order.objects.create(
                user=user,
                status='pending'
            )

            for item in items_data:
                try:
                    book = Book.objects.get(id=item['book'])
                except Book.DoesNotExist:
                    raise serializers.ValidationError({
                        "book": f"ID={item['book']} bo'lgan kitob topilmadi."
                    })
                quantity = item['quantity']

                if book.stock < quantity:
                    raise serializers.ValidationError(
                        f"{book.title} kitobidan yetarli miqdor mavjud emas."
                    )

                OrderItem.objects.create(
                    order=order,
                    book=book,
                    quantity=quantity,
                    price=book.price,
                    total_price=book.price * quantity
                )

                book.stock -= quantity
                book.save()

            return order

    def to_representation(self, instance):
        return OrderSerializer(instance).data