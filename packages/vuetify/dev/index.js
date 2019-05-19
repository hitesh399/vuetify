import Vue from 'vue'
import App from './App'
import Boilerplate from './Boilerplate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import lqForm, { validate } from 'lq-form'
import store from '../src/store'
import './axios'
import VueCroppie from 'vue-croppie'
import 'croppie/croppie.css' // import the croppie css manually

/**
 * Register Custom Validation Rule.
 */
validate.validators.myval = function (value, rules,  id, values, options) {
  // return fileValidation(value, rules, id, formName, formValues)
  console.log('Test value ', value)
  console.log('Test rules ', rules)
  console.log('Test id ', id)
  console.log('Test values ', values)
  console.log('Test options ', options)
  // rules, id, formName, formValues)
  return 'I am error'
}

Vue.use(VueCroppie)

Vue.use(lqForm, { store })

Vue.config.performance = true

Vue.use(Vuetify)
Vue.use(VueRouter)

Vue.component(Boilerplate.name, Boilerplate)

const vm = new Vue({
  data: () => ({ isLoaded: document.readyState === 'complete' }),
  store,
  render (h) {
    return this.isLoaded ? h(App) : undefined
  },
  router
}).$mount('#app')

// Prevent layout jump while waiting for styles
vm.isLoaded || window.addEventListener('load', () => {
  vm.isLoaded = true
})
