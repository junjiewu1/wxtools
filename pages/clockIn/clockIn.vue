<template>
	<view id="clockIn">
		<view class="title">创建任务</view>
			<mybaseinfo ref='mybaseinfo'  :title="basicInfo.title" :content="basicInfo.content.text" :contentImg="contentImg"  subtitleHolder="描述(选填)" titleHolder="任务标题(最多20个字符)"  
				@uploadfile='uploadfile' @delFile="delFile"  @inputChange='inputChange' @textChange='textChange'>
			</mybaseinfo>
		 <view class="title">时间设置</view>
		 <view class="settingItemClass">
			 <view class="sttingitem btmline">
					<view class="">每日任务</view>
					<switch name="switch" class="clockInswitch" :checked='checked.repeat'  @change="()=>{this.checked.repeat = !this.checked.repeat}"/>
			 </view>
			 
			 <view class="settingTimeItems btmline" >
					<text style="margin-right: 50rpx;">开始时间</text>
					<view style="width: 220rpx;">
						<picker mode="date" :value="settingTime.startDate"  @change='(e)=>{this.settingTime.startDate = e.target.value}' >
							<text class="uni-input" >{{settingTime.startDate}}</text>
						</picker>
					</view>
					<view style="width: 100rpx;">
						<picker mode="time" :value="settingTime.startTime"  @change='(e)=>{this.settingTime.startTime = e.target.value}'>
							<text class="uni-input" >{{settingTime.startTime}}</text>
						</picker>
					</view>
			 </view>
			 <view class="settingTimeItems">
			 					<text style="margin-right: 50rpx;">结束时间</text>
			 					<view style="width: 220rpx;">
			 						<picker mode="date" :value="settingTime.endDate"  @change='(e)=>{this.settingTime.endDate = e.target.value}'>
			 							<text class="uni-input" >{{settingTime.endDate}}</text>
			 						</picker>
			 					</view>
			 					<view style="width: 100rpx;">
			 						<picker mode="time" :value="settingTime.endTime"  @change='(e)=>{this.settingTime.endTime = e.target.value}'>
			 							<text class="uni-input" >{{settingTime.endTime}}</text>
			 						</picker>
			 					</view>
			 </view>
		 </view>
		 
		 <view class="title">地点设置</view>
		 <view class="settingItemClass">
			<view class="sttingitem" :class="{btmline: checked.position}">
					<view >指定任务地点</view>
					<switch name="switch" class="clockInswitch" :checked='checked.position' @change="()=>{this.checked.position = !this.checked.position}" />
			</view>
			<view class="adreeBlock" v-if="checked.position">
				
				<view class="sttingitem btmline" >
					<view style="width: 100%; display: flex; justify-content: space-between;" @click="chooseLocation">
						<view >定位</view>
						<view style="width:500rpx; overflow:hidden; text-overflow:ellipsis;white-space:nowrap;margin-right: 20rpx;">{{settingAdree.positionAddress?settingAdree.positionAddress:''}}</view>
					</view>
				</view>
				<view class="sttingitem">
						<view >任务范围</view>
						<input type="number"  placeholder="单位(米)" v-model="settingAdree.positionRange" style="width: 300rpx;" />
						<view style="color: #86878B; margin-right: 20rpx;">米</view>
				</view>
			</view>
		 </view>
		 
		 <view class="title">信息设置</view>
		 <view class="settingItemClass">
			 <view class="sttingitem">
					<view>参与任务需要填写信息</view>
					<switch name="switch" class="clockInswitch" :checked='checked.fields' @change="()=>{this.checked.fields = !this.checked.fields}" />
			 </view> 
			 <view  v-if="checked.fields">
				<view class="fieldsOptions" v-for="(item, index) in fieldsOptions" :key="index" :class="{active: item.isselcet}"  @click="fieldClick(index)">{{item.field}}</view>
			 </view>
		 </view>
		 
		 <van-dialog  use-slot  :show="dialogShow" show-cancel-button  title="其他信息"
		   @confirm='dialogconfirm' @close="()=>{this.dialogShow = false;this.dialogInput = ''}" >
		  <input maxlength="4" style="height: 140rpx; width: 80%; margin: 0 auto;" placeholder="填写内容(最多4个字符)" v-model="dialogInput" />
		 </van-dialog>
		 
		 <button type="primary" style="width: 80%; margin-top:20px; margin-bottom: 60px;" @click="saveClokIn">确定</button>          
		 
	</view>
</template>

