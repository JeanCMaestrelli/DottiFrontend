<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CADASTRO DE GRUPOS</h5>
            <div class="divider" style="height: 10px;"></div>
            <br>
            <div class="painel z-depth-1">
                <br>
                <form v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col l2 m2 s12">
                                <input disabled v-model="CODGRUPO" id="txt_Codigo" name="txt_Codigo" type="text">
                                <label for="txt_Codigo">Código</label>
                            </div> 
                            <div class="input-field col l2 m2 s12 ">
                                <input v-model="GRUPO" @keyup="UpperCase(GRUPO,'GRUPO')" id="txt_Grupo" type="text" class="validate" required 
                                oninvalid="this.setCustomValidity('Informe o nome do grupo!')"
                                onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_Grupo">Grupo</label>
                            </div>
                            <div class="input-field col l6 m6 s8 ">
                                <input v-model="DESCRICAO" @keyup="UpperCase(DESCRICAO,'DESCRICAO')" id="txt_Descricao"  type="text" class="validate" required 
                                oninvalid="this.setCustomValidity('Informe a descrição!')"
                                onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_Descricao">Descrição</label>
                            </div>
                            <div class="input-field col l2 m2 s4" >
                                <label class="chkCenter" >
                                    <input v-model="ATIVO" id="chk_ativo" name="chk_ativo" type="checkbox" checked/>
                                    <span>Ativo</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row ">
                        <button id="SalvarEvento" @click="salvarGrupos($event)" class="waves-effect waves-light btn right btnsEventos">Cadastrar</button>
                        <button id="EditarEvento" @click="editarGrupos($event)" class="waves-effect waves-light btn right btnsEventos">Editar</button>
                        <button id="ExcluirEvento" @click="excluirGrupos($event)" class="waves-effect waves-light btn right btnsEventos">Excluir</button>
                    </div>
                </form>
                <br>
            </div>
            <br>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table  class="centered striped" id="tabDados">
                        <thead>
                        <tr>
                            <th>Marcar</th>
                            <th>Codigo</th>
                            <th>Grupo</th>
                            <th>Descrição</th>
                            <th>Ativo</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr :items="Rows" v-for="tipo in batatal" :key="tipo.codgrupo">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="tipo.codgrupo" v-model="selectedRows" :value="tipo"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{ tipo.codgrupo }}</td>
                                <td>{{ tipo.grupo }}</td>
                                <td>{{ tipo.descricao }}</td>
                                <td v-if="tipo.ativo === true">
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
  import staticImage from '@/assets/balancastop.png';
  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";
  const toast = useToast();

  export default {
    name: 'GruposView',
    components: {
      MenuLateral
    },
    data () {
        return {
            batatal:[],
            CODGRUPO: "",
            GRUPO:"",
            DESCRICAO: "",
            CODUSUARIOCAD : "",
            ATIVO:true,
            DTCRIACAO : "",
            CODUSUARIOALT : "",
            DTALTERACAO : "",
            selectedRows:[],
            flag:true,
            flagex:true,
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    computed:{
        Rows() {
            var rows = 0;
            return this.batatal.find(() => {
                rows += 1;
                if(this.batatal.length == rows)
                {
                     setTimeout(  () => {
                        M.updateTextFields();
                        api.loadingOff();
                        resize();
                    }, "1000");
                }
            })
        }
    },
    methods:
    {
        async salvarGrupos(e)
        {

            if(this.GRUPO === "")
            {
                return false;
            }

            let data = {
                CODGRUPO: this.CODGRUPO,
                GRUPO: this.GRUPO,
                DESCRICAO: this.DESCRICAO,
                ATIVO: this.ATIVO,
                CODUSUARIOCAD:this.USUARIO.codusuarios,
                CODUSUARIOALT:this.USUARIO.codusuarios,
                DTCRIACAO:api.dataAtual(),
                DTALTERACAO:api.dataAtual()
            }

            if(this.flag)
            {
                var ret1 = await api.verificarAcesso("GRUPOS","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
                if(!ret1)
                {
                    return;
                }
                await api.post("cadGrupos", data).then(r=>{
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
                    this.getAllGrupos();
                    toast("Grupo Cadastrado com Sucesso !!!");
                }})
                e.preventDefault();
                api.loadingOff();
                return true;
            }
            else
            {
                api.loadingOn();
                await api.post("updateGrupos", data).then(r=>
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
                        this.getAllGrupos();
                        toast("Grupo Atualizado com Sucesso !!!");
                    }
                });
                e.preventDefault();
                this.flag = true;
                document.getElementById("EditarEvento").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                this.LimparCampos();
                api.loadingOff();
                return true;
            }

        },
        async editarGrupos(e)
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

                toast("Marque somente um Grupo para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um Grupo para editar !!!")
                return;
            }

            if(this.flag)
            {
                api.loadingOn();
                var ret = await api.verificarAcesso("GRUPOS","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }
                document.getElementById("txt_Codigo").value = this.selectedRows[0].codgrupo;
                document.getElementById("txt_Descricao").value = this.selectedRows[0].descricao;
                document.getElementById("txt_Grupo").value = this.selectedRows[0].grupo;
                document.getElementById("chk_ativo").value = this.selectedRows[0].ativo;
                
                this.CODGRUPO = this.selectedRows[0].codgrupo;
                this.DESCRICAO = this.selectedRows[0].descricao;
                this.GRUPO = this.selectedRows[0].grupo;
                this.ATIVO = this.selectedRows[0].ativo;

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
        async excluirGrupos(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um Grupo para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um Grupo para excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("GRUPOS","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
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
                    codgrupo: this.selectedRows[0].codgrupo
                }
                api.delete("deleteGrupos", data).then(r=>{
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
                        toast("Grupo Excluido com Sucesso !!!");
                        this.getAllGrupos();
                        this.LimparCampos();
                    }})
                this.flagex = true;
                document.getElementById("ExcluirEvento").textContent = "Excluir";
                document.getElementById("SalvarEvento").classList.remove("disabled");
                document.getElementById("EditarEvento").textContent = "Editar";
            }
        },
        LimparCampos()
        {
            this.CODGRUPO = "";
            this.GRUPO = "";
            this.DESCRICAO = "";
            this.ATIVO = true;

            document.getElementById("txt_Codigo").value = "";
            document.getElementById("txt_Descricao").value = "";
            document.getElementById("txt_Grupo").value = "";

            this.selectedRows  = [];

            M.updateTextFields();
        },
        async getAllGrupos()
        {
            api.loadingOn();
            await api.get("getallGrupos").then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.batatal = r.data.grupos;
                if(this.batatal.length == 0)
                {
                    api.loadingOff();
                }
                M.updateTextFields();
            }
            else
            {
                api.loadingOff();
            }
            });
            
        },
        Moeda(valor,variavel)
        {
            this[variavel] = api.Moeda(valor);
        },
        Datas(valor,variavel,tipo=1)
        {
            if(tipo == 1)//aplicar mascara
            {
                this[variavel] = api.aplicarMascaraData(valor);
            }
            else if(tipo == 2)//consistir data
            {
                if(valor) 
                {
                    var result = api.validarData(valor);

                    if(!result)
                    {
                        toast.error("Data inválida! Por favor, insira uma data válida no formato DD/MM/AAAA.");
                        this[variavel] = "";
                        document.getElementById("txt_Data").value = "";
                        M.updateTextFields();
                    }
                }
            }
            
        },
        PickerOpen(obj)
        {
            var elems = document.getElementById(obj);
            var instance = M.Datepicker.getInstance(elems);
            instance.open();
        },
        handleInsertData()
        {
            document.getElementById("txt_Data").value = document.getElementById("hdn_Data").value;
            this.DATA = document.getElementById("hdn_Data").value;
        },
        UpperCase(valor,variavel)
        {
           this[variavel] = valor.toUpperCase();
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
        this.getAllGrupos();
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

    thead
    {
        height:60px;
        border-bottom: solid;
        border-width: thin;
    }
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
        thead
        {
            border-width: medium;
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