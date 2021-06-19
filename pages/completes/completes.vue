<template>
	<view id="completes">
		<view style="text-align: right;"><button size="mini" open-type="share">分享</button></view>
		<view class="completesBlock">  
			<view class="completescontent">
				<view ><text>{{taskInfo.title}}</text></view>
				<view ><text class="mybage">{{taskInfo.repeat?'多次签到':'单次签到'}}</text></view>
				<view style="font-size: 28rpx;">{{taskInfo.beginTime}} ~ {{taskInfo.endTime}}</view>
				<view v-if="taskInfo.content" style="font-size: 28rpx;"><text style="word-wrap:break-word;word-break:normal; ">{{taskInfo.content}}</text></view>
				<image  v-for="(item, index) in taskInfo.files" :key="index" :src="item.thumbnail" class="completeImg" @click="CpreviewImage(index)"></image>
			</view>
		</view>
		
		<button type="primary" style="margin-top: 30rpx;" @click="clockInClick" :disabled="isDisabled">{{conditionStatus}}</button>
		<!-- <button type="primary" style="margin-top: 30rpx;" @click="clockInClick" :disabled="!taskInfo.conditions.condition">{{taskInfo.conditions.condition?'点击签到':'已签到'}}</button> -->
		
		<view style="display: flex; justify-content: space-between; align-items: center; margin-top: 10rpx;">
			
			<view style="font-size: 24rpx; text-align: right; color: #f04142 ;  font-weight: 400;" ><text style="padding: 6rpx;" @click="gotoTopic">点击进入 {{topicName}} 圈子></text></view>
			<view v-if="owned">
				<button size="mini"  style="margin-right: 10rpx;" @click="editTask">编辑</button>
				<button size="mini" type="warn"  @click="()=>{this.deldialog = true;}">删除</button>
			</view>
		</view>
		<van-dialog  :show="deldialog" show-cancel-button  title="是否要删除任务"
		@confirm='delconfirm' @close="()=>{this.deldialog = false;}"  />
		<view class="completesBlock" style="margin-top: 10rpx;">
			<view class="completescontent ruler">
				<view>签到规则</view>
				<view >请在{{taskInfo.endTime}}之前完成签到</view>
				<view>仅发起人可[删除、修改]签到记录</view>
			</view>
		</view>
		<view v-if="owned" style="text-align: right; margin-top: 10rpx;">
			<button size="mini"  style="margin-right: 10rpx;" @click="gotooutputImg">拼图</button>
			<button size="mini"  style="margin-right: 10rpx;" @click="gotoCompletedUserinfo('clockIn')">完成情况</button>
			<button size="mini"   @click="export_sheet" style="margin-right: 10rpx;">导出明细表</button>
			<button v-if="completes.length" size="mini"   @click="gotodownloadImage">下载附件</button>
		</view>
		
		<view class="completesBlock" style="margin-top: 30rpx;" >
			<!-- .recordTtile{
				margin-left: 20rpx;
				line-height: 80rpx;
			} -->
			<view class="recordTtile" style="display: flex;justify-content: space-between;align-items: center;  height: 80rpx; width: 96%; margin: 0 auto;line-height: 80rpx; " >
				<view style="">{{owned? '签到记录':'我的签到记录'}}<text class="mybage" style="margin-left: 10rpx; border-radius: 8px;" v-if="completes.length">{{completes.length}}条</text></view>
				<view v-if="owned" style="font-size: 22rpx; color: #969696; ">左滑可删除记录</view>
				<view v-else style="font-size: 22rpx;color: #969696; ">如需修改请联系管理员删除</view>
			</view>
			
			<view class="recordItem" v-if="completes.length && owned">
				<van-swipe-cell  :right-width="65"  class="recordItem" v-for="(item, index) in completes" :key="index" >
				  <view class="recordContent">
					  <image :src="item.userInfo.avatarUrl" ></image>
					  <view class="recordItemContent">  
					  	<view>{{item.userInfo.nickName}}</view>
					  	<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
					  		<view v-if="item1 && index1 !== 'photo' && index1 !== 'completeTime' && index1 !== 'completeId' && index1 !== 'files' && index1 !== 'yesno' && index1 !== 'havenot'">{{index1 | findtitle}} {{item1}}</view>
					  	</view>
					  	<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
					  		<view v-if="item1!== null && index1 == 'yesno' ">{{index1 | findtitle}} {{item1?'是':'否'}}</view>
					  	</view>
					  	<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
					  		<view v-if="item1!== null && index1 == 'havenot' ">{{index1 | findtitle}} {{item1?'有':'无'}}</view>
					  	</view>
					  	<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
					  		<view v-if="item1 && index1 == 'photo'" class="completeListImage">
					  				<image v-for="(item3,index3) in item1" :key="index3" :src="item3.thumbnail" mode="aspectFill" @click="comleteListImageClick(item1, index3)"></image>
					  		</view>
					  	</view>
					  	<view style="font-size: 24rpx; color: #555555;">{{item.completeInfo.completeTime}}</view>
					  </view>
				  </view>
				  <view slot="right" @click="swipelClick(item)" style="width: 80rpx;height: 80rpx;background-color: #ee0a24;line-height: 80rpx; color: #FFFFFF; text-align: center; margin-top: 20rpx; font-size: 28rpx;">删除</view>
				</van-swipe-cell>
			</view>
			<view class="recordItem" v-else-if="completes.length && !owned">
				<view class="recordContent" v-for="(item, index) in completes" :key="index" >
					<image :src="item.userInfo.avatarUrl" ></image>
					<view class="recordItemContent">  
						<view>{{item.userInfo.nickName}}</view>
						<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
							<view v-if="item1 && index1 !== 'photo' && index1 !== 'completeTime' && index1 !== 'completeId' && index1 !== 'files' && index1 !== 'yesno' && index1 !== 'havenot'">{{index1 | findtitle}} {{item1}}</view>
						</view>
						<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
							<view v-if="item1!== null && index1 == 'yesno' ">{{index1 | findtitle}} {{item1?'是':'否'}}</view>
						</view>
						
						<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
							<view v-if="item1!== null && index1 == 'havenot' ">{{index1 | findtitle}} {{item1?'有':'无'}}</view>
						</view>
						<view v-for="(item1, index1) in item.completeInfo" :key="index1" style="font-size: 26rpx; color: #555555;">
							<view v-if="item1 && index1 == 'photo'" class="completeListImage">
									<image v-for="(item3,index3) in item1" :key="index3" :src="item3.thumbnail" mode="aspectFill" @click="comleteListImageClick(item1, index3)"></image>
							</view>
						</view>
						<view style="font-size: 24rpx; color: #555555;">{{item.completeInfo.completeTime}}</view>
					</view>
				</view>
			</view>
			
			<view v-else-if="!completes.length" class="norecordItem">
				没有更多结果~
			</view>
			
		</view>
		<van-dialog  :show="delComDialog" show-cancel-button  title="是否删除此记录"
		@confirm='delComconfirm' @close="()=>{this.delComDialog = false;}"  />
		
	
	</view>
