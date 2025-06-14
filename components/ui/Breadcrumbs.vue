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
    <!-- Декоративный градиентный фон -->
    <div class="breadcrumbs-background"></div>

    <!-- Основной контент -->
    <div class="container mx-auto px-4 py-4">
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
            class="w-4 h-4 text-gray-400 mx-2 breadcrumb-separator"
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
              class="w-4 h-4 text-gray-400 mx-2 breadcrumb-separator"
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

    <!-- Индикатор прокрутки -->
    <div class="scroll-indicator" :class="{ visible: isSticky }"></div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, onUnmounted, watch } from "vue";
import { HomeIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsSkeleton from "./BreadcrumbsSkeleton.vue";
import { useSticky } from "~/composables/useSticky";
import { useRoute } from "#app";

//  Пропсы компонента
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

// 🎯 Используем композабл для sticky поведения
const breadcrumbsRef = ref(null);
const { isSticky, initSticky, handleScroll } = useSticky({
  offset: 0, // Без отступа от верха
  zIndex: 1002, // Высокий z-index для навигации
  alwaysSticky: true, // Всегда липкий режим для хлебных крошек
  immediateSticky: true, // Немедленная активация при инициализации
});

// 🎯 Nuxt композаблы для навигации
const route = useRoute();

// 🎯 Инициализация sticky поведения для хлебных крошек
const initializeStickyBehavior = () => {
  // 🔍 Проверяем клиентскую среду
  if (typeof window === "undefined") {
    console.log("🚫 SSR режим - пропускаем инициализацию sticky");
    return;
  }

  console.log("🍞 Монтирование компонента хлебных крошек");

  // 🕐 Ждем рендеринга с небольшой задержкой
  setTimeout(() => {
    const breadcrumbsEl = breadcrumbsRef.value;
    if (breadcrumbsEl) {
      console.log("🎯 Инициализируем sticky поведение для хлебных крошек");

      // 🎨 Добавляем класс для анимации при загрузке
      breadcrumbsEl.classList.add("initial-load");

      // 🎯 Инициализируем sticky с режимом "всегда липкий"
      initSticky(breadcrumbsEl);

      // 🧹 Убираем класс initial-load через время анимации
      setTimeout(() => {
        breadcrumbsEl.classList.remove("initial-load");
      }, 600);
    } else {
      console.warn("⚠️ Элемент хлебных крошек не найден");
    }
  }, 100);

  // 🔄 Обработчик изменения размера окна с дебаунсом
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const breadcrumbsEl = breadcrumbsRef.value;
      if (breadcrumbsEl) {
        console.log("📱 Обновляем высоту хлебных крошек при ресайзе");
        // Принудительно обновляем sticky поведение
        handleScroll();
      }
    }, 250);
  };

  window.addEventListener("resize", handleResize);

  // 🧹 Очистка при размонтировании
  onUnmounted(() => {
    console.log("🧹 Размонтирование компонента хлебных крошек");
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimeout);
  });
};

// 🎯 НОВАЯ ФУНКЦИЯ: Принудительная инициализация sticky независимо от состояния
const forceInitializeSticky = () => {
  console.log("🚀 Принудительная инициализация sticky поведения");

  nextTick(() => {
    const breadcrumbsEl = breadcrumbsRef.value;
    if (breadcrumbsEl) {
      console.log("✅ Элемент найден, инициализируем sticky");
      initSticky(breadcrumbsEl);
    } else {
      console.warn("⚠️ Элемент не найден, повторяем через 100мс");
      setTimeout(forceInitializeSticky, 100);
    }
  });
};

// 🔄 Инициализация при монтировании
onMounted(() => {
  console.log("🚀 Компонент хлебных крошек смонтирован");
  initializeStickyBehavior();

  // 🎯 ДОБАВЛЯЕМ: Принудительная инициализация через небольшую задержку
  // Это гарантирует, что sticky будет работать даже если breadcrumbs загружаются асинхронно
  setTimeout(() => {
    forceInitializeSticky();
  }, 200);
});

