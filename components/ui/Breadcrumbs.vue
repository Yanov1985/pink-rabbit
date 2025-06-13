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
/* Основные стили для контейнера хлебных крошек */
.breadcrumbs-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.breadcrumbs-container.shadow-sm {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Стили для ссылок хлебных крошек */
.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
}

.breadcrumb-link:hover {
  background: rgba(236, 72, 153, 0.1);
  transform: translateY(-1px);
}

.breadcrumb-link:focus {
  outline: 2px solid rgba(236, 72, 153, 0.5);
  outline-offset: 2px;
}

/* Стили для текущей страницы */
.breadcrumb-current {
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(236, 72, 153, 0.1);
  color: #1f2937;
}

/* Стили для разделителей */
.breadcrumb-separator {
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

/* Анимация появления */
.breadcrumb-item {
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

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

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Адаптивность */
@media (max-width: 640px) {
  .breadcrumbs-container {
    padding: 8px 0;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    padding: 2px 4px;
    font-size: 0.875rem;
  }

  .breadcrumb-separator svg {
    width: 12px;
    height: 12px;
  }
}

/* Темная тема (если понадобится) */
@media (prefers-color-scheme: dark) {
  .breadcrumbs-container {
    background: rgba(31, 41, 55, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .breadcrumb-link {
    color: #d1d5db;
  }

  .breadcrumb-link:hover {
    color: #ec4899;
    background: rgba(236, 72, 153, 0.2);
  }

  .breadcrumb-current {
    color: #f9fafb;
    background: rgba(236, 72, 153, 0.2);
  }

  .breadcrumb-separator {
    color: #6b7280;
  }
}
</style>
