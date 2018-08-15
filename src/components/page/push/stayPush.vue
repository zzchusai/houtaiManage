<template>
    <div class="fl sf-main">
        <div class="main-top zoom pl30">
            <div class="lf">推送管理 / <span class="zClr-999">待推送</span></div>
        </div>
        <div class="sf-historyPush">
            <table>
                <thead>
                <tr><th v-for='title in titles'>{{title}}</th></tr>
                </thead>
                <tbody>
                <tr  style="cursor: pointer;" v-for="item in tableData" @click="gotoPushInfo(item.id)">
                    <td class="sf-w200" >{{item.push_time}}</td>
                    <td class="sf-w400" align="center"><div class="sf-w300 textoverflow">{{item.title}}</div></td>
                    <td v-if="item.type === 1">活动</td>
                    <td v-if="item.type === 2">文章</td>
                    <td v-if="item.type === 3">节目</td>
                    <td v-if="item.type === 4">系统推送</td>
                    <td >{{item.target_user?item.target_user:"所有用户"}}</td>
                    <td>
                        <span class="operation delete" style="line-height: 48px;font-size: 14px;" @click.stop="del(item.id)">删除</span>
                    </td>
                </tr>
                </tbody>
            </table>
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
                titles: ['推送时间','标题','类型','目标用户','操作'],
                iIistoryPushId:0,
                bModel:false,
                turnBtnState:true,
                sfMessage:"是否删除该条推送？",
            }
        },
        created() {
            this.render();
        },
        components: {
            sfPopups,
        },
        methods: {
            gotoPushInfo(id){
                let self = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.$router.push('/pushInfo?id='+id +'&type='+1);
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
                    self.$http.post(self.HOST + '/propelling/delete', data).then(function (data) {
                        if (data.data.status == 1) {
                            Toast.makeText('删除成功');
                            self.render();
                            self.bModel = false;
                            self.turnBtnState = true;
                        } else {
                            self.turnBtnState = true;
                            alert(data.data.msg);
                        }
                    });
                }
            },
            render(){
                let self = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                $('.found-tr').hide();
                self.$http.post(self.HOST+'/propelling/').then(function(data) {
                    if(data.data.status == 1){
                        console.log(data);
                        self.tableData = data.data.data;
                        if(self.tableData.length === 0){
                            let html = '<tr class="found-tr"><td colspan="5"><div class="found"></div></td></tr>';
                            $('tbody').html(html);
                        }
                        for(var i = 0; i < self.tableData.length; i++) {
                            if(self.tableData[i].push_time) {
                                self.tableData[i].push_time = new Date(self.tableData[i].push_time*1000).format("yyyy-MM-dd hh:mm");
                            } else {
                                self.tableData[i].push_time = '';
                            }
                        }
                    }else{
                        alert(data.data.msg);
                    }
                });
            },
        }
    }
</script>

