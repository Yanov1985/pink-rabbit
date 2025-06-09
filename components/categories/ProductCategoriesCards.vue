<template>
  <!-- Семантическая секция категорий товаров с Schema.org микроданными -->
  <section
    class="product-categories-content"
    aria-labelledby="categories-heading"
    role="region"
    aria-label="Категории товаров интернет-магазина"
    itemscope
    itemtype="https://schema.org/ItemList"
  >
    <!-- Schema.org метаданные для всего списка -->
    <meta itemprop="name" content="Категории товаров для взрослых" />
    <meta
      itemprop="description"
      content="Каталог категорий интимных товаров интернет-магазина Pink Rabbit"
    />
    <meta itemprop="numberOfItems" :content="categories.length" />

    <!-- Скрытый заголовок для screen readers -->
    <h2 id="categories-heading" class="sr-only" itemprop="headline">
      Категории товаров для взрослых
    </h2>

    <!-- Skeleton при загрузке в стилистике AdultToysFilters -->
    <div
      v-if="isLoading"
      class="pink-rabbit-categories-skeleton"
      aria-hidden="true"
      aria-label="Загрузка категорий товаров"
      role="status"
    >
      <!-- Заголовок skeleton -->
      <div class="skeleton-container">
        <!-- Сетка карточек skeleton -->
        <div
          class="skeleton-grid"
          role="grid"
          aria-label="Загрузка сетки категорий"
        >
          <!-- 8 карточек для имитации полной сетки -->
          <div
            v-for="n in 8"
            :key="n"
            class="skeleton-category-card"
            :style="{ animationDelay: `${n * 0.15}s` }"
            role="gridcell"
            :aria-label="`Загрузка категории ${n}`"
          >
            <div class="skeleton-icon-container" aria-hidden="true">
              <div class="skeleton-icon"></div>
            </div>
            <div class="skeleton-card-content" aria-hidden="true">
              <div class="skeleton-card-title"></div>
              <div class="skeleton-card-count"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка skeleton -->
      <div class="skeleton-controls" aria-hidden="true">
        <div class="skeleton-show-more-btn" style="animation-delay: 1.2s"></div>
      </div>
    </div>

    <!-- Основной контент с Schema.org разметкой -->
    <main v-else class="categories-content" role="main">
      <!-- Навигация по категориям с Schema.org -->
      <nav
        class="categories-navigation"
        aria-label="Навигация по категориям товаров"
        role="navigation"
        itemscope
        itemtype="https://schema.org/SiteNavigationElement"
        itemid="#categoriesNavigation"
      >
        <meta itemprop="name" content="Навигация по категориям товаров" />
        <meta
          itemprop="description"
          content="Навигация по категориям интимных товаров"
        />

        <!-- Сетка категорий с анимацией и Schema.org -->
        <TransitionGroup
          name="category-list"
          tag="ul"
          class="categories-grid"
          appear
          role="grid"
          :aria-rowcount="Math.ceil(displayedCategories.length / 4)"
          aria-label="Сетка категорий товаров"
        >
          <li
            v-for="(category, index) in displayedCategories"
            :key="category.id"
            class="category-card"
            :class="{
              'category-selected': selectedCategory?.id === category.id,
            }"
            :style="{ '--i': index }"
            :aria-rowindex="Math.floor(index / 4) + 1"
            :aria-colindex="(index % 4) + 1"
            :aria-selected="selectedCategory?.id === category.id"
            :tabindex="index === 0 ? 0 : -1"
            itemscope
            itemtype="https://schema.org/ListItem"
            itemprop="itemListElement"
            :itemid="`#listitem-${category.slug}`"
          >
            <!-- Schema.org метаданные для элемента списка -->
            <meta itemprop="position" :content="index + 1" />
            <meta itemprop="name" :content="category.name" />
            <meta
              itemprop="url"
              :content="`/catalog/seks-igrushki/${category.slug}/`"
            />

            <!-- Кнопка категории с Schema.org -->
            <button
              @click="selectCategory(category)"
              @keydown.enter="selectCategory(category)"
              @keydown.space.prevent="selectCategory(category)"
              @keydown="handleKeyboardNavigation($event, category, index)"
              class="category-button"
              :aria-label="`Выбрать категорию: ${category.name}`"
              :aria-describedby="`category-desc-${category.id}`"
              :aria-pressed="selectedCategory?.id === category.id"
              :tabindex="index === 0 ? 0 : -1"
              type="button"
              itemscope
              itemtype="https://schema.org/Thing"
              itemprop="item"
              :itemid="`#category-${category.slug}`"
            >
              <!-- Schema.org метаданные для категории -->
              <meta itemprop="name" :content="category.name" />
              <meta itemprop="identifier" :content="category.slug" />
              <meta
                itemprop="description"
                :content="`Товары категории ${category.name} в интернет-магазине Pink Rabbit`"
              />
              <meta
                itemprop="url"
                :content="`/catalog/seks-igrushki/${category.slug}/`"
              />
              <meta
                itemprop="additionalType"
                content="https://schema.org/ProductGroup"
              />
              <meta itemprop="category" content="Adult Products" />

              <!-- Контейнер иконки -->
              <div class="category-icon-container" aria-hidden="true">
                <component
                  :is="category.icon"
                  class="category-icon lucide-icon"
                  :class="`icon-${category.slug}`"
                  :aria-label="`Иконка категории ${category.name}`"
                />
              </div>

              <!-- Название категории с Schema.org -->
              <span
                class="category-name"
                :id="`category-desc-${category.id}`"
                itemprop="name"
              >
                {{ category.name }}
              </span>
            </button>
          </li>
        </TransitionGroup>
      </nav>

      <!-- Кнопки управления отображением -->
      <Transition name="button-fade" mode="out-in">
        <footer
          class="categories-controls"
          :key="showAll"
          role="contentinfo"
          aria-label="Управление отображением категорий"
        >
          <!-- Элегантная центральная кнопка -->
          <button
            v-if="categories.length > visibleCount"
            @click="toggleCategories"
            @keydown.enter="toggleCategories"
            @keydown.space.prevent="toggleCategories"
            class="elegant-control-button"
            type="button"
            :aria-label="
              showAll
                ? 'Свернуть список категорий'
                : `Показать ещё ${categories.length - visibleCount} категорий`
            "
            :aria-expanded="showAll"
            aria-controls="categories-grid"
          >
            <span class="button-content">
              <component
                :is="showAll ? ChevronUp : ChevronDown"
                class="button-icon"
                :aria-label="showAll ? 'Стрелка вверх' : 'Стрелка вниз'"
                aria-hidden="true"
              />
              <span class="button-text">
                {{
                  showAll
                    ? "Свернуть"
                    : `Показать ещё ${categories.length - visibleCount}`
                }}
              </span>
            </span>
          </button>
        </footer>
      </Transition>
    </main>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
