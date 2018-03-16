import OptiDataTable from './components/OptiDataTable';

function install(Vue) {
  Vue.component(OptiDataTable.name, OptiDataTable);
}

const OptiDataTablePlugin = {
  install,
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(OptiDataTablePlugin);
}

export default OptiDataTablePlugin;
export {
  OptiDataTable as VueOptiTable,
};

