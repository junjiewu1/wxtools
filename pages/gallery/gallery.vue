<template>
	<view id="gallery">
		<view class="mysection"> 照片集</view>
		<!-- <view class="allphoto">
			<iamge></iamge>
			<view>所有照片</view>
			<view>1张</view>
		</view> -->
		<view style="display: flex; justify-content: space-between; flex-wrap: wrap;">
			<view class="gelleryItem" v-for="(item,index) in gallerylist" :key="index" @click="gelleryItemClick(item.docId)">
				<image v-if="item.files.length" :src="item.files[0].thumbnail"></image>
				<view v-else style="width: 350rpx;height: 350rpx;border-radius: 6rpx;background-color: #d5d5d5;text-align: center;">
					<view style="color: #a2a2a2 ;line-height: 350rpx; font-size: 28rpx;">暂时没有任何照片</view>
				</view>
				<view class="HL">{{item.title}}</view>
				<view class="SHL">{{item.files.length}}张</view>
			</view>
			<view class="gelleryItem">
				<image src="../../static/image/add2.png"  @click="()=>{this.dialogShow = true}"></image>
				<view class="HL">新建相册</view>
			</view>
		</view>
		<van-dialog  use-slot  :show="dialogShow" show-cancel-button  title="相册名称"
		  @confirm='dialogconfirm' @close="()=>{this.dialogShow = false; this.dialogInput = ''}" >
		 <input maxlength="20" style="height: 140rpx; width: 80%; margin: 0 auto;" placeholder="相册名称(20字以内)" v-model="dialogInput" />
		</van-dialog>
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {galleryRequest} from "../../network/gallery.js";
	import vanDialog from '../../wxcomponents/vant/dialog'
	const app = getApp()
	export default {
		data() {
			return {
				topicId:null,
				owned:false,
				gallerylist:[],
				dialogShow:false,
				dialogInput:''
			}
		},
		components:{
			vanDialog,
		},
		onLoad(options) {
			this.topicId = options.topicId
			this.getposts()
		}, 
		onShow() {
			this.getall()
		},
		methods: {
			getall(){
				galleryRequest.getall(this.topicId,app.globalData.token)
				.then(res=>{
					this.gallerylist = res.data.gallerylist
				})
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
			dialogconfirm(){
				galleryRequest.create({refId:this.topicId, title:this.dialogInput}, app.globalData.token)
				.then(res=>{
					uni.navigateTo({
						url:`/pages/galleryDetail/galleryDetail?docId=${res.data.docId}`
					})
				})
			},
			gelleryItemClick(docId){
				uni.navigateTo({
					url:`/pages/galleryDetail/galleryDetail?docId=${docId}`
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #FFFFFF;
	}
#gallery{
		width: 720rpx;
		margin: 10px auto 0px auto;
	}
	.gelleryItem{
		width: 350rpx;
		margin: 10rpx 0;
	}
	.gelleryItem image{
		width: 350rpx;
		height: 350rpx;
		border-radius: 6rpx;
	}
	.HL{
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.SHL{
		font-size: 24rpx;
		color: #b9b9b9;
		font-weight: 400;
	}
</style>
