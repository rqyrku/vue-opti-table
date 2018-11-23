import VueOptiTable from './components/VueOptiTable';

function install(Vue) {
  Vue.component(VueOptiTable.name, VueOptiTable);
}

const VueOptiTablePlugin = {
  install,
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueOptiTablePlugin);
}

export default VueOptiTablePlugin;
export {
  VueOptiTable,
};

