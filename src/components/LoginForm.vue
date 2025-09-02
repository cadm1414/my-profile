<template>
    <form @submit.prevent="onSubmit">
        <div class="mb-3">
            <label for="email" class="form-label">Correo</label>
            <input id="email" type="email" class="form-control" v-model="email" v-bind="emailAttrs"
                placeholder="ejemplo@correo.com" />
            <small class="text-danger">{{ errors.email }}</small>
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input id="password" type="password" class="form-control" v-model="password" v-bind="passwordAttrs" />
            <small class="text-danger">{{ errors.password }}</small>
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
            {{ isLoading ? "Ingresando..." : "Ingresar" }}
        </button>
        <div v-if="loginError" class="alert alert-danger mt-3">
            {{ loginError }}
        </div>

    </form>
</template>

<script setup>
import { useLoginForm } from '@/composables/useLogin'

const {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    onSubmit,
    isLoading,
    loginError
} = useLoginForm()
</script>