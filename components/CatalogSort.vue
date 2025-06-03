<template>
  <div class="catalog-sort">
    <!-- Основная панель сортировки - центр управления -->
    <div class="sort-panel">
      <!-- Информация о результатах - статистика поиска -->
      <div class="results-info">
        <span class="results-count">
          Найдено товаров: <strong>{{ totalResults }}</strong>
        </span>
        <span v-if="activeFilters > 0" class="active-filters">
          ({{ activeFilters }} {{ getFiltersText(activeFilters) }})
        </span>
      </div>

      <!-- Сортировка - режиссер каталога -->
      <div class="sort-options">
        <label class="sort-label">Сортировать по:</label>
        <select v-model="selectedSort" class="sort-select" @change="updateSort">
          <option
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Переключатель вида - режимы отображения -->
      <div class="view-switcher">
        <button
          class="view-btn"
          :class="{ active: currentView === 'grid' }"
          @click="changeView('grid')"
          title="Сетка"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M10 2H2v8h8V2zm0 10H2v8h8v-8zm10-10h-8v8h8V2zm0 10h-8v8h8v-8z"
            />
          </svg>
        </button>
        <button
          class="view-btn"
          :class="{ active: currentView === 'list' }"
          @click="changeView('list')"
          title="Список"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
            />
          </svg>
        </button>
      </div>

      <!-- Количество на странице - контроль плотности -->
      <div class="per-page-selector">
        <label class="per-page-label">Показать:</label>
        <select
          v-model="selectedPerPage"
          class="per-page-select"
          @change="updatePerPage"
        >
          <option
            v-for="option in perPageOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>

    <!-- Активные фильтры - выбранные критерии -->
    <div v-if="appliedFilters.length > 0" class="active-filters-panel">
      <div class="active-filters-header">
        <span class="filters-title">Активные фильтры:</span>
        <button class="clear-all-btn" @click="clearAllFilters">
          Очистить все
        </button>
      </div>

      <div class="filter-tags">
        <div
          v-for="filter in appliedFilters"
          :key="filter.id"
          class="filter-tag"
        >
          <span class="filter-name">{{ filter.name }}:</span>
          <span class="filter-value">{{ filter.value }}</span>
          <button class="remove-filter-btn" @click="removeFilter(filter.id)">
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Входящие параметры - настройки сортировки
const props = defineProps({
  totalResults: {
    type: Number,
    default: 0,
  },
  activeFilters: {
    type: Number,
    default: 0,
  },
  appliedFilters: {
    type: Array,
    default: () => [],
  },
  defaultSort: {
    type: String,
    default: "popularity",
  },
  defaultView: {
    type: String,
    default: "grid",
  },
  defaultPerPage: {
    type: Number,
    default: 12,
  },
});

// Исходящие события - сигналы о сортировке
const emit = defineEmits([
  "sort-changed",
  "view-changed",
  "per-page-changed",
  "filter-removed",
  "filters-cleared",
]);

// Варианты сортировки - способы упорядочивания как в интернет-магазине
const sortOptions = [
  { value: "popularity", label: "По популярности" },
  { value: "price_asc", label: "По цене: сначала дешевые" },
  { value: "price_desc", label: "По цене: сначала дорогие" },
  { value: "name_asc", label: "По названию: А-Я" },
  { value: "name_desc", label: "По названию: Я-А" },
  { value: "rating", label: "По рейтингу" },
  { value: "discount", label: "По размеру скидки" },
];

// Варианты количества товаров на странице - плотность отображения
const perPageOptions = [12, 24, 48, 96];

// Локальные состояния - внутренняя память компонента
const selectedSort = ref(props.defaultSort);
const currentView = ref(props.defaultView);
const selectedPerPage = ref(props.defaultPerPage);

// Обработчик изменения сортировки - реакция на выбор способа упорядочивания
const updateSort = () => {
  emit("sort-changed", selectedSort.value);
};

// Обработчик изменения вида - переключение между сеткой и списком
const changeView = (newView) => {
  currentView.value = newView;
  emit("view-changed", newView);
};

// Обработчик изменения количества на странице - контроль плотности
const updatePerPage = () => {
  emit("per-page-changed", selectedPerPage.value);
};

