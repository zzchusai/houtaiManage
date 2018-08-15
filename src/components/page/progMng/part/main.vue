<template>
	<div class="part main">
		<div class="part-top main-top zoom">
			<div class="part-title lf">节目管理 / <span class="zClr-999">栏目列表</span></div>
		</div>
		<div class="search-btn">
			<div class="butn btn-box btn-normal" v-show="LMXZ" style="margin-top:5px;" @click="addMng">添加栏目</div>
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
							<td>{{item.user_name}}</td>
							<td>{{item.create_time}}</td>
							<td>
								<span class="operation" v-show="LMBJ" @click="gotoInfo(item.id)">查看详情</span>
								<span class="operation" v-show="LMBJ" @click="editOper(item.id)">编辑</span>
								<span class="operation delete" v-show="LMSC" @click="delOper(item.id)">删除</span>
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
				titles: ['栏目名称','栏目主播','创建时间','操作'],
				tableData: [
					{name:'ceshi',id:1},
					{name:'ceshi',id:1}
				],
				cur_page: 1,
				totalpages: 0,
				model: false,
				id: '',
				LMBJ: false,
				LMXZ: false,
				LMSC: false,
				page: true
			}
		},
		created() {
			this.render(1);
			this.limit();
		},
		methods:{
			gotoInfo(id){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/partInfo?id='+id );

			},
			limit() {
				let self = this;
				let limitCode =JSON.parse(localStorage.getItem('limitCode'));
				limitCode.forEach(function(item,index){
					if(item == 'LMBJ'){
						self.LMBJ = true;
					}
					if(item == 'LMXZ'){
						self.LMXZ = true;
					}
					if(item == 'LMSC'){
						self.LMSC = true;
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
					page:num,
					keywords:self.form.name
				};
				self.$http.post(self.HOST+'/column',data).then(function(data){
					if(data.data.status == 1){
						self.tableData = data.data.data.data;
						for(var i = 0; i < self.tableData.length; i++) {
							if(self.tableData[i].create_time) {
								self.tableData[i].create_time = new Date(self.tableData[i].create_time*1000).format("yyyy-MM-dd");
							} else {
								self.tableData[i].create_time = '';
							}
						}
						if(self.tableData.length == 0){
							let html = '<tr class="found-tr"><td colspan="4"><div class="found"></div></td></tr>';
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
				self.$router.push('/addPart?type=add');
			},
			editOper(id) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/addPart?type=edit&id='+id);
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
				self.$http.post(self.HOST+'/column/delete/'+self.id).then(function(data){
					if(data.data.status == 1){
						Toast.makeText('删除成功');
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