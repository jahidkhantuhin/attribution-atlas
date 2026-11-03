<template>
  <div>
    <v-card v-if="(isAllowedToEdit && step1)" elevation="0">
      <v-sheet class="form-title mx-auto" max-width="calc(100% - 32px)">
        <v-card-title>{{ isEditing ? 'Edit teammate' : 'Invite teammate' }}</v-card-title>
      </v-sheet>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="6">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                v-model="data['first_name']"
                placeholder="First name"
                counter="50"
                max="50"
                :rules="rules.first_name"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                v-model="data['last_name']"
                :rules="rules.last_name"
                placeholder="Last name"
                :disabled="loading"
                counter="50"
                max="50"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                :rules="rules.email"
                v-model="data['email']"
                :disabled="loading || scope === 'profile'"
                placeholder="E-mail"
              ></v-text-field>
            </v-col>
            <v-col cols="6" v-if="isEditing && isEditingOtherUser === false">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                v-model="data['old_password']"
                type="password"
                :rules="rules.old_password"
                placeholder="Old password"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                v-model="data['password']"
                type="password"
                :disabled="loading"
                :rules="rules.password"
                placeholder="Enter new password"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                v-model="data['password_confirmation']"
                type="password"
                :rules="rules.password_confirmation"
                placeholder="Enter new password again"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="6" v-if="scope != 'profile' && data['role_id'] === 4">
              <v-text-field
                dense
                filled
                rounded
                clear-icon="mdi-close-circle"
                clearable
                v-model="data['pay_rate']"
                type="number"
                placeholder="Pay rate"
                :rules="rules.pay_rate"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="6" v-if="(isEditing)">
              <v-select
                :items="[{text: 'Active', value: 'active'},
                {text: 'Inactive', value: 'inactive'}]"
                placeholder="Select Status"
                item-value="value"
                item-text="text"
                v-model="data['status']"
                :rules="rules.status"
                
              >
              </v-select>
            </v-col>
          </v-row>
          

          

          
          
          <!-- <v-radio-group
            class="radio-group"
            v-if="(scope != 'profile' && isEditing)"
            v-model="data['role_id']"
            :disabled="loading"
            :rules="rules.role_id"
          >
            <v-radio
              :value="n.id"
              v-for="n in rolesList"
              :key="n.id"
              :label="n.name"
            ></v-radio>
          </v-radio-group> -->
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :color="'normal'"
          :disabled="loading || loadingRoles"
          @click="$emit('cancel')"
          >
          <v-icon left>mdi-cancel</v-icon>
          <!-- Cancel -->
          </v-btn
        >
        <v-btn
          :disabled="loading || loadingRoles"
          :loading="loading"
          :color="'orange'"
          @click="submit"
          >
          <!-- {{ isEditing ? 'Update' : 'Create' }} -->
          <v-icon left>mdi-check</v-icon>
          </v-btn
        >
      </v-card-actions>

      <!-- user is editing password dialog -->
      <v-dialog v-model="passwordEditConfirmDialog" persistent max-width="400">
        <v-card>
          <v-card-title class="headline"> Password Modification </v-card-title>
          <v-card-text
            >You are about to change the password for another user. Please make
            sure that the user is notified about it.</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color=""
              text
              @click="
                passwordEditConfirmDialog = false
                loading = false
              "
            >
              Cancel
            </v-btn>
            <v-btn color="green darken-1" text @click="handleUpdateUser">
              Go ahead
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- user is editing password dialog -->
    </v-card>
    <v-card v-if="(isAllowedToEdit && step2)" elevation="0" :loading="loading" color="transparent">
      <v-card-text>
        <strong>Select a user role</strong> 
        <v-form>
          <v-radio-group
            class="radio-group"
            v-if="scope != 'profile'"
            v-model="data['role_id']"
            :rules="rules.role_id"
          >
            <v-radio
              :value="n.id"
              v-for="n in rolesList"
              :key="n.id"
              :label="n.name"
            ></v-radio>
          </v-radio-group>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :color="'normal'"
          :disabled="loadingRoles"
          @click="$emit('cancel')"
          >
          <v-icon left>mdi-cancel</v-icon>
          <!-- Cancel -->
          </v-btn
        >
        <v-btn
          :disabled="loadingRoles"
          :color="'orange'"
          @click="submit2"
          >
          <!-- {{ isEditing ? 'Update' : 'Create' }} -->
          <v-icon left>mdi-check</v-icon>
          </v-btn
        >
      </v-card-actions>
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
import useUsers from '../../services/useUsers'
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
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      pay_rate: '',
      password: '',
      password_confirmation: '',
      old_password: '',
      role_id: 0,
      status: '',
    })
    const roles = ref([])
    const form = ref(null)
    const loading = ref(true)
    const loadingRoles = ref(true)
    const isEditing = userId && userId > 0
    const isEditingOtherUser = +userId !== loginUser.id
    const { userById, updateUser, createUser, getRoles, createUserRole } = useUsers()
    // const $swal = swalMixin((parent as any).$swal as any)

    const fetchUser = async () => {
      try {
        loading.value = true
        const res = await userById(userId)
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
        loading.value = loadingRoles.value = false
      }
      loadingRoles.value = true
      const user: any = context.$config.demoMode
        ? { id: 1, role: 'admin' }
        : (store.state as any).user.cred as any
      if (user.role === ADMIN_ROLE || user.role === SUPER_ADMIN_ROLE) {
        const res = await getRoles()
        roles.value = res.data?.data
      }
      loadingRoles.value = false
    })

    const handleUpdateUser = async () => {
      try {
        step1.value = false
        step2.value = true
        passwordEditConfirmDialog.value = false
        loading.value = true
        let response = await updateUser({
            id: data.value.id,
            first_name: data.value.first_name,
            last_name: data.value.last_name,
            email: data.value.email,
            pay_rate: data.value.pay_rate,
            status: data.value.status,
            old_password: data.value.old_password,
            password: data.value.password,
            role_id: data.value.role_id
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
            if (
              route.value.path.includes('profile') === false && data.value?.password
            ) {
              passwordEditConfirmDialog.value = true
              return
            }
            handleUpdateUser()
          } else {
            loading.value = true
            let response = await createUser(data.value as any)
            newUserData.value = response.data.data
            console.log('RESPONSE', response.data)
            step1.value = false
            step2.value = true
            // await createUserRole(response.data.data as any)
            // router.replace('/users')
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

    const submit2 = async () => {
      try {
        if (!isEditing) {
            await $axios
            .put(`users/${newUserData.value.id}/roles`, {
              role_id: data.value.role_id
            })
            .then((response: any) => {
              })
            // step1.value = false
            // step2.value = true
            router.replace('/users')
          //   showToast($swal, {
          //     title: 'User created',
          //   })
        }
        else {
          await $axios
            .put(`users/${data.value.id}/roles`, {
              role_id: data.value.role_id
            })
            // step1.value = false
            // step2.value = true
            router.replace('/users')
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
      first_name: [(v: string) => !!v || 'First Name is required'],
      last_name: [(v: string) => !!v || 'Last Name is required'],
      status: [(v: string) => !!v || 'Status is required'],
      old_password: [
        ...commonPasswordRules,
        (v: string) => !!v || userEditWarnOldPasswordToUseToChangeDetails,
      ],
      password: [
        (v: string) => (!isEditing ? !!v || 'Password is required' : true),
        ...commonPasswordRules,
      ],
      password_confirmation: [
        (v: string) =>
          data.value.password
            ? !!v || 'Password confirmation is required'
            : true,
        (v: string) =>
          data.value.password === data.value.password_confirmation ||
          'Passwords donot match.',
        ...commonPasswordRules,
      ],
      email: [
        (v: string) => !!v || 'E-mail is required',
        (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      pay_rate: [
        (v: string) =>
          data.value['role_id'] === 4 ? !!v || 'Pay rate is required' : true,
        (v: string) => {
          if (v === undefined || v === null) return true
          return parseInt(v) > 0.1 || 'Pay rate must be greater 0.1'
        },
        (v: string) => {
          if (v === undefined || v === null) return true
          return parseInt(v) < 99.99 || 'Pay rate must be less then 99.99'
        },
      ],
      role_id: [(v: string) => (!isEditing ? !!v || 'Role is required' : true)],
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

      return context.$config.demoMode || isUserAllowedToEdit(
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
      submit2,
      handleUpdateUser,
      handleSelectProfilePicture,
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
