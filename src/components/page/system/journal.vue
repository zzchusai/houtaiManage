<template>
	<div class="journal main">
		<div class="journal-top main-top zoom">
			<div class="journal-title lf">系统管理 / <span class="zClr-999">操作日志</span></div>
		</div>
		<div class="page">
			<div class="page-info">
				<table>
					<thead>
						<tr><th v-for='title in titles'>{{title}}</th></tr>
					</thead>
					<tbody>
						<tr v-for="item in tableData">
							<td>{{item.admin_name}}</td>
							<td>{{item.create_time}}</td>
							<td>{{item.action}}</td>
						</tr>
					</tbody>
				</table>
				<div class="pagination zoom">
					<el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
					</el-pagination>
				</div>
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
		data(){
			return {
				form:{
					name:''
				},
				titles: ['名称','操作时间','操作记录'],
				tableData:[],
				cur_page:1,
				totalpages:0,
				page: true
			}
		},
		created() {
			this.render(1);
		},
		methods:{
			handleCurrentChange(val) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.cur_page = val;
				this.render(val);
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
				self.$http.post(self.HOST+'/actionLog',data).then(function(data){
					if(data.data.status == 1){
						self.tableData = data.data.data.data;
						for(var i = 0; i < self.tableData.length; i++) {
							if(self.tableData[i].create_time) {
								self.tableData[i].create_time = new Date(self.tableData[i].create_time*1000).format("yyyy-MM-dd hh:mm:ss");
							} else {
								self.tableData[i].create_time = '';
							}
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
			}
		}
	}
</script>

<style>
	
</style>