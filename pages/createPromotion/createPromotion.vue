<template>
	<view id="createPromotion">
		<mybaseinfo ref='mybaseinfo' :title="title" :content="content" :contentImg="contentImg"  subtitleHolder="请输入文字内容" titleHolder="请输入团购主题(必填)"
			@uploadfile='uploadfile' @delFile="delFile"  @inputChange='inputChange' @textChange='textChange'>
		</mybaseinfo>
		<view style="margin: 20rpx 0;">
			<view style="display: flex; align-items: center;justify-content: space-between;">
				<view>团购商品</view>
				<view style="font-size: 26rpx; font-weight: 400;color: #115fb8; display: flex;align-items: center;" @click="gotoOwnedGoodslist"><text>去商品库添加</text><image src="../../static/image/more.png" style="width: 30rpx; height: 30rpx;"></image></view>
			</view>
			<view v-if="goodsList.length" class="goodsList"  > 
				<view v-for="(item,index) in goodsList" :key="index" class="goodsItem">
					<image class="img" :src="item.picUrl" background-size="cover" @click="gotoEditGoods(item.id)"></image>
					<view class="right">
					<view class="text">
						<text class="name">{{item.name}}</text>
						<text class="desc">{{item.brief}}</text>
						<text class="price">￥{{item.counterPrice}}</text>
					</view>
					</view>
				</view>
			</view>
			<view v-else style="margin: 20rpx 0;">
				<view style="width: 100%; background-color: #FFFFFF; text-align:center;line-height: 180rpx; color: #747474; ">暂时没有任何商品...</view>
			</view>
			<view class="settingTimeItems" >
								<text style="margin-right: 50rpx;">开始时间</text>
								<view style="width: 220rpx;">
									<picker mode="date" :value="settingTime.startDate"  @change='(e)=>{this.settingTime.startDate = e.target.value}' >
										<text  >{{settingTime.startDate}}</text>
									</picker>
								</view>
								<view style="width: 100rpx;">
									<picker mode="time" :value="settingTime.startTime"  @change='(e)=>{this.settingTime.startTime = e.target.value}'>
										<text  >{{settingTime.startTime}}</text>
									</picker>
								</view>
			</view>
			<view class="settingTimeItems">
								<text style="margin-right: 50rpx;">结束时间</text>
								<view style="width: 220rpx;">
									<picker mode="date" :value="settingTime.endDate"  @change='(e)=>{this.settingTime.endDate = e.target.value}'>
										<text >{{settingTime.endDate}}</text>
									</picker>
								</view>
								<view style="width: 100rpx;">
									<picker mode="time" :value="settingTime.endTime"  @change='(e)=>{this.settingTime.endTime = e.target.value}'>
										<text  >{{settingTime.endTime}}</text>
									</picker>
								</view>
			</view>
			<view class="sttingitem">
					<view >是否发布</view>
					<switch name="switch" class="clockInswitch" :checked='published'  @change="()=>{this.isOnSale = !this.isOnSale}"/>
			</view>
			
			<button type="primary" @click="savePromotion">确定</button>
		</view>
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {storeRequest} from "../../network/store.js";
	import {FileRequest} from "../../network/FileRequest.js";
	import mybaseinfo from '@/components/mybaseinfo.vue';
	import {delyDate, formatDate} from '../../utils/common.js'
	import { mapState, mapMutations } from 'vuex'
	const app = getApp()
	export default {
		components:{mybaseinfo},
		data() {
			return {
				isdel: true,
				topicId:null,
				topicsInfo:null,
				promotionId:null,
				title:'',
				content:'',
				published:true,
				contentImg:[],
				settingTime:{
				  startDate: formatDate(new Date(), 'yyyy-MM-dd'),
				  startTime: formatDate(new Date(), 'hh:mm'),
				  endDate: delyDate(new Date(), 1),
				  endTime: formatDate(new Date(), 'hh:mm'),
				},
				goodsList:[]
			}
		},
		onUnload(e) {
			if(this.isdel){    //没有保存返回就删除
				storeRequest.removePromotion(this.promotionId, app.globalData.token)
				.catch(err=>{
					console.log(err,removePromotionERR)
				})
			}
		},
		onLoad(options) {
			this.topicId = options.topicId
			this.createPromotion()
			this.getposts()
		},
		onShow() {
			this.goodsList = []
			console.log(this.checkItems,'this.checkItems')
			this.goodsList = this.checkItems
		},
		computed:{
			...mapState(['checkItems'])
		},
		methods: {
			...mapMutations(['changeCheckItems']),
			createPromotion(){
				storeRequest.createPromotion(this.topicId,app.globalData.token)
				.then(res=>{
					 this.promotionId = res.data.promotionId
				})
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
					FileRequest.uploadFile(this.promotionId, null, item.path, app.globalData.token)
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
			getposts(){
				postsRequest.getposts(this.topicId,app.globalData.token)
				.then((res)=>{
					this.topicsInfo = res.data.topic
				})
			},
			gotoOwnedGoodslist(){
				uni.navigateTo({
				    url:`/pages/ownedGoodsList/ownedGoodsList?topicId=${this.topicId}&mode=promotion`
				});
			},
			checkData(){
				if(!this.title.trim().length){
					uni.showToast({
						title:'请输入标题',
						icon:'none'
					})
					return false
				}
				if(!this.checkItems.length){
					uni.showToast({
						title:'至少选择一个商品',
						icon:'none'
					})
					return false
				}
				return true
			},
			savePromotion(){
				if(!this.checkData()){
					return
				}	
				var goods = []
				this.checkItems.forEach(item=>{
					goods.push(item.id)
				})
				var data = {
					title:this.title,
					content:this.content,
					goods:goods.join(','),
					published:this.published,
					beginTime:this.settingTime.startDate+' '+this.settingTime.startTime,
					endTime:this.settingTime.endDate+' '+this.settingTime.endTime
				}
				console.log(data)
				storeRequest.editPromotion(data,this.promotionId, app.globalData.token)
				.then(res=>{
					uni.showToast({
						title:'创建成功'
					})
					this.isdel = false
					// this.changeCheckItems([])
					uni.navigateBack()
				})
				.catch(err=>{
					uni.showToast({
						title:err.data.infomation,
						icon:'none'
					})
				})
			}
		}
	}
</script>

<style scoped>
#createPromotion{
	width: 94%;
	margin: 10px auto 0px auto;
}
.goodsList{
	margin: 20rpx 0;
	background-color: #FFFFFF;
	border-radius: 6rpx;
}
.goodsList .goodsItem{
	margin: 10rpx 20rpx;
	display: flex;
	align-items: center;
	padding: 20rpx;
}
.goodsList .goodsItem image{
	float: left;
	width: 100rpx;
	height: 100rpx;
}
.goodsItem .right {
  float: left;
  width: 430rpx;
  display: flex;
  flex-flow: row nowrap;
  margin-left: 20rpx;
}
.goodsItem .text {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.goodsItem .name {
  display: block;
  color: #333;
  line-height: 50rpx;
  font-size: 28rpx;
}

.goodsItem .desc {
  display: block;
  color: #999;
  line-height: 50rpx;
  font-size: 24rpx;
}

.goodsItem .price {
  display: block;
  color: #ff2d03;
  line-height: 50rpx;
  font-size: 30rpx;
}
.sttingitem{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 0;
}
.settingTimeItems{
	display: flex;
	padding: 12px 0;
	
}
</style>
