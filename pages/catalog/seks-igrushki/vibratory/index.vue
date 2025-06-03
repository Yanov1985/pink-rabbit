<!--
  Главная страница категории "Вибраторы"
-->
<template>
  <div class="vibrators-section">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <span> / </span>
      <NuxtLink to="/catalog/seks-igrushki">Товары для взрослых</NuxtLink>
      <span> / </span>
      <span>Вибраторы</span>
    </div>

    <h1>Вибраторы</h1>
    <p>
      Большой выбор вибраторов различных типов и функций. Выберите подходящую
      категорию:
    </p>

    <div class="categories-grid">
      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/elitnye-vibratory"
        class="category-link featured"
      >
        <h3>Элитные вибраторы</h3>
        <p>Премиальные вибраторы высокого качества</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/vibratory-dlya-par"
        class="category-link"
      >
        <h3>Вибраторы для пар</h3>
        <p>Вибраторы для совместного использования</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/hitech-vibratory"
        class="category-link featured"
      >
        <h3>Hi-tech вибраторы</h3>
        <p>Высокотехнологичные умные вибраторы</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/mnogofunkcionalnye-vibratory"
        class="category-link"
      >
        <h3>Многофункциональные</h3>
        <p>Многофункциональные вибраторы с различными режимами</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/vibroyaica"
        class="category-link"
      >
        <h3>Виброяйца</h3>
        <p>Компактные вибрирующие яйца</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/vibratory-tochki-g"
        class="category-link"
      >
        <h3>Вибраторы точки G</h3>
        <p>Специальные вибраторы для стимуляции точки G</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/minivibratory"
        class="category-link"
      >
        <h3>Мини вибраторы</h3>
        <p>Компактные дискретные вибраторы</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/analnye-vibratory"
        class="category-link"
      >
        <h3>Анальные вибраторы</h3>
        <p>Вибраторы для анальной стимуляции</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/vibratory-na-radioupravlenii"
        class="category-link"
      >
        <h3>На радиоуправлении</h3>
        <p>Вибраторы с дистанционным управлением</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/vaginalnye-vibratory"
        class="category-link"
      >
        <h3>Вагинальные вибраторы</h3>
        <p>Классические вагинальные вибраторы</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/nabory-vibratorov"
        class="category-link"
      >
        <h3>Наборы вибраторов</h3>
        <p>Комплекты вибраторов и аксессуаров</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/kroliki"
        class="category-link featured"
      >
        <h3>Вибраторы кролики</h3>
        <p>Вибраторы типа кролик с двойной стимуляцией</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/neobychnye-vibratory"
        class="category-link"
      >
        <h3>Необычные вибраторы</h3>
        <p>Оригинальные и необычные модели вибраторов</p>
      </NuxtLink>

      <NuxtLink
        to="/catalog/seks-igrushki/vibratory/vibratory-s-rotaciey"
        class="category-link"
      >
        <h3>С ротацией, крутящиеся</h3>
        <p>Вибраторы с вращательными движениями</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Вибраторы - Каталог интимных товаров",
  description:
    "Большой выбор вибраторов различных типов и функций. Элитные, Hi-tech, для пар и многое другое.",
});
</script>

<style scoped>
.vibrators-section {
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
  background: linear-gradient(135deg, #fff5f5 0%, #fef7ff 100%);
  border-color: #e91e63;
}

.category-link h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.category-link.featured h3 {
  color: #e91e63;
}

.category-link p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
