<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">APROVAÇÃO DAS DIÁRIAS</h5>
            <div class="divider" style="height: 10px;"></div>
            <br><br>
            <div class="row">
                <div class="col s12">
                <ul class="tabs">
                    <li class="tab col s6"><a class="active" href="#tabAusencia">Diarias por Ausência</a></li>
                    <li class="tab col s6"><a href="#tabEvento">Diárias de Eventos</a></li>
                </ul>
                </div>
                <div id="tabAusencia" class="col s12">
                    <br>
                    <div class="row ">
                        <button id="AprovarAusencia" @click="aprovarAusencia()" class="waves-effect waves-light btn right btnsEventos">Aprovar</button>
                        <button id="ReprovarAusencia" @click="reprovarAusencia()" class="waves-effect waves-light btn right btnsEventos">Reprovar</button>
                    </div>
                    <br>
                    <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                        <table :items="Rows" class="centered striped" id="tabDados">
                            <thead style="height:60px;border-bottom: solid;border-width: thin;">
                            <tr>
                                <th>Marcar</th>
                                <th>Código</th>
                                <th>Data</th>
                                <th>Ausente</th>
                                <th>Substituto</th>
                                <th>Gerente</th>
                                <th>Garagem</th>
                                <th>Motivo</th>
                                <th>Aprovado</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="tipo in lstAusencias" :key="tipo.codausencia">
                                    <td>
                                        <label>
                                        <input type="checkbox" :id="tipo.codausencia" v-model="selectedAusencia" :value="tipo"/>
                                        <span></span>
                                        </label>
                                    </td>
                                    <td>{{ tipo.codausencia }}</td>
                                    <td>{{ tipo.datadiaria }}</td>
                                    <td>{{ tipo.ausente }}</td>
                                    <td>{{ tipo.substituto }}</td>
                                    <td>{{ tipo.gerente }}</td>
                                    <td>{{ tipo.secao }}</td>
                                    <td>{{ tipo.motivo }}</td>
                                    <td v-if="tipo.aprovado === '1'">
                                        <label disable>
                                        <input  type="checkbox" checked="checked" disabled="disabled" />
                                        <span></span>
                                        </label>
                                    </td>
                                    <td v-else>
                                        <label>
                                        <input type="checkbox" disabled="disabled"/>
                                        <span></span>
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="tabEvento" class="col s12">
                    <br>
                    <div class="row ">
                        <button id="AprovarEvento" @click="aprovarEvento()" class="waves-effect waves-light btn right btnsEventos">Aprovar</button>
                        <button id="ReprovarEvento" @click="reprovarEvento()" class="waves-effect waves-light btn right btnsEventos">Reprovar</button>
                    </div>
                    <br>
                    <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table  class="centered striped" id="tabDados">
                        <thead style="height:60px;border-bottom: solid;border-width: thin;">
                        <tr>
                            <th>Marcar</th>
                            <th>Evento</th>
                            <th>Descrição</th>
                            <th>Data</th>
                            <th>HoraInicio</th>
                            <th>HoraFim</th>
                            <th>C.Custo</th>
                            <th>Nome</th>
                            <th>Aprovado</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tipo in lstEventos" :key="tipo.codigo">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="tipo.codigo" v-model="selectedEventos" :value="tipo"/>
                                    <span></span>
                                    </label>
                                </td>
                               
                                <td>{{ tipo.evento }}</td>
                                <td>{{ tipo.descricao }}</td>
                                <td>{{ tipo.datadiaria }}</td>
                                <td>{{ tipo.horainicio }}</td>
                                <td>{{ tipo.horafim }}</td>
                                <td>{{ tipo.codccusto }}</td>
                                <td>{{ tipo.nome }}</td>
                                <td v-if="tipo.aprovado === '1'">
                                    <label disable>
                                    <input  type="checkbox" checked="checked" disabled="disabled" />
                                    <span></span>
                                    </label>
                                </td>
                                <td v-else>
                                    <label>
                                    <input type="checkbox" disabled="disabled"/>
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
    </div>
    <div id="ModalReprovacao" class="modal">
        <div class="modal-content">
            <h5 style="font-weight: bold;">REPROVAÇÃO DAS DIÁRIAS</h5>
            <br>
            <div class="row">
                <div class="input-field col s12">
                    <input v-model="motivoReprovacao" id="txt_ReprovacaoEvento" type="text" class="validate">
                    <label for="txt_ReprovacaoEvento">Informe o Motivo da Reprovação</label>
                </div>
                <div class="input-field col s12">
                    <button id="salvarReprovacao" @click="salvarReprovacao()" class="waves-effect waves-light btn right btnsEventos">Reprovar</button>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>

  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";
  const toast = useToast();

  export default {
    name: 'AprovacaoView',
    components: {
      MenuLateral
    },
    data () {
        return {
            selectedAusencia:[],
            selectedEventos:[],
            lstAusencias:[],
            lstEventos:[],
            tiporeprovacao:1,
            motivoReprovacao:"",
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    computed:{
        Rows() {
            var rows = 0;
            return this.lstAusencias.find(() => {
                rows += 1;
                if(this.lstAusencias.length == rows)
                {
                    setTimeout( () => {
                    let opt = {
                    }
                    var tab = document.getElementsByClassName('tabs');
                    M.Tabs.init(tab, opt);
                    resize();

                }, "500");
                }
            })
        }
    },
    methods:
    {
        async aprovarAusencia()
        {
            var ret = await api.verificarAcesso("APROVACAO","SALVAR","O seu perfil não possui permissão para aprovar !!!");
            if(!ret)
            {
                return false;
            }

            if(this.selectedAusencia.length == 0)
            {
                api.loadingOff();
                toast("Marque uma diária por ausência para aprovar !!!")
                return;
            }

            await api.post("aprovarAusencia", this.selectedAusencia).then(r=>{
                    if(r.status == 401)
                    {
                        api.loadingOff();
                        toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                        this.$router.push({ path: '/'});
                        return;
                    }
                    else if(r.status != 200)
                    {
                        api.loadingOff();
                        toast.error(r.data.message);
                        return;
                    }
                    else
                    {
                       setTimeout(  () => {
                        }, "2000");

                        toast("Diárias por Ausência Aprovadas com Sucesso !!!\n\n"+r.data.message);
                    }
            })

            this.getAllDiariasAusencia();
            this.selectedAusencia = [];
        },
        async aprovarEvento()
        {
            var ret = await api.verificarAcesso("APROVACAO","SALVAR","O seu perfil não possui permissão para aprovar !!!");
            if(!ret)
            {
                return false;
            }
            if(this.selectedEventos.length == 0)
            {
                api.loadingOff();
                toast("Marque uma diária de eventos para aprovar !!!")
                return;
            }

            api.loadingOn();
            await api.post("aprovarEvento", this.selectedEventos).then(r=>{

                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status != 200){

                    api.loadingOff();
                    toast.error(r.data.message);
                    return;
                }
                else
                {
                    setTimeout(  () => {
                    }, "2000");

                    toast("Diárias de Eventos Aprovados com Sucesso !!!\n\n"+r.data.message);
                }
            })

            this.getAllDiariasEventos();
            this.selectedEventos = [];
        },
        async reprovarAusencia()
        {
            if(this.selectedAusencia.length == 0)
            {
                toast.error("Marque uma diária por ausência para reprovar !!!")
                return;
            }
            else if (this.selectedAusencia.length > 1)
            {
                toast.error("Marque somente uma diária por ausência para reprovar !!!")
                return;
            }

            this.tiporeprovacao = 1;
            M.Modal.getInstance(document.getElementById("ModalReprovacao")).open();
        },
        async reprovarEvento()
        {
            if(this.selectedEventos.length == 0)
            {
                toast.error("Marque uma diária de evento para reprovar !!!")
                return;
            }
            else if (this.selectedEventos.length > 1)
            {
                toast.error("Marque somente uma diária de evento para reprovar !!!")
                return;
            }
            this.tiporeprovacao = 2;
            M.Modal.getInstance(document.getElementById("ModalReprovacao")).open();
        },
        async salvarReprovacao()
        {
            var ret = await api.verificarAcesso("APROVACAO","SALVAR","O seu perfil não possui permissão para aprovar/reprovar !!!");
            if(!ret)
            {
                return false;
            }
            
            if(this.motivoReprovacao === "")
            {
                api.loadingOff();
                toast.error("Informe o motivo da reprovação!");
                return;
            }

            if(this.tiporeprovacao == 1)
            {
                this.selectedAusencia[0].motivoreprovado = this.motivoReprovacao;
                await api.post("reprovarAusencia", this.selectedAusencia).then(r=>{
                    if(r.status == 401)
                    {
                        api.loadingOff();
                        toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                        this.$router.push({ path: '/'});
                        return;
                    }
                    else if(r.status != 200)
                    {
                        api.loadingOff();
                        toast.error(r.data.message);
                        return;
                    }
                    else
                    {
                       setTimeout(  () => {
                        }, "2000");

                        toast("Diárias por Ausência Aprovadas com Sucesso !!!\n\n"+r.data.message);
                    }
                });

                document.getElementById("txt_ReprovacaoEvento").value = "";
                this.motivoReprovacao = "";
                M.updateTextFields();
                M.Modal.getInstance(document.getElementById("ModalReprovacao")).close();
                this.getAllDiariasAusencia();
                this.selectedAusencia = [];
            }
            else if(this.tiporeprovacao == 2)
            {
                this.selectedEventos[0].motivoreprovado = this.motivoReprovacao;
                await api.post("reprovarEvento", this.selectedEventos).then(r=>{
                    if(r.status == 401)
                    {
                        api.loadingOff();
                        toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                        this.$router.push({ path: '/'});
                        return;
                    }
                    else if(r.status != 200)
                    {
                        api.loadingOff();
                        toast.error(r.data.message);
                        return;
                    }
                    else
                    {
                       setTimeout(  () => {
                        }, "2000");

                        toast("Diárias por Ausência Aprovadas com Sucesso !!!\n\n"+r.data.message);
                    }
                });

                document.getElementById("txt_ReprovacaoEvento").value = "";
                this.motivoReprovacao = "";
                M.updateTextFields();
                M.Modal.getInstance(document.getElementById("ModalReprovacao")).close();
                this.getAllDiariasEventos();
                this.selectedAusencia = [];
            }





            //this.tiporeprovacao = 1; ausencia
            //this.tiporeprovacao = 2; evento

        },
        async getAllDiariasAusencia()
        {
            api.loadingOn();
            await api.get("getallDiariasAusenciaAprov?aprovacao=true").then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    r.data.diarias.forEach( i => {
                        i.datadiaria = api.corrigirData(i.datadiaria);
                    })
                    this.lstAusencias = r.data.diarias;
                }
                else if(r.status == 400){
                    toast.error(r.data.message);
                }
                api.loadingOff();
            });
        },
        async getAllDiariasEventos()
        {
            api.loadingOn();
            await api.get("getallDiariasEventosAprov?aprovacao=true").then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    r.data.diarias.forEach( i => {
                        i.datadiaria = api.corrigirData(i.datadiaria);
                    })
                    this.lstEventos = r.data.diarias;
                }
                else if(r.status == 400){
                    toast.error(r.data.message);
                }
                api.loadingOff();
            });
        },
        LimparCampos()
        {
            this.selectedRows = [];
            this.lstEventos = [];
            this.lstAusencias = [];
        }
    },
    mounted()
    {
        //############## Modal ###############
        let optmodal = {
            dismissible:true,
            onCloseEnd:function()
            {
            }
        }
        var mdl = document.getElementById('ModalReprovacao');
        M.Modal.init(mdl, optmodal); 
        //######## Modal Cadastro ############

        M.updateTextFields();
        resize();

    },
    created()
    {
        this.getAllDiariasAusencia();
        this.getAllDiariasEventos();
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
        background-color: #de001f !important;
    }

    .tabs li a 
    {
        color: #2c3e50 !important;
        font-size: small;
        font-weight: bold;
    }
    
    .tabs .indicator
    {
        background-color:#000;
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