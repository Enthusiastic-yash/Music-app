<template>
  <main>
       <section class="mb-8 py-20 text-white text-center relative">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus et dolor mollis, congue augue non, venenatis elit.
          Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget,
          ullamcorper urna.
        </p>
      </div>
    </div>

    <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png" />
  </section>

  <!-- Main Content -->
  <section class="container md:w-10/12  sm:w-full mx-auto ">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <i class="fa fa-headphones-alt float-right text-green-400 text-2xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <app-song-item v-for="song in songs" :key ="song.docID"
        :song = "song"
        />
       
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
  </main>
</template>
<script>
  import {songsCollection} from "@/includes/firebase"
  import AppSongItem from "@/components/songItem.vue"
export default {
  name: 'Home',
  data(){
    return{
      songs:[],
      maxParPage : 10,
      pandingRequest : false,
    }
  },
  components:{
    AppSongItem,
  },

  async  created(){
    
    this.getSong()
    

    window.addEventListener('scroll', this.handelScroll)
  },

  // remove event listener when user change the page while scrolling 
  beforeUnmount(){
    window.removeEventListener('scroll',this.handelScroll)
  },

  methods:{

        // infinite scrolling function
    handelScroll(){
      // this function container the offset height and how much scroll from the top
      const {scrollTop , offsetHeight} = document.documentElement
      //grab the inner height from the window object
      
      const {innerHeight} = window

      // check where is the position of the user on the page
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  // if use scroll at the bottom of the window then this function will run 
      if(bottomOfWindow){
       this.getSong()
      }
    },


   async  getSong(){
        // this function prevent to multiple request while request are already being made
      if(this.pandingRequest){
        return;
      }

      // if above condition is false then this will run and request being made
      this.pandingRequest = true;

      // if user enter first time and there is no any sone this condition will check if this is a case then the inner code will run other wise else block excute
      let snapShot;
     if(this.songs.length){

               // here we passing the id of last song of the array and retunr the snap shot of last document of the array
     const lastDoc =  await songsCollection.doc(this.songs[this.songs.length-1].docID).get()

            // get the snapshot of song with get function who return the promise  
    snapShot=  await songsCollection
    // this function organinse the data by its name 
    .orderBy('modified_name')
    // startAfter  require the snapshot of the document where it should start from to request the data from server
    .startAfter(lastDoc)
    // this limt set how many result we have to show at once and then above query will run  after the given result is called infinte scroll
    .limit(this.maxParPage)
    .get()
  }

//   get the refference or snapshot from songscollection      
     else{


   snapShot=  await songsCollection
    // this function organinse the data by its name 
    .orderBy('modified_name') 
    // this limt set how many result we have to show at once and then above query will run  after the given result is called infinte scroll
    .limit(this.maxParPage)
    .get()

     }



    // loop thorough the snapshot of each iteration 
    snapShot.forEach((document)=>{
      this.songs.push({
        // get the docuemt id
        docID : document.id,
        ...document.data()        // grab the data from that id 
      })
    })


      //after performing the request the this condition will false
      this.pandingRequest = false;
    }

  }
  
}
</script>
