import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
// import VueRouter from 'vue-router'

import usuarios_store from './../modules/usuarios_store'
// Vue.use(VueRouter)
Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    areas:['LOGISTICA','PRODUCCION','RECURSOS HUMANOS','MANT. MECANICO','MANT. ELECTRICO','EQUIPO MOVIL','CONTROL CALIDAD','SIG','SISTEMAS','GERENCIA','ENVASE Y DESPACHO','INGENIERIA','MATERIAS PRIMAS','SEGURIDAD','PLANIFICACION','OTROS'],
    usuario:{
      usuario_id:"",
      usuario_nombre:"maycoll",
      usuario_pw:"123456",
      usuario_detalle_nombre:"",
      usuario_area:'',
      usuario_cargo:'',
      api_token:""
    },
    estado_sesion:true,
    dialogo_loader:false,
    alerta_snack:{
      estado:null,
      color:"",
      texto:""
    },
    guia_actual:null,
    editar:false,
    host:'https://guiasprueba.herokuapp.com/',
    // host: 'http://localhost:8000/'
  },
  mutations: {
    cambiar_editar(state,bool){
      state.editar = bool
    },
    valores_guia_actual(state,valor){
      state.guia_actual = valor
    },
    cambiar_dialogo_loader(state){
      state.dialogo_loader = !state.dialogo_loader
    },
    cambiar_alerta(state,attr){
      state.alerta_snack.estado = attr.estado
      state.alerta_snack.color = attr.color
      state.alerta_snack.texto = attr.texto
    }
    ,
    cambiar_datos_usuario(state,valor){
      state.usuario = valor
    },
    cambiar_estado_sesion(state,valor){
      state.estado_sesion = valor
    }
    
      // if(state.usuario.usuario_nombre == "admin" && state.usuario.usuario_pw == "admin"){
      //   state.estado_sesion=true
      //   router.replace({name:'guias'})
      //   state.dialogo_loader = !state.dialogo_loader
      // }else{
      //   state.dialogo_loader = !state.dialogo_loader
      //   state.estado_sesion=false
      // }
  },
  actions: {
    
  },
  modules: {
    usuarios_store
  }
})
