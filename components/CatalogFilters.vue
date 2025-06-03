<template>
  <div class="catalog-filters">
    <!-- Заголовок фильтров -->
    <div class="filters-header">
      <h3 class="filters-title">Фильтр по параметрам</h3>
      <button
        class="clear-filters-btn"
        @click="resetFilters"
        :class="{ active: hasActiveFilters }"
      >
        Сбросить все
      </button>
    </div>

    <!-- Цена -->
    <div class="filter-group">
      <h4 class="filter-title">Цена</h4>
      <div class="price-range">
        <div class="price-inputs">
          <input
            v-model.number="priceFrom"
            type="number"
            placeholder="От"
            class="price-input"
            @input="applyFilters"
          />
          <span class="price-separator">—</span>
          <input
            v-model.number="priceTo"
            type="number"
            placeholder="До"
            class="price-input"
            @input="applyFilters"
          />
        </div>
        <div class="price-slider">
          <input
            type="range"
            :min="priceRange.min"
            :max="priceRange.max"
            v-model="priceFrom"
            class="range-slider range-min"
            @input="applyFilters"
          />
          <input
            type="range"
            :min="priceRange.min"
            :max="priceRange.max"
            v-model="priceTo"
            class="range-slider range-max"
            @input="applyFilters"
          />
        </div>
      </div>
    </div>

    <!-- Бренд -->
    <div class="filter-group">
      <h4 class="filter-title">Бренд</h4>
      <div class="filter-search">
        <input
          v-model="brandSearch"
          type="text"
          placeholder="Поиск бренда..."
          class="search-input"
        />
      </div>
      <div
        class="filter-options"
        :class="{ expanded: expandedSections.brands }"
      >
        <label
          v-for="brand in filteredBrands"
          :key="brand"
          class="filter-option"
        >
          <input
            type="checkbox"
            :value="brand"
            v-model="selectedBrands"
            @change="applyFilters"
          />
          <span class="checkmark"></span>
          <span class="option-text">{{ brand }}</span>
        </label>
      </div>
      <button
        v-if="brands.length > 10"
        class="show-more-btn"
        @click="toggleSection('brands')"
      >
        {{ expandedSections.brands ? "Свернуть" : "Показать еще" }}
      </button>
    </div>

    <!-- Цвет -->
    <div class="filter-group">
      <h4 class="filter-title">Цвет</h4>
      <div class="color-options">
        <label
          v-for="color in availableColors"
          :key="color.id"
          class="color-option"
          :title="color.name"
        >
          <input
            type="checkbox"
            :value="color.id"
            v-model="selectedColors"
            @change="applyFilters"
          />
          <span
            class="color-swatch"
            :style="{ backgroundColor: color.hex }"
          ></span>
          <span class="color-name">{{ color.name }}</span>
        </label>
      </div>
    </div>

    <!-- Водонепроницаемость -->
    <div class="filter-group">
      <h4 class="filter-title">Водонепроницаемость</h4>
      <div class="filter-options">
        <label
          v-for="option in waterproofOptions"
          :key="option"
          class="filter-option"
        >
          <input
            type="radio"
            :value="option"
            v-model="waterproof"
            @change="applyFilters"
          />
          <span class="radiomark"></span>
          <span class="option-text">{{ option }}</span>
        </label>
      </div>
    </div>

    <!-- Материал -->
    <div class="filter-group">
      <h4 class="filter-title">Материал</h4>
      <div class="filter-options">
        <label
          v-for="material in availableMaterials"
          :key="material"
          class="filter-option"
        >
          <input
            type="checkbox"
            :value="material"
            v-model="selectedMaterials"
            @change="applyFilters"
          />
          <span class="checkmark"></span>
          <span class="option-text">{{ material }}</span>
        </label>
      </div>
    </div>

    <!-- Размер -->
    <div class="filter-group">
      <h4 class="filter-title">Размер</h4>
      <div class="filter-options">
        <label v-for="size in availableSizes" :key="size" class="filter-option">
          <input
            type="checkbox"
            :value="size"
            v-model="selectedSizes"
            @change="applyFilters"
          />
          <span class="checkmark"></span>
          <span class="option-text">{{ size }}</span>
        </label>
      </div>
    </div>

    <!-- Функции -->
    <div class="filter-group">
      <h4 class="filter-title">Функции</h4>
      <div class="filter-options">
        <label v-for="feature in features" :key="feature" class="filter-option">
          <input
            type="checkbox"
            :value="feature"
            v-model="selectedFeatures"
            @change="applyFilters"
          />
          <span class="checkmark"></span>
          <span class="option-text">{{ feature }}</span>
        </label>
      </div>
    </div>

    <!-- Кнопка применить фильтры (мобильная версия) -->
    <div class="apply-filters-mobile">
      <button class="apply-btn" @click="applyFilters">Применить фильтры</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

