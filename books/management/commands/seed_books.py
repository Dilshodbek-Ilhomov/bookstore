from django.core.management.base import BaseCommand
from books.models import Category, Author, Book


BOOK_DATA = [
    # (title, description, price, stock, category_name, author_names)
    (
        "O'tkan Kunlar",
        "Abdulla Qodiriyning o'zbek adabiyoti durdonasi hisoblangan tarixiy romani. O'zbek xalqining XIX asr o'rtalaridagi hayoti, muhabbat fojeasi va tarixiy manzaralari.",
        "45000.00", 15, "Badiiy adabiyot", ["Abdulla Qodiriy"],
    ),
    (
        "Diqqat (Deep Work)",
        "Cal Newport tomonidan yozilgan chalg'ituvchi dunyoda muvaffaqiyat sirlari. Chuqur diqqatni jamlash ko'nikmasini rivojlantirish va ish samaradorligini oshirish qo'llanmasi.",
        "38000.00", 10, "Shaxsiy rivojlanish", ["Cal Newport"],
    ),
    (
        "Sariq devni minib",
        "Xudoyberdi To'xtaboyevning bolalar adabiyotidagi eng mashhur sarguzasht asari. Hoshimjonning sehrli qalpoqcha yordamidagi sarguzashtlari.",
        "32000.00", 20, "Bolalar adabiyoti", ["Xudoyberdi To'xtaboyev"],
    ),
    (
        "Atom Odatlar",
        "James Clear qalamiga mansub yaxshi odatlarni shakllantirish bo'yicha eng yaxshi qo'llanma. Kichik o'zgarishlar orqali katta natijalarga erishish yo'llari.",
        "42000.00", 12, "Shaxsiy rivojlanish", ["James Clear"],
    ),
    (
        "Django 3 By Example",
        "Build powerful and reliable Python web applications using Django 3. A practical guide to building real-world projects with Django, from beginner to expert.",
        "55000.00", 8, "Ilmiy-ommabop", ["Antonio Mele"],
    ),
    (
        "Atomic Habits",
        "Tiny Changes, Remarkable Results. An Easy and Proven Way to Build Good Habits and Break Bad Ones. The definitive guide to building good habits that last.",
        "48000.00", 18, "Shaxsiy rivojlanish", ["James Clear"],
    ),
    (
        "Street Lawyer",
        "A gripping legal thriller by John Grisham. A high-powered Washington attorney has his life turned upside down by a homeless man with a gun.",
        "35000.00", 14, "Badiiy adabiyot", ["John Grisham"],
    ),
]


class Command(BaseCommand):
    help = "Seeds/updates initial categories, authors, and books with proper prices, authors and categories"

    def handle(self, *args, **options):
        # Ensure categories exist
        categories = {}
        for cat_name in ["Badiiy adabiyot", "Shaxsiy rivojlanish", "Bolalar adabiyoti", "Ilmiy-ommabop"]:
            cat, _ = Category.objects.get_or_create(name=cat_name)
            categories[cat_name] = cat
        self.stdout.write(f"  Categories: {len(categories)} ready")

        # Ensure authors exist
        author_names = set()
        for _, _, _, _, _, book_authors in BOOK_DATA:
            author_names.update(book_authors)

        authors = {}
        for name in author_names:
            author, _ = Author.objects.get_or_create(full_name=name)
            authors[name] = author
        self.stdout.write(f"  Authors: {len(authors)} ready")

        # Create or update books
        for title, desc, price, stock, cat_name, author_names_list in BOOK_DATA:
            book, created = Book.objects.get_or_create(
                title=title,
                defaults={
                    "description": desc,
                    "price": price,
                    "stock": stock,
                    "category": categories[cat_name],
                },
            )

            if not created:
                # Update fields that might be wrong (price=0, wrong category, etc.)
                updated = False
                if float(book.price) == 0 or str(book.price) == "0.00":
                    book.price = price
                    updated = True
                if book.stock == 0:
                    book.stock = stock
                    updated = True
                if book.category != categories[cat_name]:
                    book.category = categories[cat_name]
                    updated = True
                if not book.description or len(book.description) < 20:
                    book.description = desc
                    updated = True
                if updated:
                    book.save()
                    self.stdout.write(f"  Updated: {title}")
                else:
                    self.stdout.write(f"  OK (unchanged): {title}")
            else:
                self.stdout.write(f"  Created: {title}")

            # Always ensure authors are linked
            for aname in author_names_list:
                if aname in authors:
                    book.authors.add(authors[aname])

        self.stdout.write(self.style.SUCCESS("\nDatabase seeded and corrected successfully!"))
        self.stdout.write("Books in database:")
        for b in Book.objects.select_related("category").prefetch_related("authors").all():
            self.stdout.write(
                f"  ID:{b.id} | {b.title} | ${float(b.price)/12500:.2f} USD | stock:{b.stock} | "
                f"cat:{b.category.name} | authors:{[a.full_name for a in b.authors.all()]}"
            )
