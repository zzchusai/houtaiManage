<template>
	<div class="fl sf-main cell">
		<div class="fl" style="margin-right:15px;margin-left:30px;position:relative">
			<img :src="item.avatar" class="icon">
			<img src="../../../../static/img/dsbs.png" style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="item.type == 2">
		</div>
		<div style="overflow:hidden;margin-right:30px" class="fc">
			<div class="lookAsk fr">{{item.create_time}} </div>
			<div class="nickname">{{item.nickname}}</div>
			<img src='../../../../static/img/dstx.png' class="tx" v-if="item.type==2" />
			<span class="rankName" v-if="item.type!=2">{{item.rankName}}</span>
			<span class="fc" v-if="type==3">(水军)</span>
			<div class="anonymous" v-show="item.anonymous == 2" style="margin-left:20px">(匿名发布)</div>
			<div class="title">{{item.title}}</div>
			<div class="cell-content sf-pre">{{item.content}}</div>
			<div v-show="item.pic && item.pic.length>0" class="cell-imgs zoom">
				<div v-for="img in item.pic">
					<img :src="img">
				</div>
			</div>
			<div class="zoom info">
				<div class="setIssue " v-show="item.violate==1" @click="setIssue()">设为违规问答</div>
				<div class="issue " v-show="item.violate==2">违规问答</div>
				<div class="collect mr20">收藏: {{item.collect_nums}}</div>
				<div class="share ">分享: {{item.share_nums}}</div>
			</div>
		</div>
		<Popups :message="message" @sfCancel="isShow()" @sfConfirm="confirm()" v-show="showAlert"></Popups>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				askId: 0, //问答ID
				item: {}, //问答详情
				showAlert: false, //展示提示框
				message: '确定该条问答是违规问答吗？', //弹框内容
			}
		},
		created() {
			this.askId = this.$route.query.id;
			this.getDetailData();
		},
		methods: {
			//获取列表数据
			getDetailData() {
				let self = this;
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				let data = {
					id: this.askId
				}
				self.$http.post(self.HOST + '/interlocution/info', data).then(function(res) {
					if (res.data.status == 1) {
						let item = res.data.data;
						console.log(item.content);
						if (item.create_time) {
							item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
						} else {
							item.create_time = '';
						}
						if (!item.avatar) {
							item.avatar = '../../../../static/img/avatar.png';
							// item.avatar = JSON.parse(item.avatar);
						}
						self.item = item;
					} else {
						sfLayer.makeText(res.data.msg);
					}
				})
			},
			//设置为违规问答
			setIssue() {
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				if ('SZWG'.isLimit()) {
					this.showAlert = true;
				} else {
					sfLayer.makeText('无权访问');
				}
			},
			isShow() {
				//取消
				this.showAlert = false;
			},
			confirm() {
				//确定
				let self = this;
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				self.$http.post(self.HOST + '/violate/set', {
					id: this.askId
				}).then(function(res) {
					if (res.data.status == 1) {
						//设置成功
						self.item.violate = 2;
					} else {
						sfLayer.makeText(res.data.msg);
					}
					self.showAlert = false;
				});
			},
		}
	}
</script>
<style scoped>
	.cell .icon {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		margin-top: 23px;
	}
	.cell .nickname,
	.cell .collect,
	.cell .setIssue,
	.cell .issue,
	.cell .share,
	.cell .anonymous {
		display: inline-block;
		margin-top: 22px;
	}
	.cell .lookAsk {
		margin-top: 23px;
		color: #333;
	}
	.cell .cell-content {
		/* text-overflow: -o-ellipsis-lastline; */
		/* overflow: hidden; */
		/* text-overflow: ellipsis; */
		/* display: -webkit-box; */
		/* -webkit-line-clamp: 2; */
		/* -webkit-box-orient: vertical; */
		font-size: 14px;
		margin-top: 20px;
		/* line-height:15px; */
	}
	.cell .nickname {
		margin-top: 32px;
	}
	.cell .title {
		font-weight: 900;
		margin-top: 22px;
		margin-bottom: 20px;
	}
	.cell .share,
	.cell .setIssue,
	.cell .issue,
	.cell .collect {
		font-size: 12px;
	}
	.cell .setIssue {
		margin-right: 50px;
		color: #0099E5;
		cursor: pointer;
	}
	.cell .setIssue:hover {
		color: #1882B7;
		cursor: pointer;
	}
	.cell .issue {
		margin-right: 50px;
	}
	.cell .info {
		margin-top: 60px;
		margin-bottom: 20px;
		margin-right: 20px;
		text-align: right;
	}
	.cell-imgs div {
		float: left;
		width: 32%;
		height: 0px;
		padding-bottom: 32%;
		position: relative;
		margin-right: 10px;
		margin-top: 10px;
	}
	.cell-imgs div img {
		width: 100%;
		height: 100%;
		position: absolute;
	}
</style>