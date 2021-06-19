<template>
	<view id="manage">
		<view class="tasksItem" v-for="(item, index) in alltasks" :key="index"  @click="taskItemClick(item.taskId)">
			<view class="taskTitle">{{item.title}}</view>
			<view class="taskText">{{item.beginTime}}</view>
			<view class="mybage" v-if="pagemode=='myCreate' "><text :class="{ bageactive: item.status == 'active'}">{{item.status | statusChange}}</text><text :class="{ bageactive: item.completeAmount}">{{item.completeAmount}}人参与</text></view>
			<view class="mybage" v-else><text :class="{ participatebageactive: !item.conditions.condition}">{{item.conditions.condition?'未打卡':'已打卡'}}</text></view>
		</view>
	</view>
</template>

<script>
	import {manageRequest} from "../../network/manage.js";
	const app = getApp()
	export default {
		data() {
			return {
				alltasks:null,
				pagemode:null
			}
		},
		onLoad(options) { 
			this.pagemode = options.page
			
			
		},
		onShow() {
			console.log(this.pagemode)
			if(this.pagemode == 'myCreate'){
				this.getCeateTasks()
			}else{
				this.getParticipateTasks()
			}
		},
		filters:{
			statusChange(value){
				if(value == 'active') return '打卡中'
				if(value == 'ended') return '已结束'
				if(value == 'notstarted') return '未开始'
			}
		},
		methods: {
			taskItemClick(e){
				uni.navigateTo({
					url:`/pages/completes/completes?taskId=${e}&pagemode=${this.pagemode}`
				})
			},
			getCeateTasks(){    //获取创建列表
				manageRequest.getAllTasks(app.globalData.token)
				.then((res)=>{
					this.alltasks = res.data.tasks
				})
				.catch((error)=>{
					uni.showToast({
					    title: '操作错误',
					    duration: 2000,
						icon:'none'
					});
					setTimeout(()=>{
						uni.redirectTo({
							url:'/pages/index/index'
						})
					},3000)
				})
			},
			getParticipateTasks(){   //获取参与列表
				manageRequest.get_my_completes(app.globalData.token)
				.then((res)=>{
					this.alltasks = res.data.tasks
				})
				.catch((error)=>{
					uni.showToast({
					    title: '操作错误',
					    duration: 2000,
						icon:'none'
					});
					setTimeout(()=>{
						uni.redirectTo({
							url:'/pages/index/index'
						})
					},3000)
				})
			}
		}
	}
</script>

<style>
	#manage{
		width: 94%;
		margin: 10px auto 0px auto;
	}
	.tasksItem{
		background-color: #FFFFFF;
		border: 1px solid #E1E1E1;
		height: 150rpx;
		padding-left: 40rpx;
	}
	.taskTitle{
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
