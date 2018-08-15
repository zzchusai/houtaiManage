<template>
	<div class="manage main">
		<div class="manage-top main-top zoom">
			<div class="manage-title lf">权限管理 / <span class="zClr-999">注销列表</span></div>
			<el-form ref="form" :model="form" :rules='rules' label-width="35px" style="margin-top:4px;" class="search-item">
				<el-form-item class="search" prop="phone">
					<div class="search-icon"></div>
					<el-input v-model="form.phone" placeholder="请输入手机号" @change="search" @keyup.enter.native="searched">
					</el-input>
					<div class="go" v-show="go" @click="render(1)"></div>
				</el-form-item>
				<el-form-item style="display: none;">
					<el-input></el-input>
				</el-form-item>
			</el-form>
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
								<span class="operation" v-show="QYGLY" @click="enabled(item.id)">启用</span>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="pagination zoom">
					<el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :page-size="10" :total="totalpages" class="rt">
					</el-pagination>
				</div>
			</div>
		</div>
		<div class="model" v-show="model">
			<div class="model-main">
				<div class="model-del">确定启用？</div>
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
			var validateTel = (rule, value, callback) => {
            	var regExp = /^[0-9]*$/;
		        if (value === '') {
		            callback();
		        }else if (regExp.test(value) === false) {
		            callback(new Error('请输入数字'))
		        } else {
		            callback();
		        }
	        };
			return {
				form: {
					phone: ''
				},
				rules: {
					phone: [
						{validator: validateTel,trigger: 'change'}
					]
				},
				titles: ['用户名','角色','手机号','最后登录时间','操作'],
				tableData: [],
				cur_page: 1,
				totalpages: 0,
				model: false,
				id: '',
				QYGLY: false,
				page: true,
				go: false
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
					if(item == 'QYGLY'){
						self.QYGLY = true;
					}
				});
			},
			handleCurrentChange(val) {
				this.cur_page = val;
				this.render(val);
			},
			search() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(this.form.phone != ''){
					this.go = true;
				}else{
					this.go = false;
				}
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
					phone:self.form.phone
				};
				$('.found-tr').hide();
				self.$http.post(self.HOST+'/adminCancel',data).then(function(data){
					if(data.data.status == 1){
						self.tableData = data.data.data.data;
						for(var i = 0; i < self.tableData.length; i++) {
							if(self.tableData[i].lasttime) {
								self.tableData[i].lasttime = new Date(self.tableData[i].lasttime*1000).format("yyyy-MM-dd hh:mm:ss");
							} else {
								self.tableData[i].lasttime = '';
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
			},
			enabled(id) {
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
				self.$http.post(self.HOST+'/adminEnable/'+self.id).then(function(data){
					if(data.data.status == 1){
						Toast.makeText('启用成功');
						self.render(self.cur_page);
						self.model = false;
					}else{
						alert(data.data.msg);
					}
				});
			},
			searched() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.render(1);
			}
		}
	}
</script>

<style>
	
</style>