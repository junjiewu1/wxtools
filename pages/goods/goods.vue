<template>
	<view id="good">
		<swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
		    <swiper-item v-for="(item, index) in goods.gallery" :key="index">
		      <image :src="item" background-size="cover"></image>
		    </swiper-item>
		  </swiper>
		   <view class="goods-info">
			   <view class="price">
				   <view class="retailPrice">￥{{checkedSpecPrice}}</view>
			       <view class="counterPrice">￥{{goods.counterPrice}}</view>
			   </view>
			   <view class='goods_name'>{{goods.name}}</view>
		        <text class="desc">{{goods.brief}}</text>
				<view  style="display: flex; align-items: center;justify-content: space-between; border-top: 1rpx solid #eaeaea; margin: 10rpx 0;box-sizing: border-box;padding: 20rpx 0;padding-bottom: 0rpx;" @click="()=>{this.openAttr = true}">
				    <view class="t">{{checkedSpecText}}</view>
				    <image src="../../static/image/more.png" style="width: 40rpx; height: 40rpx;"></image>
				</view>
		   </view>
		   <view class="comments" v-if="comment.count">
		       <view class="h">
		         <navigator :url="'/pages/comment/comment?type=0&valueId='+goods.id">
		           <text class="t">评价({{comment.count > 999 ? '999+' : comment.count}})</text>
		           <view class="i">
		             查看全部
		             <van-icon name="arrow" />
		           </view>
		         </navigator>
		       </view>
		       <view class="b">
		         <view class="item" v-for="(item,index) in comment.data" :key="index">
		           <view class="info">
		             <view class="user">
		               <image :src="item.avatar"></image>
		               <text>{{item.nickname}}</text>
		             </view>
		             <view class="time">{{item.addTime}}</view>
		           </view>
		           <view class="content">
		             {{item.content}}
		           </view>
		           <view class="imgs" v-if="item.picList.length">
		             <image class="img" v-for="(iitem,iindex) in item.picList" :key="iindex"  :src="iitem"></image>
		           </view>
		           <view class="customer-service" v-if="item.adminContent">
		             <text class="u">商家回复：</text>
		             <text class="c">{{item.adminContent}}</text>
		           </view>
		         </view>
		       </view>
		     </view>
			   
		<!-- 规格选择界面 -->
		<view class="attr-pop-box" v-show="openAttr">
		  <view class="attr-pop">
		    <view class="close" @click="()=>{this.openAttr = false}">
		      <van-icon  class="icon" name="cross"/>      
		    </view>
		    <view class="img-info">
		      <image class="img" :src="tmpPicUrl"></image>
		      <view class="info">
		        <view class="c">
		          <view class="p">价格：￥{{checkedSpecPrice}}</view>
		          <view class="a">{{tmpSpecText}}</view>
		        </view>
		      </view>
		    </view>
		
		    <!-- 规格列表 -->
		      <view class="spec-item" v-for="(item,index) in specificationList" :key="index">
		        <view class="name">{{item.name}}</view>
		        <view class="values">
		          <view :class="{selected:vitem.checked}" class="value" @click="clickSkuValue(vitem)" v-for="(vitem,vindex) in item.valueList" :key="vindex" >{{vitem.value}}</view>
		        </view>
		      </view>
		      <!-- 数量 -->
		      <view class="number-item">
		        <view class="name">数量</view>
		        <view class="selnum">
		          <view class="cut" @click="cutNumber">-</view>
		          <input :value="number" class="number" disabled="true" type="number" />
		          <view class="add" @click="addNumber">+</view>
		        </view>
		      </view>
		
		    </view>
		  </view>
		 <view class="bottomBar">
			 <view class="c" @click="addFast" v-if="!soldout">立即购买</view>
			 <view class="n" v-else>商品已售空</view>
		 </view>
			
		</view>
	</view>
</template>

