<!--
  🛍️ Умная сетка категорий каталога - как Amazon Categories
  ✨ Hover эффекты, иконки, профессиональный дизайн
-->
<template>
  <section
    class="catalog-categories-grid"
    role="region"
    aria-labelledby="categories-heading"
  >
    <!-- 📋 Скрытый заголовок для accessibility -->
    <h2 id="categories-heading" class="sr-only">
      Категории товаров интернет-магазина
    </h2>

    <!-- 🔄 Skeleton загрузка -->
    <div
      v-if="isLoading"
      class="categories-skeleton"
      role="status"
      aria-label="Загрузка категорий"
    >
      <div
        v-for="i in 12"
        :key="`skeleton-${i}`"
        class="skeleton-card"
        :style="{ animationDelay: `${i * 0.1}s` }"
      >
        <div class="skeleton-icon"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-description"></div>
      </div>
    </div>

    <!-- 🎯 Основная сетка категорий -->
    <nav
      v-else
      class="categories-navigation"
      role="navigation"
      aria-label="Навигация по категориям"
    >
      <TransitionGroup
        name="category-appear"
        tag="div"
        class="categories-grid"
        role="grid"
        :aria-rowcount="Math.ceil(categories.length / 3)"
      >
        <article
          v-for="(category, index) in categories"
          :key="category.slug"
          class="category-card"
          :class="{
            featured: category.featured,
            'card-animate': !isLoading,
          }"
          role="gridcell"
          :aria-rowindex="Math.floor(index / 3) + 1"
          :aria-colindex="(index % 3) + 1"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- 🔗 Навигационная ссылка -->
          <NuxtLink
            :to="category.path"
            class="category-link"
            :aria-label="`Перейти в категорию ${category.title}`"
            :aria-describedby="`desc-${category.slug}`"
            @mouseenter="handleCardHover(index)"
            @focus="handleCardFocus(index)"
            @keydown.enter="navigateToCategory(category)"
            @keydown.space.prevent="navigateToCategory(category)"
          >
            <!-- 🎨 Иконка категории -->
            <div class="category-icon-wrapper">
              <component
                :is="category.icon"
                class="category-icon"
                :class="`icon-${category.color}`"
                aria-hidden="true"
              />

              <!-- ✨ Декоративные элементы -->
              <div class="icon-glow" :class="`glow-${category.color}`"></div>
              <div class="icon-pulse" :class="`pulse-${category.color}`"></div>
            </div>

            <!-- 📝 Контент карточки -->
            <div class="category-content">
              <h3 class="category-title">
                {{ category.title }}
                <span
                  v-if="category.featured"
                  class="featured-badge"
                  aria-label="Популярная категория"
                >
                  🔥
                </span>
              </h3>

              <p :id="`desc-${category.slug}`" class="category-description">
                {{ category.description }}
              </p>

              <!-- 📊 Статистика категории -->
              <div class="category-stats" v-if="category.stats">
                <span class="stats-item">
                  {{ category.stats.products }}+ товаров
                </span>
                <span class="stats-divider">•</span>
                <span class="stats-item"> ⭐ {{ category.stats.rating }} </span>
              </div>
            </div>

            <!-- 🚀 Hover индикатор -->
            <div class="hover-indicator" aria-hidden="true">
              <ChevronRightIcon class="w-5 h-5" />
            </div>
          </NuxtLink>
        </article>
      </TransitionGroup>
    </nav>
  </section>
</template>

<script setup>
import {
  HeartIcon,
  PlayIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BeakerIcon,
  PuzzlePieceIcon,
  GiftIcon,
  LockClosedIcon,
  UserGroupIcon,
  FireIcon,
  StarIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

// 🎯 Пропсы компонента
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});

// 🎭 События компонента
const emit = defineEmits(["category-selected"]);

