from rest_framework import serializers
from books.models import Book
from .models import OrderItem, Order

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

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        items_data = validated_data.pop('items')

        order = Order.objects.create(
            user=user,
            status='pending'
        )

        for item in items_data:
            book = Book.objects.get(id=item['book'])
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