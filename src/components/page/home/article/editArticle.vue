<template>
    <div class="fl sf-main">
        <div class="pl30 main-top zoom">
            <div class="lf">首页管理 / <span class="zClr-999">文章管理/</span>
                <span class="zClr-999">编辑文章</span>
            </div>
        </div>
        <div class="sf-page" style="height: 500px">
            <div class="page-info">
                <el-form  ref="data" :model="data" :rules="rules" class="sf-form">
                    <!--标题-->
                    <el-form-item class="sf-form-tile" prop="name">
                        <el-input v-model="data.name" placeholder="请输入文章标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="edit">
                            <!-- quill-editor插件标签 分别绑定各个事件-->
                            <quill-editor v-model="audio_introduce" class='editor' ref="myQuillEditor" :config="editorOption" @focus="onEditorFocus($event)"
                                          @change="onEditorChange($event)" >
                            </quill-editor>
                            <div v-show='true' class="limit">当前已输入 <span>{{nowLength}}</span> 个字符，您还可以输入 <span>{{SurplusLength}}</span> 个字符。</div>
                            <!-- 文件上传input 将它隐藏-->
                            <el-upload action='http://upload-z0.qiniu.com'
                                       :show-file-list='fullscreenLoading'
                                       :on-success="upScuccessEdit"
                                       :on-error="errUpload"
                                       :before-upload="beforeUploadEdit"
                                       :data='uploadDataEdit'>
                                <el-button size="small" id='imgInput' style='display:none;' class="btn-box btn-file upload" @click="addPicEdit" type="primary"></el-button>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <!--作者-->
                    <el-form-item label="作者 : " prop="author" class="sf-author" style="font-weight:900">
                        <i class="fbt_sign" style='margin-left:-60px;font-style:normal'>*</i>
                        <el-input v-model="data.author" placeholder="请输入作者名字" :maxlength="6" ></el-input>
                        <div class="sf-author-tag">(最多输入6个字)</div>
                    </el-form-item>
                    <el-form-item label="添加缩略图 : " prop="radis_pic" class="mt20" style="font-weight:900;color:#48576a">
                        <el-upload action='http://upload-z0.qiniu.com'
                                   :show-file-list='showUploadList'
                                   :on-success="coverPreview"
                                   :before-upload="coverUpload"
                                   :data='form'>
                                   <div style="float:left">
                            <!-- <div class="fl" v-if="data.coveImg"> -->
                                <img v-if="data.radis_pic" :src="data.coveImg" class="avatar" style="width: 200px;height: 123px;margin-bottom:10px;cursor:default" @click.stop='notPickImage()'>
                            <!-- </div> -->
                            <div style="width:200px;display:flex;justify-content:center">
                             <span class="change" style="line-height: 32px;" @click="addPic" type="primary">{{cover}}</span>
                            </div>

                            <i class="el-icon-loading" v-show="radis_pic"></i>
                                   </div>
                        <!-- <span class="fz1" style="display:flex;float:left;margin-top:100px;color:#333;margin-left:10px">(缩略图用于列表中的图片展示)</span> -->
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="请上传分享用图：" prop='share_pic'>
                        <i class="fbt_sign" style='margin-left:-135px;font-style:normal'>*</i>
                        <el-upload action='http://upload-z0.qiniu.com'
                                   :show-file-list='false'
                                   :on-success="shareCoverPreview"
                                   :before-upload="shareCoverUpload"
                                   :data='shareForm'>
                            <img v-if="data.share_pic" :src="data.share_img" class="avatar" style="width: 91px; height: 91px;display:block;margin-bottom:10px;margin-top:10px;cursor:default" @click.stop="notPickImage()">
                            <span size="small" class="change" @click='subscript(0)' type="primary">更换</span>
                            <i class="el-icon-loading" v-show="share_pic"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="设置分享标题 : " prop="title" class="sf-author mt20" >
                         <i class="fbt_sign" style='margin-left:-115px;font-style:normal'>*</i>
                        <el-input v-model="data.title" placeholder="请输入分享标题" class="el-input__inner1"></el-input>
                    </el-form-item>

                    <el-form-item label="设置分享简介 : " prop="intro" class="sf-author mt20 ">
                         <i class="fbt_sign" style='margin-left:-115px;font-style:normal'>*</i>
                        <el-input v-model="data.intro" placeholder="运营自己写" class="el-input__inner1"></el-input>
                    </el-form-item>
                    <el-form ref="data" :model="data" :rules="rules">
                        <div class="addVioce-btn zoom fr mt30" style="margin: 40px 0px 40px 0px">
                            <el-button v-if="bSendTag" class="btn-main button" style="top:0;right:0;" type="primary" @click="submint('data')">发表</el-button>
                            <el-button v-else class="btn-main button" style="top:0;right:0;background-color: #929292!important;" type="primary">发表</el-button>
                            <el-button class="button back" style="top:0;right:100px" type="primary" @click="isShow">退出</el-button>
                        </div>
                    </el-form>
                </el-form>
            </div>
        </div>
        <!--弹出层对话框组件-->
        <sf-popups :message="sfMessage" @sfCancel="isShow()" @sfConfirm="goto()" v-show="modelAdd"></sf-popups>
    </div>
