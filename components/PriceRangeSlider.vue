<template>
  <div class="price-filter">
    <!-- Компактные поля ввода цены -->
    <div class="price-inputs">
      <div class="price-input-group">
        <label class="price-label">От</label>
        <div class="input-wrapper">
          <input
            v-model.number="localMin"
            @input="updateValues"
            @blur="validateAndFormat"
            type="number"
            :min="min"
            :max="max"
            :step="step"
            class="price-input"
            :placeholder="formatPrice(min)"
          />
          <span class="price-currency">₽</span>
        </div>
      </div>
      <div class="price-input-group">
        <label class="price-label">До</label>
        <div class="input-wrapper">
          <input
            v-model.number="localMax"
            @input="updateValues"
            @blur="validateAndFormat"
            type="number"
            :min="min"
            :max="max"
            :step="step"
            class="price-input"
            :placeholder="formatPrice(max)"
          />
          <span class="price-currency">₽</span>
        </div>
      </div>
    </div>

    <!-- Range слайдер -->
    <div class="range-slider">
      <input
        v-model.number="localMin"
        @input="updateFromSlider"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="range-input range-min"
      />
      <input
        v-model.number="localMax"
        @input="updateFromSlider"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="range-input range-max"
      />
      <div class="range-track">
        <div class="range-fill" :style="fillStyle"></div>
      </div>
    </div>

    <!-- Компактное отображение выбранного диапазона -->
    <div class="price-display">
      {{ formatPrice(localMin) }} — {{ formatPrice(localMax) }} ₽
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Пропсы компонента
const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 250000,
  },
  step: {
    type: Number,
    default: 1000,
  },
  modelValue: {
    type: Object,
    default: () => ({ min: 0, max: 250000 }),
  },
});

// Эмиты
const emit = defineEmits(["update:modelValue", "change"]);

// Локальные значения
const localMin = ref(props.modelValue.min || props.min);
const localMax = ref(props.modelValue.max || props.max);

// Стили для заливки слайдера
const fillStyle = computed(() => {
  const minPercent =
    ((localMin.value - props.min) / (props.max - props.min)) * 100;
  const maxPercent =
    ((localMax.value - props.min) / (props.max - props.min)) * 100;

  return {
    left: `${minPercent}%`,
    width: `${maxPercent - minPercent}%`,
  };
});

// Обновление значений из полей ввода
const updateValues = () => {
  // Проверяем границы
  if (localMin.value < props.min) localMin.value = props.min;
  if (localMax.value > props.max) localMax.value = props.max;
  if (localMin.value > localMax.value) localMin.value = localMax.value;
  if (localMax.value < localMin.value) localMax.value = localMin.value;

  emitChange();
};

// Обновление значений из слайдера
const updateFromSlider = () => {
  // Обеспечиваем правильный порядок значений
  if (localMin.value > localMax.value) {
    const temp = localMin.value;
    localMin.value = localMax.value;
    localMax.value = temp;
  }

  emitChange();
};

// Отправка изменений
const emitChange = () => {
  const range = { min: localMin.value, max: localMax.value };
  emit("update:modelValue", range);
  emit("change", range);
};

// Следим за изменениями modelValue извне
watch(
  () => props.modelValue,
  (newValue) => {
    localMin.value = newValue.min || props.min;
    localMax.value = newValue.max || props.max;
  }
);

// Дополнительные функции
const formatPrice = (value) => {
  return value.toLocaleString("ru-RU");
};

const validateAndFormat = () => {
  // Реализация валидации и форматирования
};
</script>

<style scoped>
.price-filter {
  @apply space-y-3;
  margin-top: 8px;
  padding: 0 4px;
}

.price-inputs {
  @apply grid grid-cols-2 gap-3;
  padding: 0 2px;
}

