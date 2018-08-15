<template>
  <div class="fl sf-main ">
    <div class="main-top zoom pl30">
      <div class="lf">订单及账单管理 / <span class="zClr-999">订单列表</span>
      </div>
    </div>
    <!-- 选择菜单 -->
    <div class="menu mr30 ml30 zoom">
      <div class="scroll">
        <span v-for="(item,index) in menus" :class="[selectIndex==index?'select':'',item.shelves==2 && selectIndex!=index?'down':'','item']" @click="selectMenu(index)">
  						{{item}}
  				</span>
      </div>
      <!-- 用户名搜索 -->
      <div class="frs" style="float:right;margin-right:0">
        <div class="sf-user-search fr mr30" style="margin-top:5px;">
          <el-input v-model="searchName" class="sf-search-text" placeholder="请输入用户名" @keyup.enter.native="onQueryName()"></el-input>
          <span class="sf-search-btn" @click="onQueryName()" style="margin-top:0px"></span>
        </div>
      </div>
      <!-- 大师搜索 -->
      <div class="frs" style="float:right;margin-right:0">
        <div class="sf-user-search fr mr30" style="margin-top:5px;" v-if="selectIndex==2">
          <el-input v-model="searchDsName" class="sf-search-text" placeholder="请输入大师" @keyup.enter.native="onQueryDsName()"></el-input>
          <span class="sf-search-btn" @click="onQueryDsName()" style="margin-top:0px"></span>
        </div>
      </div>
    </div>
    <!-- 数据列表 -->
    <div class="page" style="margin:0 30px;">
      <table style="width:100%">
        <thead>
          <tr style="border-top:none">
            <th v-for="(item,index) in tite" style="height:20px">{{item}}</th>
          </tr>
        </thead>
        <tbody v-for="(item,index) in tableData" class="table">
          <tr v-if="selectIndex==0" @click="gotoDetails(item.interlocut_id)">
            <td>{{item.interlocut_id}}</td>
            <td>{{item.nickname}}</td>
            <td>{{(item.price/100).toFixed(2)}}</td>
            <td>{{item.create_time}}</td>
            <td>{{item.out_trade_no}}</td>
            <!-- <td>{{item.trade_no}}</td> -->
          </tr>
          <tr v-if="selectIndex==1" @click="gotoDetails(item.interlocut_id)">
            <td>{{item.interlocut_id}}</td>
            <td>{{item.nickname}}</td>
            <td>{{(item.price/100).toFixed(2)}}</td>
            <td>{{item.create_time}}</td>
            <td>{{item.out_trade_no}}</td>
            <td>{{item.trade_no}}</td>
          </tr>
          <tr v-if="selectIndex==2" @click="gotoDetails(item.interlocut_id)">
            <td>{{item.interlocut_id}}</td>
            <td>{{item.nickname}}</td>
            <td>{{(item.price/100).toFixed(2)}}</td>
            <td>{{item.create_time}}</td>
            <td>{{item.master_name}}</td>
            <td>{{item.end_time}}</td>
            <td>{{item.out_trade_no}}</td>
            <td>{{item.trade_no}}</td>
          </tr>
          <tr v-if="selectIndex==3" @click="gotoDetails(item.interlocut_id)">
            <td>{{item.interlocut_id}}</td>
            <td>{{item.nickname}}</td>
            <td>{{(item.price/100).toFixed(2)}}</td>
            <td>{{item.create_time}}</td>
            <td>{{item.refund_reason}}</td>
            <td>{{item.out_trade_no}}</td>
            <td v-if="item.trade_no">{{item.trade_no}}</td>
            <td v-if="item.order_status==5">待退款</td>
            <td v-if="item.order_status==6">已完成</td>
            <td v-if="item.order_status==7">退款中</td>
            <td>
              <div class="refound" @click.stop="refound(item.order_id,index)" v-if="item.order_status==5">退款</div>
              <div class="refound dback" @click.stop="refounds()" v-if="item.order_status==6||item.order_status==7">退款</div>
            </td>
            <td v-if="item.order_status!=5">{{item.operator}}</td>
            <!-- <td v-if='item.order_status==5'>{{operator}}</td> -->
          </tr>
          <tr v-if="selectIndex==4" @click="gotoDetails(item.interlocut_id)">
            <td>{{item.interlocut_id}}</td>
            <td>{{item.nickname}}</td>
            <td>{{(item.price/100).toFixed(2)}}</td>
            <td>{{item.create_time}}</td>
            <td>{{item.close_reason}}</td>
            <td>{{item.out_trade_no}}</td>
            <td v-if="item.trade_no!=''">{{item.trade_no}}</td>
            <td v-if="item.trade_no==''"><i>-</i><i style="margin-left:10px">-</i><i style="margin-left:10px">-</i></td>
          </tr>
        </tbody>
      </table>
      <div class="found" v-if="page==false">
      </div>
      <!-- </div> -->
      <!-- </div> -->
      <div class="pagination zoom">
        <el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
        </el-pagination>
      </div>
    </div>
    <Popups :message="message" @sfCancel="isShow()" @sfConfirm="confirm()" v-show="showAlert"></Popups>
  </div>
