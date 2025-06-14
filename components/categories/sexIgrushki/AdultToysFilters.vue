<template>
  <!-- Семантический aside для фильтров с сохранением всех CSS классов -->
  <aside
    class="filters-container"
    role="complementary"
    aria-label="Фильтры товаров"
  >
    <!-- Skeleton при загрузке -->
    <div
      v-if="isLoading"
      class="pink-rabbit-filters-skeleton"
      aria-hidden="true"
    >
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

    <!-- Основной контент как form для семантики фильтрации -->
    <form
      v-else
      @submit.prevent="applyFilters"
      role="search"
      aria-label="Форма фильтрации товаров"
    >
      <!-- Заголовок фильтров как header -->
      <header class="filters-header">
        <div class="header-main">
          <h2 class="filter-main-title" id="filters-heading">
            <FunnelIcon class="w-5 h-5 text-pink-500" aria-hidden="true" />
            Фильтры товаров
          </h2>
          <div
            class="filters-counter"
            v-if="hasActiveFilters"
            role="status"
            aria-live="polite"
          >
            <span
              class="counter-badge"
              :aria-label="`Активных фильтров: ${activeFiltersCount}`"
              >{{ activeFiltersCount }}</span
            >
          </div>
        </div>
        <nav
          class="header-controls"
          role="navigation"
          aria-label="Управление фильтрами"
        >
          <button
            @click="toggleAllAccordions"
            class="control-btn control-btn-secondary"
            type="button"
            :aria-label="
              allAccordionsOpen
                ? 'Свернуть все разделы'
                : 'Развернуть все разделы'
            "
            :aria-expanded="allAccordionsOpen"
          >
            <ChevronDownIcon
              class="w-4 h-4 transition-transform duration-300"
              :class="{ 'rotate-180': allAccordionsOpen }"
              aria-hidden="true"
            />
          </button>
          <button
            v-if="hasActiveFilters"
            @click="resetAllFilters"
            class="control-btn control-btn-danger"
            type="button"
            aria-label="Сбросить все фильтры"
          >
            <TrashIcon class="w-4 h-4" aria-hidden="true" />
          </button>
        </nav>
      </header>

      <!-- Область фильтров как main -->
      <main class="filters-content" aria-labelledby="filters-heading">
        <!-- Фильтр по полу как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по полу</legend>
          <button
            @click="toggleAccordion('gender')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.gender"
            aria-controls="gender-filter-content"
            :aria-label="
              accordionState.gender
                ? 'Свернуть фильтр по полу'
                : 'Развернуть фильтр по полу'
            "
          >
            <h3 class="filter-title">
              <UserGroupIcon class="filter-icon" aria-hidden="true" />
              Пол
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.gender }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.gender"
            class="filter-body"
            id="gender-filter-content"
            role="region"
            aria-labelledby="gender-filter-title"
          >
            <div
              class="options-list"
              role="group"
              aria-labelledby="gender-filter-title"
            >
              <label
                v-for="gender in genders"
                :key="gender.id"
                class="checkbox-option gender-option"
                :for="`gender-${gender.id}`"
              >
                <input
                  :id="`gender-${gender.id}`"
                  v-model="filters.selectedGenders"
                  :value="gender.id"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`gender-${gender.id}-count`"
                />
                <span class="option-label">{{ gender.name }}</span>
                <span class="option-count" :id="`gender-${gender.id}-count`"
                  >({{ gender.count }})</span
                >
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по цене как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по цене</legend>
          <button
            @click="toggleAccordion('price')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.price"
            aria-controls="price-filter-content"
            :aria-label="
              accordionState.price
                ? 'Свернуть фильтр по цене'
                : 'Развернуть фильтр по цене'
            "
          >
            <h3 class="filter-title">
              <CurrencyDollarIcon class="filter-icon" aria-hidden="true" />
              Цена
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.price }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.price"
            class="filter-body"
            id="price-filter-content"
            role="region"
            aria-labelledby="price-filter-title"
          >
            <!-- Профессиональный слайдер для диапазона цен -->
            <PriceRangeSlider
              v-model="priceRange"
              :min="0"
              :max="250000"
              :step="100"
              @change="onPriceRangeChange"
              aria-label="Диапазон цен от 0 до 250000 рублей"
            />
          </div>
        </fieldset>

        <!-- Фильтр по бренду как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по бренду</legend>
          <button
            @click="toggleAccordion('brand')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.brand"
            aria-controls="brand-filter-content"
            :aria-label="
              accordionState.brand
                ? 'Свернуть фильтр по бренду'
                : 'Развернуть фильтр по бренду'
            "
          >
            <h3 class="filter-title" id="brand-filter-title">
              <TagIcon class="filter-icon" aria-hidden="true" />
              Бренд
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.brand }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.brand"
            class="filter-body"
            id="brand-filter-content"
            role="region"
            aria-labelledby="brand-filter-title"
          >
            <div class="search-wrapper">
              <label for="brand-search" class="sr-only">Поиск бренда</label>
              <input
                id="brand-search"
                v-model="brandSearch"
                type="text"
                placeholder="Поиск бренда..."
                class="search-input"
                aria-describedby="brand-search-help"
                role="searchbox"
              />
              <div id="brand-search-help" class="sr-only">
                Введите название бренда для поиска в списке
              </div>
            </div>
            <div
              class="options-list"
              role="group"
              aria-labelledby="brand-filter-title"
            >
              <div
                v-if="filteredBrands.length === 0 && brandSearch.trim()"
                class="empty-search-result"
                role="status"
                aria-live="polite"
              >
                <div class="empty-icon" aria-hidden="true">🔍</div>
                <p class="empty-text">Бренды не найдены</p>
                <p class="empty-hint">Попробуйте изменить поисковый запрос</p>
              </div>
              <label
                v-for="brand in filteredBrands"
                :key="brand.id"
                class="checkbox-option"
                :for="`brand-${brand.id}`"
              >
                <input
                  :id="`brand-${brand.id}`"
                  v-model="filters.selectedBrands"
                  :value="brand.id"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`brand-${brand.id}-count`"
                />
                <span class="option-label">{{ brand.name }}</span>
                <span class="option-count" :id="`brand-${brand.id}-count`"
                  >({{ brand.count }})</span
                >
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по материалу как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по материалу</legend>
          <button
            @click="toggleAccordion('material')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.material"
            aria-controls="material-filter-content"
            :aria-label="
              accordionState.material
                ? 'Свернуть фильтр по материалу'
                : 'Развернуть фильтр по материалу'
            "
          >
            <h3 class="filter-title" id="material-filter-title">
              <CubeIcon class="filter-icon" aria-hidden="true" />
              Материал
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.material }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.material"
            class="filter-body"
            id="material-filter-content"
            role="region"
            aria-labelledby="material-filter-title"
          >
            <div
              class="options-list"
              role="group"
              aria-labelledby="material-filter-title"
            >
              <label
                v-for="material in materials"
                :key="material.id"
                class="checkbox-option"
                :for="`material-${material.id}`"
              >
                <input
                  :id="`material-${material.id}`"
                  v-model="filters.selectedMaterials"
                  :value="material.id"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`material-${material.id}-count`"
                />
                <span class="option-label">{{ material.name }}</span>
                <span class="option-count" :id="`material-${material.id}-count`"
                  >({{ material.count }})</span
                >
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по цвету как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по цвету</legend>
          <button
            @click="toggleAccordion('color')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.color"
            aria-controls="color-filter-content"
            :aria-label="
              accordionState.color
                ? 'Свернуть фильтр по цвету'
                : 'Развернуть фильтр по цвету'
            "
          >
            <h3 class="filter-title" id="color-filter-title">
              <SwatchIcon class="filter-icon" aria-hidden="true" />
              Цвет
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.color }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.color"
            class="filter-body"
            id="color-filter-content"
            role="region"
            aria-labelledby="color-filter-title"
          >
            <div
              class="color-grid"
              role="group"
              aria-labelledby="color-filter-title"
            >
              <button
                v-for="color in colors"
                :key="color.id"
                type="button"
                class="color-option"
                :class="{ active: filters.selectedColors.includes(color.id) }"
                @click="toggleColor(color.id)"
                :aria-label="`${
                  filters.selectedColors.includes(color.id)
                    ? 'Убрать'
                    : 'Выбрать'
                } цвет ${color.name}`"
                :aria-pressed="filters.selectedColors.includes(color.id)"
                :style="{ backgroundColor: color.value }"
                :aria-describedby="`color-${color.id}-name`"
              >
                <CheckIcon
                  v-if="filters.selectedColors.includes(color.id)"
                  class="color-check"
                  aria-hidden="true"
                />
                <span class="sr-only" :id="`color-${color.id}-name`">{{
                  color.name
                }}</span>
              </button>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по длине как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по длине</legend>
          <button
            @click="toggleAccordion('length')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.length"
            aria-controls="length-filter-content"
            :aria-label="
              accordionState.length
                ? 'Свернуть фильтр по длине'
                : 'Развернуть фильтр по длине'
            "
          >
            <h3 class="filter-title" id="length-filter-title">
              <ArrowsPointingOutIcon class="filter-icon" aria-hidden="true" />
              Длина, см
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.length }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.length"
            class="filter-body"
            id="length-filter-content"
            role="region"
            aria-labelledby="length-filter-title"
          >
            <div
              class="options-list"
              role="group"
              aria-labelledby="length-filter-title"
            >
              <label
                v-for="length in lengths"
                :key="length.value"
                class="checkbox-option"
                :for="`length-${length.value}`"
              >
                <input
                  :id="`length-${length.value}`"
                  v-model="filters.selectedLengths"
                  :value="length.value"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`length-${length.value}-count`"
                />
                <span class="option-label">{{ length.label }}</span>
                <span class="option-count" :id="`length-${length.value}-count`"
                  >({{ length.count }})</span
                >
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по диаметру как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по диаметру</legend>
          <button
            @click="toggleAccordion('diameter')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.diameter"
            aria-controls="diameter-filter-content"
            :aria-label="
              accordionState.diameter
                ? 'Свернуть фильтр по диаметру'
                : 'Развернуть фильтр по диаметру'
            "
          >
            <h3 class="filter-title" id="diameter-filter-title">
              <ArrowsRightLeftIcon class="filter-icon" aria-hidden="true" />
              Диаметр, см
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.diameter }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.diameter"
            class="filter-body"
            id="diameter-filter-content"
            role="region"
            aria-labelledby="diameter-filter-title"
          >
            <div
              class="options-list"
              role="group"
              aria-labelledby="diameter-filter-title"
            >
              <label
                v-for="diameter in diameters"
                :key="diameter.value"
                class="checkbox-option"
                :for="`diameter-${diameter.value}`"
              >
                <input
                  :id="`diameter-${diameter.value}`"
                  v-model="filters.selectedDiameters"
                  :value="diameter.value"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`diameter-${diameter.value}-count`"
                />
                <span class="option-label">{{ diameter.label }}</span>
                <span
                  class="option-count"
                  :id="`diameter-${diameter.value}-count`"
                  >({{ diameter.count }})</span
                >
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по количеству режимов вибрации как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по количеству режимов вибрации</legend>
          <button
            @click="toggleAccordion('vibrationModes')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.vibrationModes"
            aria-controls="vibration-filter-content"
            :aria-label="
              accordionState.vibrationModes
                ? 'Свернуть фильтр по количеству режимов вибрации'
                : 'Развернуть фильтр по количеству режимов вибрации'
            "
          >
            <h3 class="filter-title" id="vibration-filter-title">
              <WaveIcon class="filter-icon" aria-hidden="true" />
              Количество режимов вибрации
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.vibrationModes }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.vibrationModes"
            class="filter-body"
            id="vibration-filter-content"
            role="region"
            aria-labelledby="vibration-filter-title"
          >
            <div
              class="options-list"
              role="group"
              aria-labelledby="vibration-filter-title"
            >
              <label
                v-for="mode in vibrationModes"
                :key="mode.value"
                class="checkbox-option"
                :for="`vibration-${mode.value}`"
              >
                <input
                  :id="`vibration-${mode.value}`"
                  v-model="filters.selectedVibrationModes"
                  :value="mode.value"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`vibration-${mode.value}-count`"
                />
                <span class="option-label">{{ mode.label }}</span>
                <span class="option-count" :id="`vibration-${mode.value}-count`"
                  >({{ mode.count }})</span
                >
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по водонепроницаемости как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по водонепроницаемости</legend>
          <button
            @click="toggleAccordion('waterproof')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.waterproof"
            aria-controls="waterproof-filter-content"
            :aria-label="
              accordionState.waterproof
                ? 'Свернуть фильтр по водонепроницаемости'
                : 'Развернуть фильтр по водонепроницаемости'
            "
          >
            <h3 class="filter-title" id="waterproof-filter-title">
              <BeakerIcon class="filter-icon" aria-hidden="true" />
              Водонепроницаемость
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.waterproof }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.waterproof"
            class="filter-body"
            id="waterproof-filter-content"
            role="region"
            aria-labelledby="waterproof-filter-title"
          >
            <div
              class="options-list"
              role="group"
              aria-labelledby="waterproof-filter-title"
            >
              <label
                v-for="level in waterproofLevels"
                :key="level.value"
                class="checkbox-option"
                :for="`waterproof-${level.value}`"
              >
                <input
                  :id="`waterproof-${level.value}`"
                  v-model="filters.selectedWaterproofLevels"
                  :value="level.value"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`waterproof-${level.value}-count`"
                />
                <span class="option-label">{{ level.label }}</span>
                <span
                  class="option-count"
                  :id="`waterproof-${level.value}-count`"
                  >({{ level.count }})</span
                >
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по функции нагрева как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по функции нагрева</legend>
          <button
            @click="toggleAccordion('heating')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.heating"
            aria-controls="heating-filter-content"
            :aria-label="
              accordionState.heating
                ? 'Свернуть фильтр по функции нагрева'
                : 'Развернуть фильтр по функции нагрева'
            "
          >
            <h3 class="filter-title" id="heating-filter-title">
              <FireIcon class="filter-icon" aria-hidden="true" />
              Функция нагрева
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.heating }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.heating"
            class="filter-body"
            id="heating-filter-content"
            role="region"
            aria-labelledby="heating-filter-title"
          >
            <div class="toggle-options">
              <label class="toggle-option">
                <input
                  v-model="filters.hasHeating"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`heating-count`"
                />
                <span class="option-label">Есть функция нагрева</span>
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по количеству моторов как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по количеству моторов</legend>
          <button
            @click="toggleAccordion('motors')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.motors"
            aria-controls="motors-filter-content"
            :aria-label="
              accordionState.motors
                ? 'Свернуть фильтр по количеству моторов'
                : 'Развернуть фильтр по количеству моторов'
            "
          >
            <h3 class="filter-title" id="motors-filter-title">
              <CogIcon class="filter-icon" aria-hidden="true" />
              Количество моторов
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.motors }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.motors"
            class="filter-body"
            id="motors-filter-content"
            role="region"
            aria-labelledby="motors-filter-title"
          >
            <div
              class="options-list"
              role="group"
              aria-labelledby="motors-filter-title"
            >
              <label
                v-for="count in motorCounts"
                :key="count.value"
                class="checkbox-option"
                :for="`motor-${count.value}`"
              >
                <input
                  :id="`motor-${count.value}`"
                  v-model="filters.selectedMotorCounts"
                  :value="count.value"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`motor-${count.value}-count`"
                />
                <span class="option-label">{{ count.label }}</span>
                <span class="option-count" :id="`motor-${count.value}-count`"
                  >({{ count.count }})</span
                >
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр по аромату как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр по аромату</legend>
          <button
            @click="toggleAccordion('aroma')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.aroma"
            aria-controls="aroma-filter-content"
            :aria-label="
              accordionState.aroma
                ? 'Свернуть фильтр по аромату'
                : 'Развернуть фильтр по аромату'
            "
          >
            <h3 class="filter-title" id="aroma-filter-title">
              <SparklesIcon class="filter-icon" aria-hidden="true" />
              Аромат
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.aroma }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.aroma"
            class="filter-body"
            id="aroma-filter-content"
            role="region"
            aria-labelledby="aroma-filter-title"
          >
            <div
              class="options-list"
              role="group"
              aria-labelledby="aroma-filter-title"
            >
              <label
                v-for="aroma in aromas"
                :key="aroma.id"
                class="checkbox-option"
                :for="`aroma-${aroma.id}`"
              >
                <input
                  :id="`aroma-${aroma.id}`"
                  v-model="filters.selectedAromas"
                  :value="aroma.id"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`aroma-${aroma.id}-count`"
                />
                <span class="option-label">{{ aroma.name }}</span>
                <span class="option-count" :id="`aroma-${aroma.id}-count`"
                  >({{ aroma.count }})</span
                >
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Фильтр съедобный как fieldset -->
        <fieldset class="filter-section">
          <legend class="sr-only">Фильтр съедобный</legend>
          <button
            @click="toggleAccordion('edible')"
            class="filter-header"
            type="button"
            :aria-expanded="accordionState.edible"
            aria-controls="edible-filter-content"
            :aria-label="
              accordionState.edible
                ? 'Свернуть фильтр съедобный'
                : 'Развернуть фильтр съедобный'
            "
          >
            <h3 class="filter-title" id="edible-filter-title">
              <HeartIcon class="filter-icon" aria-hidden="true" />
              Съедобный
            </h3>
            <ChevronDownIcon
              class="accordion-arrow"
              :class="{ 'rotate-180': accordionState.edible }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="accordionState.edible"
            class="filter-body"
            id="edible-filter-content"
            role="region"
            aria-labelledby="edible-filter-title"
          >
            <div class="toggle-options">
              <label class="toggle-option">
                <input
                  v-model="filters.isEdible"
                  type="checkbox"
                  class="option-checkbox"
                  :aria-describedby="`edible-count`"
                />
                <span class="option-label">Съедобный продукт</span>
              </label>
            </div>
          </div>
        </fieldset>
      </main>

      <!-- Кнопки действий как footer -->
      <footer class="filter-actions" role="contentinfo">
        <button
          @click="applyFilters"
          type="submit"
          class="action-btn action-btn-primary"
          :disabled="!hasChanges"
          :class="{ 'btn-disabled': !hasChanges }"
          :aria-label="`Применить фильтры${
            activeFiltersCount > 0
              ? ' (' + activeFiltersCount + ' активных)'
              : ''
          }`"
        >
          <div class="btn-content">
            <div class="btn-main">
              <MagnifyingGlassIcon class="btn-icon" aria-hidden="true" />
            </div>
            <span
              v-if="activeFiltersCount > 0"
              class="btn-badge"
              aria-hidden="true"
            >
              {{ formatBadgeCount(activeFiltersCount) }}
            </span>
          </div>
        </button>
        <button
          v-if="hasActiveFilters"
          @click="resetAllFilters"
          type="button"
          class="action-btn action-btn-secondary"
          aria-label="Сбросить все фильтры"
        >
          <TrashIcon class="btn-icon" aria-hidden="true" />
        </button>
      </footer>
    </form>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useHead } from "#app";
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
  UserGroupIcon,
} from "@heroicons/vue/24/solid";
import PriceRangeSlider from "@/components/categories/sexIgrushki/PriceRangeSlider.vue";

// SEO: Добавляем Schema.org разметку для структурированных данных
// Это как паспорт для поисковых систем - рассказываем что у нас есть фильтры для интернет-магазина
useHead({
  title: "Фильтры товаров - Pink Rabbit",
  meta: [
    // Основные SEO метатеги
    {
      name: "description",
      content:
        "Умная система фильтров для поиска интимных товаров по цене, бренду, материалу, цвету и размеру. Более 500 товаров премиум качества.",
    },
    {
      name: "keywords",
      content:
        "фильтры товаров, поиск интимных товаров, вибраторы по цене, бренды LELO Lovense, силиконовые игрушки",
    },
    // Open Graph для социальных сетей (как визитка магазина в соцсетях)
    {
      property: "og:title",
      content: "Система фильтров интимных товаров - Pink Rabbit",
    },
    {
      property: "og:description",
      content:
        "Найдите идеальный товар с помощью умных фильтров: цена, бренд, материал, размер. Премиум качество и быстрая доставка.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://pink-rabbit.ru/catalog",
    },
    {
      property: "og:image",
      content: "https://pink-rabbit.ru/images/filters-preview.jpg",
    },
    // Twitter Card для Twitter (как превью в твиттере)
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "Фильтры интимных товаров - Pink Rabbit",
    },
    {
      name: "twitter:description",
      content: "Умная система поиска и фильтрации товаров для взрослых",
    },
    // Дополнительные метатеги для поисковых систем
    {
      name: "robots",
      content: "index, follow, max-image-preview:large",
    },
    {
      name: "googlebot",
      content: "index, follow",
    },
    // Языковые метатеги
    {
      httpEquiv: "content-language",
      content: "ru-RU",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Pink Rabbit - Интернет-магазин интимных товаров",
        url: "https://pink-rabbit.ru",
        description:
          "Премиальные товары для взрослых с системой умных фильтров",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://pink-rabbit.ru/catalog?q={search_term_string}&price_min={price_min}&price_max={price_max}&brand={brand}&material={material}&color={color}",
            actionPlatform: [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform",
            ],
          },
          "query-input": [
            "name=search_term_string",
            "name=price_min",
            "name=price_max",
            "name=brand",
            "name=material",
            "name=color",
          ],
        },
        // Описываем доступные фильтры как свойства товаров
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "RUB",
          lowPrice: "500",
          highPrice: "250000",
          offerCount: "500+",
          availability: "https://schema.org/InStock",
        },
        // Категории товаров для фильтрации
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Бренды",
            value: [
              "LELO",
              "We-Vibe",
              "Satisfyer",
              "Womanizer",
              "Lovense",
              "Fun Factory",
              "Tenga",
              "Doc Johnson",
              "Lapin Rose",
              "Svakom",
              "PinkRabbit",
              "FleshLight",
              "Swiss Navy",
              "Juicy Toyz",
              "PJUR",
              "California Exotic Novelties",
              "NS Novelties",
              "Erolanta",
              "Розовый Кролик",
              "Штучки-Дрючки",
              "Shots Media",
              "Seven Creations",
              "Shunga",
              "System Jo",
              "LOVETOY",
              "Evolved",
              "Bathmate",
              "Bijoux Indiscrets",
              "Adrien Lastic",
              "HOT Production",
            ],
            description: "Популярные и премиальные бренды интимных товаров",
          },
          {
            "@type": "PropertyValue",
            name: "Материалы",
            value: [
              "Медицинский силикон",
              "Боросиликатное стекло",
              "ABS пластик",
              "Металл",
            ],
            description: "Безопасные материалы для интимных товаров",
          },
          {
            "@type": "PropertyValue",
            name: "Цвета",
            value: [
              "Розовый",
              "Фиолетовый",
              "Черный",
              "Белый",
              "Красный",
              "Синий",
            ],
            description: "Доступные цвета товаров",
          },
          {
            "@type": "PropertyValue",
            name: "Размеры",
            value: [
              "S (до 12 см)",
              "M (12-18 см)",
              "L (18-25 см)",
              "XL (25+ см)",
            ],
            description: "Размерная линейка товаров",
          },
          {
            "@type": "PropertyValue",
            name: "Функции",
            value: [
              "Вибрация",
              "Пульсация",
              "Вращение",
              "Нагрев",
              "Приложение",
            ],
            description: "Доступные функции и возможности",
          },
        ],
        // SEO теги для лучшего понимания контента
        keywords:
          "интимные товары, вибраторы, фильтры товаров, интернет магазин, взрослые товары",
        inLanguage: "ru-RU",
        author: {
          "@type": "Organization",
          name: "Pink Rabbit",
        },
      }),
    },
    // Дополнительная разметка для каталога товаров как коллекции
    // Это как каталог в библиотеке - описываем что у нас есть организованная коллекция товаров
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Каталог интимных товаров с фильтрами",
        description:
          "Структурированный каталог товаров для взрослых с возможностью фильтрации по различным параметрам",
        url: "https://pink-rabbit.ru/catalog",
        mainEntity: {
          "@type": "ItemList",
          name: "Фильтруемый список товаров",
          description:
            "Интерактивная система фильтров для поиска подходящих товаров",
          numberOfItems: "500+",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Фильтр по цене",
              description: "Диапазон цен от 500 до 250000 рублей",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Фильтр по брендам",
              description: "Выбор из премиальных брендов интимных товаров",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Фильтр по материалам",
              description: "Безопасные материалы: силикон, стекло, металл",
            },
            {
              "@type": "ListItem",
              position: 4,
              name: "Фильтр по цветам",
              description: "Широкая цветовая палитра товаров",
            },
            {
              "@type": "ListItem",
              position: 5,
              name: "Фильтр по размерам",
              description: "Различные размеры для комфортного использования",
            },
          ],
        },
        breadcrumb: {
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
              name: "Каталог",
              item: "https://pink-rabbit.ru/catalog",
            },
          ],
        },
        publisher: {
          "@type": "Organization",
          name: "Pink Rabbit",
          url: "https://pink-rabbit.ru",
        },
      }),
    },
  ],
});

// Псевдо-икона для волн (заменить на реальную если нужно)
const WaveIcon = CogIcon;

// Состояние загрузки
const isLoading = ref(true);

// Состояние фильтров
const filters = ref({
  selectedGenders: [], // Новый фильтр по полу: для мужчин, для женщин, для двоих
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
  gender: false, // Новый фильтр по полу - закрыт по умолчанию
  price: false, // Закрыт по умолчанию
  brand: false, // Закрыт по умолчанию
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
  // Премиальные и популярные бренды
  { id: 1, name: "LELO", count: 45 },
  { id: 2, name: "We-Vibe", count: 32 },
  { id: 3, name: "Satisfyer", count: 28 },
  { id: 4, name: "Womanizer", count: 25 },
  { id: 5, name: "Fun Factory", count: 22 },
  { id: 6, name: "Tenga", count: 18 },
  { id: 7, name: "Lovense", count: 15 },
  { id: 8, name: "Doc Johnson", count: 35 },
  { id: 9, name: "Pipedream", count: 19 },
  { id: 10, name: "Lapin Rose", count: 27 },
  { id: 11, name: "Svakom", count: 31 },
  { id: 12, name: "PinkRabbit", count: 38 },
  { id: 13, name: "Juicy Toyz", count: 24 },
  { id: 14, name: "YES-for-LOV", count: 19 },
  { id: 15, name: "Shots Media", count: 33 },
  { id: 16, name: "Adrien Lastic", count: 21 },
  { id: 17, name: "HOT Production", count: 17 },
  { id: 18, name: "Le Frivole", count: 14 },
  { id: 19, name: "Swiss Navy", count: 26 },
  { id: 20, name: "Подиум", count: 12 },
  { id: 21, name: "Arno", count: 16 },
  { id: 22, name: "Bathmate", count: 23 },
  { id: 23, name: "Bijoux Indiscrets", count: 18 },
  { id: 24, name: "Duracell", count: 8 },
  { id: 25, name: "Erolanta", count: 29 },
  { id: 26, name: "Evolved", count: 22 },
  { id: 27, name: "Femuntimate", count: 15 },
  { id: 28, name: "FleshLight", count: 34 },
  { id: 29, name: "Gvibe", count: 20 },
  { id: 30, name: "Hitachi", count: 11 },
  { id: 31, name: "Kiiroo", count: 13 },
  { id: 32, name: "Kokos", count: 9 },
  { id: 33, name: "Levett", count: 7 },
  { id: 34, name: "LOVETOY", count: 25 },
  { id: 35, name: "Luxe", count: 16 },
  { id: 36, name: "Male Edge", count: 10 },
  { id: 37, name: "Maxus", count: 14 },
  { id: 38, name: "Minna Life", count: 8 },
  { id: 39, name: "Mystim", count: 12 },
  { id: 40, name: "Nalone", count: 18 },
  { id: 41, name: "NMC", count: 21 },
  { id: 42, name: "Noire Fontaine", count: 9 },
  { id: 43, name: "NS Novelties", count: 32 },
  { id: 44, name: "OTouch", count: 15 },
  { id: 45, name: "OVO", count: 17 },
  { id: 46, name: "Passion Belts", count: 6 },
  { id: 47, name: "PJUR", count: 28 },
  { id: 48, name: "Real Doll", count: 5 },
  { id: 49, name: "Roomfun", count: 11 },
  { id: 50, name: "Runyu", count: 13 },
  { id: 51, name: "Seven Creations", count: 24 },
  { id: 52, name: "Sexus", count: 19 },
  { id: 53, name: "Shunga", count: 22 },
  { id: 54, name: "Sitabella", count: 16 },
  { id: 55, name: "Soma", count: 8 },
  { id: 56, name: "System Jo", count: 20 },
  { id: 57, name: "Toyafa", count: 12 },
  { id: 58, name: "Unilatex", count: 18 },
  { id: 59, name: "UPKO", count: 7 },
  { id: 60, name: "Viamax", count: 10 },
  { id: 61, name: "Биоритм", count: 15 },
  { id: 62, name: "Индиго", count: 23 },
  { id: 63, name: "ФлешНаш", count: 14 },
  { id: 64, name: "Фужуйши", count: 9 },
  { id: 65, name: "A-LOVING", count: 11 },
  { id: 66, name: "ABS Holding", count: 6 },
  { id: 67, name: "AIBU", count: 8 },
  { id: 68, name: "aixiASIA", count: 12 },
  { id: 69, name: "Amor El", count: 7 },
  { id: 70, name: "Amovibe", count: 10 },
  { id: 71, name: "ARCWAVE", count: 9 },
  { id: 72, name: "California Exotic Novelties", count: 35 },
  { id: 73, name: "Cosmo Orgasm", count: 16 },
  { id: 74, name: "Crazy Bull", count: 13 },
  { id: 75, name: "DICKENSON", count: 8 },
  { id: 76, name: "Diva", count: 15 },
  { id: 77, name: "Dжага Dжага", count: 11 },
  { id: 78, name: "EDC", count: 19 },
  { id: 79, name: "EDC Wholesale", count: 14 },
  { id: 80, name: "Elasun", count: 12 },
  { id: 81, name: "Eromantica", count: 17 },
  { id: 82, name: "Erotic Hard", count: 10 },
  { id: 83, name: "Erotist", count: 9 },
  { id: 84, name: "Erozon", count: 13 },
  { id: 85, name: "Fairyland", count: 18 },
  { id: 86, name: "Hot Flowers", count: 7 },
  { id: 87, name: "IDEA", count: 11 },
  { id: 88, name: "Insight", count: 6 },
  { id: 89, name: "Jazzer", count: 8 },
  { id: 90, name: "Jes Extender", count: 5 },
  { id: 91, name: "Jimmy Jane", count: 14 },
  { id: 92, name: "JOS", count: 9 },
  { id: 93, name: "Juicytoyz", count: 16 },
  { id: 94, name: "Kanikule", count: 7 },
  { id: 95, name: "Kanun", count: 6 },
  { id: 96, name: "L`eroina", count: 10 },
  { id: 97, name: "Let it G", count: 12 },
  { id: 98, name: "Lil`Vibe", count: 8 },
  { id: 99, name: "Love To Love", count: 15 },
  { id: 100, name: "Magic Eyes", count: 13 },
  { id: 101, name: "Magic Motion", count: 11 },
  { id: 102, name: "Me You Us", count: 9 },
  { id: 103, name: "MensMax", count: 7 },
  { id: 104, name: "monsense", count: 6 },
  { id: 105, name: "Oivita", count: 8 },
  { id: 106, name: "ONE-DC", count: 5 },
  { id: 107, name: "Pecado", count: 10 },
  { id: 108, name: "Petits Joujoux", count: 12 },
  { id: 109, name: "PharmQuests", count: 7 },
  { id: 110, name: "Play Hard", count: 9 },
  { id: 111, name: "PMV20", count: 6 },
  { id: 112, name: "PPP", count: 8 },
  { id: 113, name: "Prime Products", count: 11 },
  { id: 114, name: "Qvibry", count: 7 },
  { id: 115, name: "Real", count: 14 },
  { id: 116, name: "RealStick", count: 9 },
  { id: 117, name: "Romp", count: 12 },
  { id: 118, name: "RUF", count: 8 },
  { id: 119, name: "Secret Play", count: 13 },
  { id: 120, name: "Sense Max", count: 10 },
  { id: 121, name: "Sex Expert", count: 15 },
  { id: 122, name: "Sexus Glass", count: 6 },
  { id: 123, name: "Shots Toys", count: 18 },
  { id: 124, name: "Strap-on-me", count: 11 },
  { id: 125, name: "SVibe", count: 9 },
  { id: 126, name: "TIME HEAT", count: 7 },
  { id: 127, name: "Unihorn", count: 8 },
  { id: 128, name: "Waname", count: 6 },
  { id: 129, name: "Xise", count: 10 },
  { id: 130, name: "Yovee", count: 12 },
  { id: 131, name: "Zumio", count: 8 },
  { id: 132, name: "Eska", count: 9 },
  { id: 133, name: "Браззерс", count: 16 },
  { id: 134, name: "Виноградов", count: 11 },
  { id: 135, name: "Золотая устрица", count: 7 },
  { id: 136, name: "Лунный свет", count: 13 },
  { id: 137, name: "Ночная бабочка", count: 10 },
  { id: 138, name: "Розовый Кролик", count: 25 },
  { id: 139, name: "Сама Лэнд", count: 19 },
  { id: 140, name: "Штучки-Дрючки", count: 22 },
]);

