<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CADASTRAR TIPOS DE AUSÊNCIA</h5>
            <div class="divider" style="height: 10px;"></div>
            <br><br>
            <form v-on:submit.prevent="onSubmit">
                <div class="row">
                    <div class="col s12">
                        <div class="input-field col l3 m3 s12">
                            <input disabled v-model="CODAUSENCIA" id="txt_Codigo" name="txt_Codigo" type="text">
                            <label for="txt_Codigo">Código</label>
                        </div>
                        <div class="input-field col l7 m7 s12">
                            <input oninput="this.value = this.value.toUpperCase()" v-model="DESCRICAO" id="txt_Descricao" name="txt_Descricao" type="text" class="validate" required 
                            oninvalid="this.setCustomValidity('Informe a descrição !!!')"
                            onchange="try{setCustomValidity('')}catch(e){}">
                            <label for="txt_Descricao">Descrição</label>
                        </div>
                        <div class="input-field col l2 m2 s12" style="margin-bottom: 30px;">
                            <label class="center" style="padding-left: 30px;">
                                <input v-model="ATIVO" id="chk_Ativo" name="chk_Ativo" type="checkbox"  />
                                <span style="padding-left: 30px;">Ativo</span>
                            </label>
                        </div>
                    </div>
                </div>
                <br>
                <div class="row ">
                    <button id="SalvarEvento" @click="salvarAusencia($event)" class="waves-effect waves-light btn right btnsEventos">Salvar</button>
                    <button id="EditarEvento" @click="editarAusencia($event)" class="waves-effect waves-light btn right btnsEventos">Editar</button>
                    <button id="ExcluirEvento" @click="excluirAusencia($event)" class="waves-effect waves-light btn right btnsEventos">Excluir</button>
                </div>
            </form>
            <br>
            <br>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table :items="Rows" class="centered striped" id="tabDados">
                        <thead style="height:60px;border-bottom: solid;border-width: thin;">
                        <tr>
                            <th>Marcar</th>
                            <th>Codigo</th>
                            <th>Descrição</th>
                            <th>Ativo</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tipo in lstTipos" :key="tipo.codausencia">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="tipo.codausencia" v-model="selectedRows" :value="tipo"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{ tipo.codausencia }}</td>
                                <td>{{ tipo.descricao }}</td>
                                <td v-if="tipo.ativo === '1'">
                                    <label>
                                    <input type="checkbox" checked="checked"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td v-else>
                                    <label>
                                    <input type="checkbox"/>
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

  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";
  const toast = useToast();

  export default {
    name: 'TiposAusenciaView',
    components: {
      MenuLateral
    },
    data () {
        return {
            CODAUSENCIA:"",
            DESCRICAO:"",
            ATIVO:"0",
            CODUSUARIOCAD:"",
            CODUSUARIOALT:"",
            DTCRIACAO:"",
            DTALTERACAO:"",
            lstTipos:[],
            selectedRows:[],
            flag:true,
            flagex:true,
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    computed:{
        Rows() {
            var rows = 0;
            return this.lstTipos.find(() => {
                rows += 1;
                if(this.lstTipos.length == rows)
                {
                     setTimeout(  () => {
                        api.loadingOff();
                        resize();
                    }, "1000");
                }
            })
        }
    },
    methods:
    {
        async salvarAusencia(e)
        {
            if(this.DESCRICAO === "")
            {
                return false;
            }

            let data = {
                CODAUSENCIA: this.CODAUSENCIA,
                DESCRICAO: this.DESCRICAO,
                ATIVO: this.ATIVO ? "1":"0",
                CODUSUARIOCAD:this.USUARIO.codusuarios,
                CODUSUARIOALT:this.USUARIO.codusuarios,
                DTCRIACAO:api.dataAtual(),
                DTALTERACAO:api.dataAtual()
            }

            if(this.flag)
            {
                var ret1 = await api.verificarAcesso("TIPOAUSENCIA","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
                if(!ret1)
                {
                    return;
                }
                await api.post("cadtiposausencia", data).then(r=>{
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
                    this.getAllTipos();
                    toast("Tipo Ausência Cadastrada com Sucesso !!!");
                }})
                e.preventDefault();
                api.loadingOff();
                return true;
            }
            else
            {
                api.loadingOn();
                await api.post("updatetiposausencia", data).then(r=>
                {
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
                        this.getAllTipos();
                        toast("Tipo Ausência Atualizada com Sucesso !!!");
                    }
                })
                e.preventDefault();
                this.flag = true;
                document.getElementById("EditarEvento").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                this.LimparCampos();
                api.loadingOff();
                return true;
            }

        },
        async editarAusencia(e)
        {
            e.preventDefault();
            if(this.flagex == false)//cancelar excluir
            {
                this.flagex = true;
                document.getElementById("SalvarEvento").classList.remove("disabled");
                document.getElementById("ExcluirEvento").textContent = "Excluir";
                document.getElementById("EditarEvento").textContent = "Editar";
                this.LimparCampos();
                return;
            }
            else if(this.selectedRows.length > 1)
            {

                toast("Marque somente um tipo de ausência para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque uma ausência para editar !!!")
                return;
            }

            if(this.flag)
            {
                api.loadingOn();
                var ret = await api.verificarAcesso("TIPOAUSENCIA","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }

                document.getElementById("txt_Codigo").value = this.selectedRows[0].codausencia;
                document.getElementById("txt_Descricao").value = this.selectedRows[0].descricao;
                document.getElementById("chk_Ativo").checked = this.selectedRows[0].ativo == "1" ? true : false;
                this.CODAUSENCIA = this.selectedRows[0].codausencia;
                this.DESCRICAO = this.selectedRows[0].descricao;
                this.ATIVO = this.selectedRows[0].ativo == "1" ? true : false;

                this.flag = false;

                document.getElementById("ExcluirEvento").classList.add("disabled");
                document.getElementById("EditarEvento").textContent = "Cancelar";
                M.updateTextFields();
                api.loadingOff();
            }
            else//cancelar ediçao
            {
                this.flag = true;
                document.getElementById("EditarEvento").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                this.LimparCampos();
            }
        },
        async excluirAusencia(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um tipo de ausência para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um tipo de ausência para excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("TIPOAUSENCIA","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
                if(!ret)
                {
                    return;
                }

                api.loadingOff();
                this.flagex = false;
                document.getElementById("SalvarEvento").classList.add("disabled");
                document.getElementById("EditarEvento").textContent = "Cancelar";
                document.getElementById("ExcluirEvento").textContent = "Confirma?";
                M.updateTextFields();
            }
            else
            {
                api.loadingOn();
                let data = {
                    codTiposAusencia: this.selectedRows[0].codausencia
                }
                api.delete("deletetiposausencia", data).then(r=>{
                    this.LimparCampos();
                    if(r.status == 401)
                    {
                        api.loadingOff();
                        toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                        this.$router.push({ path: '/'});
                        return;
                    }
                    else if(r.status != 200){
                        api.loadingOff();
                        toast.error(r.response.data.message);
                    }else{
                        api.loadingOff();
                        toast("Tipo de Ausência Excluida com Sucesso !!!");
                        this.getAllTipos();
                    }})
                this.flagex = true;
                document.getElementById("ExcluirEvento").textContent = "Excluir";
                document.getElementById("SalvarEvento").classList.remove("disabled");
                document.getElementById("EditarEvento").textContent = "Editar";
            }
        },
        LimparCampos()
        {
            this.CODAUSENCIA = "";
            this.DESCRICAO = "";
            this.ATIVO = "0";
            document.getElementById("chk_Ativo").checked = false;
            document.getElementById("txt_Descricao").value = "";
            document.getElementById("txt_Codigo").value = "";
            this.selectedRows  = [];
            M.updateTextFields();
        },
        async getAllTipos()
        {
            api.loadingOn();
            await api.get("getalltiposausencia").then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.lstTipos = r.data.tipos;
            }
            });
        }
    },
    mounted()
    {
        M.updateTextFields();
        resize();
    },
    created()
    {
        this.getAllTipos();
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