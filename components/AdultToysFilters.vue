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
              <div
                v-if="filteredBrands.length === 0 && brandSearch.trim()"
                class="empty-search-result"
              >
                <div class="empty-icon">🔍</div>
                <p class="empty-text">Бренды не найдены</p>
                <p class="empty-hint">Попробуйте изменить поисковый запрос</p>
              </div>
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
          <div class="btn-content">
            <div class="btn-main">
              <MagnifyingGlassIcon class="btn-icon" />
            </div>
            <span v-if="activeFiltersCount > 0" class="btn-badge">
              {{ formatBadgeCount(activeFiltersCount) }}
            </span>
          </div>
        </button>
        <button
          v-if="hasActiveFilters"
          @click="resetAllFilters"
          class="action-btn action-btn-secondary"
        >
          <TrashIcon class="btn-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
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
  onlyInStock: false,
  onlyWithDiscount: false,
  onlyNew: false,
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

// Определяем emit события
const emit = defineEmits(["update-filters", "reset-filters"]);

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

// Данные для фильтров (расширенный список брендов)
const brands = ref([
  { id: 1, name: "LELO", count: 45 },
  { id: 2, name: "We-Vibe", count: 32 },
  { id: 3, name: "Satisfyer", count: 28 },
  { id: 4, name: "Womanizer", count: 25 },
  { id: 5, name: "Fun Factory", count: 22 },
  { id: 6, name: "Tenga", count: 18 },
  { id: 7, name: "Lovense", count: 15 },
  { id: 8, name: "Doc Johnson", count: 35 },
  { id: 9, name: "Bad Dragon", count: 28 },
  { id: 10, name: "Dame Products", count: 22 },
  { id: 11, name: "CalExotics", count: 31 },
  { id: 12, name: "Pipedream", count: 19 },
  { id: 13, name: "Adam & Eve", count: 26 },
  { id: 14, name: "Rocks-Off", count: 17 },
  { id: 15, name: "JimmyJane", count: 14 },
  { id: 16, name: "Magic Silk", count: 12 },
  { id: 17, name: "Aneros", count: 21 },
  { id: 18, name: "OhMiBod", count: 16 },
  { id: 19, name: "Hot Octopuss", count: 13 },
  { id: 20, name: "Liberator", count: 11 },
  { id: 21, name: "System JO", count: 24 },
  { id: 22, name: "Pjur", count: 18 },
  { id: 23, name: "Durex", count: 29 },
  { id: 24, name: "Trojan", count: 23 },
  { id: 25, name: "Silk Touch", count: 9 },
  { id: 26, name: "Fifty Shades", count: 33 },
  { id: 27, name: "Pure Romance", count: 20 },
  { id: 28, name: "Spencer's", count: 15 },
  { id: 29, name: "Evolved Novelties", count: 27 },
  { id: 30, name: "Blush Novelties", count: 25 },
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
  const search = brandSearch.value.toLowerCase().trim();
  console.log("🔍 Поиск по брендам:", search);

  if (!search) {
    console.log("📋 Показываем все бренды:", brands.value.length);
    return brands.value;
  }

  const filtered = brands.value.filter((brand) =>
    brand.name.toLowerCase().includes(search)
  );

  console.log(
    `🎯 Найдено брендов: ${filtered.length} из ${brands.value.length}`
  );
  return filtered;
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

// Форматирование счётчика для badge кнопки
const formatBadgeCount = (count) => {
  // Показываем точное количество товаров для лучшего понимания
  if (count > 999) return "999+";
  if (count > 99) return "99+";
  return count.toString();
};

const applyFilters = () => {
  console.log(
    "✨ Применяем фильтры в компоненте AdultToysFilters:",
    filters.value
  );

  // Передаем все фильтры в родительский компонент
  emit("update-filters", filters.value);

  console.log("📤 Фильтры отправлены в каталог товаров");
};

const resetAllFilters = () => {
  console.log("🔄 Сбрасываем все фильтры в компоненте AdultToysFilters");

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
    onlyInStock: false,
    onlyWithDiscount: false,
    onlyNew: false,
  };

  // Сбрасываем также слайдер цены
  priceRange.value = { min: 0, max: 250000 };
  brandSearch.value = "";

  // Передаем сброшенные фильтры в родительский компонент
  emit("reset-filters");
  emit("update-filters", filters.value);

  console.log("✅ Все фильтры сброшены и отправлены в каталог");
};

const onPriceRangeChange = (range) => {
  // Обновляем состояние фильтров при изменении слайдера
  priceRange.value = range;
  filters.value.priceMin = range.min;
  filters.value.priceMax = range.max;
  console.log("💰 Диапазон цен изменен:", range);

  // Автоматически применяем фильтры при изменении цены
  applyFilters();
};

// Добавляем автоматическое применение фильтров при изменении других параметров
const autoApplyFilters = () => {
  console.log("🚀 Автоматическое применение фильтров");
  applyFilters();
};

// Watchers для автоматического применения фильтров
watch(
  () => filters.value.selectedBrands,
  () => {
    console.log("🔄 Изменены бренды:", filters.value.selectedBrands);
    autoApplyFilters();
  },
  { deep: true }
);

watch(
  () => filters.value.selectedMaterials,
  () => {
    console.log("🔄 Изменены материалы:", filters.value.selectedMaterials);
    autoApplyFilters();
  },
  { deep: true }
);

watch(
  () => filters.value.selectedColors,
  () => {
    console.log("🔄 Изменены цвета:", filters.value.selectedColors);
    autoApplyFilters();
  },
  { deep: true }
);

watch(
  () => filters.value.selectedLengths,
  () => {
    console.log("🔄 Изменена длина:", filters.value.selectedLengths);
    autoApplyFilters();
  },
  { deep: true }
);

watch(
  () => filters.value.selectedDiameters,
  () => {
    console.log("🔄 Изменён диаметр:", filters.value.selectedDiameters);
    autoApplyFilters();
  },
  { deep: true }
);

watch(
  () => filters.value.selectedVibrationModes,
  () => {
    console.log(
      "🔄 Изменены режимы вибрации:",
      filters.value.selectedVibrationModes
    );
    autoApplyFilters();
  },
  { deep: true }
);

watch(
  () => filters.value.selectedWaterproofLevels,
  () => {
    console.log(
      "🔄 Изменена водозащита:",
      filters.value.selectedWaterproofLevels
    );
    autoApplyFilters();
  },
  { deep: true }
);

watch(
  () => filters.value.hasHeating,
  () => {
    console.log("🔄 Изменён фильтр нагрева:", filters.value.hasHeating);
    autoApplyFilters();
  }
);

watch(
  () => filters.value.selectedMotorCounts,
  () => {
    console.log(
      "🔄 Изменено количество моторов:",
      filters.value.selectedMotorCounts
    );
    autoApplyFilters();
  },
  { deep: true }
);

watch(
  () => filters.value.selectedAromas,
  () => {
    console.log("🔄 Изменены ароматы:", filters.value.selectedAromas);
    autoApplyFilters();
  },
  { deep: true }
);

watch(
  () => filters.value.isEdible,
  () => {
    console.log("🔄 Изменён фильтр съедобности:", filters.value.isEdible);
    autoApplyFilters();
  }
);

// Добавляем watcher для отладки поиска
watch(
  brandSearch,
  (newValue, oldValue) => {
    console.log("🔄 brandSearch изменился:", {
      old: oldValue,
      new: newValue,
      filteredCount: filteredBrands.value.length,
    });
  },
  { immediate: true }
);
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

/* Основной контейнер фильтров с улучшенной интеграцией скрола */
.filters-container {
  @apply bg-white rounded-lg border border-gray-200 shadow-sm;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.9)
  );
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* Убираем overflow hidden чтобы скрол отображался корректно */
  overflow: visible;
  /* Добавляем отступ снизу для липкой кнопки */
  padding-bottom: 80px;
}

