import axios from 'axios'

const API_BASE_URL = 'https://devprofile-api-z0w7.onrender.com/api/v1/auth'

export class AuthService {

    async login(credentials) {
        try {
            const response = await axios.post(`${API_BASE_URL}/access`, credentials)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión')
        }
    }

    setToken(token) {
        localStorage.setItem('token', token)
    }

    getToken() {
        return localStorage.getItem('token')
    }

    removeToken() {
        localStorage.removeItem('token')
    }

    isAuthenticated() {
        return !!this.getToken()
    }

    async logout() {
        this.removeToken()

        try {
            const { useUserStore } = await import('@/stores/userStore')
            const userStore = useUserStore()
            userStore.clearUserData()
        } catch (error) {
            console.error('Error limpiando store:', error)
        }
    }
}

export const authService = new AuthService()