// 🎨 ИМПОРТ ПРОФЕССИОНАЛЬНЫХ LUCIDE ИКОНОК
import {
  Heart, // Для женщин
  User, // Для мужчин
  Users, // Для пар
  Zap, // Вибраторы
  Target, // Клиторальные стимуляторы
  Sparkles, // Анальные игрушки
  Droplets, // Смазки
  Palette, // Косметика
  ChevronDown, // Показать ещё
  ChevronUp, // Показать меньше
} from "lucide-vue-next";

// Props компонента
const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false, // Возвращаем обратно к false
  },
});

// Управление отображением категорий
const showAll = ref(false);
const visibleCount = 8; // Показываем только 8 категорий по умолчанию
const selectedCategory = ref(null);

// МАССИВ КАТЕГОРИЙ С LUCIDE ИКОНКАМИ
const categories = ref([
  {
    id: 1,
    name: "Для женщин",
    slug: "dlya-zhenshchin",
    icon: Heart,
  },
  {
    id: 2,
    name: "Для мужчин",
    slug: "dlya-muzhchin",
    icon: Zap,
  },
  {
    id: 3,
    name: "Для пар",
    slug: "dlya-par",
    icon: Users,
  },
  {
    id: 4,
    name: "Вибраторы",
    slug: "vibratory",
    icon: Zap,
  },
  {
    id: 5,
    name: "Фаллоимитаторы",
    slug: "falloimitatory",
    icon: Heart,
  },
  {
    id: 6,
    name: "Анальные игрушки",
    slug: "analnye-igrushki",
    icon: Target,
  },
  {
    id: 7,
    name: "Стимуляторы клитора",
    slug: "stimulyatory-klitora",
    icon: Heart,
  },
  {
    id: 8,
    name: "Стимуляторы точки G",
    slug: "stimulyatory-tochki-g",
    icon: Sparkles,
  },
  {
    id: 9,
    name: "Смазки и лубриканты",
    slug: "smazki-i-lubrikant",
    icon: Droplets,
  },
  {
    id: 10,
    name: "Презервативы",
    slug: "prezervatiry",
    icon: Palette,
  },
  {
    id: 11,
    name: "Косметика",
    slug: "kosmetika",
    icon: Palette,
  },
  {
    id: 12,
    name: "Эротические игры",
    slug: "eroticheskie-igry",
    icon: User,
  },
]);

// Вычисляемые свойства
const displayedCategories = computed(() => {
  return showAll.value
    ? categories.value
    : categories.value.slice(0, visibleCount);
});

