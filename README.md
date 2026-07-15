# 📚 BookStore API

Backend REST API for an online bookstore.

## Tech Stack

- Python 3.12
- Django 6.0
- Django REST Framework
- PostgreSQL / SQLite
- JWT (Simple JWT)
- Docker
- Swagger (drf-spectacular)

## Project Structure

```
bookstore/
├── config/          # Settings and root URLs
├── users/           # Custom user model (email-based auth)
├── books/           # Books, Categories, Authors
├── orders/          # Orders and order items
├── reviews/         # Book reviews and ratings
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Dilshodbek-Ilhomov/bookstore.git
cd bookstore

# 2. Create a virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
# Create a .env file and set:
# SECRET_KEY=...
# DEBUG=True
# USE_SQLITE=True

# 5. Run migrations
python manage.py migrate

# 6. Start the server
python manage.py runserver
```

## Running with Docker

```bash
docker-compose up --build
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `api/auth/register/` | User registration |
| `api/auth/login/` | Obtain JWT token |
| `api/auth/refresh/` | Refresh token |
| `api/books/` | Books CRUD |
| `api/categories/` | Categories |
| `api/authors/` | Authors |
| `api/orders/` | Orders |
| `api/reviews/` | Reviews |
| `api/docs/` | Swagger UI |

## License

MIT — [LICENSE](LICENSE)
