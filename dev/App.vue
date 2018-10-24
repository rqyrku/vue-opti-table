<template>
  <div class="container mt-2">
    <vue-opti-table selectable v-model="tableModel" @pageSizeChanged="$_pageSizeChanged($event)" @changedPage="$_pageChanged($event)"
                    :header-fields="table.fields" name="demo-table"
                    :items="table.items">

    </vue-opti-table>
  </div>
</template>

<script>
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueOptiTable from '../src/index';
import data from './data';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(VueOptiTable);

export default {
  name: 'test',
  data,
  methods: {
    $_pageSizeChanged(evt) {
      console.log(evt);
    },
    $_pageChanged(evt) {
      console.log(evt);
    },
  },
};
</script>

<style lang="css">

</style>