.price-input-group {
  @apply relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-label {
  @apply text-xs font-medium text-gray-600;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: 0.02em;
  margin-bottom: 0;
  line-height: 1.2;
}

.input-wrapper {
  @apply relative;
  position: relative;
}

.price-input {
  @apply w-full px-3 py-2 text-sm border rounded-lg;
  @apply focus:outline-none focus:ring-1 focus:ring-pink-200;
  @apply transition-all duration-200;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border: 1px solid #e0e0e0;
  color: #333;
  font-size: 13px;
  height: 36px;
  font-weight: 500;
  padding-right: 24px;
  margin: 0;
}

.price-input:focus {
  border-color: #f06292;
  background: linear-gradient(135deg, #fff 0%, #fafafa 100%);
  box-shadow: 0 0 0 2px rgba(240, 98, 146, 0.08);
}

.price-input:hover {
  border-color: #f06292;
  background: linear-gradient(135deg, #fdfdfd 0%, #f8f8f8 100%);
}

.price-input::placeholder {
  color: #999;
  font-size: 12px;
  font-weight: 400;
}

.price-currency {
  @apply absolute right-2 top-1/2 transform -translate-y-1/2;
  @apply text-xs text-gray-500 font-medium pointer-events-none;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1;
}

.price-display {
  @apply text-center text-xs font-semibold text-gray-700;
  @apply bg-gradient-to-r from-pink-50 to-pink-100;
  @apply border border-pink-200 rounded-md px-3 py-1.5;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: 0.02em;
  box-shadow: 0 1px 2px rgba(240, 98, 146, 0.08);
  margin: 6px 0 0 0;
  line-height: 1.3;
}

/* Range слайдер - КОМПАКТНАЯ версия */
.range-slider {
  @apply relative;
  height: 18px;
  margin-top: 12px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}

.range-input {
  @apply absolute w-full;
  -webkit-appearance: none;
  appearance: none;
  height: 18px;
  background: transparent;
  outline: none;
  pointer-events: none;
  margin: 0;
  padding: 0;
  border: none;
  top: 0;
  left: 0;
}

/* Полная очистка стилей для WebKit */
.range-input::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  appearance: none;
  height: 18px;
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
}

/* Стили ползунков для WebKit - КОМПАКТНЫЕ */
.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f06292 0%, #e91e63 100%);
  border: 2px solid #fff;
  cursor: pointer;
  pointer-events: all;
  position: relative;
  z-index: 3;
  box-shadow: 0 2px 6px rgba(240, 98, 146, 0.25);
  transition: all 0.2s ease;
  margin-top: 0;
  top: 0;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.08);
  box-shadow: 0 3px 8px rgba(240, 98, 146, 0.35);
}

.range-input::-webkit-slider-thumb:active {
  transform: scale(1.02);
  box-shadow: 0 2px 4px rgba(240, 98, 146, 0.4);
}

/* Стили для Firefox - КОМПАКТНЫЕ */
.range-input::-moz-range-track {
  background: transparent;
  border: none;
  height: 18px;
  cursor: pointer;
}

.range-input::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f06292 0%, #e91e63 100%);
  border: 2px solid #fff;
  cursor: pointer;
  pointer-events: all;
  position: relative;
  z-index: 3;
  box-shadow: 0 2px 6px rgba(240, 98, 146, 0.25);
  transition: all 0.2s ease;
  border-width: 0;
  margin: 0;
  -moz-appearance: none;
  appearance: none;
}

.range-input::-moz-range-thumb:hover {
  transform: scale(1.08);
  box-shadow: 0 3px 8px rgba(240, 98, 146, 0.35);
}

.range-input::-moz-range-thumb:active {
  transform: scale(1.02);
  box-shadow: 0 2px 4px rgba(240, 98, 146, 0.4);
}

.range-input::-moz-range-progress {
  background: transparent;
}

/* Трек слайдера - КОМПАКТНЫЙ */
.range-track {
  @apply absolute left-0 right-0;
  height: 5px;
  background: linear-gradient(90deg, #f5f5f5 0%, #e8e8e8 100%);
  border-radius: 2.5px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.range-fill {
  @apply absolute top-0 h-full rounded;
  background: linear-gradient(90deg, #f06292 0%, #e91e63 100%);
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(240, 98, 146, 0.25);
  z-index: 2;
  border-radius: 2.5px;
}

/* Адаптивность - МАКСИМАЛЬНО КОМПАКТНО */
@media (max-width: 640px) {
  .price-filter {
    @apply space-y-2;
    margin-top: 6px;
    padding: 0 2px;
  }

  .price-inputs {
    @apply grid-cols-1 gap-2;
    padding: 0;
  }

  .price-input-group {
    gap: 3px;
  }

  .price-label {
    @apply text-xs;
    margin-bottom: 0;
    line-height: 1.1;
  }

  .price-input {
    @apply py-2 px-3;
    font-size: 12px;
    height: 32px;
    padding-right: 20px;
  }

  .price-currency {
    @apply text-xs;
    right: 6px;
  }

  .price-display {
    @apply text-xs px-2 py-1;
    margin: 4px 0 0 0;
    line-height: 1.2;
  }

  .range-slider {
    height: 16px;
    margin-top: 8px;
    margin-bottom: 4px;
  }

  .range-input {
    height: 16px;
  }

  .range-input::-webkit-slider-thumb {
    height: 16px;
    width: 16px;
    border: 2px solid #fff;
  }

  .range-input::-webkit-slider-runnable-track {
    height: 16px;
  }

  .range-input::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border: 2px solid #fff;
  }

  .range-input::-moz-range-track {
    height: 16px;
  }

  .range-track {
    height: 4px;
    border-radius: 2px;
  }

  .range-fill {
    border-radius: 2px;
  }
}

/* Дополнительные стили для IE/Edge */
.range-input::-ms-track {
  background: transparent;
  border: none;
  height: 20px;
  color: transparent;
  cursor: pointer;
}

.range-input::-ms-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f06292 0%, #e91e63 100%);
  border: 3px solid #fff;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(240, 98, 146, 0.3);
  margin-top: 0;
}

.range-input::-ms-fill-lower,
.range-input::-ms-fill-upper {
  background: transparent;
}

/* Анимация при загрузке */
.range-slider {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Дополнительное принудительное выравнивание */
.range-input {
  vertical-align: middle !important;
}

.range-input:focus {
  outline: none !important;
}
</style>
