<!--
  Главная страница категории "Афродизиаки и капсулы"
-->
<template>
  <div class="aphrodisiacs-section">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span> / </span>
      <span>Афродизиаки и капсулы</span>
    </div>

    <h1>Афродизиаки и капсулы</h1>
    <p>Натуральные средства для повышения либидо и улучшения интимной жизни.</p>

    <div class="categories-grid">
      <NuxtLink
        to="/catalog/afrodiziaki-i-kapsuly/dlja-muzhchin"
        class="category-link featured"
      >
        <h3>Для мужчин</h3>
        <p>Препараты для повышения потенции и либидо у мужчин</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/afrodiziaki-i-kapsuly/dlja-zhenshhin"
        class="category-link featured"
      >
        <h3>Для женщин</h3>
        <p>Средства для усиления женского либидо</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/afrodiziaki-i-kapsuly/vitaminy-i-bady"
        class="category-link"
      >
        <h3>Витамины и БАДы</h3>
        <p>Биологически активные добавки для здоровья</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/afrodiziaki-i-kapsuly/kapsuly-dlja-pohudenija"
        class="category-link"
      >
        <h3>Капсулы для похудения</h3>
        <p>Препараты для коррекции веса</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/afrodiziaki-i-kapsuly/krema-dlja-uvelichenija"
        class="category-link"
      >
        <h3>Кремы для увеличения</h3>
        <p>Кремы и гели для увеличения интимных зон</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/afrodiziaki-i-kapsuly/vozbuditeli"
        class="category-link"
      >
        <h3>Возбудители</h3>
        <p>Натуральные возбуждающие средства</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/afrodiziaki-i-kapsuly/szhigatel-zhira"
        class="category-link"
      >
        <h3>Сжигатель жира</h3>
        <p>Препараты для сжигания жировых отложений</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/afrodiziaki-i-kapsuly/kapsuly-dlja-pozdnego-klimaksa"
        class="category-link"
      >
        <h3>Капсулы позднего климакса</h3>
        <p>Препараты для женщин в период менопаузы</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Афродизиаки и капсулы - Каталог интимных товаров",
  description:
    "Натуральные афродизиаки, капсулы и препараты для мужчин и женщин. Повышение либидо и потенции.",
});
</script>

<style scoped>
.aphrodisiacs-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumbs {
  margin-bottom: 2rem;
  color: #666;
}

.breadcrumbs a {
  color: #3b82f6;
  text-decoration: none;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  background: linear-gradient(135deg, #fff0e6 0%, #ffe8f5 100%);
  border-color: #f59e0b;
}

.category-link h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.category-link.featured h3 {
  color: #f59e0b;
}

.category-link p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
