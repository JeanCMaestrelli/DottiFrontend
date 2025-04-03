import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import InicioView from '../views/InicioView.vue'
import SociosView from '../views/SociosView.vue'
import ImpostosView from '../views/ImpostosView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import PerfilView from '../views/PerfilView.vue'
import RendimentosView from '../views/RendimentosView.vue'
import BancosView from '../views/BancosView.vue'
import GruposView from '../views/GruposView.vue'
import NucleosView from '../views/NucleosView.vue'
import ProvisoesView from '../views/ProvisaoView.vue'
import AdiantamentosView from '../views/AdiantamentosView.vue'
import TiposView  from '../views/TiposView.vue'
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
      path: "/CadSocios",
      name: "SOCIOS",
      component: SociosView
  },
  {
      path: "/CadImpostos",
      name: "IMPOSTOS",
      component: ImpostosView
  },
  {
      path: "/CadUsuarios",
      name: "USUARIOS",
      component: UsuariosView
  },
  {
      path: "/CadAcesso",
      name: "PERFIL",
      component: PerfilView
  },
  {
      path: "/CadRendimentos",
      name: "RENDIMENTOS",
      component: RendimentosView
  },
  {
      path: "/CadBancos",
      name: "BANCOS",
      component: BancosView
  },
  {
      path: "/CadGrupos",
      name: "GRUPOS",
      component: GruposView
  },
  {
      path: "/CadNucleos",
      name: "NUCLEOS",
      component: NucleosView
  },
  {
      path: "/CadProvisoes",
      name: "PROVISAO",
      component: ProvisoesView
  },
  {
      path: "/CadAdiantamentos",
      name: "ADIANTAMENTOS",
      component: AdiantamentosView
  },
  {
      path: "/CadTipos",
      name: "TIPOS",
      component: TiposView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
