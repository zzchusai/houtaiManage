<template>
    <div class="sf-main">
        <div class="main-top zoom">
            <div class="pl30 lf">会员用户信息 / <span class="zClr-999">普通会员详情</span></div>
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
                         <el-form-item label="活跃值：">
                            <div>{{addMsg.active}}</div>
                        </el-form-item>
                         <el-form-item label="等级：">
                            <div>{{addMsg.rankName}}</div>
                        </el-form-item>
                        <el-form-item label="通讯地址：" v-if='artist'>
                            <div>{{artist.contact_address}}</div>
                        </el-form-item>
                        <el-form-item label="联系人：" v-if='artist'>
                            <div>{{artist.contact_name}}</div>
                        </el-form-item>
                        <el-form-item label="联系方式：" v-if='artist'>
                            <div>{{artist.contact_phone}}</div>
                        </el-form-item>
                        <el-form-item label="个人介绍：" v-if='artist'>
                            <div>{{artist.detail}}</div>
                        </el-form-item>
                        <el-form-item label="是否设为水军：">
                            <el-radio v-model="radio" :disabled="is === 0" label="1">是</el-radio>
                            <el-radio v-model="radio" :disabled="is === 0" label="0">否</el-radio>
                            <span @click="modification" class=" ml20 sf-memberInfo-btn" v-xlimit = "'SWSJ'">修改</span>
                        </el-form-item>
                        <el-form-item label="" v-if="bShow">
                            <el-radio v-model="radio"  label="1">是</el-radio>
                            <el-radio v-model="radio" label="0">否</el-radio>
                            <span @click="save" class=" ml20 sf-memberInfo-btn">保存</span>
                            <span @click="cancel" class=" ml20 sf-memberInfo-cancel sf-memberInfo-btn">取消</span>
                        </el-form-item>
                        <!--升级大师-->
                        <el-form-item class="mt30" label="">
                            <span @click="great" class="sf-memberInfo-btn">升级为大师</span>
                        </el-form-item>
                        <el-form-item class="mt20" label="通讯地址：" v-if="bGreat">
                            <el-input v-model="oGreatInfo.address" size="nomal" placeholder="请输入通讯地址"></el-input>
                        </el-form-item>
                        <el-form-item class="mt20" label="联系人：" v-if="bGreat">
                            <el-input v-model="oGreatInfo.name" size="nomal" placeholder="请输入联系人"></el-input>
                        </el-form-item>
                        <el-form-item class="mt20" label="联系方式：" v-if="bGreat">
                            <el-input v-model="oGreatInfo.phone" size="nomal" placeholder="请输入联系方式"></el-input>
                        </el-form-item>
                        <el-form-item class="mt20" label="个人介绍：" v-if="bGreat">
                            <el-input type="textarea" v-model="oGreatInfo.detail" style="min-height:40px;" placeholder="请输入个人介绍"></el-input>
                        </el-form-item>
                        <el-form-item class="mt20" label="支付宝账号：" v-if="bGreat">
                            <el-input v-model="oGreatInfo.alipay" style="min-height:40px;" placeholder="请输入支付宝账号"></el-input>
                        </el-form-item>
                        <el-form-item class="mt20" label="个人宣传图：" v-if="bGreat">
                            <el-upload action='http://upload-z0.qiniu.com'
                                       :show-file-list='showUploadList'
                                       :on-success="coverPreview"
                                       :before-upload="coverUpload"
                                       :data='form'>
                                <div class="fl ml10">
                                    <img v-if="oGreatInfo.radis_pic" :src="oGreatInfo.coveImg" style="width: 200px;height:93px;cursor:default;" @click.stop="notPickImage()">
                                </div>
                                <span class="change" @click="addPic" type="primary" style="display:block">{{load}}</span>
                                <i class="el-icon-loading" v-show="radis_pic"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item  class="mt20 pb20 fr" v-if="bGreat">
                            <span @click="confirm" class="sf-memberInfo-btn">确定</span>
                            <span @click="sfCancel" class=" ml20 sf-memberInfo-cancel sf-memberInfo-btn">取消</span>
                        </el-form-item>

                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    require('../../scss/great.scss');
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
                showUploadList: false,
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
                },
                artist: {},
                is:0,
                radio:"0",
                sfRradio:"0",
                bShow:false,
                bGreat:false,
                oGreatInfo:{
                    address:"",
                    detail:"",
                    name:"",
                    phone:"",
                    radis_pic: '',
                    coveImg: '',
                    alipay:''
                },
                form: {
                    token: '',
                    key: null
                },
                load: '上传图片',
                radis_pic: false,

            }
        },
        created() {
                this.render();
        },
        methods: {
            render() {
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                let data={
                    id:self.$route.query.id
                };
                self.$http.post(self.HOST+'/user/info/',data).then(function(data){
                    if(data.data.status == 1){
                        self.addMsg = data.data.data.user_info;
                        if(self.addMsg.type === 3){
                            self.radio = "1";
                            self.sfRadio = "1";
                        }else{
                            self.radio = "0";
                            self.sfRadio = "0";
                        }
                        self.artist=data.data.data.signedAuthor_info;
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
                    }
                });
            },
            modification(){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.bShow = true;
            },
            save(){
                let self = this,type;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(self.radio === "1"){
                   type = "3";
                    self.radio = "1";
                }else{
                    type = "1";
                    self.radio = "0";
                }
                let data={
                    id:self.$route.query.id,
                    type:type
                };
                if (self.turnBtnState) {
                    self.turnBtnState = false;
                    self.$http.post(self.HOST + '/user/downgrade', data).then(function (data) {
                        if (data.data.status == 1) {
                            self.bShow = false;
                            Toast.makeText('修改成功');
                            self.render();
                            self.turnBtnState = true;
                        } else {
                            self.turnBtnState = true;
                            self.cancel();
                        }
                    });
                }
            },
            cancel(){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.radio = self.sfRadio;
                self.bShow = false;

            },
            confirm(){
                let self = this;
                let reg ;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(!self.oGreatInfo.address){
                    Toast.makeText("通讯地址不能空");
                    return;
                }
                if(!self.oGreatInfo.address.replace(/\s/ig,''))
                {
                    Toast.makeText("通讯地址不能为空格");
                    return;
                }
                if(!self.oGreatInfo.name){
                    Toast.makeText("联系人不能空");
                    return;
                }
                if(!self.oGreatInfo.name.replace(/\s/ig,''))
                {
                    Toast.makeText("联系人不能为空格");
                    return;
                }
                if(!self.oGreatInfo.phone){
                    Toast.makeText("联系方式不能空");
                    return;
                }
                if(!self.oGreatInfo.phone.replace(/\s/ig,''))
                {
                    Toast.makeText("联系方式不能为空格");
                    return;
                }
//                验证手机号码
                reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
                if(!reg.test(self.oGreatInfo.phone)){
                   Toast.makeText("联系方式格式不正确");
                   return;
                }
                if(!self.oGreatInfo.detail){
                    Toast.makeText("个人介绍不能空");
                    return;
                }
                if(!self.oGreatInfo.detail.replace(/\s/ig,''))
                {
                    Toast.makeText("个人介绍不能为空格");
                    return;
                }
                if(!self.oGreatInfo.alipay){
                   Toast.makeText('请输入支付宝账号');
                   return;
                }
                if(!self.oGreatInfo.coveImg){
                    Toast.makeText("请上传个人宣传图");
                    return;
                }
                let data={
                    id:self.$route.query.id,
                    contact_address:self.oGreatInfo.address,
                    contact_name:self.oGreatInfo.name,
                    contact_phone:self.oGreatInfo.phone,
                    detail:self.oGreatInfo.detail,
                    type:"2",
                    background_pic:self.oGreatInfo.coveImg,
                    payNumb:self.oGreatInfo.alipay
                };
                if (self.turnBtnState) {
                    self.turnBtnState = false;
                    self.$http.post(self.HOST+'/user/upgrade',data).then(function(data){
                        if(data.data.status === 1){
                            Toast.makeText("升级成功");
                            self.turnBtnState = true;
                            self.$router.push('/detailsGreat?id='+self.$route.query.id);
                        }else{
                            Toast.makeText(data.data.msg);
                            self.turnBtnState = true;
                        }
                    });
                }
            },
            sfCancel(){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.bGreat = false;
                self.radis_pic = false;
                self.oGreatInfo.radis_pic = "";
                self.oGreatInfo.coveImg = "";
                self.load = '上传图片';

                self.oGreatInfo.address = "";
                self.oGreatInfo.detail = "";
                self.oGreatInfo.name = "";
                self.oGreatInfo.phone = "";
            },
            great(){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                  if('SWDS'.isLimit()){
                self.bGreat = true;
               }else{
                self.bGreat = false;
                Toast.makeText('无权访问!');
             }   
            },
            coverPreview(file) {
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                this.radis_pic = false;
                this.oGreatInfo.radis_pic = this.hret + file.key;
                this.oGreatInfo.coveImg = this.hret + file.key;
                this.load = '更换';
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
                let self = this;
                if(!window.navigator.onLine){
					window.location.reload();
					return false;
				}
                self.$http.post(self.HOST+'/rollbackPic').then(function(data){
                    self.form.token = data.data.utoken;
                    self.hret = data.data.onlineUrl;
                });
            },
            notPickImage(){

            },
        }
    }
</script>

<style scoped>
    .addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
    .addsset-main{width:500px;margin:0 auto;padding-top:30px;word-break: break-all;word-wrap: break-word;}
    .button{display: block;margin-top:10px;}
    .portrait{width:80px;height:80px;}
    .el-form-item{margin-bottom: 10px!important;}
</style>