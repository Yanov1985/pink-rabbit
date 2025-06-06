<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Хлебные крошки -->
    <nav class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="container mx-auto">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <NuxtLink
              to="/"
              class="text-gray-500 hover:text-pink-500 transition-colors"
            >
              Главная
            </NuxtLink>
          </li>
          <li class="text-gray-400">/</li>
          <li>
            <NuxtLink
              to="/catalog"
              class="text-gray-500 hover:text-pink-500 transition-colors"
            >
              Каталог
            </NuxtLink>
          </li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-900">Товары для взрослых</li>
        </ol>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Липкий sidebar только с фильтрами -->
        <div class="sticky-sidebar">
          <aside class="lg:w-1/4 space-y-6" ref="filtersRef">
            <!-- Фильтры для товаров для взрослых -->
            <AdultToysFilters
              class="filters-sidebar"
              @update-filters="applyFilters"
              :is-loading="isFilterLoading"
              :initial-filters="{
                priceMin,
                priceMax,
                selectedBrands,
                selectedMaterials,
                selectedColors,
                selectedLengths,
                selectedDiameters,
                selectedVibrationModes,
                selectedWaterproofLevels,
                hasHeating,
                selectedMotorCounts,
                selectedAromas,
                isEdible,
                onlyInStock,
                onlyWithDiscount,
                onlyNew,
              }"
              @reset-filters="resetFilters"
            />
          </aside>
        </div>

        <!-- Основной контент -->
        <main class="lg:w-3/4 catalog-main">
          <!-- Заголовок каталога с компонентом -->
          <CatalogHeader
            category-title="Товары для взрослых"
            :total-count="filteredProducts.length"
            :view-mode="viewMode"
            :sort-by="sortBy"
            :is-loading="isInitialLoading"
            @change-view-mode="changeViewMode"
            @change-sorting="handleSortingChange"
            ref="catalogHeaderRef"
          />

          <!-- Skeleton загрузка при начальной загрузке -->
          <div
            v-if="isInitialLoading"
            :class="viewMode === 4 ? 'product-grid-4' : 'product-grid-3'"
          >
            <ProductSkeleton v-for="i in 12" :key="i" />
          </div>

          <!-- Skeleton загрузка при применении фильтров -->
          <div
            v-else-if="isFilterLoading"
            :class="viewMode === 4 ? 'product-grid-4' : 'product-grid-3'"
          >
            <ProductSkeleton
              v-for="i in Math.min(paginatedProducts.length || 12, 12)"
              :key="`filter-skeleton-${i}`"
            />
          </div>

          <!-- Сетка товаров -->
          <div
            v-else
            :class="viewMode === 4 ? 'product-grid-4' : 'product-grid-3'"
            ref="productsGridRef"
          >
            <ProductCard
              v-for="(product, index) in paginatedProducts"
              :key="product.id"
              :product="product"
              :ref="(el) => setProductCardRef(el, index)"
              @add-to-cart="addToCart"
              @add-to-favorites="toggleWishlist"
              @remove-from-favorites="toggleWishlist"
              @add-to-compare="toggleCompare"
              @remove-from-compare="toggleCompare"
              @quick-view="openQuickView"
              @open-details="openProductDetails"
              @share-product="shareProduct"
            />
          </div>

          <!-- Пустое состояние -->
          <div
            v-if="!isInitialLoading && paginatedProducts.length === 0"
            class="text-center py-12 empty-state"
          >
            <div class="empty-state-icon">📦</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Товары не найдены
            </h3>
            <p class="text-gray-600 mb-4">
              Попробуйте изменить параметры фильтрации
            </p>
            <button
              @click="resetFilters"
              class="reset-filters-btn text-white px-6 py-2 rounded-lg transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>

          <!-- Пагинация -->
          <div
            v-if="totalPages > 1 && !isInitialLoading"
            class="flex justify-center mt-8"
            ref="paginationRef"
          >
            <nav class="flex items-center gap-2">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="pagination-button px-3 py-2 rounded-lg text-sm font-medium"
                :class="
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                "
              >
                <ChevronLeftIcon class="w-4 h-4" />
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="pagination-button px-3 py-2 rounded-lg text-sm font-medium min-w-[40px]"
                :class="
                  page === currentPage
                    ? 'active'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                "
              >
                {{ page }}
              </button>

              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="pagination-button px-3 py-2 rounded-lg text-sm font-medium"
                :class="
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                "
              >
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
// Метаданные для SEO
useSeoMeta({
  title: "Товары для взрослых - Pink Rabbit",
  description:
    "Широкий выбор качественных товаров для взрослых. Дискретная доставка, высокое качество, проверенные бренды.",
  keywords:
    "товары для взрослых, секс-игрушки, интимные товары, эротические товары",
});

