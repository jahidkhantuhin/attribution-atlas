<template>
  <v-row 
    :class="{
        'my-6': true,
        'users-table': true,
      }"
  >
    <v-col lg="1" xl="1" md="1">
    </v-col>
    <v-col lg="10" xl="10" md="10" sm="12">
      <v-card 
        class="pt-8 pb-8 mb-12"
        max-width="344"
        height="140"
        >
        <v-row>
          <v-col>
            <v-sheet
              class="v-sheet--charts mx-auto "
              color="orange"
              elevation="12"
              max-width="calc(100% - 52px)"
              height="100px"
            >
            <v-icon style="padding-left: 40px; padding-top: 40px;" color="white">mdi-account-group</v-icon>
            </v-sheet>
          </v-col>
          <v-col>Total users</v-col>
        </v-row>
        <v-row class="mt-n12">
          <v-col>
            <v-icon class="pl-6">mdi-clock</v-icon>
            <span><small>Last updated at</small></span>
          </v-col>
        </v-row>
      </v-card>
      <v-card>
        <v-sheet
          class="v-sheet--offset mx-auto"
          color="cyan"
          elevation="12"
          max-width="calc(100% - 32px)"
        >
        
        <v-expansion-panels accordion>
          <v-expansion-panel
          >
            <v-expansion-panel-header disable-icon-rotate color="orange">
              <v-toolbar flat color="orange">
                <v-toolbar-title>Users</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="" nuxt to="/users/add">
                  <v-icon left>mdi-account-plus</v-icon>
                </v-btn>
              </v-toolbar>
              <template v-slot:actions>
                <v-icon color="teal">
                  mdi-filter
                </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
            <!-- Filters -->
            <v-row>
              <v-col lg="1" xl="" md="1">
              </v-col>
              <v-col lg="10" xl="12" md="10" sm="12">
                  <v-form @submit.prevent="">
                    <v-card-title>
                      <v-icon left>mdi-filter</v-icon>
                      Filter
                    </v-card-title>
                    <v-card-text>
                      
                      <v-row>
                        <v-col cols="8" sm="6" md="4" lg="3">
                          <!-- User type -->
                          <v-select
                            :items="roles"
                            :item-text="(item) => item.name"
                            :item-value="(item) => item.name"
                            :loading="loadingRoles"
                            label="Type"
                            v-model="filters.role"
                            clearable
                          ></v-select>
                        </v-col>
                        <v-col cols="8" sm="6" md="4" lg="3">
                          <!-- Search Term -->
                          <v-text-field
                            label="Search"
                            v-model="filters.search"
                            clearable
                            maxlength="250"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="8" sm="6" md="4" lg="3">
                          <!-- Active -->
                          <v-select
                            v-model="filters.status"
                            :items="activeOptions"
                            clearable
                            label="User Status"
                          ></v-select>
                        </v-col>
                        <v-col cols="8" sm="6" md="4" lg="3">
                          <!-- Order -->
                          <v-select
                            label="Order By"
                            :items="sortByOptions"
                            v-model="filters.sort_by"
                          ></v-select>
                        </v-col>
                        <v-col cols="8" sm="6" md="4" lg="3">
                          <v-select
                            label="Order"
                            :items="sortingOptions"
                            v-model="filters.sorting"
                          ></v-select>
                        </v-col>
                      </v-row> 
                    </v-card-text>
                    <v-card-actions class="">
                      <v-spacer></v-spacer>
                      <v-btn color="orange" @click="handleFilterApply">
                        <v-icon left>mdi-check</v-icon>
                      </v-btn>
                      <v-btn link nuxt to="/users">
                        <v-icon left>mdi-cancel</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
              </v-col>
            </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-sheet>
        <!-- users list -->
        <v-data-table
          :loading="busy"
          :options.sync="tableOptions"
          :items="users"
          :headers="tableHeaders"
          :items-per-page="itemsPerPage"
          :page="page"
          :footer-props="{
            'items-per-page-options': itemsPerPageOptions,
          }"
          :server-items-length="pagination.total"
          @pagination="handlePaginationChange"
          class="elevation-1 transparent"
        >
          <template #item.fullname="{ item }" class="ml-8">
            <span class="user-name">{{ item.full_name }}</span>
          </template>
          <template #item.role="{ item }">
            {{ item.role }}
          </template>
          <template #item.actions="{ item }">
            <!-- <v-menu
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn small color="primary" dark v-bind="attrs" v-on="on">
                  Actions
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  :to="`/users/${item.id}/edit`"
                  title="Edit User"
                >
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item
                  title="Delete User"
                  @click="handleDeleteUser(item.id)"
                >
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu> -->
                <v-btn 
                  class="ml-n6"
                  small
                  plain 
                  color="orange" 
                  dark
                  @click="$router.push(`/users/${item.id}/edit`)"
                  >
                  <v-icon>mdi-pen</v-icon>
                  <!-- Actions -->
                </v-btn>
                <v-btn 
                  small
                  plain 
                  color="grey" 
                  dark
                  :disabled="item.id === 1"
                  @click="handleDeleteUser(item.id)"
                  >
                  <v-icon>mdi-delete</v-icon>
                  <!-- Actions -->
                </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeMount,
  ref,
  useRoute,
  useRouter,
  useStore,
  watch,
  useContext,
} from '@nuxtjs/composition-api'
import { IBreadcrumbs } from '@/store'

