<template>
	<view id="secKill">
		<view class="secKill-header">
			<view style="width: 100%; padding-right: 20rpx;">
				<view style="display: flex; justify-content: space-between; align-items: center;">
					<view style="width: 600rpx;border-right: 0.1rpx solid #e8e8e8;">
							<text class="itage" style="margin-right: 10rpx;">团购</text>{{promotion.title}}
					</view>
					<button size="mini" open-type="share" style="background-color: #f5f6fa;">
						<image src="../../static/image/share2.png" style="width: 30rpx;height: 30rpx;"  ></image>
					</button>
				</view>
				
				<view class="SHL" style="margin: 6rpx 0;">活动时间: {{promotion.createdTime}} ~ {{promotion.endTime}}</view>
				<view class="SHL">{{item.content}}</view>
			</view>
				
		</view>
		<view>
			<image  v-for="(item, index) in promotion.files" :key="index" :src="item.url" class="projectImg" mode="widthFix" @click="CpreviewImage(index)"></image>

		</view>
		
		<view style="padding-bottom: 200rpx;">
			<view class="cutdonwnBar" v-if="cutdownStatus == 'unstart'"  style="background-color: #04b40a;">
				<view style="display: flex;align-items: center;">
					<image src="../../static/image/clock.png" style="width: 40rpx;height: 40rpx;"></image>
					<view style="margin-left: 10rpx;">限时秒杀</view>
				</view>
				<view >
					距离开始还有<u-count-down :timestamp="timestamp" separator="zh"  ></u-count-down>	
				</view>
			</view>
			<view class="cutdonwnBar" v-if="cutdownStatus == 'active'" style="background-color: #ff4811;">
				<view style="display: flex;align-items: center;">
					<image src="../../static/image/clock.png" style="width: 40rpx;height: 40rpx;"></image>
					<view style="margin-left: 10rpx;">限时秒杀</view>
				</view>
				<view >
					距离结束还有<u-count-down :timestamp="timestamp" separator="zh"  ></u-count-down>	
				</view>
			</view>
			<view class="cutdonwnBar" v-if="cutdownStatus == 'finished'" style="background-color: #959595;" >
				<view style="display: flex;align-items: center;">
					<image src="../../static/image/clock.png" style="width: 40rpx;height: 40rpx;"></image>
					<view style="margin-left: 10rpx;">限时秒杀</view>
				</view>
				<view >
					已结束
				</view>
			</view>
				<view v-for="(item1,index1) in promotion.goods" :key="index1"> 
					<van-card v-for="(item2,index2) in item1.products" :key="index2" :origin-price="item1.counterPrice" :price="item2.price"  :title="item1.name" :thumb="item1.picUrl">
					  <view slot="price-top" >
						  <view style="float: right;">
							 <view  class="selnum" v-if="item2.count">
								 <view class="cut" @click="cutNumber(index1,index2)">-</view>
								 <input :value="item2.count" class="number" disabled="true" type="number" />
								 <view class="add" @click="addNumber(index1,index2)">+</view>
							 </view>
							 <image v-else src="../../static/image/add3.png" style="width: 30rpx;height: 30rpx;" @click="addImageClick(index1,index2)"></image>
						  </view>
					  </view>
					  <view slot="desc">
						<view>{{item2.specifications[0]}}</view>
						<view>库存:{{item2.number}}</view>
					  </view>
					</van-card>
				</view>
				
				<view class="bottomBar">
					 <view style="margin-left: 30rpx;">
						 <view>合计:{{totalPrice}}</view> 	
					 </view>
					 <view v-if="totalPrice && cutdownStatus=='active' " style="background-color: #ff5100;padding: 20rpx 40rpx;color: #FFFFFF;" @click="gotoCheckedUp">
					 	参与团购
					 </view>
					 <view v-else style="background-color: #aaaaaa;padding: 20rpx 40rpx;color: #FFFFFF;"> 
						参与团购
					 </view>
				</view>
		</view>
		
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {storeRequest} from "../../network/store.js";
	import {timeStamp} from '../../utils/common.js'
	const app = getApp()
	import vanTab from '../../wxcomponents/vant/tab';
	import vanTabs from '../../wxcomponents/vant/tabs';
	import vanCard from '../../wxcomponents/vant/card';
	import uCountDown from '../../components/u-views/u-count-down.vue'
	import vanIcon from '../../wxcomponents/vant/icon'
	
	
	export default {
		data() {
			return {
				topicId:null,
				promotionId:null,
				owned:false,
				timestamp: 0,
				number: 0,
				promotion:null,
				cutdownStatus:'',
				totalPrice:0,
				products:[]
			}
		},
		components:{vanTab, vanTabs, vanCard, uCountDown, vanIcon},
		onLoad(options) {
			this.topicId = options.topicId
			this.promotionId = options.promotionId
			this.getposts()
		},
		onShow() {
			this.get_ref_promotion()
		},
		methods: {
			// addImageClick(index1,index2){
				// var id = this.promotion.goods[index1].products[index2].id
				// var product = {
				// 	number:1,
				// 	id:parseInt(id) 
				// }
				// storeRequest.addCart({product:product}, app.globalData.token)
				// .then(res=>{
				// 	uni.showToast({
				// 		title:'加购成功'
				// 	})
				// })
				// .catch(err=>{
				// 	uni.showToast({
				// 		title:'加购失败',
				// 		icon:'none'
				// 	})
				// })
				
			// },
			addImageClick(index1,index2){
				this.promotion.goods[index1].products[index2].count+=1
				this.totalPrice +=  this.promotion.goods[index1].products[index2].price
				var prodect = this.promotion.goods[index1].products[index2]
				this.products.push(prodect)
			
			},
			cutNumber(index1,index2){
		
				this.totalPrice -=  this.promotion.goods[index1].products[index2].price
				var prodect = this.promotion.goods[index1].products[index2]
				var i = this.products.findIndex(item=>item.id == prodect.id)
				if(this.products[i].count==1){
					this.products.splice(i,1)
				}else{
					this.products[i].count -= 1
				}
		
			},
			addNumber(index1,index2){
				
				this.totalPrice +=  this.promotion.goods[index1].products[index2].price
				var prodect = this.promotion.goods[index1].products[index2]
				var i = this.products.findIndex(item=>item.id == prodect.id)
				this.products[i].count += 1
				
			},
			gotoCheckedUp(){
				
			},
			onShareAppMessage(e) {
			     if(e.from=="button" ){
						return {
				          title: `${this.topicsInfo.topic}`,
				          path: `/pages/topics/topics?topicId=${this.topicId}`,
					     }
			    }else{
			      return {
			                title: `云中助手`,
			                path: `/pages/index/index`,
			                imageUrl: '../../static/image/welcome.png'
			              }
			    }
			},
			getposts(){
				postsRequest.getposts(this.topicId, app.globalData.token)
				.then((res)=>{
					this.topicsInfo = res.data.topic
					this.owned = res.data.topic.owned
				})
				.catch(err=>{  
					console.log('getpostsERR', err)
					setTimeout(()=>{
						this.getposts()
					},500)
				})
			},
			get_ref_promotion(){
				storeRequest.getPromotion(this.promotionId, app.globalData.token)
				.then(res=>{
					this.promotion = res.data.promotion
					var now = new Date().getTime()
					var beginTime = timeStamp(res.data.promotion.beginTime)
					var endTime = timeStamp(res.data.promotion.endTime)
					if(beginTime-now>0){ //未开始
						this.timestamp = (beginTime-now)/1000
						this.cutdownStatus = 'unstart'
					}else if(endTime-now>0){ //已开始未结束
						this.timestamp = (endTime-now)/1000
						this.cutdownStatus = 'active'
					}else{ //已结束
						this.timestamp = 0
						this.cutdownStatus = 'finished'
					}
					this.promotion.goods.forEach((item1,index1)=>{
						item1.products.forEach((item2,index2)=>{
							item2.count = 0
						})
					})
				})
			},
			CpreviewImage(index){
				let previewImage = []
				this.taskInfo.files.forEach((item)=>{
					previewImage.push(item.url)
				})
				uni.previewImage({
					urls: previewImage,
					current: index,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏']
					}
				});
			},
		}
	}
