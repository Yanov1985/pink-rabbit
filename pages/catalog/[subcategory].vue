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
          <!-- Динамические крошки для вложенных категорий -->
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

    <!-- Основной контент -->
    <div class="container mx-auto px-4 py-6">
      <!-- Заголовок страницы -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          {{ pageTitle }}
        </h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          {{ pageDescription }}
        </p>
      </div>

      <!-- Сетка с фильтрами и товарами -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Боковая панель с фильтрами -->
        <aside class="lg:col-span-1">
          <div class="sticky top-4">
            <!-- Компонент фильтров -->
            <AdultToysFilters
              :subcategory="currentSubcategory"
              :filters="availableFilters"
              @filter-change="handleFilterChange"
            />
          </div>
        </aside>

        <!-- Основной контент -->
        <main class="lg:col-span-3">
          <!-- Если это подкатегория с саб-категориями - показываем карточки категорий -->
          <div
            v-if="showSubcategories && subcategories.length > 0"
            class="mb-12"
          >
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Подкатегории</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="subcategory in subcategories"
                :key="subcategory.id"
                class="group cursor-pointer"
                @click="navigateToSubcategory(subcategory.slug)"
              >
                <div
                  class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-pink-100 to-purple-100"
                  >
                    <img
                      v-if="subcategory.image"
                      :src="subcategory.image"
                      :alt="subcategory.name"
                      class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      v-else
                      class="w-full h-40 flex items-center justify-center"
                    >
                      <div class="w-12 h-12 text-pink-400">💖</div>
                    </div>
                  </div>
                  <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                      {{ subcategory.name }}
                    </h3>
                    <p class="text-gray-600 text-sm mb-4">
                      {{ subcategory.description }}
                    </p>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-500">
                        {{ subcategory.productCount }} товаров
                      </span>
                      <div class="w-5 h-5 text-pink-500">→</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Заголовок списка товаров -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">
              Товары {{ pageTitle.toLowerCase() }}
            </h2>

            <!-- Сортировка -->
            <select
              v-model="sortBy"
              @change="handleSortChange"
              class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="popular">По популярности</option>
              <option value="price_asc">По цене (возрастание)</option>
              <option value="price_desc">По цене (убывание)</option>
              <option value="rating">По рейтингу</option>
              <option value="newest">Новинки</option>
            </select>
          </div>

          <!-- Сетка товаров -->
          <div
            v-if="isLoading"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <!-- Скелетоны для загрузки -->
            <div
              v-for="n in 9"
              :key="n"
              class="bg-white rounded-lg shadow-md p-4 animate-pulse"
            >
              <div class="bg-gray-300 h-48 rounded-md mb-4"></div>
              <div class="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
              <div class="bg-gray-300 h-4 rounded w-1/2 mb-4"></div>
              <div class="bg-gray-300 h-6 rounded w-1/4"></div>
            </div>
          </div>

          <div
            v-else-if="products.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <!-- Карточки товаров -->
            <div
              v-for="product in products"
              :key="product.id"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <NuxtLink :to="`/product/${product.slug}`" class="block">
                <div class="aspect-w-16 aspect-h-12 bg-gray-100">
                  <img
                    :src="product.image || '/images/placeholder-product.jpg'"
                    :alt="product.name"
                    class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="p-4">
                  <h3
                    class="text-lg font-medium text-gray-900 mb-2 line-clamp-2"
                  >
                    {{ product.name }}
                  </h3>
                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                    {{ product.description }}
                  </p>
                  <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                      <span class="text-xl font-bold text-pink-600">
                        {{ formatPrice(product.price) }} ₽
                      </span>
                      <span
                        v-if="product.originalPrice"
                        class="text-sm text-gray-500 line-through"
                      >
                        {{ formatPrice(product.originalPrice) }} ₽
                      </span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-yellow-400">⭐</span>
                      <span class="text-sm text-gray-600 ml-1">
                        {{ product.rating || "4.5" }}
                      </span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Пустое состояние -->
          <div v-else class="text-center py-12">
            <div class="w-16 h-16 text-gray-400 mx-auto mb-4">😞</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Товары не найдены
            </h3>
            <p class="text-gray-600 mb-4">
              Попробуйте изменить параметры фильтрации или поиска
            </p>
            <button
              @click="resetFilters"
              class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>

          <!-- Пагинация -->
          <div v-if="totalPages > 1" class="flex justify-center mt-12">
            <nav class="flex items-center space-x-1">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                "
              >
                ←
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="
                  page === currentPage
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                "
              >
                {{ page }}
              </button>

              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                "
              >
                →
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
// Получение параметров маршрута
const route = useRoute();
const currentSubcategory = route.params.subcategory;

