<template>
	<view>
		<view class="basicInfo">
			<input  class="clockIntitle btmline" :placeholder="titleHolder"   @input="inputChange" :value="title" />
			<textarea  resize="none" class="Content-text" maxlength="999999" :placeholder="subtitleHolder"  @input="textChange" :value="content"></textarea>
			
			
			<view  v-for="(item, index) in contentFile" :key='index' >
				<view>{{item.url}}</view>
				<icon type="clear" color="red" size="16" class="reicon" @click="delImg(item, index)"></icon>
			</view>
			<view class="contentImg">
				<view class="imgItem" v-for="(item, index) in contentImg" :key='index' >
					<image :src="item.url" mode="aspectFill" class="contentImgitem" @click="previewImage(index)"></image>
					<icon type="clear" color="red" size="16" class="reicon" @click="delImg(item, index)"></icon>
				</view>
				
				<view class="imgItem" v-if="image && contentImg.length<9">
					<image  src="../static/image/picture.png" class="contentImgitem" @click="uploadImg()"></image>
				</view>
				<view class="imgItem" v-if="uploadPDF && contentFile.length<9">
					<image  src="../static/image/PDF.png" class="contentImgitem" @click="gotouploadPDF()"></image>
				</view>
				
				<view class="imgItem" v-if="video">
					<image src="../static/image/video.png" class="contentImgitem" @click="uploadVideo()"></image>
				</view>
				<view class="imgItem" v-if="audio">
					<image src="../static/image/audio.png" class="contentImgitem" @click="uploadAudio()"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
			};
		},
		props:{
			title: {
				type: String,
				default: ''
			},
			content: {
				type: String,
				default: ''
			},
			titleHolder:{
				type: String,
				default: ''
			},
			subtitleHolder:{
				type: String,
				default: ''
			},
			image: {
			  type: Boolean,
			  default: true
			},
			video: {
			  type: Boolean,
			  default: false
			},
			audio: {
			  type: Boolean,
			  default: false
			},
			uploadPDF: {
			  type: Boolean,
			  default: false
			},
			contentImg:{
				type: Array,
				default: []
			},
			contentFile:{
				type: Array,
				default: []
			}
		},
		computed:{
			
		},
		methods:{
			
			uploadImg(){
				uni.chooseImage({
					count: 9, 
					success: (res)=>{
					    var imgs = []
						this.$emit('uploadfile', res.tempFiles)
					}
				});	
			},
			previewImage(index){
				var previewImage = []
				this.contentImg.forEach((item)=>{
					previewImage.push(item.url)
				})
				uni.previewImage({
					urls: previewImage,
					current: index,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏']
					}
				});
			},
			delImg(item, index){
				this.$emit('delImg', item, index)
			},
			inputChange(e){
				this.$emit('inputChange', e.detail.value)
			},
			textChange(e){
				this.$emit('textChange', e.detail.value)
			},
			gotouploadPDF(){
				wx.chooseMessageFile({
					count: 9,
					type: 'file',
					extension:['png','jpg','xlsx','txt'],
					success:res=> {
					  // tempFilePath可以作为img标签的src属性显示图片
						this.$emit('uploadfile', res.tempFiles)
					}
			    })
			}
		},
	}
</script>

<style scoped>
.basicInfo{
	 background-color: #FFFFFF;
	 padding: 2px 10px; 
 }
 .clockIntitle{
 	height: 50px;
 	font-size: 18px;
 }
 .btmline{  
 	border-bottom: 1px solid #E1E1E1;
 }
 .Content-text{
 	 width: 100%;
 	 height: 100px;
 	 white-space: normal !important;
 	 margin: 10px 0;
 }
 .contentImg{
	 display: flex;
	 flex-wrap: wrap;
 }
 .contentImgitem{
 	width: 140rpx;
 	height: 140rpx;
 	
 }
 .imgItem{
	 width: 140rpx;
	 height: 140rpx;
	 position: relative;
	 border: 1px solid #E1E1E1;
	 border-radius: 6px;
	 margin: 6rpx 10rpx;
 }
 .reicon{
	 position: absolute;
	 right: 6rpx;
	 top: 10rpx;
 }
</style>
