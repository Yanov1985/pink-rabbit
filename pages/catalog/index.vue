<!--
  🏪 Главная страница каталога интернет-магазина Pink Rabbit
  🎯 Современный дизайн как Amazon + Apple + Instagram
  ✨ Компонентная архитектура, accessibility, производительность
-->
<template>
  <div class="catalog-page" role="main">
    <!-- 🌈 Героическая секция с градиентом -->
    <CatalogHero
      :is-loading="isInitialLoading"
      :total-categories="totalCategories"
      :total-products="totalProducts"
    />

    <!-- 🛍️ Сетка категорий товаров -->
    <CatalogCategoriesGrid
      :is-loading="isInitialLoading"
      @category-selected="handleCategorySelection"
    />

    <!-- 📱 Дополнительная информация -->
    <section class="catalog-features" aria-labelledby="features-heading">
      <div class="container">
        <h2 id="features-heading" class="sr-only">
          Преимущества нашего интернет-магазина
        </h2>

        <div class="features-grid">
          <!-- 🚚 Быстрая доставка -->
          <div class="feature-card">
            <div class="feature-icon" aria-hidden="true">
              🚚
            </div>
            <h3 class="feature-title">Быстрая доставка</h3>
            <p class="feature-description">
              Доставляем по всей России в течение 1-3 дней
            </p>
          </div>

          <!-- 🔒 Конфиденциальность -->
          <div class="feature-card">
            <div class="feature-icon" aria-hidden="true">
              🔒
            </div>
            <h3 class="feature-title">100% конфиденциальность</h3>
            <p class="feature-description">
              Дискретная упаковка без опознавательных знаков
            </p>
          </div>

          <!-- ⭐ Качество -->
          <div class="feature-card">
            <div class="feature-icon" aria-hidden="true">
              ⭐
            </div>
            <h3 class="feature-title">Только оригинал</h3>
            <p class="feature-description">
              Работаем напрямую с официальными поставщиками
            </p>
          </div>

          <!-- 💳 Оплата -->
          <div class="feature-card">
            <div class="feature-icon" aria-hidden="true">
              💳
            </div>
            <h3 class="feature-title">Удобная оплата</h3>
            <p class="feature-description">
              Банковские карты, электронные кошельки, наличные
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 📞 Контактная информация -->
    <section class="catalog-contact" aria-labelledby="contact-heading">
      <div class="container">
        <div class="contact-content">
          <h2 id="contact-heading" class="contact-title">
            Нужна помощь в выборе?
          </h2>
          <p class="contact-description">
            Наши консультанты помогут подобрать идеальный товар
          </p>
          <div class="contact-actions">
            <a
              href="tel:+78001234567"
              class="contact-button primary"
              aria-label="Позвонить по телефону 8 800 123 45 67"
            >
              📞 8 800 123 45 67
            </a>
            <a
              href="mailto:support@pinkrabbit.ru"
              class="contact-button secondary"
              aria-label="Написать на email support@pinkrabbit.ru"
            >
              ✉️ Написать нам
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 🎯 Метаданные для SEO
definePageMeta({
  title: "Каталог интимных товаров - Интернет-магазин для взрослых Pink Rabbit",
  description: "Полный каталог интимных товаров: вибраторы, мастурбаторы, презервативы, смазки, БДСМ, белье и многое другое. Быстрая доставка по России.",
  keywords: "интимные товары, секс шоп, вибраторы, презервативы, смазки, эротическое белье, БДСМ",
});

// 🌐 SEO мета теги как в Amazon
useSeoMeta({
  title: "Каталог товаров - Pink Rabbit",
  ogTitle: "Каталог интимных товаров - Pink Rabbit",
  description: "Каталог интимных товаров для взрослых с быстрой доставкой",
  ogDescription: "Широкий выбор качественных товаров для взрослых с доставкой по России",
  ogImage: "/images/catalog-hero.jpg",
  twitterCard: "summary_large_image",

  // Schema.org разметка для поисковиков
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Каталог товаров Pink Rabbit",
    "description": "Интернет-магазин интимных товаров для взрослых",
    "url": "https://pinkrabbit.ru/catalog",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": 20,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Интимные игрушки"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Вибраторы"
        }
      ]
    }
  }
});

// 📊 Реактивные данные состояния
const isInitialLoading = ref(true);
const totalCategories = ref(20);
const totalProducts = ref(1547);

// 🎭 Жизненный цикл компонента
onMounted(async () => {
  // Имитируем загрузку данных как в реальном приложении
  console.log("🏪 Инициализация главной страницы каталога");

  try {
    // Симуляция загрузки статистики каталога
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Обновляем счетчики
    totalCategories.value = 20;
    totalProducts.value = 1547;

    console.log("📊 Данные каталога загружены:", {
      categories: totalCategories.value,
      products: totalProducts.value
    });

  } catch (error) {
    console.error("❌ Ошибка загрузки каталога:", error);
  } finally {
    isInitialLoading.value = false;
    console.log("✅ Страница каталога готова");
  }
});

// 🎯 Обработчик выбора категории
const handleCategorySelection = (category) => {
  console.log("🛍️ Выбрана категория:", category.title);

  // Отправляем аналитику как в Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'category_selected', {
      'category_name': category.title,
      'category_slug': category.slug,
      'page_location': '/catalog'
    });
  }

  // Уведомление для screen readers
  announceToScreenReader(`Переход в категорию ${category.title}`);
};

// 📢 Accessibility функция для screen readers
const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
};

// 🔄 Cleanup при размонтировании
onUnmounted(() => {
  console.log("🧹 Очистка ресурсов страницы каталога");
});
</script>

<style scoped>
/* 🎨 Основная страница */
.catalog-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* 🛍️ Контейнер */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* ✨ Секция преимуществ */
.catalog-features {
  padding: 4rem 0;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* 📞 Контактная секция */
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
  margin: 0 0 2rem 0;
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
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
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
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem 1rem;
  }

  .catalog-contact {
    padding: 3rem 0;
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

/* 🎭 Анимации загрузки */
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

.catalog-features,
.catalog-contact {
  animation: fadeInUp 0.8s ease-out;
}

/* 🎯 Performance оптимизации */
.feature-card,
.contact-button {
  will-change: transform;
}

/* 🌟 Улучшенные переходы */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
