# Sistema de Perfil de Usuario - My Profile

## 📋 Descripción del Proyecto

Sistema web de gestión de perfil personal desarrollado con **Vue 3**, que permite a los usuarios gestionar su información personal, experiencia, educación, proyectos, habilidades y contacto. El sistema incluye autenticación JWT y una interfaz moderna y responsiva.

## 🚀 Tecnologías Utilizadas

- **Frontend**: Vue 3 (Composition API)
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **Validación**: Vee-Validate + Zod
- **HTTP Client**: Axios
- **UI Framework**: Bootstrap 5 + Bootstrap Icons
- **Notificaciones**: SweetAlert2
- **Build Tool**: Vite

## 📁 Estructura del Proyecto

```
my-profile/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── base.css
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components/
│   │   ├── LoginForm.vue
│   │   ├── RegisterForm.vue
│   │   └── Sidebar.vue
│   ├── composables/
│   │   ├── useLogin.js
│   │   ├── useRegister.js
│   │   ├── useSidebar.js
│   │   └── useProfileForm.js
│   ├── router/
│   │   └── index.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── axiosService.js
│   │   └── identityService.js
│   ├── stores/
│   │   └── userStore.js
│   ├── utils/
│   │   └── axiosConfig.js
│   ├── views/
│   │   ├── ContactView.vue
│   │   ├── EducationView.vue
│   │   ├── ExperienceView.vue
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── MainView.vue
│   │   ├── PerfilView.vue
│   │   ├── ProjectsView.vue
│   │   └── SkillsView.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── prettier.config.js
├── vite.config.js
└── jsconfig.json
```

## 🔐 Sistema de Autenticación

### Características
- **Login con JWT**: Autenticación basada en tokens
- **Registro de usuarios**: Con validación completa
- **Guards de Ruta**: Protección automática de rutas
- **Interceptors Globales**: Manejo automático de tokens expirados
- **Logout Automático**: Cierre de sesión cuando el token expira

### Servicios de Autenticación

#### AuthService (services/authService.js)
```javascript
- login(credentials)
- setToken(token) 
- getToken()
- removeToken()
- isAuthenticated()
- logout()
```

#### IdentityService (services/identityService.js)
```javascript
- register(userData)
- getCurrentUser()
- updateProfile(userData)
- changePassword(passwordData)
- deleteAccount()
```

### Endpoints del Backend
- `POST /api/v1/auth/access` - Login
- `POST /api/v1/identity/register` - Registro
- `GET /api/v1/identity/me` - Obtener usuario actual
- `PUT /api/v1/identity/me` - Actualizar perfil
- `PUT /api/v1/identity/me/password` - Cambiar contraseña
- `DELETE /api/v1/identity/me` - Eliminar cuenta

## 🏪 Estado Global (Pinia)

### UserStore (stores/userStore.js)
Gestión centralizada de datos del usuario:

```javascript
// Estado
user: {
  id: null,
  name: null,
  last_name: null,
  full_name: null,
  email: null
}

// Métodos
- setUserData(data)      // Guardar datos
- updateUserData(data)   // Actualizar datos específicos
- getUserData()          // Extraer datos (con fetch automático)
- clearUserData()        // Eliminar datos
```

### Características del Store
- **Fetch automático**: Si no hay datos, hace petición al servidor
- **Reactividad**: Actualización automática del UI
- **Persistencia**: Datos disponibles mientras la app esté abierta

## 🎨 Componentes Principales

### 1. Sidebar (components/Sidebar.vue)
- **Navegación principal** con menú dinámico desde JSON
- **Información del usuario** desde Pinia
- **Responsive**: Se adapta a móviles (colapsado automático)
- **Estados**: Expandido/Colapsado con botón toggle
- **Menú configurado**:
  - 🏠 Portafolio
  - 💼 Experiencia
  - 🎓 Educación
  - 📁 Proyectos
  - ⚙️ Habilidades
  - ✉️ Contacto

### 2. Layout Principal (views/MainView.vue)
- **Estructura base** con Sidebar + contenido
- **Contenedor para todas las vistas** autenticadas
- **Diseño responsivo** con flexbox

### 3. Formularios de Autenticación

#### LoginForm (components/LoginForm.vue)
- **Validación con Zod**: Email y contraseña
- **Estados de carga**: Spinner durante login
- **Manejo de errores**: Mensajes personalizados en español
- **Token storage**: Guardado automático en localStorage

#### RegisterForm (components/RegisterForm.vue)
- **Campos**: Nombres, apellidos, email, contraseña
- **Validación robusta**: Todos los campos obligatorios
- **Éxito**: SweetAlert + cambio automático a login

## 📝 Gestión de Perfil

### Profile Form (composables/useProfileForm.js)
Composable completo para gestión de perfil con tres secciones:

