import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import InicioView from '../views/InicioView.vue'
import SociosView from '../views/SociosView.vue'
import ImpostosView from '../views/ImpostosView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import PerfilView from '../views/PerfilView.vue'
import ReceitasFinancView from '../views/ReceitasFinancView.vue'
import BancosView from '../views/BancosView.vue'
import GruposView from '../views/GruposView.vue'
import NucleosView from '../views/CentrosCustoView.vue'
import ProvisoesView from '../views/ProvisaoView.vue'
import AdiantamentosView from '../views/AdiantamentosView.vue'
import TiposView  from '../views/TiposView.vue'
import CcpjView  from '../views/CcpjView.vue'
import CGerencialView from '../views/CGerencialView.vue'
import ContasDeparaView from '../views/ContasDeparaView.vue'
import RetencoesView from '../views/RetencoesView.vue'
import ContasPagarView from '../views/ContasPagarView.vue'
import ContasReceberView from '../views/ContasReceberView.vue'

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
      path: "/CadReceitasFinanc",
      name: "RENDIMENTOS",
      component: ReceitasFinancView
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
  },
  {
      path: "/CadCPJ",
      name: "CPJ",
      component: CcpjView
  },
  {
      path: "/CadCGerencial",
      name: "CGERENCIAL",
      component: CGerencialView
  },
  {
      path: "/ContasDePara",
      name: "CDEPARA",
      component: ContasDeparaView
  },
  {
      path: "/CadRetencao",
      name: "RETENCOES",
      component: RetencoesView
  },
  {
      path: "/ContasPagar",
      name: "CPAGAR",
      component: ContasPagarView
  },
  {
      path: "/ContasReceber",
      name: "CRECEBER",
      component: ContasReceberView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
