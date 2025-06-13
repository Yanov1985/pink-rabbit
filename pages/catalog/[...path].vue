<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Хлебные крошки для навигации -->
    <nav class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-3">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">
              Главная
            </NuxtLink>
          </li>
          <li class="text-gray-400">/</li>
          <li>
            <NuxtLink to="/catalog" class="text-gray-500 hover:text-gray-700">
              Каталог
            </NuxtLink>
          </li>
          <!-- Динамические хлебные крошки -->
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <li class="text-gray-400">/</li>
            <li>
              <NuxtLink
                v-if="index < breadcrumbs.length - 1"
                :to="crumb.url"
                class="text-gray-500 hover:text-gray-700"
              >
                {{ crumb.name }}
              </NuxtLink>
              <span v-else class="text-gray-900 font-medium">
                {{ crumb.name }}
              </span>
            </li>
          </template>
        </ol>
      </div>
    </nav>

    <!-- Заголовок каталога -->
    <CatalogHeader
      :category-title="pageTitle"
      :total-count="totalProducts"
      :view-mode="viewMode"
      :sort-by="sortBy"
      :is-loading="isLoading"
      @change-view-mode="handleViewModeChange"
      @change-sorting="handleSortChange"
    />

    <!-- Основной контент -->
    <div class="container mx-auto px-4 py-6">
      <!-- Основная сетка с фильтрами и контентом -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Боковая панель с фильтрами (только если есть товары) -->
        <aside v-if="showFilters" class="lg:col-span-1">
          <div class="sticky top-4">
            <AdultToysFilters
              :category-path="categoryPath"
              :filters="availableFilters"
              @filter-change="handleFilterChange"
            />
          </div>
        </aside>

        <!-- Основной контент -->
        <main :class="showFilters ? 'lg:col-span-3' : 'lg:col-span-4'">
          <!-- Подкатегории (если есть) - используем UniversalCategoryGrid -->
          <UniversalCategoryGrid
            v-if="subcategories.length > 0"
            :categories="subcategories"
            :section-title="getSubcategoryTitle()"
            :section-description="getSubcategoryDescription()"
            :is-loading="isLoading"
            @category-click="handleCategoryClick"
            @category-hover="handleCategoryHover"
          />

          <!-- Товары -->
          <div v-if="showProducts">
            <!-- Загрузка товаров -->
            <div
              v-if="isLoading"
              class="grid gap-6"
              :class="getProductGridClass()"
            >
              <ProductSkeleton v-for="n in 12" :key="n" />
            </div>

            <!-- Сетка товаров -->
            <div
              v-else-if="products.length > 0"
              class="grid gap-6"
              :class="getProductGridClass()"
            >
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                @add-to-cart="handleAddToCart"
                @add-to-favorites="handleAddToFavorites"
                @quick-view="handleQuickView"
              />
            </div>

            <!-- Пустое состояние -->
            <div v-else-if="!isLoading" class="text-center py-12">
              <div class="text-6xl mb-4">🛍️</div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                Товары не найдены
              </h3>
              <p class="text-gray-600 mb-6">
                В данной категории пока нет товаров или они не соответствуют
                выбранным фильтрам
              </p>
              <button
                @click="resetFilters"
                class="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>

            <!-- Пагинация -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
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
                  v-for="page in displayedPages"
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
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
// Импорт компонентов
import AdultToysFilters from "~/components/categories/sexIgrushki/AdultToysFilters.vue";
import UniversalCategoryGrid from "~/components/categories/sexIgrushki/UniversalCategoryGrid.vue";
import CatalogHeader from "~/components/categories/sexIgrushki/CatalogHeader.vue";
import ProductCard from "~/components/categories/sexIgrushki/ProductCard.vue";
import ProductSkeleton from "~/components/categories/sexIgrushki/ProductSkeleton.vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

// Композаблы и утилиты
const {
  parseCategoryPath,
  getCategoryProducts,
  getCategoryFilters,
  getCategorySEO,
} = useCatalog();
const route = useRoute();
const router = useRouter();

