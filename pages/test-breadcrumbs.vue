<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Заголовок тестовой страницы -->
    <div class="bg-white shadow-sm border-b border-gray-200 p-6">
      <div class="container mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          🧪 Тестирование скелетона хлебных крошек
        </h1>
        <p class="text-gray-600 mb-6">
          Демонстрация работы скелетона Breadcrumbs в стиле Pink Rabbit
        </p>

        <!-- Кнопки управления -->
        <div class="flex gap-4 flex-wrap">
          <button
            @click="toggleLoading"
            class="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium"
          >
            {{
              isLoading ? "✅ Показать готовые крошки" : "⏳ Показать скелетон"
            }}
          </button>

          <button
            @click="simulateRealLoading"
            class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
          >
            🔄 Симуляция реальной загрузки (3 сек)
          </button>

          <button
            @click="changeCategory"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            🔀 Сменить категорию
          </button>

          <button
            @click="testAutoSkeleton"
            class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
          >
            🤖 Тест автоматического скелетона
          </button>
        </div>
      </div>
    </div>

    <!-- Компонент хлебных крошек с тестированием -->
    <Breadcrumbs
      :breadcrumbs="currentBreadcrumbs"
      :isLoading="isLoading"
      :showCatalog="true"
      :isMainCatalog="false"
    />

    <!-- Контент страницы для демонстрации липкого поведения -->
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          📋 Инструкция по тестированию
        </h2>

        <div class="space-y-4 text-gray-700">
          <div class="flex items-start gap-3">
            <span class="text-pink-500 font-bold">1.</span>
            <div>
              <strong>Тестирование скелетона:</strong> Нажмите кнопку "Показать
              скелетон" чтобы увидеть анимированный скелетон в стиле Pink Rabbit
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="text-pink-500 font-bold">2.</span>
            <div>
              <strong>Симуляция загрузки:</strong> Кнопка "Симуляция реальной
              загрузки" покажет, как выглядит переход от скелетона к готовому
              компоненту
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="text-pink-500 font-bold">3.</span>
            <div>
              <strong>Смена категорий:</strong> Кнопка "Сменить категорию"
              изменит содержимое хлебных крошек для тестирования разных
              сценариев
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="text-pink-500 font-bold">4.</span>
            <div>
              <strong>Липкое поведение:</strong> Прокрутите страницу вниз, чтобы
              увидеть, как хлебные крошки остаются в верхней части экрана
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="text-pink-500 font-bold">5.</span>
            <div>
              <strong>Автоматический скелетон:</strong> Кнопка "Тест
              автоматического скелетона" демонстрирует умную логику - скелетон
              появляется автоматически при пустых данных
            </div>
          </div>
        </div>
      </div>

      <!-- Демонстрационный контент для прокрутки -->
      <div class="space-y-8">
        <div v-for="i in 10" :key="i" class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            🛍️ Секция товаров {{ i }}
          </h3>
          <p class="text-gray-600 leading-relaxed">
            Это демонстрационный контент для тестирования липкого поведения
            хлебных крошек. При прокрутке страницы навигационная панель должна
            оставаться в верхней части экрана. Скелетон использует те же стили и
            анимации, что и другие компоненты Pink Rabbit.
          </p>

          <!-- Имитация карточек товаров -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div
              v-for="j in 3"
              :key="j"
              class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <div
                class="w-full h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-3"
              ></div>
              <h4 class="font-medium text-gray-900">Товар {{ i }}.{{ j }}</h4>
              <p class="text-sm text-gray-500">Описание товара</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Состояние загрузки
const isLoading = ref(false);

// Различные варианты хлебных крошек для тестирования
const breadcrumbVariants = [
  [
    { name: "Женская одежда", url: "/catalog/women" },
    { name: "Платья", url: "/catalog/women/dresses" },
    { name: "Летние платья", isActive: true },
  ],
  [
    { name: "Интимные товары", url: "/catalog/intimate" },
    { name: "Игрушки для взрослых", url: "/catalog/intimate/toys" },
    { name: "Вибраторы", url: "/catalog/intimate/toys/vibrators" },
    { name: "Классические вибраторы", isActive: true },
  ],
  [
    { name: "Косметика", url: "/catalog/cosmetics" },
    { name: "Уход за телом", isActive: true },
  ],
  [
    { name: "Белье", url: "/catalog/lingerie" },
    { name: "Женское белье", url: "/catalog/lingerie/women" },
    { name: "Комплекты", url: "/catalog/lingerie/women/sets" },
    { name: "Кружевные комплекты", url: "/catalog/lingerie/women/sets/lace" },
    { name: "Романтические комплекты", isActive: true },
  ],
];

const currentVariantIndex = ref(0);
const currentBreadcrumbs = ref(breadcrumbVariants[0]);

// Переключение состояния загрузки
const toggleLoading = () => {
  isLoading.value = !isLoading.value;
};

// Симуляция реальной загрузки
const simulateRealLoading = async () => {
  isLoading.value = true;

  // Имитируем загрузку данных с сервера
  await new Promise((resolve) => setTimeout(resolve, 3000));

  isLoading.value = false;
};

// Смена категории для тестирования разных вариантов
const changeCategory = () => {
  currentVariantIndex.value =
    (currentVariantIndex.value + 1) % breadcrumbVariants.length;
  currentBreadcrumbs.value = breadcrumbVariants[currentVariantIndex.value];
};

// Тест автоматического определения скелетона
const testAutoSkeleton = async () => {
  // Очищаем breadcrumbs - скелетон должен появиться автоматически
  currentBreadcrumbs.value = [];

  // Ждем 2 секунды, затем загружаем данные
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Загружаем данные - скелетон должен исчезнуть
  currentBreadcrumbs.value = breadcrumbVariants[0];
};

// Метаданные страницы
useHead({
  title: "Тестирование скелетона хлебных крошек - Pink Rabbit",
  meta: [
    {
      name: "description",
      content:
        "Демонстрационная страница для тестирования скелетона компонента хлебных крошек в стиле Pink Rabbit",
    },
  ],
});

onMounted(() => {
  console.log("🧪 Тестовая страница скелетона хлебных крошек загружена");
});
</script>

<style scoped>
/* Дополнительные стили для тестовой страницы */
.container {
  max-width: 1200px;
}

/* Плавные переходы для кнопок */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}

/* Стили для демонстрационных карточек */
.bg-gradient-to-br {
  background: linear-gradient(135deg, #fce7f3, #e9d5ff);
}
</style>
