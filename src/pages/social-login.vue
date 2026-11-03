<template>
  <v-container id="loginPage" fluid class="fill-height">
    <v-row no-gutters>
      <v-col lg="3" xl="2" md="12" offset-lg="1">
        <v-expand-transition>
          <v-card class="text-center" v-if="fetchingUser">
            <v-card-text>
              <v-progress-circular :size="50" color="primary" indeterminate>
              </v-progress-circular>
            </v-card-text>
            <v-card-text class="text-center">Checking User info</v-card-text>
          </v-card>
        </v-expand-transition>
        <v-expand-transition>
          <v-card v-show="showForm" elevation="10">
            <v-card-title>Welcome to {{ organizationName }}</v-card-title>

            <v-card-text>
              <LoginForm 
              @clicked="onLoginChange"
              ></LoginForm>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  ref,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'

import LoginForm from '@/components/LoginForm.vue'
import { useContext } from '@nuxtjs/composition-api'
import useAxios from '~/plugins/useAxios'

export default defineComponent({
  components: { LoginForm },
  middleware: 'redirectToHomeIfAlreadyLoggedIn',
  auth: 'guest',
  layout: 'blank',
  setup(_props) {
    const { $auth, $config } = useContext()
    const $axios = useAxios()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const showForm = ref(false)

    const fetchingUser = ref(true)
    const googleCred = router.currentRoute.query

    const onClientChange = (Cred) => {
      googleCred.value = Cred
    }


    onBeforeMount(async () => {
      await $axios
        .get(
          '/social-login-direct',
          {params: { 
            'code': `${googleCred.code}`,
            }})
        .then((response) => {
          $auth.setUserToken(true);
          $auth.setUser(response.data.data.user);
          $auth.strategy.token.set(response.data.data.token);
          store.dispatch('setGoogle', {
              cred: response.data.data.token,
            })
          router.push((route.value.query).redirect || "/");
          // $auth
          //   .setUserToken(true)
          //   .then((resp) => {
          //     console.log(resp)
          //     if (resp) {
          //       router.push(route.value.query.redirect || '/')
          //     }
          //   })
          //   .finally(() => {
          //     fetchingUser.value = false
          //     showForm.value = true
          //   })
        })
      console.log('CODE', googleCred)
    })
    // onMounted(async () => {
    //   await $axios
    //     .get('/social-login-redirect', {
    //       params: {
    //         'code': `${googleCred.value.code}`,
    //       },
    //     })
    //     .then(() => {
    //       $auth
    //         .setUserToken(true)
    //         .then((resp) => {
    //           console.log(resp)
    //           if (resp) {
    //             router.push(route.value.query.redirect || '/')
    //           }
    //         })
    //         .finally(() => {
    //           fetchingUser.value = false
    //           showForm.value = true
    //         })
    //     })
    // })

    return {
      showForm,
      fetchingUser,
      googleCred,
      onClientChange,
      organizationName: $config.organizationName,
    }
  },
  head: {
    title: `Login`,
  },
})
</script>
<style lang="scss" scoped>
#loginPage {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: background-image 0.2s ease-in-out;
  height: 100vh;
}
</style>
