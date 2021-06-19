<template>
	<view>
		
		<view style="margin-top: 40rpx; font-size: 24rpx;color: #565656; margin-left: 30rpx">填写信息</view>
		<view style="margin: 20rpx 0; background-color: #FFFFFF;">
		  <view v-for="(item, index) in fides" :key='index'>
			  <view v-if="item == '备注'" class="inputItem" >
				  <textarea resize="none" style="height: 150rpx; width: 680rpx; margin: 30rpx 0;" :placeholder="'请输入'+item" v-model="fieldValue[index]"></textarea>  
			  </view>
			  <view v-else-if="item == '是/否'" class="radioItem" >
				  <radio-group @change="radioChange1(item, $event)" class="radiogroup">
						<label class="radio">
						      <radio value="是" checked="true"/>是
						    </label>
						    <label class="radio">
						      <radio value="否" />否
						</label>
				  </radio-group>
			  </view>
			  
			  <view v-else-if=" item == '有/无'"  class="radioItem">
				<radio-group @change="radioChange2(item, $event)" class="radiogroup">
					<label class="radio">
								<radio value="有" checked="true"/>有
						</label>
						<label class="radio">
							<radio value="无" />无
					</label>
			  	</radio-group>
			  </view>
				<!-- <view  class="inputItem" v-else-if="item == '手机号' ">
					<view style="margin-right: 30rpx;">{{item}} </view><input style="height: 110rpx; width: 400rpx;"  type="number"
					:placeholder="'请输入'+item" v-model="fieldValue[index]"/><button size="mini" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" type="primary">获取</button>
				</view> -->
			   <view  class="inputItem" v-else-if="item !== '有/无' && item !== '是/否'&& item !== '备注' && item!=='图片' && item!=='文档'&& item!=='音频' ">
				   <view style="margin-right: 30rpx;">{{item}} </view><input style="height: 110rpx; width: 560rpx;"  
				    :type="item=='手机号'||item=='学号'||item=='数量'? 'number':'text'" :placeholder="'请输入'+item" v-model="fieldValue[index]"/>
			   </view>
		  </view>
		  
		  <mybaseinfo ref='mybaseinfo'  :contentImg="contentImg" :contentFile="contentFile" :contentAudio="contentAudio"
		  :uploadPDF="docs" :audio="audio" :image="image" :showText=false :extname="['pdf','doc','docx','xls','xlsx','ppt','pptx','wps']"
		  subtitleHolder="请输入正文" titleHolder="请填写标题(必填)" @uploadfile='uploadfile' @delFile="delFile"  
		  @inputChange='(e)=>{this.title = e}' @textChange='(e)=>{this.content = e}'>
		  </mybaseinfo>
		</view>
		<button type="primary" style="margin-top: 20rpx; width: 70%;" @click="clockInClick">确定</button>
		<van-popup :show="showpopoUp" position="bottom" round @close="closePopoup('1')">
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx;" @tap="starloadAudio">录音</view>
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx;" @click="gotouploadAudio">从聊天文件</view>
				<view style="margin-top: 30rpx; width: 80%; margin-left: auto; margin-right: auto; text-align: center; line-height: 60rpx;" ></view>
		</van-popup>
		<van-circle v-show="progress!=0 && progress!=100 " size=40 speed=220 :value="progress"  style="position: fixed; right:50%; top:50%;" />
	</view>
</template>

