<template>
	<div class="addPart main">
		<div class="addPart-top main-top zoom">
			<div class="addPart-title lf">节目管理 / <span class="zClr-999">节目列表 / </span><span class="zClr-999">上传音频</span></div>
		</div>
		<div class="tab-main">
			<div style="padding-bottom: 50px;">
				<el-form ref="addMsg" :model="addMsg" :rules="rules" label-width="140px">
					<div class="addsset-main">
						<el-form-item label="音频名称：" prop="name">
							<el-input v-model="addMsg.name" size="normal" placeholder="请输入音频名称"></el-input>
						</el-form-item>
						<el-form-item label="请上传音频：" prop="radio_url" style="height:155px;overflow:hidden;" >
							<i class="fbt_sign">*</i>
							<el-upload action='http://upload-z0.qiniu.com'
						        :show-file-list='showUploadList'
						        :on-progress="handleProgress"
						        :on-success="handleSuccess"
						        :on-error="handleError"
						        :before-upload="beforeUpload"
						        :data='form'>
						        <el-button size="small" class="btn-box btn-file" :disabled="voice" @click="UpAudio" type="primary">点击上传</el-button>
						    </el-upload>
						    <span style="color:#666!important;">选择文件</span>：{{ fileN }}<br/>
						    <span style="color:#666!important;">上传进度</span>：{{ loaded }} MB / {{ fileSize }} MB, {{ percent }}%<br/>
						    <span style="color:#666!important;">上传结果</span>：{{ result }}<br/>
							<span class="fbt upvoice" style="display:none">请上传音频</span>
						</el-form-item>
						<el-form-item style="display:none;">
							<el-input v-model="addMsg.radio_url" size="nomal"  ></el-input>
						</el-form-item>
						<el-form-item label="请上传音频封面：" prop='radis_pic'>
							<el-input style="display: none" v-model="addMsg.radis_pic"></el-input>
							<el-upload action='http://upload-z0.qiniu.com'
						        :show-file-list='showUploadList'
						        :on-success="coverPreview"
						        :before-upload="coverUpload"
						        :data='form1'>
						        <img v-if="addMsg.radis_pic" :src="addMsg.coveImg" class="avatar" @click.stop="notPickImage()" style="cursor:default;">
						        <span @click='subscript(0)' type="primary" class="change">{{load}}</span>
						        <i class="el-icon-loading" v-show="radis_pic"></i>
						    </el-upload>
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
							<el-radio v-model="addMsg.radio" label="0">立即上架</el-radio>
							<el-radio v-model="addMsg.radio" label="1">定时上架</el-radio>
						</el-form-item>
						<el-form-item label="设置上架时间：" prop='showup_time' v-if='addMsg.radio==1'>
  							<el-date-picker v-model="addMsg.showup_time" type="datetime" placeholder="选择时间"></el-date-picker>
						</el-form-item>
						<!--<el-form-item label="时长：" prop="burning_time">
  							<el-time-picker v-model="addMsg.burning_time"></el-time-picker>
						</el-form-item>-->
						<!--<el-form-item label="时长：">
  							<el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker>
						</el-form-item>-->
						<el-form-item label="设置分享用图：" prop='share_pic'>
							<el-input style="display: none" v-model="addMsg.share_pic"></el-input>
							<el-upload action='http://upload-z0.qiniu.com'
									   :show-file-list='showUploadShareList'
									   :on-success="coverSharePreview"
									   :before-upload="coverShareUpload"
									   :data='shareForm'>
								<img v-if="addMsg.share_pic" :src="addMsg.coveShareImg" class="avatar" @click.stop="notPickImage()" style="cursor:default;">
								<span @click='subShareScript(0)' type="primary" class="change">{{shareCover}}</span>
								<i class="el-icon-loading" v-show="share_pic"></i>
							</el-upload>
						</el-form-item>
						<el-form-item label="设置分享标题：" prop="title">
							<el-input v-model="addMsg.title" size="normal" placeholder="节目标题"></el-input>
						</el-form-item>
						<el-form-item label="设置分享简介：" prop="intro">
							<el-input v-model="addMsg.intro" size="normal" placeholder="节目简介"></el-input>
						</el-form-item>
					</div>
					<div class="goods">
						<div class="addGoods btn-normal" v-show='addGoods'>
							<el-button class="btn-box btn-normal" type="primary" @click="addArticle">添加商品</el-button>
						</div>
						<div class="addsset-main" v-show="addGoodsMain" >
							<el-form-item v-for="(list,index) in addMsg.lists" :label="'商品' + (index+1) + '：'"  :key="list.name">
								<i class="goods_sign">*</i>
								<el-form-item>
									<el-input v-model="list.goods_name"  placeholder="请输入商品名字" name='goods_name' @input="goodsName()"></el-input>
									<div class="el-form-item__error" style="visibility:hidden">请输入商品名字</div>
								</el-form-item>
								<el-form-item>
									<el-input v-model="list.taobao_url" type="number" name="taobao_url"  :min="1"  @input="goodsID()" placeholder="请输入商品ID" style="margin-top:22px;"></el-input>
									<div class="el-form-item__error goodId" style="display: none;">请输入商品ID</div>
								</el-form-item>
								<el-form-item style="position: relative;margin-top:22px" class="goodsPic">
									<el-upload action='http://upload-z0.qiniu.com'
								        :show-file-list='showUploadList'
								        :on-success="goodsPreview"
								        :before-upload="goodsUpload"
								        :data='form1' class="pic">
								        <img v-if="list.pic" :src="list.imgUrl" class="avatar" style="cursor:default;" @click.stop="notPickImage()">
								        <span class="change"  @click='subscript(index)' type="primary">{{list.load}}</span>
						        	
								    </el-upload>
									<!-- <el-upload :action="goodsimgUrl" list-type="picture" :show-file-list="false" :on-success="goodsPreview" name="pic">
										<img v-if="list.pic" :src="list.imgUrl" class="avatar">
									  	<el-button class="btn-box btn-file" @click='subscript(index)' size="small" type="primary">{{list.load}}</el-button>
									</el-upload> -->
									<div  class="el-form-item__error " style="display: none;">请选择商品图片</div>
									<div @click.prevent="removeDomain(list)" class="del"></div>
								</el-form-item>
	  						</el-form-item>
	  						<div class="addList" v-show="expurgate" @click="addDomain"></div>
						</div>
					</div>
					<div class="addVioce-btn zoom" style="width:500px;height:50px;margin:0 auto;overflow: hidden;margin-bottom:110px;">
						<el-button class="btn-main button knob rt" type="primary" :disabled="disabled" id="add" @click="addForm('addMsg')">提交</el-button>
						<el-button v-show='false' @click='test'>text</el-button>
						<el-button class="button back knob rt" type="primary" @click="back">取消</el-button>
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
	// import sf_logo_icon from '../../../common/js/macro.js'
	export default {
		 mounted() {
		    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
		    // this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
		    this.$refs.myQuillEditor.quillEditor.theme.quill.getModule('toolbar').addHandler('image', this.imgHandler);
		    console.log();
		    // this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)  // 为视频ICON绑定事件
		  },
		data() {
			return {
				form: {
	                token: '',
	                key: null
	            },
                form1: {
                    token: '',
                    key: null
                },
                shareForm: {
                    token: '',
                    key: null
                },
	            hret: '',
                hret1: '',
                shareHret: '',
                showUploadList: false,
                showUploadShareList: false,
	            fileN: '',
	            fileSize: '',
	            loaded: '',
	            percent: '',
	            result: '',
				addMsg: {
					name: '',
					radio_url: '',
					persistentId: '',
                    radis_pic: '',
                    share_pic: '',
					showup_time:'',
                    coverImg: '',
                    coverImg2: '',
					radio:'0',
					goods_name:'',
					burning_time: '',
					lists: [

					],
					title:'',
                    intro:''
				},
				rules: {
					name: [
						{required: true,message: '请输入音频名称',trigger: 'blur'}
					],
					showup_time: [
						{type: 'date',required: true,message: '请选择时间',trigger: 'change'}
					],
					radis_pic: [
						{required: true,message: '请上传封面',trigger: 'blur'}
					],
				},
				disabled: false,
				imgUrl: this.HOST+'/uploadImg?type=2',
				goodsimgUrl: this.HOST+'/uploadImg?type=3',
				coverUrl: '',
				coverImg: '',
				addGoods: true,
				addGoodsMain: false,
				expurgate: true,
				cover: false,
				load: '上传图片',
                cover: '上传图片',
                shareCover: '上传图片',
        		imageUrl: '',
        		urlImg: '',
                index: '',
                shareIndex: '',
        		radio: false,
        		fileName: false,
        		radioErr: false,
        		turnBtnState: true,
        		value1: '',
        		voice: false,
                radis_pic: false,
                share_pic: false,
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
				sf_logo_icon:this.macro.sf_logo_icon
			}
		},
		methods: {
			UpAudio() {
				this.uptoken();
			},
			uptoken() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
				self.$http.post(self.HOST+'/rollback').then(function(data){
	            	self.form.token = data.data.utoken;
	            	self.hret = data.data.onlineUrl;
				});
				
            },
            uptokenPic() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                let self = this;
                self.$http.post(self.HOST+'/rollbackPic').then(function(data){
                    self.form1.token = data.data.utoken;
                    self.hret1 = data.data.onlineUrl;
                });
            },

			beforeUpload (file) {
				if(file.type === 'audio/mp3' || file.type === 'audio/x-m4a' || file.type === 'audio/mpeg' || file.type === 'audio/mp4'){
					// this.disabled = true;
					this.fileN = file.name;
	            	this.form.key = file.name;
	            	this.result = '';
	            	this.voice = true;
				}else{
					Toast.makeText('请选择正确格式',3000);
					return false;
				}
	        },
	        handleProgress (event, file, fileList) {
	            this.loaded = (event.loaded / 1000000).toFixed(2)
	            this.fileSize = (event.total / 1000000).toFixed(2)
	            this.percent = (event.loaded / event.total * 100).toFixed(2)
	        },
	        handleSuccess (response, file, fileList) {
				$('.upvoice').hide();
	            this.voice = false;
	        	let self = this;
	            this.result = '上传成功';
	            this.addMsg.radio_url = self.hret+response.key;
	            this.addMsg.persistentId = response.persistentId;
				// this.disabled = false;
	            $.ajax({
			        url: self.hret+response.key+'?avinfo',
			        method: "get",
			        data: '',
			        dataType:'json',
			        traditional:true,
			        success: function(data){
			          	self.addMsg.burning_time = data.format.duration;
			        },
			    });
	        },
	        handleError (error, response, file) {
	            this.voice = false;
	            this.result = error.toString()
	        },
            coverUpload (file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
                    this.form1.key = sfFileName(file.name);
                    this.radis_pic = true;
                }else{
                    Toast.makeText('请选择正确的图片格式',3000);
                    return false;
                }
            },
            coverPreview(file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                this.radis_pic = false;
                this.addMsg.radis_pic = this.hret1 + file.key;
                this.addMsg.coveImg = this.hret1 + file.key;
				this.cover = '更换';
				this.load='更换'
            },

			//TODO 设置分享用图
            coverSharePreview(file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                this.share_pic = false;
                this.addMsg.share_pic = this.shareHret + file.key;
                this.addMsg.coveShareImg = this.shareHret + file.key;
                this.shareCover = '更换';
            },
            coverShareUpload (file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
                    this.shareForm.key = sfFileName(file.name);
                    this.share_pic = true;
                }else{
                    Toast.makeText('请选择正确的图片格式',3000);
                    return false;
                }
            },
            subShareScript(index) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                this.shareIndex = index;
                this.uptokenSharePic();
            },
            uptokenSharePic() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                let self = this;
                self.$http.post(self.HOST+'/rollbackPic').then(function(data){
                    self.shareForm.token = data.data.utoken;
                    self.shareHret = data.data.onlineUrl;
                });
            },


			goodsUpload (file) {
				let self=this;
				if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
					this.form1.key = sfFileName(file.name);
					this.pic = true;
				}else{
					Toast.makeText('请选择正确的图片格式',3000);
					return false;
				}
	        },
			goodsPreview(file) {
				let self=this;
				let index = this.index;
				this.addMsg.lists[index].pic = this.hret1+file.key;
				this.addMsg.lists[index].imgUrl = this.hret1+file.key;
				// this.addMsg.lists[index].load = '更换';
				 let goods = this.addMsg.lists;
				 let inputErrPic = $(".pic");
				goods.forEach(function(item,indexs){
				let good = true;
					if(item.pic!=''&&index==indexs){
						console.log(index,indexs);
						good = true;
						self.addMsg.lists[indexs].load='更换'
					$(inputErrPic[indexs]).siblings('.el-form-item__error').hide();
					}
				})
			},
            subscript(index) {
				  this.index = index;
				this.uptokenPic();
				
            },

			addArticle() {
				let self = this;
				self.addGoodsMain = true;
		        self.addMsg.lists.push({
					goods_name:'',
		          	taobao_url: '',
	          		pic: '',
					  load: '点击上传',
		        });
				this.expurgate = true;
			},
			goodsName(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				 let goods = self.addMsg.lists;
				goods.forEach(function(item,index){
				let good = true;
	           	let inputErrName =$("input[name='goods_name']");
					if(item.goods_name){
						good = true;
						$(inputErrName[index]).parent('.el-input').siblings().css('visibility','hidden');
					}
				})
			},
			goodsID(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				 let goods = self.addMsg.lists;
				goods.forEach(function(item,index){
				let good = true;
					let inputErrUrl = $("input[name='taobao_url']");
					if(item.taobao_url!=''){
						good = true;
						$(inputErrUrl[index]).parent('.el-input').siblings().hide();
					}
				})
			},
			addForm(addMsg) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(self.rules.length<2){
                   Toast.makeText(' 您还有必填项');
				}
				if(self.addMsg.radio_url==''){
					$('.upvoice').show();
				}
				let goods = self.addMsg.lists;
				let good = true;
				if($('#radio').html() == ''){
					good = false;
					self.radioErr = true;
				}else{
					good = true;
					self.radioErr = false;
				}
				console.log(self.addMsg.lists);
				goods.forEach(function(item,index){
					let inputErrName =$("input[name='goods_name']");
					let inputErrUrl = $("input[name='taobao_url']");
					let inputErrPic = $(".pic");
					if(item.goods_name.length==0){
						$(inputErrName[index]).parent('.el-input').siblings().css('visibility','visible');
						good = false;
						Toast.makeText('您还有必填项')
						// console.log(1);
					}
					if(item.taobao_url == ''){
							Toast.makeText('您还有必填项')
						$(inputErrUrl[index]).parent('.el-input').siblings().show();
						good = false;
					}
					if(item.pic == ''){
							Toast.makeText('您还有必填项')
						// console.log($(inputErrPic[index]));
						$(inputErrPic[index]).siblings('.el-form-item__error').show();
						good = false;
					}
				});
				let author_id = self.$route.query.author_id;
	        	let author_name = self.$route.query.author_name;
	        	let column_id = self.$route.query.column_id;
	        	let column_name = self.$route.query.column_name;
	        	if(self.turnBtnState){
					self.$refs[addMsg].validate((valid) => {
				        if (valid && good) {
							self.turnBtnState = false;
							// self.disabled=false;
							if(goods.length > 0){
								for (var i = 0; i < goods.length; i++) {
									if(goods[i]['taobao_url'].indexOf('https://') == -1) {
										goods[i]['taobao_url'] = 'https://item.taobao.com/item.htm?id='+goods[i]['taobao_url'];
									}
								}
							}
							if(self.addMsg.title==''){
								self.addMsg.title=self.addMsg.name
							}else{
								self.addMsg.title=self.addMsg.title
							}
							if(!self.addMsg.coveShareImg){
                                 self.addMsg.coveShareImg= self.addMsg.radis_pic;
							}else{
								self.addMsg.coveShareImg=self.addMsg.coveShareImg;
							}
							if(!self.addMsg.intro){
								  self.addMsg.intro="我正在#十方云水#《"+column_name+'》的节目"'+self.addMsg.name+'"，你也快来听~';
							}else{
								 self.addMsg.intro= self.addMsg.intro;
							}
							
					    	let data = {
					    		author_id: author_id,
					    		author_name: author_name,
					    		column_id: column_id,
					    		column_name: column_name,
					    		name: self.addMsg.name,
					    		radio_pic: self.addMsg.radis_pic,
					    		type: self.addMsg.radio,
				            	goods: self.addMsg.lists,
				            	radio_url: self.addMsg.radio_url,
				            	persistentId: self.addMsg.persistentId,
				            	burning_time: self.addMsg.burning_time,
								audio_introduce: self.audio_introduce,
								share_img:self.addMsg.coveShareImg,
								share_title:self.addMsg.title,
								share_intro:self.addMsg.intro
							};
							if(self.addMsg.radio == '1'){
				            	data.showup_time = self.addMsg.showup_time.format("yyyy-MM-dd hh:mm:ss");
							}
							if(self.addMsg.radio_url==''){
					            Toast.makeText(' 您还有必填项');
				                }else{
				            self.$http.post(self.HOST+'/program/save',data).then(function(data){
								// console.log(data);
				            	if(data.data.status == 1){
				            		self.$router.push('/program');
                   					self.turnBtnState = true;
				            	}else{
									if(data.data.msg == '增加name:'+self.addMsg.name+'时与数据库值重复！'){
										alert('节目名称重复');
									}else{
										alert(data.data.msg);
									}
                    				self.turnBtnState = true;
				            	}
							});
								}
			          	} else {
							//   self.disabled=false;
				            Toast.makeText('您还有必填项!');
				            return false; 
			          	}
			        });
				}
				
			},
			removeDomain(item) {
				let self = this;
			    let index = self.addMsg.lists.indexOf(item)
		        if (index !== -1) {
		          self.addMsg.lists.splice(index, 1)
		        }
		        if(self.addMsg.lists.length == 0){
		        	this.expurgate = false;
				}
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
			},
			addDomain() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
		        self.addMsg.lists.push({
		          	goods_name: '',
		          	taobao_url: '',
	          		pic: false,
	          		load: '点击上传'
		        });
		        this.expurgate = true;
			},
			back() {
				this.$router.push('/program');
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
			},
			//富文本编辑接口起始处
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
			 // 图片上传成功回调 插入到编辑器中
			upScuccessEdit(e, file, fileList) {
				 this.fullscreenLoading = false;
				 let vm = this;
				 let url = this.imgBaseUrl + e.key;
				 if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
					 let value = url
					 vm.addRange = vm.$refs.myQuillEditor.quillEditor.theme.quill.getSelection()
					 value = value.indexOf('http') !== -1 ? value : 'http:' + value
					 vm.$refs.myQuillEditor.quillEditor.theme.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
				 } else {
					//  插入失败
				 }
				//  this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
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
				console.log(1);
				self.$http.post(self.HOST+'/rollbackPic').then(function(data){
	            	self.uploadDataEdit.token = data.data.utoken;
	            	self.imgBaseUrl = data.data.onlineUrl;
	            });
			},
			test(){
				console.log(this.audio_introduce);
				return;
			},

			//富文本接口结束
			notPickImage(){

			},
		}
	}
