<template>
  <!-- Семантический заголовок каталога с Schema.org разметкой -->
  <header
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 catalog-header"
    ref="headerRef"
    role="banner"
    aria-label="Заголовок каталога товаров"
    itemscope
    itemtype="https://schema.org/WebPageElement"
  >
    <!-- Skeleton состояние при загрузке -->
    <section
      v-if="isLoading"
      class="pink-rabbit-header-skeleton"
      role="status"
      aria-label="Загружается заголовок каталога"
      aria-live="polite"
    >
      <div class="skeleton-content">
        <!-- Заголовок skeleton -->
        <div
          class="skeleton-title"
          aria-label="Загружается заголовок категории"
        ></div>
        <!-- Счетчик товаров skeleton -->
        <div
          class="skeleton-counter"
          aria-label="Загружается счетчик товаров"
        ></div>
      </div>

      <!-- Элементы управления skeleton -->
      <div class="skeleton-controls">
        <!-- Переключатель видов skeleton -->
        <div
          class="skeleton-view-toggle"
          aria-label="Загружается переключатель видов"
        >
          <div class="skeleton-view-btn"></div>
          <div class="skeleton-view-btn"></div>
        </div>
        <!-- Сортировка skeleton -->
        <div
          class="skeleton-sort-dropdown"
          aria-label="Загружается элемент сортировки"
        ></div>
      </div>
    </section>

    <!-- Основное содержимое с семантической разметкой -->
    <section
      v-else
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      role="main"
      aria-label="Управление каталогом товаров"
    >
      <!-- Информация о каталоге -->
      <section
        class="catalog-info"
        role="region"
        aria-labelledby="catalog-title"
        itemscope
        itemtype="https://schema.org/CollectionPage"
      >
        <h1
          id="catalog-title"
          class="text-2xl font-bold text-gray-900 catalog-title"
          itemprop="name"
          role="heading"
          aria-level="1"
        >
          {{ categoryTitle }}
        </h1>
        <p
          class="text-gray-600 mt-1 catalog-count"
          itemprop="description"
          role="status"
          aria-live="polite"
          :aria-label="`Найдено ${totalCount} ${getProductsWord(
            totalCount
          )} в категории ${categoryTitle}`"
        >
          Найдено {{ totalCount }}
          {{ getProductsWord(totalCount) }}
        </p>

        <!-- Скрытая информация для поисковых систем -->
        <meta itemprop="numberOfItems" :content="totalCount" />
        <meta
          itemprop="itemListOrder"
          content="https://schema.org/ItemListOrderAscending"
        />
      </section>

      <!-- Элементы управления каталогом -->
      <nav
        class="flex items-center gap-4 catalog-controls"
        role="navigation"
        aria-label="Элементы управления каталогом"
        itemscope
        itemtype="https://schema.org/SiteNavigationElement"
      >
        <!-- Переключатель видов отображения -->
        <fieldset
          class="flex bg-gray-100 rounded-lg p-1"
          ref="viewToggleRef"
          role="radiogroup"
          aria-label="Выбор количества колонок для отображения товаров"
          aria-describedby="view-mode-description"
        >
          <legend class="sr-only">Режим отображения товаров</legend>
          <span id="view-mode-description" class="sr-only">
            Выберите как отображать товары: в 4 колонки как витрина супермаркета
            или в 3 колонки как в интернет-магазине
          </span>

          <button
            @click="$emit('changeViewMode', 4)"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 view-toggle-button',
              viewMode === 4
                ? 'view-active text-white shadow-sm active'
                : 'text-gray-600 hover:text-gray-900',
            ]"
            title="4 колонки - как витрина супермаркета"
            :disabled="isLoading"
            role="radio"
            :aria-checked="viewMode === 4"
            aria-label="Отображать товары в 4 колонки"
            :aria-pressed="viewMode === 4"
          >
            <!-- Иконка 4 колонки с Heroicons -->
            <Squares2X2Icon
              class="w-5 h-5"
              aria-hidden="true"
              role="img"
              aria-label="Иконка сетки 4 колонки"
            />
          </button>
          <button
            @click="$emit('changeViewMode', 3)"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 view-toggle-button',
              viewMode === 3
                ? 'view-active text-white shadow-sm active'
                : 'text-gray-600 hover:text-gray-900',
            ]"
            title="3 колонки - как в интернет-магазине"
            :disabled="isLoading"
            role="radio"
            :aria-checked="viewMode === 3"
            aria-label="Отображать товары в 3 колонки"
            :aria-pressed="viewMode === 3"
          >
            <!-- Иконка 3 колонки с Heroicons -->
            <ViewColumnsIcon
              class="w-5 h-5"
              aria-hidden="true"
              role="img"
              aria-label="Иконка сетки 3 колонки"
            />
          </button>
        </fieldset>

        <!-- Сортировка с семантической разметкой -->
        <div
          class="relative sort-wrapper"
          role="region"
          aria-label="Сортировка товаров"
          itemscope
          itemtype="https://schema.org/SortAction"
        >
          <label for="sort-select" class="sr-only">
            Выберите способ сортировки товаров в каталоге
          </label>
          <select
            id="sort-select"
            :value="sortBy"
            @change="$emit('changeSorting', $event.target.value)"
            class="px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-custom-pink focus:border-custom-pink sort-select appearance-none"
            ref="sortRef"
            :disabled="isLoading"
            role="combobox"
            aria-label="Сортировка товаров"
            aria-describedby="sort-description"
            :aria-expanded="false"
            itemprop="name"
          >
            <option value="popularity">По популярности</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="rating">По рейтингу</option>
            <option value="newest">Сначала новые</option>
          </select>

          <span id="sort-description" class="sr-only">
            Выберите как сортировать товары: по популярности как в Tinder, по
            цене, рейтингу или новизне
          </span>

          <!-- Иконка сортировки с Heroicons - динамическая для каждого типа -->
          <div
            class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <component
              :is="sortIcon"
              :class="['w-4 h-4 transition-all duration-300', sortIconColor]"
              title="Иконка текущей сортировки"
              role="img"
              :aria-label="`Иконка сортировки: ${getSortIconDescription(
                sortBy
              )}`"
            />
          </div>

          <!-- Стрелка выпадающего списка с Heroicons -->
          <div
            class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <ChevronDownIcon
              class="w-4 h-4 text-gray-400"
              role="img"
              aria-label="Стрелка раскрытия списка сортировки"
            />
          </div>

          <!-- Скрытая Schema.org информация о сортировке -->
          <meta itemprop="actionStatus" content="PotentialActionStatus" />
          <meta itemprop="object" :content="categoryTitle" />
        </div>
      </nav>
    </section>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useHead, useRoute } from "#app";
// Импорт иконок Heroicons в едином стиле с фильтрами
import {
  Squares2X2Icon,
  ViewColumnsIcon,
  ChevronDownIcon,
  // Дополнительные иконки для разных типов сортировки
  FireIcon, // Для популярности - как огонь популярности
  ArrowUpIcon, // Для цены по возрастанию
  ArrowDownIcon, // Для цены по убыванию
  StarIcon, // Для рейтинга - звездочка оценки
  SparklesIcon, // Для новинок - искорки новизны
  CurrencyDollarIcon, // Дополнительная иконка для цены
} from "@heroicons/vue/24/solid";

// Пропсы компонента
const props = defineProps({
  // Заголовок категории (например "Товары для взрослых")
  categoryTitle: {
    type: String,
    required: true,
    default: "Каталог товаров",
  },
  // Общее количество найденных товаров
  totalCount: {
    type: Number,
    required: true,
    default: 0,
  },
  // Текущий режим отображения (3 или 4 колонки)
  viewMode: {
    type: Number,
    required: true,
    default: 4,
    validator: (value) => [3, 4].includes(value),
  },
  // Текущий способ сортировки
  sortBy: {
    type: String,
    required: true,
    default: "popularity",
  },
  // Состояние загрузки
  isLoading: {
    type: Boolean,
    default: false,
  },
});

// События которые компонент может отправлять
const emit = defineEmits([
  "changeViewMode", // Изменение режима отображения (3/4 колонки)
  "changeSorting", // Изменение сортировки
]);

// Ссылки на DOM элементы
const headerRef = ref(null);
const viewToggleRef = ref(null);
const sortRef = ref(null);

// Получаем текущий маршрут в setup контексте
const route = useRoute();

/**
 * Функция склонения слова "товар" в зависимости от количества
 * Как в магазине: 1 товар, 2-4 товара, 5+ товаров
 */
const getProductsWord = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "товар";
  } else if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  ) {
    return "товара";
  } else {
    return "товаров";
  }
};

/**
 * Computed свойство для определения иконки сортировки
 * Как в Tinder - каждый тип имеет свою уникальную иконку
 */
const sortIcon = computed(() => {
  switch (props.sortBy) {
    case "popularity":
      return FireIcon; // Огонь популярности
    case "price-asc":
      return ArrowUpIcon; // Стрелка вверх для возрастания цены
    case "price-desc":
      return ArrowDownIcon; // Стрелка вниз для убывания цены
    case "rating":
      return StarIcon; // Звезда для рейтинга
    case "newest":
      return SparklesIcon; // Искорки для новинок
    default:
      return FireIcon; // Дефолтная иконка сортировки
  }
});

/**
 * Computed свойство для цвета иконки сортировки
 * Каждый тип сортировки имеет свой фирменный цвет
 */
const sortIconColor = computed(() => {
  switch (props.sortBy) {
    case "popularity":
      return "text-orange-500"; // Оранжевый огонь популярности
    case "price-asc":
      return "text-green-500"; // Зеленый для роста цены
    case "price-desc":
      return "text-red-500"; // Красный для снижения цены
    case "rating":
      return "text-yellow-500"; // Желтый для звезды рейтинга
    case "newest":
      return "text-purple-500"; // Фиолетовый для новинок
    default:
      return "text-gray-400"; // Серый по умолчанию
  }
});

/**
 * Функция для описания иконки сортировки для screen readers
 * Делает интерфейс доступным для людей с ограниченными возможностями
 */
const getSortIconDescription = (sortType) => {
  switch (sortType) {
    case "popularity":
      return "огонь популярности";
    case "price-asc":
      return "стрелка вверх, цена по возрастанию";
    case "price-desc":
      return "стрелка вниз, цена по убыванию";
    case "rating":
      return "звезда рейтинга";
    case "newest":
      return "искорки новинок";
    default:
      return "иконка сортировки";
  }
};

// SEO оптимизация через useHead
useHead({
  title: computed(() => `${props.categoryTitle} - Pink Rabbit`),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          `Каталог ${props.categoryTitle.toLowerCase()} с удобной сортировкой и фильтрацией. Найдено ${
            props.totalCount
          } товаров. Интернет-магазин Pink Rabbit - качественные товары для взрослых.`
      ),
    },
    {
      name: "keywords",
      content: computed(
        () =>
          `${props.categoryTitle}, интимные товары, сортировка, каталог, Pink Rabbit, ${props.sortBy}`
      ),
    },
    // Open Graph для социальных сетей
    {
      property: "og:title",
      content: computed(
        () =>
          `${props.categoryTitle} - ${props.totalCount} товаров | Pink Rabbit`
      ),
    },
    {
      property: "og:description",
      content: computed(
        () =>
          `Каталог ${props.categoryTitle.toLowerCase()} с ${
            props.totalCount
          } товарами. Удобная сортировка и переключение видов отображения.`
      ),
    },
    {
      property: "og:type",
      content: "website",
    },
    // Twitter Cards
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: computed(() => `${props.categoryTitle} - Pink Rabbit`),
    },
    {
      name: "twitter:description",
      content: computed(
        () =>
          `${props.totalCount} товаров в категории ${props.categoryTitle}. Удобная навигация и сортировка.`
      ),
    },
    // Дополнительные SEO метатеги
    {
      name: "robots",
      content: "index, follow, max-image-preview:large",
    },
    {
      name: "googlebot",
      content: "index, follow",
    },
    {
      name: "format-detection",
      content: "telephone=no",
    },
    // Языковые метатеги
    {
      httpEquiv: "content-language",
      content: "ru-RU",
    },
  ],
  // Структурированные данные для поисковых систем
  script: [
    {
      type: "application/ld+json",
      children: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://pink-rabbit.ru",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: props.categoryTitle,
              item: `https://pink-rabbit.ru${route.path}`,
            },
          ],
        })
      ),
    },
    {
      type: "application/ld+json",
      children: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: props.categoryTitle,
          description: `Каталог ${props.categoryTitle.toLowerCase()} с системой сортировки и фильтрации`,
          numberOfItems: props.totalCount,
          isPartOf: {
            "@type": "WebSite",
            name: "Pink Rabbit",
            url: "https://pink-rabbit.ru",
          },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "RUB",
            lowPrice: "500",
            highPrice: "250000",
            offerCount: props.totalCount,
          },
        })
      ),
    },
  ],
});