// 📋 Данные категорий с иконками и цветами
const categories = ref([
  {
    slug: "seks-igrushki",
    title: "Интимные игрушки",
    description: "Широкий выбор товаров для взрослых: для женщин, мужчин и пар",
    path: "/catalog/seks-igrushki",
    icon: HeartIcon,
    color: "pink",
    featured: true,
    stats: { products: 500, rating: 4.8 },
  },
  {
    slug: "vibratory",
    title: "Вибраторы",
    description:
      "Элитные, Hi-tech, многофункциональные и другие типы вибраторов",
    path: "/catalog/seks-igrushki/vibratory",
    icon: PlayIcon,
    color: "purple",
    featured: true,
    stats: { products: 150, rating: 4.9 },
  },
  {
    slug: "geli-i-smazki",
    title: "Смазки и лубриканты",
    description: "Интимные гели, лубриканты, вкусовые и увлажняющие средства",
    path: "/catalog/geli-i-smazki",
    icon: BeakerIcon,
    color: "blue",
    featured: false,
    stats: { products: 80, rating: 4.7 },
  },
  {
    slug: "prezervativy",
    title: "Презервативы",
    description: "Классические, ультратонкие, продлевающие и специальные виды",
    path: "/catalog/prezervativy",
    icon: ShieldCheckIcon,
    color: "green",
    featured: false,
    stats: { products: 120, rating: 4.6 },
  },
  {
    slug: "afrodiziaki-i-kapsuly",
    title: "Афродизиаки и капсулы",
    description: "Натуральные средства для повышения либидо и потенции",
    path: "/catalog/afrodiziaki-i-kapsuly",
    icon: SparklesIcon,
    color: "orange",
    featured: false,
    stats: { products: 45, rating: 4.5 },
  },
  {
    slug: "kosmetika-i-feromony",
    title: "Косметика и феромоны",
    description: "Интимная косметика, феромоны и средства по уходу",
    path: "/catalog/kosmetika-i-feromony",
    icon: SparklesIcon,
    color: "indigo",
    featured: false,
    stats: { products: 70, rating: 4.4 },
  },
  {
    slug: "eroticheskie-igry",
    title: "Эротические игры",
    description: "Игры для пар, карты, кубики и другие развлечения",
    path: "/catalog/eroticheskie-igry",
    icon: PuzzlePieceIcon,
    color: "red",
    featured: false,
    stats: { products: 30, rating: 4.3 },
  },
  {
    slug: "podarki-i-aksessuary",
    title: "Подарки и аксессуары",
    description: "Эротические подарки, украшения и аксессуары",
    path: "/catalog/podarki-i-aksessuary",
    icon: GiftIcon,
    color: "yellow",
    featured: false,
    stats: { products: 85, rating: 4.6 },
  },
  {
    slug: "bdsm-fetish",
    title: "БДСМ и фетиш",
    description: "Товары для ролевых игр, фетиша и БДСМ практик",
    path: "/catalog/bdsm-fetish",
    icon: LockClosedIcon,
    color: "gray",
    featured: false,
    stats: { products: 95, rating: 4.7 },
  },
  {
    slug: "eroticheskoe-bele",
    title: "Эротическое белье",
    description: "Соблазнительное женское и мужское белье",
    path: "/catalog/eroticheskoe-bele",
    icon: UserGroupIcon,
    color: "pink",
    featured: false,
    stats: { products: 200, rating: 4.5 },
  },
]);

// 🎯 Методы взаимодействия
const handleCardHover = (index) => {
  // Логика для hover эффектов
  console.log(`🎯 Hover на карточке ${index}`);
};

const handleCardFocus = (index) => {
  // Логика для focus состояния
  console.log(`🎯 Focus на карточке ${index}`);
};

const navigateToCategory = (category) => {
  // Уведомляем родительский компонент о выборе категории
  emit("category-selected", category);

  // Навигация через Nuxt Router
  navigateTo(category.path);

  console.log(`🛍️ Навигация в категорию: ${category.title}`);
};

// 📢 Accessibility уведомления
const announceSelection = (categoryTitle) => {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = `Выбрана категория: ${categoryTitle}`;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};
</script>

