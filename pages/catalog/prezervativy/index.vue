<!--
  Главная страница категории "Презервативы"
-->
<template>
  <div class="condoms-section">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span> / </span>
      <span>Презервативы</span>
    </div>

    <h1>Презервативы</h1>
    <p>
      Широкий выбор презервативов от ведущих производителей. Безопасность и
      качество прежде всего.
    </p>

    <div class="categories-grid">
      <NuxtLink
        to="/catalog/prezervativy/klassicheskie"
        class="category-link featured"
      >
        <h3>Классические</h3>
        <p>Стандартные латексные презервативы</p>
      </NuxtLink>

      <NuxtLink to="/catalog/prezervativy/ultratlonkie" class="category-link">
        <h3>Ультратонкие</h3>
        <p>Максимальная чувствительность</p>
      </NuxtLink>

      <NuxtLink to="/catalog/prezervativy/s-usikam" class="category-link">
        <h3>С усиками</h3>
        <p>Презервативы с дополнительными элементами</p>
      </NuxtLink>

      <NuxtLink to="/catalog/prezervativy/analnye" class="category-link">
        <h3>Анальные</h3>
        <p>Специальные презервативы для анального секса</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/prezervativy/prodlevajushhie"
        class="category-link featured"
      >
        <h3>Продлевающие</h3>
        <p>Презервативы с анестезирующим эффектом</p>
      </NuxtLink>

      <NuxtLink to="/catalog/prezervativy/svetjashhiesja" class="category-link">
        <h3>Светящиеся</h3>
        <p>Флуоресцентные презервативы</p>
      </NuxtLink>

      <NuxtLink to="/catalog/prezervativy/vkusovye" class="category-link">
        <h3>Вкусовые</h3>
        <p>Презервативы с различными вкусами</p>
      </NuxtLink>

      <NuxtLink to="/catalog/prezervativy/raznocvetnye" class="category-link">
        <h3>Разноцветные</h3>
        <p>Цветные презервативы</p>
      </NuxtLink>

      <NuxtLink to="/catalog/prezervativy/big-boy" class="category-link">
        <h3>Big Boy</h3>
        <p>Презервативы увеличенного размера</p>
      </NuxtLink>

      <NuxtLink to="/catalog/prezervativy/naperstki" class="category-link">
        <h3>Напёрстки</h3>
        <p>Латексные напёрстки для пальцев</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Презервативы - Каталог интимных товаров",
  description:
    "Широкий выбор презервативов. Классические, ультратонкие, продлевающие, вкусовые и другие виды.",
});
</script>

<style scoped>
.condoms-section {
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
  background: linear-gradient(135deg, #e8f8ff 0%, #f0f4ff 100%);
  border-color: #3b82f6;
}

.category-link h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.category-link.featured h3 {
  color: #3b82f6;
}

.category-link p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
