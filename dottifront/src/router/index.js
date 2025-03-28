import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import InicioView from '../views/InicioView.vue'
import EventosView from '../views/EventosView.vue'
import ImpostosView from '../views/ImpostosView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import PerfilView from '../views/PerfilView.vue'
import DiariaAusenciaView from '../views/DiariaAusenciaView.vue'
import DiariaEventosView from '../views/DiariaEventosView.vue'
import AprovacaoView from '../views/AprovacaoView.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
      path: "/Inicio",
      name: "INICIO",
      component: InicioView
  },
  {
      path: "/Eventos",
      name: "EVENTOS",
      component: EventosView
  },
  {
      path: "/Impostos",
      name: "IMPOSTOS",
      component: ImpostosView
  },
  {
      path: "/Usuarios",
      name: "USUARIOS",
      component: UsuariosView
  },
  {
      path: "/Acesso",
      name: "PERFIL",
      component: PerfilView
  },
  {
      path: "/DiariaAusencia",
      name: "DAUSENCIA",
      component: DiariaAusenciaView
  },
  {
      path: "/DiariaEventos",
      name: "DEVENTOS",
      component: DiariaEventosView
  },
  {
      path: "/Aprovacao",
      name: "APROVACAO",
      component: AprovacaoView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
