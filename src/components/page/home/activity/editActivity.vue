<template>
    <div class="fl sf-main">
        <div class="main-top zoom pl30">
            <div class="lf">首页管理 / <span class="zClr-999">活动管理/</span>
                <span class="zClr-999">编辑活动</span>
            </div>
        </div>
        <div class="sf-page">
            <el-form ref="data" :model="data" :rules="rules" class="sf-form">
                <!--标题-->
                <el-form-item prop="name" class="sf-title">
                    <el-input v-model="data.name" placeholder="请输入活动标题"></el-input>
                </el-form-item>
                <!--富文本编辑器-->
                <el-form-item>
                    <div class="edit">
                        <!-- quill-editor插件标签 分别绑定各个事件-->
                        <quill-editor v-model="audio_introduce" class='editor' ref="myQuillEditor" :config="editorOption" @focus="onEditorFocus($event)" @change="onEditorChange($event)">
                        </quill-editor>
                        <div v-show='true' class="limit">当前已输入 <span>{{nowLength}}</span> 个字符，您还可以输入 <span>{{SurplusLength}}</span> 个字符。</div>
                        <!-- 文件上传input 将它隐藏-->
                        <el-upload action='http://upload-z0.qiniu.com' :show-file-list='fullscreenLoading' :on-success="upScuccessEdit" :on-error="errUpload" :before-upload="beforeUploadEdit" :data='uploadDataEdit'>
                            <el-button size="small" id='imgInput' style='display:none;' class="btn-box btn-file upload" @click="addPicEdit" type="primary"></el-button>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="请上传分享用图：" prop='share_pic'>
                    <!-- <i class="fbt_sign" style='margin-left:-135px'>*</i> -->
                    <el-input style="display: none" v-model="data.share_img"></el-input>
                    <el-upload action='http://upload-z0.qiniu.com' :show-file-list='false' :on-success="coverPreview" :before-upload="coverUpload" :data='form'>
                        <img v-if="data.share_img" :src="data.share_img" class="avatar" style="width: 200px; height: 123px;cursor:default" @click.stop="notPickImage()">
                        <span size="small" class="change" @click='subscript(0)' type="primary">更换</span>
                        <i class="el-icon-loading" v-show="share_pic"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="设置分享标题 : " prop="share_title" class="sf-author mt20">
                    <el-input v-model="data.share_title" placeholder="请输入分享标题" class="el-input__inner1" size="normal"></el-input>
                </el-form-item>
                <el-form-item label="设置分享简介 : " prop="share_intro" class="sf-author mt20 ">
                    <el-input v-model="data.share_intro" placeholder="运营自己写" class="el-input__inner1" size="normal"></el-input>
                </el-form-item>
                <!--保存取消按钮-->
                <el-form ref="data" :model="data" :rules="rules">
                    <div class="addVioce-btn zoom fr mt30" style="margin-right: 50px;margin-bottom:50px">
                        <el-button v-if="bSendTag" class="btn-main button" style="top:0;right:0;" type="primary" @click="submint('data')">发表</el-button>
                        <el-button v-else class="btn-main button" style="top:0;right:0;background-color: #929292!important;" type="primary">发表</el-button>
                        <el-button class="button back" style="top:0;right:100px" type="primary" @click="isShow">退出</el-button>
                    </div>
                </el-form>
            </el-form>
        </div>
        <!--弹出层对话框组件-->
        <sf-popups :message="sfMessage" @sfCancel="isShow()" @sfConfirm="goto()" v-show="modelAdd"></sf-popups>
    </div>
