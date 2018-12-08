import items from './items';

export default async function loadPaginatedData(page, limit, sortField, sortDirection, search, searchFields) {
  let data = [...items];
  if (sortField) {
    data.sort((a, b) => {
      let firstSortItem;
      let secondSortItem;
      if (sortField.split('.').length > 1) {
        const splits = sortField.split('.');
        firstSortItem = a[splits[0]];
        secondSortItem = b[splits[0]];
        for (let i = 1; i < splits.length; i++) {
          firstSortItem = firstSortItem[splits[i]];
          secondSortItem = secondSortItem[splits[i]];
        }
      } else {
        firstSortItem = a[sortField];
        secondSortItem = b[sortField];
      }
      if (!firstSortItem || !secondSortItem) {
        return 0;
      }
      if (firstSortItem instanceof Number || firstSortItem instanceof Date) {
        return secondSortItem - firstSortItem;
      }
      return firstSortItem.toString().localeCompare(secondSortItem.toString());
    });
  }

  if (sortDirection && sortDirection === 'desc') {
    data.reverse();
  }
  if (search && searchFields) {
    data = data.filter(item =>
      searchFields.some((field) => {
        let searchItem;
        if (field.split('.').length > 1) {
          const splits = field.split('.');
          searchItem = item[splits[0]];
          for (let i = 1; i < splits.length; i++) {
            searchItem = searchItem[splits[i]];
          }
        } else {
          searchItem = item[field];
        }
        if (!searchItem) {
          return false;
        }
        if (!(searchItem instanceof String)) {
          searchItem = searchItem.toString();
        }

        return searchItem && searchItem.toLowerCase().includes(search.toLowerCase());
      }),
    );
  }
  page = page || 1;
  const finalData = limit ? data.slice((page - 1) * limit, ((page - 1) * limit) + limit) : data;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        totalItemsCount: data.length,
        data: finalData,
        pageInfo:
          {
            totalItemsCount: data.length,
            hasNextPage: (page * limit) + limit < data.length,
          },
      });
    }, 500);
  });
}
