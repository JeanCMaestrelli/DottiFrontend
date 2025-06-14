<template>
    <MenuLateral/>
    <div class="container">
      <div id="conteudo" class="z-depth-1" style="border-radius: 8px;">
        <br><br>
        <h5>BEM VINDO(A) {{ user.usuario.nome }}</h5>
        <br>
        <div class="divider" style="height: 10px;width: 95%;margin: auto;"></div>
        <br><br>
        <div id="tableContainer" style="min-height: 490px;padding-top: 10px;background: #a9a9a924;">
          <div style="font-weight: bold;margin-bottom: 10px;margin-top: 10px;">NOTÍCIAS DO DIA</div>
          <div id="tabDados">
              <div class="row center" >
                <div class="col s12 m4 l4" v-for="noticia in noticias" :key="noticia.title">
                  <div class="card z-depth-4" >
                    <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator" v-if="noticia.image_url" :src="noticia.image_url" alt="Imagem da notícia">
                    </div>
                    <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">{{ noticia.title }}<i class="material-icons right">more_vert</i></span>
                    <p><a :href="noticia.url" target="_blank">Leia mais</a></p>
                    </div>
                    <div class="card-reveal">
                      <span class="card-title grey-text text-darken-4">{{ noticia.title }}<i class="material-icons right">close</i></span>
                      <p>{{ noticia.description }}</p>
                      Fonte:{{ noticia.source }}
                    </div>
                  </div>
                </div>
              </div>
          </div>

        </div>
      </div>
    </div>
</template>
  
  <script>
  //import staticImage from '@/assets/balancastop.png';
  import MenuLateral from '@/components/MenuLateral.vue';
  import M from 'materialize-css'
  import { api } from  "../service/apiservice.js";
  export default {
    name: 'InicioView',
    data(){
        return{
            user: JSON.parse(sessionStorage.getItem("batata")),
            noticias: []
        }
    },
    components: {
      MenuLateral,
    },
    methods:
    {
      async getNews() 
      {
       /*  try 
        {
          api.loadingOn();
          const response = await fetch('https://api.thenewsapi.com/v1/news/top?api_token=2L5L7g2lGvIAIosdSdrMpoopqS9dQKtIsAmu1s5W&language=pt&categories=business,politics,general&locale=br');
          const data = await response.json();
          this.noticias = data.data;
        } catch (error) {
          console.error(error);
        } */
        api.loadingOff();
      }
    },
    mounted()
    {
      M.AutoInit();
      this.getNews();
      resize();
/*       setTimeout(() => {
            const gif = document.getElementById('bkgMenuLateral');
            gif.src = staticImage;
        }, 2000); */ 
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
    #tabDados{
      margin-top: 30px;
    }
    #conteudo
    {
      /* overflow-y: scroll; */
      height: 400px;
    }
    .card {
      max-height: 350px;
    }
    .card .card-title {
    font-size: 16px;
    font-weight: 300;
    }
  </style>
  