<template>
    
    <div class="card-panel center-align z-depth-2">
        <form v-on:submit.prevent="onSubmit">
            <div class="center lg-top">
                <img class="circle" style="width: 60px;height: 60px;" src="@/assets/AvatarMenuLateral.jpg">
                <div>Login</div>
            </div>
            <div class="input-field txtUser">
                <i class="material-icons prefix">account_circle</i>
                <input v-model="USUARIO" id="user" name="user" type="text" class="validate" value="" required 
                oninvalid="this.setCustomValidity('Informe o Usuário !!!')"
                onchange="try{setCustomValidity('')}catch(e){}">
                <label for="user">Usuário</label>
            </div>
            <div class="input-field txtPed">
                <i class="material-icons prefix">lock</i>
                <input autocomplete="on" v-model="SENHA" id="senha" name="senha" type="password" class="validate" value="" required 
                oninvalid="this.setCustomValidity('Informe a Senha !!!')"
                onchange="try{setCustomValidity('')}catch(e){}">
                <label for="senha">Senha</label>
            </div>
            <div class="row center">
                <button id="btnEntrar" name="btnEntrar" @click="logar()" class="btn waves-effect waves-light btn-large" >Entrar<i class="material-icons right">lock_open</i></button>
            </div>
        </form>
    </div>
</template>

<script>
import { api } from  "../service/apiservice.js"
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
    name: 'LoginView',
    components: {
    },
    data() {
        return {
            USUARIO: "",
            SENHA: ""
        }
    },
    methods:
    {
        logar()
        {
            if(this.USUARIO != "" && this.SENHA != "") {
                let data = {
                    "USUARIO": this.USUARIO,
                    "SENHA": this.SENHA
                }
                api.loadingOn();
                api.postnoheader("login", data).then(r=>{
                    if(r === undefined)
                    {
                        toast.error("O sistema não conseguiu enviar a requisição para o servidor, servidor com problemas ou offline.");
                    }
                    else if(r.status != 200){
                        toast.error(r.data.message);
                    }else{
                        sessionStorage.setItem("batata",JSON.stringify(r.data));
                        this.$router.push({ path: '/Inicio/'});
                    }
                    api.loadingOff();
                })
                
            } 
        }
    },
    mounted()
    {
/*         setTimeout(() => {
            api.loadingOff();
        }, "2000"); */
    }
}
</script>
<style scoped>
@media only screen and (min-width: 993px) 
  {
    #tituloNav
    {
      padding-left: 0px;
    }
  }
.center-align {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.card-panel
{
    width: 320px;
    margin: auto;
    margin-top: 50px;
}
.lg-top
{
    font-size: 20px;
    font-weight: bold;
}
#btnEntrar
{
    background-color: #85714d !important;
    font-weight: bold;
    margin-top: 20px;
    width: 96%;
    margin-left: 10px
}
</style>