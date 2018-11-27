<template>
  <div class="datatable-wrapper">
    <!--TOP SLOT-->
    <div class="row">

      <!-- TABLE ACTIONS SLOT -->
      <div class="col-xs-12 col-md-6 col-lg-6">
        <slot name="vot-top-actions"></slot>
      </div>
      <!-- TABLE ACTIONS SLOT -->

      <!-- TABLE UTILS SLOT -->
      <div class="col-xs-12 col-md-6 col-lg-6 justify-content-end">
        <b-input-group>
          <!-- SEARCH SLOT -->
          <slot name="vot-top-search" v-if="globalSearch">
            <input v-model="globalSearchValue"
                  class="form-control"
                  :placeholder="globalSearchPlaceholder"
                  @focus.native="$event.target.select()"
                  @keydown.native="$_searchKeyPress" />
          </slot>
          <!-- END SEARCH SLOT -->

          <!-- TABLE SETTINGS SLOT -->
          <div class="btn-group" role="group">
            <slot name="vot-top-utils">

              <!-- COLUMNS UTIL DROPDOWN -->
              <b-dropdown v-if="columnsUtility" :text="columnsUtilityLabel" class="columns-dropdown" :no-flip="true" right >
                <template slot="button-content">
                  <img width="20px" height="20px" src="/static/icons/controls.svg" alt="Controls">
                </template>
                <div class="card">
                  <div class="card-header text-center">
                    <button class="btn btn-outline-primary btn-sm" @click="$_saveSettings()">Save Columns State</button>
                  </div>
                  <ul class="list-group list-group-flush">
                    <draggable v-model="localHeaderFields">
                      <li v-for="(col, i) in $c_sortedHeaderFields" :key="i" v-if="col.item.content"
                          class="list-group-item">
                        <div style="display:flex; flex-direction:row; justify-content:flex-start">
                          <b-form-checkbox :checked="$c_shouldDisplayColumn[i]" @change="$_toggleDisplayColumn(col)">
                            {{ typeof col.header.content === 'function' ? col.header.content() : col.header.content }}
                          </b-form-checkbox>
                        </div>
                        <span class="badge badge-primary badge-pill">{{ i + 1 }}</span>
                      </li>
                    </draggable>
                  </ul>
                </div>
              </b-dropdown>
              <!-- END COLUMNS UTIL DROPDOWN -->

              <!-- SETTINGS UTIL DROPDOWN -->
              <b-dropdown v-if="columnsUtility" :text="settingsUtilityLabel" class="columns-dropdown" :no-flip="true" right >
                <template slot="button-content">
                  <img width="20px" height="20px" src="/static/icons/settings.svg" alt="Controls">
                </template>
                <div class="card">
                  <div class="card-header text-center">
                    <button class="btn btn-outline-primary btn-sm" @click="$_saveSettings()">Save Settings</button>
                  </div>
                  <ul class="list-group list-group-flush">
                    <draggable v-model="localHeaderFields">
                      <li v-for="(col, i) in $c_sortedHeaderFields" :key="i" v-if="col.item.content" class="list-group-item">
                        <div style="display:flex;flex-direction:row;justify-content:flex-start">
                          <b-form-checkbox :checked="$c_shouldDisplayColumn[i]" @change="$_toggleDisplayColumn(col)">
                            {{ typeof col.header.content === 'function' ? col.header.content() : col.header.content }}
                          </b-form-checkbox>
                        </div>
                        <span class="badge badge-primary badge-pill">{{ i + 1 }}</span>
                      </li>
                    </draggable>
                  </ul>
                </div>
              </b-dropdown>
              <!-- END SETTINGS UTIL DROPDOWN -->
            </slot>
          </div>
        </b-input-group>
      </div>
      <!-- END TABLE UTILS SLOT -->
    </div>
    <!-- END TOP SLOT -->

    <div class="space"></div>

    <!--SELECT ALL OPTION -->
    <div class="select-all-row" v-if="$c_itemsCurrentPage.length && $c_areAllItemsSelectedOnCurrentPage">
      <span v-if="$c_areAllItemsSelected">
        <span>All {{ $c_items.length }} {{ selectLabel }} selected.</span>
        <span @click="$_selectAllItemsAction(false)" style="text-decoration: underline; cursor: pointer;">Clear selection</span>
      </span>
      <span v-else>
        <span>All {{ $c_itemsCurrentPage.length }} {{ selectLabel }} in current page selected.</span>
        <span @click="$_selectAllItemsAction(true)" style="text-decoration: underline; cursor: pointer;">Select all {{ $c_items.length }} {{ selectLabel }}</span>
      </span>
    </div>
    <!-- END SELECT ALL OPTION -->

    <!--TABLE -->
    <div class="vot-holder">
      <!--0 ITEMS-->
      <div class="vot-loader-container" v-if="!$c_items.length && !(serverSideMode && loading)">
        <slot name="vot-no-result-content">
          <div class="vot-no-result-content">
            <h5>No data to display :(</h5>
          </div>
        </slot>
      </div>
      <div class="vot-loader-container" v-if="serverSideMode && loading">
        <slot name="vot-loader-content">
          <div class="vot-loader-content">
            <img src="/static/loaders/loader-10.gif" width="100px" height="100px" alt="Loading...">
          </div>
        </slot>
      </div>
      <table class="table" :class="{
        'table-hover': tableHover,
        'table-bordered': tableBordered,
        'table-striped': tableStriped,
        'table-inverse': tableInverse,
        'table-responsive': tableResponsive,
        'table-small': tableSmall,
        }">
        <!--ALL CHECKBOX & TABLE HEADERS-->
        <thead>
        <tr>
          <th v-if="selectable" style="text-align: center;">
            <b-form-checkbox class="m-2 p-10 pr-6 m-0"
                             v-model="selectAllCheckbox"
                             @click.prevent.native="$_selectAllItemsCurrentPageAction()">
            </b-form-checkbox>
          </th>
          <th v-for="(col, i) in $c_sortedHeaderFields" v-if="$c_shouldDisplayColumn[i]" :key="i"
              :style="col.header.style || ''">
            <div class="header">
              <div v-if="col.item.sortable" class="sort p-2" @click="$_fieldClickAction(col)">
                <div :class="{'arrow-up-active': sortKey === col.item.key && sortOrder === 'asc'}"
                     class="arrow-up"></div>
                <div style="height: 5px;"></div>
                <div :class="{'arrow-down-active': sortKey === col.item.key && sortOrder === 'desc'}"
                     class="arrow-down"></div>
              </div>
              <div @click="$_fieldClickAction(col)" class="title pt-2 pb-2"
                   :class="{ 'pl-2': !col.item.sortable, 'pr-2': !col.item.filter }" style="text-align: center;">
                <span v-if="typeof col.header.content == 'function'" v-html="col.header.content()" ></span>
                <span v-else v-html="col.header.content"></span>
                <i v-if="col.header.info"
                   v-b-tooltip="{ hover: true, html: true, title: col.header.info, boundary: 'window' }"
                   class="fa fa-info-circle info-icon"></i>
              </div>
              <!--DROPDOWN FILTERS-->
            </div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in $c_itemsCurrentPage" :key="i">
          <td v-if="selectable" style="text-align: center;">
            <b-form-checkbox :checked="$c_shouldSelectRow[i]"
                             style="padding: 10px; padding-right: 6px; margin: 0px;"
                             @change="$_selectItem(item)">
            </b-form-checkbox>
          </td>
          <td v-for="(col, j) in $c_sortedHeaderFields" :class="col.item.cellClass" :key="j"
              v-if="$c_shouldDisplayColumn[j]" :style="col.item.style || ''"
              @click="col.item.onClick && col.item.onClick(item, i)">
            <div :class="[col.item.class, 'field']" v-if="col.item.slot">
              <slot :name="col.item.slot" :item="item" :i="i"></slot>
            </div>
            <div v-else :class="[col.item.class, 'field']"
                 v-html="col.item.content ? col.item.content(item) : item[col.item.key]">
            </div>
          </td>
        </tr>
        </tbody>
        <!--TABLE FOOTER, TOTALS-->
        <tfoot v-if="$c_showTotal && $c_items.length">
        <tr>
          <td v-if="selectable" class="col-disable-bg"></td>
          <td v-for="(col, i) in $c_sortedHeaderFields" :key="i" v-if="$c_shouldDisplayColumn[i]"
              :style="(col.item.total && col.item.total.style) || col.item.style || ''"
              :class="{'col-disable-bg': !col.item.total}">
            <template v-if="col.item.total">
              <div v-html="col.item.total.content($c_totals)"></div>
            </template>
          </td>
        </tr>
        </tfoot>
      </table>
    </div>

    <div class="space"></div>

    <!-- BOTTOM SLOT -->
    <div class="row">
      <vue-opti-select class="col-xs-4 col-md-2 col-lg-2"
                      v-model="paginationSize"
                      :list="rows"
                      @click="$_pageSizeChanged()">
      </vue-opti-select>

      <div class="col-xs-4 col-md-2 col-lg-2" v-if="enableExport">
        <download-excel
          class="btn btn-secondary pointer-button"
          :data="items"
          :fields="$c_exportTable"
          type="csv"
          :name="`${exportLabel}.csv`">
          Download CSV
        </download-excel>
      </div>

      <!-- START BOTTOM ACTIONS SLOT -->
      <slot name="vot-bottom-actions"></slot>
      <!-- END BOTTOM ACTIONS SLOT -->

      <!-- START BOTTOM PAGINATION SLOT -->
      <slot name="vot-bottom-pagination">
        <div class="col-md-4 col-sm-12 ml-md-auto" v-if="showPagination">
          <ul class="pagination justify-content-end unselectable">
            <li class="page-item">
              <a class="page-link" @click="$_changePageAction(1)">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
                1</a>
            </li>
            <li v-for="(page, i) in $c_pagesInPagination" :key="i" :class="{'active': currentPage === page}" class="page-item">
              <a :class="{'btn-bg-color': currentPage === page}" class="page-link" @click="$_changePageAction(page)">
                {{ page }}
              </a>
            </li>
            <li class="page-item">
              <a class="page-link" style="font-size: 9px; padding-top: 9px;" @click="$_changePageAction($c_pages)">
                {{ $c_pages }}
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </div>
      </slot>
      <!-- END BOTTOM PAGINATION SLOT -->
    </div>
    <!--BOTTOM SLOT-->
  </div>
