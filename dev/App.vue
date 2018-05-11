<template>
  <div class="container mt-2">
    <vue-opti-table selectable v-model="tableModel" :header-fields="table.fields" name="demo-table" :items="table.items">
      
    </vue-opti-table>
  </div>
</template>

<script>
  import Vue from 'vue';
  import BootstrapVue from 'bootstrap-vue';
  import VueOptiTable from '../src/index';
  import data from './data';
  
  Vue.use(BootstrapVue);
  Vue.use(VueOptiTable);
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  export default {
    name: 'test',
    data,
  };
</script>

<style lang="css">

</style>