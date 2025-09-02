<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow p-4" style="width: 22rem">
            <h3 class="text-center mb-4">
                {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
            </h3>

            <LoginForm v-if="isLogin" />
            <RegisterForm v-else @register-success="handleRegisterSuccess"/>

            <div class="text-center mt-3">
                <template v-if="isLogin">
                    <small>¿No tienes cuenta?</small>
                    <a href="#" class="ms-1" @click.prevent="toggleForm">Regístrate</a>
                </template>
                <template v-else>
                    <small>¿Ya tienes cuenta?</small>
                    <a href="#" class="ms-1" @click.prevent="toggleForm">Inicia sesión</a>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'

const isLogin = ref(true)

const toggleForm = () => {
    isLogin.value = !isLogin.value
}

const handleRegisterSuccess = () => {    
    isLogin.value = true
}
</script>
