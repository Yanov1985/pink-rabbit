<!--
  Главная страница категории "Косметика и феромоны"
-->
<template>
  <div class="cosmetics-section">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span> / </span>
      <span>Косметика и феромоны</span>
    </div>

    <h1>Косметика и феромоны</h1>
    <p>
      Специальная косметика для интимных отношений и феромоны для
      привлекательности.
    </p>

    <div class="categories-grid">
      <NuxtLink
        to="/catalog/kosmetika-i-feromony/feromony"
        class="category-link featured"
      >
        <h3>Феромоны</h3>
        <p>Духи и спреи с феромонами для привлекательности</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/kosmetika-i-feromony/intimnaja-kosmetika"
        class="category-link"
      >
        <h3>Интимная косметика</h3>
        <p>Специальная косметика для интимной зоны</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/kosmetika-i-feromony/massazhnye-masla"
        class="category-link"
      >
        <h3>Массажные масла</h3>
        <p>Эротические масла для массажа и релаксации</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/kosmetika-i-feromony/aromaticheskie-svechi"
        class="category-link"
      >
        <h3>Ароматические свечи</h3>
        <p>Свечи для создания романтической атмосферы</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/kosmetika-i-feromony/intim-gigiena"
        class="category-link"
      >
        <h3>Интимная гигиена</h3>
        <p>Средства для интимной гигиены и ухода</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/kosmetika-i-feromony/krem-dlja-tela"
        class="category-link"
      >
        <h3>Крем для тела</h3>
        <p>Увлажняющие и питательные кремы</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Косметика и феромоны - Каталог интимных товаров",
  description:
    "Интимная косметика, феромоны, массажные масла и средства по уходу за телом.",
});
</script>

<style scoped>
.cosmetics-section {
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
  background: linear-gradient(135deg, #fef3c7 0%, #fef7cd 100%);
  border-color: #d97706;
}

.category-link h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.category-link.featured h3 {
  color: #d97706;
}

.category-link p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
