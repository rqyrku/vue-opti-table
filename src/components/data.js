export default function () {
  return {
    sortKey: this.sort.key,
    sortOrder: this.sort.order,
    sortField: this.sort.field || this.sort.key,
    currentPage: this.page,
    rows: [
      { content: '10 Rows', value: 10, selected: true },
      { content: '25 Rows', value: 25, selected: false },
      { content: '50 Rows', value: 50, selected: false },
      { content: '100 Rows', value: 100, selected: false }
    ],
    tableRows: { content: '10 Rows', value: 10, selected: true },
    models: { search: '', selectAllCheckbox: false },
    filterModels: {},
    openDropdowns: {}
  }
}
