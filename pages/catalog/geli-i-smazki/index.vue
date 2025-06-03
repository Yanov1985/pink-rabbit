<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Хлебные крошки для навигации -->
    <nav class="breadcrumb mb-6">
      <ul class="flex items-center space-x-2 text-sm text-gray-600">
        <li><NuxtLink to="/" class="hover:text-pink-600">Главная</NuxtLink></li>
        <li class="mx-2">/</li>
        <li>
          <NuxtLink to="/catalog" class="hover:text-pink-600">Каталог</NuxtLink>
        </li>
        <li class="mx-2">/</li>
        <li class="text-gray-800">Гели и смазки</li>
      </ul>
    </nav>

    <!-- Заголовок раздела -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Гели и смазки</h1>
      <p class="text-lg text-gray-600">
        Качественные интимные гели и смазки для комфорта и удовольствия
      </p>
    </header>

    <!-- Сетка категорий товаров -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Интимные смазки -->
      <NuxtLink
        to="/catalog/geli-i-smazki/intimnye-smazki"
        class="category-card group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <h3
          class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600"
        >
          Интимные смазки
        </h3>
        <p class="text-gray-600">Смазки для интимной близости и комфорта</p>
      </NuxtLink>

      <!-- Массажные масла -->
      <NuxtLink
        to="/catalog/geli-i-smazki/massazhnye-masla"
        class="category-card group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <h3
          class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600"
        >
          Массажные масла
        </h3>
        <p class="text-gray-600">Масла для эротического массажа</p>
      </NuxtLink>

      <!-- Возбуждающие гели -->
      <NuxtLink
        to="/catalog/geli-i-smazki/vozbuzhdayushchie-geli"
        class="category-card group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <h3
          class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600"
        >
          Возбуждающие гели
        </h3>
        <p class="text-gray-600">Гели для усиления ощущений</p>
      </NuxtLink>

      <!-- Анальные смазки -->
      <NuxtLink
        to="/catalog/geli-i-smazki/analnye-smazki"
        class="category-card group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <h3
          class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600"
        >
          Анальные смазки
        </h3>
        <p class="text-gray-600">Специальные смазки для анальных ласк</p>
      </NuxtLink>

      <!-- Охлаждающие гели -->
      <NuxtLink
        to="/catalog/geli-i-smazki/okhlazhdayushchie-geli"
        class="category-card group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <h3
          class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600"
        >
          Охлаждающие гели
        </h3>
        <p class="text-gray-600">Гели с охлаждающим эффектом</p>
      </NuxtLink>

      <!-- Согревающие гели -->
      <NuxtLink
        to="/catalog/geli-i-smazki/sogrevayushchie-geli"
        class="category-card group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <h3
          class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600"
        >
          Согревающие гели
        </h3>
        <p class="text-gray-600">Гели с согревающим эффектом</p>
      </NuxtLink>

      <!-- Ароматизированные смазки -->
      <NuxtLink
        to="/catalog/geli-i-smazki/aromatizirovannye-smazki"
        class="category-card group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <h3
          class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600"
        >
          Ароматизированные смазки
        </h3>
        <p class="text-gray-600">Смазки с приятными ароматами</p>
      </NuxtLink>

      <!-- Гели-лубриканты -->
      <NuxtLink
        to="/catalog/geli-i-smazki/geli-lubrikanty"
        class="category-card group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <h3
          class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600"
        >
          Гели-лубриканты
        </h3>
        <p class="text-gray-600">Универсальные гели-лубриканты</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Метаданные страницы для SEO
definePageMeta({
  title: "Гели и смазки - Каталог интимных товаров",
  description:
    "Широкий выбор интимных гелей и смазок: массажные масла, возбуждающие гели, лубриканты",
});

// Заголовок страницы для браузера
useHead({
  title: "Гели и смазки - Каталог интимных товаров",
});
</script>

<style scoped>
/* Стили для карточек категорий */
.category-card {
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  border-color: #ec4899;
}

/* Адаптивная сетка */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Стили для хлебных крошек */
.breadcrumb a:hover {
  text-decoration: underline;
}
</style>