</script>

<style scoped>
	.addsset-title{text-align: center;font-size: 28px;padding: 15px 0;}
	.addsset-main{width:500px;margin:0 auto;padding-top:30px;}
	.button{display: block;margin-top:10px;padding:12px 25px;float:right;}
	.goods{border-top:1px solid #f1f1f1;}
	.addGoods{margin:0 auto;margin-top:20px;}
	.del{display:inline-block;width:20px;height:20px;background: url(../../../../../static/img/del-lan.png) no-repeat center;background-size: 20px;position: absolute;top:8px;left:200px;cursor: pointer;}
	.addList{width:20px;height:20px;background: url(../../../../../static/img/add-lan.png) no-repeat center;background-size: 20px;margin:0 auto;margin-top:8px;cursor: pointer;}
	.cover{width:100px;}
	.file{font-size: 14px;padding:10px 0;}
	.avatar{width:180px;height:180px;display: block;margin-bottom: 15px;}
	.btn-file{height:36px;padding:0 15px;line-height: 36px;font-size: 14px!important;}
	.knob{padding:10px 20px;}
	.edit{
		width: 380px;
		/*height: 500px;*/
		margin: 10px auto;
	}
	.quill-editor.editor.ql-container.ql-snow{
		height: 300px;
	}
	.el-upload img{
		width: 91px;
		height: 91px;
	}
</style>

