<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CONTROLE DE ACESSO</h5>
            <div class="divider" style="height: 10px;"></div>
            <br><br>
            <div class="row">
                <div class="input-field col l6 m6 s12" >
                    <select @change="getAllPermissoes(selectedPerfils)" v-model="selectedPerfils" :items="Rows" id="txt_Perfil" name="txt_Perfil" class="validate">
                        <option value="" selected disabled>Perfil de Acesso</option>
                        <option v-for="option in lstPerfil" :key="option.codperfil" :value=option.codperfil>
                            {{ option.perfil }}
                        </option>
                    </select>
                    <label>Perfil</label>
                </div>
            </div>
            <div class="row ">
                <button disabled id="SalvarEvento" @click="salvarPermissao()" class="waves-effect waves-light btn right btnsEventos">Cadastrar</button>
            </div>
            <br>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table :items="Rows" class="centered striped" id="tabDados">
                        <thead style="height:60px;border-bottom: solid;border-width: thin;">
                        <tr>
                            <th>Tela</th>
                            <th>Descrição</th>
                            <th>Ler</th>
                            <th>Salvar</th>
                            <th>Editar</th>
                            <th>Excluir</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="permissao in lstPermissoes" :key="permissao.codtela">
                                <td>{{ permissao.tela }}</td>
                                <td>{{ permissao.descricao }}</td>

                                <td v-if="permissao.ler === 'True'">
                                    <label>
                                    <input id="ler" type="checkbox" v-bind="{ name: permissao.tela+'[]'}" checked="checked"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td v-else>
                                    <label>
                                    <input id="ler" type="checkbox" v-bind="{ name: permissao.tela+'[]'}"/>
                                    <span></span>
                                    </label>
                                </td>

                                <td v-if="permissao.salvar === 'True'">
                                    <label>
                                    <input id="salvar" type="checkbox" v-bind="{ name: permissao.tela+'[]'}" checked="checked"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td v-else>
                                    <label>
                                    <input id="salvar" type="checkbox" v-bind="{ name: permissao.tela+'[]'}"/>
                                    <span></span>
                                    </label>
                                </td>

                                <td v-if="permissao.editar === 'True'">
                                    <label>
                                    <input id="editar" type="checkbox" v-bind="{ name: permissao.tela+'[]'}" checked="checked"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td v-else>
                                    <label>
                                    <input id="editar" type="checkbox" v-bind="{ name: permissao.tela+'[]'}"/>
                                    <span></span>
                                    </label>
                                </td>

                                <td v-if="permissao.excluir === 'True'">
                                    <label>
                                    <input id="excluir" type="checkbox" v-bind="{ name: permissao.tela+'[]'}" checked="checked"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td v-else>
                                    <label>
                                    <input id="excluir" type="checkbox" v-bind="{ name: permissao.tela+'[]'}"/>
                                    <span></span>
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

  </template>
  
  <script>
  import staticImage from '@/assets/balancastop.png';
  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";
  const toast = useToast();

  export default {
    name: 'PerfilView',
    components: {
      MenuLateral
    },
    data () {
        return {
            selectedPerfils:[],
            selectedPermissoes:[],
            lstPerfil:[],
            lstPermissoes:[],
            flag:true,
            flagex:true,
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    computed:{
        Rows() {
            var rows = 0;
            return this.lstPerfil.find(() => {
                rows += 1;
                if(this.lstPerfil.length == rows)
                {
                     setTimeout( () => {
                        var Perfil = document.querySelectorAll('#txt_Perfil');
                        M.FormSelect.init(Perfil);
                        api.loadingOff();
                        resize();
                    }, "500");
                }
            })
        }
    },
    methods:
    {
        async salvarPermissao()
        {
            var ret1 = await api.verificarAcesso("PERFIL","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
            if(!ret1)
            {
                return;
            }
            //var arrayCheck = []
            
            var chk = [];
            var Permissoes = [];
            this.lstPermissoes.forEach( j => {
                var checkboxes = document.querySelectorAll("input[type=checkbox][name='"+j.tela+"[]']")
                for (var i = 0; i < 4; i++) 
                {
                    chk[checkboxes[i].id] = checkboxes[i].checked;
                }
                //arrayCheck.push(permissoes);
                 var hsh = {
                    codperfil:j.codperfil,
                    codtela:j.codtela,
                    codusuariocad:this.USUARIO.codusuarios,
                    codusuarioalt:this.USUARIO.codusuarios,
                    descricao:j.descricao,
                    dtcriacao:api.dataAtual(),
                    dtalteracao:api.dataAtual(),
                    tela:j.tela,
                    ler:chk["ler"] ? "1":"0",
                    salvar:chk["salvar"] ? "1":"0",
                    editar:chk["editar"] ? "1":"0",
                    excluir:chk["excluir"] ? "1":"0"
                }
                chk = [];
                Permissoes.push(hsh)
            });
            
            await api.post("updatepermissoestelas", Permissoes).then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
            }
            else if(r.status != 200)
            {
                toast.error(r.data.message);
            }
            else
            {
                this.LimparCampos();
                this.getallPerfilAcesso();
                toast("Permissões Atualizadas com Sucesso !!!");
            }})

            api.loadingOff();
            return true;
        },
        LimparCampos()
        {
            var Perfil = document.querySelectorAll('#txt_Perfil');
            M.FormSelect.init(Perfil);
            this.selectedPerfils  = [];
            M.updateTextFields();
            document.getElementById("SalvarEvento").disabled = true;
        },
        async getAllPermissoes(_codperfil)
        {
            api.loadingOn();
            await api.get("getallpermissoes",{codperfil:_codperfil}).then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstPermissoes = r.data.permissoes;
                    document.getElementById("SalvarEvento").disabled = false;
                }
                else
                {
                    toast.error(r.data.message);
                }
                api.loadingOff();
            });
        },
        async getallPerfilAcesso()
        {
            api.loadingOn();
            await api.get("getallperfilacesso").then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstPerfil = r.data.perfil;
                }
                else
                {
                    //api.loadingOff();
                    toast.error(r.data.message);
                }
                api.loadingOff();
            });
        }
    },
    mounted()
    {
        M.updateTextFields();
        resize();
        setTimeout(() => {
            const gif = document.getElementById('bkgMenuLateral');
            gif.src = staticImage;
        }, 2500);
    },
    created()
    {
        this.getallPerfilAcesso();
        toast("Selecione o perfil de acesso que deseja alterar as permissões.");
    }
  }

