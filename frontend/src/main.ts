import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import httpInterceptor from './inteceptors/http'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)

// Interceptor
httpInterceptor()

app.mount('#app')
