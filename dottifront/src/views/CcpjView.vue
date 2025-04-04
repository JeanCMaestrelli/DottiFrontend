<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CONTAS DO CPJ</h5>
            <div class="divider" style="height: 10px;"></div>
            <br>
            <div class="painel z-depth-1">
                <br>
                <form v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col l2 m2 s12">
                                <input disabled v-model="CODCPJ" id="txt_Codigo" name="txt_Codigo" type="text">
                                <label for="txt_Codigo">Código</label>
                            </div> 
                            <div class="input-field col l2 m2 s12 ">
                                <input v-model="CPJ" @keyup="UpperCase(CPJ,'CPJ')" id="txt_CPJ" type="text" class="validate">
                                <label for="txt_CPJ">Cpj</label>
                            </div>
                            <div class="input-field col l6 m6 s8 ">
                                <input v-model="DESCRICAO" @keyup="UpperCase(DESCRICAO,'DESCRICAO')" id="txt_Descricao"  type="text" >
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
                        <button id="SalvarEvento" @click="salvarCpj($event)" class="waves-effect waves-light btn right btnsEventos">Cadastrar</button>
                        <button id="EditarEvento" @click="editarCpj($event)" class="waves-effect waves-light btn right btnsEventos">Editar</button>
                        <button id="ExcluirEvento" @click="excluirCpj($event)" class="waves-effect waves-light btn right btnsEventos">Excluir</button>
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
                            <th>Código</th>
                            <th>Conta</th>
                            <th>Descrição</th>
                            <th>Ativo</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr :items="Rows" v-for="cpj in lstCpj" :key="cpj.codcpj">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="cpj.codcpj" v-model="selectedRows" :value="cpj"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{ cpj.codcpj }}</td>
                                <td>{{ cpj.cpj }}</td>
                                <td>{{ cpj.descricao }}</td>
                                <td v-if="cpj.ativo === true">
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
    name: 'CcpjView',
    components: {
      MenuLateral
    },
    data () {
        return {
            lstCpj:[],
            CODCPJ: "",
            CPJ:"",
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
            return this.lstCpj.find(() => {
                rows += 1;
                if(this.lstCpj.length == rows)
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
        async salvarCpj(e)
        {

            if(this.CPJ === "")
            {
                toast.error("Informe o Código CPJ");
                return false;
            }
            if(this.DESCRICAO === "")
            {
                toast.error("Informe a Descrição");
                return false;
            }

            let data = {
                CODCPJ: this.CODCPJ,
                CPJ: this.CPJ,
                DESCRICAO: this.DESCRICAO,
                ATIVO: this.ATIVO,
                CODUSUARIOCAD:this.USUARIO.codusuarios,
                CODUSUARIOALT:this.USUARIO.codusuarios,
                DTCRIACAO:api.dataAtual(),
                DTALTERACAO:api.dataAtual()
            }

            if(this.flag)
            {
                var ret1 = await api.verificarAcesso("CPJ","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
                if(!ret1)
                {
                    return;
                }
                await api.post("cadCpj", data).then(r=>{
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
                    this.getAllCpj();
                    toast("Cpj Cadastrado com Sucesso !!!");
                }})
                e.preventDefault();
                api.loadingOff();
                return true;
            }
            else
            {
                api.loadingOn();
                await api.post("updateCpj", data).then(r=>
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
                        this.getAllCpj();
                        toast("Cpj Atualizado com Sucesso !!!");
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
        async editarCpj(e)
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

                toast("Marque somente um cpj para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um cpj para editar !!!")
                return;
            }

            if(this.flag)
            {
                api.loadingOn();
                var ret = await api.verificarAcesso("CPJ","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }
                document.getElementById("txt_Codigo").value = this.selectedRows[0].codcpj;
                document.getElementById("txt_Descricao").value = this.selectedRows[0].descricao;
                document.getElementById("txt_CPJ").value = this.selectedRows[0].cpj;
                document.getElementById("chk_ativo").value = this.selectedRows[0].ativo;
                
                this.CODCPJ = this.selectedRows[0].codcpj;
                this.DESCRICAO = this.selectedRows[0].descricao;
                this.CPJ = this.selectedRows[0].cpj;
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
        async excluirCpj(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um cpj para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um cpj para excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("CPJ","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
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
                    codcpj: this.selectedRows[0].codcpj
                }
                api.delete("deleteCpj", data).then(r=>{
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
                        toast("Cpj Excluido com Sucesso !!!");
                        this.getAllCpj();
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
            this.CODCPJ = "";
            this.CPJ = "";
            this.DESCRICAO = "";
            this.ATIVO = true;

            document.getElementById("txt_Codigo").value = "";
            document.getElementById("txt_Descricao").value = "";
            document.getElementById("txt_CPJ").value = "";

            this.selectedRows  = [];

            M.updateTextFields();
        },
        async getAllCpj()
        {
            api.loadingOn();
            await api.get("getallCpj").then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.lstCpj = r.data.cpj;
                if(this.lstCpj.length == 0)
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
        Datas(valor,variavel,cpj=1)
        {
            if(cpj == 1)//aplicar mascara
            {
                this[variavel] = api.aplicarMascaraData(valor);
            }
            else if(cpj == 2)//consistir data
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
        this.getAllCpj();
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