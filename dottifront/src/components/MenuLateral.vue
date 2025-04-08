<template>

  <ul id="slide-out" class="sidenav sidenav-fixed" style="background-color: #edeae4;">
    <!-- <nav class="nav-wrapper"></nav> -->
    <li style= "line-height: unset;">
      <div class="user-view">
        <div class="background">
          <img id="bkgMenuLateral" src="@/assets/balanca.gif">
        </div>
        <div><img class="circle" src="@/assets/AvatarMenuLateral.jpg"></div>
        <div id="dadosUsr">
          <div><span class="white-text">{{ user.usuario.nome }}</span></div>
          <div><span class="white-text">PERFIL {{ user.usuario.perfilacesso.perfil }}</span></div>
        </div>
      </div>
    </li>
    <li><a class="subheader" style="font-weight: bold;color: #102647;">Menu do Sistema</a></li>
    <li><div class="divider" ></div></li>
    <li class="no-padding ">
        <ul class="collapsible">
          <li style="text-align: left;">
            <router-link id="inicio" to="/Inicio">
              <i style="color: #2c3e50;" class="material-icons">home</i>Tela Inicial</router-link>
          </li>
          <li>
            <div class="collapsible-header "><i class="large material-icons">assignment</i>Cadastros Específicos</div>
            <div class="collapsible-body" style="text-align: left;">
              <ul>
                <li><a href="" @click="verificarPermissao($event,'ADIANTAMENTOS')">Adiantamentos</a></li>
                <li><a href="" @click="verificarPermissao($event,'CDEPARA')">Contas De Para</a></li>
                <li><a href="" @click="verificarPermissao($event,'IMPOSTOS')">Impostos</a></li>
                <li><a href="" @click="verificarPermissao($event,'PROVISAO')">Provisão de Valores</a></li>
                <li><a href="" @click="verificarPermissao($event,'RENDIMENTOS')">Receitas Financeiras</a></li>
                <li><a href="" @click="verificarPermissao($event,'RETENCOES')">Retenções</a></li>
                <li><a href="" @click="verificarPermissao($event,'SOCIOS')">Sócios</a></li>
              </ul>
            </div>
          </li>

          <li>
            <div class="collapsible-header"><i class="material-icons">assessment</i>Cadastros Gerais</div>
            <div class="collapsible-body" style="text-align: left;">
              <ul>
                <li><a href="" @click="verificarPermissao($event,'BANCOS')">Bancos</a></li>
                <li><a href="" @click="verificarPermissao($event,'NUCLEOS')">Centros de Custo</a></li>
                <li><a href="" @click="verificarPermissao($event,'CPJ')">Contas do Cpj</a></li>
                <li><a href="" @click="verificarPermissao($event,'CGERENCIAL')">Contas Gerenciais</a></li>
                <li><a href="" @click="verificarPermissao($event,'GRUPOS')">Grupos</a></li>
                <li><a href="" @click="verificarPermissao($event,'TIPOS')">Tipos Ret / Dist</a></li>
              </ul>
            </div>
          </li>
          <li>
            <div class="collapsible-header"><i class="material-icons">business_center</i>Operações</div>
            <div class="collapsible-body" style="text-align: left;">
              <ul>
                <li><a >Grid de Cálculo</a></li>
              </ul>
            </div>
          </li>
          <li>
            <div class="collapsible-header"><i class="material-icons">content_paste</i>Relatórios</div>
            <div class="collapsible-body" style="text-align: left;">
              <ul>
                <li><a  >Relatorio A</a></li>
              </ul>
            </div>
          </li>
          <li>
            <div class="collapsible-header"><i class="material-icons">build</i>Sistema</div>
            <div class="collapsible-body" style="text-align: left;">
              <ul>
                <li><a href="" @click="verificarPermissao($event,'PERFIL')">Controle de Acesso</a></li>
                <li><a href="" @click="verificarPermissao($event,'USUARIOS')">Usuários do Sistema</a></li>
                <li><a >Configurar Noticias</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </li>
      <li><div class="divider"></div></li>
          <a href="#" @click="deslogar()" id="logout" class="right" style="margin:10px;color: #85714d !important;">Deslogar</a>
  </ul>
  <div class="hide-on-large-only openmenu">
    <a href="#" data-target="slide-out" class="sidenav-trigger left" 
    style="color: #9e9e9e;margin-top: -65px;margin-left: 15px;">
      <i class="medium material-icons">chrome_reader_mode</i></a>
  </div>
  </template>
  
  <script>
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";

  const toast = useToast();
  export default {
    name: 'MenuLateral',
    data(){
        return{
            user: JSON.parse(sessionStorage.getItem("batata"))
        }
    },
    methods:
    {
      async verificarPermissao(e,telaS)
      {
        e.preventDefault();
        await api.get("GetPermissoesTelas",{codperfil:this.user.usuario.codperfil,tela:telaS, tipoacesso:"LER"}).then(r=>{
            if(r.status == 401)
            {
              //api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                sessionStorage.clear();
                this.$router.push('/');
                return;
            }
            else if(r.status == 200)
            {
              if(r.data.permissao)
              {
                //api.loadingOff();
                //var tela = ('/'+telaS);
                //this.$router.push(tela);
                this.$router.push({ name: telaS })
              }
              else
              {
                //api.loadingOff();
                toast.error("Seu perfil não possui permissão de acesso a esta tela!!!")
              }
            }
            else
            {
              //api.loadingOff();
              toast.error(r.data.message)
              this.$router.push('/Inicio');
            }
        });
        return false;
      },
      deslogar()
      {
        sessionStorage.clear();
        this.$router.push('/');
      }
    },
    mounted()
    {
      M.AutoInit();
    },
    created()
    {

    }
  }

  </script>
  
  <style scoped>

    #bkgMenuLateral
    {
      width: 100%;
      height: 100%;
    }
    #slide-out
    {
      margin-top: 65px;
    }
    .user-view
    {
      height: 170px;
      box-sizing: none;
    }
    #dadosUsr
    {
      margin-top: 32px;
      background-color: #85714dbf;
      font-weight: bold;
    }
    #inicio
    {
      padding-left: 18px; margin-right: 12px;
      color:#024638;
    }
    #inicio i
    {
      margin-right: 18px;
    }
    .sidenav .collapsible-body 
    {
      padding: 0;
      background-color: #edeae4;
      
    }
    .sidenav li > a
    {
      color:#024638;
    }
    

    @media only screen and (min-width: 993px) 
    {
      #dadosUsr
      {
        margin-top: 10px;
      }
      .container
      {
        margin-top: 70px;
        width: 90%;
      }
    }

    @media only screen and (max-width: 992px) 
    {
      #slide-out
      {
        margin-top: 56px;
      }
    }
    @media only screen and (max-width: 601px) 
    {
      #inicio
      {
        font-size: 12px;
      }
      #inicio i 
      {
        margin-right: 11px;
      }
    }
    @media only screen and (min-width: 601px) 
    {
      #slide-out
      {
        margin-top: 64px;
      }
    } 
    @media only screen and (min-width: 1200px) 
    {
      #inicio
      {
        font-size: 15px;
      }
    }
  </style>
  