<template>
    <div class="member main">
        <div class="member-top main-top zoom">
            <div class="member-title lf">会员用户管理 / <span class="zClr-999">水军列表</span></div>
            <div class="sf-user-search fl ml30">
                <el-select  class="xsearch" v-model="form.type"  placeholder="">
                    <el-option v-for="item in type" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="form.name" class="sf-search-text"@keyup.enter.native="searched(form.type)"></el-input>
                <span class="sf-search-btn" @click="onQuery(1,form.type)"></span>
            </div>
        </div>
        <div class="search-btn">
            <div class="butn btn-box btn-normal" v-show="YHDC" style="margin-top:5px;margin-right:20px;line-height: 32px;}" @click="exportList">批量导出</div>
        </div>
        <div class="page">
            <div class="page-info">
                <table>
                    <thead>
                    <tr><th v-for='title in titles'>{{title}}</th></tr>
                    </thead>
                    <tbody>
                    <tr class="data" v-for="item in tableData" @click="checkUser(item.id)">
                        <td>
                            <div style='width:50px;margin:5px auto;position:relative;'>
                                <img :src="item.avatar" style="border-radius: 50%;" />
                                <!-- <img src="../../../../static/img/navy_icon.png"  style="z-index:100;position:absolute;bottom:0px;right:0px;width:20px;" v-if="item.code == 2"> -->
                            </div>
                        </td>
                        <td>{{item.nickname}}</td>
                        <td>{{item.gender}}</td>
                        <td>{{item.birth_date}}</td>
                        <td class="address">{{item.birth_place}}</td>
                        <td>{{item.phone}}</td>
                        <td>{{item.active}}</td>
                        <td>{{item.rankName}}</td>
                        <!--<td>
                            <span class="operation delete" v-show="YHFH" @click="kick(item.id)">封号</span>
                        </td>-->
                    </tr>
                    </tbody>
                </table>
                <div class="pagination zoom"style="margin-bottom: 30px;">
                    <el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :page-size="10" :total="totalpages" class="rt">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="model" v-show="model">
            <div class="model-main">
                <div class="model-del">确定封号？</div>
                <el-form :model="ban" ref='ban' :rules="rules" label-width="100px" style="padding:0 40px">
                    <el-form-item label="封号理由：" prop="reason">
                        <el-input type="textarea" v-model="ban.reason" placeholder="模糊查询"></el-input>
                    </el-form-item>
                </el-form>
                <div class="model-btn zoom">
                    <div class="butn btn-cancel btn-small lf" style="margin-top:5px;" @click="cancel">取消</div>
                    <div class="butn btn-main btn-small rt" style="margin-top:5px;" @click="confirm('ban')">确定</div>
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
             if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            this.show();
            this.elem.innerHTML=info;
            this.elem.style.marginLeft=-1*(this.elem.clientWidth/2)+"px";
            this.timer=setTimeout(this.hide.bind(this), time||1000);
        },
        show:function(){
             if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
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
        data(){
            return {
                form:{
                    name: '',
                    type:'1',
                    m: ''
                },
                type: [{value: "1", label: "用户名"}, {value: "2", label: "手机号"}],
                titles: ['头像','昵称','性别','出生日期','出生地','手机号','活跃值','等级'],
                tableData: [],
                cur_page: 1,
                totalpages: 0,
                model: false,
                id: '',
                ban: {
                    reason: ''
                },
                rules: {
                    reason: [
                        {required: true,message: '请输入封号理由',trigger: 'blur'}
                    ],
                },
                YHXQ: true,
                YHFH: false,
                YHDC: true,
                page: true,
                go: false
            }
        },
        created() {
             if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
            let page = this.$route.query.page;
            if (!page || page<1) {
                page = 1;
            }
            this.cur_page = parseInt(page);
            this.render(this.cur_page);
            this.limit();
        },
        methods:{
            limit() {
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                let limitCode =JSON.parse(localStorage.getItem('limitCode'));
                limitCode.forEach(function(item,index){
                    if(item == 'YHXQ'){
                        self.YHXQ = true;
                    }
                    if(item == 'YHFH'){
                        self.YHFH = true;
                    }
                    if(item == 'YHDC'){
                        self.YHDC = true;
                    }
                });
            },
            handleCurrentChange(val) {
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                this.cur_page = val;
                this.render(val);
                window.history.replaceState('page',null,"?page="+val);
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
                    type: 1,
                    style:self.form.type,
                    keywords: self.form.name,
                    page: num
                };
                $('.found-tr').hide();
                self.$http.post(self.HOST+'/navy',data).then(function(data) {
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
            kick(id) {
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                event.stopPropagation();
                self.id = id;
                self.model = true;
            },
            cancel() {
                this.model = false;
            },
            confirm(ban) {
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                let data = {
                    id:self.id,
                    seal_reason:self.ban.reason
                };
                self.$refs[ban].validate((valid) => {
                    if (valid) {
                        self.$http.post(self.HOST+'/user/delete',data).then(function(data) {
                            if(data.data.status == 1){
                                Toast.makeText('封号成功');
                                self.render(self.cur_page);
                                self.model = false;
                            }else{
                                alert(data.data.msg);
                            }
                        });
                    }
                });
            },
            checkUser(id) {
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(self.YHXQ){
                    self.$router.push('/navyInfo?id='+id);
                }
            },
            exportList(){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if("SJDC".isLimit()){
                    let AccessToken = JSON.parse(localStorage.getItem('access_token'));
                    AccessToken = AccessToken.replace(/\+/g,'%2B');
                    window.open(self.HOST+'/navy/export?&ACCESSTOKEN='+AccessToken+'&keywords='+self.form.name+'&style='+self.form.type);
                } else {
                    sfLayer.makeText("没有权限操作");
                }
            },
            
//			回车键搜索方法
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
                    reg = /^[\d]+$/g;//只能输入数字
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
            close(){
                let self = this;
                 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                self.form.name = "";
                self.go = false;
                self.render(1);
            }
        }
    }
</script>
<style scoped>
  .data{cursor: pointer;}
</style>


