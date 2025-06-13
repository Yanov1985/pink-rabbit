<template>
  <!-- Семантическая статья о товаре для лучшего SEO -->
  <article
    class="product-card"
    @mouseenter="startSlider"
    @mouseleave="stopSlider"
    itemscope
    itemtype="https://schema.org/Product"
    role="article"
    :aria-label="`Товар: ${product.name}`"
  >
    <!-- Заголовок статьи - изображения и действия -->
    <header class="product-header" role="banner">
      <!-- Контейнер изображения товара -->
      <figure
        class="image-container"
        itemprop="image"
        role="img"
        :aria-label="`Изображения товара ${product.name}`"
      >
        <!-- Прелоадер -->
        <div v-if="imageLoading" class="image-loader" aria-hidden="true">
          <div
            class="spinner"
            role="status"
            aria-label="Загрузка изображения"
          ></div>
        </div>

        <!-- Слайдер изображений с плавными переходами -->
        <div
          class="image-slider"
          role="region"
          aria-label="Галерея изображений товара"
        >
          <img
            v-for="(image, index) in displayImages"
            :key="`slide-${index}`"
            :src="image"
            :alt="`${product.name} - изображение ${index + 1} из ${
              displayImages.length
            }`"
            class="slider-image"
            :class="{
              active: index === currentImageIndex,
              loaded: !imageLoading,
            }"
            @load="handleImageLoad"
            @error="handleImageError"
            loading="lazy"
            itemprop="image"
            :aria-hidden="index !== currentImageIndex"
          />
        </div>

        <!-- Навигация по слайдеру -->
        <nav
          class="slider-indicators"
          role="tablist"
          aria-label="Навигация по изображениям товара"
        >
          <button
            v-for="(_, index) in displayImages"
            :key="`indicator-${index}`"
            type="button"
            class="indicator"
            :class="{ active: index === currentImageIndex }"
            @click="goToSlide(index)"
            @mouseenter="pauseSlider"
            @mouseleave="resumeSlider"
            role="tab"
            :aria-selected="index === currentImageIndex"
            :aria-controls="`slide-${index}`"
            :aria-label="`Показать изображение ${index + 1} из ${
              displayImages.length
            }`"
          ></button>
        </nav>

        <!-- Бейджи товара -->
        <aside class="badges" role="complementary" aria-label="Статус товара">
          <span
            v-if="product.isNew"
            class="badge new"
            role="mark"
            aria-label="Новинка"
            >NEW</span
          >
          <span
            v-if="product.discount > 0"
            class="badge discount"
            role="mark"
            :aria-label="`Скидка ${product.discount} процентов`"
          >
            -{{ product.discount }}%
          </span>
          <span
            v-if="product.isHit"
            class="badge hit"
            role="mark"
            aria-label="Хит продаж"
            >ХИТ</span
          >
        </aside>

        <!-- Действия над товаром -->
        <nav
          class="action-buttons"
          role="toolbar"
          aria-label="Действия с товаром"
        >
          <button
            @click="toggleWishlist"
            type="button"
            class="action-btn"
            :class="{ active: product.inWishlist }"
            :title="
              product.inWishlist
                ? 'Удалить из избранного'
                : 'Добавить в избранное'
            "
            :aria-label="
              product.inWishlist
                ? 'Удалить из избранного'
                : 'Добавить в избранное'
            "
            :aria-pressed="product.inWishlist"
          >
            <HeartIcon class="icon" aria-hidden="true" />
          </button>
          <button
            @click="openQuickView"
            type="button"
            class="action-btn"
            title="Быстрый просмотр"
            aria-label="Быстрый просмотр товара"
          >
            <EyeIcon class="icon" aria-hidden="true" />
          </button>
          <button
            @click="toggleCompare"
            type="button"
            class="action-btn"
            :class="{ active: product.inCompare }"
            :title="
              product.inCompare
                ? 'Удалить из сравнения'
                : 'Добавить к сравнению'
            "
            :aria-label="
              product.inCompare
                ? 'Удалить из сравнения'
                : 'Добавить к сравнению'
            "
            :aria-pressed="product.inCompare"
          >
            <ArrowsRightLeftIcon class="icon" aria-hidden="true" />
          </button>
          <button
            @click="shareProduct"
            type="button"
            class="action-btn"
            title="Поделиться"
            aria-label="Поделиться товаром"
          >
            <ShareIcon class="icon" aria-hidden="true" />
          </button>
        </nav>
      </figure>
    </header>

    <!-- Основное содержимое товара -->
    <div class="product-info" role="main">
      <!-- Рейтинг товара -->
      <section
        class="rating-section"
        role="region"
        aria-labelledby="rating-heading"
      >
        <h2 id="rating-heading" class="sr-only">Рейтинг товара</h2>
        <div
          class="rating"
          itemprop="aggregateRating"
          itemscope
          itemtype="https://schema.org/AggregateRating"
          role="img"
          :aria-label="`Рейтинг ${product.rating} из 5 звезд, ${product.reviews} отзывов`"
        >
          <div class="stars" aria-hidden="true">
            <StarIcon
              v-for="i in 5"
              :key="i"
              class="star"
              :class="{ filled: i <= product.rating }"
            />
          </div>
          <span class="reviews">
            (<span itemprop="ratingValue">{{ product.rating }}</span
            >/5 -
            <span itemprop="reviewCount">{{ product.reviews }}</span> отзывов)
          </span>
          <!-- Скрытые микроданные для лучшего SEO -->
          <meta itemprop="bestRating" content="5" />
          <meta itemprop="worstRating" content="1" />
        </div>
      </section>

      <!-- Название товара - главный заголовок статьи -->
      <h1 class="product-title" itemprop="name">{{ product.name }}</h1>

      <!-- Цена товара -->
      <section
        class="price-section"
        role="region"
        aria-labelledby="price-heading"
      >
        <h2 id="price-heading" class="sr-only">Цена товара</h2>
        <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <data
            class="current-price"
            itemprop="price"
            :value="product.price"
            :aria-label="`Цена ${formatPrice(product.price)} рублей`"
          >
            {{ formatPrice(product.price) }} ₽
          </data>
          <data
            v-if="product.oldPrice"
            class="old-price"
            :value="product.oldPrice"
            :aria-label="`Старая цена ${formatPrice(product.oldPrice)} рублей`"
          >
            {{ formatPrice(product.oldPrice) }} ₽
          </data>

          <!-- Скрытые микроданные для цены -->
          <meta itemprop="priceCurrency" content="RUB" />
          <meta itemprop="priceValidUntil" :content="priceValidUntil" />
          <meta
            itemprop="availability"
            :content="
              product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock'
            "
          />
          <meta
            itemprop="itemCondition"
            content="https://schema.org/NewCondition"
          />
          <meta itemprop="url" :content="productUrl" />
        </div>
      </section>
    </div>

    <!-- Подвал карточки - действия -->
    <footer class="product-footer" role="contentinfo">
      <nav
        class="bottom-actions"
        role="navigation"
        aria-label="Действия с товаром"
      >
        <!-- Кнопка подробнее (компактная иконка) -->
        <button
          @click="openDetails"
          @mouseenter="handleButtonHover('details', true)"
          @mouseleave="handleButtonHover('details', false)"
          type="button"
          class="action-button detail-btn"
          title="Подробная информация"
          aria-label="Посмотреть подробную информацию о товаре"
        >
          <svg
            class="action-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
            role="img"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </button>

        <!-- Кнопка добавить в корзину -->
        <button
          v-if="product.inStock"
          @click="addToCart"
          @mouseenter="handleButtonHover('cart', true)"
          @mouseleave="handleButtonHover('cart', false)"
          type="button"
          class="action-button cart-btn"
          title="Добавить в корзину"
          aria-label="Добавить товар в корзину"
        >
          <svg
            class="action-icon cart-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
            role="img"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path
              d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
            />
          </svg>
          <span class="button-text">В корзину</span>
        </button>

        <!-- Кнопка "Нет в наличии" для товаров не в наличии -->
        <button
          v-else
          disabled
          type="button"
          class="action-button out-of-stock-btn"
          title="Товар отсутствует в наличии"
          aria-label="Товар отсутствует в наличии"
        >
          <svg
            class="action-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
            role="img"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93l14.14 14.14" />
          </svg>
          <span class="button-text">Нет в наличии</span>
        </button>
      </nav>
    </footer>

    <!-- Оверлей для товаров не в наличии -->
    <div
      v-if="!product.inStock"
      class="out-of-stock-overlay"
      role="alert"
      aria-live="polite"
      aria-label="Товар отсутствует в наличии"
    >
      <span class="out-of-stock-text">Нет в наличии</span>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from "vue";
import {
  HeartIcon,
  EyeIcon,
  ArrowsRightLeftIcon,
  StarIcon,
  ShareIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";

// Props
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits([
  "add-to-cart",
  "add-to-favorites",
  "remove-from-favorites",
  "add-to-compare",
  "remove-from-compare",
  "quick-view",
  "open-details",
  "share-product",
]);

// Реактивные данные
const currentImageIndex = ref(0);
const imageLoading = ref(true);
const sliderInterval = ref(null);

// Computed - убираем currentImage, теперь используем прямо массив изображений
const hasMultipleImages = computed(() => {
  return props.product.images && props.product.images.length > 1;
});

// Computed для отображаемых изображений - решает проблему с template
const displayImages = computed(() => {
  const images = props.product.images || [props.product.image];
  // Если у товара только одно изображение, дублируем его для демонстрации слайдера
  if (images.length === 1) {
    return [images[0], images[0]];
  }
  return images;
});

// Computed для количества слайдов
const totalSlides = computed(() => {
  return displayImages.value.length;
});

// Computed для SEO - URL товара
const productUrl = computed(() => {
  const slug = props.product.name
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s]/gi, "")
    .replace(/\s+/g, "-");

  // Проверяем доступность window объекта (для SSR)
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://pink-rabbit.ru"; // Замените на ваш домен

  return `${baseUrl}/product/${props.product.id}-${slug}`;
});

// Computed для SEO - срок действия цены (через 30 дней)
const priceValidUntil = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
});

// JSON-LD структурированные данные для SEO
const generateJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: props.product.name,
    description: `${props.product.brand} ${props.product.name} - ${props.product.material}, цвет: ${props.product.color}`,
    image: displayImages.value,
    brand: {
      "@type": "Brand",
      name: props.product.brand,
    },
    color: props.product.color,
    material: props.product.material,
    category: "Товары для взрослых",
    sku: `SKU-${props.product.id}`,
    mpn: `MPN-${props.product.id}`,
    offers: {
      "@type": "Offer",
      url: productUrl.value,
      priceCurrency: "RUB",
      price: props.product.price,
      priceValidUntil: priceValidUntil.value,
      availability: props.product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Pink Rabbit",
        url:
          typeof window !== "undefined"
            ? window.location.origin
            : "https://pink-rabbit.ru",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: props.product.rating,
      reviewCount: props.product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
  };

  // Добавляем старую цену если есть скидка
  if (props.product.oldPrice && props.product.oldPrice > props.product.price) {
    jsonLd.offers.priceSpecification = {
      "@type": "UnitPriceSpecification",
      price: props.product.price,
      priceCurrency: "RUB",
      validFrom: new Date().toISOString(),
      validThrough: priceValidUntil.value,
    };
  }

  // Добавляем дополнительные свойства если товар новый или хит
  if (props.product.isNew) {
    jsonLd.additionalProperty = jsonLd.additionalProperty || [];
    jsonLd.additionalProperty.push({
      "@type": "PropertyValue",
      name: "Новинка",
      value: "true",
    });
  }

  if (props.product.isHit) {
    jsonLd.additionalProperty = jsonLd.additionalProperty || [];
    jsonLd.additionalProperty.push({
      "@type": "PropertyValue",
      name: "Хит продаж",
      value: "true",
    });
  }

  return jsonLd;
};

// Методы
const formatPrice = (price) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

// Предварительная загрузка изображений для плавности
const preloadImages = () => {
  const images = props.product.images || [props.product.image];
  console.log("📦 Предзагружаем изображения:", images.length);

  images.forEach((imageSrc, index) => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      console.log(`🖼️ Загружаем изображение ${index + 1}:`, imageSrc);
    }
  });
};

const startSlider = () => {
  // Защита от повторных вызовов
  if (sliderInterval.value) {
    console.log("🔄 Слайдер уже запущен, пропускаем повторный запуск");
    return;
  }

  console.log("🎯 HOVER IN: Запускаем слайдер для товара:", props.product.name);
  console.log(
    "📸 Исходное количество изображений:",
    props.product.images?.length || 1
  );
  console.log("🔢 Общее количество слайдов для показа:", totalSlides.value);
  console.log("🖼️ Массив для отображения:", displayImages.value);

  // Предварительно загружаем все изображения
  preloadImages();

  // Сбрасываем индекс в начало для новой сессии
  currentImageIndex.value = 0;
  console.log("🔄 Сброс индекса на:", currentImageIndex.value);

  // Запускаем слайдер только если есть изображения для показа
  if (totalSlides.value > 1) {
    console.log("▶️ Создаем интервал слайдера с периодом 1200ms");

    sliderInterval.value = setInterval(() => {
      const oldIndex = currentImageIndex.value;
      const nextIndex = (currentImageIndex.value + 1) % totalSlides.value;

      console.log(
        `📱 TICK: переключаем слайд ${oldIndex} → ${nextIndex} (из ${totalSlides.value})`
      );
      console.log(`🕐 Время тика: ${new Date().toLocaleTimeString()}`);

      currentImageIndex.value = nextIndex;

      console.log(`✅ Индекс успешно обновлен на: ${currentImageIndex.value}`);
    }, 1200); // Чуть быстрее для лучшего UX

    console.log("✅ Интервал слайдера создан ID:", sliderInterval.value);
  } else {
    console.warn(
      "⚠️ Слайдер не запускается - недостаточно слайдов:",
      totalSlides.value
    );
  }
};

const stopSlider = () => {
  console.log(
    "🛑 HOVER OUT: Останавливаем слайдер для товара:",
    props.product.name
  );

  if (sliderInterval.value) {
    console.log("⏹️ Очищаем интервал с ID:", sliderInterval.value);
    clearInterval(sliderInterval.value);
    sliderInterval.value = null;
    console.log("✅ Интервал успешно очищен");
  } else {
    console.log("⚠️ Интервал уже был null");
  }

  // Возвращаем слайдер в начальное положение
  console.log("🔄 Возвращаем индекс в начальное положение");
  currentImageIndex.value = 0;
  console.log("✅ Индекс сброшен на:", currentImageIndex.value);
};

const handleImageLoad = () => {
  imageLoading.value = false;
};

const handleImageError = (event) => {
  imageLoading.value = false;
  console.warn("Ошибка загрузки изображения, устанавливаем fallback");

  // Устанавливаем fallback изображение из массива красивых заглушек
  const fallbackImages = [
    "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ];

  // Выбираем случайное fallback изображение
  const randomFallback =
    fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

  // Устанавливаем fallback изображение
  if (event && event.target) {
    event.target.src = randomFallback;
    console.log("✅ Установлено fallback изображение:", randomFallback);
  }
};

// Дополнительные методы для улучшения UX
const pauseSlider = () => {
  console.log("⏸️ ПАУЗА слайдера (hover на индикатор)");

  if (sliderInterval.value) {
    clearInterval(sliderInterval.value);
    sliderInterval.value = null;
    console.log("✅ Слайдер приостановлен для взаимодействия с индикатором");
  }
};

const resumeSlider = () => {
  console.log("▶️ ВОЗОБНОВЛЯЕМ слайдер после индикатора");

  // Возобновляем слайдер только если мышь все еще над карточкой
  if (!sliderInterval.value) {
    console.log("🔄 Перезапускаем слайдер после паузы");

    // Небольшая задержка для плавности UX
    setTimeout(() => {
      if (!sliderInterval.value && totalSlides.value > 1) {
        sliderInterval.value = setInterval(() => {
          const oldIndex = currentImageIndex.value;
          const nextIndex = (currentImageIndex.value + 1) % totalSlides.value;

          console.log(`📱 RESUMED TICK: ${oldIndex} → ${nextIndex}`);
          currentImageIndex.value = nextIndex;
        }, 1200);

        console.log("✅ Слайдер возобновлен после паузы");
      }
    }, 200);
  }
};

// Ручное переключение по клику на индикатор
const goToSlide = (index) => {
  console.log(`👆 КЛИК на индикатор ${index} для товара:`, props.product.name);

  currentImageIndex.value = index;

  // Перезапускаем слайдер с новой позиции
  console.log("🔄 Перезапускаем слайдер с новой позиции");
  pauseSlider();
  setTimeout(() => {
    resumeSlider();
  }, 100);
};

const logHover = (buttonType) => {
  console.log(`Навели на кнопку: ${buttonType}`);
};

const handleButtonHover = (buttonType, isEntering) => {
  console.log(`🎯 ${isEntering ? "HOVER IN" : "HOVER OUT"}: ${buttonType}`);
};

// Обработчики событий
const addToCart = () => {
  console.log("🛒 КЛИК: Добавляем в корзину:", props.product.name);
  console.log("🛒 Товар в наличии:", props.product.inStock);
  emit("add-to-cart", props.product);
};

const openDetails = () => {
  console.log("ℹ️ КЛИК: Открываем детали:", props.product.name);
  emit("open-details", props.product);
};

const toggleWishlist = () => {
  if (props.product.inWishlist) {
    emit("remove-from-favorites", props.product);
  } else {
    emit("add-to-favorites", props.product);
  }
};

const toggleCompare = () => {
  if (props.product.inCompare) {
    emit("remove-from-compare", props.product);
  } else {
    emit("add-to-compare", props.product);
  }
};

const openQuickView = () => {
  console.log("Быстрый просмотр:", props.product.name);
  emit("quick-view", props.product);
};

const shareProduct = () => {
  console.log("Поделиться товаром:", props.product.name);
  emit("share-product", props.product);
};

// Очистка при размонтировании компонента
onUnmounted(() => {
  // Останавливаем слайдер
  if (sliderInterval.value) {
    console.log("🧹 Очистка: остановка слайдера при размонтировании");
    clearInterval(sliderInterval.value);
    sliderInterval.value = null;
  }

  // Удаляем JSON-LD скрипт
  if (typeof window !== "undefined") {
    const existingScript = document.querySelector(
      `script[data-product-id="${props.product.id}"]`
    );
    if (existingScript) {
      existingScript.remove();
      console.log(
        "🧹 Очистка: JSON-LD скрипт удален для товара:",
        props.product.id
      );
    }
  }
});

// Используем useHead для добавления JSON-LD в head (только на клиенте)
if (typeof window !== "undefined") {
  // Динамически добавляем JSON-LD через DOM API
  watch(
    () => props.product,
    () => {
      // Удаляем старый JSON-LD если есть
      const existingScript = document.querySelector(
        `script[data-product-id="${props.product.id}"]`
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Добавляем новый JSON-LD
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-product-id", props.product.id);
      script.textContent = JSON.stringify(generateJsonLd(), null, 2);
      document.head.appendChild(script);

      console.log("🔍 SEO: JSON-LD добавлен для товара:", props.product.name);
    },
    { immediate: true }
  );
}
</script>

<style scoped>
/* === ОСНОВНОЙ HOVER ЭФФЕКТ - УСИЛЕННАЯ ВЕРСИЯ === */
.product-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.8);
  overflow: hidden;
  position: relative;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: flex;
  flex-direction: column;
  height: 100%;
  transform: translateY(0) translateZ(0);
  backface-visibility: hidden;
  will-change: transform, box-shadow, border-color;
}

/* КРИТИЧЕСКИ ВАЖНЫЙ HOVER ЭФФЕКТ - НЕ МОЖЕТ БЫТЬ ПЕРЕОПРЕДЕЛЕН */
.product-card:hover,
article.product-card:hover,
[itemtype="https://schema.org/Product"]:hover
{
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12),
    0 6px 20px rgba(255, 107, 157, 0.15) !important;
  transform: translateY(-8px) translateZ(0) scale(1.008) !important;
  border-color: rgba(255, 107, 157, 0.4) !important;
  background: linear-gradient(135deg, #ffffff 0%, #fdfdfd 100%) !important;
}

/* УСИЛЕННЫЕ HOVER ЭФФЕКТЫ ДЛЯ ЭЛЕМЕНТОВ ВНУТРИ */
.product-card:hover .product-title,
article.product-card:hover .product-title,
.product-card:hover h1.product-title {
  color: #ec4899 !important;
  transform: translateY(-1px) translateZ(0) !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.product-card:hover .current-price,
article.product-card:hover .current-price,
.product-card:hover [itemprop="price"] {
  color: #d946ef !important;
  transform: scale(1.02) translateZ(0) !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.product-card:hover .badge,
article.product-card:hover .badge {
  transform: scale(1.05) rotate(1deg) translateZ(0) !important;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25) !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.product-card:hover .stars,
article.product-card:hover .stars,
.product-card:hover [role="img"] .stars {
  transform: translateY(-1px) translateZ(0) !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.product-card:hover .star.filled,
article.product-card:hover .star.filled {
  animation: starGlow 0.5s ease-out !important;
  filter: drop-shadow(0 0 4px #f59e0b) !important;
}

/* АНИМАЦИЯ ЗВЕЗДОЧЕК - СТАБИЛЬНАЯ ВЕРСИЯ */
@keyframes starGlow {
  0%,
  100% {
    transform: scale(1) translateZ(0) !important;
  }
  50% {
    transform: scale(1.1) translateZ(0) !important;
  }
}

/* === ГЛОБАЛЬНАЯ ЗАЩИТА HOVER ЭФФЕКТА === */
/* Эти стили защищают hover эффект от исчезновения после любых изменений DOM */

/* Транзишены для всех элементов внутри карточки */
.product-card * {
  transition-duration: 0.25s !important;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Дополнительная защита для основных элементов */
.product-card .product-title,
.product-card h1 {
  transition: color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.product-card .current-price,
.product-card [itemprop="price"] {
  transition: color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.product-card .badge {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.product-card .stars {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.product-card .star.filled {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* === КОНТЕЙНЕР ИЗОБРАЖЕНИЯ === */
.image-container {
  position: relative;
  aspect-ratio: 1; /* Квадратный контейнер */
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  overflow: hidden;
  cursor: pointer;
  /* Убеждаемся что контейнер полностью заполняется */
  width: 100%;
  min-height: 0; /* Важно для flex элементов */
}

.image-container:hover {
  /* Дополнительные эффекты при hover */
  box-shadow: inset 0 0 20px rgba(255, 107, 157, 0.1);
}

.image-container:hover .slider-indicators {
  /* Индикаторы становятся более заметными при hover */
  background: rgba(0, 0, 0, 0.2);
  transform: translateX(-50%) translateY(-2px);
}

/* === СКРЫТЫЕ ЗАГОЛОВКИ ДЛЯ ACCESSIBILITY === */
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

/* === СЛАЙДЕР ИЗОБРАЖЕНИЙ === */
.image-slider {
  position: absolute; /* Абсолютное позиционирование для полного заполнения */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Заполняем весь контейнер */
  overflow: hidden;
  background: #f8f8f8;
  border-radius: 8px;
  /* Убираем flex - используем absolute позиционирование */
}

.slider-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Заполняет всю область с сохранением пропорций */
  object-position: center; /* Центрируем изображение */
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  border-radius: 8px;
  /* Дополнительная защита от пустого пространства */
  min-width: 100%;
  min-height: 100%;
}

.slider-image.active {
  opacity: 1;
}

/* === НАВИГАЦИЯ СЛАЙДЕРА === */
.slider-indicators {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 10;
  /* Стильный темный фон с размытием */
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  /* Плавная анимация появления */
  opacity: 0.8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Усиливаем эффект при ховере на карточку */
.product-card:hover .slider-indicators {
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.indicator.active {
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.indicator:hover {
  background: rgba(255, 107, 157, 0.8);
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(255, 107, 157, 0.3);
}

/* Анимация пульсации для активного индикатора */
.indicator.active::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  opacity: 0.3;
  animation: indicatorPulse 2s infinite;
  z-index: -1;
}

@keyframes indicatorPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.image-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fce7f3, #f3e8ff);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f472b6;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* === БЕЙДЖИ === */
.badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 15;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.new {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.badge.discount {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.badge.hit {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

/* === КНОПКИ ДЕЙСТВИЙ === */
.action-buttons {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
  transform: translateX(8px);
  transition: all 0.3s ease;
  z-index: 20;
}

.product-card:hover .action-buttons {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.action-btn:hover {
  background: #ff6b9d;
  color: white;
  transform: scale(1.1);
}

.action-btn.active {
  background: #ff6b9d;
  color: white;
}

.icon {
  width: 16px;
  height: 16px;
}

/* === ИНФОРМАЦИЯ О ТОВАРЕ === */
.product-info {
  padding: 16px 16px 16px 16px; /* Равномерные отступы по всем сторонам */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.stars {
  display: flex;
  gap: 1px;
}

.star {
  width: 12px;
  height: 12px;
  color: #d1d5db;
  transition: color 0.2s ease;
}

.star.filled {
  color: #fbbf24;
  fill: currentColor;
}

.reviews {
  font-size: 12px;
  color: #6b7280;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.4;
  /* Современное ограничение текста без webkit префиксов */
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  max-height: 2.8em; /* Ровно 2 строки при line-height: 1.4 */
  /* Альтернативный fallback для всех браузеров */
  white-space: normal;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  /* Позволяем этому блоку расти и занимать оставшееся место */
  flex-grow: 1;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.old-price {
  font-size: 14px;
  color: #6b7280;
  text-decoration: line-through;
}

/* === ОВЕРЛЕЙ ДЛЯ ТОВАРОВ НЕ В НАЛИЧИИ === */
.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  z-index: 5;
  /* НЕ перекрываем нижние кнопки */
  pointer-events: none;
}

/* === НИЖНИЕ КНОПКИ ДЕЙСТВИЙ === */
.bottom-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  /* Убираем margin-top и позиционируем в конце флекс-контейнера */
  margin-top: auto;
  /* Добавляем отступы от краев карточки для визуального "дыхания" */
  margin-bottom: 8px; /* Увеличенный отступ снизу */
  padding: 0 8px; /* Отступы по бокам */
  /* Фиксированная высота для одинакового расположения на всех карточках */
  min-height: 42px;
  /* ВЫСОКИЙ Z-INDEX для кликабельности */
  position: relative;
  z-index: 25;
}

/* Базовые стили для всех нижних кнопок */
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
  /* УБЕЖДАЕМСЯ что кнопки кликабельны */
  pointer-events: auto;
  z-index: 30;
}

/* Анимация при hover для всех кнопок - с повышенной специфичностью */
.action-button:hover:not(:disabled) {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
  z-index: 10 !important;
}

/* Кнопка подробнее - компактная круглая */
.detail-btn {
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-color: #cbd5e1;
}

.detail-btn:hover {
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3) !important;
  color: white !important;
  border-color: #ff6b9d !important;
  transform: translateY(-2px) scale(1.05) !important;
  box-shadow: 0 8px 20px rgba(255, 107, 157, 0.25) !important;
}

/* Кнопка корзины - основная кнопка */
.cart-btn {
  flex: 1;
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  color: white;
  border-color: #ff6b9d;
  font-weight: 600;
}

.cart-btn:hover {
  background: linear-gradient(135deg, #ff5a8a, #ff7ba7) !important;
  border-color: #ff5a8a !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 10px 25px rgba(255, 107, 157, 0.25) !important;
}

/* Кнопка "Нет в наличии" */
.out-of-stock-btn {
  flex: 1;
  background: #f9fafb;
  color: #9ca3af;
  border-color: #e5e7eb;
  cursor: not-allowed;
  opacity: 0.7;
}

.out-of-stock-btn:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* Иконки в кнопках */
.action-icon {
  width: 18px;
  height: 18px;
  transition: all 0.3s ease !important;
}

/* Анимация иконок при hover - с повышенной специфичностью */
.action-button:hover:not(:disabled) .action-icon {
  transform: scale(1.1) !important;
}

/* Специальная анимация для иконки корзины */
.cart-btn:hover .cart-icon {
  animation: cartBounce 0.6s ease !important;
}

@keyframes cartBounce {
  0%,
  100% {
    transform: scale(1.1) !important;
  }
  50% {
    transform: scale(1.3) !important;
  }
}

/* Текст в кнопках */
.button-text {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease !important;
}

/* Эффект нажатия для всех кнопок */
.action-button:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98) !important;
}

/* Эффект пульсации при focus */
.action-button:focus:not(:disabled) {
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.3) !important;
}

/* === АДАПТИВНОСТЬ === */
@media (max-width: 768px) {
  .action-buttons {
    position: static;
    flex-direction: row;
    opacity: 1;
    transform: none;
    justify-content: center;
    margin-top: 8px;
  }

  .product-card:hover {
    transform: translateY(-1px);
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  /* Адаптивные стили для нижних кнопок */
  .bottom-actions {
    gap: 8px;
    margin-top: auto;
    min-height: 38px;
  }

  .action-button {
    padding: 8px 10px;
    font-size: 12px;
  }

  .detail-btn {
    width: 38px;
    height: 38px;
  }

  .action-icon {
    width: 16px;
    height: 16px;
  }

  .button-text {
    font-size: 12px;
  }

  /* Уменьшаем анимации на мобильных */
  .action-button:hover:not(:disabled) {
    transform: translateY(-1px) !important;
  }

  .detail-btn:hover {
    transform: translateY(-1px) scale(1.02) !important;
  }

  .cart-btn:hover {
    transform: translateY(-1px) scale(1.01) !important;
  }
}
</style>
