<template>
  <div class="container mt-2">

    <vue-opti-table name="demo-table"
                    selectable
                    v-model="tableModel"
                    @on-sort="$_paginationChanged($event)"
                    @on-search="$_searchExec($event)"
                    @on-row-per-page-change="$_paginationChanged($event)"
                    @on-pagination="$_paginationChanged($event)"
                    :defaultRows="pageSize"
                    :sort="{ key: 'email', order: 'asc' }"
                    :serverSidePagination="serverSidePagination"
                    :loading="loading"
                    :pages="pageCount"
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
    $_searchExec(evt) {
      console.log(evt)
      this.$_loadData(evt);
      console.log(this.pageCount)
    },
    $_loadData({ page, limit, sortField, sortType, search, searchableFields }) {
      if (this.serverSidePagination) {
        this.loading = true;
        loader(page, limit, sortField, sortType, search, searchableFields).then((r) => {
          this.loading = false;
          this.table.items = r.data;
          this.pageSize = limit
          this.pageCount = Math.ceil(r.pageInfo.totalItemsCount / limit);
        }).catch(() => {
          this.loading = false;
        });
      }
    },
  },
  created() {
    this.$_loadData({ page: 0, limit: 10 });
  },

};
</script>
