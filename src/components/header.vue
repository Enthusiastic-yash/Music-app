<template>
  <div>
    <header id="header" class="bg-gray-700">
      <nav class="container mx-auto flex justify-start items-center py-5 px-4">
        <!-- App Name -->
        <router-link class="text-white font-bold uppercase text-2xl mr-4" :to="{name : 'home'}" exact-active-class="no-active"
          >Music</router-link
        >

        <div class="flex flex-grow items-center">
          <!-- Primary Navigation -->
          <ul class="flex flex-row mt-1">
            <!-- Navigation Links -->
                <router-link  :to="{name : 'about'}"  class="px-2 text-white">
                    About
               </router-link>



            <li v-if="!userLoggedIn">
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="toggleAuthModal"
                >Login / Register</a
              >
            </li>
            <template v-else>
              <router-link :to="{name : 'manage'}" class="px-2 text-white" >
              Manage
            </router-link>
              <li>
              <a class="px-2 text-white absolute right-7" href="#"
                @click.prevent="signout">Logout</a>
                
            </li>

            </template>
            
          </ul>
        </div>
      </nav>
    </header>
  </div>
</template>
<script>
import {mapMutations , mapState} from "vuex";
export default {
  name: "AppHeader",

  computed:{

      ...mapState(['userLoggedIn'])
  },

  methods: {
      ...mapMutations(['toggleAuthModal']),
        signout(){
          this.$store.dispatch('signout')
            // after press the log out send the user to the home page  and signout 
          if(this.$route.meta.requiresAuth){
             this.$router.push({name : 'home'})
          }


        }

 
     

  },
};
</script>