// Функции управления отображением
const toggleCategories = () => {
  showAll.value = !showAll.value;
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  console.log(`Выбрана категория: ${category.slug}`);

  // Уведомляем родительский компонент о выборе
  emit("category-selected", category);

  // Анонсируем изменение для screen readers
  announceSelection(category.name);
};

// Объявляем emits для Vue 3
const emit = defineEmits(["category-selected"]);

// Функция для анонсирования выбора категории
const announceSelection = (categoryName) => {
  // Создаем живое уведомление для screen readers
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = `Выбрана категория: ${categoryName}`;

  document.body.appendChild(announcement);

  // Удаляем через 1 секунду
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Навигация с клавиатуры
const handleKeyboardNavigation = (event, category, index) => {
  const grid = displayedCategories.value;
  const currentRow = Math.floor(index / 4);
  const currentCol = index % 4;
  let targetIndex = index;

  switch (event.key) {
    case "ArrowRight":
      event.preventDefault();
      targetIndex = index + 1 < grid.length ? index + 1 : index;
      break;
    case "ArrowLeft":
      event.preventDefault();
      targetIndex = index - 1 >= 0 ? index - 1 : index;
      break;
    case "ArrowDown":
      event.preventDefault();
      targetIndex = Math.min(index + 4, grid.length - 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      targetIndex = Math.max(index - 4, 0);
      break;
    case "Home":
      event.preventDefault();
      targetIndex = currentRow * 4; // Начало текущей строки
      break;
    case "End":
      event.preventDefault();
      targetIndex = Math.min((currentRow + 1) * 4 - 1, grid.length - 1); // Конец текущей строки
      break;
  }

  if (targetIndex !== index) {
    // Фокусируемся на новой карточке
    const targetButton = document.querySelector(
      `[aria-describedby="category-desc-${grid[targetIndex].id}"]`
    );
    if (targetButton) {
      targetButton.focus();
    }
  }
};

// Schema.org структурированные данные
const generateSchemaOrgData = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Основной ItemList для категорий
      {
        "@type": "ItemList",
        "@id": "#categoriesList",
        name: "Категории товаров для взрослых",
        description:
          "Каталог категорий интимных товаров интернет-магазина Pink Rabbit",
        url:
          typeof window !== "undefined" && window.location
            ? window.location.href
            : "/catalog/seks-igrushki/",
        numberOfItems: categories.value.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        mainEntity: "#webPage",
        itemListElement: categories.value.map((category, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: category.name,
          url: `/catalog/seks-igrushki/${category.slug}/`,
          item: {
            "@type": ["Thing", "ProductGroup"],
            "@id": `#category-${category.slug}`,
            name: category.name,
            identifier: category.slug,
            description: `Товары категории ${category.name} в интернет-магазине Pink Rabbit`,
            url: `/catalog/seks-igrushki/${category.slug}/`,
            category: "Adult Products",
            isPartOf: "#categoriesList",
          },
        })),
      },
      // WebPage контекст
      {
        "@type": "WebPage",
        "@id": "#webPage",
        name: "Каталог товаров для взрослых",
        description:
          "Интимные товары и секс-игрушки в интернет-магазине Pink Rabbit",
        url:
          typeof window !== "undefined" && window.location
            ? window.location.href
            : "/catalog/seks-igrushki/",
        mainEntity: "#categoriesList",
        breadcrumb: "#breadcrumbList",
        isPartOf: {
          "@type": "WebSite",
          "@id": "#website",
          name: "Pink Rabbit",
          description: "Интернет-магазин товаров для взрослых",
          url: "https://pink-rabbit.ru",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://pink-rabbit.ru/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        },
      },
      // Хлебные крошки
      {
        "@type": "BreadcrumbList",
        "@id": "#breadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: "https://pink-rabbit.ru/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Каталог",
            item: "https://pink-rabbit.ru/catalog/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Товары для взрослых",
            item: "https://pink-rabbit.ru/catalog/seks-igrushki/",
          },
        ],
      },
      // Навигационный элемент
      {
        "@type": "SiteNavigationElement",
        "@id": "#categoriesNavigation",
        name: "Навигация по категориям товаров",
        description: "Навигация по категориям интимных товаров",
        url:
          typeof window !== "undefined" && window.location
            ? window.location.href
            : "/catalog/seks-igrushki/",
        hasPart: categories.value.map(
          (category) => `#category-${category.slug}`
        ),
      },
    ],
  };
};

// Функция для обновления Schema.org данных
const updateSchemaOrg = () => {
  if (typeof window !== "undefined") {
    // Удаляем старый script если есть
    const existingScript = document.querySelector("#schema-org-categories");
    if (existingScript) {
      existingScript.remove();
    }

    // Создаем новый script с обновленными данными
    const script = document.createElement("script");
    script.id = "schema-org-categories";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(generateSchemaOrgData());
    document.head.appendChild(script);
  }
};

