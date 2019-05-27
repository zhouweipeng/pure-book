<template>
	<div>
		<!-- 标签页 -->
		<van-tabs v-model="active" animated swipeable @click="changePage" v-show="isShow">
			<van-tab v-for="(item, index) in classifyData" :key="index" :title="item.name">
				<div class="content">
					<div class="classBox" v-for="(it, i) in item.data" :key="i" @click="details(it, i)" :ref="'class' + i">
						<h3>{{it.name}}</h3>
						<p>{{it.bookCount}}本</p>
						<img v-lazy="'http://statics.zhuishushenqi.com' + it.bookCover[0]" />
						<img v-lazy="'http://statics.zhuishushenqi.com' + it.bookCover[1]" />
						<img v-lazy="'http://statics.zhuishushenqi.com' + it.bookCover[2]" />
					</div>
				</div>
			</van-tab>
		</van-tabs>
		
		<!-- 返回 -->
		<div :class="{tab: true, tabB: isBig}">
			<van-icon name="arrow-left" size="18PX" class="back" @click="back" />
			<h2>{{title}}</h2>
		</div>
		
		<!-- 详情 -->
		<div :class="{detailsBox: true, detailsBoxB: isBig}" ref="detailsBox" v-show="isDetails">
			<van-loading color="#e4393c" size="1rem" v-show="isLoad" class="loading" />
			<div class="itemBox" v-for="(item, index) in detailsData" :key="index" v-show="!isLoad" @click="goDetails(item)">
				<img v-lazy="'http://statics.zhuishushenqi.com' + item.cover" class="cover" />
				<div class="itemBox-info">
					<h3 class="nowrap">{{item.title}}</h3>
					<p class="line2">{{item.shortIntro}}</p>
					<p>
						<van-icon name="contact" />
						{{item.author}}
						<van-tag color="#e4393c" round class="tag">{{item.majorCate}}</van-tag>
						<van-tag color="#8a8a8a" round class="tag" v-if="item.minorCate != ''">{{item.minorCate}}</van-tag>
					</p>
				</div>
			</div>
			<van-button size="large" v-show="!isLoad" @click="more" :loading="moreLoad" :disabled="moreLoad">更多</van-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'classify',
		
		data(){
			return {
				active: 0,
				// 分页上一次下标
				activeS: 0,
				// 分类数据
				classifyData: [
					{type: 'male', name: '男生', data: []},
					{type: 'female', name: '女生', data: []},
					{type: 'press', name: '出版', data: []},
					{type: 'picture', name: '漫画', data: []}
				],
				// 是否显示详情
				isDetails: false,
				// 详情变大
				isBig: false,
				// 查看详情时隐藏分类
				isShow: true,
				// 详情加载
				isLoad: true,
				// 更多加载
				moreLoad: false,
				// 详情标题
				title: '',
				// 详情数据
				detailsData: []
			}
		},
		
		methods: {
			// 切换横向标签页
			changePage(index){
				if(this.activeS == index){
					return
				}
				this.activeS = index
			},
			// 查看分类详情
			details(it, i){
				this.detailsData = []
				this.axios({
					methods: 'get',
					url: '/api/category-info?gender=' + this.classifyData[this.active].type + '&type=hot&major=' + it.name + '&start=0'
				}).then(r => {
					this.detailsData.push(...(r.data.books))
					this.isLoad = false
					if(r.data.books.length == 0){
						this.$toast('呜呜呜~没有数据~后端的锅')
						this.isLoad = true
					}
				}).catch(e => {
					console.log(e)
				})
				this.$refs.detailsBox.style.width = this.$refs['class' + i][0].offsetWidth + 'px'
				this.$refs.detailsBox.style.height = this.$refs['class' + i][0].offsetHeight + 'px'
				this.$refs.detailsBox.style.top = this.$refs['class' + i][0].offsetTop - window.scrollY + 'px'
				this.$refs.detailsBox.style.left = this.$refs['class' + i][0].offsetLeft + 'px'
				this.title = it.name
				this.isDetails = true
				setTimeout(() => {
					this.isBig = true
				}, 0)
				// setTimeout(() => {
				// 	this.isShow = false
				// }, 0)
			},
			// 返回
			back(){
				this.isBig = false
				this.isDetails = false
				this.isLoad = true
				// this.isShow = true
			},
			// 加载更多
			more(){
				this.moreLoad = true
				this.axios({
					methods: 'get',
					url: '/api/category-info?gender=male&type=hot&major=' + this.title + '&minor=&start=' + this.detailsData.length
				}).then(r => {
					this.detailsData.push(...(r.data.books))
					this.moreLoad = false
					if(r.data.books.length == 0){
						this.$toast('没有更多了哟')
					}
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
					this.$store.state.active = 1
					this.$router.push({name: 'detail'})
				})
			}
		},
		
		created(){
			this.axios({
				methods: 'get',
				url: '/zxc/cats/lv2/statistics'
			}).then(r => {
				this.classifyData[0].data = r.data.male
				this.classifyData[1].data = r.data.female
				this.classifyData[2].data = r.data.press
				this.classifyData[3].data = r.data.picture
			}).catch(e => {
				console.log(e)
			})
		}
	}
</script>

<style lang="less" scoped>
	.content{
		width: 100%;
		height: calc(~"100vh - 3.9448rem");
		overflow-y: scroll;
		.classBox{
			height: 2rem;
			line-height: 1rem;
			background: #f8f8f8;
			float: left;
			width: 45%;
			margin: 2% 0 2% 3.33%;
			position: relative;
			h3, p{
				margin: 0;
				padding-left: 0.2rem;
			}
			img{
				position: absolute;
				bottom: 0.2rem;
				box-shadow: 0 0 5PX #ececec;
			}
			img:nth-of-type(1){
				height: 1.6rem;
				right: 0.4rem;
				z-index: 3;
			}
			img:nth-of-type(2){
				height: 1.4rem;
				right: 0.8rem;
			}
			img:nth-of-type(3){
				height: 1.2rem;
				right: 0.2rem;
			}
		}
	}
	
	.loading{
		margin-top: 50%;
		margin-left: calc(~"50% - 0.5rem");
	}
	
	.tab{
		width: 100%;
		height: 1.5rem;
		position: fixed;
		left: 0;
		top: -1.5rem;
		background: #fff;
		color: #e4393c;
		z-index: 103;
		transition: all 0.5s;
		line-height: 1.5rem;
		border-bottom: 1PX solid #ececec;
		.back{
			margin: 0 0 0 0.5rem;
			vertical-align: middle;
		}
		h2{
			margin: 0;
			padding: 0 0 0 0.5rem;
			display: inline-block;
			vertical-align: middle;
		}
	}
	.tabB{
		top: 0;
	}
	
	.detailsBox{
		transition: all 0.5s;
		position: fixed;
		z-index: 102;
		background: rgba(0,0,0,0.1);
		overflow-y: scroll;
		padding-top: 1.5rem;
	}
	.detailsBoxB{
		background: #fff!important;
		width: 100%!important;
		height: calc(~"100% - 1.5rem")!important;
		left: 0!important;
		top: 0!important;
	}
	
	.itemBox{
		padding: 0.3rem;
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
			h3, p{
				padding-left: 0.2rem;
				margin: 0;
			}
			p:nth-of-type(1){
				height: 1.2rem;
				color: #8a8a8a;
			}
			.tag{
				float: right;
				margin-top: calc(~"0.3rem - 8px");
				margin-left: 0.1rem;
			}
		}
	}
</style>
