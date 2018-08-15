<template>
	<div class="addPart main">
		<div class="addPart-top main-top zoom">
			<div class="addPart-title lf">节目管理 / <span class="zClr-999">栏目列表 / </span><span class="zClr-999">{{typename}}</span></div>
		</div>
		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<div class="addsset-main">
					<el-form ref="addMsg" :model="addMsg" :rules="rules" label-width="135px">
						<el-form-item label="栏目名称：" prop="name">
							<el-input v-model="addMsg.name" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="栏目主播：" prop="user_name">
							<el-select v-model="addMsg.user_name" :disabled="disabled" placeholder="请选择主播" @change="changeValue">
								<el-option v-for="item in userName" :label="item.nickname" :value="item.id" :key="item.id"></el-option>
							</el-select>
						</el-form-item>
						</el-form-item>
						<el-form-item label="栏目介绍：" prop="title">
							<el-input v-model="addMsg.title" size="nomal" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="栏目详情介绍：" prop="detail">
  							<el-input type="textarea" v-model="addMsg.detail" style="min-height:40px;"></el-input>
						</el-form-item>
						<el-form-item  label="栏目宣传图上传：" prop="radis_pic">
							<el-input style="display: none" v-model="addMsg.radis_pic"></el-input>
							<el-upload action='http://upload-z0.qiniu.com'
						        :show-file-list='showUploadList'
						        :on-success="coverPreview"
						        :before-upload="coverUpload"
						        multiple
						        :data='form'>
						        <img v-if="addMsg.radis_pic" :src="addMsg.coveImg" class="avatar" style="cursor:default;" @click.stop="notPickImage()">
						        <span style="height:36px;padding:0 15px;color:#0099E5" @click="addPic" type="primary">{{load}}</span>
						        <i class="el-icon-loading" v-show="radis_pic"></i>
						    </el-upload>
  							<!-- <el-upload :action="imgUrl" list-type="picture" :show-file-list="false" :on-success="coverPreview">
								<img v-if="addMsg.radis_pic" :src="addMsg.coveImg" class="avatar">
							  	<el-button class="btn-box btn-file" size="small" type="primary" style="height:36px;padding:0 15px;">{{load}}</el-button>
							</el-upload> -->
						</el-form-item>
						<div class="addStaff-btn zoom">
							<el-button v-show="buttonAdd" class="btn-main button knob" type="primary" @click="addForm('addMsg')">提交</el-button>						
							<el-button v-show="buttonUpdata" class="btn-main button knob" type="primary" @click="updataForm('addMsg')">提交</el-button>
							<el-button class="button back knob" type="primary" @click="back">取消</el-button>
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
			return {
				form: {
	                token: '',
	                key: null
	            },
	            hret: '',
	            showUploadList: false,
				typename:'',
				addMsg: {
					name: '',
					user_name: '',
					title: '',
					detail: '',
					user: '',
					radis_pic: '',
					coveImg: ''
				},
				rules: {
					name: [
						{required: true,message: '请输入栏目名称',trigger: 'blur'}
					],
					user_name: [
						{type: 'number',required: true,message: '请选择主播',trigger: 'change'}
					],
					title: [
						{required: true,message: '请选择栏目介绍',trigger: 'blur'}
					],
					detail: [
						{required: true,message: '请输入栏目详情介绍',trigger: 'blur'}
					],
					radis_pic: [
						{required: true,message: '请选择宣传图片',trigger: 'blur'}
					],
				},
				user_id: '',
				userName: [],
				buttonAdd: true,
				buttonUpdata: false,
				obj: {},
				cover: false,
				user: false,
				img: '',
				upload: true,
				load: '',
				disabled: false,
				imgUrl: this.HOST+'/uploadImg?type=1',
				turnBtnState: true,
				radis_pic: false
			}
		},
		created() {
			let self = this;
			self.render();
		},
		methods: {
			addPic() {
				this.uptokenPic();
			},
			uptokenPic() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
				self.$http.post(self.HOST+'/rollbackPic').then(function(data){
	            	self.form.token = data.data.utoken;
	            	self.hret = data.data.onlineUrl;
					console.log(self.form.token);
					console.log(data.data);
	            });
			},
			changeValue(value) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
          		self.obj = self.userName.find((item)=>{
              		return item.id === value;
          		});
			},
	        coverUpload (file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
	        	if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
					this.form.key = sfFileName(file.name);
					this.radis_pic = true;
				}else{
					Toast.makeText('请选择正确的图片格式',3000);
					return false;
				}
	        },
			coverPreview(file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				console.log(file);
				this.radis_pic = false;
				this.addMsg.radis_pic = this.hret + file.key;
				this.addMsg.coveImg = this.hret + file.key;
				this.load = '更换';
			},
			render() {
				let self = this;
	    		let type = self.$route.query.type;
				if(type == 'add'){
					self.typename = '新增栏目';
					self.load = '上传';
					self.buttonUpdata = false;
					self.buttonAdd=true;
					self.ajaxSelete();
				}else if(type == 'edit'){
					self.typename = '编辑栏目';
					self.load = '更换';
					self.buttonUpdata=true;
					self.buttonAdd=false;
					self.disabled = true;
					self.cover = true;
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
				self.$http.post(self.HOST+'/column/save').then(function(data){
	            	if(data.data.status == 1){
	            		self.userName = data.data.data;
	            	}
	            });
			},
			ajaxData() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let id = self.$route.query.id;
				self.$http.post(self.HOST+'/column/update/'+id).then(function(data){
					if(data.data.status == 1){
						let res = data.data.data;
						self.addMsg.name = res.name;
						self.addMsg.user_name = res.user_id;
						self.addMsg.title = res.title;
						self.addMsg.detail = res.detail;
						self.addMsg.radis_pic = res.background_pic;
						self.addMsg.coveImg = res.background_pic;
					}
				});
			},
			addForm(addMsg) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let data = {
					name: self.addMsg.name,
					user_id: self.addMsg.user_name,
					user_name: self.obj.nickname,
					title: self.addMsg.title,
					detail: self.addMsg.detail,
					background_pic: self.addMsg.radis_pic,
				};
				if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
				        if (valid) {
							self.turnBtnState = false;
				        	self.$http.post(self.HOST+'/column/save',data).then(function(data){
								if(data.data.status == 1){
									self.$router.push('/part');
                    				self.turnBtnState = true;
								}else{
									if(data.data.msg == '增加name:'+self.addMsg.name+'时与数据库值重复！'){
										alert('栏目名称重复');
									}else{
										alert(data.data.msg);
									}
                    				self.turnBtnState = true;
								}
							});
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
				let data = {
					id: self.$route.query.id,
					name: self.addMsg.name,
					title: self.addMsg.title,
					detail: self.addMsg.detail,
					background_pic: self.addMsg.radis_pic,
				};
				if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
				        if (valid) {
							self.turnBtnState = false;
				        	self.$http.post(self.HOST+'/column/update',data).then(function(data){
								if(data.data.status == 1){
									Toast.makeText('保存成功');
									self.$router.push('/part');
                    				self.turnBtnState = true;
								}else{
									if(data.data.msg == '修改name:'+self.addMsg.name+'时与数据库值重复！'){
										alert('栏目名称重复');
									}else{
										alert(data.data.msg);
									}
                    				self.turnBtnState = true;
								}
							});
				        }
				    });
			   }
			}, 
			back() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.$router.push('/part');
			},
			notPickImage(){

			},
		}
	}
</script>

<style scoped>
	.addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
	.addsset-main{width:500px;margin:0 auto;padding-top:30px;}
	.button{display: block;margin-top:10px;padding:12px 25px;float:right;}
	.cover{width:180px;position: relative;margin-bottom: 20px;}
	.avatar{width:180px;height:180px;display: block;margin-bottom: 15px;}
	.knob{padding:10px 20px;}
</style>