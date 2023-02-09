<template>
  <div id="app">
    
      <app-header />
  <!-- Introduction -->
       <router-view v-slot="{Component}" >
         <transition name="fade" mode="out-in">
            <Component :is="Component"></Component>
         </transition>

       </router-view>

  <!-- Player -->
          <app-player/>
             
      <Auth/>
  </div>
</template>

<script>
import AppHeader from "./components/header.vue"
import AppPlayer from "./components/player.vue"
import Auth from "./components/auth.vue"
export default {
  name : 'app',
components:{
  AppHeader,
  Auth,
  AppPlayer,
},

created(){
this.$store.dispatch('init_login')
}

}
</script>

<style> 
    .fade-enter-from{
      opacity: 0;
    }
    .fade-enter-active{
      transition: all 0.5s linear;
     
    }

    .fade-leave-to{
      transition : all 0.5s linear;
      opacity: 0;
    }
</style>
