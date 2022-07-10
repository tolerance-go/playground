import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  npmClient: 'pnpm',
  routes: [
    {
      path: '/',
      redirect: '/workbench',
    },
    {
      path: '/workbench',
      component: './Workbench',
    },
    {
      path: '/playground',
      component: './Playground',
    },
  ],
});
