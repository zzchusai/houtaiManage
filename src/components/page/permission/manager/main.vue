<template>
	<div class="manage main">
		<div class="manage-top main-top zoom">
			<div class="manage-title lf">权限管理 / <span class="zClr-999">管理员列表</span></div>
		</div>
		<div class="search-btn">
			<div class="butn btn-box btn-normal" v-show="GLYXZ" style="margin-top:5px;margin-right:20px;" @click="addMng">添加成员</div>
			<div class="butn btn-box btn-normal" v-show="ZXGLYLB" style="margin-top:5px;" @click="logout">查看注销列表</div>
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
							<td>{{item.role}}</td>
							<td>{{item.phone}}</td>
							<td>{{item.lasttime}}</td>
							<td>
								<span class="operation" v-if="item.type" v-show="GLYBJ" @click="editOper(item.id)">编辑</span>
								<span class="operation delete" v-if="item.type" v-show="ZXGLY" @click="delOper(item.id)">注销</span>
								<span class="operation" v-if="!item.type" style="color:#333;">-- --</span>
							</td>
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
				<div class="model-del">确定注销？</div>
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
				titles: ['用户名','角色','手机号','最后登录时间','操作'],
				tableData: [],
				cur_page: 1,
				totalpages: 0,
				model: false,
				id: '',
				GLYBJ: false,
				ZXGLY: false,
				GLYXZ: false,
				ZXGLYLB: false,
				page: true
			}
		},
		created() {
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
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
				let limitCode =JSON.parse(localStorage.getItem('limitCode'));
				limitCode.forEach(function(item,index){
					if(item == 'GLYBJ'){
						self.GLYBJ = true;
					}
					if(item == 'ZXGLY'){
						self.ZXGLY = true;
					}
					if(item == 'GLYXZ'){
						self.GLYXZ = true;
					}
					if(item == 'ZXGLYLB'){
						self.ZXGLYLB = true;
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
				$('.found-tr').hide();
				self.$http.post(self.HOST+'/admin',data).then(function(data){
					if(data.data.status == 1){
						self.tableData = data.data.data.data;
						for(var i = 0; i < self.tableData.length; i++) {
							if(self.tableData[i].lasttime) {
								self.tableData[i].lasttime = new Date(self.tableData[i].lasttime*1000).format("yyyy-MM-dd hh:mm:ss");
							} else {
								self.tableData[i].lasttime = '';
							}
							self.tableData[i].role = self.tableData[i].role?self.tableData[i].role:'未指派';
						}
						if(self.tableData.length == 0){
							let html = '<tr class="found-tr"><td colspan="5"><div class="found"></div></td></tr>';
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
			addMng(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/addMng?type=add');
			},
			logout() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/logout');
			},
			editOper(id) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/addMng?type=edit&id='+id);
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
				self.$http.post(self.HOST+'/admin/delete/'+self.id).then(function(data){
					if(data.data.status == 1){
						Toast.makeText('注销成功');
						self.render(self.cur_page);
						self.model = false;
					}else{
						alert(data.data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	
</style>