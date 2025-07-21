<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CADASTRAR FUNDOS DE RESERVA</h5>
            <div class="divider" style="height: 10px;"></div>
            <br><br><br>
            <div class="row ">
                <button id="CadastrarEvento" @click="Cadastrar($event)" class="waves-effect waves-light btn right btnsEventos" href="#FormCadastro">Cadastrar</button>
                <button id="EditarEvento" @click="UpdateEvento($event)" class="waves-effect waves-light btn right btnsEventos">Editar</button>
                <button id="ExcluirEvento" @click="DeleteEvento($event)" class="waves-effect waves-light btn right btnsEventos">Excluir</button>  
            </div>
            <br><!-- tabela de eventos -->
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table :items="Rows"  class="centered striped" id="tabDados">
                        <thead style="height:60px;border-bottom: solid;border-width: thin;">
                            <tr>
                            <th>Marcar</th>
                            <th>Codigo</th>
                            <th>Descição</th>
                            <th>%</th>
                            <th>Ativo</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="ret in lstFundosRes" :key="ret.codfundores">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="ret.codfundores" v-model="selectedRows" :value="ret"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{ret.codfundores}}</td>
                                <td>{{ret.descricao}}</td>
                                <td>{{ret.porcent}}</td>
                                <td v-if="ret.ativo">
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

    <!-- Modal Structure -->
    <div id="FormCadastro" class="modal">
        <div class="modal-content">
            <form v-on:submit.prevent="onSubmit">
                <h5 style="font-weight: bold;">{{titulomodal}}</h5>
                <div class="divider" style="height: 10px;"></div>
                <!-- campos cadastro -->
                <br>
                <div style="padding: 15px;" class="z-depth-2">
                    <br>
                    <div class="row">
                        <div class="input-field col l2 m2 s6">
                            <input disabled id="txt_Retencao" v-model="codfundores" name="txt_Retencao" type="text">
                            <label for="txt_Retencao">Código</label>
                        </div>
                        <div class="input-field col l2 m3 s6 offset-m8 offset-l8" >
                                <label class="chkCenter" >
                                    <input v-model="ativo" id="chk_ativo" name="chk_ativo" type="checkbox" checked/>
                                    <span>Ativo</span>
                                </label>
                        </div>
                    </div>
                     <div class="row">
                        <div class="input-field col l10 m10 s12">
                            <input @keyup="UpperCase(this.descricao,'descricao')" v-model="descricao" id="txt_Descricao" name="txt_Descricao" type="text" >
                            <label for="txt_Descricao">Descrição</label>
                        </div>
                        <div class="input-field col l2 m2 s12">
                            <input @keyup="Moeda(this.porcent,'porcent')" v-model="porcent" id="txt_Valor" name="txt_Valor" type="text">
                            <label for="txt_Valor">%</label>
                        </div>
                    </div>
                    <br>
                </div>
                <br>
                <!-- campos cadastro -->
                <div class="divider"></div>
                <div id="modalbotoes">
                    <button type="submit" style="margin-left: 15px;margin-right: 15px;" id="SalvarEventoModal" @click="SalvarEvento($event)"  class="waves-effect waves-light btn right btnsEventos ">Salvar</button>
                    <button type="button" style="margin-left: 15px;" id="EditarEventoModal" @click="UpdateEvento($event)" class="waves-effect waves-light btn right btnsEventos ">Editar</button>
                </div>
            </form>
        </div>
    </div>
  </template>
  
  <script>
  //import staticImage from '@/assets/balancastop.png';
  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";
  const toast = useToast();

    
  export default {
    name: 'FundosReservaView',
    components: {
      MenuLateral
    },
    data () {
        return {      
            codfundores:"",     
            codnucleo:"",
            porcent:"0,00",
            descricao:"",
            ativo:true,
            selectedRows:[],
            lstFundosRes:[],
            flag:true,
            flagex:true,
            titulomodal:"",
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },  
    computed:{
        Rows() {
            var rows = 0;
            return this.lstFundosRes.find(() => {
                rows += 1;
                if(this.lstFundosRes.length == rows)
                {
                     setTimeout(  () => {
                        M.updateTextFields();
                        api.loadingOff();
                        this.resize();
                        window.addEventListener('resize', this.resize);
                    }, "1000");
                }
            })
        }
    },
    methods:
    {
        async Cadastrar(e)
        {
            if(this.flag)
            {
                this.titulomodal = "INCLUIR FUNDOS DE RESERVA";
            }
            this.flagex = false;
            
            e.preventDefault();
            var ret = await api.verificarAcesso("FUNDORES","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
            if(!ret)
            {
                return;
            }
            document.getElementById("EditarEventoModal").textContent= "Cancelar";
            this.LimparCampos();
            M.Modal.getInstance(document.getElementById("FormCadastro")).open();
            api.loadingOff();
        },
        async SalvarEvento(e)
        {

            if(this.descricao === "")
            {
                toast.error("Selecione a descrição do fundo de reserva !!!");
                return 0;
            }
            else if(this.porcent === "0,00")
            {
                toast.error("Informe o percentual !!!");
                return 0;
            }

            
            api.loadingOn();

            if(!this.flag)
            {
                let data = 
                {
                    CODFUNDORES:this.codfundores,
                    PORCENT:this.porcent,
                    DESCRICAO:this.descricao,
                    ATIVO:this.ativo,
                    DTALTERACAO:api.dataAtualcomHoras(),
                    CODUSUARIOALT:this.USUARIO.codusuarios,
                }

                this.flag = true;

                //#########################
                await api.post("updateFundosReserva", data).then(r=>{
                //#########################

                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                }
                else if(r.status != 200){
                    toast.error(r.data.message);
                }else{
                    
                    this.LimparCampos();
                    this.getAllFundosReserva();
                    toast("Fundo Atualizado com Sucesso !!!");
                }})
                e.preventDefault();
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                api.loadingOff();
            }
            else
            {
                let data = 
                {
                    CODFUNDORES:this.codfundores,
                    PORCENT:this.porcent,
                    DESCRICAO:this.descricao,
                    ATIVO:this.ativo,
                    DTCRIACAO:api.dataAtualcomHoras(),
                    CODUSUARIOCAD:this.USUARIO.codusuarios,
                }

               
                var ret = await api.verificarAcesso("RETENCOES","SALVAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }

                //#########################
                await api.post("cadFundosReserva", data).then(r=>{
                //#########################

                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                }
                else if(r.status != 200){
                    toast.error(r.data.message);
                }else{
                    
                    this.LimparCampos();
                    this.getAllFundosReserva();
                    toast("Fundo Cadastrado com Sucesso !!!");
                }})
                this.flagex = true;
                e.preventDefault();
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                api.loadingOff();
            }
        },
        async UpdateEvento(e)
        {
            e.preventDefault();
            if(this.flagex == false)//cancelar excluir
            {
                e.preventDefault();
                this.flagex = true;
                document.getElementById("SalvarEventoModal").classList.remove("disabled");
                document.getElementById("CadastrarEvento").classList.remove("disabled");
                document.getElementById("ExcluirEvento").textContent = "Excluir";
                document.getElementById("EditarEvento").textContent = "Editar";
                document.getElementById("EditarEventoModal").textContent= "Editar";
                this.LimparCampos();
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                return;
            }
            else if(this.selectedRows.length > 1)
            {
                e.preventDefault();
                toast("Marque somente um fundo para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                e.preventDefault();
                toast("Marque um fundo para editar !!!")
                return;
            }

            if(this.flag)
            {
                var ret = await api.verificarAcesso("FUNDORES","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }
                this.titulomodal = "EDITAR FUNDO DE RESERVA";
                M.Modal.getInstance(document.getElementById("FormCadastro")).open();
                document.getElementById("txt_Retencao").value = this.selectedRows[0].codfundores;
                document.getElementById("txt_Valor").value = this.selectedRows[0].porcent;
                document.getElementById("txt_Descricao").value = this.selectedRows[0].descricao;

                this.codfundores = this.selectedRows[0].codfundores;
                this.porcent = this.selectedRows[0].porcent;
                this.descricao = this.selectedRows[0].descricao;
                this.ativo = this.selectedRows[0].ativo;
                this.flag = false;
                document.getElementById("ExcluirEvento").classList.add("disabled");
                document.getElementById("EditarEventoModal").textContent = "Cancelar";
                M.updateTextFields();
                api.loadingOff();
            }
            else//cancelar ediçao
            {
                this.flag = true;
                document.getElementById("EditarEventoModal").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                this.LimparCampos();
            }
        },
        async DeleteEvento(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um fundo para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um fundo para excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("FUNDORES","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
                if(!ret)
                {
                    return;
                }

                api.loadingOff();
                this.flagex = false;
                document.getElementById("SalvarEventoModal").classList.add("disabled");
                document.getElementById("CadastrarEvento").classList.add("disabled");
                document.getElementById("EditarEvento").textContent = "Cancelar";
                document.getElementById("ExcluirEvento").textContent = "Confirma?";
                M.updateTextFields();
            }
            else
            {
                api.loadingOn();
                let data = {
                    codfundores: this.selectedRows[0].codfundores
                }
                api.delete("deleteFundosReserva", data).then(r=>{
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
                        toast("Fundo Excluido com Sucesso !!!");
                        this.getAllFundosReserva();
                    }})
                this.flagex = true;
                document.getElementById("ExcluirEvento").textContent = "Excluir";
                document.getElementById("SalvarEventoModal").classList.remove("disabled");
                document.getElementById("CadastrarEvento").classList.remove("disabled");
                document.getElementById("EditarEvento").textContent = "Editar";
            }
        },
        LimparCampos()
        {
            this.codfundores = "";
            this.porcent = "0,00";
            this.descricao = "";
            this.ativo = true;
            this.selectedRows = [];

            document.getElementById("txt_Retencao").value = "";
            document.getElementById("txt_Valor").value = "0,00";
            document.getElementById("txt_Descricao").value = "";
            M.FormSelect.init(document.querySelectorAll('select'));
            M.updateTextFields();
        },
        async getAllFundosReserva()
        {
            api.loadingOn();
            await api.get("getallFundosReserva").then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstFundosRes = r.data.fundosreserva;
                    if(this.lstFundosRes.length == 0)
                    {
                        api.loadingOff();
                    }
                }
            });
        },
        resize()
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

                var PxAdicional = 365;
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
        },
        UpperCase(valor,variavel)
        {
           this[variavel] = valor.toUpperCase();
        },
        toUpperCase(input) 
        {
            return input ? input.toUpperCase() : '';
        },
        handleUpperCase(field, part) 
        {
            part[field] = this.toUpperCase(part[field]);
        },
        handleMoeda(field, part)
        {
            part[field] = api.Moeda(part[field]);
        },
        Moeda(valor,variavel)
        {
            this[variavel] = api.Moeda(valor);
        }
    },
    mounted()
    {
        
        M.AutoInit()
        
        let optmodal = {
            dismissible:false,
			onCloseEnd:function()
			{
                document.getElementById("EditarEventoModal").style.display = "";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                document.getElementById("EditarEventoModal").style.display = "";
                document.getElementById("ExcluirEvento").classList.remove("disabled");

                M.updateTextFields();
			},
			onOpenEnd:function()
			{
                var elems = document.querySelectorAll('.fixed-action-btn');
                M.FloatingActionButton.init(elems, {
                direction: 'left'
                });
                
                M.updateTextFields();
			}
        }

        var mdl = document.getElementById('FormCadastro');
        M.Modal.init(mdl, optmodal);

        var elems = document.querySelectorAll('.fixed-action-btn');
        M.FloatingActionButton.init(elems, {direction: 'left'});

    },
    created(){
        this.getAllFundosReserva();
    },
  }
  </script>
  <style scoped>

    .deletedrow
    {
        border: 2px solid red;
    }

    #modalbotoes
    {
        margin-top: 20px;
/*         margin-bottom: 20px; */
        display: flex;
        flex-direction: row-reverse;
    }
    #ththead
    {
        height:60px;
        border-bottom: solid;
        border-width: medium;
        border-bottom-color: initial;
    }
    #conpart 
    {
        max-width: 100%;
       
        display: grid;
    }
    #tblpart 
    {
        width: 100%;

    }
    .clickable 
    {
        cursor: pointer;
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
    .modal
    {
        padding: 15px;
        width: 70%;
        max-height: 80%;
    }
    .modal .modal-content 
    {
        padding: 25px;
    }
    .fixed-action-btn 
    {
        position: unset;
    }
    .fixed-action-btn ul 
    {

        position: relative;
        bottom: 20px;
    }
    .fixed-action-btn.direction-left ul, .fixed-action-btn.direction-right ul 
    {
        text-align: right;
        right: 0px;
        top: 76%;
        transform: translateY(25%);
        height: 100%;
        left: auto;
        width: 500px;
    }
    .porcent
    {
        width: 55px;
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
        .modal .modal-content 
        {
            padding: 10px;
        }
        .modal 
        {
            padding: 15px;
            width: 90%;
        }
        #trth
        {
            height: auto;
        }
        #ththead
        {
            height:auto;
        }
        #tbody
        {
            margin-left: 95px;
        }
        .thth
        {
            height: 71px;
        }
        table.responsive-table tbody 
        {
            display: block;
            width: auto;
            position: absolute;
            overflow-x: auto;
            white-space: nowrap;
        }
        .porcent
        {
            width: 100%;
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
        .modal .modal-content 
        {
            padding: 0px;
        }
    }
    @media only screen and (max-height: 930px) 
    {
        #conteudo
        {
            overflow-y:scroll;
            padding: 20px;
        }
        #ththead
        {
            height: 398px;
        }
        .thth
        {
            height: 71px;
        }
    }
    @media only screen and (max-width: 601px) 
    {
        .thth
        {
            height: 65px;
        }
        #tbody[data-v-01228925] 
        {
            margin-left: 75px;
        }
    }
  </style>