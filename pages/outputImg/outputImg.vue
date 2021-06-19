<template>
	<view>
		<view style="width: 730rpx; margin: 20rpx auto;">
			<image v-for="(item, index) in image" :src="item" :key="index" mode="aspectFill" style="width: 160rpx;height: 200rpx; margin: 10rpx;" @click="imageClick(index)"></image>
		</view>
		<view class="downloadPDF" @click="downLoadPDF">下载</view>
	</view>
</template>

<script>
	import {clockInRequest} from "../../network/clockIn.js";
	const app = getApp()
	export default {
		data() {
			return {
				image:[]
			}
		},
		onLoad(options) {
			this.taskId = options.taskId
			this.outputImg()
		},
		methods: {
			outputImg(){
				uni.showLoading({
					 title: '加载中',
					 mask:true
				})
				clockInRequest.outputImg(this.taskId, app.globalData.token)
				.then((res)=>{
					this.image = res.data.urls
					uni.hideLoading()
				})
				.catch(err=>{
					uni.hideLoading()
					uni.showToast({
						title:err.data.information,
						icon:'none'
					})
				}) 
			},
			imageClick(i){
				uni.previewImage({
					urls: this.image,
					current: i,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏']
					}
				});
			},
			downLoadPDF(){
				clockInRequest.outputPdf(this.taskId, app.globalData.token)
				.then(res=>{
					uni.navigateTo({
						url:`/pages/downLoad/downLoad?downLoadURl=${res.data.url}`
					})
				})
			}
			
		}
	}
</script>

<style>
	.downloadPDF{
		position: fixed;
		border-radius: 50%;
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		right: 60rpx;
		bottom: 120rpx;
		background-color: #d50003;
		color: #FFFFFF;
		font-size: 26rpx;
		opacity: 0.7;
	}
</style>
