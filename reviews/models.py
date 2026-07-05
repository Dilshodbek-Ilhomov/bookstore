from django.db import models
from users.models import User
from books.models import Book
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Review(models.Model):
    user = models.ForeignKey(User, models.CASCADE, related_name='reviews')
    book = models.ForeignKey(Book, models.CASCADE, related_name='books')
    rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)], null=True, blank=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} {self.book} izohiga izoh yozdi'