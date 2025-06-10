<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Заголовок -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Добро пожаловать в MegaShop! 🛒
        </h1>
        <p class="text-xl text-gray-600">
          Самые крутые товары для взрослых ждут тебя!
        </p>
      </div>

      <!-- Контейнер с фильтрами -->
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Боковая панель с фильтрами -->
          <div class="lg:col-span-1">
            <AdultToysFilters />
          </div>

          <!-- Основной контент -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                Каталог товаров
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Заглушка карточек товаров -->
                <div
                  v-for="i in 6"
                  :key="i"
                  class="bg-gray-100 rounded-lg h-64 flex items-center justify-center"
                >
                  <span class="text-gray-500">Товар {{ i }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Импортируем компонент фильтров
import AdultToysFilters from "@/components/categories/sexIgrushki/AdultToysFilters.vue";
</script>
