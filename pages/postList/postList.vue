<template>
	<view id="postList">
		<view class="bottomBar">
			<view class="createPostBtn" @click="gotoCreateposts">打卡</view>
		</view>
			<view style="text-align: right;">
			<button v-if="owned" size="mini" type="primary" style="margin: 0; margin-right: 10rpx;" @click="gotodownloadImage">导出</button>
			</view>
		<view style="display: flex; flex-wrap: wrap; align-items: center;">
		<view>#话题：</view>
		<view :class="{keyactive: onactiveKeyIndex == '全部'}" style="background-color: #bfbfbf; font-size: 26rpx; margin: 4rpx 10rpx; padding:2rpx 14rpx; border-radius: 8rpx; color: #FFFFFF;"
		@click="keyswordClick('全部')"  >全部</view>
		<view :class="{keyactive: onactiveKeyIndex == '无'}" style="background-color: #bfbfbf; font-size: 26rpx; margin: 4rpx 10rpx; padding:2rpx 14rpx; border-radius: 8rpx; color: #FFFFFF;"
		@click="keyswordClick('无')"  >无</view>
		<view v-for="(item, index) in keywords" :key="index" :class="{keyactive: onactiveKeyIndex == item}" style="background-color: #bfbfbf; font-size: 26rpx; margin: 4rpx 10rpx; padding:2rpx 14rpx; border-radius: 8rpx; color: #FFFFFF;"
		@click="keyswordClick(item)"  @longpress ="longpressKeywords(item,index)">{{item}}</view>
		<view v-if="owned" @click="()=>{this.configDialogShow = true}" style="font-weight: 600rpx; font-size: 26rpx;">设置></view>
		</view>
		
		<view v-for="(item, index) in postsList" :key="index" class="postsList">
			<view class="postsItem" @click="postsItemClick(item.postId)">
				<view style="display: flex; justify-content: space-between;">
					<view class="userinfo" >
						<image :src="item.userInfo.avatarUrl" class="avatarUrl"></image>
						<view style="margin-left: 10rpx;">
							<view style="font-size: 36rpx; font-weight: 550; color: #2C405A;">{{item.userInfo.nickName}}</view>
							<view style="font-size: 24rpx; color: #8d8d8d; margin-top: 4rpx;">{{item.postTime | postTimeStamp}}</view>
						</view>
					</view>
					<image src="../../static/image/setting.png" class="setting" @click.stop="settingClick(item)"></image>
				</view>	
				<view class="postsInfo" style="margin: 5px 14px 5px 43px;">
					<view style="font-size: 30rpx; margin: 4rpx 0;">{{item.title}}</view>
					<view class="contentClass"><text>{{item.content}}</text></view>
					<view v-if="item.content.length>68" style="font-weight: 550; font-size: 30rpx; color: #0b3450; margin-top: 10rpx;">详情</view>
					
					<view v-for="(audioItem, audioindex) in item.files" :key="audioindex" style="display: flex; align-items: center;">
						 <view v-if="audioItem.type == 'audio'"    style="margin: 6rpx 0; font-size: 24rpx; color: #939393; 
						 text-decoration:underline; display: flex; align-items: center;">
						 <image src="../../static/image/audiologo.png" style="width: 30rpx; height: 30rpx; margin-right: 2rpx; "></image>
						 <text>{{audioItem.filename | spliceStr}}</text>
						 </view>
					</view>
					<view v-for="(filesItem, filesindex) in item.files" :key="filesindex" style="display: flex; align-items: center;">
						 <view v-if="filesItem.type == 'pdf'"  style="margin: 6rpx 0; font-size: 24rpx; color: #939393; 
						 text-decoration:underline; display: flex; align-items: center;">
						 <image src="../../static/image/pdflogo.png" style="width: 30rpx; height: 30rpx; margin-right: 2rpx; "></image>
						 <text>{{filesItem.filename | spliceStr}}</text>
						 </view>
					</view>
		
					<view class="postimage">
						<view v-for="(filesItem, filesindex) in item.files" :key="filesindex"  >
							<image v-if="filesItem.type == 'image'"  :src="filesItem.thumbnail"  @click.stop="preview(item.files, filesItem.url)"></image>
						</view>
					</view>
					
				</view>
				<view class="postBtnbar">
					<view class="postBtnbarItem" @click.stop="likeClick(item.postId, index)">
						<image v-if="!item.isLike" src="../../static/image/love-o.png"></image>
						<image v-if="item.isLike" src="../../static/image/love.png"></image>
						<text>{{item.likes.length>0? item.likes.length:'赞'}}</text>
					</view>
					<view class="postBtnbarItem" @click.stop="commentClick(item.postId, index)">
						<image src="../../static/image/comment.png"></image>
						<text>{{item.comments.length>0? item.comments.length:'评论'}}</text>
					</view>
				</view>
				
				<view v-if="item.comments.length" class="commentList" style="width: 90%;margin: 0 auto; background-color: #F5F6FA; padding: 10rpx;">
					<view v-for="(commentItem,commentIndex) in item.comments" :key="commentIndex" style=" font-size: 28rpx; margin: 4rpx 0;">
						<text style="color: #0d3f61; font-weight: 550;" >{{commentItem.userInfo.nickName}}:</text><text>{{commentItem.title}}</text>
					</view>
				</view>
			</view>
		</view>  
		<view style="width: 100%; text-align: center; line-height: 100rpx; font-size: 30rpx; color: #6c6c6c; ">我是有底线的~</view>
		<van-dialog  use-slot :show='configDialogShow' title='添加话题'  @confirm='configConfirm' show-cancel-button  @close="()=>{this.configDialogShow = false; this.configInput = ''}"  >
			<input style="height: 100rpx; width: 80%; margin: 0 auto; margin-top: 20rpx;" placeholder="请输入话题" v-model="configInput" />
		</van-dialog>
		<van-popup :show="showpopoUp" position="bottom" round @close="closePopoup('1')">
				<view v-if="owned" style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx; font-size: 32rpx;" @click="delPost">删除打卡</view>
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto;"  >
					<button  open-type="share" id="postShare" class="buttonClass">分享</button>
				</view>
				<view style="height: 60rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center"></view>
		</van-popup>
		<van-dialog  use-slot  :show="postDialogShow" show-cancel-button  title="评论"
		  @confirm='postdialogconfirm' @close="()=>{this.postDialogShow = false; this.postDialogInput = ''}" >
		 <textarea style="height: 140rpx; width: 80%; margin: 20rpx auto;"  rows="3" placeholder="请输入评论" v-model="postDialogInput" />
		</van-dialog>
		<van-dialog  :show="delkeydialog" show-cancel-button  title="是否要删除此关键字"
		@confirm='delkeyconfirm' @close="()=>{this.delkeydialog = false;}"  />
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import vanPopup from '../../wxcomponents/vant/popup'
	import vanDialog from '../../wxcomponents/vant/dialog'
	import {resourcesRequest} from "../../network/resources.js";
	import {timeSubstr, timeStamp, timeDistance, parseQueryString} from '../../utils/common.js'
	
	const app = getApp()
	export default {
		data() {
			return {
				topicId:null,
				owned:false,
				topicsInfo:null,
				title:'',
				pagemode:null,
				page:1,
				onactiveKeyIndex: '全部',
				postsList: [],
				keywords:[],
				ondelKeyword: null,
				ondelKeywordName: '',
				delkeydialog: false,
				configDialogShow: false,
				configInput:'',
				postsList: [],
				showpopoUp:false,
				onSettingPost: null,
				onCommentIndex: null,
				postDialogShow:false,
				onCommentPostId:null
			}
		},
		components:{
			vanDialog,
			vanPopup,
		},
		filters:{
			postTimeStamp(value){
					return timeDistance(value)
			},
			spliceStr(value){
				if(value && value.length > 26){    //限制点击进入圈子的时候
					return value.substr(0,26)+'...'
				}else{
					return value
				}
			}
		},
		onLoad(options) {
			console.log(options)
			this.topicId = options.topicId
			this.getconfigs()
		},
		onShow(){
			this.getposts()
			this.get_all_posts()
			this.getconfigs()
		},
		onReachBottom(){
			if(this.postsList.length % 10 == 0){
				this.page++
				this.get_all_posts()
			}
		},
		methods: {
			gotoCreateposts(){
				if(!this.topicsInfo.joined){
					this.jointopics()
				}
				uni.navigateTo({
					url:`/pages/postCreate/postCreate?topicId=${this.topicId}`
				})
			},
			jointopics(){
				if(!app.globalData.userInfo){
					uni.navigateTo({
						url:'/pages/login/login'
					})
					return
				}
				postsRequest.joinposts(this.topicId, app.globalData.token)
				.then((res)=>{
					this.requestSubscribeMessage()
					this.getposts()
				})
				
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
			getposts(){
				postsRequest.getposts(this.topicId, app.globalData.token)
				.then((res)=>{
					this.topicsInfo = res.data.topic
					this.title = this.topicsInfo.topic
					this.owned = res.data.topic.owned
					uni.setNavigationBarTitle({
					    title: this.title
					});
					if (this.topicsInfo.joined && !app.globalData.requestedSub){
						this.requestSubscribeMessage()
					}
				})
				.catch(err=>{  
					console.log('getpostsERR', err)
					setTimeout(()=>{
						this.onShowFnc()
					},500)
				})
			},
			delkeyconfirm(){
				this.keywords.splice(this.ondelKeyword, 1)
				var value = this.keywords.join(',')
				var data ={
					topicId:this.topicId, 
					category: 'topic',
					name: 'keywords',
					value
				}
				resourcesRequest.setconfigs(data,app.globalData.token)
				.then((res)=>{
					uni.showToast({
						title:'删除成功'
					})
					this.getconfigs()
					if(this.onactiveKeyIndex == this.ondelKeywordName){
						this.onactiveKeyIndex = '全部'
						this.pagemode = 1
						this.get_all_posts()
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			gotodownloadImage(){
				postsRequest.downloadImg(this.topicId, app.globalData.token)
				.then(res=>{
					uni.navigateTo({
						url:`/pages/downLoad/downLoad?downLoadURl=${res.data.url}&title=${this.topicsInfo.topic}`
					}) 
					this.showpopoUp = false
				})
				.catch(err=>{
					console.log(err)
					uni.showToast({
						title:'下载失败',
						icon:'none'
					})
				})
			},
			postdialogconfirm(){
				this.posts_comment(this.postDialogInput, this.onCommentPostId)
				this.get_all_posts()
			},
			posts_comment(title, postId){
				postsRequest.posts_comment(title, postId, app.globalData.token)
				.catch((err)=>{
					uni.showToast({
						title:err.data.information,
						icon:'none'
					})
				})
			},
			keyswordClick(e){
				console.log(e,'eeeeee')
				this.pagemode = 1
				this.onactiveKeyIndex = e
				this.get_all_posts()
			},
			async get_all_posts(){
				var a = []
				for(let i = 1; i<=this.page; i++){
					let res = await postsRequest.get_all_posts(i, this.onactiveKeyIndex, this.topicId,  app.globalData.token)
					a = [...a, ...res.data.posts]
					if(i==this.page){
							this.postsList = a
					}
				}
			},
			setconfigs(){
				var value = this.configInput + ',' + this.keywords.join(',')
				var data ={
					topicId:this.topicId, 
					category: 'topic',
					name: 'keywords',
					value
				}
				resourcesRequest.setconfigs(data,app.globalData.token)
				.then((res)=>{
					uni.showToast({
						title:'添加成功'
					})
					this.getconfigs()
				})
				.catch(err=>{
					console.log(err)
				})
			},
			delkeyconfirm(){
				this.keywords.splice(this.ondelKeyword, 1)
				var value = this.keywords.join(',')
				var data ={
					topicId:this.topicId, 
					category: 'topic',
					name: 'keywords',
					value
				}
				resourcesRequest.setconfigs(data,app.globalData.token)
				.then((res)=>{
					uni.showToast({
						title:'删除成功'
					})
					this.getconfigs()
					if(this.onactiveKeyIndex == this.ondelKeywordName){
						this.onactiveKeyIndex = '全部'
						this.pagemode = 1
						this.get_all_posts()
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			getconfigs(){
				resourcesRequest.getconfigs({topicId:this.topicId, category:'topic'})
				.then(res=>{
					if(res.data.configs.keywords){
						this.keywords = res.data.configs.keywords.split(',')
					}
				})
			},
			longpressKeywords(e, i){
				this.ondelKeyword = i
				this.ondelKeywordName = e
				this.delkeydialog = true
			},
			configConfirm(){
				if(this.configInput.replace(/^\s*|\s*$/g,"").length <1){
					uni.showToast({
						title:'请输入话题',
						icon:'none'
					})
					return
				}
				this.setconfigs()
			},
			postsItemClick(postId){
				uni.navigateTo({
					url:`/pages/postDetail/postDetail?postId=${postId}`,
				})
			},
			settingClick(e){
				console.log(e,'onsetting')
				this.showpopoUp = true
				this.onSettingPost = e 
			},
			closePopoup(){
				this.showpopoUp = false
			},
			delPost(){
				console.log(this.onSettingPost)
				postsRequest.deletePosts(this.onSettingPost.postId, app.globalData.token)
				.then(res=>{
					uni.showToast({
						title:'删除成功'
					})
					this.showpopoUp = false
					this.get_all_posts()
					
				})
				.catch(err=>{
					uni.showToast({
						title:err.data.information,
						icon:'none'
					})
					this.showpopoUp = false
				})
			},
			preview( files, url){
				var preindex = 0
				var previewImage = []
				files.forEach((item, index)=>{
					if(item.type == 'image'){
						previewImage.push(item.url)
						if(item.url == url){
							preindex = index
						}
					}
				})
				uni.previewImage({
					urls: previewImage,
					current: preindex,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏']
					}
				});
			},
			likeClick(postId,index){
				this.posts_like(postId)
				this.get_all_posts()
			},
			posts_like(postId){
				postsRequest.posts_like( postId, app.globalData.token)
				.then((res)=>{
				})
			},
			commentClick(e, index){
				this.onCommentPostId = e
				this.onCommentIndex = index
				this.postDialogShow = true
			},
			onShareAppMessage(e) {
				this.showpopoUp = false
			     if(e.from=="button" ){
					console.log(e)
					if(e.target.id == 'postShare'){
						return {
							 title: `${this.onSettingPost.title}`,
							 path: `/pages/postDetail/postDetail?postId=${this.onSettingPost.postId}`,
							 imageUrl: '../../static/image/welcome.png'
							}
					}else{
						return {
						          title: `${this.topicsInfo.topic}`,
						          path: `/pages/topics/topics?topicId=${this.topicId}`,
						          imageUrl: '../../static/image/welcome.png'
						        }
					}
			    }else{
			      return {
			                title: `云中助手`,
			                path: `/pages/index/index`
			              }
			    }
			},
		}
	}
</script>

<style>
	#postList{
		width: 94%;
		margin: 10px auto 0px auto;
	}
 .bottomBar{
	 z-index: 2;
	position: fixed;
	bottom: -12rpx;
	left: 0;
	height: 120rpx;
	width: 100%;
	background-color: #fbfcff;
	text-align: center;
	align-items: center;
	 box-shadow: 0 5px 15px rgba(45,50,55,.2);
	 transform: translateY(-5px);
 }
 .createPostBtn{
 	 position: relative;
 	bottom: 40rpx;
 	 border: 20rpx solid #fbfcff;
 	 width: 100rpx;
 	 height: 100rpx;
 	 line-height: 100rpx;
 	 border-radius: 50%;
 	 background-color: #f07127;
 	 text-align: center;
 	 font-size: 30rpx;
 	 color: #FFFFFF;
 	 margin: 0 auto;
 	 margin-bottom: 20rpx;
 }
 /* postClass */
  .postsItem{
 	 background-color: #FFFFFF;
 	 padding: 24rpx 14rpx;
 	 margin: 20rpx  0;
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
  .contentClass{
 	display: -webkit-box;
 	-webkit-line-clamp:4;
 	-webkit-box-orient:vertical;
 	text-overflow:ellipsis;
 	overflow:hidden;
 	font-size: 28rpx;
  }
  .postBtnbar{
 	 width: 300rpx;
 	 display: flex;
 	 align-items: center;
 	 justify-content: space-between;
 	 margin: 16rpx 0 0rpx 90rpx;
  }
  .postBtnbarItem{
 	 display: flex;
 	 align-items: center;
 	 width: 160rpx;
 	 padding: 10rpx 10rpx;
  }
  .postBtnbarItem image{
 	 width: 30rpx;
 	 height: 30rpx;
  }
  .postBtnbarItem text{
 	 font-size: 24rpx;
 	 color: #757575;
 	 margin-left: 6rpx;
  }
 .projectImg{
 	width: 600rpx;
 	overflow: hidden;
 	margin: 10rpx 0;
 }
 .projectImg image{
 	width: 160rpx;
 	height: 160rpx;
 	margin: 0 10rpx;
 }
 .setting{
 	padding: 10rpx;
 	width: 50rpx;
 	height: 50rpx;
 }
 .buttonClass::after {
 border: none;
 
 }
 
 .buttonClass {
 background-color: transparent;
 
 padding-left: 0;
 
 padding-right: 0;
 
 line-height:inherit;
 
 }
 
 .buttonClass {
 	border-radius:0;
     font-size: 32rpx;
 	line-height: 60rpx;
 }
 .keyactive{
 	background-color: #007AFF !important;
 }
</style>
