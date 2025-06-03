<!--
  Минимальная страница категории для товаров для пар
-->
<template>
  <div class="category-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span> / </span>
      <NuxtLink to="/catalog/seks-igrushki">Товары для взрослых</NuxtLink>
      <span> / </span>
      <span>Для пар</span>
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
          <p class="price">{{ Math.floor(Math.random() * 6000) + 1500 }} ₽</p>
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
  "bdsm-i-fetish": {
    title: "БДСМ и фетиш",
    description: "Товары для БДСМ и фетиш игр",
  },
  "geli-i-lubrikanty": {
    title: "Гели и лубриканты",
    description: "Интимные гели и смазки для пар",
  },
  prezervativy: {
    title: "Презервативы",
    description: "Презервативы для безопасного секса",
  },
  "vibratory-dlya-par": {
    title: "Вибраторы для пар",
    description: "Вибраторы для совместного использования",
  },
  strapony: {
    title: "Страпоны",
    description: "Страпоны и аксессуары к ним",
  },
  "analnye-stimulyatory": {
    title: "Анальные стимуляторы",
    description: "Игрушки для анальной стимуляции пар",
  },
  "eroticheskie-igry": {
    title: "Эротические игры",
    description: "Игры и аксессуары для разнообразия",
  },
  "afrodiziaki-i-kapsuly": {
    title: "Афродизиаки и капсулы",
    description: "Возбуждающие средства и препараты",
  },
};

// Получаем данные категории
const categoryData = categoriesData[categoryParam] || {
  title: "Неизвестная категория",
  description: "Категория не найдена",
};

// Метаданные страницы
definePageMeta({
  title: "Товары для пар",
  validate: (route) => {
    const validCategories = [
      "bdsm-i-fetish",
      "geli-i-lubrikanty",
      "prezervativy",
      "vibratory-dlya-par",
      "strapony",
      "analnye-stimulyatory",
      "eroticheskie-igry",
      "afrodiziaki-i-kapsuly",
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
  background: linear-gradient(135deg, #ff6b9d20 0%, #c4456920 100%);
  border-radius: 6px;
  margin-bottom: 1rem;
}

.product-placeholder h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.price {
  color: #dc2626;
  font-weight: 600;
  margin: 0;
}
</style>
