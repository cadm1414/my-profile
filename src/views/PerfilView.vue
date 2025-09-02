<template>
    <div class="profile-view">
        <div class="card">
            <div class="card-header">
                <h2><i class="bi bi-person-circle me-2"></i>Editar Perfil</h2>
            </div>
            <div class="card-body">

                <div v-if="isLoading" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2">{{ isLoading ? 'Guardando cambios...' : 'Cargando perfil...' }}</p>
                </div>

                <form v-else @submit.prevent="onSubmit" class="row g-3">

                    <div class="col-md-6">
                        <label for="name" class="form-label">
                            <i class="bi bi-person me-1"></i>Nombres *
                        </label>
                        <input id="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                            v-model="name" v-bind="nameAttrs" placeholder="Ingresa tu nombre" />
                        <div v-if="errors.name" class="invalid-feedback">
                            {{ errors.name }}
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label for="last_name" class="form-label">
                            <i class="bi bi-person-check me-1"></i>Apellidos *
                        </label>
                        <input id="last_name" type="text" class="form-control"
                            :class="{ 'is-invalid': errors.last_name }" v-model="last_name" v-bind="lastNameAttrs"
                            placeholder="Ingresa tus apellidos" />
                        <div v-if="errors.last_name" class="invalid-feedback">
                            {{ errors.last_name }}
                        </div>
                    </div>

                    <div class="col-12">
                        <label for="email" class="form-label">
                            <i class="bi bi-envelope me-1"></i>Correo Electrónico *
                        </label>
                        <input id="email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }"
                            v-model="email" v-bind="emailAttrs" placeholder="ejemplo@correo.com" />
                        <div v-if="errors.email" class="invalid-feedback">
                            {{ errors.email }}
                        </div>
                    </div>

                    <div v-if="profileError" class="col-12">
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            {{ profileError }}
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="d-flex gap-2 justify-content-end">
                            <button type="button" class="btn btn-outline-secondary" @click="resetToOriginal"
                                :disabled="isLoading">
                                <i class="bi bi-arrow-clockwise me-1"></i>
                                Restablecer
                            </button>

                            <button type="submit" class="btn btn-primary" :disabled="isLoading">
                                <i class="bi bi-floppy me-1"></i>
                                {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="card mb-4 border-warning mt-4">
            <div class="card-header bg-warning text-white">
                <h4 class="mb-0">
                    <i class="bi bi-shield-lock me-2"></i>
                    Cambiar Contraseña
                </h4>
            </div>
            <div class="card-body">
                
                <div v-if="isChangingPassword" class="text-center py-4">
                    <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Cambiando contraseña...</span>
                    </div>
                    <p class="mt-2">Actualizando contraseña...</p>
                </div>

                <form v-else @submit.prevent="onPasswordSubmit" class="row g-3">

                    <div class="col-12">
                        <label for="current_password" class="form-label">
                            <i class="bi bi-key me-1"></i>Contraseña Actual *
                        </label>
                        <input 
                            id="current_password" 
                            type="password" 
                            class="form-control" 
                            :class="{ 'is-invalid': passwordErrors.current_password }"
                            v-model="current_password" 
                            v-bind="currentPasswordAttrs"
                            placeholder="Ingresa tu contraseña actual" 
                        />
                        <div v-if="passwordErrors.current_password" class="invalid-feedback">
                            {{ passwordErrors.current_password }}
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label for="new_password" class="form-label">
                            <i class="bi bi-lock me-1"></i>Nueva Contraseña *
                        </label>
                        <input 
                            id="new_password" 
                            type="password" 
                            class="form-control" 
                            :class="{ 'is-invalid': passwordErrors.new_password }"
                            v-model="new_password" 
                            v-bind="newPasswordAttrs"
                            placeholder="Nueva contraseña" 
                        />
                        <div v-if="passwordErrors.new_password" class="invalid-feedback">
                            {{ passwordErrors.new_password }}
                        </div>
                        <div class="form-text">
                            <small><i class="bi bi-info-circle me-1"></i>Mínimo 8 caracteres, incluye mayúscula, minúscula y número</small>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label for="confirm_password" class="form-label">
                            <i class="bi bi-check-circle me-1"></i>Confirmar Nueva Contraseña *
                        </label>
                        <input 
                            id="confirm_password" 
                            type="password" 
                            class="form-control" 
                            :class="{ 'is-invalid': passwordErrors.confirm_password }"
                            v-model="confirm_password" 
                            v-bind="confirmPasswordAttrs"
                            placeholder="Confirma la nueva contraseña" 
                        />
                        <div v-if="passwordErrors.confirm_password" class="invalid-feedback">
                            {{ passwordErrors.confirm_password }}
                        </div>
                    </div>

                    <div v-if="passwordError" class="col-12">
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            {{ passwordError }}
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="d-flex gap-2 justify-content-end">
                            <button type="button" class="btn btn-outline-secondary" @click="resetPasswordForm"
                                :disabled="isChangingPassword">
                                <i class="bi bi-x-circle me-1"></i>
                                Limpiar
                            </button>

                            <button type="submit" class="btn btn-warning" :disabled="isChangingPassword">
                                <i class="bi bi-shield-check me-1"></i>
                                {{ isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="card border-danger mt-4">
            <div class="card-header bg-danger text-white">
                <h4 class="mb-0">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Zona Peligrosa
                </h4>
            </div>
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h5 class="text-danger mb-2">
                            <i class="bi bi-trash3 me-2"></i>
                            Eliminar cuenta permanentemente
                        </h5>
                        <p class="text-muted mb-md-0">
                            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten la certeza de que quieres hacer esto.
                            <strong>Todos tus datos se perderán para siempre.</strong>
                        </p>
                        
                        <div class="mt-3">
                            <small class="text-danger">
                                <i class="bi bi-info-circle me-1"></i>
                                <strong>Se eliminará:</strong> Perfil, datos personales, historial y toda información asociada.
                            </small>
                        </div>
                    </div>
                    
                    <div class="col-md-4 text-md-end mt-3 mt-md-0">
                        <button 
                            class="btn btn-outline-danger btn-lg"
                            @click="deleteAccount"
                            :disabled="isDeleting || isLoading"
                        >
                            <i class="bi bi-trash3-fill me-2"></i>
                            {{ isDeleting ? 'Eliminando...' : 'Eliminar Cuenta' }}
                        </button>
                    </div>
                </div>

                <!-- Loading state para eliminación -->
                <div v-if="isDeleting" class="mt-3">
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" 
                             role="progressbar" style="width: 100%">
                            Procesando eliminación de cuenta...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProfileForm } from '@/composables/useProfileForm'

const {
    name,
    nameAttrs,
    last_name,
    lastNameAttrs,
    email,
    emailAttrs,
    errors,
    isLoading,
    profileError,
    onSubmit,
    loadUserData,
    resetToOriginal,
    deleteAccount,
    isDeleting,
    current_password,
    currentPasswordAttrs,
    new_password,
    newPasswordAttrs,
    confirm_password,
    confirmPasswordAttrs,
    passwordErrors,
    passwordError,
    onPasswordSubmit,
    isChangingPassword,
    resetPasswordForm
} = useProfileForm()

onMounted(() => {
    loadUserData()
})
</script>

<style scoped>
.profile-view {
    max-width: 800px;
    margin: 0 auto;
}

.card {
    border: none;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    color: white;
    border-radius: 15px 15px 0 0;
    padding: 1.5rem;
}

.card-header h2 {
    margin: 0;
    font-weight: 600;
}

.card-body {
    padding: 2rem;
}

.form-label {
    font-weight: 600;
    color: #495057;
}

.form-control {
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn {
    border-radius: 10px;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary {
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    border: none;
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.invalid-feedback {
    font-size: 0.875rem;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}
</style>