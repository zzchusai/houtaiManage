<template>
    <div class="fl sf-main xxx">
        <div class="main-top zoom pl30">
            <div class="lf">问答 / <span class="zClr-999">问答管理 / </span>
                <span class="zClr-999">编辑分组</span>
            </div>
        </div>
        <div v-show="!isSort" class="current-order zoom ml30 mr30" >
            <div @click="toOrder()" style="text-align:center" >点击排序</div>
        </div>
        <div v-show="isSort" class="toSort ml30 mr30  zoom">
            <span>上下移动分组调整位置</span>
            <span class="sortSave" @click="sortSave()">保存</span>
            <span class="sortCancel" @click="sortCancel()">撤销</span>
        </div>
        <el-form class=" mt30" label-width="0px" v-show="isSort">
            <el-form-item v-for="(color,index) in currenOrder"
                          v-dragging="{ item: color, list: currenOrder, group: 'color' }" :key="color.id">
                
                <span class="order_icon">
                    <img src="../../../../static/img/order_icon.png" >
                </span>
                <span class="sort-item item-order">
                     <el-input style="width: 300px" v-model="color.name" placeholder="请输入分组名称" :maxlength="5"></el-input>
                    <span style="color:#999999">{{color.name?color.name.length:0}}/5</span>
                </span>
                <span :class="['ml10',isStop?'sf-color-gray':'sf-color-del']" v-show="color.shelves==1" @click="toChangeGroup(index)">下架</span>
                <span class="ml10 " style="color:#C19C75" v-show="color.shelves==2" @click="toChangeGroup(index)">上架</span>
            </el-form-item>
        </el-form>
        <el-form class=" mt30" label-width="0px" v-show="!isSort">
            <el-form-item v-for="(color,index) in currenOrder" :key="color.id">
                <span class="sort-item">
                     <el-input style="width: 300px" v-model="color.name" placeholder="请输入分组名称" :maxlength="5"></el-input>
                    <span style="color:#999999">{{color.name?color.name.length:0}}/5</span>
                </span>
                 <span class="sort-item">
                     <el-input style="width: 300px" v-model="color.group_price" placeholder="请输入分组价格" :maxlength="5"></el-input>
                    <span style="color:#999999">元</span>
                </span>
                <span :class="['ml10',isStop?'sf-color-gray':'sf-color-del']" v-show="color.shelves==1" @click="toChangeGroup(index)">下架</span>
                <span class="ml10 sf-color-add " style="color:#C19C75" v-show="color.shelves==2" @click="toChangeGroup(index)">上架</span>
                <span class="ml10 sf-color-del" v-show="!color.id" @click="cancleGroup(index)">取消</span>
            </el-form-item>
        </el-form>
        <div class="addItem mb30" >
            <div style="text-align:center">
               <div @click="addItem()" :class="[isSort?'default':'select']">
                    添加分组
               </div>
            </div>
        </div>
        <div class="fr pr30 mb30"  v-show="!isSort">
            <button class="zoom" style="width:100px;height:40px;color:#fff;font-size:14px;background-color:#0099E5;padding:2px 15px;border:none;border-radius:3px;cursor:pointer;float:left" @click="saveGroup()">确定</button>
            <button style="width:100px;height:40px;color:#333333;font-size:14px;background-color:#F4F5F6;padding:2px 15px;border:none;border-radius:3px;margin-left:20px;cursor:pointer;float:left" @click="sortCancel()">取消</button>
        </div>
        <Popups message="该分组和分组内的问答将会一起下架，确定操作？" @sfCancel="isShow()" @sfConfirm="confirm()" v-show="showSelect"></Popups>
    </div>
