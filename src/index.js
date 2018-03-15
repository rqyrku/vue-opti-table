import OptimDataTable from './components/OptimDataTable';

function install(Vue) {
  Vue.component(OptimDataTable.name, OptimDataTable);
}

const OptimDataTablePlugin = {
  install,
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(OptimDataTablePlugin);
}

export default OptimDataTablePlugin;
export {
  OptimDataTable as VueOptimTable,
};

