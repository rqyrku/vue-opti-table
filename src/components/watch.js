export default { // eslint-disable-next-line
  'models.search': function () {
    this.currentPage = 1;
  },
  items() {
    this.$_changePageAction(1);
  },
  tableRows() {
    this.currentPage = 1;
  },
};