// Импорты
import { ref, computed, onMounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Импорт компонентов
import ProductSkeleton from "~/components/ProductSkeleton.vue";
import CatalogHeader from "~/components/CatalogHeader.vue";
import AdultToysFilters from "~/components/AdultToysFilters.vue";

// Импорт иконок
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  HeartIcon,
  EyeIcon,
  StarIcon,
  FunnelIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/vue/24/outline";

// Регистрация плагинов GSAP
gsap.registerPlugin(ScrollTrigger);

// Основные реактивные переменные
const isInitialLoading = ref(true); // Начальная загрузка
const isLoading = ref(false); // Загрузка при фильтрации
const isFilterLoading = ref(false); // Загрузка при применении фильтров
const currentPage = ref(1);
const itemsPerPage = ref(50); // Увеличиваем до 50 товаров на странице для лучшего UX
const viewMode = ref(4); // 4 или 3 колонки
const sortBy = ref("popularity");

// Фильтры (добавляем все недостающие переменные)
const priceMin = ref(null);
const priceMax = ref(null);
const selectedBrands = ref([]);
const selectedMaterials = ref([]);
const selectedColors = ref([]);
const selectedLengths = ref([]); // Добавляем фильтр по длине
const selectedDiameters = ref([]); // Добавляем фильтр по диаметру
const selectedVibrationModes = ref([]); // Добавляем фильтр по режимам вибрации
const selectedWaterproofLevels = ref([]); // Добавляем фильтр по водозащите
const hasHeating = ref(false); // Добавляем фильтр по нагреву
const selectedMotorCounts = ref([]); // Добавляем фильтр по моторам
const selectedAromas = ref([]); // Добавляем фильтр по ароматам
const isEdible = ref(false); // Добавляем фильтр съедобности
const onlyInStock = ref(false);
const onlyWithDiscount = ref(false);
const onlyNew = ref(false);

// Расширенные категории
const expandedCategories = ref({
  women: false,
  men: false,
  couples: false,
});

// Состояния загрузки изображений
const imageLoadingStates = ref({});
const imageErrorStates = ref({});

// Ссылки на DOM элементы
const filtersRef = ref(null);
const productsGridRef = ref(null);
const paginationRef = ref(null);
const productCardRefs = ref([]);
const catalogHeaderRef = ref(null);

// Заглушки изображений Unsplash
const placeholderImages = [
  "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1619252584172-a83a949e6efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1619252584172-a83a949e6efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

// Данные товаров для демонстрации с полными характеристиками для фильтрации
const products = ref([
  {
    id: 1,
    name: "Вибратор Lelo Gigi 2",
    brand: 1, // ID бренда из фильтров
    price: 12000,
    oldPrice: 15000,
    images: [
      placeholderImages[0],
      placeholderImages[1],
      placeholderImages[2],
      placeholderImages[3],
    ],
    image: placeholderImages[0],
    rating: 5,
    reviews: 127,
    material: 1, // ID материала (Медицинский силикон)
    color: 1, // ID цвета (Розовый)
    length: "15", // Длина в см
    diameter: "3", // Диаметр в см
    vibrationModes: "7", // Количество режимов вибрации
    waterproof: "ipx7", // Уровень водозащиты
    hasHeating: false, // Функция нагрева
    motorCount: "1", // Количество моторов
    aroma: null, // ID аромата (null если нет)
    isEdible: false, // Съедобный ли товар
    isNew: false,
    isHit: true,
    discount: 20,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "women",
  },
  {
    id: 2,
    name: "Мастурбатор Fleshlight Original",
    brand: 8, // Doc Johnson (как аналог)
    price: 8500,
    oldPrice: null,
    images: [
      placeholderImages[1],
      placeholderImages[5],
      placeholderImages[8],
      placeholderImages[11],
    ],
    image: placeholderImages[1],
    rating: 4,
    reviews: 89,
    material: 2, // TPE
    color: 8, // Телесный
    length: "20", // Длина в см
    diameter: "4", // Диаметр в см
    vibrationModes: null, // Нет вибрации
    waterproof: "ipx4", // Базовая водозащита
    hasHeating: false,
    motorCount: null, // Нет моторов
    aroma: null,
    isEdible: false,
    isNew: true,
    isHit: false,
    discount: 0,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "men",
  },
  {
    id: 3,
    name: "Вибратор для пар We-Vibe Sync",
    brand: 2, // We-Vibe
    price: 18000,
    oldPrice: 22000,
    images: [
      placeholderImages[2],
      placeholderImages[6],
      placeholderImages[9],
      placeholderImages[12],
    ],
    image: placeholderImages[2],
    rating: 5,
    reviews: 203,
    material: 1, // Медицинский силикон
    color: 5, // Фиолетовый
    length: "10", // Длина в см
    diameter: "2", // Диаметр в см
    vibrationModes: "10", // 10 режимов вибрации
    waterproof: "full", // Полная защита
    hasHeating: true, // Есть функция нагрева
    motorCount: "2", // 2 мотора
    aroma: null,
    isEdible: false,
    isNew: false,
    isHit: true,
    discount: 18,
    inStock: true,
    inWishlist: true,
    inCompare: false,
    category: "couples",
  },
  {
    id: 4,
    name: "Анальная пробка Jewel Premium",
    brand: 8, // Doc Johnson (как аналог NJOY)
    price: 6500,
    oldPrice: null,
    images: [
      placeholderImages[3],
      placeholderImages[7],
      placeholderImages[10],
      placeholderImages[13],
    ],
    image: placeholderImages[3],
    rating: 4,
    reviews: 56,
    material: 5, // Металл
    color: 11, // Серебро
    length: "10", // Длина в см
    diameter: "3", // Диаметр в см
    vibrationModes: null, // Нет вибрации
    waterproof: "full", // Полная защита
    hasHeating: false,
    motorCount: null, // Нет моторов
    aroma: null,
    isEdible: false,
    isNew: false,
    isHit: false,
    discount: 0,
    inStock: true,
    inWishlist: false,
    inCompare: true,
    category: "couples",
  },
  {
    id: 5,
    name: "Кольцо Satisfyer Power Ring",
    brand: 3, // Satisfyer
    price: 3500,
    oldPrice: 4200,
    images: [
      placeholderImages[4],
      placeholderImages[8],
      placeholderImages[11],
      placeholderImages[14],
    ],
    image: placeholderImages[4],
    rating: 4,
    reviews: 34,
    material: 1, // Медицинский силикон
    color: 2, // Черный
    length: null, // Не применимо для колец
    diameter: "4", // Внутренний диаметр
    vibrationModes: "5", // 5 режимов вибрации
    waterproof: "ipx7",
    hasHeating: false,
    motorCount: "1", // 1 мотор
    aroma: null,
    isEdible: false,
    isNew: true,
    isHit: false,
    discount: 17,
    inStock: false,
    inWishlist: false,
    inCompare: false,
    category: "men",
  },
  {
    id: 6,
    name: "Вибратор Bullet Magic Mini",
    brand: 8, // Doc Johnson (как аналог Magic Motion)
    price: 2800,
    oldPrice: null,
    images: [
      placeholderImages[5],
      placeholderImages[9],
      placeholderImages[12],
      placeholderImages[15],
    ],
    image: placeholderImages[5],
    rating: 3,
    reviews: 67,
    material: 1, // Медицинский силикон
    color: 3, // Белый
    length: "10", // Длина в см
    diameter: "2", // Диаметр в см
    vibrationModes: "3", // 3 режима вибрации
    waterproof: "ipx4",
    hasHeating: false,
    motorCount: "1", // 1 мотор
    aroma: null,
    isEdible: false,
    isNew: false,
    isHit: false,
    discount: 0,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "women",
  },
  {
    id: 7,
    name: "Фаллоимитатор Realistic King Size",
    brand: 8, // Doc Johnson
    price: 4200,
    oldPrice: 5000,
    images: [
      placeholderImages[6],
      placeholderImages[10],
      placeholderImages[13],
      placeholderImages[16],
    ],
    image: placeholderImages[6],
    rating: 4,
    reviews: 45,
    material: 2, // TPE
    color: 8, // Телесный
    length: "25", // Длина в см
    diameter: "5", // Диаметр в см
    vibrationModes: null, // Нет вибрации
    waterproof: "ipx4",
    hasHeating: false,
    motorCount: null, // Нет моторов
    aroma: null,
    isEdible: false,
    isNew: false,
    isHit: false,
    discount: 16,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "women",
  },
  {
    id: 8,
    name: "Лубрикант с ароматом ванили",
    brand: 5, // Fun Factory (как пример)
    price: 850,
    oldPrice: null,
    images: [
      placeholderImages[7],
      placeholderImages[11],
      placeholderImages[14],
      placeholderImages[17],
    ],
    image: placeholderImages[7],
    rating: 4,
    reviews: 89,
    material: 6, // Кибер-кожа (как заменитель для лубрикантов)
    color: 12, // Прозрачный
    length: null, // Не применимо
    diameter: null, // Не применимо
    vibrationModes: null, // Не применимо
    waterproof: null, // Не применимо
    hasHeating: false,
    motorCount: null,
    aroma: 1, // Ваниль
    isEdible: true, // Съедобный лубрикант
    isNew: true,
    isHit: false,
    discount: 0,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "couples",
  },
  {
    id: 9,
    name: "Вибромассажер LELO Smart Wand",
    brand: 1, // LELO
    price: 24000,
    oldPrice: 28000,
    images: [
      placeholderImages[8],
      placeholderImages[12],
      placeholderImages[15],
      placeholderImages[18],
    ],
    image: placeholderImages[8],
    rating: 5,
    reviews: 156,
    material: 1, // Медицинский силикон
    color: 2, // Черный
    length: "30", // Длина в см
    diameter: "4", // Диаметр в см
    vibrationModes: "15", // 15+ режимов
    waterproof: "full", // Полная защита
    hasHeating: true, // Есть функция нагрева
    motorCount: "3", // 3+ моторов
    aroma: null,
    isEdible: false,
    isNew: false,
    isHit: true,
    discount: 14,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "women",
  },
  {
    id: 10,
    name: "Набор для БДСМ Premium",
    brand: 5, // Fun Factory
    price: 15000,
    oldPrice: 18000,
    images: [
      placeholderImages[9],
      placeholderImages[13],
      placeholderImages[16],
      placeholderImages[19],
    ],
    image: placeholderImages[9],
    rating: 4,
    reviews: 78,
    material: 6, // Кибер-кожа
    color: 2, // Черный
    length: null, // Набор разных размеров
    diameter: null, // Набор разных размеров
    vibrationModes: null, // Не применимо
    waterproof: null, // Не применимо
    hasHeating: false,
    motorCount: null,
    aroma: null,
    isEdible: false,
    isNew: false,
    isHit: false,
    discount: 17,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "couples",
  },
  {
    id: 11,
    name: "Мини-вибратор Tenga Iroha",
    brand: 6, // Tenga
    price: 5500,
    oldPrice: null,
    images: [
      placeholderImages[10],
      placeholderImages[14],
      placeholderImages[17],
      placeholderImages[0],
    ],
    image: placeholderImages[10],
    rating: 4,
    reviews: 92,
    material: 1, // Медицинский силикон
    color: 7, // Зеленый
    length: "15", // Длина в см
    diameter: "3", // Диаметр в см
    vibrationModes: "7", // 7 режимов
    waterproof: "ipx7",
    hasHeating: false,
    motorCount: "1", // 1 мотор
    aroma: null,
    isEdible: false,
    isNew: true,
    isHit: false,
    discount: 0,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "women",
  },
  {
    id: 12,
    name: "Гель-лубрикант с клубничным вкусом",
    brand: 5, // Fun Factory
    price: 1200,
    oldPrice: null,
    images: [
      placeholderImages[11],
      placeholderImages[15],
      placeholderImages[18],
      placeholderImages[1],
    ],
    image: placeholderImages[11],
    rating: 3,
    reviews: 45,
    material: 6, // Кибер-кожа (заменитель для лубрикантов)
    color: 4, // Красный (клубничный)
    length: null,
    diameter: null,
    vibrationModes: null,
    waterproof: null,
    hasHeating: false,
    motorCount: null,
    aroma: 2, // Клубника
    isEdible: true, // Съедобный
    isNew: false,
    isHit: false,
    discount: 0,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "couples",
  },
]);

// Обновляем фильтрацию товаров с учетом всех новых полей
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Фильтр по цене
  if (priceMin.value) {
    filtered = filtered.filter((p) => p.price >= priceMin.value);
  }
  if (priceMax.value) {
    filtered = filtered.filter((p) => p.price <= priceMax.value);
  }

  // Фильтр по брендам (теперь по ID)
  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter((p) => selectedBrands.value.includes(p.brand));
  }

  // Фильтр по материалам (теперь по ID)
  if (selectedMaterials.value.length > 0) {
    filtered = filtered.filter((p) =>
      selectedMaterials.value.includes(p.material)
    );
  }

  // Фильтр по цветам (теперь по ID)
  if (selectedColors.value.length > 0) {
    filtered = filtered.filter((p) => selectedColors.value.includes(p.color));
  }

  // Фильтр по длине
  if (selectedLengths.value.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.length) return false; // Исключаем товары без длины
      return selectedLengths.value.includes(p.length);
    });
  }

  // Фильтр по диаметру
  if (selectedDiameters.value.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.diameter) return false; // Исключаем товары без диаметра
      return selectedDiameters.value.includes(p.diameter);
    });
  }

  // Фильтр по режимам вибрации
  if (selectedVibrationModes.value.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.vibrationModes) return false; // Исключаем товары без вибрации
      return selectedVibrationModes.value.includes(p.vibrationModes);
    });
  }

  // Фильтр по водонепроницаемости
  if (selectedWaterproofLevels.value.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.waterproof) return false; // Исключаем товары без водозащиты
      return selectedWaterproofLevels.value.includes(p.waterproof);
    });
  }

  // Фильтр по функции нагрева
  if (hasHeating.value) {
    filtered = filtered.filter((p) => p.hasHeating === true);
  }

  // Фильтр по количеству моторов
  if (selectedMotorCounts.value.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.motorCount) return false; // Исключаем товары без моторов
      return selectedMotorCounts.value.includes(p.motorCount);
    });
  }

  // Фильтр по аромату
  if (selectedAromas.value.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.aroma) return false; // Исключаем товары без аромата
      return selectedAromas.value.includes(p.aroma);
    });
  }

  // Фильтр съедобный
  if (isEdible.value) {
    filtered = filtered.filter((p) => p.isEdible === true);
  }

  // Дополнительные фильтры
  if (onlyInStock.value) {
    filtered = filtered.filter((p) => p.inStock);
  }

  if (onlyWithDiscount.value) {
    filtered = filtered.filter((p) => p.discount > 0);
  }

  if (onlyNew.value) {
    filtered = filtered.filter((p) => p.isNew);
  }

  return filtered;
});

