<!--
  Главная страница категории "Эротические игры"
-->
<template>
  <div class="games-section">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span> / </span>
      <span>Эротические игры</span>
    </div>

    <h1>Эротические игры</h1>
    <p>
      Игры для разнообразия интимной жизни пар. Создайте незабываемые моменты
      вместе.
    </p>

    <div class="categories-grid">
      <NuxtLink
        to="/catalog/eroticheskie-igry/karty"
        class="category-link featured"
      >
        <h3>Эротические карты</h3>
        <p>Игральные карты с заданиями для пар</p>
      </NuxtLink>

      <NuxtLink to="/catalog/eroticheskie-igry/kubiki" class="category-link">
        <h3>Игральные кубики</h3>
        <p>Кубики с интимными заданиями</p>
      </NuxtLink>

      <NuxtLink to="/catalog/eroticheskie-igry/ruletkи" class="category-link">
        <h3>Рулетки</h3>
        <p>Эротические рулетки для выбора заданий</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/eroticheskie-igry/nastolnye-igry"
        class="category-link"
      >
        <h3>Настольные игры</h3>
        <p>Полноценные эротические настольные игры</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/eroticheskie-igry/eroticheskie-svechi"
        class="category-link"
      >
        <h3>Эротические свечи</h3>
        <p>Специальные свечи для игр и массажа</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/eroticheskie-igry/rolevye-igry"
        class="category-link featured"
      >
        <h3>Ролевые игры</h3>
        <p>Костюмы и аксессуары для ролевых игр</p>
      </NuxtLink>

      <NuxtLink to="/catalog/eroticheskie-igry/fantiki" class="category-link">
        <h3>Фантики удовольствий</h3>
        <p>Карточки с интимными заданиями</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/eroticheskie-igry/seks-podarki"
        class="category-link"
      >
        <h3>Секс подарки</h3>
        <p>Готовые наборы для подарков</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Эротические игры - Каталог интимных товаров",
  description:
    "Эротические игры для пар: карты, кубики, рулетки, настольные игры и ролевые костюмы.",
});
</script>

<style scoped>
.games-section {
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
  background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%);
  border-color: #8b5cf6;
}

.category-link h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.category-link.featured h3 {
  color: #8b5cf6;
}

.category-link p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
