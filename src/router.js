import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "/home",
			name: "home",
			component: r => require(['./views/Home.vue'], r),
			children: [
				{
					path: "/home/shelf",
					name: "shelf",
					component: r => require(['./views/Shelf.vue'], r),
				},
				{
					path: "/home/classify",
					name: "classify",
					component: r => require(['./views/Classify.vue'], r),
				},
				{
					path: "/home/rank",
					name: "rank",
					component: r => require(['./views/Rank.vue'], r),
				},
				{
					path: "/home/list",
					name: "list",
					component: r => require(['./views/List.vue'], r),
				}
			],
			redirect: '/home/shelf'
		},
		{
			path: "/detail",
			name: "detail",
			component: r => require(['./views/Detail.vue'], r),
		},
		{
			path: "/book",
			name: "book",
			component: r => require(['./views/Book.vue'], r),
		},
		{
			path: '/',
			redirect: '/home'
		}
	]
});