// Функция для генерации дополнительных товаров
const generateAdditionalProducts = () => {
  const brands = [
    "LELO",
    "We-Vibe",
    "Satisfyer",
    "Womanizer",
    "Fun Factory",
    "SVAKOM",
    "Lovense",
    "OhMiBod",
    "Kiiroo",
    "Tenga",
    "Fleshlight",
    "Doc Johnson",
    "CalExotics",
    "Pipedream",
    "XSensual",
    "Bad Dragon",
    "Pure Romance",
    "Adam & Eve",
    "Spencer's",
    "Bondara",
  ];
  const materials = [
    "Медицинский силикон",
    "TPE",
    "ABS пластик",
    "Кибершкурка",
    "Стекло",
    "Металл",
    "PVC",
    "Латекс",
    "Кожа",
    "Текстиль",
  ];
  const colors = [
    "Розовый",
    "Черный",
    "Белый",
    "Красный",
    "Фиолетовый",
    "Синий",
    "Зеленый",
    "Телесный",
    "Прозрачный",
    "Золотой",
    "Серебристый",
    "Коричневый",
  ];
  const categories = ["women", "men", "couples"];

  const productNames = [
    "Вибратор Eclipse Premium",
    "Мастурбатор Elite Sensation",
    "Кольцо Thunder Power",
    "Анальная пробка Jewel Crown",
    "Стимулятор простаты ProMax",
    "Вибропуля Butterfly",
    "Фаллоимитатор RealTouch",
    "Клиторальный стимулятор Aurora",
    "Парный вибратор Harmony",
    "Страпон Commander",
    "Помпа для пениса PowerPump",
    "Вибратор-кролик Paradise",
    "Насадка-удлинитель Mega",
    "Анальные шарики Cascade",
    "Вибратор G-точки Seeker",
    "Мастурбатор Tornado",
    "Кольцо с вибрацией Storm",
    "Стимулятор сосков Thunder",
    "Вибратор-пуля Stealth",
    "Анальная пробка Comfort",
    "Фаллоимитатор Double Joy",
    "Клиторальный массажер Whisper",
    "Парное кольцо Unity",
    "Страпон Deluxe",
    "Помпа вакуумная Superior",
    "Вибратор многоскоростной Velocity",
    "Мастурбатор реалистичный Natural",
    "Анальный расширитель Progressive",
    "Стимулятор простаты Wave",
    "Вибропуля Remote Control",
    "Фаллоимитатор Realistic Pro",
    "Клиторальный вибратор Pulse",
    "Парный массажер Couple's Choice",
    "Страпон Professional",
    "Кольцо эрекционное Titan",
    "Анальная пробка с вибрацией Buzz",
    "Вибратор App-контроль Smart",
    "Мастурбатор автоматический Auto",
    "Стимулятор точки G Discovery",
    "Клиторальный стимулятор Gentle",
    "Парные игрушки Set Passion",
    "Вибратор водонепроницаемый Aqua",
    "Анальные шарики Progressive",
    "Фаллоимитатор с присоской Suction",
    "Кольцо вибрирующее Intense",
    "Стимулятор простаты Remote",
    "Вибропуля беспроводная Wireless",
    "Клиторальный массажер Soft",
    "Мастурбатор подогреваемый Warm",
    "Анальная пробка прогрессивная Growth",
    "Вибратор перезаряжаемый Rechargeable",
    "Парное кольцо Vibrating",
    "Страпон регулируемый Adjustable",
    "Помпа электрическая Electric",
    "Стимулятор сосков Magnetic",
    "Вибратор-бабочка Butterfly",
    "Мастурбатор вращающийся Rotating",
    "Анальный тренажер Training",
    "Фаллоимитатор гибкий Flexible",
    "Клиторальный стимулятор Pressure",
    "Парный вибратор Sync",
    "Кольцо задерживающее Delay",
    "Стимулятор простаты Targeted",
    "Вибропуля мини Compact",
    "Анальная пробка надувная Inflatable",
    "Вибратор пульсирующий Pulse",
    "Мастурбатор текстурированный Textured",
    "Клиторальный массажер Wave",
    "Парные наручники Restraint",
    "Страпон полый Hollow",
    "Помпа ручная Manual",
    "Стимулятор сосков Suction",
    "Вибратор-язычок Tongue",
    "Мастурбатор оральный Oral",
    "Анальный дилдо Progressive",
    "Фаллоимитатор двойной Double",
    "Клиторальный стимулятор Finger",
    "Парное кольцо Double",
    "Кольцо эластичное Stretchy",
    "Стимулятор простаты Curved",
    "Вибропуля на пульте Remote",
    "Анальная пробка металлическая Steel",
    "Вибратор изогнутый Curved",
    "Мастурбатор дорожный Travel",
    "Клиторальный массажер Gentle Touch",
    "Парный стимулятор Dual",
    "Страпон с дилдо Complete",
    "Помпа вибрирующая Vibrating",
    "Стимулятор сосков регулируемый Adjustable",
    "Вибратор-роза Rose",
    "Мастурбатор сквирт Squirting",
    "Анальный массажер Massage",
    "Фаллоимитатор светящийся Glow",
    "Клиторальный стимулятор Intense",
    "Парное яйцо Love Egg",
    "Кольцо светодиодное LED",
    "Стимулятор простаты умный Smart",
    "Вибропуля с пультом RC",
    "Анальная пробка с хвостом Tail",
    "Вибратор-дельфин Dolphin",
    "Мастурбатор VR Virtual",
    "Клиторальный массажер Sonic",
    "Парный набор Couple Kit",
    "Страпон женский Female",
    "Помпа автоматическая Auto",
    "Стимулятор сосков вибро Vibro",
    "Вибратор-зайчик Bunny",
    "Мастурбатор интерактивный Interactive",
    "Анальный расширитель Set",
    "Фаллоимитатор реалистичный Ultra Real",
    "Клиторальный стимулятор Air",
    "Парные трусики Vibrating Panties",
  ];

  const additionalProducts = [];

  for (let i = 26; i <= 125; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const productName = productNames[(i - 26) % productNames.length];

    const basePrice = Math.floor(Math.random() * 20000) + 1000;
    const hasDiscount = Math.random() > 0.7;
    const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
    const oldPrice = hasDiscount
      ? Math.floor(basePrice * (1 + discount / 100))
      : null;

    additionalProducts.push({
      id: i,
      name: productName + ` ${brand}`,
      brand: brand,
      price: basePrice,
      oldPrice: oldPrice,
      images: [
        placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
        placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
        placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
        placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
      ],
      image:
        placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
      rating: Math.floor(Math.random() * 5) + 1,
      reviews: Math.floor(Math.random() * 300) + 5,
      material: material,
      color: color,
      isNew: Math.random() > 0.85,
      isHit: Math.random() > 0.9,
      discount: discount,
      inStock: Math.random() > 0.1,
      inWishlist: false,
      inCompare: false,
      category: category,
    });
  }

  return additionalProducts;
};

