<!--
  Минимальная страница категории для мужских товаров
-->
<template>
  <div class="category-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span> / </span>
      <NuxtLink to="/catalog/seks-igrushki">Товары для взрослых</NuxtLink>
      <span> / </span>
      <span>Для мужчин</span>
      <span> / </span>
      <span>{{ categoryData.title }}</span>
    </div>

    <!-- Заголовок категории -->
    <div class="category-header">
      <h1>{{ categoryData.title }}</h1>
      <p>{{ categoryData.description }}</p>
    </div>

    <!-- Простая сетка товаров-заглушек -->
    <div class="products-grid">
      <div v-for="i in 4" :key="i" class="product-card">
        <div class="product-placeholder">
          <div class="product-image"></div>
          <h3>Товар {{ i }}</h3>
          <p class="price">{{ Math.floor(Math.random() * 8000) + 2000 }} ₽</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Интерфейс для данных категории
interface CategoryData {
  title: string;
  description: string;
}

// Получаем параметр категории
const route = useRoute();
const categoryParam = route.params.category as string;

// Полные данные категорий как на оригинальном сайте PinkRabbit
const categoriesData: Record<string, CategoryData> = {
  "masturbatory-i-vaginy": {
    title: "Мастурбаторы и вагины",
    description: "Широкий выбор мастурбаторов и искусственных вагин",
  },
  "nasadki-i-udliniteli": {
    title: "Насадки и удлинители",
    description: "Насадки и удлинители для мужчин",
  },
  "pompy-dlya-penisa": {
    title: "Помпы для пениса",
    description: "Помпы для увеличения и стимуляции",
  },
  "koltsa-i-nasadki-na-penis": {
    title: "Кольца и насадки на пенис",
    description: "Эрекционные кольца и насадки",
  },
  "seks-kukly": {
    title: "Секс куклы",
    description: "Реалистичные секс куклы для мужчин",
  },
  "massazher-prostaty": {
    title: "Массажер простаты",
    description: "Массажеры и стимуляторы простаты",
  },
  prezervativy: {
    title: "Презервативы",
    description: "Презервативы различных типов и размеров",
  },
  "geli-i-lubrikanty": {
    title: "Гели и лубриканты",
    description: "Интимные гели и смазки для мужчин",
  },
  "krema-dlya-uvelicheniya-chlena": {
    title: "Крема для увеличения члена",
    description: "Специальные крема и средства для увеличения",
  },
};

// Получаем данные категории
const categoryData = categoriesData[categoryParam] || {
  title: "Неизвестная категория",
  description: "Категория не найдена",
};

// Метаданные страницы
definePageMeta({
  title: "Товары для мужчин",
  validate: (route) => {
    const validCategories = [
      "masturbatory-i-vaginy",
      "nasadki-i-udliniteli",
      "pompy-dlya-penisa",
      "koltsa-i-nasadki-na-penis",
      "seks-kukly",
      "massazher-prostaty",
      "prezervativy",
      "geli-i-lubrikanty",
      "krema-dlya-uvelicheniya-chlena",
    ];
    return validCategories.includes(route.params.category as string);
  },
});
</script>

<style scoped>
.category-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumbs {
  margin-bottom: 2rem;
  color: #666;
}

.breadcrumbs a {
  color: #3b82f6;
  text-decoration: none;
}

.category-header {
  margin-bottom: 2rem;
}

.category-header h1 {
  margin-bottom: 0.5rem;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}

.product-placeholder {
  padding: 1rem;
}

.product-image {
  width: 100%;
  height: 150px;
  background: #e6f3ff;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.product-placeholder h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.price {
  color: #059669;
  font-weight: 600;
  margin: 0;
}
</style>
