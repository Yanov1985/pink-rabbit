/**
 * 🗺️ ДЕТАЛЬНАЯ КАРТА КАТАЛОГА PINK RABBIT
 * Полная структура каталога со всеми категориями, подкатегориями и под-подкатегориями
 *
 * Архитектура как в настоящем торговом комплексе:
 * - Этажи (основные категории)
 * - Отделы (подкатегории)
 * - Секции (под-подкатегории)
 * - Бренды (специализированные разделы)
 */

export const DETAILED_CATALOG_MAP = {
  // 🏪 КОРНЕВОЙ КАТАЛОГ
  root: {
    id: 'seks-igrushki',
    name: 'Секс игрушки',
    slug: 'seks-igrushki',
    url: '/catalog/seks-igrushki/',
    description: 'Каталог интимных товаров для взрослых',
    seoTitle: 'Секс игрушки - Pink Rabbit',
    seoDescription: 'Широкий выбор качественных товаров для взрослых в интернет-магазине Pink Rabbit',
    icon: '🌹',
    totalProducts: 112
  },

  // 👩 ДЛЯ ЖЕНЩИН - Первый этаж торгового центра
  forWomen: {
    id: 'dlya-nee',
    name: 'Для женщин',
    slug: 'dlya-nee',
    url: '/catalog/seks-igrushki/dlya-nee/',
    parentSlug: 'seks-igrushki',
    description: 'Интимные товары для женщин',
    icon: '👩',
    subcategories: {
      // 📳 ВИБРАТОРЫ - Большой отдел электроники
      vibrators: {
        id: 'vibratory',
        name: 'Вибраторы',
        slug: 'vibratory',
        url: '/catalog/seks-igrushki/dlya-nee/vibratory/',
        parentPath: 'seks-igrushki/dlya-nee',
        description: 'Все виды вибраторов для женщин',
        icon: '📳',
        subcategories: {
          elite: { id: 'elitnye', name: 'Элитные вибраторы', slug: 'elitnye' },
          forCouples: { id: 'dlya-par', name: 'Вибраторы для пар', slug: 'dlya-par' },
          hitech: { id: 'hi-tech', name: 'Hi-tech вибраторы', slug: 'hi-tech' },
          multifunctional: { id: 'mnogofunkcionalnye', name: 'Многофункциональные', slug: 'mnogofunkcionalnye' },
          gspot: { id: 'tochki-g', name: 'Вибраторы точки G', slug: 'vibratory_tochki_g' },
          eggs: { id: 'vibroyaica', name: 'Виброяйцо', slug: 'vibroyaica' },
          mini: { id: 'mini', name: 'Минивибраторы', slug: 'mini' },
          anal: { id: 'analnye', name: 'Анальные вибраторы', slug: 'analnye' },
          remote: { id: 'radioupravlenie', name: 'На радиоуправлении', slug: 'radioupravlenie' },
          vaginal: { id: 'vaginalnye', name: 'Вагинальные вибраторы', slug: 'vaginalnye' },
          breast: { id: 'dlya-grudi', name: 'Вибраторы для груди', slug: 'dlya-grudi' },
          rabbit: { id: 'kroliki', name: 'Вибраторы кролики', slug: 'kroliki' },
          sets: { id: 'nabory', name: 'Наборы вибраторов', slug: 'nabory' },
          unusual: { id: 'neobychnye', name: 'Необычные вибраторы', slug: 'neobychnye' },
          rotating: { id: 'rotaciya', name: 'С ротацией, крутящиеся', slug: 'rotaciya' }
        }
      },

      // 🍆 ФАЛЛОИМИТАТОРЫ - Отдел реалистичных товаров
      dildos: {
        id: 'falloimitatory',
        name: 'Фаллоимитаторы',
        slug: 'falloimitatory',
        url: '/catalog/seks-igrushki/dlya-nee/falloimitatory/',
        parentPath: 'seks-igrushki/dlya-nee',
        description: 'Реалистичные и дизайнерские фаллоимитаторы',
        icon: '🍆',
        subcategories: {
          realistic: { id: 'realistichnye', name: 'Реалистичные', slug: 'realistichnye' },
          anal: { id: 'analnye', name: 'Анальные', slug: 'analnye' },
          fisting: { id: 'dlya-fistinga', name: 'Для фистинга', slug: 'dlya-fistinga' },
          double: { id: 'dvoynye', name: 'Двойные', slug: 'dvoynye' },
          designer: { id: 'dizaynerskie', name: 'Дизайнерские', slug: 'dizaynerskie' },
          withoutBalls: { id: 'bez-moshonki', name: 'Без мошонки', slug: 'bez-moshonki' },
          withBalls: { id: 's-moshonkoy', name: 'С мошонкой', slug: 's-moshonkoy' },
          unusual: { id: 'neobychnye', name: 'Необычные', slug: 'neobychnye' }
        }
      },

      // 💪 ВАГИНАЛЬНЫЕ ТРЕНАЖЕРЫ - Спортивный отдел
      vaginalTrainers: {
        id: 'vaginalnye-trenazhery',
        name: 'Вагинальные тренажеры',
        slug: 'vaginalnaie_stimulatory',
        url: '/catalog/seks-igrushki/dlya-nee/vaginalnaie_stimulatory/',
        parentPath: 'seks-igrushki/dlya-nee',
        description: 'Тренажеры для укрепления мышц тазового дна',
        icon: '💪',
        subcategories: {
          kegel: { id: 'kegela', name: 'Тренажеры Кегеля', slug: 'kegela' },
          balls: { id: 'shariki', name: 'Вагинальные шарики', slug: 'shariki' }
        }
      },

      // 💎 СТИМУЛЯТОРЫ КЛИТОРА - Ювелирный отдел
      clitoralStimulators: {
        id: 'stimulyatory-klitora',
        name: 'Стимуляторы клитора',
        slug: 'klitoralnye_stimulatory',
        url: '/catalog/seks-igrushki/dlya-nee/klitoralnye_stimulatory/',
        parentPath: 'seks-igrushki/dlya-nee',
        description: 'Специализированные стимуляторы для клитора',
        icon: '💎',
        subcategories: {
          vacuum: { id: 'vakuumnye', name: 'Вакуумные стимуляторы', slug: 'vakuumnye' },
          hitachi: { id: 'hitachi', name: 'HITACHI и аналоги', slug: 'hitachi' },
          bullets: { id: 'vibropuli', name: 'Вибропули', slug: 'vibropuli' },
          panties: { id: 'vibrotrusiki', name: 'Вибротрусики', slug: 'vibrotrusiki' },
          finger: { id: 'na-palec', name: 'Насадки на палец', slug: 'na-palec' },
          contactless: { id: 'beskontaktnye', name: 'Бесконтактные стимуляторы клитора', slug: 'beskontaktnye' },
          vibrators: { id: 'vibratory-klitora', name: 'Вибраторы для клитора', slug: 'vibratory-klitora' },
          butterfly: { id: 'babochka', name: 'Стимуляторы клитора бабочка', slug: 'babochka' }
        }
      },

      // 🎯 ВИБРАТОРЫ ТОЧКИ G - Специализированная секция
      gSpotVibrators: {
        id: 'stimulyatory-tochki-g',
        name: 'Стимуляторы точки G',
        slug: 'stimulyatory_tochki_g',
        url: '/catalog/seks-igrushki/stimulyatory/stimulyatory_tochki_g/',
        parentPath: 'seks-igrushki/dlya-nee',
        description: 'Изогнутые вибраторы для стимуляции точки G',
        icon: '🎯'
      },

      // 🥚 ВИБРОЯЙЦО - Компактный отдел
      vibratingEggs: {
        id: 'vibroyaytso',
        name: 'Виброяйцо',
        slug: 'vibroyaica',
        url: '/catalog/seks-igrushki/vibratory/vibroyaica/',
        parentPath: 'seks-igrushki/dlya-nee',
        description: 'Компактные вибрирующие яйца',
        icon: '🥚'
      },

      // 🔌 АНАЛЬНЫЕ ПРОБКИ - Специализированный отдел
      analPlugs: {
        id: 'analnye-igrushki',
        name: 'Анальные игрушки',
        slug: 'analnye_igrushki',
        url: '/catalog/seks-igrushki/analnaya_stimulacia/analnye_igrushki/',
        parentPath: 'seks-igrushki/dlya-nee',
        description: 'Анальные игрушки для женщин',
        icon: '🔌',
        subcategories: {
          withTail: { id: 's-hvostom', name: 'С хвостом', slug: 's-hvostom' },
          large: { id: 'bolshie', name: 'Большие', slug: 'bolshie' },
          vibrating: { id: 's-vibraciey', name: 'С вибрацией', slug: 's-vibraciey' },
          beginners: { id: 'dlya-nachinayushchih', name: 'Для начинающих', slug: 'dlya-nachinayushchih' },
          wearable: { id: 'dlya-nosheniya', name: 'Для ношения', slug: 'dlya-nosheniya' },
          small: { id: 'malenkie', name: 'Маленькие', slug: 'malenkie' },
          metal: { id: 'metallicheskie', name: 'Металлические', slug: 'metallicheskie' },
          sets: { id: 'nabor', name: 'Набор анальных пробок', slug: 'nabor' },
          bunnyTail: { id: 'zaychiy-hvost', name: 'С заячьим хвостом', slug: 'zaychiy-hvost' },
          withRing: { id: 's-kolcom', name: 'С кольцом', slug: 's-kolcom' },
          horseTail: { id: 'konskiy-hvost', name: 'С конским хвостом', slug: 'konskiy-hvost' },
          remote: { id: 's-pultom', name: 'С пультом', slug: 's-pultom' },
          foxTail: { id: 'hvost-lisy', name: 'С хвостом лисы', slug: 'hvost-lisy' },
          silicone: { id: 'silikonovy', name: 'Силиконовые', slug: 'silikonovy' },
          weighted: { id: 'smeshchennyy-centr', name: 'Со смещенным центром тяжести', slug: 'smeshchennyy-centr' },
          jeweled: { id: 'so-strazami', name: 'Со стразами', slug: 'so-strazami' },
          glass: { id: 'steklyannye', name: 'Стеклянные', slug: 'steklyannye' }
        }
      },

      // 👙 ЖЕНСКОЕ НИЖНЕЕ БЕЛЬЕ - Модный отдел
      lingerie: {
        id: 'belye',
        name: 'Женское нижнее белье',
        slug: 'eroticheskoe_belyo_i_obuv',
        url: '/catalog/eroticheskoe_belyo_i_obuv/',
        parentPath: 'seks-igrushki/dlya-nee',
        description: 'Эротическое белье и аксессуары',
        icon: '👙',
        subcategories: {
          panties: { id: 'trusiki', name: 'Женские трусики', slug: 'trusiki' },
          bras: { id: 'byusgaltery', name: 'Бюстгальтеры', slug: 'byusgaltery' },
          garters: { id: 'poyasa-podvyazki', name: 'Пояса и подвязки', slug: 'poyasa-podvyazki' },
          sets: { id: 'komplekty', name: 'Комплекты белья', slug: 'komplekty' },
          corsets: { id: 'korsety', name: 'Корсеты', slug: 'korsety' },
          pasties: { id: 'pestis', name: 'Пэстис', slug: 'pestis' },
          nightgowns: { id: 'sorochki', name: 'Сорочки', slug: 'sorochki' },
          dresses: { id: 'platya-yubki', name: 'Платья и юбки', slug: 'platya-yubki' },
          costumes: { id: 'kostyumy', name: 'Костюмы', slug: 'kostyumy' },
          stockings: { id: 'chulki-kolgotki', name: 'Чулки и колготки', slug: 'chulki-kolgotki' },
          menUnderwear: { id: 'muzhskoe-bele', name: 'Мужское белье', slug: 'muzhskoe-bele' },
          harnesses: { id: 'portupei', name: 'Портупеи', slug: 'portupei' }
        }
      }
    }
  },

  // 👨 ДЛЯ МУЖЧИН - Второй этаж торгового центра
  forMen: {
    id: 'dlya-nego',
    name: 'Для мужчин',
    slug: 'dlya-nego',
    url: '/catalog/seks-igrushki/dlya_nego/',
    parentSlug: 'seks-igrushki',
    description: 'Интимные товары для мужчин',
    icon: '👨',
    subcategories: {
      // 🕳️ МАСТУРБАТОРЫ - Главный мужской отдел
      masturbators: {
        id: 'masturbatory',
        name: 'Мастурбаторы',
        slug: 'vaginy_i_masturbatory',
        url: '/catalog/seks-igrushki/vaginy_i_masturbatory/',
        parentPath: 'seks-igrushki/dlya-nego',
        description: 'Реалистичные мастурбаторы и искусственные вагины',
        icon: '🕳️',
        subcategories: {
          vaginas: { id: 'vaginy', name: 'Мастурбаторы-вагины', slug: 'vaginy' },
          butts: { id: 'popki', name: 'Мастурбаторы-попки', slug: 'popki' },
          mouths: { id: 'rotiki', name: 'Мастурбаторы-ротики', slug: 'rotiki' },
          combined: { id: 'kombinirovannye', name: 'Комбинированные', slug: 'kombinirovannye' },
          elite: { id: 'elitnye', name: 'Элитные мастурбаторы', slug: 'elitnye' },
          eggs: { id: 'yaytso', name: 'Мастурбатор-яйцо', slug: 'yaytso' },
          modern: { id: 'sovremennye', name: 'Современные мастурбаторы', slug: 'sovremennye' }
        }
      },

      // 🔧 НАСАДКИ И УДЛИНИТЕЛИ
      attachments: {
        id: 'kolca-dlya-chlena',
        name: 'Кольца для члена',
        slug: 'kolca-dlya-chlena',
        url: '/catalog/seks-igrushki/kolca-dlya-chlena/',
        parentPath: 'seks-igrushki/dlya-nego',
        description: 'Насадки и удлинители для мужчин',
        icon: '🔧'
      },

      // 🚰 ПОМПЫ ДЛЯ ПЕНИСА
      penisPumps: {
        id: 'pompy-dlya-chlena',
        name: 'Помпы для члена',
        slug: 'pompy-dlya-chlena',
        url: '/catalog/seks-igrushki/vacuumnye_pompy/pompy-dlya-chlena/',
        parentPath: 'seks-igrushki/dlya-nego',
        description: 'Вакуумные помпы для увеличения',
        icon: '🚰'
      },

      // 💍 КОЛЬЦА И НАСАДКИ НА ПЕНИС
      penisRings: {
        id: 'vibriruyushchie-kolca',
        name: 'Вибрирующие кольца',
        slug: 'vibriruyushchie_kolca',
        url: '/catalog/seks-igrushki/vibriruyushchie_kolca/',
        parentPath: 'seks-igrushki/dlya-nego',
        description: 'Эрекционные кольца и насадки',
        icon: '💍',
        subcategories: {
          withoutVibration: { id: 'bez-vibracii', name: 'Кольца без вибрации', slug: 'bez-vibracii' },
          withVibration: { id: 's-vibraciey', name: 'Кольца с вибрацией', slug: 's-vibraciey' },
          harnesses: { id: 'sbrui-utyazhki', name: 'Сбруи и утяжки', slug: 'sbrui-utyazhki' }
        }
      },

      // 👤 СЕКС КУКЛЫ
      sexDolls: {
        id: 'seks-kukly',
        name: 'Секс куклы',
        slug: 'seks_kukli_zhenshiny',
        url: '/catalog/seks-igrushki/seks_kukli/seks_kukli_zhenshiny/',
        parentPath: 'seks-igrushki/dlya-nego',
        description: 'Реалистичные секс-куклы',
        icon: '👤'
      },

      // 🎛️ МАССАЖЕР ПРОСТАТЫ
      prostateMassagers: {
        id: 'stimulyatory-prostaty',
        name: 'Стимуляторы простаты',
        slug: 'stimulyatory_prostaty',
        url: '/catalog/seks-igrushki/analnaya_stimulacia/stimulyatory_prostaty/',
        parentPath: 'seks-igrushki/dlya-nego',
        description: 'Специализированные массажеры простаты',
        icon: '🎛️'
      },

      // 🛡️ ПРЕЗЕРВАТИВЫ - Отдел защиты
      condoms: {
        id: 'prezervativy',
        name: 'Презервативы',
        slug: 'prezervativy',
        url: '/catalog/prezervativy/',
        parentPath: 'seks-igrushki/dlya-nego',
        description: 'Презервативы разных типов и размеров',
        icon: '🛡️',
        subcategories: {
          skyn: { id: 'skyn', name: 'SKYN', slug: 'skyn' },
          vitalis: { id: 'vitalis', name: 'VITALIS', slug: 'vitalis' },
          ganzo: { id: 'ganzo', name: 'Ganzo', slug: 'ganzo' },
          luxe: { id: 'luxe', name: 'Luxe', slug: 'luxe' },
          maxus: { id: 'maxus', name: 'MAXUS', slug: 'maxus' },
          mysize: { id: 'mysize', name: 'MY.SIZE', slug: 'mysize' },
          sagami: { id: 'sagami', name: 'SAGAMI', slug: 'sagami' },
          spring: { id: 'spring', name: 'SPRING', slug: 'spring' },
          durex: { id: 'durex', name: 'DUREX', slug: 'durex' },
          ritex: { id: 'ritex', name: 'Ritex', slug: 'ritex' },
          glowing: { id: 'svetyashchiesya', name: 'Светящиеся презервативы', slug: 'svetyashchiesya' }
        }
      },

      // 🧴 ГЕЛИ И ЛУБРИКАНТЫ - Химический отдел
      lubricants: {
        id: 'smazki',
        name: 'Смазки',
        slug: 'smazki',
        url: '/catalog/geli_i_smazki/',
        parentPath: 'seks-igrushki/dlya-nego',
        description: 'Интимные гели и смазки',
        icon: '🧴',
        subcategories: {
          waterBased: { id: 'vodnaya-osnova', name: 'На водной основе', slug: 'vodnaya-osnova' },
          siliconeBased: { id: 'silikonovaya-osnova', name: 'На силиконовой основе', slug: 'silikonovaya-osnova' },
          warming: { id: 'sogrevayushchie', name: 'Согревающие', slug: 'sogrevayushchie' },
          flavored: { id: 'aromatizirovannye', name: 'Ароматизированные', slug: 'aromatizirovannye' },
          anal: { id: 'analnye', name: 'Для анального секса', slug: 'analnye' },
          enlarging: { id: 'uvelichivayushchie', name: 'Увеличивающие пенис', slug: 'uvelichivayushchie' },
          erection: { id: 'erekciya', name: 'Усиливающие эрекцию', slug: 'erekciya' },
          sensation: { id: 'oshchushcheniya', name: 'Усиливающие ощущения', slug: 'oshchushcheniya' },
          prolonging: { id: 'prodlevayushchie', name: 'Продлевающие', slug: 'prodlevayushchie' },
          tightening: { id: 'suzhenie', name: 'Для сужения влагалища', slug: 'suzhenie' }
        }
      },

      // 🧪 КРЕМА ДЛЯ УВЕЛИЧЕНИЯ
      enlargementCreams: {
        id: 'krema-dlya-uvelicheniya-chlena',
        name: 'Крема для увеличения члена',
        slug: 'krema-dlya-uvelicheniya-chlena',
        parentPath: 'seks-igrushki/dlya-nego',
        description: 'Специальные крема и гели',
        icon: '🧪'
      }
    }
  },

  // 💑 ДЛЯ ДВОИХ - Третий этаж для пар
  forCouples: {
    id: 'dlya-par',
    name: 'Для двоих',
    slug: 'dlya-par',
    parentSlug: 'seks-igrushki',
    description: 'Товары для совместного использования',
    icon: '💑',
    subcategories: {
      // 🎯 АНАЛЬНЫЕ СТИМУЛЯТОРЫ
      analStimulators: {
        id: 'analnye-stimulyatory',
        name: 'Анальные стимуляторы',
        slug: 'analnaya-stimulacia',
        url: '/catalog/seks-igrushki/analnaya-stimulacia/',
        parentPath: 'seks-igrushki/dlya-par',
        description: 'Игрушки для анальной стимуляции пар',
        icon: '🎯',
        subcategories: {
          plugs: { id: 'probki-vtulki', name: 'Пробки и втулки', slug: 'probki-vtulki' },
          beads: { id: 'shariki-elochki', name: 'Шарики и елочки', slug: 'shariki-elochki' },
          expanders: { id: 'rasshiriteli', name: 'Втулки с расширителем', slug: 'rasshiriteli' },
          prostate: { id: 'prostata', name: 'Стимуляторы простаты', slug: 'prostata' }
        }
      },

      // 💊 АФРОДИЗИАКИ
      aphrodisiacs: {
        id: 'afrodiziaki',
        name: 'Афродизиаки',
        slug: 'afrodiziaki',
        url: '/catalog/afrodiziaki-i-kapsuly/',
        parentPath: 'seks-igrushki/dlya-par',
        description: 'Возбуждающие средства и добавки',
        icon: '💊',
        subcategories: {
          forMen: { id: 'dlya-muzhchin', name: 'Афродизиаки для мужчин', slug: 'dlya-muzhchin' },
          forWomen: { id: 'dlya-zhenshchin', name: 'Афродизиаки для женщин', slug: 'dlya-zhenshchin' }
        }
      },

      // ⛓️ БДСМ И ФЕТИШ
      bdsmFetish: {
        id: 'bdsm-i-fetish',
        name: 'БДСМ и фетиш',
        slug: 'bdsm_i_fetish',
        url: '/catalog/bdsm_i_fetish/',
        parentPath: 'seks-igrushki/dlya-par',
        description: 'Товары для БДСМ практик',
        icon: '⛓️',
        subcategories: {
          bondage: { id: 'bondazh', name: 'Бондаж', slug: 'bondazh' },
          masks: { id: 'maski', name: 'Маски', slug: 'maski' },
          gags: { id: 'klyapy', name: 'Кляпы', slug: 'klyapy' },
          medical: { id: 'medicinskiy', name: 'Медицинский фетиш', slug: 'medicinskiy' },
          restraints: { id: 'naruchniki', name: 'Наручники и поножи', slug: 'naruchniki' },
          gloves: { id: 'perchatki', name: 'Перчатки', slug: 'perchatki' },
          collars: { id: 'osheyniki', name: 'Ошейники', slug: 'osheyniki' },
          whips: { id: 'pletki', name: 'Плетки, стеки, кнуты', slug: 'pletki' },
          harnesses: { id: 'sbrui', name: 'Сбруи', slug: 'sbrui' },
          electro: { id: 'elektro', name: 'Электростимуляторы', slug: 'elektro' }
        }
      },

      // 🛏️ СЕКС-МЕБЕЛЬ
      sexFurniture: {
        id: 'seks-mebel',
        name: 'Секс-мебель',
        slug: 'sex_mebel',
        url: '/catalog/bdsm_i_fetish/sex_mebel/',
        parentPath: 'seks-igrushki/dlya-par',
        description: 'Специальная мебель для интимности',
        icon: '🛏️',
        subcategories: {
          stands: { id: 'stoyki-stoly', name: 'Стойки и столы', slug: 'stoyki-stoly' },
          swings: { id: 'kacheli', name: 'Секс-качели', slug: 'kacheli' },
          suspensions: { id: 'podvesy', name: 'Подвесы', slug: 'podvesy' }
        }
      },

      // 🔗 СТРАПОНЫ
      strapons: {
        id: 'strapony',
        name: 'Страпоны',
        slug: 'strapony_k_trusikam',
        url: '/catalog/seks-igrushki/strapony_k_trusikam/',
        parentPath: 'seks-igrushki/dlya-par',
        description: 'Страпоны и насадки для пар',
        icon: '🔗',
        subcategories: {
          strapless: { id: 'bezremnevye', name: 'Безремневые', slug: 'bezremnevye' },
          attachments: { id: 'nasadki', name: 'Насадки на страпон', slug: 'nasadki' },
          harnesses: { id: 'trusiki', name: 'Трусики и крепления', slug: 'trusiki' },
          prosthetics: { id: 'faloprotezy', name: 'Фалопротезы', slug: 'faloprotezy' },
          vibrating: { id: 'vibriruyushchie', name: 'Страпоны с вибрацией', slug: 'vibriruyushchie' },
          withMounts: { id: 's-krepleniyami', name: 'Страпоны с креплениями', slug: 's-krepleniyami' }
        }
      }
    }
  }
};

