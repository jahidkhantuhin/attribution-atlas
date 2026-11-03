<template>
  <v-app class="atlas-app">
    <v-navigation-drawer v-model="drawer" app width="248" color="white" class="atlas-drawer">
      <NuxtLink to="/" class="brand-lockup">
        <span class="brand-mark"><v-icon color="white" size="21">mdi-chart-donut-variant</v-icon></span>
        <span class="brand-copy"><strong>Attribution<span>Atlas</span></strong><small>GROWTH INTELLIGENCE</small></span>
      </NuxtLink>
      <v-btn icon class="drawer-close" aria-label="Close navigation" @click="drawer = false">
        <v-icon small>mdi-close</v-icon>
      </v-btn>

      <div class="workspace-label">WORKSPACE</div>
      <v-list nav dense class="nav-list">
        <v-list-item
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          exact
          class="nav-item"
          active-class="nav-item-active"
          @click="closeDrawerOnMobile"
        >
          <v-list-item-icon><v-icon>{{ item.icon }}</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>{{ item.title }}</v-list-item-title></v-list-item-content>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </v-list-item>
      </v-list>

      <div class="drawer-bottom">
        <div class="profile-row">
          <v-avatar size="34" color="#e9efff"><span class="avatar-letters">JT</span></v-avatar>
          <div class="profile-copy"><strong>Jahid Khan Tuhin</strong><small>Workspace admin</small></div>
          <v-icon v-if="!demoMode" small class="logout-icon" @click="logOut">mdi-logout</v-icon>
          <v-icon v-else small color="success">mdi-check-circle</v-icon>
        </div>
      </div>
    </v-navigation-drawer>

    <v-app-bar app flat height="66" class="atlas-appbar">
      <v-app-bar-nav-icon class="mobile-menu" @click.stop="drawer = !drawer" />
      <div class="breadcrumbs">
        <template v-for="(crumb, index) in breadcrumbs">
          <v-icon v-if="index" :key="`separator-${index}`" x-small>mdi-chevron-right</v-icon>
          <NuxtLink
            :key="crumb.to"
            :to="crumb.to"
            :aria-current="index === breadcrumbs.length - 1 ? 'page' : null"
            class="breadcrumb-link"
          >
            {{ crumb.label }}
          </NuxtLink>
        </template>
      </div>
      <v-chip
        v-if="demoMode"
        x-small
        color="green lighten-5"
        text-color="green darken-2"
        class="demo-chip"
      >DEMO MODE</v-chip>
      <v-spacer />
      <v-btn icon class="top-action" aria-label="Search" @click="focusSearch"><v-icon small>mdi-magnify</v-icon></v-btn>
      <v-btn icon class="top-action notification-action" aria-label="Notifications">
        <v-icon small>mdi-bell-outline</v-icon>
        <i class="notification-dot" aria-hidden="true"></i>
      </v-btn>
      <div class="top-divider"></div>
      <button class="top-profile" @click="$router.push('/users')">
        <v-avatar size="32" color="#e9efff"><span class="avatar-letters">JT</span></v-avatar>
        <span class="top-profile-copy"><strong>Jahid Khan Tuhin</strong><small>Admin</small></span>
        <v-icon x-small>mdi-chevron-down</v-icon>
      </button>
    </v-app-bar>

    <v-main class="atlas-main">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, useContext, useRoute, useRouter } from '@nuxtjs/composition-api'
import useAxios from '../plugins/useAxios'

