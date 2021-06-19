<template>
	<view>
		<view class="inputItem">
			<view style="font-size: 26rpx;">名称：</view>
			<input  style="height: 110rpx; width: 560rpx; " placeholder="请输入名称"  v-model="goodsName" />
		</view>
		
		<view class="inputItem">
			<view style="font-size: 26rpx;">市场售价：</view>
			<input  style="height: 110rpx; width: 560rpx; " placeholder="请输入价格"  v-model="counterPrice"  type="number" />
		</view>
		<view class="inputItem">
			<view style="font-size: 26rpx;">卖点：</view>
			<input  style="height: 110rpx; width: 560rpx; " placeholder="请输入卖点"  v-model="brief"  type="text" />
		</view>
		<view class="inputItem">
			<picker  :value="unitIndex" :range="unitArray"  @change="(e)=>{this.unitIndex = e.target.value}">
				<view class="picker" style="width: 700rpx;">
				  单位：<text style="font-size: 30rpx;line-height: 100rpx;">{{unitArray[unitIndex]}}</text>
				</view>
			 </picker>
		</view>
		<textarea resize="none" style="height: 150rpx; width: 100%;border: #d6d6d6 1rpx dotted;padding: 10rpx;box-sizing: border-box;" placeholder="请输入介绍" v-model="detail"></textarea> 
		<view style="margin: 20rpx 0;">
			<radio-group @change="radioChange" v-if="!goodsId">
				<label><radio value="unit" :checked="!multi" />单规格</label>
				<label style="margin-left: 20rpx;"><radio value="multi" :checked="multi" />多规格</label>
			</radio-group>
			<view v-show="multi">
				<view v-for="(item,index) in multiProducts" :key="index"  class="productsItem" @click="editProducts(item,index)">
					<view style="display: flex; align-items: center;">
						<view>规格名:</view><view>{{item.specifications[0]}}</view>
					</view>
					<view style="display: flex; align-items: center;">
						<view>价格:</view><view>{{item.price}}</view>
					</view>
					<view style="display: flex; align-items: center;">
						<view>数量:</view><view>{{item.number}}</view>
					</view>
					<image src="../../static/image/minus.png" style="width: 40rpx; height: 40rpx;position: absolute;top: 60rpx;right: 29rpx;" @click.stop="delProducts(item,index)"></image>
				</view>
				<view style="text-align: center;color: #007AFF;background-color: #FFFFFF;line-height: 100rpx; font-size: 30rpx;" @click="addProducts" >+ 添加规格</view>
			</view>
			<view v-show="!multi">
				<view v-for="(item,index) in unitProducts" :key="index"  class="productsItem" @click="editProducts(item,index)">
					<view style="display: flex; align-items: center;">
						<view>规格名:</view><view>{{item.specifications[0]}}</view>
					</view>
					<view style="display: flex; align-items: center;">
						<view>价格:</view><view>{{item.price}}</view>
					</view>
					<view style="display: flex; align-items: center;">
						<view>数量:</view><view>{{item.number}}</view>
					</view>
				</view>
			</view>
			
		</view>
		<view>
			<view>商品图片：</view>
			<mybaseinfo ref='mybaseinfo'  :contentImg="picUrl" :imgLength=1
				  :showText=false  @uploadfile="uploadfile($event, 'picUrl')" @delFile="delFile(arguments,'picUrl')" >
			</mybaseinfo>
		</view>
		  <view>
		  	<view>宣传画廊：</view>
		  	<mybaseinfo ref='mybaseinfo'  :contentImg="gallery"	
		  		  :showText=false  @uploadfile="uploadfile($event,'gallery')" @delFile="delFile(arguments,'gallery')" >
		  	</mybaseinfo>
		  </view>
		<view class="sttingitem">
				<view >是否在售</view>
				<switch name="switch" class="clockInswitch" :checked='isOnSale'  @change="()=>{this.isOnSale = !this.isOnSale}"/>
		</view>
		<van-dialog  use-slot  :show="addproshow" show-cancel-button  title="添加规格"
		  @confirm='addprocfm' @close="()=>{this.addproshow = false}" >
		  <view style="width: 80%;margin: 20rpx auto;">
			  <view style="display: flex;align-items: center;">
				  <text>规格名：</text><input placeholder="请输入规格名" v-model="addproInput.specifications[0]" style="height: 70rpx;" />
			  </view>
			  <view style="display: flex;align-items: center;">
				  <text>价格：</text><input placeholder="请输入价格" v-model="addproInput.price" type="number" style="height: 70rpx;" />
			  </view>
			  <view style="display: flex;align-items: center;">
			  				  <text>数量：</text><input placeholder="请输入数量" v-model="addproInput.number" type="number"  style="height: 70rpx;"/>
			  </view>
		  </view>
		</van-dialog>
		
		<van-dialog  use-slot  :show="editproshow" show-cancel-button  title="修改规格"
		  @confirm='editprocfm' @close="()=>{this.editproshow = false}" >
		  <view style="width: 80%;margin: 20rpx auto;">
			  <view style="display: flex;align-items: center;">
			  				  <text>价格：</text><input placeholder="请输入价格" v-model="editproInput.price" type="number" style="height: 70rpx;" />
			  </view>
			  <view style="display: flex;align-items: center;">
				  <text>数量：</text><input placeholder="请输入数量" v-model="editproInput.number" type="number"  style="height: 70rpx;"/>
			  </view>
		  </view>
		</van-dialog>
		<button type="primary" style="width: 80%; margin-top:20px; margin-bottom: 60px;" @click="saveGoods">确定</button>
	</view>
