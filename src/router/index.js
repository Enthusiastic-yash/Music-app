import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Manage from "@/views/Manage"
import song from "@/views/song"
import About from "@/views/About"
import store from "@/store"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
   
  },
  {
    path: '/about',
    name: 'about',
    component : About,
    
 
  },
  {
    name : 'song',
    path : '/song/:id',
    component : song
  },
 {
   path: '/Manage-music',
  //  alias : '/manage',              // work like redirect but it not redirect to url it render the component on that url
   name : 'manage',
   component : Manage,
   meta : {
     requiresAuth : true
   },
  //  beforeEnter: (to, from, next) => {
  //   console.log('manage guard')
  //   next();
  //  }
 },


//  here wer redirect user to new page better for seo
 {
   path : '/manage',
   redirect : {name : 'manage'}
    
 },

// redirect to user when url is not available
{
  path : '/:catchAll(.*)*',
  redirect : {name : 'home'}

}



]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

                        // Global route guard to prevent user to directly  into the page without authenction  before each ckeck every request 
  router.beforeEach((to,from , next)=>{
    // console.log(to.matched)

                       // check every component require auth property is true here some loop the component and matched the component
    if(!to.matched.some(record => record.meta.requiresAuth)){
      next();
      
      return;
    }
        
                             // if user have require auth then check they have loged in  if he is not logged then redirect to the home page
    if(store.state.userLoggedIn){
      next();
    }
    else{
      next({name: 'home'})
    }
    next()


  })



export default router;