// Функция для обновления head через Nuxt useHead
const updateNuxtHead = () => {
  useHead({
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify(generateSchemaOrgData()),
        key: "schema-org-categories",
      },
    ],
  });
};

// Lifecycle hooks для Schema.org
onMounted(() => {
  // Обновляем Schema.org данные при монтировании компонента
  updateSchemaOrg();
  // Также добавляем через useHead для Nuxt 3
  updateNuxtHead();
});

onUnmounted(() => {
  // Очищаем Schema.org данные при размонтировании
  if (typeof window !== "undefined") {
    const existingScript = document.querySelector("#schema-org-categories");
    if (existingScript) {
      existingScript.remove();
    }
  }
});

// Отслеживаем изменения в категориях и обновляем Schema.org
watch(
  [categories, selectedCategory, showAll],
  () => {
    updateSchemaOrg();
    updateNuxtHead();
  },
  { deep: true }
);
</script>

<style scoped>
/* === ОСНОВНОЙ КОНТЕЙНЕР БЕЗ ФОНА - ИНТЕГРАЦИЯ В СТРАНИЦУ === */
.product-categories-content {
  /* Убираем все фоны, тени и рамки */
  background: transparent;
  position: relative;
  /* Убираем все отступы контейнера */
  padding: 0;
  margin: 0;
  /* ИСПРАВЛЕНИЕ: Строгий контроль переполнения */
  max-width: 100%;
  width: 100%;
  /* ИСПРАВЛЕНИЕ: Добавляем пространство для анимаций */
  padding-top: 1rem;
  padding-bottom: 1rem;
  /* ИСПРАВЛЕНИЕ: Предотвращаем горизонтальный скролл */
  overflow-x: hidden;
  overflow-y: visible;
  box-sizing: border-box;
}

/* === СЕМАНТИЧЕСКАЯ ДОСТУПНОСТЬ === */
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

/* === НАВИГАЦИЯ ПО КАТЕГОРИЯМ === */
.categories-navigation {
  /* Прозрачный контейнер для семантики */
  background: transparent;
  border: none;
  outline: none;
}

