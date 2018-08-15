<template>
    <div class="fl sf-main">
        <div class="main-top zoom pl30">
            <div class="lf">使用反馈 / <span class="zClr-999">反馈列表 / </span>
                <span class="zClr-999">反馈详情</span>
            </div>
        </div>
        <div class="sf-feedback">
            <ul class="sf-feedback-list">
                <li><label class="fb fl tr sf-feedback-title mr5">用户名 : </label><div>{{feedbackData.user_name}}</div></li>
                <li class="mt30"><label class="fb fl tr sf-feedback-title mr5">反馈类型 :</label><div>{{feedbackData.type}}</div></li>
                <li class="mt30"><label class="fb fl tr sf-feedback-title mr5">设备 : </label><div>{{feedbackData.device}}</div></li>
                <li class="mt30"><label class="fb fl tr sf-feedback-title mr5">版本 : </label><div>{{feedbackData.version}}</div></li>
                <li class="mt30"><label class="fb fl tr sf-feedback-title mr5">账号 : </label><div>{{feedbackData.user_phone}}</div></li>
                <li class="mt30"><label class="fb fl tr sf-feedback-title mr5">反馈内容 : </label><div>{{feedbackData.content}}</div></li>
                <li class="mt10" v-if="feedbackData.pic.length !== 0" >
                    <div>
                        <img v-for="item in feedbackData.pic" class="ml5" :src="item" @click='viewImg(item)'>
                    </div>
                </li>
                <li class="mt10 mb10" v-if="feedbackData.is_reply === 0"><span @click="revert" class="sf-feedback-back">回复</span></li>
                <li class="mt30" v-else><label class="fb fl tr sf-feedback-title mr5">系统回复 :</label><div><pre class="sf-pre">{{feedbackData.reply}}</pre></div></li>
                <div v-if="bRevert" class="sf-font16 sf-feedback-text">
                    <textarea class="sf-font16" v-model="sCommentContent"></textarea>
                    <div class="sf-font14 mt20">
                        <span @click="sendComment()" class="sf-confirm-btn" style="right: 80px;">确定</span>
                        <span @click="cancelComment()" class="sf-confirm-btn" style="background: rgb(244, 245, 246); color: rgb(51, 51, 51);">取消</span>
                    </div>
                </div>
            </ul>
        </div>

        <div class="model" v-show="bShowView">
            <div class="model-view-img">
                <div class="modei-box">
                    <img :src="sImageShow" style="width:350px;height:623px; " />
                </div>
            </div>
            <div class="model-bg" @click='cancel()'></div>
        </div>
    </div>
</template>

<script>
    require('../../scss/comment.scss');
    var Toast={
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
                var node=document.createElement("div");
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
                bShowView:false,
                sImageShow:"",
                turnBtnState:true,
                bModel:false,
                iFeedbackID:0,
                bRevert:false,
                sCommentContent:"",
                feedbackData:{
                    user_name:"",
                    type:0,
                    version:"",
                    device:"",
                    content:"",
                    pic:[],
                    is_reply:0,
                    reply:'',
                },
            }
        },
        created() {
            this.render();
        },
        components: {
        },
        methods: {
            render(){
                let self = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.iFeedbackID = self.$route.query.id;
                let data = {
                    id: self.iFeedbackID
                };
                self.$http.post(self.HOST+'/feedBack/info',data).then(function(data){
                    if(data.data.status == 1){
                        self.feedbackData = data.data.data;
                        self.feedbackData.type =  self.feedbackData.type === 1?'需求': self.feedbackData.type === 2?'bug':'其他';
                        self.feedbackData.device =  self.feedbackData.device === 1?'iOS': self.feedbackData.device === 2?'android':'其他';
                        if(!self.feedbackData.version){
                            self.feedbackData.version = "0.0"
                        }
                        self.turnBtnState = true;
                    }else{
                        self.turnBtnState = true;
                        alert(data.data.msg);
                    }
                });
            },
            revert(){
                let self = this;
                if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.bRevert= true;
            },
            //            回复评论发送
            sendComment(item,id){
                let self = this,data={};
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(!self.sCommentContent){
                    Toast.makeText("评论内容不能空");
                    self.turnBtnState = true;
                    return;
                }
                if(!self.sCommentContent.replace(/\s/ig,'')){
                    Toast.makeText('评论内容不能为空格');
                    self.turnBtnState = true;
                    return;
                }
                data = {
                    reply:self.sCommentContent,
                    id:self.iFeedbackID
                };
                console.log(data);
                if (self.turnBtnState) {
                    self.turnBtnState = false;
                    self.$http.post(self.HOST+'/feedBack/info/reply',data).then(function(data){
                        if(data.data.status === 1){
                            Toast.makeText("回复成功");
                            this.render();
                            self.bRevert = false;
                            self.turnBtnState = true;
                            self.sCommentContent = "";
                        }else{
                            Toast.makeText(data.data.msg);
                            self.turnBtnState = true;
                        }
                    });

                }

            },
//            回复评论取消
            cancelComment(){
                let self = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.bRevert = false;
            },
            viewImg(url){
                let self = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.sImageShow = url;
                self.bShowView = true;
            },
            cancel(){
                this.bShowView = false;
            },
        }
    }
</script>
<style>
    .model-view-img{position: fixed;top:10%;right:calc((87% - 350px)/2);background: #fff;z-index: 11;}
</style>