// Добавляем дополнительные товары к основному массиву
products.value.push(...generateAdditionalProducts());

// Инициализация состояний загрузки изображений
products.value.forEach((product) => {
  imageLoadingStates.value[product.id] = true;
  imageErrorStates.value[product.id] = false;
});

// Вычисляемые свойства
const availableBrands = computed(() => {
  return [...new Set(products.value.map((p) => p.brand))].sort();
});

const materials = computed(() => {
  return [...new Set(products.value.map((p) => p.material))].sort();
});

const colors = computed(() => {
  return [
    { name: "Розовый", hex: "#ec4899" },
    { name: "Фиолетовый", hex: "#8b5cf6" },
    { name: "Черный", hex: "#1f2937" },
    { name: "Белый", hex: "#f9fafb" },
    { name: "Красный", hex: "#ef4444" },
    { name: "Синий", hex: "#3b82f6" },
    { name: "Телесный", hex: "#fbbf24" },
    { name: "Серебристый", hex: "#94a3b8" },
  ];
});

// Сортировка
const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value];

  switch (sortBy.value) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    default:
      return sorted.sort((a, b) => b.reviews - a.reviews);
  }
});

// Пагинация
const totalPages = computed(() => {
  return Math.ceil(sortedProducts.value.length / itemsPerPage.value);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedProducts.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i);
      }
    }
  }

  return pages;
});