// Получаем путь из роута
const categoryPath = computed(() => {
  return Array.isArray(route.params.path)
    ? route.params.path
    : [route.params.path].filter(Boolean);
});

// Разбираем путь категории
const categoryInfo = computed(() => {
  return (
    parseCategoryPath(categoryPath.value) || {
      breadcrumbs: [],
      availableSubcategories: [],
    }
  );
});

// Хлебные крошки
const breadcrumbs = computed(() => categoryInfo.value.breadcrumbs || []);

// Подкатегории
const subcategories = computed(() => {
  const subs = categoryInfo.value.availableSubcategories || [];
  console.log("Computed subcategories:", subs);
  console.log("Subcategories length:", subs.length);
  return subs;
});

// Заголовок и описание страницы
const pageTitle = computed(() => {
  if (breadcrumbs.value.length === 0) {
    return "Каталог товаров";
  }
  return breadcrumbs.value[breadcrumbs.value.length - 1].name;
});

const pageDescription = computed(() => {
  if (breadcrumbs.value.length === 0) {
    return "Широкий выбор качественных товаров для взрослых";
  }
  const lastCategory = breadcrumbs.value[breadcrumbs.value.length - 1];
  return `Качественные товары категории "${lastCategory.name}" с доставкой по всей России`;
});

// Название текущей категории для отображения товаров
const currentCategoryName = computed(() => {
  return breadcrumbs.value.length > 0
    ? breadcrumbs.value[breadcrumbs.value.length - 1].name
    : "каталога";
});

// Показывать ли фильтры (только если есть товары для отображения)
const showFilters = computed(() => {
  return subcategories.value.length === 0 || categoryPath.value.length >= 2;
});

// Показывать ли товары
const showProducts = computed(() => {
  console.log("🔍 Проверка showProducts:", {
    categoryPathLength: categoryPath.value.length,
    subcategoriesLength: subcategories.value.length,
    categoryPath: categoryPath.value,
  });

  // Если нет пути - не показываем товары
  if (categoryPath.value.length === 0) {
    console.log("❌ Нет пути категории");
    return false;
  }

  // Если есть подкатегории и путь короткий - показываем подкатегории
  if (subcategories.value.length > 0 && categoryPath.value.length < 3) {
    console.log("📁 Показываем подкатегории, товары скрыты");
    return false;
  }

  // В остальных случаях показываем товары
  console.log("✅ Показываем товары");
  return true;
});

// Реактивные данные
const isLoading = ref(true);
const products = ref([]);
const totalProducts = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const availableFilters = ref({});
const appliedFilters = ref({});

// Новые реактивные данные для компонентов
const viewMode = ref("grid"); // 'grid' или 'list'
const sortBy = ref("popular");

// Функция загрузки данных категории
const loadCategoryData = async () => {
  isLoading.value = true;

  try {
    // Загружаем фильтры
    availableFilters.value = getCategoryFilters(categoryPath.value);

    // Загружаем товары только если нужно их показывать
    if (showProducts.value) {
      const result = await getCategoryProducts(
        categoryPath.value,
        appliedFilters.value,
        sortBy.value
      );

      products.value = result.products;
      totalProducts.value = result.totalCount;
      currentPage.value = result.currentPage;
      totalPages.value = result.totalPages;
    }
  } catch (error) {
    console.error("Ошибка загрузки данных категории:", error);
  } finally {
    isLoading.value = false;
  }
};

// Загрузка данных при изменении пути
watch(
  [categoryPath, appliedFilters, sortBy, currentPage],
  async () => {
    await loadCategoryData();
  },
  { immediate: true }
);

// Другие функции
const handleFilterChange = (newFilters) => {
  appliedFilters.value = newFilters;
  currentPage.value = 1; // Сбрасываем на первую страницу при изменении фильтров
};

const handleSortChange = (sort) => {
  sortBy.value = sort;
  console.log("Изменена сортировка:", sort);
  // Здесь можно добавить логику перезагрузки товаров с новой сортировкой
  loadProducts();
};