function resize()
{
    var url = window.location.href.replaceAll("/","").split('#')[1];
    if(url !== "")
    {
        var mainHeight = document.getElementById('mainArea').clientHeight;
        if(window.innerWidth >= 993)
        {
            mainHeight = mainHeight - 55;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
        }
        else if(window.innerWidth <= 992 && window.innerWidth > 600)
        {
            mainHeight = mainHeight - 85;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
        }
        else if(window.innerWidth <= 600)
        {
            mainHeight = mainHeight - 85;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
        } 

        var PxAdicional = 480;
        var conteudoHeight = document.getElementById('conteudo').clientHeight;
        var tableContainerHeight = document.getElementById('tableContainer').clientHeight;
        //alert("tableContainer + PxAdicional "+(tableContainerHeight+PxAdicional) + " conteudoHeight "+conteudoHeight)
        if( (tableContainerHeight+PxAdicional) >= conteudoHeight)
        {
            document.getElementById('tableContainer').style.overflowY = "scroll";
            if(window.innerWidth <= 600)
            {
                document.getElementById('tableContainer').style.height = (conteudoHeight-PxAdicional+130)+"px";
            }
            else
            document.getElementById('tableContainer').style.height = (conteudoHeight-PxAdicional+100)+"px";
        }
        if( (tableContainerHeight+PxAdicional) <= conteudoHeight)
        {
            document.getElementById('tableContainer').style.overflowY = "hidden";
            if(window.innerWidth <= 600)
            {
                document.getElementById('tableContainer').style.height = (conteudoHeight-PxAdicional+130)+"px";
            }
            else
            document.getElementById('tableContainer').style.height = (conteudoHeight-PxAdicional+100)+"px";
        } 
    }
}

window.onresize=function() 
{
    var url = window.location.href.replaceAll("/","").split('#')[1];
    if(url !== "")
    {
        var mainHeight = document.getElementById('mainArea').clientHeight;
        var PxAdicional = 330;
        var conteudoHeight = document.getElementById('conteudo').clientHeight;
        var tableContainerHeight = document.getElementById('tableContainer').clientHeight;
        var tabDados = document.getElementById('tabDados').clientHeight; 
        
        if(window.innerWidth >= 993)
        {
            mainHeight = mainHeight - 55;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
        }
        else if(window.innerWidth <= 992 && window.innerWidth > 600)
        {
            mainHeight = mainHeight - 85;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
        }
        else if(window.innerWidth <= 600)
        {
            mainHeight = mainHeight - 85;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
        }
        
        if( (tableContainerHeight+PxAdicional) > (conteudoHeight-48))
        {
            document.getElementById('tableContainer').style.overflowY = "scroll";
            document.getElementById('tableContainer').style.height = (conteudoHeight-380)+"px";
        }
        else if(conteudoHeight > (tableContainerHeight+PxAdicional))
        {
            document.getElementById('tableContainer').style.height = (conteudoHeight-380)+"px";
        }

        if(tableContainerHeight < tabDados+20)
        {
            document.getElementById('tableContainer').style.overflowY = "scroll";
        }
        else
        {
            document.getElementById('tableContainer').style.overflowY = "hidden";
        }
    }
} 
  </script>
  <style scoped>
    .Eventos
    {
        border-radius: 8px;
    }
    #conteudo
    {
        overflow-y:scroll;
        height: 400px;
        padding: 20px 40px 20px 40px;
    }
    h5
    {
        font-size: 20px;
    }
    .btnsEventos
    {
        margin-right: 15px;
        background-color: #85714d !important;
        font-weight: bold;
    }
    
    @media only screen and (min-width: 993px) 
    {
        #conteudo
        {
            overflow-y:hidden;
        }
        .container
        {
            margin-top: 30px;
            width: 90%;
        }
    }
    @media only screen and (max-width: 992px) 
    {
        h5
        {
            font-size: 18px;
        }
    }
    @media only screen and (max-width: 800px) 
    {
        #conteudo
        {
            padding: 20px;
        }
        h5
        {
            font-size: 14px;
        }
    }
    @media only screen and (max-height: 800px) 
    {
        #conteudo
        {
            overflow-y:scroll;
            padding: 20px;
        }
    }
  </style>