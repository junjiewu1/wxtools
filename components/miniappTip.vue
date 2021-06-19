<template>
	<view :class="{ floatText: ishide}"   @click="floatTextClick">
		<view class="my-floatText">
			<image src="../static/image/floatText.png"></image>
			<text>点击上方按钮添加至我的小程序</text>
			<!-- <icon type="clear" size="30rpx"></icon> -->
		</view>
		<view class="one"></view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				ishide:true
			};
		},
		methods:{
			floatTextClick(){
				this.ishide = true
				uni.setStorageSync('miniappTip', 'false');
			} 
		},
		created() {
			    const value = uni.getStorageSync('miniappTip');
			    if (!value) {
			        this.ishide = false
			        setTimeout(()=>{
			        	this.ishide = true
			        },5000)
			    }
		}
	}
</script>

<style>
	.floatText{
		display: none;
	}
.my-floatText{
	color: #FFFFFF;
	padding: 10rpx;
	width: 230rpx;
	border-radius: 8rpx;
	text-align: center;
	opacity: 0.8;
	position: fixed;
	right: 20rpx;
	top: 18rpx;
	background-color: #000000;
	display: flex;
	align-items: center;
}
.my-floatText image{
	width: 90rpx;
	height: 50rpx;
	margin-right: 4rpx;
}
.my-floatText text{
	font-size: 24rpx;
	/* margin-right: 14rpx; */
}
.my-floatText icon{
	
	position: fixed;
	right: 25rpx;
	    top: 25rpx;
}
.one{
	opacity: 0.8;
	width: 0rpx;
	height: 0rpx;
	position: fixed;
	right: 127rpx;
	top: -21rpx;
	border-top: 20rpx solid transparent;
	border-left: 16rpx solid transparent;
	border-right: 16rpx solid transparent;
	border-bottom: 20rpx solid #000000;
}
</style>
