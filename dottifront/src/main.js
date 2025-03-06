import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);
app.use(router);
app.use(Toast,{
    transition: "Vue-Toastification__fade",
    maxToasts: 20,
    newestOnTop: true,
    timeout: 7000,
    position: "top-center"
  });
app.mount('#app');