const hasActiveFilters = computed(() => {
  return (
    priceMin.value ||
    priceMax.value ||
    selectedBrands.value.length > 0 ||
    selectedMaterials.value.length > 0 ||
    selectedColors.value.length > 0 ||
    selectedLengths.value.length > 0 ||
    selectedDiameters.value.length > 0 ||
    selectedVibrationModes.value.length > 0 ||
    selectedWaterproofLevels.value.length > 0 ||
    hasHeating.value ||
    selectedMotorCounts.value.length > 0 ||
    selectedAromas.value.length > 0 ||
    isEdible.value ||
    onlyInStock.value ||
    onlyWithDiscount.value ||
    onlyNew.value
  );
});

// Методы
const applyPriceFilter = () => {
  currentPage.value = 1;
};

const resetFilters = () => {
  console.log("🔄 Сбрасываем все фильтры");

  priceMin.value = null;
  priceMax.value = null;
  selectedBrands.value = [];
  selectedMaterials.value = [];
  selectedColors.value = [];
  selectedLengths.value = [];
  selectedDiameters.value = [];
  selectedVibrationModes.value = [];
  selectedWaterproofLevels.value = [];
  hasHeating.value = false;
  selectedMotorCounts.value = [];
  selectedAromas.value = [];
  isEdible.value = false;
  onlyInStock.value = false;
  onlyWithDiscount.value = false;
  onlyNew.value = false;
  currentPage.value = 1;

  // Анимация сброса
  gsap.fromTo(
    ".filter-group",
    {
      scale: 0.95,
      opacity: 0.7,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      stagger: 0.1,
    }
  );

  console.log("✅ Все фильтры сброшены");
};

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    console.log("📄 Переходим на страницу:", page);

    // Включаем состояние загрузки для смены страницы
    isFilterLoading.value = true;

    // Имитируем время загрузки новой страницы
    await new Promise((resolve) => setTimeout(resolve, 400));

    currentPage.value = page;

    // Выключаем состояние загрузки
    isFilterLoading.value = false;

    // Ждем следующий tick для обновления DOM
    await nextTick();

    // Анимация появления новых карточек
    gsap.fromTo(
      ".product-card",
      {
        y: 30,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
      }
    );

    console.log("✅ Страница загружена:", page);
  }
};

