<template>
	<view id="garreryDetail">
		<view >
			<checkbox-group style="display: flex; flex-wrap: wrap; align-items: center; width: 720rpx;margin: 20rpx auto;" @change="checkboxChange">
				 <label v-for="(item,index) in gallery.files" :key="index" style=" width: 236rpx; height: 236rpx; margin: 2rpx;">
					<image  :src="item.thumbnail" class="galleryImg" @click="imageClick(index)"></image>
					<checkbox v-if="seclete" :value="item.fileId" color=#007AFF  class="myCheckbox"/>
				 </label>
			 </checkbox-group>
		</view>
		<view class="bottomBar">
			<view v-if="seclete" style="align-items: center;display: flex;justify-content: space-around;width: 100%;">
				<view style="width: 200rpx; display: flex; justify-content: space-between; align-items: center; font-size: 24rpx;">
					<view @click="dwnPhoto" style="text-align: center;">
						<image src="../../static/image/download.png" style="width: 40rpx; height: 40rpx;"></image>
						<view>下载</view>
						</view>
					<view @click="delPhoto"  style="text-align: center;">
						<image src="../../static/image/delete.png" style="width: 40rpx; height: 40rpx;"></image>
						<view>删除</view>
						</view>
				</view>
 				<view style="font-size: 26rpx; color: #007AFF;"  @click="cencel">取消</view>
			</view>
			<view v-else style="align-items: center;display: flex;justify-content: space-around;width: 100%;">
				<image src="../../static/image/menu.png" style="width: 40rpx;height: 40rpx;" @click="()=>{this.showpopoUp = true}" ></image>
				<van-button round type="info" @click="uploadPhoto('1')" >上传照片</van-button>
				<view style="font-size: 26rpx; color: #007AFF;" @click="()=>{this.seclete=!this.seclete}">选择</view>
			</view>
		</view>
		<view v-if="!gallery.files.length" style="position: fixed; top: 40%;left: 50%;z-index: 2;color: #5d5d5d;transform: translate(-50%,-50%);">暂时没有任何图片</view>
		<van-popup :show="showpopoUp" position="bottom" round @close="closePopoup('1')">
				<view  style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx;
				 font-size: 32rpx;" >修改名称</view>
				 <view  style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx;
				  font-size: 32rpx;" @click="delGarrery">删除相册</view>
				<view  style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx;
				 font-size: 32rpx;" @click="closePopoup('1')">取消</view>
				<view style="height: 60rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center"></view>
		</van-popup>	
		
	</view>
</template>

<script>
	import vanPopup from '../../wxcomponents/vant/popup'
	import {galleryRequest} from "../../network/gallery.js";
	import {FileRequest} from "../../network/FileRequest.js";
	import vanButton from '../../wxcomponents/vant/button'
	const app = getApp()
	export default {
		data() {
			return {
				docId:null,
				seclete: false,
				gallery:[],
				showpopoUp:false,
				selectFileId:[]
			}
		},
		components:{
			vanButton,
			vanPopup
		},
		onLoad(options) {
			console.log(options)
			this.docId = parseInt(options.docId) 
			this.getGallery()
		},
		methods: {
			getGallery(){
				galleryRequest.get(this.docId, app.globalData.token)
				.then(res=>{
					this.gallery = res.data.gallery
					uni.setNavigationBarTitle({
					    title: this.gallery.title
					});
				})
			},
			closePopoup(){
				this.showpopoUp = false
			},
			delGarrery(){
				uni.showModal({
				    title: '提示',
				    content: '确定要删除此相册吗',
				    success: res=> {
				        if (res.confirm) {
				            galleryRequest.delete({docId:this.docId},app.globalData.token)
				            .then(res=>{
				            	uni.navigateBack()
				            })
				            .catch(err=>{
				            	uni.showToast({
				            		title:err.data.information,
				            		icon:'none'
				            	})
				            })
				        }
				    }
				});
				
			},
			uploadPhoto(){
				var files = []
				uni.chooseImage({
					count: 9, 
					success: (res1)=>{
						uni.showLoading()
						res1.tempFiles.forEach(async(item,index)=>{
							let res = await FileRequest.uploadFile(-1, null, item.path, app.globalData.token)
							var data = JSON.parse(res.data)
							files.push(data.fileId)
							if(index == res1.tempFiles.length-1){
								galleryRequest.add({docId:this.docId, files: files.join(',')}, app.globalData.token)
								.then(res=>{
									this.getGallery()
									uni.hideLoading()
									uni.showToast({
										title:'添加成功'
									})
								})
								.catch(err=>{
									uni.hideLoading()
									uni.showToast({
										title:'添加失败',
										icon:'none'
									})
								})
							}
						})
					}
				});
			},
			imageClick(index){
				var previewImage = []
				this.gallery.files.forEach((item,index)=>{
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
			checkboxChange(e){
				this.selectFileId = e.detail.value
			},
			delPhoto(){
				if(!this.selectFileId.length){
					return
				}
				uni.showModal({
				    title: '提示',
				    content: '确定要删除照片吗',
				    success: res=> {
				        if (res.confirm) {
							uni.showLoading()
				            galleryRequest.remove({files:this.selectFileId.join(','),docId:this.docId},app.globalData.token)
				            .then(res=>{
								this.getGallery()
								this.cencel()
								uni.hideLoading()
								uni.showToast({
									title:'删除成功'
								})
				            })
				            .catch(err=>{
								uni.hideLoading()
				            	uni.showToast({
				            		title:err.data.information,
				            		icon:'none'
				            	})
				            })
				        } 
				    }
				});
			},
			dwnPhoto(){
				if(!this.selectFileId.length){
					return
				}
				uni.authorize({
				    scope: 'scope.writePhotosAlbum',
				    success: (res1)=>{
						uni.showLoading()
						this.selectFileId.forEach((item1,index1)=>{
							this.gallery.files.forEach((item2,index2)=>{
								if(item1 == item2.fileId){
									uni.getImageInfo({
							           src: item2.url,
							           success: (res2) =>{
							               uni.saveImageToPhotosAlbum({
							               	filePath: res2.path , // 此为图片路径
							               	success: () => {
												if(index1 == this.selectFileId.length-1){
													this.cencel()
													uni.hideLoading()
													uni.showToast({
														title:'保存成功'
													}) 
												}
							               	},
							               	fail: (err) => {
							               		console.log(err)
												uni.hideLoading()
							              		wx.showToast({
							               			title:'保存失败，请稍后重试',
							               			icon:'none'
							               		})
							               	}
							               })
							           }
							       });
								}
							})
						})
					}
				})	
				
			},
			cencel(){
				this.seclete=!this.seclete; 
				this.selectFileId = []
			},
			onShareAppMessage(e) {
				return {
					  title: `云中助手`,
					  path: `/pages/index/index`,
					  imageUrl: '../../static/image/welcome.png'
				 }
			},
		}
	}
</script>

<style>
	
 .bottomBar{
	 z-index: 2;
	position: fixed;
	bottom: -12rpx;
	left: 0;
	height: 120rpx;
	width: 100%;
	background-color: #fbfcff;
	
	 box-shadow: 0 5px 15px rgba(45,50,55,.2);
	 transform: translateY(-5px);
	 
	 padding: 20rpx 0;
 }
 .galleryImg{
	 width: 236rpx;
	 height: 236rpx;
 }
 .myCheckbox{
	 position: relative;
	 top: -120px;
	 left: 2px;
 }
</style>