</template>

<script>
import JsonExcel from 'vue-json-excel';
import { VueOptiSelect } from 'vue-opti-select';
import draggable from 'vuedraggable';
import props from './props';
import data from './data';
import computed from './computed';
import methods from './methods';
import watch from './watch';

export default {
  name: 'vue-opti-table',
  props,
  computed,
  data,
  methods,
  watch,
  components: {
    downloadExcel: JsonExcel,
    draggable,
    VueOptiSelect,
  },
  model: {
    prop: 'tableModel',
    event: 'click',
  },
  created() {
    this.localTableModel = this.tableModel;
    if (window.localStorage.getItem(this.name)) {
      this.localTableModel.displayColumns = JSON.parse(window.localStorage.getItem(this.name)).displayColumns;
      this.localHeaderFields = JSON.parse(window.localStorage.getItem(this.name)).columnsOrder;
    } else {
      this.localHeaderFields = this.headerFields;
      this.localTableModel.displayColumns = this.localHeaderFields.filter(field => field.display !== false);
    }
    this.$emit('click', this.localTableModel);
  },
};
</script>

<style scoped>
  .vot-holder {
    overflow-x: auto;
    position: relative;
    min-height: 180px;
    width: 100%;
    border: 1px solid #e1e6ef;
  }

  .vot-holder th {
    padding: 0px !important;
  }

  .vot-holder > table {
    margin-bottom: 0px;
  }

  .vot-loader-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(221,221,221,0.3)
  }

  .vot-loader-content {
    z-index: 100;
    text-align: center;
    position: relative;
    top: 40%;
  }

  .vot-no-result-content {
    z-index: 100;
    text-align: center;
    position: relative;
    top: 50%;
  }

  .select-all-row {
    text-align: center;
    background: #eee;
    font-size: 14px;
  }

  .space {
    height: 14px;
    width: 100%;
  }
</style>

<style scoped>
  table {
    font-size: 12px !important;
  }

  tr > th {
    border-right: 1px solid #e1e6ef;
    border-bottom: 1px solid #e1e6ef;
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
    padding: 2px !important;
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

  .dropdown-divider {
    margin: 0 !important;
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
        min-width: 13.5rem;
        max-height: 400px;
        overflow-y: scroll;
        padding: 0;
        .dropdown-header {
          color: #151b1e;
          background-color: #FFF;
          padding: 5px 10px;
          label.custom-checkbox {
            margin-bottom: 0;
            .custom-control-description {
              line-height: 20px;
            }
          }
        }
        label.custom-control {
          margin-bottom: 0;
        }
        label > span.custom-control-description {
          cursor: move;
        }
        .list-group-item {
          padding: .5rem 1.25rem;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
      }
    }
    .active-selection {
      width: 8px;
      height: 8px;
      background: transparent;
      border-radius: 50%;
      border: 2px solid white;
      box-sizing: content-box;
      box-shadow: 0 0 0 2px #007bff;
      margin: auto 0
    }
    .active-selection.active {
      background: #007bff;
    }
    .badge-pill {
      margin: auto 0;
    }
  }
</style>
