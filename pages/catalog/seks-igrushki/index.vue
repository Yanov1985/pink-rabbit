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
        <!-- Sidebar с фильтрами и каталогом -->
        <aside class="lg:w-1/4 space-y-6" ref="filtersRef">
          <!-- Каталог -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Каталог</h2>
            <div class="space-y-3">
              <!-- Для женщин -->
              <div data-category="women">
                <div
                  class="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-50 category-header"
                  @click="toggleCategory('women')"
                >
                  <h3 class="font-medium text-gray-900">Для женщин</h3>
                  <ChevronDownIcon
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': expandedCategories.women }"
                  />
                </div>
                <div
                  v-show="expandedCategories.women"
                  class="ml-4 mt-2 space-y-2 category-list"
                >
                  <NuxtLink
                    to="#"
                    class="block text-sm text-gray-600 hover:text-pink-500 py-1"
                    >Вибраторы</NuxtLink
                  >
                  <NuxtLink
                    to="#"
                    class="block text-sm text-gray-600 hover:text-pink-500 py-1"
                    >Фаллоимитаторы</NuxtLink
                  >
                  <NuxtLink
                    to="#"
                    class="block text-sm text-gray-600 hover:text-pink-500 py-1"
                    >Стимуляторы клитора</NuxtLink
                  >
                </div>
              </div>

              <!-- Для мужчин -->
              <div data-category="men">
                <div
                  class="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-50 category-header"
                  @click="toggleCategory('men')"
                >
                  <h3 class="font-medium text-gray-900">Для мужчин</h3>
                  <ChevronDownIcon
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': expandedCategories.men }"
                  />
                </div>
                <div
                  v-show="expandedCategories.men"
                  class="ml-4 mt-2 space-y-2 category-list"
                >
                  <NuxtLink
                    to="#"
                    class="block text-sm text-gray-600 hover:text-pink-500 py-1"
                    >Мастурбаторы</NuxtLink
                  >
                  <NuxtLink
                    to="#"
                    class="block text-sm text-gray-600 hover:text-pink-500 py-1"
                    >Стимуляторы простаты</NuxtLink
                  >
                  <NuxtLink
                    to="#"
                    class="block text-sm text-gray-600 hover:text-pink-500 py-1"
                    >Кольца</NuxtLink
                  >
                </div>
              </div>

              <!-- Для двоих -->
              <div data-category="couples">
                <div
                  class="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-50 category-header"
                  @click="toggleCategory('couples')"
                >
                  <h3 class="font-medium text-gray-900">Для двоих</h3>
                  <ChevronDownIcon
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': expandedCategories.couples }"
                  />
                </div>
                <div
                  v-show="expandedCategories.couples"
                  class="ml-4 mt-2 space-y-2 category-list"
                >
                  <NuxtLink
                    to="#"
                    class="block text-sm text-gray-600 hover:text-pink-500 py-1"
                    >Парные вибраторы</NuxtLink
                  >
                  <NuxtLink
                    to="#"
                    class="block text-sm text-gray-600 hover:text-pink-500 py-1"
                    >Презервативы</NuxtLink
                  >
                  <NuxtLink
                    to="#"
                    class="block text-sm text-gray-600 hover:text-pink-500 py-1"
                    >Лубриканты</NuxtLink
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Фильтры -->
          <FilterSkeleton v-if="isInitialLoading" />
          <div
            v-else
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-6"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Фильтры</h3>
              <button
                v-if="hasActiveFilters"
                @click="resetFilters"
                class="text-sm text-pink-500 hover:text-pink-600"
              >
                Сбросить
              </button>
            </div>

            <!-- Цена -->
            <div class="filter-group">
              <h4 class="font-medium text-gray-900 mb-3">Цена, ₽</h4>
              <div class="flex gap-3 mb-3">
                <input
                  v-model="priceMin"
                  type="number"
                  placeholder="От"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm filter-input"
                />
                <input
                  v-model="priceMax"
                  type="number"
                  placeholder="До"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm filter-input"
                />
              </div>
              <button
                @click="applyPriceFilter"
                class="w-full bg-pink-500 text-white py-2 rounded-md text-sm hover:bg-pink-600 transition-colors"
              >
                Применить
              </button>
            </div>

            <!-- Бренды -->
            <div class="filter-group">
              <h4 class="font-medium text-gray-900 mb-3">Бренд</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <label
                  v-for="brand in availableBrands"
                  :key="brand"
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded filter-checkbox"
                >
                  <input
                    v-model="selectedBrands"
                    :value="brand"
                    type="checkbox"
                    class="text-pink-500 focus:ring-pink-500"
                  />
                  <span class="text-sm text-gray-700">{{ brand }}</span>
                </label>
              </div>
            </div>

            <!-- Материал -->
            <div class="filter-group">
              <h4 class="font-medium text-gray-900 mb-3">Материал</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <label
                  v-for="material in materials"
                  :key="material"
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded filter-checkbox"
                >
                  <input
                    v-model="selectedMaterials"
                    :value="material"
                    type="checkbox"
                    class="text-pink-500 focus:ring-pink-500"
                  />
                  <span class="text-sm text-gray-700">{{ material }}</span>
                </label>
              </div>
            </div>

            <!-- Цвет -->
            <div class="filter-group">
              <h4 class="font-medium text-gray-900 mb-3">Цвет</h4>
              <div class="grid grid-cols-6 gap-2">
                <div
                  v-for="color in colors"
                  :key="color.name"
                  @click="toggleColorFilter(color.name)"
                  class="w-8 h-8 rounded-full border-2 cursor-pointer color-option"
                  :style="{ backgroundColor: color.hex }"
                  :class="{
                    selected: selectedColors.includes(color.name),
                    'border-pink-500': selectedColors.includes(color.name),
                    'border-gray-300': !selectedColors.includes(color.name),
                  }"
                  :title="color.name"
                ></div>
              </div>
            </div>

            <!-- Дополнительные фильтры -->
            <div class="filter-group space-y-3">
              <label
                class="flex items-center space-x-2 cursor-pointer filter-checkbox"
              >
                <input
                  v-model="onlyInStock"
                  type="checkbox"
                  class="text-pink-500 focus:ring-pink-500"
                />
                <span class="text-sm text-gray-700">Только в наличии</span>
              </label>
              <label
                class="flex items-center space-x-2 cursor-pointer filter-checkbox"
              >
                <input
                  v-model="onlyWithDiscount"
                  type="checkbox"
                  class="text-pink-500 focus:ring-pink-500"
                />
                <span class="text-sm text-gray-700">Только со скидкой</span>
              </label>
              <label
                class="flex items-center space-x-2 cursor-pointer filter-checkbox"
              >
                <input
                  v-model="onlyNew"
                  type="checkbox"
                  class="text-pink-500 focus:ring-pink-500"
                />
                <span class="text-sm text-gray-700">Только новинки</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Основной контент -->
        <main class="lg:w-3/4">
          <!-- Заголовок и управление -->
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
            ref="headerRef"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  Товары для взрослых
                </h1>
                <p class="text-gray-600 mt-1">
                  Найдено {{ filteredProducts.length }}
                  {{ getProductsWord(filteredProducts.length) }}
                </p>
              </div>

              <!-- Переключатель видов и сортировка -->
              <div class="flex items-center gap-4">
                <!-- Переключатель видов -->
                <div
                  class="flex bg-gray-100 rounded-lg p-1"
                  ref="viewToggleRef"
                >
                  <button
                    @click="changeViewMode(4)"
                    :class="[
                      'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 view-toggle-button',
                      viewMode === 4
                        ? 'bg-pink-500 text-white shadow-sm active'
                        : 'text-gray-600 hover:text-gray-900',
                    ]"
                    title="4 колонки"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <rect x="1" y="2" width="3" height="3"></rect>
                      <rect x="5" y="2" width="3" height="3"></rect>
                      <rect x="9" y="2" width="3" height="3"></rect>
                      <rect x="13" y="2" width="3" height="3"></rect>
                      <rect x="1" y="6" width="3" height="3"></rect>
                      <rect x="5" y="6" width="3" height="3"></rect>
                      <rect x="9" y="6" width="3" height="3"></rect>
                      <rect x="13" y="6" width="3" height="3"></rect>
                    </svg>
                  </button>
                  <button
                    @click="changeViewMode(3)"
                    :class="[
                      'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 view-toggle-button',
                      viewMode === 3
                        ? 'bg-pink-500 text-white shadow-sm active'
                        : 'text-gray-600 hover:text-gray-900',
                    ]"
                    title="3 колонки"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <rect x="2" y="2" width="4" height="4"></rect>
                      <rect x="8" y="2" width="4" height="4"></rect>
                      <rect x="14" y="2" width="4" height="4"></rect>
                      <rect x="2" y="8" width="4" height="4"></rect>
                      <rect x="8" y="8" width="4" height="4"></rect>
                      <rect x="14" y="8" width="4" height="4"></rect>
                    </svg>
                  </button>
                </div>

                <!-- Сортировка -->
                <select
                  v-model="sortBy"
                  @change="applySorting"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sort-select"
                  ref="sortRef"
                >
                  <option value="popularity">По популярности</option>
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                  <option value="rating">По рейтингу</option>
                  <option value="newest">Сначала новые</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Skeleton загрузка -->
          <div
            v-if="isInitialLoading"
            :class="viewMode === 4 ? 'product-grid-4' : 'product-grid-3'"
          >
            <ProductSkeleton v-for="i in 12" :key="i" />
          </div>

          <!-- Сетка товаров -->
          <div
            v-else
            :class="viewMode === 4 ? 'product-grid-4' : 'product-grid-3'"
            ref="productsGridRef"
          >
            <div
              v-for="(product, index) in paginatedProducts"
              :key="product.id"
              :data-product-id="product.id"
              class="product-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group hover:shadow-xl transition-all duration-300"
              :ref="(el) => setProductCardRef(el, index)"
              @mouseenter="onProductHover"
              @mouseleave="onProductLeave"
            >
              <!-- Изображение товара -->
              <div
                class="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 product-image-container"
              >
                <!-- Улучшенный прелоадер -->
                <div
                  v-show="imageLoadingStates[product.id]"
                  class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 image-loader"
                >
                  <div class="relative">
                    <div
                      class="w-10 h-10 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin loading-spinner"
                    ></div>
                    <div
                      class="absolute inset-0 w-10 h-10 border-3 border-transparent border-r-purple-300 rounded-full animate-ping"
                    ></div>
                  </div>
                </div>

                <!-- Изображение -->
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover product-image"
                  :class="{
                    'opacity-0': imageLoadingStates[product.id],
                    'opacity-100': !imageLoadingStates[product.id],
                  }"
                  @load="handleImageLoad(product.id)"
                  @error="handleImageError(product.id)"
                  loading="lazy"
                />

                <!-- Бейджи -->
                <div
                  class="absolute top-3 left-3 flex flex-col gap-2 product-badges"
                >
                  <span v-if="product.isNew" class="badge badge-new">NEW</span>
                  <span v-if="product.discount > 0" class="badge badge-discount"
                    >-{{ product.discount }}%</span
                  >
                  <span v-if="product.isHit" class="badge badge-hit">ХИТ</span>
                </div>

                <!-- Кнопки действий -->
                <div class="product-actions">
                  <button
                    @click="toggleWishlist(product)"
                    class="action-button"
                    :class="{ 'text-pink-500 bg-pink-50': product.inWishlist }"
                  >
                    <HeartIcon class="w-4 h-4" />
                  </button>
                  <button class="action-button">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="toggleCompare(product)"
                    class="action-button"
                    :class="{ 'text-pink-500 bg-pink-50': product.inCompare }"
                  >
                    <ArrowsRightLeftIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Информация о товаре -->
              <div class="p-4">
                <!-- Рейтинг -->
                <div class="flex items-center gap-1 mb-2">
                  <div class="flex rating-stars">
                    <StarIcon
                      v-for="i in 5"
                      :key="i"
                      class="w-3 h-3 star"
                      :class="
                        i <= product.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-200'
                      "
                    />
                  </div>
                  <span class="text-xs text-gray-500"
                    >({{ product.reviews }})</span
                  >
                </div>

                <!-- Название товара -->
                <h3 class="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                  {{ product.name }}
                </h3>

                <!-- Характеристики -->
                <div class="text-xs text-gray-600 mb-3 space-y-1">
                  <div>Бренд: {{ product.brand }}</div>
                  <div>Материал: {{ product.material }}</div>
                  <div>Цвет: {{ product.color }}</div>
                </div>

                <!-- Цена -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-lg font-bold text-gray-900"
                    >{{ formatPrice(product.price) }} ₽</span
                  >
                  <span
                    v-if="product.oldPrice"
                    class="text-sm text-gray-500 line-through"
                  >
                    {{ formatPrice(product.oldPrice) }} ₽
                  </span>
                </div>

                <!-- Кнопка добавления в корзину -->
                <button
                  v-if="product.inStock"
                  @click="addToCart(product)"
                  class="w-full cart-button py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  В корзину
                </button>
                <button
                  v-else
                  disabled
                  class="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  Нет в наличии
                </button>
              </div>

              <!-- Overlay для товаров не в наличии -->
              <div
                v-if="!product.inStock"
                class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm"
              >
                <span class="text-white font-medium text-lg"
                  >Нет в наличии</span
                >
              </div>
            </div>
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
              class="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
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
import FilterSkeleton from "~/components/FilterSkeleton.vue";

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
const currentPage = ref(1);
const itemsPerPage = ref(12);
const viewMode = ref(4); // 4 или 3 колонки
const sortBy = ref("popularity");

