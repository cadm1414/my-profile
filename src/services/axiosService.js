import axios from 'axios'
import Swal from 'sweetalert2'

let isRefreshing = false

export const setupAxiosInterceptors = () => {

    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )

    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const { response } = error

            if (response?.status === 401 &&
                response?.data?.code === 'TOKEN_EXPIRED' &&
                !isRefreshing) {

                isRefreshing = true
                console.log('Token expirado, cerrando sesión...')

                localStorage.removeItem('token')

                try {
                    const { useUserStore } = await import('@/stores/userStore')
                    const userStore = useUserStore()
                    userStore.clearUserData()
                } catch (storeError) {
                    console.error('Error limpiando store:', storeError)
                }

                await Swal.fire({
                    title: 'Sesión expirada',
                    text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                    icon: 'warning',
                    confirmButtonText: 'Iniciar sesión',
                    confirmButtonColor: '#0d6efd',
                    allowOutsideClick: false
                })

                window.location.href = '/login'
                isRefreshing = false
            }

            return Promise.reject(error)
        }
    )
}