<style scoped>
/* 🎨 Основная секция */
.catalog-categories-grid {
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* 🔄 Skeleton загрузка */
.categories-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.skeleton-card {
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  animation: skeletonPulse 2s infinite ease-in-out;
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.skeleton-title {
  height: 24px;
  width: 70%;
  background: linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite 0.2s;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.skeleton-description {
  height: 16px;
  width: 90%;
  background: linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite 0.4s;
  border-radius: 4px;
}

@keyframes skeletonPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 🌐 Навигация */
.categories-navigation {
  background: transparent;
  border: none;
  outline: none;
}

/* 🏗️ Сетка категорий */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

/* 🎯 Карточка категории */
.category-card {
  position: relative;
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Современная тень */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);

  /* Улучшенная анимация появления */
  opacity: 0;
  transform: translateY(20px);
  z-index: 1;
}

.category-card.card-animate {
  animation: cardAppear 0.6s ease-out forwards;
}

@keyframes cardAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 🔥 Популярные категории */
.category-card.featured {
  background: linear-gradient(135deg, #fff5f5 0%, #fef7ff 100%);
  border-color: #f472b6;

  box-shadow: 0 4px 14px rgba(244, 114, 182, 0.15),
    0 2px 4px rgba(244, 114, 182, 0.1);
}

/* 🎯 Hover эффекты */
.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: #cbd5e1;

  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05);
}

.category-card.featured:hover {
  border-color: #ec4899;

  box-shadow: 0 20px 40px rgba(244, 114, 182, 0.25),
    0 8px 16px rgba(244, 114, 182, 0.15);
}

/* 🔗 Ссылка */
.category-link {
  display: block;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  height: 100%;
  position: relative;
}

.category-link:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 20px;
}

/* 🎨 Иконка категории */
.category-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.category-icon {
  width: 48px;
  height: 48px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

/* 🌈 Цветовые схемы иконок */
.icon-pink {
  color: #ec4899;
}
.icon-purple {
  color: #a855f7;
}
.icon-blue {
  color: #3b82f6;
}
.icon-green {
  color: #10b981;
}
.icon-orange {
  color: #f59e0b;
}
.icon-indigo {
  color: #6366f1;
}
.icon-red {
  color: #ef4444;
}
.icon-yellow {
  color: #eab308;
}
.icon-gray {
  color: #6b7280;
}

/* ✨ Эффекты свечения */
.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(8px);
}

.category-card:hover .icon-glow {
  opacity: 0.3;
}

.glow-pink {
  background: #ec4899;
}
.glow-purple {
  background: #a855f7;
}
.glow-blue {
  background: #3b82f6;
}
.glow-green {
  background: #10b981;
}
.glow-orange {
  background: #f59e0b;
}
.glow-indigo {
  background: #6366f1;
}
.glow-red {
  background: #ef4444;
}
.glow-yellow {
  background: #eab308;
}
.glow-gray {
  background: #6b7280;
}

/* 📝 Контент */
.category-content {
  flex: 1;
}

.category-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.featured-badge {
  font-size: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-1px);
  }
}

.category-description {
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

/* 📊 Статистика */
.category-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #9ca3af;
}

.stats-item {
  font-weight: 500;
}

.stats-divider {
  color: #d1d5db;
}

/* 🚀 Hover индикатор */
.hover-indicator {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 32px;
  height: 32px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  color: #3b82f6;
}

.category-card:hover .hover-indicator {
  opacity: 1;
  transform: scale(1);
}

/* 🎭 Анимации переходов */
.category-appear-enter-active {
  transition: all 0.6s ease-out;
}

.category-appear-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.category-appear-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 🔍 Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 📱 Адаптивность */
@media (max-width: 768px) {
  .catalog-categories-grid {
    padding: 1rem 0.5rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .category-link {
    padding: 1rem;
  }

  .category-icon {
    width: 40px;
    height: 40px;
  }

  .category-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .category-title {
    font-size: 1.1rem;
  }

  .category-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .category-card {
    border-radius: 12px;
  }

  .category-link {
    padding: 0.875rem;
  }

  .hover-indicator {
    display: none;
  }
}
</style>
