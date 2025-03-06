<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">DIÁRIAS DE EVENTOS</h5>
            <div class="divider" style="height: 10px;"></div>
            <br>
            <div id="FormCadEventos" class="modal">
                <div class="modal-content">
                    <form v-on:submit.prevent="onSubmit">
                        <h5 style="font-weight: bold;">{{ titulo }}</h5>
                        <div class="divider" style="height: 10px;"></div>
                        <input type="hidden" id="txt_Codigo">
                        <br>
                        <div class="row">
                            <div class="input-field col l4 m4 s4 right" >
                                <label v-if="USUARIO.aprovador === '1'" style="display: contents;">
                                    <input id="chk_Aprovado" v-model="Aprovado" type="checkbox" checked="" />
                                    <span style="padding-left: 35px;margin-top: 25px;">Aprovado</span>
                                </label>
                                <label v-else style="display: contents;">
                                    <input id="chk_Aprovado" v-model="Aprovado" type="checkbox" disabled="disabled" checked="" />
                                    <span style="padding-left: 35px;margin-top: 25px;">Aprovado</span>
                                </label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s8">
                                <select @change="selectUnidade()" v-model="Unidade" id="txt_Unidade" name="txt_Unidade" class="validate">
                                    <option value="" disabled selected>Escolha o Evento</option>
                                    <option v-for="option in lstUnidades" :key="option.codevento" :value=option>
                                        {{ option.evento }}
                                    </option>
                                </select>
                                <label>Evento</label>
                            </div>
                            <div class="input-field col s12 m4 s4" >
                                <input disabled type="text" v-model="dataInicio" id="txt_DataInicio" class="validate"  
                                 maxlength="10">
                                <label for="txt_DataInicio">Data Início Evento</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s6">
                                <input disabled v-model="UnidadeEvento" id="txt_UnidadeEvento" type="text" class="validate">
                                <label for="txt_UnidadeEvento">Unidade do Evento</label>
                            </div>
                            <div class="input-field col s6">
                                <input disabled v-model="DescricaoEvento" id="txt_DescricaoEvento" type="text" class="validate">
                                <label for="txt_DescricaoEvento">Descrição</label>
                            </div>
                        </div>
                        <div hidden class="row">
                            <div class="input-field col s12 m6 l6">
                                <input disabled @keyup="Moeda(this.VALORDIARIA,'VALORDIARIA')" v-model="VALORDIARIA" id="txt_VDiaria" name="txt_VDiaria" type="text" class="validate" required 
                                oninvalid="this.setCustomValidity('Informe o Valor da Diária !!!')"
                                onchange="try{setCustomValidity('')}catch(e){}" 
                                >
                                <label for="txt_VDiaria">Valor da Diária</label>
                            </div>
                            <div class="input-field col s12 m6 l6">
                                <input disabled @keyup="Moeda(this.VDCOORDENADOR,'VDCOORDENADOR')" v-model="VDCOORDENADOR" id="txt_VDCoordenador" name="txt_VDCoordenador" type="text" class="validate" required 
                                oninvalid="this.setCustomValidity('Informe o Valor da Diária !!!')"
                                onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_Descricao">Valor Diária Coordenador</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12 m4 s4" >
                                <input type="text" v-model="dataDiaria" id="txt_DataDiaria" class="validate"  required 
                                @keyup="Datas(this.dataDiaria,'dataDiaria',1)"  @blur="Datas(this.dataDiaria,'dataDiaria',2)" maxlength="10" placeholder="DD/MM/YYYY"
                                oninvalid="this.setCustomValidity('Informe a Data !!!')" onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_DataDiaria">Data Evento</label>
                            </div>
                            <div class="input-field col s12 m4 s4" >
                                <input type="text" maxlength="6" id="txt_HoraInicio" v-model="horaInicio" 
                                @keyup="Horas(this.horaInicio,'horaInicio','',1)" @blur="Horas(this.horaInicio,'horaInicio','txt_HoraInicio',2)" placeholder="HH:MM"
                                class="validate"  required 
                                oninvalid="this.setCustomValidity('Informe a hora início do evento !!!')" onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_HoraInicio">Inicio</label>
                            </div>
                            <div class="input-field col s12 m4 s4" >
                                <input type="text" maxlength="6" id="txt_HoraFim" v-model="horaFim" 
                                @keyup="Horas(this.horaFim,'horaFim','',1)" @blur="Horas(this.horaFim,'horaFim','txt_HoraFim',2)" placeholder="HH:MM"
                                class="validate"  required 
                                oninvalid="this.setCustomValidity('Informe a hora fim do evento!!!')" onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_HoraFim">Fim</label>
                            </div>
                        </div>
                        
                        <div class="divider" style="height: 10px;"></div>
                        <br>
                        <div class="row">
                            <div class="input-field col s12">
                                <select :items="Colabs" @change="selectColaborador()" v-model="Colaborador" id="txt_Substituto" name="txt_Substituto" class="validate">
                                    <option value="" disabled selected>Escolha</option>
                                    <option v-for="option in lstColaboradores" :key="option.codpessoa" :value=option>
                                        {{ option.nome }} - {{ option.funcao }} - {{ option.secao }}
                                    </option>
                                </select>
                                <label>Colaborador Responsável</label>
                            </div>
                            <div class="input-field col l5 m6 s12 right" >
                                <label class="right" style="display: contents;">
                                    <input id="chk_Coordenador" v-model="Coordenador" type="checkbox" checked="" />
                                    <span >O Colaborador é Coordenador?</span>
                                </label>
                            </div>
                            <div class="input-field col s12">
                                <ul class="collection with-header" id="gerentes">
                                    <li class="collection-header" id=""><h5>Gerentes Aprovadores</h5></li>
                                    <li class="collection-item" v-for="aprovador in lstAprovadores" :key="aprovador.codaprovador" >
                                        {{ aprovador.codaprovador }}, {{ aprovador.nome }}, {{ aprovador.estados }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="divider" style="height: 10px;"></div>
                        <br>
                        <div class="row">
                            <div class="input-field col s6">
                                <label style="display: contents;">
                                    <!-- <input disabled id="chk_valeRefeicao" @change="check('valeRefeicao')" v-model="valeRefeicao" type="checkbox" checked="" /> -->
                                    <input id="chk_valeRefeicao" v-model="valeRefeicao" type="checkbox" checked="" />
                                    <span style="padding-left: 35px;margin-top: 25px;">Vale Refeição</span>
                                </label>
                            </div>
                            <div class="input-field col s6">
                                <input v-model="valorRefeicao" @keyup="Moeda(this.valorRefeicao,'valorRefeicao')" id="txt_valorRefeicao" type="text" class="validate"
                                required oninvalid="this.setCustomValidity('Informe o Valor !!!')" onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_valorRefeicao">Valor Refeição</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s6">
                                <label style="display: contents;">
                                    <!-- <input disabled id="chk_valeTransporte" @change="check('valeTransporte')" v-model="valeTransporte" type="checkbox" checked="" /> -->
                                    <input id="chk_valeTransporte" v-model="valeTransporte" type="checkbox" checked="" />
                                    <span style="padding-left: 35px;margin-top: 25px;">Vale Transporte</span>
                                </label>
                            </div>
                            <div class="input-field col s6">
                                <input v-model="valorTransporte" @keyup="Moeda(this.valorTransporte,'valorTransporte')" id="txt_valorTransporte" type="text" class="validate"
                                required oninvalid="this.setCustomValidity('Informe o Valor !!!')" onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_valorTransporte">Valor Transporte</label>
                            </div>
                        </div>
                        <div class="divider" style="height: 10px;"></div>
                        <br>
                        <div class="row">
                            <div class="input-field col s6">
                                <input disabled v-model="escala" id="txt_Escala" type="text" class="validate">
                                <label for="txt_Escala">Escala de Trabalho</label>
                            </div>
                            <div class="input-field col s6">
                                <input oninput="this.value = this.value.toUpperCase()" v-model="obs" id="txt_Obs" type="text" class="validate">
                                <label for="txt_Obs">Observação</label>
                            </div>
                        </div>
                        <div class="divider" style="height: 10px;"></div>
                        <br>
                        <button  style="margin-left: 15px;margin-right: 15px;" id="SalvarEventoModal" @click="salvarDiaria()"  class="waves-effect waves-light btn right btnsEventos ">Salvar</button>
                        <button type="button" style="margin-left: 15px;" id="EditarEventoModal" @click="UpdateDiaria($event)" class="waves-effect waves-light btn right btnsEventos ">Editar</button>
                        <br><br>
                    </form>
                
                </div>
             </div>
            <br>
            <br>
            <div class="row ">
                <button id="CadastrarEvento" @click="Cadastrar($event)" class="waves-effect waves-light btn right btnsEventos" href="#FormCadEventos">Cadastrar</button>
                <button id="EditarEvento" @click="UpdateDiaria($event)" class="waves-effect waves-light btn right btnsEventos">Editar</button>
                <button id="ExcluirEvento" @click="DeleteDiaria($event)" class="waves-effect waves-light btn right btnsEventos">Excluir</button>
                <button id="ExportarEvento" @click="exportar()" class="waves-effect waves-light btn right btnsEventos">Exportar</button>
                <button id="btnFiltros" type="button" @click="filtroTabela()" class="waves-effect waves-light btn right btnsEventos">Exibir Filtros</button>
            </div>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table :items="Rows" class="centered striped" id="tabDados">
                        <thead style="height:60px;border-bottom: solid;border-width: thin;">
                        <tr>
                            <th class="tblColText">Marcar</th>
                            <th class="tblColText">Evento</th>
                            <th class="tblColText">Descrição</th>
                            <th class="tblColText">Data</th>
                            <th class="tblColText">HoraInicio</th>
                            <th class="tblColText">HoraFim</th>
                            <th class="tblColText">C.Custo</th>
                            <th class="tblColText">Nome</th>
                            <th class="tblColText">Aprovado</th>
                            <th class="tblColText">Exportado</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tipo in lstEventos" :key="tipo.codigo">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="tipo.codigo" v-model="selectedRows" :value="tipo"/>
                                    <span></span>
                                    </label>
                                </td>
                               
                                <td>{{ tipo.evento }}</td>
                                <td>{{ tipo.descricao }}</td>
                                <td>{{ tipo.datadiaria }}</td>
                                <td>{{ tipo.horainicio }}</td>
                                <td>{{ tipo.horafim }}</td>
                                <td>{{ tipo.codccusto }}</td>
                                <td>{{ tipo.nome }}</td>
                                <td v-if="tipo.aprovado === '1'">
                                    <span style="font-weight: bold;color: yellowgreen;">Sim</span>
                                </td>
                                <td v-else-if="tipo.aprovado === '0'">
                                    <span style="font-weight: bold;color: #00aaff;">Não</span>
                                </td>
                                <td v-else>
                                    <span style="font-weight: bold;color: Red;">Reprovado</span>
                                </td>
                                <td v-if="tipo.exportado === '1'">
                                    Sim
                                </td>
                                <td v-else>
                                    Não
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

  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";
  const toast = useToast();

  export default {
    name: 'DiariaEventosView',
    components: {
      MenuLateral
    },
    data () {
        return {
            titulo:"",
            lstUnidades:[],
            Unidade:[],
            UnidadeEvento:"",
            DescricaoEvento:"",
            Aprovado:false,
            lstEventos:[],
            dataDiaria:"",
            dataInicio:"",
            horaInicio:"",
            horaFim:"",
            lstColaboradores:[],
            valeRefeicao:false,
            valorRefeicao:"0,00",
            valeTransporte:false,
            valorTransporte:"0,00",
            escala:"",
            obs:"",
            selectedRows:[],
            flag:true,
            flagex:true,
            filtro:false,
            lstAprovadores:[],
            Colaborador:[],
            VDCOORDENADOR:"0,00",
            VALORDIARIA:"0,00",
            Coordenador:"0",
            nexport: [],
            export: [],
            exportados: [],
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    computed:{
        Rows() {
            var rows = 0;
            return this.lstEventos.find(() => {
                rows += 1;
                if(this.lstEventos.length == rows)
                {
                     setTimeout(  () => {
                        M.FormSelect.init(document.querySelectorAll('select'));
                        api.loadingOff();
                        resize();
                    }, "1000");
                }
            })
        },
        Colabs()
        {
            var rows = 0;
            return this.lstColaboradores.find(() => {
                rows += 1;
                if(this.lstColaboradores.length == rows)
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
        selectUnidade()
        {    
            document.getElementById("txt_UnidadeEvento").value = this.Unidade.codccusto;
            document.getElementById("txt_DescricaoEvento").value = this.Unidade.descricao;
            document.getElementById("chk_valeRefeicao").value = this.Unidade.valerefeicao == "1" ? true : false;
            document.getElementById("txt_valorRefeicao").value = api.Moeda(this.Unidade.valorrefeicao);
            document.getElementById("chk_valeTransporte").value = this.Unidade.valetransporte == "1" ? true : false;
            document.getElementById("txt_valorTransporte").value = api.Moeda(this.Unidade.valortransporte);
            document.getElementById("txt_VDiaria").value = api.Moeda(this.Unidade.valordiaria);
            document.getElementById("txt_VDCoordenador").value = api.Moeda(this.Unidade.vdcoordenador);
            document.getElementById("txt_DataInicio").value = this.Unidade.datainicio;

            this.UnidadeEvento = this.Unidade.codccusto;
            this.DescricaoEvento = this.Unidade.descricao
            this.valeRefeicao = this.Unidade.valerefeicao == "1" ? true : false;
            this.valorRefeicao = api.MoedaBanco(this.Unidade.valorrefeicao);
            this.valeTransporte = this.Unidade.valetransporte == "1" ? true : false;
            this.valorTransporte = api.MoedaBanco(this.Unidade.valortransporte);
            this.VALORDIARIA = api.MoedaBanco(this.Unidade.valordiaria);
            this.VDCOORDENADOR = api.MoedaBanco(this.Unidade.vdcoordenador);
            this.dataInicio = this.Unidade.datainicio;

            console.log(this.Unidade);
            
            this.getAllAprovadores(this.Unidade.codevento);

            //this.lstColaboradores = this.lstColaboradores.filter(dado => dado.estado === this.Unidade.estadoevento);

            M.updateTextFields();
        },
        selectColaborador()
        {
            document.getElementById("txt_Escala").value = this.Colaborador.horario;
            this.escala = this.Colaborador.horario;
            M.updateTextFields();
        },
        async getAllAprovadores(_codevento)
        {
            await api.get("getallaprovadoresevento",{codevento:_codevento}).then(r=>{
                if(r.status == 401)
                {
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstAprovadores = r.data.aprovadores;
                }
            });
        },
        ConsistirCampos()
        {
            this.dataDiaria = document.getElementById("txt_DataDiaria").value;
            this.horaInicio = document.getElementById("txt_HoraInicio").value;
            this.horaFim = document.getElementById("txt_HoraFim").value;
            //var databr = api.dataAtualBr();
            var databr = this.dataInicio;

            if(this.dataDiaria === "" || this.horaInicio === "" || this.horaFim === "")
            {
                return false;
            }
            else if(this.Unidade === "" || this.Unidade.length == 0)
            {
                toast.error("Selecione o evento da diária.");
                return false;
            }
            else if( this.Colaborador === "" || this.Colaborador.length == 0)
            {
                toast.error("Selecione o colaborador da diária.");
                return false;
            }
            else if( (this.valeRefeicao == true && this.valorRefeicao === "0,00") || (this.valeRefeicao == false && this.valorRefeicao !== "0,00"))
            {
                toast.error("Incosistência nos valores do vale refeição, verifique no cadastro do evento.");
                return false;
            }
            else if( (this.valeTransporte == true && this.valorTransporte === "0,00") || (this.valeTransporte == false && this.valorTransporte !== "0,00") )
            {
                toast.error("Incosistência nos valores do vale transporte, verifique no cadastro do evento.");
                return false;
            }
            else if(this.compareDates(databr,"00:00:00" , this.dataDiaria,"00:00:00",true))
            {
                toast.error("A data do evento precisa ser maior que a data de início do evento.");
                return false;
            }
            else if(this.compareDates(this.dataDiaria,this.horaInicio+":00" , this.dataDiaria,this.horaFim+":00"))
            {
                toast.error("A hora do fim do evento precisa ser maior que a do início.");
                return false;
            }
            else if(this.lstAprovadores.length == 0)
            {
                toast.error("Sem aprovadores no cadastro do evento.");
                return false;
            }

            return true;
        },
        async Cadastrar(e)
        {
            e.preventDefault();
            var ret = await api.verificarAcesso("DEVENTOS","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
            if(!ret)
            {
                this.LimparCampos();
                return false;
            }
            this.flagex = false;
            this.titulo = "Cadastrar Diária de Eventos"
            document.getElementById("EditarEventoModal").textContent = "Cancelar";
            M.Modal.getInstance(document.getElementById("FormCadEventos")).open();
            api.loadingOff();
        },
        async salvarDiaria()
        {
            var cons = await this.ConsistirCampos()
            if(!cons)
            {
                return false;
            }

            this.dataDiaria = document.getElementById("txt_DataDiaria").value;
            this.horaInicio = document.getElementById("txt_HoraInicio").value;
            this.horaFim = document.getElementById("txt_HoraFim").value;

            if(this.flag)
            {
                let data = {
                    CODIGO:"0",
                    CODEVENTO:this.Unidade.codevento,
                    CODCOLIGADA:"20",
                    CODCOLAB:this.Colaborador.codpessoa,
                    DATADIARIA:this.dataDiaria,
                    HORAINICIO:this.horaInicio,
                    HORAFIM:this.horaFim,
                    APROVADO:this.Aprovado ? "1":"0",
                    OBSERVACAO:this.obs,
                    CODUSUARIOCAD:this.USUARIO.codusuarios,
                    CODUSUARIOALT:this.USUARIO.codusuarios,
                    DTCRIACAO:api.dataAtual(),
                    DTALTERACAO:api.dataAtual(),
                    ESCALA: this.escala,
                    VALEREFEICAO: this.valeRefeicao == true ? "1":"0",
                    VALORREFEICAO: this.valorRefeicao,
                    VALETRANSPORTE: this.valeTransporte == true ? "1":"0",
                    VALORTRANSPORTE: this.valorTransporte,
                    VDCOORDENADOR: this.VDCOORDENADOR,
                    VALORDIARIA: this.VALORDIARIA,
                    COORDENADOR: this.Coordenador == true ? "1":"0",
                }

                api.loadingOn()
                await api.post("cadDiariasEventos", data).then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                }
                else if(r.status != 200){
                    api.loadingOff();
                    toast.error(r.data.message);
                }else{
                    this.LimparCampos();
                    this.getAllDiariasEventos();
                    toast("Diarias de Eventos cadastro com Sucesso !!!");
                }})
            
                M.Modal.getInstance(document.getElementById("FormCadEventos")).close();
            }
            else
            {
                
                let data = {
                    CODIGO:document.getElementById("txt_Codigo").value,
                    CODEVENTO:this.Unidade.codevento,
                    CODCOLIGADA:"20",
                    CODCOLAB:this.Colaborador.codpessoa,
                    DATADIARIA:this.dataDiaria,
                    HORAINICIO:this.horaInicio,
                    HORAFIM:this.horaFim,
                    APROVADO:this.Aprovado ? "1":"0",
                    OBSERVACAO:this.obs,
                    CODUSUARIOCAD:this.USUARIO.codusuarios,
                    CODUSUARIOALT:this.USUARIO.codusuarios,
                    DTCRIACAO:api.dataAtual(),
                    DTALTERACAO:api.dataAtual(),
                    ESCALA: this.escala,
                    VALEREFEICAO: this.valeRefeicao == true ? "1":"0",
                    VALORREFEICAO: this.valorRefeicao,
                    VALETRANSPORTE: this.valeTransporte == true ? "1":"0",
                    VALORTRANSPORTE: this.valorTransporte,
                    VDCOORDENADOR: this.VDCOORDENADOR,
                    VALORDIARIA: this.VALORDIARIA,
                    COORDENADOR: this.Coordenador == true ? "1":"0",
                }

                api.loadingOn()
                await api.post("updateDiariasEventos", data).then(r=>{

                    this.LimparCampos();
                    if(r.status == 401)
                    {
                        toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                        this.$router.push({ path: '/'});
                    }
                    else if(r.status != 200){
                        toast.error(r.data.message);
                    }else{
                        
                        this.getAllDiariasEventos();
                        toast("Diária de Eventos Atualizado com Sucesso !!!");
                    }
                    M.Modal.getInstance(document.getElementById("FormCadEventos")).close();
                })
                this.flag = true;
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                document.getElementById("EditarEvento").textContent = "Editar";
            }
        },
        async UpdateDiaria(e)
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
                if(document.getElementById("EditarEventoModal").textContent === "Cancelar")
                {
                    M.Modal.getInstance(document.getElementById("FormCadEventos")).close();
                }
                this.LimparCampos();
                return;
            }
            else if(this.selectedRows.length > 1)
            {
                e.preventDefault();
                toast("Marque somente um evento para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                e.preventDefault();
                toast("Marque uma evento para editar !!!")
                return;
            }

            if(this.flag)
            {
                var ret = await api.verificarAcesso("DEVENTOS","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    e.preventDefault();
                    this.LimparCampos();
                    return false;
                }

                this.titulo = "Editar Diária de Eventos"

                var manobra = this.selectedRows;
                this.LimparCampos();
                M.FormSelect.init(document.querySelectorAll('select'));
                M.Modal.getInstance(document.getElementById("FormCadEventos")).open();

                this.flag = false;
                this.selectedRows = manobra;
                document.getElementById("txt_Codigo").value = this.selectedRows[0].codigo;
                var unidade = this.lstUnidades.filter(a => a.codevento === this.selectedRows[0].codevento);

                document.getElementById("txt_Unidade").value = unidade[0].evento;
                document.getElementById("chk_Aprovado").value = this.selectedRows[0].aprovado == "1" ? true : false;
                document.getElementById("chk_Coordenador").value = this.selectedRows[0].coordenador == "1" ? true : false;
                document.getElementById("txt_UnidadeEvento").value = this.selectedRows[0].codccusto;
                document.getElementById("txt_DescricaoEvento").value = this.selectedRows[0].descricao;
                document.getElementById("txt_DataDiaria").value = this.selectedRows[0].datadiaria;
                document.getElementById("txt_DataInicio").value = this.selectedRows[0].datainicio;
                document.getElementById("txt_HoraInicio").value = this.selectedRows[0].horainicio;
                document.getElementById("txt_HoraFim").value = this.selectedRows[0].horafim;
                var colab = this.lstColaboradores.filter(a => a.codpessoa === this.selectedRows[0].codcolab)
                var desccolab = colab[0].nome + " - " + colab[0].funcao + " - " + colab[0].secao;
                document.getElementById("txt_Substituto").value = desccolab;
                document.getElementById("chk_valeRefeicao").value = this.selectedRows[0].valerefeicao == "1" ? true : false;
                document.getElementById("txt_valorRefeicao").value = api.Moeda(this.selectedRows[0].valorrefeicao);    
                document.getElementById("chk_valeTransporte").value = this.selectedRows[0].valetransporte == "1" ? true : false;
                document.getElementById("txt_valorTransporte").value = api.Moeda(this.selectedRows[0].valortransporte);
                document.getElementById("txt_Escala").value = this.selectedRows[0].escala;
                document.getElementById("txt_Obs").value = this.selectedRows[0].observacao;
                document.getElementById("txt_VDiaria").value = api.Moeda(this.selectedRows[0].valordiaria);
                document.getElementById("txt_VDCoordenador").value = api.Moeda(this.selectedRows[0].vdcoordenador);

                this.dataDiaria = this.selectedRows[0].datadiaria;
                this.dataInicio = this.selectedRows[0].datainicio;
                this.horaInicio = this.selectedRows[0].horainicio;
                this.horaFim = this.selectedRows[0].horafim;
                this.Aprovado = this.selectedRows[0].aprovado == "1" ? true : false;
                this.Coordenador = this.selectedRows[0].coordenador == "1" ? true : false;
                this.UnidadeEvento = this.selectedRows[0].codccusto;
                this.DescricaoEvento = this.selectedRows[0].descricao;
                this.Unidade = unidade[0];
                this.horaInicio = this.selectedRows[0].horainicio
                this.horaFim = this.selectedRows[0].horafim
                this.Colaborador = colab[0];
                this.valeRefeicao = this.selectedRows[0].valerefeicao == "1" ? true : false;
                this.valorRefeicao = api.MoedaBanco(this.selectedRows[0].valorrefeicao);
                this.valeTransporte = this.selectedRows[0].valetransporte == "1" ? true : false;
                this.valorTransporte = api.MoedaBanco(this.selectedRows[0].valortransporte);
                this.escala = this.selectedRows[0].escala;
                this.obs = this.selectedRows[0].observacao;
                this.VALORDIARIA = api.MoedaBanco(this.selectedRows[0].valordiaria);
                this.VDCOORDENADOR = api.MoedaBanco(this.selectedRows[0].vdcoordenador);
                
                
                await this.getAllEventos();
                await this.GetAllColaboradores();
                await this.getAllAprovadores(this.Unidade.codevento);

                document.getElementById("ExcluirEvento").classList.add("disabled");
                document.getElementById("EditarEventoModal").textContent = "Cancelar";
                
                M.updateTextFields();
            }
            else//cancelar ediçao
            {
                this.flag = true;
                document.getElementById("EditarEventoModal").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                M.Modal.getInstance(document.getElementById("FormCadEventos")).close();
                this.LimparCampos();
            }   
        },
        async DeleteDiaria(e)
        {
            e.preventDefault();
            
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um evento excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um evento para excluir !!!")
                return;
            }


            if(this.flagex)
            {
                this.flagex = false;
                
                document.getElementById("SalvarEventoModal").classList.add("disabled");
                document.getElementById("CadastrarEvento").classList.add("disabled");
                document.getElementById("EditarEvento").textContent = "Cancelar";
                document.getElementById("ExcluirEvento").textContent = "Confirma?";
                M.updateTextFields();
            }
            else
            {
                var ret = await api.verificarAcesso("DEVENTOS","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
                if(!ret)
                {
                    e.preventDefault();
                    
                    this.flagex = true;
                    document.getElementById("SalvarEventoModal").classList.remove("disabled");
                    document.getElementById("CadastrarEvento").classList.remove("disabled");
                    document.getElementById("ExcluirEvento").textContent = "Excluir";
                    document.getElementById("EditarEvento").textContent = "Editar";
                    this.LimparCampos();
                    return false;
                }

                let data = {
                    codigo: this.selectedRows[0].codigo
                }
                await api.delete("deleteDiariasEventos", data).then(r=>{
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
                        toast.error(r.data.message);
                    }else{
                       setTimeout(  () => {
                        }, "2000");
                        api.loadingOff();
                        toast("Diária por Ausência Excluida com Sucesso !!!");
                        this.getAllDiariasEventos();
                    }})
                this.flagex = true;
                document.getElementById("ExcluirEvento").textContent = "Excluir";
                document.getElementById("SalvarEventoModal").classList.remove("disabled");
                document.getElementById("CadastrarEvento").classList.remove("disabled");
                document.getElementById("EditarEvento").textContent = "Editar";
            }   
        },
        Moeda(valor,variavel)
        {
            this[variavel] = api.Moeda(valor);
        },
        Horas(valor,variavel,idelm="",tipo=1)//<!-- AQUI -->
        {
            if(tipo == 1)//aplicar mascara
            {
                this[variavel] = api.Horas(valor);
            }
            else if(tipo == 2)//consistir data
            {
                var result = api.validarHora(valor);

                if(!result)
                {
                    toast.error("Hora inválida! Por favor, insira uma hora válida no formato HH:MM.");
                    this[variavel] = "";
                    document.getElementById(idelm).value = "";
                    M.updateTextFields();
                }
            }
        },
        Datas(valor,variavel,tipo=1)//<!-- AQUI -->
        {
            if(tipo == 1)//aplicar mascara
            {
                this[variavel] = api.aplicarMascaraData(valor);
            }
            else if(tipo == 2)//consistir data
            {
                var result = api.validarData(valor);

                if(!result)
                {
                    toast.error("Data inválida! Por favor, insira uma data válida no formato DD/MM/YYYY.");
                    this[variavel] = "";
                    document.getElementById("txt_DataDiaria").value = "";
                    M.updateTextFields();
                }
            }
            
        },
        LimparCampos()
        {
            document.getElementById("txt_Codigo").value = "";
            document.getElementById("txt_Unidade").value = "";
            document.getElementById("chk_Aprovado").value = false;
            document.getElementById("chk_Coordenador").value = false;
            document.getElementById("txt_UnidadeEvento").value = "";
            document.getElementById("txt_DescricaoEvento").value = "";
            document.getElementById("txt_DataDiaria").value = "";
            document.getElementById("txt_DataInicio").value = "";
            document.getElementById("txt_HoraInicio").value = "";
            document.getElementById("txt_HoraFim").value = "";
            document.getElementById("txt_Substituto").value = "";
            document.getElementById("chk_valeRefeicao").value = false;
            document.getElementById("txt_valorRefeicao").value = "0,00";    
            document.getElementById("chk_valeTransporte").value = false;
            document.getElementById("txt_valorTransporte").value = "0,00";
            document.getElementById("txt_Escala").value = "";
            document.getElementById("txt_Obs").value = "";
            document.getElementById("txt_VDiaria").value = "0,00";
            document.getElementById("txt_VDCoordenador").value = "0,00";

            this.Unidade = [];
            this.UnidadeEvento = "";
            this.DescricaoEvento = "";
            this.Aprovado = false;
            this.dataDiaria = "";
            this.dataInicio = "";
            this.horaInicio = "";
            this.horaFim = "";
            this.valeRefeicao = false;
            this.valorRefeicao = "0,00";
            this.valeTransporte = false;
            this.valorTransporte = "0,00";
            this.escala = "";
            this.obs = "";
            this.selectedRows = [];
            this.flag = true;
            this.flagex = true;
            this.lstAprovadores = [];
            this.Colaborador = [];
            this.VALORDIARIA = "0,00";
            this.VDCOORDENADOR = "0,00";
            this.Coordenador = false;
            this.nexport = [];
            this.export = [];
            this.exportados = [];

            M.FormSelect.init(document.querySelectorAll('select'));

            M.updateTextFields();
        },
        async getAllEventos()
        {
            await api.get("geteventoscad").then(r=>{
                if(r.status == 401)
                {
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstUnidades = r.data.eventos;
                }
            });
        },
        async GetAllColaboradores()
        {
            await api.get("getallcolaboradores").then(r=>{
                if(r.status == 401)
                {
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstColaboradores = r.data.colaboradores;
                }
            });
        },
        async getAllDiariasEventos()//tela principal
        {
            api.loadingOn();
            await api.get("getallDiariasEventos").then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    r.data.diarias.forEach( i => {
                        i.datadiaria = api.corrigirData(i.datadiaria);
                        //i.valordiaria = String(i.valordiaria * 100);
                    })
                    this.lstEventos = r.data.diarias;
                }
                else if(r.status == 400){
                    toast.error(r.data.message);
                }
                api.loadingOff();
            });
            this.getAllEventos();
            this.GetAllColaboradores();
        },
        compareDates(data1,hora1,data2,hora2,tipo=false) 
        {
            var sdt1 = data1.split("/");
            var sdt2 = data2.split("/");

            let dt1 = new Date(sdt1[2],sdt1[1],sdt1[0],hora1.split(":")[0],hora1.split(":")[1],hora1.split(":")[2]);
            let dt2 = new Date(sdt2[2],sdt2[1],sdt2[0],hora2.split(":")[0],hora2.split(":")[1],hora2.split(":")[2]);

            if(tipo)
            return dt1 > dt2 ? true : false
            else
            return dt1 >= dt2 ? true : false

        },
        filtroTabela()
        {
            if(!this.filtro)
            {
                this.filtro = true;
                let colHeaders = document.querySelectorAll('.tblColText');
                document.querySelector('#btnFiltros').textContent = "Esconder Filtro";
                colHeaders.forEach((colHeader, index) => {
                    colHeader.appendChild(generateDropdown(index));
                });
            }
            else
            {
                this.filtro = false;
                let colHeaders = document.querySelectorAll('.tblColText');
                document.querySelector('#btnFiltros').textContent = "Exibir Filtros";
                colHeaders.forEach((colHeader, index) => {
                    let child = document.querySelector('[id="slc-'+index+'"]');
                    colHeader.removeChild(child);
                });
                resetfilter();
            }
        },
        async exportar()
        {
        
            if(this.selectedRows.length == 0)
            {
                toast.error("Marque os eventos a serem exportados.");
                return;
            }

            this.selectedRows.forEach( i => 
            {
                i.codcoligada = "20";
                if(i.aprovado == 1 )
                {
                    if(i.exportado == 0)
                    {
                        this.export.push(i);
                    }
                    else
                    {
                        this.exportados.push(i.evento);
                    }
                }
                else
                {
                    this.nexport.push(i.evento);
                }
                
            });

            if(this.nexport.length > 0)
            {
                toast.error("Os eventos: \n"+this.nexport+"\nNão foram exportados por que não estão aprovados.");
                this.nexport = [];
            }
            if(this.exportados.length > 0)
            {
                toast.error("Os eventos: \n"+this.exportados+"\nJá foram exportados anteriormente.");
                this.exportados = [];
            }

            if(this.export.length > 0)
            {
                api.loadingOn()
               await fetch(api.getUrl() + "ExportarDiariasEventos", { 
                    method: 'POST', 
                    headers: {
                'Authorization': `${api.getToken()}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
              }, body: JSON.stringify(this.export) })
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'arquivo.txt';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => console.error('Erro ao baixar o arquivo:', error));
            }
            
            this.LimparCampos();
            this.getAllDiariasEventos();
        }
    },
    mounted()
    {
        M.AutoInit()
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
         var dtEl = document.querySelectorAll('datepicker');
        M.Datepicker.init(dtEl, dataopt);
        //##############datepicker

        //##############TimePicker
        let pickeropt = {
            vibrate:true,
            twelveHour: false,
            i18n: {
            //Botões
            cancel: 'cancelar',
            clear:'Limpar',
            done:'Selecionar'},
            // Formato da data que aparece no input
            setDefaultDate:false,
            showClearBtn: true,
            onClose:function()
            {
                M.updateTextFields();
            }
        }
        var pickers = document.querySelectorAll('.timepicker');
        M.Timepicker.init(pickers, pickeropt);
        //##############TimePicker

        //############## Modal Cadastro ###############
        let optmodal = {
            dismissible:false,
			onCloseEnd:function()
			{
                document.getElementById("EditarEventoModal").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
			}
        }
        var mdl = document.getElementById('FormCadEventos');
        M.Modal.init(mdl, optmodal); 
        //############## Modal Cadastro ###############

        M.updateTextFields();
        resize();
    },
    created()
    {
        this.getAllDiariasEventos();
    }
  }

  function generateDropdown(index) 
{
    let columnData = [];
    let rows = document.querySelectorAll('tr');
    rows.forEach((row, i) => {
        if (i == 0) {
            columnData.push('');
            return;
        }
        let cells = row.getElementsByTagName('td');
        columnData.push(cells[index].innerText);
    });
    // REMOVE DUPLICATES
    let uniqColumnData = [...new Set(columnData)];
    // GENERATE THE SELECT OPTION
    let select = document.createElement('select');

    uniqColumnData.map((data) => {
        let option = document.createElement('option');
        option.setAttribute('value', data);

        let optionText = document.createTextNode(data);
        option.appendChild(optionText);

        select.appendChild(option);
    });
    select.classList.add("browser-default");
    select.classList.add("filtros");
    select.setAttribute('id', "slc-"+index);
    select.addEventListener('change', function() {
        filterTable(this.value);
        clearSelect(select.id);
    });

    return select;
}

function clearSelect(id) 
{
    let selects = document.getElementsByClassName('filtros');

    Array.from(selects).forEach((el) => {
        if (id !== el.attributes.id.value) {
            el.value = '';
        }
    });
}

function resetfilter()
{
    const table = document.querySelector('#tabDados');
    const rows = table.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            rows[i].style.display = '';
        }
    }
}

function filterTable(filter) 
{
    const table = document.querySelector('#tabDados');
    const rows = table.getElementsByTagName('tr');

    // LOOP THROUGH ALL ROWS EXCEPT FOR HEADERS
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;

        // LOOP THROUGH ALL CELLS WITHIN THE ROW
        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent || cells[j].innerText;
            if (cellText == filter || cellText.includes(filter)) {
                found = true;
                break;
            }
        }
        rows[i].style.display = found ? '' : 'none';
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
        background-color: #de001f !important;
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