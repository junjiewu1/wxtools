<template>
	<view id="moreTasks">
		<picker  :value="timeIndex" :range="timeArray"  @change="timeChange" style="margin-bottom: 20rpx;">
			<text class="picker">
					当前选择：<text style="color: #1ab7ff; font-size: 30rpx;font-weight: 600;">{{timeArray[timeIndex]}}</text>
			</text>
		</picker>
		<view class="tasksItem" v-for="(item, index) in taskList" :key="index"  @click="taskItemClick(item)">
			<view class="taskTitle">{{item.title}}</view>
			<view class="taskText">{{item.beginTime? item.beginTime+' ~ ':''}}{{item.endTime}}</view>
			<view class="mybage"><text :class="{ bageactive: item.completeAmount}">{{item.completeAmount}}人参与</text></view>
		</view>
		<view v-if="!taskList.length"  style="padding: 30rpx 0 ; background-color: #FFFFFF; ">
			<view style="text-align: center; color: #7c7c7c;line-height: 100rpx; font-size: 30rpx;" >暂时没有任何任务~</view>
		</view>
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js"
	import {clockInRequest} from "../../network/clockIn.js"
	import {projectsRequest} from '../../network/projects.js'
	import {manageRequest} from "../../network/manage.js"
	import {getDateRange} from '../../utils/common.js'
	const app = getApp()
	export default {
		data() {
			return {
				topicId: null,
				type:null,
				topicsInfo: null,
				taskList:[],
				timeIndex:0,
				timeArray:['近七天','近一月','近半年','近一年'],
				endTime: getDateRange(new Date(), 7, true)
			}
		},
		filters:{
			statusChange(value){
				if(value == 'active') return '签到中'
				if(value == 'ended') return '已结束'
				if(value == 'notstarted') return '未开始'
			}
		},
		onLoad(options) {
			this.topicId = options.topicId
			this.type = options.type
			
		},
		onShow() {
			this.get_rangeTimeList()
			this.getposts()
		},
		methods: {
			get_rangeTimeList(){
				if(this.type == 'clockIn'){
					manageRequest.get_top_tasks(this.topicId, app.globalData.token, {endTime: this.endTime})
					.then(res=>{
						this.taskList = res.data.tasks
					})
				}else if(this.type == 'project'){
					projectsRequest.get_ref_projects(this.topicId, app.globalData.token, {endTime: this.endTime})
					.then((res)=>{
						this.taskList = res.data.projects
					})
				}else{
					wx.showToast({
						title:'出现错误'
					})
					uni.navigateBack()
				}
			},
			
			getposts(){
				postsRequest.getposts(this.topicId, app.globalData.token)
				.then((res)=>{
					this.topicsInfo = res.data.topic
					this.title = this.topicsInfo.topic
					uni.setNavigationBarTitle({
					    title: this.title
					});
				})
			},
			timeChange(e){
				this.timeIndex = e.target.value
				console.log(e.target.value)
				switch(e.target.value){
					case '0':
						this.endTime = getDateRange(new Date(), 7, true)
					break;
					case '1':
						this.endTime = getDateRange(new Date(), 30, true)
					break;
					case '2':
						this.endTime = getDateRange(new Date(), 182, true)
					break;
					case '3':
						this.endTime = getDateRange(new Date(), 365, true)
					break;
				}
				this.get_rangeTimeList()
			},
			taskItemClick(item){
				if(item.taskId){
					uni.navigateTo({
						url:`/pages/completes/completes?taskId=${item.taskId}&topicId=${this.topicId}`
					})
				}else{
					uni.navigateTo({
						url:`/pages/projectsCompletes/projectsCompletes?projectId=${item.projectId}&topicId=${this.topicId}`
					})
				}
					
					
			}
		}
	}
</script>

<style scoped>
#moreTasks{
		width: 94%;
		margin: 10px auto 0px auto;
	}
	.tasksItem{
		background-color: #FFFFFF;
		border: 1px solid #E1E1E1;
		height: 150rpx;
		padding-left: 40rpx;
		margin: 4rpx 0;
		
	}
	.taskTitle{
		width: 600rpx;
		margin-top: 10rpx;
		font-size: 30rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
</style>
