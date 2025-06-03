<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
  >
    <!-- Изображение скелетон -->
    <div
      class="relative aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
    ></div>

    <!-- Контент скелетон -->
    <div class="p-3 space-y-3">
      <!-- Рейтинг скелетон -->
      <div class="flex items-center gap-1">
        <div class="flex gap-1">
          <div
            v-for="i in 5"
            :key="i"
            class="w-3 h-3 bg-gray-200 rounded"
          ></div>
        </div>
        <div class="w-8 h-3 bg-gray-200 rounded"></div>
      </div>

      <!-- Название скелетон -->
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <!-- Характеристики скелетон -->
      <div class="space-y-1">
        <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>

      <!-- Цена скелетон -->
      <div class="flex items-center gap-2">
        <div class="h-5 bg-gray-200 rounded w-20"></div>
        <div class="h-4 bg-gray-200 rounded w-16"></div>
      </div>

      <!-- Кнопка скелетон -->
      <div class="h-9 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
</template>

<script setup>
// Компонент не требует логики, только анимированные заглушки
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.animate-shimmer {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