.filters-container:hover {
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.08);
  border-color: rgba(236, 72, 153, 0.2);
  transform: translateY(-1px);
}

/* Заголовок */
.filters-header {
  @apply p-4 border-b border-gray-200 flex justify-between items-center;
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.8),
    rgba(255, 255, 255, 0.9)
  );
  position: relative;
}

.filters-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(236, 72, 153, 0.2),
    transparent
  );
}

.header-main {
  @apply flex items-center gap-3;
}

.filter-main-title {
  @apply text-lg font-semibold text-gray-900 flex items-center gap-2;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.02em;
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
  font-weight: 600;
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
  position: relative;
  overflow: hidden;
}

.control-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(
    circle,
    rgba(236, 72, 153, 0.1) 0%,
    transparent 70%
  );
  transition: all 0.3s ease;
  transform: translate(-50%, -50%);
}

.control-btn:hover::before {
  width: 100px;
  height: 100px;
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

/* Контент фильтров с единственным элегантным скролом */
.filters-content {
  @apply p-4 space-y-3;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  /* Делаем тонкий элегантный скрол */
  scrollbar-width: thin;
  scrollbar-color: rgba(236, 72, 153, 0.4) transparent;
  /* Обеспечиваем прокрутку с учетом липкой кнопки */
  max-height: calc(100vh - 200px);
  /* Оптимизированные отступы для единственного скрола */
  padding-right: 16px;
  margin-right: 2px;
  /* Добавляем плавную прокрутку */
  scroll-behavior: smooth;
}

/* Улучшенный webkit скрол для основного контейнера */
.filters-content::-webkit-scrollbar {
  width: 5px;
  background: transparent;
}

.filters-content::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.2);
  border-radius: 3px;
  margin: 8px 0;
}