<script>
	import {postsRequest} from "../../network/posts.js";
	import {storeRequest} from "../../network/store.js";
	import vanIcon from '../../wxcomponents/vant/icon'
	const app = getApp()
	export default {
		data() {
			return {
				goodId:null,
				goods:{},
				attribute:[],
				checkedSpecText: '',
				tmpSpecText:null,
				checkedSpecPrice: 0,
				issueList: [],
				comment: [],
				brand: {},
				specificationList: [],
				productList: [],
				userHasCollect: null,
				shareImage: null,
				checkedSpecPrice: null,
				groupon: null,	
				canShare: null,	
				tmpPicUrl: null,
				openAttr: false,
				number:1,
				soldout: false,

			}
		},
		components:{
			vanIcon
		},
		onLoad(options) {
			this.goodId = parseInt(options.id) 
			this.get_goods()
		},
		methods: {
			get_goods(){
				storeRequest.get_goods(this.goodId,app.globalData.token)
				.then(res=>{
					console.log(res	)
					var data = res.data.data
					let _specificationList = data.specificationList;
					let _tmpPicUrl = data.productList[0].url;
					if (_specificationList.length == 1) {
					  if (_specificationList[0].valueList.length == 1) {
					    _specificationList[0].valueList[0].checked = true
								 
					    // 如果仅仅存在一种货品，那么商品价格应该和货品价格一致
					    // 这里检测一下
					    let _productPrice = data.productList[0].price;
					    let _goodsPrice = data.info.retailPrice;
					    if (_productPrice != _goodsPrice) {
					      console.error('商品数量价格和货品不一致');
					    }
					      this.checkedSpecText = _specificationList[0].valueList[0].value
					      this.tmpSpecText = '已选择：' + _specificationList[0].valueList[0].value
					  }
					}
					this.goods = data.info,
					this.attribute = data.attribute
					this.issueList = data.issue,
					this.comment = data.comment,
					this.brand = data.brand,
					this.specificationList = data.specificationList,
					this.productList = data.productList,
					this.userHasCollect = data.userHasCollect,
					this.shareImage = data.shareImage,
					this.checkedSpecPrice = data.info.retailPrice,
					this.groupon = data.groupon,
					this.canShare = data.share,
					//选择规格时，默认展示第一张图片
					this.tmpPicUrl = _tmpPicUrl
					console.log(this.$data)
				})
			},
			 // 规格选择
			  clickSkuValue(event) {
				  console.log(event, 'event')
			    let specName = event.specification;
			    let specValueId = event.id;
			
			    //判断是否可以点击
			
			    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
			    let _specificationList = this.specificationList;
			    for (let i = 0; i < _specificationList.length; i++) {
			      if (_specificationList[i].name === specName) {
			        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
			          if (_specificationList[i].valueList[j].id == specValueId) {
			            //如果已经选中，则反选
			            if (_specificationList[i].valueList[j].checked) {
			              _specificationList[i].valueList[j].checked = false;
			            } else {
			              _specificationList[i].valueList[j].checked = true;
			            }
			          } else {
			            _specificationList[i].valueList[j].checked = false;
			          }
			        }
			      }
			    }
			      this.specificationList = _specificationList,
			    //重新计算spec改变后的信息
			    this.changeSpecInfo();
			
			    //重新计算哪些值不可以点击
			  },
			
			  // 规格改变时，重新计算价格及显示信息
			  changeSpecInfo() {
			    let checkedNameValue = this.getCheckedSpecValue();
			
			    //设置选择的信息
			    let checkedValue = checkedNameValue.filter(function(v) {
			      if (v.valueId != 0) {
			        return true;
			      } else {
			        return false;
			      }
			    }).map(function(v) {
			      return v.valueText;
			    });
			    if (checkedValue.length > 0) {
			        this.tmpSpecText = checkedValue.join('　')
			    } else {
			        this.tmpSpecText = '请选择规格数量'
			    }
			
			    if (this.isCheckedAllSpec()) {
			        this.checkedSpecText = this.tmpSpecText
			      // 规格所对应的货品选择以后
			      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
			      if (!checkedProductArray || checkedProductArray.length <= 0) {
			      
			          this.soldout = true
			     
			        console.error('规格所对应货品不存在');
			        return;
			      }
			
			      let checkedProduct = checkedProductArray[0];
			      //console.log("checkedProduct: "+checkedProduct.url);
			      if (checkedProduct.number > 0) {
			          this.checkedSpecPrice = checkedProduct.price,
			          this.tmpPicUrl = checkedProduct.url,
			          this.soldout = false
			      } else {
			       
			          this.checkedSpecPrice = this.goods.retailPrice,
			          this.soldout = true
			       
			      }
			
			    } else {
		
			        this.checkedSpecText = '规格数量选择'
			         this.checkedSpecPrice = this.goods.retailPrice
			         this.soldout = false
			    }
			
			  },
			  //获取选中的规格信息
			    getCheckedSpecValue() {
			      let checkedValues = [];
			      let _specificationList = this.specificationList;
			      for (let i = 0; i < _specificationList.length; i++) {
			        let _checkedObj = {
			          name: _specificationList[i].name,
			          valueId: 0,
			          valueText: ''
			        };
			        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
			          if (_specificationList[i].valueList[j].checked) {
			            _checkedObj.valueId = _specificationList[i].valueList[j].id;
			            _checkedObj.valueText = _specificationList[i].valueList[j].value;
			          }
			        }
			        checkedValues.push(_checkedObj);
			      }
			  
			      return checkedValues;
			    },
			  
			    //判断规格是否选择完整
			    isCheckedAllSpec() {
			      return !this.getCheckedSpecValue().some(function(v) {
			        if (v.valueId == 0) {
			          return true;
			        }
			      });
			    },
			getCheckedSpecKey() {
			    let checkedValue = this.getCheckedSpecValue().map(function(v) {
			      return v.valueText;
			    });
			    return checkedValue;
			  },
			  // 获取选中的产品（根据规格）
			  getCheckedProductItem(key) {
			    return this.productList.filter(function(v) {
			      if (v.specifications.toString() == key.toString()) {
			        return true;
			      } else {
			        return false;
			      }
			    });
			  },
			  cutNumber() {
			        this.number = (this.number - 1 > 1) ? this.number - 1 : 1
			    },
			 addNumber() {
			       this.number++
			   },
			   //立即购买（先自动加入购物车）
			   addFast() {
			     if (!this.openAttr) {
			       //打开规格选择窗口
			         this.openAttr = true
			     } else {
			       //提示选择完整规格
			       if (!this.isCheckedAllSpec()) {
			         uni.showToast({
			         	title:'请选择完整规格',
						icon:'none'
			         })
			         return false;
			       }
			
			       //根据选中的规格，判断是否有对应的sku信息
			       let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
			       if (!checkedProductArray || checkedProductArray.length <= 0) {
			         //找不到对应的product信息，提示没有库存
					 uni.showToast({
					 	title:'没有库存',
					 	icon:'none'
					 })
			         return false;
			       }
			 
			       let checkedProduct = checkedProductArray[0];
			       //验证库存
			       if (checkedProduct.number <= 0) {
			         uni.showToast({
			         	title:'没有库存',
			         	icon:'none'
			         })
			         return false;
			       }
						console.log('立即购买')
						storeRequest.fastadd({
			           goodsId: this.goods.id,
			           number: this.number,
			           productId: checkedProduct.id
			         },app.globalData.token)
					 .then(res=>{
						 console.log('成功',res)
					 })
					}
			},
		}
	}
