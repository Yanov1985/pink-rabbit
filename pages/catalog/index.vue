<!--
  🏪 Главная страница каталога интернет-магазина Pink Rabbit
  🎯 SEO МОНСТР: Schema.org + OpenGraph + Семантическая верстка
  ✨ Уровень оптимизации: Amazon + Google Shopping + Instagram
-->
<template>
  <div
    class="catalog-page"
    itemscope
    itemtype="https://schema.org/CollectionPage"
  >
    <!-- 🌈 Героическая секция с градиентом -->
    <section
      class="catalog-hero"
      itemscope
      itemtype="https://schema.org/WPHeader"
    >
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title" itemprop="name">
            Каталог товаров Pink Rabbit
          </h1>
          <p class="hero-description" itemprop="description">
            Добро пожаловать в наш каталог интимных товаров. Выберите
            интересующую вас категорию и откройте мир новых возможностей
          </p>

          <!-- 📊 Статистика -->
          <div class="hero-stats" v-if="!isInitialLoading">
            <div class="stat-item">
              <span class="stat-number">{{ totalCategories }}</span>
              <span class="stat-label">категорий</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ totalProducts }}</span>
              <span class="stat-label">товаров</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">4.8</span>
              <span class="stat-label">рейтинг</span>
            </div>
          </div>

          <!-- 🔄 Индикатор загрузки -->
          <div v-if="isInitialLoading" class="loading-indicator">
            <div class="loading-spinner"></div>
            <p>Загружаем каталог...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 🛍️ Сетка категорий товаров -->
    <section
      class="categories-section"
      itemscope
      itemtype="https://schema.org/ItemList"
      aria-labelledby="categories-title"
    >
      <div class="container">
        <h2 id="categories-title" class="categories-title">
          Категории товаров интернет-магазина
        </h2>

        <!-- 📋 Мета-информация для Schema.org -->
        <meta
          itemprop="numberOfItems"
          :content="categories.length.toString()"
        />
        <meta
          itemprop="itemListOrder"
          content="https://schema.org/ItemListOrderAscending"
        />

        <!-- 🔄 Статус загрузки -->
        <div v-if="isInitialLoading" class="loading-message">
          Загрузка категорий...
        </div>

        <!-- 🗂️ Сетка категорий -->
        <div v-else class="categories-grid">
          <article
            v-for="(category, index) in categories"
            :key="category.slug"
            class="category-card"
            :class="{ featured: category.featured }"
            itemscope
            itemtype="https://schema.org/ListItem"
            @click="selectCategory(category)"
            @keydown.enter="selectCategory(category)"
            @keydown.space.prevent="selectCategory(category)"
            tabindex="0"
            role="button"
            :aria-label="`Перейти в категорию ${category.title}`"
          >
            <!-- 📊 Schema.org данные -->
            <meta itemprop="position" :content="(index + 1).toString()" />

            <div itemprop="item" itemscope itemtype="https://schema.org/Thing">
              <!-- 🎨 Иконка категории -->
              <div
                class="category-icon"
                :style="{ backgroundColor: category.color }"
                aria-hidden="true"
              >
                <span class="icon-emoji">{{ category.icon }}</span>
              </div>

              <!-- 📝 Информация о категории -->
              <div class="category-content">
                <h3 class="category-title" itemprop="name">
                  {{ category.title }}
                </h3>
                <p class="category-description" itemprop="description">
                  {{ category.description }}
                </p>

                <!-- 📊 Статистика категории -->
                <div class="category-stats">
                  <span class="stat">{{ category.count }} товаров</span>
                  <span class="stat rating">⭐ {{ category.rating }}</span>
                </div>
              </div>

              <!-- 🏷️ Бейдж "Популярное" -->
              <div v-if="category.featured" class="featured-badge">
                🔥 Популярное
              </div>

              <!-- ➡️ Стрелка -->
              <div class="category-arrow" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  />
                </svg>
              </div>

              <!-- 🔗 Скрытая ссылка для Schema.org -->
              <meta
                itemprop="url"
                :content="`https://pinkrabbit.ru${category.path}`"
              />
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 📱 Дополнительная информация с микроданными -->
    <section
      class="catalog-features"
      aria-labelledby="features-heading"
      itemscope
      itemtype="https://schema.org/ItemList"
    >
      <div class="container">
        <h2 id="features-heading" class="sr-only">
          Преимущества нашего интернет-магазина
        </h2>

        <div class="features-grid">
          <!-- 🚚 Быстрая доставка с Schema.org -->
          <article
            class="feature-card"
            itemscope
            itemtype="https://schema.org/Service"
          >
            <div class="feature-icon" aria-hidden="true">🚚</div>
            <h3 class="feature-title" itemprop="name">Быстрая доставка</h3>
            <p class="feature-description" itemprop="description">
              Доставляем по всей России в течение 1-3 дней
            </p>
            <meta itemprop="serviceType" content="Delivery" />
            <meta itemprop="areaServed" content="Russia" />
            <div
              itemprop="offers"
              itemscope
              itemtype="https://schema.org/Offer"
            >
              <meta itemprop="availabilityStarts" content="2025-01-01" />
              <meta itemprop="deliveryLeadTime" content="P1DT3D" />
            </div>
          </article>

          <!-- 🔒 Конфиденциальность с Schema.org -->
          <article
            class="feature-card"
            itemscope
            itemtype="https://schema.org/Service"
          >
            <div class="feature-icon" aria-hidden="true">🔒</div>
            <h3 class="feature-title" itemprop="name">
              100% конфиденциальность
            </h3>
            <p class="feature-description" itemprop="description">
              Дискретная упаковка без опознавательных знаков
            </p>
            <meta itemprop="serviceType" content="Privacy Protection" />
            <div
              itemprop="serviceOutput"
              itemscope
              itemtype="https://schema.org/Thing"
            >
              <meta itemprop="name" content="Дискретная упаковка" />
            </div>
          </article>

          <!-- ⭐ Качество с Schema.org -->
          <article
            class="feature-card"
            itemscope
            itemtype="https://schema.org/Service"
          >
            <div class="feature-icon" aria-hidden="true">⭐</div>
            <h3 class="feature-title" itemprop="name">Только оригинал</h3>
            <p class="feature-description" itemprop="description">
              Работаем напрямую с официальными поставщиками
            </p>
            <meta itemprop="serviceType" content="Quality Assurance" />
            <div
              itemprop="provider"
              itemscope
              itemtype="https://schema.org/Organization"
            >
              <meta itemprop="name" content="Официальные поставщики" />
            </div>
          </article>

          <!-- 💳 Оплата с Schema.org -->
          <article
            class="feature-card"
            itemscope
            itemtype="https://schema.org/PaymentService"
          >
            <div class="feature-icon" aria-hidden="true">💳</div>
            <h3 class="feature-title" itemprop="name">Удобная оплата</h3>
            <p class="feature-description" itemprop="description">
              Банковские карты, электронные кошельки, наличные
            </p>
            <meta itemprop="paymentMethodAccepted" content="Credit Card" />
            <meta itemprop="paymentMethodAccepted" content="Digital Wallet" />
            <meta itemprop="paymentMethodAccepted" content="Cash" />
          </article>
        </div>
      </div>
    </section>

    <!-- 📞 Контактная информация с LocalBusiness Schema -->
    <section
      class="catalog-contact"
      aria-labelledby="contact-heading"
      itemscope
      itemtype="https://schema.org/LocalBusiness"
    >
      <div class="container">
        <div class="contact-content">
          <h2 id="contact-heading" class="contact-title" itemprop="name">
            Нужна помощь в выборе?
          </h2>
          <p class="contact-description" itemprop="description">
            Наши консультанты помогут подобрать идеальный товар
          </p>

          <!-- 📞 Контактные данные с Schema.org -->
          <div class="contact-actions">
            <a
              href="tel:+78001234567"
              class="contact-button primary"
              aria-label="Позвонить по телефону 8 800 123 45 67"
              itemprop="telephone"
              content="+78001234567"
            >
              📞 8 800 123 45 67
            </a>
            <a
              href="mailto:support@pinkrabbit.ru"
              class="contact-button secondary"
              aria-label="Написать на email support@pinkrabbit.ru"
              itemprop="email"
              content="support@pinkrabbit.ru"
            >
              ✉️ Написать нам
            </a>
          </div>

          <!-- 🕐 Скрытые данные для Schema.org -->
          <div style="display: none">
            <div
              itemprop="address"
              itemscope
              itemtype="https://schema.org/PostalAddress"
            >
              <meta itemprop="addressCountry" content="RU" />
              <meta itemprop="addressRegion" content="Москва" />
            </div>
            <div itemprop="openingHours" content="Mo-Fr 09:00-21:00">
              Пн-Пт 9:00-21:00
            </div>
            <div itemprop="openingHours" content="Sa-Su 10:00-20:00">
              Сб-Вс 10:00-20:00
            </div>
            <meta itemprop="priceRange" content="₽₽" />
            <div
              itemprop="aggregateRating"
              itemscope
              itemtype="https://schema.org/AggregateRating"
            >
              <meta itemprop="ratingValue" content="4.8" />
              <meta itemprop="reviewCount" content="2547" />
              <meta itemprop="bestRating" content="5" />
              <meta itemprop="worstRating" content="1" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 🔍 Accessibility: Область для объявлений screen reader -->
    <div
      id="announcements"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    ></div>
  </div>
