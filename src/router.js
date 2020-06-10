import Vue from 'vue';
import Router from 'vue-router';
import PDFjsDemo from './components/PDFjsDemo.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'pdfJsDemo',
      component: PDFjsDemo,
    },
  ],
});
