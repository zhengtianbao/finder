import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/patent/format',
  },
  {
    path: '/patent',
    name: 'Patent',
    component: () => import('@/components/PatentIndex.vue'),
    children: [
      {
        path: '/patent/format',
        name: 'Format',
        component: () => import('@/components/PatentFormat.vue'),
      },
      {
        path: '/patent/compare',
        name: 'Compare',
        component: () => import('@/components/PatentCompare.vue'),
      },
      {
        path: '/patent/check',
        name: 'Check',
        component: () => import('@/components/PatentCheck.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
