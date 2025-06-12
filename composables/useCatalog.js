// Композабл для управления каталогом товаров
// Интеграция с детальной картой каталога Pink Rabbit
import { DETAILED_CATALOG_MAP, CATALOG_UTILS } from './catalogMapDetailed.js'

export const useCatalog = () => {
  // Используем нашу детальную карту каталога
  const catalogStructure = DETAILED_CATALOG_MAP

  // Функция для разбора пути и получения категории
  const parseCategoryPath = (pathArray) => {
    try {
      // Если путь пустой, возвращаем основные категории
      if (!pathArray || pathArray.length === 0) {
        return {
          breadcrumbs: [],
          currentCategory: null,
          availableSubcategories: [
            DETAILED_CATALOG_MAP.forWomen,
            DETAILED_CATALOG_MAP.forMen,
            DETAILED_CATALOG_MAP.forCouples
          ],
          categoryPath: [],
          fullPath: '/catalog/'
        }
      }

      // Строим полный URL из массива путей
      const fullPath = `/catalog/${pathArray.join('/')}`

      // Используем утилиты из детальной карты для поиска категории
      const categoryData = CATALOG_UTILS.findByUrl(fullPath)

      // Генерируем хлебные крошки используя массив пути (НЕ ID!)
      const breadcrumbs = CATALOG_UTILS.generateBreadcrumbs(pathArray)

      // Получаем подкатегории текущей категории
      const subcategories = CATALOG_UTILS.getSubcategories(pathArray)

      return {
        breadcrumbs,
        currentCategory: categoryData,
        availableSubcategories: subcategories,
        categoryPath: pathArray,
        fullPath
      }
    } catch (error) {
      console.error('Ошибка при разборе пути категории:', error)
      return {
        breadcrumbs: [],
        currentCategory: null,
        availableSubcategories: [],
        categoryPath: pathArray || [],
        fullPath: '/catalog/'
      }
    }
  }

  // Функция для получения всех товаров категории
  const getCategoryProducts = async (categoryPath, filters = {}, sort = 'popular') => {
    try {
      // Получаем данные категории
      const fullPath = `/catalog/${categoryPath.join('/')}`
      const categoryData = CATALOG_UTILS.findByUrl(fullPath)

      if (!categoryData) {
        console.warn(`Категория не найдена: ${fullPath}`)
        // Возвращаем пустой результат вместо ошибки
        return {
          products: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 0,
          categoryData: null
        }
      }

      // Здесь будет API вызов к Django бэкенду
      const queryParams = new URLSearchParams({
        category: categoryPath.join('/'),
        sort,
        ...filters
      })

      // Пока что возвращаем моковые данные с учетом реальной структуры
      const mockProducts = await getMockProducts(categoryData, filters)

      return {
        products: mockProducts,
        totalCount: categoryData.productCount || 150,
        currentPage: 1,
        totalPages: Math.ceil((categoryData.productCount || 150) / 12),
        categoryData
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error)
      return {
        products: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        categoryData: null
      }
    }
  }

  // Обновленная функция для получения моковых товаров
  const getMockProducts = async (categoryData, filters = {}) => {
    // Генерируем товары на основе реальной категории
    const productCount = Math.min(categoryData.productCount || 12, 50)
    const products = []

    for (let i = 1; i <= productCount; i++) {
      products.push({
        id: `${categoryData.id}-product-${i}`,
        name: `${categoryData.name} ${i}`,
        slug: `${categoryData.slug}-product-${i}`,
        description: `Качественный товар из категории "${categoryData.name}". ${categoryData.description}`,
        price: Math.floor(Math.random() * 5000) + 500,
        originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 7000) + 1000 : null,
        image: `/images/products/${categoryData.slug}/${i}.jpg`,
        images: [
          `/images/products/${categoryData.slug}/${i}-1.jpg`,
          `/images/products/${categoryData.slug}/${i}-2.jpg`,
          `/images/products/${categoryData.slug}/${i}-3.jpg`
        ],
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 звезд
        reviews: Math.floor(Math.random() * 100) + 10,
        inStock: Math.random() > 0.1, // 90% товаров в наличии
        isNew: Math.random() > 0.8, // 20% новинок
        isHit: Math.random() > 0.85, // 15% хитов
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0,
        category: categoryData.name,
        categorySlug: categoryData.slug,
        tags: [categoryData.name, 'Качество', 'Популярное'],
        brand: `Brand ${Math.floor(Math.random() * 10) + 1}`,
        inWishlist: false,
        inCompare: false
      })
    }

    return products
  }

  // Функция для получения фильтров категории
  const getCategoryFilters = (categoryPath) => {
    try {
      const fullPath = `/catalog/${categoryPath.join('/')}`
      const categoryData = CATALOG_UTILS.findByUrl(fullPath)

      if (!categoryData) {
        return {}
      }

      // Возвращаем фильтры на основе типа категории
      const baseFilters = {
        price: { min: 0, max: 10000 },
        inStock: true,
        brands: ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4', 'Brand 5'],
        rating: [1, 2, 3, 4, 5]
      }

      // Добавляем специфичные фильтры в зависимости от категории
      if (categoryData.slug.includes('vibratory')) {
        baseFilters.vibrationModes = ['Одиночная', 'Множественная', 'Пульсация']
        baseFilters.materials = ['Силикон', 'ABS пластик', 'Металл']
        baseFilters.waterproof = ['Да', 'Нет']
      }

      if (categoryData.slug.includes('masturbatory')) {
        baseFilters.textures = ['Гладкая', 'Рельефная', 'Комбинированная']
        baseFilters.materials = ['TPE', 'Силикон', 'Кибер-кожа']
      }

      return baseFilters
    } catch (error) {
      console.error('Ошибка получения фильтров:', error)
      return {}
    }
  }

  // Функция для получения SEO данных категории
  const getCategorySEO = (categoryPath) => {
    try {
      const fullPath = `/catalog/${categoryPath.join('/')}`
      const categoryData = CATALOG_UTILS.findByUrl(fullPath)

      if (!categoryData) {
        return CATALOG_UTILS.getSEOData('root')
      }

      return CATALOG_UTILS.getSEOData(categoryData.id)
    } catch (error) {
      console.error('Ошибка получения SEO данных:', error)
      return {
        title: 'Каталог товаров',
        description: 'Интернет-магазин товаров для взрослых',
        keywords: 'интернет-магазин, товары для взрослых'
      }
    }
  }

  // Функция для получения категории по ID
  const getCategoryById = (categoryId) => {
    return CATALOG_UTILS.findById(categoryId)
  }

  // Функция для получения всех категорий определенного уровня
  const getCategoriesByLevel = (level) => {
    return CATALOG_UTILS.getCategoriesByLevel(level)
  }

  // Функция для поиска категорий
  const searchCategories = (query) => {
    const allCategories = CATALOG_UTILS.getAllCategories()
    return allCategories.filter(category =>
      category.name.toLowerCase().includes(query.toLowerCase()) ||
      category.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Функция для получения связанных категорий
  const getRelatedCategories = (categoryId) => {
    return CATALOG_UTILS.getRelatedCategories(categoryId)
  }

  // Возвращаем все функции для использования в компонентах
  return {
    // Основные функции
    parseCategoryPath,
    getCategoryProducts,
    getCategoryFilters,
    getCategorySEO,

    // Утилиты для работы с категориями
    getCategoryById,
    getCategoriesByLevel,
    searchCategories,
    getRelatedCategories,

    // Прямой доступ к структуре и утилитам
    catalogStructure,
    catalogUtils: CATALOG_UTILS,

    // Вспомогательные функции
    getMockProducts
  }
}
