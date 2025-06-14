/**
 * 🎯 Композабл для управления sticky поведением компонентов
 * Как в современных интернет-магазинах - компоненты прилипают к верху при прокрутке
 */

import { ref, onMounted, onUnmounted } from 'vue'

export const useSticky = (options = {}) => {
  // 📊 Настройки по умолчанию
  const defaultOptions = {
    offset: 0, // Отступ от верха экрана
    threshold: 100, // Порог срабатывания в пикселях
    zIndex: 1000, // Z-index для sticky элемента
    ...options
  }

  // 🎛️ Реактивные переменные
  const isSticky = ref(false) // Состояние sticky
  const stickyElement = ref(null) // Ссылка на элемент
  const placeholder = ref(null) // Placeholder для предотвращения скачков
  const originalPosition = ref(0) // Исходная позиция элемента

  // 📏 Функция для получения позиции элемента
  const getElementPosition = (element) => {
    if (!element) return 0
    const rect = element.getBoundingClientRect()
    return rect.top + window.pageYOffset
  }

  // 🎯 Обработчик прокрутки - как в Tinder, плавно и отзывчиво
  const handleScroll = () => {
    if (!stickyElement.value) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const elementTop = originalPosition.value
    const shouldBeSticky = scrollTop > (elementTop - defaultOptions.offset)

    // 🔄 Изменяем состояние только при необходимости
    if (shouldBeSticky !== isSticky.value) {
      isSticky.value = shouldBeSticky

      // 📱 Добавляем/убираем классы для анимации
      if (isSticky.value) {
        stickyElement.value.classList.add('is-sticky')
        // Показываем placeholder для предотвращения скачков контента
        if (placeholder.value) {
          placeholder.value.style.display = 'block'
          placeholder.value.style.height = `${stickyElement.value.offsetHeight}px`
        }
      } else {
        stickyElement.value.classList.remove('is-sticky')
        // Скрываем placeholder
        if (placeholder.value) {
          placeholder.value.style.display = 'none'
        }
      }
    }
  }

  // 🚀 Инициализация sticky поведения
  const initSticky = (element) => {
    if (!element) return

    stickyElement.value = element
    originalPosition.value = getElementPosition(element)

    // 📱 Создаем placeholder элемент
    const placeholderEl = document.createElement('div')
    placeholderEl.className = 'sticky-placeholder'
    placeholderEl.style.display = 'none'
    placeholderEl.style.visibility = 'hidden'
    element.parentNode.insertBefore(placeholderEl, element)
    placeholder.value = placeholderEl

    // 🎨 Добавляем базовые стили для sticky элемента
    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    element.style.zIndex = defaultOptions.zIndex

    // 📊 Добавляем обработчик прокрутки
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', () => {
      originalPosition.value = getElementPosition(element)
    }, { passive: true })

    // 🔄 Проверяем начальное состояние
    handleScroll()
  }

  // 🧹 Очистка ресурсов
  const destroySticky = () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)

    if (stickyElement.value) {
      stickyElement.value.classList.remove('is-sticky')
    }

    if (placeholder.value && placeholder.value.parentNode) {
      placeholder.value.parentNode.removeChild(placeholder.value)
    }
  }

  // 🎯 Хуки жизненного цикла
  onMounted(() => {
    // Инициализация будет вызвана вручную через initSticky
  })

  onUnmounted(() => {
    destroySticky()
  })

  // 📤 Возвращаем API композабла
  return {
    isSticky,
    stickyElement,
    initSticky,
    destroySticky,
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
