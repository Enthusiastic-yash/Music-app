<template>
  <div>
    <div
      class="text-white text-center font-bold p-4 mb-4"
      v-if="login_show_alert"
      :class="login_alert_variant"
    >
      {{ login_alert_msg }}
    </div>
        <ValidationObserver v-slot="{ handleSubmit }">

        <form @submit.prevent="handleSubmit(loginSubmit)" >
      <!-- Email -->
      <ValidationProvider class="mb-3" name="email" rules="required|email" v-slot="{ errors }">
        <label class="inline-block mb-2">Email</label>
        <input type="email" v-model="loginForm.email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
        />
        <div>
          <p class="mt-2 peer-invalid text-pink-600 text-sm">{{errors[0]}} </p>
        </div>
      </ValidationProvider>
      <!-- Password -->
      <ValidationProvider class="mb-3" name="password" rules="required" v-slot="{ errors }">
        <label class="inline-block mb-2">Password</label>
        <input type="password" v-model="loginForm.password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />
        <div>
          <p class="mt-2 peer-invalid text-pink-600 text-sm">{{errors[0]}}</p>
        </div>
      </ValidationProvider>
      <button
        type="submit"
        :disabled="login_in_submission"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      >
        Submit
      </button>
          </form>

        </ValidationObserver>
    
  </div>
</template>
<script>
export default {
  name: "loginForm",
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: "bg-blue-500",
      login_alert_msg: "Please Wait! we are logging you in. ",
    };
  },

  methods: {
    async loginSubmit() {
      (this.login_in_submission = true),
        (this.login_show_alert = true),
        (this.login_alert_variant = "bg-blue-500"),
        (this.login_alert_msg = "Please Wait! we are logging you in. ");

      // send login credentials  like email and password to vuex store
      try{
        await  this.$store.dispatch('login', this.loginForm)

      }catch(error){

          this. login_in_submission = false;
          this. login_alert_variant =  'bg-red-500';
          this.login_alert_msg = 'Invalid login details';
          return;

      }

      this.login_alert_variant = "bg-green-500";
      this.login_alert_msg = "Success! you are now logged in. ";
      window.location.reload();
    },
  },
};
</script>
