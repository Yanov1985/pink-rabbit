<template>
  <div class="filters-container">
    <!-- Skeleton при загрузке -->
    <div v-if="isLoading" class="skeleton-wrapper">
      <!-- Заголовок skeleton -->
      <div class="skeleton-header">
        <div class="skeleton-title"></div>
        <div class="skeleton-controls">
          <div class="skeleton-btn skeleton-btn-small"></div>
          <div class="skeleton-btn skeleton-btn-small"></div>
        </div>
      </div>

      <!-- Skeleton контент фильтров -->
      <div class="skeleton-content">
        <!-- Повторяем skeleton для каждой секции -->
        <div v-for="n in 6" :key="n" class="skeleton-section">
          <div class="skeleton-section-header">
            <div class="skeleton-section-title"></div>
            <div class="skeleton-arrow"></div>
          </div>
          <div class="skeleton-section-body">
            <div
              v-for="i in 4"
              :key="i"
              class="skeleton-option"
              :style="{ animationDelay: `${(n - 1) * 0.1 + i * 0.05}s` }"
            >
              <div class="skeleton-checkbox"></div>
              <div class="skeleton-label"></div>
              <div class="skeleton-count"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skeleton кнопки действий -->
      <div class="skeleton-actions">
        <div class="skeleton-btn skeleton-btn-primary"></div>
        <div class="skeleton-btn skeleton-btn-secondary"></div>
      </div>
    </div>

    <!-- Основной контент (отображается после загрузки) -->
    <div v-else>
      <!-- Заголовок фильтров -->
      <div class="filters-header">
        <h3 class="filter-main-title">
          <FunnelIcon class="w-5 h-5 text-pink-500" />
          Фильтры товаров
        </h3>
        <div class="header-controls">
          <button @click="toggleAllAccordions" class="toggle-all-btn">
            {{ allAccordionsOpen ? "📁 Свернуть все" : "📂 Развернуть все" }}
          </button>
          <button
            v-if="hasActiveFilters"
            @click="resetAllFilters"
            class="reset-all-btn"
          >
            Сбросить все
          </button>
        </div>
      </div>

      <!-- Область фильтров -->
      <div class="filters-content">
        <!-- Фильтр по цене -->
        <div class="filter-section">
          <div @click="toggleAccordion('price')" class="filter-header">
            <h4 class="filter-title">
              <CurrencyDollarIcon class="filter-icon" />
              Цена
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.price }"
            />
          </div>
          <div v-if="accordionState.price" class="filter-body">
            <div class="price-range">
              <div class="price-input-wrapper">
                <label>От</label>
                <input
                  v-model="filters.priceMin"
                  type="number"
                  placeholder="0"
                  class="price-input"
                />
              </div>
              <div class="price-input-wrapper">
                <label>До</label>
                <input
                  v-model="filters.priceMax"
                  type="number"
                  placeholder="100000"
                  class="price-input"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Фильтр по бренду -->
        <div class="filter-section">
          <div @click="toggleAccordion('brand')" class="filter-header">
            <h4 class="filter-title">
              <TagIcon class="filter-icon" />
              Бренд
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.brand }"
            />
          </div>
          <div v-if="accordionState.brand" class="filter-body">
            <div class="search-wrapper">
              <input
                v-model="brandSearch"
                type="text"
                placeholder="Поиск бренда..."
                class="search-input"
              />
            </div>
            <div class="options-list">
              <label
                v-for="brand in filteredBrands"
                :key="brand.id"
                class="checkbox-option"
              >
                <input
                  v-model="filters.selectedBrands"
                  :value="brand.id"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">{{ brand.name }}</span>
                <span class="option-count">({{ brand.count }})</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Фильтр по материалу -->
        <div class="filter-section">
          <div @click="toggleAccordion('material')" class="filter-header">
            <h4 class="filter-title">
              <CubeIcon class="filter-icon" />
              Материал
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.material }"
            />
          </div>
          <div v-if="accordionState.material" class="filter-body">
            <div class="options-list">
              <label
                v-for="material in materials"
                :key="material.id"
                class="checkbox-option"
              >
                <input
                  v-model="filters.selectedMaterials"
                  :value="material.id"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">{{ material.name }}</span>
                <span class="option-count">({{ material.count }})</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Фильтр по цвету -->
        <div class="filter-section">
          <div @click="toggleAccordion('color')" class="filter-header">
            <h4 class="filter-title">
              <SwatchIcon class="filter-icon" />
              Цвет
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.color }"
            />
          </div>
          <div v-if="accordionState.color" class="filter-body">
            <div class="color-grid">
              <div
                v-for="color in colors"
                :key="color.id"
                class="color-option"
                :class="{ active: filters.selectedColors.includes(color.id) }"
                @click="toggleColor(color.id)"
                :title="color.name"
                :style="{ backgroundColor: color.value }"
              >
                <CheckIcon
                  v-if="filters.selectedColors.includes(color.id)"
                  class="color-check"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Фильтр по длине -->
        <div class="filter-section">
          <div @click="toggleAccordion('length')" class="filter-header">
            <h4 class="filter-title">
              <ArrowsPointingOutIcon class="filter-icon" />
              Длина, см
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.length }"
            />
          </div>
          <div v-if="accordionState.length" class="filter-body">
            <div class="options-list">
              <label
                v-for="length in lengths"
                :key="length.value"
                class="checkbox-option"
              >
                <input
                  v-model="filters.selectedLengths"
                  :value="length.value"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">{{ length.label }}</span>
                <span class="option-count">({{ length.count }})</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Фильтр по диаметру -->
        <div class="filter-section">
          <div @click="toggleAccordion('diameter')" class="filter-header">
            <h4 class="filter-title">
              <ArrowsRightLeftIcon class="filter-icon" />
              Диаметр, см
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.diameter }"
            />
          </div>
          <div v-if="accordionState.diameter" class="filter-body">
            <div class="options-list">
              <label
                v-for="diameter in diameters"
                :key="diameter.value"
                class="checkbox-option"
              >
                <input
                  v-model="filters.selectedDiameters"
                  :value="diameter.value"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">{{ diameter.label }}</span>
                <span class="option-count">({{ diameter.count }})</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Фильтр по количеству режимов вибрации -->
        <div class="filter-section">
          <div @click="toggleAccordion('vibrationModes')" class="filter-header">
            <h4 class="filter-title">
              <WaveIcon class="filter-icon" />
              Количество режимов вибрации
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.vibrationModes }"
            />
          </div>
          <div v-if="accordionState.vibrationModes" class="filter-body">
            <div class="options-list">
              <label
                v-for="mode in vibrationModes"
                :key="mode.value"
                class="checkbox-option"
              >
                <input
                  v-model="filters.selectedVibrationModes"
                  :value="mode.value"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">{{ mode.label }}</span>
                <span class="option-count">({{ mode.count }})</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Фильтр по водонепроницаемости -->
        <div class="filter-section">
          <div @click="toggleAccordion('waterproof')" class="filter-header">
            <h4 class="filter-title">
              <BeakerIcon class="filter-icon" />
              Водонепроницаемость
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.waterproof }"
            />
          </div>
          <div v-if="accordionState.waterproof" class="filter-body">
            <div class="options-list">
              <label
                v-for="level in waterproofLevels"
                :key="level.value"
                class="checkbox-option"
              >
                <input
                  v-model="filters.selectedWaterproofLevels"
                  :value="level.value"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">{{ level.label }}</span>
                <span class="option-count">({{ level.count }})</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Фильтр по функции нагрева -->
        <div class="filter-section">
          <div @click="toggleAccordion('heating')" class="filter-header">
            <h4 class="filter-title">
              <FireIcon class="filter-icon" />
              Функция нагрева
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.heating }"
            />
          </div>
          <div v-if="accordionState.heating" class="filter-body">
            <div class="toggle-options">
              <label class="toggle-option">
                <input
                  v-model="filters.hasHeating"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">Есть функция нагрева</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Фильтр по количеству моторов -->
        <div class="filter-section">
          <div @click="toggleAccordion('motors')" class="filter-header">
            <h4 class="filter-title">
              <CogIcon class="filter-icon" />
              Количество моторов
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.motors }"
            />
          </div>
          <div v-if="accordionState.motors" class="filter-body">
            <div class="options-list">
              <label
                v-for="count in motorCounts"
                :key="count.value"
                class="checkbox-option"
              >
                <input
                  v-model="filters.selectedMotorCounts"
                  :value="count.value"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">{{ count.label }}</span>
                <span class="option-count">({{ count.count }})</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Фильтр по аромату -->
        <div class="filter-section">
          <div @click="toggleAccordion('aroma')" class="filter-header">
            <h4 class="filter-title">
              <SparklesIcon class="filter-icon" />
              Аромат
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.aroma }"
            />
          </div>
          <div v-if="accordionState.aroma" class="filter-body">
            <div class="options-list">
              <label
                v-for="aroma in aromas"
                :key="aroma.id"
                class="checkbox-option"
              >
                <input
                  v-model="filters.selectedAromas"
                  :value="aroma.id"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">{{ aroma.name }}</span>
                <span class="option-count">({{ aroma.count }})</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Фильтр съедобный -->
        <div class="filter-section">
          <div @click="toggleAccordion('edible')" class="filter-header">
            <h4 class="filter-title">
              <HeartIcon class="filter-icon" />
              Съедобный
            </h4>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.edible }"
            />
          </div>
          <div v-if="accordionState.edible" class="filter-body">
            <div class="toggle-options">
              <label class="toggle-option">
                <input
                  v-model="filters.isEdible"
                  type="checkbox"
                  class="option-checkbox"
                />
                <span class="option-label">Съедобный продукт</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="filter-actions">
        <button @click="applyFilters" class="apply-btn" :disabled="!hasChanges">
          <MagnifyingGlassIcon class="btn-icon" />
          Показать товары
        </button>
        <button
          v-if="hasActiveFilters"
          @click="resetAllFilters"
          class="reset-btn"
        >
          <TrashIcon class="btn-icon" />
          Сбросить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  TagIcon,
  SwatchIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  FunnelIcon,
  CubeIcon,
  ArrowsPointingOutIcon,
  ArrowsRightLeftIcon,
  BeakerIcon,
  FireIcon,
  CogIcon,
  SparklesIcon,
  HeartIcon,
} from "@heroicons/vue/24/solid";

