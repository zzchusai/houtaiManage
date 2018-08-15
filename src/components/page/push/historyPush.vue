<template>
    <div class="fl sf-main">
        <div class="main-top zoom pl30">
            <div class="lf">推送管理 / <span class="zClr-999">推送历史</span></div>
        </div>
        <div class="sf-historyPush">
            <table>
                <thead>
                <tr><th v-for='title in titles'>{{title}}</th></tr>
                </thead>
                <tbody>
                <tr  style="cursor: pointer;" v-for="item in tableData" @click="gotoPushInfo(item.id)">
                    <td class="sf-w200">{{item.push_time}}</td>
                    <td class="sf-w400" align="center"><div class="sf-w300 textoverflow">{{item.title}}</div></td>
                    <td v-if="item.type === 1">活动</td>
                    <td v-if="item.type === 2">文章</td>
                    <td v-if="item.type === 3">节目</td>
                    <td v-if="item.type === 4">系统推送</td>
                    <td >{{item.target_user?item.target_user:"所有用户"}}</td>
                    <td>{{item.user_id}}</td>
                    <td>
                        <span class="operation delete" style="line-height: 48px;font-size: 14px;" @click.stop="del(item.id)">删除</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--分页-->
        <div class="pagination zoom pt20 pb30">
            <el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
            </el-pagination>
        </div>
        <!--弹出层对话框组件-->
        <sf-popups :message="sfMessage" @sfCancel="sfCancel()" @sfConfirm="sfConfirm()" v-show="bModel"></sf-popups>
    </div>
</template>

<script>
    require('../../scss/push.scss');
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
                tableData: [],
                titles: ['推送时间','标题','类型','目标用户','用户ID','操作'],
                iIistoryPushId:0,
                bModel:false,
                turnBtnState:true,
                sfMessage:"是否删除该条推送？",
                page: true,
                cur_page:1,  //分页当前页参数
                totalpages:0,//分页总页数
            }
        },
        created() {
            let page = this.$route.query.page;
            if (!page || page<1) {
                page = 1;
            }
            this.cur_page = parseInt(page);
            this.render(this.cur_page);
        },
        components: {
            sfPopups,
        },
        methods: {
            handleCurrentChange(val) {
                this.cur_page = val;
                this.render(val);
                window.history.replaceState('page',null,"?page="+val);
            },
            gotoPushInfo(id){
                let self = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.$router.push('/pushInfo?id='+id +'&type='+2);
            },
            del(id){
                let vm = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                vm.iIistoryPushId = id;
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
                let self = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                let data={id:self.iIistoryPushId};
                if (self.turnBtnState) {
                    self.turnBtnState = false;
                    self.$http.post(self.HOST + '/propelling/history/delete', data).then(function (data) {
                        if (data.data.status == 1) {
                            Toast.makeText('删除成功');
                            self.render(1);
                            self.bModel = false;
                            self.turnBtnState = true;
                        } else {
                            self.turnBtnState = true;
                            alert(data.data.msg);
                        }
                    });
                }
            },
            render(num){
                let self = this,total;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.cur_page = num;
                let data = {
                    page:num,
                };
                 self.$http.post(self.HOST+'/propelling/history',data).then(function(data) {
                        if(data.data.status == 1){
                          self.tableData = data.data.data.data;
                          console.log(self.tableData)
                            for(var i = 0; i < self.tableData.length; i++) {
                                if(self.tableData[i].push_time) {
                                    self.tableData[i].push_time = new Date(self.tableData[i].push_time*1000).format("yyyy-MM-dd hh:mm");
                                } else {
                                    self.tableData[i].push_time = '';
                                }
                            }
                            if (!self.tableData.length) {
                                let html = '<tr class="found-tr"><td colspan="5"><div class="found"></div></td></tr>';
                                $('tbody').html(html);
                                self.page = false;
                            }
                            // console.log(data.data.data);
                            total = data.data.data.total;
                            self.totalpages = parseInt(total);
                        }else{
                            alert(data.data.msg);
                        }
                    });
            },
        }
    }
</script>

