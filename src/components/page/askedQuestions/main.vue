<template>
  <div class="fl sf-main ">
    <div class="main-top zoom pl30">
      <div class="lf">问答 /
        <span class="zClr-999">问答管理</span>
      </div>
    </div>
    <div class="menu  ml30 zoom">
      <span class="title">分组:</span>
      <div class="scroll">
        <span v-for="(item,index) in menus" :class="[selectIndex==index?'select':'',item.shelves==2 && selectIndex!=index?'down':'','item']" @click="selectMenu(index)" style="float:left">
            {{item.name}}
          </span>
        <span class="edit mr30" title="编辑分组" @click="toEditMenu()" style="margin-left:10px"></span>
      </div>
      <div class="fr mr30 write" @click="toWriteAsk()" v-xlimit="'TJTW'">写问答</div>
    </div>
    <div class="filters">
      <div class="lookAsk fr" @click.stop="interlocutionAnswers()" style="cursor:pointer">查看违规问答>></div>
    </div>
    <div class="page">
      <div class="page-info">
        <div class="table">
          <div class="cell zoom" v-for="(item,index) in tableData" @click.stop="askDetail(index)">
            <div class="fl" style="margin-right:15px;margin-left:15px;position:relative">
              <img :src="item.avatar" class="icon">
              <!-- <img src="../../../../static/img/navy_icon.png"  style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="item.code == 2"> -->
              <img src="../../../../static/img/dsbs.png" style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="item.type == 2">
            </div>
            <div style="overflow:hidden;margin-right:15px" class="fc">
              <div class="nickname">{{item.nickname}}</div>
              <span class="rankName" v-if="item.type!=2">{{item.rankName}}</span>
              <img src='../../../../static/img/dstx.png' class="tx" v-if="item.type==2" />
              <!-- <img src='../../../../static/img/kdbtx.png' class="tx" v-if="item.code==2" /> -->
              <span class="fc" v-if="item.type==3">(水军)</span>
              <div class="anonymous" v-show="item.anonymous == 2" style="margin-left:20px">(匿名发布)</div>
              <div class="title">{{item.title}}</div>
              <div class="cell-content sf-pre" ref="limitLines" style="line-height: 15px;">{{item.content}}
              </div>
              <div class="answer" style="margin-right:38px">回答:
                <span style="color: #0099E5;margin-left:5px;cursor:pointer" @click.stop="lookAnswer(index)">{{item.answer_nums}}</span>
              </div>
              <div class="setIssue" v-show="item.violate==1" @click.stop="setIssue(index)">设为违规问答</div>
              <div class="issue" style="margin-right:42px;" v-show="item.violate==2">违规问答</div>
              <div class="time fr">{{item.create_time}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination zoom">
        <el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
        </el-pagination>
      </div>
    </div>
    <Popups :message="message" @sfCancel="isShow()" @sfConfirm="confirm()" v-show="selectCell>=0"></Popups>
  </div>
</template>

<script>
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
        selectCell: -1 //选择的当前cell
      };
    },
    created() {
      let self = this;
      if (!this.selectIndex) {
        this.selectIndex = 0;
      }
      if (self.$route.query.selectIndex) {
        self.type = self.$route.query.selectIndex;
      } else {
        self.type = 0;
      }
      let page = self.$route.query.page;
      if (!page || page < 1) {
        page = 1;
      }
      self.cur_page = parseInt(page);
      self.getMenuData(self.cur_page);
      self.selectMenu(self.type, self.cur_page);
    },
    updated() {
      if (this.$refs.limitLines) {
        for (var i = 0; i < this.$refs.limitLines.length; i++) {
          let item = this.$refs.limitLines[i];
          let linesHieght = parseFloat(item.style.lineHeight);
          while (item.offsetHeight > 45) {
            item.innerText =
              item.innerText.substring(0, item.innerText.length - 10) + "...";
          }
        }
      }
    },
    mounted() {},
    methods: {
      getMenuData(page) {
        let self = this;
        // self.cur_page = 1;
        self.tableData = [];
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        self.$http
          .post(self.HOST + "/group/total", {
            type: "4"
          })
          .then(function(data) {
            if (data.data.status == 1) {
              self.menus = data.data.data;
              for (let i = 0; i < self.menus.length; i++) {
                if (self.menus[i].id == self.$route.query.group_index) {
                  self.selectIndex = i;
                }
              }
              self.getListData(page);
            }
          });
      },
      //选择菜单
      selectMenu(index, page) {
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        this.selectIndex = index;
        this.tableData = [];
        if (typeof page == "undefined") {
          this.cur_page = 1;
        }
        window.history.replaceState(
          null,
          null,
          "?selectIndex=" + this.selectIndex + "&page=" + this.cur_page
        );
        this.getListData(page);
      },
      //获取列表数据
      getListData(page) {
        // console.log(page)
        let selectMenuItem = this.menus[this.selectIndex];
        let self = this;
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        if (!selectMenuItem) {
          selectMenuItem = 5;
        }
        let data = {
          page: page,
          type: 1,
          group_id: selectMenuItem.id
        };
        self.$http.post(self.HOST + "/interlocution", data).then(function(res) {
          if (res.data.status == 1) {
            let total = res.data.data.total;
            self.totalpages = parseInt(total);
            res.data.data.data.map(function(item) {
              if (item.create_time) {
                item.create_time = new Date(item.create_time * 1000).format(
                  "yyyy-MM-dd"
                );
              } else {
                item.create_time = "";
              }
              if (!item.avatar) {
                item.avatar = "../../../../static/img/avatar.png";
              }
            });
            self.tableData = res.data.data.data;
            if (self.tableData.length > 0) {
              self.page = true;
              if ($(".found")) {
                $(".found").hide();
              }
            } else {
              let html = `<div class='found'></div>`;
              $(".table").html(html);
              self.page = false;
            }
          } else {
            sfLayer.makeText(res.data.msg);
          }
        });
      },
      handleCurrentChange(val) {
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        this.cur_page = val;
        this.tableData = [];
        window.history.replaceState(
          null,
          null,
          "?selectIndex=" + this.selectIndex + "&page=" + val
        );
        this.getListData(val);
      },
      //编辑分组
      toEditMenu() {
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        this.$router.push("/grouping");
      },
      //设置为违规问答
      setIssue(index) {
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        if ("SZWG".isLimit()) {
          this.selectCell = index;
        } else {
          this.selectCell = -1;
          sfLayer.makeText("无权访问");
        }
      },
      isShow() {
        //取消
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        this.selectCell = -1;
      },
      confirm() {
        //确定
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        let item = this.tableData[this.selectCell];
        let self = this;
        self.$http
          .post(self.HOST + "/violate/set", {
            id: item.id
          })
          .then(function(res) {
            if (res.data.status == 1) {
              //设置成功
              let nav = "/interlocutionAnswers?group_index=" + self.selectIndex;
              self.$router.push(nav);
            } else {
              sfLayer.makeText(res.data.msg);
            }
            self.selectCell = -1;
          });
      },
      //写问答
      toWriteAsk() {
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        this.$router.push("/writeAsk");
      },
      //查看回答
      lookAnswer(index) {
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        if ("WDHD".isLimit()) {
          let item = this.tableData[index];
          let selectMenuItem = this.menus[this.selectIndex];
          this.$router.push(
            "/askComments?id=" + item.id + "&group_id=" + selectMenuItem.id
          );
        } else {
          sfLayer.makeText("没有权限查看");
        }
      },
      interlocutionAnswers(event) {
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        let nav = "/interlocutionAnswers?group_index=" + this.selectIndex;
        this.$router.push(nav);
      },
      //问答详情
      askDetail(index) {
        if (window.navigator.onLine == false) {
          this.$router.push("/outline");
          return false;
        }
        if ("TWXQ".isLimit()) {
          let item = this.tableData[index];
          this.$router.push("/askDetail?id=" + item.id);
        } else {
          sfLayer.makeText("没有权限查看");
        }
      }
    }
  };