// Псевдо-икона для волн (заменить на реальную если нужно)
const WaveIcon = CogIcon;

// Состояние загрузки
const isLoading = ref(true);

// Состояние фильтров
const filters = ref({
  priceMin: null,
  priceMax: null,
  selectedBrands: [],
  selectedMaterials: [],
  selectedColors: [],
  selectedLengths: [],
  selectedDiameters: [],
  selectedVibrationModes: [],
  selectedWaterproofLevels: [],
  hasHeating: false,
  selectedMotorCounts: [],
  selectedAromas: [],
  isEdible: false,
});

// Состояние UI
const brandSearch = ref("");

// Состояние аккордеона
const accordionState = ref({
  price: true,
  brand: true,
  material: false,
  color: false,
  length: false,
  diameter: false,
  vibrationModes: false,
  waterproof: false,
  heating: false,
  motors: false,
  aroma: false,
  edible: false,
});

// Имитация загрузки данных
onMounted(async () => {
  // Симулируем загрузку данных (1.5 секунды)
  await new Promise((resolve) => setTimeout(resolve, 1500));
  isLoading.value = false;
});

// Методы управления аккордеоном
const toggleAccordion = (section) => {
  accordionState.value[section] = !accordionState.value[section];
};

const toggleAllAccordions = () => {
  const allOpen = Object.values(accordionState.value).every((state) => state);
  const newState = !allOpen;
  Object.keys(accordionState.value).forEach((key) => {
    accordionState.value[key] = newState;
  });
};