#### 1. **Datos Personales**
- Nombres (obligatorio)
- Apellidos (obligatorio)  
- Email (obligatorio, formato válido)
- **Precarga automática** desde Pinia
- **Actualización reactiva** del store

#### 2. **Cambio de Contraseña**
- Contraseña actual (obligatorio)
- Nueva contraseña (8+ caracteres, mayúscula, minúscula, número)
- Confirmación de contraseña
- **Validación de coincidencia**
- **Endpoint**: `PUT /api/v1/identity/me/password`

#### 3. **Eliminación de Cuenta**
- **Triple confirmación** de seguridad:
  1. Confirmación inicial
  2. Advertencia detallada
  3. Input de verificación (texto exacto)
- **Advertencias claras** sobre consecuencias
- **Limpieza completa**: Store, localStorage, redirección

## 🗺️ Sistema de Rutas (router/index.js)

### Estructura de Rutas
```javascript
/ (MainView - Layout con Sidebar)
├── '' (portfolio) → HomeView
├── /experience → ExperienceView
├── /education → EducationView  
├── /projects → ProjectsView
├── /skills → SkillsView
├── /contact → ContactView
└── /perfil → PerfilView

/login → LoginView (sin layout)
```

### Guards de Navegación
- **Autenticación requerida**: Todas las rutas principales
- **Redirección inteligente**: 
  - Login → Portfolio (si autenticado)
  - Cualquier ruta → Login (si no autenticado)
- **Fallback 404**: Redirección basada en estado de autenticación

## 🛠️ Composables (Reutilizables)

### useLogin (composables/useLogin.js)
- **Validación**: Zod schema con mensajes en español
- **Estados**: Loading, errores
- **Integración**: AuthService + UserStore + Router

### useRegister (composables/useRegister.js)
- **Callback onSuccess**: Para cambio automático de formulario
- **Validación completa**: Todos los campos requeridos
- **Integración**: IdentityService + SweetAlert

### useSidebar (composables/useSidebar.js)
- **Estado del sidebar**: Collapsed/expanded
- **Datos del menú**: JSON configurable
- **Responsive**: Detección automática de pantalla
- **Usuario**: Datos desde Pinia
- **Logout**: Con confirmación

### useProfileForm (composables/useProfileForm.js)
- **Múltiples formularios**: Perfil, contraseña, eliminación
- **Validaciones independientes**: Schemas separados
- **Estados de carga**: Para cada operación
- **Integración completa**: Services + Store + Router

## 🔧 Configuración Global

### Axios Interceptors (utils/axiosConfig.js)
```javascript
// Request Interceptor
- Agrega token automáticamente a todas las peticiones
- Headers: Authorization: Bearer {token}

// Response Interceptor  
- Detecta errores TOKEN_EXPIRED
- Limpia localStorage y store automáticamente
- Muestra SweetAlert y redirige a login
- Previene loops con flag isRefreshing
```

