<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 catalog-header"
    ref="headerRef"
  >
    <!-- Skeleton состояние при загрузке -->
    <div v-if="isLoading" class="animate-pulse">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="space-y-3">
          <!-- Заголовок skeleton -->
          <div class="h-8 bg-gray-200 rounded-lg w-64"></div>
          <!-- Счетчик товаров skeleton -->
          <div class="h-5 bg-gray-200 rounded-lg w-32"></div>
        </div>

        <!-- Элементы управления skeleton -->
        <div class="flex items-center gap-4">
          <!-- Переключатель видов skeleton -->
          <div class="h-10 bg-gray-200 rounded-lg w-24"></div>
          <!-- Сортировка skeleton -->
          <div class="h-10 bg-gray-200 rounded-lg w-40"></div>
        </div>
      </div>
    </div>

    <!-- Основное содержимое -->
    <div
      v-else
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <!-- Заголовок и счетчик -->
      <div class="catalog-info">
        <h1 class="text-2xl font-bold text-gray-900 catalog-title">
          {{ categoryTitle }}
        </h1>
        <p class="text-gray-600 mt-1 catalog-count">
          Найдено {{ totalCount }}
          {{ getProductsWord(totalCount) }}
        </p>
      </div>

      <!-- Элементы управления -->
      <div class="flex items-center gap-4 catalog-controls">
        <!-- Переключатель видов -->
        <div class="flex bg-gray-100 rounded-lg p-1" ref="viewToggleRef">
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
          >
            <!-- Иконка 4 колонки с Heroicons -->
            <Squares2X2Icon class="w-5 h-5" />
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
          >
            <!-- Иконка 3 колонки с Heroicons -->
            <ViewColumnsIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Сортировка с иконками Heroicons -->
        <div class="relative sort-wrapper">
          <select
            :value="sortBy"
            @change="$emit('changeSorting', $event.target.value)"
            class="px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-custom-pink focus:border-custom-pink sort-select appearance-none"
            ref="sortRef"
            :disabled="isLoading"
          >
            <option value="popularity">По популярности</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="rating">По рейтингу</option>
            <option value="newest">Сначала новые</option>
          </select>

          <!-- Иконка сортировки с Heroicons - динамическая для каждого типа -->
          <div
            class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          >
            <component
              :is="sortIcon"
              :class="['w-4 h-4 transition-all duration-300', sortIconColor]"
              title="Иконка текущей сортировки"
            />
          </div>

          <!-- Стрелка выпадающего списка с Heroicons -->
          <div
            class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          >
            <ChevronDownIcon class="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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

/* Анимация переливания для новинок */
@keyframes sparkleShimmer {
  0% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 2px #8b5cf6) hue-rotate(0deg);
  }
  33% {
    transform: scale(1.1) rotate(120deg);
    filter: drop-shadow(0 0 6px #8b5cf6) hue-rotate(60deg);
  }
  66% {
    transform: scale(1.05) rotate(240deg);
    filter: drop-shadow(0 0 4px #8b5cf6) hue-rotate(120deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
    filter: drop-shadow(0 0 2px #8b5cf6) hue-rotate(180deg);
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
</style>
