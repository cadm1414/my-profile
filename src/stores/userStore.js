import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { identityService } from '@/services/identityService'

export const useUserStore = defineStore('user', () => {
    const user = ref({
        id: null,
        name: null,
        last_name: null,
        full_name: null,
        email: null
    })

    const setUserData = (data) => {
        user.value = { ...user.value, ...data }
    }

    const updateUserData = (data) => {
        Object.keys(data).forEach(key => {
            if (user.value.hasOwnProperty(key)) {
                user.value[key] = data[key]
            }
        })
    }

    const getUserData = async () => {        
        if (!user.value.id) {
            try {
                const userData = await identityService.getCurrentUser()
                setUserData(userData)
            } catch (error) {
                console.error('Error obteniendo datos del usuario:', error)
                throw error
            }
        }

        return { ...user.value }
    }

    const clearUserData = () => {
        user.value = {
            id: null,
            name: null,
            last_name: null,
            full_name: null,
            email: null
        }
    }

    return {
        user,
        setUserData,
        updateUserData,
        getUserData,
        clearUserData
    }
})