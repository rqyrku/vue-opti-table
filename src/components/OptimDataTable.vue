<template>
  <div class="datatable-wrapper">
    <!--TOP SLOT-->
    <row2 v-if="$slots['top']">
      <slot name="top"></slot>
    </row2>
    <space v-if="$slots['top']"></space>
    <!--SHOW SEARCH-->
    <row2 v-if="showSearch">
      <!-- <div class="col-md-auto" v-if="enableExport">
        <download-excel
              class   = "btn btn-default pointer-button"
              :data   = "items"
              :fields = "$c_exportTable"
              type    = "csv"
              :name   = "`${exportLabel}.csv`">
              Download CSV
        </download-excel>
      </div> -->
      <slot name="search"></slot>
      <div class="col-xl-4 col-md-5 col-sm-12 ml-md-auto" :class="searchClass">
        <b-input-group>
          <b-form-input v-model="models.search"  placeholder="Search..." @focus.native="$event.target.select()"></b-form-input>
          <b-input-group-button slot="right" v-if="enableColumns">
            <b-dropdown text="Columns" class="columns-dropdown" :no-flip="true" right>
              <b-dropdown-header v-for="(col, i) in headerFields" :key="i" v-if="col.item.key !== 'actions'">
                <b-form-checkbox v-model="col.display" @click.prevent.native="$_selectColumn(col)">{{col.header.content}}</b-form-checkbox>
              </b-dropdown-header>
            </b-dropdown>
          </b-input-group-button>
        </b-input-group>
      </div>
    </row2>
    <space v-if="showSearch"></space>
    <!--SELECT ALL-->
    <div class="selectAll" v-if="$c_itemsCurrentPage.length && $c_areAllItemsSelectedOnCurrentPage">
      <span v-if="$c_areAllItemsSelected">
        <span>All {{ $c_items.length }} {{ selectLabel }} selected.</span>
        <span @click="$_selectAllItemsAction(false)" style="text-decoration: underline; cursor: pointer;">Clear selection</span>
      </span>
      <span v-else>
        <span>All {{ $c_itemsCurrentPage.length }} {{ selectLabel }} in current page selected.</span>
        <span @click="$_selectAllItemsAction(true)" style="text-decoration: underline; cursor: pointer;">Select all {{ $c_items.length }} {{ selectLabel }}</span>
      </span>
    </div>
    <!--TABLE-->
    <div class="table-holder">
      <table :class="[{'table-hover': hover}, 'table table-striped']">
        <!--ALL CHECKBOX & TABLE HEADERS-->
        <thead>
          <tr>
            <th v-if="selectable" style="text-align: center;">
              <b-form-checkbox class="m-2" style="padding: 10px; padding-right: 6px; margin: 0px;" v-model="models.selectAllCheckbox" @click.prevent.native="$_selectAllItemsCurrentPageAction()"></b-form-checkbox>
            </th>
            <th v-for="(col, i) in headerFields" v-if="col.display !== false" :key="i" :style="col.header.style || ''">
              <div class="header">
                <div v-if="col.item.sortable" class="sort p-2" @click="$_fieldClickAction(col)">
                  <div :class="{'arrow-up-active': sortKey === col.item.key && sortOrder === 'asc'}" class="arrow-up"></div>
                  <div style="height: 5px;"></div>
                  <div :class="{'arrow-down-active': sortKey === col.item.key && sortOrder === 'desc'}" class="arrow-down"></div>
                </div>
                <div @click="$_fieldClickAction(col)" class="title pt-2 pb-2" :class="{ 'pl-2': !col.item.sortable, 'pr-2': !col.item.filter }" style="text-align: center;">
                  <span v-html="col.header.content"></span>
                  <i v-if="col.header.info" v-b-tooltip="{hover: true, html: true, title: col.header.info, boundary: 'window'}" class="fa fa-info-circle info-icon"></i>
                </div>
                <!--DROPDOWN FILTERS-->
                <div v-if="col.item.filter" class="cog p-2">
                  <!--<i class="fa fa-cog" @click="openDropdowns['col' + i] = !openDropdowns['col' + i]"></i>-->
                  <div class="dropdown" :class="{'show': openDropdowns['col' + i]}">
                    <div class="dropdown-menu">
                      <div v-if="col.item.filter.type === 'search'">
                        <div class="row m-0">
                          <div class="col-md-12 p-2">
                            <input v-model="filterModels[col.item.key]" type="text" class="form-control search" placeholder="Search..." />
                          </div>
                        </div>
                      </div>
                      <div class="filter" v-else-if="col.item.filter.type === 'number'">
                        <div class="row m-0">
                          <div class="col-md-12 pl-2 pt-2 pr-2">
                            <select v-model="filterModels[col.item.key]" class="form-control">
                              <option value="less">Less</option>
                              <option value="less_equal">Less or Equal</option>
                              <option value="greater">Greater</option>
                              <option value="greater_equal">Greater or Equal</option>
                              <option value="equal">Equal</option>
                            </select>
                          </div>
                        </div>
                        <div class="row m-0">
                          <div class="col-md-12 pl-2 pt-2 pr-2">
                            <input type="number" class="form-control" :placeholder="filterModels[col.item.key] === 'equal' ? 'With...' : 'Than...'" />
                          </div>
                        </div>
                        <div class="row m-2 pr-md-2">
                          <div class="col-md-6 p-0 pb-xs-2">
                            <button class="btn btn-secondary w-100 mr-md-2">Clear</button>
                          </div>
                          <div class="col-md-6 p-0">
                            <button class="btn btn-success w-100 ml-md-2">Apply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!--TABLE FILTERS-->
          <!--<tr v-if="$c_showFilters" class="filter">-->
            <!--<td v-if="selectable" class="col-disable-bg"></td>-->
            <!--<td v-for="(col, i) in headerFields" :key="i" :style="(col.item.filter && col.item.filter.style) || col.item.style || ''" :class="{'col-disable-bg': !col.item.filter, 'col-filter': true}">-->
              <!--<div v-if="col.item.filter" class="col-disable">-->
                <!--<div v-if="col.item.filter.type === 'search'">-->
                  <!--<input v-model="filterModels[col.item.key]" type="text" class="form-control search" placeholder="Search..." />-->
                <!--</div>-->
                <!--<div class="filter" v-else-if="col.item.filter.type === 'number'" style="margin: -1px;">-->
                  <!--&lt;!&ndash;<button class="btn bg-white w-100" style="border: 0px !important;">Filter <i class="fa fa-filter"></i></button>&ndash;&gt;-->
                  <!--<b-dropdown>-->
                    <!--<template slot="button-content">Filter <i class="fa fa-filter"></i></template>-->
                    <!--<div class="row m-0">-->
                      <!--<div class="col-md-12 pl-2 pt-2 pr-2">-->
                        <!--<select v-model="filterModels[col.item.key]" class="form-control">-->
                          <!--<option value="less">Less</option>-->
                          <!--<option value="less_equal">Less or Equal</option>-->
                          <!--<option value="greater">Greater</option>-->
                          <!--<option value="greater_equal">Greater or Equal</option>-->
                          <!--<option value="equal">Equal</option>-->
                        <!--</select>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="row m-0">-->
                      <!--<div class="col-md-12 pl-2 pt-2 pr-2">-->
                        <!--<input type="number" class="form-control" :placeholder="filterModels[col.item.key] === 'equal' ? 'With...' : 'Than...'" />-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="row m-2 pr-md-2">-->
                      <!--<div class="col-md-6 p-0 pb-xs-2">-->
                        <!--<button class="btn btn-secondary w-100 mr-md-2">Clear</button>-->
                      <!--</div>-->
                      <!--<div class="col-md-6 p-0">-->
                        <!--<button class="btn btn-success w-100 ml-md-2">Apply</button>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</b-dropdown>-->

                <!--</div>-->
              <!--</div>-->
            <!--</td>-->
          <!--</tr>-->
          <!--TABLE ITEMS-->
          <tr v-for="(item, i) in $c_itemsCurrentPage" :key="i">
            <td v-if="selectable" style="text-align: center;">
              <b-form-checkbox style="padding: 10px; padding-right: 6px; margin: 0px;" v-model="item.selected"  ></b-form-checkbox>
            </td>
            <td v-for="(col, j) in headerFields" :class="col.item.cellClass" v-if="col.display !== false" :key="j" :style="col.item.style || ''" @click="col.item.onClick && col.item.onClick(item, i)">
              <div :class="[col.item.class, 'field']" v-if="col.item.slot"><slot :name="col.item.slot" :item="item" :i="i"></slot></div>
              <div v-else :class="[col.item.class, 'field']" v-html="col.item.content ? col.item.content(item) : item[col.item.key]"></div>
            </td>
          </tr>
        </tbody>
        <!--TABLE FOOTER, TOTALS-->
        <tfoot v-if="$c_showTotal && $c_items.length">
          <tr>
            <td v-if="selectable" class="col-disable-bg"></td>
            <td v-for="(col, i) in headerFields" v-if="col.display !== false" :key="i" :style="(col.item.total && col.item.total.style) || col.item.style || ''" :class="{'col-disable-bg': !col.item.total}">
              <template v-if="col.item.total">
                <div v-html="col.item.total.content($c_totals)"></div>
              </template>
            </td>
          </tr>
        </tfoot>
      </table>
      <!--0 ITEMS-->
      <div style="padding: 7px; padding-left: 13px; border-top: 1px solid #e1e6ef;" v-if="!$c_items.length">
        No Results.
      </div>
    </div>
    <!--PAGINATION-->
    <space v-if="showPagination"></space>
    <row2 v-if="showPagination">
      <single-select class="col-md-2 col-sm-12" v-model="tableRows" :list="rows"></single-select>
      <div class="col-md-auto" v-if="enableExport">
        <download-excel
              class   = "btn btn-default pointer-button"
              :data   = "items"
              :fields = "$c_exportTable"
              type    = "csv"
              :name   = "`${exportLabel}.csv`">
              Download CSV
        </download-excel>
      </div>
      <div class="col-md-4 col-sm-12 ml-md-auto">
        <ul class="pagination justify-content-end unselectable">
          <li class="page-item"><a style="font-size: 9px; padding-top: 9px;" @click="$_changePageAction(1)"><i class="fa fa-angle-double-left"></i>1</a></li>
          <li v-for="(page, i) in $c_pagesInPagination" :key="i" :class="{'page-item-active': currentPage === page}" class="page-item"><a :class="{'btn-bg-color': currentPage === page}" @click="$_changePageAction(page)">{{ page }}</a></li>
          <li class="page-item"><a style="font-size: 9px; padding-top: 9px;" @click="$_changePageAction($c_pages)">{{$c_pages}}<i class="fa fa-angle-double-right"></i></a></li>
        </ul>
      </div>
    </row2>
    <!--BOTTOM SLOT-->
    <space v-if="$slots['bottom']"></space>
    <row2 v-if="$slots['bottom']">
      <slot name="bottom"></slot>
    </row2>
  </div>