</script>

<style>
.goodsimgs {
  width: 750rpx;
  height: 750rpx;
}

.goodsimgs image {
  width: 750rpx;
  height: 750rpx;
}
.goods-info {
  width: 720rpx;
  background: #fff;
  margin: 20rpx auto;
  border-radius: 14rpx;
  box-sizing: border-box;
  padding: 20rpx;
  
}
.goods-info .desc {
  font-size: 24rpx;
  color: #999;
}
.goods_name {
  font-weight: 550;
  line-height: 56rpx;
  font-size: 36rpx;
  letter-spacing: 1rpx;
}
.goods-info .price {
  display: flex;
  align-items: center;
  
}
.goods-info .retailPrice {
  font-size: 40rpx;
  color: #ff0000;
  font-weight: 600;
}

.goods-info .counterPrice {
  float: left;
  font-size: 30rpx;
  margin-left: 10rpx;
  text-decoration: line-through;
  color: #ff0000;
}
.t {
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
}
.attr-pop-box {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 8;
  bottom: 0;
  /* display: none; */
}
.attr-pop {
  width: 100%;
  padding: 30rpx;
  background: #fff;
  position: fixed;
  z-index: 9;
  bottom: 120rpx;
  box-sizing: border-box;
}

.attr-pop .close {
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  right: 31.25rpx;
  overflow: hidden;
  top: 31.25rpx;
}

