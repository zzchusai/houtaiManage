<template>
	<div class="origin main">
		<div class="origin-data zoom mt20 mr30  sf-bc-white">
			<div class="pl15 pr15 pt15">用户总量 :</div>
			<div class="mb10" style="margin-left: 105px;"><span class="fb sf-color-subject">{{totality}}</span>人</div>
		</div>
		<div class="origin-data zoom">
			<div class="record-box lf">
				<div class="record-title">用户来源</div>
				<div class="record-main" style="margin-bottom: 40px;height: 132px;">
					<div class="record-item zoom" v-for='user in users'>
						<div class="lf record-name">{{user.name}}</div>
						<div class="rt num">{{user.num}} 人</div>
					</div>
					<div class="record-item" style="text-align: center;color:#999;margin-top:35px;" v-if="userNews.length==0">暂无数据</div>
				</div>
			</div>

			<div class="record-box lf" style="padding-bottom:36px;">
				<div class="record-title">APP注册用户</div>
				<div class="record-main">
					<div class="record-item zoom">
						<div class="lf">安卓</div>
						<div class="rt num">{{Android}} 人</div>
					</div>
				</div>
				<div class="record-main">
					<div class="record-item zoom">
						<div class="lf">IOS</div>
						<div class="rt num">{{IOS}} 人</div>
					</div>
				</div>
			</div>

			<div class="record-box lf">
				<div class="record-title">昨日新增用户</div>
				<div class="record-tab zoom">
					<div class="tab-box active lf" @click="userClick($event)">用户来源新增</div>
					<div class="tab-box lf" @click="clientClick($event)">APP注册新增</div>
				</div>
				<div class="record-main" style="margin-bottom: 20px;height:116px;" v-show="user">
					<div class="record-item zoom" v-for='userNew in userNews'>
						<div class="lf record-name">{{userNew.name}}</div>
						<div class="rt num">{{userNew.num}} 人</div>
					</div>
					<div class="record-item" style="text-align: center;color:#999;margin-top:30px;" v-if="userNews.length==0">暂无数据</div>
				</div>
				<div class="record-main" style="margin-bottom: 20px;" v-show="client">
					<div class="record-item zoom">
						<div class="lf">安卓</div>
						<div class="rt num">{{AndroidNew}} 人</div>
					</div><div class="record-item zoom" style="margin-bottom: 0;">
						<div class="lf">IOS</div>
						<div class="rt num">{{IOSNew}} 人</div>
					</div>
				</div>
			</div>
			<!--小程序-->
			<div class="record-box lf" style="padding-bottom:36px;">
				<div class="record-title">小程序总量</div>
				<div class="record-main">
					<div class="record-item zoom" style="margin-bottom: 35px;">
						<div class="lf">安卓</div>
						<div class="rt num">{{XcxAndroid}} 人</div>
					</div>
				</div>
				<div class="record-main">
					<div class="record-item zoom" style="margin-bottom: 5px;">
						<div class="lf">IOS</div>
						<div class="rt num">{{XcxIOS}} 人</div>
					</div>
				</div>
				<!-- <div class="record-main">
					<div class="record-item zoom" style="margin-bottom: 5px;">
						<div class="lf">小程序注册总量</div>
						<div class="rt num">{{xcx_sns_bindPhone}} 人</div>
					</div>
				</div> -->
			</div>
		</div>
		<div class="statistics zoom">
		  	<div class="echarts lf" style="margin-right:20px;">
			    <IEcharts :option="line"></IEcharts>
		  	</div>
			<div class="echarts lf">
			    <IEcharts :option="bar"></IEcharts>
		  	</div>
		</div>
	</div>
</template>

