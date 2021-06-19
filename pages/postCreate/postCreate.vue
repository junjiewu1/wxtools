<template>
	<view id="postCreate">
		<mybaseinfo ref='mybaseinfo'  :title="title" :content="content"  :contentImg="contentImg" :contentFile="contentFile" :contentAudio="contentAudio" 
		uploadPDF=true  audio=true
		subtitleHolder="请输入正文" titleHolder="请填写标题(必填)" @uploadfile='uploadfile' @delFile="delFile"  
		@inputChange='(e)=>{this.title = e}' @textChange='(e)=>{this.content = e}'>
		</mybaseinfo>
		<view style="display: flex; flex-wrap: wrap; align-items: center;margin-top: 20rpx;">
		<view>#话题：</view>
		<view :class="{keyactive: onactiveKeyIndex == '无'}" style="background-color: #bfbfbf; font-size: 26rpx; margin: 4rpx 10rpx; padding:2rpx 14rpx; border-radius: 8rpx; color: #FFFFFF;"
		@click="keyswordClick('无')"  >无</view>
		<view v-for="(item, index) in keywords" :key="index" :class="{keyactive: onactiveKeyIndex == item}" style="background-color: #bfbfbf; font-size: 26rpx; margin: 4rpx 10rpx; padding:2rpx 8rpx; border-radius: 8rpx; color: #FFFFFF;" @click="keyswordClick(item)">{{item}}</view>
		</view>
		<button class="formalBtn;" @click="create_post">发表</button>
		<van-circle v-show="progress!=0 && progress!=100 " size=40 speed=220 :value="progress"  style="position: fixed; right:50%; top:50%;transform: translate(50%,-50%);" />
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {FileRequest} from "../../network/FileRequest.js";
	import {UserInfoRequest} from "../../network/userInfo.js";
	import {resourcesRequest} from "../../network/resources.js";
	import {getBaseUrl} from "../../network/requests.js";
	import {base64} from "../../utils/base64.js";
	import vanCircle from '../../wxcomponents/vant/circle'
	import mybaseinfo from '@/components/mybaseinfo.vue'
	const app = getApp()
	export default {
		data() {
			return {
				topicId:null,
				title:'',
				content:'',
				contentImg:[],
				contentFile:[],
				keywords:[],
				contentAudio:[],
				onactiveKeyIndex: null,
				progress: 0,
			}
		},  
		components:{mybaseinfo, vanCircle},
		onLoad(options) {
			this.topicId = parseInt(options.topicId)
			this.getconfigs()
		},
		methods: {
			create_post(){
				uni.showLoading()
				var input = this.title + this.content
				UserInfoRequest.checkugcMsg(input)
				.then((res)=>{
					uni.hideLoading();
					if(res.data.result && this.title.length){
						var files = []
						this.contentImg.forEach((item, index)=>{
							files.push(item.fileId)
						})
						this.contentFile.forEach((item, index)=>{
							files.push(item.fileId)
						})
						this.contentAudio.forEach((item, index)=>{
							files.push(item.fileId)
						})
						var data = {
							topicId:this.topicId,
							title:this.title,
							content:this.content,
							files:files.join(',') 
						}
						if(this.onactiveKeyIndex==null){
							uni.showToast({
								title:'请选择话题',
								icon:'none'
							})
							return
						}else{
							data.keywords = this.onactiveKeyIndex
						}
						
						postsRequest.create_post(data,app.globalData.token)
						.then((res)=>{
							uni.navigateBack()
						})
					}else{
						uni.showToast({
						    title: '输入的信息违规',
						    duration: 3000,
							icon:'none'
						});
					}	
				})
				
				
				
			},
			uploadvideo(e){
				console.log(e)
				FileRequest.uploadFile(-1, null, e, app.globalData.token)
				.then(res=>{
					console.log('上传成功',res)
					var data = JSON.parse(res.data)
					this.contentVideoFile = data
				})
				.catch(err=>{
					console.log('uploadVideo',err)
				})
			},
			uploadfile(e){
				console.log(e,'上传的文件')
				e.forEach((item)=>{	
					var formData = {taskId:-1}
					
					if(item.name) formData.filename = item.name
					const uploadTask = uni.uploadFile({
						url: getBaseUrl()+'/files/upload',
						filePath: item.path,
						name: 'file',
						formData,
						success: res=> {
							
							// this.$refs.circle.style.display = 'block'
							var data = JSON.parse(res.data)
							if (res.statusCode < 300) {
							  if(data.type == 'pdf'){
							  	if(this.contentFile.length>9){
							  		uni.showToast({
							  			title:'文件数量不可以超过九个',
							  			icon:'none'
							  		})
							  	}else{
									
							  		this.contentFile.push(data)
							  		console.log(this.contentFile)
							  	}
							  }else if(data.type == 'image'){
							  	if(this.contentImg.length>9){
							  		uni.showToast({
							  			title:'图片数量不可以超过九张',
							  			icon:'none'
							  		})
							  	}else{
							  		this.contentImg.push(data)
							  	}
							  }else if(data.type == 'audio'){
							  	if(this.contentAudio.length>6){
							  		uni.showToast({
							  			title:'图片数量不可以超过限制',
							  			icon:'none'
							  		})
							  	}else{
							  		this.contentAudio.push(data)
							  	}
							  }
							} else {
							  uni.showToast({
							  	title:data.information,
								icon:'none'
							  })
							}
						},
						fail: err=>{
							var errData = JSON.parse(err.data)
							uni.showToast({
								title:errData.information,
								icon:'none'
							})
						},
						header: {
						  "authorization": "Basic " + base64.encode(`${app.globalData.token}:`)
						}
					})
					uploadTask.onProgressUpdate((res) => {
						console.log(res)
						this.progress = res.progress
						if(res.progress == 100){
							this.progress = 0
						}
						
					})
				})
			},

			delFile(e,i){
				console.log(e,'delfile')
				FileRequest.delFile(e.fileId, app.globalData.token)
				.then((res)=>{
					if(e.type == 'image'){
						this.contentImg.splice(i, 1)
					}else if(e.type == 'pdf'){
						this.contentFile.splice(i, 1)
					}else if(e.type == 'audio'){
						this.contentAudio.splice(i, 1)
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
			keyswordClick(item){
					this.onactiveKeyIndex = item
			},
			getconfigs(){
				resourcesRequest.getconfigs({topicId:this.topicId, category:'topic'})
				.then(res=>{
					if(res.data.configs.keywords){
						this.keywords = res.data.configs.keywords.split(',')
					}
				})
			},
		}
	}
</script>

<style scoped>
#postCreate{
	width: 94%;
	margin: 10px auto 0px auto;
}
.formalBtn{
	background-color: #f07127;
	width: 600rpx;
	color: #FFFFFF;
	margin-top: 100rpx;
}
.keyactive{
	background-color: #007AFF !important;
}
</style>
