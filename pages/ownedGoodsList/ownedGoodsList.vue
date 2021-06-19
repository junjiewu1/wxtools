<template>
	<view @click="checkboxChange">
		<view @click="gotoCreateGoods" style="background-color: #07C160; text-align: center;width: 720rpx;margin: 20rpx auto; line-height: 60rpx;font-size: 28rpx; border-radius: 4rpx;color: #FFFFFF;display: flex;align-items: center;justify-content: center;" >
			<image src="../../static/image/add-f.png" style="width: 30rpx; height: 30rpx;margin-right: 6rpx;"></image>
			<text>添加商品</text>
			</view>
		<view class="a-section a-popular"  v-if="ownedGoodsList.length">
		<view class="b" style="margin-bottom: 200rpx;" >
			<checkbox-group style="display: flex; flex-wrap: wrap; align-items: center; width: 720rpx;margin: 20rpx auto;" class="item" @change.stop="checkboxChange">
				<van-swipe-cell  :right-width="65"   v-for="(item, index) in ownedGoodsList" :key="index"  style="margin: 20rpx 0; ">
					<image class="img" :src="item.picUrl" background-size="cover" @click="gotoEditGoods(item.id)"></image>
					<view class="right">
					<view class="text">
						<text class="name">{{item.name}}</text>
						<text class="desc">{{item.brief}}</text>
						<text class="price">￥{{item.counterPrice}}</text>
					</view>
					<checkbox v-if="mode=='promotion'" :value="item.id" color=#007AFF  :checked="item.checked" style="margin-top: 40rpx;" />
					</view>
					 <view slot="right" @click.stop ="swipelClick(item,index)" style="width: 80rpx;height: 80rpx;background-color: #ee0a24;
					 line-height: 80rpx; color: #FFFFFF; text-align: center; margin-top: 20rpx; font-size: 28rpx;">删除</view>
				</van-swipe-cell>
			</checkbox-group>
		</view>
		</view>
		<view v-else style="text-align: center; color: #7c7c7c;line-height: 200rpx; font-size: 30rpx; width: 100%; background-color: #FFFFFF;" >暂时没有任何商品~</view>
		<view class="bottomBar" v-if="mode=='promotion'">
			<checkbox style="width: 200rpx;text-align: center;vertical-align; line-height: 90rpx;color: #11A342;background-color: #FFFFFF;" :checked="allChecked"  @click="allCheckedChange" >全选</checkbox>
			<view :class="{'active': isactive}" class="confimBtn" @click="confimClick" >确认选择 {{checkbox.length? checkbox.length:0}} 个商品</view>
		</view>
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {storeRequest} from "../../network/store.js";
	import { mapState, mapMutations } from 'vuex'
	import vanSwipeCell from '../../wxcomponents/vant/swipe-cell'
	const app = getApp()
	export default {
		data() {
			return {
				page:1,
				topicId:null,
				ownedGoodsList:[],
				endRes: false,
				loading: false,
				mode:null,
				checkbox:[],
				allChecked:false
			}
		},
		computed:{
			...mapState(['checkItems']),
			isactive(){
				if(this.checkbox&&this.checkbox.length){
					return true
				}else{
					return false
				}
			},
		},
		components:{vanSwipeCell},
		onLoad(options) {
			// this.topicCode = 10001
			this.topicId = options.topicId
			this.mode = options.mode
			
		},
		onShow() {
			this.ownedGoodsList=[]
			this.get_OwnedGoodsList()
			this.checkItems.forEach(item=>{
				this.checkbox.push(item.id)
			})
		},
		onReachBottom(){
			if(!this.loading&&!this.endRes){
				this.page++
				this.get_OwnedGoodsList()
			}
		},
		methods: {
			...mapMutations(['changeCheckItems']),
			async get_OwnedGoodsList(){
				this.loading = true
				var a =[]
				for(let i = 1; i<=this.page; i++){
					let res = await storeRequest.get_OwnedGoodsList({page:i},this.topicId, app.globalData.token)
					if(res.data.res.length<10) this.endRes = true
					a =  [...a, ...res.data.res]
					if(i==this.page){
						this.ownedGoodsList = a
						this.loading = false
						this.checkItems.forEach((item2,index2)=>{
							this.ownedGoodsList.forEach((item1,index1)=>{
								if(item1.id == item2.id){
										item1.checked = true
								}
							})
						})
						// this.ownedGoodsList.forEach((item1,index1)=>{
						// 	if(this.checkItems.length){
						// 		this.checkItems.forEach((item2,index2)=>{
						// 			if(item1.id == item2.id){
						// 				item1.checked = true
						// 			}else{
						// 				item1.checked = false
						// 			}
						// 		})
						// 	}else{
						// 		item1.checked = false
						// 	}
						// })
					}
				}
			},
			gotoCreateGoods(){
				uni.navigateTo({
					url:`/pages/addGoods/addGoods?topicId=${this.topicId}`
				})
			},
			gotoEditGoods(id){
				uni.navigateTo({
					url:`/pages/addGoods/addGoods?topicId=${this.topicId}&goodsId=${id}`
				})
			},
			swipelClick(item,index){
				uni.showModal({
				    title: '提示',
				    content: '确定要删除此商品吗',
				    success: (res)=>{
				        if (res.confirm) {
				            storeRequest.delete(item.id, app.globalData.token)
				            .then(res=>{
				            	uni.showToast({
				            		title:'删除成功'
				            	})
				            })
				        }
				    }
				});
			},
			checkboxChange(e){
				// e.detail.value.forEach(item1=>{
				// 	this.ownedGoodsList.forEach(item2=>{
				// 		// if(item1 == item2.id)
				// 	})
				// })
				this.checkbox = e.detail.value
			},
			confimClick(){
				var i = []
				this.checkbox.forEach(item1=>{
					this.ownedGoodsList.forEach(item2=>{
						if(item1 == item2.id){
							i.push(item2)
						}
					})
				})
				this.changeCheckItems(i)
				uni.navigateBack()
			},
			// allCheckedChange(e){
			// 	this.allChecked = !this.allChecked
			// 	if(this.allChecked){
			// 		this.checkbox = []
			// 		this.ownedGoodsList.forEach(item=>{
			// 			item.checked = true
			// 			this.checkbox.push(item.id)
			// 		})
			// 	}else{
			// 		this.checkbox = []
			// 		this.ownedGoodsList.forEach(item=>{
			// 			item.checked = false
			// 			this.checkbox.push(item.id)
			// 		})
			// 	}
			// }
		}
	}
