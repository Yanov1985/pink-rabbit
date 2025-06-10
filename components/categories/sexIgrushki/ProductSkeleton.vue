<template>
  <div class="pink-rabbit-product-skeleton">
    <!-- Контейнер изображения с современными эффектами -->
    <div class="skeleton-image-container">
      <!-- Основной фон изображения -->
      <div class="skeleton-image-background"></div>

      <!-- Анимированный оверлей -->
      <div class="skeleton-image-overlay"></div>

      <!-- Иконка товара в центре -->
      <div class="skeleton-image-icon">
        <div class="skeleton-icon-placeholder"></div>
      </div>

      <!-- Индикаторы слайдера внизу -->
      <div class="skeleton-slider-indicators">
        <div
          v-for="i in 3"
          :key="i"
          class="skeleton-indicator"
          :style="{ animationDelay: `${i * 0.2}s` }"
        ></div>
      </div>
    </div>

    <!-- Контент карточки с улучшенным дизайном -->
    <div class="skeleton-content">
      <!-- Рейтинг секция (упрощенная) -->
      <div class="skeleton-rating">
        <div class="skeleton-stars">
          <div
            v-for="i in 3"
            :key="i"
            class="skeleton-star"
            :style="{ animationDelay: `${i * 0.3}s` }"
          ></div>
        </div>
        <div class="skeleton-reviews" style="animation-delay: 0.9s"></div>
      </div>

      <!-- Название товара (элегантная одна строка) -->
      <div class="skeleton-title-section">
        <div class="skeleton-title-line" style="animation-delay: 1.2s"></div>
      </div>

      <!-- Цена секция -->
      <div class="skeleton-price-section">
        <div class="skeleton-price" style="animation-delay: 1.5s"></div>
      </div>

      <!-- Единственная кнопка действия -->
      <div class="skeleton-actions">
        <div class="skeleton-action-button" style="animation-delay: 1.8s"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Скелетон не требует логики - только красивые анимации
</script>

<style scoped>
/* === ОСНОВНОЙ КОНТЕЙНЕР СКЕЛЕТОНА === */
.pink-rabbit-product-skeleton {
  @apply bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.pink-rabbit-product-skeleton:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 30px rgba(236, 72, 153, 0.15);
  border-color: rgba(236, 72, 153, 0.3);
}

/* === СЕКЦИЯ ИЗОБРАЖЕНИЯ === */
.skeleton-image-container {
  @apply relative aspect-square;
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.9),
    rgba(255, 255, 255, 0.9)
  );
  overflow: hidden;
}

.skeleton-image-background {
  @apply absolute inset-0;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(236, 72, 153, 0.12) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-image-overlay {
  @apply absolute inset-0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(236, 72, 153, 0.08) 50%,
    transparent 70%
  );
  background-size: 400% 400%;
  animation: waveSweep 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* === ИКОНКА ТОВАРА === */
.skeleton-image-icon {
  @apply absolute inset-0 flex items-center justify-center;
}

.skeleton-icon-placeholder {
  width: 48px;
  height: 48px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.15) 0%,
    rgba(236, 72, 153, 0.3) 50%,
    rgba(236, 72, 153, 0.15) 100%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: 0.5s;
}

/* === ИНДИКАТОРЫ СЛАЙДЕРА === */
.skeleton-slider-indicators {
  @apply absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2;
}

.skeleton-indicator {
  width: 6px;
  height: 6px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.3) 0%,
    rgba(236, 72, 153, 0.6) 50%,
    rgba(236, 72, 153, 0.3) 100%
  );
  background-size: 200% 100%;
  border-radius: 50%;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* === КОНТЕНТ КАРТОЧКИ === */
.skeleton-content {
  @apply p-4 space-y-4;
}

/* === РЕЙТИНГ === */
.skeleton-rating {
  @apply flex items-center gap-3;
}

.skeleton-stars {
  @apply flex gap-1;
}

.skeleton-star {
  width: 14px;
  height: 14px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.2) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
  border-radius: 3px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-reviews {
  width: 40px;
  height: 14px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(236, 72, 153, 0.15) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 7px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* === НАЗВАНИЕ === */
.skeleton-title-section {
  @apply space-y-2;
}

.skeleton-title-line {
  height: 18px;
  width: 85%;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.25) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
  border-radius: 9px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* === ЦЕНА === */
.skeleton-price-section {
  @apply space-y-2;
}

.skeleton-price {
  width: 100px;
  height: 22px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.12) 0%,
    rgba(236, 72, 153, 0.3) 50%,
    rgba(236, 72, 153, 0.12) 100%
  );
  background-size: 200% 100%;
  border-radius: 11px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* === КНОПКА ДЕЙСТВИЯ === */
.skeleton-actions {
  @apply pt-2;
}

.skeleton-action-button {
  width: 100%;
  height: 44px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.1) 0%,
    rgba(236, 72, 153, 0.25) 50%,
    rgba(236, 72, 153, 0.1) 100%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  position: relative;
  overflow: hidden;
}

.skeleton-action-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: buttonShine 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* === АНИМАЦИИ === */
@keyframes pinkRabbitShimmer {
  0% {
    background-position: -200px 0;
    opacity: 0.5;
  }
  50% {
    background-position: calc(100px + 50%) 0;
    opacity: 1;
  }
  100% {
    background-position: calc(200px + 100%) 0;
    opacity: 0.5;
  }
}

@keyframes waveSweep {
  0% {
    background-position: -200% -200%;
    opacity: 0;
  }
  50% {
    background-position: 200% 200%;
    opacity: 1;
  }
  100% {
    background-position: 400% 400%;
    opacity: 0;
  }
}

@keyframes buttonShine {
  0% {
    left: -100%;
    opacity: 0;
  }
  50% {
    left: 0%;
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

/* === HOVER ЭФФЕКТЫ === */
.pink-rabbit-product-skeleton:hover .skeleton-image-background {
  animation-duration: 2s;
}

.pink-rabbit-product-skeleton:hover .skeleton-action-button::before {
  animation-duration: 2s;
}

/* === АДАПТИВНОСТЬ === */
@media (max-width: 768px) {
  .skeleton-content {
    @apply p-3 space-y-3;
  }

  .skeleton-icon-placeholder {
    width: 40px;
    height: 40px;
  }

  .skeleton-action-button {
    height: 40px;
  }
}
</style>
