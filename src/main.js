import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './theme/handler_themes.scss'
import './assets/css/reset.css';
import './assets/css/common.scss';
import './assets/css/mixins.scss';
import './assets/font/iconfont.css';
import Axios from 'axios'
import * as echarts from 'echarts';
import animated from 'animate.css';
// import CesiumNavigation from 'cesium-navigation-es6'
import * as Cesium from "cesium/Cesium";
import widget from "cesium/Widgets/widgets.css";

// import { Loading } from 'element-ui';

import filter from '@/plugins/filter.js'
import globalMixin from '@/mixins/globalMixin.js'

import Print from './config/print'
Vue.use(Print)

const { Loading } = require('element-ui');

Vue.use(animated)
Vue.prototype.$echarts = echarts
Vue.prototype.Cesium = Cesium
Vue.prototype.$http = Axios
Vue.config.productionTip = false
Vue.prototype.Loading = Loading

Vue.use(ElementUI);

new Vue({
	router,
	store,
	render: h => h(App),
	mounted() {
		Vue.mixin(globalMixin)
	}
}).$mount('#app')


