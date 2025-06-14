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
                        <div class="col s12">
                            <div class="input-field col l5 m5 s12 offset-l1 offset-m1">
                                <i style="cursor: pointer;" class="material-icons prefix clickable" @click="PickerOpen('hdn_DataIni')">insert_invitation</i>
                                <input type="text" v-model="dataini"  id="txt_DataIni" 
                                @keyup="Datas(this.dataini,'dataini',1,'txt_DataIni')"  @blur="Datas(this.dataini,'dataini',2,'txt_DataIni')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_DataIni">Data Inícial</label>
                            </div>
                            <div class="input-field col l5 m5 s12 ">
                                <i style="cursor: pointer;" class="material-icons prefix clickable" @click="PickerOpen('hdn_DataFina')">insert_invitation</i>
                                <input type="text" v-model="datafina"  id="txt_DataFina" 
                                @keyup="Datas(this.datafina,'datafina',1,'txt_DataFina')"  @blur="Datas(this.datafina,'datafina',2,'txt_DataFina')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_DataFina">Data Final</label>
                            </div>
                        </div>
                    </div>
                    <input v-model="hdndataini" @change="handleInsertData('txt_DataIni','hdn_DataIni','dataini')" hidden type="text" class="datepicker" id="hdn_DataIni">
                    <input v-model="hdndatafina" @change="handleInsertData('txt_DataFina','hdn_DataFina','datafina')" hidden type="text" class="datepicker" id="hdn_DataFina">
                    <br>
                    <div class="row ">
                        <button id="SincronizarContas" @click="SincronizarContas($event)" class="waves-effect waves-light btn right btnsEventos">Importar Contas</button>
                        <button id="Filtrar" @click="GetAllContasReceber()" class="waves-effect waves-light btn right btnsEventos">Filtrar</button>
                    </div>
                </form>
                <br>
            </div>
            <br>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table :items="Rows" class="centered striped responsive-table" id="tabDados">
                        <thead>
                            <tr>
                                
                                <th @click="ordenarPor('titulo')" style="cursor: pointer;">
                                    Titulo <span v-if="ordemColuna === 'titulo' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'titulo'">▼</span>
                                </th>
                                <th @click="ordenarPor('nf')" style="cursor: pointer;">
                                    NF <span v-if="ordemColuna === 'nf' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'nf'">▼</span>
                                </th>
                                <th @click="ordenarPor('emissaonf')" style="cursor: pointer;">
                                    Emissão NF <span v-if="ordemColuna === 'emissaonf' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'emissaonf'">▼</span>
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
                                <th @click="ordenarPor('documento')" style="cursor: pointer;">
                                    Documento <span v-if="ordemColuna === 'documento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'documento'">▼</span>
                                </th>
                                <th @click="ordenarPor('contadre')" style="cursor: pointer;">
                                    ContaDre <span v-if="ordemColuna === 'contadre' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'contadre'">▼</span>
                                </th>
                                <th @click="ordenarPor('complemento')" style="cursor: pointer;">
                                    Complemento <span v-if="ordemColuna === 'complemento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'complemento'">▼</span>
                                </th>
                                <th @click="ordenarPor('vbruto')" style="cursor: pointer;">
                                    ValorBruto <span v-if="ordemColuna === 'vbruto' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'vbruto'">▼</span>
                                </th>
                                <th @click="ordenarPor('valor')" style="cursor: pointer;">
                                    Valor <span v-if="ordemColuna === 'valor' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'valor'">▼</span>
                                </th>
                                <th @click="ordenarPor('centrocusto')" style="cursor: pointer;">
                                    Centro Custo <span v-if="ordemColuna === 'centrocusto' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'centrocusto'">▼</span>
                                </th>
                                <th @click="ordenarPor('porccentrocusto')" style="cursor: pointer;">
                                    Porc. Centro Custo <span v-if="ordemColuna === 'porccentrocusto' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'porccentrocusto'">▼</span>
                                </th>
                                <th @click="ordenarPor('descricaocc')" style="cursor: pointer;">
                                    Descrição CC <span v-if="ordemColuna === 'descricaocc' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'descricaocc'">▼</span>
                                </th>
                                <th @click="ordenarPor('valorcc')" style="cursor: pointer;">
                                    Valor CC <span v-if="ordemColuna === 'valorcc' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'valorcc'">▼</span>
                                </th>
                                <th @click="ordenarPor('fpagamento')" style="cursor: pointer;">
                                    FormaPagamento <span v-if="ordemColuna === 'fpagamento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'fpagamento'">▼</span>
                                </th>
                                <th @click="ordenarPor('cancelado')" style="cursor: pointer;">
                                    Cancelado <span v-if="ordemColuna === 'cancelado' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'cancelado'">▼</span>
                                </th>
                                <th @click="ordenarPor('motivocanc')" style="cursor: pointer;">
                                    MotivoCanc <span v-if="ordemColuna === 'motivocanc' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'motivocanc'">▼</span>
                                </th>
                                <th @click="ordenarPor('dtlancamento')" style="cursor: pointer;">
                                    DtLancamento <span v-if="ordemColuna === 'dtlancamento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtlancamento'">▼</span>
                                </th>
                               <!--  <th @click="ordenarPor('dtcriacao')" style="cursor: pointer;">
                                    Dt Criação <span v-if="ordemColuna === 'dtcriacao' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtcriacao'">▼</span>
                                </th>
                                <th @click="ordenarPor('codusariocad')" style="cursor: pointer;">
                                    Cod. Usuário CAD <span v-if="ordemColuna === 'codusariocad' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'codusariocad'">▼</span>
                                </th> -->
                            </tr>

                        </thead>
                        <tbody>
                            <tr v-for="conta in lstContas" :key="conta.id"> 
                                <td>{{ conta.titulo }}</td>
                                <td>{{ conta.nf }}</td>
                                <td>{{ conta.emissaonf }}</td>
                                <td>{{ conta.dtvencimento }}</td>
                                <td>{{ conta.dtbaixa }}</td>
                                <td>{{ conta.cliente }}</td>
                                <td>{{ conta.documento }}</td>
                                <td>{{ conta.contadre }}</td>
                                <td>{{ conta.complemento }}</td>
                                <td>{{ conta.vbruto }}</td>
                                <td>{{ conta.valor }}</td>
                                <td>{{ conta.centrocusto }}</td>
                                <td>{{ conta.porccentrocusto }}</td>
                                <td>{{ conta.descricaocc }}</td>
                                <td>{{ conta.valorcc }}</td>
                                <td>{{ conta.fpagamento }}</td>
                                <td>{{ conta.cancelado }}</td>
                                <td>{{ conta.motivocanc }}</td>
                                <td>{{ conta.dtlancamento }}</td>
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
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    computed:{
        Rows() {
            var rows = 0;
            return this.lstContas.find(() => {
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
        }
    },
    methods:
    {
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
                if (['vbruto', 'valor', 'valorcc','porccentrocusto'].includes(coluna)) {
                    valorA = parseFloat(valorA.replace('.', '').replace(',', '.').replace('%',''));
                    valorB = parseFloat(valorB.replace('.', '').replace(',', '.').replace('%',''));
                }

                // Tratar valores numéricos
                if (['id', 'titulo', 'centrocusto', 'codusariocad'].includes(coluna)) {
                    valorA = Number(valorA);
                    valorB = Number(valorB);
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
        //this.GetAllContasReceber();
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