// 🔄 Переинициализация при изменении breadcrumbs (для SPA переходов)
watch(
  () => props.breadcrumbs,
  (newBreadcrumbs, oldBreadcrumbs) => {
    console.log("🔄 Breadcrumbs изменились:", {
      old: oldBreadcrumbs?.length || 0,
      new: newBreadcrumbs?.length || 0,
    });

    // 🎯 ИСПРАВЛЯЕМ: Всегда переинициализируем sticky при изменении breadcrumbs
    nextTick(() => {
      forceInitializeSticky();
    });
  },
  { deep: true }
);

// 🔄 Следим за изменениями маршрута для переинициализации
watch(
  () => route.path,
  (newPath, oldPath) => {
    console.log("🔄 Изменился маршрут:", { from: oldPath, to: newPath });
    nextTick(() => {
      forceInitializeSticky();
    });
  }
);

// 🎯 ДОБАВЛЯЕМ: Следим за изменением isLoading для переинициализации
watch(
  () => props.isLoading,
  (newLoading, oldLoading) => {
    // Когда загрузка завершается, переинициализируем sticky
    if (oldLoading && !newLoading) {
      console.log("🔄 Загрузка завершена, переинициализируем sticky");
      setTimeout(() => {
        forceInitializeSticky();
      }, 100);
    }
  }
);

// 🔍 Отслеживаем изменения sticky состояния для отладки
watch(isSticky, (newValue) => {
  console.log(
    "🎯 Sticky состояние изменилось:",
    newValue ? "АКТИВНО" : "НЕАКТИВНО"
  );
});

// 🎭 Логика показа скелетона
const shouldShowSkeleton = computed(() => {
  // Отладочная информация
  console.log("🔍 Breadcrumbs Debug:", {
    isLoading: props.isLoading,
    isMainCatalog: props.isMainCatalog,
    breadcrumbs: props.breadcrumbs,
    breadcrumbsLength: props.breadcrumbs?.length || 0,
    showCatalog: props.showCatalog,
  });

  // 1. Если явно указано isLoading - показываем скелетон
  if (props.isLoading) {
    console.log("🔄 Показываем скелетон: isLoading = true");
    return true;
  }

  // 2. ИСПРАВЛЯЕМ ЛОГИКУ: Для страниц категорий показываем скелетон только в самом начале
  // Если это не главный каталог, но breadcrumbs уже есть - показываем основной компонент
  if (!props.isMainCatalog) {
    const hasBreadcrumbs = props.breadcrumbs && props.breadcrumbs.length > 0;

    // Если есть breadcrumbs - всегда показываем основной компонент
    if (hasBreadcrumbs) {
      console.log("✅ Показываем основной компонент: есть breadcrumbs");
      return false;
    }

    // Если нет breadcrumbs, но и не загружается - тоже показываем основной компонент
    // Это позволит sticky работать даже с пустыми breadcrumbs
    if (!props.isLoading) {
      console.log(
        "✅ Показываем основной компонент: не загружается, пусть sticky работает"
      );
      return false;
    }

    // Только если нет breadcrumbs И идет загрузка - показываем скелетон
    console.log(
      "🔄 Показываем скелетон: не главный каталог, нет breadcrumbs и идет загрузка"
    );
    return true;
  }

  console.log("✅ Показываем основной компонент: главный каталог");
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
/* 🎨 Основные стили контейнера - как в премиальных интернет-магазинах */
.breadcrumbs-container {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(236, 72, 153, 0.08);
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.06), 0 2px 8px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
}

/* 🌈 Декоративный градиентный фон */
.breadcrumbs-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.02) 0%,
    rgba(139, 92, 246, 0.02) 50%,
    rgba(59, 130, 246, 0.02) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.breadcrumbs-container:hover .breadcrumbs-background {
  opacity: 1;
}

/* 🎯 Стили для sticky состояния */
.breadcrumbs-container.is-sticky {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 80px !important; /* Фиксированная высота для предсказуемости */
  z-index: 1002 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8) !important;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  transform: translateZ(0) !important; /* Аппаратное ускорение */

  /* Центрирование контента по вертикали */
  display: flex !important;
  align-items: center !important;
}

