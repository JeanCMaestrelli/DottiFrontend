<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CADASTRAR USUÁRIOS</h5>
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
                            <th>Nome do Usuário</th>
                            <th>Perfil</th>
                            <th>Ativo</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="usuario in lstUsuarios" :key="usuario.codusuarios">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="usuario.codusuarios" v-model="selectedRows" :value="usuario"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{usuario.codusuarios}}</td>
                                <td>{{usuario.nome}}</td>
                                <td>{{usuario.perfil}}</td>
                                <td v-if="usuario.ativo === 'True'">
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
                            <input disabled id="txt_CodUsuarios" v-model="codusuarios" name="txt_CodUsuarios" type="text" class="validate">
                            <label for="txt_CodUsuarios">Código</label>
                        </div>
                        <div class="input-field col l2 m3 s6 offset-m5 offset-l5" >
                                <label class="chkCenter" >
                                    <input v-model="ativo" id="chk_ativo" name="chk_ativo" type="checkbox" />
                                    <span>Ativo</span>
                                </label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <input oninput="this.value = this.value.toUpperCase()" id="txt_Nome" v-model="nome" name="txt_Nome" type="text" class="validate" required 
                            oninvalid="this.setCustomValidity('Informe o nome do usuário!!!')"
                            onchange="try{setCustomValidity('')}catch(e){}">
                            <label for="txt_Nome">Nome do Usuário</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col l6 m6 s12">
                            <input id="txt_Login" v-model="login" name="txt_Login" type="text" class="validate" required 
                            oninvalid="this.setCustomValidity('Informe o Login !!!')"
                            onchange="try{setCustomValidity('')}catch(e){}">
                            <label for="txt_Login">Login</label>
                        </div>
                        <div class="input-field col l6 m6 s12">
                            <input id="txt_Senha" v-model="senha" name="txt_Senha" type="text" current-password="" class="validate" required 
                            oninvalid="this.setCustomValidity('Informe a senha !!!')"
                            onchange="try{setCustomValidity('')}catch(e){}">
                            <label for="txt_Senha">Senha</label>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="input-field col l6 m6 s12" >
                            <select v-model="selectedPerfils" :items="lstPerfils" id="txt_Perfil" name="txt_Perfil" class="validate">
                                <option value="" selected>Perfil do Usuário</option>
                                <option v-for="option in lstPerfil" :key="option.codperfil" :value=option.codperfil>
                                    {{ option.perfil }}
                                </option>
                            </select>
                            <label>Perfil</label>
                        </div>
                    </div>
                    <br>
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
    name: 'UsuariosView',
    components: {
      MenuLateral
    },
    data () {
        return {      
            codusuarios:"",     
            nome:"",
            perfil:"",
            login:"",
            senha:"",
            aprovador:"0",
            ativo:"0",
            selectedRows:[],
            lstUsuarios:[],
            lstPerfil:[],
            selectedPerfils:[],
            flag:true,
            flagex:true,
            titulomodal:"",
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },  
    computed:{
        Rows() {
            var rows = 0;
            return this.lstUsuarios.find(() => {
                rows += 1;
                if(this.lstUsuarios.length == rows)
                {
                     setTimeout(  () => {
                        M.FormSelect.init(document.querySelectorAll('select'));
                        api.loadingOff();
                        resize();
                    }, "1000");
                }
            })
        },
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
        }
    },
    methods:
    {
        async Cadastrar(e)
        {
            if(this.flag)
            {
                this.titulomodal = "INCLUIR USUÁRIOS";
            }
            this.flagex = false;
            
            e.preventDefault();
            var ret = await api.verificarAcesso("USUARIOS","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
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
            if(this.nome === "")
            {
                return 0;
            }
            else if(this.selectedPerfils.length == 0)
            {
                toast.error("Selecionar o perfil do usuário e obrigatório !!!");
                return 0;
            }

            let data = 
            {
                CODUSUARIOS:this.codusuarios,
                CODPERFIL: this.selectedPerfils,
                NOME:this.nome,
                WHATS:"",
                EMAIL:"",
                LOGIN:this.login,
                SENHA:this.senha,
                ATIVO:this.ativo? "1":"0",
                DTCRIACAO:api.dataAtual(),
                DTALTERACAO:api.dataAtual(),
            }
            api.loadingOn();

            if(!this.flag)
            {
                this.flag = true;
                await api.post("updateUsuarios", data).then(r=>{
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
                    this.getAllUsuarios();
                    toast("Usuário Atualizado com Sucesso !!!");
                }})
                e.preventDefault();
                M.Modal.getInstance(document.getElementById("FormCadastro")).close();
                api.loadingOff();
            }
            else
            {
                if(this.login == "")
                {
                    toast.error("Informar o Login é obrigatório !!!");
                    return 0;
                }
                else if(this.senha == "")
                {
                    toast.error("Informar a senha é obrigatório !!!");
                    return 0;
                }
                var ret = await api.verificarAcesso("USUARIOS","SALVAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }
                await api.post("cadUsuarios", data).then(r=>{
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
                    this.getAllUsuarios();
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
                toast("Marque somente um usuário para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                e.preventDefault();
                toast("Marque um usuário para editar !!!")
                return;
            }

            if(this.flag)
            {
                var ret = await api.verificarAcesso("USUARIOS","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }
                this.titulomodal = "EDITAR USUÁRIOS";
                M.Modal.getInstance(document.getElementById("FormCadastro")).open();
                document.getElementById("txt_CodUsuarios").value = this.selectedRows[0].codusuarios;
                document.getElementById("txt_Nome").value = this.selectedRows[0].evento;
                document.getElementById("txt_Login").value = this.selectedRows[0].login;
                document.getElementById("txt_Senha").value = this.selectedRows[0].senha;
                document.getElementById("txt_Perfil").value = this.selectedRows[0].codperfil;
                this.codusuarios = this.selectedRows[0].codusuarios;
                this.nome = this.selectedRows[0].nome;
                this.login = this.selectedRows[0].login;
                this.senha = this.selectedRows[0].senha;
                this.ativo = this.selectedRows[0].ativo == "True" ? true : false;
                this.selectedPerfils = this.selectedRows[0].codperfil;
                this.flag = false;
                document.getElementById("ExcluirEvento").classList.add("disabled");
                document.getElementById("EditarEventoModal").textContent = "Cancelar";
                var Estado = document.querySelectorAll('#txt_Estado');
                M.FormSelect.init(Estado);
                var Perfil = document.querySelectorAll('#txt_Perfil');
                M.FormSelect.init(Perfil);
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
        async DeleteEvento(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um usuário para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um usuário para excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("USUARIOS","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
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
                    codusuarios: this.selectedRows[0].codusuarios
                }
                api.delete("deleteUsuarios", data).then(r=>{
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
                        this.getAllUsuarios();
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
            this.codusuarios = "";
            this.nome = "";
            this.login = "";
            this.senha = "";
            this.ativo = "0";
            this.selectedRows = [];
            this.selectedPerfils = [];

            document.getElementById("txt_CodUsuarios").value = "";
            document.getElementById("txt_Nome").value = "";
            document.getElementById("txt_Login").value = "";
            document.getElementById("txt_Senha").value = "";
            document.getElementById("txt_Perfil").value = "";
            M.FormSelect.init(document.querySelectorAll('select'));
            M.updateTextFields();
        },
        async getAllUsuarios()
        {
            api.loadingOn();
            await api.get("getallUsuarios").then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                    return;
                }
                else if(r.status == 200){
                    this.lstUsuarios = r.data.usuarios;
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
                document.getElementById("txt_Login").value = "";
                document.getElementById("txt_Senha").value = "";
                document.getElementById("txt_Perfil").value = "";
                M.FormSelect.init(document.querySelectorAll('select'));
                M.updateTextFields();
			},
			onOpenEnd:function()
			{
                M.FormSelect.init(document.querySelectorAll('select'));
                M.updateTextFields();
			}
        }
        var mdl = document.getElementById('FormCadastro');
        M.Modal.init(mdl, optmodal);
    },
    created(){
        this.getAllUsuarios();
        this.getallPerfilAcesso();
    },
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
    
    .chkCenter
    {
        margin-left: 20%;
    }
    .geritem
    {
        display: grid;
        grid-template-columns: 95% 5%;
    }
    .excfab 
    {
        color: #85714d !important;
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