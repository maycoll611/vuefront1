<template>
    <v-row class="mx-0">
        <v-col cols="12">
            <v-card elevation="1">
                <v-card-title>Buscar guia por Nro. Documento / correlativo</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-col cols=12 md=3 sm=4>
                            <v-row class="ma-0">
                                <v-col cols=12>
                                    <v-text-field dense rounded outlined v-model="form_buscar.documento" counter="10" label="Nro Documento"></v-text-field>
                                </v-col>
                                <v-col cols=12>
                                    <v-text-field disabled append="007-" dense rounded outlined v-model="form_buscar.correlativo" counter="10" label="Correlativo"></v-text-field>
                                </v-col>
                                <v-col cols=12>
                                    <v-btn rounded pill small color="primary" @click="buscar_guia">Ejecutar</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col></v-col>
    </v-row>
</template>

<script>
import axios from 'axios'
import {mapState, mapMutations} from 'vuex'

export default {
 data: ()=>({
     form_buscar:{
         documento:'',
         correlativo:'19845',
         area:'',
     },
     items:["apio","comino","reparacion","otros"]

 }),
 computed:{
     ...mapState(['usuario','dialogo_loader','alerta_snack','guia_actual','editar','host'])
 },
 methods:{
    ...mapMutations(['cambiar_dialogo_loader','cambiar_alerta','valores_guia_actual','cambiar_editar']),
    buscar_guia(){
          this.cambiar_dialogo_loader()
            axios.post(this.host+'api/get_guias_id',{id:this.form_buscar.documento}).then(response =>{
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
     }
 }
}
</script>

<style>

</style>