/* Обеспечиваем правильное отображение контента в sticky режиме */
.breadcrumbs-container.is-sticky .container {
  margin: 0 auto !important;
  padding: 0 1rem !important;
}

/* 🎬 Анимация появления sticky */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 📊 Индикатор прокрутки */
.scroll-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ec4899, #f472b6, #8b5cf6);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.scroll-indicator.visible {
  transform: scaleX(1);
  animation: scrollIndicatorPulse 2s ease-in-out infinite;
}

@keyframes scrollIndicatorPulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

/* ✨ Эффекты при наведении - интерактивность как в социальных сетях */
.breadcrumbs-container:hover {
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: rgba(236, 72, 153, 0.15);
  transform: translateY(-1px);
}

.breadcrumbs-container.is-sticky:hover {
  box-shadow: 0 12px 40px rgba(236, 72, 153, 0.15),
    0 6px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(236, 72, 153, 0.08);
  border-bottom-color: rgba(236, 72, 153, 0.25);
}

/* 🍞 Стили хлебных крошек - элегантные как в премиальных магазинах */
.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

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
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: left 0.5s ease;
}

.breadcrumb-link:hover::before {
  left: 100%;
}

.breadcrumb-link:hover {
  background: rgba(236, 72, 153, 0.08);
  border-color: rgba(236, 72, 153, 0.2);
  color: #ec4899;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.15),
    0 2px 8px rgba(236, 72, 153, 0.1);
}

/* 🏠 Специальные стили для главной страницы */
.home-link {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.08),
    rgba(139, 92, 246, 0.08)
  );
  border-color: rgba(236, 72, 153, 0.15);
  color: #ec4899;
}

.home-link:hover {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.15),
    rgba(139, 92, 246, 0.15)
  );
  color: #ec4899;
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.2),
    0 3px 10px rgba(139, 92, 246, 0.1);
}

/* 📚 Стили для ссылки каталога */
.catalog-link {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.catalog-link:hover {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.2),
    0 2px 8px rgba(59, 130, 246, 0.1);
}

/* 📍 Текущая страница - выделяется как активный элемент */
.breadcrumb-current {
  padding: 8px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ec4899, #f472b6);
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3),
    0 2px 8px rgba(236, 72, 153, 0.2);
  position: relative;
  overflow: hidden;
}

.breadcrumb-current::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 70%
  );
  animation: currentPageShimmer 3s ease-in-out infinite;
}

@keyframes currentPageShimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 🔗 Разделители между крошками */
.breadcrumb-separator {
  transition: all 0.2s ease;
}

.breadcrumb-item:hover .breadcrumb-separator {
  color: #ec4899;
  transform: scale(1.1);
}

/* 📱 Адаптивность - удобство на всех устройствах */
@media (max-width: 640px) {
  .breadcrumbs-container {
    border-radius: 0 0 12px 12px;
  }

  .breadcrumbs-container .container {
    padding: 10px 12px;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    padding: 6px 10px;
    font-size: 13px;
  }

  /* Скрываем иконки на очень маленьких экранах */
  .breadcrumb-link .w-4 {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
}

/* 🎯 Улучшенная адаптивность для sticky состояния */
@media (max-width: 768px) {
  .breadcrumbs-container.is-sticky {
    border-radius: 0 0 16px 16px;
  }

  .breadcrumbs-container.is-sticky .container {
    padding: 8px 12px;
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
}

.breadcrumbs-container.is-sticky .breadcrumb-current {
  background: linear-gradient(135deg, #ec4899, #f472b6);
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4),
    0 2px 8px rgba(236, 72, 153, 0.2);
}

.breadcrumbs-container.is-sticky .breadcrumbs-background {
  opacity: 0.5;
}

/* 🌟 Дополнительные эффекты для премиального вида */
.breadcrumbs-container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(236, 72, 153, 0.3),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.breadcrumbs-container.is-sticky::after {
  opacity: 1;
}
</style>
