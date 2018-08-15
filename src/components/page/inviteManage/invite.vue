<!-- 邀请排行榜 -->
<template>
  <div class="fl sf-main ">
    <div class="main-top zoom pl30" style="border-bottom: 1px solid #d8d8d8;height:55px;margin:30px 30px 0 30px;">
      <div class="lf" style="margin-left:-25px">邀请管理 / <span class="zClr-999">排行榜</span>
      </div>
      <!-- 日期搜索 -->
      <div class="frs" style="float:right;margin-right:0;">
        <div class="searchTime fr mr30" style="margin-top:-5px">
          <el-date-picker v-model="create_time" type="date" placeholder="开始时间" @change="createTime()"></el-date-picker>
          <el-date-picker v-model="end_time" type="date" placeholder="结束时间" @change="endTime()"></el-date-picker>
        </div>
        <div class="sf-user-search fr mr30" style="margin-top:5px;">
          <!-- 用户名搜索-->
          <el-input v-model="searchName" class="sf-search-text" placeholder="请输入用户名" @keyup.enter.native="onQueryName"></el-input>
          <span class="sf-search-btn" @click="onQueryName" style="margin-top:0px"></span>
        </div>
      </div>
    </div>
    <!-- 数据列表 -->
    <div class="page" style="margin:0 30px">
      <table style="width:100%">
        <thead>
          <tr style="border-top:none">
            <th v-for="(item,index) in titles" style="height:20px">{{item}}</th>
          </tr>
        </thead>
        <tbody class="table">
          <tr style="margin:0 30px" @click.stop="toInviteDetail(item.user_id)" v-for="(item,index) in tableData">
            <td>{{item.nickname}}</td>
            <td>{{item.phone}}</td>
            <td>{{item.invite_number}}</td>
            <td>{{item.create_time}}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination zoom">
        <el-pagination class="rt" @current-change='pageTurning' v-show="page" background layout="prev, pager, next,total" :current-page='cur_page' :total="totalpages" :page-size='10'></el-pagination>
        <div class="found" v-if="page==false"></div>
      </div>
    </div>
  </div>
