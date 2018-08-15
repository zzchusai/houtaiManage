<template>
    <div class="main">
        <div class="main-top zoom">
            <div class="lf">首页管理 / <span class="zClr-999">banner管理/</span>
                <span class="zClr-999">添加banner</span>
            </div>
        </div>
        <div class="page mr30">
            <div class="page-info">
                <el-form  style="min-height: 500px;" label-width="75px"  v-model="addBannerForm" :rules="rules" class="mt10">
                   <!--选择类型-->
                    <el-form-item label="选择类型:">
                        <el-select style="width: 300px;"  v-model="addBannerForm.type" @change="selChange">
                            <el-option v-for="item in type" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--ID-->
                    <el-form-item label="ID:">
                        <el-autocomplete
                            v-model="addBannerForm.id"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容id"
                            @select="handleSelect"
                        ></el-autocomplete>
                    </el-form-item>
                    <!--内容名称-->
                    <el-form-item label="内容名称:">
                        <el-input style="width: 300px;"  :disabled="true" v-model="addBannerForm.content" size="normal"></el-input>
                    </el-form-item>
                    <!--上传banner图片-->
                    <el-form-item label="banner:">
                        <el-upload action='http://upload-z0.qiniu.com'
                                   :show-file-list='showUploadList'
                                   :on-success="coverPreview"
                                   :before-upload="coverUpload"
                                   :data='form'>
                            <div class="fl mt10">
                                <img v-if="addBannerForm.radis_pic" :src="addBannerForm.coveImg" class="avatar ml10" style="width: 750px;height: 400px;cursor:default" @click.stop="notPickImage()">
                                <span class="ml10 mt10" style="display: inline-block;"> 尺寸 : 750 * 400</span>
                            </div>
                             <span class='change' style="margin-top:12px;display:block;text-align:center" @click="addPic" type="primary">{{load}}</span>
                            <i class="el-icon-loading" v-show="radis_pic"></i>
                        </el-upload>
                    </el-form-item>
                    <!--保存取消按钮-->
                    <el-form-item class="mt30" :model="addBannerForm">
                        <div class="addVioce-btn zoom fr mt30 mb30" style="margin-right: 50px;">
                            <el-button v-if="bSendTag" class="btn-main button" style="top:0;right:0;" type="primary" @click="onSubmit">确定</el-button>
                            <el-button v-else class="btn-main button" style="top:0;right:0;background-color: #929292!important;" type="primary">确定</el-button>
                            <el-button class="button back" style="top:0;right:100px" type="primary" @click="cancel">取消</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!--弹出层对话框组件-->
        <sf-popups :message="sfMessage" @sfCancel="sfCancel()" @sfConfirm="sfConfirm()" v-show="bModel"></sf-popups>
    </div>
</template>
<script>
import sfPopups from '../../../component/popups/popups.vue';
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
};
export default {
    data() {
        return  {
            bSendTag: true,
            turnBtnState: true,//防止重复递交
            sfMessage:"取消后内容不再保留，确定取消？",
            bModel:false,
            addBannerForm: {
                id: "",
                radis_pic: "",
                coveImg: "",
                content: "",
                type:'1'
            },
            type: [{value: "1", label: "活动"}, {value: "2", label: "文章"}],

            rules: {
                type: [{required: false, message: " ", trigger: "blur"}],
                id: [{required: false, message: " ", trigger: "blur"}],
                content: [{required: false, message: " ", trigger: "blur"}]
            },
            // 上传图片
            showUploadList: false,
            load: "点击上传",
            radis_pic: false,
            form: {
                token: "",
                key: null
            },
            timeId: "",
            queryString: "",
            queryCallback: "",
            ajaxData: ""
        };
    },
    created() {
    },
    components: {
        sfPopups,
    },
    mounted() {
    },
    methods: {
        selChange() {
            if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            this.addBannerForm.id = "";
            this.addBannerForm.content = "";
        },
        querySearchAsync(queryString, callback) {
            if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            let time = 2000,
                    self = this,
                    arr = [];
            self.queryString = queryString;
            if (this.timeId) {
                clearTimeout(this.timeId);
                if (this.queryCallback) {
                    this.queryCallback(arr);
                }
            }
            if (queryString) {
                if (!self.addBannerForm.type) {
                    Toast.makeText("请选择类型", 3000);
                    callback(arr);
                } else {
                    this.timeId = setTimeout(function () {
                        let queryData = {
                            id: self.queryString,
                            type: self.addBannerForm.type
                        }
                        self.$http.post(self.HOST + '/banner/show_title', queryData).then(function (data) {
                            if (data.data.status === 1) {
                                let typeData = [{
                                    id: queryData.id,
                                    value: data.data.data.title
                                }];
                                this.addBannerForm.content = "";
                                callback(typeData);

                            } else {
                                callback();//关闭等待搜索框
                                Toast.makeText('未搜索到结果');
                                this.addBannerForm.content = "";
                                return;
                            }
                        });
                    }, time);
                }
            } else {
                callback(arr);
                this.addBannerForm.content = "";
            }
        },
        handleSelect(data) {
            this.addBannerForm.content = data.value;
            this.addBannerForm.id = this.queryString;
        },
        // 图片上传方法
        coverPreview(file) {
            if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            this.radis_pic = false;
            this.addBannerForm.radis_pic = this.hret + file.key;
            this.addBannerForm.coveImg = this.hret + file.key;
            this.load = "更换";
        },
        coverUpload(file) {
            if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            if (
                    file.type === "image/jpeg" ||
                    file.type === "image/png" ||
                    file.type === "image/gif"
            ) {
                this.form.key = sfFileName(file.name);
                this.radis_pic = true;
            } else {
                Toast.makeText("请选择正确的图片格式", 3000);
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
            self.$http.post(self.HOST + "/rollbackPic").then(function (data) {
                self.form.token = data.data.utoken;
                self.hret = data.data.onlineUrl;
            });
        },
        onSubmit() {
            let self = this,bannerData={};
           if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            if (self.turnBtnState) {
                self.turnBtnState = false;
                if(!self.addBannerForm.type){
                    Toast.makeText('请选择类型');
                    self.turnBtnState = true;
                    return;
                }
                if(!self.addBannerForm.id){
                    Toast.makeText('请输入ID');
                    self.turnBtnState = true;
                    return;
                }
                if(!self.addBannerForm.content){
                    Toast.makeText('请输入内容名称');
                    self.turnBtnState = true;
                    return;
                }
                if(!self.addBannerForm.radis_pic){
                    Toast.makeText('请上传图片');
                    self.turnBtnState = true;
                    return;
                }
                bannerData = {
                    type:self.addBannerForm.type,
                    multi_id:self.addBannerForm.id,
                    title:self.addBannerForm.content,
                    banner_pic:self.addBannerForm.radis_pic
                };
                console.log(bannerData);
                self.$http.post(self.HOST+'/banner/save',bannerData).then(function(data){
                    if(data.data.status === 1){
                        Toast.makeText('添加banner成功');
                        self.turnBtnState = true;
                        self.$router.push('/banner');
                    }else{
                        Toast.makeText(data.data.msg);
                        self.turnBtnState = true;
                    }
                });
            }
        },
        cancel(){
            let vm = this;
            if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            vm.bModel = true;
        },
        sfCancel(){
            let vm = this;
            if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            vm.bModel = false;
        },
        sfConfirm(){
            let vm = this;
            if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            this.$router.push('/banner');
        },
        notPickImage(){

        },
    }
}
</script>