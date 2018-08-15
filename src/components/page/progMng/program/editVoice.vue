<template>
	<div class="progDetail main">
		<div class="progDetail-top main-top">
			<div class="progDetail-title">节目管理 / <span class="zClr-999">节目列表 / </span><span class="zClr-999">节目详情</span></div>
		</div>
		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<el-form label-width="130px" ref="data" :model="data" :rules="rules">
					<div class="addsset-main">
						<div class="jiemu">节目编辑</div>
						<el-form-item label="节目名称：" prop="name">
							<el-input v-model="data.name" size="normal"></el-input>
						</el-form-item>
						<el-form-item label="节目封面：" prop="radio_pic" style="margin-top:20px">
							<el-upload action='http://upload-z0.qiniu.com'
						        :show-file-list='showUploadList'
						        :on-success="coverPreview"
						        :before-upload="coverUpload"
						        :data='form'>
						        <img v-if="data.radio_pic" :src="data.radio_picUrl" class="avatar" style="cursor:default;" @click.stop="notPickImage()">
						        <span class="change" @click='addPic' type="primary">更换</span>
						        <i class="el-icon-loading" v-show="radio_pic"></i>
						    </el-upload>
							<!-- <el-upload :action="imgUrl" list-type="picture" :show-file-list="false" :on-success="coverPreview">
								<img v-if="data.radio_pic" :src="data.radio_picUrl" class="avatar">
							  	<el-button class="btn-box btn-file" size="small" type="primary">更换图片</el-button>
							</el-upload> -->
						</el-form-item>
						<el-form-item label="声音简介：">
							<div class="edit">
							    <!-- quill-editor插件标签 分别绑定各个事件-->
							    <quill-editor v-model="audio_introduce" class='editor' ref="myQuillEditor" :config="editorOption" @focus="onEditorFocus($event)"
							      @change="onEditorChange($event)">
							    </quill-editor>
							    <div v-show='false' class="limit">当前已输入 <span>{{nowLength}}</span> 个字符，您还可以输入 <span>{{SurplusLength}}</span> 个字符。</div>
							    <!-- 文件上传input 将它隐藏-->
							    <el-upload action='http://upload-z0.qiniu.com'
								        :show-file-list='fullscreenLoading'
								        :on-success="upScuccessEdit"
								        :on-error="errUpload"
								        :before-upload="beforeUploadEdit"
								        :data='uploadDataEdit'>
								        <!-- <img v-if="form.radis_pic" :src="form.coveImg" class="avatar"> -->
								        <el-button size="small" id='imgInput' style='display:none;' class="btn-box btn-file upload" @click="addPicEdit" type="primary"></el-button>
								        <!-- <i class="el-icon-loading" v-show="editImage"></i> -->
								</el-upload>
							</div>
						</el-form-item>
						<el-form-item label="上架形式：">
							<el-radio v-model="radio" :disabled="data.type==0" label="0">立即上架</el-radio>
							<el-radio v-model="radio" :disabled="data.type==0" label="1">定时上架</el-radio>
						</el-form-item>
						<el-form-item label="设置上架时间：" v-if='radio==1'>
							<i class="fbt_sign" style='margin-left:-120px'>*</i>
  							<el-date-picker v-model="data.showup_time" :clearable="false" type="datetime" placeholder="选择时间" @input='setTime'></el-date-picker>
						    <span class="fbt time" style="display:block;visibility:hidden">请选择定时时间</span></span>
						</el-form-item>
                       
					    <el-form-item label="请上传分享用图：" prop='share_pic' style='overflow:hidden'>
                    <!-- <el-input style="display: none" v-model="data.share_img"></el-input> -->
						<!-- <i class="fbt_sign" style='margin-left:-132px'>*</i> -->
                    <el-upload action='http://upload-z0.qiniu.com'
                               :show-file-list='false'
                               :on-success="shareCoverPreview"
                               :before-upload="shareCoverUpload"
                               :data='shareForm'>
                        <img v-if="data.share_pic" :src="data.share_img" class="avatar" style="width: 200px; height: 123px; cursor:default;" @click.stop="notPickImage()">
						<!-- <img :src="addImg" v-if="add_pic" class="avatar" style="width: 200px; height: 100px;"> -->
                        <span class="change" @click='shareSubscript(0)' type="primary">{{add}}</span>
                        <!-- <i class="el-icon-loading" v-if="!data.share_pic"></i> -->
                    </el-upload>
                </el-form-item>
                
				 <el-form-item label="设置分享标题 : " prop="share_title" class="sf-author mt20" >
                    <el-input v-model="data.share_title" placeholder="请输入分享标题" class="el-input__inner1" style='width:370px;height:36px'></el-input>
                </el-form-item>

                <el-form-item label="设置分享简介 : " prop="share_intro" class="sf-author mt20 ">
                    <el-input v-model="data.share_intro" placeholder="运营自己写" class="el-input__inner1" style='width:370px;height:36px'></el-input>
                </el-form-item>

						<el-form-item label="上传时间：">
							<div style="color:#777;">{{data.create_time}}</div>
						</el-form-item>
						<el-form-item label="数据统计：">
							<ul class="statistics zoom">
								<li class="statistics-box lf">播放次数 {{data.play_nums}}</li>
								<li class="statistics-box lf">下载次数 {{data.download_nums}}</li><br />
								<li class="statistics-box lf">收藏次数 {{data.collect_nums}}</li>
								<li class="statistics-box lf">分享次数 {{data.share_nums}}</li><br />
								<li class="statistics-box lf">评论 {{data.comment_nums}}</li>
							</ul>
						</el-form-item>
					</div>
					<div style="border-top:1px solid #f1f1f1;">
						<div class="zoom goods-list">
							<div class="shangpin">商品编辑</div>
							<div class="zoom">
								<el-form-item v-for="(list,index) in lists" class="goods-item lf" v-if="list.status" style="margin-left:0;">
									<el-form-item>
										<el-upload action='http://upload-z0.qiniu.com'
									        :show-file-list='showUploadList'
									        :on-success="listPreview"
									        :before-upload="listUpload"
									        :data='form' class="listPic">
									        <img v-if="list.pic" :src="list.imgUrl" class="avatar"  style="cursor:default;" @click.stop="notPickImage()">
									        <span class="change" @click='subscript(0)' type="primary">更换</span>
						        			<i class="el-icon-loading" v-show="pic"></i>
									    </el-upload>
										<!-- <el-upload :action="goodsimgUrl" list-type="picture" :show-file-list="false" :on-success="listPreview" name="list_pic">
											<img v-if="list.pic" :src="list.imgUrl" class="avatar">
										  	<el-button class="btn-box btn-file" @click='subscript(index)' size="small" type="primary">更换图片</el-button>
										</el-upload> -->
										<div class="el-form-item__error" style="display: none;">请选择商品图片</div>
									</el-form-item>
									<el-form-item style="margin-bottom: 15px!important;">
										<el-input v-model="list.goods_name" name="list_name" @input="goodsName()" size="nomal" placeholder="请输入商品名字" style="width:180px;"></el-input>
										<div class="el-form-item__error" style="display: none;">请输入商品名字</div>
									</el-form-item>
									<el-button class="btn btn-box" style="margin:0 auto;display: block;" type="primary" @click='delGoods(index)'>删除商品</el-button>
								</el-form-item>
							</div>
								<el-button class="btn-box btn-normal" style="margin-top:30px;margin-left:130px" v-if='!addGoodsMain' type="primary" @click="addArticle">添加商品</el-button>
						</div>
					</div>
					<div class="addGoods">
						<div class="addsset-main" v-show='addGoodsMain'>
							<el-form-item v-for="(list,index) in goods" :label="'商品' + (index+1) + '：'"  :key="list.name">
								<i class="goods_sign">*</i>
								<el-form-item>
									<el-input v-model="list.goods_name" name="goods_name" @input="goodsName()" placeholder="请输入商品名字"></el-input>
									<div class="el-form-item__error" style="display: none;">请输入商品名字</div>
								</el-form-item>
								<el-form-item>
									<el-input v-model="list.taobao_url" name="taobao_url" type="number" @input="goodsID()" placeholder="请输入商品ID" style="margin-top:22px;"></el-input>
									<div class="el-form-item__error" style="display: none;">请输入商品ID</div>
								</el-form-item>
								<el-form-item style="position: relative;margin-top:22px">
									<el-upload action='http://upload-z0.qiniu.com'
								        :show-file-list='showUploadList'
								        :on-success="goodsPreview"
								        :before-upload="goodsUpload"
								        :data='form' class="pic">
								        <img v-if="list.pic" :src="list.imgUrl" class="avatar"  style="cursor:default;" @click.stop="notPickImage()">
								        <span class="change" @click='subscript(index)' type="primary">{{list.load}}</span>
						        		<i class="el-icon-loading" v-show="goodsPic"></i>
								    </el-upload>
									<!-- <el-upload :action="goodsimgUrl" list-type="picture" :show-file-list="false" :on-success="goodsPreview" name="pic">
										<img v-if="list.pic" :src="list.imgUrl" class="avatar">
									  	<el-button class="btn-box btn-file" @click='subscript(index)' size="small" type="primary">{{list.load}}</el-button>
									</el-upload> -->
									<div class="el-form-item__error" style="display: none;">请选择商品图片</div>
									<div @click.prevent="removeDomain(list)" class="del"></div>
								</el-form-item>
	  						</el-form-item>
	  						<div class="addList" v-show="expurgate" @click="addDomain"></div>
						</div>
					</div>
					<div class="addVioce-btn zoom" style="width:500px;height:50px;margin:0 auto;position: relative;margin-bottom:60px;">
						<el-button class="btn-main button" style="top:0;right:0;" type="primary" @click="submint('data')">保存</el-button>
						<el-button class="button back" style="top:0;right:100px" type="primary" @click="back">取消</el-button>
					</div>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	let Toast={
	    elem:document.querySelector("#toast"),
	    timer:"",
	    makeText:function(info,time){
	        this.show();
	        this.elem.innerHTML=info;
	        this.elem.style.marginLeft=-1*(this.elem.clientWidth/2)+"px";
	        this.timer=setTimeout(this.hide.bind(this), time||1000);
	    },
	    show:function(){
	        if(this.elem==null){
	            let node=document.createElement("div");
	            node.setAttribute("id", "toast");
	            node.className="toast";
	            document.body.appendChild(node);
	            this.elem=document.querySelector("#toast");
	        }
	        if(this.timer){
	            window.clearTimeout(this.timer);
	        }
	        $.fn.addClass.call($(this.elem),"active");
	    },
	    hide:function(){
	        $.fn.removeClass.call($(this.elem),"active");
	    }
	}
	export default {
		data(){
			return {
	            form: {
	                token: '',
	                key: null
	            },
				 shareForm: {
                    token: '',
                    key: null
                },
	            hret: '',
				showUploadList: false,
				data: {
					id: '',
					name: '',
					radio_pic: '',
					create_time: '',
					play_nums: '',
					download_nums: '',
					share_nums: '',
					collect_nums: '',
					comment_nums: '',
					radio: '0',
					showup_time: '',
					oldshowup_time: '',
					share_img:'',
					share_title:'',
					share_intro:'',
					coveImg:'',
					share_pic:'',
				},
				rules: {
					name: [
						{required: true,message: '请输入音频名称',trigger: 'blur'}
					],
					showup_time: [
						{type: 'date',required: true,message: '请选择时间',trigger: 'change'}
					],
					radio_pic: [
						{required: true,message: '请上传封面',trigger: 'blur'}
					],
				},
				lists: [],
				goods: [],
				goods_id: '',
				expurgate: true,
				addGoodsMain: false,
				index: '',
				radio: '',
				imgUrl: this.HOST + '/uploadImg?type=2',
				goodsimgUrl: this.HOST + '/uploadImg?type=3',
				turnBtnState: true,
				radio_pic: false,
				pic: false,
				goodsPic: false,
				//富文本变量
        		audio_introduce:'',    // 文章内容
				editorOption:{
					syntax: {
                            highlight: text => hljs.highlightAuto(text).value
                        },
					 modules: {
                        toolbar: [
                            ['bold'],        // toggled buttons
                            [{'header': 1},{'header': 2}],
                            [{'color': ['#ee0000','00ee00','#0000ee', '#ffffff', '#cccccc', '#888888', '#333333']}, 
                            {'background': ['#ee0000','00ee00','#0000ee', '#ffffff', '#cccccc', '#888888', '#333333']}],   
                            ['image']
                        ]
                    },
                    placeholder: '编辑内容...'
				},    // 编辑器选项
				addRange: new Array(),
				uploadDataEdit : {
					token: '',
	                key: null
				},
				imgBaseUrl:'',
				photoUrl:'',         // 上传图片地址
				uploadType:'',    // 上传的文件类型（图片、视频）
				fullscreenLoading: false,
				editImage:false,
				nowLength:0,//当前字符
				SurplusLength:10000,// 剩余字符
				//富文本结束
				cover:'',
				add:'',
				addImg:'',
				add_pic:'',
				share_pic:'',
				column_name:'',
				name:'',
				title:'',
				sf_logo_icon:this.macro.sf_logo_icon,
				showup_oldtimes:''
			}
		},
		mounted() {
			this.$refs.myQuillEditor.quillEditor.theme.quill.getModule('toolbar').addHandler('image', this.imgHandler);
			this.render();
		},
		methods:{
			addPic(){
				this.uptokenPic();
			},
			subscript(index) {
                this.index = index;
                this.uptokenPic();
			},
			shareSubscript(){
             let self = this;
                self.$http.post(self.HOST+'/rollbackPic').then(function(data){
                    self.shareForm.token = data.data.utoken;
					self.share_hret = data.data.onlineUrl;
					self.add_hret=data.data.onlineUrl;
                });
			},
			uptokenPic() {
				let self = this;
				self.$http.post(self.HOST+'/rollbackPic').then(function(data){
	            	self.form.token = data.data.utoken;
	            	self.hret = data.data.onlineUrl;
	            });
			},
			render(){
				let self = this;
	    		let id = self.$route.query.id;
				self.$http.post(self.HOST+'/program/info/'+id).then(function(data){
					if(data.data.status == 1){ 
						self.data = data.data.data.program_info;
						console.log(self.data);
						self.name=self.data.name;
						self.column_name=self.data.column_name;
						if(self.data.radio_pic) {
							self.data.radio_picUrl = self.data.radio_pic;
						} else {
							self.data.radio_picUrl = '../../../../../static/img/play.png';
						}
						if(self.data.create_time) {
							self.data.create_time = new Date(self.data.create_time*1000).format("yyyy-MM-dd");
						} else {
							self.data.create_time = '';
						}
						if(self.data.showup_time) {
                            self.showup_oldtimes=self.data.showup_time;
							self.data.showup_time = new Date(self.data.showup_time*1000).format("yyyy-MM-dd hh:mm");
						} else {
							self.data.showup_time = '';
						}
						if(self.data.type == 1 && new Date(self.data.showup_time).getTime() <= new Date().getTime()){
								self.data.type = 0;
							}
						self.data.oldshowup_time = self.showup_oldtimes;	
						self.radio = self.data.type?"1":'0';
						self.lists = data.data.data.good_list;
						for(var i = 0;i< self.lists.length;i++){
							self.lists[i].imgUrl = self.lists[i].pic;
							self.lists[i].goods_name = self.lists[i].name;
						}
						if(self.lists.length == 0 || self.lists.length == 1){
							$('.goods-list').width('350px');
						}else if(self.lists.length == 2){
							$('.goods-list').width('620px');
						}
						if(self.data.share_img=='0'){
							// self.data.share_pic=false;
							// self.add_pic=false;
							self.add='上传图片'
						}else{
							self.data.share_img=self.data.share_img;
							self.data.share_pic=true;
							// self.add_pic=false;
							self.add='更换'
						}
						// console.log(self.data.add_pic);
						if(self.data.share_intro=='0'){
							self.data.share_intro='';
						}else{
                          self.data.share_intro=self.data.share_intro;
						}
						self.audio_introduce = self.data.audio_introduce;
						self.data.share_title=self.data.share_title;
						// self.share_pic=true;
						// self.cover=' 更换图片'
						self.name=self.data.name;
						self.title=self.data.share_title;
					}
				});
			},
			coverUpload(file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
					this.form.key = sfFileName(file.name);
					this.radio_pic = true;
				}else{
					Toast.makeText('请选择正确的图片格式',3000);
					return false;
				}
			},
			listUpload(file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
					this.form.key = sfFileName(file.name);
					this.share_pic = true;
				}else{
					Toast.makeText('请选择正确的图片格式',3000);
					return false;
				}
			},
			listPreview(file) {
				this.pic = false;
				let index = this.index;
				this.lists[index].pic = this.hret + file.key;
				this.lists[index].imgUrl = this.hret + file.key;
			},
			goodsUpload (file) {
				if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
					this.form.key = file.name;
					this.goodsPic = true;
				}else{
					Toast.makeText('请选择正确的图片格式',3000);
					return false;
				}
	        },
			goodsPreview(file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.goodsPic = false;
				let index = this.index;
				this.goods[index].pic = this.hret + file.key;
				this.goods[index].imgUrl = this.hret + file.key;
				this.goods[index].load = '更换';
				let self=this;
				 let addlist = self.goods;
				 let inputErrPic = $(".pic");
				addlist.forEach(function(item,index){
				let good = true;
				//   console.log(item.pic);
					if(item.pic!=''){
						// $(inputErrUrl[index]).parent('.el-input').siblings().show();
						// console.log(2);
						// console.log($(this).siblings())
						good = true;
						
					$(inputErrPic[index]).siblings('.el-form-item__error').hide();
					}
				})
			},
			addArticle() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
				self.addGoodsMain = true;
		        self.goods.push({
		          	goods_name: '',
		          	taobao_url: '',
	          		pic: '',
	          		id: 0,
	          		program_id: self.$route.query.id,
	          		load: '上传图片',
	          		status: 1
		        });
		        this.expurgate = true;
			},
			delGoods(item) {
				let self = this;
				self.lists[item].status = 0;
			},
			removeDomain(item) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
			    let index = self.goods.indexOf(item)
		        if (index !== -1) {
		          self.goods.splice(index, 1)
		        }
		        if(self.goods.length == 0){
		        	this.expurgate = false;
		        	self.addGoodsMain = false;
		        }
			},
			addDomain() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
		        self.goods.push({
		          	goods_name: '',
		          	taobao_url: '',
	          		pic: '',
	          		id: 0,
	          		program_id: self.$route.query.id,
	          		load: '上传图片',
	          		status: 1
		        });
		        this.expurgate = true;
			},
			goodsName(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let addlist = self.goods;
				let list = self.lists;
				list.forEach(function(item,index){
						let good = true;
					let inputErrName = $("input[name='list_name']");
					let inputErrPic = $(".listPic");
					if(item.goods_name){
						$(inputErrName[index]).parent().siblings().hide();
						good = true;
					}
				});
				addlist.forEach(function(item,index){
				let good = true;
	           	let inputErrName =$("input[name='goods_name']");
					if(item.goods_name){
						good = true;
						$(inputErrName[index]).parent('.el-input').siblings().hide();
					}
				})
			},
			goodsID(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				 let addlist = self.goods;
				addlist.forEach(function(item,index){
				let good = true;
					let inputErrUrl = $("input[name='taobao_url']");
					if(item.taobao_url!=''){
						// $(inputErrUrl[index]).parent('.el-input').siblings().show();
						good = true;
						// Toast.makeText('您还有必填项')
						$(inputErrUrl[index]).parent('.el-input').siblings().hide();
						console.log($(inputErrUrl[index]).parent().siblings())
					}
				})
			},
			setTime(){
				let self=this;
				let showup_time=self.data.showup_time;
                  if(showup_time==''){
					//   Toast.makeText('您未设置定时时间');
					  $('.time').css('visibility','visible');
				  }else{
					    $('.time').css('visibility','hidden');
				  }
			},
			submint(data) {
				console.log(1)
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let list = self.lists;
				let addlist = self.goods;
				let good = true;
				let lists = [];
				list.forEach(function(item,index){
					let inputErrName = $("input[name='list_name']");
					let inputErrPic = $(".listPic");
					if(item.goods_name == ''){
						$(inputErrName[index]).parent().siblings().show();
						good = false;
					}else{
						$(inputErrName[index]).parent().siblings().hide();
					}
					if(item.pic == ''){
						$(inputErrPic[index]).siblings('.el-form-item__error').show();
						good = false;
					}else{
						$(inputErrPic[index]).siblings('.el-form-item__error').hide();
					}
				});
				addlist.forEach(function(item,index){
					let inputErrName = $("input[name='goods_name']");
					let inputErrUrl = $("input[name='taobao_url']");
					let inputErrPic = $(".pic");
					if(item.goods_name == ''){
						$(inputErrName[index]).parent().siblings().show();
						good = false;
					}
					if(item.taobao_url == ''){
						$(inputErrUrl[index]).parent().siblings().show();
						good = false;
					}
					if(item.pic == ''){
						$(inputErrPic[index]).siblings('.el-form-item__error').show();
						good = false;
					}
				});
				addlist.forEach(function(item,index){
					lists.push(item);
				});
				list.forEach(function(item,index){
					lists.push(item);
				});
				if(self.turnBtnState){
					self.$refs[data].validate((valid) => {
				        if (valid && good) {
							self.turnBtnState = false;
				        	let id = self.$route.query.id;
							if(lists.length > 0){
								for (var i = 0; i < lists.length; i++) {
									if(lists[i]['taobao_url'].indexOf('https://') == -1) {
										lists[i]['taobao_url'] = 'https://item.taobao.com/item.htm?id='+lists[i]['taobao_url'];
									}
								}
							}
			let showup_time=self.data.showup_time;
						// let showup_time=self.data.showup_time==self.data.oldshowup_time?self.data.showup_time:self.data.showup_time.format("yyyy-MM-dd hh:mm:ss");
						if(self.data.share_title==''){
								 self.data.share_title=self.data.name
							 }else{
                                self.data.share_title= self.data.share_title;
							 }
						  if(!self.data.share_intro){
								  self.data.share_intro="我正在#十方云水#《"+self.column_name+'》的节目"'+ self.data.name+'"，你也快来听~';
							}else{
                                   self.data.share_intro= self.data.share_intro;
								
							}
					    	let data = {
					    		id: id,
					    		name: self.data.name,
					    		radio_pic: self.data.radio_pic,
					    		type: self.radio,
								oldshowup_time: self.data.oldshowup_time,
								showup_time:showup_time,
				            	goods: lists,
								audio_introduce:self.audio_introduce,
								share_img:self.data.share_img,
								share_title:self.data.share_title,
								share_intro:self.data.share_intro
							   };
							
				            self.$http.post(self.HOST+'/program/update',data).then(function(res){
				            	if(res.data.status == 1){
									// if(data.showup_time!=''){
				            		Toast.makeText('保存成功');
				            		// self.$router.push('/program');
				            		this.back();
									self.turnBtnState = true;
									// }else{
									// 	data.showup_time='';
									// 	 Toast.makeText('您未设置定时时间');
									// }
				            	}else{
				            		if(res.data.msg == '修改name:'+self.data.name+'时与数据库值重复！'){
										alert('节目名称重复');
									}else{
										alert(res.data.msg);
									}
                    				self.turnBtnState = true;
				            	}
							});
			          	} else {
							console.log('error submit!!');
							Toast.makeText('你还有必填项！');
				            return false; 
			          	}
			        });
		       	}
			},
			back() {
				// this.$router.push('/program');
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                  this.$router.go(-2);
			},
			//富文本编辑起始处
			onEditorFocus(editor) {
				editor.enable(true) // 实现达到上限字符可删除
			},
			onEditorChange({ editor, html, text }) {
				 let textLength = text.length
				 this.nowLength = textLength;
				 this.SurplusLength = 10000 - this.nowLength;
				 if (this.SurplusLength <= 0) {
				 	this.SurplusLength = 0;
				 }
				 if (textLength > 10000) {
				 	Toast.makeText('最多输入10000个字符',2000);
				 	editor.enable(false)
				 }
			},
			beforeUploadEdit(file){
				if(file.type === 'image/jpeg' || file.type === 'image/png'){
					this.uploadDataEdit.key = sfFileName(file.name);
					this.fullscreenLoading = false;
				}else{
					Toast.makeText('请选择正确的图片格式(简介仅支持jpg和png)',3000);
					return false;
				}
			},