// Экспорт ссылок для возможного использования родительским компонентом
defineExpose({
  headerRef,
  viewToggleRef,
  sortRef,
});
</script>

<style scoped>
/* Основные стили для заголовка каталога */
.catalog-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.catalog-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 107, 157, 0.05),
    rgba(139, 92, 246, 0.05),
    rgba(6, 182, 212, 0.05)
  );
  background-size: 300% 300%;
  animation: backgroundShift 8s ease-in-out infinite;
  z-index: -1;
}

@keyframes backgroundShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  33% {
    background-position: 100% 0%;
  }
  66% {
    background-position: 0% 100%;
  }
}

.catalog-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.15);
}

/* Заголовок категории */
.catalog-title {
  background: linear-gradient(
    45deg,
    #ff6b9d,
    #ff8fb3,
    #8b5cf6,
    #06b6d4,
    #10b981,
    #f59e0b,
    #ef4444,
    #ff6b9d
  );
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.025em;
  animation: gradientShift 4s ease-in-out infinite,
    textGlow 2s ease-in-out infinite alternate;
  position: relative;
  text-shadow: 0 0 10px rgba(255, 107, 157, 0.3);
}

/* Счетчик товаров */
.catalog-count {
  background: linear-gradient(135deg, #6b7280, #9ca3af, #6b7280);
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  animation: subtleGradient 3s ease-in-out infinite;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.catalog-count:hover {
  opacity: 1;
}

/* Тонкая анимация для счетчика */
@keyframes subtleGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Улучшаем контейнер информации о каталоге */
.catalog-info {
  position: relative;
  padding: 0.5rem 0;
}

.catalog-info::before {
  content: "";
  position: absolute;
  top: 0;
  left: -10px;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #ff6b9d, #8b5cf6, #06b6d4);
  border-radius: 2px;
  animation: barGlow 2s ease-in-out infinite alternate;
}

/* Анимация световой полосы */
@keyframes barGlow {
  0% {
    opacity: 0.6;
    transform: scaleY(0.8);
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}

/* Элементы управления */
.catalog-controls {
  gap: 1rem;
}

/* Кнопки переключения видов */
.view-toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.view-toggle-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 107, 157, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.view-toggle-button:hover::before {
  transform: translateX(100%);
}

.view-toggle-button:hover {
  transform: scale(1.05);
  background: rgba(255, 107, 157, 0.1);
}

.view-active {
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
  transform: scale(1.05);
  animation: activeGlow 2s ease-in-out infinite alternate;
}

@keyframes activeGlow {
  0% {
    box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
  }
  100% {
    box-shadow: 0 6px 20px rgba(255, 107, 157, 0.5);
  }
}

/* Обертка для сортировки */
.sort-wrapper {
  position: relative;
  min-width: 200px;
}

/* Селект сортировки */
.sort-select {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  padding-right: 2.5rem;
  cursor: pointer;
  width: 100%;
}

.sort-select:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #ff6b9d;
}

.sort-select:focus {
  transform: scale(1.02);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
  border-color: #ff6b9d;
  outline: none;
}

.sort-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Кастомные цвета для фокуса */
.focus\:ring-custom-pink:focus {
  --tw-ring-color: rgba(255, 107, 157, 0.5);
}

.focus\:border-custom-pink:focus {
  border-color: #ff6b9d;
}

/* Анимация skeleton */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Адаптивность */
@media (max-width: 640px) {
  .catalog-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .sort-wrapper {
    min-width: auto;
  }

  .catalog-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .catalog-header {
    padding: 1rem;
  }

  .view-toggle-button {
    width: 36px;
    height: 36px;
  }

  .sort-select {
    font-size: 0.875rem;
    padding: 0.5rem 2rem 0.5rem 2.5rem;
  }
}

/* Анимация движения градиента */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Анимация свечения текста */
@keyframes textGlow {
  0% {
    filter: brightness(1) contrast(1);
    transform: scale(1);
  }
  100% {
    filter: brightness(1.2) contrast(1.1);
    transform: scale(1.02);
  }
}

/* Дополнительный эффект переливания для заголовка */
.catalog-title::before {
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
  animation: shimmer 3s ease-in-out infinite;
  z-index: 1;
}

/* Анимация блика */
@keyframes shimmer {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* Анимации и стили для иконок */
.view-toggle-button .w-5 {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-toggle-button:hover .w-5 {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(255, 107, 157, 0.3));
}

.view-active .w-5 {
  animation: iconPulse 2s ease-in-out infinite alternate;
}

@keyframes iconPulse {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3));
  }
  100% {
    transform: scale(1.05);
    filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5));
  }
}