// Реактивные данные для управления состоянием страницы
const isLoading = ref(true);
const products = ref([]);
const subcategories = ref([]);
const showSubcategories = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(24);
const totalPages = ref(1);
const sortBy = ref("popular");
const availableFilters = ref({});

// Вычисляемые свойства для отображения информации
const pageTitle = computed(() => {
  const titles = {
    "dlya-nee": "Для неё",
    "dlya-nego": "Для него",
    "dlya-par": "Для пар",
    vibratory: "Вибраторы",
    masturbatory: "Мастурбаторы",
    "analnye-igrushki": "Анальные игрушки",
    bdsm: "BDSM",
    kuklы: "Секс куклы",
  };
  return titles[currentSubcategory] || "Категория товаров";
});

const pageDescription = computed(() => {
  const descriptions = {
    "dlya-nee":
      "Широкий выбор интимных игрушек для женщин - вибраторы, стимуляторы и аксессуары высокого качества",
    "dlya-nego":
      "Качественные мужские секс игрушки - мастурбаторы, кольца и стимуляторы для незабываемых ощущений",
    "dlya-par":
      "Игрушки для совместного использования - укрепите близость и добавьте новые краски в отношения",
    vibratory:
      "Премиальные вибраторы различных форм и размеров для максимального удовольствия",
    masturbatory:
      "Реалистичные мастурбаторы и стимуляторы для мужчин от ведущих производителей",
    "analnye-igrushki":
      "Специализированные игрушки для анальной стимуляции - безопасно и комфортно",
    bdsm: "BDSM аксессуары и игрушки для ролевых игр и новых экспериментов",
    kuklы:
      "Реалистичные секс куклы высокого качества для незабываемых впечатлений",
  };
  return (
    descriptions[currentSubcategory] ||
    "Качественные интимные товары с быстрой доставкой"
  );
});

const breadcrumbs = computed(() => {
  return [
    {
      name: pageTitle.value,
      url: `/catalog/${currentSubcategory}`,
    },
  ];
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Методы для работы с данными
const loadProducts = async () => {
  isLoading.value = true;
  try {
    // Здесь будет API запрос для загрузки товаров
    // Пока используем заглушку
    await new Promise((resolve) => setTimeout(resolve, 1000));

    products.value = [
      {
        id: 1,
        name: "Премиальный вибратор",
        description:
          "Высококачественный силиконовый вибратор с множеством режимов",
        price: 4500,
        originalPrice: 5200,
        rating: 4.8,
        image: "/images/product-1.jpg",
        slug: "premium-vibrator-1",
      },
      // Добавим еще товары для демонстрации
      ...Array.from({ length: 11 }, (_, i) => ({
        id: i + 2,
        name: `Товар ${i + 2}`,
        description: `Описание товара ${i + 2}`,
        price: Math.floor(Math.random() * 5000) + 1000,
        rating: (Math.random() * 2 + 3).toFixed(1),
        slug: `product-${i + 2}`,
      })),
    ];

    totalPages.value = Math.ceil(products.value.length / itemsPerPage.value);
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
  } finally {
    isLoading.value = false;
  }
};

const loadSubcategories = async () => {
  // Загрузка подкатегорий если нужно
  subcategories.value = [];
};

// Обработчики событий
const handleFilterChange = (filters) => {
  // Применение фильтров
  console.log("Применение фильтров:", filters);
  loadProducts();
};

const handleSortChange = () => {
  // Сортировка товаров
  console.log("Изменение сортировки:", sortBy.value);
  loadProducts();
};

const navigateToSubcategory = (slug) => {
  navigateTo(`/catalog/${slug}`);
};

const changePage = (page) => {
  currentPage.value = page;
  // Скролл к началу списка товаров
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetFilters = () => {
  // Сброс всех фильтров
  loadProducts();
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

// Инициализация компонента
onMounted(() => {
  loadProducts();
  loadSubcategories();
});

// SEO метаданные
useSeoMeta({
  title: `${pageTitle.value} - Pink Rabbit | Каталог интимных товаров`,
  description: pageDescription.value,
  ogTitle: `${pageTitle.value} - Pink Rabbit`,
  ogDescription: pageDescription.value,
  ogUrl: `https://pinkrabbit.ru/catalog/${currentSubcategory}`,
  keywords: `${pageTitle.value.toLowerCase()}, секс игрушки, интимные товары, Pink Rabbit`,
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
