<!--
  🎯 Героический заголовок каталога - как главная страница Apple Store
  🌟 Градиентный текст, анимации, профессиональная типографика
-->
<template>
  <section class="catalog-hero" role="banner" aria-labelledby="catalog-title">
    <div class="hero-container">
      <!-- 🎭 Анимированный заголовок с градиентом -->
      <h1
        id="catalog-title"
        class="hero-title"
        :class="{ 'animate-title': !isLoading }"
      >
        Каталог товаров
      </h1>

      <!-- 📱 Описание как в Tinder - привлекательное и ясное -->
      <p
        class="hero-description"
        :class="{ 'animate-description': !isLoading }"
      >
        Добро пожаловать в наш каталог интимных товаров.
        <span class="highlight">Выберите интересующую вас категорию</span>
        и откройте мир новых возможностей
      </p>

      <!-- 📊 Статистика как в Amazon -->
      <div
        class="hero-stats"
        :class="{ 'animate-stats': !isLoading }"
        v-if="!isLoading"
      >
        <div class="stat-item">
          <span class="stat-number">{{ totalCategories }}+</span>
          <span class="stat-label">категорий</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ totalProducts }}+</span>
          <span class="stat-label">товаров</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">⭐ 4.9</span>
          <span class="stat-label">рейтинг</span>
        </div>
      </div>

      <!-- 🔄 Skeleton загрузка -->
      <div v-if="isLoading" class="hero-skeleton">
        <div class="skeleton-title"></div>
        <div class="skeleton-description"></div>
        <div class="skeleton-stats"></div>
      </div>
    </div>

    <!-- 🌈 Декоративные элементы -->
    <div class="hero-decorations" aria-hidden="true">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="floating-elements">
        <div class="float-element" v-for="i in 6" :key="i"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
// 🎯 Пропсы компонента
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  totalCategories: {
    type: Number,
    default: 20,
  },
  totalProducts: {
    type: Number,
    default: 1500,
  },
});

// 🎭 Анимация появления элементов
const { $gsap } = useNuxtApp();

onMounted(() => {
  if (!props.isLoading && $gsap) {
    // Последовательная анимация появления элементов
    $gsap
      .timeline()
      .from(".hero-title", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
      })
      .from(
        ".hero-description",
        {
          duration: 0.8,
          y: 30,
          opacity: 0,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .from(
        ".hero-stats .stat-item",
        {
          duration: 0.6,
          y: 20,
          opacity: 0,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );
  }
});
</script>

<style scoped>
/* 🎨 Основной контейнер героической секции */
.catalog-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #f5576c 75%,
    #4facfe 100%
  );
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
  overflow: hidden;
  padding: 4rem 2rem;
}

/* 🌊 Анимация градиентного фона */
@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 📦 Контейнер содержимого */
.hero-container {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

/* 🎭 Заголовок с градиентным текстом */
.hero-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  margin: 0 0 1.5rem 0;
  line-height: 1.1;

  /* Градиентный текст как в ProductCategoriesCards */
  background: linear-gradient(
    45deg,
    #ff6b6b 0%,
    #4ecdc4 25%,
    #45b7d1 50%,
    #f093fb 75%,
    #ffeaa7 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  /* Анимация градиента */
  animation: gradientShift 8s ease-in-out infinite;

  /* Текстовая тень для читаемости */
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.1));
}

/* 🌈 Анимация градиента заголовка */
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 50% 100%;
  }
  75% {
    background-position: 50% 0%;
  }
}

/* 📝 Описание */
.hero-description {
  font-size: clamp(1.1rem, 3vw, 1.3rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 2.5rem 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.highlight {
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* 📊 Статистика */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: rgba(255, 255, 255, 0.3);
}

/* 🔄 Skeleton загрузка */
.hero-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.skeleton-title {
  width: 300px;
  height: 60px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;
}

.skeleton-description {
  width: 400px;
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite 0.3s;
  border-radius: 6px;
}

.skeleton-stats {
  width: 200px;
  height: 30px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite 0.6s;
  border-radius: 4px;
}

/* 🌟 Анимация shimmer */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 🌈 Декоративные элементы */
.hero-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #ff6b6b, #4ecdc4);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #45b7d1, #f093fb);
  bottom: 15%;
  right: 15%;
  animation-delay: 3s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

/* 🎆 Плавающие элементы */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.float-element {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: floatUpDown 8s ease-in-out infinite;
}

.float-element:nth-child(1) {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}
.float-element:nth-child(2) {
  top: 60%;
  left: 25%;
  animation-delay: 2s;
}
.float-element:nth-child(3) {
  top: 30%;
  right: 20%;
  animation-delay: 4s;
}
.float-element:nth-child(4) {
  bottom: 40%;
  left: 30%;
  animation-delay: 1s;
}
.float-element:nth-child(5) {
  bottom: 20%;
  right: 15%;
  animation-delay: 3s;
}
.float-element:nth-child(6) {
  top: 70%;
  right: 30%;
  animation-delay: 5s;
}

@keyframes floatUpDown {
  0%,
  100% {
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-15px) scale(1.2);
    opacity: 1;
  }
  75% {
    transform: translateY(15px) scale(0.8);
    opacity: 0.4;
  }
}

/* 🎯 Анимации появления */
.animate-title {
  animation: slideInFromTop 1s ease-out;
}

.animate-description {
  animation: slideInFromBottom 0.8s ease-out 0.3s both;
}

.animate-stats {
  animation: slideInFromBottom 0.6s ease-out 0.6s both;
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 📱 Адаптивность */
@media (max-width: 768px) {
  .catalog-hero {
    min-height: 50vh;
    padding: 2rem 1rem;
  }

  .hero-stats {
    gap: 1rem;
  }

  .stat-divider {
    display: none;
  }

  .skeleton-title {
    width: 250px;
    height: 50px;
  }

  .skeleton-description {
    width: 300px;
    height: 35px;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-item {
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>
