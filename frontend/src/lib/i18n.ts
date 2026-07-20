// ============================================
// BookStore — Internationalization (i18n) Dictionary
// ============================================

export type Language = "uz" | "en";

export const translations = {
  uz: {
    common: {
      loading: "Yuklanmoqda...",
      error: "Xatolik yuz berdi",
      success: "Muvaffaqiyatli",
      close: "Yopish",
      delete: "O'chirish",
      all: "Barchasi",
      date: "Sana:",
      price: "Narxi:",
      uzs: "so'm",
      selectLanguage: "Tilni tanlang:",
    },
    nav: {
      home: "Bosh sahifa",
      books: "Kitoblar",
      categories: "Kategoriyalar",
      about: "Biz haqimizda",
      cart: "Savat",
      login: "Kirish",
      profile: "Profil",
    },
    hero: {
      badge: "Yangi 2.0 platformasi ishga tushdi",
      bestseller: "Bestseller",
      title1: "Kitoblar bilan",
      title2: "fikringizni o'stiring",
      subtitle: "Sara kitoblarning eng katta kolleksiyasi. Oson qidiruv, qulay tanlov va butun O'zbekiston bo'ylab tezkor yetkazib berish xizmati.",
      catalogCta: "Katalogga o'tish",
      featuredCta: "Sara kitoblar",
      scrollDown: "PASTGA AYLANTIRING",
      view: "Ko'rish",
      subtext1: "Abdulla Qodiriy · Tarixiy roman",
      subtext2: "Shaxsiy rivojlanish",
      subtext3: "Bolalar adabiyoti",
      fallbackTopTitle: "O'tkan Kunlar",
      fallbackMini1Title: "Diqqat (Deep Work)",
      fallbackMini2Title: "Sariq devni minib",
    },
    featured: {
      badge: "Mashhur nashrlar",
      title: "Haftaning eng sara kitoblari",
      allBooks: "Barcha kitoblar",
    },
    categories: {
      title: "Kategoriyalar bo'yicha kashf eting",
      subtitle: "Yoqimli janrni tanlang, intellektual salohiyatingizni va dunyoqarashingizni yangi bosqichga olib chiqing.",
      badiiy: "Badiiy adabiyot",
      badiiyDesc: "O'zbek va jahon adabiyotining eng sara romalari, qissalari va hikoyalari to'plami.",
      shaxsiy: "Shaxsiy rivojlanish",
      shaxsiyDesc: "Muvaffaqiyat, vaqtni boshqarish, biznes va psixologiyaga oid eng foydali qo'llanmalar.",
      bolalar: "Bolalar adabiyoti",
      bolalarDesc: "Farzandlaringiz uchun rang-barang ertaklar, sarguzasht asarlar va ta'limiy kitoblar.",
      explore: "To'plamni ko'rish",
    },
    steps: {
      title: "Qanday ishlaydi?",
      subtitle: "Kitob buyurtma qilish va uni qabul qilib olish uchta oddiy qadamda amalga oshiriladi.",
      step1Title: "Tanlang",
      step1Desc: "Minglab janrlardagi sevimli kitoblaringizni tanlang, narxlar va sharhlar bilan tanishib savatga qo'shing.",
      step2Title: "Buyurtma bering",
      step2Desc: "Tizimga kirib yoki tezkor ro'yxatdan o'tib oson buyurtma bering. To'lov usulini o'zingizga qulay tarzda tanlang.",
      step3Title: "Qabul qiling",
      step3Desc: "Tez fursatlarda ostonangizgacha yetkazib beramiz. Yangi kitobdan va mutolaadan tamoman zavqlaning!",
    },
    newsletter: {
      title: "Yangiliklardan birinchilardan bo'lib xabardor bo'ling",
      subtitle: "Yangi kitoblar, maxsus chegirmalar va o'qishga arziydigan tavsiyalarni to'g'ridan-to'g'ri pochtangizga yuboramiz.",
      placeholder: "Elektron pochtangiz",
      submit: "Obuna bo'lish",
      successAlert: "Rahmat! Siz obuna bo'ldingiz.",
    },
    cart: {
      title: "Savat",
      empty: "Savatingiz hozircha bo'sh.",
      total: "Jami:",
      checkout: "Rasmiylashtirish",
      loginRequired: "Buyurtma berish uchun tizimga kiring.",
      successOrder: "Buyurtmangiz muvaffaqiyatli qabul qilindi!",
      errorOrder: "Xatolik yuz berdi",
      delete: "O'chirish",
    },
    bookCard: {
      add: "Savatga",
      noDesc: "Tavsif mavjud emas",
    },
    booksPage: {
      title: "Barcha kitoblar",
      subtitle: "Bizning eng sara va sifatli kitoblar to'plamimiz.",
      searchPlaceholder: "Kitob nomi yoki muallif bo'yicha qidirish...",
      categoriesHeader: "Kategoriyalar",
      filterAll: "Barchasi",
      sortDefault: "Saralash",
      sortStandard: "Standart",
      sortPriceAsc: "Narxi (arzonidan qimmatiga)",
      sortPriceDesc: "Narxi (qimmatidan arzoniga)",
      emptyTitle: "Kitoblar topilmadi",
      emptyDesc: "Boshqa so'z bilan qidirib ko'ring yoki filtrlarni tozalang.",
      clearFilters: "Filtrlarni tozalash",
      suspenseLoading: "Yuklanmoqda...",
      popularScience: "Ilmiy-ommabop",
    },
    bookDetail: {
      back: "Ortga qaytish",
      notFound: "Kitob topilmadi",
      toCatalog: "Katalogga qaytish",
      addToCart: "Savatga qo'shish",
      readPdf: "Online o'qish (PDF)",
      descriptionTitle: "Asar haqida batafsil",
      categoryLabel: "Kategoriya",
      stockAvailable: "Omborda mavjud",
      stockOut: "Omborda qolmagan",
      noDesc: "Tavsif mavjud emas.",
      reviewsTitle: "Kitobxonlar fikrlari va baholari",
      addReview: "Izoh va baho qoldirish",
      ratingLabel: "Bahoyingiz (1 dan 5 gacha)",
      commentLabel: "Sizning fikringiz",
      submitReview: "Izoh yuborish",
      submitting: "Yuborilmoqda...",
      noReviews: "Hozircha ushbu kitobga izohlar yo'q. Birinchi bo'lib o'z fikringizni qoldiring!",
      loginToReview: "Izoh qoldirish uchun tizimga kirishingiz kerak.",
      reviewSuccess: "Izohingiz muvaffaqiyatli qo'shildi!",
      reviewError: "Izoh qo'shishda xatolik yuz berdi.",
    },
    loginPage: {
      title: "Tizimga kirish",
      subtitle: "Yangi imkoniyatlar va tezkor buyurtmalar uchun hisobingizga kiring.",
      emailLabel: "Elektron pochta",
      passwordLabel: "Parol",
      submit: "Kirish",
      loading: "Kirilmoqda...",
      noAccount: "Hisobingiz yo'qmi?",
      registerLink: "Ro'yxatdan o'ting",
      errorMessage: "Email yoki parol noto'g'ri",
      fallbackUserName: "Foydalanuvchi",
    },
    registerPage: {
      title: "Ro'yxatdan o'tish",
      subtitle: "BookStore oilasiga qo'shiling va sevimli kitoblaringizni oson xarid qiling.",
      firstNameLabel: "Ismingiz",
      lastNameLabel: "Familiyangiz",
      emailLabel: "Elektron pochta",
      passwordLabel: "Parol",
      password2Label: "Parolni tasdiqlang",
      submit: "Ro'yxatdan o'tish",
      loading: "Yaratilmoqda...",
      hasAccount: "Avval ro'yxatdan o'tganmisiz?",
      loginLink: "Kirish",
      successMessage: "Muvaffaqiyatli ro'yxatdan o'tdingiz! Tizimga yo'naltirilmoqda...",
      passwordMismatch: "Parollar bir-biriga mos kelmadi",
      firstNamePlaceholder: "Ali",
      lastNamePlaceholder: "Valiyev",
      defaultError: "Ro'yxatdan o'tishda xatolik yuz berdi",
    },
    profilePage: {
      logout: "Chiqish",
      myOrders: "Mening buyurtmalarim",
      noOrders: "Sizda hozircha buyurtmalar yo'q.",
      orderNumber: "Buyurtma #",
      totalPaid: "Jami to'langan:",
      statusNew: "Yangi",
      statusCompleted: "Buyurtma yetkazildi",
      statusProcessing: "Jarayonda",
      statusCancelled: "Bekor qilindi",
      statusPending: "Kutilmoqda",
      dateLabel: "Sana:",
    },
    footer: {
      desc: "O'zbekistonning ishonchli onlayn kitob do'koni. Sifatli kitoblar, tezkor yetkazib berish.",
      pages: "Sahifalar",
      help: "Yordam",
      delivery: "Yetkazib berish",
      payments: "To'lov usullari",
      refunds: "Qaytarish siyosati",
      contact: "Bog'lanish",
      contactInfo: "Aloqa va manzillar",
      phoneLabel: "Telefon",
      emailLabel: "Elektron pochta",
      addressLabel: "Manzil",
      addressValue: "Toshkent shahri, O'zbekiston",
      rights: "BookStore. Barcha huquqlar himoyalangan.",
      madeIn: "O'zbekistonda ishlab chiqilgan",
    },
  },
  en: {
    common: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Successfully completed",
      close: "Close",
      delete: "Delete",
      all: "All",
      date: "Date:",
      price: "Price:",
      uzs: "UZS",
      selectLanguage: "Select language:",
    },
    nav: {
      home: "Home",
      books: "Books",
      categories: "Categories",
      about: "About Us",
      cart: "Cart",
      login: "Sign In",
      profile: "Profile",
    },
    hero: {
      badge: "New 2.0 Platform Live",
      bestseller: "Bestseller",
      title1: "Books That",
      title2: "Shape Great Minds",
      subtitle: "The premier book collection. Effortless discovery, curated titles, and express delivery nationwide across Uzbekistan.",
      catalogCta: "Explore Catalog",
      featuredCta: "Featured Books",
      scrollDown: "SCROLL DOWN",
      view: "View",
      subtext1: "Abdulla Qodiriy · Classic Historical Novel",
      subtext2: "Personal Development",
      subtext3: "Children's Literature",
      fallbackTopTitle: "Bygone Days (O'tkan Kunlar)",
      fallbackMini1Title: "Deep Work (Diqqat)",
      fallbackMini2Title: "Riding the Yellow Giant",
    },
    featured: {
      badge: "Popular Editions",
      title: "Best Books of the Week",
      allBooks: "View All Books",
    },
    categories: {
      title: "Explore by Categories",
      subtitle: "Select your preferred genre, elevate your intellectual horizons, and take your mindset to a new level.",
      badiiy: "Fiction & Literature",
      badiiyDesc: "The finest collection of novels, novellas, and short stories from classic and world literature.",
      shaxsiy: "Personal Development",
      shaxsiyDesc: "Most valuable guidebooks on success, time management, business, and modern psychology.",
      bolalar: "Children's Literature",
      bolalarDesc: "Colorful fairy tales, exciting adventure stories, and educational books for your children.",
      explore: "Explore Collection",
    },
    steps: {
      title: "How It Works",
      subtitle: "Ordering your favorite books and receiving them at your doorstep takes three simple steps.",
      step1Title: "Select",
      step1Desc: "Choose your favorite books across thousands of genres, review ratings, and add them to your cart.",
      step2Title: "Order",
      step2Desc: "Sign in or quickly register to place an order easily. Choose the payment method that suits you best.",
      step3Title: "Receive",
      step3Desc: "We deliver right to your doorstep promptly. Enjoy reading your brand new book right away!",
    },
    newsletter: {
      title: "Be the First to Know About New Arrivals",
      subtitle: "We send new books, exclusive discounts, and must-read recommendations straight to your inbox.",
      placeholder: "Your email address",
      submit: "Subscribe Now",
      successAlert: "Thank you! You have successfully subscribed.",
    },
    cart: {
      title: "Your Cart",
      empty: "Your cart is currently empty.",
      total: "Total:",
      checkout: "Checkout",
      loginRequired: "Please sign in to place your order.",
      successOrder: "Your order has been placed successfully!",
      errorOrder: "An error occurred",
      delete: "Remove",
    },
    bookCard: {
      add: "Add to Cart",
      noDesc: "No description available",
    },
    booksPage: {
      title: "All Books",
      subtitle: "Our curated and high-quality book collection.",
      searchPlaceholder: "Search by book title or author...",
      categoriesHeader: "Categories",
      filterAll: "All",
      sortDefault: "Sort By",
      sortStandard: "Default",
      sortPriceAsc: "Price: Low to High",
      sortPriceDesc: "Price: High to Low",
      emptyTitle: "No Books Found",
      emptyDesc: "Try searching with a different keyword or reset filters.",
      clearFilters: "Clear Filters",
      suspenseLoading: "Loading...",
      popularScience: "Popular Science",
    },
    bookDetail: {
      back: "Back to Catalog",
      notFound: "Book Not Found",
      toCatalog: "Return to Catalog",
      addToCart: "Add to Cart",
      readPdf: "Read Online (PDF)",
      descriptionTitle: "About the Book",
      categoryLabel: "Category",
      stockAvailable: "In Stock",
      stockOut: "Out of Stock",
      noDesc: "No description available.",
      reviewsTitle: "Reader Reviews & Ratings",
      addReview: "Leave a Review",
      ratingLabel: "Your Rating (1 to 5 stars)",
      commentLabel: "Your Review",
      submitReview: "Submit Review",
      submitting: "Submitting...",
      noReviews: "No reviews yet for this book. Be the first to share your thoughts!",
      loginToReview: "Please sign in to leave a review.",
      reviewSuccess: "Your review was added successfully!",
      reviewError: "An error occurred while submitting your review.",
    },
    loginPage: {
      title: "Sign In",
      subtitle: "Sign into your account for exclusive features and fast orders.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      submit: "Sign In",
      loading: "Signing in...",
      noAccount: "Don't have an account?",
      registerLink: "Create an account",
      errorMessage: "Invalid email or password",
      fallbackUserName: "User",
    },
    registerPage: {
      title: "Create Account",
      subtitle: "Join the BookStore family and purchase your favorite books effortlessly.",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      password2Label: "Confirm Password",
      submit: "Sign Up",
      loading: "Creating account...",
      hasAccount: "Already have an account?",
      loginLink: "Sign In",
      successMessage: "Account created successfully! Redirecting to login...",
      passwordMismatch: "Passwords do not match",
      firstNamePlaceholder: "John",
      lastNamePlaceholder: "Doe",
      defaultError: "An error occurred during registration",
    },
    profilePage: {
      logout: "Sign Out",
      myOrders: "My Orders",
      noOrders: "You don't have any orders yet.",
      orderNumber: "Order #",
      totalPaid: "Total Paid:",
      statusNew: "New",
      statusCompleted: "Order Delivered",
      statusProcessing: "Processing",
      statusCancelled: "Cancelled",
      statusPending: "Pending",
      dateLabel: "Date:",
    },
    footer: {
      desc: "Uzbekistan's trusted online bookstore. Quality books, fast and reliable delivery across the country.",
      pages: "Navigation",
      help: "Support",
      delivery: "Delivery Info",
      payments: "Payment Methods",
      refunds: "Refund Policy",
      contact: "Contact Us",
      contactInfo: "Addresses & Contacts",
      phoneLabel: "Phone",
      emailLabel: "Email",
      addressLabel: "Address",
      addressValue: "Tashkent city, Uzbekistan",
      rights: "BookStore. All rights reserved.",
      madeIn: "Developed with pride in Uzbekistan",
    },
  },
} as const;

