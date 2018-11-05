export default { // eslint-disable-next-line
  'models.search': function (value) {
    if (!this.serverSidePagination) { this.currentPage = 1; }
  },
  items() {
    if (!this.serverSidePagination) { this.$_changePageAction(1); }
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
  headerFields(newVal) {
    this.localHeaderFields = newVal;
  },
  page(val) {
    this.currentPage = val;
  },
};
