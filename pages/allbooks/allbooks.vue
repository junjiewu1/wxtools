<template>
	<view id="allbooks">
		<view class="allboksContent" style="margin-top: 10px; padding: 10px 0; background-color: #FFFFFF;" >
		  <view class="header" style="display: flex; align-items: center;">
			<view class="header-left" style="margin-left: 20rpx;">
				<view style="display: flex; margin: 5px 0;">
					  <view style="width: 200rpx; ">
						  <picker mode="date" :value="beginDate"  @change="(e)=>{this.beginDate = e.target.value}" >
							<text style="color: #1ab7ff; margin-left: 10rpx; font-size: 30rpx;font-weight: 600;">{{beginDate}}</text>
						  </picker>
					  </view>
					  <view>至</view>
					  <view style="width: 200rpx;">
						  <picker mode="date" :value="endDate"   @change="(e)=>{this.endDate = e.target.value}">
							<text style="color: #1ab7ff; margin-left: 20rpx;font-size: 30rpx;font-weight: 600;">{{endDate}}</text>
						  </picker>
					   </view>
				</view>
				<view style="width: 300rpx; margin: 5px 0; margin-left: 5px;">
					<picker  :value="nameIndex" :range="nameArray"  @change="(e)=>{this.nameIndex = e.target.value}">
						<text class="picker">
						  当前选择：<text style="color: #1ab7ff; font-size: 30rpx;font-weight: 600;">{{nameArray[nameIndex]}}</text>
						</text>
					 </picker>
				 </view>
			</view>
			<button  size="mini" @click="gotoInquire" type="primary">查询</button>
		  </view>	 
				 

				<view v-if="all_bookings.length">
					<view  class="allboosList" style="background-color: #eeeeee;">
						<view style="width: 100rpx;" v-if="nameisShow">名称</view>
						<view style="width: 100rpx;">预约人</view>
						<view style="width: 160rpx;">预约时间</view>
						<view style="width: 240rpx;">备注</view>
						<view  style="width: 120rpx;">状态</view>
					</view>
					<view  v-for="(item, index) in all_bookings" :key='index'  class="allboosList" @longpress="itemLongpress(item)">
						<view style="width: 100rpx;overflow: hidden;" v-if="nameisShow">{{item.resource.name}}</view>
						<view style="width: 100rpx;" >{{item.userInfo.nickName}}</view>
						<view style="width: 160rpx;">{{item.targetTime | timeChange}}</view>
						<view style="width: 240rpx;" >{{item.memo?item.memo:'无'}}</view>
						<view v-if="item.deleted" style="width: 120rpx; color: #940000;">已取消</view>
						<view v-else  style="width: 120rpx; color: #099400;" >已预约</view>
					</view>
				</view>
				<view v-else>
					<view style="margin: 40rpx 0;font-size: 40rpx; text-align: center; color: #940000; font-weight: 600;">暂无预约</view>
				</view>
				<van-dialog  use-slot :show='dialogshow' :title='dialogTitle'  @confirm='dialogcfm' show-cancel-button  @close="()=>{this.dialogshow = false; this.dialogInput = ''}"  >
					<input  style="height: 100rpx; width: 80%; margin: 0 auto; margin-top: 20rpx;" placeholder="请输入修改原因" v-model="dialogInput" />
				</van-dialog>
		</view>
		
	</view>
</template>

<script>
	import vanDialog from '../../wxcomponents/vant/dialog'
	import {resourcesRequest} from "../../network/resources.js";
	import {delyDate, formatDate} from '../../utils/common.js'
	const app = getApp()
	export default {
		data() {
			return {
				resId:null,
				resources:null,
				beginDate:'',
				endDate:'',
				topicId:null,
				nameisShow:true,
				nameArray:['所有人'],
				nameIndex:1,
				all_bookings:[],
				dialogTitle: '是否取消预订',
				dialogshow:false,
				onlongpressItem:null,
				dialogInput:''
				
			}
		},
		filters:{
			timeChange(value){
				var value = value.substring(5,16)
				return value
			}
		},
		components:{
			vanDialog
		},
		onLoad(options) {
			this.topicId = options.topicId
			this.beginDate = options.beginDate
			this.endDate = options.endDate
			const eventChannel = this.getOpenerEventChannel()
			  // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			  eventChannel.on('acceptDataFromOpenerPage', (res)=> {
			    this.resources = res.data
				this.resources.forEach((item, index)=>{
					this.nameArray.push(item.name)
				})
				if(options.col){ //某个日期
					this.nameIndex = 0
					this.get_all_bookings(null,this.topicId)
				}
				else if(options.row){  //某个人
					this.nameIndex = parseInt(options.row)
					var resId = this.resources[this.nameIndex-1].resId
					var re = this.resources[this.nameIndex-1]
					this.get_all_bookings(resId,null)
					this.nameisShow = false
				}else{  //所有人
					this.nameIndex = 0
					this.get_all_bookings(null,this.topicId)  
				}
				
			 })
			  this.glancThrough(options)
		},
		methods: {
			get_all_bookings(resId,topicId){
				var data = {
					beginTime:this.beginDate,
					endTime:this.endDate
				}
				if(topicId) data.topicId = topicId
				if(resId) data.resId = resId
				resourcesRequest.get_all_bookings(data,app.globalData.token)
				.then((res)=>{
					this.all_bookings = res.data.bookings
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			gotoInquire(e){
				if(this.nameIndex == 0){   //所有人
				this.nameisShow = true
					this.get_all_bookings(null,this.topicId)
				}else{  //某个人
					var resId = this.resources[this.nameIndex-1].resId
					this.get_all_bookings(resId,null)
					this.nameisShow = false
				}
			},
			itemLongpress(e){
				console.log(e)
				this.dialogshow = true
				this.onlongpressItem = e
				if(e.deleted){
					this.dialogTitle = '是否激活预订'
				}else{
					this.dialogTitle = '是否取消预订'
				}
				
			},
			dialogcfm(){
				if(this.dialogInput.replace(/^\s*|\s*$/g,"").length < 1){
					uni.showToast({
						title:'请输入原因',
						icon:'none'
					})
					return
				}
				var data = {
					reason: this.dialogInput
				}
				if(this.onlongpressItem.deleted){
					data.deleted = false
				}else{
					data.deleted = true
				}
				resourcesRequest.change_book(data, this.onlongpressItem.bookingId, app.globalData.token)
				.then(res=>{
					uni.showToast({
						title:'修改成功'
					})
					this.gotoInquire()
				})
				.catch(err=>{
					uni.showToast({
						title:'修改失败',
						icon:'none'
					})
					console.log(err)
				})
			},
		}
	}
</script>

<style>
.allboosList{
	 display: flex;
	 justify-content: space-around;
	 align-items: center;
	 padding:10px 0;
 }
.allboosList view{
	 width: 150rpx;
	 font-size: 26rpx;
	 text-align: center;
 }	
</style>
