<template>
    <div class="fl sf-main">
        <div class="main-top zoom pl30">
            <div class="lf">会员管理 / <span class="zClr-999">大师会员列表</span></div>
            <div class="sf-user-search fl ml30">
                <el-select  class="xsearch" v-model="form.type"  placeholder="">
                    <el-option v-for="item in type" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="form.name" class="sf-search-text" @keyup.enter.native="searched(form.type)"></el-input>
                <span class="sf-search-btn" @click="onQuery(1,form.type)"></span>
            </div>
        </div>
        <div class="search-btn ml30" >
            <div class="butn btn-box btn-normal"style="margin-top: 5px;line-height: 32px;"@click="exportList">批量导出</div>
        </div>
        <div class="sf-great mt5">
            <table>
                <thead>
                <tr><th v-for='title in titles'>{{title}}</th></tr>
                </thead>
                <tbody>
                <tr class="data" v-for="(item,index) in tableData" @click="checkUser(item.id)">
                    <td>
                        <div style='width:50px;margin:5px auto;'><img :src="item.avatar" style="border-radius: 50%;" /></div>
                    </td>
                    <td>{{item.nickname}}</td>
                    <td>{{item.gender}}</td>
                    <td>{{item.birth_date}}</td>
                    <td class="address">{{item.birth_place}}</td>
                    <td>{{item.phone}}</td>
                    <td>{{item.fans}}</td>
                    <td class="recGreat set" @click.stop="recommend(item.id,index)" v-if="item.recommend==0">推荐大师</td>
                     <td class="recGreat cancel" @click.stop="unRecommend(item.id,index)" v-if="item.recommend==1">取消推荐</td>
                </tr>
                </tbody>
            </table>
            <div class="pagination zoom" style="margin-bottom: 50px;">
                <el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :page-size="10" :total="totalpages" class="rt">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    require('../../scss/great.scss');
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
                form:{
                    name: '',
                    type:'1',
                    m: ''
                },
                type: [{value: "1", label: "用户名"}, {value: "2", label: "手机号"}],
                titles: ['头像','昵称','性别','出生日期','出生地','手机号','粉丝数','操作'],
                tableData: [],
                cur_page: 1,
                totalpages: 0,
                page: true,
                go: false,
                turnBtnState: true,//防止重复递交
                DSHYLB:false
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
        },
        methods: {
            handleCurrentChange(val) {
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                this.cur_page = val;
                this.render(val);
                window.history.replaceState('page',null,"?page="+val);
            },
            searched() {
                let self = this;
                let reg,type;
                type = self.form.type;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(type == 2){
                    self.form.name = self.form.name.replace(/\s/ig,'');
                    reg = /^[\d]+$/g;
                    if(self.form.name.length>0){
                    if(!reg.test(self.form.name)){
                        Toast.makeText("手机号格式不正确");
                        return;
                    }
                    self.render(1,type);
                    }else{
                    self.render(1,type);
                    }
                }else{
                    self.render(1,type);
                }
            },
            onQuery(num,type){
                let self = this;
                let reg;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(type == 2){
                    self.form.name = self.form.name.replace(/\s/ig,'');
                    reg = /^[\d]+$/g;
                    if(self.form.name.length>0){
                    if(!reg.test(self.form.name)){
                        Toast.makeText("手机号格式不正确");
                        return;
                    }
                    self.render(num,type);
                    }else{
                        self.render(num,type);
                    }
                }else{
                    self.render(num,type);
                }
            },
            render(num,style){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.cur_page = num;
                if(style){
                    self.form.type = style;
                }
                let data = {
                    keywords: self.form.name,
                    style:self.form.type,
                    page: num
                };
                $('.found-tr').hide();
                self.$http.post(self.HOST+'/user/master',data).then(function(data) {
                    if(data.data.status == 1){
                        self.tableData = data.data.data.data;
                        for(var i = 0; i < self.tableData.length; i++) {
                            if(self.tableData[i].birth_date) {
                                self.tableData[i].birth_date = new Date(self.tableData[i].birth_date*1000).format("yyyy/MM/dd");
                            } else {
                                self.tableData[i].birth_date = '未设置';
                            }
                            if(self.tableData[i].avatar) {
                                self.tableData[i].avatar = self.tableData[i].avatar ;
                            } else {
                                self.tableData[i].avatar='../../../../static/img/avatar.png';
                            }
                            if(!self.tableData[i].nickname) {
                                self.tableData[i].nickname='未设置';
                            }
                            if(!self.tableData[i].birth_place) {
                                self.tableData[i].birth_place='未设置';
                            }
                            if(self.tableData[i].gender == 1) {
                                self.tableData[i].gender='男';
                            } else{
                                self.tableData[i].gender='女';
                            }
                        }
                        if(self.tableData.length == 0){
                            let html = '<tr class="found-tr"><td colspan="7"><div class="found"></div></td></tr>';
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
            checkUser(id) {
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if('DSHYXQ'.isLimit()){
		        	 self.$router.push('/detailsGreat?id='+id);
		        } else {
		        	sfLayer.makeText("没有权限查看");
		        }
            },
            exportList(){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }

                if('DSHYDC'.isLimit()) {
                    let AccessToken = JSON.parse(localStorage.getItem('access_token'));
                    AccessToken = AccessToken.replace(/\+/g,'%2B');
                    window.open(self.HOST+'/master/export?&ACCESSTOKEN='+AccessToken+'&keywords='+self.form.name+'&style='+self.form.type);
                } else {
                    sfLayer.makeText("没有权限操作");
                }
            },
            //推荐大师
            recommend(id,index){
                 let self = this;
                 if(window.navigator.onLine==false) {
                   self.$router.push('/outline')
                    return false;
                  }
                  let data={
                      user_id:id,
                      recommend:1
                  }
                   self.$http.post(self.HOST+'/master/masterRec',data).then(function(res){
                       if(res.data.status==1){
                           Toast.makeText('推荐成功');
                           self.tableData[index].recommend=1;
                       }else{
                           alert(res.data.msg)
                       }
                   })
            },
            //取消推荐
            unRecommend(id,index){
                 let self = this;
                 if(window.navigator.onLine==false) {
                   self.$router.push('/outline')
                    return false;
                  }
                  let data={
                      user_id:id,
                      recommend:0
                  }
                   self.$http.post(self.HOST+'/master/masterRec',data).then(function(res){
                       if(res.data.status==1){
                           Toast.makeText('取消推荐');
                            self.tableData[index].recommend=0;
                       }else{
                           alert(res.data.msg)
                       }
                   })
            }
        }
    }
</script>
<style scoped>
.recGreat{
        padding: 5px 8px;
        line-height: 20px;
        display: inline-block;
        margin-top: 15px;
		border-radius: 3px;
        cursor: pointer;
        height: 20px;
	}
    .set{
        color: #C19C75;
        border: 1px solid #C19C75;
    }
    .cancel{
        color: black;
        border: 1px solid black;
    }
</style>

