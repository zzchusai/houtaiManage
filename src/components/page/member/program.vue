<template>
    <div class="fl sf-main">
        <div class="main-top zoom pl30">
            <div class="lf">会员管理 / <span class="zClr-999">小程序会员列表</span></div>
        </div>
        <div class="search-btn ml30" >
            <div class="butn btn-box btn-normal"style="margin-top: 5px;line-height: 32px;"@click="exportList">批量导出</div>
        </div>
        <div class="pl30 pr30 mt5">
            <table>
                <thead>
                <tr><th v-for='title in titles'>{{title}}</th></tr>
                </thead>
                <tbody>
                <tr class="data" v-for="item in tableData">
                    <td>
                        <div style='width:50px;margin:5px auto;'><img :src="item.avatar" style="border-radius: 50%;" /></div>
                    </td>
                    <td>{{item.nickname}}</td>
                    <td v-if="item.gender==1">男</td>
                    <td v-if="item.gender==2">女</td>
                    <td>{{item.birth_date}}</td>
                     <td v-if="item.birth_place==''" class="address">未设置</td>
                     <td class="address" v-if="item.birth_place!=''">{{item.birth_place}}</td>
                    <td v-if="item.phone!=''">{{item.phone}}</td>
                    <td v-if="item.phone==''"><i>-</i><i style="margin-left:10px">-</i><i style="margin-left:10px">-</i></td>
                    <td>{{item.active}}</td>
                    <td>{{item.rankName}}</td>
                </tr>
                </tbody>
            </table>
            <div class="pagination zoom" style="margin-bottom: 50px">
                <el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :page-size="10" :total="totalpages" class="rt">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                titles: ['头像','昵称','性别','出生日期','出生地','手机号','活跃值','等级'],
                tableData: [],
                cur_page: 1,
                totalpages: 0,
                page: true,
                turnBtnState: true,//防止重复递交
            }
        },
        created() {
            // let page = this.$route.query.page;
            if (!self.cur_page || self.cur_page<1) {
                self.cur_page = 1;
            }
            this.render(this.cur_page);
        },
        components: {
        },
        methods: {
            handleCurrentChange(val) {
                this.cur_page = val;
                this.tableData=[];
                this.render(val);
            },
            render(num){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.cur_page = num;
                let data = {
                    page: num
                };
                $('.found-tr').hide();
                if(self.turnBtnState){
                    self.turnBtnState = false;
                    self.$http.post(self.HOST+'/user/program',data).then(function(data) {
                        if(data.data.status == 1){
                            self.tableData = data.data.data;
                            let total = data.data.data.length;
                            self.totalpages = parseInt(total);
                            self.turnBtnState = true;
                            for(var i = 0; i < self.tableData.length; i++) {
                                if(self.tableData[i].avatar) {
                                    self.tableData[i].avatar = self.tableData[i].avatar ;
                                } else {
                                    self.tableData[i].avatar='../../../../static/img/avatar.png';
                                }
                                if(self.tableData[i].birth_date!='0'){
                                  self.tableData[i].birth_date=new Date(self.tableData[i].birth_date*1000).format('yyyy-MM-dd');
                                }else{
                                     self.tableData[i].birth_date='未设置';
                                }
                            }
                            if(self.tableData.length == 0){
                                let html = '<tr class="found-tr"><td colspan="7"><div class="found"></div></td></tr>';
                                $('tbody').html(html);
                                self.page = false;
                            }
                        }else{
                            alert(data.data.msg);
                            self.turnBtnState = true;
                        }
                    });
                }
            },
            exportList(){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if('XCXHYDC'.isLimit()){
                    let AccessToken = JSON.parse(localStorage.getItem('access_token'));
                    AccessToken = AccessToken.replace(/\+/g,'%2B');
                    window.open(self.HOST+'/userProgram/export?ACCESSTOKEN='+AccessToken);
                } else {
                    sfLayer.makeText("没有权限操作");
                }
            },
        }
    }
</script>

