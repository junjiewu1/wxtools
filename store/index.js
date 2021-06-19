import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		checkItems:[]
	},
    mutations: {
		changeCheckItems(state, payload){
			state.checkItems = payload
		}
	},
    actions: {}
})
export default store