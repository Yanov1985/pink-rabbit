// Композабл для управления каталогом товаров
// Интеграция с детальной картой каталога Pink Rabbit
import { DETAILED_CATALOG_MAP, CATALOG_UTILS } from './catalogMapDetailed.js'

export const useCatalog = (initialPath = null) => {
  // Используем нашу детальную карту каталога
  const catalogStructure = DETAILED_CATALOG_MAP

  // Функция для разбора пути и получения категории
  const parseCategoryPath = (pathArray) => {
    try {
      // ИСПРАВЛЯЕМ: Очищаем путь от пустых элементов в самом начале
      const cleanedPath = pathArray ? pathArray.filter(segment => segment && segment.trim() !== '') : [];

      console.log('🧹 Очистка пути:', pathArray, '→', cleanedPath);

      // Если путь пустой, возвращаем основные категории
      if (!cleanedPath || cleanedPath.length === 0) {
        console.log('🏠 Главная страница каталога - показываем все подкатегории');

        // ИСПРАВЛЯЕМ: Получаем все подкатегории для главной страницы каталога
        const allSubcategories = CATALOG_UTILS.getSubcategories([]);

        console.log('📦 Все подкатегории для главной:', allSubcategories.length);

        return {
          breadcrumbs: [],
          currentCategory: null,
          availableSubcategories: allSubcategories, // Возвращаем все подкатегории
          categoryPath: [],
          fullPath: '/catalog/'
        }
      }

      // НОВАЯ ЛОГИКА: Обработка прямых путей для основных гендерных категорий
      // Если путь содержит только одну из основных категорий, преобразуем его
      let actualPath = [...cleanedPath];

      if (cleanedPath.length === 1 && ['dlya-nee', 'dlya-nego', 'dlya-par'].includes(cleanedPath[0])) {
        // Внутренне добавляем seks-igrushki для корректной работы системы
        actualPath = ['seks-igrushki', cleanedPath[0]];
        console.log('🔄 Преобразование прямого пути:', cleanedPath, '→', actualPath);
      }

      // Строим полный URL из фактического массива путей
      const fullPath = `/catalog/${actualPath.join('/')}`

      // Используем утилиты из детальной карты для поиска категории
      const categoryData = CATALOG_UTILS.findByUrl(fullPath)

      // Генерируем хлебные крошки используя фактический массив пути
      const breadcrumbs = CATALOG_UTILS.generateBreadcrumbs(actualPath)

      // Получаем подкатегории текущей категории
      const subcategories = CATALOG_UTILS.getSubcategories(actualPath)

      console.log('📊 Результат parseCategoryPath:', {
        cleanedPath,
        actualPath,
        fullPath,
        breadcrumbsCount: breadcrumbs.length,
        subcategoriesCount: subcategories.length
      });

      return {
        breadcrumbs,
        currentCategory: categoryData,
        availableSubcategories: subcategories,
        categoryPath: actualPath, // Возвращаем фактический путь для внутренней работы
        originalPath: cleanedPath,  // Сохраняем очищенный оригинальный путь для URL
        fullPath
      }
    } catch (error) {
      console.error('Ошибка при разборе пути категории:', error)
      return {
        breadcrumbs: [],
        currentCategory: null,
        availableSubcategories: [],
        categoryPath: pathArray || [],
        originalPath: pathArray || [],
        fullPath: '/catalog/'
      }
    }
  }

  // Функция для получения всех товаров категории
  const getCategoryProducts = async (categoryPath, filters = {}, sort = 'popular') => {
    try {
      console.log('🛍️ Загружаем товары для категории:', categoryPath);

      // Получаем данные категории
      const fullPath = `/catalog/${categoryPath.join('/')}`
      const categoryData = CATALOG_UTILS.findByUrl(fullPath)

      // ИСПРАВЛЯЕМ: Создаем fallback данные категории для тестирования
      const fallbackCategoryData = {
        id: categoryPath.join('-'),
        name: categoryPath[categoryPath.length - 1] || 'Товары',
        slug: categoryPath[categoryPath.length - 1] || 'products',
        description: `Товары категории ${categoryPath.join(' / ')}`,
        productCount: 24 // Генерируем 24 тестовых товара
      };

      const finalCategoryData = categoryData || fallbackCategoryData;

      console.log('📦 Данные категории:', finalCategoryData);

      if (!categoryData) {
        console.warn(`⚠️ Категория не найдена в карте: ${fullPath}, используем fallback данные`)
      }

      // Здесь будет API вызов к Django бэкенду
      const queryParams = new URLSearchParams({
        category: categoryPath.join('/'),
        sort,
        ...filters
      })

      // Пока что возвращаем моковые данные с учетом реальной структуры
      const mockProducts = await getMockProducts(finalCategoryData, filters)

      console.log('✅ Сгенерировано товаров:', mockProducts.length);

      return {
        products: mockProducts,
        totalCount: finalCategoryData.productCount || 24,
        currentPage: 1,
        totalPages: Math.ceil((finalCategoryData.productCount || 24) / 12),
        categoryData: finalCategoryData
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки товаров:', error)

      // ДОБАВЛЯЕМ: Возвращаем базовые тестовые товары даже при ошибке
      const emergencyProducts = await getEmergencyMockProducts(categoryPath);

      return {
        products: emergencyProducts,
        totalCount: emergencyProducts.length,
        currentPage: 1,
        totalPages: Math.ceil(emergencyProducts.length / 12),
        categoryData: {
          id: 'emergency',
          name: 'Тестовые товары',
          slug: 'test-products',
          description: 'Тестовые товары для демонстрации'
        }
      }
    }
  }

  // ДОБАВЛЯЕМ: Красивые заглушки изображений из Unsplash (как на главной странице)
  const placeholderImages = [
    "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1619252584172-a83a949e6efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1619252584172-a83a949e6efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  // ДОБАВЛЯЕМ: Функция для получения случайного изображения из массива
  const getRandomPlaceholderImage = () => {
    return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
  };

  // ДОБАВЛЯЕМ: Функция для получения набора изображений для товара
  const getProductImages = (productIndex) => {
    const images = [];
    const startIndex = (productIndex * 4) % placeholderImages.length;

    for (let i = 0; i < 4; i++) {
      const imageIndex = (startIndex + i) % placeholderImages.length;
      images.push(placeholderImages[imageIndex]);
    }

    return images;
  };

  // ДОБАВЛЯЕМ: Функция для создания экстренных тестовых товаров
  const getEmergencyMockProducts = async (categoryPath) => {
    console.log('🚨 Создаем экстренные тестовые товары для:', categoryPath);

    const categoryName = categoryPath[categoryPath.length - 1] || 'Товар';
    const products = [];

    // Создаем 12 базовых тестовых товаров
    for (let i = 1; i <= 12; i++) {
      products.push({
        id: `emergency-${categoryPath.join('-')}-${i}`,
        name: `${categoryName} №${i}`,
        slug: `${categoryName.toLowerCase()}-${i}`,
        description: `Тестовый товар №${i} из категории "${categoryName}". Это демонстрационный товар для проверки работы интерфейса.`,
        price: Math.floor(Math.random() * 3000) + 500,
        originalPrice: Math.random() > 0.6 ? Math.floor(Math.random() * 4000) + 1000 : null,
        image: getRandomPlaceholderImage(),
        images: getProductImages(i),
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 звезд
        reviews: Math.floor(Math.random() * 50) + 5,
        inStock: Math.random() > 0.2, // 80% товаров в наличии
        isNew: Math.random() > 0.7, // 30% новинок
        isHit: Math.random() > 0.8, // 20% хитов
        discount: Math.random() > 0.6 ? Math.floor(Math.random() * 25) + 5 : 0,
        category: categoryName,
        categorySlug: categoryPath.join('-'),
        tags: [categoryName, 'Тестовый', 'Демо'],
        brand: `TestBrand ${Math.floor(Math.random() * 5) + 1}`,
        inWishlist: false,
        inCompare: false
      });
    }

    console.log('✅ Создано экстренных товаров:', products.length);
    return products;
  };

  // Обновленная функция для получения моковых товаров
  const getMockProducts = async (categoryData, filters = {}) => {
    console.log('🎭 Создаем моковые товары для категории:', categoryData.name);

    // Генерируем товары на основе реальной категории
    const productCount = Math.min(categoryData.productCount || 12, 24)
    const products = []

    // Цветовая схема для разных категорий
    const categoryColors = {
      'dlya-nee': 'ec4899', // розовый для женщин
      'dlya-nego': '3b82f6', // синий для мужчин
      'dlya-par': '8b5cf6', // фиолетовый для пар
      'vibratory': 'f59e0b', // оранжевый для вибраторов
      'falloimitatory': 'ef4444', // красный для фаллоимитаторов
      'default': 'ec4899' // розовый по умолчанию
    };

    const categoryColor = categoryColors[categoryData.slug] || categoryColors['default'];

    for (let i = 1; i <= productCount; i++) {
      products.push({
        id: `${categoryData.id}-product-${i}`,
        name: `${categoryData.name} "${getProductNameVariant(categoryData.name, i)}"`,
        slug: `${categoryData.slug}-product-${i}`,
        description: `Качественный товар из категории "${categoryData.name}". ${categoryData.description || 'Высокое качество, безопасные материалы, дискретная доставка.'}`,
        price: Math.floor(Math.random() * 4000) + 800,
        originalPrice: Math.random() > 0.6 ? Math.floor(Math.random() * 6000) + 1200 : null,
        image: getRandomPlaceholderImage(),
        images: getProductImages(i),
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

    console.log('✅ Создано моковых товаров:', products.length);
    return products
  }

  // ДОБАВЛЯЕМ: Функция для генерации вариантов названий товаров
  const getProductNameVariant = (categoryName, index) => {
    const variants = [
      'Премиум',
      'Классик',
      'Делюкс',
      'Элит',
      'Стандарт',
      'Профи',
      'Мастер',
      'Эксперт',
      'Топ',
      'Бест'
    ];

    return variants[index % variants.length];
  };

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

  // Функция для получения подкатегорий
  const getSubcategories = (categoryPath) => {
    try {
      console.log('🏠 Получение подкатегорий для пути:', categoryPath);
      return CATALOG_UTILS.getSubcategories(categoryPath);
    } catch (error) {
      console.error('Ошибка получения подкатегорий:', error);
      return [];
    }
  };

  // Возвращаем все функции для использования в компонентах
  return {
    // Основные функции
    parseCategoryPath,
    getCategoryProducts,
    getCategoryFilters,
    getCategorySEO,
    getSubcategories,

    // Утилиты для работы с категориями
    getCategoryById,
    getCategoriesByLevel,
    searchCategories,
    getRelatedCategories,

    // Прямой доступ к структуре и утилитам
    catalogStructure,
    catalogUtils: CATALOG_UTILS,

    // Вспомогательные функции
    getMockProducts,
    getEmergencyMockProducts,
    getProductNameVariant,
    getRandomPlaceholderImage,
    getProductImages
  }
}
