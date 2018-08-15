<template>
    <div class="addMember main">
        <div class="addMember-top main-top zoom">
            <div class="lf">推送管理 /
                <span v-if="type == 1" class="zClr-999">待推送 / 待推送详情</span>
                <span v-if="type == 2" class="zClr-999">推送历史 / 推送历史详情</span>
            </div>
        </div>
        <div class="tab-main">
            <div style="padding-bottom: 50px;">
                <div class="addsset-main">
                    <el-form :model="addMsg" label-width="120px" class="edit">
                        <el-form-item label="类型：">
                            <div v-if="addMsg.type === 1">活动</div>
                            <div v-if="addMsg.type === 2">文章</div>
                            <div v-if="addMsg.type === 3">节目</div>
                            <div v-if="addMsg.type === 4">系统推送</div>
                        </el-form-item>
                        <el-form-item label="ID：">
                            <div>{{addMsg.multi_id}}</div>
                        </el-form-item>
                        <el-form-item label="标题：">
                            <div>{{addMsg.title}}</div>
                        </el-form-item>
                        <el-form-item label="内容：">
                            <div>{{addMsg.content}}</div>
                        </el-form-item>
                        <el-form-item label="目标用户：">
                            <td >{{addMsg.target_user?addMsg.target_user:"所有用户"}}</td>
                        </el-form-item>
                        <el-form-item label="推送时间：">
                            <div>{{addMsg.push_time}}</div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    require('../../scss/great.scss');
    export default {
        data() {
            return {
                turnBtnState:true,
                addMsg: {},
                type:0,
            }
        },
        created() {
            this.render();
        },
        methods: {
            render() {
                let self = this,data,url;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.type = self.$route.query.type;
                if(self.type  === '1'){
                    url = '/propelling/info';
                }else{
                    url = '/propelling/history/info';
                }
               data={
                    id:self.$route.query.id
                };
                console.log(url);

                self.$http.post(self.HOST+url,data).then(function(data){
                    if(data.data.status == 1){
                        self.addMsg = data.data.data;
                        console.log(data.data.data);
                        self.addMsg.push_time = new Date(self.addMsg.push_time*1000).format("yyyy-MM-dd hh:mm");
                    }
                });
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