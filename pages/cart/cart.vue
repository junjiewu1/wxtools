<template>
	<view>
		<!-- <view style="  float: right;">
								 <view  class="selnum" >
									 <view class="cut" @click="cutNumber(index)" >-</view>
									 <input :value="item.count" class="number" disabled="true" type="number" />
									 <view class="add" @click="addNumber(index)" >+</view>
								 </view>
								 <image  src="../../static/image/add3.png" style="width: 30rpx;height: 30rpx;" @click="addCart(index)"></image>
								 
		</view> -->
		<view class="bottomBar">
			 <view style="margin-left: 30rpx;">
				 <view>合计:</view> 	
			 </view>
			 <view v-if="totalPrice && cutdownStatus=='active' " style="background-color: #ff5100;padding: 20rpx 40rpx;color: #FFFFFF;">
			 	添加到购物车
			 </view>
			 <view v-else style="background-color: #aaaaaa;padding: 20rpx 40rpx;color: #FFFFFF;"> 
				添加到购物车
			 </view>
			 
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.bottomBar{
		 z-index: 2;
		position: fixed;
		bottom: -12rpx;
		left: 0;
		height: 120rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fbfcff;
		 box-shadow: 0 5px 15px rgba(45,50,55,.2);
		 transform: translateY(-5px);
		 padding-bottom: 32rpx;
	}
</style>
