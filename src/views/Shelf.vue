<template>
	<div>
		<van-row v-if="Object.keys(shelf) != 0" class="row">
			<van-col span="8" v-for="(item, index) of shelf" :key="index">
				<div class="cover">
					<img v-lazy="'http://statics.zhuishushenqi.com' + item.cover" class="auto_img" @click="read(item)" />
					<div class="cross" v-show="isDelete">
						<img src="../assets/cross.png" class="auto_img" @click="deleteBook(index)" />
					</div>
				</div>
				<p class="nowrap title">{{item.title}}</p>
			</van-col>
			<van-col span="8">
				<div class="delete">
					<img src="../assets/delete.png" class="auto_img" @click="showDelete" />
				</div>
				<p class="nowrap title">{{deleteTxt}}</p>
			</van-col>
		</van-row>
		
		<div class="null" v-else>
			<img src="../assets/shelf.png" />
			<h2>空空如也...</h2>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'shelf',
		
		data(){
			return {
				isDelete: false,
				deleteTxt: '编辑'
			}
		},
		
		computed: {
			shelf(){
				return this.$store.state.shelf
			}
		},
		
		methods: {
			// 阅读
			read(item){
				this.axios({
					methods: 'get',
					url: '/zxc/mix-atoc/' + item._id + '?view=chapters'
				}).then(r => {
					this.$store.state.readBook = item
					this.$store.state.readList = r.data.mixToc.chapters
					this.$store.state.readIndex = 0
					this.$store.state.active = 0
					this.$router.push({name: 'book'})
				}).catch(e => {
					console.log(e)
				})
			},
			// 编辑
			showDelete(){
				if(this.isDelete){
					this.deleteTxt = '编辑'
				}else{
					this.deleteTxt = '完成'
				}
				this.isDelete = !this.isDelete
			},
			// 删除书籍
			deleteBook(index){
				this.$dialog.confirm({
					message: '确定要删除这本书吗？'
				}).then(() => {
					delete this.shelf[index]
					localStorage.setItem('shelf', JSON.stringify(this.shelf))
					this.$toast('已删除')
				}).catch(() => {})
			}
		},
		
		created(){
			var shelf = JSON.parse(localStorage.getItem("shelf"))
			if(shelf){
				this.$store.state.shelf = shelf
			}else{
				this.$store.state.shelf = []
			}
		}
	}
</script>

<style lang="less" scoped>
	.row{
		padding: 0.4rem 0;
	}
	.cover{
		width: 1.8rem;
		height: 2.4rem;
		box-shadow: 0 0 5PX #8a8a8a;
		margin: 0 auto;
		overflow: hidden;
		position: relative;
	}
	.cross{
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.2);
		z-index: 100;
		img{
			width: 0.9rem;
			margin: 0.6rem auto;
		}
	}
	.delete{
		width: 1.8rem;
		height: 2.4rem;
		background: #f5f5f5;
		margin: 0 auto;
		overflow: hidden;
		img{
			width: 0.9rem;
			margin: 0.7rem auto;
		}
	}
	.title{
		width: 1.8rem;
		margin-left: auto;
		margin-right: auto;
	}
	.null{
		text-align: center;
		margin: 50% auto;
	}
</style>
