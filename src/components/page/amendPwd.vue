<template>
	<div class="amendPwd main">
		<div class="amendPwd-top main-top zoom">
			<div class="amendPwd-title lf">修改密码</div>
		</div>
		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<div class="addsset-main">
					<el-form ref="addMsg" :model="addMsg" :rules="rules" label-width="130px">
						<el-form-item label="当前密码：" prop="pwd">
							<el-input v-model="addMsg.pwd" size="nomal" type="password" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="新密码：" prop='newPwd'>
							<el-input v-model="addMsg.newPwd" id='new' type="password" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="确认密码：" prop='affirmPwd'>
							<el-input v-model="addMsg.affirmPwd" type="password" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<div class="addStaff-btn zoom">
							<el-button class="btn-main button" type="primary" @click="addForm('addMsg')">提交</el-button>
						</div>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	var Toast={
	    elem:document.querySelector("#toast"),
	    timer:"",
	    makeText:function(info,time){
	        this.show();
	        this.elem.innerHTML=info;
	        this.elem.style.marginLeft=-1*(this.elem.clientWidth/2)+"px";
	        this.timer=setTimeout(this.hide.bind(this), time||1000);
	    },
	    show:function(){
	        if(this.elem==null){
	            var node=document.createElement("div");
	            node.setAttribute("id", "toast");
	            node.className="toast";
	            document.body.appendChild(node);
	            this.elem=document.querySelector("#toast");
	        }
	        if(this.timer){
	            window.clearTimeout(this.timer);
	        }
	        $.fn.addClass.call($(this.elem),"active");
	    },
	    hide:function(){
	        $.fn.removeClass.call($(this.elem),"active");
	    }
	}
	export default {
		data() {
			var validateTel = (rule, value, callback) => {
				var newPwd = this.addMsg.newPwd;
		        if (value !== newPwd) {
		            callback(new Error('两次输入密码不一致，请重新输入！'));
		        } else {
		            callback();
		        }
	        };
			return {
				typename:'',
				addMsg: {
					pwd: '',
					newPwd: '',
					affirmPwd: ''
				},
				rules: {
					pwd: [
						{required: true,message: '请输入当前密码',trigger: 'blur'}
					],
					newPwd: [
						{required: true,message: '请输入新密码',trigger: 'blur'},
						{min:6, max: 15, message: '密码长度为6-15位', trigger: 'blur' },
					],
					affirmPwd: [
						{validator: validateTel,trigger: 'blur'}
					]
				},
				turnBtnState: true
			}
		},
		created() {
			
		},
		methods: {
			addForm(addMsg) {
				let self = this;
				if(!window.navigator.onLine){
					window.location.reload();
					return false;
				}
				if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
				        if (valid) {
							self.turnBtnState = false;
				            let data = {
								oldpassword: self.addMsg.pwd,
								password: self.addMsg.newPwd
				            };
				            self.$http.post(self.HOST+'/changePassword',data).then(function(data){
				            	if(data.data.status == 1){
				            		localStorage.removeItem('access_token');
									Vue.http.headers.common['AccessToken'] = '';
                    				self.turnBtnState = true;
                    				Toast.makeText('密码修改成功，即将跳转登录界面！',3000);
                    				setTimeout(function(){
                    					self.$router.push('/login');
                    				},3000);
				            	}else{
									alert(data.data.msg);
                    				self.turnBtnState = true;
				            	}
				            });
			          	} else {
				            console.log('error submit!!');
				            return false; 
			          	}
			        });
			    }
			}
		}
	}
</script>

<style scoped>
	.addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
	.addsset-main{width:500px;margin:0 auto;padding-top:30px;}
	.button{display: block;margin-top:10px;padding:10px 20px;float:right;}
</style>