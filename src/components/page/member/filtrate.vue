<template>
	<div class="filtrate main">
		<div class="filtrate-top main-top zoom">
			<div class="filtrate-title lf">会员用户管理 / <span class="zClr-999">筛选大师</span></div>
			<el-form ref="form" :model="form"  label-width="30px" style="margin-top:4px;" class="search-item">
				<el-form-item class="search">
					<div class="search-icon"></div>
					<el-input v-model="form.name" placeholder="请输入用户名" @change="search" @keyup.enter.native="searched">
					</el-input>
					<div class="go" v-show="go" @click="render(1)"></div>
				</el-form-item>
				<el-form-item style="display: none;">
					<el-input></el-input>
				</el-form-item>
			</el-form>
		</div>
		<div class="search-btn">
			<div class="butn btn-box btn-normal" style="margin-top:5px;margin-right:20px;" @click="screen">全部用户</div>
			<div class="butn btn-box btn-normal" v-show="YHDC" style="margin-top:5px;margin-right:20px;" @click="exportList">批量导出</div>
		</div>
		<div class="page">
			<div class="page-info">
				<table>
					<thead>
						<tr><th v-for='title in titles'>{{title}}</th></tr>
					</thead>
					<tbody>
						<tr class="data" v-for="item in tableData" @click="checkUser(item.id)">
							<td>
								<div style='width:50px;margin:5px auto;'><img :src="item.avatar" style="border-radius: 50%;" /></div>
							</td>
							<td>{{item.nickname}}</td>
							<td>{{item.gender}}</td>
							<td>{{item.birth_date}}</td>
							<td>{{item.birth_place}}</td>
							<td>{{item.phone}}</td>
							<td>{{item.active}}</td>
							<td class="address">{{item.contact_address}}</td>
							<td class="name">{{item.contact_name}}</td>
							<td>{{item.contact_phone}}</td>
							<!--<td>
								<span class="operation delete" v-show="YHFH" @click="kick(item.id)">封号</span>
							</td>-->
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
				<div class="model-del">确定封号？</div>
				<el-form :model="ban" ref='ban' :rules="rules" label-width="100px" style="padding:0 40px">
					<el-form-item label="封号理由：" prop="reason">
						<el-input type="textarea" v-model="ban.reason" placeholder="模糊查询"></el-input>
					</el-form-item>
				</el-form>
				<div class="model-btn zoom">
					<div class="butn btn-cancel btn-small lf" style="margin-top:5px;" @click="cancel">取消</div>
					<div class="butn btn-main btn-small rt" style="margin-top:5px;" @click="confirm('ban')">确定</div>
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
				titles: ['头像','昵称','性别','出生日期','出生地','手机号','活跃值','通讯地址','联系人','联系方式'],
				tableData: [],
				cur_page: 1,
				totalpages: 0,
				model: false,
				id: '',
				ban: {
					reason: ''
				},
				rules: {
					reason: [
						{required: true,message: '请输入封号理由',trigger: 'blur'}
					],
				},
				YHXQ: false,
				YHFH: false,
				YHDC: false,
				page: true,
				go: false
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
				let self = this;
				let limitCode =JSON.parse(localStorage.getItem('limitCode'));
				limitCode.forEach(function(item,index){
					if(item == 'YHXQ'){
						self.YHXQ = true;
					}
					if(item == 'YHFH'){
						self.YHFH = true;
					}
					if(item == 'YHDC'){
						self.YHDC = true;
					}
				});
			},
			handleCurrentChange(val) {
				this.cur_page = val;
				this.render(val);
				window.history.replaceState('page',null,"?page="+val);
			},
			search() {
				if(this.form.name != ''){
					this.go = true;
				}else{
					this.go = false;
				}
			},
			render(num){
				let self = this;
				self.cur_page = num;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let data = {
					type:2,
					page:num,
					keywords:self.form.name
				};
				$('.found-tr').hide();
				self.$http.post(self.HOST+'/user',data).then(function(data){
					if(data.data.status == 1){
						self.tableData = data.data.data.data;
						for(var i = 0; i < self.tableData.length; i++) {
							if(self.tableData[i].birth_date) {
								self.tableData[i].birth_date = new Date(self.tableData[i].birth_date*1000).format("yyyy/MM/dd");
							} else {
								self.tableData[i].birth_date = '未设置';
							}
							if(self.tableData[i].avatar) {
								self.tableData[i].avatar = self.tableData[i].avatar;
							} else {
								self.tableData[i].avatar='../../../../static/img/avatar.png';
							}
							if(!self.tableData[i].nickname) {
								self.tableData[i].nickname='未设置';
							}
							if(!self.tableData[i].birth_place) {
								self.tableData[i].birth_place='未设置';
							}
							if(self.tableData[i].gender == 1) {
								self.tableData[i].gender='男';
							} else{
								self.tableData[i].gender='女';
							}
						}
						if(self.tableData.length == 0){
							let html = '<tr class="found-tr"><td colspan="10"><div class="found"></div></td></tr>';
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
			kick(id) {
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				event.stopPropagation();
				self.id = id;
				self.model = true;
			},
			cancel() {
				this.model = false;
			},
			confirm(ban) {
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let data = {
					id:self.id,
					seal_reason:self.ban.reason
				};
				self.$refs[ban].validate((valid) => {
			        if (valid) {
			        	self.$http.post(self.HOST+'/user/delete',data).then(function(data) {
			        		if(data.data.status == 1){
			        			Toast.makeText('封号成功');
								self.render(self.cur_page);
								self.model = false;
			        		}else{
			        			alert(data.data.msg);
			        		}
						});
			        }
			 	});
			},
			screen() {
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/member');
			},
			checkUser(id) {
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(self.YHXQ){
					self.$router.push('/editMember?id='+id);
				}
			},
			exportList(){
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let AccessToken = JSON.parse(localStorage.getItem('access_token'));
				AccessToken = AccessToken.replace(/\+/g,'%2B');
				window.open(self.HOST+'/user/export?type=2&ACCESSTOKEN='+AccessToken+'&keywords='+self.form.name);
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

<style scoped>
	.data:hover{background: #f1f1f1;}
	.model-img{width:calc(33.33% - 10px);display: inline-block;margin-right:10px;}
	.address{max-width:120px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
	.name{max-width:100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
</style>