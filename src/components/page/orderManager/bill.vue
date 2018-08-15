<!--  -->
<template>
	<div class="fl sf-main ">
<div class="main-top zoom pl30" style="border-bottom: 1px solid #d8d8d8;height:55px;margin:30px 30px 0 30px;">
            <div class="lf" style="margin-left:-25px">订单及账单管理 / <span class="zClr-999">账单列表</span>
            </div>
            
            <!-- 条件筛选 -->
            <div class="filters">
              <span class="filter" >条件筛选</span>
               <select style="width:140px;margin-left:10px;height:25px;cursor:pointer" v-model="type" @change="selectFilter(type)">
                   <option v-for="item in types" :label="item.label" :value="item.value" style="line-height:20px;cursor:pointer">{{item.label}}</option>
               </select>
                    </div>
             <!-- 用户名搜索 -->
              <div class="frs" style="float:right;margin-right:0;" >
                 <div class="sf-user-search fr mr30" style="margin-top:5px;">
            <el-input v-model="searchBill" class="sf-search-text" placeholder="请输入账单号/订单号"  @keyup.enter.native="onQueryBill()"></el-input>
            <span class="sf-search-btn" @click="onQueryBill()" style="margin-top:0px" ></span>
             </div>
              </div>
        </div>
        <!-- 数据列表 -->
		<div class="page" style="margin:0 30px" >
            <table style="width:100%">
          <thead >
             <tr  style="border-top:none">
                 <th v-for="(item,index) in titles" style="height:20px">{{item}}</th>
             </tr>
          </thead>
          <tbody v-for="(item,index) in tableData" class="table">
              <tr style="width:1111.41px" @click="gotoDetails(item.id)">
                  <td>{{item.nickname}}</td>
                  <td>{{item.user_id}}</td>
                  <td v-if="item.type==1">退款</td>
                  <td v-if="item.type==2">悬赏问答.消费</td>
                  <td v-if="item.type==3">提现</td>
                  <td v-if="item.type==4">悬赏问答.审核通过</td>
                  <td v-if="item.type==1||item.type==3||item.type==4" style="color:red">-{{(item.price/100).toFixed(2)}}</td>
                   <td v-if="item.type==2">+{{(item.price/100).toFixed(2)}}</td>
                  <!-- <td>{{(item.account/100).toFixed(2)}}</td> -->
                  <td>{{item.create_time}}</td>
                  <td class="bill_no">{{item.bill_no}}</td>
                  <td v-if="item.out_trade_no!=''" class="trade_no">{{item.out_trade_no}}</td>
                  <td v-if="item.out_trade_no==''"><i>-</i><i style="margin-left:10px">-</i><i style="margin-left:10px">-</i></td>
              </tr>
          </tbody>
          </table>

			<div class="pagination zoom">
				<!-- <el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
				</el-pagination> -->
        <el-pagination v-if="jquery==1"class="rt" @current-change='pageTurning' v-show="page" background layout="prev, pager, next,total" :current-page='cur_page' :total="totalpages" :page-size='10'></el-pagination>
        <el-pagination v-if="jquery==2"class="rt" @current-change='pageTurnings' v-show="page" background layout="prev, pager, next,total" :current-page='cur_pages' :total="totalpages" :page-size='10'></el-pagination>
          <div class="found" v-if="page==false"></div>
			</div>
		</div>
	</div>