const allAccordionsOpen = computed(() => {
  return Object.values(accordionState.value).every((state) => state);
});

// Данные для фильтров (как на оригинальном сайте)
const brands = ref([
  { id: 1, name: "LELO", count: 45 },
  { id: 2, name: "We-Vibe", count: 32 },
  { id: 3, name: "Satisfyer", count: 28 },
  { id: 4, name: "Womanizer", count: 25 },
  { id: 5, name: "Fun Factory", count: 22 },
  { id: 6, name: "Tenga", count: 18 },
  { id: 7, name: "Lovense", count: 15 },
  { id: 8, name: "Doc Johnson", count: 35 },
]);

const materials = ref([
  { id: 1, name: "Медицинский силикон", count: 156 },
  { id: 2, name: "TPE", count: 89 },
  { id: 3, name: "ABS-пластик", count: 67 },
  { id: 4, name: "Стекло", count: 23 },
  { id: 5, name: "Металл", count: 19 },
  { id: 6, name: "Кибер-кожа", count: 45 },
]);

const colors = ref([
  { id: 1, name: "Розовый", value: "#ff6b9d" },
  { id: 2, name: "Черный", value: "#000000" },
  { id: 3, name: "Белый", value: "#ffffff" },
  { id: 4, name: "Красный", value: "#ef4444" },
  { id: 5, name: "Фиолетовый", value: "#8b5cf6" },
  { id: 6, name: "Синий", value: "#3b82f6" },
  { id: 7, name: "Зеленый", value: "#10b981" },
  { id: 8, name: "Телесный", value: "#fbbf24" },
  { id: 9, name: "Голубой", value: "#06b6d4" },
  { id: 10, name: "Золото", value: "#f59e0b" },
  { id: 11, name: "Серебро", value: "#9ca3af" },
  { id: 12, name: "Прозрачный", value: "#e5e7eb" },
]);

