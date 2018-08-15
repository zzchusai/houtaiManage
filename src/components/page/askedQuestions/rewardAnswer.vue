<!--  -->
<template>
	<div class="fl sf-main ">
		<div class="main-top zoom pl30">
			<div class="lf">问答 / <span class="zClr-999">悬赏问答</span>
			</div>
		</div>
		<div class="menu mr30 ml30 zoom">
			<span class="title" style="float:left;height:50px">分组:</span>
			<div class="scroll">
				<span v-for="(item,index) in menus" :class="[selectIndex==index?'select':'',item.shelves==2 && selectIndex!=index?'down':'','item']" @click="selectMenu(index)">
							{{item.name}}
					</span>
			</div>
		</div>
		<!-- 条件筛选 -->
		<div class="filters">
			<span class="filter">条件筛选</span>
			<select name="" id="" style="width:140px;margin-left:10px;height:25px;cursor:pointer" v-model="type" @change="selectFilter(type)">
	                   <option v-for="(item,index) in types" :label="item.label" :value="item.value" style="line-height:20px;cursor:pointer" >{{item.label}}</option>
	               </select>
			<div class="lookAsk fr" @click.stop="interlocutionAnswers()" style="cursor:pointer">查看违规问答>></div>
		</div>
		<div class="page">
			<div class="page-info">
				<div class="table">
					<div class="cell zoom" v-for="(item,index) in tableData" @click.stop="rewardDetail(index)">
						<div class="fl" style="margin-right:15px;margin-left:15px;position:relative">
							<img :src="item.avatar" class="icon">
							<img src="../../../../static/img/dsbs.png" style="z-index:1;position:absolute;bottom:0px;right:0px;width:20px;height: 20px;" v-if="item.type == 2">
						</div>
						<div style="overflow:hidden;margin-right:15px" class="fc">
							<div class="nickname">{{item.nickname}}</div>
							<span class="rankName" v-if="item.type!=2">{{item.rankName}}</span>
							<img src='../../../../static/img/dstx.png' class="tx" v-if="item.type==2" />
							<span class="fc" v-if="item.type==3">(水军)</span>
							<div class="anonymous" v-show="item.anonymous == 2" style="margin-left:20px">(匿名发布)
								<!-- <span>{{item}}</span> -->
							</div>
							<div style="float:right;margin-top:30px">
								<div v-if='item.bounty_status==1' style="display:inline-block;margin-right:30px">未采纳</div>
								<div v-if='item.bounty_status==2' style="display:inline-block;margin-right:30px">未审核</div>
								<div v-if='item.bounty_status==3' style="display:inline-block;margin-right:30px">已审核</div>
								<div style="display:inline-block"> 赏金：<i style="margin-left:10px;font-style:normal;margin-right:10px;">{{(item.price/100).toFixed(2)}}</i>元</div>
							</div>
							<div class="title">{{item.title}}</div>
							<div class="cell-content sf-pre" ref="limitLines" style="line-height: 15px;">{{item.content}}
							</div>
							<div class="answer" style="margin-right:38px">回答:<span style="color: #0099E5;margin-left:5px;cursor:pointer" @click.stop="lookAnswer(index)" type='button'>{{item.answer_nums}}</span></div>
							<div v-if="item.bounty_status==1||item.bounty_status==2" style="display:inline-block">
								<div class="setIssue" v-show="item.violate==1" @click.stop="setIssue(index)">设为违规问答</div>
								<div class="issue" style="margin-right:42px;" v-show="item.violate==2">违规问答</div>
							</div>
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
		<wgPopups :message="message" @sfCancel="isShow" @sfConfirm="confirm" v-show="selectCell>=0"></wgPopups>
	</div>
