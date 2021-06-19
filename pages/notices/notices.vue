<template>
	<view id="notices">
		<mybaseinfo ref='mybaseinfo' :title="title" :content="content" :contentImg="contentImg"  subtitleHolder="请输入通知内容" titleHolder="请输入通知标题"
			@uploadfile='uploadfile' @delFile="delFile"  @inputChange='inputChange' @textChange='textChange'>
		</mybaseinfo>

		<view class="settingTimeItems">
			<text style="margin-right: 50rpx;color: #818181; ">结束时间:</text>
			<view style="width: 200rpx;">
				<picker mode="date" :value="endDate"   @change='(e)=>{this.endDate = e.target.value}'>
					<text >{{endDate}}</text>
				</picker>
			</view>
			<view style="width: 100rpx;">
				<picker mode="time" :value="endTime"  @change='(e)=>{this.endTime = e.target.value}'>
					<text >{{endTime}}</text>
				</picker>
			</view>
			<view style="width: 150rpx; margin-left: 30rpx;">
				<picker  :value="timeIndex" :range="timeArray"  @change="timeChange" style="margin-bottom: 20rpx;">
					<text style="color: #8500f9;  text-decoration: underline; ">
							{{timeArray[timeIndex]}}
					</text>
				</picker>
			</view>
		</view>
		
		<button type="primary" style="margin-top: 40rpx;" @click="createNotices">发布通知</button>
	</view>
</template>

<script>
	import {UserInfoRequest} from "../../network/userInfo.js";
	import {noticesRequest} from '../../network/notices.js';
	import {FileRequest} from "../../network/FileRequest.js";
	import {getDateRange, delyDate, formatDate} from '../../utils/common.js'
	import mybaseinfo from '@/components/mybaseinfo.vue'
	const app = getApp()
	
	export default {
		components:{mybaseinfo},
		data() {
			return {
				topicId:null,
				title:'',
				content:'',
				contentImg:[],
				timeIndex:1,
				timeArray:['当天','一天','一个星期','一个月','一年'],
				endDate: delyDate(new Date(), 1),
				endTime: formatDate(new Date(), 'hh:mm'),
			}
		},
		onLoad(options){
			this.topicId = parseInt(options.topicId)
		},
		methods: {
			createNotices(){
				if(!this.title.trim()){
					uni.showToast({
					    title: '请完善信息',
					    duration: 2000,
						icon:'none'
					});
					return
				}else{
					var input = this.title+this.content
					UserInfoRequest.checkugcMsg(input)     //检查input
					.then((res)=>{
						uni.showLoading();
						if(res.data.result){
							var endTime = this.endDate+' '+this.endTime
							var files = []
							this.contentImg.forEach((item, index)=>{
								files.push(item.fileId)
							})
							var data = {
								title:this.title, 
								content:this.content, 
								endTime:endTime,
								refId:this.topicId
							}
							if(files.length>0){
								data.files = files.join(',')
							}
							noticesRequest.createNotices(data, app.globalData.token)
							.then((res)=>{
								uni.hideLoading()
								uni.showToast({
								    title: '发布成功',
								    duration: 2000,
									icon:'success'
								});
								uni.navigateBack()
							})
							.catch(err=>{
								uni.hideLoading()
								uni.showToast({
								    title: '发布失败',
									icon:'none'
								});
							})
						}else{
							uni.showToast({
							    title: '输入的信息违规',
							    duration: 3000,
								icon:'none'
							});
						}	
					})	
				}
				
			},
			inputChange(e){
				this.title = e
			},
			textChange(e){
				this.content = e
			},
			uploadfile(e){
				uni.showLoading()
				e.forEach((item)=>{
					FileRequest.uploadFile(-1, null, item.path, app.globalData.token)
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
			timeChange(e){
				this.timeIndex = e.target.value
				console.log(e.target.value)
				switch(e.target.value){
					case '0':
						this.endTime = '23:59'
						this.endDate = formatDate(new Date(), 'yyyy-MM-dd')
					break;
					case '1':
						this.endDate = delyDate(new Date(), 1)
					break;
					case '2':
						this.endDate = delyDate(new Date(), 7)
					break;
					case '3':
						this.endDate = delyDate(new Date(), 30)
					break;
					case '4':
						this.endDate = delyDate(new Date(), 365)
					break;
				}
			},
		}
	}
</script>

<style>
#notices{
	width: 94%;
	margin: 10px auto 0px auto;
}
.settingTimeItems{
	display: flex;
	padding: 12px 0;
}
</style>
