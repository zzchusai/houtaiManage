<template>
	<div class="sf-main">
		<div class="main-top zoom">
			<div class="pl30 lf">会员用户信息 / <span class="zClr-999">编辑大师详情</span></div>
		</div>
		<div class="tab-main ml30">
			<div style="padding-bottom: 50px;">
				<div class="addsset-main">
					<el-form :model="addMsg" label-width="120px" class="edit">
						<el-form-item label="用户头像：">
							<div class="portrait">
								<img :src="addMsg.avatar" alt="" />
							</div>
						</el-form-item>
						<el-form-item label="用户昵称：">
							<div>{{addMsg.nickname}}</div>
						</el-form-item>
						<el-form-item label="用户性别：">
							<div>{{addMsg.gender}}</div>
						</el-form-item>
						<el-form-item label="出生日期：">
							<div>{{addMsg.birth_date}}</div>
						</el-form-item>
						<el-form-item label="出生地：">
							<div>{{addMsg.birth_place}}</div>
						</el-form-item>
						<el-form-item label="绑定手机号：">
							<div>{{addMsg.phone}}</div>
						</el-form-item>
						<el-form-item label="个性签名：">
  							<div>{{addMsg.signature}}</div>
						</el-form-item>
						<el-form-item label="粉丝数：">
  							<div>{{addMsg.fans}}</div>
						</el-form-item>
						<el-form-item label="通讯地址：" v-if='artist'>
  							<!-- <div></div> -->
                              <el-input v-model="artist.con_address" placeholder="请输入通讯地址">
                              </el-input>
						</el-form-item>
						<el-form-item label="联系人：" v-if='artist' >
                             <el-input v-model="artist.name" placeholder="请输入联系人">
                              </el-input>
						</el-form-item>
						<el-form-item label="联系方式：" v-if='artist'>
                              <el-input v-model="artist.phone"  placeholder="请输入联系方式">
                              </el-input>
						</el-form-item>
                        <el-form-item label="个人介绍：" v-if='artist' >
  						 <el-input v-model="artist.details" placeholder="请输入个人介绍">
                              </el-input>
						</el-form-item>
                        <el-form-item label="支付宝账号：" v-if='artist' >
  						 <el-input v-model="artist.alipay" placeholder="请输入支付宝账号">
                              </el-input>
						</el-form-item>
						<el-form-item label="个人宣传图：">
							<div class="fl mt10 mr10" style="display:block;width:100%">
								<img v-if="oGreatInfo.radis_pic" :src="oGreatInfo.coveImg"  style="width: 200px;height:93px;" @click.stop="notPickImage()">
								<!-- <img  v-if="artist.background_pic":src="artist.background_pic" style="width: 200px;height:93px;"> -->
							</div>
							<div class="mt10" v-if="DSHYBJ" style="width:200px">
								<el-upload action='http://upload-z0.qiniu.com'
									   :show-file-list='showUploadList'
									   :on-success="coverPreview"
									   :before-upload="coverUpload"
									   :data='form'>
								<span class="change" @click="addPic" style="width:200px;line-height:60px;cursor:pointer;display:block;text-align:center;" >更换</span>
							 </el-upload>
							</div>
						</el-form-item>
                          <el-form-item class="mt30" >
                        <div class="addVioce-btn zoom fr mt30 mb30" style="margin-right: 50px;">
                            <el-button  class="btn-main button" style="width:80px;float:left;margin-right:20px" type="primary"  @click="onSubmit()">确定</el-button>
                            <el-button class="button back"  type="primary" style="width:80px;float:left;" @click="cancel()">取消</el-button>
                        </div>
                    </el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<!-- <div class="model" v-show="model">
			<div class="model-main" style="top:28%;">
				<div class="modei-box">
					<div class="model-title">更换个人宣传图</div> -->
					<!-- <el-form :model="form"  style="padding:20px 50px 0 90px">
						<el-form-item  abel="" v-if='artist' >
							<el-upload action='http://upload-z0.qiniu.com'
									   :show-file-list='showUploadList'
									   :on-success="coverPreview"
									   :before-upload="coverUpload"
									   :data='form'>
								<div class="mc">
									<img v-if="oGreatInfo.radis_pic" :src="oGreatInfo.coveImg" style="width: 250px;height:117px;cursor:default;" @click.stop="notPickImage()">
								</div>
								<div style="width:250px">
                                    <span class="change" @click="addPic" type="primary" >更换</span>
								</div>
								<i class="el-icon-loading" v-show="radis_pic"></i>
							</el-upload>
						</el-form-item>
						<el-form-item  class="mt20 mr20 pb20 fr"  v-if='artist'>
							<span @click="picConfirm" class="sf-memberInfo-btn" >确定</span>
							<span @click="picCancel" class=" ml20 sf-memberInfo-cancel sf-memberInfo-btn">取消</span>
						</el-form-item>
					</el-form> -->
				<!-- </div>
			</div>
			<div class="model-bg"></div>
		</div> -->
         <!--弹出层对话框组件-->
        <sf-popups :message="sfMessage" @sfCancel="sfCancel()" @sfConfirm="sfConfirm()" v-show="bModel"></sf-popups>
	</div>
