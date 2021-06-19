<template>
	<view id="projects">
		<mybaseinfo ref='mybaseinfo' :title="title" :content="content" :contentImg="contentImg"  subtitleHolder="请输入文字内容" titleHolder="请输入接龙主题(必填)"
			@uploadfile='uploadfile' @delFile="delFile"  @inputChange='inputChange' @textChange='textChange'>
		</mybaseinfo>
		
		<view class="settingTimeItems">
			<text style="margin-right: 50rpx;">结束时间</text>
			<view style="width: 220rpx;">
				<picker mode="date" :value="endDate"   @change='(e)=>{this.endDate = e.target.value}'>
					<text >{{endDate}}</text>
				</picker>
			</view>
			<view style="width: 100rpx;">
				<picker mode="time" :value="endTime"  @change='(e)=>{this.endTime = e.target.value}'>
					<text >{{endTime}}</text>
				</picker>
			</view>
		</view>
		
		<view class="settingItemClass">
					 <view class="sttingitem">
							<view>参与签到需要填写信息</view>
							<switch name="switch" class="clockInswitch" :checked='checked.fields' @change="()=>{this.checked.fields = !this.checked.fields}" />
					 </view> 
					 <view  v-if="checked.fields">
						<view class="fieldsOptions" v-for="(item, index) in fieldsOptions" :key="index" :class="{active: item.isselcet}"  @click="fieldClick(index)">{{item.field}}</view>
					 </view>
		</view>
		 
		<van-dialog  use-slot  :show="dialogShow" show-cancel-button  title="其他信息"
		  @confirm='dialogconfirm' @close="()=>{this.dialogShow = false;this.dialogInput = ''}" >
		 <input maxlength="4" style="height: 140rpx; width: 80%; margin: 0 auto;" placeholder="填写内容(最多4个字符)" v-model="dialogInput" />
		</van-dialog>
		
		<button type="primary" @click="saveClick">立即发布</button>
		
	</view>
</template>