<script>
	import {UserInfoRequest} from "../../network/userInfo.js";
	import {clockInRequest} from "../../network/clockIn.js";
	import {delyDate, formatDate} from '../../utils/common.js'
	import {FileRequest} from "../../network/FileRequest.js";
	import mybaseinfo from '@/components/mybaseinfo.vue'
	import vanDialog from '../../wxcomponents/vant/dialog'
	const app = getApp()
	export default {
		components:{mybaseinfo,vanDialog },
		data() {
			return {
				taskId:null,
				dialogShow:false,
				dialogInput:'',
				topicId:null,
				fieldsOptions:[{
					field:'姓名',
					isselcet:false
				},{
					field:'手机号',
					isselcet:false
				},{
					field:'身份证',
					isselcet:false
				},{
					field:'学校',
					isselcet:false
				},{
					field:'学号',
					isselcet:false
				},{
					field:'专业',
					isselcet:false
				},{
					field:'班级',
					isselcet:false
				},{
					field:'单位',
					isselcet:false
				},{
					field:'部门',
					isselcet:false
				},{
					field:'备注',
					isselcet:false
				},{
					field:'图片',
					isselcet:false
				},{
					field:'音频',
					isselcet:false
				},{
					field:'文档',
					isselcet:false
				},{
					field:'是/否',
					isselcet:false
				},{
					field:'有/无',
					isselcet:false
				},{
					field:'其他',
					isselcet:false
				}],
				contentImg:[], 
				isdel: true,
				checked:{
					position:false,
					fields:false,
					repeat:false,
					checkup:false
				},
				basicInfo: {
				    title: '',
				    content: {
						text:'',
						img:null,
					},
					fields: ''
				},
				settingTime:{
				  startDate: formatDate(new Date(), 'yyyy-MM-dd'),
				  startTime: formatDate(new Date(), 'hh:mm'),
				  endDate: delyDate(new Date(), 1),
				  endTime: formatDate(new Date(), 'hh:mm'),
				},
				settingAdree:{
				  positionLat:"",
				  positionLon:"",
				  positionAddress:"",
				  positionRange: '500'
				}
			}
		},
		onLoad(options) {
			if (options.taskId !== 'new'){  //编辑模式
				this.isdel = false
				this.taskId = options.taskId
				this.get_task(options.taskId)
			}else{ 							//创建模式
				this.topicId = options.topicId
				this.createClockIn(options.topicId);
			}
			
		},
		onUnload(e) {
			if(this.isdel){    //没有保存返回就删除
				clockInRequest.deleteClockIn(this.taskId, app.globalData.token)
			}

		},
		methods: {
			createClockIn(topicId) {
				var data = {}
				if(topicId) data.refId = topicId
			    clockInRequest.createClockIn(data,app.globalData.token)
			      .then(res => {
			          this.taskId = res.data.taskId
			      })
			  },
			  inputChange(e){
				this.basicInfo.title = e
			  },
			  textChange(e){
				  this.basicInfo.content.text = e
			  },
			uploadfile(e){
				uni.showLoading()
				e.forEach((item)=>{
					FileRequest.uploadFile(this.taskId, null, item.path, app.globalData.token)
					.then(res=>{
						uni.hideLoading()
						var data = JSON.parse(res.data)
						 if(data.type == 'image'){
							if(this.contentImg.length>9){
								uni.showToast({
									title:'图片数量不可以超过九张',
									icon:'none'
								})
							}else{
								this.contentImg.push(data)
							}
						}
					}) 
					.catch(err=>{
						uni.hideLoading()
						var errData = JSON.parse(err.data)
						uni.showToast({
							title:errData.information,
							icon:'none'
						})
					})
				})
			},
			get_task(taskId){
				clockInRequest.get_task(taskId, app.globalData.token)
				.then((res)=>{
					//编辑的信息
					console.log(res.data)
					
					this.basicInfo.content.text = res.data.content
					this.basicInfo.title = res.data.title
					console.log(this.basicInfo.title)
					this.contentImg = res.data.files
					var begin = res.data.beginTime.trim().split(" ")
					this.settingTime.startDate = begin[0]
					let b = begin[1].slice(0, begin[1].length-3) 
					this.settingTime.startTime = b
					var end = res.data.endTime.trim().split(" ")
					this.settingTime.endDate = end[0]
					let c = end[1].slice(0, end[1].length-3) 
					this.settingTime.endTime = c
					this.basicInfo.fields = res.data.fields
					this.checked.position = res.data.position
					this.settingAdree.positionAddress = res.data.positionAddress
					this.settingAdree.positionLat = res.data.positionLat
					this.settingAdree.positionLon = res.data.positionLon
					this.checked.repeat = res.data.repeat
					if(res.data.fields.length > 0){
						this.checked.fields = true
						var fields = res.data.fields.split(',')
						fields.forEach((item1, index1)=>{
							var i = this.fieldsOptions.findIndex((item2)=>{
								return item2.field == item1
							})
							if(i!=-1){
								this.fieldsOptions[i].isselcet = true
							}else{
								this.fieldsOptions.splice(this.fieldsOptions.length-1, 0,  {field: item1, isselcet: true})
							}
						})
					}else{
						this.checked.fields = false
					}
				})
			},
			delFile(e,i){
				FileRequest.delFile(e.fileId, app.globalData.token)
				.then((res)=>{
					if(e.type == 'image'){
						this.contentImg.splice(i, 1)
					}else if(e.type == 'pdf'){
						this.contentFile.splice(i, 1)
					}
					uni.showToast({
						title:res.data.information
					})
				})
				.catch(err=>{
					uni.showToast({
						title:res.data.information,
						icon:'none'
					})
				})
			},
			dialogconfirm(e){   //插入需要填写的信息
				var a = {
					field: this.dialogInput,
					isselcet:false
				}
				var lt = this.fieldsOptions.length-1
				this.fieldsOptions.splice(lt, 0, a)
				this.dialogInput = ''
				this.dialogShow = false
			},
			chooseLocation(){
				uni.chooseLocation({
				    success: (res)=> {
						console.log("get location:", res)
						this.settingAdree.positionLat = res.latitude
						this.settingAdree.positionLon = res.longitude
						this.settingAdree.positionAddress = res.address
				    } 
				});
			},
			fieldClick(index){
				if(index == this.fieldsOptions.length-1){
					if(this.fieldsOptions.length>18){
						uni.showToast({
						    title: '数量限制',
						    duration: 2000,
							icon:'none'
						});
					}else{
						this.dialogShow = true
					}
				}else{
					this.fieldsOptions[index].isselcet = !this.fieldsOptions[index].isselcet
				}
			},
			saveClokIn(){
				if(this.basicInfo.title){
					
					var input = this.basicInfo.title+this.basicInfo.content.text
					UserInfoRequest.checkugcMsg(input)     //检查input
					.then((res)=>{
						uni.hideLoading();
						if(res.data.result && input.length){
							let data = {}
							var fields = []
							this.fieldsOptions.forEach((item, index)=>{
								if(item.isselcet){
									fields.push(item.field)
								}
							}) 
							fields = fields.join(',')
							data.fields = fields
							data.taskId = this.taskId
							data.repeat = this.checked.repeat
							data.position = this.checked.position
							if(this.checked.position){
								data.positionLat = this.settingAdree.positionLat
								data.positionLon = this.settingAdree.positionLon
								data.positionAddress = this.settingAdree.positionAddress
								data.positionRange  = this.settingAdree.positionRange
							}
							let beginTime = this.settingTime.startDate+' '+this.settingTime.startTime
							let endTime = this.settingTime.endDate+' '+this.settingTime.endTime
							data.beginTime = beginTime	
							data.endTime = endTime
							data.title = this.basicInfo.title
							data.content = this.basicInfo.content.text
							clockInRequest.editClockIn(data, app.globalData.token)
							.then((res)=>{
								this.isdel = false
								uni.navigateBack()
							})
							.catch(err=>{
								console.log(err)
								uni.showToast({
									title:err.data.information
								})
							})
						}else{
							uni.showToast({
							    title: '输入的信息违规',
							    duration: 3000,
								icon:'none'
							});
						}	
					})
				}else{
					uni.showToast({
					    title: '请完善信息',
					    duration: 2000,
						icon:'none'
					});
				}
			}
			
		}
	}
</script>

<style>
	//公共样式
	.title{
		color: #86878B;
		margin: 10px 0;
		font-size: 12px;
	}
	.btmline{
		border-bottom: 1px solid #E1E1E1;
	}
	.settingItemClass{
		background-color: #FFFFFF; 
		padding: 2px 10px; 
		border-radius: 4px;
	}
	.active{
		border: 1px solid #1AAD19 !important;
		position: relative;
	}
	.active::before{
		content: "*";
		position: absolute;
		color: #ff0000;
		font-size: larger;
		left: 14rpx;
	}
	


#clockIn{
	width: 94%;
	margin: 10px auto 0px auto;
}

 .clockIntitle{
	height: 50px;
	font-size: 18px;
}
 
 
.settingTimeItems{
	display: flex;
	padding: 12px 0;
	
}

.sttingitem{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 0;
}
.clockInswitch{
	float: right;
}

.fieldsOptions{
	display: inline-block;
	flex-wrap: wrap;
	width: 20%;
	border: 1px solid #E1E1E1;
	text-align: center;
	margin: 16rpx;
	border-radius: 4px;
	padding: 16rpx 26rpx;
	color: #696a6d;
	font-size: 32rpx;
}

</style>
