import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
  path: '/',
  redirect: '/patent/format'
},
{
  path: '/patent',
  name: 'Patent',
  component: () => import('@/components/index.vue'),
  children: [
    {
      path: '/patent/format',
      name: 'Format',
      component: () => import('@/components/format.vue')
    },
    {
      path: '/patent/compare',
      name: 'Compare',
      component: () => import('@/components/compare.vue')
    },
    {
      path: '/patent/check',
      name: 'Check',
      component: () => import('@/components/check.vue')
    },
    {
      path: '/patent/annotative',
      name: 'Annotative',
      component: () => import('@/components/annotative.vue')
    },
    {
      path: '/patent/laboratory',
      name: 'Laboratory',
      component: () => import('@/components/laboratory.vue')
    },
    {
      path: '/patent/info',
      name: 'Info',
      component: () => import('@/components/info.vue')
    }
  ],
},

{
  path: '/:catchAll(.*)',
  meta: {
    closeTab: true,
  },
  component: () => import('@/components/error.vue')
}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
