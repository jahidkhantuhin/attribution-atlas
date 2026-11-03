<template>
  <div>
    <AttributionDashboard v-if="demoMode" />
    <template v-else>
      <Admin v-if="userRole === 'admin'" />
      <SuperAdmin v-if="userRole === 'super admin'" />
      <User v-if="userRole === 'user'" />
      <AccountManager v-if="userRole === 'account manager'" />
      <CallScorer v-if="userRole === 'call scorer'" />
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  useContext,
  onBeforeMount,
} from '@nuxtjs/composition-api'
import Admin from '../components/dashboard/admin.vue'
import SuperAdmin from '../components/dashboard/super-admin.vue'
import User from '../components/dashboard/user.vue'
import AccountManager from '../components/dashboard/account-manager.vue'
import CallScorer from '../components/dashboard/call-scorer.vue'
import AttributionDashboard from '../components/dashboard/AttributionDashboard.vue'
import useAxios from '../plugins/useAxios'

export default defineComponent({
  middleware: 'isAuthenticated',
  components: {
    Admin,
    SuperAdmin,
    User,
    AccountManager,
    CallScorer,
    AttributionDashboard,
  },
  setup() {
    const context = useContext()
    const $axios = useAxios()
    const store = context.store
    const demoMode = context.$config.demoMode
    // const userRole = computed(() => {
    //     return context.$auth.user && context.$auth.user.data &&  (context.$auth.user?.data as any).role
    //   })
    const userRole = ref()
    onBeforeMount(async () => {
      if (demoMode) {
        const response = await $axios.get('/user')
        userRole.value = response.data.data.role
        store.dispatch('setUser', { cred: response.data.data })
        store.dispatch('setUserRole', { cred: response.data.data.role })
        store.dispatch('setUserScope', { cred: response.data.data.scope })
        return
      }

      await $axios.get('/user').then((response: any) => {
        userRole.value = response.data.data.role
        store.dispatch('setUser', { cred: response.data.data })
        store.dispatch('setUserRole', { cred: response.data.data.role })
        store.dispatch('setUserScope', { cred: response.data.data.scope })
      })
    })
    return { demoMode, userRole }
  }
})
</script>
