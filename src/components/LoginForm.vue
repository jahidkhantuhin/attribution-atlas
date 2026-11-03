<template>
  <v-form ref="loginForm" v-model="formValid" @submit="formValid && logIn()">
    <v-text-field
      prepend-inner-icon="mdi-email"
      class="custom-label-color mt-n8"
      color="white"
      background-color="rgba(255,255,255,0.1)"
      :placeholder="emailPlaceholder"
      dense
      filled
      rounded
      outlined
      clear-icon="mdi-close-circle"
      clearable
      v-model="email"
      type="email"
      label="E-mail"
      name="email"
      :rules="emailRules"
      @keypress.enter="formValid && logIn()"
    ></v-text-field>
    <v-text-field
      prepend-inner-icon="mdi-lock"
      color="white"
      background-color="rgba(255,255,255,0.1)"
      dense
      filled
      rounded
      outlined
      clear-icon="mdi-close-circle"
      clearable
      v-model="password"
      type="password"
      name="password"
      label="Password"
      :rules="passwordRules"
      @keypress.enter="formValid && logIn()"
    ></v-text-field>
    <v-btn
      color="orange"
      class="mt-2 mb-4"
      :disabled="!formValid || formBusy"
      block
      :loading="formBusy"
      @click="logIn()"
    >
      <v-icon left>mdi-login</v-icon> Login
    </v-btn>
    <div v-if="googleLoginEnabled" class="text-center mb-2">
      Or continue with
    </div>
    <v-row v-if="googleLoginEnabled">
      <v-col>
        <v-btn
          class="mt-2"
          block
          @click="logInWithGoogle()"                                                                                     
        >
          <v-icon color="red" left>mdi-google-plus</v-icon>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
          google
        </v-btn>
      </v-col>
    </v-row>
    <v-btn
      block
      plain
      text
      color="default"
      x-small
      class="mt-6 font-weight-bold"
      :disabled="formBusy"
      @click="showPWReset = !showPWReset"
    >
      Forgot Password?
    </v-btn>
    <PasswordResetModal :show.sync="showPWReset" />
  </v-form>
</template>

<script lang="ts">
import { 
  defineComponent, 
  ref, 
  useRoute, 
  useRouter, 
  // SetupContext, 
  useStore,
  useContext, 
  } from '@nuxtjs/composition-api'
import PasswordResetModal from './PasswordResetModal.vue'
// import SwalMixin, { showToast } from '~/utils/swalMixin'
import useAxios from '../plugins/useAxios'


export default defineComponent({
  components: { PasswordResetModal },
  setup(_props: any) {
    // toast msgs
    // const $swal = SwalMixin((parent as any).$swal as any)

    // const { $axios } = root
    const context = useContext()
    const { $config } = context
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const axios = useAxios()

    // PW reset modal
    const showPWReset = ref(false)

    // we'll use this to i18n text
    // useContext() doesn't work here for some reason
    // const translate = (text: string, params?: any): string =>
    //   (root as any).$t(text, params)

    // form validation model to control UI actions
    const formValid = ref(false)

    const formBusy = ref<boolean>(false)

    // creds
    const email = ref<string>('')
    const password = ref<string>('')

    // email validation rules
    const emailRules = [
      // @TODO: when migrating to vue 3, this needs to be changed to
      // an equivalent method since context.root will be deprecated
      (v: string) => !!v ,
      (v: string) =>
        /.+@.+\..+/.test(v),
    ]

    // password validation
    const passwordRules = [
      (v: string) =>
        !!v,
      (v: string) =>
        (v && v.length >= 8),
    ]

    // clears the validation errors if the form is empty
    // const clearErrorsOnEmptyForm = () => {
    //   if (!email.value && !password.value)
    //     ((context as any).refs.loginForm as any).resetValidation()
    // }

    const logIn = (async  () => {
      if (email.value && password.value && formValid) {
        formBusy.value = true
        try {
        await (context as any).$auth.loginWith('local', { 
          data: {
          email: email.value,
          password: password.value,
          }
         })
           .then((response: any) => {
            router.push((route.value.query as any).redirect || '/')
          })
          .finally(() => {
            formBusy.value = false
          })
         
      } catch (err) {
        console.log(err)
      }
      }
    })



    const logInWithGoogle = (provider: any) => {
        formBusy.value = true
        ;(context as any).$auth
          .loginWith(`google`, { params: { prompt: "select_account" } })
          .then((response: any) => {
            // showToast($swal, {
            //   title: translate(`alert.success.login`),
            // })
            router.push('/login')
          })
          .finally(() => {
            formBusy.value = false
          })
        // window.location.href = `${process.env.baseUrl}/social-redirect`

              // ;(root as any).$auth.authenticate(provider).then((response: any) =>{
              //   // router.push('/social-login')
              //   SocialLogin(provider,response)

              //   }).catch((err: any) => {
              //       console.log({err:err})
              //   })

            }

    const SocialLogin = (provider: any, response: any) => {
            console.log(response)
        axios.get(`/social-login?code=${response.code}`).then((response: any) => {


        }).catch((err: any) => {
            console.log({err:err})
        })
    }

    return {
      emailPlaceholder: `name@${$config.organizationEmailDomain}`,
      googleLoginEnabled: $config.googleLoginEnabled,
      formValid,
      formBusy,
      email,
      password,
      emailRules,
      passwordRules,
      // clearErrorsOnEmptyForm,
      logIn,
      logInWithGoogle,
      showPWReset,
      SocialLogin,
    }
  },
})
</script>
<style lang="scss" scoped>
.v-form {
.v-text-field.custom-label-color.v-label {
  color: white;
  opacity: 1;
}
.v-text-field.custom-label-color input{
  color: white!important;
}
}
</style>
