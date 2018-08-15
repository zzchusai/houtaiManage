<template>
	<div class="addMng main">
		<div class="addMng-top main-top zoom">
			<div class="round lf"></div>
			<div class="addMng-title lf">权限管理 / <span class="zClr-999">管理员列表 / </span><span class="zClr-999">{{typename}}</span></div>
		</div>
		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<div class="addsset-main">
					<el-form ref="addMsg" :model="addMsg" :rules="rules" label-width="100px" style="padding-right:100px;">
						<el-form-item label="用户名：" prop="name">
							<el-input v-model="addMsg.name" size="nomal" placeholder="请输入用户名"></el-input>
						</el-form-item>
						<el-form-item label="手机号：" prop='phone'>
							<el-input v-model="addMsg.phone" size="nomal" placeholder="请输入手机号"></el-input>
						</el-form-item>
						<el-form-item label="角色：">
							<el-select v-model="addMsg.role" placeholder="请选择角色" @change="changeValue">
								<el-option v-for="item in role" :label="item.name" :value="item.id" :key="item.id"></el-option>
							</el-select>
						</el-form-item>
						<div class="addStaff-btn zoom">
							<el-button v-show="buttonAdd" class="btn-main button" type="primary" @click="addForm('addMsg')">提交</el-button>						
							<el-button v-show="buttonUpdata" class="btn-main button" type="primary" @click="updataForm('addMsg')">提交</el-button>
							<el-button class="button back" type="primary" @click="back">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	let Toast={
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
	            let node=document.createElement("div");
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
            	var regExp = /^1[3|5|8|7][0-9]{9}$/;
		        if (value === '') {
		            callback(new Error('请输入手机号码'));
		        }else if (regExp.test(value) === false) {
		            callback(new Error('请输入正确手机号码'))
		        } else {
		            callback();
		        }
	        };
			return {
				typename:'',
				addMsg: {
					name:'',
					phone:'',
					role:''
				},
				rules: {
					name: [
						{required: true,message: '请输入用户名',trigger: 'blur'},
						{ max: 20, message: '用户名不能超过20个字符', trigger: 'blur' }
					],
					phone: [
						{validator: validateTel,trigger: 'blur'}
					]
				},
				role: [],
				buttonAdd: true,
				buttonUpdata: false,
				obj:{},
				turnBtnState: true
			}
		},
		created() {
			let self = this;
			self.render();
		},
		methods: {
			changeValue(value) {
          		let self = this;
          		self.obj = self.role.find((item)=>{
              		return item.id === value;
          		});
        	},
			render() {
				let self = this;
	    		let type = self.$route.query.type;
				if(type == 'add'){
					self.typename = '新增管理员';
					self.buttonUpdata = false;
					self.buttonAdd=true;
					self.ajaxSelete();
				}else if(type == 'edit'){
					self.typename = '修改管理员';
					self.buttonUpdata=true;
					self.buttonAdd=false;
					self.ajaxSelete();
					self.ajaxData();
				}
			},
			ajaxData() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let id = self.$route.query.id;
				self.$http.post(self.HOST+'/admin/update/'+id).then(function(data){
					if(data.data.status == 1){
						self.addMsg.name = data.data.data.admin_info.name;
						self.addMsg.phone = data.data.data.admin_info.phone;
						self.addMsg.role = data.data.data.admin_info.role_id?data.data.data.admin_info.role_id:'未指派';
					}
				});
			},
			ajaxSelete() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$http.post(self.HOST+'/admin/save').then(function(data){
	            	if(data.data.status == 1){
	            		self.role = data.data.data;
	            	}
	            });
			},
			addForm(addMsg) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let role_id = self.addMsg.role?self.addMsg.role:'0';
				if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
				        if (valid) {
							self.turnBtnState = false;
				            let data = {
				            	name:self.addMsg.name,
				            	phone:self.addMsg.phone,
				            	role_id:role_id,
				            	role:self.obj.name
				            }
				            self.$http.post(self.HOST+'/admin/save',data).then(function(data){
				            	if(data.data.status == 1){
				            		// self.$router.push('/manager');
				            		this.back();
                   					self.turnBtnState = true;
				            	}else{
									if(data.data.msg == '增加name:'+self.addMsg.name+'时与数据库值重复！'){
										alert('管理员名称重复');
									}else if(data.data.msg == '增加phone:'+self.addMsg.phone+'时与数据库值重复！'){
										alert('该手机号已经注册');
									}else{
										alert(data.data.msg);
									}
                    				self.turnBtnState = true;
								}
				            });
			          	} else {
				            console.log('error submit!!');
				            return false; 
			          	}
			        });
			    }
			},
			updataForm(addMsg) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let role_id = self.obj?self.addMsg.role:'0';
				let role = self.obj?self.obj.name:'';
				if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
				        if (valid) {
                    		self.turnBtnState = false;
				        	let id = self.$route.query.id;
				            let data = {
				            	id:id,
				            	name:self.addMsg.name,
				            	phone:self.addMsg.phone,
				            	role_id:role_id,
				            	role:role
				            }
				            self.$http.post(self.HOST+'/admin/update',data).then(function(data){
				            	if(data.data.status == 1){
				            		// self.$router.push('/manager');
				            		this.back();
                    				self.turnBtnState = true;
				            	}else{
									if(data.data.msg == '修改name:'+self.addMsg.name+'时与数据库值重复！'){
										alert('管理员名称重复');
									}else if(data.data.msg == '修改phone:'+self.addMsg.phone+'时与数据库值重复！'){
										alert('该手机号已经注册');
									}else{
										alert(data.data.msg);
									}
                    				self.turnBtnState = true;
								}
				            });
			          	} else {
				            console.log('error submit!!');
				            return false; 
			          	}
			        });
			    }
			},
			back() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				// this.$router.push('/manager');
				this.$router.go(-1);
			}
		}
	}
</script>

<style scoped>
	.addsset-main{width:600px;margin:0 auto;padding-top:30px;}
	.button{display: block;margin-top:10px;padding:10px 20px;float:right;}
</style>