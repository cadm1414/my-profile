<template>
  <div class="app-container">    
    <Sidebar />   
    
    <main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 10px;
  }
}
</style>