// 			 // 图片上传成功回调 插入到编辑器中
// 			upScuccessEdit(e, file, fileList) {
//  				 this.fullscreenLoading = false;
// 				 let vm = this;
// 				 let url = this.imgBaseUrl + e.key;

// 					if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
// 					 let value = url
// 					 vm.addRange = vm.$refs.myQuillEditor.quillEditor.theme.quill.getSelection()
// 					 value = value.indexOf('http') !== -1 ? value : 'http:' + value
// 					 vm.$refs.myQuillEditor.quillEditor.theme.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
// 				 } else {
// 					//  插入失败
// 				 }
// 				//  this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
// 			 },
			
			// 图片上传成功回调 插入到编辑器中
            upScuccessEdit(e, file, fileList) {
//                是否显示文件列表
                this.fullscreenLoading = false;
                let vm = this;
                // this.addMsg.radio_url = self.imgBaseUrl+response.key;
                // 'http://p22xgx5t3.bkt.clouddn.com'
                // console.log(this.imgBaseUrl);
                qiniu.imageInfo(e.key, this.imgBaseUrl).then(res => {
                    let url = this.imgBaseUrl + e.key + '?'+res.data.width + '*'+ res.data.height;
                    if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
                        let value = url
                        vm.addRange = vm.$refs.myQuillEditor.quillEditor.theme.quill.getSelection();
                        value = value.indexOf('http') !== -1 ? value : 'http:' + value;
                        vm.$refs.myQuillEditor.quillEditor.theme.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
                    } else {
                        //  插入失败
                    }
                });
            },
		 
			   //分享用图
            coverPreview(file) {
				this.data.radio_pic=true;
				// this.data.share_pic=false;
				this.data.radio_pic = this.hret + file.key;
				this.data.radio_picUrl = this.hret + file.key;
				this.load = '更换';
            },
              shareCoverPreview(file){
				this.data.share_pic = true;
				this.data.share_img = this.share_hret + file.key;
				this.share_pic=this.hret + file.key;
                this.add = '更换';
            },
            coverUpload (file) {
                if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
                    this.form.key = sfFileName(file.name);
                    this.radios_pic = true;
                }else{
                    Toast.makeText('请选择正确的图片格式',3000);
                    return false;
                }
            },
			 shareCoverUpload (file) {
                if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
                    this.shareForm.key = sfFileName(file.name);
					this.data.share_pic = true;
                }else{
                    Toast.makeText('请选择正确的图片格式',3000);
                    return false;
                }
            },
			imgHandler(state) {
			    this.addRange = this.$refs.myQuillEditor.quillEditor.theme.quill.getSelection()
			    if (state) {
			      let fileInput = document.getElementById('imgInput')
			      fileInput.click() // 加一个触发事件
			    }
			    this.uploadType = 'image';
			},
			errUpload(file) {
				this.fullscreenLoading = false;
				console.log(file);
				Toast.makeText('上传失败，请重试！',3000);
			},
			addPicEdit() {
				this.uptokenEditPic();
			},
			uptokenEditPic() {
				let self = this;
				self.$http.post(self.HOST+'/rollbackPic').then(function(data){
	            	self.uploadDataEdit.token = data.data.utoken;
					self.imgBaseUrl = data.data.onlineUrl;
	            });
			},
			notPickImage(){

			},
		}
	}
