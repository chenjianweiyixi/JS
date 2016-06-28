/**
 * 账户相关控制器
 */
define(['accountModel/AccountModel', //
'commonController/MainController',
'Native',
'pAQuickPayCommonModel/PAShakeTool',
"utils"
], function(AccountModel, //
MainController,Native,ShakeTool,utils) {
    // 引入并继承MainController控制器
    var AccountController = MainController.extend({
        // 模块名
        module : 'account',
        // 控制器名
        name : 'account',
        // actions
        actions : {
            'login'         : 'login',
            'login/:id'		: 'login',
            'login4RYM/:encodeLoginJSON'	: 'login4RYM',
            'loginSuccess'  : 'loginSuccess',
            'loginBindSuccess'  : 'loginBindSuccess',
            'loginBind'     : 'loginBind',
            'OrdinaryLogin' : 'OrdinaryLogin',
            'UsbKeyLogin'   : 'UsbKeyLogin',
            'ksLogin':'validatePassword'
        },
        accountModel : null,
        loginName : null,
        loginView : null,
        /**
         * 用户登录
         */
        login : function() {
            var self = this;
			this.accountModel = new AccountModel();
			//PAWA.CommonTools.delCookies();
            wrapView.setHeader(wrapView.headerView, {
                controller : self,
                isLogin : true, // 是否登陆
                title : {
                    leftBtn : '返回',
                    info : '登录',
                    leftBtnClick : function() {
						PAWA.router.navigate("home/home/index",true);
						PAWA.PAWAModel.shareModels.remove("goWhere");
					},
					rightBtn : '注册',
                    rightBtnClick : function() {
						PAWA.router.navigate("register/Register/index",true);
					}
                }
            });			
			
            require(['commonView/HeaderView', //
            'accountView/LoginView'], function(HeaderView, //
            LoginView) {            	          	
                self.loginView = wrapView.setBody(LoginView, {
                    controller : self
                });
                self.loginView.render();
            });
            PAWA.CommonTools.talkingDataTrackEvent("首页-登录");
        },
        login4RYM : function(encodeLoginJSON){
        	var decodeLoginJSON = decodeURIComponent(encodeLoginJSON);
        	var loginParam = eval('('+decodeLoginJSON+')');
        	loginParam.loginDeviceID = ShakeTool.getDeviceId();
        	var self = this;
        	self.accountModel = new AccountModel();
        	self.accountModel.login4RYM(loginParam, function() {
        	 	//登录成功
        	 	PAWA.PAWAModel.shareModels.add('User_Login_Success',true);
				var userBankType = 	PAWA.PAWAModel.shareModels.get('User_Bank_Type');
				var CFE_INFO = PAWA.PAWAModel.shareModels.get('CFE_INFO');	
				//高级网银安全工具用户 ＋ 纯财富E用户 ＋ （财富E用户＋普通网银用户）＋ （财富E用户＋信用卡用户）+ (纯财富E＋uk用户)
        		if((CFE_INFO&&CFE_INFO.accCfe)||(userBankType&&(userBankType.value == 4)))
        		{
        			var loginData = PAWA.PAWAModel.shareModels.get('Login_Info_Data');        			
        			// 为了支持紧急登录入口  弹otp
        			if(loginData.loginOtpBindFlag&&(loginData.loginOtpBindFlag=="0" || loginData.loginOtpBindFlag=="2")) 
        			{
        				PAWA.router.navigate("account/account/loginBind",true);
        				return;
        			}	
        		}
        		//uk用户提示
        		if(userBankType&&userBankType.value == 3){
        			PAWA.router.navigate("account/account/UsbKeyLogin",true);
        			//self.UsbKeyLogin();
        			return;
        		}
        		//普通网银
        		if(userBankType&&userBankType.value == 2){
        			//self.OrdinaryLogin();
        			PAWA.router.navigate("account/account/OrdinaryLogin",true);
        			return;
        		}
        		//纯信用卡用户及loginData.loginOtpBindFlag=="1" 已绑定本机用户
        		self.loginSuccess();
        	},
        	function(data){
        	 	//登录失败
        	 	PAWA.router.navigate("account/account/login",true);
	       });
        },
        /**
         * 提交登录
         */
        loginSubmit : function(loginData) {
        	//console.log("Web page loginSubmit cookie==="+document.cookie);
            var self = this;
            self.loginName = loginData.userId || loginData.loginName || "";
            //灰化返回按钮
            wrapView.headerView.disableEvent();
            this.accountModel.login(loginData, function() {
            	
            	PAWA.PAWAModel.shareModels.add('User_Login_Success',true);
            	//恢复返回按钮
				wrapView.headerView.enableEvent();
            	//记住用户名
	            try{ 
	            	if(self.loginView.isRemember == true){
	            		Native.saveData({key:'userName',value:self.loginName},function(){},function(){})
	            	}else{
	            		Native.saveData({key:'userName',value:''},function(){},function(){})
	            	}
	            }catch(e){}
				
				var userBankType = 	PAWA.PAWAModel.shareModels.get('User_Bank_Type');
				var CFE_INFO = PAWA.PAWAModel.shareModels.get('CFE_INFO');	
				//高级网银安全工具用户 ＋ 纯财富E用户 ＋ （财富E用户＋普通网银用户）＋ （财富E用户＋信用卡用户）+ (纯财富E＋uk用户)
        		if((CFE_INFO&&CFE_INFO.accCfe)||(userBankType&&(userBankType.value == 4)))
        		{
        			var loginData = PAWA.PAWAModel.shareModels.get('Login_Info_Data');        			
        			// 为了支持紧急登录入口  弹otp
        			if(loginData.loginOtpBindFlag&&(loginData.loginOtpBindFlag=="0" || loginData.loginOtpBindFlag=="2")) 
        			{
        				// 要绑定后才算登入成功？
        				//self.loginBind();
        				PAWA.router.navigate("account/account/loginBind",true);
        				return;
        			}	
        		}
        		
        		//uk用户提示
        		if(userBankType&&userBankType.value == 3){
        			PAWA.router.navigate("account/account/UsbKeyLogin",true);
        			//self.UsbKeyLogin();
        			return;
        		}
        		//普通网银
        		if(userBankType&&userBankType.value == 2){
        			//self.OrdinaryLogin();
        			PAWA.router.navigate("account/account/OrdinaryLogin",true);
        			return;
        		}
        		//纯信用卡用户及loginData.loginOtpBindFlag=="1" 已绑定本机用户
        		self.loginSuccess();
            }, function(data) {
                $("#loginVCodeDiv").show();
                PAWA.PAWAModel.shareModels.add('Login_showVCodeFlag',"1");
            	//恢复返回按钮
				wrapView.headerView.enableEvent();
				self.loginView.changeVCode();
            	 // 102 用户名密码出错 104｜105 验证码过期｜出错
                if( data.errCode==="102" ){
                	wrapView.FlipPrompt.alert({content:data.errMsg},function(){
                		//清空密码
            			self.loginView.clearPassWord();
					});
                }else if( data.errCode==="104" ||
                		  data.errCode==="105"){
                	wrapView.FlipPrompt.alert({content:data.errMsg},function(){
						 //清空验证码
            			self.loginView.clearVCode();
					});
               }else{
               	    //清空密码
            		self.loginView.clearPassWord();
            		//清空验证码
            		self.loginView.clearVCode();
               }
            });
        },
        /**
         * 登录绑定成功
         */
        loginBindSuccess : function(){
        	var userBankType = 	PAWA.PAWAModel.shareModels.get('User_Bank_Type');
    	    //uk用户提示
    		if(userBankType&&userBankType.value == 3){
    			PAWA.router.navigate("account/account/UsbKeyLogin",true);
    			return;
    		}
    		//普通网银
    		if(userBankType&&userBankType.value == 2){
    			PAWA.router.navigate("account/account/OrdinaryLogin",true);
    			return;
    		}
    		//其他用户
    		this.loginSuccess();
        },
        /**
         * 登录成功
         */
        loginSuccess : function() {
        	var loginOptions = null;
    		var loginInfo = PAWA.PAWAModel.shareModels.get('Login_Info_Data');
    		var userVerifyData = PAWA.PAWAModel.shareModels.get('User_Verify_Data');
			//var wanlitongPoint = PAWA.PAWAModel.shareModels.get('User_Wanlitong_Point');
			var userBankType = PAWA.PAWAModel.shareModels.get('User_Bank_Type');
			//var msgNum = PAWA.PAWAModel.shareModels.get('Notice_Center_Num');
			//console.log("msgNum==========="+msgNum);
			var userInfo = PAWA.PAWAModel.shareModels.get('User_Info_Data');
			var tmpUserInfo = null;
			if( loginInfo.userType == '0' ){
				// 纯信用卡用户
				tmpUserInfo = {
					userType : '0',
					loginName : this.loginName||"",
					username : loginInfo.cnName||"",
					partyNo : loginInfo.toaPartyNo||"",
					lastLogonSuccessDate : loginInfo.lastLogonSuccessDateStr||""
				};
			}else{
				tmpUserInfo = {
					userType : loginInfo.userType||"",
					loginName : this.loginName||"",
					username : loginInfo.username||"", 
					partyNo : loginInfo.toaPartyNo||"",
					lastLogonSuccessDate : loginInfo.lastLogonSuccessDateStr||""
				};
			}

			//调用Native的登录处理方法
			var loginOptions = {
				appconfig : {
     				clientHost : ''//客户端管理平台URL
				},
               	noticeInfo: {
     				num : 0 //通知条数
				},
				loginInfo : loginInfo, //用户登录信息
				userInfo : tmpUserInfo, //客户信息（非纯信用卡用户）
				userVerifyData : userVerifyData, //客户预留验证信息
				userBankType : userBankType //用户类型
			};
            if(wrapView.device != ''){
				Native.login(loginOptions);
			}
			//采集登录成功时候的用户名和用户类型
			var desLoginName = PAWA.CommonTools.desEncode(this.loginName);
			var userCardType = PAWA.PAWAModel.shareModels.get('User_Card_Type')||"";
			Native.talkingDataCollectUser({userID:desLoginName,userType:userCardType});
			PAWA.CommonTools.talkingDataTrackEvent("首页-登录成功页");
			
			Native.isFirstSetGesturePwd(function(data){
				// 注意：isFirstSetGesturePwd返回“有值”说明是没有手势密码设置信息
				if(data) return;
				
				// 有手势密码设置信息 且是安全中心的“安全退出”退出登录
				Native.getData('safeLoginOut',function(flag){
					if(flag != 1) return;
					
					Native.saveGestureLoginOpenFlag(true, function(){}); 
					Native.saveData({key:'safeLoginOut',value:'0'}, function(){});
				});
			});
			
			this.bindNoticeCenter();
        },
        goSuccessView : function(){
            var isSubmit = false;
			var isRecommend  = PAWA.PAWAModel.shareModels.get("isRecommend"),
				isfirstLogon =  PAWA.PAWAModel.shareModels.get("firstLogonFlag")== "0";
			if(isRecommend&&isfirstLogon){
           		wrapView.FlipPrompt.confirm({
           		    title:'欢迎',
           		    content:'<i style="text">您好，欢迎登录平安口袋银行</i><input placeholder="请输入推荐码" id="comfirmInfo" class="input_recommend" style="margin-top:8px" type="text"><span id="comfirmMsg" class="wordbreak m_t6 lh22 tal f_c_dd5522" style="display:none;"></span>',
           		    FBntConfirmColor:"pop_btn_grey",
           		    FBntCancelColor:"pop_btn_orange",
           		    FBntconfirm:"跳过",
           		    FBntcancel:"确定",
           		    recommendCode:true
           		  },
           		function(){
           			goHome();
           		},
           		function(){
           			var val = $.trim($("#comfirmInfo").val()); 
           			if( val!= ""){
						$("#comfirmInfo").attr("disabled","disabled");
						var $submitBtn = $(".pop1_btn [action=FBntcancel]");
						$submitBtn.removeClass("pop_btn_orange").addClass("pop_btn_disabled");
                         //防重复提交  
                        if(!isSubmit){
                            isSubmit= true;
                                PAWA.Request("saveRecommend",{
                                    cancelLightbox : true,
                                    data : {"recommendCode" : val},
                                    success : function(response){
                                        isSubmit = false;
                                        if(response.errCode == "000"){
                                            goHome();
                                        }else{
                                            $("#comfirmMsg").css({"display":"table"});
                                            $("#comfirmMsg").html(response.errMsg);             
                                        }
                                        $("#comfirmInfo").removeAttr("disabled");
                                        $submitBtn.removeClass("pop_btn_disabled").addClass("pop_btn_orange");
                                    },
                                    error : function(){
                                        isSubmit = false;
                                        goHome();
                                        $("#comfirmInfo").removeAttr("disabled");
                                        $submitBtn.removeClass("pop_btn_disabled").addClass("pop_btn_orange");
                                    }                               
                                }); 
                           } 
           			}
           			else{
           				$("#comfirmMsg").css({"display":"table"});
           				$("#comfirmMsg").html("推荐码不能为空！");
           			}
           		});
				return;
			}  
			goHome();
			//显示黄金活动广告
			/* 
			var Notice_Switch =  utils.getAppConfig("Notice_Switch", {});
			if(Notice_Switch == 'true' ){
				PAWA.Request("qryFirstLoginIsNotice",{
					cancelLightbox:true,
					success: function(response){
						if (response.errCode == '000' && response.responseBody.isShow == '1' ){
							Native.showNotice(response.responseBody.activitySubject);
						} 
					}
				})
			} 
			*/
			Native.getAppConfig(function(data)
			{
				var switchFlag = data.Application.Notice_Switch;
				if (switchFlag == "true" ){
					PAWA.Request("qryFirstLoginIsNotice",{
						cancelLightbox:true,
						success: function(response){
							if (response.errCode == '000' && response.responseBody.isShow == '1' ){
								Native.showNotice(response.responseBody.activitySubject);
							} 
						}
					});
				}
 
			},function(){});
			var that = this;
			function goHome(){
	        	var _shareModels_ = PAWA.PAWAModel.shareModels,
	        		goWhere = _shareModels_.get('goWhere'),
	        		loginOtpBindFlag = _shareModels_.get("Login_Info_Data").loginOtpBindFlag,
	        		rightNow = _shareModels_.get('rightNow');
	        		
				// 注意：在功能内部登录，点击了立即开始手势登录并且绑定设备，登录成功后需要设置手势密码
            	if(rightNow == '1' && loginOtpBindFlag == '1') {
            		goWhere && _shareModels_.add('rightNow', '2');
					PAWA.router.navigate('#/saveCenter/loginPassModify/gesturePassModify/index',true);   	 	
            	}
            	//跳转到目标页面
            	else if(goWhere){    
					PAWA.router.navigate(goWhere,true);
	            }else{
	                wrapView.goHome();
	            }
	            // PAWA.CommonTools.getTxtNotification();
	            
                if(window.NATIVE_APP_VERSION>="2.5.6"){
                    setTimeout(function(){
                        that.request("qryCreditCardPromotion",function(res){
                            if(res.market_plan==="A"&&res.popup_state=="1"){
                                PAWA.CommonTools.talkingDataTrackEvent("首页-信用卡营销弹窗");
                                Native.PromotionBombBox(function(response){
                                    var box_response = response.toLowerCase();
                                    if(box_response=="left"){
                                        PAWA.CommonTools.talkingDataTrackEvent("首页-信用卡营销弹窗_不再提示");
                                        that.request("noPromotionCreditCard");
                                    }else{
                                        PAWA.CommonTools.talkingDataTrackEvent("首页-信用卡营销弹窗_去申请");
                                        Native.openThirtyWebView ({
                                            title: "白金信用卡申请",
                                            isShowHerder: true,
                                            url:utils.getAppConfig("Common_URL", {})["BouncedWhiteGoldCreditUrl"]
                                        });
                                    }
                                })
                            }
                        });
                    },1000);
                }
			}      	
        },
        request : function(url,callback){
                var success = callback||function(){};
                PAWA.Request(url, {
                    type: 'POST',
                    success: function(response) {
                        if (response.ret_code === '000000') {
                            var body = response.response_body;
                            success(body);
                        }
                    },
                    error: function(){}
                });
        },
        loginBind : function(){
        	var self = this;
        	var model = this.accountModel;

			wrapView.setHeader(wrapView.headerView, {
                controller : self,
                isLogin : true, // 是否登陆
                title : {
                    leftBtn : '返回',
                    info : '安全验证',
                    leftBtnClick : function() {
						PAWA.CommonTools.logout(true);
					}
                }
            });

            require(['commonView/HeaderView', //
            'accountView/LoginBindView'], function(HeaderView, //
            LoginBindView) {				       
                var body = wrapView.setBody(LoginBindView, {
                    controller : self,
                    model : model
                });
                body.render();
                body.initOtpServer();
            });
            PAWA.CommonTools.talkingDataTrackEvent("首页-OTP登录");
        },
        
        /**
        * 跳转到用户注册页 
        */
        toRegister : function() {
            PAWA.router.navigate('register/Register/index', true);
        },
        OrdinaryLogin : function(){
        	var self = this;
        	
            wrapView.setHeader(wrapView.headerView, {
                title : {
                    leftBtn : '返回',
                    info : '安全验证',
                    leftBtnClick : function(){
                    	PAWA.CommonTools.logout(true);
                    }
                }
            });        	
            require(['commonView/HeaderView', //
            'accountView/OrdinaryLoginView'], function(HeaderView, //
            OrdinaryLoginView) {

                var body = wrapView.setBody(OrdinaryLoginView,{
                	controller : self
                });
                body.render();
            });
            PAWA.CommonTools.talkingDataTrackEvent("首页-普通网银客户登录");
        },
        UsbKeyLogin : function(){
        	var self = this;
            require(['commonView/HeaderView', //
            'accountView/UsbKeyLoginView'], function(HeaderView, //d
            UsbKeyLoginView) {
                wrapView.setHeader(wrapView.headerView, {
                    title : {
                        leftBtn : '返回',
                        info : '安全验证',
                        leftBtnClick : function(){
                        	PAWA.CommonTools.logout(true);
                        }
                    }
                });

                var body = wrapView.setBody(UsbKeyLoginView,{
                	controller : self
                });
                body.render();
            });
            PAWA.CommonTools.talkingDataTrackEvent("首页-UKEY客户登录");
        },
        updateNoticeNum:function(){
        	var noticeNum = PAWA.PAWAModel.shareModels.get('Notice_Center_Num');
        	Native.setNoticeNum(noticeNum||"0");
        },
 //通知中心绑定检测
        // this.bindNoticeCenter();
		bindNoticeCenter: function() {
            var self = this;
            var deviceId = self.getDeviceId();
            if(wrapView.device==""){
            	var loginInfoData = PAWA.PAWAModel.shareModels.get('Login_Info_Data');
                var bindFlag = loginInfoData.noticeBindFlag||'';
                self.canPush(bindFlag);            	
            }else{
            	this.isShowPushAlert(function(isShow){
	                if (isShow){
	                    var loginInfoData = PAWA.PAWAModel.shareModels.get('Login_Info_Data');
	                    var bindFlag = loginInfoData.noticeBindFlag||'';
	                    self.canPush(bindFlag);
	                } else {
	                	self.goSuccessView();
	                	self.accountModel.qryNoticeCenterList(deviceId,self.updateNoticeNum);
	                }
           		 });
            }
        },
		
        isShowPushAlert:function(callback){
            console.log("check is show push alert 1")
            var bankUserName = this.loginName;

            Native.getData('loginHistoryList', function(data){
                if (!data || data == undefined){
                    //console.log('getData : data null');
                    callback(true);
                    return;
                }
                var obj =  JSON.parse(data);
                var isExist = _.contains(_.keys(obj), bankUserName);
                console.log(obj);
                if (isExist) {
                   // console.log('getData : exist ');
                    callback(false);
                }
                else {
                   // console.log('getData : none');
                    callback(true);
                }
            }, function(){
                //console.log('getData : error');
                callback(false);
            });
        },

        saveBlackList:function(callback){
            //console.log('saveBlackList:');
            var self = this;
            
            if(wrapView.device==""){
            	callback();
            } else {
            var bankUserName = this.loginName;
	            console.log(bankUserName);
	
	            var list = {};
	            Native.getData('loginHistoryList', function(data){
                    var obj;
                    try{
                        obj =  JSON.parse(data);
                    } catch(e) {
                        obj = {};
                    }

                    if(obj != null && typeof obj != "object") obj = {};
                    if(obj == null) obj = {};
	                
	                console.log(typeof(obj));

                    list = obj;

	                list[bankUserName] = 1;

	                var myJSONText = JSON.stringify(list);

	                var dataPair = {
	                    key : 'loginHistoryList',
	                    value : myJSONText
	                }
	              
	                Native.saveData(dataPair, callback, callback);
	
	            }, callback);
            }
        },

        getDeviceType: function() {
            var ua = navigator.userAgent.toLowerCase(), //
                android = ua.indexOf('android') != -1, //
                iphone = ua.indexOf('iphone os') != -1,
                ipad = ua.indexOf('ipad os') != -1;

            var deviceType;
            if (android) {
                deviceType = "android";
            } else if (iphone) {
                deviceType = "iphone";
            } else if (ipad) {
                deviceType = "ipad";
            } else {
                deviceType = "unknow";
            }
            console.log("deviceType");
            console.log(deviceType);

            return deviceType;
        },
        getDeviceId: function() {
			var reDeviceId = PAWA.PAWAModel.shareModels.get('Bank_Device_Id')||"";
			if( reDeviceId.length==0 ){
				Native.getDeviceId(function(deviceId){
					PAWA.PAWAModel.shareModels.add('Bank_Device_Id',(deviceId||""));
					return deviceId||"";
				});
			}else{
				return reDeviceId;
			}
        },

        getTokenId: function(callback) {
            require(['Native'], function() {
                Native.getDeviceToken(function(tokenId) {
                    console.log(tokenId);
                    if (tokenId){
                    	callback(tokenId);
                    }else{
                    	callback();
                    }
                }, function() {
                    console.log("tokenId------------fail");
                    callback();
                });
            });
        },

        canPush: function(bindFlag) {  
            PAWA.PAWAModel.shareModels.add('noticeCenter/bindFlag', false);
            var deviceId = this.getDeviceId();
            var self = this;            
            if (bindFlag != "1") {
            	wrapView.headerView.disableEvent();
                //var content = (bindFlag == "0") ? "您是否同意平安银行手机网银向该推送通知？" : "登录成功，已绑定其他设备";
                var content = "您是否同意平安银行手机网银向该手机推送通知？";
                wrapView.FlipPrompt.confirm({
                    title: "温馨提示",
                    content: content,
                    FBntconfirm: "拒绝",
                    FBntcancel: "同意",
                    FBntConfirmColor: "pop_btn_grey",
                    FBntCancelColor: "pop_btn_orange"
                }, function() {
            		setTimeout(function(){
            			self.goSuccessView();
            		},200)
                    self.saveBlackList(function(){
                        self.accountModel.qryNoticeCenterList(deviceId,self.updateNoticeNum);
                    });
                    wrapView.headerView.enableEvent();
                }, function() {
                    var deviceType = self.getDeviceType();
                    var tokenId = "";
             		setTimeout(function(){
            			self.goSuccessView();
            		},200)
                    wrapView.headerView.enableEvent();
                    if (deviceType == "iphone" || deviceType == "ipad") {
                        self.getTokenId(function(id, error) {
                            if (id) {
                                console.log(id);
                                tokenId = id;
                                self.requestNoticeBind(deviceType, deviceId, "1", tokenId, function(){
                                	self.accountModel.qryNoticeCenterList(deviceId,self.updateNoticeNum);
                                });
                            } else {
                            	self.accountModel.qryNoticeCenterList(deviceId,self.updateNoticeNum);
                            }                            
                        });
                    }
                    else {
                        self.requestNoticeBind(deviceType, deviceId, "1", tokenId, function(){
                            self.accountModel.qryNoticeCenterList(deviceId,self.updateNoticeNum);
                        });
                    }
                });
            }else{
         		setTimeout(function(){
        			self.goSuccessView();
        		},30);
                PAWA.PAWAModel.shareModels.add('noticeCenter/bindFlag', true);
                self.accountModel.qryNoticeCenterList(deviceId,self.updateNoticeNum);
            }
        },

        /*
        ///通知中心绑定
        ///ibp/toaMobile/iphone/noticeBind.do
        输入
        channelType     String 1    N 渠道标识见公共字段定义
        deviceId        String      Y 设备ID
        bindFlag        String      Y 绑定标志 1:绑定 2:解除绑定
        tokenId         String      N IOS推送通知ID  IOS必须上送
        */
        requestNoticeBind: function(deviceType, deviceId, bindFlag, tokenId ,callback) {
            console.log("接受推送绑定 requestNoticeBind start");
			var self = this;
            var params = {};
            params.deviceId = deviceId;
            params.bindFlag = bindFlag;
            if (deviceType == "iphone" || deviceType == "ipad") {
                params.tokenId = tokenId;
            }
            console.log(params);

            PAWA.Request("noticeBind", {
            	cancelLightbox:true,
                data: params,
                success: _.bind(function(data) {
                    console.log('接受推送绑定:');
                    console.log(data);
                    if (data.errCode == "000") {
                        PAWA.PAWAModel.shareModels.add('noticeCenter/bindFlag', true);
                        console.log("接受推送绑定 success");
                    } else {
                        console.log("接受推送绑定 fail");
                    }
                    callback();
                }, self),
                error: function(data) {
                    console.log("接受推送绑定 fail");
                    callback();
                }
            });
        },
        // 密码验证
        validatePassword:function()
        {
            var self=this;
            wrapView.setHeader(wrapView.headerView, {
                controller : self,
                isLogin : true, // 是否登陆
                title : {
                    leftBtn : '返回',
                    info : '密码校验',
                    leftBtnClick : function() {
                          wrapView.goHome();
                    }
                }
            });         
            
            require(["app/modules/account/view/KsLoginView"],function(ksLoginView){
                if(wrapView.bodyView&&wrapView.bodyView instanceof ksLoginView)
                {
                   wrapView.bodyView.destroy();
                   wrapView.bodyView = null;
                }
                wrapView.setBody(ksLoginView,{
                    templateType:2,
                    onLoginSuccess: function () {
                           var navUrl=PAWA.PAWAModel.shareModels.get('goWhere');   
                           if(navUrl&&navUrl.indexOf("account/account/login")!=0)
                           {
                                PAWA.router.navigate(navUrl,true);
                           }else
                           {
                               wrapView.goHome();
                           }
                    },
                    onCancel: function () {
                          wrapView.goHome();
                    }
                });
            });
            
        }
            
    });
    return AccountController;
});
