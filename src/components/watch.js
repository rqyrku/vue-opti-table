export default { // eslint-disable-next-line
  globalSearchValue() {
    if (!this.serverSideMode) {
      this.currentPage = 1;
    }
  },
  items() {
    if (!this.serverSideMode) {
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
  headerFields(newVal) {
    this.localHeaderFields = newVal;
  },
  page(val) {
    this.currentPage = val;
  },
  sort(val) {
    this.sortKey = val.key;
    this.sortOrder = val.order;
    this.sortField = val.field || val.key;
  },
};
