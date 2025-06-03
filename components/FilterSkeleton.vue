<template>
  <div class="space-y-6">
    <!-- Каталог скелетон -->
    <div class="bg-white rounded-lg border p-6 animate-pulse">
      <div class="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div class="space-y-4">
        <div v-for="i in 3" :key="i" class="space-y-3">
          <div class="h-5 bg-gray-200 rounded w-1/2"></div>
          <div class="ml-6 space-y-2">
            <div
              v-for="j in 4"
              :key="j"
              class="h-4 bg-gray-200 rounded w-3/4"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры скелетон -->
    <div class="bg-white rounded-lg border p-6 animate-pulse">
      <div class="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div class="space-y-6">
        <div v-for="i in 6" :key="i" class="space-y-3">
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="space-y-2">
            <div v-for="j in 3" :key="j" class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
