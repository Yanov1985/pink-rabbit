<template>
  <nav
    class="breadcrumbs-container bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    aria-label="Навигация по сайту"
  >
    <div class="container mx-auto px-4 py-3">
      <ol
        class="flex items-center space-x-2 text-sm"
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
      >
        <li
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <NuxtLink
            to="/"
            class="breadcrumb-link text-gray-500 hover:text-pink-500 transition-colors duration-200"
            itemprop="item"
          >
            <span itemprop="name">Главная</span>
          </NuxtLink>
          <meta itemprop="position" content="1" />
        </li>
        <li class="breadcrumb-separator text-gray-400" aria-hidden="true">
          <ChevronRightIcon class="w-4 h-4" />
        </li>
        <li
          v-if="!isMainCatalog"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <NuxtLink
            to="/catalog"
            class="breadcrumb-link text-gray-500 hover:text-pink-500 transition-colors duration-200"
            itemprop="item"
          >
            <span itemprop="name">Каталог</span>
          </NuxtLink>
          <meta itemprop="position" content="2" />
        </li>
        <li
          v-if="!isMainCatalog"
          class="breadcrumb-separator text-gray-400"
          aria-hidden="true"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </li>
        <template v-for="(crumb, index) in processedBreadcrumbs" :key="index">
          <li
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
            class="breadcrumb-item"
          >
            <NuxtLink
              v-if="!crumb.isActive && crumb.url"
              :to="crumb.url"
              class="breadcrumb-link text-gray-500 hover:text-pink-500 transition-colors duration-200"
              itemprop="item"
            >
              <span itemprop="name">{{ crumb.name }}</span>
            </NuxtLink>
            <span
              v-else
              class="breadcrumb-current text-gray-900 font-medium"
              itemprop="name"
            >
              {{ crumb.name }}
            </span>
            <meta itemprop="position" :content="crumb.position" />
          </li>
          <li
            v-if="index < processedBreadcrumbs.length - 1"
            class="breadcrumb-separator text-gray-400"
            aria-hidden="true"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </li>
        </template>
      </ol>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { ChevronRightIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  showCatalog: {
    type: Boolean,
    default: true,
  },
  isMainCatalog: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: "",
  },
});

const processedBreadcrumbs = computed(() => {
  if (!props.breadcrumbs || props.breadcrumbs.length === 0) {
    return [];
  }
  const startPosition = props.isMainCatalog ? 2 : 3;
  return props.breadcrumbs.map((crumb, index) => ({
    ...crumb,
    position: startPosition + index,
    isActive: index === props.breadcrumbs.length - 1 || crumb.isActive,
  }));
});
</script>

<style scoped>
.breadcrumbs-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(236, 72, 153, 0.1);
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(236, 72, 153, 0.15);
}

.breadcrumbs-container:hover {
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: rgba(236, 72, 153, 0.2);
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
}

.breadcrumb-link:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 107, 157, 0.1),
    rgba(255, 143, 179, 0.1)
  );
  color: #ec4899;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
  border-color: rgba(236, 72, 153, 0.2);
}

.breadcrumb-current {
  padding: 6px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.25);
}

.breadcrumb-separator {
  display: flex;
  align-items: center;
  opacity: 0.5;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.breadcrumbs-container:hover .breadcrumb-separator {
  opacity: 0.7;
  color: #ec4899;
}

.breadcrumb-item {
  animation: breadcrumbFadeIn 0.4s ease forwards;
  opacity: 0;
  transform: translateY(8px);
}

.breadcrumb-item:nth-child(1) {
  animation-delay: 0.1s;
}
.breadcrumb-item:nth-child(3) {
  animation-delay: 0.2s;
}
.breadcrumb-item:nth-child(5) {
  animation-delay: 0.3s;
}

@keyframes breadcrumbFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .breadcrumb-link,
  .breadcrumb-current {
    padding: 4px 8px;
    font-size: 13px;
  }
}
</style>
