<template>
   <!-- 正常问答违规评论 -->
    <div class="main">
        <div class="main-top zoom">
            <div class="lf">问答管理 /
                <span class="zClr-999">评论</span>
            </div>
        </div>
        <!--评论页内容-->
        <div class="sf-comment" >
            <!--评论标题-->
            <div class="sf-comment-content pl20 pb15">
                <div class="mt5">{{oCommentData.title}}</div>
            </div>
            <div style="margin:10px auto auto 30px;font-size:14px">
              <span>水军评论：{{oCommentData.comments.water_army}}</span>
                <span style="margin-left:30px">大师评论：{{oCommentData.comments.master}}</span>
                <span style="margin-left:30px">用户评论：{{oCommentData.comments.user_comment}}</span>
            </div>
            <!--评论发表框-->
            <div v-if="bSend" class="sf-back-layout">
                <div class="sf-user-icon fl">
                    <img :src="oActiveUser.avatar"/>
                </div>
                <div class="xbox">
                    <div class="xbox-1 ml15">
                        <div class="sf-font16 sf-comment-text">
                            <textarea class="sf-font16" v-model="sCommentContent"></textarea>
                            <div class="sf-font14 mt10">
                                <span class="fb">{{ oActiveUser.nickname}}</span>
                                <span class="sf-select-user" @click="onSelectUser">选择账户</span>
                                <span @click="sendComment('zero')" class="sf-confirm-btn" style="right: 80px">确定</span>
                                <span @click="cancelComment" class="sf-confirm-btn" style="background: #f4f5f6;color: #333">取消</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--一级评论-->
            <div v-if="oCommentData.comment">
                <div v-for="(item,index) in oCommentData.comment"  :key="index" class="sf-back-layout">
                    <div class="sf-user-icon fl" style="position:relative"><img :src="item.avatar"/>
                        <img src="../../../../static/img/dsbs.png"  style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="item.type == 2">
                    </div>
                    <div class="xbox">
                        <div class="xbox-1 ml15">
                            <div class="sf-font16 pre">
                                <span class="fb">{{item.nickname}}</span>
                                <span class="rankName" v-if="item.type!=2">{{item.rankName}}</span>
                                <img src='../../../../static/img/dstx.png' class="tx" v-if="item.type==2" />
                                 <span class="fc" v-if="item.type==3">(水军)</span>
                                <span class="fr sf-font14">{{item.create_time}}</span>
                            </div>
                            <div class="sf-font16 mt15 sf-word-wrap"><pre class="sf-pre">{{item.content}}</pre></div>
                            <div class="sf-font14 mt15">
                                <!-- <div class="sf-revert fl mr5" @click="revert(index)">回复</div> -->
                                <div v-if="item.childrenNums">
                                    <div v-if="iRevertIcon !== index" class="sf-bottom-btn fl" @click="isShow(index)">
                                        •<span class="ml5">{{item.childrenNums}}条</span>回复
                                    </div>
                                    <div v-else class="sf-top-btn fl" @click="isHidden(index)">
                                        •<span class="ml5">收起回复</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--一级评论发表框-->
                    <div v-if="iRevert === index" class="sf-comment-child sf-back-layout">
                        <div class="sf-user-icon fl">
                            <img :src="oActiveUser.avatar"/>
                        </div>
                        <div class="xbox">
                            <div class="xbox-1 ml15">
                                <div class="sf-font16 sf-comment-text">
                                    <textarea class="sf-font16" v-model="sCommentContent"></textarea>
                                    <div class="sf-font14 mt10">
                                        <span class="fb">{{oActiveUser.nickname}}</span>
                                        <span class="sf-select-user" @click="onSelectUser">选择账户</span>
                                        <span @click="sendComment('one',item)" class="sf-confirm-btn" style="right: 80px">确定</span>
                                        <span @click="cancelComment" class="sf-confirm-btn" style="background: #f4f5f6;color: #333">取消</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--二级评论-->
                    <div v-if="item.children" v-show="iChildRevert === index">
                         <div v-for="(items,index) in item.children" :key="index">
                            <div class="sf-comment-child sf-back-layout mt10">
                                <!--头像-->
                                <div class="sf-user-icon fl">
                                	<img :src="items.avatar"/>
                                     <!-- <img src="../../../../static/img/navy_icon.png"  style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="items.code == 2"> -->
                                     <img src="../../../../static/img/dsbs.png"  style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="items.type == 2">
                                </div>
                                <div class="xbox">
                                    <div class="xbox-1 ml15">
                                        <div class="sf-font16 pre">
                                            <span class="fb">{{items.nickname}}</span>
                                            <span class="rankName" v-if="items.type!=2">{{items.rankName}}</span>
                                             <img src='../../../../static/img/dstx.png' class="tx" v-if="items.type==2" />
                                             <span class="fc" v-if="items.code==1&&items.type==3">(水军)</span>
                                            <span class="fr sf-font14">{{items.create_time}}</span>
                                        </div>

                                        <div class="sf-font16 mt15">
                                             <pre class="sf-pre">回复<span style="color: #00b0e8">{{items.pnickname}}</span>:<span>{{items.content}}</span></pre>
                                        </div>
                                        <div class="sf-font14 mt15" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--二级评论发表框-->
                            <div v-if="iTwoRevert === index" class="sf-comment-child sf-back-layout">
                                <div class="sf-user-icon fl">
                                    <img :src="oActiveUser.avatar"/>
                                </div>
                                <div class="xbox">
                                    <div class="xbox-1 ml15">
                                        <div class="sf-font16 sf-comment-text">
                                            <textarea class="sf-font16" v-model="sCommentContent"></textarea>
                                            <div class="sf-font14 mt10">
                                                <span class="fb">{{oActiveUser.nickname}}</span>
                                                <span class="sf-select-user" @click="onSelectUser">选择账户</span>
                                                <span @click="sendComment('two',items)" class="sf-confirm-btn" style="right: 80px">确定</span>
                                                <span @click="cancelComment" class="sf-confirm-btn" style="background: #f4f5f6;color: #333">取消</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sf-bottom"></div>
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
        <!--弹出层对话框组件-->
        <sf-popups   @sfCancel="sfCancel" @sfConfirm="sfConfirm" v-show="bPopups"></sf-popups>
    </div>