</template>

<script setup lang="ts">
// 🎯 Интерфейсы
interface Category {
  slug: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  color: string;
  featured: boolean;
  count: number;
  rating: number;
}

// 🎯 Метаданные для SEO как у топовых сайтов
definePageMeta({
  title: "Каталог интимных товаров - Интернет-магазин для взрослых Pink Rabbit",
  description:
    "Полный каталог интимных товаров: вибраторы, мастурбаторы, презервативы, смазки, БДСМ, белье и многое другое. Быстрая доставка по России.",
  keywords:
    "интимные товары, секс шоп, вибраторы, презервативы, смазки, эротическое белье, БДСМ",
});

// 🌐 SEO мета теги как в Amazon + дополнительные OpenGraph
useSeoMeta({
  title: "Каталог товаров - Pink Rabbit | Интимные товары для взрослых",
  ogTitle: "Каталог интимных товаров - Pink Rabbit | Официальный магазин",
  description:
    "Каталог интимных товаров для взрослых с быстрой доставкой. ✅ Оригинальные товары ✅ Дискретная упаковка ✅ Гарантия качества",
  ogDescription:
    "Широкий выбор качественных товаров для взрослых с доставкой по России. Более 1500 товаров в 20 категориях.",
  ogImage: "/images/catalog-hero.jpg",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Каталог интимных товаров Pink Rabbit",
  twitterCard: "summary_large_image",
  twitterTitle: "Каталог товаров Pink Rabbit - интимные товары для взрослых",
  twitterDescription:
    "Официальный каталог качественных интимных товаров. Быстрая доставка, дискретная упаковка.",
  twitterImage: "/images/catalog-hero.jpg",

  // 🏷️ Дополнительные мета-теги для бизнеса
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  canonical: "https://pinkrabbit.ru/catalog",
  author: "Pink Rabbit",
  publisher: "Pink Rabbit",

  // 📱 Mobile оптимизация
  viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
  themeColor: "#e91e63",

  // 🌍 Языковые мета-теги
  ogLocale: "ru_RU",
  articleAuthor: "Pink Rabbit Team",
});

