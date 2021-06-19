<template>
	<view id="index" >
		<view class="userinfo" >
			<image :src="userInfo.avatarUrl"></image>
			<view>{{userInfo.nickName}}</view>
			<button open-type="share" size="mini">分享</button>
		</view>
		 
		<view class="mysection">| 我的圈子</view>
		<view class="posts">
			<view class="postsItem" @click="()=>{this.dialogShow = true}">
				<image src="../../static/image/add.png" style="width: 50rpx; height: 50rpx; padding: 30rpx;"></image>
				<view>新建圈子</view>
			</view>
			<view class="postsItem" v-for="(item, index) in all_topics" :key="index" @click="postsItemClick(item.topicId)">
				<image v-if="item.photoUrl" :src="item.photoUrl"></image>
				<image v-else src="../../static/image/logo.png"></image>
				<view>{{item.topic}}</view>
			</view>
		</view>
		<view class="mysection">| 我加入的圈子</view>
		<view class="posts">
			<view class="postsItem" v-for="(item, index) in my_topics" :key="index" @click="postsItemClick(item.topicId)">
				<image v-if="item.photoUrl" :src="item.photoUrl"></image>
				<image v-else src="../../static/image/logo.png"></image>
				<view>{{item.topic}}</view>
			</view>
		</view>
		
		<view class="mysection">| 我浏览过的圈子</view>
		<view class="posts">
			<view class="postsItem" v-for="(item, index) in my_historyTopics" :key="index" @click="postsItemClick(item.topicId)">
				<image v-if="item.photoUrl" :src="item.photoUrl"></image>
				<image v-else src="../../static/image/logo.png"></image>
				<view>{{item.topic}}</view>
			</view>
		</view>
		
		<!-- <view class="mysection">| 打卡</view>
		<van-grid>
		  <van-grid-item :icon="item.icon" :text="item.title" 
		  v-for="(item,index) in grid1Options" :key="index" @click="grid1Clcik(index)" />
		</van-grid>
		
		<view class="mysection">| 接龙</view>
		<van-grid >
			<van-grid-item :icon="item.icon" :text="item.title"
			v-for="(item,index) in grid2Options" :key="index" @click="grid2Clcik(index)" />
			
		</van-grid>
		
		
		<view class="mysection">| 工具</view>
		<van-grid icon-size="80rpx">
		  <van-grid-item icon="/static/image/questionnairelogo.png" text="问卷"   @click="gotoQuestionnaire('a')" />
		</van-grid> -->
		
		<van-dialog  use-slot  :show="dialogShow" show-cancel-button  title="新建圈子"
		  @confirm='dialogconfirm' @close="()=>{this.dialogShow = false; this.dialogInput = ''}" >
		 <input maxlength="20" style="height: 140rpx; width: 80%; margin: 0 auto;" placeholder="圈子名称(12字以内)" v-model="dialogInput" />
		</van-dialog>
		
		<miniapp-tip></miniapp-tip>
		
		<view class="errorTip" v-if="resCounts !== 3">
			页面出小差，请刷新重试...
		</view>
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {UserInfoRequest} from "../../network/userInfo.js";
	
	
	//组件
	import vanGrid from '../../wxcomponents/vant/grid'
	import vanGridItem from '../../wxcomponents/vant/grid-item'
	import vanDialog from '../../wxcomponents/vant/dialog'
	import vanNotify from '../../wxcomponents/vant/notify'
	const app = getApp()
	export default {
		data() {
			return {
				userInfo:null,
				dialogShow:false,
				dialogInput:'',
				all_topics:[],
				my_topics:[],
				my_historyTopics:[],
				resCounts:0,
				grid1Options:[{
					title:'创建打卡',
					icon: '/static/image/clockIn.png'
				},{
					title:'我创建的',
					icon: '/static/image/mycreate.png'
				},{
					title:'我参与的',
					icon: '/static/image/list.png'
				}],

				grid2Options:[{
					title:'创建接龙',
					icon: '/static/image/color-fan.png'
				},{
					title:'我的接龙',
					icon: '/static/image/text.png'
				},{
					title:'参与的接龙',
					icon: '/static/image/list.png'
				}],
				options:null,
				historyTopicId:[]
			}
		},
		onPullDownRefresh() {
			this.resCounts = 0
		      if (app.globalData.token){
		      	console.log("has token")
		      	this.getTopics()
		      }else{
		      	console.log("no token")
		      	app.globalData.tokenReadyCallback = this.getTopics;
		      }
		   },
		components:{
			vanGrid,
			vanGridItem,
			vanDialog,
			vanNotify
		},
		onLoad(options) {
			this.options = options
				if(!app.globalData.userInfo){
					console.log("no userinfo")
					//app.userInfoReadyCallback = function(userInfo){console.log("cb userinfo"); this.userInfo = app.globalData.userInfo}
					app.globalData.userInfoReadyCallback = this.updateUserInfo;
				}else{
					this.userInfo = app.globalData.userInfo
					console.log("uerinfo:", this.userInfo)
				}
		},
		onShow() {
			this.resCounts = 0
			this.historyTopicId = uni.getStorageSync('historyopen')
			console.log(this.historyTopicId)
			if (app.globalData.token){
				console.log("has token")
				this.getTopics()
			}else{
				console.log("no token")
				app.globalData.tokenReadyCallback = this.getTopics;
			}
		},
		methods: {
			updateUserInfo(){
				console.log("cb update userinfo")
				this.userInfo = app.globalData.userInfo;
			},
			grid1Clcik(e){
				switch(e){
					case 0:
					uni.navigateTo({
						url:`/pages/clockIn/clockIn?taskId=new`
					})	
					break;
					case 1:
					uni.navigateTo({
						url:'/pages/manage/manage?page=myCreate'
					})
					break;
					case 2:
					uni.navigateTo({
						url:'/pages/manage/manage?page=myParticipate'
					})
					break;
				}
			},
			grid2Clcik(e){
				switch(e){
					case 0:
					uni.navigateTo({
						url:`/pages/projects/projects`
					})	
					break;
					case 1:
					uni.navigateTo({
						url:`/pages/projectsManage/projectsManage?page=myCreate`
					})
					break;
					case 2:
					uni.navigateTo({
						url:`/pages/projectsManage/projectsManage?page=myParticipate`
					})
					break;
				}
			},
			gotoQuestionnaire(){
				uni.navigateToMiniProgram({
				  appId: 'wx12a82c3a341d8177'
				})
			},
			dialogconfirm(){
				uni.showLoading({
				    title: '正在检查合规性'
				});
				var input = this.dialogInput
				UserInfoRequest.checkugcMsg(input)
				.then((res)=>{
					uni.hideLoading();
					if(res.data.result && input.length){
						postsRequest.create(input, app.globalData.token)
							.then((res)=>{
								uni.navigateTo({
									url: '/pages/topics/topics?topicId='+res.data.topicId
								})
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
			postsItemClick(topicId){
				uni.navigateTo({
					url: '/pages/topics/topics?topicId='+ topicId
				})
			},
			getTopics(){
				postsRequest.get_all_topics(app.globalData.token)
				.then((res)=>{
					this.all_topics = res.data.topics
					this.resCounts += 1 
					setTimeout(()=>{
						uni.stopPullDownRefresh()
					},1000)
				})
				.catch(err=>{
					console.log('getTopicsERR',err)
					
					
				})
				
				postsRequest.get_my_topics(app.globalData.token)
				.then((res)=>{
					this.my_topics = res.data.topics
					this.resCounts += 1 
				})
				.catch(err=>{
					console.log('getmyTopicsERR',err)  
				})
				
				postsRequest.gettopics(this.historyTopicId, app.globalData.token)
				.then(res=>{
					this.my_historyTopics = res.data.topics
					this.resCounts += 1 
				})
				.catch(err=>{
					console.log('getmyTopicsERR',err)
	
				})
			},
			onShareAppMessage(e) {
			     return {
			                title: `云中助手`,
			                path: `/pages/index/index`,
			                imageUrl: '../../static/image/welcome.png'
			              }
			}
		}
	}
</script>

<style>
	#index{
		width: 90%;
		margin: 0 auto;
	}
	.userinfo{
		width: 100%;
		height: 180rpx;
		background-color: #FFFFFF;
		margin-top: 16px;
		display: flex;
		align-items: center;
	}
	
	.userinfo image{
		margin-left: 30rpx;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}
	.userinfo view {
		margin-left: 30rpx;
		width: 300rpx;
	}
	
	.posts{
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}
	.postsItem{
		width: 18%;
		margin: 6rpx 6rpx;
		text-align: center;
	}
	.postsItem image{
		width: 110rpx;
		height: 110rpx;
		background-color: #b8b8b8;
		border-radius: 4px;
	}
	.postsItem view{
		font-size: 22rpx;
		overflow:hidden; 
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.myNotify{
		position: fixed;
		background-color: #f30000;
		color: #FFFFFF;
		font-size: 26rpx;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
		line-height: 30px;
		display: none;
	}
	.title{
		font-size: 30rpx;
		margin-left: 10rpx;
		margin-bottom: 20rpx;
		background-color: #11A342;
		color: #FFFFFF;
		padding-left: 10rpx;
		line-height: 40rpx;
		
	}
	.errorTip{
		width: 500rpx;
		line-height: 40rpx;
		font-size: 36rpx;
		text-align: center;
		/* background-color: #d3cece; */
		z-index: 2;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
</style>
