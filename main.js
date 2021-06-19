import Vue from 'vue'
import App from './App'
import store from './store'
import miniappTip from './components/miniappTip.vue'

Vue.prototype.$store = store
Vue.config.productionTip = false

Vue.component('miniapp-tip',miniappTip)

Vue.prototype.glancThrough = (options)=>{ 
	if(!options.topicId){
		return
	}
	var historyopen = uni.getStorageSync('historyopen')
	if(historyopen){
		var iii = historyopen.findIndex(item=>{
			return item == options.topicId
		})
		if(iii == -1){
			historyopen.unshift(options.topicId)
			uni.setStorageSync('historyopen', historyopen)
		}else{
			historyopen.splice(iii, 1)
			historyopen.unshift(options.topicId)
			uni.setStorageSync('historyopen', historyopen)
		}
		
	}else{
		uni.setStorageSync('historyopen', [options.topicId])
	}
}; 

App.mpType = 'app'


const app = new Vue({
    ...App,
	store
})


app.$mount()