export default defineComponent({
  setup() {
    const context = useContext()
    const route = useRoute()
    const router = useRouter()
    const axios = useAxios()
    let isDesktop = process.client && window.innerWidth > 960
    const drawer = ref(isDesktop)
    const syncDrawerToViewport = () => {
      const desktop = window.innerWidth > 960
      if (desktop !== isDesktop) drawer.value = desktop
      isDesktop = desktop
    }
    const demoMode = context.$config.demoMode
    const items = [
      { icon: 'mdi-view-dashboard-outline', title: 'Overview', to: '/' },
      { icon: 'mdi-account-group-outline', title: 'Clients', to: '/clients' },
      { icon: 'mdi-chart-timeline-variant', title: 'Call insights', to: '/calls', badge: 'NEW' },
      { icon: 'mdi-account-multiple-outline', title: 'Team', to: '/users' },
    ]
    const pageName = computed(() => {
      const path = route.value.path
      if (path.startsWith('/clients')) return path.includes('/locations') ? 'Location details' : path.includes('/add') ? 'Add a client' : path.includes('/edit') ? 'Edit client' : path !== '/clients' ? 'Client overview' : 'Clients'
      if (path.startsWith('/calls')) return path === '/calls' ? 'Call insights' : 'Call details'
      if (path.startsWith('/users')) return path.includes('/add') ? 'Invite teammate' : path.includes('/edit') ? 'Edit teammate' : 'Team'
      if (path.startsWith('/reset-password')) return 'Reset password'
      return 'Overview'
    })
    const breadcrumbs = computed(() => {
      const path = route.value.path
      const trail = [{ label: 'Workspace', to: '/' }]
      if (path.startsWith('/clients')) {
        trail.push({ label: 'Clients', to: '/clients' })
      } else if (path.startsWith('/calls')) {
        trail.push({ label: 'Call insights', to: '/calls' })
      } else if (path.startsWith('/users')) {
        trail.push({ label: 'Team', to: '/users' })
      }
      if (trail[trail.length - 1].to !== path) {
        trail.push({ label: pageName.value, to: path })
      }
      return trail
    })
    const logOut = async () => {
      await axios.post('logout', {}, { withCredentials: true })
      router.push('/login')
    }
    const focusSearch = () => {
      if (route.value.path.startsWith('/clients')) router.push('/clients?search=')
      else if (route.value.path.startsWith('/users')) router.push('/users?search=')
      else router.push('/clients')
    }
    const closeDrawerOnMobile = () => {
      if (window.innerWidth <= 960) drawer.value = false
    }
    onMounted(() => {
      syncDrawerToViewport()
      window.addEventListener('resize', syncDrawerToViewport)
    })
    onUnmounted(() => window.removeEventListener('resize', syncDrawerToViewport))
    return { breadcrumbs, closeDrawerOnMobile, demoMode, drawer, focusSearch, items, logOut, pageName }
  },
})
</script>