</template>
<script>
    require('../../scss/askedQuestions/grouping.scss');
    export default {
        data () {
            return {
                isSort:false,//是否在排序
                saveOrder:[],//保存的排序
                currenOrder:[],//当前的排序
                isStop:false,//是否能够下架
                showSelect:false,
                selectIndex:-1,//选择的分组
            }
        },
        created() {
            this.render();
        },


        //这里挺重要的，因为我们一般排序完要重新提交排序后的数据给后台保存，
        // 以便下一次安装我们所需要的顺序显示，这里的list就可以帮我们做到这一点，
        // 但是我们需要给数据添加一个uniqueId标志。然后在排序完后或者列表对应的顺序和uniqueId提交给后台，
        // 我也不知道我说的咋样。
        mounted () {
            this.$dragging.$on('dragged', ({ value }) => {
                // console.log(value.item)
                // console.log(value.list)
                // console.log(value.group)
            })
        },
        methods: {
            onConfirm(){
                // for(var i=0;i< this.colors.length; i++){
                //     this.colors[i].text = this.colors[i].name;
                // }
                // console.log(this.colors);
            },
            render(){
                let self = this;
               if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                 self.$http.post(self.HOST+'/group/total',{type:"4"})
                 .then(function(data){
                    if (data.data.status == 1) {
                        self.saveOrder = data.data.data;
                        self.currenOrder = [];
                        self.switchArray(self.currenOrder,self.saveOrder);
                        self.getUpLineCount();
                    }

                 });

            },
            // 去排序
            toOrder(){
            if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
             this.isSort = true;
             this.currenOrder = [];
             this.switchArray(this.currenOrder,this.saveOrder);
            },
            //撤销排序
            sortCancel(){
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
               this.isSort = false; 
               this.currenOrder = [];
               this.switchArray(this.currenOrder,this.saveOrder);
               this.$router.push('/askMain');
            },
            //保存排序
            sortSave(){
                if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                this.isSort = false; 
                 this.saveOrder = [];
                this.switchArray(this.saveOrder,this.currenOrder);
            },
            //添加分组
            addItem(){
                if (this.isSort) {
                    return;
                }
                let obj = {};
                obj["sort"] = this.currenOrder.length+1;
                obj["name"] = "";
                obj['group_price']='';
                //如果是新加的肯定没有id
                this.currenOrder.push(obj);
            },
            //去除首位空格
            trimStr(str){
                if (!str) {
                    return '';
                }
                return str.replace(/(^\s*)|(\s*$)/g,"");
            },
            saveGroup(){
            let nowGroup = [];
                if (this.currenOrder.length>0) {
                    for(let i = 0;i<this.currenOrder.length;i++){
                        let item = this.currenOrder[i];
                        item.name = this.trimStr(item.name);
                        if (!item.name
                            || item.name.length == 0) {
                             sfLayer.makeText("请输入分组名称");
                            return;
                        }
                        if (!item.group_price
                            || item.group_price.length == 0) {
                             sfLayer.makeText("请输入分组价格");
                            return;
                        }
                        if(item.group_price<0.01){
                              sfLayer.makeText("分组价格必须大于等于0.01");
                            return;
                        }
                        if(isNaN(Number(item.group_price))){  //当输入不是数字的时候，Number后返回的值是NaN;然后用isNaN判断。
                               sfLayer.makeText("悬赏金额必须是数字");
                              return;
                         }
                        item.sort = i +1;
                        nowGroup.push(item);
                    }
                }
                 let self = this;
               if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                 self.$http.post(self.HOST+'/group/total',{type:"1",group:nowGroup})
                 .then(function(data){
                    if (data.data.status == 1) {
                       self.render();
                       self.isSort = false;
                       self.$router.push('/askMain');   
                    }
                 });



            },
            //获取上架的数量
            getUpLineCount(){
                let  upGroup = 0;
                for (let  i = this.currenOrder.length - 1; i >= 0; i--) {
                    let  item = this.currenOrder[i];
                    if (item.shelves == 1) {
                       upGroup += 1;
                    }
                }
                this.isStop = upGroup<=3;
            },
            isShow(){
                this.selectIndex = -1;
                this.showSelect = false;
            },
            confirm(){
                this.showSelect = false;
                 let selectItem = this.currenOrder[this.selectIndex];
                this.toDownGroup(selectItem,this.selectIndex);
            },

            //改变上/下架状态
            toChangeGroup(index){
                this.selectIndex = index;
                
                let  upGroup = 0;
                for (let  i = this.currenOrder.length - 1; i >= 0; i--) {
                    let  item = this.currenOrder[i];
                    if (item.shelves == 1) {
                       upGroup += 1;
                    }
                }
                let selectItem = this.currenOrder[index];
               
                if (selectItem.shelves == 1) {
                    //准备下架
                    if (upGroup<=3) {
                        sfLayer.makeText("上架不能少于3个"); 
                        return;
                    }
                   this.showSelect = true;
                }else {
                  this.toUpGroup(selectItem,this.selectIndex);  
                }

            },
            toUpGroup(data,index){
                let self = this;
               if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                 self.$http.post(self.HOST+'/group/total',{type:"2",id:data.id,shelves:1})
                 .then(function(data){
                     console.log(data.data);
                    sfLayer.makeText(data.data.msg);
                    if (data.status == 200) {
                        self.currenOrder[index].shelves = 1;
                        self.changeSaveOrder(index);
                        self.getUpLineCount();
                    }
                    self.selectIndex = -1;
                 });
            },
            toDownGroup(data,index){
                let self = this;
               if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
                console.log(data.id);
                 self.$http.post(self.HOST+'/group/total',{type:"3",id:data.id,shelves:2})
                 .then(function(data){
                     console.log(data.data);
                    sfLayer.makeText(data.data.msg);
                    if (data.status == 200) {
                       self.currenOrder[index].shelves = 2;
                       self.changeSaveOrder(index);
                       self.getUpLineCount();
                    }
                    self.selectIndex = -1;
                 });
            },
            cancleGroup(index){
                this.currenOrder.splice(index,1);
            },
            changeSaveOrder(index){
                let item =  this.currenOrder[index];
                this.saveOrder.map(function(obj){
                    if (obj.id == item.id) {
                        obj.shelves = item.shelves;
                    }

                })
            },
            //交换数组
            switchArray(now,old){
                for (let i = 0; i < old.length; i++) {
                    let obj = {};
                    for(let key in old[i]){
                        obj[key] = old[i][key];
                    }
                    if (!obj["id"]) {
                        continue;
                    }
                    now.push(obj);
                }
            },

        },
    }
</script>
<style scoped>
    .color-item{
        border:1px solid #f1f1f1;
        padding:10px 5px;
        margin:5px 0;
        border-radius: 4px;

    }
    .xxx .el-form-item{
        text-align: center;
    }
    .order_icon{
        display: inline-block;
        height: 36px;
        width: 36px;
        border:1px #0099E5 solid;
        margin-right: -4px;
        vertical-align: top;
    }
    .order_icon img{
        width:14.55px;
        height:17.27px;
        display: inline-block;
        margin-top: 8px;
    }
    .addItem{
        text-align: center;
        color: #C19C75;
        font-size: 14px;
    }
    .addItem>div{
        display: inline-block;
        width: 380px;
        text-align: left;
    }
    .addItem>div>div{
        display: inline-block;
       
        padding: 3px 5px;
        border-radius: 5px;
    }
    .addItem .select{
        color: #C19C75;
        border: #C19C75 1px solid;
        cursor: pointer; 
    }
    .addItem .default{
        color: red;
        border: #C19C75 1px solid;
        cursor: not-allowed; 
    }
    .sf-color-del{
        cursor: pointer;
    }
     .sf-color-add{
         cursor: pointer;
     }
</style>