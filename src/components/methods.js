export default {
  $_fieldClickAction(field) {
    if (field.item.sortable) {
      if (!(this.sortKey === field.item.key)) {
        this.sortKey = field.item.key;
        this.sortField = field.item.key;
        if (typeof field.item.sortable === 'string') {
          this.sortField = field.item.sortable;
        }
        this.sortOrder = 'asc';
      } else if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else {
        this.sortOrder = 'asc';
      }
    }
  },
  $_selectColumn(col) {
    col.display = !col.display;
  },
  $_changePageAction(page) {
    this.currentPage = page;
    if (this.$c_items.length) {
      this.models.selectAllCheckbox = this.$c_areAllItemsSelectedOnCurrentPage;
    }
  },
  $_selectAllItemsCurrentPageAction() {
    this.models.selectAllCheckbox = !this.models.selectAllCheckbox;
    this.$c_itemsCurrentPage.forEach(item => (item.selected = this.models.selectAllCheckbox));
    this.$emit('input', this.$c_selectedItems);
  },
  $_selectItem(item) {
    item.selected = !item.selected;
    this.$emit('input', this.$c_selectedItems);
  },
  $_selectAllItemsAction(v) {
    this.selectedAll = v;
    this.$c_items.forEach(item => (item.selected = v));
    this.models.selectAllCheckbox = v;
    this.$emit('input', this.$c_selectedItems);
  },
};
