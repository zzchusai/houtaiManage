<!-- 邀请详情 -->
<template>
  <div class="fl sf-main ">
    <div class="main-top zoom pl30" style="border-bottom: 1px solid #d8d8d8;height:55px;margin:30px 30px 0 30px;">
      <div class="lf" style="margin-left:-25px">邀请管理 /排行榜/ <span class="zClr-999">详情</span>
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
          <tr style="margin:0 30px" v-for="(item,index) in tableData">
            <td>{{item.nickname}}</td>
            <td>{{item.phone}}</td>
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
        user_id: '',
        cur_page: 1, //当前页
        totalpages: 0, //总页数
        tableData: [], //列表数据
        titles: ['邀请用户昵称', '邀请用户手机号', '邀请时间'], //全部选择菜单
        cur_pages: 1,
        page: true
      };
    },
    created() {
      let self = this;
      self.user_id = self.$route.query.id;
      let page = self.$route.query.page;
      if (!page || page <= 1) {
        page = 1
      } else {
        self.cur_page = parseInt(page)
      }
      self.getData(self.cur_page)
    },
    methods: {
      //封装数据请求
      getData(page) {
        let self = this;
        if (window.navigator.onLine == false) {
          this.$router.push('/outline')
          return false;
        }
        self.$http.post(self.HOST + '/getUserInviteList', {
          user_id: self.user_id,
          page: page
        }).then(function(res) {
          if (res.data.status == 0) {
            Toast.makeText(res.data.msg);
          } else {
            self.tableData = [];
            let total = res.data.total;
            self.totalpages = parseInt(total);
            res.data.data.map(function(item, index) {
              if (item.create_time) {
                item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
              } else {
                item.create_time = '';
              }
              self.tableData.push(item);
            })
          }
        })
      },
      //  分页currentPage 改变时会触发
      pageTurning(val) {
        this.cur_page = val;
        this.tableData = [];
        this.getData(val);
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