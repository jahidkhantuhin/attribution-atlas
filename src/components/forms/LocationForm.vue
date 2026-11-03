<template>
  <div>
    <v-card v-if="(isAllowedToEdit)" elevation="0">
      <v-sheet class="form-title mx-auto" max-width="calc(100% - 32px)">
        <v-card-title>{{ isEditing ? 'Edit location' : 'New location' }}</v-card-title>
      </v-sheet>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-card-text>
        <h3>General Info</h3>
      </v-card-text>
      <v-card-text>
        <v-row class="mt-n10">
          <v-col cols="12" md="6">
            <v-text-field
            dense
                filled
                rounded
              label="Name *"
              clearable
              v-model="data.name"
              :rules="rules.name"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
            dense
                filled
                rounded
              label="Address *"
              clearable
              v-model="data.address"
              :rules="rules.address"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="City"
              clearable
              v-model="data.city"
              :rules="rules.city"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="State"
              clearable
              v-model="data.state"
              :rules="rules.state"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="Zip Code *"
              clearable
              v-model="data.zip"
              :rules="rules.zipcode"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="Location Website *"
              clearable
              v-model="data.website"
              :rules="rules.website"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="Adwords Budget"
              clearable
              v-model="data.adwords_budget"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="Facebook Budget"
              clearable
              v-model="data.facebook_budget"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="Monthly Fee"
              clearable
              v-model="data.monthly_fee"
              :rules="rules.monthly_fee"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
                dense
                filled
                rounded
                :items="[{text: 'Paying', value: 'paying'},
                {text: 'Trial', value: 'trial'},
                {text: 'Expired', value: 'expired'},
                {text: 'Quitting', value: 'quitting'}]"
                placeholder="Status"
                item-value="value"
                item-text="text"
                v-model="data['status']"
                :rules="rules.status"
                
              >
              </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="mt-n6">
        <h3>Reporting</h3>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" class="mt-n10">
            <v-text-field
            dense
                filled
                rounded
              label="Apex chat ID"
              clearable
              v-model="data.apexchat_id"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n10" v-if="!isEditing">
            <v-text-field
            dense
                filled
                rounded
              label="Marchex ID *"
              clearable
              v-model="data.account_id"
              :rules="rules.account_id"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="Reporting Email Address *"
              clearable
              v-model="data.reporting_mail"
              :rules="rules.reporting_mail"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="Facebook ID"
              clearable
              v-model="data.facebook_id"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
            dense
                filled
                rounded
              label="Adwords ID"
              clearable
              v-model="data.adwords_id"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :color="'normal'"
          :disabled="loading"
          @click="$emit('cancel')"
          >
          <v-icon left>mdi-cancel</v-icon>
          <!-- Cancel -->
          </v-btn
        >
        <v-btn
          :disabled="loading"
          :loading="loading"
          :color="'orange'"
          @click="submit"
          >
          <!-- {{ isEditing ? 'Update' : 'Create' }} -->
          <v-icon left>mdi-check</v-icon>
          </v-btn
        >
      </v-card-actions>
     </v-row>
     </v-form>
     </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  useRoute,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'
import useApi from '../../services/useApi'
import useUsers from '../../services/useClientLocations'
import validateStrongPassword from '../../shared/ValidateStrongPassword'
import { ADMIN_ROLE, SUPER_ADMIN_ROLE } from '../../utils/UserEnums'
import isUserAllowedToEdit from '../../utils/isUserAllowedToEdit'
import useAxios from '../../plugins/useAxios'
// import swalMixin, { showToast } from '~/utils/swalMixin'

