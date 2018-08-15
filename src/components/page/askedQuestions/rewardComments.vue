<!-- 悬赏问答评论 -->
<template>
    <div class="main">
        <div class="main-top zoom">
            <div class="lf">悬赏问答 /
                <span class="zClr-999">评论</span>
            </div>
        </div>
        <!--评论页内容-->
        <div class="sf-comment" >
            <!--评论标题-->
            <div class="tr mr20 sf-comment-btn" v-if="addComment" >
                <span @click.stop="sendShow" @mouseenter="sfMouseenter()"  @mouseleave="sfMouseleave"  v-if = "bIcon">
                    <img src="../../../../static/img/comment.png"/>
                    <span>写评论</span>
                </span>
                <span @click="sendShow" @mouseenter="sfMouseenter()"  @mouseleave="sfMouseleave"  v-else>
                    <img src="../../../../static/img/comment-lan.png"/>
                    <span class="sf-color-subject">写评论</span>
                </span>
            </div>
            <div class="sf-comment-content pl20 pb15">
                <div class="mt5">{{oCommentData.title}}</div>
            </div>
            <div style="margin:10px auto auto 30px;font-size:14px">
                <span>水军评论：{{oCommentData.top.water_army}}</span>
                <span style="margin-left:30px">大师评论：{{oCommentData.top.master}}</span>
                <span style="margin-left:30px">用户评论：{{oCommentData.top.user_comment}}</span>
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
                    	<!-- <img src="../../../../static/img/navy_icon.png"  style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="item.code == 2"> -->
                        <img src="../../../../static/img/dsbs.png"  style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="item.type == 2">
                    </div>
                    <div class="xbox">
                        <div class="xbox-1 ml15">
                            <div class="sf-font16 pre">
                                <span class="fb">{{item.nickname}}</span>
                                <span class="rankName" v-if="item.type!=2">{{item.rankName}}</span>
                                <img src='../../../../static/img/dstx.png' class="tx" v-if="item.type==2" />
                                 <!-- <img src='../../../../static/img/kdbtx.png' class="tx" v-if="item.code==2" /> -->
                                 <span class="fc" v-if="item.type==3">(水军)</span>
                                <span class="fr sf-font14">
                                    <span v-if="item.comment_id==0" style="margin-right:30px">未采纳</span>
                                     <span v-if="item.comment_id>0" style="margin-right:30px">已采纳</span>
                                    {{item.create_time}}</span>
                            </div>
                            <div class="sf-font16 mt15 sf-word-wrap"><pre class="sf-pre">{{item.content}}</pre></div>
                            <div class="sf-font14 mt15">
                                <!-- <div class="sf-revert fl mr5" v-xlimit = "'WDPLQX'"@click="revert(index)">回复</div> -->
                                <div v-if="item.childrenNums">
                                    <div v-if="iRevertIcon !== index" class="sf-bottom-btn fl" @click="isShow(index)">
                                        •
                                        <!-- <span class="ml5">{{item.childrenNums}}条</span>回复  -->
                                    </div>
                                    <div v-else class="sf-top-btn fl" @click="isHidden(index)">
                                        •
                                        <!-- <span class="ml5">收起回复</span> -->
                                    </div>
                                </div>
                               <div  style="float:right" class="reviews">
                                  <span class="review" @click.stop="setReview(item.id,index)" v-if="item.choice==1&&item.comment_id!=0">审核通过</span>
                                   <span class="review cancel"  v-if='item.choice==2&&item.comment_id!=0'>审核已通过</span>
                                  <div style="display:inline-block;width:78px;height:19px">
                                       <div class="fr sf-comment-btn " @click="delComment(item.id)" v-if="item.choice!=2&&showDel">删除</div>
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
                                             <img src='../../../../static/img/dstx.png' class="tx" v-if="items.type==2" />
                                             <span class="fc" v-if="items.code==1&&items.type==3">(水军)</span>
                                            <span class="fr sf-font14">{{items.create_time}}</span>
                                        </div>
                                        <div class="sf-font14 mt15" v-xlimit = "'WDPLQX'" >
                                            <div class="fr sf-comment-btn " @click="delComment(items.id)">删除</div>
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
                    top:[]
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
                type: [{value: '1', label: '大师'}],
                rules: {
                    type: [{required:false,message: ' ',trigger: 'blur'}],
                },
                group_id:'',//分组id
                jxarr:[],
                bounty_status:'',
                showDel:true,
                addComment:true
            }
        },
        created() {
            this.group_id = this.$route.query.group_id;
            this.bounty_status=this.$route.query.bounty_status;
             if('SCHF'.isLimit()){
               this.showDel=true;
               }else{
                this.showDel=false;
             }  
             if('TJHD'.isLimit()){
               this.addComment=true;
               }else{
                this.addComment=false;
             }  
              this.render();
        },
        mounted() {
            if('SCHF'.isLimit()){
               this.showDel=true;
               }else{
                this.showDel=false;
             } 
             if('TJHD'.isLimit()){
               this.addComment=true;
               }else{
                this.addComment=false;
             } 
             this.render();
        },
        beforeUpdate() {
             if('SCHF'.isLimit()){
               this.showDel=true;
               }else{
                this.showDel=false;
             }  
             if('TJHD'.isLimit()){
               this.addComment=true;
               }else{
                this.addComment=false;
             }  
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
                let self=this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                this.bPopups = true;
                this.iDelId = id;
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
                    answer_id:self.iDelId,
                    // type:2
                };
                // console.log(data);
                if(self.turnBtnState){
                    self.turnBtnState = false;
                    self.$http.post(self.HOST+'/deleteAnswer',data).then(function(data){
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
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
             this.bIcon = false;
            },
            sfMouseleave(){
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                this.bIcon = true;

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
//            显示评论框
            sendShow(){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
             if('XSWDDSLB'.isLimit()){
               self.iRevert = "";//关闭一级评论框
                self.iTwoRevert = "";//关闭二级评论框
                self.sCommentContent = "";//清空所有评论内容
                self.bSend = true;
               }else{
                Toast.makeText('无权访问!');
             }  
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
                    self.$http.post(self.HOST+'/masterList',{}).then(function(data){
                        if(data.data.status === 1){
                            self.aMaster = data.data.data;
                            for(var i = 0; i < self.aMaster.length; i++){
                                if(!self.aMaster[i].avatar){
                                    self.aMaster[i].avatar =  '../../../../static/img/avatar.png';
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
                            interlocut_id:Number(self.iCommentActiveID),
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
                            interlocut_id:Number(self.iCommentActiveID),
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
                    console.log(data);  
                    self.$http.post(self.HOST+'/addAnswer',data).then(function(data){
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
           render(){
                let self = this;
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                
                self.iCommentActiveID = self.$route.query.id;
                let data = {
                    interlocut_id:Number(self.iCommentActiveID),
                };
                self.$http.post(self.HOST+'/interlocutionBounty/answerList',data).then(function(data){
                    if(data.data.status == 1){
                        self.oCommentData.title = data.data.data.top.title;
                        self.oCommentData.comment = data.data.data.lists;
                         self.oCommentData.top=data.data.data.top;
                        for(var i = 0; i <  self.oCommentData.comment.length; i++) {
                            if(self.oCommentData.comment[i].create_time) {
                                self.oCommentData.comment[i].create_time = new Date( self.oCommentData.comment[i].create_time*1000).format("yyyy-MM-dd");
                            } else {
                                self.oCommentData.comment[i].create_time = '';
                            }
                            if(!self.oCommentData.comment[i].avatar){
                                self.oCommentData.comment[i].avatar = '../../../static/img/avatar.png';
                            }
                            if(self.oCommentData.comment[i].children) {
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
                        Toast.makeText(data.data.msg)
                    }
                });
            },
            //审核通过
            setReview(id,index){
                let self=this;
                 if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                let item=self.oCommentData.comment[index];
                self.$http.post(self.HOST+'/checkAnswer',{answer_id:id}).then(function(res){
                    if(res.data.status==1){
                        item.choice=2;
                     Toast.makeText('设置成功')
                    }else{
                        Toast.makeText(res.data.msg)
                    }
                })
            },
        }
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
   .review{
  display: inline-block;
  width: 80px;
  height: 35px;
  border-radius: 7px;
  background: #0099e5;
  text-align: center;
  line-height: 35px;
  color: #fff;
  cursor: pointer;
}
   .reviews .cancel{
    background: #929292;
    cursor:default;
}
</style>