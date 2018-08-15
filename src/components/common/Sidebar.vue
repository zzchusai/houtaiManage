<template>
	<div class="sidebar_box lf">
		<div class="sidebar" id="sidebar">
			<el-menu :default-active="onRoutes" class="el-menu-vertical-demo menuStyle" theme="dark" unique-opened router>
                <el-submenu :index='submenu.code' v-for="(submenu,index) in oneLevel" class="menuStyleOne" ref="OneLevelH" >
                    <template slot="title">
                		<i class="icon"></i>
                    	<span style="color:#fff;" @click="showOneLevel()" >{{submenu.name}}</span>
                    </template>
                    <el-menu-item  :index='menuItem.index' v-for="menuItem in towLevel[index]" :key="menuItem.code" style="color:#fff;padding-left:29.33%;min-width:100px" class="menuStyleTwo" @click="show">
                        {{menuItem.name}}
                    </el-menu-item>
                </el-submenu>
            </el-menu>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				siderBar: [],
				oneLevel: [],
				towLevel: [],
				j: [],
				route: 'origin'
			}
		},
		created() {
			this.render();
			this.permission();
		},
		computed: {
            onRoutes(){
            	let _this = this.$route.path.replace('/','');
                return _this;
            }
		},
		updated() {
		     $('.sidebar_box').height(720);
		},
		methods: {
			render(){
				var self = this;
				self.$http.post(self.HOST+'/getSiderBarList').then(function(data){
					if(data.data.status == 1){
						self.siderBar = data.data.data;	
						for(var i =0;i<self.siderBar.length;i++){
							if(self.siderBar[i].level == 0){
								self.j.push(i);
							}
						}
						for(var i = 0;i<self.j.length;i++){
							self.oneLevel.push(self.siderBar[self.j[i]]);
						}
						for(var a = 0;a<self.j.length;a++){
							self.towLevel[a] = [];
							for(var b = self.j[a]+1;b<self.j[a+1];b++){
								self.towLevel[a].push(self.siderBar[b]);
							}
						}

						for(var n = self.j[self.j.length-1]+1;n<self.siderBar.length;n++){
							self.towLevel[self.towLevel.length-1].push(self.siderBar[n]);
						}
						for(var i = 0;i<self.towLevel.length;i++){
							for(var j = 0;j<self.towLevel[i].length;j++){
								let code = self.towLevel[i][j].code;
								switch (code){
									//用户来源管理
									case 'SJTJ':self.towLevel[i][j].index = 'origin';break;//数据统计
									case 'LYGL':self.towLevel[i][j].index = 'originMng';break;//来源管理
									//日历管理
									case 'JQCHGL':self.towLevel[i][j].index = 'terms';break;//节气插画管理
									//节目管理
									case 'JMLB':self.towLevel[i][j].index = 'program';break;//节目列表
									case 'LMLB':self.towLevel[i][j].index = 'part';break;//栏目列表
									//会员用户管理
									case 'HYYHXX':self.towLevel[i][j].index = 'member';break;//会员用户信息
									case 'PTHYLB':self.towLevel[i][j].index = 'member';break;//普通会员列表
									case 'DSHYLB':self.towLevel[i][j].index = 'great';break;//大师会员列表
									case 'XCXHYLB':self.towLevel[i][j].index = 'xcx';break;//小程序会员列表
									case 'SJLB':self.towLevel[i][j].index = 'navy';break;//水军列表
									//使用反馈
									case 'FKLB':self.towLevel[i][j].index = 'feedback';break;//反馈列表
									//系统管理
									case 'CZRZ':self.towLevel[i][j].index = 'journal';break;//操作日志
									//权限管理
									case 'GLYLB':self.towLevel[i][j].index = 'manager';break;//管理员列表
									case 'JSLB':self.towLevel[i][j].index = 'role';break;//角色列表
									case 'QXLB':self.towLevel[i][j].index = 'limits';break;//权限列表
									//首页管理
									case 'HDGL':self.towLevel[i][j].index = 'activity';break;//活动管理
									case 'WZGL':self.towLevel[i][j].index = 'article';break;//文章管理
									case 'BANNERGL':self.towLevel[i][j].index = 'banner';break;//banner管理
									//推送管理
									case 'TJTS':self.towLevel[i][j].index = 'addPush';break;//添加推送
									case 'DTSLB':self.towLevel[i][j].index = 'stayPush';break;//待推送
									case 'TSLSLB':self.towLevel[i][j].index = 'historyPush';break;//推送历史
									// case 'WD':
									//问答管理
									case 'WDGL':
										self.towLevel[i][j].index = 'askMain';
										break;
								   //悬赏问答
									case 'XSWD':
										self.towLevel[i][j].index = 'rewardAnswer';
										break;
										//订单管理
								    case 'DDLB':
										self.towLevel[i][j].index = 'order';
										break;
										//账单管理
								    case 'ZDLB':
										self.towLevel[i][j].index = 'bill';
										break;
										//审核管理
								    case 'SHLB':
										self.towLevel[i][j].index = 'checkCash';
										break;
										//邀请排行榜
									case 'YQPHB':
										self.towLevel[i][j].index ='invite';
										break;
								}
							}
						}
					}else if(data.data.status == 1001){
						localStorage.removeItem('access_token');
						this.$router.push('/login');
					}
				});
			},
			show(){
				if (window.navigator.onLine==false) {
                     this.$router.push('/outline')
                     return false;
				   }
			},showOneLevel(){
    
			},
			permission() {
				var self = this;
				let limits = [];
				let limitCode = [];
				self.$http.post(self.HOST+'/getSiderBarList?isAll='+1).then(function(data){
					if(data.data.status == 1){
						limits = data.data.data;
						limits.forEach(function(item,index){
							limitCode.push(item.code);
						});
						window.localStorage.limitCode = JSON.stringify(limitCode);
						//改变权限状态
						self.$store.commit( 'sfIncrement',limitCode);
					}
				});
			}
		}
	}
