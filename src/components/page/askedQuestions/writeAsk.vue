<template>
	<div class="fl sf-main ">
		<div class="main-top zoom pl30">
            <div class="lf">问答 / <span class="zClr-999">问答管理 /</span>
            	<span class="zClr-999">写问答</span>
            </div>
        </div>
        <div class="userInfo mr30 ml30">
        	<div class="fl userImg">
        		<img :src="oActiveUser.avatar">
        	</div>
			<span class="fb userName fl">{{oActiveUser.nickname}}</span>
			<span class="changeUser fl" @click="selectUser()">选择用户</span>
        </div>

        <!--选择水军弹出层-->
        <div class="sf-comment" v-show="bNavy">
            <div class="sf-navy-main">
                <el-form label-width="75px" ref="ModelForm" v-model="ModelForm" :rules="rules" class="mt10">
                    <!--选择类型-->
                    <el-form-item label="选择类型:" prop="type" class="sf-navy-select">
                        <el-select style="width: 300px;" v-model="ModelForm.type" placeholder="请选择" @change="selChange">
                            <el-option v-for="item in type" :label="item.label" :value="item.value"></el-option>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--水军选择-->
                    <el-form-item class="mr10 sf-user-form" label-width="30px">
                        <div class="">
                            <div v-for="(item,index) in aUser" :key="item.id" class="xbox-1-3 mt20">
                                <el-radio v-model="ModelForm.user" :label="item" class="fl sf-radio">
                                    <div class="sf-user-select fr">
                                        <img :src="item.avatar"/>
                                         <!-- <img src="../../../../static/img/navy_icon.png"  style="z-index:100;position:absolute;bottom:2px;right:-7px;width:15px;height: 15px;" v-if="item.code == 2"> -->
                                        <div class="sf-user-name">{{item.nickname}}</div>
                                    </div>
                                </el-radio>
                            </div>
                        </div>
                    </el-form-item>
                    <!--保存取消按钮-->
                    <el-form ref="ModelForm" :model="ModelForm">
                        <div class="addVioce-btn zoom fr mt30 mb10" style="margin-right: 50px;">
                            <el-button class="btn-main button" style="top:0;right:0;" type="primary"
                                       @click="submint()">确定
                            </el-button>
                            <el-button class="button back" style="top:0;right:100px" type="primary" @click="cancel">取消
                            </el-button>
                        </div>
                    </el-form>
                </el-form>
            </div>
            <div class="model-bg"></div>
        </div>

		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<div class="addsset-main">
					<el-form ref="addMsg" :model="addMsg" :rules="rules" label-width="135px">
						<el-form-item label="标题：" prop="title" style="position:relative;">
							<el-input v-model="addMsg.title" size="nomal" :maxlength="20" placeholder="请输入标题" style="height:36px"></el-input>
							<span class="titnum">{{addMsg.title.length}}/20</span>
						</el-form-item>
						<el-form-item label="内容：" prop="detail" style="height:214px">
  							<el-input :maxlength="1000" type="textarea" v-model="addMsg.detail" :rows="8" placeholder='请输入内容'></el-input>
  							<span>{{addMsg.detail.length}}/1000</span>
						</el-form-item>
						
						<el-form-item label="添加图片：" style="width:650px">
							<el-input style="display: none" ></el-input>
						        <el-input style="display: none"></el-input>
						        <!-- <div class="picPreview" style="margin-bottom:10px;overflow:hidden;width:550px" @click.prevent="picPre()"> -->
						        	<div v-for="(img, index) in selectImg" class="imgs" style="float:left;margin-left:10px">
						        		<el-upload action='http://upload-z0.qiniu.com'
								             :on-success="coverPreview"
						                     :multiple="isMutableSelect"
						                     :limit="maxNumber"
						                     :show-file-list='false'
						                     :before-upload="coverUpload"
						                     :data='form'>
										<div class="fzimg"><img :src="img" @click.stop="notPickImage()" style="cursor:default"></div>
										<span @click="changeImg(index)" style="color:#0099E5">更改</span>
									 	<span @click.stop="deleteImg(index)" style="color:#ee0000">删除</span></el-upload>
									 	
									</div>
									<el-upload action='http://upload-z0.qiniu.com'
								             :on-success="coverPreview"
						                     :multiple="isMutableSelect"
						                     :limit="maxNumber"
						                     :show-file-list='false'
						                     :before-upload="coverUpload"
						                     :data='form'>
									<div class="fzimg" v-if="selectImg.length<maxNumber"><img src="../../../../static/img/addPic.png" @click.prevent="addMutableImg($event)" v-if="selectImg.length<maxNumber" style="width:150px;height:150px;"></div>
						        <!-- </div> -->
								 </el-upload>
						</el-form-item>
						<!--  -->
						<el-form-item label="添加分类：" prop="user">
							<el-select v-model="addMsg.user" value-key="id" :disabled="disabled" placeholder="请选择分类" style="width:365px" >
								<el-option v-for="item in menus" :label="item.name" :value="item.id" :key="item.id"></el-option>
							</el-select>
						</el-form-item>
						<div class="addStaff-btn zoom">
							<el-button  class="btn-main button knob" type="primary" @click="addForm('addMsg')">提交</el-button>						
							<el-button class="button back knob" type="primary" @click="isShow">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
		</div>

     <!--弹出层对话框组件-->
        <sf-popups :message="sfMessage" @sfCancel="isShow()" @sfConfirm="goto()" v-show="modelAdd"></sf-popups>
	</div>
