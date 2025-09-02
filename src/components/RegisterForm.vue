<template>
    <form @submit.prevent="onSubmit">
        <div class="mb-3">
            <label for="name" class="form-label">Nombres</label>
            <input id="name" type="text" class="form-control" v-model="name" v-bind="nameAttrs" placeholder="Carlos" />
            <small class="text-danger">{{ errors.name }}</small>
        </div>
        <div class="mb-3">
            <label for="last_name" class="form-label">Apellidos</label>
            <input id="last_name" type="text" class="form-control" v-model="last_name" v-bind="lastNameAttrs"
                placeholder="Díaz" />
            <small class="text-danger">{{ errors.last_name }}</small>
        </div>
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
            {{ isLoading ? "Registrando..." : "Registrarse" }}
        </button>

        <div v-if="registerError" class="alert alert-danger mt-3">
            {{ registerError }}
        </div>
    </form>
</template>
<script setup>
import { useRegisterForm } from '@/composables/useRegister'

const emit = defineEmits(['register-success'])

const {
    name,
    nameAttrs,
    last_name,
    lastNameAttrs,
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    onSubmit,
    isLoading,
    registerError
} = useRegisterForm(() => {
    emit('register-success')
})
</script>