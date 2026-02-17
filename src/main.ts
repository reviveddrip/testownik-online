import { createApp } from 'vue'
import './style.css' // Opcjonalne, jeśli masz globalne style
import App from "./App.vue"

// Tworzymy aplikację Vue 3
const app = createApp(App)

// Jeśli będziesz używał routera lub store (Vuex/Pinia), tutaj je dodasz:
// app.use(router)
// app.use(store)

// Montujemy aplikację do elementu o id="app" w index.html
app.mount('#app')