</script>

<style scoped>
	page{
		background-color: #FFFFFF ;
	}
	#secKill{
		width: 720rpx;
		margin: 30rpx auto;
	}
	button::after {
	   border: none;
	}
	.secKill-header{
		display: flex;
		align-items: center;
		margin: 20rpx 0;
	}
	.HL{
		font-weight: 600;
		font-size: 34rpx;
	}
	.SHL{
		font-weight: 400;
		font-size: 24rpx;
		color: #7c7c7c;
	}
	
	.cutdonwnBar{
		width: 700rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 10rpx;
		font-size: 28rpx;
		color: #FFFFFF;
	}
	.selnum {
	  width: 165rpx;
	  height: 40rpx;
	  border: 1rpx solid #ccc;
	  display: flex;
	}
	.selnum .cut {
	  width: 50rpx;
	  height: 100%;
	  text-align: center;
	  line-height: 40rpx;
	}
	
	.selnum .number {
	  flex: 1;
	  height: 100%;
	  text-align: center;
	  line-height: 40rpx;
	  border-left: 1px solid #ccc;
	  border-right: 1px solid #ccc;
	  float: left;
	}
	
	.selnum .add {
	  width: 50rpx;
	  height: 100%;
	  text-align: center;
	  line-height: 40rpx;
	}
	
	.attr-pop-box {
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  background: rgba(0, 0, 0, 0.5);
	  z-index: 8;
	  bottom: 0;
	  /* display: none; */
	}
	.projectImg {
		display: block;
		width: 100%;
		margin: 20rpx auto;
	}
	.attr-pop {
	  width: 100%;
	  padding: 30rpx;
	  background: #fff;
	  position: fixed;
	  z-index: 9;
	  bottom: 120rpx;
	  box-sizing: border-box;
	}
	
	.attr-pop .close {
	  position: absolute;
	  width: 48rpx;
	  height: 48rpx;
	  right: 31.25rpx;
	  overflow: hidden;
	  top: 31.25rpx;
	}
	
	.attr-pop .close .icon {
	  width: 48rpx;
	  height: 48rpx;
	}
	
	.attr-pop .img-info {
	  width: 687.5rpx;
	  height: 177rpx;
	  overflow: hidden;
	  margin-bottom: 41.5rpx;
	}
	
	.attr-pop .img {
	  float: left;
	  height: 177rpx;
	  width: 177rpx;
	  background: #f4f4f4;
	  margin-right: 31.25rpx;
	}
	
	.attr-pop .info {
	  float: left;
	  height: 177rpx;
	  display: flex;
	  align-items: center;
	}
	
	.attr-pop .p {
	  font-size: 33rpx;
	  color: #333;
	  height: 33rpx;
	  line-height: 33rpx;
	  margin-bottom: 10rpx;
	}
	
	.attr-pop .a {
	  font-size: 29rpx;
	  color: #333;
	  height: 40rpx;
	  line-height: 40rpx;
	}
	.bottomBar{
			 z-index: 2;
			position: fixed;
			bottom: -12rpx;
			left: 0;
			height: 120rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fbfcff;
			 box-shadow: 0 5px 15px rgba(45,50,55,.2);
			 transform: translateY(-5px);
			 padding-bottom: 32rpx;
		}
</style>
