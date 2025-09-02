import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'


export function useLoginForm() {

  const router = useRouter()

  const schema = z.object({
    email: z.preprocess(
      (val) => val || '',
      z.string()
        .nonempty("El correo es obligatorio")
        .email("Correo no válido")
    ),

    password: z.preprocess(
      (val) => val || '',
      z.string()
        .nonempty("La contraseña es obligatoria")
        .min(8, "Mínimo 8 caracteres")
    ),
  })

  const { handleSubmit, errors, defineField } = useForm({
    validationSchema: toTypedSchema(schema),
  })

  const [email, emailAttrs] = defineField("email")
  const [password, passwordAttrs] = defineField("password")

  const isLoading = ref(false)
  const loginError = ref(null)

  const onSubmit = handleSubmit(async (values) => {
    try {
      isLoading.value = true
      loginError.value = null

      const data = await authService.login({
        email: values.email,
        password: values.password
      })

      if (data.access_token) {
        authService.setToken(data.access_token)
        router.push({ name: 'perfil' }) //AQUI DEBE IR portfolio
      }

    } catch (error) {
      loginError.value = error.message
    } finally {
      isLoading.value = false
    }
  })

  return {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    onSubmit,
    isLoading,
    loginError
  }
}