// 📊 Реактивные данные состояния
const isInitialLoading = ref(true);
const totalCategories = ref(20);
const totalProducts = ref(1547);

// 🗂️ Данные категорий (как в настоящем интернет-магазине)
const categories = ref<Category[]>([
  {
    slug: "seks-igrushki",
    title: "Секс-игрушки",
    description: "Широкий выбор качественных игрушек для взрослых",
    path: "/catalog/seks-igrushki",
    icon: "🔥",
    color: "#FF6B9D",
    featured: true,
    count: 245,
    rating: 4.8,
  },
  {
    slug: "vibrators",
    title: "Вибраторы",
    description: "Качественные вибраторы для женщин всех форм и размеров",
    path: "/catalog/seks-igrushki/vibrators",
    icon: "💖",
    color: "#8B5CF6",
    featured: true,
    count: 156,
    rating: 4.9,
  },
  {
    slug: "dildos",
    title: "Фаллоимитаторы",
    description: "Реалистичные и фантазийные модели из медицинского силикона",
    path: "/catalog/seks-igrushki/dildos",
    icon: "🍆",
    color: "#F59E0B",
    featured: true,
    count: 89,
    rating: 4.7,
  },
  {
    slug: "masturbators",
    title: "Мастурбаторы",
    description: "Эксклюзивные игрушки для мужчин с реалистичной текстурой",
    path: "/catalog/seks-igrushki/masturbators",
    icon: "🔥",
    color: "#EC4899",
    featured: true,
    count: 67,
    rating: 4.8,
  },
  {
    slug: "couples",
    title: "Для пар",
    description: "Игрушки и аксессуары для совместного использования",
    path: "/catalog/seks-igrushki/couples",
    icon: "💕",
    color: "#374151",
    featured: false,
    count: 45,
    rating: 4.6,
  },
  {
    slug: "bdsm",
    title: "БДСМ",
    description: "Профессиональные аксессуары для ролевых игр",
    path: "/catalog/seks-igrushki/bdsm",
    icon: "⛓️",
    color: "#F472B6",
    featured: false,
    count: 78,
    rating: 4.5,
  },
  {
    slug: "lingerie",
    title: "Эротическое белье",
    description: "Соблазнительное белье и костюмы для особых моментов",
    path: "/catalog/lingerie",
    icon: "👙",
    color: "#06B6D4",
    featured: true,
    count: 234,
    rating: 4.7,
  },
  {
    slug: "lubricants",
    title: "Смазки и лубриканты",
    description: "Профессиональные смазки для максимального комфорта",
    path: "/catalog/lubricants",
    icon: "💧",
    color: "#10B981",
    featured: false,
    count: 123,
    rating: 4.8,
  },
]);

