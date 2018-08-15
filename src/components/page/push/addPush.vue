<template>
    <div class="fl sf-main">
        <div class="main-top zoom pl30">
            <div class="lf">推送管理 / <span class="zClr-999">添加推送</span></div>
        </div>
        <div class="sf-addPush">
            <div class="sf-addPush-form">
                <el-form ref="addMsg" :model="addMsg" :rules="rules" label-width="135px">
                    <el-form-item label="选择类型：" >
                        <el-select class="sf-addPush-w300" v-model="addMsg.type"  placeholder="请选择" @change='changeType()'>
                            <el-option v-for="item in type" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="addMsg.type !== '4'" label="ID：" placeholder="请输入ID">
                        <el-input class="sf-addPush-w300" v-model="addMsg.id"  placeholder="请输入ID"></el-input>
                        <span @click="onPreview" class="sf-addPush-show">预览</span>
                    </el-form-item>
                    <el-form-item style="margin-bottom:10px;" label="标题：">
                        <el-input class="sf-addPush-w300" v-model="addMsg.title" placeholder="请输入标题" :maxlength="12" ></el-input>
                        <div class="sf-color-grayfont sf-font14">(标题最多输入12个字)</div>
                    </el-form-item>
                    <el-form-item style="margin-bottom:10px" label="内容：" prop="content">
                        <el-input class="sf-addPush-w300" v-model="addMsg.content" placeholder="请输入内容" :maxlength="30"></el-input>
                        <div class="sf-color-grayfont sf-font14">(内容最多输入30个字)</div>
                    </el-form-item>
                    <el-form-item style="margin-bottom:10px" label="目标用户：">
                        <el-radio v-model="addMsg.radio" label="2">所有用户</el-radio>
                        <el-radio v-model="addMsg.radio" label="3" v-if="addMsg.type == '4'">个人用户</el-radio>
                    </el-form-item>
                    <el-form-item label="选择用户：" v-if="addMsg.radio=='3'">
                        <el-input class="sf-addPush-w300" v-model="addMsg.phone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="推送时间：">
                        <el-radio v-model="addMsg.immediate" label="0">立即</el-radio>
                        <el-radio v-model="addMsg.immediate" label="1">定时</el-radio>
                    </el-form-item>
                    <el-form-item label="设置推送时间：" v-if='addMsg.immediate==1'>
                        <el-date-picker v-model="addMsg.time" type="datetime"
                                        :editable = 'false'
                                        :clearable='false'
                                        :picker-options="limitStartTime"
                                        placeholder="选择时间">
                        </el-date-picker>
                    </el-form-item>
                    <div class="addStaff-btn zoom fr mt10">
                        <el-button class="sf-addPush-back btn-main button knob" type="primary" @click="onConfirm">确 定 推 送</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    require('../../scss/push.scss');
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
                    limitStartTime:{
                        disabledDate: (time) =>{
                            let date = new Date();
                            date.setDate(date.getDate()-parseInt(1));
                            return time.getTime() <= new Date(date);
                        }
                    },
                iTag:0,
                addMsg: {
                    type:'1',
                    id: '',
                    title: '',
                    content: '',
                    radio:'2',
                    immediate:'0',
                    time:'',
                    phone: '',
                    style: 1,
                    user_id: 0
                },
                rules: {},
                iCurrentTime:0,
                turnBtnState:true,
                type: [{value: "1", label: "活动"}, {value: "2", label: "文章"},{value: "3", label: "节目"},{value: "4", label: "系统推送"}]
            }
        },
        created() {
        },
        components: {
        },
        methods: {
            onPreview(){
                let self = this,data;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(!self.addMsg.id){
                    return Toast.makeText("ID不能空");
                }
                if(!self.addMsg.id.replace(/\s/ig,'')){
                    return  Toast.makeText("ID不能为空格");
                }
                self.addMsg.id = self.addMsg.id.replace(/\s/ig,'');
                data = {
                    id:self.addMsg.id,
                    type:self.addMsg.type
                };
                if (self.turnBtnState) {
                    self.turnBtnState = false;
//                    先打开一个页面，在ajax回调函数中把当前页重定向到目标页面,解决浏览器拦截新窗口问题
                    let newWin = window.open('about:blank');
                    newWin.document.body.innerHTML = '加载中...';
                    self.$http.post(self.HOST+'/propelling/preview',data).then(function(data){
                        self.iTag = data.data.status;
                        if(data.data.status === 1){
                            self.turnBtnState = true;
                            switch (self.addMsg.type){
                                case '1':
                                    newWin.location.href = '/details?id='+self.addMsg.id;
                                    break;
                                case '2':
                                    newWin.location.href ='/detailsArticle?id='+self.addMsg.id;
                                    break;
                                case '3':
                                        if(!data.data.type){
                                            newWin.location.href ='/progDetail?id='+self.addMsg.id+'&type=1';
                                        }else{
                                            newWin.location.href ='/error?type=1';
                                        }
                                    break;
                            }
                        }else{
//                            Toast.makeText("此ID不存在");
                            newWin.location.href ='/error';
                            self.turnBtnState = true;
                        }
                    });
                }
            },
            changeType(){
                if(this.addMsg.type != 4) {
                    this.addMsg.radio = '2';//设置所有用户
                }
            },
            onConfirm(){
                let self = this,data,time,slectTime;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(self.addMsg.type !== '4'){
                    if(!self.addMsg.id){
                        return  Toast.makeText("ID不能空");
                    }
                    if(!self.addMsg.id.replace(/\s/ig,'')){
                        return  Toast.makeText("ID不能为空格");
                    }
                }
                if(!self.addMsg.title){
                    return  Toast.makeText("标题不能空");
                }
                if(!self.addMsg.title.replace(/\s/ig,'')){
                    return Toast.makeText("标题不能为空格");
                }
                if(!self.addMsg.content){
                    return  Toast.makeText("内容不能空");
                }
                if(!self.addMsg.content.replace(/\s/ig,'')){
                    return Toast.makeText("内容不能为空格");
                }
                //当推送时间小于当前时间，就发送当前时间
                if(self.addMsg.time) {
                    slectTime = self.addMsg.time.getTime();
                    time = new Date();
                    self.iCurrentTime = time.getTime();
                    if(slectTime <=self.iCurrentTime){
                        self.addMsg.time = time;
                    }
                    self.addMsg.time = self.addMsg.time.format("yyyy-MM-dd hh:mm");
                } else {
                    if(self.addMsg.immediate === '1'){
                        return  Toast.makeText("请设置推送时间");
                    }
                }
                //通过手机号搜索个人用户进行推送（可能会改为user_id）
                if(self.addMsg.radio==3) {
                    // 13871626774
                    if(isNaN(self.addMsg.phone)) {
                        return Toast.makeText("请输入数字");
                    }
                    if(!(/^1\d{10}$/.test(self.addMsg.phone))){
                        return Toast.makeText("请输入正确手机号");
                    }
                    this.$http.post(this.HOST+'/user',{
                        "keywords": self.addMsg.phone
                    }).then(function(res) {
                        var result = res.data;
                        if(result.status !== 1){
                            return Toast.makeText("请求失败");
                        }
                        var info = result.data;
                        var data = info.data;
                        if(data.length < 1) {
                            return Toast.makeText("找不到这个用户");
                        }
                        var userinfo = data.pop();
                        self.addMsg.user_id = userinfo.id;
                        self.addMsg.style = 2;
                        self.submit();
                    });
                    return;
                }else {
                    self.addMsg.style = 1;
                    this.submit(); 
                }
               
            },
            submit() {
                let self = this;
                let data = {
                    multi_id:self.addMsg.id,
                    type:self.addMsg.type,
                    title:self.addMsg.title,
                    content:self.addMsg.content,
                    is_immediate:self.addMsg.immediate,
                    push_time:self.addMsg.time,
                    style: self.addMsg.style,
                    user_id: self.addMsg.user_id,


                };
                if (self.turnBtnState) {
                    self.turnBtnState = false;
                    self.$http.post(self.HOST+'/propelling/save',data).then(function(data){
                         // console.log(data);
                        // return;
                        if(data.data.status === 1){
                            Toast.makeText("添加成功");
                            switch (self.addMsg.immediate){
                                case '0':
                                    self.$router.push('/historyPush');
                                    break;
                                case '1':
                                    self.$router.push('/stayPush');
                                    break;
                            }
                            self.turnBtnState = true;
                        }else{
                            if(data.data.msg) {
                                Toast.makeText(data.data.msg);
                            }
                            // Toast.makeText("此ID不存在");
                            // self.addMsg.type = '1';
                            // self.addMsg.immediate = '0';
                            // self.addMsg.id = '';
                            // self.addMsg.title = "";
                            // self.addMsg.content = "";
                            // self.addMsg.time = "";
                            self.turnBtnState = true;
                        }
                    });
                }
            }
        }
    }
</script>

