<template>
	<div class="program main">
		<div class="program-top main-top zoom">
			<div class="program-title lf">节目管理 / <span class="zClr-999">节目列表</span></div>
		</div>
		<div class="search-btn">
			<div class="butn btn-box btn-normal" style="margin-top:5px;margin-right:20px;" @click="putAudio">上传音频</div>
			<div class="butn btn-box btn-normal" style="margin-top:5px;margin-right:20px;" @click="exportList">批量导出</div>
		</div>
		<div class="search-items">
			<el-form :inline="true">
				<el-form-item label="选择大师：" class="search-item" style="margin-right:30px;">
					<el-select v-model="author_id" placeholder="请选择"  @change="changeMaster">
						<el-option v-for="item in masters" :label="item.nickname" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择栏目：" class="search-item" style="margin-right:30px;">
					<el-select v-model="column_id" placeholder="请选择" style="width:200px;" @change="changeColumn">
						<el-option v-for="item in columns" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序：" class="search-item">
					<el-select v-model="order_by" placeholder="请选择" style="width:120px;" @change="changeSort">
						<el-option v-for="item in sorts" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<div class="page" style="margin-bottom:30px">
			<div class="page-info">
				<table>
					<tbody>
						<tr v-for="item in tableData">
							<div class="program-box zoom">
								<div class="program-icon lf" @click='audioPlay($event)'>
									<audio class="audio" :src="item.radio_url" style="margin-left:50px;" v-on:ended="test($event)"></audio>
								</div>
								<div class="program-msg lf">
									<div class="program-one zoom">
										<div class="program-title lf">{{item.name}}</div>
										<div class="program-date lf" style="margin-right:20px;">（最后编辑时间：{{item.update_time}}）</div>
										<div class="program-date lf" v-if="item.radio_origin_url===''">转码中...</div>
										<div class="program-date lf" style="color:#e5233f;" v-if="item.radio_origin_url==='0'">转码失败</div>
										<div class="program-date lf" v-if="item.radio_origin_url!=='0'&&item.radio_origin_url!==''">转码成功</div>
									</div>
									<div class="program-tow zoom">
										<div class='program-play program-num lf'>节目ID：{{item.id}}</div>
										<div class='program-play program-num lf'>播放：{{item.play_nums}}</div>
										<div class='program-download program-num lf'>下载：{{item.download_nums}}</div>
										<div class='program-share program-num lf'>分享：{{item.share_nums}}</div>
										<div class='program-collect program-num lf'>收藏：{{item.collect_nums}}</div>
										<div class='program-comment program-num lf'>评论：<span @click='comment(item.id)' v-bind:class='{hui:JMPL==false}'>{{item.comment_nums}}</span></div>
									</div>
								</div>
								<div class="oper rt">
									<div class="operation" @click="editOper(item.id)">查看详情</div>
									<div class="operation delete" @click="delOper(item.id)">删除</div>
									<div id="sold_out" v-if="item.type==0" style="width:42px;" class="operation delete" @click="soldOper(item.id)">下架</div>
									<div id="add" v-if="item.type==2" style="width:42px;" class="operation addOper" @click="addOper(item.id)">上架</div>
									<div class="operation" v-if="item.type==1" style="position:relative;" @mouseover="over($event)" @mouseout="out($event)">
										待上架
										<div class="showup">上架时间 {{item.showup_time}}</div>
									</div>
									<!--<div class="operation" v-if="item.type==1">{{item.showup_time}}</div>-->
								</div>
							</div>
						</tr>
					</tbody>
				</table>
				<div class="pagination zoom" style="margin:40px 0">
					<el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
					</el-pagination>
				</div>
			</div>
		</div>
		<div class="model" v-show="modelDelete">
			<div class="model-main">
				<div class="model-del">确定删除？</div>
				<div class="model-btn zoom">
					<div class="butn btn-cancel btn-small lf" style="margin-top:5px;" @click="cancel">取消</div>
					<div class="butn btn-main btn-small rt" style="margin-top:5px;" @click="confirmDelete">确定</div>
				</div>
			</div>
			<div class="model-bg"></div>
		</div>
		<div class="model" v-show="modelSoldOut">
			<div class="model-main">
				<div class="model-del">确定下架？</div>
				<div class="model-btn zoom">
					<div class="butn btn-cancel btn-small lf" style="margin-top:5px;" @click="cancel">取消</div>
					<div class="butn btn-main btn-small rt" style="margin-top:5px;" @click="confirmSoldOut">确定</div>
				</div>
			</div>
			<div class="model-bg"></div>
		</div>
		<div class="model" v-show="modelAdd">
			<div class="model-main">
				<div class="model-del">确定上架？</div>
				<div class="model-btn zoom">
					<div class="butn btn-cancel btn-small lf" style="margin-top:5px;" @click="cancel">取消</div>
					<div class="butn btn-main btn-small rt" style="margin-top:5px;" @click="confirmAdd">确定</div>
				</div>
			</div>
			<div class="model-bg"></div>
		</div>
		<div class="model" v-show="clue">
			<div class="model-main">
				<div class="model-del">该大师还没栏目，请先添加栏目！</div>
				<div class="model-btn zoom">
					<div class="butn btn-cancel btn-small lf" v-show="false" style="margin-top:5px;">取消</div>
					<div class="butn btn-main btn-small" style="margin-top:5px;margin-left:calc(50% - 30px);" @click="confirmclue">确定</div>
				</div>
			</div>
			<div class="model-bg"></div>
		</div>
	</div>
