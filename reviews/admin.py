from django.contrib import admin
from .models import Review  # Import your model

@admin.register(Review)  # Cleaner than admin.site.register(Post, PostAdmin)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'book', 'rating', 'created_at')

