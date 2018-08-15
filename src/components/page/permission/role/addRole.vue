<template>
	<div class="addRole main">
		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<div class="addsset-title">{{typename}}</div>
				<div class="addsset-main">
					<el-form ref="addMsg" :model="addMsg" :rules="rules" label-width="100px" style="padding-right:100px;">
						<el-form-item label="角色名称：" prop="name">
							<el-input v-model="addMsg.name" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="角色权限：">
	    					<el-tree style="max-height:350px;overflow-y: auto;" :data="roles" ref='tree' :props="defaultProps" show-checkbox node-key="id" :default-expand-all='true' :check-strictly="parent" :expand-on-click-node="true"></el-tree>
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
				typename: '',
				addMsg: {
					name: '',
					role: ''
				},
				rules: {
					name: [
						{required: true,message: '请输入角色名称',trigger: 'blur'},
						{ max: 20, message: '角色名称不能超过20个字符', trigger: 'blur' }
					]
				},
				buttonAdd: true,
				buttonUpdata: false,
				roles: [],
				defaultProps: {
		          	children: 'next',
		          	label: 'name'
		       	},
		       	val: [],
		       	turnBtnState: true,
		       	parent: false
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
					self.typename = '新增角色';
					self.buttonUpdata = false;
					self.buttonAdd=true;
					self.ajaxSelete();
				}else{
					self.typename = '修改角色';
					self.buttonUpdata=true;
					self.buttonAdd=false;
					self.parent = true;
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
				let data = {
					id:id
				};
				self.$http.post(self.HOST+'/role/update/'+id).then(function(data){
					if(data.data.status == 1){
						self.addMsg.name = data.data.data.role_info.name;
						self.roles = data.data.data.privilege_list.data;
						self.val = data.data.data.privilege_list.check_id;
						this.$refs.tree.setCheckedKeys(self.val);
						self.parent = false;
					}
				});
			},
			ajaxSelete() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$http.post(self.HOST+'/role/save',).then(function(data){
					if(data.data.status == 1){
						self.roles = data.data.data;
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
					let arr = [];
					let check = this.$refs.tree.getCheckedNodes();
					check.forEach(function(item,index){
						arr.push(item.id);
						arr.push(parseInt(item.pid));
					});
					arr.sort(function(a,b){return a>b?1:-1});
					let re=[arr[0]];
					for(var i = 1; i < arr.length; i++){
						if( arr[i] !== re[re.length-1]){ 
					  		re.push(arr[i]);
					 	} 
					}
					re.splice(0,1);
					self.$refs[addMsg].validate((valid) => {
						if(re.length == 0){
							alert('请选择角色')
						}else if (valid) {
							self.turnBtnState = false;
				            let data = {
				            	name:self.addMsg.name,
				            	privilege_id:re
				            };

				            self.$http.post(self.HOST+'/role/save',data).then(function(data){
				            	if(data.data.status == 1){
//				            		self.$router.push('/role');
//									location.reload();
//                   				self.turnBtnState = true;
									let limits = [];
									let limitCode = [];
									self.$http.post(self.HOST+'/getSiderBarList?isAll='+1).then(function(data){
										if(data.data.status == 1){
											limits = data.data.data;
											limits.forEach(function(item,index){
												limitCode.push(item.code);
											});
											//改变权限状态
											self.$store.commit( 'sfIncrement',limitCode);
											self.$router.push('/role');
											self.turnBtnState = true;
										}
									});
				            	}else{
									if(data.data.msg == '修改name :'+self.addMsg.name+'时与数据库值重复！'){
										alert('已存在相同的相同的角色名称，请更换');
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
					let arr = [];
					let check = this.$refs.tree.getCheckedNodes();
					check.forEach(function(item,index){
						arr.push(item.id);
						arr.push(parseInt(item.pid));
					});
					arr.sort(function(a,b){return a>b?1:-1});
					let re=[arr[0]]; 
					for(var i = 1; i < arr.length; i++){
						if( arr[i] !== re[re.length-1]){ 
					  		re.push(arr[i]); 
					 	} 
					}
					re.splice(0,1);
					self.$refs[addMsg].validate((valid) => {
						if(arr.length == 0){
							alert('请选择角色')
						}else if (valid) {
							self.turnBtnState = false;
							let id = self.$route.query.id;
				            let data = {
				            	name:self.addMsg.name,
				            	privilege_id:re,
				            	id:id
				            };
				            self.$http.post(self.HOST+'/role/update',data).then(function(data){
				            	if(data.data.status == 1){
//				            		self.$router.push('/role');
//									location.reload();
//                    				self.turnBtnState = true;
									let limits = [];
									let limitCode = [];
									self.$http.post(self.HOST+'/getSiderBarList?isAll='+1).then(function(data){
										if(data.data.status == 1){
											limits = data.data.data;
											limits.forEach(function(item,index){
												limitCode.push(item.code);
											});
											//改变权限状态
											self.$store.commit( 'sfIncrement',limitCode);
											self.$router.push('/role');
											self.turnBtnState = true;
										}
									});
				            	}else{
									if(data.data.msg == '修改name:'+self.addMsg.name+'时与数据库值重复！'){
										alert('已存在相同的相同的角色名称，请更换');
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
				this.$router.push('/role');
			}
		}
	}
</script>

<style scoped>
	.addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
	.addsset-main{width:600px;margin:0 auto;padding-top:30px;}
	.button{display: block;margin-top:10px;padding:10px 20px;float:right;}
	label{display: block !important;margin-left:0 !important;line-height:28px!important;}
</style>