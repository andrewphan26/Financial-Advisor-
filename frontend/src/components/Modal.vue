<template>
  <v-dialog v-model="dialog" max-width="620" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">{{ title }}</div>
        <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
      </v-card-title>

      <div class="body">
        <slot name="body"></slot>
      </div>

      <template v-slot:actions>
        <div :class="`actions flex ${denyBtn ? 'se' : 'center'} full-w mt-3 mb-2`">
          <v-btn @click="onDenyHandler" class="btn deny" v-if="denyBtn">{{ denyBtn }}</v-btn>
          <v-btn @click="onAcceptHandler" class="btn accept">{{ confirmBtn }}</v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<style>
.body {
  padding: 0 48px;
  text-align: center;
}
</style>

<script>
import { ref } from 'vue'
export default {
  props: {
    title: { type: String, default: '' },
    denyBtn: { type: String, default: null },
    confirmBtn: { type: String, default: 'Ok' },

    onAccept: Function,
    onDeny: Function,
  },
  setup(props, { expose }) {
    const dialog = ref(false)

    const onAcceptHandler = () => {
      dialog.value = false
      if (props.onAccept) props.onAccept()
    }

    const onDenyHandler = () => {
      dialog.value = false
      if (props.onDeny) props.onDeny()
    }

    const close = () => {
      dialog.value = false
    }

    expose({ dialog })

    return { dialog, close, onAcceptHandler, onDenyHandler }
  },
}
</script>
