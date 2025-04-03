<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CADASTRAR SÓCIOS</h5>
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
                            <th>Codigo</th>
                            <th>Nome do Sócio</th>
                            <th>Data Início</th>
                            <th>Ativo</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="socio in lstSocios" :key="socio.codsocio">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="socio.codsocio" v-model="selectedRows" :value="socio"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{socio.codsocio}}</td>
                                <td>{{socio.nome}}</td>
                                <td>{{socio.datainicio}}</td>
                                <td v-if="socio.ativo === 'True'">
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

    <!-- Modal Structure -->
    <div id="FormCadastro" class="modal">
        <div class="modal-content">
            <form v-on:submit.prevent="onSubmit">
                <h5 style="font-weight: bold;">{{titulomodal}}</h5>
                <div class="divider" style="height: 10px;"></div>
                <!-- campos cadastro -->
                <br>
                <div style="padding: 15px;" class="z-depth-2">
                    <br>
                    <div class="row">
                        <div class="input-field col l4 m4 s6">
                            <input disabled id="txt_CodSocios" v-model="codsocio" name="txt_CodSocios" type="text" class="validate">
                            <label for="txt_CodSocios">Código</label>
                        </div>
                        <div class="input-field col l2 m3 s6 offset-m5 offset-l5" >
                                <label class="chkCenter" >
                                    <input v-model="ativo" id="chk_ativo" name="chk_ativo" type="checkbox" checked/>
                                    <span>Ativo</span>
                                </label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12 m6 l6">
                            <input @keyup="UpperCase(this.nome,'nome')" id="txt_Nome" v-model="nome" name="txt_Nome" type="text" class="validate" required 
                            oninvalid="this.setCustomValidity('Informe o nome do usuário!!!')"
                            onchange="try{setCustomValidity('')}catch(e){}">
                            <label for="txt_Nome">Nome do Usuário</label>
                        </div>
                        <div class="input-field col s12 m6 l6">
                            <input @keyup="UpperCase(this.email,'email')" id="txt_Email" v-model="email" name="txt_Email" type="email" class="validate" required 
                            oninvalid="this.setCustomValidity('Informe o email!!!')"
                            onchange="try{setCustomValidity('')}catch(e){}">
                            <label for="txt_Email">Email</label>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="input-field col s11 m4 l4" >
                            <input type="text" v-model="batatar"  id="txt_DataInicio" class="validate" required 
                            @keyup="Datas(this.batatar,'batatar',1)"  @blur="Datas(this.batatar,'batatar',2)" maxlength="10" placeholder="DD/MM/AAAA"
                            oninvalid="this.setCustomValidity('Informe a Data !!!')" onchange="try{setCustomValidity('');}catch(e){}">
                            <label for="txt_DataInicio">Data de Início</label>
                            <i class="material-icons prefix clickable" @click="PickerOpen('hdn_DataInicio')">insert_invitation</i>
                        </div>
                        <input v-model="hdndata" @change="handleInsertData()" hidden type="text" class="datepicker" id="hdn_DataInicio">
                    </div>
                    <br>
                </div>
                <br>
                <h5 style="font-weight: bold;">Participação</h5>
                <div class="divider" style="height: 10px;"></div>
                <!-- campos cadastro -->
                <br>
                <div id="conpart" class="row z-depth-2">
                    <br>
                    <div class="col s12">
                        <a @click="addNewPart" class="btn-floating btn waves-effect waves-light right" style="margin-right: 15px;"><i class="material-icons">add</i></a>
                        <a @click="gethistorico" class="btn-floating btn waves-effect waves-light right" style="margin-right: 15px;"><i class="material-icons">history</i></a>
                    </div>
                    <br>
                    <div class="divider" ></div>
                    <div class="col s12" >
                        
                        <table id="tblpart" class="centered striped responsive-table">
                            <thead id="ththead">
                                <tr id="trth">
                                    <th class="thth">Codigo</th>
                                    <th class="thth">Grupo</th>
                                    <th class="thth">%</th>
                                    <th class="thth">Núcleo</th>
                                    <th class="thth">DataInicio</th>
                                    <th class="thth">DataFim</th>
                                    <th class="thth">X</th>
                                </tr>
                            </thead>
                            <tbody id="tbody">
                                <tr  v-for="part in lstParticipacao" :key="part.idpart" :class="{ 'deletedrow': part.deleted }">
                                    <td class="thth porcent">
                                        <input disabled
                                        type="text"
                                        v-model="part.codpart"/>
                                    </td>
                                    <td class="thth porcent">
                                        <input
                                        type="text"
                                        v-model="part.grupo"
                                        @input="handleUpperCase('grupo', part)"/>
                                    </td>
                                    <td class="thth porcent">
                                        <input 
                                        type="text"
                                        v-model="part.porcentagem"
                                        @input="handleMoeda('porcentagem', part)" 
                                        maxlength="6">
                                    </td>
                                    <td class="thth">
                                        <input
                                        type="text"
                                        v-model="part.nucleo"
                                        @input="handleUpperCase('nucleo', part)"/>
                                    </td>
                                    <td class="thth">
                                        <input 
                                        :id="`dtini-${part.idpart}`" 
                                        v-model="part.datainicio" 
                                        @keyup="DatasPartIni(part.datainicio, part, 1)" 
                                        @blur="DatasPartIni(part.datainicio, part, 2)" 
                                        type="text" 
                                        maxlength="10" 
                                        placeholder="DD/MM/AAAA"
                                        oninvalid="this.setCustomValidity('Informe a Data !!!')"
                                        onchange="try { setCustomValidity('') } catch(e) {}"
                                        />
                                    </td>
                                    <td class="thth"><input 
                                        :id="`dtfina-${part.idpart}`" 
                                        v-model="part.datafim" 
                                        @keyup="DatasPartFina(part.datafim, part, 1)" 
                                        @blur="DatasPartFina(part.datafim, part, 2)" 
                                        type="text" 
                                        maxlength="10" 
                                        placeholder="DD/MM/AAAA"
                                        oninvalid="this.setCustomValidity('Informe a Data !!!')"
                                        onchange="try { setCustomValidity('') } catch(e) {}"
                                        />
                                    </td>
                                    <td class="thth">
                                        <a id="delpart" @click="DeletePart(part)" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">delete_sweep</i></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br>
                </div>
                <br>
                <div class="divider"></div>

                <div id="modalbotoes">
                    <button type="submit" style="margin-left: 15px;margin-right: 15px;" id="SalvarEventoModal" @click="SalvarEvento($event)"  class="waves-effect waves-light btn right btnsEventos ">Salvar</button>
                    <button type="button" style="margin-left: 15px;" id="EditarEventoModal" @click="UpdateEvento($event)" class="waves-effect waves-light btn right btnsEventos ">Editar</button>
                </div>

            </form>
        </div>
    </div>

    <div id="modalHist" class="modal">
        <div class="modal-content">
            <h5 style="font-weight: bold;">Histórico Participação</h5>
                <div class="divider" style="height: 10px;"></div>
                <!-- campos cadastro -->
                <br>
                <div id="conpart" class="row z-depth-2">
                    <br>
                    <div class="col s12" style="max-height: 500px;overflow: auto;">
                        <table id="tblpart" class="centered striped responsive-table">
                            <thead id="ththead">
                                <tr id="trth">
                                    <th class="thth">Codigo</th>
                                    <th class="thth">Tipo</th>
                                    <th class="thth">Data</th>
                                    <th class="thth">Grupo</th>
                                    <th class="thth">%</th>
                                    <th class="thth">Núcleo</th>
                                    <th class="thth">DtInicio</th>
                                    <th class="thth">DtFim</th>
                                    <!-- <th class="thth">DtCriação</th>
                                    <th class="thth">UsrCriação</th>
                                    <th class="thth">UltimaAlt</th>
                                    <th class="thth">UsrAlt</th> -->

                                </tr>
                            </thead>
                            <tbody id="tbody">
                                <tr v-for="part in lstPartHist" :key="part.idpart">
                                    <td class="thth porcent">
                                        <input
                                        type="text"
                                        v-model="part.codpart"/>
                                    </td>
                                    <td class="thth porcent">
                                        <input
                                        type="text"
                                        v-model="part.tipo"/>
                                    </td>
                                    <td class="thth">
                                        <input
                                        type="text"
                                        v-model="part.dtcriacao"/>
                                    </td>
                                    <td class="thth">
                                        <input
                                        type="text"
                                        v-model="part.grupo"/>
                                    </td>
                                    <td class="thth porcent">
                                        <input 
                                        type="text"
                                        v-model="part.porcentagem"
                                        maxlength="6">
                                    </td>
                                    <td class="thth">
                                        <input
                                        type="text"
                                        v-model="part.nucleo"/>
                                    </td>
                                    <td class="thth">
                                        <input  
                                        v-model="part.datainicio" 
                                        type="text" 
                                        maxlength="10" 
                                        placeholder="DD/MM/AAAA"
                                        oninvalid="this.setCustomValidity('Informe a Data !!!')"
                                        onchange="try { setCustomValidity('') } catch(e) {}"
                                        />
                                    </td>
                                    <td class="thth"><input 
                                        v-model="part.datafim" 
                                        type="text" 
                                        maxlength="10" 
                                        placeholder="DD/MM/AAAA"
                                        oninvalid="this.setCustomValidity('Informe a Data !!!')"
                                        onchange="try { setCustomValidity('') } catch(e) {}"
                                        />
                                    </td>
                                    
                                    <!-- <td class="thth">
                                        <input 
                                        :id="`dtcriacao-${part.idpart}`" 
                                        v-model="part.dtcriacao" 
                                        @keyup="DatasPartIni(part.datainicio, part, 1)" 
                                        @blur="DatasPartIni(part.datainicio, part, 2)" 
                                        type="text" 
                                        maxlength="10" 
                                        placeholder="DD/MM/AAAA"
                                        oninvalid="this.setCustomValidity('Informe a Data !!!')"
                                        onchange="try { setCustomValidity('') } catch(e) {}"
                                        />
                                    </td>
                                    <td class="thth">
                                        <input
                                        type="text"
                                        v-model="part.codusuariocad"
                                        @input="handleUpperCase('grupo', part)"/>
                                    </td>
                                    <td class="thth">
                                        <input 
                                        :id="`dtalteracao-${part.idpart}`" 
                                        v-model="part.dtalteracao" 
                                        @keyup="DatasPartIni(part.datainicio, part, 1)" 
                                        @blur="DatasPartIni(part.datainicio, part, 2)" 
                                        type="text" 
                                        maxlength="10" 
                                        placeholder="DD/MM/AAAA"
                                        oninvalid="this.setCustomValidity('Informe a Data !!!')"
                                        onchange="try { setCustomValidity('') } catch(e) {}"
                                        />
                                    </td>
                                    <td class="thth">
                                        <input
                                        type="text"
                                        v-model="part.codusuarioalt"
                                        @input="handleUpperCase('grupo', part)"/>
                                    </td> -->
                                    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br>
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
    name: 'SociosView',
    components: {
      MenuLateral
    },
    data () {
        return {      
            codsocio:"",     
            nome:"",
            email:"",
            batatar:"",
            ativo:true,
            selectedRows:[],
            lstSocios:[],
            lstParticipacao:[],
            lstPartHist:[],
            flag:true,
            flagex:true,
            titulomodal:"",
            hdndata:"",
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
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
                        this.resize();
                        window.addEventListener('resize', this.resize);
                    }, "1000");
                }
            })
        }/* ,
        lstPerfils() {
            var rows = 0;
            return this.lstPerfil.find(() => {
                rows += 1;
                if(this.lstPerfil.length == rows)
                {
                     setTimeout(  () => {
                        M.FormSelect.init(document.querySelectorAll('select'));
                    }, "1000");
                }
            })
        } */
    },
    methods:
    {
        async Cadastrar(e)
        {
            if(this.flag)
            {
                this.titulomodal = "INCLUIR SÓCIOS";
            }
            this.flagex = false;
            
            e.preventDefault();
            var ret = await api.verificarAcesso("SOCIOS","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
            if(!ret)
            {
                return;
            }
            document.getElementById("EditarEventoModal").textContent= "Cancelar";
            this.LimparCampos();
            M.Modal.getInstance(document.getElementById("FormCadastro")).open();
            api.loadingOff();
        },
        async SalvarEvento(e)
        {
            this.batatar = document.getElementById("txt_DataInicio").value;
            if(this.nome === "" || this.email === "" || this.batatar === "")
            {
                return 0;
            }
            else if(!api.validateEmail(this.email))
            {
                toast.error("Formato de email incorreto !!!");
                return 0;
            }
            else
            {
                this.Datas(this.batatar,"batatar",2)
            }
            
            api.loadingOn();

            if(!this.flag)
            {
                let data = 
                {
                    CODSOCIO:this.codsocio,
                    NOME:this.nome,
                    EMAIL:this.email,
                    DATAINICIO:this.batatar,
                    ATIVO:this.ativo? "1":"0",
                    DTALTERACAO:api.dataAtualcomHoras(),
                    CODUSUARIOALT:this.USUARIO.codusuarios,
                    PARTICIPACAO:this.lstParticipacao
                }

                this.flag = true;

                //#########################
                await api.post("updateSocios", data).then(r=>{
                //#########################

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
                    this.getAllSocios();
                    toast("Usuário Atualizado com Sucesso !!!");
                }})
                e.preventDefault();
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                api.loadingOff();
            }
            else
            {
                let data = 
                {
                    CODSOCIO:this.codsocio,
                    NOME:this.nome,
                    EMAIL:this.email,
                    DATAINICIO:this.batatar,
                    ATIVO:this.ativo? "1":"0",
                    DTCRIACAO:api.dataAtualcomHoras(),
                    CODUSUARIOCAD:this.USUARIO.codusuarios,
                    PARTICIPACAO:this.lstParticipacao
                }

               
                var ret = await api.verificarAcesso("SOCIOS","SALVAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }

                //#########################
                await api.post("cadSocios", data).then(r=>{
                //#########################

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
                    this.getAllSocios();
                    toast("Usuário Cadastrado com Sucesso !!!");
                }})
                e.preventDefault();
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                api.loadingOff();
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
                document.getElementById("EditarEventoModal").textContent= "Editar";
                this.LimparCampos();
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                return;
            }
            else if(this.selectedRows.length > 1)
            {
                e.preventDefault();
                toast("Marque somente um sócio para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                e.preventDefault();
                toast("Marque um sócio para editar !!!")
                return;
            }

            if(this.flag)
            {
                var ret = await api.verificarAcesso("SOCIOS","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }
                this.titulomodal = "EDITAR SÓCIO";
                M.Modal.getInstance(document.getElementById("FormCadastro")).open();
                document.getElementById("txt_CodSocios").value = this.selectedRows[0].codsocio;
                document.getElementById("txt_Nome").value = this.selectedRows[0].nome;
                document.getElementById("txt_Email").value = this.selectedRows[0].email;
                document.getElementById("txt_DataInicio").value = this.selectedRows[0].datainicio;
                this.codsocio = this.selectedRows[0].codsocio;
                this.nome = this.selectedRows[0].nome;
                this.email = this.selectedRows[0].email;
                this.batatar = this.selectedRows[0].datainicio;
                this.ativo = this.selectedRows[0].ativo == "True" ? true : false;
                this.flag = false;
                document.getElementById("ExcluirEvento").classList.add("disabled");
                document.getElementById("EditarEventoModal").textContent = "Cancelar";
                await this.getallparticipacaoes();
                M.updateTextFields();
                api.loadingOff();
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
        async getallparticipacaoes()
        {
            api.loadingOn();
            let data = {
                "codsocio": this.codsocio,
            };
            await api.get("getallParticipacoes",data).then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstParticipacao = r.data.participacao;
                    if(this.lstParticipacao.length == 0)
                    {
                        api.loadingOff();
                    }
                    else
                    {
                        let x = 1;
                        const updatedList = this.lstParticipacao;
                        updatedList.forEach(i => {
                            i.idpart = x;
                            x++;
                        });
                        this.lstParticipacao = updatedList;
                    }
                }
            });
        },
        async getallhparticipacaoes()
        {
            api.loadingOn();
            let data = {
                "codsocio": this.codsocio,
            };
            await api.get("getallHParticipacoes",data).then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstPartHist = r.data.hparticipacao;
                    if(this.lstPartHist.length == 0)
                    {
                        api.loadingOff();
                    }
                    else
                    {
                        let x = 1;
                        const updatedList = this.lstPartHist;
                        updatedList.forEach(i => {
                            i.idpart = x;
                            x++;
                        });
                        this.lstPartHist = updatedList;
                    }
                }
                api.loadingOff();
            });
        },
        async DeleteEvento(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um sócio para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um sócio para excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("SOCIOS","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
                if(!ret)
                {
                    return;
                }

                api.loadingOff();
                this.flagex = false;
                document.getElementById("SalvarEventoModal").classList.add("disabled");
                document.getElementById("CadastrarEvento").classList.add("disabled");
                document.getElementById("EditarEvento").textContent = "Cancelar";
                document.getElementById("ExcluirEvento").textContent = "Confirma?";
                M.updateTextFields();
            }
            else
            {
                api.loadingOn();
                let data = {
                    codSocio: this.selectedRows[0].codsocio
                }
                api.delete("deleteSocios", data).then(r=>{
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
                        toast("Usuário Excluido com Sucesso !!!");
                        this.getAllSocios();
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
            this.codsocio = "";
            this.nome = "";
            this.email = "";
            this.batatar = "";
            this.ativo = true;
            this.selectedRows = [];
            this.lstParticipacao = [];

            document.getElementById("txt_CodSocios").value = "";
            document.getElementById("txt_Nome").value = "";
            document.getElementById("txt_Email").value = "";
            document.getElementById("txt_DataInicio").value = "";
            document.getElementById("hdn_DataInicio").value = "";
/*             document.getElementById("txt_Perfil").value = "";
            M.FormSelect.init(document.querySelectorAll('select')); */
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
            });
        },
        async getallPerfilAcesso()
        {
            await api.get("getallperfilacesso").then(r=>{
                if(r.status == 401)
                {
                    //api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstPerfil = r.data.perfil;
                }
                else
                {
                    //api.loadingOff();
                    toast.error(r.data.message);
                }
            });
        },
        resize()
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
        },
        Datas(valor,variavel,tipo=1)
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
                    toast.error("Data inválida! Por favor, insira uma data válida no formato DD/MM/AAAA.");
