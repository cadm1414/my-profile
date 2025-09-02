<template>
    <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark sidebar-container"
        :class="{ 'sidebar-collapsed': isCollapsed }">

        <div class="d-flex align-items-center mb-3">
            <div v-if="!isCollapsed" class="d-flex align-items-center me-auto text-white text-decoration-none">
                <i class="bi bi-person-circle fs-4 me-2"></i>
                <span class="fs-4">Perfil</span>
            </div>

            <button class="btn btn-outline-light btn-sm ms-auto toggle-btn" @click="toggleSidebar"
                :title="isCollapsed ? 'Mostrar menú' : 'Ocultar menú'">
                <i class="bi" :class="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
            </button>
        </div>

        <hr>

        <ul class="nav nav-pills flex-column mb-auto h-100">
            <li class="nav-item mb-1" v-for="item in menuItems" :key="item.name">
                <router-link :to="item.route" class="nav-link text-white d-flex align-items-center"
                    :class="{ active: $route.name === item.name, 'justify-content-center': isCollapsed }"
                    :title="isCollapsed ? item.label : ''">
                    <i class="bi" :class="[item.icon, { 'me-2': !isCollapsed }]"></i>
                    <span v-show="!isCollapsed">{{ item.label }}</span>
                </router-link>
            </li>
        </ul>
        
        <hr>
        
        <div class="mt-auto">            
            <div v-show="!isCollapsed" class="dropdown">
                <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                    id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <strong>{{ userName }}</strong>
                </a>
                <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li>
                        <router-link class="dropdown-item" to="/perfil">
                            <i class="bi bi-person me-2"></i>Perfil
                        </router-link>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" @click.prevent="logout">
                            <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                        </a>
                    </li>
                </ul>
            </div>            
            <div v-show="isCollapsed" class="text-center">
                <button class="btn btn-outline-warning btn-sm" @click="logout" title="Cerrar sesión">
                    <i class="bi bi-box-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useSidebar } from '@/composables/useSidebar'

const {
  isCollapsed,
  menuItems,
  userName,
  toggleSidebar,
  logout,
  setupSidebar,
  cleanupSidebar
} = useSidebar()

onMounted(() => {
  setupSidebar()
})

onBeforeUnmount(() => {
  cleanupSidebar()
})
</script>

<style scoped>
.sidebar-container {
    width: 230px;
    height: calc(100vh - 20px);
    margin: 10px;
    border-radius: 25px;
    transition: width 0.3s ease;
    overflow: hidden;
}

.sidebar-collapsed {
    width: 80px;
}

.nav-link {
    border-radius: 5px;
    margin-bottom: 2px;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
    background-color: #0d6efd;
}

.toggle-btn {
    border: none;
    padding: 4px 8px;
}

.toggle-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
    .sidebar-container {
        width: 80px;
    }
}

span {
    transition: opacity 0.3s ease;
}

.sidebar-collapsed span {
    opacity: 0;
}
</style>