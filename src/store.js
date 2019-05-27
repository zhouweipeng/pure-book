import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// 当前书籍详情
		book: {},
		// 标签栏下标
		active: 0,
		// 正在阅读的书籍信息
		readBook: {},
		// 正在阅读的章节列表
		readList: [],
		// 正在阅读的下标
		readIndex: 0,
		// 书架
		shelf: [],
		// 风格
		style: {
			color: '#000',
			size: 16,
			bg: '#fff',
			margin: 16
		}
	},
	mutations: {},
	actions: {}
});