// 🎯 ОТДЕЛЬНЫЕ БОЛЬШИЕ КАТЕГОРИИ (Специализированные бутики)
export const SEPARATE_CATEGORIES = {
  // 📳 ВИБРАТОРЫ - Главный павильон
  vibrators: {
    id: 'vibratory',
    name: 'Вибраторы',
    slug: 'vibratory',
    url: '/catalog/seks-igrushki/vibratory/',
    description: 'Все виды вибраторов в одном месте',
    icon: '📳'
  },

  // 🍆 ФАЛЛОИМИТАТОРЫ
  dildos: {
    id: 'falloimitatory',
    name: 'Фаллоимитаторы',
    slug: 'falloimitatory',
    url: '/catalog/seks-igrushki/dlya-nee/falloimitatory/',
    description: 'Полный ассортимент фаллоимитаторов',
    icon: '🍆'
  },

  // 🎯 АНАЛЬНЫЕ СТИМУЛЯТОРЫ
  analStimulators: {
    id: 'analnye-stimulyatory',
    name: 'Анальные стимуляторы',
    slug: 'analnaya-stimulacia',
    url: '/catalog/seks-igrushki/analnaya-stimulacia/',
    description: 'Специализированные анальные игрушки',
    icon: '🎯'
  },

  // 💪 ВАГИНАЛЬНЫЕ ТРЕНАЖЕРЫ
  vaginalTrainers: {
    id: 'vaginalnye-trenazhery',
    name: 'Вагинальные тренажеры',
    slug: 'vaginalnaie_stimulatory',
    url: '/catalog/seks-igrushki/dlya-nee/vaginalnaie_stimulatory/',
    description: 'Тренажеры для женского здоровья',
    icon: '💪'
  },

  // 💎 КЛИТОРАЛЬНЫЕ СТИМУЛЯТОРЫ
  clitoralStimulators: {
    id: 'stimulyatory-klitora',
    name: 'Клиторальные стимуляторы',
    slug: 'stimulyatory-klitora',
    url: '/catalog/seks-igrushki/dlya-nee/klitoralnye_stimulatory/',
    description: 'Специализированные стимуляторы',
    icon: '💎'
  },

  // 🔗 СТРАПОНЫ
  strapons: {
    id: 'strapony',
    name: 'Страпоны',
    slug: 'strapony_k_trusikam',
    url: '/catalog/seks-igrushki/strapony_k_trusikam/',
    description: 'Страпоны и аксессуары',
    icon: '🔗'
  },

  // 🚰 ВАКУУМНЫЕ ПОМПЫ
  vacuumPumps: {
    id: 'vakuumnye-pompy',
    name: 'Вакуумные помпы',
    slug: 'vacuumnye_pompy',
    url: '/catalog/seks-igrushki/vacuumnye_pompy/',
    description: 'Помпы для увеличения',
    icon: '🚰',
    subcategories: {
      forWomen: { id: 'dlya-zhenshchin', name: 'Помпы для женщин', slug: 'dlya-zhenshchin' },
      forBreast: { id: 'dlya-grudi', name: 'Помпы для груди', slug: 'dlya-grudi' },
      forMen: { id: 'dlya-muzhchin', name: 'Помпы для мужчин', slug: 'dlya-muzhchin' }
    }
  },

  // 💍 ЭРЕКЦИОННЫЕ КОЛЬЦА
  erectionRings: {
    id: 'vibriruyushchie-kolca',
    name: 'Вибрирующие кольца',
    slug: 'vibriruyushchie_kolca',
    url: '/catalog/seks-igrushki/vibriruyushchie_kolca/',
    description: 'Эрекционные кольца',
    icon: '💍'
  },

  // 🕳️ МАСТУРБАТОРЫ
  masturbators: {
    id: 'masturbatory',
    name: 'Мастурбаторы',
    slug: 'vaginy_i_masturbatory',
    url: '/catalog/seks-igrushki/vaginy_i_masturbatory/',
    description: 'Мужские игрушки',
    icon: '🕳️'
  },

  // 🔧 НАСАДКИ НА ЧЛЕН
  penisAttachments: {
    id: 'kolca-dlya-chlena',
    name: 'Кольца для члена',
    slug: 'kolca-dlya-chlena',
    url: '/catalog/seks-igrushki/kolca-dlya-chlena/',
    description: 'Насадки и удлинители',
    icon: '🔧'
  },

  // 📏 УВЕЛИЧЕНИЕ ПЕНИСА
  penisEnlargement: {
    id: 'uvelichenie-penisa',
    name: 'Увеличение пениса',
    slug: 'uvelichenie_chlena',
    url: '/catalog/seks-igrushki/uvelichenie_chlena/',
    description: 'Средства для увеличения',
    icon: '📏'
  },

  // 👤 СЕКС КУКЛЫ
  sexDolls: {
    id: 'seks-kukly',
    name: 'Секс куклы',
    slug: 'seks_kukly',
    url: '/catalog/seks-igrushki/seks_kukly/',
    description: 'Реалистичные куклы',
    icon: '👤'
  },

  // 🤖 СЕКС-МАШИНЫ
  sexMachines: {
    id: 'seks-mashiny',
    name: 'Секс-машины',
    slug: 'seks_mashiny',
    url: '/catalog/seks-igrushki/seks_mashiny/',
    description: 'Автоматические устройства',
    icon: '🤖'
  },

  // 🛠️ СОПУТСТВУЮЩИЕ ТОВАРЫ
  accessories: {
    id: 'aksessuary',
    name: 'Аксессуары',
    slug: 'aksessuary',
    url: '/catalog/seks-igrushki/aksessuary/',
    description: 'Аксессуары и уход',
    icon: '🛠️',
    subcategories: {
      accessories: { id: 'aksessuary', name: 'Аксессуары и игры', slug: 'aksessuary' },
      care: { id: 'uhod', name: 'Уход за секс игрушками', slug: 'uhod' },
      batteries: { id: 'batarei', name: 'Элементы питания', slug: 'batarei' }
    }
  }
};