// 🏢 Schema.org для организации (как у Amazon)
const organizationSchema = computed(() =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pink Rabbit",
    description: "Интернет-магазин качественных интимных товаров для взрослых",
    url: "https://pinkrabbit.ru",
    logo: "https://pinkrabbit.ru/images/logo.png",
    image: "https://pinkrabbit.ru/images/catalog-hero.jpg",
    telephone: "+7-800-123-45-67",
    email: "support@pinkrabbit.ru",
    address: {
      "@type": "PostalAddress",
      addressCountry: "RU",
      addressRegion: "Москва",
    },
    sameAs: [
      "https://vk.com/pinkrabbit",
      "https://t.me/pinkrabbit",
      "https://instagram.com/pinkrabbit",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      reviewCount: 2547,
      bestRating: 5,
      worstRating: 1,
    },
    priceRange: "₽₽",
    openingHours: ["Mo-Fr 09:00-21:00", "Sa-Su 10:00-20:00"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Каталог интимных товаров",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Интимные игрушки",
          itemListElement: [
            {
              "@type": "Offer",
              category: "Вибраторы",
            },
            {
              "@type": "Offer",
              category: "Мастурбаторы",
            },
          ],
        },
      ],
    },
  })
);

// 🌐 Schema.org для сайта (как у Google)
const websiteSchema = computed(() =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pink Rabbit",
    description: "Интернет-магазин интимных товаров для взрослых",
    url: "https://pinkrabbit.ru",
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://pinkrabbit.ru/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Pink Rabbit",
      logo: "https://pinkrabbit.ru/images/logo.png",
    },
  })
);

// 🍞 Schema.org для хлебных крошек (как у Wildberries)
const breadcrumbSchema = computed(() =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://pinkrabbit.ru",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Каталог",
        item: "https://pinkrabbit.ru/catalog",
      },
    ],
  })
);