<style lang="scss">
html, body, #__nuxt, #__layout { min-height: 100%; background: #f5f7fb; }
.atlas-app { background: #f5f7fb !important; color: #17233d; }
.atlas-drawer { border-right: 1px solid #e8edf5 !important; }
.brand-lockup { display: flex; align-items: center; gap: 11px; height: 82px; margin: 0 20px; border-bottom: 1px solid #eff2f7; color: #17233d !important; text-decoration: none; }
.brand-mark { display: grid; width: 39px; height: 39px; place-items: center; border-radius: 12px; background: linear-gradient(145deg, #5680ff, #2e58d7); box-shadow: 0 6px 12px #4776f52b; }
.brand-copy { display: flex; flex-direction: column; }.brand-copy strong { font-size: 15px; letter-spacing: -.5px; }.brand-copy strong span { color: #4776f5; }.brand-copy small { margin-top: 3px; color: #94a0b2; font-size: 8px; font-weight: 750; letter-spacing: 1.15px; }
.drawer-close { display: none; }.workspace-label { margin: 24px 24px 10px; color: #a0a9b8; font-size: 9px; font-weight: 800; letter-spacing: 1.2px; }
.nav-list { padding: 0 12px !important; }.nav-item { min-height: 44px !important; margin: 3px 0; border-radius: 9px !important; color: #69758b !important; }.nav-item .v-icon { color: #8894a8 !important; }.nav-item .v-list-item__title { font-size: 12px; font-weight: 600; }.nav-item-active { color: #315fe5 !important; background: #edf2ff !important; }.nav-item-active .v-icon { color: #315fe5 !important; }.nav-badge { margin-left: auto; padding: 3px 5px; border-radius: 5px; color: #0c9d73; background: #e4f7f0; font-size: 7px; font-weight: 800; letter-spacing: .45px; }
.drawer-bottom { position: absolute; right: 14px; bottom: 12px; left: 14px; }
.profile-row { display: flex; align-items: center; gap: 9px; margin: 15px 3px 0; padding: 12px 4px 2px; border-top: 1px solid #edf0f5; }.avatar-letters { color: #4069db; font-size: 11px; font-weight: 800; }.profile-copy, .top-profile-copy { display: flex; flex: 1; flex-direction: column; }.profile-copy strong, .top-profile-copy strong { color: #35425b; font-size: 10px; }.profile-copy small, .top-profile-copy small { margin-top: 3px; color: #929daf; font-size: 9px; }.logout-icon { cursor: pointer; }
.atlas-appbar { border-bottom: 1px solid #e9edf4 !important; background: #fff !important; }.atlas-appbar .v-toolbar__content { padding: 0 27px; }.breadcrumbs { display: flex; align-items: center; gap: 9px; color: #98a2b3; font-size: 11px; }.breadcrumb-link { color: #8994a8 !important; text-decoration: none; white-space: nowrap; }.breadcrumb-link[aria-current="page"] { color: #34425c !important; font-weight: 700; }.breadcrumb-link:hover { color: #315fe5 !important; }.top-action { margin-left: 4px; color: #718098 !important; }.notification-action { position: relative; overflow: visible; }.notification-action::before { display: none; }.notification-action .notification-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border: 1px solid #fff; border-radius: 50%; background: #f27964; pointer-events: none; }.top-divider { height: 27px; margin: 0 17px; border-left: 1px solid #e8edf4; }.top-profile { display: flex; align-items: center; gap: 8px; padding: 0; border: 0; background: transparent; text-align: left; cursor: pointer; }.top-profile-copy { flex: initial; }.top-profile > .v-icon { margin-left: 3px; color: #8e99ac; }.atlas-main { min-width: 0; overflow-x: hidden; background: #f5f7fb; }.atlas-main .v-main__wrap { min-width: 0; max-width: 100%; }
.atlas-main .users-table { max-width: 1440px; margin: 0 auto !important; padding: 24px 32px 42px; }
.atlas-main .users-table > .col:first-child { display: none; }
.atlas-main .users-table > .col:nth-child(2) { flex: 1 1 100%; max-width: 100%; padding: 0; }
.atlas-main .users-table > .col:nth-child(2) > .v-card:first-child { display: none; }
.atlas-main .users-table > .col:nth-child(2) > .v-card:last-child { overflow: visible; border: 0 !important; background: transparent !important; box-shadow: none !important; }
.atlas-main .users-table .v-sheet--offset { position: static !important; top: auto !important; max-width: 100% !important; border: 1px solid #e8edf5 !important; border-bottom: 0 !important; border-radius: 14px 14px 0 0 !important; background: #fff !important; box-shadow: none !important; }
.atlas-main .users-table .v-expansion-panels, .atlas-main .users-table .v-expansion-panel { border-radius: 14px 14px 0 0 !important; background: #fff !important; box-shadow: none !important; }
.atlas-main .users-table .v-expansion-panel-header { min-height: 60px; padding: 14px 20px; background: #fff !important; }
.atlas-main .users-table .v-expansion-panel-header.orange, .atlas-main .users-table .v-expansion-panel-header .v-toolbar, .atlas-main .users-table .v-expansion-panel-header .v-toolbar.orange { background: #fff !important; color: #293650 !important; }
.atlas-main .users-table .v-toolbar__title { color: #293650 !important; font-size: 15px; font-weight: 750; }
.atlas-main .users-table .v-expansion-panel-content, .atlas-main .users-table .v-expansion-panel-content__wrap { background: #fff !important; }
.atlas-main .users-table .v-data-table { overflow: visible; border: 1px solid #e8edf5 !important; border-top: 0 !important; border-radius: 0 0 14px 14px !important; background: #fff !important; box-shadow: none !important; }
.atlas-main .users-table .v-data-table tbody tr { background: #fff !important; }
.atlas-main .users-table .v-data-table-header th { height: 44px; color: #7d899e !important; background: #f8faff; font-size: 10px !important; font-weight: 750 !important; letter-spacing: .45px; text-transform: uppercase; }
.atlas-main .users-table .v-data-table tbody tr:hover { background: #f8faff !important; }
.atlas-main .users-table .v-data-table a { color: #315fe5 !important; text-decoration: none; }
.atlas-main .users-table .v-expansion-panel-content > .v-expansion-panel-content__wrap > .row > .col:first-child { display: none; }
.atlas-main .users-table .v-expansion-panel-content > .v-expansion-panel-content__wrap > .row > .col:nth-child(2) { flex: 0 0 100%; max-width: 100%; }
.atlas-main .users-table .v-expansion-panel-content .v-form .v-card__text .row > [class*="col-"] { min-width: 0; }
.atlas-main .v-btn.orange { border-color: #4776f5 !important; background-color: #4776f5 !important; color: #fff !important; }
.atlas-main .v-icon.orange--text { color: #4776f5 !important; }
.atlas-main .form-title { margin: 0 0 16px; border: 1px solid #e8edf5; border-radius: 12px; background: linear-gradient(110deg, #f3f6ff, #fff); }
.atlas-main .form-title .v-card__title { color: #293650; font-size: 19px; font-weight: 750; }
.mobile-menu { display: none; }
@media (max-width: 960px) { .atlas-drawer { z-index: 8; }.drawer-close { position: absolute !important; top: 22px; right: 10px; display: inline-flex; }.mobile-menu { display: inline-flex; }.atlas-appbar .v-toolbar__content { padding: 0 14px; }.breadcrumbs { margin-left: 8px; }.atlas-main .users-table { padding: 18px 16px 32px; }.atlas-main .users-table .v-data-table tbody tr { border-bottom: 1px solid #edf0f5; }.atlas-main .users-table .v-data-table tbody td { height: auto !important; min-height: 36px; padding: 8px 14px !important; border: 0 !important; } }
@media (max-width: 600px) { .top-profile-copy, .top-profile > .v-icon, .top-divider { display: none; }.top-profile { margin-left: 4px; }.breadcrumbs { min-width: 0; gap: 5px; overflow: hidden; font-size: 10px; }.breadcrumb-link { overflow: hidden; text-overflow: ellipsis; }.demo-chip { margin-left: 4px; }.atlas-appbar .v-toolbar__content { padding: 0 8px; }.atlas-main .users-table { padding: 14px 10px 24px; }.atlas-main .users-table .v-sheet--offset { border-radius: 12px 12px 0 0 !important; }.atlas-main .users-table .v-expansion-panel-header { min-height: 54px; padding: 6px 12px; }.atlas-main .users-table .v-toolbar__content { padding: 0 8px !important; }.atlas-main .users-table .v-toolbar__title { overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }.atlas-main .users-table .v-data-table { border-radius: 0 0 12px 12px !important; }.atlas-main .users-table .v-data-table__mobile-table-row { display: block; margin: 10px; overflow: hidden; border: 1px solid #e8edf5; border-radius: 11px; background: #fff; box-shadow: 0 2px 7px #23385a0b; }.atlas-main .users-table .v-data-table__mobile-table-row td { min-height: 38px; padding: 8px 11px !important; border-bottom: 1px solid #f0f2f6 !important; font-size: 12px; }.atlas-main .users-table .v-data-table__mobile-table-row td:first-child { background: #f8faff; }.atlas-main .users-table .v-data-table__mobile-table-row td:last-child { border-bottom: 0 !important; }.atlas-main .users-table .v-expansion-panel-content .v-form .v-card__text .row > [class*="col-"] { flex: 0 0 100% !important; max-width: 100% !important; }.atlas-main .v-form > .row > .col-6 { flex: 0 0 100%; max-width: 100%; }.atlas-main .v-form .v-input, .atlas-main .v-form .v-input__control, .atlas-main .v-form .v-input__slot { min-width: 0; max-width: 100%; }.atlas-main .v-card { max-width: 100%; }.atlas-main .form-title { width: calc(100% - 24px) !important; }.atlas-main .v-card-text { padding: 14px; } }
@media (max-width: 600px) {
  .atlas-main .users-table .v-expansion-panel-content .v-form .v-card__text .row > [class*="col-"] {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }
}
</style>
