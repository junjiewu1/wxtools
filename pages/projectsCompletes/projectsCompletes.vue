<template>
	<view id="projectsCompletes">
		<view style="text-align: right;">
			<!-- <button size="mini" v-if="owned" style="margin-right: 10rpx;" @click="gotoCompletedUserinfo('project')">填写情况</button>
			<button v-if="projectCompletes.length" size="mini" style="margin-right: 10rpx;"  @click="gotodownloadImage">下载附件</button> -->
			
		</view>
		<view class="completesBlock">
			<view class="completescontent">
				<view style="padding: 20rpx;">
				<view style="display: flex; align-items: center; justify-content: space-between;">
					<text style="font-weight: 600; font-size: 32rpx;width: 600rpx;">{{projectInfo.title}}</text>
					<button v-if="!TimeLine" size="mini" open-type="share" class="shareBtn"  ><image src="../../static/image/share2.png" style="width: 40rpx;height: 40rpx;"  ></image></button>
				</view>
					
				
				<view style="font-size: 24rpx;  color: #7c7c7c;" >
					<view><text style="margin-right: 6rpx;">{{projectCompletes.length}}人参与</text>
					<text v-if="projectInfo.counts" style="margin-right: 6rpx;">数量:{{projectInfo.counts}}</text>
					<text v-if="projectInfo.yesAmount" style="margin-right: 6rpx;">{{projectInfo.yesAmount}}人选是</text>
					<text v-if="projectInfo.haveAmount" >{{projectInfo.haveAmount}}人选有</text>
					</view>
				</view>
				<view style="text-align: right;font-size: 24rpx;color: #7c7c7c;">将于 {{projectInfo.endTime}} 结束</view>
				<view v-if="projectInfo.content" style="font-size: 28rpx;"><text style="word-wrap:break-word;word-break:normal; " selectable='true'>{{projectInfo.content}}</text></view>
				</view>
				<image  v-for="(item, index) in projectInfo.files" :key="index" :src="item.url" class="projectImg" mode="widthFix" ></image>
			</view>
			<button type="primary" style="margin-top: 30rpx; width: 80%; " @click="projectClick" :disabled="!projectInfo.condition.condition">{{btnMessage}}</button>
			
			<view v-if="!TimeLine" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10rpx;">
				
				<view style="font-size: 24rpx; text-align: right;  color: #f04142 ; font-weight: 400;" ><text  style="padding: 6rpx;" @click="gotoTopic">点击进入 {{topicsInfo.topic}} 圈子></text></view>
				<view v-if="owned">
					<button size="mini"  style="margin-right: 10rpx;" @click="editproject">编辑</button>
					<button size="mini" type="warn"  @click="()=>{this.deldialog = true;}">删除</button>
				</view>
			</view>
			<view v-if="owned && !TimeLine" style="text-align: right; margin-top: 10rpx;">
				<button size="mini" v-if="owned" style="margin-right: 10rpx;" @click="gotoCompletedUserinfo('project')">填写情况</button>
				<button v-if="projectCompletes.length" size="mini" style="margin-right: 10rpx;"  @click="gotodownloadImage">下载附件</button>
				<button size="mini"   @click="export_sheet" style="margin-right: 10rpx;">导出明细表</button>
			</view>
			<van-dialog  :show="deldialog" show-cancel-button  title="是否要删除接龙"
			@confirm='delconfirm' @close="()=>{this.deldialog = false;}"  />
			
			
			
			
			<view v-if="projectCompletes.length && owned" style="margin: 50rpx 0 ; ">
				<van-swipe-cell  :right-width="65"  class="projectCompletesItem" v-for="(item, index) in projectCompletes" :key="index" style="touch-action: none;">
					<view style="display: flex; justify-content: space-between; align-items: center;width: 670rpx; padding: 20rpx; 0">
						<view  style="display: flex; align-items: center;">
							<text style="color: #7c7c7c; font-size: 26rpx; margin-right: 4rpx;">{{projectCompletes.length-index}}</text>
							<image :src="item.userInfo.avatarUrl" class="completeImg "></image>
							<view style="font-size: 30rpx; margin-right: 10rpx;">{{item.userInfo.nickName}}</view>
							<view style="color: #7c7c7c; font-size: 26rpx;">{{item.completeInfo.completeTime | postTimeStamp}}</view>
						</view>
						<view style=" width: 300rpx;text-align: right;" >
							<view  v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;display: inline-block;">
								<view  v-if="item1 && index1 !== 'photo' && index1 !== 'completeTime' && index1 !== 'completeId' && index1 !== 'files'
								 && index1 !== 'personId' && index1 !== 'havenot'&& index1 !== 'yesno'" style="margin-right: 4rpx;">{{item1}} </view> 
								<view v-if="index1 == 'havenot'" style="margin-right: 4rpx;">{{item1?'有':'无'}}</view>
								<view v-if="index1 == 'yesno' " style="margin-right: 4rpx;">{{item1?'是':'否'}}</view>
							</view>
						</view>
					</view>
					
					<view style="margin-left: 130rpx;">
						<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
							<view v-if="index1 == 'personId' ">{{item1}}</view>
						</view>
						<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
							<view v-if="item1 && index1 == 'photo'" class="completeListImage">
									<image v-for="(item3,index3) in item1" :key="index3" :src="item3.thumbnail" mode="aspectFill" 
									@click="comleteListImageClick(item1, index3)"></image>
							</view>
						</view>
					</view>
				<view slot="right" @click="swipelClick(item)" style="width: 80rpx;height: 80rpx;background-color: #ee0a24;line-height: 80rpx; color: #FFFFFF; 
				text-align: center; margin-top: 10rpx; font-size: 28rpx;">删除</view>
			</van-swipe-cell>
			</view>
			<view v-else-if="projectCompletes.length&&!owned" style="margin: 50rpx 0 ; ">
				<view class="projectCompletesItem" v-for="(item, index) in projectCompletes" :key="index" >
					<view style="display: flex; justify-content: space-between; align-items: center;width: 670rpx; padding: 20rpx; 0">
						<view  style="display: flex; align-items: center;">
							<text style="color: #7c7c7c; font-size: 26rpx; margin-right: 4rpx;">{{projectCompletes.length-index}}</text>
							<image :src="item.userInfo.avatarUrl" class="completeImg "></image>
							<view style="font-size: 30rpx; margin-right: 10rpx;">{{item.userInfo.nickName}}</view>
							<view style="color: #7c7c7c; font-size: 26rpx;">{{item.completeInfo.completeTime | postTimeStamp}}</view>
						</view>
						<view style=" width: 300rpx;text-align: right;" >
							<view  v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;display: inline-block;">
								<view  v-if="item1 && index1 !== 'photo' && index1 !== 'completeTime' && index1 !== 'completeId' && index1 !== 'files'
								 && index1 !== 'personId' && index1 !== 'havenot'&& index1 !== 'yesno'" style="margin-right: 4rpx;">{{item1}} </view> 
								<view v-if="index1 == 'havenot'" style="margin-right: 4rpx;">{{item1?'有':'无'}}</view>
								<view v-if="index1 == 'yesno' " style="margin-right: 4rpx;">{{item1?'是':'否'}}</view>
							</view>
						</view>
					</view>
					
					<view style="margin-left: 130rpx;">
						<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
							<view v-if="index1 == 'personId' ">{{item1}}</view>
						</view>
						<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
							<view v-if="item1 && index1 == 'photo'" class="completeListImage">
									<image v-for="(item3,index3) in item1" :key="index3" :src="item3.thumbnail" mode="aspectFill" 
									@click="comleteListImageClick(item1, index3)"></image>
							</view>
						</view>
					</view>
			</view>
			</view>
			<view v-else-if="!projectCompletes.length" style="margin: 50rpx 0 ; ">
				<view style="text-align: center; color: #7c7c7c;line-height: 100rpx; font-size: 30rpx;" >暂时还没人参与~</view>
			</view>
		</view>
		<van-dialog  :show="delComDialog" show-cancel-button  title="是否删除此记录"
		@confirm='delComconfirm' @close="()=>{this.delComDialog = false;}"  />
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {projectsRequest} from "../../network/projects.js";
	import {delyDate, formatDate, timeStamp} from '../../utils/common.js'
	import vanDialog from '../../wxcomponents/vant/dialog'
	import vanSwipeCell from '../../wxcomponents/vant/swipe-cell'
	import {GetDistance, timeDistance} from '../../utils/common.js'
	const DEFAULT_IMG = '../../static/image/welcome.png';
	const app = getApp()
	let that;
	export default {
		data() {
			return {
				projectId:null,
				projectInfo:null,
				projectCompletes:[],
				btnMessage:'参与接龙',
				topicId:null,
				topicsInfo:null,
				owned:false,
				fides:[],
				field_keys:[],
				fieldValue:[],
				shareImg: DEFAULT_IMG,
				progress: 0,
				deldialog: false,
				onLPcompleteId:null,
				delComDialog:false,
				TimeLine:false
			}
		},
		components:{vanDialog, vanSwipeCell},
		onLoad(options) {
			var res = wx.getLaunchOptionsSync();
			console.log(options,'options')
			this.topicId = parseInt(options.topicId)
			this.projectId = parseInt(options.projectId)
			this.glancThrough(options)  //最近浏览圈子
			if (res.scene == 1154){
				this.TimeLine = true
			}
		},
		onShow(){
			if(this.TimeLine){
				console.log('来自朋友圈')
				this.get_timeline_project()
				this.get_all_completes()
				return
			}else{
				console.log('不来自朋友圈')
				if (app.globalData.token){
					console.log("has token")
					this.onloadFnc()
				}else{
					console.log("no token")
					app.globalData.tokenReadyCallback = this.onloadFnc;
				}
			}
		},
		onPullDownRefresh() {
			if(this.TimeLine){
				console.log('来自朋友圈')
				this.get_timeline_project()
				this.get_all_completes()
				return
			}else{
				console.log('不来自朋友圈')
				if (app.globalData.token){
					console.log("has token")
					this.onloadFnc()
				}else{
					console.log("no token")
					app.globalData.tokenReadyCallback = this.onloadFnc;
				}
			}
		 },
		filters: {   //转换方法
		    findtitle(data) {
				// const fides = that.fides.split( ',' )
				// const field_keys = that.field_keys.split( ',' )
				if(data == 'completeTime' || data == 'completeId'){
					return ''
				}
				var a = ''
				that.field_keys.forEach((item, index)=>{
					if(data == item){
						
						a = that.fides[index]
					}
				})
				return a + ':'
			} ,
			postTimeStamp(value){
					return timeDistance(value)
			}
		},
		methods: {
			onloadFnc(){
				this.getposts()
				this.get_project()
				this.get_all_completes()
			},
			get_project(){
				projectsRequest.get_project(this.projectId, app.globalData.token)
				.then((res)=>{
					this.projectInfo = res.data  
					var timestamp = timeStamp(res.data.endTime)
					var now = new Date().getTime()
					if(timestamp<now){
						this.btnMessage = '已结束'
					}else{
						if(res.data.condition.condition){
							this.btnMessage='参与接龙'
						}else{
							this.btnMessage='已参与'
						}
					}
					this.fides = res.data.fields.split( ',' )
					this.field_keys = res.data.field_keys.split( ',' )
					for(var i = 0; i<this.field_keys.length;i++){
						this.fieldValue.push('')
					}
					
					var a = this.projectInfo.files.find((item)=>{
							return item.type == 'image'
					})
					if(a){
						this.shareImg = a.url
					}else if(this.topicsInfo.photoUrl){
						this.shareImg = this.topicsInfo.photoUrl
					}
				})
			},
			get_timeline_project(){
				projectsRequest.get_timeline_project(this.projectId)
				.then(res=>{
					this.projectInfo = res.data
					var timestamp = timeStamp(res.data.endTime)
					var now = new Date().getTime()
					if(timestamp<now){
						this.btnMessage = '已结束'
					}else{
						if(res.data.condition.condition){
							this.btnMessage='参与接龙'
						}else{
							this.btnMessage='已参与'
						}
					}
					this.fides = res.data.fields.split( ',' )
					this.field_keys = res.data.field_keys.split( ',' )
					for(var i = 0; i<this.field_keys.length;i++){
						this.fieldValue.push('')
					}
					
					var a = this.projectInfo.files.find((item)=>{
							return item.type == 'image'
					})
					if(a){
						this.shareImg = a.url
					}else if(this.topicsInfo.photoUrl){
						this.shareImg = this.topicsInfo.photoUrl
					}
				})
			},
			swipelClick(item){
				this.onLPcompleteId = item.completeInfo.completeId
				this.delComDialog = true
			},
			get_all_completes(){
				projectsRequest.get_all_completes(this.projectId, app.globalData.token)
				.then((res)=>{
					this.projectCompletes = res.data.completes
					setTimeout(()=>{
						uni.stopPullDownRefresh()
					},1000)
				})
			},
			gotoTopic(){
				uni.redirectTo({
				    url: `/pages/topics/topics?topicId=${this.topicId}`
				});
			},
			jointopics(){         //加入圈子
				if(!app.globalData.userInfo){
					uni.navigateTo({
						url:'/pages/login/login'
					})
					return
				}
				postsRequest.joinposts(this.topicId, app.globalData.token)
				.then((res)=>{
					uni.requestSubscribeMessage({
					      tmplIds: ['cR3fcMBV5xRRNZ2JB5kH43NGzElEPud_5Dl2GUz8yaw'],
					      success: res=>{
					        console.log("req sub success", res);
					      }
					})
				})
			},
			delconfirm(){
				projectsRequest.deleteProjects({projectId:this.projectId}, app.globalData.token)
				.then((res)=>{
					console.log(res)
					uni.navigateBack()
				})
				.catch(err=>{
					console.log(err)
					uni.showTabBar({
						title:err.data.information,
						icon:'none'
					})
				})
			},
			delComconfirm(){
				projectsRequest.soft_delete_complete(this.onLPcompleteId, app.globalData.token)
				.then(res=>{
					uni.showToast('删除成功')
					this.get_all_completes()
				})
				.catch(err=>{
					console.log('delprojectERR',err)
					uni.showToast({
						title:err.data.information,
						icon:"none"
					})
				})
			},
			gotodownloadImage(){
				projectsRequest.downloadImg(this.projectId, app.globalData.token)
				.then(res=>{
					uni.navigateTo({
						url:`/pages/downLoad/downLoad?downLoadURl=${res.data.url}&title=${this.topicsInfo.topic}`
					})
				})
				.catch(err=>{
					console.log(err)
					uni.showToast({
						title:'下载失败',
						icon:'none'
					})
				})
			},
			editproject(){
				uni.navigateTo({
					url:`/pages/projects/projects?projectId=${this.projectId}`
				})
			},
			projectClick(){
				if(!app.globalData.userInfo){   //如果没有登录的话
					uni.navigateTo({
						url:'/pages/login/login'
					})
					return
				}
				if(this.topicsInfo && !this.topicsInfo.joined){
					this.jointopics()
				}
				if(this.projectInfo.fields.length){
					uni.navigateTo({
						url:`/pages/fields/fields?projectId=${this.projectId}`
					})
				}else{
					projectsRequest.submit_data({projectId:this.projectId},this.projectId, app.globalData.token)
					this.get_project()
					this.get_all_completes()
				}
			},
			gotoCompletedUserinfo(e){
				uni.navigateTo({
					url:`/pages/completedUserinfo/completedUserinfo?type=${e}&id=${this.projectId}&title=${this.projectInfo.title}`
				})
			},
			getposts(){
				if(this.topicId){
					postsRequest.getposts(this.topicId, app.globalData.token)
					.then((res)=>{
						this.topicsInfo = res.data.topic 
						this.owned = res.data.topic.owned
					})
				}
			},
			onShareAppMessage(e) {
			     if(e.from=="button" ){
						return {
						          title: `云中接龙:${this.projectInfo.title}`,
						          path: `/pages/projectsCompletes/projectsCompletes?projectId=${this.projectId}&topicId=${this.topicId}`,
						          imageUrl: this.shareImg
						        }
			    }else{
			      return {
			                title: `云中接龙`,
			                path: `/pages/index/index`,
			                imageUrl: '../../static/image/welcome.png'
			              }
			    }
			},
			export_sheet(){
				projectsRequest.export_sheet(this.projectId, app.globalData.token)
				.then((res)=>{
					console.log(res)
					uni.navigateTo({
						url:`/pages/downLoad/downLoad?downLoadURl=${res.data.url}&title=${this.topicsInfo.topic}`
					})
				})
				.catch(err=>{
					console.log('export_sheetERR',err)
					uni.showToast({
						title:err.data.information,
						icon:'none'
					})
				})
			},
			comleteListImageClick(e,i){
					var previewImage = []
					e.forEach((item)=>{
						previewImage.push(item.url)
					})
					uni.previewImage({
						urls: previewImage,
						current: i,
						longPressActions: {
							itemList: ['发送给朋友', '保存图片', '收藏']
						}
					});
			},
			onShareTimeline(res) {
					return {
						title: this.projectInfo.title,
						query: {
							topicId:this.topicId,
							projectId:this.projectId
						},
						imageUrl:this.topicsInfo.photoUrl,
					}
			},
			CpreviewImage(index){
				let previewImage = []
				this.projectInfo.files.forEach((item)=>{
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
		},
		created(){
			that = this
		},
	}
</script>

<style>
#projectsCompletes{
	width: 94%;
	margin: 10px auto 0px auto;
}
.completesBlock{
	width: 100%;
	background-color: #FFFFFF;
	border: 1rpx solid #ffffff;
	border-radius: 14rpx;
	
}


.mybage{
	color: #FFFFFF;
	background-color: #3ec5ff;
	border-radius: 6rpx;
	padding: 4rpx 12rpx;
	font-size: 20rpx;
}
.ruler view{
	font-size: 20rpx;
	color: #626262;
	line-height: 36rpx;
	margin-bottom: 0 !important;
}
.recordTtile{
	margin-left: 20rpx;
	line-height: 80rpx;
}
.recordContent{
	display: flex;
	border-top: 1px solid #E1E1E1;
	border-bottom: 1px solid #E1E1E1;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
}
.recordContent image{
	width: 80rpx;
	height: 80rpx;
	border-radius: 4px;
	margin-left: 30rpx;
}
.recordItemContent{
	margin-left: 30rpx;
	font-size: 30rpx;
}
.recordItemContent view{
	margin-bottom: 6rpx;
}
.norecordItem{
	width: 100%;
	text-align: center;
	font-size: 30rpx;
	color: #626262;
	border-top: 1px solid #E1E1E1;
	border-bottom: 1px solid #E1E1E1;
	line-height: 200rpx;
}
.recordBtn{
	width: 100%;
	text-align: center;
	color: #626262;
	font-size: 30rpx;
	line-height: 80rpx;
}

.projectImg {
	display: block;
	width: 100%;
	margin: 20rpx auto;
}

.completeImg {
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	margin-right: 6rpx;
}
.projectCompletesItem{
	width: 96%;
	margin: 20rpx auto;
}

/* .completeImg {
	width: 140rpx;
	height: 140rpx;
	margin-right: 10rpx;
	margin-top: 4rpx;
} */
.completeListImage{
	width: 550rpx;
	display: flex;
	flex-wrap: wrap;
	margin: 20rpx 0;
	
}
.completeListImage image{
	width: 150rpx;
	height: 150rpx;
	margin: 8rpx;
}
.shareBtn{
	padding: 20rpx;
	background-color: #ffffff;
	height: 40rpx;
}
.shareBtn::after {
	   border: none;
	}
</style>
