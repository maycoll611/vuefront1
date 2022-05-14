import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    meta:{protegido:false}
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../login.vue'),
    meta:{protegido:false}
  },
  {
    path: '/',
    name: 'app',
    component: () => import(/* webpackChunkName: "about" */ '../App.vue'),
    meta:{protegido:true},
    children:[
      {
        path: '/inicio',
        name: 'inicio',
        component: () => import(/* webpackChunkName: "about" */ '../views/inicio.vue'),
        meta:{protegido:true}
      },
      {
        path: '/guias',
        name: 'guias',
        component: () => import(/* webpackChunkName: "about" */ '../views/guias.vue'),
        meta:{protegido:true}
      },
      {
        path: '/eka2',
        name: 'eka2',
        component: () => import(/* webpackChunkName: "about" */ '../views/eka2.vue'),
        meta:{protegido:true}
      },
      {
        path: '/guias_form',
        name: 'guias_form',
        component: () => import(/* webpackChunkName: "about" */ '../views/guias_form.vue'),
        meta:{protegido:true}
      },
      {
        path: 'configuracion',
        name: 'configuracion',
        component: () => import(/* webpackChunkName: "about" */ '../views/configuracion.vue'),
        meta:{protegido:true}
      }
    ]
    },
  ]

const router= new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

import store from '@/store'
//verificar las rutas protegidas por "navigation guards"
router.beforeEach((to,from,next) =>{
  if(to.meta.protegido){
    if(store.state.usuario.api_token == ''){
      next({name:'login'})
      // next()
    }else{
      next()
    }
      // next()
  }else{
    next()
  }
})

export default router