// 📋 Schema.org для каталога (как у OZON)
const catalogSchema = computed(() =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Каталог интимных товаров Pink Rabbit",
    description:
      "Полный каталог качественных интимных товаров для взрослых с быстрой доставкой по России",
    url: "https://pinkrabbit.ru/catalog",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCategories.value,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Интимные игрушки",
          description:
            "Широкий выбор товаров для взрослых: для женщин, мужчин и пар",
          url: "https://pinkrabbit.ru/catalog/seks-igrushki",
          item: {
            "@type": "ProductCategory",
            name: "Интимные игрушки",
            description: "Качественные интимные игрушки для взрослых",
            url: "https://pinkrabbit.ru/catalog/seks-igrushki",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Вибраторы",
          description:
            "Элитные, Hi-tech, многофункциональные и другие типы вибраторов",
          url: "https://pinkrabbit.ru/catalog/seks-igrushki/vibratory",
          item: {
            "@type": "ProductCategory",
            name: "Вибраторы",
            description: "Профессиональные вибраторы высокого качества",
            url: "https://pinkrabbit.ru/catalog/seks-igrushki/vibratory",
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Смазки и лубриканты",
          description:
            "Интимные гели, лубриканты, вкусовые и увлажняющие средства",
          url: "https://pinkrabbit.ru/catalog/geli-i-smazki",
          item: {
            "@type": "ProductCategory",
            name: "Смазки и лубриканты",
            description: "Качественные интимные смазки и лубриканты",
            url: "https://pinkrabbit.ru/catalog/geli-i-smazki",
          },
        },
      ],
    },
    provider: {
      "@type": "Organization",
      name: "Pink Rabbit",
      url: "https://pinkrabbit.ru",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Adults",
    },
    inLanguage: "ru-RU",
    about: [
      {
        "@type": "Thing",
        name: "Интимные товары",
      },
      {
        "@type": "Thing",
        name: "Товары для взрослых",
      },
    ],
  })
);

// 🎯 Обработчик выбора категории
const selectCategory = (category: Category) => {
  console.log("🛍️ Выбрана категория:", category.title);

  // 📢 Объявление для скрин-ридеров
  announceToScreenReader(
    `Выбрана категория ${category.title}. ${category.description}`
  );

  // 📈 Отправка аналитики
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "select_content", {
      content_type: "category",
      content_id: category.slug,
      content_group1: "Catalog",
      value: category.count,
    });
  }

  // 🔄 Переход на страницу категории
  navigateTo(category.path);
};

// 📢 Функция для объявлений accessibility
const announceToScreenReader = (message: string) => {
  if (typeof document !== "undefined") {
    const announcements = document.getElementById("announcements");
    if (announcements) {
      announcements.textContent = message;
      // Очистка через 3 секунды
      setTimeout(() => {
        announcements.textContent = "";
      }, 3000);
    }
  }
};

// 🔥 Правильное добавление Schema.org через useHead
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: organizationSchema.value,
    },
    {
      type: "application/ld+json",
      innerHTML: websiteSchema.value,
    },
    {
      type: "application/ld+json",
      innerHTML: breadcrumbSchema.value,
    },
    {
      type: "application/ld+json",
      innerHTML: catalogSchema.value,
    },
  ],
});

// 🎭 Жизненный цикл компонента
onMounted(async () => {
  console.log("🏪 Загрузка главной страницы каталога Pink Rabbit");

  try {
    // 🔄 Симуляция загрузки данных с сервера
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 📊 Подсчет общей статистики
    totalCategories.value = categories.value.length;
    totalProducts.value = categories.value.reduce(
      (sum, cat) => sum + cat.count,
      0
    );

    console.log("📊 Данные каталога загружены:", {
      categories: totalCategories.value,
      products: totalProducts.value,
      featuredCategories: categories.value.filter((c) => c.featured).length,
    });

    // 📈 Отправка аналитики (если доступен gtag)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_title: "Каталог товаров",
        page_location: window.location.href,
        content_group1: "Catalog",
      });
    }
  } catch (error) {
    console.error("❌ Ошибка загрузки каталога:", error);
  } finally {
    isInitialLoading.value = false;
    console.log("✅ Каталог готов к использованию");
  }
});

// 🧹 Очистка при размонтировании
onUnmounted(() => {
  console.log("🧹 Очистка ресурсов страницы каталога");
});
</script>

