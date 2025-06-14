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
                            <div class="input-field col l2 m2 s12">
                                <input disabled v-model="CODADIANTAMENTO" id="txt_Codigo" name="txt_Codigo" type="text">
                                <label for="txt_Codigo">Código</label>
                            </div>
                            <div class="input-field col l4 m4 s12">
                                    <select @change="filtar('CODSOCIO')" v-model="CODSOCIO" id="txt_Socio" name="txt_Socio" >
                                        <option value="" selected>Selecione</option>
                                        <option v-for="option in lstSocios" :key="option.codsocio" :value=option.codsocio>
                                            {{ option.nome }}
                                        </option>
                                    </select>
                                    <label>Sócio Tomador</label>
                            </div>
                            <div class="input-field col l4 m4 s12">
                                <input @change="filtar('MOTIVO')" @keyup="UpperCase(this.MOTIVO,'MOTIVO')" v-model="MOTIVO" id="txt_Motivo" name="txt_Motivo" type="text" >
                                <label for="txt_Motivo">Motivo</label>
                            </div>
                            <div class="input-field col l2 m2 s12">
                                <input @change="filtar('VALOR')" @keyup="Moeda(this.VALOR,'VALOR')" v-model="VALOR" id="txt_Valor" name="txt_Valor" type="text">
                                <label for="txt_Valor">Valor</label>
                            </div>
                            
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field offset-l2 offset-m2 col l4 m4 s12">
                            <i class="material-icons prefix clickable" @click="PickerOpen('hdn_Data')">insert_invitation</i>
                            <input type="text" v-model="DATA"  id="txt_Data" 
                             @keyup="Datas(this.DATA,'DATA',1)"  @blur="Datas(this.DATA,'DATA',2)" maxlength="10" placeholder="DD/MM/AAAA">
                            <label for="txt_Data">Data Inicial</label>
                        </div>
                        <div class="input-field col l4 m4 s12">
                            <i class="material-icons prefix clickable" @click="PickerOpen('hdn_DataFinal')">insert_invitation</i>
                            <input type="text" v-model="DATAFINAL"  id="txt_DataFinal" 
                            @change="filtrarAdiantamentos()"  @keyup="Datas(this.DATAFINAL,'DATAFINAL',1)"  @blur="Datas(this.DATAFINAL,'DATAFINAL',2)" maxlength="10" placeholder="DD/MM/AAAA">
                            <label for="txt_DataFinal">Data Final</label>
                        </div>
                    </div>
                    <input v-model="hdndata" @change="handleInsertData('txt_Data','hdn_Data','DATA')" hidden type="text" class="datepicker" id="hdn_Data">
                    <input v-model="hdndatafinal" @change="handleInsertData('txt_DataFinal','hdn_DataFinal','DATAFINAL')" hidden type="text" class="datepicker" id="hdn_DataFinal">
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
                            <th @click="ordenarPor('limpar')" style="cursor: pointer;">Marcar</th>
                            <th @click="ordenarPor('codadiantamento')" style="cursor: pointer;">
                                Código <span v-if="ordemColuna === 'codadiantamento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'codadiantamento'">▼</span>
                            </th>
                            <th @click="ordenarPor('nome')" style="cursor: pointer;">
                                Sócio Tomador <span v-if="ordemColuna === 'nome' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'nome'">▼</span>
                            </th>
                            <th @click="ordenarPor('motivo')" style="cursor: pointer;">
                                Motivo <span v-if="ordemColuna === 'motivo' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'motivo'">▼</span>
                            </th>
                            <th @click="ordenarPor('valor')" style="cursor: pointer;">
                                Valor <span v-if="ordemColuna === 'valor' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'valor'">▼</span>
                            </th>
                            <th @click="ordenarPor('data')" style="cursor: pointer;">
                                Data <span v-if="ordemColuna === 'data' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'data'">▼</span>
                            </th>
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
  
  //import staticImage from '@/assets/balancastop.png';
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
            DATAFINAL:"",
            VALOR:"0,00",
            MOTIVO:"",
            CODUSUARIOCAD:"",
            CODUSUARIOALT:"",
            DTCRIACAO:"",
            DTALTERACAO:"",
            hdndata:"",
            hdndatafinal:"",
            lstAdiantamentos:[],
            lstSocios:[],
            lstGuardarAdiant:[],
            lstFiltros:[],
            selectedRows:[],
            flag:true,
            flagex:true,
            ordemColuna: null,
            ordem: "asc" ,
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

            this.lstAdiantamentos = this.lstGuardarAdiant;

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
                this.lstSocios = r.data.socios.filter(item => item.adiantamento == true );
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
                this.lstGuardarAdiant = this.lstAdiantamentos;
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
        handleInsertData(id,idhdn,variavel)
        {
            document.getElementById(id).value = document.getElementById(idhdn).value;
            this[variavel] = document.getElementById(idhdn).value;
            if(this['DATA'] !== "" && this['DATAFINAL'] !== "")
            {
                this.filtrarAdiantamentos();
            }
            else
            {
                this.lstAdiantamentos = this.lstGuardarAdiant;
            }
        },
        UpperCase(valor,variavel)
        {
           this[variavel] = valor.toUpperCase();
        },
        ordenarPor(coluna) 
        {
            /*if (!Object.prototype.hasOwnProperty.call(this.lstAdiantamentos[0], coluna)) 
            {
                this.ordemColuna = "";
                toast.error(`Coluna "${coluna}" não encontrada na lista.`);
                return;
            } */
            let aux = "";
            if(coluna === "limpar")
            {
                aux = "limpar";
                coluna = "codadiantamento";
            }

            this.lstAdiantamentos.sort((a, b) => 
            {
                let valorA = a[coluna];
                let valorB = b[coluna];

                // Tratar a coluna "data"
                if (coluna === "data") {
                    valorA = Date.parse(a[coluna].split('/').reverse().join('-'));
                    valorB = Date.parse(b[coluna].split('/').reverse().join('-'));
                }

                // Tratar valores numéricos ou strings
                if (coluna === "codadiantamento" || coluna === 'valor') {
                    valorA = api.converterParaNumero(valorA);
                    valorB = api.converterParaNumero(valorB);
                }

                // Ordenação
                if (valorA < valorB) {
                    return this.ordem === "asc" ? -1 : 1;
                }
                if (valorA > valorB) {
                    return this.ordem === "asc" ? 1 : -1;
                }
                return 0; // Igualdade
            });

            if(aux === "limpar")
            {
                this.ordemColuna = "";
                coluna = "";
                this.ordem = "desc";
            }

            // Alternar direção da ordem
            this.ordem = this.ordem === "asc" ? "desc" : "asc";
            this.ordemColuna = coluna; // Atualizar coluna atual

        },
        filtar(variavel) 
        {
            if(this[variavel] === "" || this[variavel] === "0,00")
            {
                if(this.lstAdiantamentos.length < this.lstGuardarAdiant.length)
                {
                    this.lstAdiantamentos = this.lstGuardarAdiant;

                    this.lstFiltros = this.lstFiltros.filter(item => item !== variavel);

                    this.lstFiltros.forEach(aux => {

                        this.lstAdiantamentos = this.lstAdiantamentos.filter(item => {
                        return item[aux.toLowerCase()].toLowerCase().includes(this[aux].toLowerCase());});

                    });
                }
                else
                {
                    this.lstAdiantamentos = this.lstGuardarAdiant;
                }
            }
            else
            {
                var existe = this.lstFiltros.find(item => item === variavel);
                if(!existe)
                {
                    this.lstFiltros.push(variavel);
                }

                this.lstAdiantamentos = this.lstGuardarAdiant;

                this.lstFiltros.forEach(aux => {

                    this.lstAdiantamentos = this.lstAdiantamentos.filter(item => {
                    return item[aux.toLowerCase()].toLowerCase().includes(this[aux].toLowerCase());});

                });
            }
        },
        async filtrarAdiantamentos() {
            api.loadingOn();
            await new Promise(resolve => setTimeout(resolve, 500));
            if(this['DATAFINAL'] === "")
            {
                this.lstAdiantamentos = this.lstGuardarAdiant;
            }
            else
            {
                const dataInicio = new Date(api.inverterData(this.DATA));
                const dataFim = new Date(api.inverterData(this.DATAFINAL));
                if(dataInicio > dataFim)
                {
                    toast.error("Informe uma data inicial menor que a final.");
                    return;
                }
                this.lstAdiantamentos = this.lstAdiantamentos.filter(adiantamento => {
                    const data = new Date(api.inverterData(adiantamento.data));
                    return data >= new Date(dataInicio) && data <= new Date(dataFim);
                });
            }
           api.loadingOff();
        },
        clearCPJ()
        {
            const inputElement = document.getElementById("txt_CPJ");
            if (inputElement.value.trim() === "" && this.CODCPJ) 
            {
                this.CODCPJ = "";
                if(this.CODGERENCIAL)
                {
                    this.lstCdepara = this.lstGuardarCdepara.filter(item => item.codgerencial === this.CODGERENCIAL);
                }
                else
                {
                    this.lstCdepara = this.lstGuardarCdepara;
                }
                
            } 
        },
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
/*         setTimeout(() => {
            const gif = document.getElementById('bkgMenuLateral');
            gif.src = staticImage;
        }, 2500); */ 
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

        var PxAdicional = 590;
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
        var PxAdicional = 590;
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
            document.getElementById('tableContainer').style.height = (conteudoHeight-490)+"px";
        }
        else if(conteudoHeight > (tableContainerHeight+PxAdicional))
        {
            document.getElementById('tableContainer').style.height = (conteudoHeight-490)+"px";
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