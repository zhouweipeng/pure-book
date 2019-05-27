<template>
	<div>
		<div class="topNavBox">
			<van-row class="topNav">
				<van-col span="6" v-for="(item, index) in topNavText" :key="index">
					<div :class="{page: true, active: tIndex==index}" @click="changePage(item, index)">
						{{item.title}}
					</div>
				</van-col>
				<van-col span="4" offset="2">
					<div class="page" @click="screenPop">
						筛选
						<van-icon name="arrow-down" color="#e4393c" size="12px" style="transition:all .5s;" :class="{icon: isScreen}" />
					</div>
				</van-col>
			</van-row>
		</div>
		
		<!-- 筛选popup -->
		<van-popup v-model="isScreen" position="bottom" class="screenBox">
			<h2>分类</h2>
			<div class="screenClass">
				<span :class="{screen: true, select: type1Index == index}" v-for="(item, index) in screenType1" :key="index" @click="select1(index)">{{item.name}}</span>
			</div>
			<div class="screenClass">
				<span :class="{screen: true, select: type2Index == index}" v-for="(item, index) in screenType2" :key="index" @click="select2(index)">{{item.name}}</span>
			</div>
			<div class="screenClass" v-if="type2Index != -1">
				<span :class="{screen: true, select: type3Index == index}" v-for="(item, index) in screenType2[type2Index].tags" :key="index" @click="select3(index)">{{item}}</span>
			</div>
			<van-button size="large" type="danger" @click="screenThen">确定</van-button>
		</van-popup>
		
		<!-- 书单列表 -->
		<div class="content">
			<van-loading color="#e4393c" size="1rem" v-show="isLoad" class="loading" />
			<div class="itemBox" v-for="(item, index) in bookLists" :key="index" v-show="!isLoad" :ref="'list' + index" @click="listDetails(item, index)">
				<p class="nowrap">{{item.title}}</p>
				<p class="line2">{{item.desc}}</p>
				<p class="nowrap">{{item.bookCount}}本 | {{item.collectorCount}}收藏</p>
				<img v-lazy="'http://statics.zhuishushenqi.com' + item.covers[0]" />
				<img v-lazy="'http://statics.zhuishushenqi.com' + item.covers[1]" />
				<img v-lazy="'http://statics.zhuishushenqi.com' + item.covers[2]" />
			</div>
			<van-button size="large" class="moreBtn" v-show="!isLoad" :loading="moreLoad" :disabled="moreLoad" @click="more">更多</van-button>
		</div>
		
		<!-- 返回 -->
		<div :class="{tab: true, tabB: isBig}">
			<van-icon name="arrow-left" size="18PX" class="back" @click="back" />
			<h2>书单详情</h2>
		</div>
		
		<!-- 详情 -->
		<div :class="{detailsBox: true, detailsBoxB: isBig}" ref="detailsBox" v-show="isDetails">
			<div class="author">
				<h3 class="nowrap">{{detailsData.title}}</h3>
				<p class="line2">{{detailsData.desc}}</p>
			</div>
			<div v-for="(item, index) in detailsData.books" :key="index" class="listsBook" @click="goDetails(item.book)">
				<img v-lazy="'http://statics.zhuishushenqi.com' + item.book.cover" />
				<div class="fr">
					<p>{{item.book.title}}</p>
					<p>
						<van-icon name="contact" />
						{{item.book.author}}
					</p>
					<p>{{item.book.cat}}  {{(item.book.wordCount / 10000).toFixed(1) + '万字'}}</p>
				</div>
				<p class="comment">{{item.comment}}</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'list',
		
		data(){
			return {
				// 分页标题
				topNavText: [
					{title: '本周最热', query: 'duration=last-seven-days&sort=collectorCount'},
					{title: '最新发布', query: 'duration=all&sort=created'},
					{title: '最多收藏', query: 'duration=all&sort=collectorCount'},
				],
				// 分页下标
				tIndex: 0,
				// 筛选
				isScreen: false,
				// 筛选种类
				screenType1: [
					{name: '全部', query: ''},
					{name: '男生', query: 'male'},
					{name: '女生', query: 'female'},
					{name: '出版', query: 'press'},
				],
				type1Index: 0,
				screenType2: [],
				type2Index: -1,
				type3Index: -1,
				// 书单列表数据
				bookLists: [],
				isLoad: true,
				moreLoad: false,
				isDetails: false,
				isBig: false,
				detailsData: {}
			}
		},
		
		methods: {
			changePage(item, index){
				this.tIndex = index
				this.getBookList(0)
			},
			// 筛选弹出框
			screenPop(){
				this.isScreen = true
			},
			// 选择
			select1(index){
				if(this.type1Index == index){
					this.type1Index = -1
				}else{
					this.type1Index = index
				}
			},
			select2(index){
				if(this.type2Index == index){
					this.type2Index = -1
				}else{
					this.type2Index = index
				}
				this.type3Index = -1
			},
			select3(index){
				if(this.type3Index == index){
					this.type3Index = -1
				}else{
					this.type3Index = index
				}
			},
			// 确定筛选
			screenThen(){
				this.isScreen = false
				this.bookLists = []
				this.getBookList(0)
			},
			// 获取书单
			getBookList(start, isAdd){
				this.isLoad = true
				var duration = this.topNavText[this.tIndex].query
				var tag = this.type3Index == -1 ? '' : (this.screenType2[this.type2Index].tags)[this.type3Index]
				var gender = this.screenType1[this.type1Index].query
				this.axios({
					methods: 'get',
					url: '/zxc/book-list?' + duration + '&start=' + start + '&tag=' + tag + '&gender=' + gender
				}).then(r => {
					if(r.data.bookLists.length == 0){
						this.$toast('没有数据了哟~后端的锅')
						this.isLoad = false
						return
					}
					if(isAdd){
						this.bookLists.push(...(r.data.bookLists))
						this.moreLoad = false
					}else{
						this.bookLists = r.data.bookLists
					}
					this.isLoad = false
				}).catch(e => {
					console.log(e)
				})
			},
			// 加载更多
			more(){
				this.moreLoad = true
				this.getBookList(this.bookLists.length, true)
			},
			// 书单详情
			listDetails(item, index){
				this.detailsData = {}
				this.axios({
					methods: 'get',
					url: '/zxc/book-list/' + item._id
				}).then(r => {
					// console.log(r.data.bookList)
					this.detailsData = r.data.bookList
				}).catch(e => {
					console.log(e)
				})
				this.$refs.detailsBox.style.width = this.$refs['list' + index][0].offsetWidth + 'px'
				this.$refs.detailsBox.style.height = this.$refs['list' + index][0].offsetHeight + 'px'
				this.$refs.detailsBox.style.top = this.$refs['list' + index][0].offsetTop - window.scrollY + 'px'
				this.$refs.detailsBox.style.left = this.$refs['list' + index][0].offsetLeft + 'px'
				this.isDetails = true
				setTimeout(() => {
					this.isBig = true
				}, 0)
			},
			// 返回
			back(){
				this.isBig = false
				this.isDetails = false
			},
			// 获取书籍详情
			goDetails(item){
				this.axios({
					methods: 'get',
					url: '/zxc/book/' + item._id
				}).then(r => {
					this.$store.state.book = r.data
					this.$store.state.active = 3
					this.$router.push({name: 'detail'})
				})
			}
		},
		
		created(){
			this.axios({
				methods: 'get',
				url: '/zxc/book-list/tagType'
			}).then(r => {
				this.screenType2 = r.data.data
				this.getBookList(0)
			}).catch(e => {
				console.log(e)
			})
		}
	}
