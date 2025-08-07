<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CONTAS A RECEBER</h5>
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
                                <label for="txt_DataIni">Data Inícial</label>
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
                            <div v-if="selectedColumn === 'Cancelado'" class="input-field col l3 m3 s12">
                                <div style="display: flex; gap: 20px;">
                                    <label>
                                        <input name="group1" type="radio" value="SIM" v-model="filterValue" />
                                        <span>SIM</span>
                                    </label>
                                    <label>
                                        <input name="group1" type="radio" value="NÃO" v-model="filterValue" />
                                        <span>NÃO</span>
                                    </label>
                                </div>
                            </div>
                            <div v-else-if="selectedColumn === 'DtLancamento'" class="input-field col l3 m3 s12">
                                <i style="cursor: pointer;" class="material-icons prefix clickable">insert_invitation</i>
                                <input type="text" v-model="filterValue"  id="txt_DtLancamento" 
                                @keyup="Datas(this.filterValue,'filterValue',1,'txt_DtLancamento')"  @blur="Datas(this.filterValue,'filterValue',2,'txt_DtLancamento')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_DtLancamento"></label>
                            </div>
                            <div v-else-if="selectedColumn === 'EmissãoNF'" class="input-field col l3 m3 s12">
                                <i style="cursor: pointer;" class="material-icons prefix clickable">insert_invitation</i>
                                <input type="text" v-model="filterValue"  id="txt_EmissãoNF" 
                                @keyup="Datas(this.filterValue,'filterValue',1,'txt_EmissãoNF')"  @blur="Datas(this.filterValue,'filterValue',2,'txt_EmissãoNF')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_EmissãoNF"></label>
                            </div>
                            <div v-else-if="selectedColumn === 'DtVencimento'" class="input-field col l3 m3 s12">
                                <i style="cursor: pointer;" class="material-icons prefix clickable">insert_invitation</i>
                                <input type="text" v-model="filterValue"  id="txt_DtVencimento" 
                                @keyup="Datas(this.filterValue,'filterValue',1,'txt_Dtvencimento')"  @blur="Datas(this.filterValue,'filterValue',2,'txt_DtVencimento')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_DtVencimento"></label>
                            </div>
                            <div v-else-if="selectedColumn === 'DtBaixa'" class="input-field col l3 m3 s12">
                                <i style="cursor: pointer;" class="material-icons prefix clickable">insert_invitation</i>
                                <input type="text" v-model="filterValue"  id="txt_DtBaixa" 
                                @keyup="Datas(this.filterValue,'filterValue',1,'txt_DtBaixa')"  @blur="Datas(this.filterValue,'filterValue',2,'txt_DtBaixa')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_DtBaixa"></label>
                            </div>
                            <div v-else-if="selectedColumn === 'ValorBruto' || selectedColumn === 'Valor' || selectedColumn === 'Valor CC'" 
                            class="input-field col l3 m3 s12">
                                <input  @keyup="Moeda(this.filterValue,'filterValue')" v-model="filterValue" id="txt_ValorBruto" name="txt_ValorBruto" type="text" placeholder="Digite ...">
                                <label for="txt_ValorBruto"></label>
                            </div>
                            <div v-else class="input-field col l3 m3 s12">
                                <label for="filterTxt" style="margin-right: 10px;"></label>
                                <input @keyup="UpperCase(this.filterValue,'filterValue')" v-model="filterValue" id="filterTxt" type="text" placeholder="Digite ..." />
                            </div>
                            <div class="input-field col l1 m1 s12">
                                <i style="cursor: pointer;position: relative;" v-on:click="LimparFiltro()" class="material-icons prefix clickable">autorenew</i>
                            </div>
                    </div>
                    <input v-model="hdndataini" @change="handleInsertData('txt_DataIni','hdn_DataIni','dataini')" hidden type="text" class="datepicker" id="hdn_DataIni">
                    <input v-model="hdndatafina" @change="handleInsertData('txt_DataFina','hdn_DataFina','datafina')" hidden type="text" class="datepicker" id="hdn_DataFina">
                    <br>
                    <div class="row ">
                        <button id="Exportar" @click="ExportarCsv()" class="waves-effect waves-light btn right btnsEventos">Exportar Contas</button>
                        <button id="SincronizarContas" @click="SincronizarContas($event)" class="waves-effect waves-light btn right btnsEventos">Importar Contas</button>
                        <button id="Filtrar" @click="GetAllContasReceber()" class="waves-effect waves-light btn right btnsEventos">Filtrar</button>
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
                                <th @click="ordenarPor('documento')" style="cursor: pointer;">
                                    Documento <span v-if="ordemColuna === 'documento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'documento'">▼</span>
                                </th>
                                <th @click="ordenarPor('titulo')" style="cursor: pointer;">
                                    Titulo <span v-if="ordemColuna === 'titulo' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'titulo'">▼</span>
                                </th>
                                <th @click="ordenarPor('nf')" style="cursor: pointer;">
                                    NF <span v-if="ordemColuna === 'nf' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'nf'">▼</span>
                                </th>
                                <th @click="ordenarPor('emissaonf')" style="cursor: pointer;">
                                    EmissãoNF <span v-if="ordemColuna === 'emissaonf' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'emissaonf'">▼</span>
                                </th>
                                <th @click="ordenarPor('dtvencimento')" style="cursor: pointer;">
                                    DtVencimento <span v-if="ordemColuna === 'dtvencimento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtvencimento'">▼</span>
                                </th>
                                <th @click="ordenarPor('dtbaixa')" style="cursor: pointer;">
                                    DtBaixa <span v-if="ordemColuna === 'dtbaixa' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtbaixa'">▼</span>
                                </th>
                                <th @click="ordenarPor('cliente')" style="cursor: pointer;">
                                    Cliente <span v-if="ordemColuna === 'cliente' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'cliente'">▼</span>
                                </th>
                                <th @click="ordenarPor('contadre')" style="cursor: pointer;">
                                    ContaDre <span v-if="ordemColuna === 'contadre' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'contadre'">▼</span>
                                </th>
                                <th @click="ordenarPor('vbruto')" style="cursor: pointer;">
                                    ValorBruto <span v-if="ordemColuna === 'vbruto' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'vbruto'">▼</span>
                                </th>
                                <th @click="ordenarPor('valor')" style="cursor: pointer;">
                                    Valor <span v-if="ordemColuna === 'valor' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'valor'">▼</span>
                                </th>
                                <!-- <th @click="ordenarPor('centrocusto')" style="cursor: pointer;">
                                    Centro Custo <span v-if="ordemColuna === 'centrocusto' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'centrocusto'">▼</span>
                                </th> -->
                                <th @click="ordenarPor('valorcc')" style="cursor: pointer;">
                                    ValorCC <span v-if="ordemColuna === 'valorcc' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'valorcc'">▼</span>
                                </th>
                                <th @click="ordenarPor('descricaocc')" style="cursor: pointer;">
                                    CentroCusto <span v-if="ordemColuna === 'descricaocc' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'descricaocc'">▼</span>
                                </th>
                                <th @click="ordenarPor('porccentrocusto')" style="cursor: pointer;">
                                    Porc. Centro Custo <span v-if="ordemColuna === 'porccentrocusto' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'porccentrocusto'">▼</span>
                                </th>
                                <th @click="ordenarPor('complemento')" style="cursor: pointer;">
                                    Complemento <span v-if="ordemColuna === 'complemento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'complemento'">▼</span>
                                </th>
                                <th @click="ordenarPor('fpagamento')" style="cursor: pointer;">
                                    FormaPagamento <span v-if="ordemColuna === 'fpagamento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'fpagamento'">▼</span>
                                </th>
                                <!-- <th @click="ordenarPor('cancelado')" style="cursor: pointer;">
                                    Cancelado <span v-if="ordemColuna === 'cancelado' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'cancelado'">▼</span>
                                </th>
                                <th @click="ordenarPor('motivocanc')" style="cursor: pointer;">
                                    MotivoCanc <span v-if="ordemColuna === 'motivocanc' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'motivocanc'">▼</span>
                                </th> -->
                                <!-- <th @click="ordenarPor('dtlancamento')" style="cursor: pointer;">
                                    DtLancamento <span v-if="ordemColuna === 'dtlancamento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtlancamento'">▼</span>
                                </th> -->
                                
                               <!--  <th @click="ordenarPor('dtcriacao')" style="cursor: pointer;">
                                    Dt Criação <span v-if="ordemColuna === 'dtcriacao' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtcriacao'">▼</span>
                                </th>
                                <th @click="ordenarPor('codusariocad')" style="cursor: pointer;">
                                    Cod. Usuário CAD <span v-if="ordemColuna === 'codusariocad' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'codusariocad'">▼</span>
                                </th> -->
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
                                <td>{{ conta.documento }}</td>
                                <td>{{ conta.titulo }}</td>
                                <td>{{ conta.nf }}</td>
                                <td>{{ conta.emissaonf }}</td>
                                <td>{{ conta.dtvencimento }}</td>
                                <td>{{ conta.dtbaixa }}</td>
                                <td :title="conta.cliente">{{ truncate(conta.cliente) }}</td>
                                <td :title="conta.contadre">{{ truncate(conta.contadre) }}</td>
                                 <td>{{ conta.vbruto }}</td>
                                <td>{{ conta.valor }}</td>
                                <td>{{ conta.valorcc }}</td>
                                <td>{{ conta.descricaocc }}</td>
                                <td>{{ conta.porccentrocusto }}</td>
                                <td :title="conta.complemento">{{ truncate(conta.complemento) }}</td>
                               <td>{{ conta.fpagamento }}</td>
                                <!-- <td>{{ conta.centrocusto }}</td> -->
                                <!-- <td>{{ conta.cancelado }}</td>
                                <td>{{ conta.motivocanc }}</td> -->
                                <!-- <td>{{ conta.dtlancamento }}</td> -->
                               
                                <!-- <td>{{ conta.dtcriacao }}</td>
                                <td>{{ conta.codusuariocad }}</td> -->
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
            filterValue:null,
            selectedColumn:[],
            columns: [
                    "Titulo",
                    "NF",
                    "EmissãoNF",
                    "DtVencimento",
                    "DtBaixa",
                    "Cliente",
                    "Documento",
                    "ContaDre",
                    "Complemento",
                    "ValorBruto",
                    "Valor",
                    "Centro Custo",
                    "Porc. Centro Custo",
                    "Descrição CC",
                    "Valor CC",
                    "FormaPagamento",
                    "Cancelado",
                    "MotivoCanc",
                    "DtLancamento"
                    ],
            originalColum: [
                    "titulo",
                    "nf",
                    "emissaonf",
                    "dtvencimento",
                    "dtbaixa",
                    "cliente",
                    "documento",
                    "contadre",
                    "complemento",
                    "vbruto",
                    "valor",
                    "centrocusto",
                    "porccentrocusto",
                    "descricaocc",
                    "valorcc",
                    "fpagamento",
                    "cancelado",
                    "motivocanc",
                    "dtlancamento"
                    ],
            filteredRows:[],
            lenthTrunc:20,
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    computed:{
        Rows() {
            var rows = 0;

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
            })

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

                if(this.selectedColumn === "Cancelado")
                {
                    value = row[this.originalColum[i]];
                    if (value !== "SIM" && value !== "NÃO") 
                    {
                        return false;
                    }
                }
                else if(this.selectedColumn === "DtVencimento" || this.selectedColumn === "EmissãoNF" || 
                this.selectedColumn === "DtBaixa" || this.selectedColumn === "DtLancamento")
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
            if(this.Rows == false)
            {
                return [];
            }
            else
            {
                return this.Rows.map(conta => ({
                ...conta,
                cliente: conta.cliente,
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

                const response = await api.getFile(`GetAllContasReceberExcel?datainicial=${this.dataini}&datafinal=${this.datafina}`);

                if (response.status === 200) 
                {

                    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `ContasReceber_${api.DataTraco(this.dataini)}_${api.DataTraco(this.datafina)}.xlsx`);

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
                toast.error("Erro ao exportar Contas a Receber.");
            }

            api.loadingOff();
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
        async SetarCalculo(conta,e)
        {

            let data = {
                id:conta.id,
                setar:e.currentTarget.checked
            }
            api.loadingOn();
            await api.get("SetarContaCalculoRC",data).then(r=>
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

                await api.get("ExcluirContaRC",data).then(r=>
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
                        this.GetAllContasReceber();
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
                const dataEmissaoNF = conta.emissaonf ? formatarData(conta.emissaonf) : null ;
                const dataBaixa = conta.dtbaixa ? formatarData(conta.dtbaixa) : null;
                return (
                    (dataEmissaoNF >= dataInicioFormatada && dataEmissaoNF <= dataFimFormatada) || 
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

            api.get("sincReceber",data).then(r=>
            {
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
                }else{
                    api.loadingOff();
                    toast("Contas a Receber Atualizadas Com Sucesso !!!");
                    this.GetAllContasReceber();
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

            this.lstContas.sort((a, b) => {
                let valorA = a[coluna];
                let valorB = b[coluna];

                // Tratar colunas de data usando as variáveis do v-for
                if (['emissaonf', 'dtlancamento', 'dtvencimento', 'dtbaixa', 'dtcriacao'].includes(coluna)) {
                    valorA = a[coluna] ? Date.parse(a[coluna].split('/').reverse().join('-')) : null;
                    valorB = b[coluna] ? Date.parse(b[coluna].split('/').reverse().join('-')) : null;
                }


                // Tratar valores decimais usando as variáveis do v-for
                else if (['vbruto', 'valor', 'valorcc','porccentrocusto'].includes(coluna)) {
                    valorA = parseFloat(valorA.replace('.', '').replace(',', '.').replace('%',''));
                    valorB = parseFloat(valorB.replace('.', '').replace(',', '.').replace('%',''));
                }

                // Tratar valores numéricos
                else if (['id', 'titulo', 'centrocusto', 'codusariocad'].includes(coluna)) {
                    valorA = Number(valorA);
                    valorB = Number(valorB);
                }

                else if (coluna === "excluircalculo") {
                    valorA = valorA == true ? 1 : 0;
                    valorB = valorB == true ? 1 : 0;
                }

                // Ordenação caso valores sejam nulos
                if (valorA === null) return this.ordem === "asc" ? 1 : -1;
                if (valorB === null) return this.ordem === "asc" ? -1 : 1;

                
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

            this.dataini="";
            this.datafina="";
            this.hdndataini="";
            this.hdndatafina="";

            document.getElementById("txt_DataIni").value = "";
            document.getElementById("txt_DataFina").value = "";
            document.getElementById("hdn_DataIni").value = "";
            document.getElementById("hdn_DataFina").value = "";

            this.lstContas = this.lstGuardar;

            M.updateTextFields();
        },
        async GetAllContasReceber()
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
            await api.get("GetAllContasReceber",dados).then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.lstContas = r.data.contasreceber;
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
        this.GetAllContasReceber();
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