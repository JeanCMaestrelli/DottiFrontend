<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CONTAS A PAGAR</h5>
            <div class="divider" style="height: 10px;"></div>
            <br>
            <div class="painel z-depth-1">
                <br>
                <form v-on:submit.prevent="onSubmit">
                    <div class="row">
                            <div class="input-field col l3 m3 s12">
                                <i style="cursor: pointer;" class="material-icons prefix clickable" @click="PickerOpen('hdn_DataIni')">insert_invitation</i>
                                <input type="text" v-model="dataini"  id="txt_DataIni" 
                                  @keyup="Datas(this.dataini,'dataini',1,'txt_DataIni')"  @blur="Datas(this.dataini,'dataini',2,'txt_DataIni')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_DataIni">Data Inicial</label>
                            </div>
                            <div class="input-field col l3 m3 s12 ">
                                <i style="cursor: pointer;" class="material-icons prefix clickable" @click="PickerOpen('hdn_DataFina')">insert_invitation</i>
                                <input type="text" v-model="datafina"  id="txt_DataFina" 
                                  @keyup="Datas(this.datafina,'datafina',1,'txt_DataFina')"  @blur="Datas(this.datafina,'datafina',2,'txt_DataFina')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_DataFina">Data Final</label>
                            </div>
                            <div class="input-field col l2 m2 s12">
                                <select @change="clearFilter()" v-model="selectedColumn" id="txt_Colunas" name="txt_Colunas" class="validate">
                                    <option value="" disabled selected>Selecione</option>
                                    <option v-for="option in columns" :key="option" :value=option>
                                        {{ option }}
                                    </option>
                                </select>
                                <label>Coluna</label>
                            </div>
                            <div v-if="selectedColumn === 'Excluidas'" class="input-field col l3 m3 s12">
                                <div style="display: flex; gap: 20px;">
                                    <label>
                                        <input name="group1" type="radio" value="1" v-model="filterValue" />
                                        <span>SIM</span>
                                    </label>
                                    <label>
                                        <input name="group1" type="radio" value="0" v-model="filterValue" />
                                        <span>NÃO</span>
                                    </label>
                                </div>
                            </div>
                            <div v-else-if="selectedColumn === 'Dtlancamento'" class="input-field col l3 m3 s12">
                                <i style="cursor: pointer;" class="material-icons prefix clickable">insert_invitation</i>
                                <input type="text" v-model="filterValue"  id="txt_Dtlancamento" 
                                @keyup="Datas(this.filterValue,'filterValue',1,'txt_Dtlancamento')"  @blur="Datas(this.filterValue,'filterValue',2,'txt_Dtlancamento')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_Dtlancamento"></label>
                            </div>
                            <div v-else-if="selectedColumn === 'Dtvencimento'" class="input-field col l3 m3 s12">
                                <i style="cursor: pointer;" class="material-icons prefix clickable">insert_invitation</i>
                                <input type="text" v-model="filterValue"  id="txt_Dtvencimento" 
                                @keyup="Datas(this.filterValue,'filterValue',1,'txt_Dtvencimento')"  @blur="Datas(this.filterValue,'filterValue',2,'txt_Dtvencimento')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_Dtvencimento"></label>
                            </div>
                            <div v-else-if="selectedColumn === 'Dtbaixa'" class="input-field col l3 m3 s12">
                                <i style="cursor: pointer;" class="material-icons prefix clickable">insert_invitation</i>
                                <input type="text" v-model="filterValue"  id="txt_Dtbaixa" 
                                @keyup="Datas(this.filterValue,'filterValue',1,'txt_Dtbaixa')"  @blur="Datas(this.filterValue,'filterValue',2,'txt_Dtbaixa')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_Dtbaixa"></label>
                            </div>
                            <div v-else-if="selectedColumn === 'ValorBruto'" class="input-field col l3 m3 s12">
                                <input  @keyup="Moeda(this.filterValue,'filterValue')" v-model="filterValue" id="txt_ValorBruto" name="txt_ValorBruto" type="text" placeholder="Digite ...">
                                <label for="txt_ValorBruto"></label>
                            </div>
                            <div v-else class="input-field col l3 m3 s12">
                                <label for="filterTxt" style="margin-right: 10px;"></label>
                                <input @input="clearFilterTxt()" @keyup="UpperCase(this.filterValue,'filterValue')" v-model="filterValue" id="filterTxt" type="text" placeholder="Digite ..." />
                            </div>
                            <div class="input-field col l1 m1 s12">
                                <i style="cursor: pointer;position: relative;" v-on:click="LimparFiltro()" class="material-icons prefix clickable">autorenew</i>
                            </div>
                    </div>
                    <input v-model="hdndataini" @change="handleInsertData('txt_DataIni','hdn_DataIni','dataini')" hidden type="text" class="datepicker" id="hdn_DataIni">
                    <input v-model="hdndatafina" @change="handleInsertData('txt_DataFina','hdn_DataFina','datafina')" hidden type="text" class="datepicker" id="hdn_DataFina">
                    <br>
                    <div class="row ">
                        <button id="SincronizarContas" @click="SincronizarContas($event)" class="waves-effect waves-light btn right btnsEventos">Importar Contas</button>
                        <button id="Filtrar" @click="GetAllContasPagar()" class="waves-effect waves-light btn right btnsEventos">Filtrar</button>
                        <button id="Exportar" @click="ExportarCsv()" class="waves-effect waves-light btn right btnsEventos">Exportar</button>
                        <button id="EditarConta" @click="MEditarConta($event)" class="waves-effect waves-light btn right btnsEventos">Editar</button>
                        <button id="CadastrarConta" @click="CadastrarConta($event)" class="waves-effect waves-light btn right btnsEventos">Cadastrar</button>
                        <button id="ExcluirConta" @click="ExcluirConta($event)" class="waves-effect waves-light btn right btnsEventos">Excluir</button>
                    </div>
                </form>
                <br>
            </div>
            <br>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table class="centered striped responsive-table" id="tabDados" style="font-size: smaller;">
                        <thead>
                        <tr>
                            <th>
                                Marcar
                            </th>
                            <th @click="ordenarPor('excluircalculo')" style="cursor: pointer;">
                                Excluidas <span v-if="ordemColuna === 'excluircalculo' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'excluircalculo'">▼</span>
                            </th>
                            <th  @click="ordenarPor('titulo')" style="cursor: pointer;">
                                Titulo <span v-if="ordemColuna === 'titulo' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'titulo'">▼</span>
                            </th>
                            <th  @click="ordenarPor('nomE_BANCO')" style="cursor: pointer;">
                                NomeBanco <span v-if="ordemColuna === 'nomE_BANCO' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'nomE_BANCO'">▼</span>
                            </th>
                            <th  @click="ordenarPor('dtvencimento')" style="cursor: pointer;">
                                Dtvencimento <span v-if="ordemColuna === 'dtvencimento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtvencimento'">▼</span>
                            </th>
                            <th  @click="ordenarPor('dtbaixa')" style="cursor: pointer;">
                                Dtbaixa <span v-if="ordemColuna === 'dtbaixa' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtbaixa'">▼</span>
                            </th>
                            <th @click="ordenarPor('fornecedor')" style="cursor: pointer;">
                                Fornecedor <span v-if="ordemColuna === 'fornecedor' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'fornecedor'">▼</span>
                            </th>
                            <!-- <th  @click="ordenarPor('documento')" style="cursor: pointer;">
                                Documento <span v-if="ordemColuna === 'documento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'documento'">▼</span>
                            </th> -->
                            <th @click="ordenarPor('contadre')" style="cursor: pointer;">
                                ContaDre <span v-if="ordemColuna === 'contadre' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'contadre'">▼</span>
                            </th>
                            <th @click="ordenarPor('complemento')" style="cursor: pointer;">
                                Complemento <span v-if="ordemColuna === 'complemento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'complemento'">▼</span>
                            </th>
                            <th  @click="ordenarPor('vbruto')" style="cursor: pointer;">
                                ValorBruto <span v-if="ordemColuna === 'vbruto' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'vbruto'">▼</span>
                            </th>
                            <th  @click="ordenarPor('fpagamento')" style="cursor: pointer;">
                                FormaPagamento <span v-if="ordemColuna === 'fpagamento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'fpagamento'">▼</span>
                            </th>
