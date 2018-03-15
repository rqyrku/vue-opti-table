<template>
  <div>
    <vue-optim-table :selectable="false" :header-fields="table.fields" :items="table.items">
      
    </vue-optim-table>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueOptimTable from '../src/index';
  import data from './data';
  Vue.use(VueOptimTable);
  export default {
    name: 'test',
    data,
  };
</script>

<style lang="css">

</style>