<template>
	<view id="noticesCompletes">
		<view style="text-align: right;"><button size="mini" v-if="owned" style="margin-right: 10rpx;" @click="()=>{this.deldialog = true}">删除通知</button><button v-if="!TimeLine" size="mini" open-type="share">分享</button></view>
		<view class="completescontent" >
			<view style="font-weight: 700; font-size: 42rpx;text-align: center; line-height: 60rpx; margin-bottom: 20rpx;"><text>{{noticeInfo.title}}</text></view>
			<view><text v-if="noticeInfo.content" style="font-size: 28rpx;" user-select >{{noticeInfo.content}}</text></view>
			<image  v-for="(item, index) in noticeInfo.files" :key="index" :src="item.url" class="projectImg"  mode="aspectFill"></image>
			<view  style="font-size: 24rpx; text-align: right; color: #7c7c7c; margin-top: 20rpx;">{{noticeInfo.createdTime}} 创建</view>
			<view v-if="!TimeLine" style="font-size: 24rpx; text-align: right;  margin-top: 20rpx; color: #f04142 ; font-weight: 400;" ><text style="padding: 6rpx;" @click="gotoTopic">点击进入 {{topic}} 圈子></text></view>
		</view>
		<van-dialog  :show="deldialog" show-cancel-button  title="是否要删除此通知"
			@confirm='deleteNotices' @close="()=>{this.deldialog = false;}"  />
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {noticesRequest} from '../../network/notices.js'
	import {delyDate, formatDate, timeStamp} from '../../utils/common.js'
	import vanDialog from '../../wxcomponents/vant/dialog'
	
	const app = getApp()
	export default {
		data() {
			return {
				topicId:null,
				noticeId:null,
				owned:false,
				topicsInfo: null,
				noticeInfo:null,
				TimeLine: false,
				topic: '',
				deldialog: false
			}
		},
		components:{vanDialog},
		onLoad(options) {
			this.topicId = options.topicId
			this.noticeId = parseInt(options.noticeId)
			this.topic = options.topic
			var res = wx.getLaunchOptionsSync();
			console.log("launch options:", res)
			if (res.scene == 1154){
				this.get_notice()
				this.TimeLine = true
			}else{
				if (app.globalData.token){
					console.log("has token")
					this.onloadFnc()
				}else{
					console.log("no token")
					app.globalData.tokenReadyCallback = this.onloadFnc;
				}
				if(res.scene == 1014){
					if(this.topicsInfo.joined){
						this.requestSubscribeMessage()
					}
				}
			}
			this.glancThrough(options)
			
		},
		methods: {
			onloadFnc(){
				this.get_notice()
				this.getposts()
			},
			get_notice(){
				noticesRequest.get_notice(this.noticeId, app.globalData.token)
				.then(res=>{
					this.noticeInfo = res.data
				})
			},
			getposts(){
				if(this.topicId){
					postsRequest.getposts(this.topicId, app.globalData.token)
					.then((res)=>{
						this.topicsInfo = res.data.topic
						this.owned = res.data.topic.owned
						this.topic = res.data.topic.topic
					})
				}
			},
			deleteNotices(){
				noticesRequest.deleteNotices({noticeId:this.noticeId},app.globalData.token)
				.then((res)=>{
					uni.showToast({
						title:'删除成功'
					})
					uni.navigateBack()
				})
				.catch(err=>{
					uni.showToast({
						title:'删除失败'
					})
				})
			},
			gotoTopic(){
				uni.redirectTo({
				    url: `/pages/topics/topics?topicId=${this.topicId}`
				});
			},
			onShareAppMessage(e) {
			     if(e.from=="button" ){
			      return {
			                title: `${this.noticeInfo.title}`,
			                path: `/pages/noticesCompletes/noticesCompletes?topicId=${this.topicId}&noticeId=${this.noticeId}`
			              }
			    }else{
			      return {
			                title: `云中助手`,
			                path: `/pages/index/index`,
			                imageUrl: '../../static/image/welcome.png'
			              }
			    }
			},
			requestSubscribeMessage(){
				uni.requestSubscribeMessage({
				      tmplIds: ['cR3fcMBV5xRRNZ2JB5kH43NGzElEPud_5Dl2GUz8yaw'],
				      success: res=>{
				        console.log("req sub success", res);
						app.globalData.requestedSub = true;
				      }
				})
			},
			onShareTimeline(res) {
					return {
						title: `${this.noticeInfo.title}`,
						query: `noticeId=${this.noticeId}&topicId=${this.topicId}`,
						imageUrl:this.topicsInfo.photoUrl,
					}
			},
		}
	}
</script>

<style>
	page{
		background-color: #FFFFFF;
		padding-bottom: 100rpx;
	}
#noticesCompletes{
	width: 94%;
	margin: 10px auto 0px auto;
}
.completescontent{
	margin-top: 10rpx;
	padding: 10rpx;
}
.projectImg {
	display: block;
	width: 650rpx;
	height: 650rpx;
	margin: 20rpx auto;
}
</style>
