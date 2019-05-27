<template>
	<div>
		
		<!-- 内容 -->
		<van-pull-refresh v-model="isLoading" @refresh="preChapter" pulling-text="上一章" loosing-text="上一章">
			<div class="content" @click="showPanel" :style="divStyle">
				<h3>{{readList[readIndex].title}}</h3>
				<p v-for="(item, index) in txt" :key="index" :style="pStyle">{{item}}</p>
				<van-cell is-link :style="divStyle" @click.stop="nextChapter">
					<span :style="divStyle">下一章</span>
				</van-cell>
			</div>
		</van-pull-refresh>
		
		<!-- 标题栏 -->
		<van-popup v-model="isShowSet" position="top" class="panel" :overlay="false">
			<van-nav-bar class="topPanel" @click-left="back">
				<div slot="left">
					<van-icon name="arrow-left" color="#fff" />
					<h3>{{readBook.title}}</h3>
				</div>
			</van-nav-bar>
		</van-popup>
		
		<!-- 设置面板 -->
		<van-popup v-model="isShowSet" position="bottom" class="bottomPanel panel" :overlay="false">
			<van-row type="flex" justify="space-around">
				<van-col span="6">
					<van-button type="default" :class="{btn: true}" @click="reduceSize">Aa-</van-button>
				</van-col>
				<van-col span="6">
					<h2 class="btn">{{style.size}}</h2>
				</van-col>
				<van-col span="6">
					<van-button type="default" :class="{btn: true}" @click="addSize">Aa+</van-button>
				</van-col>
			</van-row>
			<van-row type="flex" justify="space-around">
				<van-col span="5" v-for="(item, index) in bgArr" :key="index">
					<van-button type="default" :class="{btn: true, active: bgIndex == index}" :style="'background:' + item" @click="changeBg(item, index)"></van-button>
				</van-col>
			</van-row>
			<van-row type="flex" justify="space-around">
				<van-col span="5">
					<van-button type="default" :class="{btn: true}" @click="showList">
						<van-icon name="bars" size="0.6rem" style="margin-top: 0.15rem;" />
					</van-button>
				</van-col>
				<van-col span="5" v-for="(item, index) in marginArr" :key="index">
					<van-button type="default" :class="{btn: true, active: marginIndex == index}" @click="changeMargin(item.margin, index)">{{item.txt}}</van-button>
				</van-col>
			</van-row>
		</van-popup>
		
		<!-- 章节列表 -->
		<van-popup v-model="isShowList" class="list" position="left">
			<h2 style="padding-left: 0.4rem;">{{readBook.title}}</h2>
			<van-cell v-for="(item, index) in readList" :key="index" @click="changeChapter(index)">
				<div :class="{reading: readIndex == index}">{{index+1}}.{{item.title}}</div>
			</van-cell>
		</van-popup>
		
	</div>
</template>

<script>
	import word from '../utils/word.js'
	
	export default {
		name: 'book',
		
		data(){
			return {
				txt: '',
				isShowSet: false,
				bgArr: [
					'#fff',
					'#ccffcc',
					'#deb887',
					'#000'
				],
				bgIndex: 0,
				marginArr: [
					{txt: '三', margin: 12},
					{txt: '二', margin: 16},
					{txt: '一', margin: 20}
				],
				marginIndex: 1,
				isShowList: false,
				isLoading: false
			}
		},
		
		computed: {
			readBook(){
				return this.$store.state.readBook
			},
			readList(){
				return this.$store.state.readList
			},
			readIndex(){
				return this.$store.state.readIndex
			},
			style(){
				return this.$store.state.style
			},
			// div风格
			divStyle(){
				var style = `
					background: ${this.style.bg};
					font-size: ${this.style.size}PX;
					color: ${this.style.color};
				`
				return style
			},
			// p风格
			pStyle(){
				var style = `
					margin-top: ${this.style.margin}PX;
					margin-bottom: ${this.style.margin}PX;
				`
				return style
			}
		},
		
		methods: {
			// 获取章节详情
			getChapter(){
				var link = encodeURIComponent(this.readList[this.readIndex].link)
				this.axios({
					methods: 'get',
					url: '/read/chapter/' + link
				}).then(r => {
					this.txt = word.read(r.data.chapter.body)
					this.isLoading = false
				}).catch(e => {
					console.log(e)
				})
			},
			// 返回
			back(){
				this.$router.go(-1)
			},
			// 展示设置面板
			showPanel(){
				this.isShowSet = !this.isShowSet
			},
			// 调整字体大小
			reduceSize(){
				if(this.style.size == 12){
					return this.$toast('太小了对眼睛不好哟')
				}
				this.style.size -= 1
			},
			addSize(){
				if(this.style.size == 24){
					return this.$toast('啊太大了')
				}
				this.style.size += 1
			},
			// 换背景颜色
			changeBg(item, index){
				if(index == 3){
					this.style.color = 'gray'
				}else{
					this.style.color = '#000'
				}
				this.bgIndex = index
				this.style.bg = item
			},
			// 换行间距
			changeMargin(num, index){
				this.marginIndex = index
				this.style.margin = num
			},
			// 展示章节列表
			showList(){
				this.isShowList = true
				this.isShowSet = false
			},
			// 切换章节
			changeChapter(index){
				this.$store.state.readIndex = index
				this.getChapter()
				this.isShowList = false
				window.scrollTo(0, 0)
			},
			// 下一章
			nextChapter(){
				if(this.readIndex == this.readList.length-1){
					return this.$toast('已经没有了')
				}
				this.$store.state.readIndex += 1
				this.getChapter()
				window.scrollTo(0, 0)
			},
			// 上一章
			preChapter(){
				if(this.readIndex == 0){
					setTimeout(() => {
						this.isLoading = false
					}, 0)
					this.$toast('已经没有了')
					return
				}
				this.$store.state.readIndex -= 1
				this.getChapter()
			}
		},
		
		created(){
			this.getChapter()
		}
	}
</script>

<style lang="less" scoped>
	.content{
		padding: 0.4rem;
		p{
			text-indent:2em;
		}
	}
	
	.panel{
		width: 100%;
		background: rgba(0, 0, 0, 0.8);
		color: #fff;
	}
	.topPanel{
		color: #fff;
		background: rgba(0, 0, 0, 0.8);
		h3{
			display: inline-block;
			margin: 0 0 0 0.2rem;
		}
	}
	.bottomPanel{
		*{
			text-align: center;
			color: #fff;
		}
		.btn{
			display: block;
			height: 1rem;
			line-height: calc(~"1rem - 6PX");
			width: 2rem;
			margin: 0.5rem auto;
			border-radius: 0.2rem;
			background: rgba(0, 0, 0, 0.8);
			box-sizing: border-box;
			border: 3PX solid gray;
		}
		.active{
			border-color: #e4393c;
		}
	}
	
	.list{
		width: 80%;
		height: 100%;
		.reading{
			color: #e4393c;
		}
	}
</style>