</template>

<script>
    require('../../scss/activityComment.scss');
    import sfPopups from '../../component/popups/popups.vue';
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
                turnBtnState: true,//防止重复递交
                bIcon:true,
                bNavy:false,
                bSend:false,
                bChecked:false,
                bPopups:false,
                iChildRevert:"",
                iRevert:"",
                iTwoRevert:"",
                iRevertIcon:"",
                iCommentActiveID:0,
                iDelId:0,
                aMaster:[],
                aNavy:[],
                aUser:[],
                oCommentData: {
                    title:"",
                    comment:[],
                    comments:{}
                },
                oActiveUser:{
                    avatar:"../../../static/img/avatar.png",
                    id:0,
                    nickname:"用户名"
                },
                sCommentContent:"",
                ModelForm:{
                    type:"1",
                    user:{},
                },
                type: [{value: '1', label: '大师'}, {value: '2', label: '水军'}],
                rules: {
                    type: [{required:false,message: ' ',trigger: 'blur'}],
                },
                group_id:'',//分组id
                jxarr:[]
            }
        },
        created() {
            this.group_id = this.$route.query.group_id;
            this.render();
        },
        components: {
            sfPopups,
        },
        methods: {
//            一级评论回复展开事件
            isShow(index){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                self.iRevertIcon = index;
                self.iChildRevert = index;
                self.iRevert = "";//关闭一级评论框
                self.iTwoRevert = "";//关闭二级评论框

            },
//            一级评论收起回复事件
            isHidden(){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                self.iRevertIcon = "";
                self.iChildRevert = "";
                self.iRevert = "";//关闭一级评论框
                self.iTwoRevert = "";//关闭二级评论框
            },
//            删除按钮事件
            delComment(id){
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                this.bPopups = true;
                this.iDelId = id;
            },
//            水军大师弹层选择用户取消事件
            cancel(){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                self.ModelForm.type = "1";
                this.bNavy = false;
            },
//            水军大师弹层选择用户确定事件
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
                    Toast.makeText('请选择用户');
                }
            },