.filters-content::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(236, 72, 153, 0.5),
    rgba(236, 72, 153, 0.3)
  );
  border-radius: 3px;
  transition: all 0.3s ease;
  min-height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.filters-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(236, 72, 153, 0.7),
    rgba(236, 72, 153, 0.5)
  );
  width: 6px;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
}

.filters-content::-webkit-scrollbar-thumb:active {
  background: linear-gradient(
    180deg,
    rgba(236, 72, 153, 0.8),
    rgba(236, 72, 153, 0.6)
  );
}

/* Дополнительные улучшения для скрола */
.filters-content:hover::-webkit-scrollbar-thumb {
  opacity: 1;
  background: linear-gradient(
    180deg,
    rgba(236, 72, 153, 0.6),
    rgba(236, 72, 153, 0.4)
  );
}

/* Плавное появление скрола при наведении на контейнер */
.filters-content::-webkit-scrollbar {
  opacity: 0.8;
  transition: opacity 0.3s ease, width 0.2s ease;
}

.filters-content:hover::-webkit-scrollbar {
  opacity: 1;
}

/* Обертка поиска оптимизированная для единственного скрола */
.search-wrapper {
  @apply p-3 border-b border-gray-100;
  position: sticky;
  top: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98),
    rgba(248, 250, 252, 0.98)
  );
  backdrop-filter: blur(8px);
  z-index: 10;
  /* Оптимизированные отступы для единственного скрола */
  margin-right: 0;
  padding-right: 12px;
}

.search-input {
  @apply w-full px-4 py-3 border border-gray-200 rounded-lg text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent;
  transition: all 0.3s ease;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1),
    0 4px 12px rgba(236, 72, 153, 0.1);
  background: rgba(255, 255, 255, 1);
  border-color: rgba(236, 72, 153, 0.5);
  transform: translateY(-1px);
}

.search-input::placeholder {
  color: rgba(107, 114, 128, 0.6);
  font-style: italic;
}

/* Улучшенный список опций БЕЗ собственного скрола */
.options-list {
  @apply p-3 space-y-2;
  /* Убираем ограничение по высоте и скрол */
  /* max-height: 280px; */
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
  position: relative;
  /* Убираем отступы для скрола так как теперь скрол только основной */
  margin-right: 0;
  padding-right: 12px;
}