</template>

<script>
	let Toast={
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
	            let node=document.createElement("div");
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
				init: 0,
				masters: [],
				columns: [],
				sorts: [
					{value:'name',label:'节目名称'},
					{value:'showup_time_desc',label:'上架时间↓'},
					{value:'showup_time_asc',label:'上架时间↑'},
					{value:'update_time',label:'最后编辑时间'},
					{value:'play_nums',label:'播放次数'},
					{value:'download_nums',label:'下载次数'},
					{value:'share_nums',label:'分享次数'},
					{value:'collect_nums',label:'收藏次数'},
					{value:'comment_nums',label:'评论次数'}
				],
				author_id: '',
				author: '',
				column_id: '',
				order_by: 'name',
				tableData: [],
				cur_page: 1,
				totalpages: 0,
				modelDelete: false,//删除
				modelSoldOut: false,//下架
				modelAdd: false,//上架
				deleteId: '',
				soldOutId: '',
				addId: '',
				objA: '',
				objC: '',
				SCYP: false,//上传音频
				JMXQ: false,//节目详情
				JMSC: false,//节目删除
				JMXJ: false,//节目下架
				JMDC: false,//节目导出
				JMPL: false,//节目评论
				JMSJ: false,//节目上架
				page: true,
				clue: false,
			}
		},
		created() {
		this.order_by = localStorage.getItem('program_sort_by');
			if(this.order_by == undefined || this.order_by == ''){
				this.order_by = 'name';
			}
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
					if(item == 'SCYP'){
						self.SCYP = true;
					}
					if(item == 'JMXQ'){
						self.JMXQ = true;
					}
					if(item == 'JMSC'){
						self.JMSC = true;
					}
					if(item == 'JMXJ'){
						self.JMXJ = true;
					}
					if(item == 'JMDC'){
						self.JMDC = true;
					}
					if(item == 'JMPL'){
						self.JMPL = true;
					}
					if(item == 'JMSJ'){
						self.JMSJ = true;
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
				window.history.replaceState("page",null,"?page="+val);
			},
			changeMaster(value) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.masters.forEach(function(item,index){
					if(self.author_id == item.id){
						if(item.column == null){
							self.clue = true;
							self.author_id = self.author;
							return false;
						}else{
							self.column_id = item.column[0].id;
							if(self.init == 1){
								self.render(1);
							}
						}
					}
				});
				self.objA = self.masters.find((item)=>{
              		return item.id === value;
          		});
				self.columns = self.objA.column;
			},
			changeColumn(value) {
				let self = this;
				if(self.columns){
					self.objC = self.columns.find((item)=>{
	              		return item.id === value;
	          		});
	          	}
				if(self.init == 1){
					self.render(1);
				}
				self.init = 1;
			},
			changeSort() {
				let self = this;
				localStorage.setItem('program_sort_by', self.order_by);
				self.render(1);
			},
			render(num){
				let audioBox = $('.program-icon');
				for(var i=0;i<audioBox.length;i++){
					$(audioBox[i]).css('background-image','url(../../../../../static/img/play.png)');
				}
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.cur_page = num;
				let data = {
					page: num,
					order_by: self.order_by,
				};
				if(self.author_id){
					data.author_id = self.author_id;
				}
				if(self.column_id){
					data.column_id = self.column_id;
				}
				self.page = true;
				$('.found-tr').hide();
				self.$http.post(self.HOST+'/program',data).then(function(data){
					if(data.data.status == 1){
						self.tableData = data.data.data.data;
						console.log(self.tableData);
						for(let i = 0; i < self.tableData.length; i++) {
							if(self.tableData[i].update_time) {
								self.tableData[i].update_time = new Date(self.tableData[i].update_time*1000).format("yyyy-MM-dd hh:mm:ss");
							} else {
								self.tableData[i].update_time = '';
							}
							if(self.tableData[i].showup_time) {
								self.tableData[i].showup_time = new Date(self.tableData[i].showup_time*1000).format("yyyy-MM-dd hh:mm:ss");
							} else {
								self.tableData[i].showup_time = '';
							}
							if(self.tableData[i].type == 1 && new Date(self.tableData[i].showup_time).getTime() <= new Date().getTime()){
								self.tableData[i].type = 0;
							}else{
								self.tableData[i].type = self.tableData[i].type;
							}
							if(self.tableData[i].comment_nums == 0){
								self.tableData[i].disabled = true;
							}else{
								self.tableData[i].disabled = false;
							}
						}
						if(self.masters.length <= 0) {
							self.masters = data.data.other_data;
						}
						self.author_id = data.data.author_id;
						self.author = self.author_id
						self.masters.forEach(function(item,index){
							if(data.data.author_id == item.id){
								self.columns = item.column;
							}
						});
						self.column_id = data.data.column_id;
						if(self.tableData.length == 0){
							let html = '<tr class="found-tr"><td><div class="found"></div></td></tr>';
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
			putAudio() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				console.log(self.author_id);
				console.log(self.column_id);
				console.log(self.objA.nickname);
				console.log(self.objC.name);
				if('SCYP'.isLimit()){
					if(self.author_id == ''){
						alert('暂无大师');
					}else if(self.column_id == ''){
						alert('请先添加栏目');
					}else{
						self.$router.push('/addVoice?author_id='+self.author_id+'&column_id='+self.column_id+'&author_name='+self.objA.nickname+'&column_name='+self.objC.name);
					}
				} else {
					sfLayer.makeText("没有权限操作");
				}
			},
			editOper(id) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if('JMXQ'.isLimit()) {
					self.$router.push('/progDetail?id='+id);
				} else {
					sfLayer.makeText("没有权限操作");
				}
			},
			delOper(id) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if('JMSC'.isLimit()) {
					this.modelDelete = true;
					this.deleteId = id;
				} else {
					sfLayer.makeText("没有权限操作");
				}
				
			},
			soldOper(id) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if('JMXJ'.isLimit()) {
					this.modelSoldOut = true;
					this.soldOutId = id;
				} else {
					sfLayer.makeText("没有权限操作");
				}
			},
			addOper(id) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if('JMSJ'.isLimit()) {
					this.modelAdd = true;
					this.addId = id;
				} else {
					sfLayer.makeText("没有权限操作");
				}
			},
			cancel() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.modelDelete = false;
				this.modelSoldOut = false;
				this.modelAdd = false;
			},
			confirmDelete() {
				let self = this;
				self.$http.post(self.HOST+'/program/delete/'+self.deleteId).then(function(data){
					if(data.data.status == 1){
						Toast.makeText('删除成功');
						self.render(self.cur_page);
						self.modelDelete = false;
					}else{
						alert(data.data.msg);
					}
				});
			},
			confirmSoldOut() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$http.post(self.HOST+'/program/xj/'+self.soldOutId).then(function(data){
					if(data.data.status == 1){
						Toast.makeText('下架成功');
						self.render(self.cur_page);
						self.modelSoldOut = false;
					}else{
						alert(data.data.msg);
					}
				});
			},
			confirmAdd() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$http.post(self.HOST+'/program/sj/'+self.addId).then(function(data){
					if(data.data.status == 1){
						Toast.makeText('上架成功');
						self.render(self.cur_page);
						self.modelAdd = false;
					}else{
						alert(data.data.msg);
					}
				});
			},
			comment(id,name,$event) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(this.JMPL == false){
					return false;
				}else{
					this.$router.push('/comment?id='+id+'&author_id='+this.author_id+'&name='+name);
				}
			},
			exportList(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if('JMDC'.isLimit()){
					let AccessToken = JSON.parse(localStorage.getItem('access_token'));
					AccessToken = AccessToken.replace(/\+/g,'%2B');
					window.open(self.HOST+'/program/export?&ACCESSTOKEN='+AccessToken+'&author_id='+self.author_id+'&column_id='+self.column_id);
				} else {
					sfLayer.makeText("没有权限操作");
				}
				
			},
			audioPlay($event) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let audioPlayer = $($event.target).children();
				let audioPause = $('audio');
				let audioBox = $('.program-icon');
				if(audioPlayer[0].paused){
					for(var i=0;i<audioPause.length;i++){
						audioPause[i].pause();
					}
					for(var i=0;i<audioBox.length;i++){
						$(audioBox[i]).css('background-image','url(../../../../../static/img/play.png)');
					}
					audioPlayer[0].play();
					$($event.target).css('background-image','url(../../../../../static/img/pause.png)');
				}else{
					audioPlayer[0].pause();
					$($event.target).css('background-image','url(../../../../../static/img/play.png)');
				}
			},
			test($event) {
				$($event.target).parent().css('background-image','url(../../../../../static/img/play.png)');
			},
			confirmclue() {
				this.clue = false;
			},
			over($event) {
				$($($event.target)[0]).children().show();
			},
			out($event) {
				$($($event.target)[0]).children().hide();
			}
		}
	}
		
</script>

<style scoped>
	.program-box{font-size: 14px;padding:20px 0;padding-right:20px;padding-left:10px}
	.program-one{height:20px;line-height:20px;}
	.program-title{color:#333;margin-right:20px;max-width:400px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
	.program-date{color:#999;font-size: 12px;}
	.program-num{color:#999;font-size:12px;height:18px;line-height:26px;margin-right:20px;}
	.program-icon{width:32px;height:38px;background: url(../../../../../static/img/play.png) no-repeat center;background-size: 32px;margin-right:10px;}
	.addOper{color:#c19c75;}
	.program-comment span{color:#0099e5;display: inline-block;height:18px;padding:0 5px;cursor: pointer;}
	.program-comment span.hui{color:#999;cursor: auto;}
	.showup{position: absolute;top:40px;right:0px;padding:5px;border:1px solid #f1f1f1;width:200px;color:#999;height:20px;line-height:20px;background: #fff;z-index: 999;border-radius: 5px;display: none;}
</style>