</script>

<style>
.a-section {
  width: 750rpx;
  height: auto;
  overflow: hidden;
  background: #fff;
  color: #333;
  margin-top: 20rpx;
}

.a-popular {
  width: 750rpx;
  height: auto;
  overflow: hidden;
}

.a-popular .b .item {
  margin: 10rpx 20rpx;
  width: 710rpx;
  display: flex;
  align-items: center;
}

.a-popular .b .img {
  float: left;
  width: 160rpx;
  height: 160rpx;
}

.a-popular .b .right {
  float: left;
  width: 530rpx;
  display: flex;
  flex-flow: row nowrap;
  margin-left: 20rpx;
}

.a-popular .b .text {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
 width: 530rpx;
}

.a-popular .b .name {
  width: 530rpx;
  display: block;
  color: #333;
  line-height: 50rpx;
  font-size: 30rpx;
}

.a-popular .b .desc {
  width: 530rpx;
  display: block;
  color: #999;
  line-height: 50rpx;
  font-size: 25rpx;
}

.a-popular .b .price {
  width: 530rpx;
  display: block;
  color: #ff2d03;
  line-height: 50rpx;
  font-size: 33rpx;
}
 .bottomBar{
	z-index: 2;
	position: fixed;
	bottom: 0;
	left: 50%;
	height: 90rpx;
	width:	680rpx;
	border-radius: 10rpx;
	margin: 0 auto;
	background-color: #fbfcff;
	display: flex;
	align-items: center;
	 box-shadow: 0 5px 15px rgba(45,50,55,.2); 
	transform: translate(-50%,-50%);
 }
 .active{
	 background-color: #07C160 !important;
	 color:#FFFFFF !important;
 }
 .confimBtn{
	width: 480rpx;
	text-align: center;
	line-height: 90rpx;
	background-color: #c5c5c5;
	color: #FFFFFF;
 }
</style>