const lengths = ref([
  { value: "10", label: "10 см", count: 23 },
  { value: "15", label: "15 см", count: 45 },
  { value: "20", label: "20 см", count: 67 },
  { value: "25", label: "25 см", count: 34 },
  { value: "30", label: "30 см и более", count: 15 },
]);

const diameters = ref([
  { value: "2", label: "2 см", count: 12 },
  { value: "3", label: "3 см", count: 34 },
  { value: "4", label: "4 см", count: 56 },
  { value: "5", label: "5 см", count: 45 },
  { value: "6", label: "6 см и более", count: 23 },
]);

const vibrationModes = ref([
  { value: "3", label: "3 режима", count: 45 },
  { value: "5", label: "5 режимов", count: 67 },
  { value: "7", label: "7 режимов", count: 34 },
  { value: "10", label: "10 режимов", count: 28 },
  { value: "15", label: "15+ режимов", count: 12 },
]);

const waterproofLevels = ref([
  { value: "ipx4", label: "IPX4", count: 45 },
  { value: "ipx7", label: "IPX7", count: 67 },
  { value: "full", label: "Полная защита", count: 89 },
]);

const motorCounts = ref([
  { value: "1", label: "1 мотор", count: 78 },
  { value: "2", label: "2 мотора", count: 45 },
  { value: "3", label: "3+ моторов", count: 23 },
]);

const aromas = ref([
  { id: 1, name: "Ваниль", count: 23 },
  { id: 2, name: "Клубника", count: 34 },
  { id: 3, name: "Шоколад", count: 19 },
  { id: 4, name: "Мята", count: 15 },
  { id: 5, name: "Цветочный", count: 28 },
]);

// Вычисляемые свойства
const filteredBrands = computed(() => {
  const search = brandSearch.value.toLowerCase();
  return brands.value.filter((brand) =>
    brand.name.toLowerCase().includes(search)
  );
});