// Данные для фильтра по полу (целевая аудитория)
const genders = ref([
  {
    id: "men",
    name: "Для мужчин",
    count: 45,
    description: "Товары, предназначенные специально для мужчин",
  },
  {
    id: "women",
    name: "Для женщин",
    count: 67,
    description: "Товары, предназначенные специально для женщин",
  },
  {
    id: "couples",
    name: "Для двоих",
    count: 38,
    description: "Товары для совместного использования парами",
  },
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
  { value: "1", label: "1 режим", count: 23 },
  { value: "2", label: "2 режима", count: 31 },
  { value: "3", label: "3 режима", count: 45 },
  { value: "4", label: "4 режима", count: 38 },
  { value: "5", label: "5 режимов", count: 52 },
  { value: "6", label: "6 режимов", count: 29 },
  { value: "7", label: "7 режимов", count: 41 },
  { value: "8", label: "8 режимов", count: 26 },
  { value: "9", label: "9 режимов", count: 33 },
  { value: "10", label: "10 режимов", count: 37 },
  { value: "11", label: "11 режимов", count: 18 },
  { value: "12", label: "12 режимов", count: 24 },
  { value: "13", label: "13 режимов", count: 15 },
  { value: "14", label: "14 режимов", count: 12 },
  { value: "15", label: "15 режимов", count: 19 },
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
    filters.value.selectedGenders.length > 0 ||
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
  if (filters.value.selectedGenders.length > 0) count++;
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
    selectedGenders: [], // Новый фильтр по полу: для мужчин, для женщин, для двоих
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
  () => filters.value.selectedGenders,
  () => {
    console.log("🔄 Изменён фильтр по полу:", filters.value.selectedGenders);
    autoApplyFilters();
  },
  { deep: true }
);

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

/* Контент фильтров с оптимизированным скролом */
.filters-content {
  @apply p-4 space-y-3;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* 📏 Правильная высота только с учетом хлебных крошек */
  max-height: calc(
    100vh - 160px
  ); /* Хлебные крошки (60px) + заголовок фильтров (60px) + отступы (40px) */

  /* 🎨 Элегантный скрол */
  scrollbar-width: thin;
  scrollbar-color: rgba(236, 72, 153, 0.4) transparent;
  scroll-behavior: smooth;

  /* 📐 Оптимизированные отступы */
  padding-right: 16px;
  margin-right: 2px;
}

/* Улучшенный webkit скрол для основного контейнера */
.filters-content::-webkit-scrollbar {
  width: 5px;
  background: transparent;
  opacity: 0.8;
  transition: opacity 0.3s ease, width 0.2s ease;
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
.filters-content:hover::-webkit-scrollbar {
  opacity: 1;
}

.filters-content:hover::-webkit-scrollbar-thumb {
  opacity: 1;
  background: linear-gradient(
    180deg,
    rgba(236, 72, 153, 0.6),
    rgba(236, 72, 153, 0.4)
  );
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
  /* Сбрасываем стандартные стили fieldset */
  margin: 0;
  padding: 0;
  border: 1px solid #f3f4f6;
  min-width: 0;
  /* Убираем стандартные отступы fieldset */
  -webkit-margin-start: 0;
  -webkit-margin-end: 0;
  -webkit-padding-start: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
  padding-block-start: 0;
  padding-block-end: 0;
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
  /* Сбрасываем стили кнопки */
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  text-align: left;
  outline: none;
  margin: 0;
  padding: 12px;
  /* Убираем стандартные стили кнопки */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.filter-title {
  @apply text-sm font-medium text-gray-700 flex items-center gap-2;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.01em;
  /* Сбрасываем все стандартные отступы браузера для h3 */
  margin: 0;
  padding: 0;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  line-height: 1.2;
  /* Убираем стандартные стили заголовков */
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  -webkit-margin-start: 0;
  -webkit-margin-end: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
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
  padding: 16px 20px 20px 20px; /* Добавляем комфортные отступы со всех сторон */
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

/* Специальный стиль для price фильтра с дополнительным отступом снизу */
#price-filter-content {
  padding-bottom: 24px; /* Дополнительный отступ снизу для слайдера цены */
}

/* Класс для скрытия элементов от визуального отображения, но доступных для screen readers */
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

/* Фокус для интерактивных элементов - улучшенная видимость для клавиатурной навигации */
.filter-header:focus,
.action-btn:focus,
.option-checkbox:focus,
.search-input:focus,
.color-option:focus {
  outline: 2px solid rgba(236, 72, 153, 0.6);
  outline-offset: 2px;
}

/* Медиа-запросы для пользователей с ограниченной подвижностью */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Поддержка высокого контраста для пользователей с ослабленным зрением */
@media (prefers-contrast: high) {
  .filter-section {
    border-color: #000;
  }

  .filter-header {
    background: #fff;
    color: #000;
  }

  .action-btn-primary {
    background: #000;
    color: #fff;
    border: 2px solid #000;
  }

  .action-btn-secondary {
    background: #fff;
    color: #000;
    border: 2px solid #000;
  }
}

.filter-header:hover {
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.95),
    rgba(236, 72, 153, 0.03)
  );
}

/* Удален дублирующийся блок .filter-title */

/* === СТИЛИ ДЛЯ ФИЛЬТРА ПО ПОЛУ === */
.gender-option {
  @apply relative flex items-center gap-3 p-3 rounded-lg border border-gray-100 transition-all duration-200;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.8)
  );
}

.gender-option:hover {
  @apply border-pink-200 shadow-sm;
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.02),
    rgba(248, 250, 252, 0.95)
  );
  transform: translateY(-1px);
}

.gender-option:has(.option-checkbox:checked) {
  @apply border-pink-300 bg-pink-50;
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.08),
    rgba(255, 255, 255, 0.9)
  );
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
}

.gender-option .option-label {
  @apply font-medium text-gray-800 flex-1;
  font-size: 15px;
}

.gender-option .option-count {
  @apply text-sm font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded-full;
  min-width: 32px;
  text-align: center;
}

.gender-option:has(.option-checkbox:checked) .option-count {
  @apply bg-pink-200 text-pink-700;
}

/* Анимация для фильтра по полу */
.gender-option {
  animation: genderOptionFadeIn 0.3s ease-out;
}

@keyframes genderOptionFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .gender-option {
    @apply p-2 gap-2;
  }

  .gender-option .option-label {
    font-size: 14px;
  }
}
</style>
