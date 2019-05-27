<template>
	<div class="home">
		
		<van-search placeholder="请输入搜索关键词" v-model="searchValue" @search="search" @focus="showSearch" @cancel="noShow" :show-action="isSearch" />
		
		<router-view class="middle" />
		
		<van-tabbar v-model="active" fixed @change="changePage" active-color="#e4393c">
			<van-tabbar-item v-for="(item, index) in topNav" :key="index" :icon="item.icon" :dot="index == 0">{{item.title}}</van-tabbar-item>
		</van-tabbar>
		
		<van-popup v-model="isSearch" position="bottom" :overlay="false" class="searchPage">
			<div v-show="!isResult">
				<h2>
					搜索热词
					<van-icon name="arrow-down" :class="{icon: true, iconX: wordNum != 10}" @click="showAllWord" />
				</h2>
				<div class="hotWord">
					<span v-for="(item, index) in hotWords" :key="index" v-show="index < wordNum" @click="clickSearch(item.word)">{{item.word}}</span>
				</div>
				<h2>
					热门推荐
					<van-icon name="arrow-down" :class="{icon: true, iconX: bookNum != 6}" @click="showAllBook" />
				</h2>
				<div class="hotRec">
					<van-row>
						<van-col span="11" offset="1" v-for="(item, index) in hotBooks" :key="index" v-show="index < bookNum">
							<p class="nowrap" @click="goDetails(item.book)">{{item.word}}</p>
						</van-col>
					</van-row>
				</div>
				<h2 v-show="historyBook.length != 0">
					搜索历史
					<van-icon name="delete" class="icon" @click="deleteHistory" />
				</h2>
				<div class="history">
					<van-cell icon="clock-o" v-for="(item, index) in historyBook" :key="index">
						<div class="nowrap" @click="clickSearch(item)">{{item}}</div>
					</van-cell>
				</div>
			</div>
			<div v-show="isResult">
				<van-loading color="#e4393c" size="1rem" v-show="resultData.length == 0" class="loading" />
				<div class="itemBox" v-for="(item, index) in resultData" :key="index" @click="goDetails(item._id)">
					<img v-lazy="'http://statics.zhuishushenqi.com' + item.cover" class="cover" />
					<div class="itemBox-info">
						<h3 class="nowrap">{{item.title}}</h3>
						<p class="line2">{{item.shortIntro}}</p>
						<p>
							<van-icon name="contact" />
							{{item.author}}
							<van-tag color="#e4393c" round class="tag">{{item.cat}}</van-tag>
						</p>
					</div>
				</div>
			</div>
		</van-popup>
		
	</div>
</template>

<script>

	export default {

		name: 'home',

		data(){
			return {
				searchValue: '',
				// 分页标题
				topNav: [
					{title: '书架', icon: 'column', view: 'shelf'},
					{title: '分类', icon: 'cluster', view: 'classify'},
					{title: '排行', icon: 'hot', view: 'rank'},
					{title: '书单', icon: 'youzan-shield', view: 'list'}
				],
				active: 0,
				isSearch: false,
				hotWords: [],
				wordNum: 10,
				hotBooks: [],
				bookNum: 6,
				isResult: false,
				resultData: [],
				historyBook: []
			}
		},
		
		methods: {
			changePage(index){
				this.$router.push({name: this.topNav[index].view})
			},
			// 显示搜索页面
			showSearch(){
				this.isSearch = true
			},
			noShow(){
				this.isSearch = false
				this.isResult = false
			},
			showAllWord(){
				if(this.wordNum == 10){
					this.wordNum = this.hotWords.length
				}else{
					this.wordNum = 10
				}
			},
			showAllBook(){
				if(this.bookNum == 6){
					this.bookNum = this.hotBooks.length
				}else{
					this.bookNum = 6
				}
			},
			// 点击搜索
			clickSearch(word){
				this.searchValue = word
				this.search()
			},
			// 删除历史纪录
			deleteHistory(){
				this.$dialog.confirm({
					message: '确定要删除历史纪录吗？'
				}).then(() => {
					this.historyBook = []
					localStorage.setItem('historyBook', JSON.stringify(this.historyBook))
				}).catch(() => {})
			},
			// 搜索
			search(){
				if(this.searchValue == ''){
					return
				}
				// 历史纪录中没有就存进去
				if(this.historyBook.indexOf(this.searchValue) == -1){
					this.historyBook.push(this.searchValue)
					localStorage.setItem('historyBook', JSON.stringify(this.historyBook))
				}
				this.resultData = []
				this.axios({
					methods: 'get',
					url: '/api/search?keyword=' + this.searchValue
				}).then(r => {
					this.resultData = r.data.books
				}).catch(e => {
					console.log(e)
				})
				this.isResult = true
			},
			// 获取书籍详情
			goDetails(id){
				this.axios({
					methods: 'get',
					url: '/zxc/book/' + id
				}).then(r => {
					this.$store.state.book = r.data
					this.$router.push({name: 'detail'})
				})
			}
		},
		
		created(){
			if(this.active != this.$store.state.active){
				this.active = this.$store.state.active
			}
			// 搜索热词
			this.axios({
				methods: 'get',
				url: '/api/search-hotwords'
			}).then(r => {
				this.hotWords = r.data.searchHotWords
			}).catch(e => {
				console.log(e)
			})
			// 热门推荐
			this.axios({
				methods: 'get',
				url: '/api/hot-books'
			}).then(r => {
				this.hotBooks = r.data.newHotWords
			}).catch(e => {
				console.log(e)
			})
			// 历史纪录
			var historyBook = JSON.parse(localStorage.getItem('historyBook'))
			if(historyBook){
				this.historyBook = historyBook
			}
		}

	}
</script>

<style lang="less" scoped>
	.home{
		// padding-top: 1.4392rem;
		// padding-bottom: 1.3328rem;
		.middle{
			width: 100%;
			height: calc(~"100vh - 2.772rem");
			margin-bottom: 1.3328rem;
			overflow-y: scroll;
		}
	}
	.searchPage{
		width: 90%;
		padding: 0 5%;
		height: calc(~"100% - 1.4392rem");
		.icon{
			float: right;
			transition: all 0.5s;
		}
		.iconX{
			transform: rotateZ(180deg);
		}
		.hotWord{
			span{
				display: inline-block;
				height: 0.5rem;
				line-height: 0.5rem;
				padding: 0.2rem 0.4rem;
				margin: 0.1rem;
				background: #f5f5f5;
				border-radius: 0.45rem;
			}
		}
		.loading{
			margin-top: 50%;
			margin-left: calc(~"50% - 0.5rem");
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
	}
</style>
