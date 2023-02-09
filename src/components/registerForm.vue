<template>
  <div>
    <div>
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="register_show_alert"
        :class="register_alert_variant"
      >
        {{ register_alert_msg }}
      </div>
    </div>
        <ValidationObserver v-slot="{ handleSubmit }">

        <form @submit.prevent="handleSubmit(onSubmit)">
      <!-- Name -->
      <ValidationProvider class="mb-3" name="Name" rules="required|alpha" v-slot="{ errors }">
        <label class="inline-block mb-2">Name</label>
        <input
          type="text"
          v-model="user.name"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Name"
        />
        <div>
          <p class="mt-2 peer-invalid text-pink-600 text-sm">{{ errors[0] }}</p>
        </div>
      </ValidationProvider>
      <!-- Email -->
      <ValidationProvider class="mb-3" name="E-mail" rules="required|email" v-slot="{ errors }">
        <label class="inline-block mb-2">Email</label>
        <input type="email"
          class="block border-2 border-rose-600 w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
          v-model="user.email"
        />

        <div>
          <p class="mt-2 peer-invalid text-pink-600 text-sm">{{ errors[0] }}</p>
        </div>
      </ValidationProvider>
      <!-- Age -->
      <ValidationProvider class="mb-3" name="age" rules="required|min_value:18 |max_value:120  " v-slot="{ errors }">
        <label class="inline-block mb-2">Age</label>
        <input
          type="number"
          v-model="user.age"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        />
        <div>
          <p class="mt-2 peer-invalid text-pink-600 text-sm">{{errors[0]}}</p>
        </div>
      </ValidationProvider>
      <!-- Password -->
      <ValidationProvider class="mb-3" name="password" rules="required|min:6|max:12|confirmed:confirmation" v-slot="{ errors }">
        <label class="inline-block mb-2">Password</label>
        <input type="password"  v-model="user.password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />

        <div>
          <p class="mt-2 peer-invalid text-pink-600 text-sm">{{errors[0]}} </p>
        </div>
      </ValidationProvider>
      <!-- Confirm Password -->
      <ValidationProvider class="mb-3" name="confirm_password" vid="confirmation" v-slot="{ errors }">
        <label class="inline-block mb-2">Confirm Password</label>
        <input type="password" v-model="user.confirm_password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Confirm Password"
        />

        <div>
          <p class="mt-2 peer-invalid text-pink-600 text-sm">{{errors[0]}}</p>
        </div>
      </ValidationProvider>

      <!-- Country -->
      <ValidationProvider class="mb-3" name="country" rule="required" v-slot="{ errors }">
        <label class="inline-block mb-2">Country</label>
        <select v-model="user.country"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="USA">USA</option>
          <option value="India">India</option>
          <option value="Germany">Germany</option>
        </select>
        <div>
          <p class="mt-2 peer-invalid text-pink-600 text-sm">{{errors[0]}}</p>
        </div>
      </ValidationProvider>
      <!-- TOS -->
      <ValidationProvider class="mb-3 pl-6" name="checkbox" rules="required" v-slot="{ errors }">
        <label class="inline-block">Accept terms of service</label>
        <input  type="checkbox"  v-model="user.tos"  class="w-4 h-4 float-left  mt-1 rounded" />

        <div>
          <p class="mt-2 peer-invalid text-pink-600 text-sm">{{errors[0]}}</p>
        </div>
      </ValidationProvider>

      <!-- submit button -->

      <button type="submit"  :disabled="register_in_submission"
       class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700" >
        Submit
      </button>
    </form>


        </ValidationObserver >
   
  </div>
</template>

<script>
export default {
  name: "registerForm",
  data() {
    return {
      user: {
        tab: "login",
        name: "",
        email: "",
        age: null,
        password: "",
        confirm_password: "",
        country: "USA",
        tos: false,
      },

      register_in_submission: false,
      register_show_alert: false,
      register_alert_variant: "bg-blue-500",
      register_alert_msg: "congratulations your account has been created ",
    };
  },

  methods: {
    async onSubmit() {
      this.register_in_submission = true,
        this.register_show_alert = true,
        this.register_alert_variant = "bg-blue-500",
        this.register_alert_msg = "Please wait! your account is being created ";


      // create user and collecting other data in store  and send payload as a  data
      try{
       await this.$store.dispatch('register', this.user)
       
       }
       catch (error){
          this.register_in_submission = false;
          this.register_alert_variant = 'bg-red-500';
          this.register_alert_msg = 'An unexpected error occured Please try again later ';
          console.log(error)
          return;
          }
     
          this.register_alert_variant = "bg-green-500",
        this.register_alert_msg = "congratulations your account has been created";
         window.location.reload();
    },
  },
};
</script>
