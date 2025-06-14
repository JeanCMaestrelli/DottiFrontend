<template>
    <MenuLateral/>
    <div class="container">
        <div id="conteudo" class="Eventos z-depth-1">
            <h5 style="font-weight: bold;">CADASTRO DE IMPOSTOS</h5>
            <div class="divider" style="height: 10px;"></div>
            <br>
            <div class="painel z-depth-1">
                <br>
                <form v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col s12">
                            <!-- <div class="input-field col l1 m1 s12">
                                <input disabled v-model="CODIMPOSTO" id="txt_Codigo" name="txt_Codigo" type="text">
                                <label for="txt_Codigo">Código</label>
                            </div> -->
                            <div class="input-field col l4 m4 s12">
                                <input @keyup="UpperCase(DESCRICAO,'DESCRICAO')" v-model="DESCRICAO" id="txt_Descricao" name="txt_Descricao" type="text" class="validate" required 
                                oninvalid="this.setCustomValidity('Informe a descrição !!!')"
                                onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_Descricao">Descrição</label>
                            </div>
                            <div class="input-field col l2 m2 s12">
                                <input @keyup="Moeda(this.ALIQUOTA,'ALIQUOTA')" v-model="ALIQUOTA" id="txt_Aliquota" name="txt_Aliquota" type="text" required 
                                oninvalid="this.setCustomValidity('Informe a alíquota !!!')"
                                onchange="try{setCustomValidity('')}catch(e){}">
                                <label for="txt_Aliquota">Alíquota</label>
                            </div>
                            <div class="input-field col l3 m3 s12">
                                    <select v-model="CGERENCIAL" id="txt_Conta" name="txt_Conta" class="validate">
                                        <option value="" selected>Selecione</option>
                                        <option v-for="option in lstContas" :key="option.codgerencial" :value=option.cgerencial>
                                            {{ option.cgerencial }} - {{ option.descricao }}
                                        </option>
                                    </select>
                                    <label>Conta Gerencial</label>
                            </div>
                            <div class="input-field col l1 m1 s12">
                                <label class="chkCenter" style="margin-left: 15px;">
                                    <input v-model="RECEITA" id="chk_ativo" name="chk_ativo" type="checkbox"/>
                                    <span>Receita</span>
                                </label>
                            </div>
                            <div class="input-field col l1 m1 s12">
                                <label class="chkCenter" style="margin-left: 15px;">
                                    <input v-model="REPASSE" id="chk_ativo" name="chk_ativo" type="checkbox"/>
                                    <span>Repasse</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row ">
                        <button id="SalvarEvento" @click="salvarImpostos($event)" class="waves-effect waves-light btn right btnsEventos">Cadastrar</button>
                        <button id="EditarEvento" @click="editarImpostos($event)" class="waves-effect waves-light btn right btnsEventos">Editar</button>
                        <button id="ExcluirEvento" @click="excluirImpostos($event)" class="waves-effect waves-light btn right btnsEventos">Excluir</button>
                    </div>
                </form>
                <br>
            </div>
            <br>
            <div class="row">
                <div class="col s12 z-depth-1" id="tableContainer" style="min-height: 400px;">
                    <table :items="Rows" class="centered striped" id="tabDados">
                        <thead style="height:60px;border-bottom: solid;border-width: thin;">
                        <tr>
                            <th>Marcar</th>
                            <th>Descrição</th>
                            <th>Alíquota</th>
                            <th>Conta Gerencial</th>
                            <th>Receitas Fin.</th>
                            <th>Repasse</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tipo in lstImpostos" :key="tipo.codimposto">
                                <td>
                                    <label>
                                    <input type="checkbox" v-model="selectedRows" :value="tipo"/>
                                    <span></span>
                                    </label>
                                </td>
                                <td>{{ tipo.descricao }}</td>
                                <td>{{ tipo.aliquota }}</td>
                                <td>{{ tipo.cgerencial }} - {{ tipo.descger }}</td>
                                <td v-if="tipo.receitas === true">
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
                                <td v-if="tipo.repasse === true">
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
  //import staticImage from '@/assets/balancastop.png';
  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js"
  import { useToast } from "vue-toastification";
  const toast = useToast();

  export default {
    name: 'ImpostosView',
    components: {
      MenuLateral
    },
    data () {
        return {
            CODIMPOSTO:"",
            DESCRICAO:"",
            ALIQUOTA:"",
            CODUSUARIOCAD:"",
            CODUSUARIOALT:"",
            DTCRIACAO:"",
            DTALTERACAO:"",
            CGERENCIAL:"",
            RECEITA:false,
            REPASSE:false,
            lstImpostos:[],
            lstContas:[],
            selectedRows:[],
            flag:true,
            flagex:true,
            USUARIO: JSON.parse(sessionStorage.getItem("batata")).usuario
        }
    },
    watch: {
        ALIQUOTA(newValue) {
            this.Moeda(newValue, 'ALIQUOTA');
        }
    },
    computed:{
        Rows() {
            var rows = 0;
            return this.lstImpostos.find(() => {
                rows += 1;
                if(this.lstImpostos.length == rows)
                {
                     setTimeout(  () => {
                        api.loadingOff();
                        M.FormSelect.init(document.querySelectorAll('select'));
                        resize();
                    }, "1000");
                }
            })
        }
    },
    methods:
    {
        async salvarImpostos(e)
        {
            if(this.DESCRICAO === "" )
            {
                toast.error("Informe a Descrição.");
                return false;
            }
            else if(this.ALIQUOTA === "0,00")
            {
                toast.error("Informe a Aliquota.");
                return false;
            }

            if(this.CGERENCIAL === "")
            {
                this.CGERENCIAL = null;
            }

            let data = {
                CODIMPOSTO: this.CODIMPOSTO,
                DESCRICAO: this.DESCRICAO,
                ALIQUOTA: this.ALIQUOTA,
                CGERENCIAL: this.CGERENCIAL,
                RECEITAS:this.RECEITA,
                REPASSE:this.REPASSE,
                CODUSUARIOCAD:this.USUARIO.codusuarios,
                CODUSUARIOALT:this.USUARIO.codusuarios,
                DTCRIACAO:api.dataAtual(),
                DTALTERACAO:api.dataAtual()
            }

            if(this.flag)
            {
                var ret1 = await api.verificarAcesso("IMPOSTOS","SALVAR","O seu perfil não possui permissão para salvar dados !!!");
                if(!ret1)
                {
                    return;
                }
                await api.post("cadImpostos", data).then(r=>{
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
                    this.getAllImpostos();
                    toast("Imposto Cadastrado com Sucesso !!!");
                }})
                e.preventDefault();
                api.loadingOff();
                return true;
            }
            else
            {
                api.loadingOn();
                await api.post("updateImpostos", data).then(r=>
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
                        this.getAllImpostos();
                        toast("Imposto Atualizado com Sucesso !!!");
                    }
                })
                e.preventDefault();
                this.flag = true;
                document.getElementById("EditarEvento").textContent = "Editar";
                document.getElementById("ExcluirEvento").classList.remove("disabled");
                this.LimparCampos();
                api.loadingOff();
                return true;
            }

        },
        async editarImpostos(e)
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

                toast("Marque somente um imposto para editar !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um imposto para editar !!!")
                return;
            }

            if(this.flag)
            {
                api.loadingOn();
                var ret = await api.verificarAcesso("IMPOSTOS","EDITAR","O seu perfil não possui permissão para editar dados !!!");
                if(!ret)
                {
                    return;
                }

                //document.getElementById("txt_Codigo").value = this.selectedRows[0].codimposto;
                document.getElementById("txt_Descricao").value = this.selectedRows[0].descricao;
                document.getElementById("txt_Aliquota").value = this.selectedRows[0].aliquota;
                document.getElementById("txt_Conta").value = this.selectedRows[0].cgerencial;

                this.CODIMPOSTO = this.selectedRows[0].codimposto;
                this.DESCRICAO = this.selectedRows[0].descricao;
                this.ALIQUOTA = this.selectedRows[0].aliquota;
                this.CGERENCIAL = this.selectedRows[0].cgerencial;
                this.RECEITA = this.selectedRows[0].receitas;
                this.REPASSE = this.selectedRows[0].repasse;
                this.flag = false;

                document.getElementById("ExcluirEvento").classList.add("disabled");
                document.getElementById("EditarEvento").textContent = "Cancelar";
                M.updateTextFields();
                M.FormSelect.init(document.querySelectorAll('select'));
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
        async excluirImpostos(e)
        {
            e.preventDefault();
            if(this.selectedRows.length > 1)
            {
                toast("Marque somente um imposto para excluir !!!")
                return;
            }
            else if(this.selectedRows.length == 0)
            {
                toast("Marque um imposto para excluir !!!")
                return;
            }

            
            if(this.flagex)
            {
                var ret = await api.verificarAcesso("IMPOSTOS","EXCLUIR","O seu perfil não possui permissão para excluir dados !!!");
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
                    codImpostos: this.selectedRows[0].codimposto
                }
                api.delete("deleteImpostos", data).then(r=>{
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
                        toast("Imposto Excluido com Sucesso !!!");
                        this.getAllImpostos();
                    }})
                this.flagex = true;
                document.getElementById("ExcluirEvento").textContent = "Excluir";
                document.getElementById("SalvarEvento").classList.remove("disabled");
                document.getElementById("EditarEvento").textContent = "Editar";
            }
        },
        LimparCampos()
        {
            this.CODIMPOSTO = "";
            this.DESCRICAO = "";
            this.ALIQUOTA = "";
            this.CGERENCIAL = "";
            this.RECEITA = false;
            this.REPASSE = false;
            //document.getElementById("txt_Codigo").value = "";
            document.getElementById("txt_Descricao").value = "";
            document.getElementById("txt_Conta").value = "";
            //document.getElementById("txt_Aliquota").value = "";
            this.selectedRows  = [];
            M.updateTextFields();
            M.FormSelect.init(document.querySelectorAll('select'));
        },
        async getAllImpostos()
        {
            api.loadingOn();
            await api.get("getallimpostos").then(r=>{
            if(r.status == 401)
            {
                api.loadingOff();
                toast.error("O seu tempo logado expirou, faça o login novamente !!!");
                this.$router.push({ path: '/'});
                return;
            }
            else if(r.status == 200){
                this.lstImpostos = r.data.tipos;
                if(this.lstImpostos.length == 0)
                {
                    api.loadingOff();
                }

                this.lstImpostos.forEach( i => {
                    i.aliquota = i.aliquota.replace(".",",");
                });
            }
            else
            {
                api.loadingOff();
            }
            });
        },
        async getAllgerencial()
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
                this.lstContas = r.data.gerencial;
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
        UpperCase(valor,variavel)
        {
           this[variavel] = valor.toUpperCase();
        }
    },
    mounted()
    {
        M.updateTextFields();
        resize();
/*         setTimeout(() => {
            const gif = document.getElementById('bkgMenuLateral');
            gif.src = staticImage;
        }, 2500); */
    },
    created()
    {
        this.getAllImpostos();
        this.getAllgerencial();
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
        background-color: #85714d !important;
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