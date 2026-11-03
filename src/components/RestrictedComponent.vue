<template>
  <div>
    <div  v-if="isAllowed"><slot> </slot></div>
    <div v-else>Not allowed to {{permission}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    permission: {
      type: String,
      default: '',
    },
  },
  setup(props, root) {
    const context = useContext()
    const store = context.store

    const isAllowed = computed(() => {
      if (context.$config.demoMode) return true

      const scope: Array<String> = (store.state as any).userScope.cred as any || (context as any).$auth?.user?.data?.scope
        // console.log('SCOPE', (store.state as any).user.cred as any)
      return Boolean(scope && scope.includes(props.permission))
    })
    return {
      isAllowed,
    }
  },
})
</script>
