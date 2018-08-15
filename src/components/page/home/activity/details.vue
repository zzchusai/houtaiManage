<template>
    <div class="sf-details fl sf-main">
        <div class="sf-main-top tc ">
            <div class="fb">{{detailsTitle}}</div>
            <div class="sf-time mt5">{{detailsTime}}</div>
        </div>
        <div class="sf-content">
            <div class="sf-word-wrap" v-html="detailsContent"></div>
            <div class="sf-share">
                <!-- 分享图片 -->
                <div class="sf-img mt20">
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
            <div class=" sf-lv tr mr20 mt30 pb10"><span class="mr20">阅读:{{detailsViews}}</span><span>点赞:{{detailsLikes}}</span></div>
        </div>
    </div>
</template>

<script>
    require('../../../scss/activity/details.scss');
    require('../../../scss/activity/index.scss');
    export default {
        data() {
            return {
                detailsID: 0,
                detailsTitle: "",
                detailsContent: "",
                detailsTime: "",
                detailsLikes: 0,
                detailsViews: 0,
                detail_share_title: '',
                detail_share_intro: '',
                detail_share_img: '',
            }
        },
        created() {
            this.render();
        },
        components: {},
        methods: {
            render() {
                let self = this;
                if (window.navigator.onLine == false) {
                    this.$router.push('/outline')
                    return false;
                }
                self.detailsID = self.$route.query.id;
                let data = {
                    id: self.detailsID
                };
                self.$http.post(self.HOST + '/active/info', data).then(function(data) {
                    if (data.data.status == 1) {
                        console.log(data.data.data);
                        self.detailsTime = new Date(data.data.data.update_time * 1000).format("yyyy-MM-dd");
                        self.detailsLikes = data.data.data.likes;
                        self.detailsViews = data.data.data.views;
                        self.detailsTitle = data.data.data.title;
                        self.detailsContent = data.data.data.contentY;
                        if (data.data.data.share_title == '' || data.data.data.share_title == '0') {
                            self.detail_share_title = data.data.data.title
                        } else {
                            self.detail_share_title = data.data.data.share_title;
                        }
                        if (data.data.data.share_intro == '') {
                            self.detail_share_intro = "我在#十方云水#参加" + data.data.data.title + "的活动，奖品丰富，你也赶紧来参加吧~"
                        } else {
                            self.detail_share_intro = data.data.data.share_intro;
                        }
                        self.detail_share_img = data.data.data.share_img;
                    } else {
                        alert(data.data.msg);
                    }
                });
            },
        }
    }
</script>

