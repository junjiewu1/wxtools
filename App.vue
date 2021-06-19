<script>
	import {UserRequest} from "./network/user";
	import {UserInfoRequest} from './network/userInfo'
	import {setApp} from './network/requests'
	const TOKEN = 'token';
	const USERID = "userid";
	const UNIONID = "unionid";
	export default {
		globalData: {
			userId: null,
			userInfo: null,
			token: '',
			isLogin: false,
			initSuccess: true,
			userInfoReadyCallback: null,
			tokenReadyCallback: null,
			unionId: null,
			requestedSub: false
		},
		onLaunch: function(options) {
			console.log("onl option:", options)
			setApp(this)
			const token = uni.getStorageSync(TOKEN)
			const userid = uni.getStorageSync(USERID)
			const unionid = uni.getStorageSync(UNIONID)
			if (!userid || !unionid){
			    this.getUserId(true);
				return 
			    }else{   
					this.globalData.userId = userid;
					this.globalData.unionId = unionid
			    } 
			if (token) {
			      this.checkToken(token);
			      this.getUserInfo();
			    } else {
			      this.weChatLogin();
			    }
		},
		methods: {
			
			getUserId(retry){	
				uni.getProvider({
					service: 'oauth', 
					success:(res)=>{
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: (res)=>{
									// 发送 res.code 到后台换取 openId, sessionKey, unionId
									 UserInfoRequest.getLogin(res.code)
									 .then((res)=>{
										this.globalData.unionId= res.data.unionid
										uni.setStorageSync(UNIONID, res.data.unionid);
										this.globalData.userId = res.data.openid;
										uni.setStorageSync(USERID, res.data.openid);
										this.weChatLogin();
									 })
									 .catch(err=>{
										 if(retry){
											 this.getUserId(false)
										 }
									 })
								},
								fail:(err)=>{
									if(retry){
										this.getUserId(false)
									}
								}
							});
						}
					}
				})
			},
			getUserInfo() {
				
			    UserInfoRequest.getUerInfo(this.globalData.userId, this.globalData.userInfo)
			    .then((res)=>{
			      if(res.data.nickName){
			        this.globalData.userInfo = res.data
					if (this.globalData.userInfoReadyCallback){
			          this.globalData.userInfoReadyCallback(res.data);
					}else{
						
					}
			      }else{
					uni.navigateTo({ 
					  	url:'/pages/login/login'
					})
				  }
			    })
			},
			checkToken(token) {
			    UserRequest.checkToken(token)
			      .then(res => {
			        this.globalData.token = token;
			        this.globalData.isLogin = true;
			        if (this.globalData.tokenReadyCallback) {
			          this.globalData.tokenReadyCallback(token);
			        }
					
			      })
			      .catch(() => {
			        this.weChatLogin();
			      })
			},
			weChatLogin() {
			    var userId = this.globalData.userId;
			    // 登录
				uni.getProvider({
					service: 'oauth', 
					success: (res)=>{
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success:(res)=> {
									// 发送 res.code 到后台换取 openId, sessionKey, unionId
									 UserRequest.userLogin(userId, res.code)
									 .then((res)=>{
										this.globalData.token = res.data.token;
										this.globalData.isLogin = true;
										uni.setStorageSync(TOKEN, this.globalData.token);
										if (this.globalData.tokenReadyCallback) {
										  this.globalData.tokenReadyCallback(res.data.token);
										}
									 }).catch(()=>{
										this.globalData.initSuccess = false;
									 })
								}
							})
						}
					}
				})
				
				uni.getSetting({
				      success: res => {
				        if (res.authSetting['scope.userInfo']) {
				          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
				          this.getUserInfo();
				        } else {
				          uni.authorize({
				            scope: 'scope.userInfo',
				            success() {
				              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
				              this.getUserInfo();
				            }
				          })
				        }
				      }
				})
				
			}
			
		}

	}
</script>

<style>
	page {
			background-color: #F5F6FA;
			margin-bottom: 100rpx;
	},
	.mysection{
		font-size: 26rpx;
		margin: 20rpx 0 20rpx 20rpx;
		color: #565656;
		font-weight: 600;
	}
	.itage{
		background-color: #11A342;
		color: #FFFFFF;
		padding: 2rpx 14rpx;
		font-size: 28rpx;
		font-weight: 550;
		border-radius: 6rpx;
	}
</style>
 