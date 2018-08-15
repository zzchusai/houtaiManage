<template>
	<div class="goodsDetail main">
		<div class="goodsDetail-top main-top">
			<div class="goodsDetail-title">节目管理 / <span class="zClr-999">节目列表 / </span><span class="zClr-999">商品详情</span></div>
		</div>
		<div class="goodsDetail-tab">
			<div class="tab-content" @click="switchProgram">节目</div>
			<div class="tab-content active">商品</div>
		</div>
		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<ul class="zoom goods-ul">
					<li class="lf goodsPic" v-for="item in tableData">
						<div class="goodsImg"  style='width:90px;margin:0 auto;height:70px' @click="clickGoods(item.taobao_url)">
							<img :src="item.pic" alt="" style="height:100%;" />
						</div>
						<div class="goodsTxt" @click="clickGoods(item.taobao_url)">{{item.name}}</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				tableData:[],
				cur_page:1,
				totalpages:100,
				model: false,
				id: ''
			}
		},
		created() {
			this.render();
		},
		methods:{
			render(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let id = self.$route.query.id;
				self.$http.post(self.HOST+'/program/info/'+id).then(function(data){
					if(data.data.status == 1){ 
						self.tableData = data.data.data.good_list;
						for(var i = 0; i < self.tableData.length; i++) {
							if(self.tableData[i].pic) {
								self.tableData[i].pic = self.tableData[i].pic;
							} else {
								self.tableData[i].pic='../../../../../static/img/play.png'
							}
						}
						if(self.tableData.length == 0){
							let html = '<div class="found"></div>';
							$('.goods-ul').html(html);
							self.page = false;
						}
					}
				});
			},
			edit() {
				
			},
			clickGoods(taobao_url){
				console.log(taobao_url);
			},
			switchProgram() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
				let id = self.$route.query.id;
				self.$router.push('/progDetail?id='+id);
			}
		}
	}
</script>

<style>
	.goodsDetail-tab{border-top: 1px solid #f1f1f1;margin-right:30px;}
	.tab-content{display:inline-block;font-size: 16px;padding:15px;margin-right:20px;cursor: pointer;}
	.active{border-bottom: 2px solid #c19c75;padding-bottom: -2px;}
	input{border-style: none!important;padding-left:0!important;color:#777!important;}
	.goodsPic{width:160px;margin-right:20px;margin-top:25px;}
	.goodsTxt{font-size: 14px;text-align: center;margin:10px 0;max-width: 160px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
	.button{display: block;margin:0 auto;}
</style>