</template>

<script>
import props from './props'
import data from './data'
import computed from './computed'
import methods from './methods'
import watch from './watch'
import { directive as onClickaway } from 'vue-clickaway'
import JsonExcel from 'vue-json-excel'

export default {
  name: 'data-table3',
  directives: { onClickaway },
  props,
  computed,
  data,
  methods,
  watch,
  components: {
    downloadExcel: JsonExcel
  },
  created () {
    this.$emit('input', this.$c_selectedItems)
  }
}
</script>

<style scoped>
  .table-holder {
    overflow-x: auto;
    border: 1px solid #e1e6ef;
  }
  .table-holder th {
    padding: 0px !important;
  }
  .table-holder > table {
    margin-bottom: 0px;
  }
  .selectAll {
    text-align: center;
    background: #eee;
    font-size: 11px;
  }
</style>

<style scoped>
  table {
    font-size: 12px !important;
  }
  tr > th {
    border-right: 1px solid #e1e6ef;
    border-bottom: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    border-top: none;
    vertical-align: middle;
    padding: 7px !important;
  }
  tr > th:last-child {
    border-right: none;
  }
  tr > th:last-child {
    }
  .field {
    white-space: nowrap;
    font-weight: normal;
  }
  tr > td {
    vertical-align: middle;
    border-right: 1px solid #e1e6ef;
    border-bottom: none;
    padding: 7px !important;
  }
  tr > td:last-child {
    border-right: none;
  }
  tr > td:last-child {
  }
  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>

