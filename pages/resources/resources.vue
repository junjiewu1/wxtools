<template>
	<view id="resources">
		<view style="width: 100%; text-align: center; background-color: #1ab7ff; color: #FFFFFF; line-height: 60rpx; font-size: 30rpx;" @click="openEditDialog('header')">{{headerMessage}}</view>
		<van-dialog  use-slot  :show="editdialogShow" show-cancel-button  title="修改信息"
		  @confirm='()=>{this.setconfigs()}' @close="()=>{this.editdialogShow = false;this.showMessageInput = ''	}" >
		 <input  style="height: 100rpx; width: 80%; margin: 0 auto; margin-top: 20rpx;" placeholder="请输入信息" v-model="showMessageInput" />
		</van-dialog>
		
		<view style="display: flex; align-items: center; margin: 20rpx 0;">
			<button size="mini" @click="lastWeek">上一周</button><text style="width: 50%; text-align: center;">{{beginDate | editTime}}~{{endDate | editTime}}</text><button size="mini" @click="nextWeek">下一周</button>
		</view>
		
		<van-grid column-num="8">
		  <van-grid-item  :text.sync="item" 
		  v-for="(item,index) in options" :key="index"  @click="topicsInfoLongpress(index)"  @longpress="grid1Clcik(index)" />
		   
		</van-grid>
		<view  v-if="topicsInfo.owned" style="display: flex;">
			<view  @click="addClcik" style="width: 250rpx; text-align: center;line-height: 80rpx; background-color: #FFFFFF; border-right: 1px solid #f3f3f3;">添加</view>
			<view  @click="chackAllbooks" style="width: 250rpx; text-align: center;line-height: 80rpx; background-color: #FFFFFF; border-right: 1px solid #f3f3f3;">查看所有预约</view>
			<view  @click="()=>{this.dymDialogShow = true}" style="width: 250rpx; text-align: center;line-height: 80rpx; background-color: #FFFFFF; ">设置</view>
		</view>
		
		<van-dialog  use-slot  :show="dialogShow" show-cancel-button  title="添加资源"
		  @confirm='dialogconfirm' @close="()=>{this.dialogShow = false; this.dialogInput = ''}" >
		 <input maxlength="11" style="height: 30rpx; width: 80%; margin: 0 auto; margin-top: 20rpx;" placeholder="名称" v-model="dialogInput" />
			<picker  @change="(e)=>{this.index = e.target.value}" :value="index" :range="array"  >
		            <view  style="width: 80%; margin: 30rpx auto;" ><text style="color: #686868;">类型:</text><text style="text-align: center; margin-left: 50rpx;">{{array[index]}}</text></view>
		   </picker>
		</van-dialog>
		
		<van-dialog  use-slot  :show="dymDialogShow" show-cancel-button  title="设置"
		  @confirm='dymDialogconfirm' @close="()=>{this.dymDialogShow = false;}" >
		 <picker  :value="intervalIndex" :range="timeInterval"  @change="(e)=>{this.intervalIndex = e.target.value}">
		 <view  style="width: 80%; margin: 30rpx auto;" ><text style="color: #686868;">预约粒度:</text><text style="text-align: center; margin-left: 50rpx;">
		 {{timeInterval[intervalIndex]}}</text></view>
		  </picker>
		  <view  style="width: 80%; margin: 0 auto;" ><text style="color: #686868;">休息时间:</text></view>
		  <checkbox-group  style="width: 86%; margin: 20rpx auto; display: flex; flex-wrap: wrap;justify-content: space-between;">
		                  <label class="" v-for="(item, index) in restTimeAry" :key="index"  style="width: 130rpx; margin: 10rpx 0;">
		                      <view>
		                          <checkbox :value="item.value" :checked="item.checked" @click="checkClick(item, index)" />{{item.name}}
		                      </view>
		                  </label>
		  </checkbox-group>
		</van-dialog>
		 
		<view style="width: 100%; text-align: center; background-color: #1ab7ff; color: #FFFFFF; line-height: 60rpx;font-size: 30rpx;" @click="openEditDialog('footer')">{{footerMessage}}</view>
		
		<view v-if="!TimeLine" style="padding: 4rpx; font-size: 24rpx; margin: 4rpx 16rpx;" @click="openEditDialog('tip2')" >{{tip2Message}}</view>
		<view v-if="!TimeLine" style="padding: 4rpx;  font-size: 24rpx; margin: 4rpx 16rpx;" @click="openEditDialog('tip')" >{{tipMessage}}</view>
		 
		
		<view class="booksContent" style="margin-top: 10px; padding: 10px 0; background-color: #FFFFFF;" v-if="my_bookings.length">
			<view class="mysection">| 我的预约</view>
			<view v-for="(item, index) in my_bookings" :key='index' class="boosList">
				<view style="width: 100rpx;">{{item.resource.name}}</view>
				<view style="width: 160rpx;">{{item.targetTime | timeChange}}</view>
				<view style="width: 280rpx;">备注:{{item.memo?item.memo:'无'}}</view>
				<button v-if="item.deleted" style="width: 120rpx;padding: 0;margin: 0; " size="mini" >已取消</button>
				<button v-else @click="cancel_book(item.bookingId)" style="width: 120rpx;padding: 0;margin: 0;background-color: #c62626; color: #FFFFFF;" size="mini">取消</button>
			</view>
		</view>
		
		
		
		<van-dialog  use-slot  :show="setdialogShow" show-cancel-button  title="设置状态"
		  @confirm='set_resource' @close="()=>{this.setdialogShow = false; }" >
			<picker  @change="(e)=>{this.index2 = e.target.value}" :value="index2" :range="array2"  >
					 <view  style="width: 80%; margin: 30rpx auto;" ><text style="color: #686868;">资源状态:</text><text style="text-align: center; margin-left: 50rpx;">{{array2[index2]}}</text></view>
			</picker>
			<view v-show="index2==0">
				<picker mode="time" :value="time1" start="09:00" end="21:00" @change="(e)=>{this.time1 = e.target.value}" >
					<view  style="width: 80%; margin: 30rpx auto;" ><text style="color: #686868;">开始时间:</text><text style="text-align: center; margin-left: 50rpx;">{{time1}}</text></view>
				</picker>
				<picker mode="time" :value="time2" start="09:00" end="21:00" @change="(e)=>{this.time2 = e.target.value}" >
					<view  style="width: 80%; margin: 30rpx auto;" ><text style="color: #686868;">结束时间:</text><text style="text-align: center; margin-left: 50rpx;">{{time2}}</text></view>
				</picker>
				
			</view>
		</van-dialog>
		
		<van-dialog use-slot :show='deldialogShow'  @close="()=>{this.deldialogShow = false; }">
			<button type="primary" style="margin: 20rpx 20rpx;" @click="updateIndex('up')">向上移动</button>
			<button type="primary" style="margin: 20rpx 20rpx;" @click="updateIndex('down')">向下移动</button>
			<button type="primary" style="margin: 20rpx 20rpx;"  @click="chackbooks">查看预订</button>
			<button type="warn" style="margin: 20rpx 20rpx;" @click="delresource">删除此项目</button> 
		</van-dialog>
		
		<van-dialog  use-slot :show='bookdialogShow' title='是否确认预订'  @confirm='bookdialog' show-cancel-button  @close="()=>{this.bookdialogShow = false; this.bookdialogInput = ''}"  >
			<input maxlength="11" style="height: 100rpx; width: 80%; margin: 0 auto; margin-top: 20rpx;" placeholder="姓名+年龄" v-model="bookdialogInput" />
		</van-dialog>
		
		<van-dialog   :show='celdialogshow' title='是否取消预订'  @confirm='celdialog' show-cancel-button  @close="()=>{this.celdialogshow = false;}"  />
		<view v-if="!TimeLine" style="font-size: 24rpx; text-align: right;  margin-top: 20rpx; color: #f04142 ; font-weight: 400;" ><text style="padding: 6rpx;" @click="gotoTopic">点击进入 {{topicsInfo.topic}} 圈子></text></view>
		<button v-if="!TimeLine" open-type="share" style="margin-top: 20rpx; margin-bottom: 40rpx;">分享</button>
		<!-- <button style="margin-top: 30rpx;">查看所有预订</button> -->
		<van-dialog   :show='logindialog' title='登录才能预订'  @confirm='gotologin' show-cancel-button  @close="()=>{this.logindialog = false;}"  />
	
		<van-popup :show="showpopoUp" position="bottom" round @close="closePopoup('1')">
				<view style="text-align: center; line-height: 60rpx; font-size: 40rpx;font-weight: 500; margin-top: 20rpx;">请选择预约时间</view>
				
				<view v-for="(item, index) in bookTime" :key="index" style="margin: 20rpx;display: flex; align-items: center;">
					<view style="font-size: 28rpx;">{{item.name}}:</view> 
					<text v-for="(timeItem, timeIndex) in item.value" :key="timeIndex" class="timeItem"   :class="{isreserved: timeItem.reserved}" @click="booksTimeClick(item,timeIndex)">{{timeItem.timelevel}}</text>
				</view>
		</van-popup>
		 
	</view>