<script>
	import {completesRequest} from "../../network/completes.js";
	import {FileRequest} from "../../network/FileRequest.js";
	import {projectsRequest} from "../../network/projects.js";
	import mybaseinfo from '@/components/mybaseinfo.vue'
	import vanPopup from '../../wxcomponents/vant/popup'
	import vanCircle from '../../wxcomponents/vant/circle'
	import {getBaseUrl} from "../../network/requests.js";
	import {base64} from "../../utils/base64.js";
	const app = getApp()
	export default {   
		data() {
			return {
				taskId: null,
				fieldsType: null,
				projectId: null,
				fides:[],
				field_keys:[],
				fieldValue:[],
				fieldsImg:[],
				userSetting: null,
				oper1:true,
				oper2:true,
				image: false,
				audio: false,
				docs: false,
				showpopoUp: false,
				contentImg:[],
				contentFile:[],
				contentAudio:[],
				progress: 0,
			}
		},
		components:{vanPopup, mybaseinfo, vanCircle},
		onLoad(options) {
			console.log(options)
			if('projectId' in options){
				this.fieldsType = 'project'
				this.projectId = options.projectId
				this.get_project()
			}else if('taskId' in options){
				this.fieldsType = 'task'
				this.taskId = options.taskId
				this.get_task()
			}
		},
		methods: {
			get_task(){
				completesRequest.get_task(this.taskId, app.globalData.token)
				.then((res)=>{
					this.fides = res.data.fields.split( ',' )
					this.fides.forEach(item=>{
						if(item=='图片'){
							this.image = true
						}
						if(item=='音频'){
							this.audio = true
						}
						if(item=='文档'){
							this.docs = true
						}
					})
					this.field_keys = res.data.field_keys.split( ',' )
					for(var i = 0; i<this.field_keys.length;i++){
						this.fieldValue.push('')
					}
					this.load_setting()
				})
			},
			get_project(){
				projectsRequest.get_project(this.projectId, app.globalData.token)
				.then((res)=>{
					this.fides = res.data.fields.split( ',' )
					this.fides.forEach(item=>{
						if(item=='图片'){
							this.image = true
						}
					})
					this.field_keys = res.data.field_keys.split( ',' )
					for(var i = 0; i<this.field_keys.length;i++){
						this.fieldValue.push('')
					}
					this.load_setting()
				})
			},
			clockInClick(){
				var fileId = []
				var docs = []
				var audio = []
				this.contentImg.forEach((item,index)=>{
					fileId.push(item.fileId)
				})
				this.contentFile.forEach((item,index)=>{
					docs.push(item.fileId)
				})
				this.contentAudio.forEach((item,index)=>{
					audio.push(item.fileId)
				})
				fileId = fileId.join(',')
				docs = docs.join(',')
				audio = audio.join(',')
				console.log(this.fieldValue)
				this.fides.forEach((item, index)=>{
					if(item == '图片'){
						this.fieldValue[index] = fileId
					} 
					if(item == '音频'){
						this.fieldValue[index] = audio
					} 
					if(item == '文档'){
						this.fieldValue[index] = docs
					} 
					if(item == '是/否'){
						this.fieldValue[index] = this.oper1
					}
					if(item == '有/无'){
						this.fieldValue[index] = this.oper2
					}
				})
				console.log(this.fieldValue)
				
				for(let i=0;i<this.fieldValue.length;i++){
					if( typeof this.fieldValue[i] != 'boolean' && this.fieldValue[i].replace(/^\s*|\s*$/g,"").length<1){
						uni.showToast({
						    title: `请输入${this.fides[i]}`,
						    duration: 2000,
							icon:'none'
						});
						return
					}
				}
				var data = {}
				this.field_keys.forEach((item, index)=>{
					if(item == 'counts'){
						data[item] = parseInt(this.fieldValue[index]) 
					}else{
						data[item] = this.fieldValue[index]
					}
					
				})
				
				if(this.fieldsType == 'project'){
					data.projectId = this.projectId
					projectsRequest.submit_data(data, this.projectId, app.globalData.token)
					.then((res)=>{
						uni.showToast({
							title:'操作成功'
						})
						uni.navigateBack()
					})
				}else if(this.fieldsType == 'task'){
					data.taskId = this.taskId
					completesRequest.submit_data(data, app.globalData.token)
					.then((res)=>{
						uni.showToast({
							title:'操作成功'
						})
						uni.navigateBack()
					})
				}

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
			radioChange1(i,e){
				if(e.detail.value == '是'){
					this.oper1 = true
				}else if(e.detail.value == '否'){
					this.oper1 = false
				}
				console.log(this.oper1)
			},
			radioChange2(i,e){
				if(e.detail.value == '有'){
					this.oper2 = true
				}else if(e.detail.value == '无'){
					this.oper2 = false
				}
				console.log(this.oper2)
			},
			previewImage(index){
				var previewImage = []
				this.fieldsImg.forEach((item)=>{
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
			load_setting(){
				completesRequest.load_setting(app.globalData.token)
				.then((res)=>{
					this.field_keys.forEach((item1,index1)=>{
						if(item1 in res.data){
							this.fieldValue.splice(index1,1,res.data[item1])
						}
					})
				})
			},
			getPhoneNumber(e){
				console.log(e,'phonenumber')
				var ivObj = e.detail.iv
				var telObj = e.detail.encryptedData
				var codeObj = "";
			}
		}
	}
</script>

<style>
.inputItem{
	display: flex;
	 align-items: center;
	 border-bottom: 1px solid #dedede; 
	margin-left: 30rpx;
}
.fieldsImgitem{
 	width: 190rpx;
 	height: 190rpx;
 }
 .imgItem{
 	 width: 190rpx;
 	 height: 190rpx;
 	 position: relative;
 	 border-radius: 6px;
 	 margin: 6rpx 10rpx;
 }
 .reicon{
 	 position: absolute;
 	 right: 6rpx;
 	 top: 10rpx;
 }
 .fieldsImg{
 	 display: flex;
 	 flex-wrap: wrap;
 }
 .radioItem{
	 height: 100rpx;
	 display: flex;
	 align-items: center;
	 border-bottom: 1px solid #dedede;
	 margin-left: 30rpx;
 }
 .radiogroup{
	 width: 400rpx;
	 display: flex;
	 justify-content: space-around;
 }
</style>
