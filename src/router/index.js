import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import PerfilView from '@/views/PerfilView.vue'
import MainView from '@/views/MainView.vue'
import ExperienceView from '@/views/ExperienceView.vue'
import EducationView from '@/views/EducationView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import SkillsView from '@/views/SkillsView.vue'
import ContactView from '@/views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'portfolio',
          component: HomeView,
        },
        {
          path: '/experience',
          name: 'experience',
          component: ExperienceView
        },
        {
          path: '/education',
          name: 'education',
          component: EducationView
        },
        {
          path: '/projects',
          name: 'projects',
          component: ProjectsView
        },
        {
          path: '/skills',
          name: 'skills',
          component: SkillsView
        },
        {
          path: '/contact',
          name: 'contact',
          component: ContactView
        },
        {
          path: '/perfil',
          name: 'perfil',
          component: PerfilView,
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: (to) => {
        const token = localStorage.getItem('token')
        return token ? { name: 'home' } : { name: 'login' }
      }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' })
    return
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
    return
  }

  next()
})

export default router
