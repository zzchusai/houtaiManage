<template>
	<div class="fl sf-main">
		<div class="main-top zoom pl30">
			<div class="lf">使用反馈 / <span class="zClr-999">反馈列表</span></div>
		</div>
		<div class="sf-table-page">
			<table>
				<thead>
				<tr style="border-top:0;border-bottom: 1px solid #f1f1f1;">
					<th v-for='title in titles'>{{title}}</th>
				</tr>
				</thead>
				<tbody>
				<tr style="border-top:0;cursor: pointer;border-bottom:1px solid #f1f1f1;" v-for="item in tableData" @click="gotoAddFeedback(item.id)">
					<td>{{item.user_name}}</td>
					<td>{{item.type}}</td>
					<td>{{item.create_time}}</td>
					<td class="sf-color-subject" v-if="item.is_reply === 1">已回复</td>
					<td class="delete"  v-else>未回复</td>
					<td class="sf-w400" align="center"><div class="sf-w300 textoverflow">{{item.content}}</div></td>
					<td>
						<span class="operation delete" style="line-height: 48px;font-size: 14px;" @click.stop="del(item.id)">删除</span>
					</td>
				</tr>
				</tbody>
			</table>
			<!--分页-->
			<div class="pagination zoom pt20 pb30">
				<el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
				</el-pagination>
			</div>
		</div>
		<!--弹出层对话框组件-->
		<sf-popups :message="sfMessage" @sfCancel="sfCancel()" @sfConfirm="sfConfirm()" v-show="bModel"></sf-popups>
	</div>
</template>

<script>
	//    弹出层组件
	import sfPopups from '../../component/popups/popups.vue';
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
				bModel:false,
				turnBtnState:true,
				sfMessage:"是否删除该条反馈？",
				addFeedbackId:0,
				titles: ['用户名','反馈类型','反馈时间','回复状态','内容','操作'],
				tableData:[],
				del_id:0,
				page: true,
				cur_page:1,  //分页当前页参数
				totalpages:0,//分页总页数
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
			sfPopups,
		},
		methods: {
			gotoAddFeedback(id){
				let self = this;
				 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/detailsFeedback?id='+id);
			},
			del(id){
				let vm = this;
				 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				vm.addFeedbackId = id;
				vm.bModel = true;
			},
//          分页currentPage 改变时会触发
			handleCurrentChange(val) {
				this.cur_page = val;
				this.render(val);
				window.history.replaceState('page',null,"?page="+val);
			},
			render(num){
				let self = this,total;
				 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.cur_page = num;
				let data = {
					page:num,
				};

				self.$http.post(self.HOST + '/feedBack', data).then(function (data) {
						if (data.data.status == 1) {
							self.tableData = data.data.data.data;
							for (var i = 0; i < self.tableData.length; i++) {
								if (self.tableData[i].create_time) {
									self.tableData[i].create_time = new Date(self.tableData[i].create_time * 1000).format("yyyy-MM-dd hh:mm:ss");
								} else {
									self.tableData[i].create_time = '';
								}
								self.tableData[i].type = self.tableData[i].type == 1 ? '需求' : self.tableData[i].type == 2 ? 'bug' : '其他';
							}
							if (!self.tableData.length) {
								let html = '<tr class="found-tr"><td colspan="6"><div class="found"></div></td></tr>';
								$('tbody').html(html);
								self.page = false;
							}
							total = data.data.data.total;
							self.totalpages = parseInt(total);
							self.turnBtnState = true;
						} else {
							self.turnBtnState = true;
							alert(data.data.msg);
						}
					});
			},
			sfCancel(){
				let vm = this;
				 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				vm.bModel = false;
			},
			sfConfirm(){
				let self = this;
				 if (window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let data={id:self.addFeedbackId};
				if (self.turnBtnState) {
					self.turnBtnState = false;
					self.$http.post(self.HOST + '/feedBack/delete', data).then(function (data) {
						if (data.data.status == 1) {
							Toast.makeText('删除成功');
							self.render(1);
							self.bModel = false;
							self.turnBtnState = true;
						} else {
							self.turnBtnState = true;
							alert(data.data.msg);
						}
					});
				}
			},
		}
	}
</script>

