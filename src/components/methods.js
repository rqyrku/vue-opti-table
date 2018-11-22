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
      this.currentPage = 1;
      this.$_paginationEvent();
    }
  },
  // used for the show/hide columns dropdown
  $_toggleDisplayColumn(col) {
    const isDisplayed = this.localTableModel.displayColumns.find(column => column.item.key === col.item.key);
    if (isDisplayed) {
      this.localTableModel.displayColumns = this.localTableModel.displayColumns.filter(field => field.item.key !== col.item.key);
    } else {
      this.localTableModel.displayColumns.push(col);
    }
    this.$emit('click', this.localTableModel);
    return this.localTableModel.displayColumns;
  },

  $_isDisplayed(col) {
    return this.localTableModel.displayColumns.find(column => column.item.key === col.item.key);
  },

  // Pagination
  $_changePageAction(page) {
    this.currentPage = page;
    if (this.$c_items.length) {
      this.selectAllCheckbox = this.$c_areAllItemsSelectedOnCurrentPage;
    }

    this.$_paginationEvent();
  },

  // Select Rows Section
  $_selectAllItemsCurrentPageAction() {
    this.$c_itemsCurrentPage.forEach(item => this.localTableModel.selectedRows = this.localTableModel.selectedRows.filter(row => row === item));
    if (!this.selectAllCheckbox) this.localTableModel.selectedRows = this.localTableModel.selectedRows.concat(this.$c_itemsCurrentPage);
    this.selectAllCheckbox = !this.selectAllCheckbox;
    this.$emit('click', this.localTableModel);
  },

  $_pageSizeChanged() {
    this.currentPage = 1;
    this.$_paginationEvent();
  },

  $_searchKeyPress(event) {
    if (event.which === 13) {
      this.$_submitSearch();
    } else if (event.which === 8 && this.globalSearchValue.length === 1) {
      this.$_submitSearch();
    }
  },

  $_submitSearch() {
    this.currentPage = 1;
    this.$_paginationEvent();
  },

  $_paginationEvent() {
    this.$emit('paginationChange', {
      page: this.currentPage - 1,
      count: this.paginationSize,
      sortField: this.sortField,
      sortType: this.sortOrder,
      search: this.globalSearchValue,
      searchableFields: this.$c_searchableFields,
    });
  },

  $_selectItem(row) {
    const isSelected = this.localTableModel.selectedRows.find(item => item === row);
    if (isSelected) {
      this.localTableModel.selectedRows = this.localTableModel.selectedRows.filter(field => field !== row);
    } else {
      this.localTableModel.selectedRows.push(row);
    }
    this.$emit('click', this.localTableModel);
  },

  $_selectAllItemsAction(v) {
    this.selectedAll = v;
    // Remove all selected items
    this.localTableModel.selectedRows = [];
    // If choosed to select all add all items as selected
    if (v) {
      this.localTableModel.selectedRows = this.localTableModel.selectedRows.concat(this.$c_items);
    }
    this.selectAllCheckbox = v;
    this.$emit('click', this.localTableModel);
  },

  $_saveSettings() {
    window.localStorage.setItem(this.name, JSON.stringify(this.localTableModel));
  },

  $_get(obj, key) {
    if (key.includes('.')) {
      return key.split('.').reduce((acc, part) => {
        if (acc) {
          return acc[part];
        }
        return undefined;
      }, obj);
    }
    return obj[key];
  },
};
