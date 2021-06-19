<template>
	<view id="topics">
		<view class="topicsHead" style="margin-bottom: 20rpx;">
			<image v-if="topicsInfo.photoUrl" :src="topicsInfo.photoUrl" mode="aspectFit" class="topicsHead-img" @click="imgClick"></image>
			<image v-else src="../../static/image/logo.png" mode="aspectFit" class="topicsHead-img" ></image>
			<view class="topicsHead-text">
				<view class="text-title" >{{topicsInfo.topic}} </view>
				<view class="text-text" @click="gotomemberList">成员 {{topicsInfo.memberNum}} ></view>
			</view> 
			
			<view style="text-align: right;display: flex; align-items: center;">
				<image v-if="topicsInfo.location" src="../../static/image/location.png" style="width: 40rpx;height: 40rpx; padding: 10rpx; padding-bottom: 18rpx;"
				@click="checkLocation"></image>
				<view style="width: 130rpx;">
					<button v-if="owned" size="mini"  class="topicsHead-btn" @click="gotoSetTopic">设置</button>
					<button size="mini" open-type="share" class="topicsHead-btn">分享</button>
				</view>
			</view>
		</view>
		<button class="joinbtn" v-if="!topicsInfo.joined" @click="jointopics" type="primary">加入此圈子</button>
			<van-grid>
			  <van-grid-item v-if="resources.length || owned" icon="/static/image/calendar.png" text="预约"  @click="gridaClcik('index')" />
			  <van-grid-item icon="/static/image/postLogo.png" text="打卡"  @click="gotopostList('index')" />
			  <van-grid-item icon="/static/image/gallery.png" text="群相册"  @click="gotoGallery('index')" />
			  <!-- <van-grid-item icon="/static/image/market.png" text="小店"  @click="gotoStore('index')" /> -->
			</van-grid>
		  
		<view v-if="owned || noticeList.length" style="margin-top: 14rpx;">
			<view style="display: flex; align-items: center; justify-content: space-between;" >
				<view style="display: flex; align-items: center;">
					<view class="mysection"> 通知</view>  
					<image v-if="owned" src="../../static/image/add4.png" style="width: 30rpx;height: 30rpx;padding: 20rpx;" @click="createTopicNotices"></image>
				</view>
			</view>
			<view v-if="!noticeList.length"  style="padding: 30rpx 0 ; background-color: #FFFFFF; ">
				<view style="text-align: center; color: #7c7c7c;line-height: 100rpx; font-size: 30rpx;" >暂时没有任何通知~</view>
			</view>
			<view class="tasksItem" v-for="(item, index) in noticeList" :key="index"  @click="noticesItemClick(item)">
				<view class="taskTitle">{{item.title}}</view>
				<view class="taskContent">{{item.content}}</view>
				<view class="taskText">{{item.createdTime}}</view>
			</view>
		</view>
		
		<view v-if="owned || clockInList.length" style="margin-top: 14rpx;">
			<view style="display: flex; align-items: center; justify-content: space-between;" >
				<view style="display: flex; align-items: center;">
					<view class="mysection"> 任务</view>  
					<image v-if="owned" src="../../static/image/add4.png" style="width: 30rpx;height: 30rpx;padding: 20rpx;" @click="createTopicClockIn"></image>
				</view>
				<view @click="gotoMoreTasks('clockIn')" style="display: flex; align-items: center;">
					<text style="font-size: 26rpx; color: #747474 ;">更多</text>
					<image src="../../static/image/more.png" style="width: 40rpx;height: 40rpx;"></image>
				</view>
			</view>
			<view v-if="!clockInList.length"  style="padding: 30rpx 0 ; background-color: #FFFFFF; ">
				<view style="text-align: center; color: #7c7c7c;line-height: 100rpx; font-size: 28rpx;" >适用于签到，收集图片，文件或二维码等信息</view>
			</view>
			<view class="tasksItem" v-for="(item, index) in clockInList" :key="index"  @click="taskItemClick(item.taskId)">
				<view class="taskTitle">{{item.title}}</view>
				<view class="taskText">{{item.beginTime}} ~ {{item.endTime}}</view>
				<view class="mybage" v-if="owned"><text :class="{ bageactive: item.status == 'active'}">{{item.status | statusChange}}</text><text :class="{ bageactive: item.completeAmount}">{{item.completeAmount}}人参与</text></view>
				<view class="mybage" v-else><text :class="{ participatebageactive: !item.conditions.condition}">{{item.conditions.condition?'未签到':'已签到'}}</text></view>
			</view>
		</view>
		
		<view v-if="owned || projectsList.length" style="margin-top: 14rpx;">
			<view style="display: flex; align-items: center; justify-content: space-between; " >
				<view style="display: flex; align-items: center;">
					<view class="mysection"> 接龙</view>  
					<image v-if="owned" src="../../static/image/add4.png" style="width: 30rpx;height: 30rpx;padding: 20rpx;" @click="projectAddClick"></image>
				</view>
					<view @click="gotoMoreTasks('project')" style="display: flex; align-items: center;">
						<text style="font-size: 26rpx; color: #747474 ;">更多</text>
						<image src="../../static/image/more.png" style="width: 40rpx;height: 40rpx;"></image>
					</view>
			</view> 
			<view v-if="projectsList.length<1 && promotionList.length<1"  style="padding: 30rpx 0 ; background-color: #FFFFFF; ">
				<view style="text-align: center; color: #7c7c7c;line-height: 100rpx; font-size: 28rpx;" >适用于团购，公开的信息收集等</view>
			</view>
			<view class="tasksItem"  v-for="(item, index) in projectsList" :key="index"  @click="projectItemClick(item.projectId)">
				<view class="taskTitle">{{item.title}}</view>
				<view class="projectImg" >
					
					<image v-for="(imgItem,imgIndex) in item.files" :key="imgIndex" :src="imgItem.url" v-show="imgIndex<3" mode="aspectFill"></image>
				</view>
				<view class="mybage" ><text :class="{ bageactive: item.completeAmount}">{{item.completeAmount}}人参与</text> <text  class="taskText" style="background-color: #FFFFFF; color: #626262;">于 {{item.endTime}} 结束</text></view>
			</view>
			<view class="tasksItem"  v-for="(item, index) in promotionList" :key="index"  @click="promotionItemClick(item.promotionId)">
				<view class="taskTitle">{{item.title}}</view>
				<view class="projectImg" >
					<image v-for="(imgItem,imgIndex) in item.files" :key="imgIndex" :src="imgItem.url" v-show="imgIndex<3" mode="aspectFill"></image>
				</view>
				<view class="mybage" ><text :class="{ bageactive: item.published}">{{item.published?'发布中':'未发布'}}</text><text  class="taskText" style="background-color: #FFFFFF; color: #626262;">于 {{item.endTime}} 结束</text></view>
			</view>
		</view>
		<view v-if="owned || questionnaireList.length" style="margin-top: 14rpx;">
			<view style="display: flex; align-items: center; justify-content: space-between; " >
				<view style="display: flex; align-items: center;">
					<view class="mysection"> 问卷</view>  
					<image v-if="owned" src="../../static/image/add4.png" style="width: 30rpx;height: 30rpx;padding: 20rpx;" @click="createQuestionnaire"></image>
				</view>
				<view v-if="owned" @click="gotoImpQuestionnaire" style="display: flex; align-items: center;">
					<text style="font-size: 26rpx; color: #747474 ;">导入</text>
					<image src="../../static/image/more.png" style="width: 40rpx;height: 40rpx;"></image>
				</view>
			</view>
			<view v-if="!questionnaireList.length"  style="padding: 30rpx 0 ; background-color: #FFFFFF; ">
				<view style="text-align: center; color: #7c7c7c;line-height: 100rpx; font-size: 30rpx;" >暂时没有任何问卷~</view>
			</view>
			<view class="questionnaireList"  v-for="(item, index) in questionnaireList" :key="index"  @click="questionnaireListClick(item.questionnaireId)">
					<view>
						<view class="taskTitle" style="width: 530rpx;">{{item.title}}</view>
						<view class="mybage" ><text style="margin: 8rpx 0 0 0" :class="{ bageactive: item.completeAmount}">{{item.completeAmount}}人参与</text></view>
					</view>
					<button size="mini" v-if="owned" style="margin: 0;" @click.stop="openMoreMenu(item)">管理</button>
			</view>
			<van-popup :show="moreMenupopoUp" position="bottom" round @close="closeMorePopoup('1')">
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx;"
				 @click.stop="questionnaireAnalysis">统计</view>
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx;" 
				@click.stop="gotoCompletedUserinfo">完成情况</view>
				<view style="height: 60rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center"></view>
			</van-popup>
		</view>
		<miniapp-tip></miniapp-tip>
		
		<view style="display: flex; align-items: center; justify-content: space-between; " >
			<view class="mysection"> 打卡</view>
			<view @click="gotopostList" style="display: flex; align-items: center;">
				<text style="font-size: 26rpx; color: #747474 ;">更多</text>
				<image src="../../static/image/more.png" style="width: 40rpx;height: 40rpx;"></image>
			</view>
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
						<!-- <view v-for="(filesItem, filesindex) in item.files" :key="filesindex"  >
							<free-audio v-if="filesItem.type == 'audio' " :audioId='audio1' :url='filesItem.url'></free-audio>
						</view> -->
					
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
		<view style="width: 100%; height: 200rpx;"></view>
		<van-dialog  use-slot  :show="postDialogShow" show-cancel-button  title="评论"
		  @confirm='postdialogconfirm' @close="()=>{this.postDialogShow = false; this.postDialogInput = ''}" >
		 <textarea style="height: 140rpx; width: 80%; margin: 20rpx auto;"  rows="3" placeholder="请输入评论" v-model="postDialogInput" />
		</van-dialog>
		<van-popup :show="showpopoUp" position="bottom" round @close="closePopoup('1')">
				<view v-if="owned" style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx; font-size: 32rpx;" @click="delPost">删除打卡</view>
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto;"  >
					<button  open-type="share" id="postShare" class="buttonClass">分享</button>
				</view>
				<view style="height: 60rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center"></view>
		</van-popup>
		<van-popup :show="pjtshow" position="bottom" round @close="closepjt('1')">
				<view  style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx; font-size: 32rpx;"  @click="createTopicProjects">接龙</view>
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx; font-size: 32rpx;" @click="cretepromotion">团购</view>
				
				<view style="height: 60rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center"></view>
		</van-popup>
		
		
	</view>  