const changeViewMode = (mode) => {
  if (viewMode.value !== mode) {
    viewMode.value = mode;

    // Анимация смены режима просмотра
    gsap.fromTo(
      ".product-card",
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
      }
    );
  }
};

const applySorting = () => {
  currentPage.value = 1;

  // Анимация сортировки
  gsap.fromTo(
    ".product-card",
    {
      y: -20,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.05,
    }
  );
};

const toggleCategory = (category) => {
  expandedCategories.value[category] = !expandedCategories.value[category];

  // Анимация раскрытия категории
  const categoryElement = document.querySelector(
    `[data-category="${category}"] .category-list`
  );
  if (categoryElement) {
    if (expandedCategories.value[category]) {
      gsap.fromTo(
        categoryElement,
        {
          height: 0,
          opacity: 0,
        },
        {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        }
      );
    }
  }
};

const toggleWishlist = (product) => {
  product.inWishlist = !product.inWishlist;

  // Анимация сердечка
  const heartButton = document.querySelector(
    `[data-product-id="${product.id}"] .action-button`
  );
  if (heartButton) {
    gsap.to(heartButton, {
      scale: 1.2,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  }
};

const toggleCompare = (product) => {
  product.inCompare = !product.inCompare;
};

const addToCart = (product) => {
  // Анимация добавления в корзину
  const button = document.querySelector(
    `[data-product-id="${product.id}"] .cart-button`
  );
  if (button) {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        // Здесь можно добавить логику добавления в корзину
        console.log("Товар добавлен в корзину:", product.name);
      },
    });
  }
};

const toggleColorFilter = (colorName) => {
  const index = selectedColors.value.indexOf(colorName);
  if (index > -1) {
    selectedColors.value.splice(index, 1);
  } else {
    selectedColors.value.push(colorName);
  }
  currentPage.value = 1;
};

