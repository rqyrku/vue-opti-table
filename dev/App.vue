<template>
  <div class="container mt-2">

    <vue-opti-table selectable v-model="tableModel" @paginationChange="$_paginationChanged($event)"
                    @sort="$_paginationChanged($event)" @search="$_paginationChanged($event)" @rowCount="$_paginationChanged($event)" @pagination="$_paginationChanged($event)" :serverSidePagination="serverSidePagination" :loading="loading"
                    :pageCount="pageCount"
                    :page="currentPage"
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
      if (this.serverSidePagination) {
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
