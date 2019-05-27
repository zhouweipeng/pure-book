import "lib-flexible/flexible.js";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueAxios from "vue-axios";
import axios from "axios";
Vue.use(VueAxios, axios);

// 图标
import { Icon } from 'vant';
Vue.use(Icon);
// 布局
import { Row, Col } from "vant";
Vue.use(Row).use(Col);
// 按钮
import { Button } from 'vant';
Vue.use(Button);
// 搜索
import { Search } from 'vant';
Vue.use(Search);
// 加载
import { Loading } from 'vant';
Vue.use(Loading);
// 下拉刷新
import { PullRefresh } from 'vant';
Vue.use(PullRefresh);
// 懒加载
import { Lazyload } from 'vant';
Vue.use(Lazyload);
// 标签页
import { Tab, Tabs } from 'vant';
Vue.use(Tab).use(Tabs);
// 单元格
import { Cell, CellGroup } from 'vant';
Vue.use(Cell).use(CellGroup);
// 标签栏
import { Tabbar, TabbarItem } from 'vant';
Vue.use(Tabbar).use(TabbarItem);
// 导航栏
import { NavBar } from 'vant';
Vue.use(NavBar);
// 徽章
import { Badge, BadgeGroup } from 'vant';
Vue.use(Badge);
Vue.use(BadgeGroup);
// 标记
import { Tag } from 'vant';
Vue.use(Tag);
// 轻提示
import { Toast } from 'vant';
Vue.use(Toast);
// 弹出层
import { Popup } from 'vant';
Vue.use(Popup);
// 评分
import { Rate } from 'vant';
Vue.use(Rate);
// 弹出框
import { Dialog } from 'vant';
Vue.use(Dialog);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