</script>

<style scoped>
	.progDetail-tab{border-top: 1px solid #f1f1f1;margin-right:30px;}
	.tab-content{display:inline-block;font-size: 16px;padding:15px;margin-right:20px;}
	.active{border-bottom: 2px solid #c19c75;padding-bottom: -2px;}
	/*input{border-style: none!important;padding-left:0!important;color:#777!important;}*/
	.addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
	.addsset-main{width:500px;margin:0 auto;padding-top:50px;position: relative;}
	.jiemu{position: absolute;top:20px;left:-50px;font-size: 14px;font-weight: bold;}
	.button{display: block;margin-top:10px;padding:10px 20px;position: absolute;}
	.statistics-box{color:#777;margin-right:20px;}
	.avatar{width:180px;height:180px;display: block;margin-bottom: 15px;}
	.el-form-item{margin-bottom: 10px!important;}
	.goods-list{width:930px;margin:0 auto;padding-top:20px;position: relative;}
	.shangpin{position: absolute;top:20px;left:50px;font-size: 14px;font-weight: bold;}
	.goods-item{padding-top:30px;}
	.goods-item>div{margin-left:20px!important;margin-top:30px;}
	.addGoods{width:500px;margin:0 auto;padding-top:30px;}
	.del{display:inline-block;width:20px;height:20px;background: url(../../../../../static/img/del-lan.png) no-repeat center;background-size: 20px;position: absolute;top:8px;left:200px;cursor: pointer;}
	.addList{width:20px;height:20px;background: url(../../../../../static/img/add-lan.png) no-repeat center;background-size: 20px;margin:0 auto;margin-top:8px;cursor: pointer;}
		.edit{
		width: 380px;
		/*height: 500px;*/
		margin: 10px auto;
	}
	.quill-editor.editor.ql-container.ql-snow{
		height: 300px;
	}
</style>