.attr-pop .close .icon {
  width: 48rpx;
  height: 48rpx;
}

.attr-pop .img-info {
  width: 687.5rpx;
  height: 177rpx;
  overflow: hidden;
  margin-bottom: 41.5rpx;
}

.attr-pop .img {
  float: left;
  height: 177rpx;
  width: 177rpx;
  background: #f4f4f4;
  margin-right: 31.25rpx;
}

.attr-pop .info {
  float: left;
  height: 177rpx;
  display: flex;
  align-items: center;
}

.attr-pop .p {
  font-size: 33rpx;
  color: #333;
  height: 33rpx;
  line-height: 33rpx;
  margin-bottom: 10rpx;
}

.attr-pop .a {
  font-size: 29rpx;
  color: #333;
  height: 40rpx;
  line-height: 40rpx;
}

 .name {
  margin-bottom: 6rpx;
  font-size: 29rpx;
  color: #333;
}

.values {
  height: auto;
  margin-bottom: 10rpx;
  font-size: 0;
}

 .value {
  display: inline-block;
  height: 62rpx;
  padding: 0 35rpx;
  line-height: 56rpx;
  text-align: center;
  margin-right: 25rpx;
  margin-bottom: 16.5rpx;
  border: 1px solid #333;
  font-size: 25rpx;
  color: #333;
}

.value.disable {
  border: 1px solid #ccc;
  color: #ccc;
}

 .value.selected {
  border: 1px solid #b4282d;
  color: #b4282d;
}
.number-item .selnum {
  width: 322rpx;
  height: 71rpx;
  border: 1px solid #ccc;
  display: flex;
}

.number-item .cut {
  width: 93.75rpx;
  height: 100%;
  text-align: center;
  line-height: 65rpx;
}

.number-item .number {
  flex: 1;
  height: 100%;
  text-align: center;
  line-height: 68.75rpx;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  float: left;
}

.number-item .add {
  width: 93.75rpx;
  height: 100%;
  text-align: center;
  line-height: 65rpx;
}
.bottomBar{
	position: fixed;
	  left: 0;
	  bottom: 20rpx;
	  z-index: 10;
	  width: 750rpx;
	  height: 100rpx;
	  background: #fff;
	  text-align: center;	
}
.bottomBar .c{
	background-color: #b4282d;
	width: 750rpx;
	line-height: 100rpx;
	color: #FFFFFF ;
	padding-bottom: 20rpx;

}
.bottomBar .n{
		width: 750rpx;
	  background-color: #d5d8d8e7;
	  line-height: 100rpx;
	  color: rgb(37, 36, 36);
	padding-bottom: 20rpx;

}
</style>
