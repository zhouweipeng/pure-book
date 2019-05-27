<template>
	<div>
		
		<van-tabs v-model="active" animated swipeable @click="changePage">
			<van-tab v-for="(item, index) in rankData" :key="index" :title="item.name">
				<!-- 侧边导航栏 -->
				<div class="left">
					<van-badge-group :active-key="activeKey" @change="changeBadge">
						<van-badge v-for="(it, i) in item.data" :key="i" :title="it.shortTitle" />
					</van-badge-group>
				</div>
				<!-- 右侧榜单详情 -->
				<div class="right">
					<van-loading color="#e4393c" size="1rem" v-show="isLoad" class="loading" />
					<div class="itemBox" v-for="(it, i) in detailsData" :key="i" v-show="!isLoad" @click="goDetails(it)">
						<img v-lazy="'http://statics.zhuishushenqi.com' + it.cover" class="cover" />
						<div class="itemBox-info">
							<h3 class="nowrap">{{it.title}}</h3>
							<p class="line2">{{it.shortIntro}}</p>
							<p>
								{{it.author}}
								<van-tag color="#e4393c" round class="tag">{{it.majorCate}}</van-tag>
							</p>
						</div>
					</div>
				</div>
			</van-tab>
		</van-tabs>
		
	</div>
</template>

<script>
	export default {
		name: 'rank',
		
		data(){
			return {
				rankData: [
					{name: '男生', data: []},
					{name: '女生', data: []},
					{name: '出版', data: []},
					{name: '漫画', data: []}
				],
				active: 0,
				// 分页上一次下标
				activeS: 0,
				// 竖向排列
				activeKey: 0,
				// 详情数据
				detailsData: [],
				// 加载中
				isLoad: true
			}
		},
		
		methods: {
			// 切换横向标签页
			changePage(index){
				if(this.activeS == index){
					return
				}
				this.activeS = index
				this.activeKey = 0
				this.getRankDetails()
			},
			// 切换竖向标签页
			changeBadge(key){
				this.activeKey = key
				this.getRankDetails()
			},
			// 获取榜单详情
			getRankDetails(){
				this.isLoad = true
				var rankId = this.rankData[this.active].data[this.activeKey]._id
				this.axios({
					methods: 'get',
					url: '/zxc/ranking/' + rankId
				}).then(r => {
					// console.log(r.data.ranking.books)
					this.detailsData = r.data.ranking.books
					this.isLoad = false
				}).catch(e => {
					console.log(e)
				})
			},
			// 获取书籍详情
			goDetails(item){
				this.axios({
					methods: 'get',
					url: '/zxc/book/' + item._id
				}).then(r => {
					this.$store.state.book = r.data
					this.$store.state.active = 2
					this.$router.push({name: 'detail'})
				})
			}
		},
		
		created(){
			this.axios({
				methods: 'get',
				url: '/zxc/ranking/gender'
			}).then(r => {
				this.rankData[0].data = r.data.male
				this.rankData[1].data = r.data.female
				this.rankData[2].data = r.data.epub
				this.rankData[3].data = r.data.picture
				this.getRankDetails()
			}).catch(e => {
				console.log(e)
			})
		}
	}
</script>

<style lang="less" scoped>
	h2{
		padding: 0 0.4rem;
	}
	.icon{
		height: 1.2rem;
		width: 1.2rem;
	}
	.left{
		width: 25%;
		height: calc(~"100vh - 3.9448rem");
		float: left;
		overflow-y: scroll;
	}
	.right{
		width: 75%;
		height: calc(~"100vh - 3.9448rem");
		float: left;
		overflow-y: scroll;
		.loading{
			margin-top: 50%;
			margin-left: calc(~"50% - 0.5rem");
		}
	}
	.itemBox{
		padding: 0.2rem;
		.cover{
			width: 1.8rem;
			height: 2.4rem;
			box-shadow: 0 0 10PX #ececec;
			vertical-align: middle;
		}
		.itemBox-info{
			width: calc(~"100% - 1.8rem");
			height: 2.4rem;
			line-height: 0.6rem;
			display: inline-block;
			vertical-align: middle;
			*{
				padding-left: 0.2rem;
				margin: 0;
			}
			p:nth-of-type(1){
				color: #8a8a8a;
			}
			.tag{
				float: right;
				margin-top: calc(~"0.3rem - 8px");
			}
		}
	}
</style>
