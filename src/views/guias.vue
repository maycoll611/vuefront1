<template>
    <v-row class="mx-0 pt-4">
        <v-col cols="6"><v-btn rounded color="cyan accent-4" @click="nueva_guia()" class="text-caption">Nueva guia</v-btn><v-spacer></v-spacer></v-col>
        <v-col cols="6">
            <v-text-field
                v-model="buscar_guia"
                append-icon="mdi-magnify"
                label="Buscar"
                dense
                outlined
                rounded
                hide-details
            ></v-text-field>
        </v-col>
        <v-col cols="12">    
            <v-data-table
            class="elevation-2"
            style="font-size: 7px"
            item-class="pa-5"
            dense
            :headers="headers"
            :items="prueba_guias"
            :search="buscar_guia"
            mobile-breakpoint
            @click:row="ver_guia"
            >
            <template v-slot:[`item.venta_correlativo`]="{item}">
                <v-row :class="item.venta_anulado?'text-decoration-line-through':''">
                    <span class="una_linea">{{item.venta_correlativo.length >30?item.venta_correlativo.substr(0,30)+"...":item.venta_correlativo}}</span>
                </v-row>
            </template>
            <template v-slot:[`item.empresa_razon_social`]="{item}">
                <v-row>
                    <span class="una_linea">{{item.empresa_razon_social.length >30?item.empresa_razon_social.substr(0,30)+"...":item.empresa_razon_social}}</span>
                </v-row>
            </template>
            <template v-slot:[`item.usuario_detalle_nombre`]="{item}">
                <span class="una_linea">{{item.usuario_detalle_nombre.length >25?item.usuario_detalle_nombre.substr(0,25)+"...":item.usuario_detalle_nombre}}</span>
            </template>
            <template v-slot:[`item.venta_fecha_registro`]="{item}">
                <span class="una_linea">{{item.venta_fecha_registro.length >10?item.venta_fecha_registro.substr(0,10)+"...":item.venta_fecha_registro}}</span>
            </template>
            <template v-slot:[`item.actions`]="{item}">
                <v-menu
                class="pa-1"
                origin="center center"
                transition="scale-transition"
                 
                >
                <template v-slot:activator="{ on, attrs }" class="pa-0">
                    
                    <v-btn icon  v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list class="pa-1" shaped>
                    <v-list-item class="pa-1 py-0">
                        <v-btn class="rounded-pill" width="auto" text color="teal" @click="ver_guia(item)" dense> <v-icon class="pr-1">mdi-eye-plus </v-icon> Detalles</v-btn>
                    </v-list-item>
                    <v-list-item class="pa-1 py-0">
                        <v-btn class="rounded-pill" width="auto" text color="warning"  @click="tomar_guia(item)" dense> <v-icon class="pr-1">mdi-content-copy </v-icon> Referencia</v-btn>
                    </v-list-item>
                    <v-list-item class="pa-1 py-0">
                        <v-btn class="rounded-pill" width="auto" text color="red"  @click="anular_guia(item)" dense> <v-icon class="pr-1">mdi-trash-can</v-icon> Anular</v-btn>
                    </v-list-item>
                    
                </v-list>
                </v-menu>
            </template>
            </v-data-table>
<!-- dialogo anular -->
            <v-dialog v-model="dialog_anular_guia" max-width="500">
                <v-card >
                    <v-card-title color="teal">
                        Motivo de la anulacion
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form_anular_guia" v-model="validate_guia_anular">
                            <v-row class="mx-0 pt-3">
                                <v-col class=" pa-1 text-body-2 py-2" cols="3">
                                    <v-text-field rounded v-model="anulacion.correlativo" :readonly="true" dense outlined label="Motivo de la anulacion"></v-text-field>
                                </v-col>
                                <v-col class=" pa-1 text-body-2 py-2" cols="9">
                                    <v-text-field rounded v-model="anulacion.motivo_descripcion" dense outlined label="Motivo de la anulacion"></v-text-field>
                                </v-col>
                                <v-col class=" pa-1 text-body-2 py-2" cols="12">
                                    <v-row class="ma-0">
                                        <v-spacer></v-spacer>
                                        <v-btn rounded color="red" small @click="guardar_anular_guia">Si, anular</v-btn>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog> 
           
        </v-col>
    </v-row>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import {mapState, mapMutations} from 'vuex'

