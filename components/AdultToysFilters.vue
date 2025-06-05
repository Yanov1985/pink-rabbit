<template>
  <div class="filters-container">
    <!-- Skeleton при загрузке -->
    <div v-if="isLoading" class="pink-rabbit-filters-skeleton">
      <!-- Заголовок skeleton с минимальным дизайном -->
      <div class="skeleton-header">
        <div class="skeleton-header-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-counter"></div>
        </div>
        <div class="skeleton-toggle-btn"></div>
      </div>

      <!-- Простой красивый контент skeleton -->
      <div class="skeleton-content">
        <!-- Уменьшенное количество секций для элегантности (было 4, стало 2) -->
        <div
          v-for="n in 2"
          :key="n"
          class="skeleton-section"
          :style="{ animationDelay: `${n * 0.3}s` }"
        >
          <div class="skeleton-section-header">
            <div class="skeleton-section-title"></div>
            <div class="skeleton-chevron"></div>
          </div>
          <!-- Упрощенные опции (было 3, стало 2) -->
          <div class="skeleton-options">
            <div
              v-for="i in 2"
              :key="i"
              class="skeleton-option"
              :style="{ animationDelay: `${n * 0.3 + i * 0.2}s` }"
            >
              <div class="skeleton-checkbox"></div>
              <div class="skeleton-label"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Простые кнопки действий (только одна кнопка) -->
      <div class="skeleton-footer">
        <div class="skeleton-apply-btn" style="animation-delay: 1.2s"></div>
      </div>
    </div>

    <!-- Основной контент (отображается после загрузки) -->
    <div v-else>
      <!-- Заголовок фильтров -->
      <div class="filters-header">
        <div class="header-main">
          <h3 class="filter-main-title">
            <FunnelIcon class="w-5 h-5 text-pink-500" />
            Фильтры товаров
          </h3>
          <div class="filters-counter" v-if="hasActiveFilters">
            <span class="counter-badge">{{ activeFiltersCount }}</span>
          </div>
        </div>
        <div class="header-controls">
          <button
            @click="toggleAllAccordions"
            class="control-btn control-btn-secondary"
            :title="
              allAccordionsOpen
                ? 'Свернуть все разделы'
                : 'Развернуть все разделы'
            "
          >
            <ChevronDownIcon
              class="w-4 h-4 transition-transform duration-300"
              :class="{ 'rotate-180': allAccordionsOpen }"
            />
          </button>
          <button
            v-if="hasActiveFilters"
            @click="resetAllFilters"
            class="control-btn control-btn-danger"
            title="Сбросить все фильтры"
          >
            <TrashIcon class="w-4 h-4" />
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
            <!-- Профессиональный слайдер для диапазона цен -->
            <PriceRangeSlider
              v-model="priceRange"
              :min="0"
              :max="250000"
              :step="100"
              @change="onPriceRangeChange"
            />
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
        <button
          @click="applyFilters"
          class="action-btn action-btn-primary"
          :disabled="!hasChanges"
          :class="{ 'btn-disabled': !hasChanges }"
        >
          <MagnifyingGlassIcon class="btn-icon" />
          <span class="btn-text">Показать товары</span>
          <span v-if="activeFiltersCount > 0" class="btn-badge">{{
            activeFiltersCount
          }}</span>
        </button>
        <button
          v-if="hasActiveFilters"
          @click="resetAllFilters"
          class="action-btn action-btn-secondary"
        >
          <TrashIcon class="btn-icon" />
          <span class="btn-text">Очистить</span>
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
import PriceRangeSlider from "@/components/PriceRangeSlider.vue";

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

// Состояние слайдера цены
const priceRange = ref({ min: 0, max: 250000 });

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

const activeFiltersCount = computed(() => {
  let count = 0;
  // Подсчитываем активные фильтры
  if (filters.value.priceMin !== null || filters.value.priceMax !== null)
    count++;
  count += filters.value.selectedBrands.length;
  count += filters.value.selectedMaterials.length;
  count += filters.value.selectedColors.length;
  count += filters.value.selectedLengths.length;
  count += filters.value.selectedDiameters.length;
  count += filters.value.selectedVibrationModes.length;
  count += filters.value.selectedWaterproofLevels.length;
  if (filters.value.hasHeating) count++;
  count += filters.value.selectedMotorCounts.length;
  count += filters.value.selectedAromas.length;
  if (filters.value.isEdible) count++;
  return count;
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
  // Сбрасываем также слайдер цены
  priceRange.value = { min: 0, max: 250000 };
  brandSearch.value = "";
};

const onPriceRangeChange = (range) => {
  // Обновляем состояние фильтров при изменении слайдера
  priceRange.value = range;
  filters.value.priceMin = range.min;
  filters.value.priceMax = range.max;
  console.log("Диапазон цен изменен:", range);
};
</script>

<style scoped>
/* === СТИЛИ СКЕЛЕТОНА В СТИЛЕ PINK RABBIT === */
.pink-rabbit-filters-skeleton {
  @apply bg-white rounded-lg border border-gray-200 shadow-sm;
  transition: all 0.3s ease;
}

.pink-rabbit-filters-skeleton:hover {
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.08);
  border-color: rgba(236, 72, 153, 0.2);
}

