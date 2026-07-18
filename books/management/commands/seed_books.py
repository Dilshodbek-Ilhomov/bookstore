from django.core.management.base import BaseCommand
from books.models import Category, Author, Book

class Command(BaseCommand):
    help = "Seeds initial categories, authors, and books into the database if they don't already exist"

    def handle(self, *args, **options):
        # Create Categories
        cat_badiiy, _ = Category.objects.get_or_create(name="Badiiy adabiyot")
        cat_shaxsiy, _ = Category.objects.get_or_create(name="Shaxsiy rivojlanish")
        cat_bolalar, _ = Category.objects.get_or_create(name="Bolalar adabiyoti")
        cat_ilmiy, _ = Category.objects.get_or_create(name="Ilmiy-ommabop")

        # Create Authors
        author_abdulla, _ = Author.objects.get_or_create(full_name="Abdulla Qodiriy")
        author_cal, _ = Author.objects.get_or_create(full_name="Cal Newport")
        author_xudoyberdi, _ = Author.objects.get_or_create(full_name="Xudoyberdi To'xtaboyev")
        author_james, _ = Author.objects.get_or_create(full_name="James Clear")

        # Create Books
        book1, created1 = Book.objects.get_or_create(
            title="O'tkan Kunlar",
            defaults={
                "description": "Abdulla Qodiriyning o'zbek adabiyoti durdonasi hisoblangan tarixiy romani. O'zbek xalqining XIX asr o'rtalaridagi hayoti, muhabbat fojeasi va tarixiy manzaralari.",
                "price": "45000.00",
                "stock": 15,
                "category": cat_badiiy,
            }
        )
        if created1:
            book1.authors.add(author_abdulla)

        book2, created2 = Book.objects.get_or_create(
            title="Diqqat (Deep Work)",
            defaults={
                "description": "Cal Newport tomonidan yozilgan chalg'ituvchi dunyoda muvaffaqiyat sirlari. Chuqur diqqatni jamlash ko'nikmasini rivojlantirish va ish samaradorligini oshirish qo'llanmasi.",
                "price": "38000.00",
                "stock": 10,
                "category": cat_shaxsiy,
            }
        )
        if created2:
            book2.authors.add(author_cal)

        book3, created3 = Book.objects.get_or_create(
            title="Sariq devni minib",
            defaults={
                "description": "Xudoyberdi To'xtaboyevning bolalar adabiyotidagi eng mashhur sarguzasht asari. Hoshimjonning sehrli qalpoqcha yordamidagi sarguzashtlari.",
                "price": "32000.00",
                "stock": 20,
                "category": cat_bolalar,
            }
        )
        if created3:
            book3.authors.add(author_xudoyberdi)

        book4, created4 = Book.objects.get_or_create(
            title="Atom Odatlar",
            defaults={
                "description": "James Clear qalamiga mansub yaxshi odatlarni shakllantirish bo'yicha eng yaxshi qo'llanma. Kichik o'zgarishlar orqali katta natijalarga erishish yo'llari.",
                "price": "42000.00",
                "stock": 12,
                "category": cat_shaxsiy,
            }
        )
        if created4:
            book4.authors.add(author_james)

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with initial books!"))
