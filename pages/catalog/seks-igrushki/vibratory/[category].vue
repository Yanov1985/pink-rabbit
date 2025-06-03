<!--
  Страница подкатегории вибраторов
-->
<template>
  <div class="category-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span> / </span>
      <NuxtLink to="/catalog/seks-igrushki">Товары для взрослых</NuxtLink>
      <span> / </span>
      <NuxtLink to="/catalog/seks-igrushki/vibratory">Вибраторы</NuxtLink>
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
      <div v-for="i in 6" :key="i" class="product-card">
        <div class="product-placeholder">
          <div class="product-image"></div>
          <h3>Вибратор {{ i }}</h3>
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

// Объект с данными категорий
const categoriesData: Record<string, CategoryData> = {
  "elitnye-vibratory": {
    title: "Элитные вибраторы",
    description: "Премиальные вибраторы высочайшего качества",
  },
  "vibratory-dlya-par": {
    title: "Вибраторы для пар",
    description: "Вибраторы для совместного использования",
  },
  "hitech-vibratory": {
    title: "Hi-tech вибраторы",
    description: "Высокотехнологичные умные вибраторы",
  },
  "mnogofunkcionalnye-vibratory": {
    title: "Многофункциональные",
    description: "Многофункциональные вибраторы с различными режимами",
  },
  vibroyaica: {
    title: "Виброяйца",
    description: "Компактные вибрирующие яйца",
  },
  "vibratory-tochki-g": {
    title: "Вибраторы точки G",
    description: "Специальные вибраторы для стимуляции точки G",
  },
  minivibratory: {
    title: "Мини вибраторы",
    description: "Компактные дискретные вибраторы",
  },
  "analnye-vibratory": {
    title: "Анальные вибраторы",
    description: "Вибраторы для анальной стимуляции",
  },
  "vibratory-na-radioupravlenii": {
    title: "На радиоуправлении",
    description: "Вибраторы с дистанционным управлением",
  },
  "vaginalnye-vibratory": {
    title: "Вагинальные вибраторы",
    description: "Классические вагинальные вибраторы",
  },
  "nabory-vibratorov": {
    title: "Наборы вибраторов",
    description: "Комплекты вибраторов и аксессуаров",
  },
  kroliki: {
    title: "Вибраторы кролики",
    description: "Вибраторы типа кролик с двойной стимуляцией",
  },
  "neobychnye-vibratory": {
    title: "Необычные вибраторы",
    description: "Оригинальные и необычные модели вибраторов",
  },
  "vibratory-s-rotaciey": {
    title: "С ротацией, крутящиеся",
    description: "Вибраторы с вращательными движениями",
  },
};

// Список валидных категорий
const validCategories = [
  "elitnye-vibratory",
  "vibratory-dlya-par",
  "hitech-vibratory",
  "mnogofunkcionalnye-vibratory",
  "vibroyaica",
  "vibratory-tochki-g",
  "minivibratory",
  "analnye-vibratory",
  "vibratory-na-radioupravlenii",
  "vaginalnye-vibratory",
  "nabory-vibratorov",
  "kroliki",
  "neobychnye-vibratory",
  "vibratory-s-rotaciey",
];

// Метаданные страницы - сначала валидация
definePageMeta({
  title: "Вибраторы - Подкатегория",
  validate: (route) => {
    return validCategories.includes(route.params.category as string);
  },
});

// Получаем параметр категории из маршрута
const route = useRoute();
const categoryParam = computed(() => route.params.category as string);

// Получаем данные категории
const categoryData = computed(() => {
  return (
    categoriesData[categoryParam.value] || {
      title: "Неизвестная категория",
      description: "Категория не найдена",
    }
  );
});

// Динамически устанавливаем заголовок страницы
useHead({
  title: computed(() => `${categoryData.value.title} - Вибраторы`),
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
  color: #e91e63;
  font-weight: 600;
  margin: 0;
}
</style>