// Фильтры
const priceMin = ref(null);
const priceMax = ref(null);
const selectedBrands = ref([]);
const selectedMaterials = ref([]);
const selectedColors = ref([]);
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
const headerRef = ref(null);
const productsGridRef = ref(null);
const viewToggleRef = ref(null);
const sortRef = ref(null);
const paginationRef = ref(null);
const productCardRefs = ref([]);

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

// Данные товаров для демонстрации
const products = ref([
  {
    id: 1,
    name: "Вибратор Lelo Gigi 2",
    brand: "Lelo",
    price: 12000,
    oldPrice: 15000,
    image: placeholderImages[0],
    rating: 5,
    reviews: 127,
    material: "Силикон",
    color: "Розовый",
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
    name: "Мастурбатор Fleshlight",
    brand: "Fleshlight",
    price: 8500,
    oldPrice: null,
    image: placeholderImages[1],
    rating: 4,
    reviews: 89,
    material: "TPE",
    color: "Телесный",
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
    brand: "We-Vibe",
    price: 18000,
    oldPrice: 22000,
    image: placeholderImages[2],
    rating: 5,
    reviews: 203,
    material: "Силикон",
    color: "Фиолетовый",
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
    name: "Анальная пробка Jewel",
    brand: "NJOY",
    price: 6500,
    oldPrice: null,
    image: placeholderImages[3],
    rating: 4,
    reviews: 56,
    material: "Металл",
    color: "Серебристый",
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
    name: "Кольцо Satisfyer Men",
    brand: "Satisfyer",
    price: 3500,
    oldPrice: 4200,
    image: placeholderImages[4],
    rating: 4,
    reviews: 34,
    material: "Силикон",
    color: "Черный",
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
    name: "Вибратор Bullet Magic",
    brand: "Magic Motion",
    price: 2800,
    oldPrice: null,
    image: placeholderImages[5],
    rating: 3,
    reviews: 67,
    material: "Силикон",
    color: "Белый",
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
    name: "Фаллоимитатор Realistic",
    brand: "Doc Johnson",
    price: 4200,
    oldPrice: 5000,
    image: placeholderImages[6],
    rating: 4,
    reviews: 45,
    material: "PVC",
    color: "Телесный",
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
    name: "Массажер простаты Aneros",
    brand: "Aneros",
    price: 9500,
    oldPrice: null,
    image: placeholderImages[7],
    rating: 5,
    reviews: 78,
    material: "Медицинский пластик",
    color: "Черный",
    isNew: true,
    isHit: true,
    discount: 0,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "men",
  },
  {
    id: 9,
    name: "Виброяйцо Lush 3",
    brand: "Lovense",
    price: 11000,
    oldPrice: 13500,
    image: placeholderImages[8],
    rating: 5,
    reviews: 156,
    material: "Силикон",
    color: "Розовый",
    isNew: false,
    isHit: true,
    discount: 19,
    inStock: true,
    inWishlist: true,
    inCompare: false,
    category: "women",
  },
  {
    id: 10,
    name: "Страпон Feeldoe",
    brand: "Tantus",
    price: 14000,
    oldPrice: null,
    image: placeholderImages[9],
    rating: 4,
    reviews: 92,
    material: "Силикон",
    color: "Фиолетовый",
    isNew: false,
    isHit: false,
    discount: 0,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "couples",
  },
  {
    id: 11,
    name: "Стимулятор клитора Womanizer",
    brand: "Womanizer",
    price: 16500,
    oldPrice: 19000,
    image: placeholderImages[10],
    rating: 5,
    reviews: 234,
    material: "Силикон",
    color: "Красный",
    isNew: false,
    isHit: true,
    discount: 13,
    inStock: true,
    inWishlist: false,
    inCompare: true,
    category: "women",
  },
  {
    id: 12,
    name: "Мастурбатор Tenga Flip",
    brand: "Tenga",
    price: 7200,
    oldPrice: null,
    image: placeholderImages[11],
    rating: 4,
    reviews: 67,
    material: "TPE",
    color: "Белый",
    isNew: true,
    isHit: false,
    discount: 0,
    inStock: true,
    inWishlist: false,
    inCompare: false,
    category: "men",
  },
]);

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