</template>
<script>
// import outline from '../../common/js/outline.js';
export default {
  data() {
    return {
      selectIndex: 0, //选择的菜单
      // menus: [], //菜单
      cur_page: 1, //当前页
      totalpages: 0, //总页数
      tableData: [], //列表数据
      page: true,
      message: "确定该条问答是违规问答吗？", //弹框内容
      selectCell: -1, //选择的当前cell
      titles: ['用户名','用户ID','类型','金额','时间','账单号','订单号'],//全部选择菜单
      searchBill:'',
      types: [{value:'0',label:'全部'},{value: "1", label: "当天"}, {value: "2", label: "三天"},{value: "3", label: "一个月"},{value: "4", label: "三个月"}],
      type:0,
      jquery:1,
      cur_pages:1,
      curData:[],
      searchType: [{value: "1", label: "账单号"}, {value: "2", label: "订单号"}],
       form:{
                    name: '',
                    type:'1',
                    m: ''
                },
   };
  },
  created() {
     let self=this;
    if (!this.type) {
        this.type = 0;
    }
     if(self.$route.query.selectIndex){
        self.type=Number(self.$route.query.selectIndex);
      }
      let page = Number(self.$route.query.page);
			if (!page || page<1) {
				page = 1;
      }
			self.cur_page = parseInt(page);
       self.selectFilter(self.type,self.cur_page);
  },
  methods: {
    selectFilter(type,page){
    let self=this;
   if (window.navigator.onLine==false) {
       this.$router.push('/outline')
        return false;
      }
      self.tableData=[];
      if(typeof page=='undefined'){
        this.cur_page=1;
      }
      window.history.replaceState(null,null,"?selectIndex="+this.type+"&page="+this.cur_page);
      self.getListData(page);
},

//封装数据请求
  getData(data){
    let self = this;
    if (window.navigator.onLine==false) {
       this.$router.push('/outline')
        return false;
    }
     self.$http.post(self.HOST+'/billList',data).then(function(res){
               if(res.data.status==1){
                self.tableData=[];
              let total = res.data.data.total;
						self.totalpages = parseInt(total);
						res.data.data.data.map(function(item){
							if (item.create_time) 
							{
								item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
							} else {
								item.create_time = '';
							}
							if (!item.avatar) {
								item.avatar = '../../../../static/img/avatar.png';
              }
                 self.tableData.push(item);
						})
						if(self.totalpages > 0){
							self.page = true;
							if($('.found')){
                $('.found').hide();
                $('.table').show();
              }
						}else {
              if($('.table')){
            $('.found').show();
            $('.table').hide();
              }
							self.page = false;
						}
					}else {
						 sfLayer.makeText(res.data.msg); 
					}
      })

  },
    //获取列表数据
    getListData(page) {
      let self = this;
      if (window.navigator.onLine==false) {
        this.$router.push('/outline')
         return false;
      }
      let data={};
      if(self.type==0){
        data={
        page:self.cur_page
        }
      }else{
         data={
        page:page,
        time_screen:self.type,
      }
      }
     self.jquery=1;
     self.getData(data);
    },

    // 账单号或订单号搜索
    onQueryBill() {
      let self=this;
      if (window.navigator.onLine==false) {
       self.$router.push('/outline')
        return false;
      }
     let  data={}
      if(self.searchBill!=''){
        data={
          //bill_no既代表账单号也代表订单号
        bill_no:self.searchBill,
        time_screen:self.type,
        page:self.cur_pages
        }
      }else{
        if(self.type==1||self.type==2){
          data={
        page:1,
        time_screen:self.type,
        }
        }else{
          // self.cur_page=1;
          data={
         page:1,
        }
        window.location.reload();
        }
      }
      self.jquery=2;
      self.getData(data);
     
    },
     //          分页currentPage 改变时会触发
    pageTurning(val) {
      this.jquery=1;
      this.cur_page = val;
      this.tableData = [];
      this.getListData(val);
       window.history.replaceState(null,null,"?selectIndex="+this.type+"&page="+val);
    },
    pageTurnings(val){
      this.jquery=2;
      this.cur_pages = val;
      this.tableData = [];
       this.onQueryBill();
    },
    // 前往详情
  gotoDetails(id){
    if (window.navigator.onLine==false) {
       this.$router.push('/outline')
        return false;
      }
     if('ZDXQ'.isLimit()){
      this.$router.push('/detailsBill?bill_id='+id) 
    }else{
       sfLayer.makeText('没有权限查看')
    }
  },
  }
};
</script>
<style scoped>
.menu {
  position: relative;
  overflow: hidden;
  border-top: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
  height: 50px;
}
.menu .scroll {
  position: absolute;
  left: 0px;
  right: 190px;
  top: 0px;
  bottom: -30px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}
.menu span {
  display: inline-block;
  margin-top: 13px;
}
.menu .title {
  color: #999999;
  margin-left: 15px;
}
.menu .select {
  background-color: #c19c75 !important;
  padding: 1px 5px;
  color: #fff !important;
}
.menu .down {
  color: #cccccc !important;
}
.menu .item {
  margin-left: 15px;
  margin-right: 15px;
  cursor: pointer;
}
.menu .item:hover {
  color: #666666;
}
/*  */
.table .zoom {
  cursor: pointer;
}
.table .zoom:hover {
  background: #f4f5f6;
}
.frs {
  float: right;
  margin-right: 104px;
}
.fr {
  float: left;
  font-size: 16px;
}
.sf-user-search {
  width: 228px;
  height: 38px;
  border: 1px solid #2b6f91;
  border-radius: 2px;
}
.sf-main .el-input {
  height: 36px;
}
tbody tr {
  cursor: pointer;
}
 .filters{
     font-size: 15px;
     display: inline-block;
     height: 35px;
     line-height: 35px;
     margin-left: 50px;
     margin-top: 13px;
    }
  .hightLight{
    color: yellow;
  }
</style>