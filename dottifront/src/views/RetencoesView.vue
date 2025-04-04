<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CADASTRAR RETENÇÕES</h5>
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
                            <th>Núcleo</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Tipo</th>
                            <th>Ativo</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="ret in lstRetencao" :key="ret.codretencao">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="ret.codretencao" v-model="selectedRows" :value="ret"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{ret.codretencao}}</td>
                                <td>{{ret.nucleo}}</td>
                                <td>{{ret.data}}</td>
                                <td>{{ret.valor}}</td>
                                <td>{{ret.tipo}}</td>
                                <td v-if="ret.ativo">
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
                            <input disabled id="txt_Retencao" v-model="codretencao" name="txt_Retencao" type="text">
                            <label for="txt_Retencao">Código</label>
                        </div>
                        <div class="input-field col l2 m3 s6 offset-m5 offset-l5" >
                                <label class="chkCenter" >
                                    <input v-model="ativo" id="chk_ativo" name="chk_ativo" type="checkbox" checked/>
                                    <span>Ativo</span>
                                </label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col l4 m4 s12">
                            <select v-model="codnucleo" id="txt_Nucleo" name="txt_Nucleo" >
                                <option value="" disabled selected>Selecione</option>
                                <option v-for="option in lstNucleos" :key="option.codnucleo" :value=option.codnucleo>
                                    {{ option.nucleo }}
                                </option>
                            </select>
                            <label>Núcleo</label>
                        </div>
                        <div class="input-field col l4 m4 s12">
                            <input @keyup="Moeda(this.valor,'valor')" v-model="valor" id="txt_Valor" name="txt_Valor" type="text">
                            <label for="txt_Valor">Valor</label>
                        </div>
                        <div class="input-field col l4 m4 s12" >
                            <i class="material-icons prefix clickable" @click="PickerOpen('hdn_Data')">insert_invitation</i>
                            <input type="text" v-model="data"  id="txt_Data" 
                            @keyup="Datas(this.data,'data',1)"  @blur="Datas(this.data,'data',2)" maxlength="10" placeholder="DD/MM/AAAA">
                            <label for="txt_Data">Data</label>
                            
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="input-field col l4 m4 s12">
                            <select v-model="codtipo" id="txt_Tipo" name="txt_Tipo" >
                                <option value="" disabled selected>Selecione</option>
                                <option v-for="option in lstTipos" :key="option.codtipo" :value=option.codtipo>
                                    {{ option.tipo }}
                                </option>
                            </select>
                            <label>Tipo</label>
                        </div>
                        <div class="input-field col l8 m8 s12">
                            <input @keyup="UpperCase(this.descricao,'descricao')" v-model="descricao" id="txt_Descricao" name="txt_Descricao" type="text" >
                            <label for="txt_Descricao">Descrição</label>
                        </div>
                    </div>
                    <br>
                </div>
                <br>
                <!-- campos cadastro -->
                <div class="divider"></div>
                <div id="modalbotoes">
                    <button type="submit" style="margin-left: 15px;margin-right: 15px;" id="SalvarEventoModal" @click="SalvarEvento($event)"  class="waves-effect waves-light btn right btnsEventos ">Salvar</button>
                    <button type="button" style="margin-left: 15px;" id="EditarEventoModal" @click="UpdateEvento($event)" class="waves-effect waves-light btn right btnsEventos ">Editar</button>
                </div>
                <input v-model="hdndata" @change="handleInsertData()" hidden type="text" class="datepicker" id="hdn_Data">
            </form>
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
    name: 'RetencoesView',
    components: {
      MenuLateral
    },
    data () {
        return {      
            codretencao:"",     
            codnucleo:"",
            valor:"0,00",
            data:"",
            codtipo:"",
            descricao:"",
            hdndata:"",
            ativo:true,
            selectedRows:[],
            lstRetencao:[],
            lstNucleos:[],
            lstTipos:[],
            flag:true,
            flagex:true,
            titulomodal:"",
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },  
    computed:{
        Rows() {
            var rows = 0;
            return this.lstRetencao.find(() => {
                rows += 1;
                if(this.lstRetencao.length == rows)
                {
                     setTimeout(  () => {
                        M.FormSelect.init(document.querySelectorAll('select'));
                        api.loadingOff();
                        this.resize();
                        window.addEventListener('resize', this.resize);
                    }, "1000");
                }
            })
        }
    },
    methods:
    {
        async Cadastrar(e)
        {
            if(this.flag)
            {
                this.titulomodal = "INCLUIR RETENÇÃO";
            }
            this.flagex = false;
            
            e.preventDefault();
            var ret = await api.verificarAcesso("RETENCOES","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
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
            /* codnucleo:"",
            valor:"",
            data:"",
            codtipo:"", */
            this.data = document.getElementById("txt_Data").value;
            if(this.codnucleo === "")
            {
                toast.error("Selecione o Núcleo !!!");
                return 0;
            }
            else if(this.valor === "0,00")
            {
                toast.error("Informe o Valor !!!");
                return 0;
            }
            else if(this.data === "")
            {
                toast.error("Informe a Data !!!");
                return 0;
            }
            else if(this.codtipo === "")
            {
                toast.error("Selecione o Tipo !!!");
                return 0;
            }
            
            api.loadingOn();

            if(!this.flag)
            {
                let data = 
                {
                    CODRETENCAO:this.codretencao,
                    CODNUCLEO:this.codnucleo,
                    VALOR:this.valor,
                    DATA:this.data,
                    CODTIPO:this.codtipo,
                    DESCRICAO:this.descricao,
                    ATIVO:this.ativo,
                    DTALTERACAO:api.dataAtualcomHoras(),
                    CODUSUARIOALT:this.USUARIO.codusuarios,
                }

                this.flag = true;

                //#########################
                await api.post("updateRetencoes", data).then(r=>{
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
                    this.getAllRetencoes();
                    toast("Retenção Atualizada com Sucesso !!!");
                }})
                e.preventDefault();
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                api.loadingOff();
            }
            else
            {
                let data = 
                {
                    CODRETENCAO:this.codretencao,
                    CODNUCLEO:this.codnucleo,
                    VALOR:this.valor,
                    DATA:this.data,
                    CODTIPO:this.codtipo,
                    DESCRICAO:this.descricao,
                    ATIVO:this.ativo,
                    DTCRIACAO:api.dataAtualcomHoras(),
                    CODUSUARIOCAD:this.USUARIO.codusuarios,
                    PARTICIPACAO:this.lstNucleos
                }

               
                var ret = await api.verificarAcesso("RETENCOES","SALVAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }

                //#########################
                await api.post("cadRetencoes", data).then(r=>{
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
                    this.getAllRetencoes();
                    toast("Retenção Cadastrada com Sucesso !!!");
                }})
                this.flagex = true;
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
                toast("Marque somente uma retenção para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                e.preventDefault();
                toast("Marque uma retenção para editar !!!")
                return;
            }

            if(this.flag)
            {
                var ret = await api.verificarAcesso("RETENCOES","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }
                this.titulomodal = "EDITAR RETENÇÃO";
                M.Modal.getInstance(document.getElementById("FormCadastro")).open();
                document.getElementById("txt_Retencao").value = this.selectedRows[0].codretencao;
                document.getElementById("txt_Nucleo").value = this.selectedRows[0].codnucleo;
                document.getElementById("txt_Valor").value = this.selectedRows[0].valor;
                document.getElementById("txt_Data").value = this.selectedRows[0].data;
                document.getElementById("txt_Tipo").value = this.selectedRows[0].codtipo;
                document.getElementById("txt_Descricao").value = this.selectedRows[0].descricao;

                this.codretencao = this.selectedRows[0].codretencao;
                this.codnucleo = this.selectedRows[0].codnucleo;
                this.valor = this.selectedRows[0].valor;
                this.data = this.selectedRows[0].data;
                this.codtipo = this.selectedRows[0].codtipo;
                this.descricao = this.selectedRows[0].descricao;
                this.ativo = this.selectedRows[0].ativo;
                this.flag = false;
                document.getElementById("ExcluirEvento").classList.add("disabled");
                document.getElementById("EditarEventoModal").textContent = "Cancelar";
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
        async getallNucleos()
        {
            await api.get("getallNucleos").then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstNucleos = r.data.nucleos;
                }
            });
        },
        async getallTipos()
        {
            await api.get("getallTipos").then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstTipos = r.data.tipos;
                }
            });
        },
        async DeleteEvento(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente uma retenção para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque uma retenção para excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("RETENCOES","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
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
                    codretencao: this.selectedRows[0].codretencao
                }
                api.delete("deleteRetencoes", data).then(r=>{
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
                        toast("Retenção Excluida com Sucesso !!!");
                        this.getAllRetencoes();
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
            this.codretencao = "";
            this.codnucleo = "";
            this.valor = "0,00";
            this.data = "";
            this.hdndata = "";
            this.codtipo = "";
            this.descricao = "";
            this.ativo = true;
            this.selectedRows = [];

            document.getElementById("txt_Retencao").value = "";
            document.getElementById("txt_Nucleo").value = "";
            document.getElementById("txt_Valor").value = "";
            document.getElementById("txt_Data").value = "";
            document.getElementById("hdn_Data").value = "";
            document.getElementById("txt_Tipo").value = "";
            document.getElementById("txt_Descricao").value = "";
            M.FormSelect.init(document.querySelectorAll('select'));
            M.updateTextFields();
        },
        async getAllRetencoes()
        {
            api.loadingOn();
            await api.get("getallRetencoes").then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstRetencao = r.data.retencoes;
                    if(this.lstRetencao.length == 0)
                    {
                        api.loadingOff();
                    }
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
            if(valor) 
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
                        this[variavel] = "";
                        document.getElementById("txt_Data").value = ""; 
                        M.updateTextFields();
                    }
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
        Moeda(valor,variavel)
        {
            this[variavel] = api.Moeda(valor);
        },
        handleInsertData()
        {
            document.getElementById("txt_Data").value = document.getElementById("hdn_Data").value;
            this.data = document.getElementById("hdn_Data").value;
        },
        PickerOpen(obj)
        {
            var elems = document.getElementById(obj);
            var instance = M.Datepicker.getInstance(elems);
            instance.open();
        },
        addNewPart()
        {
            const maxId = this.lstNucleos.length > 0 ? Math.max(...this.lstNucleos.map(part => part.idpart)) : 0;
            let _codretencao;
            if(this.flag)
            {
                _codretencao = 0;
            }
            else
            {
                _codretencao = this.codretencao;
            }

            let data = {
                "deleted":false,
                "idpart":maxId + 1,
                "codpart": 0,
                "codretencao": _codretencao,
                "grupo": "",
                "porcentagem": "0",
                "nucleo": "",
                "datainicio":"",
                "datafim":"",
                "codusuariocad": this.USUARIO.codusuarios
            }
            
            this.lstNucleos.push(data);

        },
        DeletePart(part)
        {
            var partaux = [];
            var x = 1;
            if(!this.flag)
            {
                const partaux = this.lstNucleos.find(a => a === part);

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
                    const updatedList = this.lstNucleos.filter(a => a !== part);
                    updatedList.forEach(i => {
                        i.idpart = x;
                        x++;
                    });
                    this.lstNucleos = updatedList;
                }
            }
            else//salvar
            {
                partaux = this.lstNucleos.filter(a => a !== part);
                partaux.forEach(i => {
                    i.idpart = x;
                    x++
                });
                this.lstNucleos = partaux;
            }

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
                //this.batatar = document.getElementById("hdn_Data").value;
                //document.getElementById("txt_Data").value = document.getElementById("hdn_Data").value;
                //document.getElementById("hdn_Data").value = "";
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

        M.FormSelect.init(document.querySelectorAll('select'));
    },
    created(){
        this.getAllRetencoes();
        this.getallNucleos();
        this.getallTipos();
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