import useUsers from '../../services/useUsers'
import { Dictionary } from '../../node_modules/@types/lodash'
import isUserAllowedToEdit from '../../utils/isUserAllowedToEdit'
import useAxios from '../../plugins/useAxios'
// import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'

// we are naming these based on the API requirements
interface IUsersFilter {
  role?: number | null
  search?: string | null
  status?: string | null
  sort_by?: string
  sorting: 'asc' | 'desc'
}

interface IFilterSelectOption {
  text: string
  value: string | number | boolean | null | Array<string | number | boolean>
}

export default defineComponent({
  middleware: 'isAuthenticated',
  setup(props) {
    const itemsPerPageOptions = ref([20, 50, 100, 500])
    const itemsPerPage = ref(itemsPerPageOptions.value[0])
    const page = ref(1)
    const context = useContext()
    const $axios = useAxios()
    const store = context.store
    const router = useRouter()
    const route = useRoute()
    const usersApi = useUsers()
    const busy = ref(false)
    // const $swal2 = swalMixin((parent as any).$swal as any)

    // set the page breadcrumbs
    const breadcrumbs: IBreadcrumbs[] = [
      {
        text: `Dashboard`,
        to: `/`,
      },
      {
        text: `Users`,
        to: `/users`,
      },
    ]

    const pageTitle = `Users`

    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })

    // filters
    const defaultFilterValus: IUsersFilter = {
      role: null,
      search: null,
      status: 'active',
      sort_by: `first_name`,
      sorting: 'asc',
    }
    const filters = ref<IUsersFilter>(defaultFilterValus)

    const activeOptions: IFilterSelectOption[] = [
      {
        text: `Any`,
        value: null,
      },
      {
        text: `Active Only`,
        value: `active`,
      },
      {
        text: `Disabled Only`,
        value: `inactive`,
      },
    ]

    const sortByOptions: IFilterSelectOption[] = [
      {
        text: `Name`,
        value: `first_name`,
      },
      {
        text: `Active Status`,
        value: `status`,
      },
    ]

    const sortingOptions: IFilterSelectOption[] = [
      { text: `Ascending`, value: `asc` },
      { text: `Descending`, value: `desc` },
    ]

    const handleFilterApply = () => {
      router.push({
        path: router.currentRoute.path,
        query: {
          page: page.value.toString(),
          itemsPerPage: itemsPerPage.value.toString(),
          ...(filters.value as Dictionary<
            string | (string | null)[] | null | undefined
          >),
        },
      })
    }

    // users
    const users = ref([])
    const pagination = ref({
      total: 0,
    })

    const getUsers = () => {
      if (busy.value === false) {
        // first, transform the sort_by filter to use with the
        // axios request
        const appliedFilters = {
          ...filters.value,
          sort_by:
            filters.value.sort_by + `:` + filters.value.sorting.toLowerCase(),
        }
        busy.value = true
        usersApi
          .list({
            ...appliedFilters,
            limit: itemsPerPage.value,
            page: page.value,
          })
          .then((response) => {
            users.value = response.data.data.result
            pagination.value = response.data.data.pagination
          })
          .catch((error) => {
            console.error('Unable to load users', error)
          })
          .finally(() => (busy.value = false))
      }
    }

    // roles
    const roles = ref([])
    const loadingRoles = ref(false)

    const getRoles = () => {
      loadingRoles.value = true
      usersApi
        .getRoles()
        .then(
          ({ data }) =>
            (roles.value = data.data.filter(
              // exclude super admin
              (item: { name: string | string[] }) =>
                !item.name.includes('super admin')
            ))
        )
        .catch(({ response }) => console.log(`getRoles error`, response))
        .finally(() => (loadingRoles.value = false))
    }

    // data table
    const tableHeaders = ref([
      {
        text: `Name`,
        align: `start`,
        sortable: true,
        value: `fullname`, // @TODO: change to fullname
      },
      {
        text: `Role`,
        align: `start`,
        sortable: false,
        value: `role`,
      },
      {
        text: `Actions`,
        align: `middle`,
        sortable: false,
        value: `actions`,
      },
    ])

    const tableOptions = ref<any>({})

    watch(
      tableOptions,
      () => {
        const sortBy = (tableOptions.value.sortBy || [])[0]
        if (!sortBy) return
        filters.value.sort_by = sortBy === 'fullname' ? 'first_name' : sortBy
        filters.value.sorting = (tableOptions.value.sortDesc || [])[0]
          ? 'desc'
          : 'asc'

        handleFilterApply()
      },
      { deep: true }
    )

    const handleDeleteUser = async (id: number) => {
      try {
          await usersApi.deleteUser(id)
          getUsers()
      } catch (error) {
        console.error('Unable to delete user', error)
      }

    }

    const handlePaginationChange = (e: any) => {
      itemsPerPage.value = e.itemsPerPage === -1 ? 500 : e.itemsPerPage
      page.value = e.page
      handleFilterApply()
      getUsers()
    }

    const loadFiltersFromURL = () => {
      const query = route.value.query
      if (query.page) {
        page.value = +query.page
        delete query['page']
      } else {
        page.value = 1
      }
      if (query.itemsPerPage) {
        itemsPerPage.value = +query.itemsPerPage
        delete query['itemsPerPage']
      } else {
        itemsPerPage.value = 20
      }
      filters.value = { ...defaultFilterValus, ...query }
    }

    // others
    watch(route, () => {
      loadFiltersFromURL()
      getUsers()
    })

    onBeforeMount(async () => {
      loadFiltersFromURL()
      await $axios
        .get('/user')
        .then((response: any) => {
            store.dispatch('setUser', {
              cred: response.data.data,
            })
            store.dispatch('setUserRole', {
              cred: response.data.data.role,
            })
            store.dispatch('setUserScope', {
              cred: response.data.data.scope,
            })
          })
    })

    onMounted(() => {
      getUsers()
      getRoles()
    })

    return {
      isUserAllowedToEdit,
      filters,
      activeOptions,
      sortByOptions,
      sortingOptions,
      handleFilterApply,
      roles,
      loadingRoles,
      users,
      pagination,
      busy,
      tableHeaders,
      itemsPerPage,
      itemsPerPageOptions,
      tableOptions,
      handleDeleteUser,
      handlePaginationChange,
      page,
    }
  },
  head: {
    title: 'Users',
  },
})
</script>

<style scoped lang="scss">
.user-name {
  /* position: relative;
  top: -6px;
  left: 5px; */
}
.v-sheet--offset {
    top: -24px;
    position: relative;
}
.v-sheet--charts {
    top: -54px;
    position: relative;
}
.users-table .v-data-table {
  padding-left: 40px;
}
</style>