// Фильтрация товаров
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Фильтр по цене
  if (priceMin.value) {
    filtered = filtered.filter((p) => p.price >= priceMin.value);
  }
  if (priceMax.value) {
    filtered = filtered.filter((p) => p.price <= priceMax.value);
  }

  // Фильтр по брендам
  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter((p) => selectedBrands.value.includes(p.brand));
  }

  // Фильтр по материалам
  if (selectedMaterials.value.length > 0) {
    filtered = filtered.filter((p) =>
      selectedMaterials.value.includes(p.material)
    );
  }

  // Фильтр по цветам
  if (selectedColors.value.length > 0) {
    filtered = filtered.filter((p) => selectedColors.value.includes(p.color));
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
  priceMin.value = null;
  priceMax.value = null;
  selectedBrands.value = [];
  selectedMaterials.value = [];
  selectedColors.value = [];
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
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;

    // Анимация смены страницы
    gsap.fromTo(
      ".product-card",
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
      }
    );
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

/* Сортировка */
.sort-select {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.sort-select:focus {
  transform: scale(1.02);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
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
  background: linear-gradient(135deg, #ec4899, #be185d);
  color: white;
  border-color: #ec4899;
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
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
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
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3);
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
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #be185d, #7c3aed);
}

/* Эффекты загрузки */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(236, 72, 153, 0.1),
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
  background: linear-gradient(to right, #ec4899 0%, #e5e7eb 0%);
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
  background: linear-gradient(135deg, #ec4899, #be185d);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(236, 72, 153, 0.3);
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.5);
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
</style>