// Входящие параметры компонента
const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  brands: {
    type: Array,
    default: () => [],
  },
  priceRange: {
    type: Object,
    default: () => ({ min: 0, max: 100000 }),
  },
  availableFilters: {
    type: Object,
    default: () => ({}),
  },
});

// Исходящие события
const emit = defineEmits(["filters-changed", "filter-reset"]);

// Реактивные данные для фильтров
const selectedCategories = ref([]);
const selectedBrands = ref([]);
const priceFrom = ref(props.priceRange.min);
const priceTo = ref(props.priceRange.max);
const selectedColors = ref([]);
const selectedMaterials = ref([]);
const selectedSizes = ref([]);
const selectedFeatures = ref([]);
const waterproof = ref("");
const inStockOnly = ref(false);
const onSaleOnly = ref(false);
const newItemsOnly = ref(false);

// Доступные цвета
const availableColors = ref([
  { id: "pink", name: "Розовый", hex: "#FF69B4" },
  { id: "purple", name: "Фиолетовый", hex: "#800080" },
  { id: "black", name: "Черный", hex: "#000000" },
  { id: "white", name: "Белый", hex: "#FFFFFF" },
  { id: "red", name: "Красный", hex: "#FF0000" },
  { id: "blue", name: "Синий", hex: "#0000FF" },
]);

// Доступные материалы
const availableMaterials = ref([
  "Силикон",
  "TPE",
  "Стекло",
  "Металл",
  "Кожа",
  "Латекс",
]);

// Доступные размеры
const availableSizes = ref(["XS", "S", "M", "L", "XL", "XXL"]);

// Поиск по брендам - интеллектуальный помощник покупателя
const brandSearch = ref("");

// Развернутые секции - управление видимостью как жалюзи в окне
const expandedSections = ref({
  brands: false,
  materials: false,
  features: false,
});

// Опции водонепроницаемости
const waterproofOptions = ref(["Все", "Да", "Нет", "IPX7", "Брызгозащищенный"]);

// Доступные функции
const features = ref([
  "Вибрация",
  "Ротация",
  "Пульсация",
  "Нагрев",
  "Дистанционное управление",
  "Зарядка от USB",
  "Бесшумный",
  "Водонепроницаемый",
]);

// Вычисляемое свойство для фильтрации брендов по поиску
const filteredBrands = computed(() => {
  if (!brandSearch.value) {
    return expandedSections.value.brands
      ? props.brands
      : props.brands.slice(0, 10);
  }

  const filtered = props.brands.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.value.toLowerCase())
  );

  return expandedSections.value.brands ? filtered : filtered.slice(0, 10);
});

// Проверка наличия активных фильтров - индикатор как лампочка на панели
const hasActiveFilters = computed(() => {
  return (
    selectedBrands.value.length > 0 ||
    selectedColors.value.length > 0 ||
    waterproof.value !== "" ||
    selectedMaterials.value.length > 0 ||
    selectedSizes.value.length > 0 ||
    selectedFeatures.value.length > 0 ||
    priceFrom.value > props.priceRange.min ||
    priceTo.value < props.priceRange.max
  );
});

// Применение фильтров
const applyFilters = () => {
  const filters = {
    categories: selectedCategories.value,
    brands: selectedBrands.value,
    priceFrom: priceFrom.value,
    priceTo: priceTo.value,
    colors: selectedColors.value,
    materials: selectedMaterials.value,
    sizes: selectedSizes.value,
    features: selectedFeatures.value,
    waterproof: waterproof.value,
    inStockOnly: inStockOnly.value,
    onSaleOnly: onSaleOnly.value,
    newItemsOnly: newItemsOnly.value,
  };

  emit("filters-changed", filters);
};

// Сброс всех фильтров
const resetFilters = () => {
  selectedCategories.value = [];
  selectedBrands.value = [];
  priceFrom.value = props.priceRange.min;
  priceTo.value = props.priceRange.max;
  selectedColors.value = [];
  selectedMaterials.value = [];
  selectedSizes.value = [];
  selectedFeatures.value = [];
  waterproof.value = "";
  inStockOnly.value = false;
  onSaleOnly.value = false;
  newItemsOnly.value = false;

  emit("filter-reset");
};

// Переключение цвета
const toggleColor = (colorId) => {
  const index = selectedColors.value.indexOf(colorId);
  if (index > -1) {
    selectedColors.value.splice(index, 1);
  } else {
    selectedColors.value.push(colorId);
  }
  applyFilters();
};

// Переключение материала
const toggleMaterial = (material) => {
  const index = selectedMaterials.value.indexOf(material);
  if (index > -1) {
    selectedMaterials.value.splice(index, 1);
  } else {
    selectedMaterials.value.push(material);
  }
  applyFilters();
};

