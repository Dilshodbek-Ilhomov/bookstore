from django.db import models
from django.core.validators import MinValueValidator

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

class Author(models.Model):
    full_name = models.CharField(max_length=200)

    def __str__(self):
        return self.full_name

class Book(models.Model):
    cover_image = models.ImageField(upload_to='books/covers/')
    book_file = models.FileField(upload_to='books/files/')
    title = models.CharField(max_length=155)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='books')
    authors = models.ManyToManyField(Author, related_name='books')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
