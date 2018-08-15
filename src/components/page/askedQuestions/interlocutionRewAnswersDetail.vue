
<!-- 搜索违规问答列表 -->
<template>
	<div class="fl sf-main ">
		<div class="menu mr30 ml30 zoom" style="height:1px;border-bottom:none">
		</div>
		<div class="page" v-if="bool">
			<div class="page-info">
				<div class="table">
					<div class="cell zoom" v-for="(item,index) in tableData" @click="askDetail(index)">
						<div class="fl" style="margin-right:15px;margin-left:15px;position:relative" >
							<img :src="item.avatar" class="icon">
							 <img src="../../../../static/img/dsbs.png"  style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="item.type == 2">
						</div>
						<div style="overflow:hidden;margin-right:15px" class="fc">
							<div class="lookAsk fr">设置时间:{{item.violate_time}} </div>
							<div class="nickname">{{item.nickname}}</div>
							<span class="rankName" v-if="item.type!=2">{{item.rankName}}</span>
							<img src='../../../../static/img/dstx.png' class="tx" v-if="item.type==2" />
                                 <!-- <img src='../../../../static/img/kdbtx.png' class="tx" v-if="item.code==2" /> -->
                                 <span class="fc" v-if="item.type==3">(水军)</span>
							<div class="anonymous" v-show="item.anonymous == 2" style="margin-left:20px">(匿名发布)</div>
                            <span style="margin-left:30px">{{item.name}}</span>
							<div class="title">{{item.title}}</div>
							<div class="cell-content sf-pre">{{item.content}}</div>
							<div class="answer" style="margin-right:38px">回答:<span style="color: #0099E5;margin-left:5px;cursor:pointer"  @click="lookAnswer(index,$event)">{{item.answer_nums}}</span></div>
							<div class="setIssue" v-show="item.violate==1" @click="setIssue(index)">设为违规问答</div>
							<div class="issue" style="margin-right:42px;" v-show="item.violate==2">轻度违规</div>
                            	<div class="issue" style="margin-right:42px;" v-show="item.violate==3">重度违规</div>
							<div class="time fr">{{item.create_time}}</div>
						</div>
					</div>

				</div>
			</div>
			<div class="pagination zoom">
				<el-pagination v-show="page" @current-change="handleCurrentChange" :current-page="cur_page" layout="prev, pager, next,total" :total="totalpages" :page-size="10" class="rt">
				</el-pagination>
			</div>
		</div>
		<Popups :message="message" @sfCancel="isShow()" @sfConfirm="confirm()" v-show="selectCell>=0"></Popups>
	</div>
</template>
<script>
	export default{
		data () {
			return {

				selectIndex:0, //选择的菜单
				menus:[],//菜单
				cur_page: 1, //当前页
				totalpages: 0,//总页数
				tableData:[],//列表数据
				page: true,
				message:'确定该条问答是违规问答吗？',//弹框内容
				selectCell:-1,//选择的当前cell
				searchName:'',//
				searchKeyWord:'',//
				bool:true  // 查询时有数据显示数据
			}
		},
		created() {
			if (!this.selectIndex) {
				this.selectIndex = 0;
			}
			this.tableData=[];
			this.cur_page=1;
            this.getListData();
        },
        methods: {
	        // 获取列表数据
	        getListData(){
	        	let self = this;
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
           var url = window.location.search; //获取url中"?"符后的字串  
            var urlobj = new Object();  
             if (url.indexOf("?") != -1) {  
               var str = url.substr(1);  
              let strs = str.split("&");  
            for(var i = 0; i < strs.length; i ++) {  
         urlobj[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);  
                }  
               }  
			   let data=urlobj;
			   data.page=self.cur_page;
				self.$http.post(self.HOST+'/interlocutionBounty',data).then(function(res){
						if(res.data.status==1){
				let total = res.data.data.total;
                  self.totalpages = parseInt(total);
                    self.tableData=res.data.data.data;
					 res.data.data.data.map(function(item){
							if (item.create_time) 
							{
								item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
							} else {
								item.create_time = '';
							}

							if (item.violate_time) {
								item.violate_time = new Date(item.violate_time * 1000).format("yyyy-MM-dd hh:mm:ss");
							} else {
								item.violate_time = '';
							}
							if (!item.avatar) {
								item.avatar = '../../../../static/img/avatar.png';
							}
							})
        			if(self.tableData.length > 0){
							self.page = true;
						self.totalpages = parseInt(total);
							if($('.found')){
								$('.found').hide();
							}
						}else {
							let html = `<div class='found'></div>`;
							$('.table').html(html);
							self.page = false;
						}
        		}
						
				})

	        },
	        handleCurrentChange(val) {
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				this.cur_page = val;
				this.tableData = [];
				console.log(this.cur_page);
				this.getListData();
			},
	        //问答详情
	        askDetail(index){
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
	        	let item = this.tableData[index];
	        	this.$router.push('/rewardDetail?interlocut_id='+item.id+'&violate='+item.violate+'&type='+item.type+'&anonymous='+item.anonymous);
	        },
	        //查看回答
	        lookAnswer(index,event){
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
                   }
				event=event||window.event;
                if (event && event.stopPropagation) {
                  //W3C取消冒泡事件
                 event.stopPropagation();
               } else {
                 //IE取消冒泡事件
                 window.event.cancelBubble = true;
                 }
	        	let item = this.tableData[index];
	        	let selectMenuItem = this.menus[this.selectIndex];
				this.$router.push('/interlocutionaskRewComments?id='+item.id+"&group_id="+item.group_id);
				
	        },
	        
	        
	      
		}
	}