<!--                             <th  @click="ordenarPor('cancelado')" style="cursor: pointer;">
                                Cancelado <span v-if="ordemColuna === 'cancelado' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'cancelado'">▼</span>
                            </th>
                            <th  @click="ordenarPor('motivocanc')" style="cursor: pointer;">
                                MotivoCanc <span v-if="ordemColuna === 'motivocanc' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'motivocanc'">▼</span>
                            </th> -->
                             <th  @click="ordenarPor('coD_BANCO')" style="cursor: pointer;">
                                CodBanco <span v-if="ordemColuna === 'coD_BANCO' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'coD_BANCO'">▼</span>
                            </th>
                            <th  @click="ordenarPor('dtlancamento')" style="cursor: pointer;">
                                Dtlancamento <span v-if="ordemColuna === 'dtlancamento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtlancamento'">▼</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="conta in filteredRowsTruncated" :key="conta.id">
                                <td>
                                    <label>
                                    <input type="checkbox" v-model="selectedRows" :value="conta"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>
                                    <label>
                                        <input v-on:click="SetarCalculo(conta,$event)" :value="conta" type="checkbox" :checked="Boolean(conta.excluircalculo)"/>
                                        <span></span>
                                    </label>
                                </td>
                                <td>{{ conta.titulo }}</td>
                                <td>{{ conta.nomE_BANCO }}</td>
                                
                                <td>{{ conta.dtvencimento }}</td>
                                <td>{{ conta.dtbaixa }}</td>
                                 <td :title="conta.fornecedor">{{ truncate(conta.fornecedor) }}</td>
                                <!-- <td>{{ conta.documento }}</td> -->
                                <td :title="conta.contadre">{{ truncate(conta.contadre) }}</td>
                                <td :title="conta.complemento">{{ truncate(conta.complemento) }}</td>

                                <td>{{ conta.vbruto }}</td>
                                <td>{{ conta.fpagamento }}</td>
