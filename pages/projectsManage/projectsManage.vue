<template>
	<view id="projectsList">
		<view class="tasksItem" v-for="(item, index) in projectsList" :key="index"  @click="projectsItemClick(item.projectId)">
			<view class="taskTitle">{{item.title}}</view>
			<view class="taskText">{{item.createdTime}}</view>
			<view class="mybage"  ><text v-if="pagemode=='myCreate'" :class="{ bageactive: item.completeAmount}">{{item.completeAmount}}人参与</text><text :class="{bageactive: timeClass(item.endTime)}">{{item.endTime | timeStamp}}</text></view>
		</view>
	</view>
</template>

<script>
	import {projectsRequest} from "../../network/projects.js";
	import {delyDate, formatDate, timeStamp} from '../../utils/common.js'
	const app = getApp()
	export default {
		data() {
			return {
				projectsList:[],
				pagemode:'myCreate',
				btnMessage:'正在进行中'	
			}
		},
		
		onLoad(options) {
			this.pagemode = options.page
			
		},
		onShow() {
			console.log(this.pagemode)
			if(this.pagemode == 'myCreate'){
				this.get_all_projects()
			}else{
				this.get_my_projects()
			}

		},
		filters:{
			 timeStamp(value){
				 var timestamp = timeStamp(value)
				 var now = new Date().getTime()
				 if(timestamp<now){
				 	return '已结束'
				 }else{
				 	return '进行中'
				 }
			 }
		},
		methods: {
			get_all_projects(){
				projectsRequest.get_all_projects(app.globalData.token)
				.then(res=>{
					 this.projectsList = res.data.projects
					 
				})
			},
			timeClass(value){
				var timestamp = timeStamp(value)
				var now = new Date().getTime()
				if(timestamp<now){
					return false
				}else{
					return true
				}
			},
			get_my_projects(){
				projectsRequest.get_my_projects(app.globalData.token)
				.then((res)=>{
					 this.projectsList = res.data.projects
				})
			},
			projectsItemClick(e){
				uni.navigateTo({
					url:`/pages/projectsCompletes/projectsCompletes?projectId=${e}`
				})
			},
		}
	}
</script>

<style>
#projectsList{
		width: 94%;
		margin: 10px auto 0px auto;
	}
	.tasksItem{
		background-color: #FFFFFF;
		border: 1px solid #E1E1E1;
		height: 150rpx;
		padding-left: 40rpx;
		margin: 10rpx 0;
	}
	.taskTitle{
		margin-top: 10rpx;
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
</style>
