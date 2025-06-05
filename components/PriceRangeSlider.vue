<template>
  <div class="price-filter">
    <!-- Поля ввода цены -->
    <div class="price-inputs">
      <input
        v-model.number="localMin"
        @input="updateValues"
        type="number"
        :min="min"
        :max="max"
        class="price-input"
        :placeholder="min.toString()"
      />
      <input
        v-model.number="localMax"
        @input="updateValues"
        type="number"
        :min="min"
        :max="max"
        class="price-input"
        :placeholder="max.toString()"
      />
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
</script>

<style scoped>
.price-filter {
  @apply space-y-4;
  margin-top: 12px;
}

.price-inputs {
  @apply grid grid-cols-2 gap-3;
}

.price-input {
  @apply w-full px-3 py-2 text-sm border rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-pink-200;
  @apply transition-all duration-200;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  color: #333;
  font-size: 13px;
  height: 32px;
  font-weight: 500;
}

.price-input:focus {
  border-color: #f06292;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1);
}

.price-input::placeholder {
  color: #999;
  font-size: 12px;
  font-weight: 400;
}

/* Range слайдер - ИДЕАЛЬНОЕ центрирование */
.range-slider {
  @apply relative;
  height: 20px;
  margin-top: 16px;
  display: flex;
  align-items: center;
}

.range-input {
  @apply absolute w-full;
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
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
  height: 20px;
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
}

/* Стили ползунков для WebKit - ТОЧНОЕ ПОЗИЦИОНИРОВАНИЕ */
.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f06292 0%, #e91e63 100%);
  border: 3px solid #fff;
  cursor: pointer;
  pointer-events: all;
  position: relative;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(240, 98, 146, 0.3);
  transition: all 0.2s ease;
  margin-top: 0;
  top: 0;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(240, 98, 146, 0.4);
}

.range-input::-webkit-slider-thumb:active {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(240, 98, 146, 0.5);
}

/* Стили для Firefox - ТОЧНОЕ ПОЗИЦИОНИРОВАНИЕ */
.range-input::-moz-range-track {
  background: transparent;
  border: none;
  height: 20px;
  cursor: pointer;
}

.range-input::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f06292 0%, #e91e63 100%);
  border: 3px solid #fff;
  cursor: pointer;
  pointer-events: all;
  position: relative;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(240, 98, 146, 0.3);
  transition: all 0.2s ease;
  border-width: 0;
  margin: 0;
  -moz-appearance: none;
  appearance: none;
}

.range-input::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(240, 98, 146, 0.4);
}

.range-input::-moz-range-thumb:active {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(240, 98, 146, 0.5);
}

.range-input::-moz-range-progress {
  background: transparent;
}

/* Трек слайдера - СТРОГО ПО ЦЕНТРУ */
.range-track {
  @apply absolute left-0 right-0;
  height: 6px;
  background: linear-gradient(90deg, #f5f5f5 0%, #e8e8e8 100%);
  border-radius: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.range-fill {
  @apply absolute top-0 h-full rounded-lg;
  background: linear-gradient(90deg, #f06292 0%, #e91e63 100%);
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(240, 98, 146, 0.3);
  z-index: 2;
}

/* Адаптивность */
@media (max-width: 640px) {
  .price-input {
    @apply py-2 px-3;
    font-size: 12px;
    height: 30px;
  }

  .range-slider {
    height: 18px;
  }

  .range-input {
    height: 18px;
  }

  .range-input::-webkit-slider-thumb {
    height: 18px;
    width: 18px;
  }

  .range-input::-webkit-slider-runnable-track {
    height: 18px;
  }

  .range-input::-moz-range-thumb {
    height: 18px;
    width: 18px;
  }

  .range-input::-moz-range-track {
    height: 18px;
  }

  .range-track {
    height: 5px;
  }

  .range-fill {
    @apply rounded;
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