//            封装的弹出确定取消事件
            sfCancel(){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                this.bPopups = false;
            },
            sfConfirm(){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                let data={
                    id:self.iDelId,
                    type:2
                };
                // console.log(data);
                if(self.turnBtnState){
                    self.turnBtnState = false;
                    self.$http.post(self.HOST+'/commentInter/total',data).then(function(data){
                        if(data.data.status == 1){
                            Toast.makeText('删除成功');
                            self.render();
                            self.turnBtnState = true;
                            self.bPopups = false;
                        }else{
                            Toast.makeText('删除成功');
                            self.render();
                            self.turnBtnState = true;
                            self.bPopups = false;
                        }
                    });
                }

            },
//            水军大师用户切换事件
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
            sfMouseenter(){
             this.bIcon = false;
            },
            sfMouseleave(){
                this.bIcon = true;

            },
//            显示评论框
            sendShow(){
                let self = this;
               if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                self.iRevert = "";//关闭一级评论框
                self.iTwoRevert = "";//关闭二级评论框
                self.sCommentContent = "";//清空所有评论内容
                self.bSend = true;
            },
//             选择用户
            onSelectUser(){
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
//            水军大师弹层选择用户确定事件
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
                    Toast.makeText('请选择用户');
                }
            },
//            回复评论发送
            sendComment(tag,item,index){
                let self = this,data={};
               if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                if(self.oActiveUser.id === 0){
                    Toast.makeText("请选择用户");
                    self.turnBtnState = true;
                    return;
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
                //                转换空格和换行
//                self.sCommentContent = self.sCommentContent.replace(/\n/g,"<br/>").replace(/\s/g,"&ensp;");
                switch (tag)
                {
                    case "one":
                        data = {
                            type:1,
                            interlocut_id:self.iCommentActiveID,
                            user_id:self.oActiveUser.id,
                            nickname:self.oActiveUser.nickname,
                            content:self.sCommentContent,
                            rootid:item.rootid,
                            pid:item.id
                        };
                        break;
                    case "two":
                        data = {
                            type:1,
                            interlocut_id:self.iCommentActiveID,
                            user_id:self.oActiveUser.id,
                            nickname:self.oActiveUser.nickname,
                            content:self.sCommentContent,
                            rootid:item.rootid,
                            pid:item.id
                        }
                        break;
                    default:
                        data = {
                            type:1,
                            interlocut_id:self.iCommentActiveID,
                            user_id:self.oActiveUser.id,
                            nickname:self.oActiveUser.nickname,
                            content:self.sCommentContent
                        }
                }
                data.group_id = this.group_id;
                if (self.turnBtnState) {
                    self.turnBtnState = false;
                    self.$http.post(self.HOST+'/commentInter/total',data).then(function(data){
                        if(data.data.status === 1){
                            Toast.makeText("评论成功");
                            this.render();
                            self.bSend = false;
                            self.iRevert = ""; //关闭一级评论回复框
                            self.iTwoRevert = ""; //关闭二级评论回复框
                            self.turnBtnState = true;
                            self.sCommentContent = "";
                        }else{
                            Toast.makeText(data.data.msg);
                            this.render();
                            self.bSend = false;
                            self.iRevert = ""; //关闭一级评论回复框
                            self.iTwoRevert = ""; //关闭二级评论回复框
                            self.turnBtnState = true;
                            self.sCommentContent = "";
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
                self.bSend = false;
                self.iRevert = "";//关闭一级
                 self.iTwoRevert = "";//关闭二级评论框评论框
                self.sCommentContent = "";
            },
            //一级回复按钮点击事件
            revert(index){
                let self = this;
               if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                self.iRevert = index;
                self.sCommentContent = "";//清空所有评论内容
                self.bSend = false; //关闭评论框
                self.iTwoRevert = "";//关闭二级评论框
            },
//            二级回复按钮点击事件
            TwoRevert(index){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                self.iTwoRevert = index;
                self.iRevert = "";//关闭一级评论框
                self.bSend = false; //关闭评论框
                self.sCommentContent = "";//清空所有评论内容

            },
              //设置精选
            setjx(index){
                let self=this;
            	if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
            	 let data={
            	 	type:3,
            	 	choice:2,
            	 	id:self.oCommentData.comment[index].id
                 }
            	self.$http.post(self.HOST+'/commentInter/total',data).then(function(data){
                if(data.data.status===1){
                    Toast.makeText('设置成功');
                    // console.log(self.oCommentData.comment[index].choice)
                  self.oCommentData.comment[index].choice=2;
            	}else{
                    Toast.makeText(data.data.msg);
                }
            	})
            },
            //取消精选
            canceljx(index){
                let self=this;
            	if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
            	 let data={
            	 	type:3,
            	 	choice:1,
            	 	id:self.oCommentData.comment[index].id
            	 }
            	self.$http.post(self.HOST+'/commentInter/total',data).then(function(data){
                    console.log(data.data);
            	if(data.data.status===1){
                    Toast.makeText('取消成功');
            	  self.oCommentData.comment[index].choice=1;
            	}
            	})
            },
           render(){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                
                self.iCommentActiveID = self.$route.query.id;
                let data = {
                    id:self.iCommentActiveID
                };
                self.$http.post(self.HOST+'/commentInterlocution',data).then(function(data){
                    if(data.data.status == 1){
                         self.oCommentData.comments = data.data.data;
                        self.oCommentData.title = data.data.data.title;
                        self.oCommentData.comment = data.data.data.data;
                        console.log(self.oCommentData.comment);
                        for(var i = 0; i <  self.oCommentData.comment.length; i++) {
                            if(self.oCommentData.comment[i].create_time) {
                                self.oCommentData.comment[i].create_time = new Date( self.oCommentData.comment[i].create_time*1000).format("yyyy-MM-dd");
                            } else {
                                self.oCommentData.comment[i].create_time = '';
                            }
                            if(!self.oCommentData.comment[i].avatar){
                                self.oCommentData.comment[i].avatar = '../../../static/img/avatar.png';
                            }
                            if(self.oCommentData.comment[i].childrenNums !== 0) {
                                for(var y = 0; y < self.oCommentData.comment[i].children.length; y++) {
                                    if(self.oCommentData.comment[i].children[y].create_time) {
                                        self.oCommentData.comment[i].children[y].create_time = new Date( self.oCommentData.comment[i].children[y].create_time*1000).format("yyyy-MM-dd");
                                    } else {
                                        self.oCommentData.comment[i].children[y].create_time = '';
                                    }
                                    if(!self.oCommentData.comment[i].children[y].avatar){
                                        self.oCommentData.comment[i].children[y].avatar = '../../../static/img/avatar.png';
                                    }
                                }
                            }
                        }
                    }else{
                        alert(data.data.msg);
                    }
                });
            },
        },
    }
</script>
<style type="text/css" scoped>
	.sf-user-select,.sf-user-icon{
		position: relative;
	} 
	.pre{
		line-height: 50px;
	}
	.fc{
		margin-left: 10px;
	}
	.jinxuan{
		float: right;
		width: 92px;
		height: 30px;
		line-height: 30px;
		border-radius: 3px;
		margin-top: -5px;
		margin-right: 20px;
		cursor: pointer;
		text-align: center;
	}
    .set{
        color: #C19C75;
        border: 1px solid #C19C75;
    }
    .cancel{
        color: black;
        border: 1px solid black;
    }
	.jinxuan:hover{
		opacity: 0.7;
	}

</style>