</template>
<script >
 import sfPopups from '../../component/popups/popups.vue';
 	require('../../scss/activityComment.scss');
	export default{
		data(){
			var validateGroup = (rule, value, callback) => {
		        if (!value ) {
		          callback(new Error('请选择分类'));
		        } else if (value <=0) {
		          callback(new Error('请选择分类'));
		        } else {
		          callback();
		        }
		      };
			return {
				sfMessage:'您编辑的内容还未发布,是否退出?',
				form: {
	                token: '',
	                key: null
				},
				modelAdd:false,
				maxNumber:9,
	            hret:'',
				turnBtnState: true,//防止重复递交
				bNavy:false, //是否弹层选择用户
				oActiveUser:{
                    avatar:"../../../static/img/avatar.png",
                    id:0,
                    nickname:"用户名"
                },
                ModelForm:{
                    type:"1",
                    user:{},
                },
                rules: {
                    type: [{required:false,message: ' ',trigger: 'blur'}],
                },
                type: [{value: '1', label: '大师'}, {value: '2', label: '水军'}],
                aUser:[],
                aMaster:[],//大师列表
                aNavy:[],//水军列表
                selectImg:[],//用户添加的图片
                addMsg:{
                	title: '',
					detail: '',
					user:null,
                },
                rules: {
					title: [
						{required: true,message: '请输入问答标题',trigger: 'blur'}
					],
					detail: [
						{required: true,message: '请输入问答内容',trigger: 'blur'}
					],
					user:[
						{ validator: validateGroup, trigger: 'blur' }
					]
				},
				disabled: false,
				obj: {},
				userName:[],
				selectChangeImg:-1,
				isMutableSelect:true,// 是否多选
				menus:[]//分类
			}
		},
		created() {
           this.uptokenPic(); 
           this.getMenuData();
		},
		//        Vue组件声明
        components: {
            sfPopups,
        },
		methods:{
			back(){
            this.isShow();
			},
			 goto(){
				 if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
               window.history.go(-1);
            },
			 isShow(){
                let vm = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                vm.modelAdd = !vm.modelAdd;
            },
			getMenuData(){
	        	let self = this;
	        	self.selectIndex = 0;
	        	self.cur_page = 1;
	        	self.tableData = [];
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                 self.$http.post(self.HOST+'/group/total',{type:"4"})
                 .then(function(data){
                    if (data.data.status == 1) {
                        self.menus = data.data.data;
                    }

                 });
	        },

		    //选择用户
		    selectUser(){
		  		let self = this;
	            if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
	            self.bNavy = true;
	            if (self.turnBtnState) {
	                self.turnBtnState = false;
	                self.$http.post(self.HOST+'/commentInter/total',{type:4}).then(function(data){
	                    if(data.data.status === 1){
	                        self.aMaster = data.data.data.master_list;
	                        for(var i = 0; i < self.aMaster.length; i++){
	                            if(!self.aMaster[i].avatar){
	                                self.aMaster[i].avatar =  '../../../../static/img/avatar.png';
	                            }
	                        }
	                        self.aNavy = data.data.data.navy_list;
	                        for(var i = 0; i < self.aNavy.length; i++){
	                            if(!self.aNavy[i].avatar){
	                                self.aNavy[i].avatar =  '../../../../static/img/avatar.png';
	                            }
	                        }
	                        self.aUser = self.aMaster;
	                        self.turnBtnState = true;
	                    }else{
	                        Toast.makeText(data.data.msg);
	                        self.turnBtnState = true;
	                    }
	                });

	            }
		    },
		    uptokenPic() {
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				let self = this;
				self.$http.post(self.HOST+'/rollbackPic').then(function(data){
	            	self.form.token = data.data.utoken;
	            	self.hret = data.data.onlineUrl;
	            });
			},
			coverUpload (file) {
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
	        	if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
					this.form.key = sfFileName(file.name);
				}else{
					sfLayer.makeText('请选择正确的图片格式',3000);
					return false;
				}
				if (this.selectImg.length>9) {
					return false;
				}
	        },
			coverPreview(file) {
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				if (this.selectChangeImg>=0) {
					this.selectImg.splice(this.selectChangeImg,1,this.hret + file.key);

				}else {
					
					if (this.selectImg.length>=9) {
						sfLayer.makeText('超出最大限制');
						return;
					}

					this.selectImg.push(this.hret + file.key)
				}
				// this.
				// this.addMsg.radis_pic = this.hret + file.key;
				// this.addMsg.coveImg = this.hret + file.key;
			},
			changeValue(value) {
			if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				let self = this;
          		self.obj = self.userName.find((item)=>{
              		return item.id === value;
          		});
			},
			upload(){
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
			    return false;
			},
			addMutableImg(event){
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				this.selectChangeImg = -1;
				this.isMutableSelect = true;
			},
			//更改一张图片
			changeImg(index){
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				this.selectChangeImg = index;
				this.isMutableSelect = false;
			},
			deleteImg(index) {
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				this.selectImg.splice(index,1);
			},
		    //水军大师用户切换事件
	        selChange(){
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
	            let self = this;
	            self.aUser = [];
	            if(self.ModelForm.type == 1){
	                self.aUser = self.aMaster;
	            }else{
	                self.aUser = self.aNavy;
	            }
	        },
	         //水军大师弹层选择用户取消事件
            cancel(){
                let self = this;
               if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                self.ModelForm.type = "1";
                this.bNavy = false;
            },
            //水军大师弹层选择用户确定事件
            submint(){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				if(self.ModelForm.user.id){
                self.oActiveUser = self.ModelForm.user;
                self.ModelForm.type = "1";
				this.bNavy = false;
				}else{
					sfLayer.makeText('请选择用户');
				}
            },
            back() {
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				this.$router.push('/askMain');
			},
			notPickImage(){

			},
			//提交
			addForm(addMsg){
				let self = this;
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				if (self.oActiveUser.id<=0) {
					sfLayer.makeText("请选择用户"); 
					return;
				}
				if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
						if(self.addMsg.title.length>20){
							sfLayer.makeText('最多输入20个字')
						}
				        if (valid) {
				        	let data = {
								user_id:self.oActiveUser.id,
								title: self.addMsg.title,
								group_id: self.addMsg.user,
								content: self.addMsg.detail,
								pic:self.selectImg
							};
							self.turnBtnState = false;
				        	self.$http.post(self.HOST+'/interlocution/add',data).then(function(data){
				        		self.turnBtnState = true;
								if(data.data.status == 1){
									let nav = '/askMain?group_index='+self.addMsg.user;
						        	self.$router.push(nav);
								}else{

									 sfLayer.makeText(data.data.msg);
								}
							});
				        }
				    });
			  }
			},
		},
	}

