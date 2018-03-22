export default { // eslint-disable-next-line
  'models.search': function (value) { 
    this.currentPage = 1;
  },
  items() {
    this.$_changePageAction(1);
  },
  tableRows() {
    this.currentPage = 1;
  },
};
