import Vue from 'vue'
import Vuex from 'vuex'
import {auth ,  usersCollection} from "@/includes/firebase"
import {Howl} from 'howler';
import helper from '@/includes/helper'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authModalShow : false,
    userLoggedIn : false,
    currentSong : {},
    sound : {},
    seek : '00:00',
    duration : '00:00',
    playerProgress : '0%',
  },
  mutations: {
    // hide and show form pop up 
    toggleAuthModal : (state) =>{
      state.authModalShow = !state.authModalShow
    },
    // chagne the userlogged in value  and hide and show the  login and registe link 
    toggleAuth:(state) =>{
      state.userLoggedIn = !state.userLoggedIn
    },

    newSong: (state,payload) =>{
      state.currentSong = payload;
      state.sound = new Howl({
        src : [payload.url],
        html5 : true,
      });
    },

    updatePosition: (state) =>{
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());

      state.playerProgress = (state.sound.seek() / state.sound.duration())*100 +  "%";
    }


  },
 

getters:{
  authModalShow: (state) =>{
   return state.authModalShow
  },

  // toggle play and pause icon in player component
  playing : (state) =>{
    if(state.sound.playing){
      return state.sound.playing();
    }
    return false;
  }

},
actions:{
  async register({commit} , res){
     // create function send a request to firebase 
  const userCred =  await auth.createUserWithEmailAndPassword (
      res.email , res.password ,
   );

  
   // we need to match the user email id to the correction id to match the user credentials 
          // doc will get an id with above the function and we can assign it to collectin 
    await usersCollection.doc(userCred.user.uid).set({
    name : res.name,
    email : res.email,
    age : res.age,
    country : res.country,
    });

    // this is firebase  thing we can update display name and image after user logged in but here we only store name 
      await userCred.user.updateProfile({
       displayName : res.name,
      
      });
      
      commit('toggleAuth')

    },

    // user login system 

    async login({commit}, payload){
       await auth.signInWithEmailAndPassword(payload.email , payload.password)
        commit('toggleAuth')
    },

    init_login({commit}){
      const user = auth.currentUser;
      if(user){
          commit('toggleAuth')
      }
    },
  
    // signout user  to the app

      async signout({commit}){
        await auth.signOut();
        commit('toggleAuth')
      
      },


      // play a song 
      async newSong({commit , state , dispatch},payload){

        if(state.sound instanceof Howl ){
          state.sound.unload();
        }

         commit('newSong', payload);
         state.sound.play();

        state.sound.on('play' , ()=>{
          requestAnimationFrame(()=>{
            dispatch('progress')
          })
        })

      },


      // toggle play and pause audio
      async toggleAudio({state}){
        if(!state.sound.playing){
          return;
        }
        if(state.sound.playing()){
          state.sound.pause();
        }else{
          state.sound.play();
        }
      },

      progress({commit, state , dispatch}){
        commit('updatePosition');
        if(state.sound.playing){
          requestAnimationFrame(()=>{
            dispatch('progress')
          })
        }
      },

      // progress bar audio with duration
    updateSeek({state, dispatch},payload) {

      if(!state.sound.playing){
        return;
      }

      // this function will return current element cordinate and dimensation 
      const {x , width} = payload.currentTarget.getBoundingClientRect(); 


        const clickX =  payload.clientX - x;
      const percentage = clickX / width ;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once('seek' , () =>{
        dispatch('progress');
      })

    }

}    


})
