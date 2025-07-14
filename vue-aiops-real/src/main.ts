import './assets/main.css'

import { createApp } from 'vue'
import UniconWrapper from './components/unicon-wrapper.vue'

import App from './App.vue'

const app = createApp(App)

// Register unicon as global component for Vue 2 compatibility
app.component('unicon', UniconWrapper)

app.mount('#app')
