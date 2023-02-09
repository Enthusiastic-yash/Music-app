import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ValidationProvider , ValidationObserver } from 'vee-validate/dist/vee-validate.full.esm';

import  {auth} from'./includes/firebase'
import './assets/tailwind.css'
import './assets/main.css'

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.config.productionTip = false

let app;
auth.onAuthStateChanged(()=>{
  if(!app){
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
 

})