</template>

<script>
	import {resourcesRequest} from "../../network/resources.js";
	import {postsRequest} from "../../network/posts.js";
	import {delyDate, formatDate, undelyDate, parseQueryString} from '../../utils/common.js'
	import {upGo, downGo} from '../../utils/Array.js'
	import vanGrid from '../../wxcomponents/vant/grid'
	import vanGridItem from '../../wxcomponents/vant/grid-item'
	import vanDialog from '../../wxcomponents/vant/dialog'
	import vanPopup from '../../wxcomponents/vant/popup'
	const HEADER = ["名称","一","二","三","四","五","六","日"]
	const app = getApp()
	export default {
		data() {
			return {
				array:  ['人员', '设备'],
				array2:  ['人员', '设备'],
				timeInterval:['5分钟','10分钟','15分钟','20分钟','半小时','1小时'],
				intervalIndex: 4,
				restTimeAry: [
				            { value: 8, name: '8点' ,checked: false},
							{ value: 9, name: '9点',checked: false},
							{ value: 10, name: '10点',checked: false},
							{ value: 11, name: '11点',checked: false},
							{ value: 12, name: '12点',checked: false},
							{ value: 13, name: '13点',checked: false},
							{ value: 14, name: '14点',checked: false},
							{ value: 15, name: '15点',checked: false},
							{ value: 16, name: '16点',checked: false},
							{ value: 17, name: '17点',checked: false},
							{ value: 18, name: '18点',checked: false},
							{ value: 19, name: '19点',checked: false}
				 ],
				 restTime:[],
				index: 0,
				index2: 0,
				time1: '9:00',
				time2: '18:00',
				// booktime: formatDate(new Date(),'hh:mm'),
				setdialogShow: false,
				dialogShow: false,
				bookdialogShow: false,
				celdialogshow:false,
				deldialogShow:false,
				dymDialogShow: false,
				showpopoUp: false,
				bookdialogInput:'',
				topicId: null,
				beginDate: null,
				endDate: null,
				resources:null,
				options:HEADER,
				statusTime:null,
				onresources:null,
				topicsInfo:null,
				realyDel:null,
				relcelId:null,
				my_bookings:[],
				TimeLine:false,
				logindialog: false,
				editdialogShow: false,
				headerMessage: '',
				footerMessage:'',
				tipMessage:'',
				tip2Message:'',
				messageType:'',
				showMessageInput:'',
				booking_time_level: '30',
				bookTime:[],
				all_bookings:[],
				rawData:{},
				willbookTIme:'0',
				longPressIndex: null
			}
		},
		components:{
			vanGrid,
			vanGridItem,
			vanDialog,
			vanPopup
		},
		onLoad(options) {
			console.log(options)
			    if ('q' in options){
			      var q = decodeURIComponent(options.q)
			      console.log(q)
			      var params = parseQueryString(q);
			      if ('topicsId' in params){
					  this.topicId = params.topicsId
			      }
			    }
				else
					this.topicId = options.topicId
			var res = wx.getLaunchOptionsSync();
			console.log("launch options:", res)
			if (res.scene == 1154){
				this.TimeLine = true
				var current = new Date()
				var dely = current.getDay()-1
				if(dely == -1) dely = 6
				this.beginDate = delyDate(current, -dely)	
				this.endDate = delyDate(this.beginDate, 6)
				this.getresources()
				this.getconfigs()
				return
			}

			if (!app.globalData.token){
				console.log("no token")
				app.globalData.tokenReadyCallback = this.onloadfnc;
			}else{   
				this.onloadfnc()
			}
			uni.showShareMenu({  
			  withShareTicket: true,  
			  menus: ['shareAppMessage', 'shareTimeline']  
			})
			this.glancThrough(options)
		},
		filters:{
			editTime(value){
				if(value) value = value.substring(5)
				return value
			},
		
			timeChange(value){
				var value = value.substring(5,16)
				return value
			}
		},
		
		methods: {
			onloadfnc(){
				this.getposts(this.topicId, app.globalData.token)
				this.getresources()
				var current = new Date()
				var dely = current.getDay()-1
				if(dely == -1) dely = 6
				this.beginDate = delyDate(current, -dely)	
				this.endDate = delyDate(this.beginDate, 6)
				this.getconfigs()
				this.get_my_bookings() 
			},
			getCol(statusTime){
				return undelyDate(statusTime, this.beginDate)
			},
			getTime(col){
				var time = delyDate(this.beginDate, col)
				return time
			},  
			getposts(topicId, token){
				postsRequest.getposts(topicId, token)
				.then((res)=>{
					this.topicsInfo = res.data.topic
					uni.setNavigationBarTitle({
					    title: this.topicsInfo.topic
					});
				})
			},
			cancel_book(bookingId){
				this.relcelId = bookingId
				this.celdialogshow = true
			},
			celdialog(){
				resourcesRequest.cancel_book(this.relcelId, app.globalData.token)
				.then((res)=>{
					this.get_my_bookings()
				})
			},
			getresources(){
				this.options = ["名称","一","二","三","四","五","六","日"]
				resourcesRequest.get_resources(this.topicId, this.beginDate, this.endDate, app.globalData.token)
				.then((res)=>{
					this.resources = res.data.resources
					this.resources.forEach((item,index)=>{
						this.options.push(item.name)
						for (var i = 0; i < 7;i ++){
							this.options.push('x');
						}
						resourcesRequest.get_resource_status(item.resId, this.beginDate, this.endDate, app.globalData.token)
						.then((res2)=>{
							this.resources[index]['status'] = res2.data.status
							res2.data.status.forEach(item1=>{
								var col = this.getCol(item1.statusTime)
								var rawKey = "" + ((index+1)*8+col+1)
								this.rawData[rawKey] = item1
								if(item1.status == 'available'){
									var time = item1.detail[0].begin+'\n~\n'+item1.detail[0].end
									this.options.splice((index+1)*8+col+1, 1, time)
								}else if(item1.status == 'unavailable'){
									if(item.category == 'device'){										this.options.splice((index+1)*8+col+1, 1, '不可用')									}else{										this.options.splice((index+1)*8+col+1, 1, '休息')									}
								}
							})
						})
					})
				})
			},
			closePopoup(){
				this.showpopoUp = false
			},
			grid1Clcik(e){
				if(!this.topicsInfo.owned){
					return
				}
				var row = parseInt(e / 8)
				var col = e % 8
				if (row == 0 || col == 0){
					//pass
				}else{
					var resIndex = row - 1;
			
					if (this.options[e] == 'x'){
						this.onresources = this.resources[row-1]
						if(this.onresources.category == 'person'){
							this.array2 = ['上班','休息','待定']
						}else{
							this.array2 = ['可用','不可用']
						}
						col=col-1	
						this.statusTime = this.getTime(col)
						this.setdialogShow = true
						 
					}else{
						this.onresources = this.resources[row-1]
						if(this.onresources.category == 'person'){
							this.array2 = ['上班','休息','待定']
						}else{
							this.array2 = ['可用','不可用']
						}
						col=col-1	
						this.statusTime = this.getTime(col)
						this.setdialogShow = true
					}
				}
			},
			
			set_resource(){
				var data = {} 
				data.resId = this.onresources.resId
				data.statusTime = this.statusTime
				data.status = ['available', 'unavailable'][this.index2]
				if(data.status == 'available'){
					data.detail = [{begin: this.time1, end: this.time2}]
					resourcesRequest.set_resource_status(this.topicId, data, app.globalData.token)
					.then((res)=>{
						this.getresources()
					})
				}else if(data.status == 'unavailable'){
					data.detail = []
					resourcesRequest.set_resource_status(this.topicId, data, app.globalData.token)
					.then((res)=>{
						this.getresources()
					})
				}else{
					resourcesRequest.clear_resource_status(this.topicId, {resId:this.onresources.resId,statusTime:this.statusTime,status:'unavailable'}, app.globalData.token)
					.then(res=>{
						this.getresources()
					})
				}

			},
			addClcik(){
				this.dialogShow = true
			},
			dialogconfirm(){
				var data = {}
				data.topicId = this.topicId
				data.name = this.dialogInput
				data.category = ['person', 'device'][this.index]
				resourcesRequest.createResources( data,app.globalData.token)
				.then((res)=>{
					this.getresources() 
				})
			},
			booksTimeClick(i,v){
				if(!i.value[v].reserved){
					var a = i.name+':'+i.value[v].timelevel
					this.willbookTIme = a
					this.bookdialogShow = true
				}
				
			},
			bookdialog(){
				if(!app.globalData.userInfo){
					this.logindialog = true
				}
				if(this.bookdialogInput.length<1){
					uni.showToast({
						title:'请输入备注',
						icon:'none'
					})
					return
				}
				if(this.topicsInfo && !this.topicsInfo.joined){
					postsRequest.joinposts(this.topicId, app.globalData.token)
				}
				
				
				var targetTime = this.realyTime+' '+ this.willbookTIme
				var data = {}
				data.resId = this.resources[this.realyDel-1].resId
				data.targetTime = targetTime
				data.memo = this.bookdialogInput
				
				resourcesRequest.book_resource(data,app.globalData.token)
				.then((res)=>{
					uni.showToast({
						title:'预订成功',
						duration: 2000
					})
					uni.requestSubscribeMessage({
					      tmplIds: ['OsqQLdfN6vXriL6sfKTn5awC4tNH6aFfKC6e6s7ZttQ','FNOc6vkG3wVtX_6p6qn6T7gGPAeAwuZyjoKGXsMED38'],
					      success: res=>{
					        console.log("req sub success", res);
					      }
					    })
					this.get_my_bookings()
					this.initBooksTime(this.longPressIndex)
					this.showpopoUp = false
				})
				.catch((err)=>{
					uni.showToast({
						title:err.data.information,
						duration: 2000,
						icon:'none'
					})
					this.initBooksTime(this.longPressIndex)
				})
			},
			
			lastWeek(){
				this.beginDate = delyDate(this.beginDate,-7)
				this.endDate = delyDate(this.beginDate,6)
				this.getresources()
				this.get_my_bookings()
			},
			nextWeek(){
				this.beginDate = delyDate(this.endDate, 1)
				this.endDate = delyDate(this.beginDate,6)
				this.getresources()
				this.get_my_bookings()
			},
			  topicsInfoLongpress(e){
				var row = parseInt(e / 8)
				var col = e % 8
				this.realyDel = row
				this.longPressIndex = e
				this.realyTime = this.getTime(col-1)
				if (col == 0 && row !=0 && this.topicsInfo.owned){ 
					this.deldialogShow = true
				}else if(this.options[row*8+col] != 'x' && row!=0 && col!=0 && !this.TimeLine){
					if(this.rawData[""+e].status == "available"){
						this.showpopoUp = true
						this.initBooksTime(e)
					}else{
						return
					}
				}else if(row==0&&col!=0 && this.topicsInfo.owned){
					uni.navigateTo({
					    url: `/pages/allbooks/allbooks?col=${col}&beginDate=${this.realyTime}&endDate=${this.realyTime}&topicId=${this.topicId}`,
						success:(res)=> {
						   // 通过eventChannel向被打开页面传送数据
						   res.eventChannel.emit('acceptDataFromOpenerPage', {data: this.resources})
						 }
					});
				}
			},
			checkClick(item, index){
				console.log(item)
				this.restTimeAry[index].checked = !item.checked
			},
			async initBooksTime(e){
				
				this.bookTime = []
				var onPressItem = this.rawData[""+e]
				var startHour = parseInt(onPressItem.detail[0].begin)
				var endHour = parseInt(onPressItem.detail[0].end)
				var sc = onPressItem.detail[0].begin.indexOf(":")+1
				var ec = onPressItem.detail[0].end.indexOf(":")+1
				var startMin = parseInt(onPressItem.detail[0].begin.substr(sc))
				var endMin = parseInt(onPressItem.detail[0].end.substr(ec))
				console.log(startHour,endHour, startMin, endMin)
				for(let i = startHour; i< endHour; i++){		
					if(this.restTime.findIndex(item=> item == i)!=-1){
						var aaa = {name: i<10?'0'+i:''+i,value: []}						for(let j = 1; j<=60/this.booking_time_level; j++){							aaa.value.push({timelevel:(j-1)*this.booking_time_level<10? '0'+(j-1)*this.booking_time_level : ''+(j-1)*this.booking_time_level, reserved: true})						}					}else{
						var aaa = {name: i<10?'0'+i:''+i,value: []}						for(let j = 1; j<=60/this.booking_time_level; j++){
							if (startMin > 0 && startHour == i && j*this.booking_time_level <= startMin){
								aaa.value.push({timelevel:(j-1)*this.booking_time_level<10? '0'+(j-1)*this.booking_time_level : ''+(j-1)*this.booking_time_level, reserved: true})
							}else{
								aaa.value.push({timelevel:(j-1)*this.booking_time_level<10? '0'+(j-1)*this.booking_time_level : ''+(j-1)*this.booking_time_level, reserved: false})
							}						}					}
					this.bookTime.push(aaa)
				}
				if (endMin > 0){
						var ee = endMin / this.booking_time_level
						var aaa = {name: endHour<10?'0'+endHour:''+endHour,value: []}						for(let j = 1; j<=60/this.booking_time_level; j++){
							if (j > ee){
								aaa.value.push({timelevel:(j-1)*this.booking_time_level<10? '0'+(j-1)*this.booking_time_level : ''+(j-1)*this.booking_time_level, reserved: true})
							}else{
								aaa.value.push({timelevel:(j-1)*this.booking_time_level<10? '0'+(j-1)*this.booking_time_level : ''+(j-1)*this.booking_time_level, reserved: false})
							}						}
					this.bookTime.push(aaa)
				}
				let allbookings = await resourcesRequest.get_all_bookings({beginTime:this.realyTime,endTime:this.realyTime,resId:onPressItem.resId, delFlag:true},app.globalData.token)
				console.log(allbookings)
				allbookings.data.bookings.forEach(item1=>{
					var itemitem = item1.targetTime.substring(11,16)
					itemitem = itemitem.split(':')
					this.bookTime.forEach(item2=>{
						if(itemitem[0] == item2.name){
							item2.value.forEach(item3=>{
								if( -parseInt(this.booking_time_level)<parseInt(item3.timelevel)-parseInt(itemitem[1]) && parseInt(item3.timelevel)-parseInt(itemitem[1]) <1){
									item3.reserved = true
								}
							})
						}
					})
				})
			},
			openEditDialog(type){
				if(!this.topicsInfo.owned) return
				this.messageType = type
				this.editdialogShow = true
				switch(type){
					case 'header':
					this.showMessageInput = this.headerMessage
					break
					case 'footer':
					this.showMessageInput = this.footerMessage
					break
					case 'tip':
					this.showMessageInput = this.tipMessage
					break
					case 'tip2':
					this.showMessageInput = this.tip2Message
					break
				}
			},
			gotologin(){
				let url = "/pages/resources/resources?topicId=" + this.topicId;
				url = encodeURI(url);
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			
			delresource(){ 
				var delId = this.resources[this.realyDel-1].resId
				resourcesRequest.del_resource(delId, app.globalData.token)
				.then((res)=>{
					this.deldialogShow = false
					this.getresources()
				})
			},
			get_my_bookings(){ 
				resourcesRequest.get_my_bookings({beginTime:this.beginDate, endTime:this.endDate, topicId:this.topicId},app.globalData.token)
				.then((res)=>{
					this.my_bookings = res.data.bookings
				})
			},
			updateIndex(GO){
				var a = []
				this.resources.forEach((item)=>{
					a.push(item.resId)
				})
				if(GO == 'up'){
					upGo(a, this.realyDel-1)
				}else if(GO == 'down'){
					downGo(a, this.realyDel-1)
				}
				var data = {}
				data.topicId = parseInt(this.topicId)
				data.indexes = a
				resourcesRequest.update_index(data, app.globalData.token)
				.then((res)=>{
					this.deldialogShow = false
					this.getresources()
				}) 
			},
			dymDialogconfirm(){
				var data ={
					topicId:this.topicId, 
					category: 'resource',
					name: 'booking_time_level',
					value: '30'
				}
				
				switch(this.intervalIndex){
					case '0':
					data.value = '5'
					break;
					case '1':
					data.value = '10'
					break;
					case '2':
					data.value = '15'
					break;
					case '3':
					data.value = '20'
					break;
					case '4':
					data.value = '30'
					break;
					case '5':
					data.value = '60'
					break;
				}
				resourcesRequest.setconfigs(data,app.globalData.token)
				.then((res)=>{
					this.getconfigs()
				})
				var a = []
				this.restTimeAry.forEach((item,index)=>{
					if(item.checked){
						a.push(item.value)
					}
				})
				var data2 = {
					topicId:this.topicId, 
					category: 'resource',
					name: 'restTime',
					value: a.join(',')
				}
				console.log(data2, 'data2')
				resourcesRequest.setconfigs(data2,app.globalData.token)
				.then((res)=>{
					this.getconfigs()
				})
			},
			setconfigs(){
				var data ={
					topicId:this.topicId, 
					category: 'resource',
					name: this.messageType,
					value: this.showMessageInput
				}
				resourcesRequest.setconfigs(data,app.globalData.token)
				.then((res)=>{
					this.getconfigs(this.messageType)
				})
			},
			getconfigs(){
				var data ={
					topicId: this.topicId, 
					category: 'resource',
				}
				resourcesRequest.getconfigs(data, app.globalData.token)
				.then((res)=>{
					console.log('getconfigRes',res)
					var config = res.data.configs
					if('header' in config){
						this.headerMessage = config.header
					}else{
						this.headerMessage = this.topicsInfo.topic + '日程安排'
					}
					if('footer' in config){
						this.footerMessage = config.footer
					}else{
						this.footerMessage = '备注：点击修改'
					}
					if('tip' in config){
						this.tipMessage =config.tip
					}else{
						this.tipMessage = '逾时30分钟，预约自动作废'
					}
					if('tip2' in config){
						this.tip2Message = config.tip2
					}else{
						this.tip2Message = '提示:点击资源某一日期进行预约'
					}
					if('booking_time_level' in config){
						this.booking_time_level = config.booking_time_level
					}else{
						this.booking_time_level = '30'
					}
					if('restTime' in config){
						this.restTime = config.restTime.split(',')
						this.restTime.forEach((item,index)=>{
							this.restTimeAry.forEach((item1,index1)=>{
								if(item == item1.value){
									item1.checked = true
								}
							})
						})
					}
				})
			},
			chackbooks(){
				this.deldialogShow = false
				uni.navigateTo({
				    url: `/pages/allbooks/allbooks?row=${this.realyDel}&beginDate=${this.beginDate}&endDate=${this.endDate}&topicId=${this.topicId}`,
					success:(res)=> {
					   // 通过eventChannel向被打开页面传送数据
					   res.eventChannel.emit('acceptDataFromOpenerPage', {data: this.resources})
					 }
				});
			},
			chackAllbooks(){
				uni.navigateTo({
				    url: `/pages/allbooks/allbooks?beginDate=${this.beginDate}&endDate=${this.endDate}&topicId=${this.topicId}`,
					 success:(res)=> {
					    // 通过eventChannel向被打开页面传送数据
					    res.eventChannel.emit('acceptDataFromOpenerPage', {data: this.resources})
					  }
				});
			},
			gotoTopic(){
				uni.redirectTo({
				    url: `/pages/topics/topics?topicId=${this.topicId}`
				});
			},
			onShareAppMessage(e) {
			    return {
			        title: `${this.topicsInfo.topic} 日程安排`,
			        path: `/pages/resources/resources?topicId=${this.topicId}&topic=${this.topicsInfo.topic}`
			    }
			},
			onShareTimeline(res) {
					return {
						title: this.headerInput,
						query: 'topicId='+this.topicId,
						imageUrl:this.topicsInfo.photoUrl,
					}
			},
			
		} 
	}
</script>

<style>

.example-body {
 	/* #ifndef APP-NVUE */
 	display: block;
 	/* #endif */
 }
 .grid-item-box {
 	flex: 1;
 	// position: relative;
 	/* #ifndef APP-NVUE */
 	display: flex;
 	/* #endif */
 	flex-direction: column;
 	align-items: center;
 	justify-content: center;
 	padding: 15px 0;
 }
 .image {
 	width: 50rpx;
 	height: 50rpx;
 }
 .text {
 	font-size: 26rpx;
 	margin-top: 10rpx;
 }
 .grilItem{
 	height: 100px !important;
	
 }
 .van-grid-item__content{
	 /* background-color: #f1f1f1 !important; */
	 padding: 0 !important;
	 height: 100rpx !important; 
	 flex-wrap: wrap !important;
	 white-space: normal !important;
	 word-wrap: normal !important;
	 text-align: center !important; 
	 
 }
 .isreserved{
	 background-color: #bdb7bc !important;
 }
 .timeItem{
	 color: #FFFFFF;
	 background-color: #07C160;
	  font-size: 24rpx; 
	  width: 30rpx; 
	  padding: 10rpx; 
	  margin: 12rpx 4rpx;
	  flex: 1;
	  text-align: center;
 }
 .boosList{
	 display: flex;
	 justify-content: space-around;
	 align-items: center;
	 padding:10px 0;
 }
 /* .boosList:nth-child(2n){ */
	 /* background-color: #3cc2d1; */
 /* } */
 .boosList view{
	 width: 150rpx;
	 font-size: 26rpx;
	 text-align: center;
 }	
 .van-grid-item__icon{
	 display: none !important;
 }
 .van-grid-item__text{
	 margin-top: 0 !important;
	 font-size: 26rpx !important;
	 word-wrap: normal;
	 width: 93.75rpx;
 	 line-height:24rpx !important;
	 
 }

</style>