export default defineComponent({
  props: {
    userId: [Number, String],
    scope: {
      type: String,
      default: 'profile',
    },
  },
  setup(props) {
    const step1 = ref(true)
    const step2 = ref(false)
    const $axios = useAxios()

    const context = useContext()
    const { put } = useApi()
    const store = context.store

    const loginUser: any = context.$config.demoMode
      ? { id: 1, role: 'admin' }
      : (store.state as any).user.cred as any
    const uploader = ref(null)
    const passwordEditConfirmDialog = ref(false)
    const userImage = ref('')
    const userId: any = props.userId
    const route = useRoute()
    const router = useRouter()
    const newUserData = ref()
    // const toast = ((context as any).parent as any).$toast
    const data = ref({
      client_id: route.value.params.client_id,
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      website: '',
      adwords_budget: '',
      facebook_budget: '',
      monthly_fee: 0,
      status: '',
      apexchat_id: '',
      account_id: '',
      reporting_mail: '',
      facebook_id: '',
      adwords_id: '',
    })
    const roles = ref([])
    const form = ref(null)
    const loading = ref(false)
    const loadingRoles = ref(true)
    const isEditing = userId && userId > 0
    const isEditingOtherUser = +userId !== loginUser.id
    const { 
      create,
      locationById,
      deleteLocation,
      updateLocation,
      clientLocations, } = useUsers()
    // const $swal = swalMixin((parent as any).$swal as any)

    const fetchUser = async () => {
      try {
        loading.value = true
        const res = await locationById(userId)
        const userData = res.data?.data
        delete userData['scope']

        data.value = userData
        loading.value = false
        setTimeout(() => {
          ;(form.value as any).resetValidation()
        }, 50)
      } catch (e) {
        loading.value = false
      }
    }

    onMounted(async () => {
      if (isEditing) fetchUser()
      else {
        // loading.value = loadingRoles.value = false
      }
      const user: any = (store.state as any).user.cred as any
    })

    const handleUpdateUser = async () => {
      try {
        step1.value = false
        step2.value = true
        passwordEditConfirmDialog.value = false
        loading.value = true
        await updateLocation({
          id: route.value.params.location_id,
          client_id: route.value.params.client_id,
          name: data.value.name,
          address: data.value.address,
          city: data.value.city,
          state: data.value.state,
          zip: data.value.zip,
          website: data.value.website,
          adwords_budget: data.value.adwords_budget,
          facebook_budget: data.value.facebook_budget,
          monthly_fee: data.value.monthly_fee,
          status: data.value.status,
          apexchat_id: data.value.apexchat_id,
          account_id: data.value.account_id,
          reporting_mail: data.value.reporting_mail,
          facebook_id: data.value.facebook_id,
          adwords_id: data.value.adwords_id,
        })
            
        // router.replace('/users')
        // ;(context as any).emit('done')

        if (userImage.value) {
          await put('/meta/profile_picture', {
            meta_name: `profile_picture`,
            meta_value: userImage.value,
          })
          ;(context as any).$auth.fetchUser()
        }
        // showToast($swal, {
        //   title: 'User Updated',
        // })
        // ;(context as any).emit('done')
        loading.value = false
      } catch (e: any) {
        loading.value = false
        passwordEditConfirmDialog.value = false
        console.log(e.response)
      }
    }

    const submit = async () => {
      try {
        const vv = await (form.value as any).validate()
        if (vv) {
          loading.value = true

          if (isEditing) {
            handleUpdateUser()
          } else {
            loading.value = true
            await create(data.value as any)
            // await createUserRole(response.data.data as any)
            router.replace('/clients')
            // ;(context as any).app.emit('done')
          //   showToast($swal, {
          //     title: 'User created',
          //   })
          }

          // Now setting profile if user setup.
        } else {
          // showToast($swal, {
          //   title: 'Errors in form.',
          //   icon: 'warning',
          // })
        }
      } catch (e: any) {
        console.log(e.response)
      }
    }
    const commonPasswordRules = [
      (v: string) => {
        if ((v && v.length === 0) || v === undefined || v === null) {
          return true
        }
        return (
          (v && v.length >= 8) || 'Passowrd must be 8 or more than 8 characters'
        )
      },
      validateStrongPassword,
    ]

    const userEditWarnOldPasswordToUseToChangeDetails =
      isEditing && !isEditingOtherUser
        ? 'Old password is required for updating your profile'
        : 'Old password is required'

    const rules = {
      name: [(v: string) => !!v || 'Name is required'],
        address: [(v: string) => !!v || 'Address is required'],
        comment: [(v: string) => !!v || 'Comment is required'],
        street: [(v: string) => !!v || 'Street is required'],
        // city: [(v: string) => !!v || 'City is required'],
        // state: [(v: string) => !!v || 'State is required'],
        status: [(v: string) => !!v || 'Status is required'],
        zipcode: [(v: Number) => !!v || 'Zip Code is required'],
        email: [
          (v: string) => !!v || 'Email is required',
          (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        account_id: [(v: string) => !!v || 'Marchex ID is required'],
        website: [
          (v: string) => !!v || 'Personal website is required',
          (v: string) =>
            /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(v) ||
            'Website should start with https:// e.g "https://example.com"',
        ],
        reporting_mail: [
          (v: string) => !!v || 'Reporting Email is required',
          (v: string) => /.+@.+\..+/.test(v) || 'Reporting Email must be valid',
        ],
    }

    const rolesList = computed(() => {
      return (
        roles.value &&
        roles.value.filter((c: any) => {
          return c.name !== 'super admin'
        })
      )
    })

    const handleSelectProfilePicture = (file: any) => {
      if (file) {
        if (file.type.startsWith('image')) {
          var reader = new FileReader()
          var baseString: string = ''
          reader.onloadend = function () {
            baseString = reader.result as string
            let sizeInKB: number = +(file.size / 1024).toFixed(0)

            if (sizeInKB > 500) {
              // showToast($swal, {
              //   title: 'Image size should not be more than 500KB.',
              //   icon: 'warning',
              // })
              // @ts-ignore
              uploader.value.reset()
              return
            }
            userImage.value = baseString
          }

          reader.readAsDataURL(file)
        } else {
          // showToast($swal, {
          //   title: 'Please select an image.',
          //   icon: 'warning',
          // })
        }
      }
    }

    const isAllowedToEdit = computed(() => {
      const editingUser: any = data.value

      return isUserAllowedToEdit(
        editingUser,
        loginUser,
        route.value.path.includes('profile') ? 'profile' : null
      )
    })

    return {
      //state
      data,
      isEditing,
      loadingRoles,
      loading,
      roles,
      rules,
      form,
      passwordEditConfirmDialog,
      rolesList,
      uploader,
      isAllowedToEdit,
      isEditingOtherUser,
      step1,
      step2,
      newUserData,
      //methods
      submit,
      handleUpdateUser,
      handleSelectProfilePicture,
      clientId: route.value.params.client_id,
    }
  },
})
</script>


<style lang="scss">
// .body {
//   height: 400px;
//   overflow: auto;
// }
.v-input.radio-group .v-label {
  text-transform: capitalize;
}
</style>
