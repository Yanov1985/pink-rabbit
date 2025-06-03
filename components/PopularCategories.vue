<template>
  <div class="popular-categories-wrapper" ref="categoriesWrapperRef">
    <!-- Заголовок секции -->
    <div class="categories-header">
      <h2 class="categories-title">Популярные категории</h2>
    </div>

    <!-- Сетка категорий -->
    <div class="categories-grid" ref="categoriesGridRef">
      <!-- Основные 8 категорий (всегда видимые) -->
      <div
        v-for="(category, index) in mainCategories"
        :key="category.id"
        class="category-item"
        :class="{ 'category-large': category.isLarge }"
        :style="{ '--animation-delay': index * 0.1 + 's' }"
        @click="navigateToCategory(category.slug)"
        ref="categoryItemsRef"
      >
        <div class="category-content">
          <div class="category-image-container">
            <img
              :src="category.image"
              :alt="category.name"
              class="category-image"
              @error="handleImageError"
              loading="lazy"
            />
            <div class="category-overlay">
              <div class="category-badge" v-if="category.badge">
                {{ category.badge }}
              </div>
            </div>
          </div>
          <div class="category-info">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.count }} товаров</p>
          </div>
        </div>
      </div>

      <!-- Дополнительные категории (скрытые по умолчанию) -->
      <div
        v-for="(category, index) in additionalCategories"
        :key="`additional-${category.id}`"
        class="category-item additional-category"
        :class="{ show: showMore }"
        :style="{ '--animation-delay': (index + 8) * 0.1 + 's' }"
        @click="navigateToCategory(category.slug)"
      >
        <div class="category-content">
          <div class="category-image-container">
            <img
              :src="category.image"
              :alt="category.name"
              class="category-image"
              @error="handleImageError"
              loading="lazy"
            />
            <div class="category-overlay">
              <div class="category-badge" v-if="category.badge">
                {{ category.badge }}
              </div>
            </div>
          </div>
          <div class="category-info">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.count }} товаров</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопка "Показать еще" -->
    <div class="show-more-container" ref="showMoreRef">
      <button
        class="show-more-btn"
        @click="toggleShowMore"
        :class="{ expanded: showMore }"
      >
        <span class="btn-text">
          {{ showMore ? "Скрыть" : "Показать еще" }}
        </span>
        <svg
          class="btn-icon"
          :class="{ rotated: showMore }"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { gsap } from "gsap";
import { navigateTo } from "nuxt/app";

// Реф элементы для анимаций
const categoriesWrapperRef = ref(null);
const categoriesGridRef = ref(null);
const categoryItemsRef = ref([]);
const showMoreRef = ref(null);

// Состояние компонента
const showMore = ref(false);

// Основные 8 категорий (всегда видимые)
const mainCategories = ref([
  {
    id: 1,
    name: "Для женщин",
    slug: "dlya-nee",
    count: 2847,
    image:
      "https://pinkrabbit.ru/upload/iblock/87a/87a1c3cfcaaef4b19d50a3c1b51b5568.jpg",
    badge: "ХИТ",
    isLarge: false,
  },
  {
    id: 2,
    name: "Для мужчин",
    slug: "dlya-nego",
    count: 1256,
    image:
      "https://pinkrabbit.ru/upload/iblock/97b/97b3bd96a59ae3c90a72c06d62b8fa05.jpg",
    badge: null,
    isLarge: false,
  },
  {
    id: 3,
    name: "Для двоих",
    slug: "dlya-par",
    count: 892,
    image:
      "https://pinkrabbit.ru/upload/iblock/a82/a82d4ce2e6b6d02b6a7f5bdebb2a1e57.jpg",
    badge: "НОВИНКА",
    isLarge: true,
  },
  {
    id: 4,
    name: "Вибраторы",
    slug: "vibratory",
    count: 1634,
    image:
      "https://pinkrabbit.ru/upload/iblock/41a/41ad2a3cf9f61d28cb2e8b8b09a3a2f1.jpg",
    badge: null,
    isLarge: false,
  },
  {
    id: 5,
    name: "Фаллоимитаторы",
    slug: "falloimitatory",
    count: 567,
    image:
      "https://pinkrabbit.ru/upload/iblock/e4c/e4c7f3b89d421d5e73b9aa87e7a8b9f6.jpg",
    badge: null,
    isLarge: false,
  },
  {
    id: 6,
    name: "Анальные стимуляторы",
    slug: "analnye-stimulyatory",
    count: 423,
    image:
      "https://pinkrabbit.ru/upload/iblock/6b2/6b2af8ea24c2c8b31f5e4a8b2c7f3e9d.jpg",
    badge: null,
    isLarge: false,
  },
  {
    id: 7,
    name: "БДСМ и фетиш",
    slug: "bdsm-i-fetish",
    count: 789,
    image:
      "https://pinkrabbit.ru/upload/iblock/3f1/3f15cba6d8e7f2a9b4c6e8f1a3d5b2c7.jpg",
    badge: "18+",
    isLarge: false,
  },
  {
    id: 8,
    name: "Гели и лубриканты",
    slug: "geli-i-lubrikanty",
    count: 345,
    image:
      "https://pinkrabbit.ru/upload/iblock/9e4/9e4b8f2c6a1d5e3f7b9c8a4e6d2f1b3a.jpg",
    badge: null,
    isLarge: false,
  },
]);