<style scoped>
/* 🎨 Основные стили страницы */
.catalog-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* 📦 Контейнер */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 🏆 Hero секция */
.catalog-hero {
  padding: 4rem 0;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.catalog-hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
}

.hero-description {
  font-size: 1.25rem;
  margin: 0 0 2.5rem 0;
  opacity: 0.95;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* 📊 Статистика */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

/* 🔄 Загрузка */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 🛍️ Секция категорий */
.categories-section {
  padding: 4rem 0;
  background: white;
}

.categories-title {
  text-align: center;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: #1f2937;
  margin: 0 0 3rem 0;
  line-height: 1.2;
}

.loading-message {
  text-align: center;
  font-size: 1.25rem;
  color: #6b7280;
  padding: 4rem 2rem;
}

/* 🗂️ Сетка категорий */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

/* 🏷️ Карточка категории */
.category-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--category-color, #e2e8f0);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.category-card:hover::before,
.category-card:focus::before {
  transform: scaleX(1);
}

.category-card:hover,
.category-card:focus {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.category-card.featured {
  border-color: #fbbf24;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.category-card.featured::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

/* 🎨 Иконка категории */
.category-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1) rotate(5deg);
}

.icon-emoji {
  font-size: 1.8rem;
}

/* 📝 Контент категории */
.category-content {
  flex: 1;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.category-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

/* 📊 Статистика категории */
.category-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat {
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.stat.rating {
  background: #fef3c7;
  color: #92400e;
}

/* 🏷️ Бейдж популярности */
.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ➡️ Стрелка */
.category-arrow {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.category-card:hover .category-arrow,
.category-card:focus .category-arrow {
  color: #374151;
  transform: translateX(4px);
}

/* ✨ Преимущества */
.catalog-features {
  padding: 4rem 0;
  background: #f8fafc;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem 1.5rem;
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  display: block;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* 📞 Контакты */
.catalog-contact {
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.contact-content {
  max-width: 600px;
  margin: 0 auto;
}

.contact-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 900;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.contact-description {
  font-size: 1.1rem;
  margin: 0 0 2.5rem 0;
  opacity: 0.9;
  line-height: 1.6;
}

.contact-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  font-size: 1rem;
}

.contact-button.primary {
  background: white;
  color: #667eea;
}

.contact-button.primary:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.contact-button.secondary {
  background: transparent;
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.contact-button.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  transform: translateY(-2px);
}

/* 🔍 Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 📱 Адаптивность */
@media (max-width: 768px) {
  .hero-stats {
    gap: 1.5rem;
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .category-card {
    padding: 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem 1rem;
  }

  .contact-actions {
    flex-direction: column;
    align-items: center;
  }

  .contact-button {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .catalog-hero {
    padding: 3rem 0;
  }

  .hero-stats {
    gap: 1rem;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .category-icon {
    width: 56px;
    height: 56px;
    font-size: 1.25rem;
  }

  .category-title {
    font-size: 1.25rem;
  }

  .category-description {
    font-size: 0.9rem;
  }

  .feature-icon {
    font-size: 2rem;
  }

  .feature-title {
    font-size: 1.1rem;
  }

  .feature-description {
    font-size: 0.9rem;
  }
}

/* 🎭 Анимации */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.catalog-hero,
.categories-section,
.catalog-features,
.catalog-contact {
  animation: fadeInUp 0.8s ease-out;
}

/* 🎯 Performance оптимизации */
.category-card,
.feature-card,
.contact-button {
  will-change: transform;
}

.category-icon {
  will-change: transform;
}

/* 🌟 Плавные переходы */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 🎨 CSS переменные для цветов категорий */
.category-card:nth-child(1) {
  --category-color: #ff6b9d;
}
.category-card:nth-child(2) {
  --category-color: #8b5cf6;
}
.category-card:nth-child(3) {
  --category-color: #f59e0b;
}
.category-card:nth-child(4) {
  --category-color: #ec4899;
}
.category-card:nth-child(5) {
  --category-color: #374151;
}
.category-card:nth-child(6) {
  --category-color: #f472b6;
}
.category-card:nth-child(7) {
  --category-color: #06b6d4;
}
.category-card:nth-child(8) {
  --category-color: #10b981;
}
</style>
