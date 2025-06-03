<!--
  Главная страница раздела "Для женщин"
-->
<template>
  <div class="women-section">
    <h1>Товары для женщин</h1>
    <p>Выберите категорию:</p>

    <div class="categories-grid">
      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nee/vibratory"
        class="category-link"
      >
        <h3>Вибраторы</h3>
        <p>Широкий выбор вибраторов для женщин</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nee/falloimitatory"
        class="category-link"
      >
        <h3>Фаллоимитаторы</h3>
        <p>Категория фаллоимитаторов для женщин</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nee/vaginalnye-trenazhery"
        class="category-link"
      >
        <h3>Вагинальные тренажеры</h3>
        <p>Тренажеры для укрепления интимных мышц</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nee/stimulyatory-klitora"
        class="category-link"
      >
        <h3>Стимуляторы клитора</h3>
        <p>Специализированные стимуляторы клитора</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nee/vibratory-tochki-g"
        class="category-link"
      >
        <h3>Вибраторы точки G</h3>
        <p>Вибраторы для стимуляции точки G</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nee/vibroyaytso"
        class="category-link"
      >
        <h3>Виброяйцо</h3>
        <p>Компактные вибрирующие яйца</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nee/probki-i-vtulki"
        class="category-link"
      >
        <h3>Анальные пробки и втулки</h3>
        <p>Анальные игрушки для женщин</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nee/zhenskoe-nizhnee-bele"
        class="category-link"
      >
        <h3>Женское нижнее белье</h3>
        <p>Эротическое белье для женщин</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/dlya-nee/portupei"
        class="category-link"
      >
        <h3>Портупеи</h3>
        <p>Портупеи и аксессуары для ролевых игр</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Товары для женщин",
});
</script>

<style scoped>
.women-section {
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
