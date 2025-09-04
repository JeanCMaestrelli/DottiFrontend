<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">MAPA INDIVIDUAL</h5>
            <div class="divider" style="height: 10px;"></div>
            <br>
            <div class="painel z-depth-1">
                <br>
                <form v-on:submit.prevent="onSubmit">
                    <div class="row">

                        <div class="input-field col l4 m4 s12 offset-l2 offset-m2">
                            <i style="cursor: pointer;" class="material-icons prefix clickable" @click="PickerOpen('hdn_DataIni')">insert_invitation</i>
                            <input type="text" v-model="dataini"  id="txt_DataIni" 
                                @keyup="Datas(this.dataini,'dataini',1,'txt_DataIni')"  @blur="Datas(this.dataini,'dataini',2,'txt_DataIni')" maxlength="10" placeholder="DD/MM/AAAA">
                            <label for="txt_DataIni">Data Inicial</label>
                        </div>

                        <div class="input-field col l4 m4 s12 ">
                            <i style="cursor: pointer;" class="material-icons prefix clickable" @click="PickerOpen('hdn_DataFina')">insert_invitation</i>
                            <input type="text" v-model="datafina"  id="txt_DataFina" 
                                @keyup="Datas(this.datafina,'datafina',1,'txt_DataFina')"  @blur="Datas(this.datafina,'datafina',2,'txt_DataFina')" maxlength="10" placeholder="DD/MM/AAAA">
                            <label for="txt_DataFina">Data Final</label>
                        </div>
                    </div>

                    <input v-model="hdndataini" @change="handleInsertData('txt_DataIni','hdn_DataIni','dataini')" hidden type="text" class="datepicker" id="hdn_DataIni">
                    <input v-model="hdndatafina" @change="handleInsertData('txt_DataFina','hdn_DataFina','datafina')" hidden type="text" class="datepicker" id="hdn_DataFina">
                    
                    <div class="row ">
                        <div class="input-field col s12 ">
                            <multiselect id="socios"
                            v-model="sociosSelecionados"
                            :disabled="desabilitadoSocio"
                            :toggleAll="true"
                            :options="lstSocios"
                            :multiple="true"
                            :close-on-select="false"
                            placeholder="Selecionar Sócios"
                            label="nome"
                            track-by="codsocio"
                            select-label="Selecionar"
                            selected-label="Selecionado"
                            deselect-label="Remover"
                            @close = "BuscarMapasSocios()"
                            @remove = "BuscarMapasSocios()"
                            >
                            <template #noResult>
                                <span>Nenhum sócio encontrado</span>
                            </template>

                            <template #noOptions>
                                <span>Sem sócios disponíveis</span>
                            </template>
                            </multiselect>
                        </div>
                    </div>
                </form>

            </div>
            <br>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table class="centered striped responsive-table" id="tabDados">
                        <thead>
                            <tr>
                                <th>Sócio</th>
                                <th>Períodos</th>
                                <th>Visualizar</th>
                                <th>Pdf</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="socio in lstSociosPeriodos" :key="socio.CODSOCIO">
                                <td>{{ socio.nome }}</td>
                                <td>
                                <multiselect
                                    v-model="socio.selectedPeriodos"
                                    :options="socio.periodos"
                                    label="periodo"
                                    track-by="codmapa"
                                    placeholder="Selecione períodos"
                                    select-label="Selecionar"
                                    selected-label="Selecionado"
                                    deselect-label="Remover">

                                    <template #noResult>
                                    <span>Nenhum período encontrado</span>
                                    </template>

                                    <template #noOptions>
                                    <span>Sem períodos disponíveis</span>
                                    </template>
                                </multiselect>
                                </td>
                                <td>
                                    <a id="visualizar" @click="VerCalculo(socio.selectedPeriodos)" class="btn-floating btn-small waves-effect waves-light"><i class="material-icons">visibility</i></a>
                                </td>
                                <td>
                                    <a id="pdf" @click="ExportPdf(socio.selectedPeriodos)" class="btn-floating btn-small waves-effect waves-light"><i class="material-icons">picture_as_pdf</i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Structure -->
    <div id="FormCalculo" class="modal">
        <div class="modal-content">
            <form v-on:submit.prevent="onSubmit" style="font-size: smaller;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h5 id="datatitulo" style="font-weight: bold; text-align: left; margin: 0;">
                        {{datatitulo}}
                    </h5>
                    <div style="flex: 1; text-align: center;">
                        <h5 id="titulo" style="font-weight: bold; margin: 0;">
                            {{titulomodal}}
                        </h5>
                    </div>
                </div>
                <div class="divider" style="height: 10px;"></div>
                <!-- campos cadastro NucleosSubHeader -->
                <br>
                <ul id="tabs-swipe-demo" class="tabs">
                    <li class="tab col s3"><a class="active" quad="quadro1" href="#quadro1">CÁLCULO</a></li>
                    <li class="tab col s3"><a quad="quadro2" href="#quadro2">MAPA INDIVIDUAL</a></li>
                </ul>
                <div id="quadro1" class="col s12">
                    <div class="row" >
                        <table id="tabcalculo" class="striped highlight">
                            <thead  style="border: 1px solid #85714d;background-color: rgb(133 113 77);color: white;">
                                <tr >
                                    <th rowspan="2" class="center">CONTA</th>
                                    <th rowspan="2" class="center">HISTÓRICO</th>
                                    <th rowspan="2" class="center">PARTIC.%</th>
                                    <th rowspan="2" class="center" style="border-right: 1px solid !important;">TOTAIS</th>
                                    <th colspan="2" v-for="nuc in NucleosHeader" :key="nuc.codnuleo" style="text-align: center;border: 1px solid !important;">
                                        <span style="display: block; text-overflow: ellipsis;">{{ nuc.nucleo }}</span>
                                    </th>
                                </tr>
                                <tr>
                                    <th v-for="nuc2 in NucleosSubHeader" :key="nuc2.codnuleo" style="border-right: 1px solid !important;">
                                        <span style="display: inline-block; text-overflow: ellipsis;">{{ nuc2.nucleo }}</span>
                                        <span style="float: right; margin-right: 5px;">%</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody style="border: 1px solid;">
                                <tr v-for="conta in Relatorio" :key="conta.codigo" :class="{ destaque: ['2','2.2.1','2.3.1','2.4.1','3','5','7','9'].includes(conta.cgerencial) }">
                                    <td class="bordas ">{{conta.cgerencial}}</td>
                                    <td class="bordas ">{{conta.historico}}</td>
                                    <td class="bordas ">{{conta.particf}}</td>
                                    <td class="bordas " v-if="conta.valorformat === '0,00' || conta.valorformat === ''">-</td>
                                    <td class="bordas " v-else>{{ conta.valorformat }}</td>
                                    <td class="bordas" style="min-width: 130px;" v-for="cc in conta.centroscusto" :key="cc.codigo" >
                                        <span v-if="cc.valorformat === '0,00' || cc.valorformat === ''" style="float: left;">-</span>
                                        <span v-else style="float: left;">{{ cc.valorformat }}</span>
                                        <span v-if="cc.porcentf === '0,00' || cc.porcentf === ''" style="float: right;">-</span>
                                        <span v-else style="float: right;">{{ cc.porcentf }}</span>
                                    </td>
                                </tr>
                            </tbody>
                    </table>
                    </div>
                </div>
                <div id="quadro2" class="col s12">
                    <div class="row" style="overflow-x: scroll;">
                        <table id="tabcalculo2" class="striped highlight">
                            <thead  style="border: 1px solid; background-color: rgb(133, 113, 77); color: white;">
                                <tr >
                                    <th rowspan="2" class="center">ORIGEM</th>
                                    <th rowspan="2" class="center" style="border-right: 1px solid !important;">TOTAIS</th>
                                    <th colspan="2" v-for="nuc in NucleosHeader" :key="nuc.codnuleo" style="text-align: center;border: 1px solid !important;">
                                        <span style="display: block; text-overflow: ellipsis;">{{ nuc.nucleo }}</span>
                                    </th>
                                </tr>
                                <tr>
                                    <th v-for="nuc2 in NucleosSubHeader" :key="nuc2.codnuleo" style="border-right: 1px solid !important;">
                                        <span style="display: inline-block; text-overflow: ellipsis;">{{ nuc2.nucleo }}</span>
                                        <span style="float: right; margin-right: 5px;">%</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody style="border: 1px solid;">
                                <tr v-for="conta in Distrib" :key="conta.codigo">
                                    <td class="bordas">{{conta.origem}}</td>
                                    <td class="bordas" v-if="conta.valorformat === '0,00' || conta.valorformat === ''">-</td>
                                    <td class="bordas" v-else>{{ conta.valorformat }}</td>
                                    <td class="bordas" style="min-width: 130px;" v-for="cc in conta.centroscusto" :key="cc.codigo" >
                                        <span v-if="cc.valorformat === '0,00' || cc.valorformat === ''" style="float: left;">-</span>
                                        <span v-else style="float: left;">{{ cc.valorformat }}</span>
                                        <!-- <span style="float: right;">-</span> -->
                                        <span v-if="cc.porcentf === '0,00' || cc.porcentf === ''" style="float: right;">-</span>
                                        <span v-else style="float: right;">{{ cc.porcentf }}</span>
                                    </td>
                                </tr>
                            </tbody>
                    </table>
                    </div>
                </div>
            

                <!-- campos cadastro -->
                <div class="divider"></div>
                <br>
                <div id="modalbotoes">
                    <button type="button" style="margin-left: 15px;" id="EditarEventoModal" @click="FecharModal()" class="waves-effect waves-light btn right btnsEventos ">Fechar</button>
                    <button type="button" style="margin-left: 15px;" id="ImprimirMapa" @click="ImprimirMapa()" class="waves-effect waves-light btn right btnsEventos ">Imprimir</button>
                </div>
                <br>
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
  import multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import domtoimage from 'dom-to-image';

  const toast = useToast();

  export default {
    name: 'DistribuicaoSociosMapa1',
    components: {
      MenuLateral,
      multiselect
    },
    data () {
        return {
            dataini:"",
            datafina:"",
            hdndataini:"",
            hdndatafina:"",
            CODUSUARIOCAD : "",
            Relatorio:[],
            Nucleos:[],
            NucleosHeader: [],
            NucleosSubHeader:[],
            Distrib:[],
            selectedRows:[],
            titulomodal:"Mapa de Distribuição Individual",
            lstPeriodos:[],
            periodosSelecionados:[],
            lstSocios:[],
            sociosSelecionados:[],
            lstSociosPeriodos:[],
            desabilitado:true,
            desabilitadoSocio:true,
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    computed:{
    },
    methods:
    {
        async ImprimirMapa()
        {
            api.loadingOn();

            var tabela = null;

            const activeTab = document.querySelector('#tabs-swipe-demo .tab a.active');
            const activeTabId = activeTab.getAttribute('quad');
            if (activeTabId === "quadro1") {
                tabela = document.getElementById('tabcalculo');
            } else if (activeTabId === "quadro2") {
                tabela = document.getElementById('tabcalculo2');
            } else {
                toast.error('Nenhuma aba ativa encontrada.');
            }

            const originalWidth = tabela.style.width;
            const originalMaxWidth = tabela.style.maxWidth;

            //tabela.style.width = '1.024px';
            tabela.style.maxWidth = 'none';

            domtoimage.toPng(tabela,{
                width: tabela.offsetWidth * 2, // dobra a resolução horizontal
                height: tabela.offsetHeight * 2, // dobra a resolução vertical
                style: {
                    transform: 'scale(2)',
                    transformOrigin: 'top left',
                    width: `${tabela.offsetWidth}px`,
                    height: `${tabela.offsetHeight}px`
                }
            })
            .then(async (dataUrl) => {
                // Restaura estilos originais
                tabela.style.width = originalWidth;
                tabela.style.maxWidth = originalMaxWidth;

                var dados = { 
                    imagem: dataUrl,
                    Periodo:this.datatitulo.split('-')[0].trim(),
                    Socio: this.datatitulo.split('-')[1].trim(),
                }

                await api.postImage("ImprimirMapaInd",dados).then(r=>{
                    if(r.status == 401)
                    {
                        api.loadingOff();
                        toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                        this.$router.push({ path: '/'});
                        return;
                    }
                    else if(r.status == 200)
                    {
                
                        const file = new Blob([r.data], { type: 'application/pdf' });
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL); // ou use window.location.href = fileURL para 

                        api.loadingOff();

                        M.updateTextFields();
                    }
                    else
                    {
                        toast.error(r.data.message);
                        api.loadingOff();
                    }
                    });
            })
            .catch((error) => {

                tabela.style.width = originalWidth;
                tabela.style.maxWidth = originalMaxWidth;
                api.loadingOff();
                toast.error('Erro ao gerar imagem da tabela: '+error);
            });
        },
        async ExportPdf(periodoSelecionado)
        {
            if(periodoSelecionado.length == 0)
            {
                toast.error("Selecione um período antes de exportar para pdf.");
                return;
            }
             
            api.loadingOn();

            var dados =
            {
                codigo:periodoSelecionado.codmapa,
                codsocio:periodoSelecionado.codsocio,
            };

            await api.getFilePDF("ExportarPdfDistInd",dados).then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                
                const file = new Blob([r.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL); // ou use window.location.href = fileURL para 

                api.loadingOff();

                M.updateTextFields();
    
            }
            else
            {
                toast.error(r.data.message);
                api.loadingOff();
            }
            });
        },
        async VerCalculo(periodoSelecionado)
        {
            if(periodoSelecionado.length == 0)
            {
                toast.error("Selecione um período antes de visualizar o relatório.");
                return;
            }

            this.TotDistrib = 0;
            this.TotDistrib2 = 0;

            let options = {
                endingTop:'3%',
                onOpenEnd:function()
                {
                    M.Tabs.init(document.getElementById("tabs-swipe-demo"), {});
                }
            };

            M.Modal.init(document.getElementById("FormCalculo"), options);
            M.Modal.getInstance(document.getElementById("FormCalculo")).open();
             
            api.loadingOn();

            var dados =
            {
                codigo:periodoSelecionado.codmapa,
                codsocio:periodoSelecionado.codsocio
            };

            await api.get("getallMapaIndView",dados).then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                
                this.Relatorio = r.data.mapa1;
                this.Nucleos = r.data.nucleos;
                this.NucleosHeader = r.data.nucleos.filter(item => !item.nucleo.includes("ESPECIAL"));
                this.NucleosSubHeader = r.data.nucleosheader;
                this.Distrib = r.data.distrib;

                this.datatitulo = periodoSelecionado.periodo + " - " + periodoSelecionado.nome;

                r.data.distrib.forEach(item => 
                {
                    this.TotDistrib += api.converterParaNumero(item.valorformat);
                });

                this.TotDistrib = api.ConvertMoeda(this.TotDistrib);

                api.loadingOff();

                M.updateTextFields();
    
            }
            else
            {
                toast.error(r.data.message);
                api.loadingOff();
            }
            });
        },
        async BuscarMapasSocios()
        {
           /*  if(this.sociosSelecionados.length == 0)
            {
                return;
            } */

            if(this.dataini === "" || this.datafina === "")
            {
                 toast.error("Informe as datas antes de buscar os períodos.");
                 return;
            }
            else if(this.dataini !== "" && this.datafina !== "")
            {
                if(api.verificarDatas(this.dataini,this.datafina) == 1)
                {
                    toast.error("A data inicial não pode ser maior que a final.");
                    return;
                }
            }


            api.loadingOn();

            let socios = this.sociosSelecionados.map(item => Number(item.codsocio));

            let dados = 
            {
                codsocios:socios,
                datainicial:this.dataini,
                datafinal:this.datafina
            }

            await api.post("BuscarSociosPeriodos",dados).then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200)
            {
                this.lstSociosPeriodos = r.data.socios.map(socio => {
                    return {
                    ...socio,
                    selectedPeriodos: [] // ou: [...socio.periodos] se quiser pré-selecionar todos
                    };
                });

                api.loadingOff();
                M.updateTextFields();
            }
            else
            {
                toast.error(r.data.message);
                api.loadingOff();
            }
            });
        },
        async BuscarSocios()
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

                api.loadingOff();

                M.updateTextFields();
            }
            else
            {
                toast.error(r.data.message);
                api.loadingOff();
            }
            });
        },
        async BuscarPeriodoMapas()//desativado
        {
            if(this.dataini === "" || this.datafina === "")
            {
                 toast.error("Informe as datas antes de buscar os períodos.");
                 return;
            }
            else if(this.dataini !== "" && this.datafina !== "")
            {
                if(api.verificarDatas(this.dataini,this.datafina) == 1)
                {
                    toast.error("A data inicial não pode ser maior que a final.");
                    return;
                }
            }

            api.loadingOn();

            var dados = {
                dtinicial:this.dataini,
                dtfinal:this.datafina
            };

            await api.get("BuscarPeriodoMapas",dados).then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200)
            {
                this.lstPeriodos = r.data.periodos;
                this.desabilitado = false;
                api.loadingOff();
                M.updateTextFields();
            }
            else
            {
                toast.error(r.data.message);
                api.loadingOff();
            }
            });
        },
        FecharModal()
        {
            M.Modal.getInstance(document.getElementById("FormCalculo")).close();
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

                    if(this.dataini !== "" && this.datafina !== "")
                    {
                        if(api.verificarDatas(this.dataini,this.datafina) == 1)
                        {
                            toast.error("A data inicial não pode ser maior que a final.");
                        }
                        else
                        {
                            this.sociosSelecionados = [];
                            this.lstSociosPeriodos = [];
                            this.BuscarSocios();
                            this.desabilitadoSocio = false;
                        }
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
            document.getElementById(dataobj).focus();
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
    },
    created()
    {
        this.dataini = "01/01/2025";
        this.datafina= "31/08/2025";  
        /* this.dataini = "";
        this.datafina= "";   */
        //toast("Informe a Data Inicial e Final do Período que Deseja Consultar.");
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

    .destaque 
    {
        background-color: #ffeeba !important;
        font-weight: bold;
        border-left: 4px solid #ffc107;
        font-size: 13px;
    }

  .multiselect__option[title="Press enter to select"]::after {
  content: "Pressione Enter para selecionar";
}

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
    table 
    {
        border-spacing: 2px;
    }
    td, th 
    {
        white-space: nowrap;
    }

    td span 
    {
        white-space: nowrap;
        display: inline-block; /* Mantém os elementos lado a lado */
    }

    .bordas
    {
        border-left: 1px solid;
        border-right: 1px solid ;
        padding: 8px;
        white-space: nowrap;
    }

    .colunas
    {
        background-color: rgb(133, 113, 77);
        color: white;
    }

    .modal 
    {
        max-height: 95%;
        width: 95%;
    }
tr:hover {
    background-color: rgba(0, 0, 0, 0.2) !important; /* Ajuste a opacidade conforme necessário */
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