const hasActiveFilters = computed(() => {
  return (
    filters.value.priceMin !== null ||
    filters.value.priceMax !== null ||
    filters.value.selectedBrands.length > 0 ||
    filters.value.selectedMaterials.length > 0 ||
    filters.value.selectedColors.length > 0 ||
    filters.value.selectedLengths.length > 0 ||
    filters.value.selectedDiameters.length > 0 ||
    filters.value.selectedVibrationModes.length > 0 ||
    filters.value.selectedWaterproofLevels.length > 0 ||
    filters.value.hasHeating ||
    filters.value.selectedMotorCounts.length > 0 ||
    filters.value.selectedAromas.length > 0 ||
    filters.value.isEdible
  );
});

const hasChanges = computed(() => {
  return hasActiveFilters.value;
});

// Методы
const toggleColor = (colorId) => {
  const index = filters.value.selectedColors.indexOf(colorId);
  if (index === -1) {
    filters.value.selectedColors.push(colorId);
  } else {
    filters.value.selectedColors.splice(index, 1);
  }
};

const applyFilters = () => {
  console.log("Применяем фильтры:", filters.value);
  // Здесь будет логика применения фильтров
};

const resetAllFilters = () => {
  filters.value = {
    priceMin: null,
    priceMax: null,
    selectedBrands: [],
    selectedMaterials: [],
    selectedColors: [],
    selectedLengths: [],
    selectedDiameters: [],
    selectedVibrationModes: [],
    selectedWaterproofLevels: [],
    hasHeating: false,
    selectedMotorCounts: [],
    selectedAromas: [],
    isEdible: false,
  };
  brandSearch.value = "";
};
</script>

<style scoped>
/* Skeleton стили */
.skeleton-wrapper {
  @apply bg-white rounded-lg border border-gray-200 shadow-sm;
}

.skeleton-header {
  @apply p-4 border-b border-gray-200 flex justify-between items-center;
}

.skeleton-title {
  @apply h-6 bg-gradient-to-r from-gray-200 via-pink-100 to-gray-200 rounded-md;
  width: 150px;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-controls {
  @apply flex items-center gap-3;
}

.skeleton-btn {
  @apply bg-gradient-to-r from-gray-200 via-pink-100 to-gray-200 rounded-lg;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-btn-small {
  @apply h-8;
  width: 80px;
}

.skeleton-btn-primary {
  @apply h-12;
  width: 140px;
}

.skeleton-btn-secondary {
  @apply h-12;
  width: 100px;
}

.skeleton-content {
  @apply p-4 space-y-3;
}

.skeleton-section {
  @apply border border-gray-100 rounded-lg;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
}

.skeleton-section-header {
  @apply flex items-center justify-between p-3;
}

.skeleton-section-title {
  @apply h-5 bg-gradient-to-r from-gray-200 via-pink-100 to-gray-200 rounded;
  width: 120px;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-arrow {
  @apply h-4 w-4 bg-gradient-to-r from-gray-200 via-pink-100 to-gray-200 rounded;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-section-body {
  @apply p-3 pt-0 border-t border-gray-100 space-y-2;
}

.skeleton-option {
  @apply flex items-center gap-2 p-2;
  animation: slideInFromLeft 0.8s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}

.skeleton-checkbox {
  @apply h-4 w-4 bg-gradient-to-r from-gray-200 via-pink-100 to-gray-200 rounded;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-label {
  @apply h-4 bg-gradient-to-r from-gray-200 via-pink-100 to-gray-200 rounded flex-1;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-count {
  @apply h-4 bg-gradient-to-r from-gray-200 via-pink-100 to-gray-200 rounded;
  width: 30px;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-actions {
  @apply sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
  backdrop-filter: blur(10px);
}

/* Анимации skeleton */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Обновление градиентов для skeleton */
.skeleton-btn,
.skeleton-title,
.skeleton-section-title,
.skeleton-arrow,
.skeleton-checkbox,
.skeleton-label,
.skeleton-count {
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.1) 0%,
    rgba(236, 72, 153, 0.2) 20%,
    rgba(219, 39, 119, 0.1) 40%,
    rgba(236, 72, 153, 0.2) 60%,
    rgba(236, 72, 153, 0.1) 80%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
}

/* Основной контейнер */
.filters-container {
  @apply bg-white rounded-lg border border-gray-200 shadow-sm;
  transition: all 0.3s ease;
}

.filters-container:hover {
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.08);
  border-color: rgba(236, 72, 153, 0.2);
}

/* Заголовок */
.filters-header {
  @apply p-4 border-b border-gray-200 flex justify-between items-center;
}

.filter-main-title {
  @apply text-lg font-semibold text-gray-900 flex items-center gap-2;
}

.header-controls {
  @apply flex items-center gap-3;
}

.toggle-all-btn {
  @apply text-xs text-gray-600 hover:text-pink-600 transition-all duration-300 px-3 py-2 rounded-lg;
  transition: all 0.3s ease;
}

.toggle-all-btn:hover {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.1),
    rgba(219, 39, 119, 0.1)
  );
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.2);
  transform: translateY(-1px);
}

.reset-all-btn {
  @apply text-sm text-pink-600 hover:text-pink-700 transition-all duration-300 px-3 py-2 rounded-lg;
}

.reset-all-btn:hover {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.1),
    rgba(219, 39, 119, 0.1)
  );
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.2);
  transform: translateY(-1px);
}