### Setup en main.js
```javascript
- Configuración de Pinia
- Setup de interceptors globales
- Configuración de Vue Router
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticación y Autorización
- [x] Login con JWT
- [x] Registro de usuarios con validación
- [x] Logout manual y automático
- [x] Protección de rutas con guards
- [x] Manejo automático de tokens expirados
- [x] Interceptors globales de Axios

### ✅ Gestión de Usuario
- [x] Store centralizado con Pinia
- [x] Carga automática de datos del servidor
- [x] Actualización reactiva del UI
- [x] Persistencia durante la sesión

### ✅ Perfil de Usuario  
- [x] Edición de datos personales
- [x] Cambio de contraseña con validación robusta
- [x] Eliminación de cuenta con confirmaciones múltiples
- [x] Formularios separados e independientes
- [x] Validación client-side con Zod

### ✅ UI/UX
- [x] Sidebar responsivo y colapsible
- [x] Layout moderno con Bootstrap 5
- [x] Notificaciones con SweetAlert2
- [x] Estados de carga y feedback visual
- [x] Diseño mobile-first
- [x] Transiciones y animaciones suaves

### ✅ Arquitectura
- [x] Composables reutilizables
- [x] Separación clara de responsabilidades
- [x] Servicios organizados por dominio
- [x] Configuración centralizada
- [x] Manejo global de errores

## 🎨 Estilos y Diseño

### Características Visuales
- **Gradientes modernos** en headers y botones
- **Bordes redondeados** (15px) para cards
- **Sombras suaves** para profundidad
- **Paleta de colores**:
  - Primario: Gradiente azul oscuro
  - Advertencia: Amarillo/naranja  
  - Peligro: Rojo
  - Éxito: Verde
- **Transiciones smooth** (0.3s ease)
- **Hover effects** con transform y sombras

### Responsive Design
- **Breakpoint principal**: 768px
- **Mobile**: Sidebar colapsado, padding reducido
- **Desktop**: Sidebar expandido, layout completo
- **Grids responsivos**: Bootstrap grid system
- **Componentes adaptativos**: Formularios y cards

## 🔒 Seguridad Implementada

### Autenticación
- **JWT Tokens**: Autenticación stateless
- **Token Storage**: localStorage con nombre específico
- **Expiration Handling**: Detección y manejo automático
- **Auto-logout**: Limpieza completa al expirar

### Validación
- **Client-side**: Zod schemas con validación robusta
- **Password Policy**: 8+ caracteres, mayúscula, minúscula, número
- **Input Sanitization**: Preprocessing de inputs vacíos
- **Error Messages**: Mensajes localizados en español

### Route Protection
- **Guards**: beforeEach en todas las rutas
- **Meta properties**: requiresAuth flag
- **Fallback**: Redirección inteligente en 404

## 🚧 Vistas Implementadas

### ✅ Completamente Funcionales
- **LoginView**: Login/Registro con cambio dinámico
- **PerfilView**: Gestión completa de perfil y seguridad
- **MainView**: Layout principal con sidebar

### 🔲 Estructura Básica (Pendiente de Contenido)
- **HomeView** (Portfolio): Vista principal
- **ExperienceView**: Experiencia laboral
- **EducationView**: Formación académica  
- **ProjectsView**: Proyectos realizados
- **SkillsView**: Habilidades técnicas
- **ContactView**: Información de contacto

## 📱 Compatibilidad

- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos**: Desktop, Tablet, Mobile
- **Resoluciones**: 320px - 1920px+
- **Touch**: Soporte completo para dispositivos táctiles

## 🏃‍♂️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción  
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

## 📦 Dependencias Principales

```json
{
  "vue": "^3.x",
  "vue-router": "^4.x", 
  "pinia": "^2.x",
  "vee-validate": "^4.x",
  "zod": "^3.x",
  "axios": "^1.x",
  "sweetalert2": "^11.x",
  "bootstrap": "^5.x",
  "bootstrap-icons": "^1.x"
}
```

## 🔮 Próximas Funcionalidades

### 📅 Por Implementar
- [ ] **CRUD Completo** para cada sección:
  - [ ] Experiencia laboral (agregar, editar, eliminar)
  - [ ] Educación (títulos, certificaciones)
  - [ ] Proyectos (con imágenes y enlaces)
  - [ ] Habilidades (con niveles)
  - [ ] Información de contacto (múltiples medios)
- [ ] **Upload de archivos**: Avatar, documentos, imágenes
- [ ] **Exportar perfil**: PDF, Word, JSON
- [ ] **Temas**: Modo oscuro/claro
- [ ] **Internacionalización**: Soporte multiidioma
- [ ] **PWA**: Progressive Web App
- [ ] **Notificaciones**: Push notifications

### 🎯 Mejoras Técnicas
- [ ] **Tests**: Unit testing con Vitest
- [ ] **E2E Testing**: Playwright o Cypress  
- [ ] **Performance**: Lazy loading, code splitting
- [ ] **SEO**: Meta tags dinámicos
- [ ] **Analytics**: Integración con Google Analytics
- [ ] **Error Tracking**: Sentry o similar

## 🤝 Contribución

### Estructura de Commits
```
feat: Nueva funcionalidad
fix: Corrección de bugs
docs: Actualización de documentación  
style: Cambios de estilos
refactor: Refactorización de código
test: Agregar o actualizar tests
```

### Desarrollo
1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📊 Estado del Proyecto

- **🟢 Estado**: En Desarrollo Activo
- **📈 Progreso**: ~70% completado
- **🔧 Versión**: 1.0.0-beta
- **📅 Última Actualización**: Septiembre 2025
- **👨‍💻 Desarrollador**: Sistema de gestión de perfiles

## 📝 Notas Técnicas

### Decisiones de Arquitectura
- **Composition API**: Para mejor reutilización de lógica
- **Pinia sobre Vuex**: API más simple y TypeScript friendly  
- **Zod sobre Joi**: Mejor integración con TypeScript
- **SweetAlert2**: UX superior para confirmaciones
- **Bootstrap**: Desarrollo rápido y consistencia

### Patrones Utilizados
- **Service Pattern**: Separación de lógica de API
- **Composables**: Reutilización de lógica reactiva  
- **Store Pattern**: Estado centralizado con Pinia
- **Layout Pattern**: Componentes de layout reutilizables
- **Guard Pattern**: Protección de rutas

---

**📞 Contacto**: Para consultas sobre el proyecto  
**📖 Documentación**: README actualizado regularmente  
**🐛 Issues**: Reportar en el repositorio del proyecto


## Autor

**CARLOS ALBERTO DIAZ MINAYA**
- Email: cdiazm14@gmail.com
- LinkedIn: www.linkedin.com/in/cdiazm14
- GitHub: [cadm1414](https://github.com/cadm1414)

## Repositorio

🔗 **GitHub**: https://github.com/cadm1414/my-profile