</template>

<script>
	import {FileRequest} from "../../network/FileRequest.js";
	import {storeRequest} from "../../network/store.js";
	import vanDialog from '../../wxcomponents/vant/dialog';
	import mybaseinfo from '@/components/mybaseinfo.vue';
	const app = getApp()
	export default {
		data() {
			return {
				topicId:null,
				goodsName:'',
				unit:'',
				brief:'',
				counterPrice:'',
				gallery:[],
				picUrl:[],
				detail:'',
				isOnSale: true,
				unitArray:['个','盒','件','斤','克'],
				unitIndex:0,
				multi: false,
				goodsId:null,
				multiProducts:[],
				unitProducts:[{price:'',number:'',specifications:['标准']}],
				addproshow:false,
				editproshow:false,
				eidtIndex:null,
				addproInput:{
					price:'',
					number:'',
					specifications:['']
				},
				editproInput:{
					price:'',
					number:'',
					specifications:['']
				}
			}
		},
		components:{mybaseinfo,vanDialog},
		onLoad(options) {
			this.topicId = options.topicId
			if('goodsId' in options){
				this.goodsId = options.goodsId
				this.getGoodsInfo()
				this.initproducts()
			}
		}, 
		methods: {
			uploadfile(e, type){
				e.forEach((item)=>{
					uni.showLoading()
					FileRequest.uploadFile(-1, null, item.path, app.globalData.token)
					.then(res=>{
						uni.hideLoading()
						var data = JSON.parse(res.data)
							if(type == 'gallery'){
								if(this.gallery.length>9){
									uni.showToast({
										title:'图片数量不可以超过九张',
										icon:'none'
									})
								}else{
									this.gallery.push(data)
								}
							}else if(type == 'picUrl'){
								if(this.picUrl.length>0){
									return
								}else{
									this.picUrl.push(data)
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
			
			editProducts(item,index){
				this.editproshow = true
				// this.editproInput = item
				this.editproInput =  JSON.parse(JSON.stringify(item))
				this.eidtIndex = index
				
			},
			editprocfm(){
				var number = this.editproInput.number+""
				var price = this.editproInput.price+""
				if( number.replace(/(^\s*)|(\s*$)/g, "").length && price.replace(/(^\s*)|(\s*$)/g, "").length){
					if(this.editproInput.id){
						var product = {
							number:parseInt(number),
							price:parseInt(price),
							id:this.editproInput.id
						}
						storeRequest.edit_product({product:product},app.globalData.token)
						.then(res=>{
							this.initproducts()
							uni.showToast({
								title:'修改成功'
							})
						})
						.catch(err=>{
							uni.showToast({
								title:err.data.information,
								icon:'none'
							})
						})
					}else{
						if(this.multi){
							this.multiProducts[this.eidtIndex].price = price
							this.multiProducts[this.eidtIndex].number = number
						}else{
							this.unitProducts[this.eidtIndex].price = price
							this.unitProducts[this.eidtIndex].number = number
						}
					}
				}else{
					uni.showToast({
						title:'请完善规格信息',
						icon:'none'
					})
					return
				}
			},
			delFile(props,type){
				var e = props[0]
				var i = props[1]
				if(this.goodsId){
					if(type == 'picUrl'){
						this.picUrl.splice(i,1)
					}else if(type == 'gallery'){
						this.gallery.splice(i,1)
					}
				}else{
					FileRequest.delFile(e.fileId, app.globalData.token)
					.then((res)=>{
						if(type == 'picUrl'){
							this.picUrl.splice(i,1)
						}else if(type == 'gallery'){
							this.gallery.splice(i,1)
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
				}
				
			},
			
			radioChange(e){
				if(e.detail.value == 'multi'){
					this.multi = true
				}else{
					this.multi = false
				}
			},
			getGoodsInfo(){
				storeRequest.get(this.goodsId,app.globalData.token)
				.then(res=>{
					let goods = res.data.goods
					this.brief = goods.brief
					this.counterPrice = goods.counterPrice
					this.detail = goods.detail
					this.isOnSale = Boolean(goods.isOnSale)
					this.goodsName = goods.name
					this.unitIndex = this.unitArray.findIndex(item=>item==goods.unit)
					goods.gallery.forEach(item=>{
						this.gallery.push({url:item})
					})
					this.picUrl.push({url:goods.picUrl})
				})
				.catch(err=>{
					uni.showToast({
						title:'错误',
						icon:'none'
					})
				})
			},
			initproducts(){
				storeRequest.get(this.goodsId,app.globalData.token)
				.then(res=>{
					let goods = res.data.goods
					var that = this
					for(var i=0;i<=goods.products.length;i++){
					    (function(arg){
					        if(arg == goods.products.length){
					        	if(arg == 1 && goods.products[0].specifications[0] == '标准'){
					        					that.unitProducts = goods.products
					        					that.multi = false
					        				}else{
					        					that.multiProducts = goods.products
					        					that.multi = true
					        				}
					        }else{
								goods.products[i].specifications = goods.products[i].specifications
							}
					    })(i);
					}
				})
			},
			addProducts(){
				this.addproshow = true
				this.addproInput = {
					price:'',
					number:'',
					specifications:['']
				}
			},
			delProducts(item,index){
				uni.showModal({
				    title: '提示',
				    content: '确定要删除这条规格吗',
				    success: (res)=>{
				        if (res.confirm) {
				            if(item.goodsId){
				            	storeRequest.delete_product(item.id, app.globalData.token)
				            	.then(res=>{
									this.initproducts()
				            		uni.showToast({
				            			title:'删除成功'
				            		})
				            	})
				            	.catch(err=>{
				            		uni.showToast({
				            			title:err.data.information
				            		})
				            	})
				            }else{
				            	this.multiProducts.splice(index,1)
				            	uni.showToast({
				            		title:'删除成功'
				            	})
				            }
				        }
				    }
				});
			},
			addprocfm(){
				if(this.addproInput.number.replace(/(^\s*)|(\s*$)/g, "").length && this.addproInput.price.replace(/(^\s*)|(\s*$)/g, "").length && this.addproInput.specifications[0].replace(/(^\s*)|(\s*$)/g, "").length){
					if(this.goodsId){
						var product = {
							number:parseInt(this.addproInput.number),
							price:parseInt(this.addproInput.price),
							specifications: JSON.stringify(this.addproInput.specifications)
						}
						storeRequest.add_product({product:product},this.goodsId,app.globalData.token)
						.then(res=>{
							this.initproducts()
							uni.showToast({
								title:'添加成功'
							})
							
						})
						.catch(err=>{
							uni.showToast({
								title:err.data.information,
								icon:'none'
							})
						})
					}else{
						this.multiProducts.push(this.addproInput)
						uni.showToast({
							title:'添加成功'
						})
					}
				}else{
					uni.showToast({
						title:'请完善规格信息',
						icon:'none'
					})
				}
				
			},
			checkdata(){
				if(!this.goodsName.replace(/(^\s*)|(\s*$)/g, "").length){
					uni.showToast({
						title:'请输入商品名称',
						icon:'none'
					})
					return false
				}
				if(!this.brief.replace(/(^\s*)|(\s*$)/g, "").length){
					uni.showToast({
						title:'请输入商品卖点',
						icon:'none'
					})
					return false
				}
				if(!this.detail.replace(/(^\s*)|(\s*$)/g, "").length){
					uni.showToast({
						title:'请输入商品卖点',
						icon:'none'
					})
					return false
				}
				if(!this.picUrl.length){
					uni.showToast({
						title:'请选择商品图片',
						icon:'none'
					})
					return false
				} 
				if(!this.gallery.length){
					uni.showToast({
						title:'请选择商品画廊',
						icon:'none'
					})
					return false
				}
				if(this.multi){
					if(!this.multiProducts.length){
						uni.showToast({
							title:'请添加商品规格',
							icon:'none'
						})
						return false
					}
					
				}else{
					if(this.unitProducts[0].price==''||this.unitProducts[0].number==''){
						uni.showToast({
							title:'请完善规格信息',
							icon:'none'
						})
						return false
					}
					
				}
				
				
				return true
			},
			saveGoods(){
				if(!this.checkdata()) return
				var gallery = []
				this.gallery.forEach(item=>{
					gallery.push(item.url)
				})
				var data = {
					unit:this.unitArray[this.unitIndex],
					counterPrice: parseFloat(this.counterPrice),
					name:this.goodsName,
					brief:this.brief,
					gallery: JSON.stringify(gallery),
					detail:this.detail,
					picUrl:this.picUrl[0].url
				}
				if(this.isOnSale){
					data.isOnSale = 1
				}else{
					data.isOnSale = 0
				}
				if(this.goodsId){      //编辑模式
					storeRequest.edit(data, this.goodsId, app.globalData.token)
					.then(res=>{
						uni.showToast({
							title:'修改成功'
						})
						uni.navigateBack()
					})
					.catch(er=>{
						uni.showToast({
							title:err.data.information,
							icon:'none'
						})
					})
				}else{				//创建模式
					if(this.multi){
						let multiProducts = JSON.parse(JSON.stringify(this.multiProducts));
						multiProducts.forEach(item=>{
							item.specifications = JSON.stringify(item.specifications)
							item.price = parseInt(item.price)
							item.number = parseInt(item.number)
						})
						data.products = multiProducts
					}else{
						let unitProducts = JSON.parse(JSON.stringify(this.unitProducts));
						unitProducts.forEach(item=>{
							item.specifications = JSON.stringify(item.specifications)
							item.price = parseInt(item.price)
							item.number = parseInt(item.number)
						})
						data.products = unitProducts
					}
					storeRequest.create_goods(data, this.topicId, app.globalData.token)
					.then(res=>{
						uni.showToast({
							title:'添加成功'
						})
						uni.navigateBack()
					})
					.catch(err=>{
						uni.showToast({
							title:err.data.information,
							icon:'none'
						})
					})
				}

			}
		},
		
		
	}
</script>

<style>
	page{
		width: 720rpx;
		margin: auto;
	}
.inputItem{
	padding: 0 10rpx;
	background-color: #FFFFFF;
	display: flex;
	 align-items: center;
	 border-bottom: 1px solid #dedede; 
	 font-size: 30rpx;
}
.sttingitem{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 0;
}
.productsItem{
	background-color: #ffffff;
	margin: 10rpx 0;
	position: relative;
	color: #000000;
	padding: 10rpx;
		
}
</style>