</template>
<script>
    require('../../../scss/activity/index.scss');
    import sfPopups from '../../../component/popups/popups.vue';
    let qiniu = require('qiniu-js');

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
                ArticleID:0,
                modelAdd:false,
                bSendTag:true,
                sfMessage:'退出后内容不再保留，确定退出？',
                turnBtnState: true,//防止重复递交
                form: {
                    token: '',
                    key: null
                },
                load: '添加图片',
                radis_pic: false,
                hret: '',
                shareForm: {
                    token: '',
                    key: null
                },
                share_hret:'',
                showUploadList: false,
                data: {
                    name: '',
                    radis_pic: '',
                    coveImg: '',
                    author:'',
                    share_pic:'',
                    title:'',
                    intro:'',
                    share_img:''
                },
                cover: '',
                share_pic:false,
                rules: {
                    name: [{required: true,message: ' ',trigger: 'blur'}],
                    author:[{required:false,message: ' ',trigger: 'blur'}],
                },
                //富文本变量
                audio_introduce:'',    // 文章内容
                editorOption:{
                    syntax: {
                        highlight: text => hljs.highlightAuto(text).value
                },
                modules: {
                    toolbar: [
                            ['bold'],        // toggled buttons
                            [{'header': 1},{'header': 2}],
                            [{'color': ['#ee0000','00ee00','#0000ee', '#ffffff', '#cccccc', '#888888', '#333333']},
                                {'background': ['#ee0000','00ee00','#0000ee', '#ffffff', '#cccccc', '#888888', '#333333']}],
    //                        ['video'],
                            ['image'],
                        ]
                    },
                    placeholder: '编辑内容...'
                },    // 编辑器选项
                addRange: new Array(),
                //图片上传附带的参数
                uploadDataEdit : {
                    token: '',
                    key: null
                },
                imgBaseUrl:'',
                photoUrl:'',         // 上传图片地址
                uploadType:'',    // 上传的文件类型（图片、视频）
                fullscreenLoading: false, //是否显示已上传文件列表
                editImage:false,
                nowLength:0,//当前字符
                SurplusLength:10000,// 剩余字符
            //富文本结束
            }
        },
        created() {
            this.render();
        },