<!--                                 <td>{{ conta.cancelado }}</td>
                                <td>{{ conta.motivocanc }}</td> -->
                                <td>{{ conta.coD_BANCO }}</td>
                                <td>{{ conta.dtlancamento }}</td>
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
            <div v-on:submit.prevent="onSubmit">
                <h5 style="font-weight: bold;">CADASTRAR CONTAS</h5>
                <div class="divider" style="height: 10px;"></div>
                <!-- campos cadastro -->
                <br>
                <div style="padding: 15px;" class="z-depth-2">
                    <br>
                    <div class="row">
                        <div class="input-field col l2 m2 s6">
                            <input :disabled="update" id="txt_titulo" v-model="titulo" name="txt_titulo" type="text">
                            <label for="txt_titulo">Titulo</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col l3 m3 s12">
                            <select v-model="cod_banco" id="txt_cod_banco" name="txt_cod_banco" >
                                <option value="" disabled selected>Selecione</option>
                                <option value="3">BANCO ITAÚ</option>
                                <option value="4">BANCO BRADESCO</option>
                                <option value="6">BANCO ITAÚ - CUSTAS</option>
                            </select>
                            <label>Banco</label>
                        </div>
                         <div class="input-field col l3 m3 s12" >
                            <i class="material-icons prefix clickable" @click="PickerOpen('hdn_dtlancamento')">insert_invitation</i>
                            <input type="text" v-model="dtlancamento"  id="txt_dtlancamento" 
                            @keyup="Datas(this.dtlancamento,'dtlancamento',1,'txt_dtlancamento')"  @blur="Datas(this.dtlancamento,'dtlancamento',2,'txt_dtlancamento')" maxlength="10" placeholder="DD/MM/AAAA">
                            <label for="txt_dtlancamento">Lançamento</label>
                        </div>
                        <div class="input-field col l3 m3 s12" >
                            <i class="material-icons prefix clickable" @click="PickerOpen('hdn_dtvencimento')">insert_invitation</i>
                            <input type="text" v-model="dtvencimento"  id="txt_dtvencimento" 
                            @keyup="Datas(this.dtvencimento,'dtvencimento',1,'txt_dtvencimento')"  @blur="Datas(this.dtvencimento,'dtvencimento',2,'txt_dtvencimento')" maxlength="10" placeholder="DD/MM/AAAA">
                            <label for="txt_dtvencimento">Vencimento</label>
                        </div>
                        <div class="input-field col l3 m3 s12" >
                            <i class="material-icons prefix clickable" @click="PickerOpen('hdn_dtbaixa')">insert_invitation</i>
                            <input type="text" v-model="dtbaixa"  id="txt_dtbaixa" 
                            @keyup="Datas(this.dtbaixa,'dtbaixa',1,'txt_dtbaixa')"  @blur="Datas(this.dtbaixa,'dtbaixa',2,'txt_dtbaixa')" maxlength="10" placeholder="DD/MM/AAAA">
                            <label for="txt_dtbaixa">Data Baixa</label>
                        </div>
                        
                        <input v-model="hdndtlancamento" @change="handleInsertData('txt_dtlancamento','hdn_dtlancamento','dtlancamento')" hidden type="text" class="datepicker" id="hdn_dtlancamento">
                        <input v-model="hdndtvencimento" @change="handleInsertData('txt_dtvencimento','hdn_dtvencimento','dtvencimento')" hidden type="text" class="datepicker" id="hdn_dtvencimento">
                        <input v-model="hdndtbaixa" @change="handleInsertData('txt_dtbaixa','hdn_dtbaixa','dtbaixa')" hidden type="text" class="datepicker" id="hdn_dtbaixa">
                    </div>
                    <div class="row">
                        <div class="input-field col l12 m12 s12">
                            <input @keyup="UpperCase(this.fornecedor,'fornecedor')" v-model="fornecedor" id="txt_fornecedor" name="txt_fornecedor" type="text" >
                            <label for="txt_fornecedor">Fornecedor</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col l4 m4 s12">
                            <input @keyup="UpperCase(this.documento,'documento')" v-model="documento" id="txt_documento" name="txt_documento" type="text" >
                            <label for="txt_documento">Documento</label>
                        </div>
                        <div class="input-field col l8 m8 s12">
                            <input @keyup="UpperCase(this.contadre,'contadre')" v-model="contadre" id="txt_contadre" name="txt_contadre" type="text" >
                            <label for="txt_contadre">Conta Dre</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col l12 m12 s12">
                            <input @keyup="UpperCase(this.complemento,'complemento')" v-model="complemento" id="txt_complemento" name="txt_complemento" type="text" >
                            <label for="txt_complemento">Complemento</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col l2 m2 s12">
                            <input @keyup="Moeda(this.vbruto,'vbruto')" v-model="vbruto" id="txt_vbruto" name="txt_vbruto" type="text">
                            <label for="txt_vbruto">Valor Bruto</label>
                        </div>
                        <div class="input-field col l2 m2 s12">
                            <input @keyup="UpperCase(this.fpagamento,'fpagamento')" v-model="fpagamento" id="txt_fpagamento" name="txt_fpagamento" type="text" >
                            <label for="txt_fpagamento">Forma Pagamento</label>
                        </div>
                        <div class="input-field col l2 m2 s12">
                            <select v-model="cancelado" id="txt_cancelado" name="txt_cancelado" >
                                <option value="" disabled selected>Selecione</option>
                                <option value="NÃO">NÃO</option>
                                <option value="SIM">SIM</option>
                            </select>
                            <label>Cancelado</label>
                        </div>
                        <div class="input-field col l6 m6 s12">
                            <input @keyup="UpperCase(this.motivocanc,'motivocanc')" v-model="motivocanc" id="txt_motivocanc" name="txt_motivocanc" type="text" >
                            <label for="txt_motivocanc">Motivo Cancelamento</label>
                        </div>
                    </div>
                    <br>
                </div>
                <br>
                <!-- campos cadastro -->
                <div class="divider"></div>
                <br>
                <div id="modalbotoes">
                    <button type="submit" style="margin-left: 15px;margin-right: 15px;" id="SalvarEventoModal" @click="SalvarConta($event)"  class="waves-effect waves-light btn right btnsEventos ">Salvar</button>
                    <!-- <button type="button" style="margin-left: 15px;" id="EditarEventoModal" @click="UpdateEvento($event)" class="waves-effect waves-light btn right btnsEventos ">Editar</button> -->
                </div>
                <br>
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
    name: 'ContasPagarView',
    components: {
      MenuLateral
    },
    data () {
        return {
            dataini:"",
            datafina:"",
            hdndataini:"",
            hdndatafina:"",
            CODUSUARIOCAD : "",
            DTCRIACAO : "",
            lstContas:[],
            lstGuardar:[],
            lstFiltros:[],
            ordemColuna:null,
            ordem: "asc",
            selectedRows:[],
            titulo:"",
            cod_banco:"",
            nome_banco:"",
            dtlancamento:"",
            hdndtlancamento:"",
            dtvencimento:"",
            hdndtvencimento:"",
            dtbaixa:"",
            hdndtbaixa:"",
            fornecedor:"",
            documento:"",
            contadre:"",
            complemento:"",
            vbruto:"",
            fpagamento:"",
            cancelado:"",
            motivocanc:"",
            dates:null,
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario,
            filterValue:null,
            selectedColumn:[],
            columns: ["Excluidas", "Titulo", "CodBanco", "NomeBanco", "Dtlancamento", "Dtvencimento", "Dtbaixa", "Fornecedor", "ContaDre", "Complemento", "ValorBruto", "FormaPagamento", "Cancelado", "MotivoCanc"],
            originalColum: [
                "excluircalculo",
                "titulo",
                "coD_BANCO",
                "nomE_BANCO",
                "dtlancamento",
                "dtvencimento",
                "dtbaixa",
                "fornecedor",
                "contadre",
                "complemento",
                "vbruto",
                "fpagamento",
                "cancelado",
                "motivocanc"
            ],
            lenthTrunc:20,
            update:false
        }
    },
    computed:{
       
        filteredRows() 
        {
            let rows = 0;
            this.lstContas.find(() => {
                rows += 1;
                if(this.lstContas.length == rows)
                {
                    setTimeout(  () => {
                        M.updateTextFields();
                        api.loadingOff();
                        resize();
                    }, "1000");
                }
            });

            let filtro = String(this.filterValue);

            if (!this.selectedColumn || !this.filterValue) 
            {
                return this.lstContas;
            }

            let i = this.columns.findIndex(column => column === this.selectedColumn);
            if (i === -1) 
            {
                return this.lstContas;
            }

            const aux = this.lstContas.filter(row => 
            {
                let value=null;

                if(this.selectedColumn === "Excluidas")
                {
                    value = row[this.originalColum[i]];
                    if (value !== true && value !== false) 
                    {
                        return false;
                    }

                    if(value)
                    {
                        value = "1";
                    }
                    else
                    {
                        value = "0";
                    }
                }
                else if(this.selectedColumn === "Dtlancamento" || this.selectedColumn === "	Dtvencimento" || this.selectedColumn === "Dtbaixa")
                {
                    filtro = this.filterValue;

                   /*  var data = this.filterValue.split("/");
                    if(data.length == 2)
                    {
                        const [dia, mes] = data;
                        filtro = `${mes}-${dia}`;
                    }
                    else if(data.length == 3)
                    {
                        const [dia, mes, ano] = data;
                        filtro = `${ano}-${mes}-${dia}T00:00:00`;
                    } */
                    value = row[this.originalColum[i]];
                    if (!value) 
                    {
                        return false;
                    }
                }
                else
                {
                    value = String(row[this.originalColum[i]]).toLowerCase();
                    if (!value) 
                    {
                        return false;
                    }

                    if(value === "0,00")
                        return 
                }

                return String(value).toLowerCase().includes(filtro.toLowerCase());
                
            });

            if(aux.length == 0)
            {
                return false;
            }
            else
            {
                return aux;
            }
        },
        filteredRowsTruncated() 
        {
            if(this.filteredRows == false)
            {
                return [];
            }
            else
            {
                return this.filteredRows.map(conta => ({
                ...conta,
                fornecedor: conta.fornecedor,
                contadre: conta.contadre,
                complemento: conta.complemento
                }));
            }
        }
    },
    methods:
    {
        truncate(text) 
        {
            if (!text) return '';
            return text.length > this.lenthTrunc ? text.substring(0, this.lenthTrunc) + '...' : text;
        },
        LimparFiltro()
        {
            this.clearFilter();
            M.updateTextFields();
        },
        clearFilterTxt()
        {

        },
        clearFilter()
        {
            this.filterValue = null;
            M.FormSelect.init(document.querySelectorAll('select'));
            M.updateTextFields();
        },
        async SalvarConta(e)
        {
            if(this.titulo === ""){
                toast.error("Informe o número do titulo.");
                return;
            }
            else if(this.cod_banco === ""){
                toast.error("Informe o banco.");
                return;
            }
            else if(this.dtlancamento === ""){
                toast.error("Informe a data de lançamento.");
                return;
            }
            else if(this.dtvencimento === ""){
                toast.error("Informe a data de vencimento.");
                return;
            }
            else if(this.dtbaixa === ""){
                toast.error("Informe a data da baixa.");
                return;
            }
            else if(this.fornecedor === ""){
                toast.error("Informe o fornecedor.");
                return;
            }
            else if(this.contadre === ""){
                toast.error("Informe a conta dre.");
                return;
            }
            else if(this.vbruto === "" || this.vbruto === "0,00"){
                toast.error("Informe o valor.");
                return;
            }
            else if(this.fpagamento === ""){
                toast.error("Informe a forma de pagamento.");
                return;
            } 

            this.nome_banco = document.getElementById("txt_cod_banco").options[document.getElementById("txt_cod_banco").selectedIndex].text;
            let data = {
                TITULO:parseInt(this.titulo),
                COD_BANCO:parseInt(this.cod_banco),
                NOME_BANCO:this.nome_banco,
                DTLANCAMENTO:this.dtlancamento,
                DTVENCIMENTO:this.dtvencimento,
                DTBAIXA:this.dtbaixa,
                FORNECEDOR:this.fornecedor,
                DOCUMENTO:this.documento,
                CONTA_DRE:this.contadre,
                COMPLEMENTO:this.complemento,
                VBRUTO:this.vbruto,
                FPAGAMENTO:this.fpagamento,
                CANCELADO:this.cancelado,
                MOTIVOCANC:this.motivocanc,
                DTCRIACAO:api.dataAtual(),
                CODUSUARIOCAD:this.USUARIO.codusuarios,
                UPDATE: this.update

            }

                var ret1 = await api.verificarAcesso("CPAGAR","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
                if(!ret1)
                {
                    return;
                }
                await api.post("CadContasPagar", data).then(r=>{
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
                    toast("Conta Cadastrada com Sucesso !!!");
                }})
                e.preventDefault();
                api.loadingOff();
                return true;

        },
        async MEditarConta(e)
        {
            e.preventDefault();
            this.LimparCampos();
            if(this.selectedRows.length > 1)
            {
                toast.error("Existem mais de uma conta selecionada para edição, marque somente uma !!!");
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast.error("Selecionada uma conta para edição !!!");
                return;
            }
            else if(this.selectedRows.length == 1)
            {
                this.EditarConta();
            }
            
            M.Modal.getInstance(document.getElementById("FormCadastro")).open();
            
            api.loadingOff();
        },
        async CadastrarConta(e)
        {
            e.preventDefault();
            this.LimparCampos();
            this.update = false;

            M.Modal.getInstance(document.getElementById("FormCadastro")).open();
            
        },
        EditarConta()
        {
            this.titulo=this.selectedRows[0].titulo;
            this.cod_banco=this.selectedRows[0].coD_BANCO;
            this.nome_banco=this.selectedRows[0].nomE_BANCO;
            this.dtlancamento=this.selectedRows[0].dtlancamento;
            this.dtvencimento=this.selectedRows[0].dtvencimento;
            this.dtbaixa=this.selectedRows[0].dtbaixa;
            this.fornecedor=this.selectedRows[0].fornecedor;
            this.documento=this.selectedRows[0].documento;
            this.contadre=this.selectedRows[0].contadre;
            this.complemento=this.selectedRows[0].complemento;
            this.vbruto=this.selectedRows[0].vbruto;
            this.fpagamento=this.selectedRows[0].fpagamento;
            this.cancelado=this.selectedRows[0].cancelado;
            this.motivocanc=this.selectedRows[0].motivocanc;
            this.update = true;

            document.getElementById("txt_titulo").value = this.selectedRows[0].titulo;
            document.getElementById("txt_cod_banco").value = this.selectedRows[0].coD_BANCO;
            document.getElementById("txt_dtlancamento").value = this.selectedRows[0].dtlancamento;
            document.getElementById("txt_dtvencimento").value = this.selectedRows[0].dtvencimento;
            document.getElementById("txt_dtbaixa").value = this.selectedRows[0].dtbaixa;
            document.getElementById("txt_fornecedor").value = this.selectedRows[0].fornecedor;
            document.getElementById("txt_documento").value = this.selectedRows[0].documento;
            document.getElementById("txt_contadre").value = this.selectedRows[0].contadre;
            document.getElementById("txt_complemento").value = this.selectedRows[0].complemento;
            document.getElementById("txt_vbruto").value = this.selectedRows[0].vbruto
            document.getElementById("txt_fpagamento").value = this.selectedRows[0].fpagamento;
            document.getElementById("txt_cancelado").value = this.selectedRows[0].cancelado;
            document.getElementById("txt_motivocanc").value = this.selectedRows[0].motivocanc;

            M.FormSelect.init(document.querySelectorAll('select'));
            M.updateTextFields();
        },
        async SetarCalculo(conta,e)
        {

            let data = {
                id:conta.id,
                setar:e.currentTarget.checked
            }
            api.loadingOn();
            await api.get("SetarContaCalculo",data).then(r=>
            {
                if(r.status != 200){
                    api.loadingOff();
                    toast.error(r.data.message);
                }
                else if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                } else{
                    api.loadingOff();
                }
            });
        },
        async ExcluirConta(e)
        {
            e.preventDefault();
            
            if(this.selectedRows.length > 1)
            {
                toast.error("Existem mais de uma conta selecionada para excluir, marque somente uma !!!");
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast.error("Selecionada uma conta para excluir !!!");
                return;
            }
            else if(this.selectedRows.length == 1)
            {
                let data = 
                {
                    id:this.selectedRows[0].id,
                };

                api.loadingOn();

                await api.get("ExcluirConta",data).then(r=>
                {
                    if(r.status != 200){
                        api.loadingOff();
                        toast.error(r.data.message);
                    }
                    else if(r.status == 401)
                    {
                        api.loadingOff();
                        toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                        this.$router.push({ path: '/'});
                        return;
                    } else{
                        this.selectedRows = [];
                        toast("Conta Excluida com Sucesso.");
                        this.GetAllContasPagar();
                        this.LimparCampos();
                        api.loadingOff();
                    }
                });
            }
        },
        async filtrarContasPorPeriodo() 
        {
            api.loadingOn();
            const dataInicio = this.dataini;
            const dataFim = this.datafina;

            const formatarData = (dataStr) => {
                const [dia, mes, ano] = dataStr.split("/");
                return new Date(`${ano}-${mes}-${dia}`);
            };
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if(dataInicio === "" || dataFim === "")
            {
                toast.error("Informe as datas inicial e final antes de filtrar.");
                this.lstContas = this.lstGuardar;
                api.loadingOff();
                return;
            }
            else if(formatarData(dataInicio) > formatarData(dataFim))
            {
                api.loadingOff();
                toast.error("Informe uma data inicial menor ou igual a final.");
                return;
            }
            
            const dataInicioFormatada = formatarData(dataInicio);
            const dataFimFormatada = formatarData(dataFim);

            this.lstContas = this.lstContas.filter(conta => {
                const dataVencimento = formatarData(conta.dtvencimento);
                const dataBaixa = conta.dtbaixa ? formatarData(conta.dtbaixa) : null;
                return (
                    (dataVencimento >= dataInicioFormatada && dataVencimento <= dataFimFormatada) || 
                    (dataBaixa && dataBaixa >= dataInicioFormatada && dataBaixa <= dataFimFormatada)
                );
            });
            api.loadingOff();
        },
        async SincronizarContas(e)
        {
            e.preventDefault();

            if(this.dataini === "")
            {
                toast.error("Informe a data Inicial !!!");
                return;
            }
            else if(this.datafina === "")
            {
                toast.error("Informe a data Final !!!");
                return;
            }

            let res = api.verificarDatas(this.dataini,this.datafina);
            if(res == 0)
            {
                toast.error("Verifique as Datas !!!");
                return;
            }
            else if (res == 1)
            {
                toast.error("A data inicial deve ser menor que a final !!!");
                return;
            }
            
            api.loadingOn();

            let data = {
                datainicial:this.dataini,
                datafinal:this.datafina
            }

            api.get("sincPagar",data).then(r=>
            {
                if(r.status != 200){
                    api.loadingOff();
                    toast.error(r.data.message);
                }
                else if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                } else{
                    api.loadingOff();
                    toast("Contas a Pagar Atualizadas Com Sucesso !!!");
                    this.GetAllContasPagar();
                    this.LimparCampos();
                }
            });
        },
        ordenarPor(coluna) 
        {
            let aux = "";
            if(coluna === "limpar")
            {
                aux = "limpar";
                coluna = "Titulo";
            }

            this.lstContas.sort((a, b) => 
            {
                let valorA = a[coluna];
                let valorB = b[coluna];

                // Tratar a coluna de data
                if (coluna === "Dtlancamento" || coluna === "Dtvencimento" || coluna === "Dtbaixa") {
                    valorA = Date.parse(a[coluna].split('/').reverse().join('-'));
                    valorB = Date.parse(b[coluna].split('/').reverse().join('-'));
                }

                // Tratar valores numéricos ou strings
                if (coluna === "ValorBruto") {
                    valorA = api.converterParaNumero(valorA);
                    valorB = api.converterParaNumero(valorB);
                }

                if (coluna === "excluircalculo") {
                    valorA = valorA == true ? 1 : 0;
                    valorB = valorB == true ? 1 : 0;
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
        async ExportarCsv()
        {
            if(this.dataini === "")
            {
                toast.error("Informe a data Inicial !!!");
                return;
            }
            else if(this.datafina === "")
            {
                toast.error("Informe a data Final !!!");
                return;
            }

            let res = api.verificarDatas(this.dataini,this.datafina);
            if(res == 0)
            {
                toast.error("Verifique as Datas !!!");
                return;
            }
            else if (res == 1)
            {
                toast.error("A data inicial deve ser menor que a final !!!");
                return;
            }
            
            api.loadingOn();

            try {

                const response = await api.getFile(`GetAllContasPagarExcel?datainicial=${this.dataini}&datafinal=${this.datafina}`);

                if (response.status === 200) 
                {

                    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `ContasPagar_${api.DataTraco(this.dataini)}_${api.DataTraco(this.datafina)}.xlsx`);

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    toast.success("Download do Excel realizado com sucesso!");

                } 
                else 
                {
                    toast.error("Erro ao baixar o arquivo.");
                }
            } 
            catch (error) 
            {
                console.error("Erro ao baixar o arquivo:", error);
                toast.error("Erro ao exportar Contas a Pagar.");
            }

            api.loadingOff();
        },
        filtar(filtro,variavel) 
        {
            if(this[variavel] === "")
            {
                if(this.lstContas.length < this.lstGuardar.length)
                {
                    this.lstContas = this.lstGuardar;

                    this.lstFiltros = this.lstFiltros.filter(item => item !== filtro);

                    this.lstFiltros.forEach(aux => {

                        this.lstContas = this.lstContas.filter(item => {
                        return item[aux.toLowerCase()].toLowerCase().includes(this[variavel].toLowerCase());});

                    });
                }
                else
                {
                    this.lstContas = this.lstGuardar;
                }
            }
            else
            {
                var existe = this.lstFiltros.find(item => item === filtro);
                if(!existe)
                {
                    this.lstFiltros.push(filtro);
                }

                this.lstContas = this.lstGuardar;

                this.lstFiltros.forEach(aux => {

                    this.lstContas = this.lstContas.filter(item => {
                    return item[aux.toLowerCase()].toLowerCase().includes(this[variavel].toLowerCase());});

                });
            }
        },
        LimparCampos()
        {

            /* this.dataini = this.dates.firstDay;
            this.datafina= this.dates.lastDay; */
            this.hdndataini="";
            this.hdndatafina="";
            this.hdndtlancamento="";
            this.hdndtvencimento="";
            this.hdndtbaixa="";
            
            this.titulo="";
            this.cod_banco="";
            this.nome_banco="";
            this.dtlancamento="";
            this.dtvencimento="";
            this.dtbaixa="";
            this.fornecedor="";
            this.documento="";
            this.contadre="";
            this.complemento="";
            this.vbruto="";
            this.fpagamento="";
            this.cancelado="";
            this.motivocanc="";

/*             document.getElementById("txt_DataIni").value = "";
            document.getElementById("txt_DataFina").value = ""; */
            document.getElementById("hdn_DataIni").value = "";
            document.getElementById("hdn_DataFina").value = "";
            document.getElementById("hdn_dtlancamento").value = "";
            document.getElementById("hdn_dtvencimento").value = "";
            document.getElementById("hdn_dtbaixa").value = "";

            document.getElementById("txt_titulo").value = "";
            document.getElementById("txt_cod_banco").value = "";
            document.getElementById("txt_dtlancamento").value = "";
            document.getElementById("txt_dtvencimento").value = "";
            document.getElementById("txt_dtbaixa").value = "";
            document.getElementById("txt_fornecedor").value = "";
            document.getElementById("txt_documento").value = "";
            document.getElementById("txt_contadre").value = "";
            document.getElementById("txt_complemento").value = "";
            document.getElementById("txt_vbruto").value = "";
            document.getElementById("txt_fpagamento").value = "";
            document.getElementById("txt_cancelado").value = "";
            document.getElementById("txt_motivocanc").value = "";

            this.lstContas = this.lstGuardar;

            M.FormSelect.init(document.querySelectorAll('select'));
            M.updateTextFields();
        },
        async GetAllContasPagar()
        {

            const formatarData = (dataStr) => {
                const [dia, mes, ano] = dataStr.split("/");
                return new Date(`${ano}-${mes}-${dia}`);
            };
            
            if(this.dataini === "" || this.datafina === "")
            {
                toast.error("Informe as datas inicial e final antes de filtrar.");
                return;
            }
            else if(formatarData(this.dataini) > formatarData(this.datafina))
            {
                toast.error("Informe uma data inicial menor ou igual a final.");
                return;
            }
            
            var dados = {
                datainicial:this.dataini,
                datafinal:this.datafina
            };


            api.loadingOn();
            await api.get("GetAllContasPagar",dados).then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.lstContas = r.data.contaspagar;
                if(this.lstContas.length == 0)
                {
                    api.loadingOff();
                }
                this.lstGuardar = this.lstContas;
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
        Datas(valor,variavel,conta=1,objtxt)
        {
            if(conta == 1)//aplicar mascara
            {
                this[variavel] = api.aplicarMascaraData(valor);
            }
            else if(conta == 2)//consistir data
            {
                if(valor) 
                {
                    var result = api.validarData(valor);

                    if(!result)
                    {
                        toast.error("Data inválida! Por favor, insira uma data válida no formato DD/MM/AAAA.");
                        this[variavel] = "";
                        document.getElementById(objtxt).value = "";
                        this.lstContas = this.lstGuardar;
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
        handleInsertData(dataobj,hdnobj,variavel)
        {
            document.getElementById(dataobj).value = document.getElementById(hdnobj).value;
            this[variavel] = document.getElementById(hdnobj).value;
            //this.filtar(filtro,variavel);
        },
        UpperCase(valor,variavel)
        {
           this[variavel] = valor.toUpperCase();
        },
        toUpperCase(input) 
        {
            return input ? input.toUpperCase() : '';
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
        M.FormSelect.init(document.querySelectorAll('select'));
        M.updateTextFields();
        resize();
/*         setTimeout(() => {
            const gif = document.getElementById('bkgMenuLateral');
            gif.src = staticImage;
        }, 2500);  */
    },
    created()
    {
        this.dates = api.rangeMesAnterior();
        this.dataini = this.dates.firstDay;
        this.datafina= this.dates.lastDay; 
        
/*         this.dataini = "01/03/2025";
        this.datafina= "31/03/2025"; */
        
        this.GetAllContasPagar();
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
    #btncontas
    {
        margin-top: 0px;
        margin-bottom: 0px;
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
    
    td, th 
    {
        white-space: nowrap; /* Evita quebra de linha */
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

        .modal
        {
            padding: 15px;
            width: 85%;
            max-height: 80%;
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
    @media only screen and (max-height: 800px) 
    {
        #conteudo
        {
            overflow-y:scroll;
            padding: 20px;
        }
    }
    @media only screen and (max-width: 600px) 
    {
        #btncontas
        {
            margin-top: 25px;
            margin-bottom: 0px;
            width: 46%;
        }
    }
  </style>