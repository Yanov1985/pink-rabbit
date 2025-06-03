<!--
  Главная страница раздела "Для пар"
-->
<template>
  <div class="couples-section">
    <h1>Товары для пар</h1>
    <p>Выберите категорию:</p>

    <div class="categories-grid">
      <NuxtLink
        to="/catalog/seks-igrushki/dlya-par/bdsm-i-fetish"
        class="category-link"
      >
        <h3>БДСМ и фетиш</h3>
        <p>Товары для БДСМ и фетиш игр</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-par/geli-i-lubrikanty"
        class="category-link"
      >
        <h3>Гели и лубриканты</h3>
        <p>Интимные гели и смазки для пар</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-par/prezervativy"
        class="category-link"
      >
        <h3>Презервативы</h3>
        <p>Презервативы для безопасного секса</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-par/vibratory-dlya-par"
        class="category-link"
      >
        <h3>Вибраторы для пар</h3>
        <p>Вибраторы для совместного использования</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-par/strapony"
        class="category-link"
      >
        <h3>Страпоны</h3>
        <p>Страпоны и аксессуары к ним</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-par/analnye-stimulyatory"
        class="category-link"
      >
        <h3>Анальные стимуляторы</h3>
        <p>Игрушки для анальной стимуляции пар</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-par/eroticheskie-igry"
        class="category-link"
      >
        <h3>Эротические игры</h3>
        <p>Игры и аксессуары для разнообразия</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-par/afrodiziaki-i-kapsuly"
        class="category-link"
      >
        <h3>Афродизиаки и капсулы</h3>
        <p>Возбуждающие средства и препараты</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Товары для пар",
});
</script>

<style scoped>
.couples-section {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.category-link {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  background: white;
  transition: transform 0.2s;
}

.category-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-link h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.category-link p {
  margin: 0;
  color: #666;
}
</style>
