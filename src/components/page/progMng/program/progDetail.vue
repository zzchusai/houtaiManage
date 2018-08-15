<template>
	<div class="progDetail main">
		<div class="progDetail-top main-top">
			<div class="progDetail-title">节目管理 / <span class="zClr-999">节目列表 / </span><span class="zClr-999">节目详情</span></div>
		</div>
		<div class="progDetail-tab">
			<div class="tab-content active">节目</div>
			<div class="tab-content" @click="switchGoods">商品</div>
		</div>
		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<div class="addsset-main">
					<el-form label-width="130px" class="edit">
						<el-form-item label="节目名称：">
							<div style="color:#777;">{{data.name}}</div>
							<!--<el-input v-model="data.name" size="nomal"></el-input>-->
						</el-form-item>
						<el-form-item label="节目封面：">
							<div class="cover">
								<img :src="data.radio_pic" alt="" />
							</div>
						</el-form-item>
							<el-form-item label="分享用图: ">
								<div class="cover">
									 <img :src="data.share_img" alt=""  v-if="isShow">
									 <span v-if="!isShow">无</span>
						        </div>
						</el-form-item>
						<el-form-item label="分享标题：">
							<div style="color:#777;">{{data.share_title}}</div>
						</el-form-item>
						<el-form-item label="分享内容：" style="margin-bottom:10px">
							<div style="color:#777;" >{{data.share_intro}}</div>
						</el-form-item>
						<el-form-item label="最后编辑时间：">
							<div style="color:#777;">{{data.update_time}}</div>
						</el-form-item>
						<el-form-item label="上架时间：">
							<div style="color:#777;">{{data.showup_time}}</div>
						</el-form-item>
						<el-form-item label="声音简介：">
							<div style="color:#777;" id='soundAbstract'>无</div>
						</el-form-item>
						<el-form-item label="数据统计：" style="margin-top:10px">
							<ul class="statistics zoom">
								<li class="statistics-box lf">播放次数 {{data.play_nums}}</li>
								<li class="statistics-box lf">下载次数 {{data.download_nums}}</li><br />
								<li class="statistics-box lf">收藏次数 {{data.collect_nums}}</li>
								<li class="statistics-box lf">分享次数 {{data.share_nums}}</li><br />
								<li class="statistics-box lf">评论 {{data.comment_nums}}</li>
							</ul>
						</el-form-item>
					</el-form>
					<div class="progDetail-btn zoom">
						<el-button class="btn-main button rt" v-show="JMBJ" type="primary" @click="edit" style='margin-bottom:60px'>编辑</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				data: {},
				model: false,
				id: '',
				JMBJ: false,
				isShow:''
			}
		},
		created() {
			this.limit();
			this.render();
		},
		methods:{
			limit() {
				let self = this;
				let limitCode =JSON.parse(localStorage.getItem('limitCode'));
				limitCode.forEach(function(item,index){
					if(item == 'JMBJ'){
						self.JMBJ = true;
					}
				});
			},
			render(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(self.$route.query.type){
					self.JMBJ = false;
				}
	    		let id = self.$route.query.id;
				self.$http.post(self.HOST+'/program/info/'+id).then(function(data){
					if(data.data.status == 1){ 
						self.data = data.data.data.program_info;
						console.log(self.data);
						if(self.data.radio_pic) {
							self.data.radio_pic = self.data.radio_pic;
						} else {
							self.data.radio_pic = '../../../../../static/img/play.png';
						}
						if(self.data.update_time) {
							self.data.update_time = new Date(self.data.update_time*1000).format("yyyy-MM-dd hh:mm:ss");
						} else {
							self.data.update_time = '';
						}
						if(self.data.showup_time) {
							self.data.showup_time = new Date(self.data.showup_time*1000).format("yyyy-MM-dd hh:mm:ss");
						} else {
							self.data.showup_time = '';
						}
						if(self.data.audio_introduce) {
							let div = document.getElementById('soundAbstract');
							div.innerHTML = self.data.audio_introduce;
							div.style.height = '360px';
							div.style.border = '1px solid gray';
							div.style.overflowY = 'scroll';
							div.style.marginTop = '10px';

						}
						  if(self.data.share_img=='0'){
							self.isShow=false;
						 }else{
							 self.data.share_img= self.data.share_img
						    self.isShow=true;
						 }
						  if(self.data.share_intro=='0'){
							 self.data.share_intro='无'
						 }else{
							 self.data.share_intro=self.data.share_intro
						 }

					}
				});
			},
			edit() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let id = self.$route.query.id;
				self.$router.push('/editVoice?id='+id);
			},
			switchGoods() {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let id = self.$route.query.id;
				self.$router.push('/goodsDetail?id='+id);
			}
		}
	}
</script>

<style scoped>
	.progDetail-tab{border-top: 1px solid #f1f1f1;margin-right:30px;}
	.tab-content{display:inline-block;font-size: 16px;padding:15px;margin-right:20px;cursor: pointer;}
	.active{border-bottom: 2px solid #c19c75;padding-bottom: -2px;}
	.addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
	.addsset-main{width:400px;margin:0 auto;padding-top:30px;}
	.button{display: block;margin-right:100px;margin-top:10px;}
	.statistics-box{color:#777;margin-right:20px;}
	.el-form-item{margin-bottom: 10px!important;}
	#soundAbstract{width:380px;height: 30px; padding-right:10px;padding-left:5px;border: none;}
</style>