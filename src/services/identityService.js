import axios from "axios";
import { authService } from '@/services/authService'

const API_BASE_URL = "http://localhost:8000/api/v1/identity";

export class IdentityService {

    async register(userData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, userData)
            return response.data
        } catch (error) {            
            throw new Error(error.response?.data?.detail?.message || 'Error al registrar usuario')
        }
    }

    async getCurrentUser() {
        try {
            const response = await axios.get(`${API_BASE_URL}/me`)
            return response.data
        } catch (error) {
            console.log(error.response?.data?.code, typeof error.response?.data?.code)
            if (error.response?.data?.code === 'TOKEN_EXPIRED') {
                authService.logout()
            }
            throw new Error(error.response?.data?.code || 'Error al obtener usuario actual')
        }
    }

    async updateProfile(userData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/me`, userData)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar perfil')
        }
    }

    async deleteAccount() {
        try {
            const response = await axios.delete(`${API_BASE_URL}/me`)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al eliminar cuenta')
        }
    }

    async changePassword(passwordData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/me/password`, passwordData)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al cambiar contraseña')
        }
    }

}

export const identityService = new IdentityService()