// Удаление конкретного фильтра - точечная очистка
const removeFilter = (filterId) => {
  emit("filter-removed", filterId);
};

// Очистка всех фильтров - полный сброс
const clearAllFilters = () => {
  emit("filters-cleared");
};

// Отслеживание изменений входящих параметров
watch(
  () => props.defaultSort,
  (newValue) => {
    selectedSort.value = newValue;
  }
);

watch(
  () => props.defaultView,
  (newValue) => {
    currentView.value = newValue;
  }
);

watch(
  () => props.defaultPerPage,
  (newValue) => {
    selectedPerPage.value = newValue;
  }
);

// Функция получения текста для фильтров - склонение как в русском языке
const getFiltersText = (count) => {
  if (count === 1) return "фильтр";
  if (count >= 2 && count <= 4) return "фильтра";
  return "фильтров";
};
</script>

<style scoped>
/* Основной контейнер сортировки - командный центр */
.catalog-sort {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Панель сортировки - главная консоль */
.sort-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid #f1f2f6;
}

/* Информация о результатах - счетчик находок */
.results-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  font-size: 14px;
}

.results-count {
  font-weight: 500;
}

.results-count strong {
  color: #e91e63;
  font-weight: 700;
}

.active-filters {
  color: #7f8c8d;
  font-size: 12px;
}

/* Опции сортировки - меню упорядочивания */
.sort-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  white-space: nowrap;
}

.sort-select {
  padding: 8px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
}

.sort-select:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

/* Переключатель вида - режимы отображения */
.view-switcher {
  display: flex;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  overflow: hidden;
}

.view-btn {
  padding: 10px 12px;
  background: white;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.view-btn.active {
  background: #e91e63;
  color: white;
}

.view-btn:not(:last-child) {
  border-right: 1px solid #ecf0f1;
}

/* Селектор количества на странице - контроль плотности */
.per-page-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.per-page-label {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  white-space: nowrap;
}

.per-page-select {
  padding: 8px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.per-page-select:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

/* Панель активных фильтров - индикатор выбора */
.active-filters-panel {
  padding: 16px 24px;
  background: #f8f9fa;
}

.active-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.filters-title {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.clear-all-btn {
  background: none;
  border: 2px solid #e74c3c;
  color: #e74c3c;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-all-btn:hover {
  background: #e74c3c;
  color: white;
}

/* Теги фильтров - визуальные индикаторы */
.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-name {
  color: #7f8c8d;
  margin-right: 4px;
}

.filter-value {
  color: #2c3e50;
  font-weight: 500;
  margin-right: 8px;
}

.remove-filter-btn {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  transition: color 0.3s ease;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-filter-btn:hover {
  background: #e74c3c;
  color: white;
}

/* Адаптивность - приспособление к размерам экрана */
@media (max-width: 1024px) {
  .sort-panel {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .results-info {
    order: 1;
    justify-content: center;
  }

  .sort-options {
    order: 2;
    justify-content: center;
  }

  .view-switcher {
    order: 3;
    align-self: center;
  }

  .per-page-selector {
    order: 4;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .sort-panel {
    padding: 16px;
  }

  .active-filters-panel {
    padding: 12px 16px;
  }

  .sort-select,
  .per-page-select {
    min-width: 120px;
  }

  .filter-tags {
    gap: 6px;
  }

  .filter-tag {
    font-size: 11px;
    padding: 4px 8px;
  }
}

@media (max-width: 480px) {
  .sort-panel {
    gap: 8px;
  }

  .sort-options,
  .per-page-selector {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .sort-label,
  .per-page-label {
    font-size: 12px;
  }

  .view-btn {
    padding: 8px 10px;
  }

  .active-filters-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .clear-all-btn {
    align-self: center;
  }
}

/* Анимации для плавности - хореография интерфейса */
.filter-tag {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Эффект для кнопки очистки - привлечение внимания */
.clear-all-btn {
  position: relative;
  overflow: hidden;
}

.clear-all-btn::before {
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
  transition: left 0.5s;
}

.clear-all-btn:hover::before {
  left: 100%;
}
</style>