<script>
	import {UserInfoRequest} from "../../network/userInfo.js";
	import {projectsRequest} from "../../network/projects.js";
	import {FileRequest} from "../../network/FileRequest.js";
	import vanDialog from '../../wxcomponents/vant/dialog'
	import {delyDate, formatDate} from '../../utils/common.js'
	import mybaseinfo from '@/components/mybaseinfo.vue'
	const app = getApp()
	export default {
		components:{mybaseinfo, vanDialog},
		data() {
			return {
				isdel: true,
				projectId:null,
				title:'',
				content:'',
				contentImg:[],
				endDate: delyDate(new Date(), 1),
				endTime: formatDate(new Date(), 'hh:mm'),
				checked:{
					fields:false
				},
				fieldsOptions:[{
					field:'姓名',
					isselcet:false
				},{
					field:'手机号',
					isselcet:false
				},{
					field:'身份证',
					isselcet:false
				},{
					field:'学校',
					isselcet:false
				},{
					field:'学号',
					isselcet:false
				},{
					field:'专业',
					isselcet:false
				},{
					field:'班级',
					isselcet:false
				},{
					field:'单位',
					isselcet:false
				},{
					field:'部门',
					isselcet:false
				},{
					field:'备注',
					isselcet:false
				},{
					field:'图片',
					isselcet:false
				},{
					field:'门牌',
					isselcet:false
				},{
					field:'数量',
					isselcet:false
				},{
					field:'是/否',
					isselcet:false
				},{
					field:'有/无',
					isselcet:false
				},{
					field:'其他',
					isselcet:false
				}],
				dialogShow:false,
				dialogInput:'',
			}
		},
		onLoad(options) {
		console.log(options)
			if (options.projectId !== 'new'){  //编辑模式
				this.isdel = false
				this.projectId = options.projectId 
				this.get_project()
			}else{ 							//创建模式
				this.topicId = options.topicId
				this.createProjects(options.topicId);
			}
		},
		onUnload(e) {
			if(this.isdel){    //没有保存返回就删除
				projectsRequest.deleteProjects({projectId:this.projectId}, app.globalData.token)
			}
		},
		methods: {
			createProjects(topicId){
				var data = {}
				if(topicId) data.refId = topicId
				projectsRequest.createProjects(data, app.globalData.token)
				.then(res=>{
					 this.projectId = res.data.projectId
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
					FileRequest.uploadFile(this.projectId, null, item.path, app.globalData.token)
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
			saveClick(){
				if(!this.title.trim()){
					uni.showToast({
					    title: '请完善信息',
					    duration: 2000,
						icon:'none'
					});
					return
				}else{
					var input = this.title+this.content
					UserInfoRequest.checkugcMsg(input)     //检查input
					.then((res)=>{
						uni.showLoading();
						if(res.data.result && input.length){
							let data = {
								projectId: this.projectId,
								title: this.title,
								content: this.content,
								endTime: this.endDate+' '+this.endTime,
							}
							var fields = []
							this.fieldsOptions.forEach((item, index)=>{
								if(item.isselcet){
									fields.push(item.field)
								}
							}) 
							fields = fields.join(',')
							data.fields = fields 
							
							let endTime = this.endDate+' '+this.endTime
							projectsRequest.editProjects(data, app.globalData.token)
							.then((res)=>{
								this.isdel = false
								uni.hideLoading()
								uni.showToast({
								    title: '保存成功',
								    duration: 2000,
									icon:'success'
								});
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
				}
			},
			get_project(){
				projectsRequest.get_project(this.projectId, app.globalData.token)
				.then(res=>{
					console.log(res.data)
					this.content = res.data.content
					this.title = res.data.title
					this.contentImg = res.data.files
					var begin = res.data.endTime.trim().split(" ")
					this.endDate = begin[0]
					let b = begin[1].slice(0, begin[1].length-3) 
					this.endTime = b
					if(res.data.fields.length > 0){
						this.checked.fields = true
						var fields = res.data.fields.split(',')
						fields.forEach((item1, index1)=>{
							var i = this.fieldsOptions.findIndex((item2)=>{
								return item2.field == item1
							})
							if(i!=-1){
								this.fieldsOptions[i].isselcet = true
							}else{
								this.fieldsOptions.splice(this.fieldsOptions.length-1, 0,  {field: item1, isselcet: true})
							}
						})
					}else{
						this.checked.fields = false
					}
				})
			},
			fieldClick(index){
				if(index == this.fieldsOptions.length-1){
					if(this.fieldsOptions.length>18){
						uni.showToast({
						    title: '数量限制',
						    duration: 2000,
							icon:'none'
						});
					}else{
						this.dialogShow = true
					}
				}else{
					this.fieldsOptions[index].isselcet = !this.fieldsOptions[index].isselcet
				}
			},
			dialogconfirm(e){   //插入需要填写的信息
				var a = {
					field: this.dialogInput,
					isselcet:false
				}
				var lt = this.fieldsOptions.length-1
				this.fieldsOptions.splice(lt, 0, a)
				this.dialogInput = ''
				this.dialogShow = false
			},
		}
	}
</script>

<style scoped>
#projects{
	width: 94%;
	margin: 10px auto 0px auto;
}
.settingTimeItems{
	display: flex;
	padding: 12px 0;
	
}
.settingItemClass{
		background-color: #FFFFFF; 
		padding: 2px 10px; 
		border-radius: 4px;
		margin-bottom: 40rpx;
	}
.sttingitem{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 0;
}
.clockInswitch{
	float: right;
}
.settingTimeItems{
	display: flex;
	padding: 12px 0;
	
}
.fieldsOptions{
	display: inline-block;
	flex-wrap: wrap;
	width: 20%;
	border: 1px solid #E1E1E1;
	text-align: center;
	margin: 16rpx;
	border-radius: 4px;
	padding: 16rpx 26rpx;
	color: #696a6d;
	font-size: 32rpx;
}
	.active{
		border: 1px solid #1AAD19 !important;
		position: relative;
	}
	.active::before{
		content: "*";
		position: absolute;
		color: #ff0000;
		font-size: larger;
		left: 14rpx;
	}
</style>
