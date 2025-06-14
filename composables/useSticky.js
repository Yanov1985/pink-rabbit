/**
 * 🎯 Композабл для управления sticky поведением компонентов
 * Как в современных интернет-магазинах - компоненты прилипают к верху при прокрутке
 */

import { ref, onMounted, onUnmounted } from 'vue'

// 🕐 Собственная реализация debounce для оптимизации производительности
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const useSticky = (options = {}) => {
  // 📊 Настройки по умолчанию
  const defaultOptions = {
    offset: 0, // Отступ от верха экрана
    threshold: 100, // Порог срабатывания в пикселях
    zIndex: 1000, // Z-index для sticky элемента
    immediateSticky: false, // Немедленная активация sticky при инициализации
    alwaysSticky: false, // Всегда липкий (для навигационных элементов)
    ...options
  }

  // 🎛️ Реактивные переменные
  const isSticky = ref(false) // Состояние sticky
  const stickyElement = ref(null) // Ссылка на элемент
  const placeholder = ref(null) // Placeholder для предотвращения скачков
  const originalPosition = ref(0) // Исходная позиция элемента
  const originalStyles = ref(null) // Сохраненные стили элемента
  const isInitialized = ref(false) // Флаг инициализации

  // 📏 Функция для получения позиции элемента
  const getElementPosition = (element) => {
    if (!element) return 0

    // 🔍 Используем более надежный способ получения позиции
    const rect = element.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const elementTop = rect.top + scrollTop

    console.log("📏 getElementPosition Debug:", {
      rectTop: rect.top,
      scrollTop,
      elementTop,
      offsetTop: element.offsetTop,
      offsetParent: element.offsetParent
    });

    return elementTop
  }

  // 🎯 Обработчик прокрутки
  const handleScroll = () => {
    if (!stickyElement.value || !isInitialized.value) return;

    const rect = stickyElement.value.getBoundingClientRect();
    const shouldBeSticky = rect.top <= defaultOptions.offset;

    // 📊 Отладочная информация
    console.log("📊 Scroll Debug:", {
      scrollY: window.scrollY,
      elementTop: rect.top,
      offset: defaultOptions.offset,
      shouldBeSticky,
      currentlySticky: isSticky.value,
      elementHeight: stickyElement.value.offsetHeight,
      placeholderDisplay: placeholder.value?.style.display,
      placeholderHeight: placeholder.value?.offsetHeight
    });

    if (shouldBeSticky && !isSticky.value) {
      // 🎯 Активируем sticky режим
      console.log("🎯 Активируем sticky режим");

      // Сохраняем оригинальные стили если еще не сохранены
      if (!originalStyles.value) {
        originalStyles.value = {
          position: stickyElement.value.style.position,
          top: stickyElement.value.style.top,
          left: stickyElement.value.style.left,
          right: stickyElement.value.style.right,
          width: stickyElement.value.style.width,
          zIndex: stickyElement.value.style.zIndex,
        };
      }

      // Устанавливаем высоту placeholder равной высоте элемента
      if (placeholder.value) {
        placeholder.value.style.height = `${stickyElement.value.offsetHeight}px`;
        placeholder.value.style.display = 'block';
        console.log(`📐 Placeholder высота: ${stickyElement.value.offsetHeight}px`);
      }

      // Добавляем класс sticky
      stickyElement.value.classList.add('is-sticky');
      isSticky.value = true;

    } else if (!shouldBeSticky && isSticky.value) {
      // 🧹 Деактивируем sticky режим
      console.log("🧹 Деактивируем sticky режим");

      // Убираем класс sticky
      stickyElement.value.classList.remove('is-sticky');

      // Скрываем placeholder
      if (placeholder.value) {
        placeholder.value.style.display = 'none';
        placeholder.value.style.height = '0px';
        console.log("🧹 Placeholder скрыт");
      }

      isSticky.value = false;
    }
  };

  // 🚀 Инициализация sticky поведения
  const initSticky = (element) => {
    if (!element || typeof window === 'undefined') {
      console.warn('⚠️ Элемент не найден или SSR режим')
      return
    }

    console.log('🎯 Инициализация sticky поведения')
    stickyElement.value = element

    // 📏 Сохраняем исходную позицию элемента
    originalPosition.value = getElementPosition(element)

    // 🎨 Создаем placeholder для предотвращения скачков
    if (!placeholder.value) {
      placeholder.value = document.createElement('div')
      placeholder.value.style.display = 'none'
      placeholder.value.style.height = '0px'
      placeholder.value.style.transition = 'height 0.3s ease'
      placeholder.value.setAttribute('data-sticky-placeholder', 'true')

      // Вставляем placeholder перед sticky элементом
      element.parentNode.insertBefore(placeholder.value, element)
      console.log('📏 Создан placeholder для sticky элемента')
    }

    // 🎯 Добавляем обработчики событий
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // 🎯 УЛУЧШАЕМ: Инициализация для alwaysSticky и immediateSticky режимов
    if (defaultOptions.alwaysSticky || defaultOptions.immediateSticky) {
      console.log('🚀 Активируем немедленный sticky режим')

      // Небольшая задержка для завершения рендеринга
      setTimeout(() => {
        // Сохраняем оригинальные стили если еще не сохранены
        if (!originalStyles.value) {
          originalStyles.value = {
            position: element.style.position,
            top: element.style.top,
            left: element.style.left,
            right: element.style.right,
            width: element.style.width,
            zIndex: element.style.zIndex,
          };
        }

        // Добавляем класс sticky
        element.classList.add('is-sticky');
        isSticky.value = true;

        console.log('✅ Немедленный sticky режим активирован');
      }, 50); // Минимальная задержка для рендеринга
    }

    isInitialized.value = true;
    console.log('✅ Sticky поведение инициализировано');
  }

  // 🧹 Очистка sticky поведения
  const cleanup = () => {
    console.log('🧹 Очистка sticky поведения');

    if (stickyElement.value) {
      // Убираем класс sticky
      stickyElement.value.classList.remove('is-sticky');

      // Восстанавливаем оригинальные стили
      if (originalStyles.value) {
        const original = originalStyles.value;
        stickyElement.value.style.position = original.position || '';
        stickyElement.value.style.top = original.top || '';
        stickyElement.value.style.left = original.left || '';
        stickyElement.value.style.right = original.right || '';
        stickyElement.value.style.width = original.width || '';
        stickyElement.value.style.zIndex = original.zIndex || '';
      }
    }

    // Удаляем обработчики событий
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    }

    // Удаляем placeholder
    if (placeholder.value && placeholder.value.parentNode) {
      placeholder.value.parentNode.removeChild(placeholder.value);
    }

    // Сбрасываем состояние
    stickyElement.value = null;
    placeholder.value = null;
    isSticky.value = false;
    originalPosition.value = 0;
    originalStyles.value = null;
    isInitialized.value = false;

    console.log('✅ Sticky поведение очищено');
  }

  // 🎯 Хуки жизненного цикла
  onMounted(() => {
    // Инициализация будет вызвана вручную через initSticky
  })

  onUnmounted(() => {
    cleanup()
  })

  // 📱 Обработчик изменения размера окна
  const handleResize = debounce(() => {
    console.log("📱 Обработка изменения размера окна");

    if (!stickyElement.value) return;

    // 🔄 Пересчитываем позицию элемента
    originalPosition.value = getElementPosition(stickyElement.value);
    console.log("📏 Новая позиция после ресайза:", originalPosition.value);

    // 🎯 Обновляем placeholder если sticky активен
    if (isSticky.value && placeholder.value) {
      const elementHeight = stickyElement.value.offsetHeight;
      placeholder.value.style.height = `${elementHeight}px`;
      console.log("📏 Обновляем высоту placeholder после ресайза:", elementHeight + "px");
    }

    // 🔄 Принудительно проверяем состояние
    handleScroll();
  }, 250); // Дебаунс 250мс для оптимизации производительности

  // 📤 Возвращаем API композабла
  return {
    isSticky,
    stickyElement,
    initSticky,
    cleanup,
    handleScroll
  }
}

/**
 * 🎨 CSS классы для sticky поведения (добавить в глобальные стили)
 *
 * .is-sticky {
 *   position: fixed !important;
 *   top: 0;
 *   left: 0;
 *   right: 0;
 *   z-index: 1000;
 *   animation: stickySlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 * }
 *
 * @keyframes stickySlideDown {
 *   from {
 *     transform: translateY(-100%);
 *     opacity: 0;
 *   }
 *   to {
 *     transform: translateY(0);
 *     opacity: 1;
 *   }
 * }
 *
 * .sticky-placeholder {
 *   width: 100%;
 *   pointer-events: none;
 * }
 */
