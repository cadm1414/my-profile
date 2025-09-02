import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { useUserStore } from '@/stores/userStore'
import Swal from 'sweetalert2'

export function useSidebar() {
    const router = useRouter()
    const userStore = useUserStore()

    const isCollapsed = ref(false)

    const userName = computed(() => {
        return userStore.user.name || userStore.user.email?.split('@')[0] || 'Usuario'
    })

    const menuItems = ref([
        {
            name: 'portfolio',
            label: 'Portafolio',
            route: '/',
            icon: 'bi-house-door'
        },
        {
            name: 'experience',
            label: 'Experiencia',
            route: '/experience',
            icon: 'bi-briefcase'
        },
        {
            name: 'education',
            label: 'Educación',
            route: '/education',
            icon: 'bi-mortarboard'
        },
        {
            name: 'projects',
            label: 'Proyectos',
            route: '/projects',
            icon: 'bi-folder2-open'
        },
        {
            name: 'skills',
            label: 'Habilidades',
            route: '/skills',
            icon: 'bi-gear-wide-connected'
        },
        {
            name: 'contact',
            label: 'Contacto',
            route: '/contact',
            icon: 'bi-envelope'
        }
    ])

    const toggleSidebar = () => {
        isCollapsed.value = !isCollapsed.value
    }

    const checkScreenSize = () => {
        if (window.innerWidth < 768) {
            isCollapsed.value = true
        } else {
            isCollapsed.value = false
        }
    }

    const loadUserData = async () => {
        try {
            await userStore.getUserData()
        } catch (error) {
            console.error('Error cargando usuario:', error)
        }
    }

    const logout = async () => {
        try {
            const result = await Swal.fire({
                title: '¿Cerrar sesión?',
                text: '¿Estás seguro que quieres cerrar sesión?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar'
            })

            if (result.isConfirmed) {
                await authService.logout()

                await Swal.fire({
                    title: '¡Hasta luego!',
                    text: 'Sesión cerrada correctamente',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                })

                router.push('/login')
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    const setupSidebar = () => {
        loadUserData()
        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
    }

    const cleanupSidebar = () => {
        window.removeEventListener('resize', checkScreenSize)
    }

    return {        
        isCollapsed,
        menuItems,
        userName,
        toggleSidebar,
        logout,
        setupSidebar,
        cleanupSidebar
    }
}