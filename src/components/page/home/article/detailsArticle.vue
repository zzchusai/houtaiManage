<template>
    <div class="sf-details fl sf-main">
        <div class="sf-main-top tc ">
            <div class="fb">{{detailsTitle}}</div>
            <div class="sf-time mt5">
                <span class="mr10">作者:{{detailsAuthor}}</span>
                <span>{{detailsTime}}</span>
            </div>
        </div>
        <div class="sf-content">
            <div  class="sf-word-wrap" v-html="detailsContent"></div>
             <div class="sf-share">
                  <!-- 缩略图 -->
                 <div class="mt20">
                    <span style="vertical-align: top;">缩略图：</span>
                    <img :src="detail_sl_img" class="avatar" v-if='isShow' style="width: 200px; height: 123px;">
                    <span v-if='!isShow'>无</span>
                </div>
                <!-- 分享图片 -->
                <div class="mt20">
                    <span style="vertical-align: top;">分享用图：</span>
                    <img :src="detail_share_img" class="avatar" style="width: 200px; height: 123px;">
                </div>
                <!-- 分享标题 -->
                <div class="sf-author mt20">
                    <span>分享标题：</span>
                    <span>{{detail_share_title}}</span>
                </div>
                <!-- 分享简介 -->
                <div class="sf-author mt20 ">
                   <span>分享简介：</span> 
                   <span>{{detail_share_intro}}</span>
                </div>  
            </div>
            <div class=" sf-lv tr mr20 mt20">
                <span class="mr20">收藏:{{detailsCollect_nums}}</span>
                <span class="mr20">阅读:{{detailsViews}}</span>
                <span>点赞:{{detailsLikes}}</span>
            </div>
            <div class="sf-bottom-30"></div>
        </div>
    </div>
</template>

<script>
    require('../../../scss/activity/details.scss');
    export default {
        data() {
            return {
                detailsID:0,
                detailsTitle:"",
                detailsContent:"",
                detailsTime:"",
                detailsLikes:0,
                detailsViews:0,
                detailsCollect_nums:0,
                detailsAuthor:"",
               detail_share_title:'',
                detail_share_intro:'',
                detail_share_img:'',
                  detail_sl_img:'',
                  isShow:''
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
                self.detailsID = self.$route.query.id;
                
                let data = {
                    id: self.detailsID
                };
                self.$http.post(self.HOST+'/article/info',data).then(function(data){
                    if(data.data.status == 1){
                        console.log(data.data.data);
                        if(data.data.data.pic==''){
                            self.isShow=false;
                        }else{
                             data.data.data.pic= data.data.data.pic
                            self.isShow=true;
                        }
                        self.detailsTime = new Date(data.data.data.update_time*1000).format("yyyy-MM-dd");
                        self.detailsLikes = data.data.data.likes;
                        self.detailsViews = data.data.data.views;
                        self.detailsTitle = data.data.data.title;
                        self.detailsContent = data.data.data.contentY;
                        self.detailsCollect_nums = data.data.data.collect_nums;
                        self.detailsAuthor = data.data.data.author;
                        self.detail_share_title = data.data.data.share_title;
                        self.detail_share_intro = data.data.data.share_intro;
                        self.detail_share_img = data.data.data.share_img;
                         self.detail_sl_img=data.data.data.pic;
                         console.log( self.detail_sl_img);
                    }else{
                        alert(data.data.msg);
                    }
                });
            },
        }
    }
</script>

