<template>
	<div style="padding-top: 1.3rem;">
		<van-nav-bar fixed @click-left="back">
			<van-icon name="arrow-left" class="back" size="0.6rem" color="#000" slot="left" />
		</van-nav-bar>
		<van-row>
			<van-col span="6" offset="2">
				<img v-lazy="'http://statics.zhuishushenqi.com' + book.cover" class="auto_img cover" />
			</van-col>
			<van-col span="14" offset="2">
				<h3>{{book.title}}</h3>
				<span class="red">{{book.author}}  </span>
				<span>|  {{book.majorCate}}</span>
				<p>{{(book.wordCount / 10000).toFixed(1) + '万字'}}</p>
			</van-col>
		</van-row>
		<van-row type="flex" justify="space-around">
			<van-col span="10" offset="2">
				<p>
					<h3 class="noMP">{{book.rating.score.toFixed(1)}}</h3>
					<van-rate :value="book.rating.score.toFixed(1)/2" readonly />
					<span>{{(book.rating.count / 10000).toFixed(1)}}万人评分</span>
				</p>
			</van-col>
			<van-col span="6">
				<h3>{{Number(book.retentionRatio).toFixed(2)}}%</h3>
				<span>读者留存</span>
			</van-col>
			<van-col span="6">
				<h3>{{(book.latelyFollower / 10000).toFixed(1)}}万</h3>
				<span>追书人气</span>
			</van-col>
		</van-row>
		<div class="desc">
			<h3>简介</h3>
			<span class="tag" v-for="(item, index) in book.tags" :key="index">{{item}}</span>
			<p v-html="desc"></p>
		</div>
		<van-cell-group>
			<van-cell is-link @click="showChapter">
				<span slot="title" style="margin-left: 10%;">目录</span>
				<p class="nowrap noMP">{{book.lastChapter}}</p>
			</van-cell>
		</van-cell-group>
		<van-button size="large" class="addBtn" @click="addBook">加入书架</van-button>
		<van-button type="danger" class="readBtn" @click="read(0)">开始阅读</van-button>
		
		<!-- 章节详情 -->
		<van-popup class="chapterPop" v-model="isShowChapter" position="right">
			<div class="nav">
				<van-row>
					<van-col span="4">
						<van-icon name="arrow-left" class="back" size="0.6rem" color="#000" @click="showChapter" />
					</van-col>
					<van-col span="16">
						<h2>{{book.title}}</h2>
					</van-col>
					<!-- <van-col span="4">
						<h3 @click="changeOrder">{{order}}</h3>
					</van-col> -->
				</van-row>
			</div>
			<van-cell v-for="(item, index) in list" :key="index" :value="(index+1) + '.' + item.title" @click="read(index)" />
		</van-popup>
	</div>
</template>

<script>
	import word from '../utils/word.js'
	
	export default {
		name: 'detail',
		
		data(){
			return {
				isShowChapter: false,
				chapterList: [],
				// 用来显示在页面的数组
				list: [],
				// order: '正序',
			}
		},
		
		computed: {
			book(){
				return this.$store.state.book
			},
			// 简介
			desc(){
				return word.word(this.$store.state.book.longIntro)
			},
			// 倒序章节列表
			fanList(){
				var arr = this.chapterList.concat()
				arr.reverse()
				return arr
			}
		},
		
		methods: {
			back(){
				this.$router.go(-1)
			},
			// 显示章节列表
			showChapter(){
				this.isShowChapter = !this.isShowChapter
			},
			// 阅读
			read(index){
				this.$store.state.readBook = this.book
				this.$store.state.readList = this.chapterList
				this.$store.state.readIndex = index
				this.$router.push({name: 'book'})
			},
			// 加入书架
			addBook(){
				var shelf = JSON.parse(localStorage.getItem("shelf"))
				if(shelf){
					if(shelf[this.book._id]){
						this.$toast('书架里已经有了哦')
						return
					}else{
						shelf[this.book._id] = this.book
						localStorage.setItem('shelf', JSON.stringify(shelf))
					}
				}else{
					shelf = {}
					shelf[this.book._id] = this.book
					localStorage.setItem('shelf', JSON.stringify(shelf))
				}
				this.$toast('已加入书架')
			},
			// 正序倒序
			// changeOrder(){
				// console.log(this.fanList)
				// if(this.order == '正序'){
				// 	this.order = '倒序'
				// }else{
				// 	this.order = '正序'
				// }
			// }
		},
		
		created(){
			this.axios({
				methods: 'get',
				url: '/zxc/mix-atoc/' + this.book._id + '?view=chapters'
			}).then(r => {
				this.chapterList = r.data.mixToc.chapters
				this.list = this.chapterList
			}).catch(e => {
				console.log(e)
			})
		}
	}
</script>

<style lang="less" scoped>
	.back{
		margin-left: 0.3rem;
	}
	.red{
		color: #e4393c;
	}
	.cover{
		box-shadow: 0 0 5PX #ececec;
	}
	.tag{
		display: inline-block;
		height: 0.5rem;
		line-height: 0.5rem;
		border-radius: 0.35rem;
		padding: 0.1rem 0.2rem;
		margin: 0.1rem;
		background: #ececec;
		color: #8a8a8a;
	}
	.desc{
		width: 83.33%;
		margin: 0 auto;
	}
	.addBtn{
		width: 50%;
		height: 1.3rem;
		position: fixed;
		left: 0;
		bottom: 0;
	}
	.readBtn{
		width: 50%;
		height: 1.3rem;
		position: fixed;
		right: 0;
		bottom: 0;
	}
	.chapterPop{
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		.nav{
			position: sticky;
			top: 0;
			left: 0;
			height: 1.3rem;
			line-height: 1.3rem;
			z-index: 100;
			background: #fff;
			*{
				vertical-align: middle;
				margin: 0;
				text-align: center;
			}
		}
	}
</style>
