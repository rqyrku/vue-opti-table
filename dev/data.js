import items from './items';

export default function () {
  return {
    tableModel: {
      selectedRows: [],
      displayColumns: [],
      columnsOrder: [],
    },
    table: {
      fields: [
        {
          header: { content: 'First Name', style: '', info: 'This is the first name' },
          item: {
            key: 'name.first',
            content: item => item.name.first,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
            total: {
              parse: () => 1,
              content: totals => totals['name.first'],
              style: { background: '#fffdf5', fontWeight: 'bold', textAlign: 'center' },
            },
          },
        },
        {
          header: { content: 'Last Name', style: '' },
          item: {
            key: 'name.last',
            content: item => item.name.last,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
          },
        },
        {
          header: { content: 'Email', style: '' },
          item: {
            key: 'email',
            content: item => item.email,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
          },
        },
        {
          header: { content: 'Active', style: '' },
          item: {
            key: 'isActive',
            content: item => item.isActive,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
          },
        },
        {
          header: { content: 'Balance', style: '' },
          item: {
            key: 'balance',
            content: item => item.balance,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
            total: {
              parse: value => parseFloat(value.replace(/\$|,/gi, '')),
              content: totals => `$${totals.balance.toFixed(2)}`,
              style: { background: '#fffdf5', fontWeight: 'bold', textAlign: 'center' },
            },
          },
        },
        {
          header: { content: 'Phone', style: '' },
          item: {
            key: 'phone',
            content: item => item.phone,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
          },
        },
        {
          header: { content: 'Company', style: '' },
          item: {
            key: 'company',
            content: item => item.company,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
          },
        },
        {
          header: { content: 'Age', style: '' },
          item: {
            key: 'age',
            content: item => item.age,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
          },
          display: false,
        },
        {
          header: { content: 'Registered', style: '' },
          item: {
            key: 'registered',
            content: item => item.registered,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
          },
        },
        {
          header: { content: 'Latitude', style: '' },
          item: {
            key: 'latitude',
            content: item => item.latitude,
            sortable: true,
            searchable: true,
            style: { textAlign: 'center' },
          },
        },
      ],
      items,
    },
  };
}