/* === ФИКСИРОВАННАЯ СЕТКА 4 КАРТОЧКИ В РЯД === */
.categories-grid {
  display: grid;
  /* ИСПРАВЛЕНИЕ: Используем minmax для предотвращения переполнения */
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.5rem;
  /* ИСПРАВЛЕНИЕ: Убираем лишний margin-bottom */
  margin-bottom: 0;
  /* ИСПРАВЛЕНИЕ: Добавляем умные отступы с calc() */
  padding: 1rem 1rem 1.5rem 1rem;
  /* ИСПРАВЛЕНИЕ: Используем calc для точного расчета ширины */
  width: calc(100% - 2rem);
  max-width: calc(100% - 2rem);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  /* Разрешаем видимость теней и анимаций */
  overflow: visible;
  /* НОВОЕ: Поддержка анимаций переходов */
  position: relative;
  /* НОВОЕ: Плавная анимация для изменения размеров */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(236, 72, 153, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  /* ИСПРАВЛЕНИЕ: Элегантная тонкая тень как у iPhone */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
  /* ИСПРАВЛЕНИЕ: Правильный box-sizing */
  box-sizing: border-box;
  /* ИСПРАВЛЕНИЕ: Предотвращаем переполнение */
  min-width: 0;
  width: 100%;
  /* ИСПРАВЛЕНИЕ: Добавляем z-index для правильного отображения теней */
  z-index: 1;
  /* НОВОЕ: Убираем list-style для семантического li */
  list-style: none;
}

.category-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(236, 72, 153, 0.05),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.category-card:hover::before {
  transform: translateX(100%);
}

.category-card:hover {
  transform: translateY(-4px) scale(1.01);
  /* ИСПРАВЛЕНИЕ: Нейтральные серые тени без свечения */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
  border-color: rgba(203, 213, 225, 0.6);
  background: rgba(255, 255, 255, 1);
  /* ИСПРАВЛЕНИЕ: Поднимаем z-index при hover */
  z-index: 10;
}

.category-card:active {
  transform: translateY(-2px) scale(0.99);
  /* ИСПРАВЛЕНИЕ: Минимальная тень при нажатии */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* === СТИЛИ ДЛЯ ВЫБРАННОЙ КАТЕГОРИИ === */
.category-selected {
  /* ОБНОВЛЕНО: Используем палитру CatalogHeader */
  background: linear-gradient(135deg, #ff6b9d, #8b5cf6) !important;
  color: white !important;
  border-color: #ff6b9d !important;
  /* ИСПРАВЛЕНИЕ: Тонкая тень для выбранного состояния без свечения */
  box-shadow: 0 8px 24px rgba(255, 107, 157, 0.08),
    0 4px 12px rgba(255, 107, 157, 0.05) !important;
  transform: translateY(-6px) scale(1.02) !important;
  /* ИСПРАВЛЕНИЕ: Убираем анимацию свечения */
  /* animation: activeGlow 2s ease-in-out infinite alternate; */
  /* ИСПРАВЛЕНИЕ: Высокий z-index для выбранной карточки */
  z-index: 15 !important;
}

.category-selected::before {
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

/* === ИКОНКИ КАТЕГОРИЙ В СТИЛЕ CATALOG HEADER - МНОГОЦВЕТНЫЕ === */
.category-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  /* ОБНОВЛЕНО: Используем нейтральный фон */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(156, 163, 175, 0.2);
  border-radius: 16px;
  margin: 0 auto 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.category-card:hover .category-icon-container {
  /* ОБНОВЛЕНО: Убираем свечение, оставляем только подъем */
  background: rgba(255, 255, 255, 1);
  border-color: rgba(203, 213, 225, 0.6);
  transform: scale(1.05);
  /* ИСПРАВЛЕНИЕ: Убираем цветные тени, оставляем нейтральные */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.category-selected .category-icon-container {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.05) !important;
  /* ИСПРАВЛЕНИЕ: Убираем свечение белой тенью */
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1) !important;
}

/* НОВОЕ: ЦВЕТНАЯ СХЕМА ДЛЯ ИКОНОК КАК В CATALOG HEADER */
.category-icon {
  width: 32px;
  height: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Цветные иконки для разных категорий */
.icon-dlya-zhenshchin {
  color: #ec4899; /* Розовый для женщин */
  animation: heartPulse 2.5s ease-in-out infinite;
}

.icon-dlya-muzhchin {
  color: #3b82f6; /* Синий для мужчин */
  animation: energyPulse 2s ease-in-out infinite;
}

.icon-dlya-par {
  color: #8b5cf6; /* Фиолетовый для пар */
  animation: gentleSway 3s ease-in-out infinite;
}

.icon-vibratory {
  color: #f59e0b; /* Оранжевый как FireIcon в CatalogHeader */
  animation: vibratorPulse 1.8s ease-in-out infinite;
}

.icon-falloimitatory {
  color: #ef4444; /* Красный */
  animation: steadyGlow 2.2s ease-in-out infinite;
}

.icon-analnye-igrushki {
  color: #06b6d4; /* Голубой */
  animation: waveMotion 2.4s ease-in-out infinite;
}

.icon-stimulyatory-klitora {
  color: #f97316; /* Оранжево-красный */
  animation: sparkleEffect 1.9s ease-in-out infinite;
}

.icon-stimulyatory-tochki-g {
  color: #84cc16; /* Лайм зеленый */
  animation: starTwinkle 1.8s ease-in-out infinite;
}

.icon-smazki-i-lubrikant {
  color: #06b6d4; /* Голубой */
  animation: liquidFlow 2.1s ease-in-out infinite;
}

.icon-prezervatiry {
  color: #10b981; /* Зеленый как в CatalogHeader */
  animation: protectionGlow 2.3s ease-in-out infinite;
}

.icon-kosmetika {
  color: #d946ef; /* Пурпурный */
  animation: cosmericShimmer 2.5s ease-in-out infinite;
}

.icon-eroticheskie-igry {
  color: #6366f1; /* Индиго */
  animation: gameController 2.2s ease-in-out infinite;
}

/* HOVER эффекты для цветных иконок */
.category-card:hover .icon-dlya-zhenshchin {
  color: #be185d;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-dlya-muzhchin {
  color: #1d4ed8;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-dlya-par {
  color: #7c3aed;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-vibratory {
  color: #d97706;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение и вращение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-falloimitatory {
  color: #dc2626;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-analnye-igrushki {
  color: #0891b2;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-stimulyatory-klitora {
  color: #ea580c;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение и вращение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-stimulyatory-tochki-g {
  color: #65a30d;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-smazki-i-lubrikant {
  color: #0891b2;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-prezervatiry {
  color: #059669;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-kosmetika {
  color: #c026d3;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.category-card:hover .icon-eroticheskie-igry {
  color: #4f46e5;
  transform: scale(1.1);
  /* ИСПРАВЛЕНИЕ: Убираем цветное свечение */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

/* БЕЛЫЕ иконки для выбранного состояния */
.category-selected .category-icon {
  color: white !important;
  animation: iconPulse 2s ease-in-out infinite alternate;
}

@keyframes iconPulse {
  0% {
    transform: scale(1.2);
    filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3));
  }
  100% {
    transform: scale(1.3);
    filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5));
  }
}

/* === НОВЫЕ АНИМАЦИИ ДЛЯ РАЗНЫХ КАТЕГОРИЙ === */
@keyframes heartPulse {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(236, 72, 153, 0.2));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 4px 8px rgba(236, 72, 153, 0.4));
  }
}

