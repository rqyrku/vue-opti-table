<template>
  <div class="container mt-2">
    <vue-optim-table :header-fields="table.fields" :items="table.items">
      
    </vue-optim-table>
  </div>
</template>

<script>
  import Vue from 'vue';
  import BootstrapVue from 'bootstrap-vue';
  import VueOptimTable from '../src/index';
  import data from './data';
  Vue.use(BootstrapVue);
  Vue.use(VueOptimTable);
  export default {
    name: 'test',
    data,
  };
</script>

<style lang="css">

</style>