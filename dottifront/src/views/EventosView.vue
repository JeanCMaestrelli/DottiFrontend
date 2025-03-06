<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CADASTRAR EVENTOS</h5>
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
                            <th>Nome do Evento</th>
                            <th>Descrição</th>
                            <th>Centro de Custo</th>
                            <th>Estado Evento</th>
                            <th>Ativo</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="evento in lstEventos" :key="evento.codevento">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="evento.codevento" v-model="selectedRows" :value="evento"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{evento.evento}}</td>
                                <td>{{evento.descricao}}</td>
                                <td>{{evento.codccusto}}</td>
                                <td>{{evento.estadoevento}}</td>
                                <td v-if="evento.ativo === '1'">
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

    <div id="FormCadastro" class="modal">
        <div class="modal-content">
            <form v-on:submit.prevent="onSubmit">
                <h5 style="font-weight: bold;">{{ titulo }}</h5>
                <div class="divider" style="height: 10px;"></div>
                <input type="hidden" id="auxCodCCusto">
                <input type="hidden" id="auxAprovadores">
                <br>
                <div class="row">
                    <div class="input-field col l4 m4 s4 right" style="max-width: 82px;">
                        <label>
                        <input v-model="ATIVO" type="checkbox" checked="checked"/>
                        <span style="padding-left: 35px;">Ativo</span>
                        </label>
                    </div>
                </div>
                <br>
                <h5>Dados do Evento</h5>
                <div class="row z-depth-2 ajusterow">
                    <div class="input-field col l2 m4 s12" style="text-align: left;">
                        <input oninput="this.value = this.value.toUpperCase()" disabled v-model="CODEVENTO" id="txt_Codigo" name="txt_Codigo" type="text">
                        <label for="txt_Codigo">Código</label>
                    </div>
                    <div class="input-field col l5 m4 s12" style="text-align: left;">
                        <input oninput="this.value = this.value.toUpperCase()" id="txt_CentroCusto" name="txt_CentroCusto" type="text" class="autocomplete validate" required 
                        oninvalid="this.setCustomValidity('Informe o centro de custo !!!')"
                        onchange="try{setCustomValidity('')}catch(e){}">
                        <label for="txt_CentroCusto">Centro de Custo</label>
                    </div>
                    <div class="input-field col l5 m4 s12">
                        <input oninput="this.value = this.value.toUpperCase()" v-model="EVENTO" id="txt_Nevento" name="txt_Nevento" type="text" class="validate" required 
                        oninvalid="this.setCustomValidity('Informe o evento !!!')"
                        onchange="try{setCustomValidity('')}catch(e){}">
                        <label for="txt_Nevento">Nome do Evento</label>
                    </div>
                    <div class="input-field col l4 m4 s12" style="text-align: left;">
                        <select v-model="ESTADOEVENTO" id="txt_Estado" name="txt_Estado" class="autocomplete validate">
                            <option value="" disabled selected>Escolha o Estado</option>
                            <option value="AC">ACRE</option>
                            <option value="AM">AMAZONAS</option>
                            <option value="AP">AMAPÁ</option>
                            <option value="AL">ALAGOAS</option>
                            <option value="BA">BAHIA</option>
                            <option value="CE">CEARÁ</option>
                            <option value="DF">DISTRITO FEDERAL</option>
                            <option value="ES">ESPÍRITO SANTO</option>
                            <option value="GO">GOIÁS</option>
                            <option value="MA">MARANHÃO</option>
                            <option value="MS">MATO GROSSO DO SUL</option>
                            <option value="MT">MATO GROSSO</option>
                            <option value="MG">MINAS GERAIS</option>
                            <option value="PB">PARAÍBA</option>
                            <option value="PR">PARANÁ</option>
                            <option value="PA">PARÁ</option>
                            <option value="PB">PARAÍBA</option>
                            <option value="PE">PERNAMBUCO</option>
                            <option value="PI">PIAUÍ</option>
                            <option value="RS">RIO GRANDE DO SUL</option>
                            <option value="RN">RIO GRANDE DO NORTE</option>
                            <option value="RJ">RIO DE JANEIRO</option>
                            <option value="RO">RONDÔNIA</option>
                            <option value="RR">RORAIMA</option>
                            <option value="SC">SANTA CATARINA</option>
                            <option value="SP">SÃO PAULO</option>
                            <option value="SE">SERGIPE</option>
                            <option value="TO">TOCANTINS</option>
                        </select>
                        <label>Estado Evento</label>
                    </div>
                     <!-- ##################################################################### -->
                      <!-- oninput="javascript: this.value = this.value.replace(/[^0-9,]|\s/g, '');" -->
                    <div class="input-field col l4 m4 s12">
                        <input @keyup="Moeda(this.VALORDIARIA,'VALORDIARIA')" v-model="VALORDIARIA" id="txt_VDiaria" name="txt_VDiaria" type="text" class="validate" required 
                        oninvalid="this.setCustomValidity('Informe o Valor da Diária !!!')"
                        onchange="try{setCustomValidity('')}catch(e){}" 
                        >
                        <label for="txt_VDiaria">Valor da Diária</label>
                    </div>
                    <!-- ###################################################################### -->
                    <div class="input-field col l4 m4 s12">
                        <input v-model="LIMITEDIARIAS" id="txt_LDiaria" name="txt_LDiaria" type="number" class="validate" required 
                        oninvalid="this.setCustomValidity('Informe o Limite de Diárias !!!')"
                        onchange="try{setCustomValidity('')}catch(e){}"
                        oninput="javascript: this.value = this.value.replace(/[^0-9]|\s/g, '');">
                        <label for="txt_LDiaria">Limite de Diárias</label>
                    </div>
                    <div class="input-field col s12 m4 l4">
                        <input @keyup="Moeda(this.VDCOORDENADOR,'VDCOORDENADOR')" v-model="VDCOORDENADOR" id="txt_VDCoordenador" name="txt_VDCoordenador" type="text" class="validate" required 
                        oninvalid="this.setCustomValidity('Informe o Valor da Diária !!!')"
                        onchange="try{setCustomValidity('')}catch(e){}">
                        <label for="txt_Descricao">Valor Diária Coordenador</label>
                    </div>
                    <div class="input-field col s12 m8 l8">
                        <textarea oninput="this.value = this.value.toUpperCase()" v-model="DESCRICAO" id="txt_Descricao" class="materialize-textarea"></textarea>
                        <label for="txt_Descricao">Descrição do evento</label>
                    </div>
                    <div class="input-field col s12 m4 l4" >
                        <input type="text" v-model="dataInicio" id="txt_DataInicio" class="validate" required 
                        @keyup="Datas(this.dataInicio,'dataInicio',1)"  @blur="Datas(this.dataInicio,'dataInicio',2)" maxlength="10" placeholder="DD/MM/YYYY"
                        oninvalid="this.setCustomValidity('Informe a Data !!!')" onchange="try{setCustomValidity('')}catch(e){}">
                        <label for="txt_DataInicio">Data de Início do evento</label>
                    </div>
                </div>
                <br>
                <div class="divider Clfieldset"></div>
                <h5>Vale Refeição</h5>
                <div  class="row z-depth-2 ajusterow">
                    <div class="input-field col l3 m4 s12">
                    <p>
                        <label>
                            <input @change="check('VALEREFEICAO')" id="chk-valeref" v-model="VALEREFEICAO" type="checkbox" />
                            <span style="padding-left: 35px;">Paga Vale Refeição</span>
                        </label>
                    </p>
                    </div>
                    <div class="input-field col l4 m4 s12 ">
                        <input disabled  @keyup="Moeda(this.VALORREFEICAO,'VALORREFEICAO')" v-model="VALORREFEICAO" id="txt_VVALEREF" name="txt_VVALEREF" type="text" class="validate" required 
                        oninvalid="this.setCustomValidity('Informe o Valor !!!')"
                        onchange="try{setCustomValidity('')}catch(e){}" >
                        <label for="txt_VVALEREF">Valor</label>
                    </div>
                </div>
                <br>
                <div class="divider Clfieldset"></div>
                <h5>Vale Transporte</h5>
                <div class="row z-depth-2 ajusterow">
                    <div class="input-field col l3 m4 s12">
                    <p>
                        <label>
                            <input @change="check('VALETRANSPORTE')" id="chk-valetransp" v-model="VALETRANSPORTE" type="checkbox" />
                            <span style="padding-left: 35px;">Paga Vale Transporte</span>
                        </label>
                    </p>
                    </div>
                    <div class="input-field col l4 m4 s12 ">
                        <input disabled @keyup="Moeda(this.VALORTRANSPORTE,'VALORTRANSPORTE')" v-model="VALORTRANSPORTE" id="txt_VVALTRANSP" name="txt_VVALTRANSP" type="text" class="validate" required 
                        oninvalid="this.setCustomValidity('Informe o Valor !!!')"
                        onchange="try{setCustomValidity('')}catch(e){}">
                        <label for="txt_VVALTRANSP">Valor</label>
                    </div>
                    <div class="input-field col l4 m4 s12 ">
                        <input disabled @keyup="Moeda(this.LIMVALORTRANSPORTE,'LIMVALORTRANSPORTE')" v-model="LIMVALORTRANSPORTE" id="txt_VLIMTRANSP" name="txt_VLIMTRANSP" type="text" class="validate" required 
                        oninvalid="this.setCustomValidity('Informe o Valor Limite Max.!!!')"
                        onchange="try{setCustomValidity('')}catch(e){}">
                        <label for="txt_VLIMTRANSP">Limite Max.</label>
                    </div>
                </div>
                <br>
                <div class="divider Clfieldset "></div>
                <h5>Aprovação</h5>
                <div class="row z-depth-2 ajusterow">
                    <br>
                    <div class="input-field col s12" id="div-gerentes">
                        <i class="material-icons prefix">textsms</i>
                        <input oninput="this.value = this.value.toUpperCase()" @change='aprovadores()' type="text" id="txt_aprovadores" class="autocomplete">
                        <label id="lblAprovadores" for="gerentesauto">Nome do gerente aprovador</label>
                    </div>
                    
                    <div class="input-field col s12">
                        <ul class="collection with-header" id="gerentes">
                            <li class="collection-header" id=""><h5>Gerentes Aprovadores</h5></li>
                            <li class="collection-item" v-for="aprovador in lstAprovadores" :key="aprovador.codaprovador" >
                                {{ aprovador.codaprovador }}, {{ aprovador.nome }}, {{ aprovador.estados }}<i @click="deleteAprovador(aprovador)" class="material-icons close right excfab">close</i>
                            </li>
                        </ul>
                    </div>
                    
                </div>
                <br>
                <div class="divider"></div>
                <br>
                <button type="submit" style="margin-left: 15px;margin-right: 15px;" id="SalvarEventoModal" @click="SalvarEvento($event)"  class="waves-effect waves-light btn right btnsEventos ">Salvar</button>
                <button type="button" style="margin-left: 15px;" id="EditarEventoModal" @click="UpdateEvento($event)" class="waves-effect waves-light btn right btnsEventos ">Editar</button>
                <br>
            </form>
           
        </div>

    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";
  const toast = useToast();

    
  export default {
    name: 'EventosView',
    components: {
      MenuLateral
    },
    data () {
        return {       
            CODEVENTO:"",
            EVENTO:"",
            ESTADOEVENTO:"",
            VALORDIARIA:"",
            LIMITEDIARIAS:"",
            VALEREFEICAO:"",
            VALORREFEICAO:"",
            VALETRANSPORTE:"",
            VALORTRANSPORTE:"",
            LIMVALORTRANSPORTE:"",
            VDCOORDENADOR:"",
            DESCRICAO: "",
            CODCCUSTO:"",
            ATIVO: "",
            lstEventos:[],
            selectedRows:[],
            lstAprovadores:[],
            lstAprovadoresObj:[],
            flag:true,
            flagex:true,
            titulo:"",
            dataInicio:"",
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
                            api.loadingOff();
                            resize();
                    }, "1000");
                }
            })
        }
    },
    methods:
    {
        check(variavel)
        {
            if(variavel === "VALEREFEICAO")
            {
                if(this[variavel])
                {
                    document.getElementById("txt_VVALEREF").disabled = false;
                }
                else
                {
                    document.getElementById("txt_VVALEREF").disabled = true;
                    document.getElementById("txt_VVALEREF").value = "";
                    this.VALORREFEICAO = "";
                }
                M.updateTextFields();
            }
            else if(variavel === "VALETRANSPORTE")
            {
                if(this[variavel])
                {
                    document.getElementById("txt_VVALTRANSP").disabled = false;
                    document.getElementById("txt_VLIMTRANSP").disabled = false;
                }
                else
                {
                    document.getElementById("txt_VVALTRANSP").disabled = true;
                    document.getElementById("txt_VLIMTRANSP").disabled = true;
                    document.getElementById("txt_VVALTRANSP").value = "";
                    document.getElementById("txt_VLIMTRANSP").value = "";
                    this.VALORTRANSPORTE = "";
                    this.LIMVALORTRANSPORTE = "";
                }
                M.updateTextFields();
            } 
        },
        aprovadores()
        {
            setTimeout(() =>
            {
                var aux = document.getElementById("auxAprovadores").value.split(",");
                var x = true;
                this.lstAprovadores.forEach(i => {
                    if(i.codaprovador === aux[0])
                    {
                        x=false;
                    }
                });
                if(x){
                    let data = {
                    "codaprovador": aux[0],
                    "nome": aux[1],
                    "estados": aux[2]
                    }
                    this.lstAprovadores.push(data);
                }
                M.FormSelect.init(document.querySelectorAll('select'));
            }, 200);
        },
        deleteAprovador(item)
        {
            this.lstAprovadores = this.lstAprovadores.filter(a => a !== item);
        },
        Moeda(valor,variavel)
        {
            this[variavel] = api.Moeda(valor);
        },
        consistircampos()
        {
            this.CODCCUSTO = document.getElementById("auxCodCCusto").value; //.split(",")[0].replaceAll(" ","");
            if(this.EVENTO === "" )
            {
                return false;
            }
            else if(this.ESTADOEVENTO === "")
            {
                toast.error("Informe o estado em que o evento acontecerá !!!")
                return false;
            }
            else if(this.CODCCUSTO === "" ||  this.VALORDIARIA === "" || this.LIMITEDIARIAS === "" || this.LIMITEDIARIAS == null)
            {
                return false;
            }
            else if(this.VALORDIARIA === "0,00" || this.VALORDIARIA === "")
            {
                this.VALORDIARIA = "";
                toast.error("O valor da diária não pode ser zero !!!")
                return false;
            }
            else if(this.LIMITEDIARIAS == 0 || this.LIMITEDIARIAS === "")
            {
                this.LIMITEDIARIAS = "";
                toast.error("O limite de diárias não pode ser zero !!!")
                return false;
            }
            else if(this.VDCOORDENADOR === "0,00" || this.VDCOORDENADOR === "")
            {
                this.VDCOORDENADOR = "";
                //toast.error("O valor da diária do coordenador precisa ser informado e não pode ser zero !!!")
                return false;
            }
            else if(this.VALEREFEICAO && (this.VALORREFEICAO === "" || this.VALORREFEICAO === "0,00"))
            {
                toast.error("Quando o vale refeição está marcado, e necessário informar os valores !!!")
                return false;
            }
            else if(this.VALETRANSPORTE && 
            ((this.VALORTRANSPORTE === "" || this.VALORTRANSPORTE === "0,00") || 
            (this.LIMVALORTRANSPORTE === "" || this.LIMVALORTRANSPORTE === "0,00")))
            {
                toast.error("Quando o vale trasporte está marcado, e necessário informar os valores !!!")
                return false;
            }
            else if(this.lstAprovadores.length == 0)
            {
                toast.error("Informe os gerentes aprovadores !!!")
                return false;
            }
            else if(this.dataInicio === "")
            {
                toast.error("Informe a data de inicio do evento !!!")
                return false;
            }
            return true;
        },
        async Cadastrar(e)
        {
            e.preventDefault();
            var ret = await api.verificarAcesso("EVENTOS","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
            if(!ret)
            {
                this.LimparCampos();
                return false;
            }
            this.LimparCampos();
            this.flagex = false;
            this.titulo = "CADASTRAR EVENTO"
            document.getElementById("EditarEventoModal").textContent = "Cancelar";
            M.Modal.getInstance(document.getElementById("FormCadastro")).open();
            api.loadingOff();
        },
        async SalvarEvento(e)
        {
            var cons = this.consistircampos()
            if(!cons)
            {
                return false;
            }
            if(this.flag)
            {
               
                e.preventDefault();
                this.CODCCUSTO = document.getElementById("auxCodCCusto").value; //.split(",")[0].replaceAll(" ","");
                let _CODAPROVADORES = [];
                this.lstAprovadores.forEach(i => {
                    _CODAPROVADORES.push(i.codaprovador);
                })

                let data = {
                    EVENTO: this.EVENTO,
                    DESCRICAO: this.DESCRICAO,
                    CODCCUSTO: this.CODCCUSTO,
                    ATIVO: this.ATIVO ? "1":"0",
                    ESTADOEVENTO: this.ESTADOEVENTO,
                    VALORDIARIA: this.VALORDIARIA,
                    LIMITEDIARIAS: this.LIMITEDIARIAS.toString(),
                    VALEREFEICAO: this.VALEREFEICAO ? "1":"0",
                    VALORREFEICAO: this.VALORREFEICAO,
                    VALETRANSPORTE: this.VALETRANSPORTE ? "1":"0",
                    VALORTRANSPORTE: this.VALORTRANSPORTE,
                    LIMVALORTRANSPORTE: this.LIMVALORTRANSPORTE,
                    DTCRIACAO: api.dataAtual(),
                    DTALTERACAO: api.dataAtual(),
                    CODUSUARIOCAD: this.USUARIO.codusuarios,
                    CODUSUARIOALT: this.USUARIO.codusuarios,
                    CODAPROVADORES: _CODAPROVADORES,
                    VDCOORDENADOR: this.VDCOORDENADOR,
                    DATAINICIO:this.dataInicio
                }
               api.loadingOn()
               await api.post("cadeventos", data).then(r=>{
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
                    this.getAllEventos();
                    toast("Evento Cadastrado com Sucesso !!!");
                }})
            
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                api.loadingOff();
            }
            else
            {
                api.loadingOn()
                let _CODAPROVADORES = [];
                this.lstAprovadores.forEach(i => {
                    _CODAPROVADORES.push(i.codaprovador);
                })

                let data = {
                    CODEVENTO: this.selectedRows[0].codevento,
                    EVENTO: this.EVENTO,
                    DESCRICAO: this.DESCRICAO,
                    CODCCUSTO: this.CODCCUSTO,
                    ATIVO: this.ATIVO ? "1":"0",
                    ESTADOEVENTO: this.ESTADOEVENTO,
                    VALORDIARIA: this.VALORDIARIA,
                    LIMITEDIARIAS: this.LIMITEDIARIAS.toString(),
                    VALEREFEICAO: this.VALEREFEICAO ? "1":"0",
                    VALORREFEICAO: this.VALORREFEICAO,
                    VALETRANSPORTE: this.VALETRANSPORTE ? "1":"0",
                    VALORTRANSPORTE: this.VALORTRANSPORTE,
                    LIMVALORTRANSPORTE: this.LIMVALORTRANSPORTE,
                    DTCRIACAO: api.dataAtual(),
                    DTALTERACAO: api.dataAtual(),
                    CODUSUARIOCAD: this.USUARIO.codusuarios,
                    CODUSUARIOALT: this.USUARIO.codusuarios,
                    CODAPROVADORES: _CODAPROVADORES,
                    VDCOORDENADOR: this.VDCOORDENADOR,
                    DATAINICIO:this.dataInicio
                }

                await api.post("updateeventos", data).then(r=>{

                    this.LimparCampos();
                    if(r.status == 401)
                    {
                        toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                        this.$router.push({ path: '/'});
                    }
                    else if(r.status != 200){
                        toast.error(r.data.message);
                    }else{
                        
                        this.getAllEventos();
                        toast("Evento Atualizado com Sucesso !!!");
                    }
                    M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                })
                api.loadingOff();
                this.flag = true;
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                document.getElementById("EditarEvento").textContent = "Editar";
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
                if(document.getElementById("EditarEventoModal").textContent === "Cancelar")
                {
                    M.Modal.getInstance(document.getElementById("FormCadastro")).close();
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
                toast("Marque um evento para editar !!!")
                return;
            }

            if(this.flag)
            {
                var ret = await api.verificarAcesso("EVENTOS","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    e.preventDefault();
                    this.LimparCampos();
                    return false;
                }
                this.titulo = "EDITAR EVENTO"
                M.Modal.getInstance(document.getElementById("FormCadastro")).open();
                document.getElementById("txt_Codigo").value = this.selectedRows[0].codevento;
                document.getElementById("txt_Nevento").value = this.selectedRows[0].evento;
                document.getElementById("txt_Descricao").value = this.selectedRows[0].descricao;
                document.getElementById("txt_CentroCusto").value = this.selectedRows[0].codccusto;
                document.getElementById("auxCodCCusto").value = this.selectedRows[0].codccusto;
                document.getElementById("txt_Estado").value = this.selectedRows[0].estadoevento;
                document.getElementById("txt_VDiaria").value = this.selectedRows[0].valordiaria;
                document.getElementById("txt_LDiaria").value = this.selectedRows[0].limitediarias;

                document.getElementById("chk-valeref").checked = this.selectedRows[0].valerefeicao === "1" ? true : false;
                document.getElementById("txt_VVALEREF").value = this.selectedRows[0].valorrefeicao;
                this.selectedRows[0].valerefeicao === "1" ? document.getElementById("txt_VVALEREF").disabled = false : document.getElementById("txt_VVALEREF").disabled = true;
                
                document.getElementById("chk-valetransp").checked = this.selectedRows[0].valetransporte === "1" ? true : false;
                document.getElementById("txt_VVALTRANSP").value = this.selectedRows[0].valortransporte;
                document.getElementById("txt_VLIMTRANSP").value = this.selectedRows[0].limvalortransporte;
                this.selectedRows[0].valetransporte === "1" ? document.getElementById("txt_VVALTRANSP").disabled = false : document.getElementById("txt_VVALTRANSP").disabled = true;
                this.selectedRows[0].valetransporte === "1" ? document.getElementById("txt_VLIMTRANSP").disabled = false : document.getElementById("txt_VLIMTRANSP").disabled = true;
                
                
                

                this.flag = false;
                this.EVENTO = this.selectedRows[0].evento;
                this.DESCRICAO = this.selectedRows[0].descricao;
                this.CODCCUSTO = this.selectedRows[0].codccusto;
                this.ATIVO = this.selectedRows[0].ativo == "1" ? true : false;
                this.CODEVENTO = this.selectedRows[0].codevento;
                this.ESTADOEVENTO = this.selectedRows[0].estadoevento;
                this.VALORDIARIA = api.Moeda(this.selectedRows[0].valordiaria);
                this.LIMITEDIARIAS = this.selectedRows[0].limitediarias;
                this.VALEREFEICAO = this.selectedRows[0].valerefeicao === "1" ? true : false;
                this.VALORREFEICAO = api.Moeda(this.selectedRows[0].valorrefeicao);
                this.VALETRANSPORTE = this.selectedRows[0].valetransporte === "1" ? true : false;
                this.VALORTRANSPORTE = api.Moeda(this.selectedRows[0].valortransporte);
                this.LIMVALORTRANSPORTE = api.Moeda(this.selectedRows[0].limvalortransporte);
                this.VDCOORDENADOR = api.Moeda(this.selectedRows[0].vdcoordenador);
                document.getElementById("txt_VDCoordenador").value = this.VDCOORDENADOR;
                this.dataInicio = this.selectedRows[0].datainicio.split(" ")[0];

                this.getAllAprovadores();
                api.loadingOff();
                document.getElementById("ExcluirEvento").classList.add("disabled");
                document.getElementById("EditarEventoModal").textContent = "Cancelar";
                document.getElementById("EditarEventoModal").style.display = "";

                M.FormSelect.init(document.querySelectorAll('select'));
                M.updateTextFields();
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
                toast("Marque somente um evento para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um evento para excluir !!!")
                return;
            }


            if(this.flagex)
            {
                document.getElementById("txt_Nevento").value = this.selectedRows[0].evento;
                document.getElementById("txt_Descricao").value = this.selectedRows[0].descricao;
                document.getElementById("txt_CentroCusto").value = this.selectedRows[0].codccusto
                this.EVENTO = this.selectedRows[0].evento;
                this.DESCRICAO = this.selectedRows[0].descricao;
                this.CODCCUSTO = this.selectedRows[0].codccusto;
                this.ATIVO = this.selectedRows[0].ativo == "1" ? true : false;
                this.flagex = false;
                document.getElementById("SalvarEventoModal").classList.add("disabled");
                document.getElementById("CadastrarEvento").classList.add("disabled");
                document.getElementById("EditarEvento").textContent = "Cancelar";
                document.getElementById("ExcluirEvento").textContent = "Confirma?";
                M.updateTextFields();
            }
            else
            {
                var ret = await api.verificarAcesso("EVENTOS","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
                if(!ret)
                {
                    e.preventDefault();
                    this.LimparCampos();
                    return false;
                }

                let data = {
                    codevento: this.selectedRows[0].codevento
                }
                await api.delete("deleteeventos", data).then(r=>{
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
                        toast("Evento Excluido com Sucesso !!!");
                        this.getAllEventos();
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
            this.CODEVENTO = "",
            this.EVENTO = "",
            this.ESTADOEVENTO = "",
            this.VALORDIARIA = "",
            this.LIMITEDIARIAS = "",
            this.VALEREFEICAO = "",
            this.VALORREFEICAO = "",
            this.VALETRANSPORTE = "",
            this.VALORTRANSPORTE = "",
            this.LIMVALORTRANSPORTE = "",
            this.DESCRICAO = "";
            this.CODCCUSTO = "";
            this.ATIVO = "0";
            this.selectedRows = [];
            this.lstAprovadores = [],
            this.titulo = ""
            this.VDCOORDENADOR = "";
            this.dataInicio = "";

            document.getElementById("txt_Codigo").value = "";
            document.getElementById("txt_Nevento").value = "";
            document.getElementById("auxCodCCusto").value = "";
            document.getElementById("auxAprovadores").value = "";
            document.getElementById("txt_CentroCusto").value = "";
            document.getElementById("txt_Estado").value = "";
            document.getElementById("txt_VDiaria").value = "";
            document.getElementById("txt_LDiaria").value = "";
            document.getElementById("txt_Descricao").value = "";
            document.getElementById("chk-valeref").checked = false;
            document.getElementById("txt_VVALEREF").value = "";
            document.getElementById("chk-valetransp").checked = false;
            document.getElementById("txt_VVALTRANSP").value = "";
            document.getElementById("txt_VLIMTRANSP").value = "";
            document.getElementById("txt_VDCoordenador").value = "";
            document.getElementById("txt_DataInicio").value = "";

            M.FormSelect.init(document.querySelectorAll('select'));
            
            M.updateTextFields();
        },
        getAllCCusto()
        {
            api.get("getCcustoFillObject",{CodColigada:"20"}).then(r=>{
                if(r.status == 401)
                {
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    var elems = document.getElementById('txt_CentroCusto');
                    var list = r.data.ccusto.data;
                    var data = {};
                    for (const key of list) {
                        data[key] = null;
                    }
                    var options = {
                    data: data,
                    onAutocomplete: function(res) {
                        document.getElementById("auxCodCCusto").value = res;
                        }
                    }
                    M.Autocomplete.init(elems, options);
                }
            });
        },
        async getAllEventos()
        {
            api.loadingOn();
            await api.get("getalleventos",{CodColigada:"20"}).then(r=>{
                if(r.status == 401)
                {
                    //api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    r.data.eventos.forEach( i => {
                        i.valordiaria = String(i.valordiaria * 100);
                        i.valorrefeicao = String(i.valorrefeicao * 100);
                        i.valortransporte = String(i.valortransporte * 100);
                        i.limvalortransporte = String(i.limvalortransporte * 100);
                        i.vdcoordenador = String(i.vdcoordenador * 100);
                    })
                    this.lstEventos = r.data.eventos;
                    if(r.data.eventos.length == 0)
                    {
                        api.loadingOff();
                        toast("Sem registros de eventos cadastrados !!!");
                    }
                }
                else if(r.status == 400){
                    toast.error(r.data.message);
                }
            });
        },
        async getAllAprovadores()
        {
            await api.get("getallaprovadoresevento",{codevento:this.CODEVENTO}).then(r=>{
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
        async getAllAprovadoresObject()
        {
            await api.get("getallaprovadoresobject").then(r=>{
                if(r.status == 401)
                {
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    var elems = document.getElementById('txt_aprovadores');
                    var list = r.data.aprovadores;
                    var data = {};
                    for (const key of list) {
                        data[key] = null;
                    }
                    var options = {
                        data: data,
                        onAutocomplete: function(res) 
                        {
                            document.getElementById("auxAprovadores").value = res;
                            document.getElementById("txt_aprovadores").value = "";
                            document.getElementById("lblAprovadores").classList.remove("active");
                        }
                    }
                    M.Autocomplete.init(elems, options);
                }
            });
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
                    document.getElementById("txt_DataInicio").value = "";
                    M.updateTextFields();
                }
            }
            
        }
    },
    mounted()
    {
        M.AutoInit();
        //############## Modal Cadastro ###############
         let optmodal = {
            dismissible:false,
			onCloseEnd:function()
			{
                document.getElementById("EditarEventoModal").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
			}
        }
        var mdl = document.getElementById('FormCadastro');
        M.Modal.init(mdl, optmodal); 
        //############## Modal Cadastro ###############
        resize();
    },  
    created(){
        this.getAllCCusto();
        this.getAllEventos();
        this.getAllAprovadoresObject();
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
            document.getElementById('tableContainer').style.height = (conteudoHeight-270)+"px";
        }
        else if(conteudoHeight > (tableContainerHeight+PxAdicional))
        {
            document.getElementById('tableContainer').style.height = (conteudoHeight-270)+"px";
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
  .ajusterow
  {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .geritem
  {
    display: grid;
    grid-template-columns: 95% 5%;
  }
    .excfab 
    {
        color: #ff2020;
        cursor: pointer;
        margin: auto;
    }
    .Clfieldset
    {
        height: 10px;
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
        background-color: #de001f !important;
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
    }
  </style>