</script>
<style scoped>

	.menu{
		position: relative;
	    overflow: hidden;
		border-top: 1px solid #D8D8D8;
		border-bottom: 1px solid #D8D8D8;
		height: 50px;
		
	}
	.menu .scroll{
		position: absolute; 
		left: 0px;
		right: 30px;
		top: 0px;
		bottom: -30px;		
		overflow-x: scroll;
	    overflow-y: hidden;
	    white-space: nowrap;
	}
	.menu span{
		display: inline-block;
		margin-top: 13px;
	}
	.menu .title{
		color: #999999;
		margin-left: 15px;
	}
	.menu .select{
		background-color: #C19C75 !important;
		padding: 1px 5px;
		color: #fff !important;

	}
	.menu .down{
		color: #CCCCCC !important;
	}
	.menu .item{
		margin-left: 15px;
		margin-right: 15px;
		cursor: pointer;
	}
	.menu .item:hover{
		color: #666666;
	}
	.menu .edit{
		display: inline-block;
		margin-top: 15px;
		width: 20px;
		height: 20px;
		background-size: 20px 20px;
		background-repeat: no-repeat;
		background-position: center;
		background-origin: content-box;
		background-image: url('../../../../static/img/edit-before.png') ;

	}
	.menu .edit:hover{
		background-image: url('../../../../static/img/edit-after.png') ;
	}
	.menu .write{
		margin-top: 15px;
		font-size: 13px;
		color: #C19C75;
		border: #C19C75 1px solid;
		padding: 1px 15px;
		border-radius: 5px;
	}
	.cell{
		border-bottom: 1px #D8D8D8 solid;
		margin: 0px 30px;
		font-size: 15px;
		padding-bottom: 10px;
		color: #333;
	}
	.cell .icon{
		width: 50px;
		height: 50px;
		border-radius: 25px;
		
		margin-top: 23px;
	}
	.cell .nickname,.cell .answer,.cell .setIssue,.cell .issue,.cell .time,.cell .anonymous{
		display: inline-block;
		margin-top: 22px;
	}
	.cell .lookAsk{
		float: right;
		font-size:12px;
		margin-top: 23px;
	    /*padding-right: 42px;*/
		color: #333; 
	}
	/* .cell .cell-content{
		word-break: break-all;
	     display: -webkit-box;
		 -webkit-line-clamp: 3; 
	     overflow: hidden;
		font-size: 14px;
		line-height: 15px;
		margin-top: 20px;
	} */
		.cell .cell-content{
		text-overflow: ellipsis;display: -webkit-box;overflow: hidden;-webkit-box-orient: vertical;-webkit-line-clamp: 2;
		}
	.cell .nickname{
		margin-top: 32px;
		font-size: 17px;
	}
	.cell .title{
		color:#333333;
		font-weight: 900;
		margin-top: 22px;
		overflow:hidden;
		text-overflow:ellipsis;
		-o-text-overflow:ellipsis;
		-webkit-text-overflow:ellipsis;
		-moz-text-overflow:ellipsis;
		white-space:nowrap;	
	}
	.cell .answer,.cell .setIssue,.cell .issue,.cell .time{
		font-size: 12px;
	}
	.cell .setIssue{
		margin-right:18px;
		color: #0099E5;
		cursor: pointer;
	}
	.cell .setIssue:hover{
		color: #1882B7;
		cursor: pointer;
	}
	.cell .time{
		float:right;
	}
	.frs{
		float: right;
		margin-right: 104px;
	}
	.fr{
		float: left;
		font-size: 16px;
	}
	.sf-user-search{
		width: 228px;
		height: 38px;
		border: 1px solid  #2B6F91;
		border-radius: 2px;
	}
	.sf-main .el-input{
		height: 36px;
	}
	.table .zoom{
		cursor: pointer;
	}
	.table .zoom:hover{
		background: #f4f5f6;
	}
</style>