/* Убираем все стили скрола для списков опций */
/* .options-list::-webkit-scrollbar {
  width: 3px;
  background: transparent;
}

.options-list::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.3);
  border-radius: 2px;
  margin: 2px 0;
}

.options-list::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(236, 72, 153, 0.4),
    rgba(236, 72, 153, 0.25)
  );
  border-radius: 2px;
  transition: all 0.2s ease;
  min-height: 20px;
}

.options-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(236, 72, 153, 0.6),
    rgba(236, 72, 153, 0.4)
  );
  width: 4px;
}

.options-list::-webkit-scrollbar-thumb:active {
  background: linear-gradient(
    180deg,
    rgba(236, 72, 153, 0.8),
    rgba(236, 72, 153, 0.6)
  );
} */

/* Опция чекбокса */
.checkbox-option {
  @apply flex items-center gap-3 p-2 rounded-lg cursor-pointer;
  transition: all 0.3s ease;
  position: relative;
}

.checkbox-option::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.05),
    rgba(236, 72, 153, 0.02)
  );
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.checkbox-option:hover::before {
  opacity: 1;
}

.checkbox-option:hover {
  transform: translateX(2px);
}

.option-checkbox {
  @apply w-4 h-4 rounded border-2 border-gray-300;
  @apply focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1;
  transition: all 0.3s ease;
  appearance: none;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
  position: relative;
  z-index: 2;
}

.option-checkbox:checked {
  @apply border-pink-500 bg-pink-500;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
  box-shadow: 0 2px 4px rgba(236, 72, 153, 0.2);
}

.option-checkbox:checked:hover {
  box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
}

.option-label {
  @apply text-sm text-gray-700 flex-1;
  transition: all 0.3s ease;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  z-index: 2;
}

.checkbox-option:hover .option-label {
  color: rgba(236, 72, 153, 0.8);
}

.option-count {
  @apply text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  z-index: 2;
}

.checkbox-option:hover .option-count {
  background: rgba(236, 72, 153, 0.1);
  color: rgba(236, 72, 153, 0.7);
}

/* Цветовая сетка */
.color-grid {
  @apply p-3 flex flex-wrap gap-2;
}

.color-option {
  @apply w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer;
  @apply relative transition-all duration-300 hover:scale-110;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.color-option::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(
    45deg,
    rgba(236, 72, 153, 0.2),
    rgba(236, 72, 153, 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.color-option:hover::before {
  opacity: 1;
}

.color-option:hover {
  border-color: rgba(236, 72, 153, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.color-option.active {
  border-color: rgba(236, 72, 153, 0.8);
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
  transform: scale(1.1);
}

.color-option.active::before {
  opacity: 1;
}

.color-check {
  @apply w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
  filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.6));
  z-index: 2;
}

/* Toggle опции */
.toggle-options {
  @apply p-3 space-y-2;
}

.toggle-option {
  @apply flex items-center gap-3 p-2 rounded-lg cursor-pointer;
  transition: all 0.3s ease;
  position: relative;
}

.toggle-option::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.05),
    rgba(236, 72, 153, 0.02)
  );
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.toggle-option:hover::before {
  opacity: 1;
}

/* Улучшенные стили для кнопок действий */
.filter-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  @apply bg-white border-t border-gray-200 p-4;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
  backdrop-filter: blur(10px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  /* Добавляем анимацию появления */
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn {
  @apply font-medium text-sm transition-all duration-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  position: relative;
  overflow: hidden;
  border: none;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.action-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.action-btn:hover::before {
  width: 120px;
  height: 120px;
}

/* Структура кнопки */
.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 12px;
}

.btn-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
}

.btn-icon {
  @apply w-6 h-6;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.action-btn-primary:hover .btn-icon {
  transform: scale(1.2) rotate(10deg);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
}

/* Основная кнопка - оптимизированная для иконки */
.action-btn-primary {
  @apply text-white;
  @apply focus:ring-pink-500;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%);
  border-radius: 16px;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.025em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px 0 rgba(236, 72, 153, 0.35),
    0 2px 8px 0 rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  transform: perspective(1000px) rotateX(0deg);
  padding: 14px 18px;
  min-width: 64px;
  width: auto;
  flex: 0 0 auto;
}

.action-btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%);
  box-shadow: 0 10px 30px 0 rgba(236, 72, 153, 0.45),
    0 4px 15px 0 rgba(236, 72, 153, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: perspective(1000px) rotateX(-2deg) translateY(-2px) scale(1.02);
}