@keyframes energyPulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
  }
  50% {
    transform: scale(1.15) rotate(5deg);
    filter: brightness(1.2) drop-shadow(0 4px 8px rgba(59, 130, 246, 0.5));
  }
}

@keyframes gentleSway {
  0%,
  100% {
    transform: rotate(-2deg) scale(1);
  }
  50% {
    transform: rotate(2deg) scale(1.05);
  }
}

@keyframes vibratorPulse {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3));
  }
  25% {
    transform: scale(1.05) translateX(1px);
    filter: drop-shadow(0 3px 6px rgba(245, 158, 11, 0.4));
  }
  75% {
    transform: scale(1.05) translateX(-1px);
    filter: drop-shadow(0 3px 6px rgba(245, 158, 11, 0.4));
  }
}

@keyframes steadyGlow {
  0%,
  100% {
    filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3)) brightness(1);
  }
  50% {
    filter: drop-shadow(0 4px 8px rgba(239, 68, 68, 0.5)) brightness(1.2);
  }
}

@keyframes waveMotion {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  33% {
    transform: scale(1.05) rotate(2deg);
  }
  66% {
    transform: scale(1.05) rotate(-2deg);
  }
}

@keyframes sparkleEffect {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(249, 115, 22, 0.3)) brightness(1);
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 4px 8px rgba(249, 115, 22, 0.5)) brightness(1.3);
  }
}

@keyframes starTwinkle {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 3px rgba(132, 204, 22, 0.3)) brightness(1);
  }
  25% {
    transform: scale(1.1) rotate(18deg);
    filter: drop-shadow(0 0 6px rgba(132, 204, 22, 0.5)) brightness(1.3);
  }
  75% {
    transform: scale(1.05) rotate(-18deg);
    filter: drop-shadow(0 0 4px rgba(132, 204, 22, 0.4)) brightness(1.1);
  }
}

@keyframes liquidFlow {
  0%,
  100% {
    transform: scale(1) skewX(0deg);
  }
  50% {
    transform: scale(1.05) skewX(5deg);
  }
}

@keyframes protectionGlow {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3));
  }
  50% {
    transform: scale(1.08);
    filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.5));
  }
}

@keyframes cosmericShimmer {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(217, 70, 239, 0.3)) hue-rotate(0deg);
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 4px 8px rgba(217, 70, 239, 0.5)) hue-rotate(15deg);
  }
}

@keyframes gameController {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.05) rotate(3deg);
  }
  75% {
    transform: scale(1.05) rotate(-3deg);
  }
}

/* === ЭЛЕГАНТНАЯ ЦЕНТРАЛЬНАЯ КНОПКА - БЛИЖЕ К КАРТОЧКАМ === */
.categories-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  /* ИСПРАВЛЕНИЕ: Минимальный отступ от карточек */
  margin-top: 0.5rem;
  /* Убираем padding - используем естественное выравнивание */
  padding: 0;
  /* ИСПРАВЛЕНИЕ: Строгий контроль переполнения кнопки */
  max-width: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.elegant-control-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* ИСПРАВЛЕНИЕ: Более элегантный дизайн без сложных эффектов */
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  padding: 0;
  cursor: pointer;
  /* ИСПРАВЛЕНИЕ: Упрощенная transition */
  transition: all 0.2s ease;
  overflow: hidden;
  /* ИСПРАВЛЕНИЕ: Более тонкая тень */
  box-shadow: 0 2px 8px rgba(71, 85, 105, 0.06);
  /* ИСПРАВЛЕНИЕ: Адаптивные размеры чтобы никогда не превышать ширину */
  min-width: 160px;
  max-width: min(260px, calc(100vw - 2rem));
  height: 44px;
  /* ИСПРАВЛЕНИЕ: Правильный box-sizing */
  box-sizing: border-box;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  position: relative;
  z-index: 2;
  /* ИСПРАВЛЕНИЕ: Упрощенная transition */
  transition: all 0.2s ease;
}

/* ИСПРАВЛЕНИЕ: Убираем сложный background эффект */
.button-background {
  display: none;
}

