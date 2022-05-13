<template>
    <v-row class="mx-0">
        <v-col cols="12">
            <v-alert color="teal lighten-2"> Modulo de inicio </v-alert>
            <v-card elevation="1">
                <v-form>
                    <v-autocomplete dense  :items="items"></v-autocomplete>
                    <v-text-field filled dense outlined  label="orden de compra"></v-text-field>
                </v-form>
            </v-card>
        </v-col>
        <v-col></v-col>
    </v-row>
</template>

<script>
export default {
 data: ()=>({
     items:["apio","comino","reparacion","otros"]
 }),
}
</script>

<style>

</style>