// 🔍 УТИЛИТЫ ДЛЯ РАБОТЫ С ДЕТАЛЬНОЙ КАРТОЙ
export const CATALOG_UTILS = {
  // Поиск категории по URL
  findByUrl: function (url) {
    // Нормализуем URL - убираем лишние слэши и приводим к единому формату
    const normalizedUrl = url.replace(/\/+/g, '/').replace(/\/$/, '');

    // Извлекаем путь из URL (убираем /catalog/)
    const urlParts = normalizedUrl.split('/').filter(part => part);
    if (urlParts[0] === 'catalog') {
      urlParts.shift(); // Убираем 'catalog'
    }

    // Если путь пустой, возвращаем null
    if (urlParts.length === 0) {
      return null;
    }

    // Специальная обработка для основных категорий
    if (urlParts.length === 1) {
      const categorySlug = urlParts[0];

      // Проверяем основные категории по их альтернативным slug
      if (categorySlug === 'dlya-zhenshchin' || categorySlug === 'dlya-nee') {
        return DETAILED_CATALOG_MAP.forWomen;
      }
      if (categorySlug === 'dlya-muzhchin' || categorySlug === 'dlya-nego') {
        return DETAILED_CATALOG_MAP.forMen;
      }
      if (categorySlug === 'dlya-par') {
        return DETAILED_CATALOG_MAP.forCouples;
      }
    }

    // Специальная обработка для пути seks-igrushki/dlya-nee
    if (urlParts.length === 2 && urlParts[0] === 'seks-igrushki' && urlParts[1] === 'dlya-nee') {
      return DETAILED_CATALOG_MAP.forWomen;
    }

    // Специальная обработка для пути seks-igrushki/dlya-nego
    if (urlParts.length === 2 && urlParts[0] === 'seks-igrushki' && urlParts[1] === 'dlya-nego') {
      return DETAILED_CATALOG_MAP.forMen;
    }

    // Специальная обработка для пути seks-igrushki/dlya-par
    if (urlParts.length === 2 && urlParts[0] === 'seks-igrushki' && urlParts[1] === 'dlya-par') {
      return DETAILED_CATALOG_MAP.forCouples;
    }

    // Рекурсивный поиск по всей структуре
    const searchInObject = (obj, pathSegments = [], depth = 0) => {
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          // Проверяем соответствие по slug или id
          const currentSegment = urlParts[depth];
          if (currentSegment && (
            obj[key].slug === currentSegment ||
            obj[key].id === currentSegment ||
            // ИСПРАВЛЕНИЕ: Добавляем поддержку конвертации между дефисами и подчеркиваниями
            obj[key].slug === currentSegment.replace(/_/g, '-') ||
            obj[key].id === currentSegment.replace(/_/g, '-') ||
            obj[key].slug === currentSegment.replace(/-/g, '_') ||
            obj[key].id === currentSegment.replace(/-/g, '_') ||
            // Дополнительные проверки для альтернативных названий
            (currentSegment === 'dlya-zhenshchin' && obj[key].id === 'dlya-nee') ||
            (currentSegment === 'dlya-muzhchin' && obj[key].id === 'dlya-nego') ||
            (currentSegment === 'vibratory' && obj[key].id === 'vibratory')
          )) {
            // Если это последний сегмент пути, возвращаем найденную категорию
            if (depth === urlParts.length - 1) {
              return obj[key];
            }

            // Если есть ещё сегменты, ищем в подкатегориях
            if (obj[key].subcategories && depth < urlParts.length - 1) {
              const found = searchInObject(obj[key].subcategories, pathSegments, depth + 1);
              if (found) return found;
            }
          }

          // Если есть подкатегории, ищем в них
          if (obj[key].subcategories) {
            const found = searchInObject(obj[key].subcategories, pathSegments, depth);
            if (found) return found;
          }
        }
      }
      return null;
    };

    // Сначала ищем в основной структуре
    let result = searchInObject(DETAILED_CATALOG_MAP);

    // Если не нашли, ищем в отдельных категориях
    if (!result) {
      result = searchInObject(SEPARATE_CATEGORIES);
    }

    return result;
  },

  // Получить все категории определенного уровня
  getCategoriesByLevel: function (level = 1) {
    const categories = [];

    if (level === 1) {
      categories.push(
        DETAILED_CATALOG_MAP.forWomen,
        DETAILED_CATALOG_MAP.forMen,
        DETAILED_CATALOG_MAP.forCouples
      );
    }

    return categories.concat(Object.values(SEPARATE_CATEGORIES));
  },

  // Построить полный путь навигации
  buildNavigationPath: function (categorySlug) {
    // Логика построения пути на основе slug
    const pathSegments = categorySlug.split('_');
    return `/catalog/${pathSegments.join('/')}/`;
  },

  // Получить связанные категории
  getRelatedCategories: function (categoryId) {
    // Логика поиска связанных категорий
    const related = [];
    // Здесь можно добавить логику поиска похожих категорий
    return related;
  },

  // 🎯 Поиск категории по ID
  findById: function (categoryId) {
    const searchInObject = (obj) => {
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          if (obj[key].id === categoryId) return obj[key];
          if (obj[key].subcategories) {
            const found = searchInObject(obj[key].subcategories);
            if (found) return found;
          }
        }
      }
      return null;
    };

    return searchInObject(DETAILED_CATALOG_MAP) || searchInObject(SEPARATE_CATEGORIES);
  },

  // 📋 Получить все категории
  getAllCategories: function () {
    const categories = [];

    const collectCategories = (obj) => {
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object' && obj[key].id) {
          categories.push(obj[key]);
          if (obj[key].subcategories) {
            collectCategories(obj[key].subcategories);
          }
        }
      }
    };

    collectCategories(DETAILED_CATALOG_MAP);
    collectCategories(SEPARATE_CATEGORIES);

    return categories;
  },

  // 🔍 Получить SEO данные для категории
  getSEOData: function (categoryId) {
    // Если это корневая категория
    if (categoryId === 'root') {
      return {
        title: 'Каталог товаров для взрослых - Pink Rabbit',
        description: 'Широкий выбор качественных товаров для взрослых. Интимные товары, игрушки, аксессуары с доставкой по всей России.',
        keywords: 'интернет-магазин, товары для взрослых, интимные товары, секс-шоп'
      };
    }

    // Ищем категорию по ID
    const category = this.findById(categoryId);

    if (!category) {
      return {
        title: 'Каталог товаров - Pink Rabbit',
        description: 'Интернет-магазин товаров для взрослых',
        keywords: 'интернет-магазин, товары для взрослых'
      };
    }

    // Формируем SEO данные на основе категории
    return {
      title: `${category.name} - Pink Rabbit`,
      description: category.description || `Купить ${category.name.toLowerCase()} в интернет-магазине Pink Rabbit. Широкий выбор, доступные цены, быстрая доставка.`,
      keywords: `${category.name.toLowerCase()}, интимные товары, секс-шоп, Pink Rabbit`
    };
  },

  // Функция для генерации хлебных крошек
  generateBreadcrumbs(categoryPath) {
    console.log('🍞 generateBreadcrumbs вызвана с путем:', categoryPath);

    const breadcrumbs = []

    // Если путь пустой, возвращаем пустой массив (главная страница каталога)
    if (!categoryPath || categoryPath.length === 0) {
      console.log('🏠 Главная страница каталога - хлебные крошки пустые');
      return breadcrumbs;
    }

    // Очищаем путь от пустых элементов
    const cleanPath = categoryPath.filter(segment => segment && segment.trim() !== '');
    console.log('🧹 Очищенный путь:', cleanPath);

    // НОВАЯ ЛОГИКА: Определяем логическую структуру на основе конечной категории
    const lastSegment = cleanPath[cleanPath.length - 1];
    console.log('🎯 Последний сегмент пути:', lastSegment);

    // Словарь для определения родительских категорий товаров
    const categoryParentMap = {
      // Товары для мужчин
      'kolca-dlya-chlena': { parent: 'dlya-nego', parentName: 'Мужчинам' },
      'kolca_dlya_chlena': { parent: 'dlya-nego', parentName: 'Мужчинам' },
      'masturbatory': { parent: 'dlya-nego', parentName: 'Мужчинам' },
      'vaginy_i_masturbatory': { parent: 'dlya-nego', parentName: 'Мужчинам' },
      'pompy-dlya-chlena': { parent: 'dlya-nego', parentName: 'Мужчинам' },
      'stimulyatory-prostaty': { parent: 'dlya-nego', parentName: 'Мужчинам' },
      'stimulyatory_prostaty': { parent: 'dlya-nego', parentName: 'Мужчинам' },
      'vibriruyushchie-kolca': { parent: 'dlya-nego', parentName: 'Мужчинам' },
      'vibriruyushchie_kolca': { parent: 'dlya-nego', parentName: 'Мужчинам' },

      // Товары для женщин
      'vibratory': { parent: 'dlya-nee', parentName: 'Женщинам' },
      'falloimitatory': { parent: 'dlya-nee', parentName: 'Женщинам' },
      'stimulyatory-klitora': { parent: 'dlya-nee', parentName: 'Женщинам' },
      'klitoralnye_stimulatory': { parent: 'dlya-nee', parentName: 'Женщинам' },
      'analnye-igrushki': { parent: 'dlya-nee', parentName: 'Женщинам' },
      'analnye_igrushki': { parent: 'dlya-nee', parentName: 'Женщинам' },
      'vaginalnaie_stimulatory': { parent: 'dlya-nee', parentName: 'Женщинам' },
      'vibroyaica': { parent: 'dlya-nee', parentName: 'Женщинам' },

      // Товары для пар
      'strapony': { parent: 'dlya-par', parentName: 'Для двоих' },
      'strapony_k_trusikam': { parent: 'dlya-par', parentName: 'Для двоих' },
      'analnaya-stimulacia': { parent: 'dlya-par', parentName: 'Для двоих' },
      'bdsm_i_fetish': { parent: 'dlya-par', parentName: 'Для двоих' },
      'afrodiziaki': { parent: 'dlya-par', parentName: 'Для двоих' }
    };

    // Проверяем, есть ли у последнего сегмента определенная родительская категория
    const parentInfo = categoryParentMap[lastSegment] || categoryParentMap[lastSegment.replace(/_/g, '-')] || categoryParentMap[lastSegment.replace(/-/g, '_')];

    if (parentInfo) {
      console.log('🎯 Найдена родительская категория:', parentInfo);

      // Добавляем родительскую категорию
      breadcrumbs.push({
        name: parentInfo.parentName,
        url: `/catalog/${parentInfo.parent}`,
        isActive: false,
        segment: parentInfo.parent,
        categoryId: parentInfo.parent
      });

      // Добавляем текущую категорию
      const categoryName = this.formatSegmentName(lastSegment);
      breadcrumbs.push({
        name: categoryName,
        url: `/catalog/${cleanPath.join('/')}`,
        isActive: true,
        segment: lastSegment,
        categoryId: lastSegment
      });

      console.log('🍞 Сгенерированные логические хлебные крошки:', breadcrumbs.map(b => ({
        name: b.name,
        url: b.url,
        isActive: b.isActive
      })));

      return breadcrumbs;
    }

    // СТАРАЯ ЛОГИКА: Если не нашли в карте родителей, строим по пути (но пропускаем seks-igrushki)
    let currentPath = '';

    for (let i = 0; i < cleanPath.length; i++) {
      const segment = cleanPath[i];

      // Пропускаем техническую категорию "seks-igrushki"
      if (segment === 'seks-igrushki') {
        console.log('⏭️ Пропускаем техническую категорию "seks-igrushki"');
        continue;
      }

      currentPath += (currentPath === '' ? '' : '/') + segment;

      // Формируем полный URL для поиска
      const fullUrl = `/catalog/${currentPath}`;
      const fullUrlWithSlash = `/catalog/${currentPath}/`;

      console.log(`🔍 Ищем категорию для сегмента "${segment}":`, {
        currentPath,
        fullUrl,
        fullUrlWithSlash
      });

      // Ищем категорию по URL (с слешем и без)
      let category = this.findByUrl(fullUrl) || this.findByUrl(fullUrlWithSlash);

      // Если не нашли по URL, пытаемся найти по ID
      if (!category) {
        category = this.findById(segment);
      }

      // Если всё ещё не нашли, создаем fallback название
      if (!category) {
        console.warn(`⚠️ Категория не найдена для сегмента "${segment}", используем fallback`);

        // Используем функцию форматирования названий
        const fallbackName = this.formatSegmentName(segment);

        category = {
          id: segment,
          name: fallbackName,
          slug: segment,
          url: fullUrl
        };
      }

      console.log(`✅ Найдена категория для "${segment}":`, {
        name: category.name,
        url: category.url || fullUrl
      });

      // Добавляем в хлебные крошки
      const isActive = i === cleanPath.length - 1;
      breadcrumbs.push({
        name: category.name,
        url: category.url || fullUrl,
        isActive,
        segment: segment,
        categoryId: category.id
      });
    }

    console.log('🍞 Сгенерированные хлебные крошки:', breadcrumbs.map(b => ({
      name: b.name,
      url: b.url,
      isActive: b.isActive
    })));

    return breadcrumbs;
  },

  // 🏷️ Определение типа категории
  getCategoryType: function (category) {
    // Определяем тип категории по её структуре
    if (category.id === 'seks-igrushki') return 'root';
    if (['dlya-nee', 'dlya-nego', 'dlya-par'].includes(category.id)) return 'gender';
    if (category.subcategories && Object.keys(category.subcategories).length > 0) return 'product_type';
    return 'subtype';
  },

  // 📝 Форматирование названия сегмента
  formatSegmentName: function (segment) {
    console.log('formatSegmentName - входной сегмент:', segment);

    // Расширенный словарь для перевода slug в читаемые названия
    const nameMap = {
      // Основные категории
      'dlya-zhenshchin': 'Для женщин',
      'dlya-nee': 'Для женщин',
      'dlya-muzhchin': 'Для мужчин',
      'dlya-nego': 'Для мужчин',
      'dlya-par': 'Для пар',
      'uniseks': 'Унисекс',

      // Подкатегории для женщин
      'vibratory': 'Вибраторы',
      'dildo': 'Дилдо',
      'falloimitatory': 'Фаллоимитаторы',
      'stimulyatory-klitora': 'Стимуляторы клитора',
      'analnye-igrushki': 'Анальные игрушки',
      'vaginalnie-shariki': 'Вагинальные шарики',
      'stimulyatory-tochki-g': 'Стимуляторы точки G',

      // Подкатегории для мужчин
      'masturbatory': 'Мастурбаторы',
      'kolca-dlya-chlena': 'Кольца для члена',
      'kolca_dlya_chlena': 'Кольца для члена', // Версия с подчеркиваниями
      'analnye-stimulyatory': 'Анальные стимуляторы',
      'analnaya-stimulacia': 'Анальные стимуляторы',
      'pompy-dlya-chlena': 'Помпы для члена',
      'stimulyatory-prostaty': 'Стимуляторы простаты',
      'vaginy_i_masturbatory': 'Мастурбаторы', // ДОБАВЛЯЕМ недостающую запись
      'vaginy-i-masturbatory': 'Мастурбаторы', // Версия с дефисами

      // Подкатегории для пар
      'vibriruyushchie-kolca': 'Вибрирующие кольца',
      'vibriruyushchie_kolca': 'Вибрирующие кольца', // Версия с подчеркиваниями
      'pary-igrushki': 'Игрушки для пар',
      'distancionnoe-upravlenie': 'Дистанционное управление',

      // Бренды
      'satisfyer': 'Satisfyer',
      'we-vibe': 'We-Vibe',
      'lelo': 'LELO',
      'lovense': 'Lovense',
      'tenga': 'TENGA',
      'fleshlight': 'Fleshlight',

      // Материалы
      'silikonovy': 'Силиконовые',
      'steklyannye': 'Стеклянные',
      'metallicheskie': 'Металлические',
      'tpe': 'TPE',
      'abs-plastik': 'ABS пластик',

      // Цвета
      'rozovyy': 'Розовый',
      'fioletovyy': 'Фиолетовый',
      'chernyy': 'Черный',
      'belyy': 'Белый',
      'krasnyy': 'Красный',
      'siniy': 'Синий',
      'prozrachnyy': 'Прозрачный',

      // Дополнительные категории
      'seks-igrushki': 'Секс игрушки',
      'eroticheskoe-bele': 'Эротическое белье',
      'kosmetika': 'Косметика',
      'prezervativy': 'Презервативы',
      'smazki': 'Смазки',
      'afrodiziaki': 'Афродизиаки',
      'bdsm': 'БДСМ',
      'fetish': 'Фетиш',
      'roleplay': 'Ролевые игры'
    };

    // Проверяем точное соответствие в словаре
    if (nameMap[segment]) {
      console.log('formatSegmentName - найдено точное соответствие:', nameMap[segment]);
      return nameMap[segment];
    }

    // Пробуем заменить подчеркивания на дефисы и найти соответствие
    const segmentWithDashes = segment.replace(/_/g, '-');
    if (nameMap[segmentWithDashes]) {
      console.log('formatSegmentName - найдено соответствие после замены _ на -:', nameMap[segmentWithDashes]);
      return nameMap[segmentWithDashes];
    }

    // Пробуем заменить дефисы на подчеркивания и найти соответствие
    const segmentWithUnderscores = segment.replace(/-/g, '_');
    if (nameMap[segmentWithUnderscores]) {
      console.log('formatSegmentName - найдено соответствие после замены - на _:', nameMap[segmentWithUnderscores]);
      return nameMap[segmentWithUnderscores];
    }

    // Если нет соответствия в словаре, форматируем автоматически
    console.log('formatSegmentName - автоматическое форматирование для:', segment);
    const formatted = segment
      .replace(/[-_]/g, ' ') // Заменяем и дефисы, и подчеркивания на пробелы
      .replace(/\b\w/g, l => l.toUpperCase()); // Делаем первую букву каждого слова заглавной

    console.log('formatSegmentName - результат автоматического форматирования:', formatted);
    return formatted;
  },

  // 📂 Получение подкатегорий для текущей категории
  getSubcategories: function (categoryPath) {
    if (!categoryPath || categoryPath.length === 0) {
      // ИСПРАВЛЯЕМ: Для главной страницы каталога сначала показываем основные категории, затем подкатегории
      console.log('🏠 Главная страница каталога - показываем основные категории + подкатегории');

      const mainCategories = [];
      const allSubcategories = [];

      // Добавляем основные категории в начало
      mainCategories.push({
        id: 'dlya-nee',
        name: 'Для женщин',
        slug: 'dlya-nee',
        description: 'Интимные товары для женщин',
        productCount: 45,
        url: '/catalog/dlya-nee',
        type: 'main-category',
        image: '/images/categories/dlya-nee.jpg',
        icon: 'Heart', // Иконка для женщин
        parentCategory: null
      });

      mainCategories.push({
        id: 'dlya-nego',
        name: 'Для мужчин',
        slug: 'dlya-nego',
        description: 'Интимные товары для мужчин',
        productCount: 32,
        url: '/catalog/dlya-nego',
        type: 'main-category',
        image: '/images/categories/dlya-nego.jpg',
        icon: 'User', // Иконка для мужчин
        parentCategory: null
      });

      mainCategories.push({
        id: 'dlya-par',
        name: 'Для двоих',
        slug: 'dlya-par',
        description: 'Интимные товары для пар',
        productCount: 28,
        url: '/catalog/dlya-par',
        type: 'main-category',
        image: '/images/categories/dlya-par.jpg',
        icon: 'Users', // Иконка для пар
        parentCategory: null
      });

      // Собираем подкатегории из категории "Для женщин"
      if (DETAILED_CATALOG_MAP.forWomen.subcategories) {
        Object.values(DETAILED_CATALOG_MAP.forWomen.subcategories).forEach(subcat => {
          allSubcategories.push({
            ...subcat,
            productCount: subcat.productCount || Math.floor(Math.random() * 50) + 20,
            url: subcat.url || `/catalog/seks-igrushki/dlya-nee/${subcat.slug}`,
            type: 'subcategory',
            parentPath: 'seks-igrushki/dlya-nee',
            image: subcat.image || `/images/categories/${subcat.slug}.jpg`,
            parentCategory: 'Для женщин'
          });
        });
      }

      // Собираем подкатегории из категории "Для мужчин"
      if (DETAILED_CATALOG_MAP.forMen.subcategories) {
        Object.values(DETAILED_CATALOG_MAP.forMen.subcategories).forEach(subcat => {
          allSubcategories.push({
            ...subcat,
            productCount: subcat.productCount || Math.floor(Math.random() * 50) + 15,
            url: subcat.url || `/catalog/seks-igrushki/dlya-nego/${subcat.slug}`,
            type: 'subcategory',
            parentPath: 'seks-igrushki/dlya-nego',
            image: subcat.image || `/images/categories/${subcat.slug}.jpg`,
            parentCategory: 'Для мужчин'
          });
        });
      }

      // Собираем подкатегории из категории "Для двоих"
      if (DETAILED_CATALOG_MAP.forCouples.subcategories) {
        Object.values(DETAILED_CATALOG_MAP.forCouples.subcategories).forEach(subcat => {
          allSubcategories.push({
            ...subcat,
            productCount: subcat.productCount || Math.floor(Math.random() * 30) + 10,
            url: subcat.url || `/catalog/seks-igrushki/dlya-par/${subcat.slug}`,
            type: 'subcategory',
            parentPath: 'seks-igrushki/dlya-par',
            image: subcat.image || `/images/categories/${subcat.slug}.jpg`,
            parentCategory: 'Для двоих'
          });
        });
      }

      // Объединяем основные категории и подкатегории
      const allCategories = [...mainCategories, ...allSubcategories];

      console.log('📦 Основных категорий:', mainCategories.length);
      console.log('📦 Подкатегорий:', allSubcategories.length);
      console.log('📦 Всего категорий для главной страницы:', allCategories.length);

      return allCategories;
    }

    // Очищаем путь от пустых элементов
    const cleanPath = categoryPath.filter(segment => segment && segment.trim() !== '');

    // ИСПРАВЛЯЕМ: Ищем текущую категорию по очищенному пути
    // Пробуем найти как с слешем, так и без слеша в конце
    const fullPathWithoutSlash = `/catalog/${cleanPath.join('/')}`;
    const fullPathWithSlash = `/catalog/${cleanPath.join('/')}/`;

    let currentCategory = this.findByUrl(fullPathWithoutSlash) || this.findByUrl(fullPathWithSlash);

    // Если не нашли по URL, пробуем найти по ID последнего сегмента
    if (!currentCategory && cleanPath.length > 0) {
      const lastSegment = cleanPath[cleanPath.length - 1];
      currentCategory = this.findById(lastSegment);
    }

    console.log('getSubcategories - categoryPath:', categoryPath);
    console.log('getSubcategories - cleanPath:', cleanPath);
    console.log('getSubcategories - fullPathWithoutSlash:', fullPathWithoutSlash);
    console.log('getSubcategories - fullPathWithSlash:', fullPathWithSlash);
    console.log('getSubcategories - currentCategory found:', !!currentCategory);
    if (currentCategory) {
      console.log('getSubcategories - category name:', currentCategory.name);
      console.log('getSubcategories - has subcategories:', !!currentCategory.subcategories);
    }

    if (currentCategory && currentCategory.subcategories) {
      // Преобразуем объект подкатегорий в массив
      const subcategoriesArray = Object.values(currentCategory.subcategories).map(subcat => ({
        ...subcat,
        // Добавляем недостающие поля для корректного отображения
        productCount: subcat.productCount || Math.floor(Math.random() * 50) + 10,
        // Формируем правильный URL для подкатегории на основе текущего пути
        url: subcat.url || `/catalog/${cleanPath.join('/')}/${subcat.slug}`,
        // Добавляем тип категории
        type: 'subcategory',
        // Добавляем родительский путь
        parentPath: cleanPath.join('/'),
        // Добавляем изображение по умолчанию если его нет
        image: subcat.image || `/images/categories/${subcat.slug}.jpg`
      }));

      console.log('getSubcategories - subcategoriesArray:', subcategoriesArray);
      return subcategoriesArray;
    }

    console.log('getSubcategories - no subcategories found');
    return [];
  }
};

export default DETAILED_CATALOG_MAP;
