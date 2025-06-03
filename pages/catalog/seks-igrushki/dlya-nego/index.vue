<!--
  Главная страница раздела "Для мужчин"
-->
<template>
  <div class="men-section">
    <h1>Товары для мужчин</h1>
    <p>Выберите категорию:</p>

    <div class="categories-grid">
      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nego/masturbatory-i-vaginy"
        class="category-link"
      >
        <h3>Мастурбаторы и вагины</h3>
        <p>Широкий выбор мастурбаторов и искусственных вагин</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nego/nasadki-i-udliniteli"
        class="category-link"
      >
        <h3>Насадки и удлинители</h3>
        <p>Насадки и удлинители для мужчин</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nego/pompy-dlya-penisa"
        class="category-link"
      >
        <h3>Помпы для пениса</h3>
        <p>Помпы для увеличения и стимуляции</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nego/koltsa-i-nasadki-na-penis"
        class="category-link"
      >
        <h3>Кольца и насадки на пенис</h3>
        <p>Эрекционные кольца и насадки</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nego/seks-kukly"
        class="category-link"
      >
        <h3>Секс куклы</h3>
        <p>Реалистичные секс куклы для мужчин</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nego/massazher-prostaty"
        class="category-link"
      >
        <h3>Массажер простаты</h3>
        <p>Массажеры и стимуляторы простаты</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nego/prezervativy"
        class="category-link"
      >
        <h3>Презервативы</h3>
        <p>Презервативы различных типов и размеров</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nego/geli-i-lubrikanty"
        class="category-link"
      >
        <h3>Гели и лубриканты</h3>
        <p>Интимные гели и смазки для мужчин</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nego/krema-dlya-uvelicheniya-chlena"
        class="category-link"
      >
        <h3>Крема для увеличения члена</h3>
        <p>Специальные крема и средства для увеличения</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Товары для мужчин",
});
</script>

<style scoped>
.men-section {
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