</template>
<script>
	import wgPopups from '../../component/popups/wgpopups.vue';
	export default {
		data() {
			return {
				selectIndex: 0, //选择的菜单
				menus: [], //菜单
				cur_page: 1, //当前页
				totalpages: 0, //总页数
				tableData: [], //列表数据
				page: true,
				message: '请选择违规类型', //弹框内容
				selectCell: -1, //选择的当前cell,
				types: [{
					value: 0,
					label: "全部"
				}, {
					value: 1,
					label: "未采纳"
				}, {
					value: 2,
					label: "未审核"
				}, {
					value: 3,
					label: "已审核"
				}],
				type: 0, //当前选中的下拉按钮,
			}
		},
		created() {
			let self = this;
			if (!self.selectIndex) {
				self.selectIndex = 0
			}
			if (!self.type) {
				self.type = 0
			}
			if (self.$route.query.selectIndex) {
				self.selectIndex = Number(self.$route.query.selectIndex);
			} else {
				self.selectIndex = 0
			}
			if (self.$route.query.type) {
				self.type = Number(self.$route.query.type);
			} else {
				self.type = 0
			}
			let page = Number(self.$route.query.page);
			if (!page || page < 1) {
				page = 1;
			}
			self.cur_page = parseInt(page);
			self.getMenuData(self.cur_page);
			self.selectFilter(self.type, self.cur_page, self.selectIndex);
			self.selectMenu(self.selectIndex, self.cur_page, self.type);
		},
		updated() {
			if (this.$refs.limitLines) {
				for (var i = 0; i < this.$refs.limitLines.length; i++) {
					let item = this.$refs.limitLines[i];
					let linesHieght = parseFloat(item.style.lineHeight);
					while (item.offsetHeight > 45) {
						// item.innerText = item.innerText.replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "...");
						item.innerText = item.innerText.substring(0, item.innerText.length - 10) + "...";
					};
				}
			}
		},
		mounted() {
		},
		components: {
			wgPopups,
		},
		methods: {
			getMenuData(page) {
				let self = this;
				self.tableData = [];
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				self.$http.post(self.HOST + '/group/total', {
						type: "4"
					})
					.then(function(data) {
						if (data.data.status == 1) {
							self.menus = data.data.data;
							for (let i = 0; i < self.menus.length; i++) {
								if (self.menus[i].id == self.$route.query.group_index) {
									self.selectIndex = i;
								}
							}
							self.getListData(page);
						}
					});
			},
			//选择菜单
			selectMenu(index, page, type) {
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				this.selectIndex = index;
				this.tableData = [];
				if (typeof page == 'undefined') {
					this.cur_page = 1
				}
				if (typeof type == 'undefined') {
					type = 0
				}
				window.history.replaceState(null, null, "?selectIndex=" + this.selectIndex + "&page=" + this.cur_page + '&type=' + type);
				this.getListData(page);
			},
			selectFilter(type, page, selectIndex) {
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				this.type = type;
				this.tableData = [];
				if (typeof page == 'undefined') {
					this.cur_page = 1
				}
				if (typeof selectIndex == 'undefined') {
					selectIndex = 0
				}
				window.history.replaceState(null, null, "?selectIndex=" + selectIndex + "&page=" + this.cur_page + '&type=' + this.type);
				this.getListData(page);
			},
			//获取列表数据
			getListData(page) {
				let selectMenuItem = this.menus[this.selectIndex];
				let self = this;
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				if (!selectMenuItem) {
					selectMenuItem = 5;
				}
				let data = {};
				//如果筛选全部则不传sceen
				if (self.type == 0) {
					data = {
						page: page,
						type: 1,
						group_id: selectMenuItem.id,
					}
				} else {
					data = {
						page: page,
						type: 1,
						group_id: selectMenuItem.id,
						screen: self.type
					}
				}
				// console.log(data);
				self.$http.post(self.HOST + '/interlocutionBounty', data).then(function(res) {
					if (res.data.status == 1) {
						self.tableData = [];
						let total = res.data.data.total;
						self.totalpages = parseInt(total);
						res.data.data.data.map(function(item) {
							if (item.create_time) {
								item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
							} else {
								item.create_time = '';
							}
							if (!item.avatar) {
								item.avatar = '../../../../static/img/avatar.png';
							}
							self.tableData.push(item);
						})
						if (self.tableData.length > 0) {
							self.page = true;
							if ($('.found')) {
								$('.found').hide();
							}
						} else {
							let html = `<div class='found'></div>`;
							$('.table').html(html);
							self.page = false;
						}
					} else {
						sfLayer.makeText(res.data.msg);
					}
				})
			},
			handleCurrentChange(val) {
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				this.cur_page = val;
				this.tableData = [];
				window.history.replaceState(null, null, "?selectIndex=" + this.selectIndex + "&page=" + val + '&type=' + this.type);
				this.getListData(val);
			},
			//设置为违规问答
			setIssue(index) {
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				if ('XSSWWG'.isLimit()) {
					this.selectCell = index;
				} else {
					this.selectCell = -1;
					sfLayer.makeText("无权访问");
				}
				// this.selectCell = index;
				//清空轻度违规和重度违规的按钮样式
				if ($('.zhongdu') && $('.qindu')) {
					$('.zhongdu').css('borderWidth', '1px')
					$('.qindu').css('borderWidth', '1px')
				}
			},
			isShow() {
				//取消
				this.selectCell = -1;
			},
			//确定
			confirm(soft, deep) {
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				//soft表示轻度borderWidth，表示重度borderWidth
				let item = this.tableData[this.selectCell];
				let self = this;
				if (soft == 1 && deep == 1) {
					sfLayer.makeText('请选择违规程度');
				}
				let data = {}
				if (soft == 6) {
					data = {
						id: item.id,
						violate: 2,
						type: 2,
					}
				} else if (deep == 6) {
					data = {
						id: item.id,
						violate: 3
					}
				}
				self.$http.post(self.HOST + '/violateSet', data).then(function(res) {
					if (res.data.status == 1) {
						//设置成功
						let nav = '/interlocutionRewAnswers?group_index=' + self.selectIndex;
						self.$router.push(nav);
					} else {
						sfLayer.makeText(res.data.msg);
					}
					self.selectCell = -1;
				});
			},
			//查看回答
			lookAnswer(index) {
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				if ('XSHDLB'.isLimit()) {
					let item = this.tableData[index];
					let selectMenuItem = this.menus[this.selectIndex];
					this.$router.push('/rewardComments?id=' + item.id + "&group_id=" + selectMenuItem.id + '&bounty_status=' + item.bounty_status);
				} else {
					sfLayer.makeText("没有权限查看");
				}
			},
			interlocutionAnswers(event) {
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				let nav = '/interlocutionRewAnswers?group_index=' + this.selectIndex;
				this.$router.push(nav);
			},
			//问答详情
			rewardDetail(index) {
				if (window.navigator.onLine == false) {
					this.$router.push('/outline')
					return false;
				}
				if ('XSWDXQ'.isLimit()) {
					let item = this.tableData[index];
					this.$router.push('/rewardDetail?interlocut_id=' + item.id + '&bounty_status=' + item.bounty_status + '&type=' + item.type + '&anonymous=' + item.anonymous);
				} else {
					sfLayer.makeText("没有权限查看");
				}
			},
		}
	}