// Переключение развернутых секций - как аккордеон
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// Наблюдатели за изменениями
watch(
  [selectedCategories, selectedBrands, inStockOnly, onSaleOnly, newItemsOnly],
  () => {
    applyFilters();
  },
  { deep: true }
);

watch([priceFrom, priceTo], () => {
  if (priceFrom.value <= priceTo.value) {
    applyFilters();
  }
});

onMounted(() => {
  // Инициализация фильтров при монтировании
  applyFilters();
});
</script>

<style scoped>
/* Основной контейнер фильтров - как витрина магазина */
.catalog-filters {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

/* Заголовок фильтров - вывеска на витрине */
.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f5f5;
}

.filters-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

/* Кнопка сброса фильтров - аварийная кнопка */
.clear-filters-btn {
  background: #ecf0f1;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-btn.active {
  background: #e74c3c;
  color: white;
}

.clear-filters-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Группа фильтров - отдельная секция как полка в магазине */
.filter-group {
  margin-bottom: 28px;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 20px;
}

.filter-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

/* Заголовок группы фильтров */
.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
}

/* Ценовой диапазон - финансовый компас */
.price-range {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.price-input:focus {
  outline: none;
  border-color: #e91e63;
}

.price-separator {
  color: #7f8c8d;
  font-weight: 500;
}

/* Слайдер цены - двойной регулятор */
.price-slider {
  position: relative;
  height: 6px;
  background: #ecf0f1;
  border-radius: 3px;
}

.range-slider {
  position: absolute;
  width: 100%;
  height: 6px;
  background: transparent;
  pointer-events: none;
  -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e91e63;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 2px 6px rgba(233, 30, 99, 0.3);
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e91e63;
  cursor: pointer;
  pointer-events: all;
  border: none;
  box-shadow: 0 2px 6px rgba(233, 30, 99, 0.3);
}

/* Поиск по фильтрам - поисковик в магазине */
.filter-search {
  margin-bottom: 12px;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #e91e63;
}

/* Опции фильтров - список выбора */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 200px;
  overflow-y: auto;
  transition: max-height 0.3s ease;
}

.filter-options.expanded {
  max-height: none;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.3s ease;
}

.filter-option:hover {
  color: #e91e63;
}

/* Кастомные чекбоксы - красивые галочки */
.filter-option input[type="checkbox"],
.filter-option input[type="radio"] {
  display: none;
}

.checkmark,
.radiomark {
  width: 18px;
  height: 18px;
  border: 2px solid #bdc3c7;
  background: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkmark {
  border-radius: 4px;
}

.radiomark {
  border-radius: 50%;
}

.filter-option input[type="checkbox"]:checked + .checkmark {
  background: #e91e63;
  border-color: #e91e63;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
}

.filter-option input[type="radio"]:checked + .radiomark {
  background: #e91e63;
  border-color: #e91e63;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
}

.option-text {
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.4;
}

/* Цветовые опции - палитра художника */
.color-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.color-option:hover {
  background-color: #f8f9fa;
}

.color-option input {
  display: none;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid #ecf0f1;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.color-option input:checked + .color-swatch {
  border-color: #e91e63;
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.3);
}

.color-name {
  font-size: 12px;
  color: #2c3e50;
}

/* Кнопка "Показать еще" - расширение горизонтов */
.show-more-btn {
  background: none;
  border: 2px solid #e91e63;
  color: #e91e63;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.3s ease;
  width: 100%;
}

.show-more-btn:hover {
  background: #e91e63;
  color: white;
  transform: translateY(-1px);
}

/* Мобильная кнопка применения - финальный аккорд */
.apply-filters-mobile {
  display: none;
  padding-top: 20px;
  border-top: 2px solid #ecf0f1;
  margin-top: 20px;
}

.apply-btn {
  width: 100%;
  background: linear-gradient(135deg, #e91e63, #ad1457);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4);
}

/* Адаптивность - как хамелеон под разные экраны */
@media (max-width: 768px) {
  .catalog-filters {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    border-radius: 0;
    overflow-y: auto;
    padding: 20px;
  }

  .apply-filters-mobile {
    display: block;
  }

  .filter-options {
    max-height: 150px;
  }

  .color-options {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}

/* Скроллбар для опций - красивый как в премиум приложениях */
.filter-options::-webkit-scrollbar {
  width: 4px;
}

.filter-options::-webkit-scrollbar-track {
  background: #f1f2f6;
  border-radius: 2px;
}

.filter-options::-webkit-scrollbar-thumb {
  background: #e91e63;
  border-radius: 2px;
}

.filter-options::-webkit-scrollbar-thumb:hover {
  background: #ad1457;
}
</style>
