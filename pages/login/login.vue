<template>
	<view>
		<image src="../../static/image/welcome.png" class="welcome"></image>
		<view class="login">
			<button v-if="canIUseGetUserProfile"  @click="getUserProfile"> 微信登陆 </button>
			<button v-else open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 微信登陆 </button>
		</view>
	</view>
</template>

<script>
	import {UserInfoRequest}  from '../../network/userInfo'
	const app = getApp()
	export default {
		data() {
			return {
				option: null,
				userInfo: {},
				canIUseGetUserProfile: false
			}
		},
		onLoad(options) {
			console.log(options)
			this.option = options
			if(uni.getUserProfile) {
			    this.canIUseGetUserProfile = true
			 }
		},
		methods: {
			getUserProfile(e){
				// 推荐使用uni.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				uni.getUserProfile({
									provider: 'weixin',
									desc: '用于使用云中打卡', 
									success:(res)=>{
										console.log(app.globalData)
										app.globalData.userInfo = res.userInfo
										UserInfoRequest.setUerInfo(app.globalData.userId, res.userInfo)
										.then((res)=>{
											if(this.option){
												if (this.option.dest){
													console.log('进入this.option.dest')
													var url = decodeURI(this.option.dest)
											            uni.redirectTo({
											              url: url
											            })
											    }else{
											         uni.navigateBack({
											         	delta:1
											         })
												}
											}else{
											            uni.redirectTo({
											              url: '/pages/index/index'
											            })
											}
										})
									}
				});
			},
			getUserInfo(e) {
			    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
			     app.globalData.userInfo = e.detail.userInfo;
			     UserInfoRequest.setUerInfo(app.globalData.userId, e.detail.userInfo)
			     .then(res => {
			            if(this.qid){
			              uni.redirectTo({
			                url: '/pages/complete/complete?qid='+this.data.qid
			              })
			            }else{
			              uni.redirectTo({
			                url: '/pages/index/index'
			              })
			            }
			          })
			
			}
		}
	}
</script>

<style>
.welcome{
	position: fixed;
	  width: 100%;
	  height: 100vh;
}
.login{
	position: absolute;
	width: 70%;
	z-index: 2;
	top: 80%;
	left: 50%;
	transform: translate(-50%,-50%);
}
.login button{
  background-color: rgb(95, 212, 95);
  color: white;
}
</style>