.action-btn-primary:active:not(:disabled) {
  transform: perspective(1000px) rotateX(1deg) translateY(0px) scale(0.98);
  box-shadow: 0 4px 12px 0 rgba(236, 72, 153, 0.4),
    0 1px 4px 0 rgba(236, 72, 153, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Улучшенный badge */
.btn-badge {
  @apply bg-white bg-opacity-35 text-white rounded-full font-bold;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  line-height: 1;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  margin-left: 8px;
}

.btn-badge::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn-primary:hover .btn-badge {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
}

.action-btn-primary:hover .btn-badge::before {
  opacity: 1;
}

/* Анимация появления badge */
@keyframes badgeAppear {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.btn-badge {
  animation: badgeAppear 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Состояние отключенной кнопки */
.action-btn-primary.btn-disabled {
  background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 50%, #6b7280 100%);
  box-shadow: 0 2px 8px 0 rgba(107, 114, 128, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.action-btn-primary.btn-disabled:hover {
  transform: none;
  box-shadow: 0 2px 8px 0 rgba(107, 114, 128, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Вторичная кнопка - оптимизированная для иконки */
.action-btn-secondary {
  @apply border border-gray-300 text-gray-700;
  @apply focus:ring-gray-500;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
  border-radius: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 14px 16px;
  min-width: 56px;
  width: auto;
  flex: 0 0 auto;
}

.action-btn-secondary .btn-icon {
  @apply w-5 h-5;
}

.action-btn-secondary:hover {
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.98),
    rgba(241, 245, 249, 0.95)
  );
  border-color: rgba(236, 72, 153, 0.3);
  color: rgba(236, 72, 153, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12),
    0 2px 6px 0 rgba(236, 72, 153, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.action-btn-secondary:hover .btn-icon {
  transform: scale(1.15) rotate(-5deg);
  color: rgba(236, 72, 153, 0.7);
}

/* Медиа запросы */
@media (max-width: 768px) {
  .filters-container {
    @apply mx-2 rounded-lg;
  }

  .filters-header {
    @apply px-3 py-3;
  }

  .filter-main-title {
    @apply text-base;
  }

  .filters-content {
    @apply p-3 space-y-2;
    max-height: calc(100vh - 180px);
  }

  .filter-section {
    @apply rounded-lg;
  }

  .filter-actions {
    padding: 12px 16px;
    gap: 10px;
  }

  .action-btn-primary {
    padding: 12px 16px;
    min-width: 60px;
    min-height: 48px;
  }

  .btn-text-full {
    display: none;
  }

  .btn-text-short {
    display: block;
  }

  .btn-icon {
    @apply w-5 h-5;
  }

  .btn-badge {
    min-width: 26px;
    height: 26px;
    font-size: 12px;
    margin-left: 6px;
  }

  .action-btn-secondary {
    padding: 12px 14px;
    min-width: 52px;
  }

  .action-btn-secondary .btn-icon {
    @apply w-4 h-4;
  }

  /* Улучшения для мобильных устройств */
  .filters-content {
    /* На мобильных делаем скрол еще тоньше но оставляем единственным */
    padding-right: 12px;
    margin-right: 1px;
  }

  .filters-content::-webkit-scrollbar {
    width: 3px;
  }

  .options-list {
    /* Убираем все отступы связанные со скролом */
    padding-right: 8px;
    margin-right: 0;
  }

  .search-wrapper {
    margin-right: 0;
    padding-right: 8px;
  }
}

@media (max-width: 480px) {
  .filter-actions {
    padding: 10px 12px;
    gap: 8px;
    justify-content: center;
  }

  .action-btn-primary,
  .action-btn-secondary {
    min-height: 44px;
  }

  .action-btn-primary {
    padding: 10px 14px;
    min-width: 56px;
  }

  .action-btn-secondary {
    padding: 10px 12px;
    min-width: 48px;
  }

  .btn-content {
    gap: 6px;
  }

  .btn-badge {
    min-width: 24px;
    height: 24px;
    font-size: 11px;
    margin-left: 4px;
  }

  .btn-icon {
    @apply w-4 h-4;
  }

  .action-btn-secondary .btn-icon {
    @apply w-4 h-4;
  }
}

/* Улучшенная типография для кнопок */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  line-height: 1.2;
}

.action-btn-primary {
  padding-left: 16px;
  padding-right: 16px;
}

/* Дополнительные анимации */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-section:nth-child(1) {
  animation-delay: 0.1s;
}
.filter-section:nth-child(2) {
  animation-delay: 0.2s;
}
.filter-section:nth-child(3) {
  animation-delay: 0.3s;
}
.filter-section:nth-child(4) {
  animation-delay: 0.4s;
}
.filter-section:nth-child(5) {
  animation-delay: 0.5s;
}
.filter-section:nth-child(6) {
  animation-delay: 0.6s;
}
.filter-section:nth-child(7) {
  animation-delay: 0.7s;
}
.filter-section:nth-child(8) {
  animation-delay: 0.8s;
}
.filter-section:nth-child(9) {
  animation-delay: 0.9s;
}
.filter-section:nth-child(10) {
  animation-delay: 1s;
}

/* Дополнительные анимации для кнопок */
.action-btn-primary::after {
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
  transition: left 0.8s ease;
}

.action-btn-primary:hover::after {
  left: 100%;
}

/* Дополнительные эффекты наведения */
.filter-section:hover .filter-title {
  color: rgba(236, 72, 153, 0.8);
}

/* Улучшенная доступность */
.option-checkbox:focus,
.search-input:focus,
.action-btn:focus {
  outline: 2px solid rgba(236, 72, 153, 0.5);
  outline-offset: 2px;
}

/* Дополнительные улучшения для badge */
.btn-badge-animate {
  animation: badgeCountUpdate 0.3s ease-out;
}

@keyframes badgeCountUpdate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
    background: rgba(255, 255, 255, 0.5);
  }
  100% {
    transform: scale(1);
  }
}

/* Индикатор пустого поиска */
.empty-search-result {
  @apply text-center py-8 px-4;
  animation: fadeInUp 0.4s ease-out;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
  animation: pulse 2s infinite;
}

.empty-text {
  @apply text-gray-600 font-medium mb-2;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
}

.empty-hint {
  @apply text-gray-400 text-sm;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* Улучшенная анимация для чекбоксов брендов */
.checkbox-option {
  @apply flex items-center gap-3 p-2 rounded-lg cursor-pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: slideInFromLeft 0.4s ease-out;
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

/* Секция фильтра */
.filter-section {
  @apply border border-gray-100 rounded-lg overflow-hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
  position: relative;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.filter-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.02), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.filter-section:hover {
  border-color: rgba(236, 72, 153, 0.15);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.06);
  transform: translateY(-1px);
}

.filter-header {
  @apply flex items-center justify-between p-3 cursor-pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.filter-header:hover {
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.95),
    rgba(236, 72, 153, 0.03)
  );
}

.filter-title {
  @apply text-sm font-medium text-gray-700 flex items-center gap-2;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.01em;
}

.filter-icon {
  @apply w-4 h-4 text-gray-500;
  transition: all 0.3s ease;
}

.filter-header:hover .filter-icon {
  color: rgba(236, 72, 153, 0.7);
  transform: scale(1.1) rotate(5deg);
}

/* Стрелка аккордеона */
.accordion-arrow {
  @apply w-4 h-4 text-gray-400 transition-all duration-500 ease-in-out;
  transform-origin: center;
}

.accordion-arrow.rotate-180 {
  transform: rotate(180deg);
}

.filter-header:hover .accordion-arrow {
  color: rgba(236, 72, 153, 0.7);
  transform: scale(1.1);
}

.filter-header:hover .accordion-arrow.rotate-180 {
  transform: rotate(180deg) scale(1.1);
}

/* Тело фильтра */
.filter-body {
  @apply border-t border-gray-100;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
  animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
  }
}
</style>
