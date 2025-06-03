<!--
  Универсальная catch-all страница каталога
  Обрабатывает все остальные маршруты, не попавшие в специфичные категории
  Как универсальный менеджер в магазине, который знает где что находится
-->
<template>
  <div class="catalog-catch-all">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span v-for="(segment, index) in breadcrumbSegments" :key="index">
        <span> / </span>
        <NuxtLink
          v-if="index < breadcrumbSegments.length - 1"
          :to="generateBreadcrumbLink(index)"
        >
          {{ formatSegment(segment) }}
        </NuxtLink>
        <span v-else>{{ formatSegment(segment) }}</span>
      </span>
    </div>

    <!-- Основной контент -->
    <div class="main-content">
      <!-- Если это товар (последний сегмент выглядит как ID товара) -->
      <div v-if="isProductPage" class="product-page">
        <div class="product-container">
          <!-- Галерея изображений товара -->
          <div class="product-gallery">
            <div class="main-image">
              <div class="image-placeholder">
                <span>Изображение товара</span>
              </div>
            </div>
            <div class="thumbnail-list">
              <div v-for="i in 4" :key="i" class="thumbnail">
                <div class="thumbnail-placeholder"></div>
              </div>
            </div>
          </div>

          <!-- Информация о товаре -->
          <div class="product-info">
            <h1>{{ productData.title }}</h1>
            <div class="product-rating">
              <span class="stars">★★★★☆</span>
              <span class="rating-text">4.2 (127 отзывов)</span>
            </div>

            <div class="product-price">
              <span class="current-price">{{ productData.price }} ₽</span>
              <span v-if="productData.oldPrice" class="old-price"
                >{{ productData.oldPrice }} ₽</span
              >
            </div>

            <div class="product-description">
              <p>{{ productData.description }}</p>
            </div>

            <!-- Характеристики -->
            <div class="product-specs">
              <h3>Характеристики:</h3>
              <ul>
                <li v-for="spec in productData.specs" :key="spec.name">
                  <strong>{{ spec.name }}:</strong> {{ spec.value }}
                </li>
              </ul>
            </div>

            <!-- Кнопки действий -->
            <div class="product-actions">
              <button class="add-to-cart-btn main-btn">
                <span>В корзину</span>
                <span class="price-in-btn">{{ productData.price }} ₽</span>
              </button>
              <button class="favorite-btn">♡ В избранное</button>
              <button class="compare-btn">⚖ Сравнить</button>
            </div>
          </div>
        </div>

        <!-- Похожие товары -->
        <div class="related-products">
          <h2>Похожие товары</h2>
          <div class="products-grid">
            <div v-for="i in 4" :key="i" class="product-card">
              <div class="product-image-placeholder"></div>
              <h3>Похожий товар {{ i }}</h3>
              <p class="price">
                {{ Math.floor(Math.random() * 5000) + 1000 }} ₽
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Если это категория -->
      <div v-else class="category-page">
        <h1>{{ pageData.title }}</h1>
        <p class="category-description">{{ pageData.description }}</p>

        <!-- Подкатегории или товары -->
        <div class="content-grid">
          <div
            v-for="item in pageData.items"
            :key="item.slug"
            class="content-card"
          >
            <NuxtLink :to="item.link" class="card-link">
              <div class="card-image-placeholder"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <span v-if="item.count" class="item-count"
                >{{ item.count }} товаров</span
              >
              <span v-if="item.price" class="item-price"
                >{{ item.price }} ₽</span
              >
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Типы данных
interface ProductSpec {
  name: string;
  value: string;
}

interface ProductData {
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  specs: ProductSpec[];
}

interface PageItem {
  slug: string;
  title: string;
  description: string;
  link: string;
  count?: number;
  price?: number;
}

interface PageData {
  title: string;
  description: string;
  items: PageItem[];
}

// Получаем параметры маршрута
const route = useRoute();
const slugArray = route.params.slug as string[];

// Определяем, является ли это страницей товара
const isProductPage = computed(() => {
  const lastSegment = slugArray[slugArray.length - 1];
  // Считаем товаром, если последний сегмент содержит цифры или очень длинный
  return /\d/.test(lastSegment) || lastSegment.length > 20;
});

