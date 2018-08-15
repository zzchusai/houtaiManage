<template>
    <div class="fl sf-main">
        <div class="pl30 main-top zoom">
            <div class="lf">首页管理 / <span class="zClr-999">banner管理</span></div>
        </div>
        <div v-if="tableData.length < 6">
            <div class="search-btn ml30" >
                <div class="butn btn-box btn-normal"style="margin-top: 5px;line-height: 32px;"@click="gotoAddBanner">添加banner</div>
            </div>
        </div>
        <div class="sf-table-page" style="height: 100%">
            <table>
                <thead>
                <tr style="border-top:0;border-bottom: 1px solid #f1f1f1;">
                    <th v-for='title in titles'>{{title}}</th>
                </tr>
                </thead>
                <tbody>
                <tr style="border-top:0;border-bottom: 1px solid #f1f1f1;" v-for="(item,index) in tableData" :key="item.id" >
                    <td>{{item.multi_id}}</td>
                    <td class="sf-w300" align="center"><div class="sf-w200 textoverflow">{{item.title}}</div></td>
                    <td class="sf-color-blue sf-xcursor" @click="gotoComment(item.type,item.multi_id)">{{item.comment_nums}}</td>
                    <td><img style="width: 110px; height:60px;margin: 10px 0" :src="item.banner_pic"/></td>
                    <td>
                        <span class="operation" style="line-height: 48px;font-size: 14px;" @click="gotoEditBanner(item.id)">编辑</span>
                        <span v-if="tableData.length === 1" class="sf-color-gray operation delete" style="line-height: 48px;font-size: 14px;">删除</span>
                        <span v-else class="operation delete" style="line-height: 48px;font-size: 14px;" @click="delBanner(item.id)">删除</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="sf-bottom-30"></div>
        </div>
        <div class="model" v-show="model">
            <div class="model-main">
                <div class="model-del">确定删除？</div>
                <div class="model-btn zoom">
                    <div class="butn btn-cancel btn-small lf" style="margin-top:5px;" @click="cancel">取消</div>
                    <div class="butn btn-main btn-small rt" style="margin-top:5px;" @click="confirm">确定</div>
                </div>
            </div>
            <div class="model-bg"></div>
        </div>
    </div>
</template>

<script>
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
                model:false,
                iDelId:0,
                titles: ['内容ID','活动名称','评论数','banner图展示','操作'],
                tableData:[],
            }
        },
        created() {
            this.render();
        },
        components: {
        },
        methods: {
            gotoComment(type,id){
                let self = this;
               if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(type === 1){
                    self.$router.push('/activityComment?id='+id);
                }else{
                    self.$router.push('/commentArticle?id='+id);
                }

            },
            gotoAddBanner(){
                let self = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.$router.push('/addBanner');
            },
            render(){
                let self = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.$http.post(self.HOST+'/banner').then(function(data){
                    if(data.data.status == 1){
                        self.tableData = data.data.data.data;
                        for(var i = 0; i < self.tableData.length; i++) {
                            if(!self.tableData[i].banner_pic){
                                self.tableData[i].banner_pic = "../../../../static/img/placeholder.png";
                            }
                        }

                    }else{
                        alert(data.data.msg);
                    }
                });
            },
            delBanner(id){
                let vm = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                vm.iDelId = id;
                vm.model = true;
            },
            cancel() {
                this.model = false;
            },
            confirm() {
                let self = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                let data={id:self.iDelId};
                self.$http.post(self.HOST+'/banner/delete',data).then(function(data){
                    if(data.data.status == 1){
                        Toast.makeText('删除成功');
                        self.render();
                        self.model = false;
                    }else{
                        alert(data.data.msg);
                    }
                });
            },
            gotoEditBanner(id){
                let self = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
              self.$router.push('/editBanner?id='+id);
            }
        }
    }
</script>
