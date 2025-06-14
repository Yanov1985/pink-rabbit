<template>
  <div>
    <!-- Markup shared across all pages, ex: NavBar -->
    <NuxtPage />
  </div>
</template>

<style>
/* 🎯 Глобальные стили для sticky поведения */
.is-sticky {
  position: fixed !important;
  top: 0 !important;
  /* Убираем left и right - пусть элемент сохраняет свою ширину и позицию */
  /* left: 0 !important; */
  /* right: 0 !important; */
  width: 100% !important;
  z-index: 1002 !important;

  /* 🎨 Профессиональные анимации */
  animation: stickySlideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;

  /* 🚀 Аппаратное ускорение для плавности */
  transform: translateZ(0) !important;
  will-change: transform, opacity !important;

  /* 🎭 Тонкие эффекты глубины */
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

/* 🎬 Анимация появления sticky элемента */
@keyframes stickySlideDown {
  0% {
    transform: translateY(-100%) translateZ(0);
    opacity: 0;
    filter: blur(4px);
  }
  50% {
    opacity: 0.8;
    filter: blur(2px);
  }
  100% {
    transform: translateY(0) translateZ(0);
    opacity: 1;
    filter: blur(0);
  }
}

/* 🎯 Анимация при загрузке страницы */
.is-sticky.initial-load {
  animation: stickyFadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

@keyframes stickyFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px) translateZ(0);
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateZ(0);
    filter: blur(0);
  }
}

/* 🎨 Hover эффекты для интерактивности */
.is-sticky:hover {
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px) translateZ(0) !important;
}

/* 📱 Микроанимации для элементов внутри sticky */
.is-sticky * {
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

.sticky-placeholder {
  width: 100%;
  pointer-events: none;
  transition: height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

/* 🎨 Дополнительные стили для плавности */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

/* 📱 Улучшения для мобильных устройств */
@media (max-width: 768px) {
  .is-sticky {
    border-radius: 0 0 16px 16px !important;
    /* Более мягкие тени на мобильных */
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
  }

  .is-sticky:hover {
    /* Убираем hover эффекты на мобильных */
    transform: translateY(0) translateZ(0) !important;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
  }
}

/* 🎭 Анимации для темной темы */
@media (prefers-color-scheme: dark) {
  .is-sticky {
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2) !important;
  }

  .is-sticky:hover {
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.25) !important;
  }
}

/* 🎯 Анимации для пользователей с ограниченной подвижностью */
@media (prefers-reduced-motion: reduce) {
  .is-sticky {
    animation: none !important;
    transition: none !important;
  }

  .is-sticky * {
    transition: none !important;
  }

  .sticky-placeholder {
    transition: none !important;
  }
}
</style>
