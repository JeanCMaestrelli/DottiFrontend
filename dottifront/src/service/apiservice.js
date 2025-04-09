import axios from "axios"
import { useToast } from "vue-toastification";
const toast = useToast();
//DEV
const Urlb = "https://localhost:44374/DottiWebAPI/";
//PRD
//const Urlb = "https://devsfwi.somee.com/DottiWebAPI/";

const axiosInstance = axios.create({
    baseURL: Urlb
})

export const api = {
    getnoeader(endpoint, params){
        return axiosInstance.get(endpoint,{params})
          .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return error.response;
            });
    },
     get(endpoint, params){
        return  axiosInstance.get(endpoint,{
            headers: {
              'Authorization': `${this.getToken()}`,
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
              'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },params
          })
          .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return error.response;
            });
    },
    postnoheader(endpoint, body){
        return axiosInstance({
            method: 'post',
            url: endpoint,
            data: body
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error.response;
        });    
    },
    post(endpoint, body){
        return axiosInstance({
            method: 'post',
            url: endpoint,
            data: body,
            headers: {
                'Authorization': `${this.getToken()}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
              }
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error.response;
        });    
    },
    delete(endpoint, params){
        return axiosInstance({
            method: 'delete',
            url: endpoint,
            params: params,
            headers: {
                'Authorization': `${this.getToken()}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
              }
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        }); 
    },
    patch(endpoint, body){
        return axiosInstance({
            method: 'patch',
            url: endpoint,
            data: body,
            headers: {
                'Authorization': `${this.getToken()}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
              }
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        });
    },
    fetch(endpoint,body)
    {
        fetch(Urlb+endpoint,{ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
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
        .catch(error => console.error('Erro ao baixar o arquivo:', error))
    },
    async verificarAcesso(tela,tipoacesso,msg)
    {
        api.loadingOn();
        var USUARIO = JSON.parse(sessionStorage.getItem("batata")).usuario;
        var ret = await api.get("GetPermissoesTelas",{codperfil:USUARIO.codperfil,tela:tela, tipoacesso:tipoacesso}).then(r=>{
            if(r.status == 401)
            {
                toast.error("O seu tempo logado expirou, faça o login novamente !!!\n\n     Redirecionando para tela de login.");
                setTimeout(  () => {
                    sessionStorage.clear();
                    window.location.href="/";
                }, "5000");
                return false;
            }
            else if(r.status == 200)
            {
                
                if(r.data.permissao == false)
                {
                    api.loadingOff();
                    toast.error(msg)
                    return false;
                }
            }
            else
            {
                api.loadingOff();
                toast.error(r.data.message)
                this.$router.push({ path: '/Inicio'});
            }
            return true;
        });
        if(!ret)
        {
            return false;
        }
        return true;
    },
    getUrl()
    {
        return Urlb;
    },
    ConvertMoeda(valor)
    {
        //let res = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
        let res = valor.toLocaleString('pt-br', {minimumFractionDigits: 2});
        return res;
    },
    dataAtual()
    {
        var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
        //return diaF+"/"+mesF+"/"+anoF;
        return anoF +"/"+ mesF  +"/"+ diaF;
    },
    dataAtualcomHoras() {
        var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), // +1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear(),
        hora = data.getHours().toString(),
        horaF = (hora.length == 1) ? '0' + hora : hora,
        minuto = data.getMinutes().toString(),
        minutoF = (minuto.length == 1) ? '0' + minuto : minuto;


        return `${anoF}/${mesF}/${diaF} ${horaF}:${minutoF}`;
    },
    dataAtualBr()
    {
        var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
        return diaF+"/"+mesF+"/"+anoF;
    },
    corrigirData(data)
    {
        var datas = data.split(" ")[0];
        var parts = datas.split("/");
        var dia = parts[1];
        var mes = parts[0];
        var ano = parts[2];
        return dia+"/"+mes+"/"+ano;
    },
    aplicarMascaraData(input) 
    {
        var valor = input;
        var valorFormatado = valor.replace(/\D/g, "")
                                  .replace(/(\d{2})(\d)/, "$1/$2")
                                  .replace(/(\d{2})(\d)/, "$1/$2")
                                  .replace(/(\d{4})(\d)/, "$1");
        return valorFormatado;
    },
    validarData(input) 
    {
        var valor = input;
        var partes = valor.split("/");
        var dia = parseInt(partes[0], 10);
        var mes = parseInt(partes[1], 10);
        var ano = parseInt(partes[2], 10);
        var dataValida = true;

        if (partes.length !== 3 || isNaN(dia) || isNaN(mes) || isNaN(ano)) 
        {
            dataValida = false;
        } 
        else 
        {
            var data = new Date(ano, mes - 1, dia);
            if (data.getFullYear() !== ano || data.getMonth() + 1 !== mes || data.getDate() !== dia) {
                dataValida = false;
            }
            else if(ano < 1000)
            {
                dataValida = false;
            }
        }

        if (!dataValida) {
            return dataValida;
        }
        return dataValida;
    },
    getToken()
    {
        const config = JSON.parse(sessionStorage.getItem("batata")).token;
        return config;
    },
    loadingOn() 
    {
        var e = document.getElementsByClassName('preloader-background');
        e[0].style.backgroundColor = "#0000004d";
        e[0].style.display = 'flex';
        var e2 = document.getElementsByClassName('preloader-wrapper');
        e2[0].style.display = 'flex';
    },
    loadingOff() 
    {
        setTimeout(  () => {
        }, "2000");
        var element = document.querySelector('.preloader-background'); 
        this.fadeOut(element);
    },
    fadeOut(el) 
    {
        var opacity = 1;
        var interval = setInterval(function() {
            if (opacity > 0) {
                opacity -= 0.05;
                el.style.opacity = opacity;
            } else {
                clearInterval(interval); 
                el.style.display = 'none';
                el.style.opacity = 1;
            }
        }, 10);
    },
    Moeda(valor)
    {
        if(valor == null)
        {
            valor = "";
        }
        var v = valor.replace(/\D/g,"");
        v = (v/100).toFixed(2) + "";
        v = v.replace(".", ",");
        v = v.replace(/(\d)(\d{3})(\d{3})(\d{3}),/g, "$1.$2.$3.$4,");
        v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
        v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
        return v;
    },
    Horas(valor)
    {
        if(valor == null)
        {
            valor = "";
        }

        var _valor = valor;
        var valorFormatado = _valor.replace(/\D/g, "")
                                  .replace(/(\d{2})(\d)/, "$1:$2")
                                  .replace(/(\d{2})(\d)/, "$1:$2")
                                  .substring(0, 5); // Limita a string a 5 caracteres
        return valorFormatado;
        
    },
    validarHora(input) 
    {
        var valor = input;
        var partes = valor.split(":");
        var horas = parseInt(partes[0], 10);
        var minutos = parseInt(partes[1], 10);
        var horaValida = true;

        if(valor === "" || valor == null){
            horaValida = true
        }
        else if (partes.length !== 2 || isNaN(horas) || isNaN(minutos)) {
            horaValida = false;
        } else if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
            horaValida = false;
        }

        if (!horaValida) {
            
            horaValida = false;
        }

        return horaValida;
    },
    MoedaBanco(valor)
    {
        if(valor == null)
        {
            valor = "";
        }
        var aux = String(valor).split(".");
        var v = valor.replace(/\D/g,"");
        if(aux.length == 2 && aux[1].length == 1)
        {
            v += "0";
        }
        else if(aux.length == 1)
        {
            v += "00";
        }
        v = (v/100).toFixed(2) + "";
        v = v.replace(".", ",");
        v = v.replace(/(\d)(\d{3})(\d{3})(\d{3}),/g, "$1.$2.$3.$4,");
        v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
        v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
        return v;
    },
    validateEmail(email) 
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            return true;
        } else {
            return false;
        }
    },
    converterParaNumero(valorString) {
        // Substituir pontos (.) e vírgulas (,)
        const valorFormatado = valorString.replace(/\./g, "").replace(",", ".");
        
        // Converter para número
        return parseFloat(valorFormatado);
      }
      
}
