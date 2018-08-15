<template>
        <div class="fl sf-main">
            <div class="main-top zoom pl30">
                <div class="lf">首页管理 / <span class="zClr-999">活动管理</span></div>
            </div>
            <div class="search-btn ml30" >
                <div class="butn btn-box btn-normal"style="margin-top: 5px;line-height: 32px;"@click="gotoAddActivity">上传活动</div>
            </div>
            <div class="sf-table-page">
                <table>
                    <thead>
                        <tr style="border-top:0;border-bottom: 1px solid #f1f1f1;">
                            <th v-for='title in titles'>{{title}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-top:0;cursor: pointer;border-bottom:1px solid #f1f1f1;" v-for="item in tableData" @click="gotoDetails(item.id)">
                            <td>{{item.id}}</td>
                            <td class="sf-color-subject" v-if="item.is_show === 1">展示中</td>
                            <td v-else>未展示</td>
                            <td class="sf-w300" align="center"><div class="sf-w200 textoverflow">{{item.title}}</div></td>
                            <td class="sf-color-blue" @click.stop="gotoComment(item.id)">{{item.comment_nums}}</td>
                            <td>{{item.update_time}}</td>
                            <td>
                                <span class="operation" style="line-height: 48px;font-size: 14px;" @click.stop="gotoDeitActivity(item.id)">编辑</span>
                                <span v-if="item.is_show === 1" class="sf-color-gray operation delete" style="line-height: 48px;font-size: 14px;" @click.stop="delActivity">删除</span>
                                <span v-else class="operation delete" style="line-height: 48px;font-size: 14px;" @click.stop="del(item.id)">删除</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--分页-->
                <div class="pagination zoom pt20 pb30">
                    <el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
                    </el-pagination>
                </div>
            </div>
            <!--弹出层对话框组件-->
            <sf-popups :message="sfMessage" @sfCancel="sfCancel()" @sfConfirm="sfConfirm()" v-show="bModel"></sf-popups>
        </div>
</template>

<script>
    require('../../../scss/activity/index.scss');
//    弹出层组件
    import sfPopups from '../../../component/popups/popups.vue';
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
                bModel:false,
                sfMessage:"是否删除该条活动？",
                activtyId:0,
                titles: ['活动ID','状态','活动名称','评论数','最后编辑时间','操作'],
                tableData:[],
                del_id:0,
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
            gotoAddActivity(){
                let self = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.$router.push('/addActivity');
            },
            gotoDeitActivity(id){
                let self = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.$router.push('/editActivity?id='+id);
            },
            gotoDetails(id){
                let self = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.$router.push('/details?id='+id);

            },
            gotoComment(id){
                let self = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.$router.push('/activityComment?id='+id);
            },
            del(id){
                 let vm = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                vm.activtyId = id;
                 vm.bModel = true;
             },
//          分页currentPage 改变时会触发
            handleCurrentChange(val) {
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                this.cur_page = val;
                this.render(val);
                window.history.replaceState('page',null,"?page="+val);
            },
            render(num){
                let self = this;
                if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.cur_page = num;
                let data = {
                    page:num,
                };
                self.$http.post(self.HOST+'/active',data).then(function(data){
                    if(data.data.status == 1){
                        console.log(data.data.data);
                        self.tableData = data.data.data.data;
                        for(var i = 0; i < self.tableData.length; i++) {
                            if(self.tableData[i].update_time) {
                                self.tableData[i].update_time = new Date(self.tableData[i].update_time*1000).format("yyyy-MM-dd");
                            } else {
                                self.tableData[i].update_time = '';
                            }
                        }
                        if(self.tableData.length == 0){
                            let html = '<tr class="found-tr"><td colspan="6"><div class="found"></div></td></tr>';
                            $('tbody').html(html);
                            self.page = false;
                        }
                       let total = data.data.data.total;
                        self.totalpages = parseInt(total);
                    }else{
                        alert(data.data.msg);
                    }
                });
            },
            sfCancel(){
                let vm = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                vm.bModel = false;
            },
            sfConfirm(){
                let self = this;
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                let data={id:self.activtyId};
                self.$http.post(self.HOST+'/active/delete',data).then(function(data){
                    if(data.data.status == 1){
                        Toast.makeText('删除成功');
                        self.render(1);
                        self.bModel = false;
                    }else{
                        alert(data.data.msg);
                    }
                });
            },
            delActivity(){
                 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                Toast.makeText('展示中无法删除');
            },

        }
    }
</script>

