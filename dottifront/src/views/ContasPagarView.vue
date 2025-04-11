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
                        <div class="col s12">
                            <div class="input-field col l5 m5 s12 offset-l1 offset-m1">
                                <i style="cursor: pointer;" class="material-icons prefix clickable" @click="PickerOpen('hdn_DataIni')">insert_invitation</i>
                                <input type="text" v-model="dataini"  id="txt_DataIni" 
                                @change="filtar('dtvencimento','dataini')"  @keyup="Datas(this.dataini,'dataini',1,'txt_DataIni')"  @blur="Datas(this.dataini,'dataini',2,'txt_DataIni')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_DataIni">Data Inícial</label>
                            </div>
                            <div class="input-field col l5 m5 s12 ">
                                <i style="cursor: pointer;" class="material-icons prefix clickable" @click="PickerOpen('hdn_DataFina')">insert_invitation</i>
                                <input type="text" v-model="datafina"  id="txt_DataFina" 
                                @change="filtar('dtvencimento','datafina')"  @keyup="Datas(this.datafina,'datafina',1,'txt_DataFina')"  @blur="Datas(this.datafina,'datafina',2,'txt_DataFina')" maxlength="10" placeholder="DD/MM/AAAA">
                                <label for="txt_DataFina">Data Final</label>
                            </div>
                        </div>
                    </div>
                    <input v-model="hdndataini" @change="handleInsertData('txt_DataIni','hdn_DataIni','dataini','dtvencimento')" hidden type="text" class="datepicker" id="hdn_DataIni">
                    <input v-model="hdndatafina" @change="handleInsertData('txt_DataFina','hdn_DataFina','datafina','dtvencimento')" hidden type="text" class="datepicker" id="hdn_DataFina">
                    <br>
                    <div class="row ">
                        <button id="SincronizarContas" @click="SincronizarContas($event)" class="waves-effect waves-light btn right btnsEventos">Importar Contas</button>
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
                            <th  @click="ordenarPor('titulo')" style="cursor: pointer;">
                                Titulo <span v-if="ordemColuna === 'titulo' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'titulo'">▼</span>
                            </th>
                            <th  @click="ordenarPor('dtlancamento')" style="cursor: pointer;">
                                Dtlancamento <span v-if="ordemColuna === 'dtlancamento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtlancamento'">▼</span>
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
                            <th  @click="ordenarPor('documento')" style="cursor: pointer;">
                                Documento <span v-if="ordemColuna === 'documento' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'documento'">▼</span>
                            </th>
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
                            <th  @click="ordenarPor('cancelado')" style="cursor: pointer;">
                                Cancelado <span v-if="ordemColuna === 'cancelado' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'cancelado'">▼</span>
                            </th>
                            <th  @click="ordenarPor('motivocanc')" style="cursor: pointer;">
                                MotivoCanc <span v-if="ordemColuna === 'motivocanc' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'motivocanc'">▼</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="conta in lstContas" :key="conta.id"> 
                                <td>{{ conta.titulo }}</td>
                                <td>{{ conta.dtlancamento }}</td>
                                <td>{{ conta.dtvencimento }}</td>
                                <td>{{ conta.dtbaixa }}</td>
                                <td>{{ conta.fornecedor }}</td>
                                <td>{{ conta.documento }}</td>
                                <td>{{ conta.contadre }}</td>
                                <td>{{ conta.complemento }}</td>
                                <td>{{ conta.vbruto }}</td>
                                <td>{{ conta.fpagamento }}</td>
                                <td>{{ conta.cancelado }}</td>
                                <td>{{ conta.motivocanc }}</td>
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
        async GetAllContasPagar()
        {
            api.loadingOn();
            await api.get("GetAllContasPagar").then(r=>{
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
        handleInsertData(dataobj,hdnobj,variavel,filtro)
        {
            document.getElementById(dataobj).value = document.getElementById(hdnobj).value;
            this[variavel] = document.getElementById(hdnobj).value;
            this.filtar(filtro,variavel);
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