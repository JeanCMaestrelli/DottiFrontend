<template>
    <MenuLateral/>
    <div class="container">
      <div id="conteudo" class="z-depth-1" style="border-radius: 8px;">
        <br><br>
        <h5>BEM VINDO {{ user.usuario.nome }}</h5>
        <div id="tableContainer" style="min-height: 400px;"><div id="tabDados"></div></div>
      </div>
    </div>
</template>
  
  <script>
  // @ is an alias to /src
  import MenuLateral from '@/components/MenuLateral.vue'
  import M from 'materialize-css'
  export default {
    name: 'InicioView',
    data(){
        return{
            user: JSON.parse(sessionStorage.getItem("batata"))
        }
    },
    components: {
      MenuLateral
    },
    methods:
    {
      
    },
    mounted()
    {
      M.AutoInit()
      resize()
    }
  }
  function resize()
  {
      var url = window.location.href.replaceAll("/","").split('#')[1];
      if(url !== "")
      {
          var mainHeight = document.getElementById('mainArea').clientHeight;
          mainHeight = mainHeight - 80;
          document.getElementById('conteudo').style.height = mainHeight + 'px';

          if(window.innerWidth <= 992 && window.innerWidth > 600)
          {
            mainHeight = mainHeight - 40;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
          }
          else if(window.innerWidth <= 600)
          {
            mainHeight = mainHeight - 40;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
          }
      }
  }
  window.onresize=function() 
  {
    var url = window.location.href.replaceAll("/","").split('#')[1];
    if(url !== "")
    {
      var mainHeight = document.getElementById('mainArea').clientHeight;
      mainHeight = mainHeight - 80;
      document.getElementById('conteudo').style.height = mainHeight + 'px';

      if(window.innerWidth <= 992 && window.innerWidth > 601)
          {
            mainHeight = mainHeight - 40;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
          }
          else if(window.innerWidth <= 601)
          {
            mainHeight = mainHeight - 40;
            document.getElementById('conteudo').style.height = mainHeight + 'px';
          }
    }
  } 
  </script>

  <style scoped>

    #conteudo
    {
      /* overflow-y: scroll; */
      height: 400px;
    }
  </style>
  