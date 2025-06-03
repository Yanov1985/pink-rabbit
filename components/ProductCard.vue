<template>
  <div class="product-card">
    <!-- Контейнер изображения -->
    <div
      class="image-container"
      @mouseenter="startSlider"
      @mouseleave="stopSlider"
    >
      <!-- Прелоадер -->
      <div v-if="imageLoading" class="image-loader">
        <div class="spinner"></div>
      </div>

      <!-- Изображение товара -->
      <img
        :src="currentImage"
        :alt="product.name"
        class="product-image"
        :class="{ loaded: !imageLoading }"
        @load="handleImageLoad"
        @error="handleImageError"
        loading="lazy"
      />

      <!-- Индикаторы слайдера -->
      <div
        v-if="product.images && product.images.length > 1"
        class="slider-indicators"
      >
        <div
          v-for="(_, index) in product.images"
          :key="index"
          class="indicator"
          :class="{ active: index === currentImageIndex }"
        ></div>
      </div>

      <!-- Бейджи -->
      <div class="badges">
        <span v-if="product.isNew" class="badge new">NEW</span>
        <span v-if="product.discount > 0" class="badge discount">
          -{{ product.discount }}%
        </span>
        <span v-if="product.isHit" class="badge hit">ХИТ</span>
      </div>

      <!-- Кнопки действий сверху -->
      <div class="action-buttons">
        <button
          @click="toggleWishlist"
          class="action-btn"
          :class="{ active: product.inWishlist }"
          title="Добавить в избранное"
        >
          <HeartIcon class="icon" />
        </button>
        <button
          @click="openQuickView"
          class="action-btn"
          title="Быстрый просмотр"
        >
          <EyeIcon class="icon" />
        </button>
        <button
          @click="toggleCompare"
          class="action-btn"
          :class="{ active: product.inCompare }"
          title="Добавить к сравнению"
        >
          <ArrowsRightLeftIcon class="icon" />
        </button>
        <button @click="shareProduct" class="action-btn" title="Поделиться">
          <ShareIcon class="icon" />
        </button>
      </div>
    </div>

    <!-- Информация о товаре -->
    <div class="product-info">
      <!-- Рейтинг -->
      <div class="rating">
        <div class="stars">
          <StarIcon
            v-for="i in 5"
            :key="i"
            class="star"
            :class="{ filled: i <= product.rating }"
          />
        </div>
        <span class="reviews">({{ product.reviews }})</span>
      </div>

      <!-- Название -->
      <h3 class="product-title">{{ product.name }}</h3>

      <!-- Характеристики -->
      <div class="product-specs">
        <div>Бренд: {{ product.brand }}</div>
        <div>Материал: {{ product.material }}</div>
        <div>Цвет: {{ product.color }}</div>
      </div>

      <!-- Цена -->
      <div class="price-section">
        <span class="current-price">{{ formatPrice(product.price) }} ₽</span>
        <span v-if="product.oldPrice" class="old-price">
          {{ formatPrice(product.oldPrice) }} ₽
        </span>
      </div>

      <!-- Нижние кнопки действий -->
      <div class="bottom-actions">
        <!-- Кнопка подробнее (компактная иконка) -->
        <button
          @click="openDetails"
          class="action-button detail-btn"
          title="Подробная информация"
        >
          <svg
            class="action-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
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
          class="action-button cart-btn"
          title="Добавить в корзину"
        >
          <svg
            class="action-icon cart-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
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
          class="action-button out-of-stock-btn"
          title="Товар отсутствует в наличии"
        >
          <svg
            class="action-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93l14.14 14.14" />
          </svg>
          <span class="button-text">Нет в наличии</span>
        </button>
      </div>
    </div>

    <!-- Overlay для товаров не в наличии -->
    <div v-if="!product.inStock" class="out-of-stock-overlay">
      <span>Нет в наличии</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
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

// Computed
const currentImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    return props.product.images[currentImageIndex.value];
  }
  return props.product.image || "/placeholder-image.jpg";
});

// Методы
const formatPrice = (price) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

const startSlider = () => {
  if (props.product.images && props.product.images.length > 1) {
    sliderInterval.value = setInterval(() => {
      currentImageIndex.value =
        (currentImageIndex.value + 1) % props.product.images.length;
    }, 1000);
  }
};

const stopSlider = () => {
  if (sliderInterval.value) {
    clearInterval(sliderInterval.value);
    sliderInterval.value = null;
  }
  currentImageIndex.value = 0;
};

const handleImageLoad = () => {
  imageLoading.value = false;
};

const handleImageError = () => {
  imageLoading.value = false;
  console.warn("Ошибка загрузки изображения:", currentImage.value);
};

const logHover = (buttonType) => {
  console.log(`Навели на кнопку: ${buttonType}`);
};

// Обработчики событий
const addToCart = () => {
  console.log("Добавляем в корзину:", props.product.name);
  emit("add-to-cart", props.product);
};

const openDetails = () => {
  console.log("Открываем детали:", props.product.name);
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

// Cleanup
onUnmounted(() => {
  stopSlider();
});
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* === КОНТЕЙНЕР ИЗОБРАЖЕНИЯ === */
.image-container {
  position: relative;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-image.loaded {
  opacity: 1;
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

/* === ИНДИКАТОРЫ СЛАЙДЕРА === */
.slider-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  z-index: 10;
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
  padding: 16px;
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

.product-specs {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.3;
}

.product-specs > div {
  margin-bottom: 2px;
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

/* === НИЖНИЕ КНОПКИ ДЕЙСТВИЙ === */
.bottom-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  /* Убираем margin-top и позиционируем в конце флекс-контейнера */
  margin-top: auto;
  /* Фиксированная высота для одинакового расположения на всех карточках */
  min-height: 42px;
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
