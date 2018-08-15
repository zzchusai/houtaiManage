<template>
	<header>
		<div class="bg-333745 top zoom">
			<div class="logo lf">
				<div class="log-img lf">
					<img src="../../../static/img/logo.png" alt="" />
				</div>
				<div class="corporate lf">杭州锦宣网络科技有限公司</div>
			</div>
			<div class="top-main lf">
				<!--<div class="top-title lf">消息</div>-->
				<div class="quit rt" @click='quit'>退出</div>
				<div class="top-user rt" @click="popupClick($event)">您好，{{name}}
					<div class="popup" style="display: none;">
						<div class="popup-txt">用户名：{{name}}</div>
						<div class="popup-txt" style="margin-bottom: 5px;">账号：{{phone}}</div>
						<div class="popup-btn" @click='amend($event)'>修改密码</div>
						<div class="popup-btn" @click='logout($event)'>注销账号</div>
					</div>
				</div>
			</div>
			<div class="model" v-show="model">
			<div class="model-main">
				<div class="model-del" style="color:#333;">确认注销？</div>
				<div class="model-btn zoom">
					<div class="butn btn-cancel btn-small lf" style="margin-top:5px;" @click="cancel">取消</div>
					<div class="butn btn-main btn-small rt" style="margin-top:5px;" @click="confirm">确定</div>
				</div>
			</div>
			<div class="model-bg"></div>
		</div>
		</div>
	</header>
</template>
<script>
	import Vue from 'vue';
	export default {
	    data() {
            return {
            	name: '',
            	phone: '',
            	popupShow: false,
            	test: true,
            	model: false
            }
       	}, 
        created() {
			this.login();
		},
        methods: {
        	login(){
        		let self = this;
        		if(!localStorage.getItem('access_token')){
        			self.$router.push('/login');
        		}else{
        			self.name = JSON.parse(localStorage.getItem('name'));
        			self.phone = JSON.parse(localStorage.getItem('phone'));
        		}
        	},
			quit() {
				if(!window.navigator.onLine){
					window.location.reload();
					return false;
				}
				localStorage.removeItem('access_token');
				Vue.http.headers.common['AccessToken'] = '';
				this.$router.push('/login');
			},
			popupClick($event) {
				if(!window.navigator.onLine){
					window.location.reload();
					return false;
				}
				$($event.target).children('.popup').show();
				$event.stopPropagation();
			},
			amend($event) {
				let self = this;
				$($event.target).parent().hide();
				self.$router.push('/amendPwd');
			},
			logout($event) {
				$($event.target).parent().hide();
				this.model = true;
			},
			confirm() {
				let self = this;
				if(!window.navigator.onLine){
					window.location.reload();
					return false;
				}
				self.$http.post(self.HOST+'/cancelAccount').then(function(data){
	            	if(data.data.status == 1){
	            		localStorage.removeItem('access_token');
						Vue.http.headers.common['AccessToken'] = '';
	            		self.$router.push('/login');
	            	}else{
						alert(data.data.msg);
	            	}
		        });
			},
			cancel() {
				this.model = false;
			}
        }
	}
