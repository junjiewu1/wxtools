<template>
	<view>
		<view @click="gotoSecKill">秒杀</view>
		<view  @click="getownedGoodsList" v-if="owned">管理商品</view>
		  <view class="cate-item">
		      <view class="b">
		        <block v-for="(item,index) in goodsList" :key="index"  >
					<view class="item" :class="{'item-b': index % 2 == 0}" @click="gotoGoods(item.id)">
						<image class="img" :src="item.picUrl" background-size="cover"></image>
						<text class="name">{{item.name}}</text>
						<text class="price">￥{{item.counterPrice}}</text>
					</view>
		        </block>
		      </view>
		  </view>
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {storeRequest} from "../../network/store.js";
	const app = getApp()
	export default {
		data() {
			return {
				goodsList:[],
				topicId:null,
				owned:false,
				topicsInfo:null
			}
		},
		onLoad(options) {
			this.topicId = options.topicId
			this.getposts()
		},
		onShow() {
			
		},
		methods: {
			getposts(){
				postsRequest.getposts(this.topicId, app.globalData.token)
				.then((res)=>{
					this.topicsInfo = res.data.topic
					this.owned = res.data.topic.owned
					uni.setNavigationBarTitle({
					    title: this.topicsInfo.topic
					});
					this.get_store()
				})
				.catch(err=>{  
					console.log('getpostsERR', err)
				})
			},
			gotoSecKill(){
				uni.navigateTo({
					url:'/pages/secKill/secKill'
				})
			},
			get_store(){
				storeRequest.get_store(this.topicId,app.globalData.token)
				.then(res=>{
					this.goodsList = res.data.data.list
				})
			},
			gotoGoods(id){
				console.log(id)
				uni.navigateTo({
					url:`/pages/goods/goods?id=${id}`
				})
			},
			
			getownedGoodsList(){
				uni.navigateTo({
						url:`/pages/ownedGoodsList/ownedGoodsList?topicId=${this.topicId}`
					})
			},
			
			
		}
	}
</script>

<style>

.cate-item .b {
  width: 750rpx;
  height: auto;
  overflow: hidden;
  border-top: 1rpx solid #f4f4f4;
  margin-top: 20rpx;
}

.cate-item .b .item {
  float: left;
  background: #fff;
  width: 375rpx;
  padding-bottom: 33.333rpx;
  border-bottom: 1rpx solid #f4f4f4;
  height: auto;
  overflow: hidden;
  text-align: center;
}

.cate-item .b .item-b {
  border-right: 1rpx solid #f4f4f4;
}

.cate-item .item .img {
  margin-top: 10rpx;
  width: 302rpx;
  height: 302rpx;
}

.cate-item .item .name {
  display: block;
  width: 365.625rpx;
  height: 35rpx;
  padding: 0 20rpx;
  overflow: hidden;
  margin: 11.5rpx 0 22rpx 0;
  text-align: center;
  font-size: 30rpx;
  color: #333;
}

.cate-item .item .price {
  display: block;
  width: 365.625rpx;
  height: 30rpx;
  text-align: center;
  font-size: 30rpx;
  color: #b4282d;
}

</style>
