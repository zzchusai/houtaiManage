<template>
	<div class="login-bg">
		<div class="login-main">
			<div class="login-logo">
				<img src="../../../static/img/login-logo.png" alt="" />
			</div>
			<div class='login-title'>
				<div class="login-txt">用户登录</div>
			</div>
			<div class="login-msg">
				<el-form ref="login" :model="login" :rules="rules" label-width="0">
					<el-form-item prop="username" class="userName">
						<el-input v-model="login.username" class="login-input" type="text" size="large" placeholder="请输入用户手机号"></el-input>
						<span></span>
					</el-form-item>
					<el-form-item prop="password" class="password">
						<el-input v-model="login.password" class="login-input password" type="password" size="large" placeholder="请输入密码" @keyup.enter.native="doLogin"></el-input>
						<span></span>
					</el-form-item>
					<div class="login-btn">
						<el-button class="button" type="primary" @click="submitForm('login')">登录</el-button>
					</div>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
	    data() {
            return {
            	login:{
            		username:'',
            		password:''
            	},
            	rules: {
					username: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				}
            }
        },
        created() {
        	if(window.localStorage.access_token){
        		this.$router.push('/origin');
        	};
        },
        methods: {
        	submitForm(login){//点击登录
        		let self = this;
				if(!window.navigator.onLine){
					window.location.reload();
					return false;
				}
        		this.$refs[login].validate((valid) => {
			        if (valid) {
			        	let data = {
	        				phone:self.login.username,
	        				password:self.login.password
	        			};
	        			self.$http.post(self.HOST+'/login',data).then(function(data){
	        				if(data.data.status == 1){
	        					var data = data.data;
	        					window.localStorage.access_token = JSON.stringify(data.access_token);//缓存唯一票据
	        					window.localStorage.name = JSON.stringify(data.name);//缓存用户姓名
	        					window.localStorage.phone = JSON.stringify(data.phone);//缓存用户姓名
	        					this.$router.push('/origin');
	        				}else{
	        					alert(data.data.msg);
	        				}
	        			});
			        }
				});
        	},
        	doLogin() {
        		this.submitForm('login');
        	}
        }
	}
</script>

<style scoped>
	.login-bg{width:100%;height:100%;background: url(../../../static/img/banner.png) no-repeat;background-size: 100% 100%;}
	.login-main{position:absolute;top:100px;right:calc(50% - 250px);width:500px;padding:20px;background: #fff;border-radius: 10px;}
	.login-logo{width:18.5%;margin:0px auto 30px;}
	.login-title{border-top:1px solid #f1f1f1;position: relative;}
	.login-txt{width:100px;height:40px;line-height: 40px;position: absolute;top:-20px;left:calc(50% - 50px);background: #fff;z-index: 100;text-align: center;}
	.login-msg{width:62%;margin:0 auto;margin-top:30px;}
	.button{width:100%;height:48px;letter-spacing: 4px;color:#fff;background: #c19c75;margin:25px 0 30px;font-size:28px;border-style: none;}
</style>