const handleImageLoad = (productId) => {
  imageLoadingStates.value[productId] = false;
  imageErrorStates.value[productId] = false;

  // Анимация появления изображения
  nextTick(() => {
    const img = document.querySelector(
      `[data-product-id="${productId}"] .product-image`
    );
    if (img) {
      gsap.fromTo(
        img,
        {
          scale: 1.1,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  });
};

const handleImageError = (productId) => {
  imageLoadingStates.value[productId] = false;
  imageErrorStates.value[productId] = true;

  // Устанавливаем запасное изображение
  const img = document.querySelector(
    `[data-product-id="${productId}"] .product-image`
  );
  if (img) {
    img.src =
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  }
};

const setProductCardRef = (el, index) => {
  if (el) {
    productCardRefs.value[index] = el;
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

const getProductsWord = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "товар";
  } else if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  ) {
    return "товара";
  } else {
    return "товаров";
  }
};

const onProductHover = () => {
  // Анимация при наведении на товар
};

const onProductLeave = () => {
  // Анимация при уходе курсора с товара
};

// Инициализация GSAP анимаций
const initGSAPAnimations = () => {
  // Анимация появления карточек товаров
  gsap.fromTo(
    ".product-card",
    {
      y: 50,
      opacity: 0,
      scale: 0.9,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".product-grid-4, .product-grid-3",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Анимация фильтров
  gsap.fromTo(
    ".filter-card",
    {
      x: -50,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".filter-card",
        start: "top 85%",
      },
    }
  );

  // Анимация заголовка
  gsap.fromTo(
    ".catalog-header",
    {
      y: -30,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    }
  );

  // Анимация hover эффектов для карточек
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    const image = card.querySelector(".product-image");
    const actions = card.querySelector(".product-actions");

    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(image, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(actions, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(image, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(actions, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
};

// Хук монтирования
onMounted(async () => {
  // Симуляция начальной загрузки
  setTimeout(() => {
    isInitialLoading.value = false;

    // Инициализация анимаций после загрузки
    nextTick(() => {
      initGSAPAnimations();
    });
  }, 1500);
});

// Обработчики событий компонента ProductCard
const shareProduct = (product) => {
  console.log("Поделиться товаром:", product.name);

  // Создаем URL для шаринга товара
  const shareUrl = `${window.location.origin}/product/${product.id}`;
  const shareText = `Посмотрите на этот товар: ${
    product.name
  } - всего ${formatPrice(product.price)} ₽!`;

  // Проверяем поддержку Web Share API
  if (navigator.share) {
    navigator
      .share({
        title: product.name,
        text: shareText,
        url: shareUrl,
      })
      .then(() => console.log("Товар успешно поделен"))
      .catch((error) => {
        console.error("Ошибка при шаринге:", error);
        // Fallback к копированию в буфер обмена
        copyToClipboard(shareUrl);
      });
  } else {
    // Fallback для браузеров без поддержки Web Share API
    copyToClipboard(shareUrl);
  }
};

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showShareNotification("Ссылка скопирована в буфер обмена!");
      })
      .catch(() => {
        showShareModal(text);
      });
  } else {
    // Fallback для старых браузеров
    showShareModal(text);
  }
};

const showShareNotification = (message) => {
  // Создаем временное уведомление
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.className =
    "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
  document.body.appendChild(notification);

  // Убираем уведомление через 3 секунды
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
};

const showShareModal = (url) => {
  // Простой alert как fallback
  const userConfirmed = confirm(
    `Скопируйте ссылку для шаринга:\n${url}\n\nНажмите OK чтобы закрыть`
  );
  if (userConfirmed) {
    console.log("Модальное окно закрыто пользователем");
  }
};

const openQuickView = (product) => {
  console.log("Быстрый просмотр товара:", product.name);
  // Здесь будет логика открытия модального окна быстрого просмотра
  alert(
    `Быстрый просмотр: ${product.name}\nЦена: ${formatPrice(
      product.price
    )} ₽\nРейтинг: ${product.rating}/5`
  );
};

const openProductDetails = (product) => {
  console.log("Переход к странице товара:", product.name);
  // В реальном приложении здесь будет роутинг к странице товара
  // this.$router.push(`/product/${product.id}`);
  alert(`Переход к товару: ${product.name}\nID: ${product.id}`);
};

const handleSortingChange = async (newSortBy) => {
  console.log("🔄 Изменяем сортировку:", newSortBy);

  // Включаем состояние загрузки фильтров
  isFilterLoading.value = true;

  // Имитируем время обработки сортировки (как в реальном API)
  await new Promise((resolve) => setTimeout(resolve, 600));

  sortBy.value = newSortBy;
  applySorting();

  // Выключаем состояние загрузки
  isFilterLoading.value = false;

  // Ждем следующий tick для обновления DOM
  await nextTick();

  // Анимация появления отсортированных карточек
  gsap.fromTo(
    ".product-card",
    {
      y: 20,
      opacity: 0,
      scale: 0.95,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.06,
      ease: "power2.out",
    }
  );

  console.log("✅ Сортировка применена:", newSortBy);
};

// Новые методы для работы с AdultToysFilters
const updateFilters = (filters) => {
  console.log("🔧 Обновляем фильтры:", filters);

  // Обновляем локальные переменные из компонента фильтров
  if (filters.priceMin !== undefined) priceMin.value = filters.priceMin;
  if (filters.priceMax !== undefined) priceMax.value = filters.priceMax;
  if (filters.selectedBrands !== undefined)
    selectedBrands.value = filters.selectedBrands;
  if (filters.selectedMaterials !== undefined)
    selectedMaterials.value = filters.selectedMaterials;
  if (filters.selectedColors !== undefined)
    selectedColors.value = filters.selectedColors;
  if (filters.selectedLengths !== undefined)
    selectedLengths.value = filters.selectedLengths;
  if (filters.selectedDiameters !== undefined)
    selectedDiameters.value = filters.selectedDiameters;
  if (filters.selectedVibrationModes !== undefined)
    selectedVibrationModes.value = filters.selectedVibrationModes;
  if (filters.selectedWaterproofLevels !== undefined)
    selectedWaterproofLevels.value = filters.selectedWaterproofLevels;
  if (filters.hasHeating !== undefined) hasHeating.value = filters.hasHeating;
  if (filters.selectedMotorCounts !== undefined)
    selectedMotorCounts.value = filters.selectedMotorCounts;
  if (filters.selectedAromas !== undefined)
    selectedAromas.value = filters.selectedAromas;
  if (filters.isEdible !== undefined) isEdible.value = filters.isEdible;
  if (filters.onlyInStock !== undefined)
    onlyInStock.value = filters.onlyInStock;
  if (filters.onlyWithDiscount !== undefined)
    onlyWithDiscount.value = filters.onlyWithDiscount;
  if (filters.onlyNew !== undefined) onlyNew.value = filters.onlyNew;

  currentPage.value = 1; // Сбрасываем на первую страницу при изменении фильтров
  console.log(
    "✅ Фильтры применены, найдено товаров:",
    filteredProducts.value.length
  );
};

const applyFilters = async (filters) => {
  console.log("🎯 Применяем фильтры:", filters);

  // Включаем состояние загрузки фильтров
  isFilterLoading.value = true;

  // Имитируем время обработки фильтров (как в реальном API)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Применяем фильтры и обновляем состояние
  updateFilters(filters);

  // Выключаем состояние загрузки
  isFilterLoading.value = false;

  // Ждем следующий tick для обновления DOM
  await nextTick();

  // Анимация появления отфильтрованных карточек с GSAP
  gsap.fromTo(
    ".product-card",
    {
      y: 30,
      opacity: 0,
      scale: 0.9,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
    }
  );

  console.log(
    "🎉 Фильтрация завершена, показано товаров:",
    filteredProducts.value.length
  );
};
</script>

<style scoped>
/* Основные стили каталога */
.min-h-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
}

/* Skeleton анимации */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

/* Переходы для контента */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Стили для хлебных крошек */
.breadcrumbs {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.breadcrumbs ol li a {
  transition: all 0.3s ease;
}

.breadcrumbs ol li a:hover {
  color: #ec4899;
  transform: translateY(-1px);
}

/* Фильтры */
.filter-group {
  transition: all 0.3s ease;
}

.filter-group:hover {
  transform: translateY(-2px);
}

.filter-input {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
}

.filter-input:focus {
  transform: scale(1.02);
}

.filter-checkbox {
  transition: all 0.3s ease;
}

.filter-checkbox:hover {
  background: rgba(236, 72, 153, 0.05);
  transform: translateX(4px);
}

/* Категории */
.category-header {
  transition: all 0.3s ease;
}

.category-header:hover {
  background: rgba(236, 72, 153, 0.1);
  transform: translateX(4px);
}

.category-list {
  transform: translateY(-10px);
  opacity: 0;
  transition: all 0.4s ease;
}

.category-list.open {
  transform: translateY(0);
  opacity: 1;
}

/* Сетка товаров */
.product-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  transition: all 0.4s ease;
}

.product-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  transition: all 0.4s ease;
}

/* Карточки товаров */
.product-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.product-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(236, 72, 153, 0.1),
    rgba(139, 92, 246, 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.product-card:hover::before {
  opacity: 1;
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(236, 72, 153, 0.15);
}

/* Контейнер изображения */
.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  object-fit: cover;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

/* Лоадер изображения */
.image-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%);
}

.loading-spinner {
  border-width: 3px;
}

