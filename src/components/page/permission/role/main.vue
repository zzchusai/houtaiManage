<template>
	<div class="role main">
		<div class="role-top main-top zoom">
			<div class="role-title lf">权限管理 / <span class="zClr-999">角色列表</span></div>
		</div>
		<div class="search-btn">
			<div class="butn btn-box btn-normal" v-show="JSXZ" style="margin-top:5px;" @click="addMng">添加角色</div>
		</div>
		<div class="page">
			<div class="page-info">
				<table>
					<thead>
						<tr><th v-for='title in titles'>{{title}}</th></tr>
					</thead>
					<tbody>
						<tr v-for="item in tableData">
							<td>{{item.name}}</td>
							<td class="limits" @click="limits($event)">{{item.desc}}</td>
							<td>
								<span class="operation" v-show="JSBJ" @click="editOper(item.id)">编辑</span>
								<span class="operation delete" v-show="JSSC" @click="delOper(item.id)">删除</span>
							</td>
							<div style="display: none;position: relative;">
								<div class="role-detail">
									<div v-for="(list,index) in item.role_list" style="margin-top:6px;background: #fff;padding:0 20px;">
										<div class="stair">
											<span class="pane"></span>
											<span class="title">{{list.name}}</span>
										</div>
										<div class="second zoom">
											<div class="zoom second-list" v-for="(n,index) in list.next">
												<div class="lf second-item">
													<span class="second-round"></span>
													<span class="lf">{{n.name}}</span>
												</div>
												<div style="display:inline-block;" class=" second-item" v-for="(m,index) in n.next">
													<span class="round"></span>
												<span class="lf">{{m.name}}</span>
												</div>
											</div>
										</div>
									</div>
									<span class="del" @click="del($event)"></span>
								</div>
								<div class="model-bg"></div>
							</div>
						</tr>
					</tbody>
				</table>
				<div class="pagination zoom">
					<el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
					</el-pagination>
				</div>
			</div>
		</div>
		<div class="model" v-show="model">
			<div class="model-main">
				<div class="model-del">确定删除？</div>
				<div class="model-btn zoom">
					<div class="butn btn-cancel btn-small lf" style="margin-top:5px;" @click="cancel">取消</div>
					<div class="butn btn-main btn-small rt" style="margin-top:5px;" @click="confirm">确定</div>
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
		data(){
			return {
				form:{
					name:''
				},
				titles: ['角色名称','权限','操作'],
				tableData: [],
				cur_page: 1,
				totalpages: 0,
				model: false,
				id: '',
				JSXZ: false,
				JSBJ: false,
				JSSC: false,
				page: true
			}
		},
		created() {
			this.render(1);
			this.limit();
		},
		methods:{
			limit() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
				let limitCode =JSON.parse(localStorage.getItem('limitCode'));
				limitCode.forEach(function(item,index){
					if(item == 'JSXZ'){
						self.JSXZ = true;
					}
					if(item == 'JSBJ'){
						self.JSBJ = true;
					}
					if(item == 'JSSC'){
						self.JSSC = true;
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
			},
			handleSelectionChange(val){
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.multipleSelection = val;
			},
			render(num){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.cur_page = num;
				let data = {
					page:num
				};
				self.$http.post(self.HOST+'/role',data).then(function(data){
					if(data.data.status == 1){ 
						self.tableData = data.data.data.data;
						if(self.tableData.length == 0){
							let html = '<tr class="found-tr"><td colspan="5"><div class="found"></div></td></tr>';
							$('tbody').html(html);
							self.page = false;
						}
						for(var i = 0;i < self.tableData.length;i++){
							for(var j = 0;j < self.tableData[i].role_list.length;j++){
								
							}
						}
						let total = data.data.data.total;
						self.totalpages = parseInt(total);
					}else{
						alert(data.data.msg);
					}
				});
			},
			addMng(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/addRole?type=add');
			},
			editOper(id) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/addRole?type=edit&id='+id);
			},
			delOper(id) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.model = true;
				this.id = id;
			},
			cancel() {
				this.model = false;
			},
			confirm() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$http.post(self.HOST+'/role/delete/'+self.id).then(function(data){
					if(data.data.status == 1){
						Toast.makeText('删除成功');
						self.render(self.cur_page);
						self.model = false;
					}else{
						alert(data.data.msg);
					}
				});
			},
			limits($event) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				$($event.target).siblings('div').show();
			},
			del($event) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				$($event.target).parent().parent().hide();
			}
		}
	}
</script>

<style scoped>
	.limits{max-width: 210px;text-align:left;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;-webkit-line-clamp: 2;-webkit-box-orient: vertical;cursor: pointer;}
	.role-detail{position: fixed;top:20%;right:15%;width:57%;background: #f4f5f6;z-index: 999;padding:30px 20px 30px 30px;max-height:65%;overflow-y: auto;}
	.stair{height:56px;line-height:56px;text-align: left;padding-left:20px;font-size: 20px;color:#333;border-bottom: 1px dashed #ccc;position: relative;}
	.pane{height:18px;position: absolute;top:19px;left:0px;border-left:3px solid #c19c75;}
	.second{text-align: left;}
	.second-item{height:40px;line-height:40px;margin-right:20px;padding-left:20px;position: relative;color:#999;}
	.second-round{position: absolute;top:14px;left:0px;width:12px;height:12px;background: url(../../../../../static/img/dui.png) no-repeat center;background-size: 12px;}
	.round{position: absolute;top:16px;left:0px;width:8px;height:8px;border-radius: 50%;background: #f1f1f1;}
	.del{position: absolute;top:10px;right:10px;width:20px;height:20px;cursor: pointer;background: url(../../../../../static/img/delete.png) no-repeat center;background-size: 20px;}
</style>