<template>
	<view id="completedUserinfo">
		<view class="mysection">| 未完成人员</view>
		<view v-if="uncompletes.length" class="completesList">
			<view v-for="(item, index) in uncompletes"  :key="index" class="completesUserItem">
				{{item}}
			</view>
		</view>
		<view v-else style="text-align: center; color: #7c7c7c;line-height: 100rpx; font-size: 30rpx;" >暂时还没有信息~</view>
		
		<view class="mysection">| 已完成人员</view>
		<view v-if="completes.length" class="completesList">
			<view v-for="(item, index) in completes" :key="index" class="completesUserItem">
				{{item}}
			</view>
		</view>
		<view v-else style="text-align: center; color: #7c7c7c;line-height: 100rpx; font-size: 30rpx;" >暂时还没有信息~</view>
		
	</view>
</template>

<script>
	import {projectsRequest} from "../../network/projects.js";
	import {clockInRequest} from "../../network/clockIn.js";
	import {postsRequest} from "../../network/posts.js";
	const app = getApp()
	export default {
		data() {
			return {
				id:null,
				completes:[],
				uncompletes:[],
				title:'',
				type: null
			}   
		}, 
		onLoad(options) {
			this.title = options.title
			console.log(options)
			this.id = options.id
			this.type = options.type
			this.topicId = options.topicId
			if(options.type == 'project'){
				this.get_project_users()
			}else if(options.type == 'clockIn'){
				this.get_clockIn_users()
			}else if(options.type == 'questionnaire'){
				this.get_all_q_users()
			}
			uni.setNavigationBarTitle({
			    title: options.title
			});
			this.glancThrough(options)
		},
		methods: {
			get_clockIn_users(){
				clockInRequest.get_all_users(this.id, app.globalData.token)
				.then((res)=>{
					this.completes = res.data.completes
					this.uncompletes = res.data.uncompletes
					console.log(this.completes)
				})
			},
			get_project_users(){
				projectsRequest.get_all_users(this.id,app.globalData.token)
				.then((res)=>{
					this.completes = res.data.completes
					this.uncompletes = res.data.uncompletes
				})
			},
			get_all_q_users(){
				postsRequest.get_all_q_users({qid:this.id}, this.topicId, app.globalData.token)
				.then((res)=>{
					this.completes = res.data.completes
					this.uncompletes = res.data.uncompletes
				})
			},
			onShareAppMessage(e) {
			      return {
			                title: `${this.title}`,
			                url:`/pages/completedUserinfo/completedUserinfo?type=${this.type}&id=${this.id}&title=${this.title}&topicId=${this.topicId}`
			              }
			},
		}
	}
</script>

<style>
.completesList{
	width: 730rpx;
	margin: 10rpx;
	display: flex;
	flex-wrap: wrap;
}
.completesUserItem{
	
	 font-size: 26rpx;
	width: 158rpx;
	  text-align: center;
	    line-height: 60rpx;
	    padding: 0 4rpx;
	    color: #585858;
	    background-color: #FFFFFF;
	    margin: 4rpx 9rpx;
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
}
</style>
