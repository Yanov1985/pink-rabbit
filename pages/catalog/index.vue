<!--
  Главная страница каталога интимных товаров
-->
<template>
  <div class="catalog-section">
    <h1>Каталог товаров</h1>
    <p>
      Добро пожаловать в наш каталог интимных товаров. Выберите интересующую вас
      категорию:
    </p>

    <div class="categories-grid">
      <!-- Основные категории товаров для взрослых -->
      <NuxtLink to="/catalog/seks-igrushki" class="category-link featured">
        <h2>Интимные игрушки</h2>
        <p>Широкий выбор товаров для взрослых: для женщин, мужчин и пар</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory"
        class="category-link featured"
      >
        <h2>Вибраторы</h2>
        <p>Элитные, Hi-tech, многофункциональные и другие типы вибраторов</p>
      </NuxtLink>

      <NuxtLink to="/catalog/geli-i-smazki" class="category-link">
        <h2>Смазки и лубриканты</h2>
        <p>Интимные гели, лубриканты, вкусовые и увлажняющие средства</p>
      </NuxtLink>

      <NuxtLink to="/catalog/prezervativy" class="category-link">
        <h2>Презервативы</h2>
        <p>Классические, ультратонкие, продлевающие и специальные виды</p>
      </NuxtLink>

      <NuxtLink to="/catalog/afrodiziaki-i-kapsuly" class="category-link">
        <h2>Афродизиаки и капсулы</h2>
        <p>Натуральные средства для повышения либидо и потенции</p>
      </NuxtLink>

      <NuxtLink to="/catalog/kosmetika-i-feromony" class="category-link">
        <h2>Косметика и феромоны</h2>
        <p>Интимная косметика, феромоны и средства по уходу</p>
      </NuxtLink>

      <NuxtLink to="/catalog/eroticheskie-igry" class="category-link">
        <h2>Эротические игры</h2>
        <p>Игры для пар, карты, кубики и другие развлечения</p>
      </NuxtLink>

      <NuxtLink to="/catalog/podarki-i-aksessuary" class="category-link">
        <h2>Подарки и аксессуары</h2>
        <p>Эротические подарки, украшения и аксессуары</p>
      </NuxtLink>

      <NuxtLink to="/catalog/bdsm-fetish" class="category-link">
        <h2>БДСМ и фетиш</h2>
        <p>Товары для ролевых игр, фетиша и БДСМ практик</p>
      </NuxtLink>

      <NuxtLink to="/catalog/eroticheskoe-bele" class="category-link">
        <h2>Эротическое белье</h2>
        <p>Соблазнительное женское и мужское белье</p>
      </NuxtLink>

      <NuxtLink to="/catalog/seks-kukly" class="category-link">
        <h2>Секс куклы</h2>
        <p>Реалистичные секс куклы и мастурбаторы</p>
      </NuxtLink>

      <NuxtLink to="/catalog/analnye-igrushki" class="category-link">
        <h2>Анальные игрушки</h2>
        <p>Анальные пробки, стимуляторы и специальные игрушки</p>
      </NuxtLink>

      <NuxtLink to="/catalog/stimulyatory-klitora" class="category-link">
        <h2>Стимуляторы клитора</h2>
        <p>Специализированные стимуляторы для женщин</p>
      </NuxtLink>

      <NuxtLink to="/catalog/masturbatory" class="category-link">
        <h2>Мастурбаторы</h2>
        <p>Мужские мастурбаторы и искусственные вагины</p>
      </NuxtLink>

      <NuxtLink to="/catalog/massazhery" class="category-link">
        <h2>Массажёры</h2>
        <p>Интимные массажёры и стимуляторы</p>
      </NuxtLink>

      <NuxtLink to="/catalog/koltsa-dlya-chlena" class="category-link">
        <h2>Кольца для члена</h2>
        <p>Эрекционные кольца и насадки</p>
      </NuxtLink>

      <NuxtLink to="/catalog/falloimitatory" class="category-link">
        <h2>Фаллоимитаторы</h2>
        <p>Реалистичные фаллоимитаторы различных размеров</p>
      </NuxtLink>

      <NuxtLink to="/catalog/strapony" class="category-link">
        <h2>Страпоны</h2>
        <p>Страпоны и системы для пар</p>
      </NuxtLink>

      <NuxtLink to="/catalog/pompy" class="category-link">
        <h2>Помпы</h2>
        <p>Помпы для увеличения и стимуляции</p>
      </NuxtLink>

      <NuxtLink to="/catalog/vaginalnye-shariki" class="category-link">
        <h2>Вагинальные шарики</h2>
        <p>Тренажёры для укрепления интимных мышц</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Метаданные страницы для SEO - как визитная карточка в Tinder
definePageMeta({
  title: "Каталог интимных товаров - Интернет-магазин для взрослых",
  description:
    "Полный каталог интимных товаров: вибраторы, мастурбаторы, презервативы, смазки, БДСМ, белье и многое другое.",
});

// Хлебные крошки для навигации
useSeoMeta({
  title: "Каталог товаров",
  ogTitle: "Каталог товаров PinkRabbit",
  description: "Каталог интимных товаров для взрослых",
  ogDescription: "Каталог интимных товаров для взрослых",
});
</script>

<style scoped>
.catalog-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.category-link {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  background: white;
  transition: all 0.3s ease;
}

.category-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.category-link.featured {
  background: linear-gradient(135deg, #fff5f5 0%, #fef7ff 100%);
  border-color: #e91e63;
}

.category-link h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.category-link.featured h2 {
  color: #e91e63;
}

.category-link p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