</template>

<script>
	
	import {postsRequest} from "../../network/posts.js";
	import {manageRequest} from "../../network/manage.js";
	import {clockInRequest} from "../../network/clockIn.js";
	import {FileRequest} from "../../network/FileRequest.js";
	import {projectsRequest} from '../../network/projects.js'
	import {noticesRequest} from '../../network/notices.js'
	import {UserInfoRequest} from "../../network/userInfo.js";
	import {QuestionnaireRequest} from "../../network/questionnaire.js";
	import {resourcesRequest} from "../../network/resources.js";
	import {storeRequest} from "../../network/store.js";
	
	
	import vanGrid from '../../wxcomponents/vant/grid'
	import vanGridItem from '../../wxcomponents/vant/grid-item'
	import vanDialog from '../../wxcomponents/vant/dialog'
	import vanIcon from '../../wxcomponents/vant/icon'
	import vanPopup from '../../wxcomponents/vant/popup'
	import mybaseinfo from '@/components/mybaseinfo.vue'
	import {timeSubstr, timeStamp, timeDistance, parseQueryString} from '../../utils/common.js'
	
	
	const app = getApp()
	
	export default {
		data() {
			return {
				topicsd: null,
				topicsInfo: null,
				title:'云中助手',
				clockInList:[],
				projectsList:[],
				promotionList:[],
				questionnaireList:[],
				postsList: [],
				postDialogShow:false,
				postDialogInput: '',
				commentInput:'',
				onCommentPostId:null,
				showpopoUp:false,
				pjtshow:false,
				onCommentIndex: null,
				isloading:true,
				onSettingPost: null,
				owned:false,
				noticeList:[],
				moreMenupopoUp:false,
				onPopupItem:null,
				resources:[],
			}
		},
		components:{
			vanGrid,
			vanGridItem,
			vanDialog,
			vanIcon,
			vanPopup
		},
		onLoad(options) {
			    if ('q' in options){
			      var q = decodeURIComponent(options.q)
			      console.log(q)
			      var params = parseQueryString(q);
			      if ('topicsId' in params){
					  this.topicId = params.topicsId
			      }
			    }
				else
			this.topicId = options.topicId
			this.glancThrough(options)
		},
		onShow(){
			if (!app.globalData.token){
				app.globalData.tokenReadyCallback = this.onShowFnc;
			}else{   
				this.onShowFnc()
			}
		},
		filters:{
			statusChange(value){
				if(value == 'active') return '签到中'
				if(value == 'ended') return '已结束'
				if(value == 'notstarted') return '未开始'
			},
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
		onPullDownRefresh() {
		       if (!app.globalData.token){
		       	app.globalData.tokenReadyCallback = this.onShowFnc;
		       }else{   
		       	this.onShowFnc()
		       }
		   },
		methods: {
			onShowFnc(){
				this.getposts()
				this.get_top_tasks()
				this.get_ref_projects()
				this.get_promotion()
				this.get_ref_questionnaire()
				this.get_all_posts()
				this.get_all_notice()
				this.get_resources()
			},
			createTopicClockIn(){
				uni.navigateTo({
					url:`/pages/clockIn/clockIn?topicId=${this.topicId}&taskId=new`
				})
			},
			createTopicProjects(){
				this.pjtshow = false
				uni.navigateTo({
					url:`/pages/projects/projects?topicId=${this.topicId}&projectId=new`
				})
			},
			cretepromotion(){
				this.pjtshow = false
				uni.navigateTo({
					url:`/pages/createPromotion/createPromotion?topicId=${this.topicId}&mode=new`
				})
			},
			createTopicNotices(){
				uni.navigateTo({
					url:`/pages/notices/notices?topicId=${this.topicId}`
				})
			},
			get_all_notice(){
				noticesRequest.get_all_notice(this.topicId, app.globalData.token)
				.then((res)=>{
					this.noticeList = res.data.notices
				})
			},
			gotomemberList(){
				uni.navigateTo({
					url:`/pages/memberList/memberList?topicId=${this.topicId}`
				})
			},
			
			taskItemClick(e){
				uni.navigateTo({
					url:`/pages/completes/completes?taskId=${e}&topicId=${this.topicId}`
				})
			},
			projectItemClick(e){
				uni.navigateTo({
					url:`/pages/projectsCompletes/projectsCompletes?projectId=${e}&owned=${this.topicsInfo.owned}&topicId=${this.topicId}`
				})
			},
			promotionItemClick(e){
				uni.navigateTo({
					url:`/pages/secKill/secKill?promotionId=${e}&topicId=${this.topicId}`
				})
			},
			noticesItemClick(item){
				uni.navigateTo({
					url:`/pages/noticesCompletes/noticesCompletes?noticeId=${item.noticeId}&topicId=${this.topicId}&topic=${this.topicsInfo.topic}`
				})
			},
			
			onShareAppMessage(e) {
			     if(e.from=="button" ){
					console.log(e)
					if(e.target.id == 'postShare'){
						this.showpopoUp = false
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
			                path: `/pages/index/index`,
			                imageUrl: '../../static/image/welcome.png'
			              }
			    }
			},
			get_top_tasks(){
				manageRequest.get_top_tasks(this.topicId, app.globalData.token)
				.then(res=>{
					this.clockInList = res.data.tasks
					this.clockInList.forEach((item,index)=>{
						item.beginTime = item.beginTime.substr(0,16)
						item.endTime = item.endTime.substr(0,16)
						item.endTime = timeSubstr(item.beginTime, item.endTime)
					})
				})
			},
			get_ref_projects(){
				projectsRequest.get_top_projects(this.topicId, app.globalData.token)
				.then((res)=>{
					this.projectsList = res.data.projects
				})
			},
			get_promotion(){
				storeRequest.get_promotion(this.topicId, app.globalData.token)
				.then((res)=>{
					this.promotionList = res.data.promotions
				})
			},
			get_ref_questionnaire(){
				QuestionnaireRequest.get_ref_questionnaire(this.topicId)
				.then((res)=>{
					this.questionnaireList = res.data.questionnaires
				})
			},
			download(item){
				uni.downloadFile({
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
			},
			gotoImpQuestionnaire(){
				uni.navigateTo({
					url:`/pages/impQuestionnaire/impQuestionnaire?topicId=${this.topicId}`
				})
			},
			gotoMoreTasks(e){
				uni.navigateTo({
					url:`/pages/moreTasks/moreTasks?topicId=${this.topicId}&type=${e}`
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
			
			async get_all_posts(){
				let res = await postsRequest.get_all_posts(1, '全部',this.topicId,  app.globalData.token)
				if(res.data.posts.length){
					this.postsList = []
					this.postsList.push(res.data.posts[0])
				}
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
			get_resources(){
				resourcesRequest.get_resources(this.topicId, '', '', app.globalData.token)
				.then((res)=>{
					this.resources = res.data.resources
					setTimeout(()=>{
						uni.stopPullDownRefresh()
					},1000)
				})
			},
			gotoGallery(){
				uni.navigateTo({
					url:`/pages/gallery/gallery?topicId=${this.topicId}`
				})
			},
			gotoStore(){
				uni.navigateTo({
					url:`/pages/store/store?topicId=${this.topicId}`
				})
			},
			likeClick(postId,index){
				this.posts_like(postId)
				this.get_all_posts()
				
			},
			settingClick(e){
				console.log(e,'onsetting')
				this.showpopoUp = true
				this.onSettingPost = e 
			},
			posts_like(postId){
				postsRequest.posts_like( postId, app.globalData.token)
				.then((res)=>{
				})
			},
		
			postsItemClick(postId){
				uni.navigateTo({
					url:`/pages/postDetail/postDetail?postId=${postId}`,
				})
			},
			closePopoup(){
				this.showpopoUp = false
			},
			closepjt(){
				this.pjtshow = false
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
			closeMorePopoup(){
				this.moreMenupopoUp = false
			},
			commentClick(e, index){
				this.onCommentPostId = e
				this.onCommentIndex = index
				this.postDialogShow = true
			},
			postdialogconfirm(){
				this.posts_comment(this.postDialogInput, this.onCommentPostId)
				this.get_all_posts()
				// postsRequest.get_posts_info(this.onCommentPostId,app.globalData.token)
				// .then((res)=>{
				// 	this.postsList.splice(this.onCommentIndex, 1, res.data)
				// 	console.log(this.postsList)
				// })
			},
			
			overlayClick(e){
				this.overlayShow = false
			},
			imgClick(){
				console.log('1')
				var previewImage = []
				previewImage.push(this.topicsInfo.photoUrl)
				uni.previewImage({
					urls: previewImage,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏']
					}
				});
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
			gridaClcik(){
				uni.navigateTo({
					url:`/pages/resources/resources?topicId=${this.topicId}&topic=${this.topicsInfo.topic}`
				})
			},
			gotopostList(){
				uni.navigateTo({
					url:`/pages/postList/postList?topicId=${this.topicId}&topic=${this.topicsInfo.topic}`
				})
			},
			checkLocation(){
				 uni.openLocation({
				            latitude: this.topicsInfo.location.lat,
				            longitude: this.topicsInfo.location.lon,
				            success: ()=>{
				                console.log('success');
				            }
				        });
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
			createClockIn() {
			    clockInRequest.createClockIn(app.globalData.token)
			      .then(res => {
			          this.taskId = res.data.taskId
			      })
			  },
			 gotoCompletedUserinfo(){
			 	uni.navigateTo({
			 		url:`/pages/completedUserinfo/completedUserinfo?type=questionnaire&id=${this.onPopupItem.questionnaireId}&topicId=${this.topicId}&title=${this.onPopupItem.title}`
			 	})
				this.moreMenupopoUp = false
			 },
			createQuestionnaire(){
				var envVersion = 'release'
				if (process.env.NODE_ENV === 'development') {
				    envVersion = 'develop'
				}
				uni.navigateToMiniProgram({				  appId: 'wx12a82c3a341d8177',
				  envVersion: envVersion,				  path: `pages/templates/templates?refId=${this.topicId}`,				})
			},
			gotoSetTopic(){
				uni.navigateTo({
					url:`/pages/setTopic/setTopic?topicId=${this.topicId}`
				})
			},
			questionnaireListClick(e){
				var envVersion = 'release'
				if (process.env.NODE_ENV === 'development') {
				    envVersion = 'develop'
				}
	
				uni.navigateToMiniProgram({
				  appId: 'wx12a82c3a341d8177',
				  envVersion: envVersion,
				  path: `pages/complete/complete?qid=${e}`,
				})
			},
			questionnaireAnalysis(e){
				this.moreMenupopoUp = false
				var envVersion = 'release'
				if (process.env.NODE_ENV === 'development') {
				    envVersion = 'develop'
				}
				
				uni.navigateToMiniProgram({
				  appId: 'wx12a82c3a341d8177',
				  envVersion: envVersion,
				  path: `pages/analysis/analysis?qid=${this.onPopupItem.questionnaireId}`,
				})
				
			},
			projectAddClick(){
				if (process.env.NODE_ENV === 'development') {
				    this.pjtshow = true
				}else{
					this.createTopicProjects()
				}
				
			},
			openMoreMenu(item){
				this.onPopupItem = item
				console.log('this.onPopupItem',this.onPopupItem)
				this.moreMenupopoUp = true
			},
		}
	}
</script>

<style scoped>
	#topics{
		width: 94%;
		margin: 10px auto 0px auto;
	}
 .topicsHead{
	 display: flex;
	 align-items: center;
	 justify-content: space-between;
 }
 .topicsHead-img{
	 width: 130rpx;
	 height: 130rpx;
	 border-radius: 2px;
 }
 .topicsHead-btn{
	 margin: 0;
 }
 .topicsHead-text{
	 width: 400rpx;
	 margin-left: 14rpx;
 }
 .text-title{
	 font-weight: 600;
	 font-size: 32rpx;
 }
 .text-text{
	 font-size: 28rpx;
	 color: #545454;
 }
 
 .example-body {
 	/* #ifndef APP-NVUE */
 	display: block;
 	/* #endif */
 }
 .grid-item-box {
 	flex: 1;
 	// position: relative;
 	/* #ifndef APP-NVUE */
 	display: flex;
 	/* #endif */
 	flex-direction: column;
 	align-items: center;
 	justify-content: center;
 	padding: 15px 0;
 }
 .image {
 	width: 50rpx;
 	height: 50rpx;
 }
 .text {
 	font-size: 26rpx;
 	margin-top: 10rpx;
 }
 .grilItem{
 	height: 100px !important;
 }
 .joinbtn{
	width: 300rpx; 
	text-align: center;
	position: fixed; 
	left: 50%; 
	bottom: 140rpx;  
	transform: translate(-50%,-50%);
	z-index: 10;
 }
 
  
 .questionnaireList{
	 display: flex;
	 background-color: #FFFFFF;
	 border: 1px solid #E1E1E1;
	 align-items: center;
	 padding: 16rpx 20rpx;
	 margin: 10rpx 0;
 }
  
	/* messageStyle */
 .tasksItem{
	 margin: 5rpx 0;
 	background-color: #FFFFFF;
 	border: 1px solid #E1E1E1;
	padding: 16rpx 30rpx
 }
 .taskTitle{
	width: 600rpx;
	font-size: 30rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
 }
 .ptaskTitle{
 	font-size: 30rpx;
 	white-space: nowrap;
 	overflow: hidden;
 	text-overflow: ellipsis;
 }
 .taskContent{
	 color: #626262;
 	display: -webkit-box;
 	-webkit-line-clamp:2;
 	-webkit-box-orient:vertical;
 	text-overflow:ellipsis;
 	overflow:hidden;
 	font-size: 26rpx;
 }
 .taskText{
 	font-size: 20rpx;
 	color: #626262;
 	margin-top: 4rpx;
 	margin-bottom: 4rpx;
 }
 .mybage text{
 	color: #FFFFFF;
 	background-color: #acacac;
 	border-radius: 6rpx;
 	padding: 4rpx 12rpx;
 	font-size: 20rpx;
 	margin: 20rpx 6rpx;
 }
 .bageactive{
 	background-color: #0EA391 !important;
 }
 .participatebageactive{
 	background-color: #11a342 !important;
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
.moreMenu{
	/* display: inline-block; */
	border-radius: 4px; 
	width: 50rpx;
	height: 30rpx;
	font-size: 26rpx;
	font-weight: 550;
	text-align: center;
	line-height: 30rpx;
	background-color: #dedede;
	color: #6d6d6d;
}
.setting{
	/* position: relative;
	left: 472rpx;
	top: -29rpx; */
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
