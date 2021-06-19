<template>
	<view id="membersList">
		<view>
			<view class="header"><text style="margin-left: 10rpx; color: #6f6f70; line-height: 80rpx; font-size: 26rpx;">成员 : {{membersList.length}}</text></view>
			<view class="memerList">
				<view class="memerListItem" v-for="(item, index) in membersList" :key="index"  >
					<image :src="item.avatarUrl" class="avatarUrl" @click="itemClick(item)" :class="{isadmin: item.isAdmin}" ></image>
					<view class="nickName" >{{item.nickName}}{{item.isAdmin?'(管理员)':''}}</view>
				</view>
			</view>
		</view>
		<van-popup :show="showpopoUp" position="bottom" round @close="closePopoup('1')">
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx;" @click="setAdmin">{{onClickItem.isAdmin?'取消管理员':'设为管理员'}}</view>
				<view style="height: 60rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center"></view>
		</van-popup>
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import vanPopup from '../../wxcomponents/vant/popup'
	const app = getApp()
	export default {
		data() {
			return {
				topicId:null,
				membersList: [],
				showpopoUp: false,
				onClickItem:null,
				topicsInfo:null
			}
		},
		components:{
			vanPopup
		},
		onLoad(options){
			this.topicId = options.topicId
			this.get_all_members()
			this.getposts()
		},
		methods: {
			setAdmin(item){
				var data ={
					userId: this.onClickItem.userId,
					topicId: this.topicId,
					isAdmin: !this.onClickItem.isAdmin
				}
				postsRequest.managePosts(data, app.globalData.token)
				.then((res)=>{
					uni.showToast({
						title:'修改成功'
					})
					this.showpopoUp = false
					this.get_all_members()
				})
				.catch(err=>{
					uni.showToast({
						title:err.data.information || '修改失败',
						icon:'none'
					})
				})
			},
			getposts(){
				postsRequest.getposts(this.topicId, app.globalData.token)
				.then((res)=>{
					this.topicsInfo = res.data.topic
					uni.setNavigationBarTitle({
					    title: `${this.topicsInfo.topic} 成员`
					});
				})
			},
			get_all_members(){
				postsRequest.get_all_members(this.topicId, app.globalData.token)
				.then((res)=>{
					this.membersList = res.data.members
				})
			},
			itemClick(item){
				if(!this.topicsInfo.owned){
					return
				}
				this.showpopoUp = true
				this.onClickItem = item
			},
			closePopoup(){
				this.showpopoUp = false
			},
		}
	}
</script>

<style>
	.header{
		width: 100%;
		background-color: #e3e4e6;
		height: 80rpx;
	}
	.memerList{
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx 10rpx 0 10rpx;
	}
	.memerListItem{
		text-align: center;
		width: 182.5rpx;
		margin: 10rpx 0;
	}
	.avatarUrl{
	    width: 120rpx;
	    height: 120rpx;
	    margin: 4px 8rpx;
	    border-radius: 50%;
	}
	.nickName{
		font-size: 22rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