<style scoped>
  .header {
    display: table;
    width: 100%;
  }
  .sort, .title, .cog {
    display: table-cell;
    vertical-align: middle;
    white-space: nowrap;
    font-weight: bold;
  }
  .sort {
    width: 10px;
  }
  .cog {
    text-align: right;
  }
  .arrow-up {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #e1e1e1;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #e1e1e1;
  }
  .arrow-up-active {
    border-bottom: 5px solid #777 !important;
  }
  .arrow-down-active {
    border-top: 5px solid #777 !important;
  }
</style>

<style scoped>
  .page-item {
    width: calc(100% / 7);
  }
  .page-item > a {
    height: 33px;
    line-height: 14px;
    color: #999;
    display: block;
    text-align: center;
    font-size: 10px;
  }
  .page-item > a:focus {
    color: #999;
    background: transparent;
  }
  .page-item > a:hover {
    color: #999;
    background: #f1f1f1;
    cursor: pointer;
  }
  .pagination {
    margin-bottom: 0px;
  }
</style>

<style scoped>
  .filter .search, .filter .search:hover, .filter .search:focus {
    border: 0px !important;
    margin: 0px !important;
  }
  .col-disable-bg {
    background: #eee !important;
  }
  .col-filter {
    padding: 0px !important;
  }
  .b-dropdown {
    width: 100% !important;
    border: 0px !important;
  }
  .placeholder {
    width: calc(100% - 10px) !important;
    display: inline-block;
    text-align: left;
    text-align: center;
  }
  .filter .dropdown button {
    border: 0px !important;
  }
  .pointer-button {
    cursor: pointer;
  }
</style>

<style lang="scss">
.datatable-wrapper {
  .columns-dropdown {
    .dropdown-menu {
      min-width: 12rem;
      max-height: 400px;
      overflow-y: scroll;
      .dropdown-header {
        color: #151b1e;
        background-color: #FFF;
        padding: 5px 10px;
        label.custom-checkbox {
          margin-bottom: 0;
          .custom-control-description {
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>