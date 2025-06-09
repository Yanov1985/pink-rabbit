<template>
  <div class="product-categories-section">
    <div class="container mx-auto px-4 py-4">
      <!-- Заголовок секции как на оригинальном сайте -->
      <h2 class="section-title">Категории товаров</h2>

      <!-- SVG градиенты для иконок -->
      <svg style="display: none">
        <defs>
          <!-- Основной градиент Pink Rabbit -->
          <linearGradient
            id="categoryGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" style="stop-color: #ff6b9d; stop-opacity: 1" />
            <stop offset="30%" style="stop-color: #ff8fb3; stop-opacity: 1" />
            <stop offset="60%" style="stop-color: #8b5cf6; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #06b6d4; stop-opacity: 1" />
          </linearGradient>

          <!-- Дополнительный градиент для hover эффектов -->
          <linearGradient
            id="categoryGradientHover"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" style="stop-color: #ff8fb3; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #8b5cf6; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #10b981; stop-opacity: 1" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Простая статичная сетка категорий как в оригинале -->
      <div class="categories-grid">
        <div
          v-for="category in displayedCategories"
          :key="category.id"
          class="category-card"
          @click="selectCategory(category.slug)"
        >
          <!-- Простая иконка в стиле оригинала -->
          <div class="category-icon">
            <component :is="category.icon" class="gradient-icon" />
          </div>

          <!-- Название категории -->
          <h3 class="category-name">{{ category.name }}</h3>
        </div>
      </div>

      <!-- Кнопки управления отображением как на оригинале -->
      <div class="buttons-container">
        <!-- Кнопка "Показать еще" когда показано 8 карточек -->
        <button
          v-if="!showAll && categories.length > visibleCount"
          @click="showMoreCategories"
          class="btn-base show-more-btn"
          type="button"
          aria-label="Показать все категории товаров"
        >
          Показать ещё ({{ categories.length - visibleCount }})
        </button>

        <!-- Кнопка "Свернуть" когда показаны все карточки -->
        <button
          v-if="showAll"
          @click="hideExtraCategories"
          class="btn-base collapse-btn"
          type="button"
          aria-label="Свернуть список категорий"
        >
          Свернуть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Управление отображением категорий
const showAll = ref(false);
const visibleCount = 8; // По умолчанию показываем 8 карточек (2 ряда по 4)

// Простые SVG иконки в стиле оригинального сайта
const FemaleIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="8" r="7"/>
      <path d="M12 15v6"/>
      <path d="M9 18h6"/>
    </svg>
  `,
};

const MaleIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="10" cy="14" r="8"/>
      <path d="M16.5 7.5l4-4"/>
      <path d="M15 3h6v6"/>
    </svg>
  `,
};

const CoupleIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="9" cy="7" r="4"/>
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      <circle cx="16" cy="7" r="4"/>
      <path d="M16 21v-2a4 4 0 0 0-3-3.87"/>
    </svg>
  `,
};

const VibratorIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#e91e63" stroke-width="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v14c0 5.5 4.5 10 10 10s10-4.5 10-10V5a2 2 0 0 0-2-2h-3"/>
      <rect x="8" y="1" width="8" height="4" rx="1"/>
      <circle cx="13" cy="12" r="2" fill="#e91e63"/>
    </svg>
  `,
};

const DildoIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="3" width="6" height="18" rx="3"/>
      <circle cx="12" cy="6" r="1" fill="currentColor"/>
    </svg>
  `,
};

const AnalIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="9"/>
      <path d="M8 12h8"/>
      <path d="M12 8v8"/>
    </svg>
  `,
};

const VaginalIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <ellipse cx="12" cy="12" rx="6" ry="8"/>
      <path d="M12 4v4"/>
      <path d="M12 16v4"/>
    </svg>
  `,
};

const ClitoralIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="8" r="3"/>
      <path d="M12 11v10"/>
      <circle cx="12" cy="18" r="2"/>
    </svg>
  `,
};

const LubricantIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 3v12.26C11.5 12.09 11 12 10.5 12C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21 15 18.99 15 16.5V7H18V3H12Z"/>
      <circle cx="10.5" cy="16.5" r="2.5"/>
    </svg>
  `,
};

const CondomIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1Z"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  `,
};

const CosmeticsIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L13.09 6.26L17 5L16.74 9.74L21 10L16.74 14.26L17 19L13.09 17.74L12 22L10.91 17.74L7 19L7.26 14.26L3 14L7.26 9.74L7 5L10.91 6.26L12 2Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,
};

const EroticGamesIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21.47 4.35L20.13 3.01C19.54 2.42 18.76 2.42 18.17 3.01L15.73 5.45L18.55 8.27L20.99 5.83C21.57 5.24 21.57 4.93 21.47 4.35Z"/>
      <path d="M2.53 19.65L1.39 21.79C1.18 22.17 1.49 22.48 1.87 22.27L3.41 21.13L2.53 19.65Z"/>
      <path d="M3.17 18.45L14.76 6.86L17.14 9.24L5.55 20.83L3.17 18.45Z"/>
    </svg>
  `,
};

// Массив категорий точно как на оригинальном сайте (теперь 12 категорий)
const categories = ref([
  {
    id: 1,
    name: "Для женщин",
    slug: "dlya-nee",
    icon: FemaleIcon,
  },
  {
    id: 2,
    name: "Для мужчин",
    slug: "dlya-nego",
    icon: MaleIcon,
  },
  {
    id: 3,
    name: "Для двоих",
    slug: "dlya-par",
    icon: CoupleIcon,
  },
  {
    id: 4,
    name: "Вибраторы",
    slug: "vibratory",
    icon: VibratorIcon,
  },
  {
    id: 5,
    name: "Фаллоимитаторы",
    slug: "falloimitatory",
    icon: DildoIcon,
  },
  {
    id: 6,
    name: "Анальные стимуляторы",
    slug: "analnaya-stimulacia",
    icon: AnalIcon,
  },
  {
    id: 7,
    name: "Вагинальные тренажеры",
    slug: "vaginalnaie-stimulatory",
    icon: VaginalIcon,
  },
  {
    id: 8,
    name: "Клиторальные стимуляторы",
    slug: "klitoralnye-stimulatory",
    icon: ClitoralIcon,
  },
  {
    id: 9,
    name: "Интимная косметика",
    slug: "intimnaya-kosmetika",
    icon: CosmeticsIcon,
  },
  {
    id: 10,
    name: "Смазки и гели",
    slug: "smazki-i-geli",
    icon: LubricantIcon,
  },
  {
    id: 11,
    name: "Презервативы",
    slug: "prezervativy",
    icon: CondomIcon,
  },
  {
    id: 12,
    name: "Эротические игры",
    slug: "eroticheskie-igry",
    icon: EroticGamesIcon,
  },
]);

// Computed для отображаемых категорий
const displayedCategories = computed(() => {
  return showAll.value
    ? categories.value
    : categories.value.slice(0, visibleCount);
});

// Функция для показа всех категорий
const showMoreCategories = () => {
  showAll.value = true;
};

// Функция для сворачивания категорий обратно
const hideExtraCategories = () => {
  showAll.value = false;
};

// Функция выбора категории (как на тиндере - клик и переход)
const selectCategory = (slug) => {
  // Здесь будет переход на страницу каталога с фильтрацией
  console.log(`Выбрана категория: ${slug}`);
  // В реальном проекте здесь будет router.push(`/catalog/${slug}`)
};
</script>

<style scoped>
/* === СТИЛИ В СТИЛЕ PINK RABBIT CATALOG HEADER === */

/* Основной контейнер - предотвращаем overflow */
.product-categories-section {
  overflow-x: hidden;
  width: 100%;
}

/* Контейнер заголовка секции */
.categories-section {
  position: relative;
  margin-bottom: 2rem;
}

/* Заголовок секции с градиентом как в CatalogHeader */
.section-title {
  background: linear-gradient(
    45deg,
    #ff6b9d,
    #ff8fb3,
    #8b5cf6,
    #06b6d4,
    #10b981,
    #f59e0b,
    #ef4444,
    #ff6b9d
  );
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.025em;
  animation: gradientShift 4s ease-in-out infinite,
    textGlow 2s ease-in-out infinite alternate;
  position: relative;
  text-shadow: 0 0 10px rgba(255, 107, 157, 0.3);
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Эффект блика на заголовке */
.section-title::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 3s ease-in-out infinite;
  z-index: 1;
}

/* Основная сетка категорий - уменьшаем gap для предотвращения overflow */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem; /* Уменьшено с 1.5rem до 1rem */
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden; /* Только горизонтальный overflow */
  width: 100%;
  padding-bottom: 0.5rem; /* Минимальный отступ для hover эффектов */
}

/* Карточка категории в стиле Pink Rabbit */
.category-card {
  /* Стеклянный эффект как в CatalogHeader */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.25rem; /* Уменьшено с 1.5rem до 1.25rem */

  /* Анимации и переходы */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  /* Тень и трансформации - уменьшены для предотвращения overflow */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transform: translateZ(0);

  /* Анимация появления */
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;

  /* Ограничиваем максимальную ширину */
  max-width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.5rem; /* Дополнительный отступ снизу */
}

/* Градиентный фон для карточек */
.category-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 107, 157, 0.03),
    rgba(139, 92, 246, 0.03),
    rgba(6, 182, 212, 0.03)
  );
  background-size: 300% 300%;
  animation: backgroundShift 8s ease-in-out infinite;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Показываем градиент при hover */
.category-card:hover::before {
  opacity: 1;
}

/* Hover эффект карточки - уменьшены трансформации */
.category-card:hover {
  transform: translateY(-4px) scale(1.01); /* Уменьшено с scale(1.02) */
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.12); /* Уменьшена тень */
  border-color: rgba(255, 107, 157, 0.3);
}

/* Контейнер иконки */
.category-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  /* Убираем overflow: hidden чтобы иконка не обрезалась */
}

/* Hover эффект для иконки - уменьшены трансформации */
.category-card:hover .category-icon {
  transform: scale(1.1) rotate(3deg); /* Уменьшено с scale(1.15) и rotate(5deg) */
  filter: drop-shadow(0 2px 8px rgba(255, 107, 157, 0.3)); /* Уменьшена тень */
}

/* SVG внутри иконки */
.category-icon svg {
  width: 100%;
  height: 100%;
  /* Градиентная заливка иконок */
  fill: url(#categoryGradient);
  transition: all 0.3s ease;
}

/* Градиентные иконки */
.gradient-icon {
  width: 100%;
  height: 100%;
  fill: url(#categoryGradient);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Смена градиента при hover */
.category-card:hover .gradient-icon {
  fill: url(#categoryGradientHover);
  filter: drop-shadow(0 0 6px rgba(255, 107, 157, 0.5)); /* Уменьшена тень */
}

/* Градиент для иконок */
.category-icon svg defs linearGradient {
  /* Динамический градиент будет создан в JS */
}

/* Название категории с градиентом */
.category-name {
  background: linear-gradient(135deg, #374151, #6b7280, #8b5cf6, #ff6b9d);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  text-align: center;
  font-size: 0.875rem;
  animation: subtleGradient 4s ease-in-out infinite;
  transition: all 0.3s ease;
  line-height: 1.4;
  overflow: hidden; /* Предотвращаем overflow текста */
  text-overflow: ellipsis;
}

/* Hover эффект для названия - уменьшена трансформация */
.category-card:hover .category-name {
  font-weight: 700;
  transform: scale(1.02); /* Уменьшено с scale(1.05) */
  animation-duration: 2s;
}

/* Контейнер кнопок */
.buttons-container {
  margin-top: 1rem; /* Уменьшено с 2rem до 1rem */
  text-align: center;
  width: 100%;
  /* Убираем padding-bottom - он не нужен */
}

/* Базовые стили кнопок */
.btn-base {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  max-width: 100%; /* Ограничиваем ширину кнопок */
  box-sizing: border-box;
}

/* Эффект волны для кнопок */
.btn-base::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-base:hover::before {
  left: 100%;
}

/* Кнопка "Показать ещё" */
.show-more-btn {
  background: linear-gradient(135deg, #ff6b9d, #ff8fb3);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
}

.show-more-btn:hover {
  transform: translateY(-1px) scale(1.01); /* Уменьшены трансформации */
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.35); /* Уменьшена тень */
  background: linear-gradient(135deg, #ff8fb3, #ff6b9d);
}

/* Кнопка "Свернуть" */
.collapse-btn {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.collapse-btn:hover {
  transform: translateY(-1px) scale(1.01); /* Уменьшены трансформации */
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.35); /* Уменьшена тень */
  background: linear-gradient(135deg, #a855f7, #8b5cf6);
}

/* Анимация появления карточек с задержкой */
.category-card:nth-child(1) {
  animation-delay: 0.1s;
}
.category-card:nth-child(2) {
  animation-delay: 0.15s;
}
.category-card:nth-child(3) {
  animation-delay: 0.2s;
}
.category-card:nth-child(4) {
  animation-delay: 0.25s;
}
.category-card:nth-child(5) {
  animation-delay: 0.3s;
}
.category-card:nth-child(6) {
  animation-delay: 0.35s;
}
.category-card:nth-child(7) {
  animation-delay: 0.4s;
}
.category-card:nth-child(8) {
  animation-delay: 0.45s;
}
.category-card:nth-child(9) {
  animation-delay: 0.5s;
}
.category-card:nth-child(10) {
  animation-delay: 0.55s;
}
.category-card:nth-child(11) {
  animation-delay: 0.6s;
}
.category-card:nth-child(12) {
  animation-delay: 0.65s;
}

/* === КЛЮЧЕВЫЕ АНИМАЦИИ === */

/* Движение градиента заголовка */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Свечение текста */
@keyframes textGlow {
  0% {
    filter: brightness(1) contrast(1);
    transform: scale(1);
  }
  100% {
    filter: brightness(1.2) contrast(1.1);
    transform: scale(1.02);
  }
}

/* Блик на заголовке */
@keyframes shimmer {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* Движение фонового градиента */
@keyframes backgroundShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  33% {
    background-position: 100% 0%;
  }
  66% {
    background-position: 0% 100%;
  }
}

/* Тонкий градиент для названий */
@keyframes subtleGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Появление карточки снизу */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* === АДАПТИВНОСТЬ === */

/* Планшеты */
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.875rem; /* Уменьшено с 1.25rem */
    padding-bottom: 0.375rem; /* Минимальный отступ для hover эффектов */
  }

  .section-title {
    font-size: 1.75rem;
  }

  .category-card {
    padding: 1rem; /* Уменьшен padding */
    margin-bottom: 0.25rem; /* Уменьшен отступ для hover */
  }
}

/* Мобильные устройства */
@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem; /* Уменьшено с 1rem */
    padding-bottom: 0.25rem; /* Минимальный отступ для hover эффектов */
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .category-card {
    padding: 0.875rem; /* Уменьшен padding */
    margin-bottom: 0.125rem; /* Минимальный отступ для hover */
  }

  .category-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 0.75rem;
  }
}

/* Очень маленькие экраны */
@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem; /* Минимальный gap */
    padding-bottom: 0.25rem; /* Минимальный отступ для hover эффектов */
  }

  .section-title {
    font-size: 1.25rem;
  }

  .category-card {
    padding: 0.75rem; /* Минимальный padding */
    margin: 0 0.25rem 0.125rem 0.25rem; /* Уменьшены отступы */
  }

  .btn-base {
    padding: 0.625rem 1.25rem;
    font-size: 0.8rem;
  }

  /* Контейнер на мобильных */
  .product-categories-section .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .buttons-container {
    margin-top: 0.75rem; /* Ещё меньше расстояние на мобильных */
  }
}

/* Reduced motion для accessibility */
@media (prefers-reduced-motion: reduce) {
  .category-card,
  .category-icon,
  .category-name,
  .btn-base {
    animation: none;
    transition: none;
  }

  .category-card:hover {
    transform: none;
  }
}
</style>
