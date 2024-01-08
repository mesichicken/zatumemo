import { createApp } from 'vue'
import App from './App.vue'

console.log('create db')
/* @ts-ignore dbOpでエラーを出さない */
window.dbOp.createDb().catch((err) => {
  console.error(err)
})

const app = createApp(App)
app.mount('#app')
