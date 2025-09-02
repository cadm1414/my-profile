import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { identityService } from '@/services/identityService'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import Swal from 'sweetalert2'

export function useProfileForm() {
    const router = useRouter()
    const userStore = useUserStore()
    const isLoading = ref(false)
    const isDeleting = ref(false)
    const profileError = ref(null)
    const passwordError = ref(null)
    const isChangingPassword = ref(false)

    const schema = z.object({
        name: z.preprocess(
            (val) => val || '',
            z.string().min(1, "El nombre es obligatorio")
        ),
        last_name: z.preprocess(
            (val) => val || '',
            z.string().min(1, "El apellido es obligatorio")
        ),
        email: z.preprocess(
            (val) => val || '',
            z.string()
                .min(1, "El correo es obligatorio")
                .email("Correo no válido")
        )
    })

    const passwordSchema = z.object({
        current_password: z.string().min(1, "La contraseña actual es obligatoria"),
        new_password: z.string()
            .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Debe contener al menos una mayúscula, una minúscula y un número"),
        confirm_password: z.string().min(1, "Confirma la nueva contraseña")
    }).refine((data) => data.new_password === data.confirm_password, {
        message: "Las contraseñas no coinciden",
        path: ["confirm_password"]
    })


    const { handleSubmit, errors, defineField, setValues, resetForm } = useForm({
        validationSchema: toTypedSchema(schema),
    })

    const { handleSubmit: handlePasswordSubmit, errors: passwordErrors, defineField: definePasswordField, resetForm: resetPasswordForm } = useForm({
        validationSchema: toTypedSchema(passwordSchema),
    })

    const [name, nameAttrs] = defineField("name")
    const [last_name, lastNameAttrs] = defineField("last_name")
    const [email, emailAttrs] = defineField("email")

    const [current_password, currentPasswordAttrs] = definePasswordField("current_password")
    const [new_password, newPasswordAttrs] = definePasswordField("new_password")
    const [confirm_password, confirmPasswordAttrs] = definePasswordField("confirm_password")

    const loadUserData = async () => {
        try {
            const userData = await userStore.getUserData()

            setValues({
                name: userData.name || '',
                last_name: userData.last_name || '',
                email: userData.email || ''
            })

        } catch (error) {
            console.error('Error cargando datos del usuario:', error)
            profileError.value = 'Error cargando datos del perfil'
        }
    }

    const onSubmit = handleSubmit(async (values) => {
        try {
            isLoading.value = true
            profileError.value = null

            const updateData = {
                name: values.name,
                last_name: values.last_name,
                email: values.email,
                full_name: `${values.name} ${values.last_name}`.trim()
            }

            const updatedUser = await identityService.updateProfile(updateData)

            userStore.updateUserData(updatedUser)

            await Swal.fire({
                title: '¡Perfil actualizado!',
                text: 'Los cambios se han guardado correctamente.',
                icon: 'success',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#0d6efd'
            })

        } catch (error) {
            profileError.value = error.message

            await Swal.fire({
                title: 'Error al actualizar',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo',
                confirmButtonColor: '#dc3545'
            })
        } finally {
            isLoading.value = false
        }
    })

    const onPasswordSubmit = handlePasswordSubmit(async (values) => {
        try {
            isChangingPassword.value = true
            passwordError.value = null
            
            await identityService.changePassword({
                current_password: values.current_password,
                new_password: values.new_password,
                confirm_password: values.confirm_password
            })
            
            resetPasswordForm()

            await Swal.fire({
                title: '¡Contraseña actualizada!',
                text: 'Tu contraseña ha sido cambiada exitosamente.',
                icon: 'success',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#0d6efd'
            })

        } catch (error) {
            passwordError.value = error.message
            
            await Swal.fire({
                title: 'Error al cambiar contraseña',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo',
                confirmButtonColor: '#dc3545'
            })
        } finally {
            isChangingPassword.value = false
        }
    })

    const resetToOriginal = async () => {
        await loadUserData()
    }

    const deleteAccount = async () => {
        try {
            const firstConfirm = await Swal.fire({
                title: '⚠️ ¡Cuidado!',
                text: '¿Estás seguro que quieres eliminar tu cuenta?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, quiero eliminarla',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            })

            if (!firstConfirm.isConfirmed) return

            const secondConfirm = await Swal.fire({
                title: '🚨 ¡ÚLTIMA ADVERTENCIA!',
                html: `
                    <div style="text-align: left; margin: 20px 0;">
                        <p><strong>Esta acción es IRREVERSIBLE y eliminará:</strong></p>
                        <ul style="margin: 10px 0;">
                            <li>Tu perfil completo</li>
                            <li>Toda tu información personal</li>
                            <li>Tu historial en la aplicación</li>
                            <li>Todos tus datos asociados</li>
                        </ul>
                        <p style="color: #dc3545; font-weight: bold;">
                            ⚠️ No podrás recuperar esta información
                        </p>
                    </div>
                `,
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#28a745',
                confirmButtonText: 'ELIMINAR MI CUENTA',
                cancelButtonText: 'Conservar mi cuenta',
                reverseButtons: true,
                focusCancel: true
            })

            if (!secondConfirm.isConfirmed) return

            const { value: confirmText } = await Swal.fire({
                title: '🔒 Confirmación final',
                html: `
                    <p>Para confirmar la eliminación, escribe exactamente:</p>
                    <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; font-weight: bold;">
                        ELIMINAR MI CUENTA
                    </p>
                `,
                input: 'text',
                inputPlaceholder: 'Escribe el texto exacto',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Proceder',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (value !== 'ELIMINAR MI CUENTA') {
                        return 'Debes escribir el texto exactamente como se muestra'
                    }
                }
            })

            if (!confirmText) return

            isDeleting.value = true

            Swal.fire({
                title: 'Eliminando cuenta...',
                text: 'Por favor espera mientras procesamos tu solicitud',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            await identityService.deleteAccount()

            userStore.clearUserData()
            authService.logout()


            await Swal.fire({
                title: '✅ Cuenta eliminada',
                text: 'Tu cuenta ha sido eliminada exitosamente. Lamentamos verte partir.',
                icon: 'success',
                confirmButtonText: 'Entendido',
                allowOutsideClick: false,
                allowEscapeKey: false
            })


            router.push('/login')

        } catch (error) {
            console.error('Error eliminando cuenta:', error)

            await Swal.fire({
                title: 'Error al eliminar cuenta',
                text: error.message || 'Ocurrió un error inesperado',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#dc3545'
            })
        } finally {
            isDeleting.value = false
        }
    }

    return {
        name,
        nameAttrs,
        last_name,
        lastNameAttrs,
        email,
        emailAttrs,
        errors,
        isLoading,
        isDeleting,
        isChangingPassword,
        profileError,
        onSubmit,
        loadUserData,
        resetToOriginal,
        deleteAccount,
        current_password,
        currentPasswordAttrs,
        new_password,
        newPasswordAttrs,
        confirm_password,
        confirmPasswordAttrs,
        passwordErrors,
        onPasswordSubmit,
        resetPasswordForm,
        passwordError
        
    }
}