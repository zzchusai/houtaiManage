<template>
	<div class="addLimit main">
		<div class="addLimit-top main-top zoom">
			<div class="addMng-title lf">权限管理 / <span class="zClr-999">权限列表 / </span><span class="zClr-999">{{typename}}</span></div>
		</div>
		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<div class="addsset-main">
					<el-form ref="addMsg" :model="addMsg" :rules="rules" label-width="100px" style="padding-right:100px;">
						<el-form-item label="上级分类：" prop='sort'>
							<el-select v-model="addMsg.pid" placeholder="请选择" style="width:400px;">
								<el-option v-for="item in sort" :label="item.name" :value="item.id" :key="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="权限编码：" prop="code">
							<el-input v-model="addMsg.code" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="权限名称：" prop='name'>
							<el-input v-model="addMsg.name" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="操作前缀：">
							<el-input v-model="addMsg.pri_name" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="路由地址：" prop='route'>
							<el-input v-model="addMsg.route" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="控制器名称：" prop='controller_name'>
							<el-input v-model="addMsg.controller_name" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="方法名称：" prop='action_name'>
							<el-input v-model="addMsg.action_name" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="是否启用：" prop='isshow'>
							<el-radio v-model="addMsg.isshow" label="1">是</el-radio>
							<el-radio v-model="addMsg.isshow" label="0">否</el-radio>
						</el-form-item>
						<el-form-item label="排序：" prop='order'>
							<el-input v-model="addMsg.order" size="nomal" placeholder=""></el-input>
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
	export default {
		data() {
			return {
				typename:'',
				addMsg: {
					pid: '',
					code: '',
					name: '',
					route: '',
					controller_name: '',
					action_name: '',
					isshow: '1',
					order: 0
				},
				rules: {
					name: [
						{required: true,message: '请输入权限名称',trigger: 'blur'}
					]
				},
				sort: [
					{id:0,name:'顶级权限'}
				],
				buttonAdd: true,
				buttonUpdata: false,
				turnBtnState: true
			}
		},
		created() {
			let self = this;
			self.render();
		},
		methods: {
			render() {
				let self = this;
	    		let type = self.$route.query.type;
				if(type == 'add'){
					self.typename = '新增权限';
					self.buttonUpdata = false;
					self.buttonAdd=true;
					self.ajaxSelete();
				}else if(type != 'add'){
					self.typename = '编辑权限';
					self.buttonUpdata=true;
					self.buttonAdd=false;
					self.ajaxSelete();
					self.ajaxData();
				}
			},
			ajaxSelete() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$http.post(self.HOST+'/privilege/save').then(function(data){
	            	if(data.data.status == 1){
	            		let res = data.data.data;
	            		for(var i = 0;i<res.length;i++){
	            			self.sort.push(res[i]);
	            		}
	            		for(var i = 1;i<self.sort.length;i++){
	            			self.sort[i].name = self.tier(self.sort[i].level*2)+' '+self.sort[i].name;
	            		}
	            	}
	            });
			},
			tier(num) {
				let hie = '';
				for(var i = 0;i <= num;i++){
					hie += '--------';
				}
				return hie;
			},
			ajaxData() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let id = self.$route.query.id;
				self.$http.post(self.HOST+'/privilege/update/'+id).then(function(data){
					if(data.data.status == 1){
						let res = data.data.data.privilege_info;
						self.addMsg.pid = res.pid;
						self.addMsg.code = res.code;
						self.addMsg.name = res.name;
						self.addMsg.route = res.route;
						self.addMsg.controller_name = res.controller_name;
						self.addMsg.action_name = res.action_name;
						self.addMsg.isshow = res.isshow.toString();
						self.addMsg.order = res.order;
					}
				});
			},
			addForm(addMsg) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
				        if (valid) {
							self.turnBtnState = false;
				            let data = {
				            	pid: self.addMsg.pid,
				            	code: self.addMsg.code,
								name: self.addMsg.name,
								route: self.addMsg.route,
								controller_name: self.addMsg.controller_name,
								action_name: self.addMsg.action_name,
								isshow: self.addMsg.isshow,
								order: self.addMsg.order,
								pri_name: self.addMsg.pri_name			
				            };
				            self.$http.post(self.HOST+'/privilege/save',data).then(function(data){
				            	if(data.data.status == 1){
				            		self.$router.push('/limits');
                    				self.turnBtnState = true;
				            	}else{
				            		if(data.data.msg == '增加name:'+self.addMsg.name+'时与数据库值重复！'){
										alert('权限名重复');
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
				if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
				        if (valid) {
							self.turnBtnState = false;
				        	let id = self.$route.query.id;
				            let data = {
				            	id:id,
				            	pid: self.addMsg.pid,
				            	code: self.addMsg.code,
								name: self.addMsg.name,
								route: self.addMsg.route,
								controller_name: self.addMsg.controller_name,
								action_name: self.addMsg.action_name,
								isshow: self.addMsg.isshow,
								order: self.addMsg.order
				            }
				            self.$http.post(self.HOST+'/privilege/update',data).then(function(data){
				            	if(data.data.status == 1){
				            		self.$router.push('/limits');
                    				self.turnBtnState = true;
				            	}else{
									if(data.data.msg == '修改name:'+self.addMsg.name+'时与数据库值重复！'){
										alert('权限名重复');
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
				this.$router.push('/limits');
			}
		}
	}
</script>

<style scoped>
	.addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
	.addsset-main{width:600px;margin:0 auto;padding-top:30px;}
	.button{display: block;margin-top:10px;padding:10px 20px;float:right;}
</style>