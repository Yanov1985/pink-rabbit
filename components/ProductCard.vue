<template>
  <div class="product-card">
    <!-- Изображение товара - витрина мечты -->
    <div class="card-image-container">
      <img
        :src="product.image"
        :alt="product.title"
        class="card-image"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Индикатор скидки - яркий маяк экономии -->
      <div v-if="product.discount > 0" class="discount-badge">
        -{{ product.discount }}%
      </div>

      <!-- Кнопки действий - быстрые команды -->
      <div class="card-actions">
        <button
          class="action-btn favorite-btn"
          :class="{ active: isInFavorites }"
          @click="toggleFavorite"
          title="В избранное"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </button>

        <button
          class="action-btn quick-view-btn"
          @click="openQuickView"
          title="Быстрый просмотр"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            />
          </svg>
        </button>
      </div>

      <!-- Статусы товара - информационные флажки -->
      <div class="card-status">
        <span v-if="product.isNew" class="status-badge new-badge"> NEW </span>
        <span v-if="product.isHit" class="status-badge hit-badge"> ХИТ </span>
        <span
          v-if="product.isInStock === false"
          class="status-badge out-of-stock-badge"
        >
          НЕТ В НАЛИЧИИ
        </span>
      </div>
    </div>

    <!-- Информация о товаре - паспортные данные -->
    <div class="card-content">
      <!-- Рейтинг - звездное небо качества -->
      <div v-if="product.rating" class="card-rating">
        <div class="stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= Math.round(product.rating) }"
          >
            ★
          </span>
        </div>
        <span class="rating-text">{{ product.rating }}/5</span>
      </div>

      <!-- Название товара - его имя и фамилия -->
      <h3 class="card-title">
        {{ product.title }}
      </h3>

      <!-- Короткое описание - визитная карточка -->
      <p v-if="product.description" class="card-description">
        {{ truncatedDescription }}
      </p>

      <!-- Характеристики - ключевые особенности -->
      <div
        v-if="product.features && product.features.length"
        class="card-features"
      >
        <span
          v-for="feature in product.features.slice(0, 3)"
          :key="feature"
          class="feature-tag"
        >
          {{ feature }}
        </span>
      </div>

      <!-- Цена - финансовый паспорт -->
      <div class="card-price">
        <div class="price-container">
          <span v-if="product.oldPrice" class="old-price">
            {{ formatPrice(product.oldPrice) }} ₽
          </span>
          <span class="current-price">
            {{ formatPrice(product.price) }} ₽
          </span>
        </div>

        <!-- Экономия - подсчет выгоды -->
        <div v-if="product.oldPrice" class="savings">
          Экономия: {{ formatPrice(product.oldPrice - product.price) }} ₽
        </div>
      </div>

      <!-- Кнопка добавления в корзину - финальное действие -->
      <button
        class="add-to-cart-btn"
        :class="{ 'in-cart': isInCart, disabled: !product.isInStock }"
        @click="toggleCart"
        :disabled="!product.isInStock"
      >
        <svg
          v-if="!isInCart"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
          />
        </svg>

        <svg
          v-else
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>

        <span>{{ cartButtonText }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Входящие параметры - данные товара
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// Исходящие события - действия пользователя
const emit = defineEmits([
  "add-to-cart",
  "remove-from-cart",
  "add-to-favorites",
  "remove-from-favorites",
  "quick-view",
]);

// Локальные состояния - внутренняя память карточки
const isInFavorites = ref(false);
const isInCart = ref(false);
const isImageLoaded = ref(false);
const imageError = ref(false);

// Вычисляемые свойства - умные помощники

// Финальная цена со скидкой - цена после торга
const finalPrice = computed(() => {
  if (props.product.discount > 0 && props.product.oldPrice) {
    return (
      props.product.oldPrice -
      (props.product.oldPrice * props.product.discount) / 100
    );
  }
  return props.product.price;
});

// Процент скидки - размер выгоды
const discountPercent = computed(() => {
  if (props.product.oldPrice && props.product.discount > 0) {
    return Math.round(
      ((props.product.oldPrice - props.product.price) /
        props.product.oldPrice) *
        100
    );
  }
  return props.product.discount;
});

// Рейтинг в звездах - визуальная оценка
const ratingStars = computed(() => {
  const fullStars = Math.floor(props.product.rating);
  const hasHalfStar = props.product.rating % 1 >= 0.5;
  return {
    full: fullStars,
    half: hasHalfStar,
    empty: 5 - fullStars - (hasHalfStar ? 1 : 0),
  };
});

// Обрезанное описание - краткая история товара
const truncatedDescription = computed(() => {
  if (!props.product.description) return "";

  const maxLength = 100;
  if (props.product.description.length <= maxLength) {
    return props.product.description;
  }

  return props.product.description.slice(0, maxLength) + "...";
});

// Текст кнопки корзины - призыв к действию
const cartButtonText = computed(() => {
  if (!props.product.isInStock) return "Нет в наличии";
  if (isInCart.value) return "В корзине";
  return "В корзину";
});

// Обработчики событий - реакции на действия

// Форматирование цены - красивые числа
const formatPrice = (price) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

// Переключение избранного - игра в сердечки
const toggleFavorite = () => {
  isInFavorites.value = !isInFavorites.value;

  if (isInFavorites.value) {
    emit("add-to-favorites", props.product);
  } else {
    emit("remove-from-favorites", props.product.id);
  }
};

// Переключение корзины - шопинг-менеджер
const toggleCart = () => {
  if (!props.product.isInStock) return;

  isInCart.value = !isInCart.value;

  if (isInCart.value) {
    emit("add-to-cart", props.product);
  } else {
    emit("remove-from-cart", props.product.id);
  }
};

// Быстрый просмотр - предварительный показ
const openQuickView = () => {
  emit("quick-view", props.product);
};

// Загрузка изображения - успешное отображение
const handleImageLoad = () => {
  isImageLoaded.value = true;
};

// Ошибка загрузки изображения - проблема с показом
const handleImageError = () => {
  imageError.value = true;
};

// При монтировании компонента - начальная настройка
onMounted(() => {
  // Проверяем, есть ли товар в избранном
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  isInFavorites.value = favorites.includes(props.product.id);

  // Проверяем, есть ли товар в корзине
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  isInCart.value = cart.some((item) => item.id === props.product.id);
});
</script>

<style scoped>
/* Основная карточка товара - витрина мечты */
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Контейнер изображения - рамка для фото */
.card-image-container {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .card-image {
  transform: scale(1.05);
}

/* Значок скидки - флаг выгоды */
.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

/* Действия на карточке - панель управления */
.card-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  z-index: 2;
}

.product-card:hover .card-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  background: #e91e63;
  color: white;
  transform: scale(1.1);
}