</script>
<style scoped>
	.top{color:#fff;}
	.logo{width:18%;border-right:2px solid #333;height:100%;}
	.top-main{width:calc(82% - 60px);padding:0 20px;}
	.top-user{height:40px;line-height:40px;padding-left:30px;background: url(../../../static/img/admin.png) no-repeat center left;background-size: 20px ;padding-right:20px;position:relative;cursor: pointer;}
	.quit{width:70px;text-align:center;cursor: pointer;border-left:2px solid #333;height:40px;line-height:40px;}
	.popup{position: absolute;width:150px;top:70%;left:0;background: #fff;padding:15px 15%;border:1px solid #f1f1f1;background: #fff;z-index: 999;}
	.popup-txt{height:30%;line-height:30px;color:#333;font-size: 14px;}
	.popup-btn{line-height: 36px;cursor: pointer;font-size: 14px;color:#333;border-top:1px solid #f1f1f1;}
	.popup-btn:hover{color:#c19c75}
	@media only screen and (max-width: 5465px){
		.top{height:120px;}
		.top-user,.quit{margin-top: 30px;font-size: 20px;background-size: 24px;}
		.log-img{width:36px;height:100px;margin-top:26px;margin-left:30px;}
		.corporate{height:100px;line-height: 100px;margin-left:20px;font-size:14px;}
	}
	@media only screen and (max-width: 4555px){
		.top{height:120px;}
		.top-user,.quit{margin-top: 30px;font-size: 20px;background-size: 24px;}
		.log-img{width:36px;height:100px;margin-top:26px;margin-left:30px;}
		.corporate{height:100px;line-height: 100px;margin-left:20px;font-size:14px;}
	}
	@media only screen and (max-width: 2740px){
		.top{height:120px;}
		.top-user,.quit{margin-top: 30px;font-size: 20px;background-size: 24px;}
		.log-img{width:36px;height:100px;margin-top:26px;margin-left:30px;}
		.corporate{height:100px;line-height: 100px;margin-left:20px;font-size:14px;}
	}
	@media only screen and (max-width: 2100px){
		.top{height:100px;}
		.top-user,.quit{margin-top: 30px;font-size: 18px;background-size: 22px;}
		.log-img{width:36px;height:48px;margin-top:26px;margin-left:30px;}
		.corporate{height:100px;line-height: 100px;margin-left:20px;font-size:14px;}
	}
	@media only screen and (max-width: 1920px){
		.top{height:100px;}
		.top-user,.quit{margin-top: 30px;font-size: 18px;background-size: 22px;}
		.log-img{width:36px;height:48px;margin-top:26px;margin-left:30px;}
		.corporate{height:100px;line-height: 100px;margin-left:20px;font-size:14px;}
	}
	@media only screen and (max-width: 1600px){
		.top{height:85px;}
		.top-user,.quit{margin-top:17.5px;font-size: 16px;background-size: 20px;}
		.log-img{width:30.6px;height:40.8px;margin-top:22.1px;margin-left:25.5px;}
		.corporate{height:85px;line-height: 85px;margin-left:17px;font-size:14px;}
	}@media only screen and (max-width: 1400px){
		.top{height:70px;}
		.top-user,.quit{margin-top:15px;font-size: 14px;background-size: 18px;}
		.log-img{width:25.2px;height:33.6px;margin-top:18.2px;margin-left:21px;}
		.corporate{height:70px;line-height: 70px;margin-left:14px;font-size:12px;}
	}@media only screen and (max-width: 1200px){
		.top{height:60px;}
		.top-user,.quit{margin-top:10px;font-size: 14px;background-size: 18px;}
		.log-img{width:21.6px;height:28.8px;margin-top:15.6px;margin-left:18px;}
		.corporate{height:60px;line-height: 60px;margin-left:12px;font-size:12px;}
	}@media only screen and (max-width: 1024px){
		.top{height:50px;}
		.top-user,.quit{margin-top:8px;font-size: 14px;background-size: 16px;}
		.log-img{width:21.6px;height:28.8px;margin-top:15.6px;margin-left:18px;}
		.corporate{height:60px;line-height: 60px;margin-left:12px;font-size:12px;}
	}
	@media only screen and (max-width: 600px){
		.top{height:50px;}
		.top-user,.quit{margin-top:8px;font-size: 14px;background-size: 16px;}
		.log-img{width:21.6px;height:28.8px;margin-top:15.6px;margin-left:18px;}
		.corporate{height:60px;line-height: 60px;margin-left:12px;font-size:12px;}
	}
	@media only screen and (max-width: 400px){
		.top{height:50px;}
		.top-user,.quit{margin-top:8px;font-size: 14px;background-size: 16px;}
		.log-img{width:21.6px;height:28.8px;margin-top:15.6px;margin-left:18px;}
		.corporate{height:60px;line-height: 60px;margin-left:12px;font-size:12px;}
	}
</style>