<script>
	import IEcharts from 'vue-echarts-v3';
	import 'echarts/lib/chart/line';
	export default {
		name: 'view',
    	components: {
      		IEcharts
    	},
    	props: {},
		data(){
			return {
      			line: {
        			title: {
          				text: '用户增长趋势分析图',
          				padding: [10,10,10,20]
        			},
        			tooltip: {},
        			xAxis: {
        				name: '时间',
          				data: [],
          				axisLabel: {
          					rotate:45,
          				},
          				boundaryGap: true,
          				axisTick: {
          					alignWithLabel: true,
          					interval: 0
          				},
          				axisLabel: {
          					interval: 0,
          					rotate: 45,
          				}
        			},
        			yAxis: {
        				name: '用户量',
        				minInterval: 1
        			},
        			series: [{
	          			name: '用户量',
	          			type: 'line',
	          			data: []
        			}]
      			},
      			bar: {
        			title: {
          				text: '用户来源图',
          				padding: [10,10,10,20]
        			},
        			tooltip: {},
        			xAxis: {
        				name: '来源',
          				data: [],
          				boundaryGap: true,
          				axisTick: {
          					alignWithLabel: true,
          					interval: 0
          				},
          				axisLabel: {
          					interval: 0,
          					showMaxLabel: true
          				}
        			},
        			yAxis: {
        				name: '用户量',
        				minInterval: 1
        			},
        			series: [{
	          			name: '用户量',
	          			type: 'bar',
	          			data: []
        			}]
      			},
				users: [],
				Android: '',
				IOS: '',
				XcxAndroid:'',
				XcxIOS:'',
				xcx_sns_bindPhone:'',
				userNews: [],
				AndroidNew: '',
				IOSNew: '',
				clientNews: [
					{name: '安卓',num: '123'},
					{name: 'IOS',num: '123'}
				],
				totality:'',
				user: true,
				client: false
			}
		},
		created() {
			this.render();
		},
		methods: {
			userClick($event) {
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.user = true;
				this.client = false;
				$($event.target).addClass('active');
				$($event.target).siblings().removeClass('active');
			},
			clientClick($event) {
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.client = true;
				this.user = false;
				$($event.target).addClass('active');
				$($event.target).siblings().removeClass('active');
			},
			render() {
				let self = this;
				 if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$http.post(self.HOST+'/userSource/count').then(function(data){
					if(data.data.status == 1){
						let userData = data.data.all_soure;
						for(var key in userData){
							let user = {
								name:key,
								num:userData[key]
							};
							self.users.push(user);
							self.bar.xAxis.data.push(user.name);
							self.bar.series[0].data.push(user.num);
						}
						self.totality = data.data.all_user;
						self.Android = data.data.phone_soure[1];
						self.IOS = data.data.phone_soure[2];
						self.XcxAndroid = data.data.xcx_sns_android;
						self.XcxIOS = data.data.xcx_sns_ios;
						self.xcx_sns_bindPhone = data.data.xcx_sns_bindPhone;
						let yesterdayUserData = data.data.yesterday_soure;
						for(var key in yesterdayUserData){
							let yesterdayUser = {
								name:key,
								num:yesterdayUserData[key]
							};
							self.userNews.push(yesterdayUser);
						}
						self.AndroidNew = data.data.yesterday_phone_soure[1];
						self.IOSNew = data.data.yesterday_phone_soure[2];
						let monthData = data.data.mouth_count;
						for(var key in monthData){
							self.line.series[0].data.push(monthData[key]);
							key = new Date(key*1000).format("yy/MM");
							self.line.xAxis.data.push(key);
						}
 					}else{
						alert(data.data.msg);
					}
				});
			}
    	}
	}
</script>

<style scoped>
	.origin{padding-top:-20px;background: #eaedf1;}
	.record-box{width:calc((100% - 90px)/4);margin-right:20px;background: #fff;margin-top:30px;padding:0;box-shadow:4px 4px 3px #dedede;-moz-box-shadow:4px 4px 3px #dedede;-webkit-box-shadow:4px 4px 3px #dedede;}
	.record-title{height:56px;line-height:56px;padding:0 15px;}
	.record-main{overflow-y: auto;padding:0 15px;}
	.record-item{height:48px;line-height:48px;background: #f5f8fb;margin-bottom: 20px;padding:0 15px;}
	.record-name{width:60%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
	.num{font-size: 18px;color:#ccc;}
	.record-tab{border-bottom: 1px solid #f1f1f1;margin-bottom: 15px;margin-top:-10px;padding:0 15px;}
	.tab-box{font-size: 14px;color:#777;padding:0 8px;height:30px;line-height:30px;cursor: pointer;}
	.active{color: #333;border-bottom: 2px solid #333;margin-bottom: -2px;}
	.totality{margin:50px 15px 75px 15px;text-align: center;}
	.echarts {width:calc((100% - 50px)/2);height: 400px;background: #fff;margin-top:30px;}
</style>