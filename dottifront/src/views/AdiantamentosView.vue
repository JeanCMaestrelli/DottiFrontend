<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CADASTRO DE ADIANTAMENTOS</h5>
            <div class="divider" style="height: 10px;"></div>
            <br>
            <div class="painel z-depth-1">
                <br>
                <form v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col l1 m1 s12">
                                <input disabled v-model="CODADIANTAMENTO" id="txt_Codigo" name="txt_Codigo" type="text">
                                <label for="txt_Codigo">Código</label>
                            </div>
                            <div class="input-field col l3 m3 s12">
                                    <select v-model="CODSOCIO" id="txt_Socio" name="txt_Socio" >
                                        <option value="" disabled selected>Selecione</option>
                                        <option v-for="option in lstSocios" :key="option.codsocio" :value=option.codsocio>
                                            {{ option.nome }}
                                        </option>
                                    </select>
                                    <label>Sócio Tomador</label>
                            </div>
                            <div class="input-field col l3 m3 s12">
                                <input @keyup="UpperCase(this.MOTIVO,'MOTIVO')" v-model="MOTIVO" id="txt_Motivo" name="txt_Motivo" type="text" >
                                <label for="txt_Motivo">Motivo</label>
                            </div>
                            <div class="input-field col l2 m2 s12">
                                <input @keyup="Moeda(this.VALOR,'VALOR')" v-model="VALOR" id="txt_Valor" name="txt_Valor" type="text">
                                <label for="txt_Valor">Valor</label>
                            </div>
                            <div class="input-field col l3 m3 s12">
                                <i class="material-icons prefix clickable" @click="PickerOpen('hdn_Data')">insert_invitation</i>
                                <input type="text" v-model="DATA"  id="txt_Data"
                                @keyup="Datas(this.DATA,'DATA',1)"  @blur="Datas(this.DATA,'DATA',2)" maxlength="10" placeholder="DD/MM/AAAA">
                            </div>
                        </div>
                    </div>
                    <input v-model="hdndata" @change="handleInsertData()" hidden type="text" class="datepicker" id="hdn_Data">
                    <br>
                    <div class="row ">
                        <button id="SalvarEvento" @click="salvarAdiantamentos($event)" class="waves-effect waves-light btn right btnsEventos">Cadastrar</button>
                        <button id="EditarEvento" @click="editarAdiantamentos($event)" class="waves-effect waves-light btn right btnsEventos">Editar</button>
                        <button id="ExcluirEvento" @click="excluirAdiantamentos($event)" class="waves-effect waves-light btn right btnsEventos">Excluir</button>
                    </div>
                </form>
                <br>
            </div>
            <br>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table :items="Rows" class="centered striped" id="tabDados">
                        <thead>
                        <tr>
                            <th>Marcar</th>
                            <th>Código</th>
                            <th>Sócio Tomador</th>
                            <th>Motivo</th>
                            <th>Valor</th>
                            <th>Data</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tipo in lstAdiantamentos" :key="tipo.codadiantamento">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="tipo.codadiantamento" v-model="selectedRows" :value="tipo"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{ tipo.codadiantamento }}</td>
                                <td>{{ tipo.nome }}</td>
                                <td>{{ tipo.motivo }}</td>
                                <td>{{ tipo.valor }}</td>
                                <td>{{ tipo.data }}</td>
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
    name: 'AdiantamentosView',
    components: {
      MenuLateral
    },
    data () {
        return {
            CODADIANTAMENTO:"",
            CODSOCIO:"",
            DATA:"",
            VALOR:"0,00",
            MOTIVO:"",
            CODUSUARIOCAD:"",
            CODUSUARIOALT:"",
            DTCRIACAO:"",
            DTALTERACAO:"",
            hdndata:"",
            lstAdiantamentos:[],
            lstSocios:[],
            selectedRows:[],
            flag:true,
            flagex:true,
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    watch: {
        VALOR(newValue) {
            this.Moeda(newValue, 'VALOR');
        }
    },
    computed:{
        Rows() {
            var rows = 0;
            return this.lstSocios.find(() => {
                rows += 1;
                if(this.lstSocios.length == rows)
                {
                     setTimeout(  () => {
                        M.FormSelect.init(document.querySelectorAll('select'));
                        api.loadingOff();
                        resize();
                    }, "1000");
                }
            })
        }
    },
    methods:
    {
        async salvarAdiantamentos(e)
        {
            if(this.CODSOCIO === "")
            {
                toast.error("Selecione o Sócio Tomador !!!");
                return false;
            }
            else if(this.MOTIVO === "")
            {
                toast.error("Informe o motivo !!!");
                return false;
            }
            else if(this.VALOR === "0,00")
            {
                toast.error("Informe o valor do adiantamento !!!");
                return false;
            }
            else if(this.DATA === "")
            {
                toast.error("Informe a data do adiantamento !!!");
                return false;
            }

            let data = {
                CODADIANTAMENTO: this.CODADIANTAMENTO,
                CODSOCIO: this.CODSOCIO,
                VALOR: this.VALOR,
                DATA: this.DATA,
                MOTIVO: this.MOTIVO,
                CODUSUARIOCAD:this.USUARIO.codusuarios,
                CODUSUARIOALT:this.USUARIO.codusuarios,
                DTCRIACAO:api.dataAtual(),
                DTALTERACAO:api.dataAtual()
            }

            if(this.flag)
            {
                var ret1 = await api.verificarAcesso("ADIANTAMENTOS","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
                if(!ret1)
                {
                    return;
                }
                await api.post("cadAdiantamentos", data).then(r=>{
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
                    this.getAllAdiantamentos();
                    toast("Adiantamento Cadastrado com Sucesso !!!");
                }})
                e.preventDefault();
                api.loadingOff();
                return true;
            }
            else
            {
                api.loadingOn();
                await api.post("updateAdiantamentos", data).then(r=>
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
                        this.getAllAdiantamentos();
                        toast("Adiantamento Atualizado com Sucesso !!!");
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
        async editarAdiantamentos(e)
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

                toast("Marque somente um Adiantamento para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um Adiantamento para editar !!!")
                return;
            }

            if(this.flag)
            {
                api.loadingOn();
                var ret = await api.verificarAcesso("ADIANTAMENTOS","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }

                this.CODADIANTAMENTO = this.selectedRows[0].codadiantamento;
                this.CODSOCIO = this.selectedRows[0].codsocio;
                this.VALOR = this.selectedRows[0].valor;
                this.DATA = this.selectedRows[0].data;
                this.MOTIVO = this.selectedRows[0].motivo;

                document.getElementById("txt_Codigo").value = this.selectedRows[0].codadiantamento;
                document.getElementById("txt_Socio").value = this.selectedRows[0].codsocio;
                document.getElementById("txt_Valor").value = this.selectedRows[0].valor;
                document.getElementById("txt_Data").value = this.selectedRows[0].data;
                document.getElementById("txt_Motivo").value = this.selectedRows[0].motivo;

                this.flag = false;
                
                M.FormSelect.init(document.querySelectorAll('select'));

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
        async excluirAdiantamentos(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um Adiantamento para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um Adiantamento para excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("ADIANTAMENTOS","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
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
                    CODADIANTAMENTO: this.selectedRows[0].codadiantamento
                }
                api.delete("deleteAdiantamentos", data).then(r=>{
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
                        toast("Adiantamento Excluido com Sucesso !!!");
                        this.getAllAdiantamentos();
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
            this.CODADIANTAMENTO = "";
            this.CODSOCIO = "";
            this.VALOR = "0,00";
            this.DATA = "";
            this.MOTIVO = "";

            document.getElementById("txt_Codigo").value = "";
            document.getElementById("txt_Socio").value = "";
           // document.getElementById("txt_Valor").value = "";
            document.getElementById("txt_Data").value = "";
            document.getElementById("txt_Motivo").value = "";
            document.getElementById("hdn_Data").value = "";
            this.selectedRows  = [];

            M.FormSelect.init(document.querySelectorAll('select'));
            M.updateTextFields();
        },
        async getAllSocios()
        {
            api.loadingOn();
            await api.get("getallSocios").then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.lstSocios = r.data.socios;
                if(this.lstSocios.length == 0)
                {
                    api.loadingOff();
                }
            }
            else
            {
                api.loadingOff();
            }
            });
        },
        async getAllAdiantamentos()
        {
            api.loadingOn();
            await api.get("getallAdiantamentos").then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.lstAdiantamentos = r.data.tipos;
                if(this.lstAdiantamentos.length == 0)
                {
                    api.loadingOff();
                }
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
            //##############datepicker
            let dataopt = {
            showDaysInNextAndPreviousMonths:false,
            disableWeekends:false,
            i18n: {
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
            //Botões
            cancel: 'cancelar',
            clear:'Limpar',
            done:'Selecionar'},
            // Formato da data que aparece no input
            format: 'dd/mm/yyyy',
            setDefaultDate:false,
            defaultDate:new Date(),
            showMonthAfterYear: false,
            showClearBtn: true,
			onClose:function()
			{
				M.updateTextFields();
			}
        }
        var dtEl = document.querySelectorAll('.datepicker');
        M.Datepicker.init(dtEl, dataopt);
        //##############datepicker
        M.updateTextFields();
        resize();
        setTimeout(() => {
            const gif = document.getElementById('bkgMenuLateral');
            gif.src = staticImage;
        }, 2500); 
    },
    created()
    {
        this.getAllSocios();
        this.getAllAdiantamentos();
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
  .clickable 
    {
        cursor: pointer;
    }
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