/* ИСПРАВЛЕНИЕ: Упрощенный hover эффект */
.elegant-control-button:hover {
  /* Легкое изменение цвета фона */
  background: rgba(248, 250, 252, 1);
  border-color: rgba(203, 213, 225, 1);
  /* Едва заметная тень */
  box-shadow: 0 4px 12px rgba(71, 85, 105, 0.08);
  /* Минимальный подъем */
  transform: translateY(-1px);
}

.elegant-control-button:active {
  /* Возврат в исходное положение при клике */
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(71, 85, 105, 0.04);
}

.button-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  /* ИСПРАВЛЕНИЕ: Упрощенная transition */
  transition: color 0.2s ease;
  white-space: nowrap;
}

/* ИСПРАВЛЕНИЕ: Минимальный эффект при hover */
.elegant-control-button:hover .button-text {
  color: #334155;
}

.button-icon {
  /* ИСПРАВЛЕНИЕ: Плавная анимация поворота иконки */
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 18px;
  height: 18px;
  margin-right: 8px;
  flex-shrink: 0;
  /* Базовое состояние - стрелка вниз */
  transform: rotate(0deg);
}

/* Когда показываем "Свернуть" - поворачиваем иконку */
.elegant-control-button:hover .button-icon {
  transform: rotate(180deg) scale(1.1);
}

/* === АДАПТИВНОСТЬ ДЛЯ СЕТКИ 4×3 === */
@media (max-width: 1024px) {
  .categories-grid {
    /* ИСПРАВЛЕНИЕ: minmax для предотвращения переполнения */
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
    /* ИСПРАВЛЕНИЕ: Компактные отступы для планшетов */
    padding: 1rem 1rem 1.25rem 1rem;
    width: calc(100% - 2rem);
    max-width: calc(100% - 2rem);
  }
}

@media (max-width: 768px) {
  .categories-grid {
    /* ИСПРАВЛЕНИЕ: minmax для предотвращения переполнения */
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    /* ИСПРАВЛЕНИЕ: Компактные отступы для мобильных */
    padding: 1rem 0.75rem 1rem 0.75rem;
    width: calc(100% - 1.5rem);
    max-width: calc(100% - 1.5rem);
  }

  .category-card {
    padding: 1rem;
    /* ИСПРАВЛЕНИЕ: Уменьшаем padding на мобильных */
    min-width: 0;
  }

  /* ИСПРАВЛЕНИЕ: Уменьшаем анимацию на мобильных */
  .category-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 15px 30px rgba(236, 72, 153, 0.12);
  }

  .category-selected {
    transform: translateY(-6px) scale(1.03) !important;
    box-shadow: 0 6px 24px rgba(236, 72, 153, 0.25) !important;
  }

  .category-icon-container {
    width: 50px;
    height: 50px;
  }

  .category-icon {
    width: 24px;
    height: 24px;
  }

  .elegant-control-button {
    /* ИСПРАВЛЕНИЕ: Адаптивные размеры для мобильных */
    min-width: 160px;
    max-width: min(240px, calc(100vw - 2rem));
    height: 44px;
  }

  .button-content {
    padding: 0.625rem 1.25rem;
  }

  .button-text {
    font-size: 0.875rem;
    /* ИСПРАВЛЕНИЕ: Предотвращаем переполнение текста */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    /* ИСПРАВЛЕНИЕ: На маленьких экранах 1 карточка на всю ширину */
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
    /* ИСПРАВЛЕНИЕ: Минимальные отступы для телефонов */
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;
    width: calc(100% - 1rem);
    max-width: calc(100% - 1rem);
  }

  .category-card {
    /* ИСПРАВЛЕНИЕ: Минимальные отступы на маленьких экранах */
    padding: 0.875rem;
    min-width: 0;
  }

  /* ИСПРАВЛЕНИЕ: Еще меньше анимации на маленьких экранах */
  .category-card:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 10px 20px rgba(236, 72, 153, 0.1);
  }

  .category-selected {
    transform: translateY(-4px) scale(1.02) !important;
    box-shadow: 0 4px 16px rgba(236, 72, 153, 0.2) !important;
  }

  .elegant-control-button {
    /* ИСПРАВЛЕНИЕ: Минимальные размеры для маленьких экранов */
    min-width: 140px;
    max-width: min(200px, calc(100vw - 1rem));
    height: 40px;
  }

  .button-content {
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  .button-text {
    font-size: 0.8rem;
    /* ИСПРАВЛЕНИЕ: Еще короче для маленьких экранов */
    max-width: 100px;
  }

  .button-icon {
    width: 16px;
    height: 16px;
  }
}

/* ИСПРАВЛЕНИЕ: Глобальные правила для предотвращения переполнения */
* {
  box-sizing: border-box;
}

/* ИСПРАВЛЕНИЕ: Строгий контроль overflow на уровне страницы */
body,
html {
  overflow-x: hidden !important;
  max-width: 100vw;
}