//        Vue组件声明
        components: {
            sfPopups,
        },
        mounted() {
            //富文本编辑器中图片按钮绑定事件
             if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            this.$refs.myQuillEditor.quillEditor.theme.quill.getModule('toolbar').addHandler('image', this.imgHandler);
        },
        methods: {
            // 图片上传成功回调 插入到编辑器中
            upScuccessEdit(e, file, fileList) {
//                是否显示文件列表
                this.fullscreenLoading = false;
                let vm = this;
                // this.addMsg.radio_url = self.imgBaseUrl+response.key;
                // 'http://p22xgx5t3.bkt.clouddn.com'
                console.log(this.imgBaseUrl);
                qiniu.imageInfo(e.key, this.imgBaseUrl).then(res => {
                    let url = this.imgBaseUrl + e.key + '?'+res.data.width + '*'+ res.data.height;
                    if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
                        let value = url
                        vm.addRange = vm.$refs.myQuillEditor.quillEditor.theme.quill.getSelection();
                        value = value.indexOf('http') !== -1 ? value : 'http:' + value;
                        vm.$refs.myQuillEditor.quillEditor.theme.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
                    } else {
                        //  插入失败
                    }
                });
            },
            //分享用图
            // coverPreview(file) {
            //     this.share_pic = false;
            //     this.data.share_img = this.hret1 + file.key;
            //     this.data.coveImga = this.hret1 + file.key;
            //     this.cover = '更换';
            // },
            //富文本编辑器图片按钮绑定事件
            imgHandler(state) {
                this.addRange = this.$refs.myQuillEditor.quillEditor.theme.quill.getSelection();
                if (state) {
                    let fileInput = document.getElementById('imgInput')
                    fileInput.click() // 加一个触发事件
                }
                this.uploadType = 'image';
            },
            //富文本编辑器图片上传失败时的回调方法
            errUpload(file) {
                this.fullscreenLoading = false;
                Toast.makeText('上传失败，请重试！',3000);
            },
            //富文本编辑器上传图片之前的回调
            beforeUploadEdit(file){
                if(file.type === 'image/jpeg' || file.type === 'image/png'){
                    this.uploadDataEdit.key = sfFileName(file.name);
                    this.fullscreenLoading = false;
                }else{
                    Toast.makeText('请选择正确的图片格式(简介仅支持jpg和png)',3000);
                    return false;
                }
            },
            //富文本编辑器上传组件上传到服务器方法
            addPicEdit() {
                this.uptokenEditPic();
            },
            uptokenEditPic() {
                let self = this;
                self.$http.post(self.HOST+'/rollbackPic').then(function(data){
                    self.uploadDataEdit.token = data.data.utoken;
                    self.imgBaseUrl = data.data.onlineUrl;
                });
            },

            //富文本编辑起始处
            onEditorFocus(editor) {
                editor.enable(true) // 实现达到上限字符可删除
            },
            onEditorChange({ editor, html, text }) {
                let textLength = text.length
                this.nowLength = textLength-1;
                this.SurplusLength = 10000 - this.nowLength;
                if (this.SurplusLength <= 0) {
                    this.SurplusLength = 0;
                    this.bSendTag = false;
                }
                if (this.nowLength <= 10000){
                    this.bSendTag = true;
                }else{
                    this.audio_introduce.length=10000;
                    this.nowLength=10000;
                    Toast.makeText('输入字符超过上限')
                }
            },
            //表单递交
            submint(data) {
                let self = this,cnm={};
                let editArticleData = '',temp = 0,i= 0,arr = [],str = '',imginfo=[],pArr = [],count;
                let mark = "<!--IMG#";
                if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(self.turnBtnState){
                    self.$refs[data].validate((valid) =>{
                        if(valid ) {
                            self.turnBtnState = false;
                            str = self.audio_introduce.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                                arr.push(capture);
                                return mark + (temp++) +'-->';
                            });
                            if(!self.data.name.replace(/\s/ig,'')){
                                Toast.makeText('标题不能为空格');
                                self.turnBtnState = true;
                                return;
                            }
                            for(let y=0; y < arr.length; y++){
                                // if(arr[y].indexOf("http://p22xgx5t3.bkt.clouddn.com") === -1){
                                //     Toast.makeText('请将图片上传到七牛云');
                                //     self.turnBtnState = true;
                                //     return;
                                // }
                                let cnm= {
                                    pixel:arr[y].substr(arr[y].lastIndexOf("?")+1),
                                    ref :mark + (i++) +'-->',
                                    src :arr[y].substr(0,arr[y].lastIndexOf("?")),
                                };
                                imginfo.push(cnm);
                            }
                            if(!self.audio_introduce){
                                Toast.makeText('活动内容不能为空');
                                self.turnBtnState = true;
                                return;
                            }
                            //判断富文本编辑器内容不能全为空格
                            $(".ql-editor").each(function(){
                                count = $(this).find("img").length;
                            });
                            if(!count){
                                if(!$(".ql-editor").text().replace(/\s/g,"").length){
                                    Toast.makeText('活动内容不能全为空格');
                                    self.turnBtnState = true;
                                    return;
                                }
                            }
//                             判断作者不能为空
                            if(!self.data.author){
                                Toast.makeText('作者不能为空');
                                self.turnBtnState = true;
                                return;
                            }
                            //判断作者名不能为空格
                            if(!self.data.author.replace(/\s/ig,'')){
                                Toast.makeText('作者不能为空格');
                                self.turnBtnState = true;
                                return;
                            }
                            if(!self.data.intro){
                                  Toast.makeText('分享简介不能为空');
                                self.turnBtnState = true;
                                return;
                            }
                            console.log(imginfo)
                            if(self.data.title==''){
                                self.data.title= self.data.name
                            }else{
                                self.data.title=self.data.title
                            }
                            editArticleData = {
                                content:str,
                                contentY:self.audio_introduce,
                                title: self.data.name,
                                imgsJson:imginfo,
                                author:self.data.author,
                                pic:self.data.coveImg,
                                id:self.ArticleID,
                                share_img:self.data.share_img,
                                share_title:self.data.title,
                                share_intro:self.data.intro
                            };
                            self.$http.post(self.HOST+'/article/update',editArticleData).then(function(data){
                                if(data.data.status === 1){
                                    Toast.makeText('发表成功');
                                    self.turnBtnState = true;
                                    this.goto();
                                }else{
                                    Toast.makeText('发表失败');
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
                this.isShow();
            },
            goto(){
                if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                // this.$router.push('/article');
                this.$router.go(-1);
            },
            isShow(){
                let vm = this;
                if (!window.navigator.onLine) {
                    window.location.reload();
                    return false;
                }
                vm.modelAdd = !vm.modelAdd;
            },
           subscript(){
                let self = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.$http.post(self.HOST+'/rollbackPic').then(function(data){
                    self.shareForm.token = data.data.utoken;
                    self.share_hret = data.data.onlineUrl;
                });
            },
            coverPreview(file) {
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                this.radis_pic = false;
                this.data.radis_pic = this.hret + file.key;
                this.data.coveImg = this.hret + file.key;
                this.cover= '更换';
            },
            shareCoverPreview(file){
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                this.share_pic = false;
                this.data.share_img = this.share_hret + file.key;
                this.data.share_pic = this.hret + file.key;
                this.load = '更换';
            },
            coverUpload (file) {
                 if (window.navigator.onLine==false) {
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
             shareCoverUpload (file) {
                  if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
                    this.shareForm.key = sfFileName(file.name);
                    this.share_pic = true;
                }else{
                    Toast.makeText('请选择正确的图片格式',3000);
                    return false;
                }
            },
            addPic() {
                this.uptokenPic();
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
            render(){
                let self = this,total;
                if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.ArticleID = self.$route.query.id;
                let data = {
                    id:self.ArticleID
                };
                self.$http.post(self.HOST+'/article/update',data).then(function(data){
                    // console.log(data.data.data);
                    if(data.data.status == 1){
                        console.log(data.data.data.share_intro);
                        self.data.name = data.data.data.title;
                        self.data.author = data.data.data.author;
                        self.audio_introduce = data.data.data.contentY;
                        self.load = "更换图片";
                        // self.cover="添加图片";
                        if( data.data.data.pic==''){
                            self.data.radis_pic = false;
                            self.cover='上传图片'
                        }else{
                            self.data.radis_pic=true;
                           self.data.coveImg = data.data.data.pic;
                           self.cover='更换'
                        }
                        self.data.share_pic = true;
                        self.data.share_img=data.data.data.share_img;
                        self.data.title=data.data.data.share_title;
                        self.data.intro=data.data.data.share_intro
                    }else{
                        alert(data.data.msg);
                    }
                });
            },

        }
    }
</script>
<style>
    .sf-form{}

    .sf-form-tile input{
        border: 1px solid #ffffff;
        font-size: 16px;
        padding: 0px 30px 0px 0px;
        text-align: center;
        border-radius:0;
    }
    .sf-form-tile input:focus{
        border: 1px solid #ffffff;
    }
    .sf-form-tile input:hover{
        border: 1px solid #ffffff;
    }

    .sf-form .el-form-item {
        margin-bottom: 0px;
    }
    .sf-form img{
        width: 50%;
    }
    /* .fl{
        float: none;
    } */
    .limit{
        float:right;
        color: #b0b6c7;
        font-size: 13px;
    }
    .sf-author input{
        width: 200px;
    }
    .sf-author .el-input{
        width: 0;
    }
    .sf-author-tag {
        color: #b0b6c7;
        margin-left: 47px;
    }
    .sf-btn{
        height:32px;
        padding:0 15px;
        margin-right:15px;
    }
    .avatar{
        width: 91px;
        height: 91px;
    }
</style>