</script>
<style  scoped>
	.userInfo{
		font-size: 15px;
		height: 66px;
		border-top: 1px solid #D8D8D8;
		border-bottom: 1px solid #D8D8D8;


	}
	.userInfo img{
		width: 50px;
		height: 50px;
		margin-left: 15px;
		margin-top: 8px;
		border-radius: 25px;
	}
	.userInfo .userName{
		margin-left: 15px;
		line-height: 66px;
	}
	.userInfo .changeUser{
		cursor: pointer;
		color: #0099E5;
		margin-left: 38px;
		line-height: 66px;
	}
	.addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
	.addsset-main{width:500px;margin:0 auto;padding-top:30px;}
	.addStaff-btn{display: flex;justify-content: center;}
	.button{display: block;margin-top:10px;padding:12px 25px;float:left;}
	.cover{width:180px;position: relative;margin-bottom: 20px;}
	.avatar{width:180px;height:180px;display: block;margin-bottom: 15px;}
	.knob{padding:10px 20px}
	.sf-user-select{position: relative;}
	.titnum{position: absolute;right: 10px;top: 0;color: #ccc}
	.imgs img{
		width: 150px;
		height: 150px;
		display:inline-block;
		position: absolute;
		left:0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
	.fzimg{
		position: relative;
		width: 150px;
		height: 150px;
		overflow: hidden;
		padding-left: 10px;
	}
	.fzimg img{
		width: 150px;
		height: 150px;
	}
</style>