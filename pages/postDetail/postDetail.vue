<template >
	<view>
		<view  class="postsList">
			<view class="postsItem" >
				<view class="userinfo">
					<image :src="postInfo.userInfo.avatarUrl" class="avatarUrl"></image>
					<view style="margin-left: 16rpx;">
						<view style="font-size: 36rpx; font-weight: 550; color: #2C405A;">{{postInfo.userInfo.nickName}}</view>
						<view style="font-size: 24rpx; color: #8d8d8d;">{{postInfo.postTime}}</view>
					</view>
				</view>
				
				 <swiper v-if="postInfoImage.length" class="swiper" style="height: 600rpx; margin-top: 20rpx;" autoplay="true" interval="5000" indicator-dots="true">
				        <swiper-item v-for="(item, index) in postInfoImage" :key="index" @click="swiperImgClick(index)">
				            <image  :src="item.url" mode="aspectFill" style="width: 100%; height: 600rpx;"></image>
				        </swiper-item>
				 </swiper>
				     
				
				
				
				<view class="postsInfo" style="margin: 20rpx;">
					<view style="font-size: 30rpx; margin: 4rpx 0;"><text>{{postInfo.title}}</text></view>
					<view class="contentClass"><text>{{postInfo.content}}</text></view>
					
					<view v-for="(item,index) in postInfoPdf" :key='index' @click="download(item)" style=" margin: 6rpx auto;font-size: 24rpx; color: #007AFF; text-decoration:underline; display: flex; align-items: center;">
						<image src="../../static/image/pdflogo.png" style="width: 30rpx; height: 30rpx; margin-right: 2rpx; "></image>
						<text  style="white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">{{item.filename}}</text>
					</view>
					
					<view  style="text-align: center; position: relative;margin: 6rpx auto;font-size: 24rpx" v-for="(item,index) in postInfoAudio" :key="index" >
					        <audio style="text-align: left" :src="item.url" 
							:name="item.filename" controls></audio>
					</view>
				</view>
				
				
				<view class="postBtnbar">
					<view class="postBtnbarItem" @click="likeClick" >
						<image v-if="!postInfo.isLike" src="../../static/image/love-o.png"></image>
						<image v-if="postInfo.isLike" src="../../static/image/love.png"></image>
						<text>{{postInfo.likes.length>0? postInfo.likes.length:'赞'}}</text>
					</view>
					<!-- <view>
						<image src="../../static/image/love.png"></image>
						<text>{{item.like.length}}</text>
					</view> -->
					<view class="postBtnbarItem" @click="()=>{this.postDialogShow = true}">
						<image src="../../static/image/comment.png"></image>
						<text>评论</text>
					</view>
					<view class="postBtnbarItem" @click.stop="()=>{this.showpopoUp = true}">
						<image src="../../static/image/share.png"></image>
						<text>分享</text>
					</view>
				</view>
			</view>
			<view>
				<van-tabs >
				  <van-tab title="评论" name="comment">
					<view v-for="(item,index) in postInfo.comments" :key="index" style="width: 90%; padding: 20rpx ; background-color: #FFFFFF; margin: 10rpx auto;">
					  <view class="userinfo" >
					  	<image :src="item.userInfo.avatarUrl" class="avatarUrl"></image>
					  	<view style="margin-left: 16rpx;">
					  		<view style="font-size: 36rpx; font-weight: 550; color: #2C405A;">{{item.userInfo.nickName}}</view>
					  		
					  	</view>
					  </view>
					  <view style="font-size: 26rpx; margin-left: 60rpx;">{{item.title}}</view>
					</view>
					<view v-if="!postInfo.comments.length" style="width: 100%; background-color: #FFFFFF; text-align: center; line-height: 100rpx; font-size: 26rpx;">暂时还没有评论~</view>
				  </van-tab>
				  <van-tab title="赞" name="like">
					  <view v-for="(item2,index2) in postInfo.likes" :key="index2" style="width: 90%; padding: 20rpx ; background-color: #FFFFFF; margin: 10rpx auto;">
					    <view class="userinfo" >
					    	<image :src="item2.userInfo.avatarUrl" class="avatarUrl"></image>
					    	<view style="margin-left: 16rpx;">
					    		<view style="font-size: 36rpx; font-weight: 550; color: #2C405A;">{{item2.userInfo.nickName}}</view>
					    		
					    	</view>
					    </view>
					  </view>
					 <view v-if="!postInfo.likes.length" style="width: 100%; background-color: #FFFFFF; text-align: center; line-height: 100rpx;font-size: 26rpx;">暂时还没有点赞~</view>
				  </van-tab>
				</van-tabs>
			</view>
			
		</view>
		<van-dialog  use-slot  :show="postDialogShow" show-cancel-button  title="评论"
		  @confirm='postdialogconfirm' @close="()=>{this.postDialogShow = false; this.postDialogInput = ''}" >
		 <textarea style="height: 140rpx; width: 80%; margin: 20rpx auto;"  rows="3" placeholder="请输入评论" v-model="postDialogInput" />
		</van-dialog>
		<van-popup :show="showpopoUp" position="bottom" round @close="closePopoup('1')">
			<view style="height: 200rpx;">
				<view style="width: 100%; text-align: center; margin-top: 10rpx; ">分享至</view>
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto;"  >
					<button   open-type="share" id="postShare">好友</button>
				</view>
			</view>
		</van-popup>
		<van-circle v-show="progress!=0 && progress!=100 " size=40 speed=220 :value="progress"  style="position: fixed; right:50%; top:50%;" />
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import vanTab from '../../wxcomponents/vant/tab';
	import vanTabs from '../../wxcomponents/vant/tabs';
	import vanDialog from '../../wxcomponents/vant/dialog'
	import vanIcon from '../../wxcomponents/vant/icon'
	import vanPopup from '../../wxcomponents/vant/popup'
	import freeAudio from '@/components/free-audio.vue'
	import vanCircle from '../../wxcomponents/vant/circle'
	
	const app = getApp()
	export default {
		data() {
			return {
				postId:null,
				postInfo: null,
				postDialogShow:false,
				postDialogInput: '',
				commentInput:'',
				onCommentPostId:null,
				showpopoUp:false,
				onCommentIndex: null,
				postInfoImage:[],
				postInfoPdf:[],
				postInfoAudio:[],
				progress:0
			}
		},
		components:{vanTab, vanTabs,vanDialog,vanIcon, vanPopup, freeAudio, vanCircle},
		onLoad(options) {
			this.postId = options.postId
			if (!app.globalData.token){
				app.globalData.tokenReadyCallback = this.onShowFnc
			}else{   
				this.onShowFnc()
			}
			
		},
		filters:{
			spliceStr(value){
				if(value && value.length > 26){    //限制点击进入圈子的时候
					return value.substr(0,26)+'...'
				}else{
					return value
				}
			}
		},
		methods: {
			onShowFnc(){
				this.get_posts_info()
			},
			get_posts_info(){
				postsRequest.get_posts_info(this.postId,app.globalData.token)
				.then((res)=>{
					this.postInfo = res.data
					this.postInfoImage = []
					this.postInfoPdf = []
					this.postInfoAudio = []
					res.data.files.forEach(item=>{
						if(item.type == 'image'){
							this.postInfoImage.push(item)
						}else if(item.type == 'pdf'){
							this.postInfoPdf.push(item)
						}else if(item.type == 'audio'){
							this.postInfoAudio.push(item)
						}
					})
				})
			},
			posts_like(postId){
				postsRequest.posts_like( postId, app.globalData.token)
				.then((res)=>{
					this.get_posts_info()
				})
			},
			posts_comment(title, postId){
				postsRequest.posts_comment(title, postId, app.globalData.token)
				.then((res)=>{
					this.get_posts_info()
				})
			},
			likeClick(postId,index){
				this.posts_like(this.postInfo.postId)
			},
			postdialogconfirm(){
				this.posts_comment(this.postDialogInput, this.postInfo.postId)
			},
			swiperImgClick(e){
				var previewImage = []
				this.postInfoImage.forEach((item)=>{
					previewImage.push(item.url)
				})
				uni.previewImage({
					urls: previewImage,
					current: e,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏']
					}
				});
			},
			download(item){	
				const downloadTask = uni.downloadFile({
					url: item.url,
					success:res=>{
						uni.showToast({
							title:'文件下载成功',
							icon:'none'
						})
						wx.openDocument({
						    filePath: res.tempFilePath,
							showMenu:true
						})
					},
					fail: err=>{
						uni.showToast({
							title:'文件下载失败',
							icon:'none'
						})
					}
				})
				downloadTask.onProgressUpdate((res) => {
					this.progress = res.progress
					if(res.progress == 100){
						this.progress = 0
					}
				});
			},
			closePopoup(){
				this.showpopoUp = false
			},
			onShareAppMessage(e) {
				this.showpopoUp = false
				return {
					title: `${this.postInfo.title}`,
					path: `/pages/postDetail/postDetail?postId=${this.postInfo.postId}`
					}
			},
		}
	}
</script>

<style scoped>
	page {
 		background-color: #FFFFFF;
	}
	/* postClass */
	.postsItem{
		 background-color: #FFFFFF;
		 padding: 24rpx 14rpx;
		 margin: 10rpx  0;
	}
	.userinfo{
		 display: flex;
		 align-items: center;
	}
	.avatarUrl {
		 width: 80rpx;
		 height: 80rpx;
		 border-radius: 50%;
	}
	.postimage{
		 display: flex;
		 flex-wrap: wrap;
		 justify-content: space-between;
		 margin-top: 20rpx;
	}
	.postimage image{
		 width: 160rpx;
		 height: 160rpx;
		 margin: 10rpx 0;
	}
	.postBtnbar{
		 width: 600rpx;
		 display: flex;
		 align-items: center;
		 justify-content: space-between;
		 margin: 10rpx  auto;
	}
	.postBtnbarItem{
		 display: flex;
		 align-items: center;
		 width: 160rpx;
		 padding: 10rpx 10rpx;
	}
	.postBtnbarItem image{
		 width: 40rpx;
		 height: 40rpx;
	}
	.postBtnbarItem text{
		 font-size:	26rpx;
		 color: #757575;
		 margin-left: 8rpx;
	}
</style>
