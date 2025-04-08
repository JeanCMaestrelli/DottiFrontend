<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CONTAS DE PARA</h5>
            <div class="divider" style="height: 10px;"></div>
            <br>
            <div class="painel z-depth-1">
                <br>
                <form v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col l2 m2 s12">
                                <input disabled v-model="CODDEPARA" id="txt_Codigo" name="txt_Codigo" type="text">
                                <label for="txt_Codigo">Código</label>
                            </div> 
                            <div class="input-field col l4 m4 s12 ">
                                <input @blur="clearCPJ" type="text" id="txt_CPJ" name="txt_CPJ" class="autocomplete">
                                <label>Código CPJ</label>
                            </div>
                            <div class="input-field col l4 m4 s8 ">
                                    <input @blur="clearCODGERENCIAL"  type="text" id="txt_Gerencial" name="txt_Gerencial" class="autocomplete">
                                    <label>Código Gerencial</label>
                            </div>
                            <div class="input-field col l2 m2 s4" > 
                                <label class="" >
                                    <input  v-model="ATIVO" id="chk_ativo" name="chk_ativo" type="checkbox" checked/>
                                    <span >Ativo</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row ">
                        <button id="SalvarEvento" @click="salvarDepara($event)" class="waves-effect waves-light btn right btnsEventos">Cadastrar</button>
                        <button id="EditarEvento" @click="editarDepara($event)" class="waves-effect waves-light btn right btnsEventos">Editar</button>
                        <button id="ExcluirEvento" @click="excluirDepara($event)" class="waves-effect waves-light btn right btnsEventos">Excluir</button>
                        <div id="btncontas" class="input-field col l3 m3 s12" >
                            <button id="SincronizarContas" @click="SincronizarContas($event)" class="waves-effect waves-light btn center ">Sinc. Contas</button>
                        </div>
                    </div>
                </form>
                <br>
            </div>
            <br>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table  class="centered striped" id="tabDados">
                        <thead>
                        <tr>
                            <th>Marcar</th>
                            <th>Código</th>
                            <th>Conta CPJ</th>
                            <th>Conta Gerencial</th>
                            <th>Ativo</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr :items="Rows" v-for="item in lstCdepara" :key="item.codcpj">
                                <td>
                                    <label>
                                    <input type="checkbox" :id="item.coddepara" v-model="selectedRows" :value="item"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{ item.coddepara }}</td>
                                <td>{{ item.cpj }} - {{ item.desccpj }}</td>
                                <td>{{ item.cgerencial }} - {{ item.descger }}</td>
                                <td v-if="item.ativo === true">
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
  </template>
  
  <script>
  import staticImage from '@/assets/balancastop.png';
  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";
  const toast = useToast();

  export default {
    name: 'ContasDeparaView',
    components: {
      MenuLateral
    },
    data () {
        return {
            lstGuardarCdepara:[],
            lstCdepara:[],
            lstCpj:[],
            lstGerencial:[],
            CODDEPARA: "",
            CODCPJ:"",
            CODGERENCIAL: "",
            CODUSUARIOCAD : "",
            ATIVO:true,
            DTCRIACAO : "",
            CODUSUARIOALT : "",
            DTALTERACAO : "",
            selectedRows:[],
            flag:true,
            flagex:true,
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    computed:{
        Rows() {
            var rows = 0;
            return this.lstCdepara.find(() => {
                rows += 1;
                if(this.lstCdepara.length == rows)
                {
                     setTimeout(  () => {
                        this.getAllCPJ();
                        this.getAllGerencial();
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
        async salvarDepara(e)
        {

            if(this.CODCPJ === "")
            {
                toast.error("Selecione o Código CPJ");
                return false;
            }
            if(this.CODGERENCIAL === "")
            {
                toast.error("Selecione o Código Gerencial");
                return false;
            }

            let data = {
                CODDEPARA: this.CODDEPARA,
                CODCPJ: this.CODCPJ,
                CODGERENCIAL: this.CODGERENCIAL,
                ATIVO: this.ATIVO,
                CODUSUARIOCAD:this.USUARIO.codusuarios,
                CODUSUARIOALT:this.USUARIO.codusuarios,
                DTCRIACAO:api.dataAtual(),
                DTALTERACAO:api.dataAtual()
            }

            if(this.flag)
            {
                var ret1 = await api.verificarAcesso("CDEPARA","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
                if(!ret1)
                {
                    return;
                }
                await api.post("cadCdepara", data).then(r=>{
                if(r.status == 401)
                {
                    api.loadingOff();
                    toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                    this.$router.push({ path: '/'});
                }
                else if(r.status != 200)
                {
                    toast.error(r.data.message);
                }
                else
                {
                    this.LimparCampos();
                    this.getAllDepara();
                    toast("De Para Cadastrado com Sucesso !!!");
                }})
                e.preventDefault();
                api.loadingOff();
                return true;
            }
            else
            {
                api.loadingOn();
                await api.post("updateCdepara", data).then(r=>
                {
                    if(r.status == 401)
                    {
                        api.loadingOff();
                        toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                        this.$router.push({ path: '/'});
                    }
                    else if(r.status != 200)
                    {
                        toast.error(r.data.message);
                    }
                    else
                    {
                        this.LimparCampos();
                        this.getAllDepara();
                        toast("De Para Atualizado com Sucesso !!!");
                    }
                });
                e.preventDefault();
                this.flag = true;
                document.getElementById("EditarEvento").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                this.LimparCampos();
                api.loadingOff();
                return true;
            }

        },
        async editarDepara(e)
        {
            e.preventDefault();
            if(this.flagex == false)//cancelar excluir
            {
                this.flagex = true;
                document.getElementById("SalvarEvento").classList.remove("disabled");
                document.getElementById("ExcluirEvento").textContent = "Excluir";
                document.getElementById("EditarEvento").textContent = "Editar";
                this.LimparCampos();
                return;
            }
            else if(this.selectedRows.length > 1)
            {

                toast("Marque somente um de para à editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um de para à editar !!!")
                return;
            }

            if(this.flag)
            {
                api.loadingOn();
                var ret = await api.verificarAcesso("CDEPARA","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }

                this.CODDEPARA = this.selectedRows[0].coddepara;
                document.getElementById("txt_Codigo").value = this.selectedRows[0].coddepara;

                this.CODGERENCIAL = this.selectedRows[0].codgerencial;
                document.getElementById("txt_Gerencial").value = this.getTextFromId('lstGerencial',this.selectedRows[0].codgerencial);

                this.CODCPJ = this.selectedRows[0].codcpj;
                document.getElementById("txt_CPJ").value = this.getTextFromId('lstCpj',this.selectedRows[0].codcpj);

                document.getElementById("chk_ativo").value = this.selectedRows[0].ativo;
                this.ATIVO = this.selectedRows[0].ativo;

                this.flag = false;

                document.getElementById("ExcluirEvento").classList.add("disabled");
                document.getElementById("EditarEvento").textContent = "Cancelar";
                M.updateTextFields();
                api.loadingOff();
            }
            else//cancelar ediçao
            {
                this.flag = true;
                document.getElementById("EditarEvento").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                this.LimparCampos();
            }
        },
        getTextFromId(lista,idselect) 
        {
            if (!this[lista] || !idselect) {
                toast.error("A lista ou o ID estão ausentes");
                return null;
            }
            const foundKey = Object.keys(this[lista]).find(key => this[lista][key] === idselect);
            return foundKey || null;
        },
        async excluirDepara(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um De Para à para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um De Para à excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("CDEPARA","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
                if(!ret)
                {
                    return;
                }

                api.loadingOff();
                this.flagex = false;
                document.getElementById("SalvarEvento").classList.add("disabled");
                document.getElementById("EditarEvento").textContent = "Cancelar";
                document.getElementById("ExcluirEvento").textContent = "Confirma?";
                M.updateTextFields();
            }
            else
            {
                api.loadingOn();
                let data = {
                    coddepara: this.selectedRows[0].coddepara
                }
                api.delete("deleteCdepara", data).then(r=>{
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
                        toast("De Para Excluido com Sucesso !!!");
                        this.getAllDepara();
                        this.LimparCampos();
                    }})
                this.flagex = true;
                document.getElementById("ExcluirEvento").textContent = "Excluir";
                document.getElementById("SalvarEvento").classList.remove("disabled");
                document.getElementById("EditarEvento").textContent = "Editar";
            }
        },
        async SincronizarContas(e)
        {
            e.preventDefault();
            
            api.loadingOn();

            api.get("sincronizarContas").then(r=>
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
                    toast("Contas Sincronizadas Com Sucesso !!!");
                    this.getAllCPJ();
                    this.getAllGerencial();
                    this.getAllDepara();
                }
            });
        },
        LimparCampos()
        {
            this.CODDEPARA = "";
            this.CODCPJ = "";
            this.CODGERENCIAL = "";
            this.ATIVO = true;

            document.getElementById("txt_Codigo").value = "";
            document.getElementById("txt_Gerencial").value = "";
            document.getElementById("txt_CPJ").value = "";

            this.selectedRows  = [];

            this.lstCdepara = this.lstGuardarCdepara;

            M.updateTextFields();
        },
        async getAllDepara()
        {
            api.loadingOn();
            await api.get("getallCdepara").then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.lstCdepara = r.data.cdepara;
                if(this.lstCdepara.length == 0)
                {
                    api.loadingOff();
                }
                this.lstGuardarCdepara = this.lstCdepara;
                M.updateTextFields();
            }
            else
            {
                api.loadingOff();
            }
            });
            
        },
        async getAllCPJ()
        {
            await api.get("getallCpj").then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                if(r.data.cpj.length == 0)
                {
                    api.loadingOff();
                }

                // Criar um mapeamento separado para texto e IDs
                const dataForAutocomplete = {};

                r.data.cpj.forEach(item => {

                    dataForAutocomplete[`${item.cpj} - ${item.descricao}`] = null; // Sem imagens

                    this.lstCpj[`${item.cpj} - ${item.descricao}`] = item.codcpj; // Mapear ID em lstCpj

                });

                const elems = document.getElementById("txt_CPJ");
                M.Autocomplete.init(elems, {
                    data: dataForAutocomplete,
                    onAutocomplete: this.handleAutocompleteSelectCPJ
                });


                M.updateTextFields();
            }
            else
            {
                api.loadingOff();
            }
            });
            
        },
        handleAutocompleteSelectCPJ(selectedValue) 
        {
            this.CODCPJ = this.lstCpj[selectedValue];
            this.lstCdepara = this.lstCdepara.filter(item => item.codcpj === this.CODCPJ);
        },
        clearCPJ()
        {
            const inputElement = document.getElementById("txt_CPJ");
            if (inputElement.value.trim() === "" && this.CODCPJ) 
            {
                this.CODCPJ = "";
                if(this.CODGERENCIAL)
                {
                    this.lstCdepara = this.lstGuardarCdepara.filter(item => item.codgerencial === this.CODGERENCIAL);
                }
                else
                {
                    this.lstCdepara = this.lstGuardarCdepara;
                }
                
            } 
        },
        async getAllGerencial()
        {
            await api.get("getallCGerencial").then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                if(r.data.gerencial.length == 0)
                {
                    api.loadingOff();
                }

                // Criar um mapeamento separado para texto e IDs
                const dataForAutocomplete = {};

                r.data.gerencial.forEach(item => {

                    dataForAutocomplete[`${item.cgerencial} - ${item.descricao}`] = null;

                    this.lstGerencial[`${item.cgerencial} - ${item.descricao}`] = item.codgerencial;
                });

                const elems = document.getElementById("txt_Gerencial");
                M.Autocomplete.init(elems, {
                    data: dataForAutocomplete,
                    onAutocomplete: this.handleAutocompleteSelectGerencial
                });


                M.updateTextFields();
            }
            else
            {
                api.loadingOff();
            }
            });
            
        },
        handleAutocompleteSelectGerencial(selectedValue) 
        {
            this.CODGERENCIAL = this.lstGerencial[selectedValue];
            this.lstCdepara = this.lstCdepara.filter(item => item.codgerencial === this.CODGERENCIAL);
        },
        clearCODGERENCIAL()
        {
            const inputElement = document.getElementById("txt_Gerencial");
            if (inputElement.value.trim() === "" && this.CODGERENCIAL) 
            {
                this.CODGERENCIAL = ""; 
                if(this.CODCPJ)
                {
                    this.lstCdepara = this.lstGuardarCdepara.filter(item => item.codcpj === this.CODCPJ);
                }
                else
                {
                    this.lstCdepara = this.lstGuardarCdepara;
                }
            } 
        },
        Moeda(valor,variavel)
        {
            this[variavel] = api.Moeda(valor);
        },
        Datas(valor,variavel,cpj=1)
        {
            if(cpj == 1)//aplicar mascara
            {
                this[variavel] = api.aplicarMascaraData(valor);
            }
            else if(cpj == 2)//consistir data
            {
                if(valor) 
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
        PickerOpen(obj)
        {
            var elems = document.getElementById(obj);
            var instance = M.Datepicker.getInstance(elems);
            instance.open();
        },
        handleInsertData()
        {
            document.getElementById("txt_Data").value = document.getElementById("hdn_Data").value;
            this.DATA = document.getElementById("hdn_Data").value;
        },
        UpperCase(valor,variavel)
        {
           this[variavel] = valor.toUpperCase();
        }
    },
    mounted()
    {
        M.updateTextFields();
        resize();
        setTimeout(() => {
            const gif = document.getElementById('bkgMenuLateral');
            gif.src = staticImage;
        }, 2500);
    },
    created()
    {
        this.getAllDepara();
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
  #chk_ativo {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
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
    #btncontas
    {
        margin-top: 0px;
        margin-bottom: 0px;
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