.skeleton-header {
  @apply p-4 border-b border-gray-200 flex justify-between items-center;
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.8),
    rgba(255, 255, 255, 0.9)
  );
}

.skeleton-header-content {
  @apply flex items-center gap-3;
}

.skeleton-title {
  width: 120px;
  height: 24px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.25) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-counter {
  width: 40px;
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(236, 72, 153, 0.15) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-toggle-btn {
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

.skeleton-content {
  @apply p-4 space-y-4;
}

.skeleton-section {
  @apply border border-gray-100 rounded-lg;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.skeleton-section-header {
  @apply flex items-center justify-between p-3;
}

.skeleton-section-title {
  width: 100px;
  height: 18px;
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

.skeleton-chevron {
  width: 16px;
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(236, 72, 153, 0.15) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-options {
  @apply p-3 pt-0 space-y-3;
}

.skeleton-option {
  @apply flex items-center gap-3 p-2;
  opacity: 0;
  animation: fadeInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.skeleton-checkbox {
  width: 16px;
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.08) 0%,
    rgba(236, 72, 153, 0.2) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-label {
  flex: 1;
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.05) 0%,
    rgba(236, 72, 153, 0.15) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  animation: pinkRabbitShimmer 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton-footer {
  @apply sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
  backdrop-filter: blur(10px);
}

.skeleton-apply-btn {
  flex: 1;
  height: 48px;
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

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.8),
    rgba(255, 255, 255, 0.9)
  );
}

.header-main {
  @apply flex items-center gap-3;
}

.filter-main-title {
  @apply text-lg font-semibold text-gray-900 flex items-center gap-2;
}

.filters-counter {
  @apply flex items-center;
}

.counter-badge {
  @apply bg-gradient-to-r from-pink-500 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(236, 72, 153, 0.2);
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.header-controls {
  @apply flex items-center gap-2;
}

.control-btn {
  @apply w-10 h-10 rounded-lg border transition-all duration-300 flex items-center justify-center;
  @apply hover:scale-105 hover:shadow-lg;
}

.control-btn-secondary {
  @apply bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300;
}

.control-btn-secondary:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.control-btn-danger {
  @apply bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100 hover:border-pink-300;
}

.control-btn-danger:hover {
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
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

.action-btn {
  @apply py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 relative;
  @apply transition-all duration-300 border;
  overflow: hidden;
  min-height: 48px;
}

.action-btn-primary {
  @apply flex-1 text-white;
  background: linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119));
  border-color: rgba(236, 72, 153, 0.3);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.action-btn-secondary {
  @apply bg-gray-50 text-gray-700 border-gray-200;
  flex: 0 0 auto;
  min-width: 100px;
}

.action-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
  background: linear-gradient(135deg, rgb(219, 39, 119), rgb(236, 72, 153));
}

.action-btn-secondary:hover {
  @apply bg-gray-100 border-gray-300 text-gray-800;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn:focus {
  outline: none;
}

.action-btn-primary:focus {
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3);
}

.action-btn-secondary:focus {
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.3);
}

.btn-disabled {
  @apply cursor-not-allowed opacity-60;
  background: linear-gradient(
    135deg,
    rgb(156, 163, 175),
    rgb(209, 213, 219)
  ) !important;
  border-color: rgba(156, 163, 175, 0.3) !important;
  box-shadow: none !important;
  transform: none !important;
}

.btn-disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

.btn-disabled::before {
  display: none;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
  }
  50% {
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }
}

.action-btn-primary:focus {
  animation: pulse-glow 2s infinite;
}

.btn-icon {
  @apply w-4 h-4;
  transition: all 0.3s ease;
}

.action-btn:hover .btn-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
}

.btn-text {
  @apply text-sm font-medium;
}

.btn-badge {
  @apply bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(236, 72, 153, 0.2);
  animation: fadeInScale 0.3s ease-out;
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
