const getLeafValue = (key, item) => key.split('.').reduce((obj, name) => obj[name], item);

export default {
  // total
  $c_showTotal() {
    return !!this.$c_sortedHeaderFields.find(field => !!field.item.total);
  },
  $c_showFilters() {
    return !!this.$c_sortedHeaderFields.find(field => !!field.item.filter);
  },
  $c_totals() {
    return Object.assign({}, ...this.$c_sortedHeaderFields.filter(field => field.item.total).map(field => ({ [field.item.key]: this.$c_items.reduce((s, item) => s + (field.item.total.parse ? field.item.total.parse(getLeafValue(field.item.key, item)) : getLeafValue(field.item.key, item)), 0) })));
  },
  // search
  $c_searchableFields() {
    return this.$c_sortedHeaderFields.filter(field => field.item.searchable).map(field => field.item.key);
  },
  // selected
  $c_selectedItems() {
    return this.localTableModel.selectedRows;
  },
  $c_areAllItemsSelected() { // $c_areAllItemsSelected
    return this.$c_items.length === this.localTableModel.selectedRows.length;
  },
  $c_areAllItemsSelectedOnCurrentPage() {
    /** Continue only if number of items selected is equeal or
     * greater than the number of current page items
     */
    if (!this.localTableModel.selectedRows.length ||
      this.localTableModel.selectedRows.length < this.$c_itemsCurrentPage.length) {
      return false;
    }

    /**
     * Returns TRUE if the first specified array contains all elements
     * from the second one. FALSE otherwise.
     *
     * @returns {boolean}
     */
    return this.localTableModel.selectedRows.every(value => this.$c_itemsCurrentPage.indexOf(value) >= 0);
  },
  $c_itemsCurrentPage() {
    if (this.serverSidePagination || !this.$c_pagesInPagination) {
      return this.$c_items;
    }
    const start = (this.currentPage - 1) * this.paginationSize;
    const end = (start - 1) + this.paginationSize;
    return this.$c_items.filter((item, i) => i >= start && i <= end);
  },
  // items
  $c_items() {
    if (this.serverSidePagination) {
      return this.items;
    }
    let items = this.items;
    if (!items.length) {
      return items;
    }
    // handle sort

    if (this.sortKey && typeof this.$_get(items[0], this.sortField) !== 'undefined') {
      if (this.sortOrder === 'asc') {
        if (typeof this.$_get(items[0], this.sortField) === 'number') {
          items.sort((a, b) => this.$_get(a, this.sortField) - this.$_get(b, this.sortField));
        } else if (typeof this.$_get(items[0], this.sortField) === 'boolean') {
          items.sort((a, b) => (this.$_get(a, this.sortField) === this.$_get(b, this.sortField))? 0 : this.$_get(a, this.sortField)? -1 : 1); // eslint-disable-line
        } else {
          items.sort((a, b) => this.$_get(a, this.sortField).localeCompare(this.$_get(b, this.sortField)));
        }
      } else if (typeof this.$_get(items[0], this.sortField) === 'number') {
        items.sort((a, b) => this.$_get(b, this.sortField) - this.$_get(a, this.sortField));
      } else if (typeof this.$_get(items[0], this.sortField) === 'boolean') {
        items.sort((a, b) => (this.$_get(a, this.sortField) === this.$_get(b, this.sortField))? 0 : this.$_get(a, this.sortField)? 1 : -1); // eslint-disable-line
      } else {
        items.sort((a, b) => (this.$_get(b, this.sortField).localeCompare(this.$_get(a, this.sortField))));
      }
    }
    // handle search
    if (this.globalSearchValue) {
      items = items.filter((item) => {
        for (const key of this.$c_searchableFields) {
          let content = item[key];
          if (key.includes('.')) {
            content = key.split('.').reduce((acc, part) => {
              if (acc) {
                return acc[part];
              }
              return undefined;
            }, item);
          }
          if ((content || '').toString().toLowerCase().includes(this.globalSearchValue.toLowerCase())) {
            return true;
          }
        }
      });
    }
    return items;
  },

  // pages
  $c_pages() {
    if (this.serverSidePagination) {
      return this.pageCount;
    }
    return Math.floor(this.$c_items.length / this.paginationSize) + (this.$c_items.length % this.paginationSize && 1) || 1;
  },

  $c_pagesInPagination() {
    const itemsNr = 5;
    const half = (itemsNr - 1) / 2;
    let [start, end] = [1, this.$c_pages > itemsNr ? itemsNr : this.$c_pages];
    if (this.$c_pages > itemsNr && this.currentPage > half + 1) { // more then 5 pages and current page over 3
      if (this.currentPage >= this.$c_pages - half) { // if page over last page - 2
        start = this.$c_pages - (itemsNr - 1);
        end = this.$c_pages;
      } else {
        start = this.currentPage - half;
        end = this.currentPage + half;
      }
    }
    const pages = [];
    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }
    if (pages.length === 0) {
      return [1];
    }
    return pages;
  },

  $c_shouldDisplayColumn() {
    const displayCols = [];
    this.localHeaderFields.forEach((header) => {
      const result = this.tableModel.displayColumns.find(column => column.item.key === header.item.key);
      if (result) {
        displayCols.push(true);
      } else {
        displayCols.push(false);
      }
    });
    return displayCols;
  },

  $c_shouldSelectRow() {
    const selectedRows = [];
    this.$c_itemsCurrentPage.forEach((item) => {
      const result = this.tableModel.selectedRows.find(row => row === item);
      if (result) {
        selectedRows.push(true);
      } else {
        selectedRows.push(false);
      }
    });
    return selectedRows;
  },

  $c_sortedHeaderFields() {
    const sortedCols = [];
    this.localHeaderFields.forEach((header) => {
      const result = this.headerFields.find(column => column.item.key === header.item.key);
      if (result) {
        sortedCols.push(result);
      }
    });
    return sortedCols;
  },

  $c_exportTable() {
    const table = {};
    this.$c_sortedHeaderFields.forEach((field) => {
      if (field.item.content) {
        table[field.header.content] = field.item.key;
      }
    });
    return table;
  },
};