</script>

<style scoped>
/*菜单样式*/
.sidebar {background: #4A5065; margin-bottom: 140px;width: 100%;}
.sidebar>ul {width: 100%;height: 100%;}
#sidebar .menuStyle>li>div {width: 100%;padding: 6px 0;padding-left: 50px;height:44px;line-height:34px;}
#sidebar .menuStyle .el-submenu__icon-arrow {top: 24px;left:50px;}
.sidebar_box {display: block;background: #4A5065;width:16%;overflow-x: hidden;
	overflow-y: scroll;}
.sidebar_box::-webkit-scrollbar {
    display: none;
}
#sidebar div,#sidebar ul,#sidebar li {box-sizing: border-box;list-style: none;padding: 0;margin: 0;}
#sidebar .menuStyle {color: #fff!important;background: #4A5065;width:100%;}
#sidebar .menuStyle>li>div.oneLi:hover {background: #c19c75;}
#sidebar .menuStyle>li {position: relative;cursor: pointer;}
#sidebar .menuStyleTwo {background: #333745;}
#sidebar .menuStyleTwo:hover{background: #c19c75;}
.activity{background: #c19c75!important;}
#sidebar .menuStyle .el-submenu__icon-arrow.open-hover {transform: rotateZ(180deg)}
.icon{display:inline-block;width:24px;height:14px;vertical-align: middle;margin-right: 5px;text-align: center;background: url(../../../static/img/right.png) no-repeat center;background-size: 14px;}
.is-opened .icon{background-image: url(../../../static/img/down.png);}

@media only screen and (max-width: 1920px){
	#sidebar div,#sidebar ul,#sidebar li{font-size: 18px;}
}
@media only screen and (max-width: 1600px){
	#sidebar div,#sidebar ul,#sidebar li{font-size: 16px;}
}
@media only screen and (max-width: 1400px){
	#sidebar div,#sidebar ul,#sidebar li{font-size: 14px;}
}
@media only screen and (max-width: 1200px){
	#sidebar div,#sidebar ul,#sidebar li{font-size: 14px;}
}
@media only screen and (max-width: 1100px){
	#sidebar div,#sidebar ul,#sidebar li{font-size: 14px;}
}
/*icon*/
</style>