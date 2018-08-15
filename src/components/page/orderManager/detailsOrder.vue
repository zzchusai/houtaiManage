<template>
	<div class="fl sf-main cell" >
		<div class="fl" style="margin-right:15px;margin-left:30px;position:relative" >
			<img :src="item.avatar" class="icon">
			 <img src="../../../../static/img/dsbs.png"  style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="item.type == 2">
		</div>
		<div style="overflow:hidden;margin-right:30px" class="fc">
			<div class="lookAsk fr">
				{{item.create_time}}
					<span style="margin-left:30px">赏金：<i style="margin-left:10px;margin-right:10px;font-style:normal">{{(item.price/100).toFixed(2)}}</i>元</span> 
				</div>
			<div class="nickname">{{item.nickname}}</div>
			 <img src='../../../../static/img/dstx.png' class="tx" v-if="item.type==2" />
            <!-- <img src='../../../../static/img/kdbtx.png' class="tx" v-if="item.code==2" /> -->
			 <span class="fc" v-if="item.type==3">(水军)</span>
			<div class="anonymous" v-show="item.anonymous == 2" style="margin-left:20px">(匿名发布)</div>
			
			<div class="title">{{item.title}}</div>
			<div class="cell-content sf-pre">{{item.content}}</div>
			<div v-show="item.pic && item.pic.length>0" class="cell-imgs zoom">
				<div v-for="img in item.pic">
					<img  :src="img">	
				</div>
				
			</div>
			<div class="zoom info">
				<div  style="display:inline-block">
				<div class="setIssue " v-show="violate==1" @click="setIssue()" >设为违规问答</div>
				<div class="issue "  v-if="violate==2">轻度违规</div>
				<div class="issue "  v-if="violate==3">重度违规</div>
				</div>
				<span class="collect mr20">所属分组：{{item.name}}</span>
				<div v-if="type!='1'" style="display:inline-block">
					<div class="collect mr20">收藏: {{item.collect_nums}}</div>
				<div class="share ">分享: {{item.share_nums}}</div>
				</div>
			</div>
			
		</div>
			<wgPopups :message="message" @sfCancel="isShow" @sfConfirm="confirm" v-show="showAlert"></wgPopups>
	</div>

</template>

<script >
    import wgPopups from '../../component/popups/wgpopups.vue';
	export default{
		data () {
			return {
				askId:0,//问答ID
				type:'',//订单状态
				item:{},//问答详情
				showAlert:false,//展示提示框
				message:'确定该条问答是违规问答吗？',//弹框内容
				violate:1
			}
		},
		created(){
			this.askId = Number(this.$route.query.interlocut_id);
		   this.type=this.$route.query.type; 
				  this.getDetailData();
				  
		},
		 components: {
            wgPopups,
        },
		methods:{
			//获取列表数据
	        getDetailData(){
	        	let self = this;
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				let data = {
					interlocut_id:self.askId,
					type:self.type
				}
				self.$http.post(self.HOST+'/order2interBounty',data).then(function(res){
					if (res.data.status == 1) {
						let item = res.data.data;
						if (item.create_time) 
							{
								item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
							} else {
								item.create_time = '';
							}
							if (!item.avatar) {
								item.avatar = '../../../../static/img/avatar.png';
								// item.avatar = JSON.parse(item.avatar);
							}
						self.item = item;
							self.violate=res.data.data.violate;
							console.log(self.violate);
					}else {
						sfLayer.makeText(res.data.msg); 

					}
						
				})

	        },
	        //设置为违规问答
	        setIssue(){
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
	        	this.showAlert = true;
	        },
	        isShow(){
				//取消
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
	        	this.showAlert = false;
	        },
	         confirm(soft,deep){
				 if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
	        	//确定
				let self = this;
				if(soft==1&&deep==1){
					sfLayer.makeText('请选择违规程度');
				}
				let data={}
				if(soft==6){
                  data={
					id:self.askId,
					violate:2
				  }
				}else if(deep==6){
				 data={
					id:self.askId,
					violate:3
				  }
				}
	        	self.$http.post(self.HOST+'/violateSet',data).then(function(res){
	        		if (res.data.status==1) {
	        			//设置成功
	        			self.violate = res.data.violate;
	        		}else {
	        			sfLayer.makeText(res.data.msg); 
	        		}
	        		self.showAlert = false;

	        	});	
	        },

		}
	}
</script>
<style scoped>
	.cell .icon{
		width: 50px;
		height: 50px;
		border-radius: 25px;
		
		margin-top: 23px;
	}
	.cell .nickname,.cell .collect,.cell .setIssue,.cell .issue,.cell .share,.cell .anonymous{
		display: inline-block;
		margin-top: 22px;
	}
	.cell .lookAsk{
		margin-top: 23px;
		color: #333; 
	}
	.cell .cell-content{
		font-size: 14px;
		margin-top: 20px;
	}
	.cell .nickname{
		margin-top: 32px;
	}
	.cell .title{
		font-weight: 900;
		margin-top: 22px;	
		margin-bottom:20px;
	}
	.cell .share,.cell .setIssue,.cell .issue,.cell .collect{
		font-size: 12px;
	}
	.cell .setIssue{
		margin-right:50px;
		color: #0099E5;
		cursor: pointer;
	}
	.cell .setIssue:hover{
		color: #1882B7;
		cursor: pointer;
	}
	.cell .issue{
		margin-right:50px;
	}
	.cell .info{
		margin-top: 60px;
		margin-bottom: 20px;
		margin-right: 20px;
		text-align: right;
	}
	.cell-imgs div{
		float: left;
	    width:32%;
	    height:0px;
	    padding-bottom:32%;
	    position:relative;
		margin-right: 10px;
		margin-top:10px;
	}
	.cell-imgs div img{
		width:100%;
        height:100%;
        position:absolute;
	}
</style>