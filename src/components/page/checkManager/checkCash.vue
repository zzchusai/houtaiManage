<!--  -->
<template>
	<div class="fl sf-main ">
<div class="main-top zoom pl30" style="border-bottom: 1px solid #d8d8d8;height:55px;margin:30px 30px 0 30px;">
            <div class="lf" style="margin-left:-25px">审核管理 / <span class="zClr-999">提现审核</span>
            </div>
            
            <!-- 条件筛选 -->
            <div class="filters">
              <span class="filter" >条件筛选</span>
               <select style="width:140px;margin-left:10px;height:25px;cursor:pointer" v-model="type" @change="selectMenu(type)">
                   <option v-for="item in types" :label="item.label" :value="item.value" style="line-height:20px;cursor:pointer">{{item.label}}</option>
               </select>
                    </div>
             <!-- 用户名搜索 -->
              <div class="frs" style="float:right;margin-right:0" >
            <div class="sf-user-search fr mr30" style="margin-top:5px;">
                <el-input v-model="searchName" class="sf-search-text" placeholder="请输入用户名" @keyup.enter.native="onQueryName()"></el-input>
                <span class="sf-search-btn" @click="onQueryName()" style="margin-top:0px" ></span>
            </div>
             </div>
        </div>
        <!-- 数据列表 -->
		<div class="page" style="margin:0 30px">
            <table>
          <thead >
             <tr  style="border-top:none" >
                 <th v-for="(item,index) in titles" style="height:20px">{{item}}</th>
             </tr>
          </thead>
          <tbody class="table">
              <tr style="width:1111.41px" @click="gotoDetails(item.id)" v-for="(item,index) in tableData" >
                  <td>{{item.nickname}}</td>
                  <td>{{item.payNumb}}</td>
                  <td>{{(item.account/100).toFixed(2)}}</td>
                  <td>{{(item.price/100).toFixed(2)}}</td>
                  <td>{{item.create_time}}</td>
                  <td v-if="item.state==0">待审核</td>
                    <td v-if="item.state==1">审核通过</td>
                      <td v-if="item.state==2">审核不通过</td>
              </tr>
          </tbody>
          </table>
				<!-- </div> -->
			<!-- </div> -->
			<div class="pagination zoom">
				<el-pagination v-if="jquery==1" v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
				</el-pagination>
        	<el-pagination v-if="jquery==2" v-show="page" @current-change="handleCurrentChanges" :current-page="cur_pages" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
				</el-pagination>
        	<div class="found" v-if="page==false"></div>
			</div>
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
      selectIndex: 0, //选择的菜单
      menus: [], //菜单
      cur_page: 1, //当前页
      totalpages: 0, //总页数
      tableData: [], //列表数据
      page: true,
      message: "确定该条问答是违规问答吗？", //弹框内容
      selectCell: -1, //选择的当前cell
      titles: ['用户名','提现账号','账户余额','申请金额','申请时间','审核结果'],//全部选择菜单
      searchName:'', //用户名搜索
      searchDsName:'', //大师搜索 
      types: [{value: "0", label: "全部"},{value: "1", label: "待审核"}, {value: "2", label: "审核通过"},{value: "3", label: "审核不通过"}],
      type:0,
      jquery:1,
      cur_pages:1
   };
  },
  created() {
    let self=this;
    if (!this.selectIndex) {
        this.selectIndex = 0;
    }
      if(self.$route.query.selectIndex){
        self.type=self.$route.query.selectIndex;
      }
      let page = self.$route.query.page;
			if (!page || page<1) {
				page = 1;
      }
			self.cur_page = parseInt(page);
    this.selectMenu(self.type,self.cur_page);
  },
  mounted() {},
  methods: {
    //选择菜单
    selectMenu(index,page) {
       if (window.navigator.onLine==false) {
            this.$router.push('/outline')
               return false;
         }
      this.selectIndex = index;
      this.tableData=[];
      if(typeof page=='undefined'){
        this.cur_page=1
      }
      window.history.replaceState(null,null,"?selectIndex="+this.selectIndex+"&page="+this.cur_page);
      this.getListData(page);
    },
    //封装数据请求
  getData(data){
    let self = this;
    if (window.navigator.onLine==false) {
       this.$router.push('/outline')
        return false;
    }
     self.$http.post(self.HOST+'/depositCheckList',data).then(function(res){
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
								// item.avatar = JSON.parse(item.avatar);
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
       self.jquery=1;
    if (window.navigator.onLine==false) {
       this.$router.push('/outline')
        return false;
    }
          let data={};
            if(self.selectIndex==0){
              data={
                 page:this.cur_page,
              }
            }else{
              data={
                page:this.cur_page,
                type:self.selectIndex-1
              }
            }
       self.getData(data);
      
    },
    //分页currentPage 改变时会触发
    handleCurrentChange(val) {
       if (window.navigator.onLine==false) {
            this.$router.push('/outline')
               return false;
         }
         this.jquery=1
      this.cur_page = val;
      this.tableData=[];
      this.getListData(val);
       window.history.replaceState(null,null,"?selectIndex="+this.selectIndex+"&page="+val);
    },
     handleCurrentChanges(val) {
       if (window.navigator.onLine==false) {
            this.$router.push('/outline')
               return false;
         }
         this.jquery=2
      this.cur_pages = val;
      this.tableData=[];
      this.onQueryName();
      // window.history.replaceState(null,null,"?selectIndex="+this.selectIndex+"&page="+val);
    },
    // 用户名搜索
    onQueryName() {
      let self=this;
      self.jquery=2
     if (window.navigator.onLine==false) {
            this.$router.push('/outline')
               return false;
         }
         let data={};
            if(self.searchName!=''){
              if(self.type==0){
                data={
                page:self.cur_pages,
                 nickname:self.searchName
              }
              }else{
                data={
                page:self.cur_pages,
                type:self.selectIndex-1,
                 nickname:self.searchName
              }
              self.cur_pages=1;
              }
            }else{
              data={
                page:1,
                nickname:self.searchName
              }
              window.location.reload();
            }
        self.getData(data);
    },
  //前往审核详情
  gotoDetails(id){
    let self=this;
      if (window.navigator.onLine==false) {
            this.$router.push('/outline')
               return false;
         }
       if('SHXQ'.isLimit()){
      self.$router.push('/detailsCheck?transfer_id='+id+'&selectIndex='+self.type)
       }else{
         sfLayer.makeText('没有权限查看')
       }
  }
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
       /* float: left; */
    }
</style>