/* Контент фильтров */
.filters-content {
  @apply p-4 space-y-3;
}

/* Секция фильтра */
.filter-section {
  @apply border border-gray-100 rounded-lg;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
}

.filter-section:hover {
  border-color: rgba(236, 72, 153, 0.2);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.08);
  transform: translateY(-2px);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1),
    rgba(252, 231, 243, 0.3)
  );
}

.filter-header {
  @apply flex items-center justify-between p-3 cursor-pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px 8px 0 0;
}

.filter-header:hover {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.05),
    rgba(219, 39, 119, 0.05)
  );
  transform: scale(1.01);
}

.filter-title {
  @apply text-sm font-medium text-gray-800 flex items-center gap-2;
  transition: all 0.3s ease;
}

.filter-header:hover .filter-title {
  color: rgb(236, 72, 153);
  text-shadow: 0 0 8px rgba(236, 72, 153, 0.3);
}

.filter-icon {
  @apply w-4 h-4 text-pink-500;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 2px rgba(236, 72, 153, 0.3));
}

.filter-header:hover .filter-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.6));
}

.accordion-arrow {
  @apply w-4 h-4 text-gray-400 transition-all duration-500 ease-in-out;
}

.filter-header:hover .accordion-arrow {
  color: rgb(236, 72, 153);
  transform: scale(1.1);
  filter: drop-shadow(0 0 4px rgba(236, 72, 153, 0.4));
}

.filter-body {
  @apply p-3 pt-0 border-t border-gray-100;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500px;
  }
}

/* Ценовой диапазон */
.price-range {
  @apply flex gap-3;
}

.price-input-wrapper {
  @apply flex-1;
}

.price-input-wrapper label {
  @apply block text-xs text-gray-600 mb-1;
  transition: all 0.3s ease;
}

.price-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm transition-all duration-300;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
}

.price-input:focus {
  @apply ring-2 ring-pink-500 border-pink-500;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1), 0 0 8px rgba(236, 72, 153, 0.2);
  background: white;
}

.price-input:hover {
  border-color: rgba(236, 72, 153, 0.3);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
}

/* Поиск */
.search-wrapper {
  @apply mb-3;
}

.search-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm transition-all duration-300;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
}

.search-input:focus {
  @apply ring-2 ring-pink-500 border-pink-500;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1), 0 0 8px rgba(236, 72, 153, 0.2);
  background: white;
}

.search-input:hover {
  border-color: rgba(236, 72, 153, 0.3);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
}

/* Список опций */
.options-list {
  @apply space-y-2 max-h-40 overflow-y-auto;
}

.checkbox-option {
  @apply flex items-center gap-2 p-2 rounded-md cursor-pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.5),
    rgba(248, 250, 252, 0.5)
  );
}

.checkbox-option:hover {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.08),
    rgba(219, 39, 119, 0.08)
  );
  transform: translateX(4px) scale(1.02);
  box-shadow: 0 2px 12px rgba(236, 72, 153, 0.15);
  border-radius: 8px;
}

