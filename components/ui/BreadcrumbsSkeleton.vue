<template>
  <!-- Скелетон хлебных крошек в стиле Pink Rabbit -->
  <nav
    class="breadcrumbs-skeleton-container bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    aria-label="Загрузка навигации по сайту"
    role="status"
    aria-live="polite"
  >
    <div class="container mx-auto px-4 py-3">
      <ol
        class="flex items-center space-x-2 text-sm"
        aria-label="Загрузка хлебных крошек"
      >
        <!-- Главная страница skeleton -->
        <li class="breadcrumb-skeleton-item">
          <div
            class="skeleton-breadcrumb-link"
            style="animation-delay: 0.1s"
            aria-label="Загрузка ссылки на главную"
          ></div>
        </li>

        <!-- Разделитель skeleton -->
        <li class="breadcrumb-skeleton-separator" aria-hidden="true">
          <div
            class="skeleton-separator-icon"
            style="animation-delay: 0.2s"
          ></div>
        </li>

        <!-- Каталог skeleton -->
        <li class="breadcrumb-skeleton-item">
          <div
            class="skeleton-breadcrumb-link"
            style="animation-delay: 0.3s"
            aria-label="Загрузка ссылки на каталог"
          ></div>
        </li>

        <!-- Разделитель skeleton -->
        <li class="breadcrumb-skeleton-separator" aria-hidden="true">
          <div
            class="skeleton-separator-icon"
            style="animation-delay: 0.4s"
          ></div>
        </li>

        <!-- Категория skeleton -->
        <li class="breadcrumb-skeleton-item">
          <div
            class="skeleton-breadcrumb-link skeleton-category"
            style="animation-delay: 0.5s"
            aria-label="Загрузка текущей категории"
          ></div>
        </li>

        <!-- Разделитель skeleton -->
        <li class="breadcrumb-skeleton-separator" aria-hidden="true">
          <div
            class="skeleton-separator-icon"
            style="animation-delay: 0.6s"
          ></div>
        </li>

        <!-- Текущая страница skeleton (активная) -->
        <li class="breadcrumb-skeleton-item">
          <div
            class="skeleton-breadcrumb-current"
            style="animation-delay: 0.7s"
            aria-label="Загрузка текущей страницы"
          ></div>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup>
// Скелетон не требует логики - только красивые анимации в стиле Pink Rabbit
</script>

<style scoped>
/* === ОСНОВНОЙ КОНТЕЙНЕР СКЕЛЕТОНА === */
.breadcrumbs-skeleton-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(236, 72, 153, 0.1);
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(236, 72, 153, 0.15);
}

.breadcrumbs-skeleton-container:hover {
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: rgba(236, 72, 153, 0.2);
}

/* === ЭЛЕМЕНТЫ ХЛЕБНЫХ КРОШЕК === */
.breadcrumb-skeleton-item {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.skeleton-breadcrumb-link {
  display: inline-flex;
  align-items: center;
  height: 32px;
  width: 80px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(236, 72, 153, 0.15) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* Вариация для категории (немного шире) */
.skeleton-category {
  width: 100px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.2) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
}

/* Текущая активная страница (выделенная) */
.skeleton-breadcrumb-current {
  display: inline-flex;
  align-items: center;
  height: 32px;
  width: 120px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.12) 0%,
    rgba(236, 72, 153, 0.3) 50%,
    rgba(236, 72, 153, 0.12) 100%
  );
  background-size: 200% 100%;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  position: relative;
  overflow: hidden;
}

/* Дополнительный блеск для активного элемента */
.skeleton-breadcrumb-current::before {
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
  animation: breadcrumbShine 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* === РАЗДЕЛИТЕЛИ === */
.breadcrumb-skeleton-separator {
  display: flex;
  align-items: center;
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.skeleton-separator-icon {
  width: 16px;
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(236, 72, 153, 0.15) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* === АНИМАЦИИ В СТИЛЕ PINK RABBIT === */
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes breadcrumbShine {
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
.breadcrumbs-skeleton-container:hover .skeleton-breadcrumb-link,
.breadcrumbs-skeleton-container:hover .skeleton-breadcrumb-current {
  animation-duration: 2s;
}

.breadcrumbs-skeleton-container:hover .skeleton-separator-icon {
  opacity: 0.7;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.2) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
}

/* === АДАПТИВНОСТЬ === */
@media (max-width: 768px) {
  .skeleton-breadcrumb-link {
    width: 60px;
    height: 28px;
  }

  .skeleton-category {
    width: 80px;
  }

  .skeleton-breadcrumb-current {
    width: 100px;
    height: 28px;
  }

  .skeleton-separator-icon {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .skeleton-breadcrumb-link {
    width: 50px;
    height: 24px;
  }

  .skeleton-category {
    width: 70px;
  }

  .skeleton-breadcrumb-current {
    width: 80px;
    height: 24px;
  }

  .skeleton-separator-icon {
    width: 12px;
    height: 12px;
  }
}

/* === УЛУЧШЕНИЯ ДОСТУПНОСТИ === */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* === СОСТОЯНИЕ ФОКУСА ДЛЯ КЛАВИАТУРНОЙ НАВИГАЦИИ === */
.breadcrumbs-skeleton-container:focus-within {
  outline: 3px solid rgba(236, 72, 153, 0.5);
  outline-offset: 2px;
}
</style>