</script>

<style lang="less" scoped>
	.topNavBox{
		width: 90%;
		margin: 0 auto;
		.topNav{
			.page{
				height: 0.8rem;
				background: #fff;
				border-radius: 0.4rem;
				text-align: center;
				line-height: 0.8rem;
				transition: all 0.5s;
			}
			.active{
				background: #e4393c;
				color: #fff;
			}
		}
	}
	
	.icon{
		transform: rotateZ(180deg);
	}
	
	.screenBox{
		h2{
			padding: 0 0.2rem;
		}
		.screenClass{
			margin-bottom: 0.4rem;
		}
		.screen{
			display: inline-block;
			height: 0.8rem;
			background: #ececec;
			padding: 0 0.2rem;
			margin: 0.2rem;
			border-radius: 0.4rem;
			text-align: center;
			line-height: 0.8rem;
		}
		.select{
			background: #e4393c;
			color: #fff;
		}
	}
	
	.loading{
		margin-top: 50%;
		margin-left: calc(~"50% - 0.5rem");
	}
	.moreBtn{
		display: block;
		width: 90%;
		margin: 0 auto;
	}
	
	.content{
		height: calc(~"100vh - 3.572rem");
		overflow-y: scroll;
		.itemBox{
			height: 3.6rem;
			line-height: 0.7rem;
			background: #f8f8f8;
			width: 90%;
			margin: 0.2rem auto;
			position: relative;
			p{
				margin: 0;
				padding-left: 0.2rem;
				width: 60%;
				color: #8a8a8a;
			}
			p:nth-of-type(1){
				color: #000;
				padding-top: 0.4rem;
			}
			p:nth-of-type(2){
				height: 1.387rem;
			}
			img{
				position: absolute;
				box-shadow: 0 0 5PX #ececec;
			}
			img:nth-of-type(1){
				height: 2.4rem;
				right: 0.7rem;
				top: 0.6rem;
				z-index: 3;
			}
			img:nth-of-type(2){
				height: 2.2rem;
				right: 1.4rem;
				top: 0.7rem;
			}
			img:nth-of-type(3){
				height: 2.2rem;
				right: 0.2rem;
				top: 0.7rem;
			}
		}
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
		>div{
			width: 90%;
			margin: 0 auto;
			padding: 0.2rem;
		}
		.listsBook{
			margin-bottom: 0.2rem;
			background: #f8f8f8;
			img{
				height: 3rem;
				vertical-align: middle;
			}
			.fr{
				height: 3rem;
				line-height: 1rem;
				vertical-align: middle;
				display: inline-block;
				p{
					margin: 0;
					padding-left: 0.3rem;
				}
			}
			.comment{
				line-height: 0.8rem;
				margin-bottom: 0;
			}
		}
	}
	.detailsBoxB{
		background: #fff!important;
		width: 100%!important;
		height: calc(~"100% - 1.5rem")!important;
		left: 0!important;
		top: 0!important;
	}
</style>
