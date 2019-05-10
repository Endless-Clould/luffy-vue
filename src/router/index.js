import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import Course from '@/components/Course'
import Cart from '@/components/Cart'
import Detail from "@/components/Detail"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    }, {
      path: '/home',
      name: 'home',
      component: home
    }, {
      path: '/course',
      name: 'Course',
      component: Course
    }, {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }, {
      name: "Detail",
      path: "/detail",
      component: Detail,
    }

  ]
})