export default{
    data:()=>({
        ancho:false,
        dialog_anular_guia:false,
        anulacion:{correlativo:'',motivo_descripcion:''},
        parametros:{
            fecha_inicio:moment().format("dddd, DD MMMM YYYY, h:mm:ss a"),
            fecha_fin:null,
        },
        buscar_guia:'',
        headers:[{text:'Op',value:'actions'},
                {text:"Nro.", value:"venta_correlativo"},
                {text:"Razon social",value:"empresa_razon_social"},
                {text:"Ruc",value:"empresa_ruc"},
                {text:"Destino",value:"venta_llegada_departamento"},
                {text:"Retorno",value:"venta_f_retorno"},
                {text:"Usuario",value:"usuario_detalle_nombre"},
                {text:'Emitido',value:'venta_fecha_registro'}
                ],
        data_guias:[
                    // {correlativo:"007-0019597",razon_social:"YURA S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"EFLORES"},
                    // {correlativo:"007-0019596",razon_social:"CAL Y CEMENTO SUR S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"ACALSIN"},
                    // {correlativo:"007-0019595",razon_social:"CAL Y CEMENTO SUR S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"EFLORES"},
                    // {correlativo:"007-0019594",razon_social:"CAL Y CEMENTO SUR S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"ACALSIN"},
                    // {correlativo:"007-0019593",razon_social:"YURA S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"EFLORES"},
                    // {correlativo:"007-0019592",razon_social:"YURA S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"EQUISPE"},
                    // {correlativo:"007-0019591",razon_social:"YURA S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"EQUISPE"},
                    // {correlativo:"007-0019590",razon_social:"CAL Y CEMENTO SUR S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"ACALSIN"},
                    // {correlativo:"007-0019589",razon_social:"RACIONALIZACION EMPRESARIAL S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"EFLORES"},
                    // {correlativo:"007-0019588",razon_social:"CAL Y CEMENTO SUR S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"ACALSIN"},
                    // {correlativo:"007-0019587",razon_social:"YURA S.A.",ruc:"20346787349",destino:"AREQUIPA",materiales:"RETEN, TRAPO INDUSTRIAL",usuario:"EFLORES"},
                    ],
        prueba_guias:[],
        validate_guia_anular:null,
    }),
    mounted(){
        this.get_guias()
    },
    computed:{
        ...mapState(['usuario','dialogo_loader','alerta_snack','guia_actual','editar','host'])
    },
    methods:{
        ...mapMutations(['cambiar_dialogo_loader','cambiar_alerta','valores_guia_actual','cambiar_editar']),
        get_guias(){
            this.cambiar_dialogo_loader()
            console.log(this.usuario)
            axios.post(this.host+'api/get_guias',{api_token:this.usuario.api_token,usuario_id:this.usuario.usuario_id}).then(response =>{
                this.prueba_guias = eval(response.data)
                this.cambiar_dialogo_loader()
            }).catch((error)=>{
                console.log(error)
                this.cambiar_dialogo_loader()
                this.cambiar_alerta({estado:true,color:'red darken-2',texto:'Sin Respuesta del servidor...!'})
            })
        },
        guardar_anular_guia(){
            this.cambiar_dialogo_loader()
            axios.post(this.host+'api/anular_guia',this.anulacion).then(response =>{
                console.log(response)
                this.cambiar_dialogo_loader()
                this.cambiar_alerta({estado:true,color:'teal',texto:'Anulado correctamente...!'})
                this.get_guias()
            }).catch((error)=>{
                console.log(error)
                this.cambiar_dialogo_loader()
                this.cambiar_alerta({estado:true,color:'red darken-2',texto:'Sin Respuesta del servidor...!'})
            })
        },
        anular_guia(item){
            this.anulacion.correlativo = item.venta_correlativo
            this.dialog_anular_guia = true
        },
        ver_guia(item){
            this.cambiar_dialogo_loader()
            axios.post(this.host+'api/get_guias_correlativo',{correlativo:item.venta_correlativo}).then(response =>{
                this.valores_guia_actual(response.data)
                console.log(response.data)
                this.cambiar_dialogo_loader()
                this.cambiar_editar(false)
                // alert("Detalles de "+item.venta_correlativo)
                this.$router.push({name:"guias_form"})
            }).catch((error)=>{
                console.log(error)
                this.cambiar_dialogo_loader()
                this.cambiar_alerta({estado:true,color:'red darken-2',texto:'Ocurrio un error...!'})
            })
        },
        tomar_guia(item){
            this.cambiar_dialogo_loader()
            axios.post(this.host+'api/get_guias_correlativo',{correlativo:item.venta_correlativo}).then(response =>{
                this.valores_guia_actual(response.data)
                console.log(response.data)
                this.cambiar_dialogo_loader()
                this.cambiar_editar(true)
                // alert("Detalles de "+item.venta_correlativo)
                this.$router.push({name:"guias_form"})
            }).catch((error)=>{
                console.log(error)
            })
        },
        nueva_guia(){
            this.valores_guia_actual(null)
            this.cambiar_editar(true)
            this.$router.push({name:"guias_form"})
        },
        computed(){

        }
    }

}
</script>