</template>
<script>
    require('../../../scss/activity/index.scss');
    import sfPopups from '../../../component/popups/popups.vue';
    let qiniu = require('qiniu-js');
    let Toast = {
        elem: document.querySelector("#toast"),
        timer: "",
        makeText: function(info, time) {
            this.show();
            this.elem.innerHTML = info;
            this.elem.style.marginLeft = -1 * (this.elem.clientWidth / 2) + "px";
            this.timer = setTimeout(this.hide.bind(this), time || 1000);
        },
        show: function() {
            if (this.elem == null) {
                let node = document.createElement("div");
                node.setAttribute("id", "toast");
                node.className = "toast";
                document.body.appendChild(node);
                this.elem = document.querySelector("#toast");
            }
            if (this.timer) {
                window.clearTimeout(this.timer);
            }
            $.fn.addClass.call($(this.elem), "active");
        },
        hide: function() {
            $.fn.removeClass.call($(this.elem), "active");
        }
    }
    export default {
        data() {
            return {
                editID: 0,
                modelAdd: false,
                bSendTag: true,
                sfMessage: '退出后内容不再保留，确定退出？',
                turnBtnState: true, //防止重复递交
                form: {
                    token: '',
                    key: null
                },
                hret: '',
                showUploadList: false,
                data: {
                    name: '',
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入活动标题',
                        trigger: 'blur'
                    }],
                },
                cover: '上传图片',
                share_pic: false,
                //富文本变量
                audio_introduce: '', // 文章内容
                editorOption: {
                    syntax: {
                        highlight: text => hljs.highlightAuto(text).value
                    },
                    modules: {
                        toolbar: [
                            ['bold'], // toggled buttons
                            [{
                                'header': 1
                            }, {
                                'header': 2
                            }],
                            [{
                                    'color': ['#ee0000', '00ee00', '#0000ee', '#ffffff', '#cccccc', '#888888', '#333333']
                                },
                                {
                                    'background': ['#ee0000', '00ee00', '#0000ee', '#ffffff', '#cccccc', '#888888', '#333333']
                                }
                            ],
                            //                        ['video'],
                            ['image']
                        ]
                    },
                    placeholder: '编辑内容...'
                }, // 编辑器选项
                addRange: new Array(),
                //图片上传附带的参数
                uploadDataEdit: {
                    token: '',
                    key: null
                },
                imgBaseUrl: '',
                photoUrl: '', // 上传图片地址
                uploadType: '', // 上传的文件类型（图片、视频）
                fullscreenLoading: false, //是否显示已上传文件列表
                editImage: false,
                nowLength: 0, //当前字符
                SurplusLength: 10000, // 剩余字符
                //富文本结束
                sf_logo_icon: this.macro.sf_logo_icon
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
            this.$refs.myQuillEditor.quillEditor.theme.quill.getModule('toolbar').addHandler('image', this.imgHandler);
        },
        methods: {
            // 图片上传成功回调 插入到编辑器中
            //             upScuccessEdit(e, file, fileList) {
            // //                是否显示文件列表
            //                 this.fullscreenLoading = false;
            //                 let vm = this;
            //                 qiniu.imageInfo(e.key, 'http://p22xgx5t3.bkt.clouddn.com').then(res => {
            //                     let url = this.imgBaseUrl + e.key + '?'+res.data.width + '*'+ res.data.height;
            //                 if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
            //                     let value = url
            //                     vm.addRange = vm.$refs.myQuillEditor.quillEditor.theme.quill.getSelection();
            //                     value = value.indexOf('http') !== -1 ? value : 'http:' + value;
            //                     vm.$refs.myQuillEditor.quillEditor.theme.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
            //                 } else {
            //                     //  插入失败
            //                 }
            //             });
            //             },
            // 图片上传成功回调 插入到编辑器中
            upScuccessEdit(e, file, fileList) {
                //                是否显示文件列表
                this.fullscreenLoading = false;
                let vm = this;
                // this.addMsg.radio_url = self.imgBaseUrl+response.key;
                // 'http://p22xgx5t3.bkt.clouddn.com'
                qiniu.imageInfo(e.key, this.imgBaseUrl).then(res => {
                    let url = this.imgBaseUrl + e.key + '?' + res.data.width + '*' + res.data.height;
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
            coverPreview(file) {
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                this.share_pic = false;
                this.data.share_img = this.hret1 + file.key;
                this.data.coveImg = this.hret1 + file.key;
                this.cover = '更换图片';
            },
            coverUpload(file) {
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
                    this.form.key = sfFileName(file.name);
                    this.share_pic = true;
                } else {
                    Toast.makeText('请选择正确的图片格式', 3000);
                    return false;
                }
            },
            //图片按钮绑定事件
            imgHandler(state) {
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                this.addRange = this.$refs.myQuillEditor.quillEditor.theme.quill.getSelection();
                if (state) {
                    let fileInput = document.getElementById('imgInput')
                    fileInput.click() // 加一个触发事件
                }
                this.uploadType = 'image';
            },
            //图片上传失败时的回调方法
            errUpload(file) {
                this.fullscreenLoading = false;
                Toast.makeText('上传失败，请重试！', 3000);
            },
            //上传图片之前的回调
            beforeUploadEdit(file) {
                if (file.type === 'image/jpeg' || file.type === 'image/png') {
                    this.uploadDataEdit.key = sfFileName(file.name);
                    this.fullscreenLoading = false;
                } else {
                    Toast.makeText('请选择正确的图片格式(简介仅支持jpg和png)', 3000);
                    return false;
                }
            },
            //上传组件上传到服务器方法
            addPicEdit() {
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                this.uptokenEditPic();
            },
            uptokenEditPic() {
                let self = this;
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                self.$http.post(self.HOST + '/rollbackPic').then(function(data) {
                    self.uploadDataEdit.token = data.data.utoken;
                    self.imgBaseUrl = data.data.onlineUrl;
                });
            },
            //富文本编辑起始处
            onEditorFocus(editor) {
                editor.enable(true) // 实现达到上限字符可删除
            },
            onEditorChange({
                editor,
                html,
                text
            }) {
                let textLength = text.length
                this.nowLength = textLength - 1;
                this.SurplusLength = 10000 - this.nowLength;
                if (this.SurplusLength <= 0) {
                    this.SurplusLength = 0;
                    this.bSendTag = false;
                }
                if (this.nowLength <= 10000) {
                    this.bSendTag = true;
                }
                //                if (textLength > 10000) {
                //                    Toast.makeText('最多输入10000个字符',2000);
                //                    editor.enable(false)
                //                }
            },
            subscript(index) {
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                this.index = index;
                this.uptokenPic();
            },
            uptokenPic() {
                let self = this;
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                self.$http.post(self.HOST + '/rollbackPic').then(function(data) {
                    self.form.token = data.data.utoken;
                    self.hret1 = data.data.onlineUrl;
                });
            },
            //表单递交
            submint(data) {
                let self = this;
                let activityData = '',
                    temp = 0,
                    i = 0,
                    arr = [],
                    str = '',
                    imginfo = [],
                    pArr = [],
                    count;
                let mark = "<!--IMG#";
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                if (self.turnBtnState) {
                    self.$refs[data].validate((valid) => {
                        if (valid) {
                            self.turnBtnState = false;
                            str = self.audio_introduce.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
                                arr.push(capture);
                                return mark + (temp++) + '-->';
                            });
                            if (!self.data.name.replace(/\s/ig, '')) {
                                Toast.makeText('标题不能为空格');
                                self.turnBtnState = true;
                                return;
                            }
                            for (let y = 0; y < arr.length; y++) {
                                // if(arr[y].indexOf("http://p22xgx5t3.bkt.clouddn.com") === -1){
                                //     Toast.makeText('请将图片上传到七牛云');
                                //     self.turnBtnState = true;
                                //     return;
                                // }
                                let cnm = {
                                    pixel: arr[y].substr(arr[y].lastIndexOf("?") + 1),
                                    ref: mark + (i++) + '-->',
                                    src: arr[y].substr(0, arr[y].lastIndexOf("?")),
                                };
                                imginfo.push(cnm);
                            }
                            let imginfos = imginfo;
                            if (!self.audio_introduce) {
                                Toast.makeText('活动内容不能为空');
                                // console.log(self.audio_introduce);
                                self.turnBtnState = true;
                                return;
                            }
                            //判断富文本编辑器内容不能全为空格
                            $(".ql-editor").each(function() {
                                count = $(this).find("img").length;
                            });
                            if (!count) {
                                if (!$(".ql-editor").text().replace(/\s/g, "").length) {
                                    Toast.makeText('活动内容不能全为空格');
                                    self.turnBtnState = true;
                                    return;
                                }
                            }
                            if (self.data.share_title == '') {
                                self.data.share_title = self.data.name
                            } else {
                                self.data.share_title = self.data.share_title
                            }
                            if (self.data.share_intro != '') {
                                self.data.share_intro = self.data.share_intro
                            } else {
                                self.data.share_intro = "我在#十方云水参加" + self.data.name + "的活动，奖品丰富，你也赶紧来参加吧~"
                            }
                            console.log(self.data.share_img)
                            console.log(self.sf_logo_icon)
                            if (self.data.share_img != self.sf_logo_icon) {
                                self.data.share_img = self.data.share_img;
                            } else {
                                //  console.log(imginfo.pop().src);
                                if (imginfo != '') {
                                    self.data.share_img = imginfo[0].src;
                                } else {
                                    self.data.share_img = self.sf_logo_icon;
                                }
                            }
                            activityData = {
                                content: str,
                                contentY: self.audio_introduce,
                                title: self.data.name,
                                imgsJson: imginfo,
                                id: self.editID,
                                share_img: self.data.share_img,
                                share_title: self.data.share_title,
                                share_intro: self.data.share_intro,
                            };
                            self.$http.post(self.HOST + '/active/update', activityData).then(function(data) {
                                if (data.data.status === 1) {
                                    Toast.makeText('发表成功');
                                    self.turnBtnState = true;
                                    self.goto();
                                } else {
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
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                this.isShow();
            },
            goto() {
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                // this.$router.push('/activity');
                this.$router.go(-1);
            },
            notPickImage() {
            },
            isShow() {
                let vm = this;
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                vm.modelAdd = !vm.modelAdd;
            },
            render() {
                let self = this,
                    total;
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                self.editID = self.$route.query.id;
                let data = {
                    id: self.editID
                };
                self.$http.post(self.HOST + '/active/update', data).then(function(data) {
                    if (data.data.status == 1) {
                        console.log(data.data.data);
                        self.data = data.data.data;
                        self.data.name = data.data.data.title;
                        self.audio_introduce = data.data.data.contentY;
                        self.cover = '更换图片';
                    } else {
                        alert(data.data.msg);
                    }
                });
            },
        }
    }
</script>
<style>
    .sf-form {}
    .el-input__inner1 {
        width: 20%;
    }
    .avatar {
        width: 180px;
        height: 180px;
        display: block;
        margin-bottom: 15px;
    }
    .sf-title input {
        border: 1px solid #ffffff;
        font-size: 16px;
        padding: 0px 30px 0px 0px;
        text-align: center;
        border-radius: 0;
    }
    .sf-title input:focus {
        border: 1px solid #ffffff;
    }
    .sf-title input:hover {
        border: 1px solid #ffffff;
    }
    .sf-form .el-form-item {
        margin-bottom: 0px;
    }
    .sf-form img {
        width: 50%;
    }
    .limit {
        float: right;
        color: #b0b6c7;
        font-size: 13px;
    }
</style>