/* Стили для иконок сортировки */
.sort-wrapper .w-4 {
  transition: all 0.3s ease;
}

/* Анимация для динамических иконок сортировки */
.sort-wrapper [title="Иконка текущей сортировки"] {
  animation: sortIconActive 2s ease-in-out infinite alternate;
}

@keyframes sortIconActive {
  0% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 2px currentColor);
  }
  100% {
    transform: scale(1.1) rotate(2deg);
    filter: drop-shadow(0 0 6px currentColor);
  }
}

/* Специальные анимации для разных типов сортировки */
.text-orange-500 {
  animation: fireGlow 1.5s ease-in-out infinite alternate;
}

.text-green-500 {
  animation: upArrowGlow 2s ease-in-out infinite;
}

.text-red-500 {
  animation: downArrowGlow 2s ease-in-out infinite;
}

.text-yellow-500 {
  animation: starTwinkle 1.8s ease-in-out infinite;
}

.text-purple-500 {
  animation: sparkleShimmer 2.2s ease-in-out infinite;
}

/* Анимация огня для популярности */
@keyframes fireGlow {
  0% {
    filter: drop-shadow(0 0 3px #f97316) brightness(1);
  }
  100% {
    filter: drop-shadow(0 0 8px #f97316) brightness(1.2);
  }
}

/* Анимация для стрелки вверх */
@keyframes upArrowGlow {
  0%,
  100% {
    transform: translateY(0);
    filter: drop-shadow(0 0 2px #10b981);
  }
  50% {
    transform: translateY(-2px);
    filter: drop-shadow(0 0 6px #10b981);
  }
}

/* Анимация для стрелки вниз */
@keyframes downArrowGlow {
  0%,
  100% {
    transform: translateY(0);
    filter: drop-shadow(0 0 2px #ef4444);
  }
  50% {
    transform: translateY(2px);
    filter: drop-shadow(0 0 6px #ef4444);
  }
}

/* Анимация мерцания звезды */
@keyframes starTwinkle {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 3px #eab308) brightness(1);
  }
  25% {
    transform: scale(1.1) rotate(18deg);
    filter: drop-shadow(0 0 6px #eab308) brightness(1.3);
  }
  75% {
    transform: scale(1.05) rotate(-18deg);
    filter: drop-shadow(0 0 4px #eab308) brightness(1.1);
  }
}

.sort-select:focus + div .w-4,
.sort-select:hover + div .w-4 {
  transform: scale(1.2);
  filter: brightness(1.3) !important;
}

.sort-select:focus ~ div .w-4 {
  animation-duration: 1s !important;
}

/* === СТИЛИ СКЕЛЕТОНА ЗАГОЛОВКА В СТИЛЕ PINK RABBIT === */
.pink-rabbit-header-skeleton {
  @apply flex justify-between items-center p-4 mb-6 bg-white rounded-xl shadow-sm border border-gray-100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pink-rabbit-header-skeleton:hover {
  box-shadow: 0 10px 25px rgba(236, 72, 153, 0.1);
  border-color: rgba(236, 72, 153, 0.2);
}

.skeleton-content {
  @apply flex items-center gap-4;
}

.skeleton-title {
  width: 200px;
  height: 28px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.25) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
  border-radius: 14px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: 0.2s;
}

.skeleton-counter {
  width: 80px;
  height: 20px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(236, 72, 153, 0.15) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 10px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: 0.4s;
}

.skeleton-controls {
  @apply flex items-center gap-3;
}

.skeleton-view-toggle {
  @apply flex gap-2;
}

.skeleton-view-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.2) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
  border-radius: 10px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-view-btn:nth-child(1) {
  animation-delay: 0.6s;
}

.skeleton-view-btn:nth-child(2) {
  animation-delay: 0.8s;
}

.skeleton-sort-dropdown {
  width: 160px;
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.2) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
  border-radius: 10px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: 1s;
}

/* === АНИМАЦИИ СКЕЛЕТОНА === */
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
</style>
