import action from './action'

const install = function(Vue) {
  Vue.directive('action', action)
}

if (window.Vue) {
  window['action'] = action
  Vue.use(install); // eslint-disable-line
}

action.install = install
export default action
