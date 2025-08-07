<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">MAPA DE DISTRIBUIÇÃO</h5>
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
                                <label for="txt_DataIni">Data Inicial</label>
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
                        <button id="NovoCalculo" @click="NovoCalculo($event)" class="waves-effect waves-light btn right btnsEventos">Novo Cálculo</button>
                        <button id="Filtrar" @click="filtrarContasPorPeriodo()" class="waves-effect waves-light btn right btnsEventos">Filtrar</button>
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
                           <!--  <th>Marcar</th> -->
                            <th  @click="ordenarPor('codigo')" style="cursor: pointer;">
                                Codigo <span v-if="ordemColuna === 'codigo' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'codigo'">▼</span>
                            </th>
                            <th  @click="ordenarPor('dtinicial')" style="cursor: pointer;">
                                DataInicial <span v-if="ordemColuna === 'dtinicial' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtinicial'">▼</span>
                            </th>
                            <th  @click="ordenarPor('dtfinal')" style="cursor: pointer;">
                                DataFinal <span v-if="ordemColuna === 'dtfinal' && ordem === 'asc'">▲</span><span v-else-if="ordemColuna === 'dtfinal'">▼</span>
                            </th>
                            <th>Status</th>
                            <th>Visualizar</th>
                            <th>Fechar</th>
                            <th>Excluir</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="conta in lstContas" :key="conta.codigo">
