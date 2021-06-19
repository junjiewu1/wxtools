<template>
	<view id="downLoad">
		<view style="text-align: center; font-size: 28rpx; color: #5e5e5e; ">点击下方按钮，直接下载文件</view>
		<button type="primary" @click="download" style="width: 600rpx; margin: 10rpx auto 20rpx auto;">直接下载</button>
		<view style="text-align: center; font-size: 28rpx; color: #5e5e5e; margin-top: 40rpx;">点击下方按钮，复制到浏览器中下载</view>
		<button type="primary" @click="copylink" style="width: 600rpx; margin: 10rpx auto 20rpx auto;">复制链接</button>
		
		<button type="primary"  open-type="share" style="width: 600rpx; margin: 60rpx auto 20rpx auto;">分享</button>
		<van-circle v-show="progress!=0 && progress!=100 " size=40 speed=220 :value="progress"  style="position: fixed; right:50%; top:50%;" />
	</view>
</template>

<script>
	import vanCircle from '../../wxcomponents/vant/circle'
	export default {
		data() {
			return {
				url:'',
				title:'',
				progress: 0
			}
		},
		onLoad(options) {
			console.log(options)
			this.url = options.downLoadURl	
			this.title = options.title
		},
		components:{vanCircle},
		methods: {
			copylink(){
				uni.setClipboardData({
				    data: this.url,
				    success: ()=>{
				        uni.showToast({
				        	title:'复制成功'
				        })
				    }
				});
			}, 
			download(){
				const downloadTask = uni.downloadFile({
				  url: this.url, 
				  success (res) {
				    uni.showToast({
				    	title:'文件下载成功'
				    })
				    wx.openDocument({
				        filePath: res.tempFilePath,
				    	showMenu:true,
						success: (res)=>{
				
						},
						fail:(err)=>{
							uni.showToast({
								title:'下载失败，请复制链接到浏览器下载',
								icon:'none'
							})
						}
				    })
				  },
				  fail(err){
					  uni.showToast({
					  	title:'文件下载失败',
					  	icon:'none'
					  })
					  console.log('donloadERR', err)
				  }
				})
				
				downloadTask.onProgressUpdate((res) => {
					this.progress = res.progress
					if(res.progress == 100){
						this.progress = 0
					}
				});
				
			},
			onShareAppMessage(e) {
			     if(e.from=="button" ){
			      return {
			                title: `${this.title}签到记录`,
			                path: `/pages/downLoad/downLoad?downLoadURl=${this.url}&title=${this.title}`,
			                imageUrl: '../../static/image/welcome.png'
			              }
			    }else{
			      return {
			                title: `云中助手`,
			                path: `/pages/index/index`,
			                imageUrl: '../../static/image/welcome.png'
			              }
			    }
			},
			
		}
	}
</script>

<style>
#downLoad{
	width: 94%;
	margin: 140px auto 0px auto;
}
</style>