</script>
<style scoped>
	.menu {
		/* position: relative; */
		overflow: hidden;
		border-top: 1px solid #D8D8D8;
		border-bottom: 1px solid #D8D8D8;
		/* height: 50px; */
		padding-bottom: 10px;
	}
	.menu .scroll {
		white-space: wrap;
	}
	.menu span {
		display: inline-block;
		margin-top: 13px;
	}
	.menu .title {
		color: #999999;
		margin-left: 15px;
	}
	.menu .select {
		background-color: #C19C75 !important;
		padding: 0px 3px;
		color: #fff !important;
	}
	.menu .down {
		color: #CCCCCC !important;
	}
	.menu .item {
		margin-left: 15px;
		margin-right: 15px;
		cursor: pointer;
	}
	.menu .item:hover {
		color: #666666;
	}
	.menu .edit {
		display: inline-block;
		margin-top: 15px;
		width: 20px;
		height: 20px;
		background-size: 20px 20px;
		background-repeat: no-repeat;
		background-position: center;
		background-origin: content-box;
		background-image: url('../../../../static/img/edit-before.png');
	}
	.menu .edit:hover {
		background-image: url('../../../../static/img/edit-after.png');
	}
	.menu .write {
		margin-top: 15px;
		font-size: 13px;
		color: #C19C75;
		border: #C19C75 1px solid;
		padding: 1px 15px;
		border-radius: 5px;
	}
	.cell {
		border-bottom: 1px #D8D8D8 solid;
		margin: 0px 30px;
		font-size: 15px;
		padding-bottom: 15px;
		color: #333;
	}
	.cell .icon {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		position: relative;
		margin-top: 23px;
	}
	.cell .nickname,
	.cell .answer,
	.cell .setIssue,
	.cell .issue,
	.cell .time,
	.cell .anonymous {
		display: inline-block;
		margin-top: 22px;
	}
	.cell .lookAsk {
		margin-top: 23px;
		padding-right: 25px;
		color: #333;
		background-size: 20px 15px;
		background-repeat: no-repeat;
		background-position: center right;
		background-image: url('../../../../static/img/ask-before.png');
	}
	.cell .lookAsk:hover {
		color: #999;
		background-image: url('../../../../static/img/ask-after.png');
	}
	.cell .cell-content {
		position: relative;
		text-overflow: ellipsis;
		word-break: break-all;
		display: -webkit-box;
		/* autoprefixer: off  
		    /*关闭autoprefixer的自动删除功能*/
		-webkit-box-orient: vertical;
		/*autoprefixer: on */
		-webkit-line-clamp: 3;
		/*限制在一个块元素显示的文本的行数*/
		overflow: hidden;
		font-size: 14px;
		margin-top: 20px;
	}
	/*	.cell-content:after {
		    background: linear-gradient(to right, rgba(255, 255, 255, 0), #FFFFFF 50%) repeat scroll 0 0 rgba(0, 0, 0, 0);
		    bottom: 0;
		    content: "...";
		    padding: 0 5px 1px 30px;
		    position: absolute;
		    right: 0;
		}*/
	.cell .nickname {
		margin-top: 32px;
	}
	.cell .title {
		color: #333333;
		font-weight: 900;
		margin-top: 22px;
		overflow: hidden;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		-webkit-text-overflow: ellipsis;
		-moz-text-overflow: ellipsis;
		white-space: nowrap;
	}
	.cell .answer,
	.cell .setIssue,
	.cell .issue,
	.cell .time {
		font-size: 12px;
	}
	.cell .setIssue {
		margin-right: 18px;
		color: #0099E5;
		cursor: pointer;
	}
	.cell .setIssue:hover {
		color: #1882B7;
		cursor: pointer;
	}
	.write,
	.edit {
		cursor: pointer;
	}
	.table .zoom {
		cursor: pointer;
	}
	.table .zoom:hover {
		background: #f4f5f6;
	}
	.filters {
		height: 35px;
		line-height: 35px;
		border-bottom: 1px #D8D8D8 solid;
		margin-left: 30px;
		margin-right: 30px;
		padding-left: 15px;
	}
</style>