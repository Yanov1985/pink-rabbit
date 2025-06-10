<template>
  <section class="px-4 py-8 bg-gradient-to-br from-pink-50 to-purple-50">
    <!-- Заголовок секции -->
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">
        {{ sectionTitle }}
      </h2>
      <p class="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
        {{ sectionDescription }}
      </p>
    </div>

    <!-- Скелетон загрузки -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="n in skeletonCount"
        :key="n"
        class="bg-white rounded-xl p-6 shadow-sm animate-pulse"
      >
        <div class="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div class="h-6 bg-gray-200 rounded mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>

    <!-- Сетка категорий -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="category.url"
        class="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      >
        <div class="relative overflow-hidden rounded-lg mb-4">
          <img
            :src="category.image || '/images/categories/placeholder.jpg'"
            :alt="category.name"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
          ></div>

          <!-- Бейдж количества товаров -->
          <div
            v-if="category.productCount"
            class="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full"
          >
            {{ category.productCount }} товаров
          </div>
        </div>

        <h3
          class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors"
        >
          {{ category.name }}
        </h3>

        <p class="text-gray-600 text-sm leading-relaxed">
          {{ category.description }}
        </p>

        <!-- Показать популярные товары в категории (если есть) -->
        <div
          v-if="category.popularProducts && category.popularProducts.length > 0"
          class="mt-3 pt-3 border-t border-gray-100"
        >
          <p class="text-xs text-gray-500 mb-2">Популярные товары:</p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="product in category.popularProducts.slice(0, 3)"
              :key="product.id"
              class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {{ product.name }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Пустое состояние -->
    <div v-if="!isLoading && categories.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Категории не найдены
      </h3>
      <p class="text-gray-600">
        В данный момент категории для этого раздела не доступны
      </p>
    </div>
  </section>
</template>

<script setup>
// Пропсы компонента
const props = defineProps({
  // Массив категорий для отображения
  categories: {
    type: Array,
    default: () => [],
  },
  // Заголовок секции
  sectionTitle: {
    type: String,
    default: "Категории товаров",
  },
  // Описание секции
  sectionDescription: {
    type: String,
    default: "Выберите подходящую категорию товаров",
  },
  // Состояние загрузки
  isLoading: {
    type: Boolean,
    default: false,
  },
  // Количество скелетонов при загрузке
  skeletonCount: {
    type: Number,
    default: 9,
  },
});

// Эмиты для взаимодействия с родительским компонентом
const emit = defineEmits(["category-click", "category-hover"]);

// Метод для обработки клика по категории
const handleCategoryClick = (category) => {
  // Отправляем событие родительскому компоненту для аналитики
  emit("category-click", {
    categoryId: category.id,
    categoryName: category.name,
    url: category.url,
  });
};

// Метод для обработки наведения на категорию (для предзагрузки)
const handleCategoryHover = (category) => {
  emit("category-hover", {
    categoryId: category.id,
    url: category.url,
  });
};

// Lifecycle хук для компонента
onMounted(() => {
  console.log(
    `Универсальный компонент категорий загружен. Категорий: ${props.categories.length}`
  );
});
</script>

<style scoped>
/* Анимации для карточек категорий */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Плавные переходы */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Анимация скелетона */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Адаптивная сетка */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 640px) and (max-width: 1024px) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Стили для бейджей */
.bg-pink-500 {
  background-color: #ec4899;
}

/* Стили для границ */
.border-gray-100 {
  border-color: #f3f4f6;
}
</style>