// Генерируем хлебные крошки
const breadcrumbSegments = computed(() => slugArray || []);

const generateBreadcrumbLink = (index: number): string => {
  const segments = breadcrumbSegments.value.slice(0, index + 1);
  return `/catalog/${segments.join("/")}`;
};

const formatSegment = (segment: string): string => {
  // Форматируем сегмент URL в читаемый вид
  return segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Данные товара (в реальном приложении будут загружаться из API)
const productData: ProductData = {
  title: "Премиальный товар PinkRabbit",
  description:
    "Высококачественный товар с инновационными технологиями для максимального комфорта и удовольствия.",
  price: 4500,
  oldPrice: 5200,
  specs: [
    { name: "Материал", value: "Медицинский силикон" },
    { name: "Размер", value: "15 см" },
    { name: "Цвет", value: "Розовый" },
    { name: "Водонепроницаемость", value: "IPX7" },
    { name: "Гарантия", value: "2 года" },
  ],
};

// Данные категории (заглушка)
const pageData: PageData = {
  title: formatSegment(
    breadcrumbSegments.value[breadcrumbSegments.value.length - 1] || "Каталог"
  ),
  description: "Широкий выбор качественных товаров в данной категории",
  items: [
    {
      slug: "item-1",
      title: "Популярный товар 1",
      description: "Описание популярного товара",
      link: "#",
      price: 2500,
    },
    {
      slug: "item-2",
      title: "Новинка 2025",
      description: "Последние новинки в категории",
      link: "#",
      price: 3200,
    },
    {
      slug: "subcategory-1",
      title: "Подкатегория товаров",
      description: "Специализированные товары",
      link: "#",
      count: 45,
    },
  ],
};

// SEO метаданные - делаем статическими
definePageMeta({
  title: "Каталог товаров - PinkRabbit",
  description: "Широкий выбор качественных товаров для взрослых",
});

useSeoMeta({
  title: "Каталог товаров - PinkRabbit",
  description: "Широкий выбор качественных товаров для взрослых",
  keywords: "каталог, товары для взрослых, интимные товары, PinkRabbit",
});
</script>

<style scoped>
.catalog-catch-all {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumbs {
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.breadcrumbs a {
  color: #3b82f6;
  text-decoration: none;
}

/* Стили для страницы товара */
.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.product-gallery .main-image {
  margin-bottom: 1rem;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
}

.thumbnail-list {
  display: flex;
  gap: 0.5rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.thumbnail-placeholder:hover {
  opacity: 0.7;
}

.product-info h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  color: #fbbf24;
  font-size: 1.1rem;
}

.rating-text {
  color: #6b7280;
}

.product-price {
  margin-bottom: 1.5rem;
}

.current-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #dc2626;
  margin-right: 1rem;
}

.old-price {
  font-size: 1.25rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.product-description {
  margin-bottom: 2rem;
  color: #4b5563;
  line-height: 1.6;
}

.product-specs {
  margin-bottom: 2rem;
}

.product-specs h3 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.product-specs ul {
  list-style: none;
  padding: 0;
}

.product-specs li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.main-btn:hover {
  background: #b91c1c;
}

.favorite-btn,
.compare-btn {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.favorite-btn:hover,
.compare-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* Стили для категории */
.category-description {
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.content-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s;
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-link {
  display: block;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
}

.card-image-placeholder {
  width: 100%;
  height: 150px;
  background: #f3f4f6;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.product-image-placeholder {
  width: 100%;
  height: 200px;
  background: #f3f4f6;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.content-card h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.content-card p {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.item-count {
  color: #9ca3af;
  font-size: 0.8rem;
}

.item-price {
  color: #dc2626;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Похожие товары */
.related-products {
  margin-top: 4rem;
}

.related-products h2 {
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: white;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card h3 {
  margin: 1rem 0 0.5rem 0;
  color: #1f2937;
}

.product-card .price {
  color: #dc2626;
  font-weight: 600;
  margin: 0;
}

/* Адаптивный дизайн */
@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .content-grid,
  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-actions {
    position: sticky;
    bottom: 1rem;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
