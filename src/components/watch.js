export default { // eslint-disable-next-line
  'models.search': function (value) {
    if (!this.serverSidePagination) {
      this.currentPage = 1;
    }
  },
  items() {
    if (!this.serverSidePagination) {
      this.$_changePageAction(1);
    }
  },
  tableRows() {
    this.currentPage = 1;
  },
  defaultRows(newVal) {
    this.paginationSize = newVal;
  },
  localHeaderFields(newVal) {
    this.localTableModel.columnsOrder = newVal;
    this.$emit('click', this.localTableModel);
  },
  page(val) {
    this.currentPage = val;
  },
  sort(val) {
    this.sortKey = val.key;
    this.sortOrder = val.order;
    this.sortField = val.field || val.key;
  },
  searchValue(val) {
    this.models.search = val;
  },

};
