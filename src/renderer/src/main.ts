import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

console.log('create db')
/* @ts-ignore dbOpでエラーを出さない */
window.dbOp.createDb().catch((err) => {
  console.error(err)
})

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.mount('#app')
