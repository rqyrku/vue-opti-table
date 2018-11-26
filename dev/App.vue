<template>
  <div class="container mt-2">


    <vue-opti-table selectable 
                    name="demo-table"
                    v-model="tableModel"
                    @on-sort="$_paginationChanged($event)"
                    @on-search="$_paginationChanged($event)"
                    @on-rowCount="$_paginationChanged($event)"
                    @on-pagination="$_paginationChanged($event)"
                    :serverSideMode="serverSideMode"
                    :loading="loading"
                    :pageCount="pageCount"
                    :page="currentPage"
                    :header-fields="table.fields"
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
import loader from './loader';

Vue.use(BootstrapVue);
Vue.use(VueOptiTable);


export default {
  name: 'test',
  data,
  methods: {
    $_paginationChanged(evt) {
      this.$_loadData(evt);
    },
    $_loadData({ page, count, sortField, sortType, search, searchableFields }) {
      if (this.serverSideMode) {
        this.loading = true;
        loader(page, count, sortField, sortType, search, searchableFields).then((r) => {
          this.loading = false;
          this.table.items = r.data;
          this.pageCount = Math.ceil(r.pageInfo.totalItemsCount / count);
        }).catch(() => {
          this.loading = false;
        });
      }
    },
  },
  watch: {
    count(val) {
      this.pageCount = val;
    },

  },
  created() {
    this.$_loadData({ page: 0, count: 10 });
  },

};
</script>

<style lang="css">

</style>