// Дополнительные категории (показываются при нажатии "Показать еще")
const additionalCategories = ref([
  {
    id: 9,
    name: "Эротическое белье",
    slug: "eroticheskoe-bele",
    count: 1234,
    image: "https://picsum.photos/300/200?random=9",
    badge: "СКИДКА",
  },
  {
    id: 10,
    name: "Презервативы",
    slug: "prezervativy",
    count: 156,
    image: "https://picsum.photos/300/200?random=10",
    badge: null,
  },
  {
    id: 11,
    name: "Массажные масла",
    slug: "massazhnye-masla",
    count: 89,
    image: "https://picsum.photos/300/200?random=11",
    badge: "НОВИНКА",
  },
  {
    id: 12,
    name: "Афродизиаки",
    slug: "afrodiziaki",
    count: 67,
    image: "https://picsum.photos/300/200?random=12",
    badge: null,
  },
  {
    id: 13,
    name: "Секс куклы",
    slug: "seks-kukly",
    count: 234,
    image: "https://picsum.photos/300/200?random=13",
    badge: "ХИТ",
  },
  {
    id: 14,
    name: "Помпы",
    slug: "pompy",
    count: 123,
    image: "https://picsum.photos/300/200?random=14",
    badge: null,
  },
  {
    id: 15,
    name: "Эрекционные кольца",
    slug: "erektsionnye-koltsa",
    count: 178,
    image: "https://picsum.photos/300/200?random=15",
    badge: null,
  },
  {
    id: 16,
    name: "Страпоны",
    slug: "strapony",
    count: 98,
    image: "https://picsum.photos/300/200?random=16",
    badge: "18+",
  },
]);

// Методы
const navigateToCategory = (slug) => {
  navigateTo(`/catalog/seks-igrushki/${slug}`);
};

const toggleShowMore = () => {
  showMore.value = !showMore.value;

  if (showMore.value) {
    // Анимация появления дополнительных категорий
    gsap.to(".additional-category", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)",
    });
  } else {
    // Анимация скрытия дополнительных категорий
    gsap.to(".additional-category", {
      opacity: 0,
      y: 30,
      scale: 0.9,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in",
    });
  }

  // Анимация кнопки
  gsap.to(".show-more-btn", {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  });
};

const handleImageError = (event) => {
  const img = event.target;
  img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dy='.3em'%3E${img.alt}%3C/text%3E%3C/svg%3E`;
};

// Анимации
const initAnimations = () => {
  // Анимация заголовка
  gsap.from(".categories-title", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power2.out",
  });

  // Анимация основных категорий
  gsap.from(".category-item:not(.additional-category)", {
    opacity: 0,
    y: 50,
    scale: 0.9,
    duration: 0.8,
    stagger: 0.1,
    ease: "back.out(1.7)",
    delay: 0.3,
  });

  // Анимация кнопки "Показать еще"
  gsap.from(".show-more-btn", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power2.out",
    delay: 1.2,
  });
};

// Lifecycle
onMounted(() => {
  nextTick(() => {
    initAnimations();
  });
});
</script>

<style scoped>
.popular-categories-wrapper {
  margin-bottom: 50px;
  padding: 0 25px;
}

.categories-header {
  text-align: center;
  margin-bottom: 40px;
}

.categories-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  position: relative;
  display: inline-block;
}

.categories-title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  border-radius: 2px;
}

/* Сетка категорий */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

/* Элементы категорий */
.category-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation-delay: var(--animation-delay);
}

.category-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Большие категории (занимают 2 колонки) */
.category-large {
  grid-column: span 2;
}

/* Дополнительные категории (скрытые по умолчанию) */
.additional-category {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
  transition: all 0.4s ease;
}

.additional-category.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Контент категории */
.category-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
}

.category-large .category-image-container {
  height: 250px;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.category-item:hover .category-image {
  transform: scale(1.1);
}

/* Оверлей и бейджи */
.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 15px;
}

.category-badge {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
}

.category-badge:contains("НОВИНКА") {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
}

.category-badge:contains("ХИТ") {
  background: linear-gradient(45deg, #feca57, #ff9ff3);
}

.category-badge:contains("СКИДКА") {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
}

.category-badge:contains("18+") {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

/* Информация о категории */
.category-info {
  padding: 20px;
  background: white;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.category-name {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.category-large .category-name {
  font-size: 20px;
}

.category-count {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

/* Кнопка "Показать еще" */
.show-more-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.show-more-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.show-more-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.btn-text {
  transition: all 0.3s ease;
}

.btn-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.4s ease;
}

.btn-icon.rotated {
  transform: rotate(180deg);
}

/* Адаптивность */
@media (max-width: 1200px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .category-large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .popular-categories-wrapper {
    padding: 0 15px;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .category-image-container,
  .category-large .category-image-container {
    height: 150px;
  }

  .category-info {
    padding: 15px;
  }

  .category-name {
    font-size: 16px;
  }

  .category-large .category-name {
    font-size: 17px;
  }

  .categories-title {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .category-image-container,
  .category-large .category-image-container {
    height: 180px;
  }

  .show-more-btn {
    padding: 12px 25px;
    font-size: 15px;
  }

  .categories-title {
    font-size: 1.4rem;
  }
}

/* Анимации */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Эффекты наведения */
.category-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.category-item:hover::before {
  opacity: 1;
}

/* Специальные эффекты для больших категорий */
.category-large::after {
  content: "ПОПУЛЯРНО";
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}
</style>