</template>

<script>
    require('../../scss/great.scss');
     import sfPopups from '../../component/popups/popups.vue';
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
				model: false,
				turnBtnState:true,
				addMsg: {
					avatar: '../../../../static/img/avatarL.png',
			        nickname: '',
			        gender: '',
			        birth_date: '',
			        birth_place: '',
			        phone: '',
			        source: '',
					signature:'',
					fans:""
				},
				artist: {
					con_address:'',
					name:'',
					phone:'',
					details:'',
					alipay:''
				},
				showUploadList: false,
				form: {
					token: '',
					key: null
				},
				oGreatInfo:{
					radis_pic: '',
					coveImg: '',
				},
				radis_pic: false,
				DSHYBJ:false,
                bSendTag:true,
				sfMessage:'退出后内容不再保留，确定退出？',
				bModel:false,
				user_id:'',
				rulea:false,
				ruleb:false,
				rulec:false,
				ruled:false,
				rulef:false,
			}
			
		},
		created() {
			let self = this;
			self.user_id=self.$route.query.id;
			self.render();
			self.limit();
        },
        components:{
            sfPopups
        },
		methods: {
			limit() {
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
				let limitCode = self.$store.getters.getSfLimits;
				limitCode.forEach(function(item,index){
					if(item == 'DSHYBJ'){
						self.DSHYBJ = true;
					}
				});
			},
			render() {
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
	    		let data={
					id:self.$route.query.id
				};
				self.$http.post(self.HOST+'/master/info/',data).then(function(data){
					if(data.data.status == 1){
						self.addMsg=data.data.data.user_info;
						self.artist=data.data.data.signedAuthor_info;
						// console.log(self.artist);
						if(self.addMsg.birth_date) {
								self.addMsg.birth_date = new Date(self.addMsg.birth_date*1000).format("yyyy/MM/dd");
							} else {
								self.addMsg.birth_date = '未设置';
							}
						if(self.addMsg.avatar){
							self.addMsg.avatar = self.addMsg.avatar;
						} else {
							self.addMsg.avatar='../../../../static/img/avatarL.png';
						}
						if(!self.addMsg.nickname) {
							self.addMsg.nickname='未设置';
						}
						if(!self.addMsg.birth_place) {
							self.addMsg.birth_place='未设置';
						}
						if(!self.addMsg.signature) {
							self.addMsg.signature='未设置';
						}
						if(self.addMsg.gender == 1) {
							self.addMsg.gender='男';
						} else{
							self.addMsg.gender='女';
						}
						self.oGreatInfo.coveImg = self.artist.background_pic;
						self.oGreatInfo.radis_pic = self.artist.background_pic;
						self.artist.con_address=self.artist.contact_address;
						self.artist.name=self.artist.contact_name;
						self.artist.phone=self.artist.contact_phone;
						self.artist.details=self.artist.detail;
						self.artist.fans=self.artist.fans;
						//接收数据，如果支付宝账户不存在，就设置为空
						if(!self.addMsg.payNumb){
                          self.artist.alipay=''
						}else{
						self.artist.alipay=self.addMsg.payNumb;
						}
					}
				});
			},
			onChange(){
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				// self.model = true;
			},
			picConfirm(){
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(!self.oGreatInfo.coveImg){
					Toast.makeText("请上传个人宣传图");
					return;
				}
				let data={
					id:self.$route.query.id,
					background_pic:self.oGreatInfo.coveImg
				};
				if (self.turnBtnState) {
					self.turnBtnState = false;
					self.$http.post(self.HOST+'/master/edit',data).then(function(data){
						// console.log(data);
						if(data.data.status === 1){
							Toast.makeText("更换成功");
							self.model = false;
							self.turnBtnState = true;
							self.render();
						}else{
							Toast.makeText(data.data.msg);
							self.turnBtnState = true;
						}
					});

				}
			},
			picCancel(){
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.oGreatInfo.radis_pic = self.artist.background_pic;
				self.oGreatInfo.coveImg = self.artist.background_pic;
				self.model = false;

			},

			coverPreview(file) {
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.radis_pic = false;
				this.oGreatInfo.radis_pic = this.hret + file.key;
				this.oGreatInfo.coveImg = this.hret + file.key;
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
				});
			},
			notPickImage(){

			}, sfCancel(){
                let vm = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }

            },sfConfirm(){
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.$router.push('/great')
			},
			//取消修改
			cancel(){
			this.bModel=true;
            },
			//确定修改
			onSubmit(){
			 let self=this;
			 let reg='';
			  if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
			 if(self.artist.con_address==''){
				  self.rulea=false;
				 Toast.makeText('请输入通讯地址！')
			 }else{
				 self.rulea=true;
				 self.artist.con_address=self.artist.con_address;
			 }
			 if(self.artist.name==''){
				 self.ruleb=false;
				 Toast.makeText('请输入联系人！')
			 }else{
				 self.ruleb=true;
				 self.artist.name=self.artist.name;
			 }
			  if(!self.artist.phone){
				 self.rulec=false;
				 Toast.makeText('请输入联系方式！')
			 }else{
				 reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
				if(!reg.test(self.artist.phone)){
					self.rulec=false;
                   Toast.makeText("联系方式格式不正确");
                }else{
                 self.rulec=true;
				 self.artist.phone=self.artist.phone;
				}
			 }
			  if(!self.artist.details){
				 self.ruled=false;
				 Toast.makeText('请输入个人介绍！')
			 }else{
				  self.ruled=true;
				 self.artist.details=self.artist.details;
			 }
				 if(!self.artist.alipay){
					 self.rulef=false;
                    Toast.makeText('请输入支付宝账号！');
				 }else{
					  self.rulef=true;
					 self.artist.alipay=self.artist.alipay;
				 }
			 let data={
				 status:1,
			   id:self.user_id,
			   contact_address:self.artist.con_address,
			   contact_name:self.artist.name,
			   contact_phone:self.artist.phone,
			   background_pic:self.oGreatInfo.coveImg,
			   detail:self.artist.details,
			   payNumb:self.artist.alipay,
			 }
			 if(self.rulea&&self.ruleb&&self.rulec&&self.ruled&&self.rulef){
			 self.$http.post(self.HOST+'/user/upgrade',data).then(function(res){
             if(res.data.status==1){
				self.$router.push('/great');
			 }else{
				 Toast.makeText(res.data.msg)
			 }
			 })
			}
			}
		}
	}
</script>

<style scoped>
	.addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
	.addsset-main{width:500px;margin:0 auto;padding-top:30px;word-break: break-all;word-wrap: break-word;}
	.button{display: block;margin-top:10px;}
	.portrait{width:80px;height:80px;}
	.el-form-item{margin-bottom: 10px!important;}
	.el-button{padding: 10px 10px 9px;}
	.sf-button{margin:10px 50px 10px 85px;padding: 7px 9px}
</style>