</script>

<style scoped>
  .menu {
    overflow: hidden;
    position: relative;
    display: flex;
    margin: 0px 30px;
    flex-direction: row;
    /* justify-content: space-between; */
    border-top: 1px solid #d8d8d8;
  }
  .menu .scroll {
    display: inline-block;
    white-space: wrap;
    margin-right: 80px;
  }
  .menu span {
    display: inline-block;
    margin-top: 13px;
    height: 23px;
  }
  .menu .title {
    color: #999999;
    display: inline-block;
    width: 62px;
    text-align: center;
    margin-right: 0;
  }
  .menu .select {
    background-color: #c19c75 !important;
    padding: 0px 4px;
    color: #fff !important;
  }
  .menu .down {
    color: #cccccc !important;
  }
  .menu .item {
    margin-left: 14px;
    margin-right: 14px;
    cursor: pointer;
  }
  .menu .item:hover {
    color: #666666;
  }
  .menu .edit {
    display: inline-block;
    margin-top: 15px;
    width: 20px;
    height: 20px;
    background-size: 20px 20px;
    background-repeat: no-repeat;
    background-position: center;
    background-origin: content-box;
    background-image: url("../../../../static/img/edit-before.png");
  }
  .menu .edit:hover {
    background-image: url("../../../../static/img/edit-after.png");
  }
  .menu .write {
    position: absolute;
    width: 80px;
    display: inline-block;
    height: 20px;
    text-align: center;
    line-height: 20px;
    right: 0;
    margin-top: 13px;
    margin-right: 0;
    font-size: 13px;
    color: #c19c75;
    border: #c19c75 1px solid;
    border-radius: 5px;
  }
  .cell {
    border-bottom: 1px #d8d8d8 solid;
    margin: 0px 30px;
    font-size: 15px;
    padding-bottom: 15px;
    color: #333;
  }
  .cell .icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: relative;
    margin-top: 23px;
  }
  .cell .nickname,
  .cell .answer,
  .cell .setIssue,
  .cell .issue,
  .cell .time,
  .cell .anonymous {
    display: inline-block;
    margin-top: 22px;
  }
  .cell .lookAsk {
    margin-top: 23px;
    padding-right: 25px;
    color: #333;
    background-size: 20px 15px;
    background-repeat: no-repeat;
    background-position: center right;
    background-image: url("../../../../static/img/ask-before.png");
  }
  .cell .lookAsk:hover {
    color: #999;
    background-image: url("../../../../static/img/ask-after.png");
  }
  .cell .cell-content {
    position: relative;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    /*autoprefixer: on */
    -webkit-line-clamp: 3;
    /*限制在一个块元素显示的文本的行数*/
    overflow: hidden;
    font-size: 14px;
    margin-top: 20px;
  }
  .cell .nickname {
    margin-top: 32px;
  }
  .cell .title {
    color: #333333;
    font-weight: 900;
    margin-top: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -moz-text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cell .answer,
  .cell .setIssue,
  .cell .issue,
  .cell .time {
    font-size: 12px;
  }
  .cell .setIssue {
    margin-right: 18px;
    color: #0099e5;
    cursor: pointer;
  }
  .cell .setIssue:hover {
    color: #1882b7;
    cursor: pointer;
  }
  .write,
  .edit {
    cursor: pointer;
  }
  .table .zoom {
    cursor: pointer;
  }
  .table .zoom:hover {
    background: #f4f5f6;
  }
  .filters {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px #d8d8d8 solid;
    margin-left: 30px;
    margin-right: 30px;
    padding-left: 15px;
    margin-top: 10px;
    border-top: 1px #d8d8d8 solid;
  }
</style>