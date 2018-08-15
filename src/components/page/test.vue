<template>
	<div class="test main">
		<div class="ml30 mr30 mt30 pt30">
			<button class="mb30" @click="xxx">提示层</button>
			<button  class="mb30" @click="ccc">弹出层组件</button>
			<div>
				1、权限指令根据权限编码去判断按钮显不显示，参考：src/components/page/member/memberInfo.vue第48行
			</div>
			<div class="mt30">2、七牛云图片上传参考：添加文章页面添加缩略图 src/components/page/home/article/addArticle.vue 第36行 </div>
			<div class="mt30">3、分组管理demo  src/components/page/askedQuestions/grouping.vue</div>
			<div class="mt30">4、回答评论参考文章评论页面  src/components/page/home/article/commentArticle.vue</div>
			<!--<div class="mb30" style="height: 350px">-->
				<!--<quill-editor v-model="data" class='editor' ref="myQuillEditor" :config="editorOption" @focus="onEditorFocus($event)"-->
							  <!--@change="onEditorChange($event)">-->
				<!--</quill-editor>-->
			<!--</div>-->
		</div>
		<!--弹出层对话框组件-->
		<Popups :message="message" @sfCancel="isShow()" @sfConfirm="confirm()" v-show="modelAdd"></Popups>

</div>
</template>

<script>
require('./test.scss');
export default {
    data() {
          return {
            data:"",
			  message:"确定删除吗？",
            modelAdd: false,
            editorOption:{
//					syntax: {
//						highlight: text => hljs.highlightAuto(text).value
//					}
            },
        }
    },
    created() {
    },
     methods: {
         isShow(){
            this.modelAdd = false;
         },
		 confirm(){
			 alert("确定事件");
         },
         xxx(){
             sfLayer.makeText("弹出提示层");
         },
         ccc(){
             this.modelAdd = true;
         },
    }
}
</script>

