<template>
  <div class="product-page">
    <Head>
      <title>Товар {{ $route.params.id }} - PinkRabbit</title>
    </Head>

    <div class="container">
      <nav class="breadcrumb">
        <NuxtLink to="/" class="breadcrumb-link">Главная</NuxtLink>
        <span class="breadcrumb-separator">—</span>
        <NuxtLink to="/catalog/seks-igrushki" class="breadcrumb-link"
          >Товары для взрослых</NuxtLink
        >
        <span class="breadcrumb-separator">—</span>
        <span class="breadcrumb-current">Товар {{ $route.params.id }}</span>
      </nav>

      <h1>Страница товара {{ $route.params.id }}</h1>

      <div class="product-info">
        <p>Эта страница находится в разработке.</p>
        <p>ID товара: {{ $route.params.id }}</p>

        <NuxtLink to="/catalog/seks-igrushki" class="back-link">
          ← Вернуться к каталогу
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Получаем ID товара из маршрута
const route = useRoute();
</script>

<style scoped>
.product-page {
  min-height: 50vh;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
}

.breadcrumb-link {
  color: #0066cc;
  text-decoration: none;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #666;
}

.breadcrumb-current {
  color: #333;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
}

.product-info {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #0066cc;
  text-decoration: none;
  font-weight: bold;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