.favorite-btn.active {
  background: #e91e63;
  color: white;
}

/* Статусы товара - информационные ленты */
.card-status {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  z-index: 2;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.new-badge {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.hit-badge {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.out-of-stock-badge {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  color: white;
}

/* Контент карточки - информационная панель */
.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Рейтинг - звездная оценка */
.card-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 16px;
  transition: color 0.2s ease;
}

.star.filled {
  color: #ffd700;
  text-shadow: 0 0 4px rgba(255, 215, 0, 0.3);
}

.rating-text {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}

/* Название товара - главный заголовок */
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Описание - краткая характеристика */
.card-description {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0 0 12px 0;
  flex: 1;
}

/* Особенности товара - теги качеств */
.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.feature-tag {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid #dee2e6;
}

/* Цена - финансовый блок */
.card-price {
  margin-bottom: 16px;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.old-price {
  font-size: 14px;
  color: #95a5a6;
  text-decoration: line-through;
  font-weight: 500;
}

.current-price {
  font-size: 20px;
  color: #e91e63;
  font-weight: 700;
}

.savings {
  font-size: 12px;
  color: #27ae60;
  font-weight: 600;
}

/* Кнопка добавления в корзину - призыв к действию */
.add-to-cart-btn {
  width: 100%;
  background: linear-gradient(135deg, #e91e63, #ad1457);
  color: white;
  border: none;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-top: auto;
}

.add-to-cart-btn:hover:not(.disabled) {
  background: linear-gradient(135deg, #ad1457, #7b1fa2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(233, 30, 99, 0.4);
}

.add-to-cart-btn.in-cart {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
}

.add-to-cart-btn.in-cart:hover {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.add-to-cart-btn.disabled {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Адаптивность для мобильных - карманная версия */
@media (max-width: 768px) {
  .card-image-container {
    height: 200px;
  }

  .card-content {
    padding: 16px;
  }

  .card-title {
    font-size: 14px;
    height: 36px;
  }

  .current-price {
    font-size: 18px;
  }

  .card-actions {
    opacity: 1;
    transform: translateX(0);
  }

  .action-btn {
    width: 36px;
    height: 36px;
  }
}

/* Анимация загрузки изображения - плавное появление */
.card-image {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(1.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Эффект пульсации для новых товаров */
.new-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(46, 204, 113, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
  }
}
</style>
