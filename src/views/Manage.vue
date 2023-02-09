<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <!-- upload file box -->
      <div class="col-span-1">
        <app-Upload   :addSong = "addSong" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <!-- compositionItem -->
          <div class="p-6">
            <composition-item v-for="(song,i) in songs" :key="song.DocID"
            :song ="song"
            :updateSong ="updateSong"
            :index="i"
            :removeSong ="removeSong" />
           
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
// import store from "@/store"
import compositionItem from "@/components/compositionItem"
import { songsCollection, auth } from "@/includes/firebase";
import AppUpload from "../components/upload.vue";
import CompositionItem from '../components/compositionItem.vue';
export default {
  name: "manage",
  data() {
    return {
      songs: [],
    };
  },
  components: {
    AppUpload, compositionItem,
    CompositionItem
  },


  // grab list of song and check the particular user songlist  is being shown 
  async created() {
    const snapShot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();

    // above get function will return the snapshot of document down below we loop through the data prperty and find the document we want
    snapShot.forEach(this.addSong);
  },


// update song title and genre which is come from composition component
  methods:{
    updateSong(index , values){
      this.songs[index].modified_name = values.modified_name
      this.songs[index].genre = values.genre

    },
    removeSong(i){
      this.songs.splice(i , 1)
    },

    addSong(document){
         const song = {
        ...document.data(),
        docID : document.id
      
      };

      this.songs.push(song)
    }
  }

  // local route guard  to protect from user who is not auth and redirect
  // beforeRouteEnter(to,from ,next){
  //       if(store.state.userLoggedIn){
  //         next();
  //       }
  //       else{
  //         next({name : 'home'})
  //       }
  // }
};
</script>
