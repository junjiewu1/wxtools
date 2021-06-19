<template>
	<view id="setTopic" style="background-color: #FFFFFF;">
		<view>
			<view class="topicInfoItem" @click="update_photo">
				<view style="	 ;">头像</view>
				<view style="display: flex; align-items: center;">
					<image :src="topicsInfo.photoUrl" style="width: 120rpx;height: 120rpx;" mode="aspectFill" @click.stop="imgClick('photo')"></image>
					<image src="../../static/image/more.png" style="width: 40rpx;height: 40rpx;"></image>
				</view>
			</view>
			<view class="topicInfoItem" @click="()=>{this.dialogShow = true}" style="padding: 30rpx 30rpx;">
				<view style="color: #6b6b6b ;">圈名</view>
				<view style="display: flex; align-items: center; ">
					<view style="width: 500rpx;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;text-align: right;">{{topicsInfo.topic}}</view>
					<image src="../../static/image/more.png" style="width: 40rpx;height: 40rpx;"></image>
				</view>
			</view>
			<view class="topicInfoItem" @click="update_recv_qr">
				<view style="color: #6b6b6b ;">圈子收款码</view>
				<view style="display: flex; align-items: center;">
					<image :src="topicsInfo.receivingQrCode" style="width: 120rpx;height: 120rpx;" mode="aspectFill" @click.stop="imgClick('qrCode')"></image>
					<image src="../../static/image/more.png" style="width: 40rpx;height: 40rpx;"></image>
				</view>
			</view>
			<view class="topicInfoItem" style="padding: 30rpx 30rpx;" @click="gen_qrcode">
				<view style="color: #6b6b6b ;">生成二维码</view>
				<view style="display: flex; align-items: center;">
					<image src="../../static/image/more.png" style="width: 40rpx;height: 40rpx;"></image>
				</view>
			</view>
			
			<view class="sttingitem">
					<view >设置位置</view>
					<switch name="switch" class="clockInswitch" :checked='lcaChecked' @change="switchChange" />
			</view>
			
			<view class="adreeBlock" v-if="lcaChecked">
				<view class="topicInfoItem" style="padding: 30rpx 30rpx;" @click="chooseLocation">
					<view style="color: #6b6b6b ;">店铺位置</view>
					<view style="display: flex; align-items: center;">
						<view style="width: 500rpx;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;text-align: right;">{{topicsInfo.location.location}}</view>
						<image src="../../static/image/more.png" style="width: 40rpx;height: 40rpx;"></image>
					</view>
				</view> 
			</view>
		</view>
		<van-dialog  use-slot  :show="dialogShow" show-cancel-button  title="修改名称"
		  @confirm='dialogconfirm' @close="()=>{this.dialogShow = false; this.dialogInput = ''}" >
		 <input maxlength="20" style="height: 140rpx; width: 80%; margin: 0 auto;" placeholder="圈子名称(20字以内)" v-model="dialogInput" />
		</van-dialog>
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {FileRequest} from "../../network/FileRequest.js";
	import vanDialog from '../../wxcomponents/vant/dialog'
	import {UserInfoRequest} from "../../network/userInfo.js";
	const app = getApp()
	export default {
		data() {
			return {
				topicId:null,
				topicsInfo:null,
				owned:false,
				dialogShow:false,
				dialogInput:'',
				lcaChecked: false
			}
		},
		components:{
			vanDialog,
		},
		onLoad(options) {
			this.topicId = options.topicId
			this.getposts()
		},
		methods: {
			getposts(){
				postsRequest.getposts(this.topicId, app.globalData.token)
				.then((res)=>{
					this.topicsInfo = res.data.topic
					this.owned = res.data.topic.owned
					if(res.data.topic.location){
						this.lcaChecked = true
					}
					console.log(this.topicsInfo)
				})
				.catch(err=>{  
					console.log('getpostsERR', err)
					setTimeout(()=>{
						this.getposts()
					},500)
				})
			},
			update_photo(){
				uni.chooseImage({
					count: 1, 
					success: (res)=>{
						uni.showLoading()
						FileRequest.uploadFile(this.topicId, null, res.tempFilePaths[0], app.globalData.token)
						.then(res=>{
							var url = JSON.parse(res.data).url
							postsRequest.update_photo({photoUrl: url}, this.topicId, app.globalData.token)
							.then((res)=>{
								uni.hideLoading()
								uni.showToast({
									title:'修改成功'
								})
								this.getposts()
							})
							.catch(err=>{
								uni.hideLoading()
								uni.showToast({
									title:err.data.information,
									icon:'none'
								})
							})
						}) 
						.catch(err=>{
							uni.hideLoading()
							var errData = JSON.parse(err.data)
							uni.showToast({
								title:errData.information,
								icon:'none'
							})
						})
					}
				});
			},
			dialogconfirm(){
				var input = this.dialogInput
				UserInfoRequest.checkugcMsg(input)
				.then((res)=>{
					uni.hideLoading();
					if(res.data.result && input.length){
						postsRequest.update_name( {name:input},this.topicId, app.globalData.token)
						.then((res)=>{
							uni.showToast({
							    title: '修改成功',
								icon:'none'
							});
							this.getposts()
						})
						.catch(err=>{
							uni.showToast({
							    title: err.data.information,
								icon:'none'
							});
						})
					}else{
						uni.showToast({
						    title: '输入的名称违规',
						    duration: 3000,
							icon:'none'
						});
					}	
				})
			
			},
			switchChange(){
				this.lcaChecked = !this.lcaChecked
				if(!this.lcaChecked){
					postsRequest.update_location({location:null}, this.topicId, app.globalData.token)
				}
			},
			update_recv_qr(){
				uni.chooseImage({
					count: 1, 
					success: (res)=>{
						uni.showLoading()
						FileRequest.uploadFile(this.topicId, null, res.tempFilePaths[0], app.globalData.token)
						.then(res=>{
							var url = JSON.parse(res.data).url
							postsRequest.update_recv_qr({recvQrCode: url}, this.topicId, app.globalData.token)
							.then((res)=>{
								uni.hideLoading()
								uni.showToast({
									title:'修改成功'
								})
								this.getposts()
							})
							.catch(err=>{
								uni.hideLoading()
								uni.showToast({
									title:err.data.information,
									icon:'none'
								})
							})
						}) 
						.catch(err=>{
							uni.hideLoading()
							var errData = JSON.parse(err.data)
							uni.showToast({
								title:errData.information,
								icon:'none'
							})
						})
					}
				});
			},
			gen_qrcode(){
					postsRequest.gen_qrcode(this.topicId)
					.then(res1=>{
						var filePath = res1.data.url
						uni.authorize({
						    scope: 'scope.writePhotosAlbum',
						    success: ()=>{
								uni.getImageInfo({
								            src: filePath,
								            success: (res2) =>{
												var path = res2.path
								                uni.saveImageToPhotosAlbum({
								                	filePath: path , // 此为图片路径
								                	success: (res3) => {
								                		wx.showToast({
															title:'保存成功'
														})                   
								                	},
								                	fail: (err) => {
								                		console.log(err)
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
			},
			chooseLocation(){
				uni.chooseLocation({
				    success: (res)=> {
						console.log("get location:", res)
						postsRequest.update_location({
							location:{location:res.address, lat:res.latitude, lon:res.longitude}
						}, this.topicId, app.globalData.token)
						.then(res=>{
							uni.showToast({
								title:'修改成功'
							})
							this.getposts()
						})
						.catch(err=>{
							uni.showToast({
								title:err.data.information,
								icon:'none'
							})
						})
				    } 
				});
			},
			imgClick(e){
				var previewImage = []
				if(e=='qrCode'){
					previewImage.push(this.topicsInfo.receivingQrCode)
				}else{
					previewImage.push(this.topicsInfo.photoUrl)
				}
				console.log('1')
				
				
				uni.previewImage({
					urls: previewImage,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏']
					}
				});
			},
		}
	}
</script>

<style>
.topicInfoItem{
	background-color: #FFFFFF;
	padding: 20rpx 30rpx;
	
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: solid 1rpx #eaeaea;
	font-size: 28rpx;
}
.topicInfoItem:active {
    background-color: rgba(203, 203, 203, 0.1);
}
.sttingitem{
	padding: 20rpx 30rpx !important;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	color: #6b6b6b
}
.clockInswitch{
	float: right;
}
</style>
