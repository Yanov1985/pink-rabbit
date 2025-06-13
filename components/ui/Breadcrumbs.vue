<template>
  <nav
    class="breadcrumbs-container bg-white border-b border-gray-200 sticky top-0 z-40"
    :class="{ 'shadow-sm': isSticky }"
    aria-label="Навигация по сайту"
  >
    <div class="container mx-auto px-4 py-3">
      <ol
        class="flex items-center space-x-2 text-sm"
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
      >
        <!-- Главная страница -->
        <li
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <NuxtLink
            to="/"
            class="breadcrumb-link text-gray-500 hover:text-pink-500 transition-colors duration-200"
            itemprop="item"
          >
            <span itemprop="name">Главная</span>
          </NuxtLink>
          <meta itemprop="position" content="1" />
        </li>

        <!-- Разделитель -->
        <li class="breadcrumb-separator text-gray-400" aria-hidden="true">
          <ChevronRightIcon class="w-4 h-4" />
        </li>

        <!-- Каталог (если не на главной странице каталога) -->
        <li
          v-if="!isMainCatalog"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <NuxtLink
            to="/catalog"
            class="breadcrumb-link text-gray-500 hover:text-pink-500 transition-colors duration-200"
            itemprop="item"
          >
            <span itemprop="name">Каталог</span>
          </NuxtLink>
          <meta itemprop="position" content="2" />
        </li>

        <!-- Разделитель для каталога -->
        <li
          v-if="!isMainCatalog"
          class="breadcrumb-separator text-gray-400"
          aria-hidden="true"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </li>

        <!-- Динамические хлебные крошки -->
        <template v-for="(crumb, index) in processedBreadcrumbs" :key="index">
          <li
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
            class="breadcrumb-item"
          >
            <!-- Активная ссылка -->
            <NuxtLink
              v-if="!crumb.isActive && crumb.url"
              :to="crumb.url"
              class="breadcrumb-link text-gray-500 hover:text-pink-500 transition-colors duration-200"
              itemprop="item"
            >
              <span itemprop="name">{{ crumb.name }}</span>
            </NuxtLink>

            <!-- Текущая страница -->
            <span
              v-else
              class="breadcrumb-current text-gray-900 font-medium"
              itemprop="name"
            >
              {{ crumb.name }}
            </span>

            <meta itemprop="position" :content="crumb.position" />
          </li>

          <!-- Разделитель (кроме последнего элемента) -->
          <li
            v-if="index < processedBreadcrumbs.length - 1"
            class="breadcrumb-separator text-gray-400"
            aria-hidden="true"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </li>
        </template>
      </ol>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { ChevronRightIcon } from "@heroicons/vue/24/outline";

// Пропсы компонента
const props = defineProps({
  // Массив хлебных крошек
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  // Показывать ли "Каталог" в крошках
  showCatalog: {
    type: Boolean,
    default: true,
  },
  // Является ли это главной страницей каталога
  isMainCatalog: {
    type: Boolean,
    default: false,
  },
  // Кастомный класс для стилизации
  customClass: {
    type: String,
    default: "",
  },
});

// Реактивные данные
const isSticky = ref(false);

// Вычисляемые свойства
const processedBreadcrumbs = computed(() => {
  if (!props.breadcrumbs || props.breadcrumbs.length === 0) {
    return [];
  }

  // Обрабатываем хлебные крошки и добавляем позиции для Schema.org
  const startPosition = props.isMainCatalog ? 2 : 3; // Главная + (Каталог если нужен)

  return props.breadcrumbs.map((crumb, index) => ({
    ...crumb,
    position: startPosition + index,
    isActive: index === props.breadcrumbs.length - 1 || crumb.isActive,
  }));
});

// Обработка скролла для sticky эффекта
const handleScroll = () => {
  isSticky.value = window.scrollY > 100;
};

// Жизненный цикл компонента
onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>

<style scoped>
/* === ОСНОВНЫЕ СТИЛИ КОНТЕЙНЕРА В СТИЛЕ PINK RABBIT === */
.breadcrumbs-container {
  /* Современный стеклянный эффект как в карточках товаров */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

/* Градиентный оверлей как в карточках товаров */
.breadcrumbs-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(236, 72, 153, 0.02),
    rgba(139, 92, 246, 0.02)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.breadcrumbs-container.shadow-sm::before {
  opacity: 1;
}

.breadcrumbs-container.shadow-sm {
  box-shadow: 0 20px 40px rgba(236, 72, 153, 0.08);
  transform: translateY(-1px);
}

/* === СТИЛИ ДЛЯ ССЫЛОК В СТИЛЕ PINK RABBIT === */
.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  z-index: 2;
}