</template>
<script>
  let Toast = {
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
        cur_page: 1, //当前页
        totalpages: 0, //总页数
        tableData: [], //列表数据
        page: true,
        message: "确定该条问答是违规问答吗？", //弹框内容
        selectCell: -1, //选择的当前cell
        titles: ['用户名', '手机号', '邀请人数', '用户注册时间'], //全部选择菜单
        type: 0,
        cur_pages: 1,
        create_time: '', //开始时间
        end_time: '', //结束时间
        searchName: ''
      };
    },
    created() {
      let self = this;
      if (window.navigator.onLine == false) {
        this.$router.push('/outline')
        return false;
      }
      let page = this.$route.query.page;
      let create_time = this.$route.query.create_time;
      let end_time = this.$route.query.end_time;
      if (!page || page <= 1) {
        page = 1
      } else {
        page = parseInt(page)
        self.cur_page = page;
      }
      if (create_time && create_time != 'notime') {
        self.create_time = eval('(' + create_time + ')');
      } else {
        self.create_time = ''
      }
      if (end_time && end_time != 'notime') {
        self.end_time = eval('(' + end_time + ')');
      } else {
        self.end_time = '';
      }
      let crtime = self.create_time;
      let ertime = self.end_time;
      if (crtime == '') {
        crtime = 'notime'
      }
      if (ertime == '') {
        ertime = 'notime'
      }
      window.history.replaceState(null, null, "?page=" + self.cur_page + '&create_time=' + crtime + '&end_time=' + ertime);
      self.getData(self.cur_page);
    },
    methods: {
      exit() {},
      //封装数据请求
      getData(page) {
        let self = this;
        if (window.navigator.onLine == false) {
          this.$router.push('/outline')
          return false;
        }
        let crtime = '';
        let ertime = '';
        if (self.create_time != '') {
          crtime = new Date(self.create_time).format("yyyy-MM-dd");
        } else {
          crtime = ''
        };
        if (self.end_time != '') {
          ertime = new Date(self.end_time).format("yyyy-MM-dd");
        } else {
          ertime = ''
        };
        let data = {
          start_time: crtime,
          end_time: ertime,
          username: self.searchName,
          page: page
        };
        // console.log(data);
        self.$http.post(self.HOST + '/getInviteList', data).then(function(res) {
          if (res.data.status == 0) {
            Toast.makeText(res.data.msg)
          } else {
            let total = res.data.total;
            self.totalpages = parseInt(total);
            self.tableData = [];
            res.data.data.map(function(item) {
              if (item.create_time) {
                item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
              } else {
                item.create_time = '';
              }
              self.tableData.push(item);
            })
            if (self.totalpages > 0) {
              self.page = true;
              if ($('.found')) {
                $('.found').hide();
                $('.table').show();
              }
            } else {
              if ($('.table')) {
                $('.found').show();
                $('.table').hide();
              }
              self.page = false;
            }
          }
        })
      },
      //根据时间搜索
      //开始时间
      createTime() {
        let self = this;
        if (window.navigator.onLine == false) {
          self.$router.push('/outline');
          return false;
        };
        let ctime = '';
        if (self.create_time != '' && typeof self.create_time != 'undefined') {
          ctime = self.create_time.getTime(); //将时间转化为时间戳进行比较
          if (self.end_time != '') {
            if (ctime > self.end_time) {
              Toast.makeText('请选择正确的开始时间！');
              self.create_time = '';
              return;
            }
          }
          self.create_time = self.create_time.getTime();
          let crtime = self.create_time;
          let ertime = self.end_time;
          if (crtime == '') {
            crtime = 'notime'
          }
          if (ertime == '' || typeof ertime == 'undefined') {
            ertime = 'notime'
          }
          self.cur_page = 1;
          self.tableData = [];
          window.history.replaceState(null, null, "?page=" + self.cur_page + '&create_time=' + crtime + '&end_time=' + ertime);
          self.getData(self.cur_page);
        } else {
          self.create_time = '';
          let crtime = self.create_time;
          let ertime = self.end_time;
          if (crtime == '') {
            crtime = 'notime'
          }
          if (ertime == '') {
            ertime = 'notime'
          }
          self.cur_page = 1;
          self.tableData = [];
          window.history.replaceState(null, null, "?page=" + self.cur_page + '&create_time=' + crtime + '&end_time=' + ertime);
          self.getData(self.cur_page);
        }
      },
      //结束时间
      endTime() {
        let self = this;
        if (window.navigator.onLine == false) {
          self.$router.push('/outline');
          return false;
        };
        let ctime = '';
        let etime = '';
        if (self.end_time != '' && typeof self.end_time != 'undefined') {
          etime = self.end_time.getTime(); //将时间转化为时间戳进行比较
          if (self.create_time != '') {
            if (etime < self.create_time) {
              Toast.makeText('请选择正确的结束时间！');
              self.end_time = '';
              return;
            }
          }
          self.end_time = self.end_time.getTime();
          let crtime = self.create_time;
          let ertime = self.end_time;
          if (crtime == '' || typeof crtime == 'undefined') {
            crtime = 'notime'
          }
          if (ertime == '') {
            ertime = 'notime'
          }
          self.cur_page = 1;
          self.tableData = [];
          window.history.replaceState(null, null, "?page=" + self.cur_page + '&create_time=' + crtime + '&end_time=' + ertime);
          self.getData(self.cur_page)
        } else {
          self.end_time = '';
          let crtime = self.create_time;
          let ertime = self.end_time;
          if (crtime == '') {
            crtime = 'notime'
          }
          if (ertime == '') {
            ertime = 'notime'
          }
          self.cur_page = 1;
          self.tableData = [];
          window.history.replaceState(null, null, "?page=" + self.cur_page + '&create_time=' + crtime + '&end_time=' + ertime);
          self.getData(self.cur_page);
        }
      },
      // 账单号或订单号搜索
      onQueryName() {
        let self = this;
        if (window.navigator.onLine == false) {
          self.$router.push('/outline');
          return false;
        };
        self.cur_page = 1;
        self.tableData = [];
        self.getData(self.cur_page);
      },
      // 分页currentPage 改变时会触发
      pageTurning(val) {
        this.cur_page = val;
        this.tableData = [];
        // console.log(self.create_time);
        window.history.replaceState(null, null, "?page=" + val + '&create_time=' + this.create_time + '&end_time=' + this.end_time);
        this.getData(val);
      },
      // 前往详情
      toInviteDetail(id) {
        let self = this;
        if (window.navigator.onLine == false) {
          this.$router.push('/outline')
          return false;
        }
         if ('GRYQLB'.isLimit()) {
             self.$router.push('/detailInvite?id=' + id)
          } else {
            sfLayer.makeText('无权访问!');
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
  .filters {
    font-size: 15px;
    display: inline-block;
    height: 35px;
    line-height: 35px;
    margin-left: 50px;
    margin-top: 13px;
  }
  .hightLight {
    color: yellow;
  }
</style>