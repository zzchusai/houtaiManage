<template>
	<div class="originMng main">
		<div class="originMng-top main-top zoom">
			<div class="originMng-title lf">用户来源统计 / <span class="zClr-999">来源管理</span></div>
		</div>
		<div class="search-btn">
			<div v-show="ZJLY" class="butn btn-box btn-normal" style="margin-top:5px;" @click="addMng">新增来源</div>
		</div>
		<div class="page">
			<div class="page-info">
				<table>
					<thead>
						<tr><th v-for='title in titles'>{{title}}</th></tr>
					</thead>
					<tbody>
						<tr v-for="item in tableData">
							<td class="sf-w400">{{item.source_name}}</td>
							<td class="sf-w300">
								<div class="QR"><img :src="item.source_pic" alt="" /></div>
							</td>
							<!-- 下载量 -->
							<td>{{item.down}}</td>
							<!-- 组册量 -->
							<td>{{item.reg}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="model" v-show="modelAdd">
			<div class="model-main">
				<div class="model-title">新增来源</div>
				<el-form ref="addMsg" :model="addMsg" :rules="rules" class="model-input">
					<el-form-item prop="placeName">
						<el-input v-model="addMsg.placeName" @keyup.enter.native="doConfirm('addMsg')" size="nomal" placeholder="请输入渠道名称"></el-input>
					</el-form-item>
					<el-form-item style="display:none;">
						<el-input></el-input>
					</el-form-item>
				</el-form>
				<div class="model-btn zoom">
					<div class="butn btn-cancel lf" style="margin-top:5px;" @click="cancel('addMsg')">取消</div>
					<div class="butn btn-main rt" style="margin-top:5px;" @click="confirm('addMsg')">生成二维码</div>
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
				titles: ['用户来源','二维码','下载数','注册量'],
				tableData:[],
				modelAdd: false,
				id: '',
				placeName: '',
				addMsg: {
					placeName: '',
				},
				rules: {
					placeName: [
						{required: true,message: '请输入渠道名称',trigger: 'change'}
					]
				},
				turnBtnState: true,
				ZJLY: false
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
					if(item == 'ZJLY'){
						self.ZJLY = true;
					}
				});
			},
			render(num){
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let data = {
					page:num
				};
				$('.found-tr').hide();
				self.$http.post(self.HOST+'/userSource',data).then(function(data){
					if(data.data.status == 1){ 
						self.tableData = data.data.data;
						for(var i = 0;i<self.tableData.length;i++){
							self.tableData[i].source_pic = self.tableData[i].source_pic;
						}
						if(self.tableData.length == 0){
							let html = '<tr class="found-tr"><td colspan="2"><div class="found"></div></td></tr>';
							$('tbody').html(html);
						}
					}else{
						alert(data.data.msg);
					}
				});
			},
			addMng(){
				this.modelAdd = true;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
			},
			cancel(addMsg) {
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.modelAdd = false;
				this.$refs[addMsg].resetFields();
			},
			confirm(addMsg) {
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let data = {
					source_name:self.addMsg.placeName
				};
				if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
				        if (valid) {
							self.turnBtnState = false;
							self.$http.post(self.HOST+'/userSource/save',data).then(function(data){
								if(data.data.status == 1){ 
									self.modelAdd = false;
									Toast.makeText('添加成功');
									self.addMsg.placeName = '';
									self.render(1);
                    				self.turnBtnState = true;
                    				this.$refs[addMsg].resetFields();
								}else{
									if(data.data.msg == '增加source_name:'+self.addMsg.placeName+'时与数据库值重复！'){
										alert('渠道名称重复');
									}else{
										alert(data.data.msg);
									}
									self.modelAdd = false;
									self.addMsg.placeName = '';
                    				self.turnBtnState = true;
								}
							});
						}
				    });
				}
			},
			doConfirm(addMsg) {
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.confirm(addMsg);
				this.$refs[addMsg].resetFields();
			},
		}
	}
</script>

<style scoped>
	.QR{width:160px;margin:10px auto;}
	.model-input{width:62%;margin-bottom:20px;margin-left:19%;padding:15px 0;}
	.butn{padding:0 15px;}
</style>