<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <div
              class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{'bg-green-400 border-green-400 border-solid' : is_dragover }"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop=" is_dragover = true"
                @drapenter.prevent.stop=" is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @drop.prevent.stop="upload($event)"        
                >
              <h5>Drop your files here</h5>
            </div>
              <input type="file" multiple @change="upload($event)">
            <hr class="my-6" />
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
              <div class="font-bold text-sm" :class="upload.text_class">
                  <i :class="upload.icon"></i>{{upload.name}}
                  </div>
              <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                <div class="transition-all progress-bar" :class =" upload.variant "
                :style="{width : upload.current_progress + '%'}"
                ></div>
              </div>
            </div>
          
          </div>
        </div>
</template>

<script>
import {storage , auth , songsCollection} from "@/includes/firebase"
export default {
    name : 'upload',
    props:['addSong'],
    data(){
        return{
            is_dragover : false,
            uploads : [],
        }
    },
    methods:{
        upload($event){
            this.is_dragover = false;
            console.log($event)
            // convert into array [] and runnig loop   this  files have all the property 
            // and check if file upload via drag and drop or choose button
          const files = $event.dataTransfer
          ?[...$event.dataTransfer.files]
          :[...$event.target.files];

          // here check file type is audio if not then return otherwise procced further
            files.forEach((file)=>{
                if(file.type !== 'audio/mpeg' ){
                    return;
                }
                    // create a refference of storage where we want to store files first is parent refference
                const storageRef = storage.ref();                //music-4c72e.appspot.com
                const songsRef = storageRef.child(`songs/${file.name}`)            ////music-4c72e.appspot.com/songs/example.mp3    =>this is child reffrence of parent folder to manage folder structure
               const task =  songsRef.put(file);                 // this function is upload our file to firebase storage

                // push the upload file into an array and define progress bar percentage
               const uploadIndex= this.uploads.push({
                    task,
                    current_progress : 0,
                    name: file.name,
                    variant : 'bg-blue-400',
                    icon : 'fas fa-spinner fa-spin',
                    text_class: '',

                    
                })-1;


                        //listen the upload event how much data is uploaded and set the progress bar according to data  more on firebase docs
                task.on('state_changed',(snapshot) =>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.uploads[uploadIndex].current_progress = progress;
                }, (error)=>{
                    this.uploads[uploadIndex].variant = 'bg-red-400',
                    this.uploads[uploadIndex].icon = 'fas fa-times'
                    this.uploads[uploadIndex].text_class = 'text-red-400'
                    console.log(error)
                }, async () =>{

                        // set all this properties to firebase database about file we uploaded
                    const song = {
                        uid : auth.currentUser.uid,
                        display_name : auth.currentUser.displayName,
                        original_name : task.snapshot.ref.name,         // username 
                        modified_name : task.snapshot.ref.name,             // if user change the name 
                        genre: '',
                        comment_count : 0,
                    }
                        //  get the song url
                        song.url = await task.snapshot.ref.getDownloadURL();

                        //add song to the data base  and   down below return  refference  but we need snapshow to refelect the value 
                    const songRef =  await songsCollection.add(song)

                    // so here we convert the refference  to the snapshot  with get function it will retunr snapshot
                    const snapShot = await songRef.get()
                    this.addSong(snapShot)

                     this.uploads[uploadIndex].variant = 'bg-green-400',
                    this.uploads[uploadIndex].icon = 'fas fa-check'
                    this.uploads[uploadIndex].text_class = 'text-green-400'
                });


            })
                console.log(files)

            

        },

           

    },
        // if user change the page while uploading the song then network request is cancelled  through this function while this have some issue 
        beforeUnmount() {
            this.uploads.forEach((upload) =>{
                upload.task.cancel();
            })
        }


}
</script>

<style>

</style>