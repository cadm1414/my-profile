import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { ref } from 'vue'
import { identityService } from '@/services/identityService'
import Swal from 'sweetalert2'

export function useRegisterForm(onSuccess) {
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
        ),
        password: z.preprocess(
            (val) => val || '',
            z.string()
                .min(1, "La contraseña es obligatoria")
                .min(8, "Mínimo 8 caracteres")
        ),
    })

    const { handleSubmit, errors, defineField, resetForm } = useForm({
        validationSchema: toTypedSchema(schema),
    })

    const [name, nameAttrs] = defineField("name")
    const [last_name, lastNameAttrs] = defineField("last_name")
    const [email, emailAttrs] = defineField("email")
    const [password, passwordAttrs] = defineField("password")

    const isLoading = ref(false)
    const registerError = ref(null)

    const onSubmit = handleSubmit(async (values) => {
        try {
            isLoading.value = true
            registerError.value = null
            const full_name = `${values.name} ${values.last_name}`

            await identityService.register({ ...values, full_name })

            await Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
                icon: 'success',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#0d6efd'
            })
            
            resetForm()
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {            
            registerError.value = error.message
        } finally {
            isLoading.value = false
        }
    })

    return {
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
    }
}