</template>

<script>
	import vanDialog from '../../wxcomponents/vant/dialog'
	import vanSwipeCell from '../../wxcomponents/vant/swipe-cell'
	import {postsRequest} from "../../network/posts.js";
	import {GetDistance, timeSubstr} from '../../utils/common.js'
	import {completesRequest} from "../../network/completes.js";
	import {clockInRequest} from "../../network/clockIn.js";
	
	const DEFAULT_IMG = 'https://live.chinaedgecomputing.com:6020/g/static/bing/daily.jpg';
	const app = getApp()
	let that;
	export default {
		data() {
			return {
				dialogShow:false,
				taskId:null,
				taskInfo:null,
				completes:[],
				isDisabled:false,
				conditionStatus:'',
				message:'',
				inrange: true,  //在签到范围里
				topicId:null,
				topicsInfo: null,
				deldialog: false,
				delComDialog: false,
				topicName:'',
				owned: false,
				fides:[],
				field_keys:[],
				fieldValue:[],
				shareImg: DEFAULT_IMG,
				
			}
		},
		filters: {   //转换方法  
		    findtitle(data) {
				// const fides = that.fides.split( ',' )
				// const field_keys = that.field_keys.split( ',' )
				if(data == 'completeTime'){
					return ''
				}
				var a = ''
				that.field_keys.forEach((item, index)=>{
					if(data == item){
						
						a = that.fides[index]
					}
				})
				return a + ':'
			} 
		},
		components:{vanDialog, vanSwipeCell},
		onLoad(options) {
			this.topicId = options.topicId
			this.taskId = parseInt(options.taskId)
			this.glancThrough(options)
		},
		
		onShow(){
			if (app.globalData.token){
				console.log("has token")
				this.onloadFnc()
			}else{
				console.log("no token")
				app.globalData.tokenReadyCallback = this.onloadFnc;
			}
		},
		onPullDownRefresh() {
		       if (app.globalData.token){
		       	this.onloadFnc()
		       }else{
		       	app.globalData.tokenReadyCallback = this.onloadFnc;
		       }
		   },
		methods: {
			onloadFnc(){
				this.getposts()
				this.get_task()
			},
			swipelClick(item){
				this.onLPcompleteId = item.completeInfo.completeId
				this.delComDialog = true
			},
			async checkRange(){
				return new Promise((reslove, reject)=>{
					if(this.taskInfo.position && this.taskInfo.positionAddress){     //是否开启签到
						uni.getLocation({ 
						    type: 'gcj02',
							altitude: true,
						    success:(res)=> {
								var range = GetDistance(res.latitude, res.longitude, this.taskInfo.positionLat, this.taskInfo.positionLon)
								range = parseInt(range)
								console.log('current Loc:',res)
								console.log('task Loc:', this.taskInfo.positionLat, this.taskInfo.positionLon)
								console.log('range:',range)
								console.log('task positionRange:',this.taskInfo.positionRange)
								if(range > this.taskInfo.positionRange){
									console.log('rangefalse')
									uni.showToast({
									    title: '您不在签到范围',
									    duration: 2000,
										icon:'none'
									});
									reslove(false)
								}else{
									console.log('rangeTure')
									reslove(true)
								}
						    },
							fail:(err)=>{
								console.log('rangefalse')
								uni.showToast({
								    title: '获取定位失败',
								    duration: 2000,
									icon:'none'
								});
								reslove(false)
							}
						});
					}else{    //没有范围限制
						reslove(true)
					}
				})
			},
			async clockInClick(){
				if(!app.globalData.userInfo){   //如果没有登录的话
					uni.navigateTo({
						url:'/pages/login/login'
					})
					return
				} 
				let ischeckRange = await this.checkRange()
				
				if(!ischeckRange){
					return
				}
				
				if(this.topicsInfo && !this.topicsInfo.joined){
					
					this.jointopics()
				}
				
				if(this.taskInfo.fields.length){
					uni.navigateTo({
						url:`/pages/fields/fields?taskId=${this.taskId}`
					})
				}else{   //没有fields的话
					
					var data = {}   
					data.taskId = this.taskId
					completesRequest.submit_data(data, app.globalData.token)
					.then((res)=>{
						this.get_task()
						this.get_all_completes()
					})
					.catch(err=>{
						console.log(err)
					})
				}
				// 
			},
			
			getposts(){
				if(this.topicId){
					postsRequest.getposts(this.topicId, app.globalData.token)
					.then((res)=>{
						this.topicsInfo = res.data.topic
						this.owned = res.data.topic.owned
						
						if(this.topicsInfo.topic.length>7){    //限制点击进入圈子的时候
							this.topicName = this.topicsInfo.topic.substr(0,7)+'...'
						}else{
							this.topicName = this.topicsInfo.topic
						} 
						if(res.data.topic.owned){
							this.get_all_completes()
						}else{
							this.get_mine()
						}
					})
				}
			},
			gotooutputImg(){
				uni.navigateTo({
					url:`/pages/outputImg/outputImg?taskId=${this.taskId}`
				})
			},
			delComconfirm(){
				completesRequest.soft_delete(this.onLPcompleteId, app.globalData.token)
				.then(res=>{
					uni.showToast('删除成功')
					this.get_all_completes()
				})
			},
			get_task(){
				completesRequest.get_task(this.taskId, app.globalData.token)
				.then((res)=>{
					this.taskInfo = res.data
					this.taskInfo.beginTime = this.taskInfo.beginTime.substr(0,16)
					this.taskInfo.endTime = this.taskInfo.endTime.substr(0,16)
					this.taskInfo.endTime = timeSubstr(this.taskInfo.beginTime,this.taskInfo.endTime)
					if(res.data.status == 'active'){
						if(res.data.conditions.condition){
							this.isDisabled = false
							this.conditionStatus = '点击提交'
						}else{
							this.isDisabled = true
							this.conditionStatus = '已确认'
						}
					}else if(res.data.status == 'notstarted'){
						this.isDisabled = true
						this.conditionStatus = '未开始'
					}else if(res.data.status == 'ended'){
						this.isDisabled = true
						this.conditionStatus = '已结束'  
					}
					
					this.fides = res.data.fields.split( ',' )
					this.field_keys = res.data.field_keys.split( ',' )
					for(var i = 0; i<this.field_keys.length;i++){
					
						this.fieldValue.push('')
					}
					
					var a = this.taskInfo.files.find((item)=>{
							return item.type == 'image'
					})
					if(a){
						this.shareImg = a.url
					}
					setTimeout(()=>{
						uni.stopPullDownRefresh()
					},1000)
					
				})
				.catch(err=>{
					console.log(err)
					setTimeout(()=>{
						this.onloadFnc()
					},500)
				})
			},
			get_all_completes(){
				completesRequest.get_all_completes(this.taskId, app.globalData.token)
				.then((res)=>{
					this.completes = res.data.completes
					console.log('this.completes',this.completes)
				})
			},
			get_mine(){
				completesRequest.get_mine(this.taskId, app.globalData.token)
				.then(res=>{
					// this.completes = res.data.completes
					this.completes = []
					res.data.completes.forEach(item=>{
						this.completes.push({completeInfo: item})
					})
					console.log(this.completes)
				})
			},
			CpreviewImage(index){
				let previewImage = []
				this.taskInfo.files.forEach((item)=>{
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
			gotoTopic(){
				uni.navigateTo({ 
					url:`/pages/topics/topics?topicId=${this.topicsInfo.topicId}`
				})
			},
			gotoCompletedUserinfo(e){
				uni.navigateTo({
					url:`/pages/completedUserinfo/completedUserinfo?type=${e}&id=${this.taskId}&title=${this.taskInfo.title}`
				})
			},
			delconfirm(){
				completesRequest.soft_delete(this.taskId, app.globalData.token)
				.then((res)=>{
					console.log(res)
					uni.navigateBack()
				})
			},
			editTask(){
				uni.navigateTo({
					url:`/pages/clockIn/clockIn?taskId=${this.taskId}`
				})
			},
			export_sheet(){
				completesRequest.export_sheet(this.taskId, app.globalData.token)
				.then((res)=>{
					console.log(res)
					uni.navigateTo({
						url:`/pages/downLoad/downLoad?downLoadURl=${res.data.url}&title=${this.topicsInfo.topic}`
					})
				})
				.catch(err=>{
					console.log(err)
					uni.showToast({
						title:'导出失败',
						icon:'none'
					})
				})
			},
			gotodownloadImage(){
				clockInRequest.downloadImg(this.taskId, app.globalData.token)
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
			
			onShareAppMessage(e) {
			     if(e.from=="button" ){
			      return {
			                title: `云中签到:${this.taskInfo.title}`,
			                path: `/pages/completes/completes?taskId=${this.taskId}&topicId=${this.topicId}`,
			                imageUrl: this.shareImg
			              }
			    }else{
			      return {
			                title: `云中签到`,
			                path: `/pages/index/index`,
			                imageUrl: '../../static/image/welcome.png'
			              }
			    }
			},
		},
		created(){
			that = this
		},
	}
</script>

<style scoped>

#completes{
	width: 94%; 
	margin: 10px auto 0px auto;
}
.completesBlock{
	width: 100%;
	background-color: #FFFFFF;
	border: 1rpx solid #E1E1E1;
	border-radius: 4px;
}
.completescontent{
	padding: 20rpx;
}
.completescontent view{
	margin-bottom: 16rpx;
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

.completeImg {
	width: 140rpx;
	height: 140rpx;
	margin-right: 10rpx;
	margin-top: 4rpx;
}
.completeListImage{
	width: 450rpx;
	display: flex;
	flex-wrap: wrap;
	margin: 20rpx 0;
	
}
.completeListImage image{
	width: 160rpx;
	height: 160rpx;
	margin: 10rpx;
}
</style>