const resetFilters = () => {
  appliedFilters.value = {};
  console.log("Фильтры сброшены");
  loadProducts();
};

const navigateToSubcategory = (subcategorySlug) => {
  const newPath = [...categoryPath.value, subcategorySlug].join("/");
  router.push(`/catalog/${newPath}`);
};

const changePage = (page) => {
  currentPage.value = page;
  // Прокручиваем в начало списка товаров
  window.scrollTo({ top: 300, behavior: "smooth" });
};

// Вычисляемые страницы для пагинации
const displayedPages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

// Утилиты
const formatPrice = (price) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

const getCategoryIcon = (type) => {
  const icons = {
    gender: "👤",
    product_type: "🛍️",
    subtype: "📦",
    main: "🏪",
  };
  return icons[type] || "📁";
};

const getSubcategoryTitle = () => {
  const lastBreadcrumb = breadcrumbs.value[breadcrumbs.value.length - 1];
  if (!lastBreadcrumb) return "Категории";

  switch (lastBreadcrumb.type) {
    case "main":
      return "Выберите категорию";
    case "gender":
      return "Типы товаров";
    case "product_type":
      return "Подкатегории";
    default:
      return "Категории";
  }
};

const getSubcategoryDescription = () => {
  const lastBreadcrumb = breadcrumbs.value[breadcrumbs.value.length - 1];
  if (!lastBreadcrumb) return "Описание категории";

  switch (lastBreadcrumb.type) {
    case "main":
      return "Выберите подкатегорию для просмотра товаров";
    case "gender":
      return "Выберите тип товара для просмотра подкатегорий";
    case "product_type":
      return "Выберите подкатегорию для просмотра товаров";
    default:
      return "Описание категории";
  }
};

// SEO мета-теги
const seoData = computed(() => getCategorySEO(categoryPath.value));

useHead({
  title: () => seoData.value.title,
  meta: [
    { name: "description", content: () => seoData.value.description },
    { name: "keywords", content: () => seoData.value.keywords },
  ],
});

// Методы для работы с компонентами
const handleViewModeChange = (mode) => {
  viewMode.value = mode;
  console.log("Изменен режим просмотра:", mode);
};

const handleCategoryClick = (category) => {
  console.log("Клик по категории:", category);
  // Навигация к подкатегории
  if (category.slug) {
    // Формируем новый путь на основе текущего пути и slug категории
    const newPathSegments = [...categoryPath.value, category.slug];
    const newPath = newPathSegments.join("/");
    console.log("Переход к:", `/catalog/${newPath}`);
    navigateTo(`/catalog/${newPath}`);
  }
};

const handleCategoryHover = (category) => {
  console.log("Наведение на категорию:", category);
  // Можно добавить предзагрузку данных категории
};

const handleAddToCart = (product) => {
  console.log("Добавление в корзину:", product);
  // Здесь будет логика добавления в корзину
};

const handleAddToFavorites = (product) => {
  console.log("Добавление в избранное:", product);
  // Здесь будет логика добавления в избранное
};

const handleQuickView = (product) => {
  console.log("Быстрый просмотр:", product);
  // Здесь будет логика быстрого просмотра товара
};

const getProductGridClass = () => {
  if (viewMode.value === "list") {
    return "grid-cols-1 gap-4";
  }
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
};

const loadProducts = () => {
  // Здесь можно добавить логику загрузки товаров с новой сортировкой
  loadCategoryData();
};
</script>

<style scoped>
/* Стили для ограничения количества строк */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Стили для анимации загрузки */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Стили для адаптивного изображения */
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

/* === СТИЛИ ПАГИНАЦИИ === */
/* Пагинация в стиле главной страницы */
.pagination-button {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pagination-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pagination-button.active {
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  color: white;
  border-color: #ff6b9d;
  transform: scale(1.1);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Адаптивность для пагинации */
@media (max-width: 640px) {
  .pagination-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-width: 32px;
  }
}
</style>
