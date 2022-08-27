import { defineConfig } from '@umijs/max';

export default defineConfig({
  plugins: [require.resolve('@umijs/max-plugin-openapi')],
  openAPI: [
    {
      requestLibPath: "import { request } from '@/utils/request'",
      schemaPath: 'http://127.0.0.1:7001/swagger-doc',
      projectName: 'server',
    },
  ],
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    },
  },
  antd: {},
  access: {},
  model: {},
  initialState: {
    loading: '@fenxing/app-loading',
  },
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
