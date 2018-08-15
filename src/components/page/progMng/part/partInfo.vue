<template>
    <div class="addMember main">
        <div class="addMember-top main-top zoom">
            <div class="lf">节目管理 /
                <span class="zClr-999"> 栏目列表 / 栏目详情</span>
            </div>
        </div>
        <div class="tab-main">
            <div style="padding-bottom: 50px;">
                <div class="addsset-main">
                    <el-form :model="addMsg" label-width="120px" class="edit">
                        <el-form-item label="栏目名称：">
                            <div>{{addMsg.name}}</div>
                        </el-form-item>
                        <el-form-item label="栏目主播：">
                            <div>{{addMsg.user_name}}</div>
                        </el-form-item>
                        <el-form-item label="栏目介绍：">
                            <div>{{addMsg.title}}</div>
                        </el-form-item>
                        <el-form-item label="栏目详情介绍：">
                            <div>{{addMsg.detail}}</div>
                        </el-form-item>
                        <el-form-item label="栏目宣传图：">
                            <div style="width: 300px; height: 300px">
                            <img :src="addMsg.background_pic" />
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//    require('../../scss/great.scss');
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
                let self = this,data;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                data={
                    id:self.$route.query.id
                };
                self.$http.post(self.HOST+'/column/info',data).then(function(data){
                    if(data.data.status == 1){
                        self.addMsg = data.data.data;
                        console.log(data.data.data);
                        self.addMsg.create_time = new Date(self.addMsg.create_time*1000).format("yyyy-MM-dd");
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