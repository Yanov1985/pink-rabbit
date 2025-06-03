import { ref, computed, reactive } from 'vue'

export const useAdvancedFilters = () => {
  // === СОСТОЯНИЕ ФИЛЬТРОВ ===

  // Основные фильтры
  const filters = reactive({
    // Диапазон цен
    priceRange: {
      min: 0,
      max: 50000,
      current: [0, 50000]
    },

    // Выбранные бренды
    selectedBrands: [],

    // Выбранные материалы
    selectedMaterials: [],

    // Выбранные цвета
    selectedColors: [],

    // Размеры и параметры
    diameter: {
      min: null,
      max: null
    },

    length: {
      min: null,
      max: null
    },

    // Функциональные характеристики
    vibrationModes: null,
    pulsationModes: null,
    waterproof: null,
    heating: null,
    electroStimulation: null,

    // Дополнительные фильтры
    inStock: false,
    onSale: false,
    newItems: false,
    hitItems: false
  })

  // Состояние развернутых секций фильтров
  const expandedSections = reactive({
    price: true,
    brands: true,
    materials: false,
    colors: false,
    parameters: false,
    functions: false,
    additional: false
  })

  // === ДОСТУПНЫЕ ОПЦИИ ФИЛЬТРОВ ===

  // Список брендов (как на оригинальном сайте)
  const availableBrands = ref([
    'LELO',
    'We-Vibe',
    'Satisfyer',
    'Fun Factory',
    'Womanizer',
    'OhMiBod',
    'Lovense',
    'Pipedream',
    'Doc Johnson',
    'CalExotics',
    'Tenga',
    'Bad Dragon',
    'Adam & Eve',
    'Spencer\'s'
  ])

  // Список материалов
  const availableMaterials = ref([
    'Медицинский силикон',
    'TPE',
    'ABS пластик',
    'Кибернетическая кожа',
    'Стекло',
    'Металл',
    'Латекс',
    'ПВХ',
    'Термопластик',
    'Гель'
  ])

  // Доступные цвета
  const availableColors = ref([
    { name: 'Розовый', value: 'pink', hex: '#ff69b4' },
    { name: 'Черный', value: 'black', hex: '#000000' },
    { name: 'Белый', value: 'white', hex: '#ffffff' },
    { name: 'Красный', value: 'red', hex: '#dc3545' },
    { name: 'Синий', value: 'blue', hex: '#007bff' },
    { name: 'Фиолетовый', value: 'purple', hex: '#6f42c1' },
    { name: 'Телесный', value: 'flesh', hex: '#f4c2a1' },
    { name: 'Прозрачный', value: 'transparent', hex: '#f8f9fa' },
    { name: 'Золото', value: 'gold', hex: '#ffd700' },
    { name: 'Серебро', value: 'silver', hex: '#c0c0c0' },
    { name: 'Зелёный', value: 'green', hex: '#28a745' },
    { name: 'Оранжевый', value: 'orange', hex: '#fd7e14' }
  ])

  // === МЕТОДЫ УПРАВЛЕНИЯ ФИЛЬТРАМИ ===

  // Переключение бренда
  const toggleBrand = (brand) => {
    const index = filters.selectedBrands.indexOf(brand)
    if (index > -1) {
      filters.selectedBrands.splice(index, 1)
    } else {
      filters.selectedBrands.push(brand)
    }
  }

  // Переключение материала
  const toggleMaterial = (material) => {
    const index = filters.selectedMaterials.indexOf(material)
    if (index > -1) {
      filters.selectedMaterials.splice(index, 1)
    } else {
      filters.selectedMaterials.push(material)
    }
  }

  // Переключение цвета
  const toggleColor = (color) => {
    const index = filters.selectedColors.indexOf(color)
    if (index > -1) {
      filters.selectedColors.splice(index, 1)
    } else {
      filters.selectedColors.push(color)
    }
  }

  // Переключение секции фильтров
  const toggleSection = (section) => {
    expandedSections[section] = !expandedSections[section]
  }

  // Сброс всех фильтров
  const resetFilters = () => {
    filters.priceRange.current = [0, 50000]
    filters.selectedBrands = []
    filters.selectedMaterials = []
    filters.selectedColors = []
    filters.diameter.min = null
    filters.diameter.max = null
    filters.length.min = null
    filters.length.max = null
    filters.vibrationModes = null
    filters.pulsationModes = null
    filters.waterproof = null
    filters.heating = null
    filters.electroStimulation = null
    filters.inStock = false
    filters.onSale = false
    filters.newItems = false
    filters.hitItems = false
  }

  // Проверка активности фильтров
  const hasActiveFilters = computed(() => {
    return (
      filters.selectedBrands.length > 0 ||
      filters.selectedMaterials.length > 0 ||
      filters.selectedColors.length > 0 ||
      filters.priceRange.current[0] > 0 ||
      filters.priceRange.current[1] < 50000 ||
      filters.diameter.min !== null ||
      filters.diameter.max !== null ||
      filters.length.min !== null ||
      filters.length.max !== null ||
      filters.vibrationModes !== null ||
      filters.pulsationModes !== null ||
      filters.waterproof !== null ||
      filters.heating !== null ||
      filters.electroStimulation !== null ||
      filters.inStock ||
      filters.onSale ||
      filters.newItems ||
      filters.hitItems
    )
  })

  // Количество активных фильтров
  const activeFiltersCount = computed(() => {
    let count = 0

    count += filters.selectedBrands.length
    count += filters.selectedMaterials.length
    count += filters.selectedColors.length

    if (filters.priceRange.current[0] > 0 || filters.priceRange.current[1] < 50000) count++
    if (filters.diameter.min !== null || filters.diameter.max !== null) count++
    if (filters.length.min !== null || filters.length.max !== null) count++
    if (filters.vibrationModes !== null) count++
    if (filters.pulsationModes !== null) count++
    if (filters.waterproof !== null) count++
    if (filters.heating !== null) count++
    if (filters.electroStimulation !== null) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    if (filters.newItems) count++
    if (filters.hitItems) count++

    return count
  })

  // Применение фильтров к товарам
  const applyFilters = (products) => {
    return products.filter(product => {
      // Фильтр по цене
      if (product.price < filters.priceRange.current[0] ||
          product.price > filters.priceRange.current[1]) {
        return false
      }

      // Фильтр по брендам
      if (filters.selectedBrands.length > 0 &&
          !filters.selectedBrands.includes(product.brand)) {
        return false
      }

      // Фильтр по материалам
      if (filters.selectedMaterials.length > 0 &&
          !filters.selectedMaterials.includes(product.material)) {
        return false
      }

      // Фильтр по цветам
      if (filters.selectedColors.length > 0 &&
          !filters.selectedColors.some(color =>
            product.color.toLowerCase().includes(color.toLowerCase()))) {
        return false
      }

      // Фильтр по наличию
      if (filters.inStock && !product.inStock) {
        return false
      }

      // Фильтр по скидкам
      if (filters.onSale && product.discount === 0) {
        return false
      }

      // Фильтр по новинкам
      if (filters.newItems && !product.isNew) {
        return false
      }

      // Фильтр по хитам
      if (filters.hitItems && !product.isHit) {
        return false
      }

      return true
    })
  }

  return {
    // Состояние
    filters,
    expandedSections,

    // Данные
    availableBrands,
    availableMaterials,
    availableColors,

    // Методы
    toggleBrand,
    toggleMaterial,
    toggleColor,
    toggleSection,
    resetFilters,
    applyFilters,

    // Вычисляемые свойства
    hasActiveFilters,
    activeFiltersCount
  }
}
