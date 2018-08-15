import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({ //department
	mode: 'history',
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/',
			component: resolve => require(['../components/common/Home.vue'], resolve),
			children: [
				{
					path: '/manager',//权限管理
					component: resolve => require(['../components/page/permission/manager/main.vue'], resolve),
				},
				{
					path: '/logout',//权限管理
					component: resolve => require(['../components/page/permission/manager/logout.vue'], resolve),
				},
				{
					path: '/addMng',//添加管理员
					component: resolve => require(['../components/page/permission/manager/addMng.vue'], resolve),
				},
				{
					path: '/role',//角色列表
					component: resolve => require(['../components/page/permission/role/main.vue'], resolve),
				},
				{
					path: '/addRole',//新增角色
					component: resolve => require(['../components/page/permission/role/addRole.vue'], resolve),
				},
				{
					path: '/limits',//新增角色
					component: resolve => require(['../components/page/permission/limits/main.vue'], resolve),
				},
				{
					path: '/addLimit',//新增角色
					component: resolve => require(['../components/page/permission/limits/addLimit.vue'], resolve),
				},
				{
					path: '/journal',//系统管理-操作日志
					component: resolve => require(['../components/page/system/journal.vue'], resolve),
				},
				{
					path: '/feedback',//使用反馈
					component: resolve => require(['../components/page/feedback/main.vue'], resolve),
				},
				{
					path: '/detailsFeedback',//反馈详情
					component: resolve => require(['../components/page/feedback/detailsFeedback.vue'], resolve),
				},
				{
					path: '/program',//节目列表
					component: resolve => require(['../components/page/progMng/program/main.vue'], resolve),
				},
				{
					path: '/comment',//评论列表
					component: resolve => require(['../components/page/progMng/program/comment.vue'], resolve),
				},
				{
					path: '/addVoice',//新增节目
					component: resolve => require(['../components/page/progMng/program/addVoice.vue'], resolve),
				},
				{
					path: '/progDetail',//节目详情
					component: resolve => require(['../components/page/progMng/program/progDetail.vue'], resolve),
				},
				{
					path: '/goodsDetail',//商品详情
					component: resolve => require(['../components/page/progMng/program/goodsDetail.vue'], resolve),
				},
				{
					path: '/editVoice',//编辑节目
					component: resolve => require(['../components/page/progMng/program/editVoice.vue'], resolve),
				},
				{
					path: '/part',//栏目列表
					component: resolve => require(['../components/page/progMng/part/main.vue'], resolve),
				},
				{
					path: '/partInfo',//栏目列表
					component: resolve => require(['../components/page/progMng/part/partInfo.vue'], resolve),
				},

				{
					path: '/addPart',//新增栏目
					component: resolve => require(['../components/page/progMng/part/addPart.vue'], resolve),
				},
				{
					path: '/origin',//用户来源统计
					component: resolve => require(['../components/page/origin/main.vue'], resolve),
				},
				{
					path: '/originMng',//用户来源
					component: resolve => require(['../components/page/origin/originMng.vue'], resolve),
				},
				{
					path: '/terms',//
					component: resolve => require(['../components/page/home/terms.vue'], resolve),
				},
				{
					path: '/member',//会员用户信息
					component: resolve => require(['../components/page/member/main.vue'], resolve),
				},
				{
					path: '/great',//大师会员列表
					component: resolve => require(['../components/page/member/great.vue'], resolve),
				},
				{
					path: '/navy',//水军会员列表
					component: resolve => require(['../components/page/member/navy.vue'], resolve),
				},
				{
					path: '/navyInfo',//水军会员详情
					component: resolve => require(['../components/page/member/navyInfo.vue'], resolve),
				},
				{
					path: '/xcx',//小程序会员列表
					component: resolve => require(['../components/page/member/program.vue'], resolve),
				},

				{
					path: '/filtrate',//筛选大师
					component: resolve => require(['../components/page/member/filtrate.vue'], resolve),
				},
				{
					path: '/memberInfo',//普通用户详情
					component: resolve => require(['../components/page/member/memberInfo.vue'], resolve),
				},
				{
					path: '/detailsGreat',//大师用户详情
					component: resolve => require(['../components/page/member/detailsGreat.vue'], resolve),
				},
				{
					path: '/editGreat',//大师用户详情
					component: resolve => require(['../components/page/member/editGreat.vue'], resolve),
				},
				{
					path: '/amendPwd',//修改密码
					component: resolve => require(['../components/page/amendPwd.vue'], resolve),
				},
				{
					path: '/activity',//活动管理首页
						component: resolve => require(['../components/page/home/activity/index.vue'], resolve),
				},
				{
					path: '/addActivity',//添加活动
						component: resolve => require(['../components/page/home/activity/addActivity.vue'], resolve),
				},
				{
					path: '/editActivity',//编辑活动
					component: resolve => require(['../components/page/home/activity/editActivity.vue'], resolve),
				},
				{
					path: '/activityComment',//评论列表
					component: resolve => require(['../components/page/home/activity/activityComment.vue'], resolve),
				},
				{
					path: '/details',//活动详情页
						component: resolve => require(['../components/page/home/activity/details.vue'], resolve),
				},

				{
					path: '/article',//文章管理首页
						component: resolve => require(['../components/page/home/article/index.vue'], resolve),
				},
				{
					path: '/addArticle',//文章上传页
					component: resolve => require(['../components/page/home/article/addArticle.vue'], resolve),
				},
				{
					path: '/editArticle',//文章编辑页
					component: resolve => require(['../components/page/home/article/editArticle.vue'], resolve),
				},
				{
					path: '/detailsArticle',//文章上传页
					component: resolve => require(['../components/page/home/article/detailsArticle.vue'], resolve),
				},
				{
					path: '/commentArticle',//文章评论页
					component: resolve => require(['../components/page/home/article/commentArticle.vue'], resolve),
				},

				{
					path: '/banner',//banner管理首页
						component: resolve => require(['../components/page/home/banner/index.vue'], resolve),
				},
				{
					path: '/addBanner',//添加banner页
					component: resolve => require(['../components/page/home/banner/addBanner.vue'], resolve),
				},
				{
					path: '/editBanner',//编辑banner页
					component: resolve => require(['../components/page/home/banner/editBanner.vue'], resolve),
				},
				{
					path: '/addPush',//添加推送页
						component: resolve => require(['../components/page/push/addPush.vue'], resolve),
				},
				{
					path: '/historyPush',//推送历史页
						component: resolve => require(['../components/page/push/historyPush.vue'], resolve),
				},
				{
					path: '/stayPush',//待推送页
						component: resolve => require(['../components/page/push/stayPush.vue'], resolve),
				},
				{
					path: '/pushInfo',//推送详情页
					component: resolve => require(['../components/page/push/pushInfo.vue'], resolve),
				},
				{
					path: '/error',//删除推送页
					component: resolve => require(['../components/page/push/error.vue'], resolve),
				},
				{
					path: '/delPush',//删除推送页
						component: resolve => require(['../components/page/push/delPush.vue'], resolve),
				},
				{
					path: '/grouping',//分组管理页
					component: resolve => require(['../components/page/askedQuestions/grouping.vue'], resolve),
				},
				{
					path: '/askMain',//问答管理
					component: resolve => require(['../components/page/askedQuestions/main.vue'], resolve),
				},
				{
					path: '/askComments',//问答评论
					component: resolve => require(['../components/page/askedQuestions/comments.vue'], resolve),
				},
				{
					path: '/interlocutionAnswers',//普通违规问答
					component: resolve => require(['../components/page/askedQuestions/interlocutionAnswers.vue'], resolve),
				},
				{
					path: '/interlocutionaskComments',//普通问答违规评论
					component: resolve => require(['../components/page/askedQuestions/interlocutionaskComments.vue'], resolve),
				},
				{
					path: '/interlocutionAnswersDetail',//普通违规问答搜索详情
					component: resolve => require(['../components/page/askedQuestions/interlocutionAnswersDetail.vue'], resolve),
				},
				{
					path:'/rewardAnswer',  //悬赏问答
					component:resolve=>require(['../components/page/askedQuestions/rewardAnswer.vue'],resolve),
				 },
				 {
					path:'/rewardDetail',   //悬赏问答详情
					component:resolve=>require(['../components/page/askedQuestions/rewardDetail.vue'],resolve)
				 },
				 {
					path:'/rewardComments',   //悬赏问答评论
					component:resolve=>require(['../components/page/askedQuestions/rewardComments.vue'],resolve)
				 },
				 {
					path:'/interlocutionaskRewComments',   //违规悬赏问答评论
					component:resolve=>require(['../components/page/askedQuestions/interlocutionaskRewComments.vue'],resolve)
				 },
				 {
					path:'/interlocutionRewAnswers',   //违规悬赏问答
					component:resolve=>require(['../components/page/askedQuestions/interlocutionRewAnswers.vue'],resolve)
				 },
				 {
					path:'/interlocutionRewAnswersDetail',   //违规悬赏问答详情
					component:resolve=>require(['../components/page/askedQuestions/interlocutionRewAnswersDetail.vue'],resolve)
				 },
				{
					path: '/askDetail',//问答详情
					component: resolve => require(['../components/page/askedQuestions/askDetail.vue'], resolve),
				},
				{
					path: '/writeAsk',//写问答
					component: resolve => require(['../components/page/askedQuestions/writeAsk.vue'], resolve),
				},
				 {
					 path:'/order',  //订单
					 component: resolve => require(['../components/page/orderManager/order.vue'], resolve),
				 },
				 {
					path:'/detailsOrder',  //订单详情
					component: resolve => require(['../components/page/orderManager/detailsOrder.vue'], resolve),
				},
				 {
					path:'/bill',  //账单
					component: resolve => require(['../components/page/orderManager/bill.vue'], resolve),
				},
				{
					path:'/detailsBill',  //账单详情
					component: resolve => require(['../components/page/orderManager/detailsBill.vue'], resolve),
				},
				{
					path:'/checkCash',  //提现审核
					component: resolve => require(['../components/page/checkManager/checkCash.vue'], resolve),
				},
				{
					path:'/detailsCheck',  //审核详情
					component: resolve => require(['../components/page/checkManager/detailsCheck.vue'], resolve),
				},
				{
					path:'/invite',  //邀请排行榜
					component:resolve=>require(['../components/page/inviteManage/invite.vue'],resolve),
				},
				{
					path:'/detailInvite',  //邀请详情
					component:resolve=>require(['../components/page/inviteManage/detailInvite.vue'],resolve),
				},
				{
					path: '/test',//测试
					component: resolve => require(['../components/page/test.vue'], resolve),
				},{
					path:'/outline', //断网页面
					component: resolve=>require(['../components/page/outline/outline.vue'],resolve)
				}
			]
		},
		{
			path: '/login',//登录
			component: resolve => require(['../components/page/Login.vue'], resolve)
		},
	]
})