.option-checkbox {
  @apply w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded;
  transition: all 0.3s ease;
}

.option-checkbox:focus {
  @apply ring-pink-500 ring-2;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
}

.option-checkbox:checked {
  background: linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119));
  box-shadow: 0 0 8px rgba(236, 72, 153, 0.4);
}

.option-label {
  @apply flex-1 text-sm text-gray-700;
  transition: all 0.3s ease;
}

.checkbox-option:hover .option-label {
  color: rgb(236, 72, 153);
  font-weight: 500;
}

.option-count {
  @apply text-xs text-gray-500;
  transition: all 0.3s ease;
}

.checkbox-option:hover .option-count {
  color: rgb(219, 39, 119);
  font-weight: 600;
}

/* Toggle опции */
.toggle-options {
  @apply space-y-2;
}

.toggle-option {
  @apply flex items-center gap-2 cursor-pointer p-2 rounded-lg;
  transition: all 0.3s ease;
}

.toggle-option:hover {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.08),
    rgba(219, 39, 119, 0.08)
  );
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
}

/* Сетка цветов */
.color-grid {
  @apply grid grid-cols-6 gap-3;
}

.color-option {
  @apply w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer relative flex items-center justify-center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.color-option:hover {
  transform: scale(1.2) translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 12px rgba(236, 72, 153, 0.3);
  border-color: rgb(236, 72, 153);
}

.color-option.active {
  transform: scale(1.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(236, 72, 153, 0.5);
  border-color: rgb(236, 72, 153);
  border-width: 3px;
}

.color-check {
  @apply w-4 h-4 text-white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  animation: colorCheck 0.3s ease-out;
}

@keyframes colorCheck {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Кнопки действий */
.filter-actions {
  @apply sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
  backdrop-filter: blur(10px);
  border-color: rgba(236, 72, 153, 0.1);
}

.apply-btn {
  @apply flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2;
  background: linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119));
  color: white;
  border: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
  position: relative;
  overflow: hidden;
}

.apply-btn::before {
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
  transition: all 0.6s ease;
}

.apply-btn:hover::before {
  left: 100%;
}

.apply-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4),
    0 0 20px rgba(236, 72, 153, 0.3);
  background: linear-gradient(135deg, rgb(219, 39, 119), rgb(236, 72, 153));
}

.apply-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3),
    0 8px 25px rgba(236, 72, 153, 0.4);
}

.apply-btn:disabled {
  @apply bg-gray-300 cursor-not-allowed;
  background: linear-gradient(135deg, rgb(156, 163, 175), rgb(209, 213, 219));
  box-shadow: none;
  transform: none;
}

.apply-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(236, 72, 153, 0.5),
      0 0 20px rgba(236, 72, 153, 0.3);
  }
}

.apply-btn:focus {
  animation: pulse-glow 2s infinite;
}

.reset-btn {
  @apply bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.reset-btn:hover {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.1),
    rgba(219, 39, 119, 0.1)
  );
  color: rgb(236, 72, 153);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
  border-color: rgba(236, 72, 153, 0.3);
}

.btn-icon {
  @apply w-4 h-4;
  transition: all 0.3s ease;
}

.apply-btn:hover .btn-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
}

.reset-btn:hover .btn-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 4px rgba(236, 72, 153, 0.5));
}

/* Адаптивность */
@media (max-width: 768px) {
  .color-grid {
    @apply grid-cols-4;
  }

  .price-range {
    @apply flex-col gap-2;
  }

  .filter-actions {
    @apply flex-col;
  }

  .filter-section:hover {
    transform: none;
  }

  .checkbox-option:hover {
    transform: scale(1.01);
  }
}

/* Прокрутка */
.options-list::-webkit-scrollbar {
  width: 4px;
}

.options-list::-webkit-scrollbar-track {
  background: rgba(236, 72, 153, 0.1);
  border-radius: 2px;
}

.options-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119));
  border-radius: 2px;
}

.options-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgb(219, 39, 119), rgb(190, 24, 93));
}
</style>