/*                     this[variavel] = "";
                    document.getElementById("txt_DataInicio").value = ""; */
                    M.updateTextFields();
                }
            }
            
        },
        DatasPartIni(valor,part,tipo=1)
        {
            if (tipo === 1) 
            { // Aplicar máscara
                part.datainicio = api.aplicarMascaraData(valor);
            } 
            else if (tipo === 2) { // Consistir data
                if(valor) 
                {
                    const result = api.validarData(valor);
                    if (!result) {
                    toast.error("Data inválida! Por favor, insira uma data válida no formato DD/MM/AAAA.");
                    part.datainicio = ""; // Reseta o valor no dado reativo
                    }
                    M.updateTextFields();
                }
            }
            
        },
        DatasPartFina(valor,part,tipo=1)
        {
            if (tipo === 1) 
            { // Aplicar máscara
                part.datafim = api.aplicarMascaraData(valor);
            } 
            else if (tipo === 2) { // Consistir data
                if(valor) 
                {
                    const result = api.validarData(valor);
                    if (!result) {
                    toast.error("Data inválida! Por favor, insira uma data válida no formato DD/MM/AAAA.");
                    part.datafim = ""; // Reseta o valor no dado reativo
                    }
                    M.updateTextFields();
                }
            }
            
        },
        UpperCase(valor,variavel)
        {
           this[variavel] = valor.toUpperCase();
        },
        toUpperCase(input) 
        {
            return input ? input.toUpperCase() : '';
        },
        handleUpperCase(field, part) 
        {
            part[field] = this.toUpperCase(part[field]);
        },
        handleMoeda(field, part)
        {
            part[field] = api.Moeda(part[field]);
        },
        handleInsertData()
        {
            document.getElementById("txt_DataInicio").value = document.getElementById("hdn_DataInicio").value;
            this.batatar = document.getElementById("hdn_DataInicio").value;
        },
        PickerOpen(obj)
        {
            var elems = document.getElementById(obj);
            var instance = M.Datepicker.getInstance(elems);
            instance.open();
        },
        addNewPart()
        {
            const maxId = this.lstParticipacao.length > 0 ? Math.max(...this.lstParticipacao.map(part => part.idpart)) : 0;
            let _codsocio;
            if(this.flag)
            {
                _codsocio = 0;
            }
            else
            {
                _codsocio = this.codsocio;
            }

            let data = {
                "deleted":false,
                "idpart":maxId + 1,
                "codpart": 0,
                "codsocio": _codsocio,
                "grupo": "",
                "porcentagem": "0",
                "nucleo": "",
                "datainicio":"",
                "datafim":"",
                "codusuariocad": this.USUARIO.codusuarios
            }
            
            this.lstParticipacao.push(data);

        },
        DeletePart(part)
        {
            var partaux = [];
            var x = 1;
            if(!this.flag)
            {
                const partaux = this.lstParticipacao.find(a => a === part);

                if (partaux.codpart !== 0) 
                {
                    if(partaux.deleted)
                        partaux.deleted = false;
                    else
                        partaux.deleted = true;
                } 
                else 
                {
                    let x = 1;
                    const updatedList = this.lstParticipacao.filter(a => a !== part);
                    updatedList.forEach(i => {
                        i.idpart = x;
                        x++;
                    });
                    this.lstParticipacao = updatedList;
                }
            }
            else//salvar
            {
                partaux = this.lstParticipacao.filter(a => a !== part);
                partaux.forEach(i => {
                    i.idpart = x;
                    x++
                });
                this.lstParticipacao = partaux;
            }

        },
        async gethistorico()
        {
            await this.getallhparticipacaoes();
            var instance = M.Modal.getInstance(document.getElementById("modalHist"));
            instance.open();
        }
    },
    mounted()
    {
        
        M.AutoInit()
        
        let optmodal = {
            dismissible:false,
			onCloseEnd:function()
			{
                document.getElementById("EditarEventoModal").style.display = "";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                document.getElementById("EditarEventoModal").style.display = "";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                this.nome = "";
                this.login = "";
                this.senha = "";
                this.aprovador = "0";
                this.ativo = "0";
                this.selectedEstados = [];
                this.selectedRows = [];
                this.selectedPerfils = [];
                this.selectedUsuariosRM = [];
                document.getElementById("txt_Nome").value = "";
                document.getElementById("txt_Email").value = "";
                M.FormSelect.init(document.querySelectorAll('select'));
                M.updateTextFields();
			},
			onOpenEnd:function()
			{
                var elems = document.querySelectorAll('.fixed-action-btn');
                M.FloatingActionButton.init(elems, {
                direction: 'left'
                });
                
                M.FormSelect.init(document.querySelectorAll('select'));
                M.updateTextFields();
			}
        }

        var mdl = document.getElementById('FormCadastro');
        M.Modal.init(mdl, optmodal);

        let opt = {endingTop:'15%'};
        mdl = document.getElementById('modalHist');
        M.Modal.init(mdl,opt);

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
                //this.batatar = document.getElementById("hdn_DataInicio").value;
                //document.getElementById("txt_DataInicio").value = document.getElementById("hdn_DataInicio").value;
                //document.getElementById("hdn_DataInicio").value = "";
				M.updateTextFields();
			}
        }
        var dtEl = document.querySelectorAll('.datepicker');
        M.Datepicker.init(dtEl, dataopt);
        //##############datepicker

        var elems = document.querySelectorAll('.fixed-action-btn');
        M.FloatingActionButton.init(elems, {direction: 'left'});

        setTimeout(() => {
            const gif = document.getElementById('bkgMenuLateral');
            gif.src = staticImage;
        }, 2500);

    },
    created(){
        this.getAllSocios();
        //this.getallPerfilAcesso();
    },
  }
  </script>
  <style scoped>

    .deletedrow
    {
        border: 2px solid red;
    }

    #modalbotoes
    {
        margin-top: 20px;
/*         margin-bottom: 20px; */
        display: flex;
        flex-direction: row-reverse;
    }
    #ththead
    {
        height:60px;
        border-bottom: solid;
        border-width: medium;
        border-bottom-color: initial;
    }
    #conpart 
    {
        max-width: 100%;
       
        display: grid;
    }
    #tblpart 
    {
        width: 100%;

    }
    .clickable 
    {
        cursor: pointer;
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
        font-weight: bold;
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
    .fixed-action-btn 
    {
        position: unset;
    }
    .fixed-action-btn ul 
    {

        position: relative;
        bottom: 20px;
    }
    .fixed-action-btn.direction-left ul, .fixed-action-btn.direction-right ul 
    {
        text-align: right;
        right: 0px;
        top: 76%;
        transform: translateY(25%);
        height: 100%;
        left: auto;
        width: 500px;
    }
    .porcent
    {
        width: 55px;
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
        #trth
        {
            height: auto;
        }
        #ththead
        {
            height:auto;
        }
        #tbody
        {
            margin-left: 95px;
        }
        .thth
        {
            height: 71px;
        }
        table.responsive-table tbody 
        {
            display: block;
            width: auto;
            position: absolute;
            overflow-x: auto;
            white-space: nowrap;
        }
        .porcent
        {
            width: 100%;
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
        #ththead
        {
            height: 398px;
        }
        .thth
        {
            height: 71px;
        }
    }
    @media only screen and (max-width: 601px) 
    {
        .thth
        {
            height: 65px;
        }
        #tbody[data-v-01228925] 
        {
            margin-left: 75px;
        }
    }
  </style>