/* Эффект при наведении как в кнопках проекта */
.breadcrumb-link:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 107, 157, 0.1),
    rgba(255, 143, 179, 0.1)
  );
  color: #ec4899;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.15);
  border-color: rgba(236, 72, 153, 0.2);
}

/* Анимация блеска при наведении */
.breadcrumb-link::before {
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
  transition: left 0.5s ease;
}

.breadcrumb-link:hover::before {
  left: 100%;
}

.breadcrumb-link:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3);
}

/* === СТИЛИ ДЛЯ ТЕКУЩЕЙ СТРАНИЦЫ === */
.breadcrumb-current {
  padding: 8px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.25);
  position: relative;
  z-index: 2;
  overflow: hidden;
}

/* Пульсирующий эффект для текущей страницы */
.breadcrumb-current::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  animation: currentPageGlow 2s ease-in-out infinite alternate;
}

@keyframes currentPageGlow {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.7;
  }
}

/* === СТИЛИ ДЛЯ РАЗДЕЛИТЕЛЕЙ === */
.breadcrumb-separator {
  display: flex;
  align-items: center;
  opacity: 0.4;
  transition: all 0.3s ease;
  color: #9ca3af;
  z-index: 2;
}

.breadcrumb-separator svg {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Анимация разделителей при hover на контейнер */
.breadcrumbs-container:hover .breadcrumb-separator {
  opacity: 0.6;
  color: #ec4899;
}

.breadcrumbs-container:hover .breadcrumb-separator svg {
  transform: scale(1.1);
}

/* === АНИМАЦИИ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ === */
.breadcrumb-item {
  animation: breadcrumbFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateY(10px) translateX(-10px);
  position: relative;
  z-index: 2;
}

/* Задержки для каскадной анимации */
.breadcrumb-item:nth-child(1) {
  animation-delay: 0.1s;
}
.breadcrumb-item:nth-child(3) {
  animation-delay: 0.2s;
}
.breadcrumb-item:nth-child(5) {
  animation-delay: 0.3s;
}
.breadcrumb-item:nth-child(7) {
  animation-delay: 0.4s;
}
.breadcrumb-item:nth-child(9) {
  animation-delay: 0.5s;
}
.breadcrumb-item:nth-child(11) {
  animation-delay: 0.6s;
}

@keyframes breadcrumbFadeIn {
  to {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
}

/* === АДАПТИВНОСТЬ В СТИЛЕ ПРОЕКТА === */
@media (max-width: 768px) {
  .breadcrumbs-container {
    /* Упрощенные эффекты на мобильных */
    backdrop-filter: blur(10px);
  }

  .breadcrumb-link,
  .breadcrumb-current {
    padding: 6px 10px;
    font-size: 13px;
    border-radius: 8px;
  }

  .breadcrumb-link:hover {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.1);
  }

  /* Уменьшаем анимации на мобильных */
  .breadcrumb-item {
    animation-duration: 0.3s;
  }

  .breadcrumb-separator svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .breadcrumbs-container {
    padding: 0;
  }

  .breadcrumbs-container .container {
    padding: 12px 16px;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 6px;
  }

  /* Минимальные эффекты на очень маленьких экранах */
  .breadcrumb-link:hover {
    transform: none;
    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
  }

  .breadcrumbs-container.shadow-sm {
    transform: none;
  }
}

/* === ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ ДЛЯ ПРЕМИУМ ВИДА === */
/* Тонкая анимация фона */
.breadcrumbs-container {
  background-image: radial-gradient(
      circle at 20% 50%,
      rgba(255, 107, 157, 0.03) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(139, 92, 246, 0.03) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 80%,
      rgba(255, 143, 179, 0.02) 0%,
      transparent 50%
    );
}

/* Эффект при скролле */
@media (prefers-reduced-motion: no-preference) {
  .breadcrumbs-container.shadow-sm {
    animation: stickyPulse 3s ease-in-out infinite;
  }
}

@keyframes stickyPulse {
  0%,
  100% {
    box-shadow: 0 20px 40px rgba(236, 72, 153, 0.08);
  }
  50% {
    box-shadow: 0 25px 50px rgba(236, 72, 153, 0.12);
  }
}

/* Улучшенная доступность */
@media (prefers-reduced-motion: reduce) {
  .breadcrumb-item {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .breadcrumbs-container.shadow-sm {
    animation: none;
  }

  .breadcrumb-current::after {
    animation: none;
  }
}

/* Высокий контраст для доступности */
@media (prefers-contrast: high) {
  .breadcrumb-link {
    border: 2px solid #6b7280;
    background: white;
  }

  .breadcrumb-current {
    background: #ec4899;
    border: 2px solid #be185d;
  }

  .breadcrumb-separator {
    opacity: 0.8;
    color: #374151;
  }
}
</style>