/* Бейджи */
.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.badge-new {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.badge-discount {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.badge-hit {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.product-card:hover .badge {
  transform: scale(1.1) rotate(-2deg);
}

/* Кнопки действий */
.product-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateY(0);
}

.action-button {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.action-button:hover {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

/* Рейтинг */
.rating-stars {
  display: flex;
  gap: 1px;
}

.star {
  transition: all 0.2s ease;
}

.product-card:hover .star {
  transform: scale(1.1);
}

/* Кнопка корзины */
.cart-button {
  background: linear-gradient(135deg, #ec4899, #be185d);
  color: white;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.cart-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.cart-button:hover::before {
  left: 100%;
}

.cart-button:hover {
  background: linear-gradient(135deg, #be185d, #9d174d);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
}

/* Переключатель видов */
.view-toggle-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.view-toggle-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.3s ease;
}

.view-toggle-button.active::before {
  left: 100%;
}

.view-toggle-button:hover {
  transform: scale(1.05);
}

.view-active {
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3) !important;
}

/* Кастомные цвета для фокуса */
.focus\:ring-custom-pink:focus {
  --tw-ring-color: rgba(255, 107, 157, 0.5);
}

.focus\:border-custom-pink:focus {
  border-color: #ff6b9d;
}

/* Сортировка */
.sort-select {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.sort-select:focus {
  transform: scale(1.02);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
}

/* Пагинация */
.pagination-button {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pagination-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pagination-button.active {
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  color: white;
  border-color: #ff6b9d;
  transform: scale(1.1);
}

/* Цветовые фильтры */
.color-option {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.color-option::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b9d, #8b5cf6);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.color-option:hover::before,
.color-option.selected::before {
  opacity: 1;
}

.color-option:hover {
  transform: scale(1.2);
}

.color-option.selected {
  transform: scale(1.15);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.3);
}

/* Пустое состояние */
.empty-state {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 3rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* Адаптивность */
@media (max-width: 1200px) {
  .product-grid-4 {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  .product-grid-3 {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .product-grid-4,
  .product-grid-3 {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .product-actions {
    opacity: 1;
    transform: translateY(0);
  }

  .action-button {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 640px) {
  .product-grid-4,
  .product-grid-3 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .product-card {
    border-radius: 12px;
  }

  .badge {
    font-size: 9px;
    padding: 3px 6px;
  }
}

/* Анимации появления */
.fade-up-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Кастомный скроллбар */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ff6b9d, #8b5cf6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #ff5a8a, #7c3aed);
}

/* Эффекты загрузки */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 107, 157, 0.1),
    rgba(139, 92, 246, 0.1)
  );
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

/* Hover эффекты для чекбоксов */
input[type="checkbox"] {
  transition: all 0.3s ease;
}

input[type="checkbox"]:checked {
  transform: scale(1.1);
}

/* Анимация для слайдеров */
input[type="range"] {
  background: linear-gradient(to right, #ff6b9d 0%, #e5e7eb 0%);
  border-radius: 5px;
  height: 6px;
  outline: none;
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 107, 157, 0.3);
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.5);
}

/* Дополнительные анимации GSAP */
.gsap-fade-in {
  opacity: 0;
  transform: translateY(30px);
}

.gsap-scale-in {
  opacity: 0;
  transform: scale(0.8);
}

.gsap-slide-left {
  opacity: 0;
  transform: translateX(-50px);
}

.gsap-slide-right {
  opacity: 0;
  transform: translateX(50px);
}

/* Эффекты при наведении на фильтры */
.filter-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.filter-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
}

/* Стили для кнопок фильтров */
.filter-apply-btn {
  background: linear-gradient(135deg, #ec4899, #be185d);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.filter-apply-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.filter-apply-btn:hover::before {
  left: 100%;
}

.filter-apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
}

.filter-reset-btn {
  transition: all 0.3s ease;
}

.filter-reset-btn:hover {
  color: #ec4899;
  transform: scale(1.05);
}

/* Дополнительные стили для каталога */
.catalog-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.catalog-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.reset-filters-btn {
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.reset-filters-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.reset-filters-btn:hover::before {
  left: 100%;
}

.reset-filters-btn:hover {
  background: linear-gradient(135deg, #ff5a8a, #ff7ba7);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
}

/* Улучшенный отступ для main контента */
.catalog-main {
  flex: 1;
  min-width: 0; /* Предотвращает переполнение */
  width: calc(100% - 324px); /* 300px + 24px gap */
}

/* Липкие фильтры - как на pinkrabbit.ru */
.sticky-sidebar {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  z-index: 10;
  /* Фиксированная ширина для правильного отображения */
  width: 300px;
  min-width: 300px;
  flex-shrink: 0;
  /* Стилизация скроллбара */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 107, 157, 0.3) transparent;
}

/* Aside внутри sticky-sidebar должен занимать всю ширину */
.sticky-sidebar aside {
  width: 100% !important;
  min-width: 100%;
}

/* Скрытие скроллбара для webkit браузеров */
.sticky-sidebar::-webkit-scrollbar {
  width: 6px;
}

.sticky-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sticky-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 107, 157, 0.3);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.sticky-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 107, 157, 0.5);
}

/* Основной контент занимает оставшееся место */
.catalog-main {
  flex: 1;
  min-width: 0; /* Предотвращает переполнение */
  width: calc(100% - 324px); /* 300px + 24px gap */
}

/* Адаптивное поведение для планшетов */
@media (max-width: 1280px) {
  .sticky-sidebar {
    width: 280px;
    min-width: 280px;
  }

  .catalog-main {
    width: calc(100% - 304px); /* 280px + 24px gap */
  }
}

/* Адаптивное поведение для мобильных устройств */
@media (max-width: 1024px) {
  .sticky-sidebar {
    position: static;
    max-height: none;
    overflow-y: visible;
    width: 100%;
    min-width: 100%;
    flex-shrink: 1;
  }

  .catalog-main {
    width: 100%;
  }
}

/* Дополнительные стили для корректного отображения на мобильных */
@media (max-width: 768px) {
  .sticky-sidebar aside {
    width: 100% !important;
  }
}
</style>