export type Dictionary = (typeof translations)[Language];

export function getLocalizedCategoryName(
  category: { id?: number; name?: string },
  language: Language,
  t: Dictionary
): string {
  const nameLower = (category.name || "").toLowerCase();
  if (nameLower.includes("programming") || nameLower.includes("dasturlash")) {
    return language === "uz" ? "Dasturlash" : "Programming";
  }
  if (nameLower === "science" || nameLower.includes("ilmiy")) {
    return language === "uz" ? "Ilmiy adabiyot" : "Science";
  }
  if (nameLower.includes("business") || nameLower.includes("biznes")) {
    return language === "uz" ? "Biznes va iqtisod" : "Business";
  }
  if (nameLower.includes("history") || nameLower.includes("tarix")) {
    return language === "uz" ? "Tarixiy kitoblar" : "History";
  }
  if (nameLower.includes("psychology") || nameLower.includes("psixologiya") || nameLower.includes("shaxsiy") || nameLower.includes("personal")) {
    return language === "uz" ? "Psixologiya va shaxsiy rivojlanish" : "Psychology & Personal Growth";
  }
  if (nameLower.includes("badiiy") || nameLower.includes("fiction")) {
    return language === "uz" ? "Badiiy adabiyot" : "Fiction";
  }
  if (nameLower.includes("bolalar") || nameLower.includes("children")) {
    return language === "uz" ? "Bolalar adabiyoti" : "Children's Books";
  }
  return category.name || "";
}

export function getLocalizedBookTitle(
  book: { title?: string },
  language: Language,
  t: Dictionary
): string {
  const title = book.title || "";
  if (language === "uz") return title;
  if (title.includes("O'tkan") || title.includes("Otkan")) {
    return t.hero.fallbackTopTitle;
  }
  if (title.includes("Diqqat")) {
    return t.hero.fallbackMini1Title;
  }
  if (title.includes("Sariq devni")) {
    return t.hero.fallbackMini2Title;
  }
  return title;
}

export function getLocalizedBookDesc(
  book: { description?: string },
  language: Language,
  t: Dictionary
): string {
  const desc = book.description || "";
  if (!desc) return t.bookCard.noDesc;
  if (language === "uz") return desc;
  if (desc.includes("Tarixiy roman") || desc.includes("Abdulla Qodiriy")) {
    return t.hero.subtext1;
  }
  return desc;
}
