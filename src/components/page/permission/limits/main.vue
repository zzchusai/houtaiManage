<template>
	<div class="limits main">
		<div class="limits-top main-top zoom">
			<div class="limits-title lf">权限管理 / <span class="zClr-999">权限列表</span></div>
		</div>
		<div class="search-btn">
			<div class="butn btn-box btn-normal" v-show="QXXZ" style="margin-top:5px;" @click="addMng">添加权限</div>
		</div>
		<div class="page">
			<div class="page-info" style="max-height: 640px;overflow-y: auto;">
				<table>
					<thead>
						<tr><th v-for='title in titles'>{{title}}</th></tr>
					</thead>
					<tbody>
						<tr v-for="item in tableData">
							<td><div class="name">{{item.name}}</div></td>
							<td>{{item.code}}</td>
							<td>{{item.isshow}}</td>
							<td>
								<span class="operation" v-show="QXBJ" @click="editOper(item.id)">编辑</span>
								<span class="operation delete" v-show="QXSC" @click="delOper(item.id)">删除</span>
							</td>
						</tr>
					</tbody>
				</table>
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
				titles: ['权限名称','权限编码','是否启用','操作'],
				tableData:[],
				model: false,
				id: '',
				QXXZ: false,
				QXBJ: false,
				QXSC: false
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
					if(item == 'QXXZ'){
						self.QXXZ = true;
					}
					if(item == 'QXBJ'){
						self.QXBJ = true;
					}
					if(item == 'QXSC'){
						self.QXSC = true;
					}
				});
			},
			render(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$http.post(self.HOST+'/privilege').then(function(data){
					if(data.data.status == 1){ 
						self.tableData = data.data.data;
						for(var i = 0; i < self.tableData.length; i++) {
							self.tableData[i].isshow = self.tableData[i].isshow?'是':'否';
							self.tableData[i].name = self.tier(self.tableData[i].level*2)+' '+self.tableData[i].name;
						}
						if(self.tableData.length == 0){
							let html = '<tr class="found-tr"><td colspan="4"><div class="found"></div></td></tr>';
							$('tbody').html(html);
						}
					}else{
						alert(data.data.msg);
					}
				});
			},
			tier(num) {
				let hie = '';
				for(var i = 0;i <= num;i++){
					hie += '--------';
				}
				return hie;
			},
			addMng(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/addLimit?type=add');
			},
			editOper(id) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$router.push('/addLimit?type=edit&id='+id);
			},
			delOper(id) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.model = true;
				self.id = id;
			},
			confirm() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let id = self.id;
				self.$http.post(self.HOST+'/privilege/delete/'+id).then(function(data){
					if(data.data.status == 1){
						Toast.makeText('删除成功');
						self.render();
						self.model = false;
					}else{
						alert(data.data.msg);
					}
				});
			},
			cancel() {
				this.model = false;
			}
		}
	}
</script>

<style scoped>
	.name{padding-left:20px;text-align: left;}
	th:first-child{text-align: left;padding-left:20px;}
</style>