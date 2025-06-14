<template>
  <!-- Показываем скелетон если загружается -->
  <BreadcrumbsSkeleton v-if="shouldShowSkeleton" />

  <!-- Основной компонент хлебных крошек -->
  <nav
    v-else
    ref="breadcrumbsRef"
    class="breadcrumbs-container"
    :class="{ 'is-sticky': isSticky }"
    role="navigation"
    aria-label="Навигация по сайту"
    itemscope
    itemtype="https://schema.org/BreadcrumbList"
  >
    <div class="container mx-auto px-4 py-3">
      <ol class="flex items-center space-x-2 text-sm">
        <!-- Главная страница -->
        <li
          class="breadcrumb-item"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <NuxtLink
            to="/"
            class="breadcrumb-link home-link"
            itemprop="item"
            aria-label="Перейти на главную страницу"
          >
            <HomeIcon class="w-4 h-4 mr-1" aria-hidden="true" />
            <span itemprop="name">Главная</span>
          </NuxtLink>
          <meta itemprop="position" content="1" />
        </li>

        <!-- Каталог (если не главный каталог) -->
        <li
          v-if="!isMainCatalog"
          class="breadcrumb-item"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <ChevronRightIcon
            class="w-4 h-4 text-gray-400 mx-2"
            aria-hidden="true"
          />
          <NuxtLink
            to="/catalog"
            class="breadcrumb-link catalog-link"
            itemprop="item"
            aria-label="Перейти в каталог товаров"
          >
            <span itemprop="name">Каталог</span>
          </NuxtLink>
          <meta itemprop="position" content="2" />
        </li>

        <!-- Динамические хлебные крошки -->
        <template
          v-for="(crumb, index) in processedBreadcrumbs"
          :key="crumb.url || index"
        >
          <li
            class="breadcrumb-item"
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
          >
            <ChevronRightIcon
              class="w-4 h-4 text-gray-400 mx-2"
              aria-hidden="true"
            />

            <!-- Активная (текущая) страница -->
            <span
              v-if="crumb.isActive"
              class="breadcrumb-current"
              itemprop="name"
              :aria-label="`Текущая страница: ${crumb.name}`"
              aria-current="page"
            >
              {{ crumb.name }}
            </span>

            <!-- Ссылка на страницу -->
            <NuxtLink
              v-else
              :to="crumb.url"
              class="breadcrumb-link"
              itemprop="item"
              :aria-label="`Перейти в ${crumb.name}`"
            >
              <span itemprop="name">{{ crumb.name }}</span>
            </NuxtLink>

            <meta itemprop="position" :content="crumb.position" />
          </li>
        </template>
      </ol>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from "vue";
import { HomeIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsSkeleton from "./BreadcrumbsSkeleton.vue";
import { useSticky } from "~/composables/useSticky";

// 📋 Пропсы компонента
const props = defineProps({
  // Массив хлебных крошек
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  // Показывать ли каталог в хлебных крошках
  showCatalog: {
    type: Boolean,
    default: true,
  },
  // Является ли это главным каталогом
  isMainCatalog: {
    type: Boolean,
    default: false,
  },
  // Состояние загрузки
  isLoading: {
    type: Boolean,
    default: false,
  },
  // Дополнительные CSS классы
  customClass: {
    type: String,
    default: "",
  },
});

// 🎯 Sticky поведение
const breadcrumbsRef = ref(null);
const { isSticky, initSticky } = useSticky({
  offset: 0, // Прилипает сразу к верху
  zIndex: 1001, // Выше чем CatalogHeader
});

// 🔄 Инициализация sticky поведения после монтирования
onMounted(async () => {
  await nextTick();
  if (breadcrumbsRef.value) {
    initSticky(breadcrumbsRef.value);
  }
});

// 🎭 Логика показа скелетона
const shouldShowSkeleton = computed(() => {
  // 1. Если явно указано isLoading
  if (props.isLoading) return true;

  // 2. Если это не главный каталог и breadcrumbs пустой или не определен
  if (!props.isMainCatalog) {
    // Проверяем, что breadcrumbs действительно пустой (не просто пустой массив)
    const hasBreadcrumbs = props.breadcrumbs && props.breadcrumbs.length > 0;
    if (!hasBreadcrumbs) return true;
  }

  return false;
});

// 🍞 Обработка хлебных крошек
const processedBreadcrumbs = computed(() => {
  if (!props.breadcrumbs || props.breadcrumbs.length === 0) {
    return [];
  }
  const startPosition = props.isMainCatalog ? 2 : 3;
  return props.breadcrumbs.map((crumb, index) => ({
    ...crumb,
    position: startPosition + index,
    isActive: index === props.breadcrumbs.length - 1 || crumb.isActive,
  }));
});
</script>

<style scoped>
/* 🎨 Основные стили контейнера */
.breadcrumbs-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(236, 72, 153, 0.1);
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 100;
  border-bottom: 1px solid rgba(236, 72, 153, 0.15);
}

/* 🎯 Sticky состояние */
.breadcrumbs-container.is-sticky {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid rgba(236, 72, 153, 0.2);
  animation: stickySlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 🎬 Анимация появления sticky */
@keyframes stickySlideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ✨ Эффекты при наведении */
.breadcrumbs-container:hover {
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: rgba(236, 72, 153, 0.2);
}

.breadcrumbs-container.is-sticky:hover {
  box-shadow: 0 12px 40px rgba(236, 72, 153, 0.2),
    0 6px 20px rgba(0, 0, 0, 0.12);
  border-bottom-color: rgba(236, 72, 153, 0.3);
}

/* 🍞 Стили хлебных крошек */
.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
}

.breadcrumb-link:hover {
  background: rgba(236, 72, 153, 0.1);
  border-color: rgba(236, 72, 153, 0.2);
  color: #ec4899;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
}

/* 🏠 Специальные стили для главной страницы */
.home-link {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.1),
    rgba(139, 92, 246, 0.1)
  );
  border-color: rgba(236, 72, 153, 0.2);
}

.home-link:hover {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.2),
    rgba(139, 92, 246, 0.2)
  );
  color: #ec4899;
}

/* 📚 Стили для ссылки каталога */
.catalog-link {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.catalog-link:hover {
  background: rgba(59, 130, 246, 0.2);
  color: #2563eb;
}

/* 📍 Текущая страница */
.breadcrumb-current {
  padding: 6px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ec4899, #f472b6);
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  animation: currentPageGlow 2s ease-in-out infinite alternate;
}

@keyframes currentPageGlow {
  0% {
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  }
  100% {
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.5);
  }
}

/* 📱 Адаптивность */
@media (max-width: 640px) {
  .breadcrumbs-container {
    padding: 0;
  }

  .breadcrumbs-container .container {
    padding: 8px 12px;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    padding: 4px 8px;
    font-size: 12px;
  }

  /* Скрываем иконки на очень маленьких экранах */
  .breadcrumb-link .w-4 {
    display: none;
  }
}

/* 🎯 Улучшенная адаптивность для sticky состояния */
@media (max-width: 768px) {
  .breadcrumbs-container.is-sticky {
    padding: 0;
  }

  .breadcrumbs-container.is-sticky .container {
    padding: 6px 10px;
  }
}

/* 🔍 Accessibility улучшения */
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

/* 🎨 Дополнительные эффекты для sticky состояния */
.breadcrumbs-container.is-sticky .breadcrumb-link {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

.breadcrumbs-container.is-sticky .breadcrumb-current {
  background: linear-gradient(135deg, #ec4899, #f472b6);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
}
</style>
