<template>
	<view id="impQuestionnaire">
		<view class="mysection">| 我的问卷列表</view>
		<view class="tasksItem" v-for="(item, index) in myQuestionnairesListres" :key="index" @click="impQuestionnaires(item.questionnaireId)">
			<view style="margin-right: 20rpx;">
				<view class="taskTitle">{{item.title}}</view>
				<view class="taskText">创建时间:{{item.deadline}}</view>
			</view>
			<button type="primary" size="mini" style="margin: 0;">导入</button>
			
			
		</view>
		<van-dialog  :show="dialogShow" show-cancel-button  title="是否将问卷导入圈子"
		  @confirm='dialogconfirm' @close="()=>{this.dialogShow = false;}" />
	</view>
</template>

<script>
	import {QuestionnaireRequest} from "../../network/questionnaire.js";
	import vanDialog from '../../wxcomponents/vant/dialog'
	
	const app = getApp()
	
	export default {
		data() {
			return {
				myQuestionnairesListres:[],
				dialogShow:false,
				onClickQid:null,
				topicId: null
			}
		},
		components:{
			vanDialog
		},
		onLoad(options) {
			this.topicId = options.topicId
			this.get_u_questionnaire()
		},
		methods: {
			get_u_questionnaire(){
				QuestionnaireRequest.get_u_questionnaire(app.globalData.unionId)
				.then((res)=>{
					this.myQuestionnairesListres = res.data.questionnaires
				})
			},
			impQuestionnaires(e){
				this.dialogShow = true
				this.onClickQid = e
			},
			dialogconfirm(){
				var data = {
					qid:this.onClickQid,
					refId: this.topicId,
					unionId: app.globalData.unionId
				}
				QuestionnaireRequest.clone_questionnaire(data)
				.then((res)=>{
					uni.navigateBack()
				})
			},
		}
	}
</script>

<style>
	#impQuestionnaire{
		width: 94%;
		margin: 10px auto 0px auto;
	}
.tasksItem{
 	background-color: #FFFFFF;
 	border: 1px solid #E1E1E1;
 	height: 150rpx;
	display: flex;
	margin: 0 auto;
	padding: 0 20rpx;
	align-items: center;
	justify-content: space-between;
 }
 .taskTitle{
 	margin-top: 10rpx;
	font-size: 30rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
 }
 .taskText{
 	font-size: 20rpx;
 	color: #626262;
 	margin-top: 10rpx;
 	margin-bottom: 4rpx;
 }
</style>