/* ИСПРАВЛЕНИЕ: Контейнеры компонента */
.product-categories-content,
.categories-content,
.categories-grid,
.categories-controls {
  max-width: 100%;
  overflow-x: hidden;
}

/* ИСПРАВЛЕНИЕ: Карточки не должны превышать контейнер */
.category-card {
  max-width: 100%;
  width: 100%;
}

/* ИСПРАВЛЕНИЕ: Кнопка не должна превышать экран */
.elegant-control-button {
  max-width: calc(100vw - 2rem) !important;
}

/* ИСПРАВЛЕНИЕ: Анимации не должны выходить за границы */
.category-card:hover {
  /* Ограничиваем scale чтобы не создавать overflow */
  transform: translateY(-8px) scale(1.01);
}

.category-selected {
  /* Ограничиваем scale для выбранного состояния */
  transform: translateY(-8px) scale(1.02) !important;
}

/* === УБИРАЕМ СВЕТОВУЮ ПОЛОСУ ДЛЯ НЕЙТРАЛЬНОГО ДИЗАЙНА === */
.product-categories-content::before {
  display: none;
}

/* === СКЕЛЕТОН ЗАГРУЗКИ === */
.skeleton-container {
  @apply animate-pulse;
  padding: 1rem 1rem 2rem 1rem;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.skeleton-category-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  min-height: 160px;
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.skeleton-icon-container {
  width: 60px;
  height: 60px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.2) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
  border-radius: 50%;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-icon {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(236, 72, 153, 0.15) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 50%;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-card-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-card-title {
  width: 80%;
  height: 18px;
  margin: 0 auto;
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

.skeleton-card-count {
  width: 60%;
  height: 14px;
  margin: 0 auto;
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

.skeleton-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0;
}

.skeleton-show-more-btn {
  width: 200px;
  height: 44px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.12) 0%,
    rgba(236, 72, 153, 0.3) 50%,
    rgba(236, 72, 153, 0.12) 100%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* === SKELETON АНИМАЦИИ === */
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
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === АДАПТИВНОСТЬ SKELETON === */
@media (max-width: 1024px) {
  .skeleton-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
    padding: 1rem 1rem 1.25rem 1rem;
    width: calc(100% - 2rem);
    max-width: calc(100% - 2rem);
  }
}

@media (max-width: 768px) {
  .skeleton-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    padding: 1rem 0.75rem 1rem 0.75rem;
    width: calc(100% - 1.5rem);
    max-width: calc(100% - 1.5rem);
  }

  .skeleton-category-card {
    padding: 1rem;
    min-height: 140px;
  }

  .skeleton-icon-container {
    width: 50px;
    height: 50px;
  }

  .skeleton-show-more-btn {
    width: 180px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .skeleton-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;
    width: calc(100% - 1rem);
    max-width: calc(100% - 1rem);
  }

  .skeleton-category-card {
    padding: 0.875rem;
    min-height: 120px;
  }

  .skeleton-show-more-btn {
    width: 160px;
    height: 36px;
  }

  .skeleton-title-categories {
    width: 160px;
    height: 28px;
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
.category-card:focus {
  outline: 3px solid rgba(236, 72, 153, 0.5);
  outline-offset: 2px;
}

.elegant-control-button:focus-visible {
  outline: 3px solid rgba(236, 72, 153, 0.5);
  outline-offset: 2px;
}

/* === АНИМАЦИИ ДЛЯ РАСКРЫТИЯ/СВЕРТЫВАНИЯ КАРТОЧЕК === */
/* Анимация для появления карточек */
.category-list-enter-active {
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  transition-delay: calc(var(--i) * 0.1s);
}

.category-list-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  transition-delay: calc(var(--i) * 0.05s);
}

.category-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
  filter: blur(4px);
}

.category-list-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
  filter: blur(2px);
}

/* Анимация для перестановки карточек */
.category-list-move {
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

/* === АНИМАЦИЯ КНОПКИ === */
.button-fade-enter-active,
.button-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.button-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Улучшенная сетка с поддержкой анимаций */
.categories-content {
  /* Плавная анимация изменения высоты */
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

/* === КНОПКА КАТЕГОРИИ === */
.category-button {
  /* Наследуем все свойства от родительской карточки */
  background: transparent;
  border: none;
  border-radius: inherit;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  cursor: inherit;
  transition: inherit;
  position: relative;
  overflow: inherit;
  box-shadow: none;
  /* Убираем стандартные стили кнопки */
  outline: none;
  appearance: none;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  text-align: inherit;
  /* Делаем кнопку блочной */
  display: block;
}

/* Фокус для доступности */
.category-button:focus-visible {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}
</style>