</template>
<script>
  var Toast = {
    elem: document.querySelector("#toast"),
    timer: "",
    makeText: function(info, time) {
      this.show();
      this.elem.innerHTML = info;
      this.elem.style.marginLeft = -1 * (this.elem.clientWidth / 2) + "px";
      this.timer = setTimeout(this.hide.bind(this), time || 1000);
    },
    show: function() {
      if (this.elem == null) {
        var node = document.createElement("div");
        node.setAttribute("id", "toast");
        node.className = "toast";
        document.body.appendChild(node);
        this.elem = document.querySelector("#toast");
      }
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
      $.fn.addClass.call($(this.elem), "active");
    },
    hide: function() {
      $.fn.removeClass.call($(this.elem), "active");
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
        message: "确定退款？", //弹框内容
        selectCell: -1, //选择的当前cell
        titles: [
          ["悬赏ID", "悬赏用户", "悬赏金额", "生成时间", "订单编号"],
          ["悬赏ID", "悬赏用户", "悬赏金额", "生成时间", "订单编号", "交易号"],
          ["悬赏ID", "悬赏用户", '悬赏金额', '生成时间', '采纳大师', '结束时间', '订单编号', '交易号'],
          ["悬赏ID", "悬赏用户", '悬赏金额', '生成时间', '退款原因', '订单编号', '交易号', '退款进度', '操作', '操作人'],
          ["悬赏ID", "悬赏用户", "悬赏金额", "生成时间", '关闭原因', "订单编号", "交易号"]
        ], //全部选择菜单
        tite: [],
        searchName: '', //用户名搜索
        searchDsName: '', //大师搜索
        showAlert: false,
        id: '',
        index: '',
        operator: '' //操作人
      };
    },
    created() {
      let self = this;
      if (!this.selectIndex) {
        this.selectIndex = 0;
        this.tite = this.titles[0]
      }
      if (self.$route.query.selectIndex) {
        self.type = Number(self.$route.query.selectIndex);
      } else {
        self.type = 0
      }
      if (!self.cur_page) {
        self.cur_page = 1;
      }
      if (self.$route.query.page) {
        self.cur_page = self.$route.query.page;
      } else {
        self.cur_page = 1;
      }
      self.cur_page = parseInt(self.cur_page);
      self.getMenuData(self.cur_page);
      self.selectMenu(self.type, self.cur_page);
    },
    methods: {
      //获取菜单数据
      getMenuData(page) {
        let self = this;
        if (window.navigator.onLine == false) {
          this.$router.push('/outline')
          return false;
        }
        self.tableData = [];
        self.menus.push("待付款", "进行中", "已完成", "退款", "已关闭");
      },
      //选择菜单
      selectMenu(index, page) {
        console.log(page)
        if (window.navigator.onLine == false) {
          this.$router.push('/outline')
          return false;
        }
        this.selectIndex = index;
        this.tite = this.titles[this.selectIndex];
        if (typeof page == 'undefined') {
          this.cur_page = 1
        }
        window.history.replaceState(null, null, "?selectIndex=" + this.selectIndex + "&page=" + this.cur_page);
        this.getListData(page);
      },
      //获取列表数据
      getListData(page) {
        let self = this;
        if (window.navigator.onLine == false) {
          this.$router.push('/outline')
          return false;
        }
        let data = {
          page: page,
          status: self.selectIndex + 1,
          nickname: self.searchName
        }
        // self.cur_page=page;
        self.$http.post(self.HOST + '/orderList', data).then(function(res) {
          if (res.data.status == 1) {
            self.tableData = [];
            let total = res.data.data.total;
            self.totalpages = parseInt(total);
            res.data.data.data.map(function(item) {
              if (item.create_time || item.end_time) {
                item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
                item.end_time = new Date(item.end_time * 1000).format("yyyy-MM-dd");
              } else {
                item.create_time = '';
                item.end_time = ''
              }
              if (!item.avatar) {
                item.avatar = '../../../../static/img/avatar.png';
                // item.avatar = JSON.parse(item.avatar);
              }
              self.tableData.push(item);
            })
            if (self.tableData.length > 0) {
              self.page = true;
              if ($('.found')) {
                $('.found').hide();
              }
            } else {
              let html = `<div class='found'></div>`;
              $('.table').html(html);
              self.page = false;
            }
          } else {
            sfLayer.makeText(res.data.msg);
          }
        })
      },
      //          分页currentPage 改变时会触发
      handleCurrentChange(val) {
        this.cur_page = val;
        this.tableData = [];
        window.history.replaceState(null, null, "?selectIndex=" + this.selectIndex + "&page=" + val);
        this.getListData(val);
      },
      onQuery(data) {
        let self = this;
        if (window.navigator.onLine == false) {
          this.$router.push('/outline')
          return false;
        }
        self.cur_page = 1;
        self.$http.post(self.HOST + '/orderList', data).then(function(res) {
          if (res.data.status == 1) {
            self.tableData = [];
            let total = res.data.data.total;
            self.totalpages = parseInt(total);
            res.data.data.data.map(function(item) {
              if (item.create_time) {
                item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
                item.end_time = new Date(item.end_time * 1000).format("yyyy-MM-dd");
              } else {
                item.create_time = '';
              }
              if (!item.avatar) {
                item.avatar = '../../../../static/img/avatar.png';
                // item.avatar = JSON.parse(item.avatar);
              }
              self.tableData.push(item);
            })
            if (self.tableData.length > 0) {
              self.page = true;
              if ($('.found')) {
                $('.found').hide();
              }
            } else {
              let html = `<div class='found'></div>`;
              $('.table').html(html);
              self.page = false;
            }
          } else {
            sfLayer.makeText(res.data.msg);
          }
        })
      },
      // 用户名搜索
      onQueryName() {
        let self = this;
        if (window.navigator.onLine == false) {
          self.$router.push('/outline')
          return false;
        }
        let data = {
          status: self.selectIndex + 1,
          nickname: self.searchName,
          master: self.searchDsName,
          page: self.cur_page
        }
        self.onQuery(data);
      },
      // 大师搜索
      onQueryDsName() {
        let self = this;
        if (window.navigator.onLine == false) {
          this.$router.push('/outline')
          return false;
        }
        let data = {
          status: self.selectIndex + 1,
          master: self.searchDsName,
          nickname: self.searchName,
          page: self.cur_page
        }
        self.onQuery(data);
      },
      gotoDetails(id) {
        let self = this;
        if (window.navigator.onLine == false) {
          this.$router.push('/outline')
          return false;
        }
        let selectIndex = self.selectIndex + 1;
        if (self.selectIndex != 3) {
          if ('DDJRWDXQ'.isLimit()) {
            self.$router.push('/detailsOrder?interlocut_id=' + id + '&type=' + selectIndex)
          } else {
            sfLayer.makeText('没有权限查看')
          }
        } else {
          return;
        }
      },
      //点击退款
      refound(id, index) {
        let self = this;
        if ('DDTK'.isLimit()) {
          self.showAlert = true;
          self.id = id;
          self.index = index;
        } else {
          sfLayer.makeText('无权操作')
        }
      },
      refounds() {
      },
      isShow() {
        this.showAlert = false;
      },
      confirm() {
        let self = this;
        this.showAlert = false;
        if (window.navigator.onLine == false) {
          self.$router.push('/outline')
          return false;
        }
        let data = {
          order_id: self.id
        }
        self.$http.post(self.HOST + '/refundOrder', data).then(function(res) {
          if (res.data.status == 1) {
            self.tableData[self.index].order_status = 6;
            if (self.tableData[self.index].order_status == 6) {
              Toast.makeText('退款成功！');
              self.tableData[self.index].operator = res.data.operate;
            }
          }
        })
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
  .refound {
    display: inline-block;
    width: 80px;
    height: 35px;
    border-radius: 7px;
    background: #0099e5;
    text-align: center;
    line-height: 35px;
    color: #fff;
  }
  tr .dback {
    background: #929292;
    cursor: auto;
  }
</style>