<!--                                 <td>
                                    <label>
                                    <input type="checkbox" v-model="selectedRows" :value="conta"/>
                                    <span></span>
                                    </label>
                                </td> -->
                                <td>{{ conta.codigo }}</td>
                                <td>{{ conta.dtinicial }}</td>
                                <td>{{ conta.dtfinal }}</td>
                                <td v-if="conta.fechado == true">FECHADO</td>
                                <td v-else>ABERTO</td>
                                <td><a id="visualizar" @click="VerCalculo(conta.codigo,conta.dtinicial)" class="btn-floating btn-small waves-effect waves-light"><i class="material-icons">visibility</i></a></td>
                                <td v-if="conta.fechado == true && conta.escolhido == false"><a disabled id="fechar"  class="btn-floating btn-small waves-effect waves-light"><i class="material-icons">lock</i></a></td>
                                <td v-else-if="conta.fechado == true && conta.escolhido == true"><a id="fechar" @click="FecharMapa(conta.codigo,conta.fechado,1,null)" class="btn-floating btn-small waves-effect waves-light"><i class="material-icons">lock</i></a></td>
                                <td v-else><a id="fechar" @click="FecharMapa(conta.codigo,conta.fechado,1,null)" class="btn-floating btn-small waves-effect waves-light"><i class="material-icons">lock</i></a></td>
                                <td><a id="excluir" @click="ExcluirCalculo(conta.codigo,1)" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">delete_sweep</i></a></td>
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
                    <li class="tab col s3"><a class="active"  href="#test-swipe-1">CÁLCULO</a></li>
                    <li class="tab col s3"><a href="#test-swipe-2">MAPA 1</a></li>
                    <li class="tab col s3"><a href="#test-swipe-3">MAPA 2</a></li>
                </ul>
                <div id="test-swipe-1" class="col s12">
                    <div class="row" style="overflow-x: scroll;">
                        <table class="striped highlight">
                            <thead  style="border: 1px solid;">
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
                                <tr v-for="conta in Relatorio" :key="conta.codigo">
                                    <td class="bordas">{{conta.cgerencial}}</td>
                                    <td class="bordas">{{conta.historico}}</td>
                                    <td class="bordas">{{conta.particf}}</td>
                                    <td class="bordas" v-if="conta.valorformat === '0,00' || conta.valorformat === ''">-</td>
                                    <td class="bordas" v-else>{{ conta.valorformat }}</td>
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
                <div id="test-swipe-2" class="col s12">
                    <div class="row" style="overflow-x: scroll;">
                        <table class="striped highlight">
                            <thead  style="border: 1px solid;">
                                <tr >
                                    <th rowspan="2" class="center">GRUPO</th>
                                    <th rowspan="2" class="center">SÓCIO</th>
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
                                <tr v-for="conta in Distrib" :key="conta.codigo">
                                    <td class="bordas">{{conta.grupo}}</td>
                                    <td class="bordas">{{conta.socio}}</td>
                                    <td class="bordas">{{conta.particf}}</td>
                                    <td class="bordas" v-if="conta.valorformat === '0,00' || conta.valorformat === ''">-</td>
                                    <td class="bordas" v-else>{{ conta.valorformat }}</td>
                                    <td class="bordas" style="min-width: 130px;" v-for="cc in conta.centroscusto" :key="cc.codigo" >
                                        <span v-if="cc.valorformat === '0,00' || cc.valorformat === ''" style="float: left;">-</span>
                                        <span v-else style="float: left;">{{ cc.valorformat }}</span>
                                        <span style="float: right;">-</span>
                                        <!-- <span v-if="cc.porcentf === '0,00' || cc.porcentf === ''" style="float: right;">-</span> -->
                                        <!-- <span v-else style="float: right;">{{ cc.porcentf }}</span> -->
                                    </td>
                                </tr>
                                <!-- <tr>
                                    <td class="bordas">-</td>
                                    <td class="bordas">-</td>
                                    <td class="bordas">-</td>
                                    <td class="bordas" ><span style="font-weight: bold;">{{TotDistrib}}</span></td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                     <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                     <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                </tr> -->
                            </tbody>
                        </table>

                    </div>
                </div>
                <div id="test-swipe-3" class="col s12">
                    <div class="row" style="overflow-x: scroll;">
                        <table class="striped highlight">
                            <thead  style="border: 1px solid;">
                                <tr >
                                    <th rowspan="2" class="center">GRUPO</th>
                                    <th rowspan="2" class="center">SÓCIO</th>
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
                                <tr v-for="conta in Distrib2" :key="conta.codigo">
                                    <td class="bordas">{{conta.grupo}}</td>
                                    <td class="bordas">{{conta.socio}}</td>
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
                                <!-- <tr>
                                    <td class="bordas">-</td>
                                    <td class="bordas">-</td>
                                    <td class="bordas" ><span style="font-weight: bold;">{{TotDistrib2}}</span></td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                    <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                     <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                     <td class="bordas" style="min-width: 130px;">
                                        <span style="float: left;">-</span><span style="float: right;">-</span>
                                    </td>
                                </tr> -->
                            </tbody>
                    </table>
                    </div>
                </div>

                <!-- campos cadastro -->
                <div class="divider"></div>
                <br>
                <div id="modalbotoes">
                    <button type="button" style="margin-left: 15px;" id="EditarEventoModal" @click="FecharModal()" class="waves-effect waves-light btn right btnsEventos ">Fechar</button>
                    <button type="button" style="margin-left: 15px;" id="EditarEventoModal" @click="VerDetalhes($event)" class="waves-effect waves-light btn right btnsEventos ">Detalhes</button>
                </div>
                <br>
            </form>
        </div>
    </div>
    <!-- Modal Structure -->
    <div id="ConfimarExclusao" class="modal custom-width" >
        <div class="modal-content">
            <form v-on:submit.prevent="onSubmit">
                <h5 style="font-weight: bold;">Tem certeza que deseja Excluir?</h5>
                <div class="divider" style="height: 10px;"></div>
                <!-- campos cadastro -->
                <br>
                <br>
                <!-- campos cadastro -->
                <div class="divider"></div>
                <div id="modalbotoes">
                    <br>
                    <button type="submit" style="margin-left: 15px;margin-right: 15px;"  @click="ExcluirCalculo(0,0)"  
                    class="waves-effect waves-light btn right btnsEventos ">Sim</button>
                    <button type="button" style="margin-left: 15px;" 
                    class="waves-effect waves-light btn right btnsEventos modal-close">Não</button>
                    <br>
                </div>
               
            </form>
        </div>
    </div>
    <!-- Modal Structure -->
    <div id="FecharMapa" class="modal custom-width" >
        <div class="modal-content">
            <form v-on:submit.prevent="onSubmit">
                <h5 style="font-weight: bold;">{{ titulomodalFechar }}</h5>
                <div class="divider" style="height: 10px;"></div>
                <!-- campos cadastro -->
                <br>
                <br>
                <!-- campos cadastro -->
                <div class="divider"></div>
                <div id="modalbotoes">
                    <br>
                    <button type="submit" style="margin-left: 15px;margin-right: 15px;"  @click="FecharMapa(0,0,0,1)"  
                    class="waves-effect waves-light btn right btnsEventos ">Sim</button>
                    <button type="button" style="margin-left: 15px;" @click="FecharMapa(0,0,0,0)"
                    class="waves-effect waves-light btn right btnsEventos modal-close">Não</button>
                    <br>
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
    name: 'CalculoMapa1View',
    components: {
      MenuLateral
    },
    data () {
        return {
            dataini:"01/03/2025",
            datafina:"31/03/2025",
            hdndataini:"",
            hdndatafina:"",
            CODUSUARIOCAD : "",
            DTCRIACAO : "",
            lstContas:[],
            lstGuardar:[],
            lstFiltros:[],
            lstCalculos:[],
            lstReceitaBruta:[],
            lstReceitaBrutaCCusto:[],
            lstImpostosTotais:[],
            lstCCustoTotais:[],
            Relatorio:[],
            Nucleos:[],
            NucleosHeader: [],
            NucleosSubHeader:[],
            Distrib:[],
            TotDistrib:0,
            Distrib2:[],
            TotDistrib2:0,
            CentrosCustoDist:[],
            CentrosCustoDist2:[],
            ordemColuna:null,
            ordem: "asc",
            selectedRows:[],
            titulomodal:"Mapa de Distribuição das Participações",
            titulomodalFechar:"",
            codexcluir:0,
            FechaMapa:[],
            datatitulo:"",
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
        },
        nucleosUnicos() 
        {
            return [...new Set(this.lstReceitaBrutaCCusto.map(item => item.nucleo))];
        },
        dadosAgrupadosRecBruta() 
        {
            let agrupado = {};
            this.lstReceitaBrutaCCusto.forEach(item => {
                if (!agrupado[item.cgerencial]) 
                {
                agrupado[item.cgerencial] = {};
                }
                agrupado[item.cgerencial][item.nucleo] = {valor: item.valorformat, porcent: item.porcentf};
            });
            return agrupado;
        },
        dadosAgrupadosBaseImpostosTotais()
        {
            let agrupado = {};
            this.lstCCustoTotais.forEach(item => {
                if(item.cgerencial === '2')
                {
                    if (!agrupado[item.cgerencial]) 
                    {
                        agrupado[item.cgerencial] = {};
                    }
                    agrupado[item.cgerencial][item.nucleo] = {valor: item.valorformat, porcent: item.porcentf};
                }
                
            });
            console.log(agrupado);
            return agrupado;
        }
    },
    methods:
    {
        FecharModal()
        {
            M.Modal.getInstance(document.getElementById("FormCalculo")).close();
        },
        async VerDetalhes(e)
        {
            e.preventDefault();
            api.loadingOn();

            try {

                const response = await api.getFile(`GetDetalhesMapa1Excel?datainicial=${this.dataini}&datafinal=${this.datafina}`);

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
            
            this.GetAllMapa1();
            
        },
        async VerCalculo(_codigo,dtinicial)
        {
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
                codigo:_codigo
            };

            await api.get("getallMapa1view",dados).then(r=>{
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
                this.Distrib2 = r.data.distrib2;

                this.datatitulo = dtinicial.split("/")[1]+'/'+dtinicial.split("/")[2];

                r.data.distrib.forEach(item => 
                {
                    this.TotDistrib += api.converterParaNumero(item.valorformat);
                });

                this.TotDistrib = api.ConvertMoeda(this.TotDistrib);

                r.data.distrib2.forEach(item => 
                {
                    this.TotDistrib2 += api.converterParaNumero(item.valorformat);
                });

                this.TotDistrib2 = api.ConvertMoeda(this.TotDistrib2);

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
        async FecharMapa(_codigo,_fechado,modal,resposta)
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

            if(_fechado && modal)
            {
                this.titulomodalFechar = "Mapa fechado, Deseja Reabrir o Mapa?";
                var instance = M.Modal.getInstance(document.getElementById("FecharMapa"));
                instance.open();

                this.FechaMapa = 
                {
                    codigo:_codigo,
                    fechado: _fechado,
                    dtinicial:this.dataini,
                    dtfinal:this.datafina,
                    codusuario: this.USUARIO.codusuarios
                };

                return;
            }
            else if(!_fechado && modal)
            {
                this.titulomodalFechar = "Tem certeza que deseja Fechar o Mapa?";

                var instance2 = M.Modal.getInstance(document.getElementById("FecharMapa"));
                instance2.open();

                this.FechaMapa = 
                {
                    codigo:_codigo,
                    fechado: _fechado,
                    dtinicial:this.dataini,
                    dtfinal:this.datafina,
                    codusuario: this.USUARIO.codusuarios
                };

                return;
            }

            M.Modal.getInstance(document.getElementById('FecharMapa')).close();

            if(resposta)
            {
                api.loadingOn();
                await api.get("FecharMapa",this.FechaMapa).then(r=>
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
                        this.GetAllMapa1();
                        api.loadingOff();
                    }
                });
            }

            this.FechaMapa = [];
            
        },
        async NovoCalculo(e)
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

            if(!api.verificarDatasMesmoMes(this.dataini,this.datafina))
            {
                toast.error("Não é Possivel Gerar Um Mapa Com Período Maior Que Um Mês !!!");
                return;
            }

            api.loadingOn();

            let data = {
                DTINICIAL:this.dataini,
                DTFINAL:this.datafina,
                DTCRIACAO:api.dataAtualcomHoras(),
                CODUSUARIOCAD:this.USUARIO.codusuarios,
            }

            await api.post("cadMapa1",data).then(r=>
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
                    toast("Mapa de Distribuição Criado com Sucesso !!!");
                    this.GetAllMapa1();
                    this.LimparCampos();
                }
            }); 
        },
        async ExcluirCalculo(codigo,modal)
        {

            if(modal)
            {
                var instance = M.Modal.getInstance(document.getElementById("ConfimarExclusao"));
                instance.open();
                this.codexcluir = codigo;
                return;
            }

            api.loadingOn();

            var data = {
                codigo: this.codexcluir
            };

            this.codexcluir = 0;

            await api.delete("deleteMapa1",data).then(r=>
            {
                var instance = M.Modal.getInstance(document.getElementById("ConfimarExclusao"));
                instance.close();
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
                    toast("Mapa Excluido com Sucesso.");
                    this.GetAllMapa1();
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

/*             this.dataini="";
            this.datafina=""; */
            this.hdndataini="";
            this.hdndatafina="";

/*             document.getElementById("txt_DataIni").value = "";
            document.getElementById("txt_DataFina").value = ""; */
            document.getElementById("hdn_DataIni").value = "";
            document.getElementById("hdn_DataFina").value = "";

            this.lstContas = this.lstGuardar;

            M.updateTextFields();
        },
        async GetAllMapa1()
        {
            api.loadingOn();

            var dados = {
                datainicial:this.dataini,
                datafinal:this.datafina
            };

            await api.get("GetAllMapa1",dados).then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.lstContas = r.data.mapa1;
                if(this.lstContas.length == 0)
                {
                    api.loadingOff();
                }
                this.lstGuardar = this.lstContas;
                M.updateTextFields();
            }
            else
            {
                toast.error(r.data.message);
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

        let optmodal = {
            dismissible:false
        }

        var mdl = document.getElementById('FecharMapa');
        M.Modal.init(mdl, optmodal);

        mdl = document.getElementById('ConfimarExclusao');
        M.Modal.init(mdl, optmodal);

        M.updateTextFields();
        resize();

    },
    created()
    {
        /*this.dates = api.rangeMesAnterior();
        this.dataini = this.dates.firstDay;
        this.datafina= this.dates.lastDay;*/
        
        this.dataini = "01/03/2025";
        this.datafina= "31/03/2025";  
        this.GetAllMapa1();
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
  .custom-width {
    width: 25% !important;
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