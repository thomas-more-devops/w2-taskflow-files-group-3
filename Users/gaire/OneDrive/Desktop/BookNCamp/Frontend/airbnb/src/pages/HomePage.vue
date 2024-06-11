<template>
  <div class="home-page">
    <div class="welcome-section">
      <h1>Welcome to BookNcamp</h1>
    </div>
    <div class="image-section">
      <img src="@/assets/img2.jpg" alt="Image 1" class="featured-image">
      <img src="@/assets/img3.jpg" alt="Image 2" class="featured-image">
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>


.welcome-section {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px 40px;
  border-radius: 10px;
}

.welcome-section h1 {
  font-size: 4em;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
}
.image-section {
  display: flex;
  gap: 0px;
}

.featured-image {
  width: 4500px;
  height: auto;
  border-radius: 0px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
