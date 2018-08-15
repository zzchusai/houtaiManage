<template>
	<div class="terms main">
		<div class="terms-top main-top zoom">
			<div class="terms-title lf">首页管理 / <span class="zClr-999">节气插画管理</span></div>
		</div>
		<div class="page">
			<div class="page-info">
				<table>
					<thead>
						<tr><th v-for='title in titles'>{{title}}</th></tr>
					</thead>
					<tbody>
						<tr v-for="item in tableData">
							<td>
								<div style="height:20px;line-height:20px;margin:10px 0 5px;">{{item.name}}</div>
								<div style="height:20px;line-height:20px;margin-bottom:10px;">（{{item.solar_time}}）</div>
							</td>
							<td>
								<div class="QR" v-if="item.isSmallPic==1">
									<img :src="item.small_pic" alt="" style="height:100px;z-index: 1;" @click='viewImgM(item.small_pic)'/>
									<button class="button butn btn-box" v-show="JQTUGX" @click="replace(item.id,item.small_pic,false)">更换</button>
								</div>
								<div class="QR" v-show="JQTUGX" v-if="item.isSmallPic==0"  @click='upload(item.id, false)'>
									<img src="../../../../static/img/placeholder.png" width="208" alt="" style="height:100px;z-index: 1;"/>
									<span style="z-index: 2;position:absolute;top:25px;left:26px">375x150长宽比例</span>
								</div>
							</td>
							<td>
								<div class="QR" v-if="item.isPic==1">
									<img :src="item.img" alt="" style="height:100px;z-index: 1;"  @click='viewImg(item.img)'/>
									<button class="button butn btn-box" v-show="JQTUGX" @click="replace(item.id,item.pic,true)">更换</button>
								</div>
								<div class="QR"  v-show="JQTUGX" v-if="item.isPic==0" @click="upload(item.id, true)">
									<img src="../../../../static/img/placeholder.png" alt="" style="height:100px;z-index: 1;"/> 
									<span style="z-index: 2;position:absolute;top:25px;left:45px">无长宽限制</span>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="model" v-show="model">
			<div class="model-main" style="top:28%;">
				<div class="modei-box">
					<div class="model-title">{{load}}</div>
					<div style="text-align: center;padding-bottom: 10px;" v-show='bigImg'>无长宽限制</div>
					<div style="text-align: center;padding-bottom: 10px;" v-show='!bigImg'>375x150长宽比例</div>
					<el-form :model="form" label-width="80px" style="padding:0 40px;">
						<el-form-item>
							<el-upload action='http://upload-z0.qiniu.com'
						        :show-file-list='showUploadList'
						        :on-success="coverPreview"
						        :on-error="errUpload"
						        :before-upload="coverUpload"
						        :data='fo'>
						        <img v-if="form.radis_pic" :src="form.coveImg" class="avatar" @click.stop="notPickImage()" style="cursor:default">
						        <span @click="addPic" type="primary" class='change'>{{title}}</span>
						        <i class="el-icon-loading" v-show="radis_pic"></i>
						    </el-upload>
  							<!-- <el-upload :action="imgUrl" list-type="picture" :show-file-list="false" :on-success="coverPreview">
								<img v-if="form.radis_pic" :src="form.coveImg" class="avatar">
							  	<el-button class="btn-box btn-file upload" size="small" type="primary">{{title}}</el-button>
							</el-upload> -->
						</el-form-item>
					</el-form>
				</div>
				<div class="model-btn zoom">
					<div class="butn btn-cancel lf" style="margin-top:5px;" @click="cancel">取消</div>
					<div class="butn btn-main rt" style="margin-top:5px;" @click="confirm">确认</div>
				</div>
			</div>
			<div class="model-bg"></div>
		</div>
		<div class="model" v-show="showView">
			<div class="model-view-img">
				<div class="modei-box">
					<img style="width:350px;height:623px; " :src="imageShow" alt="" @click='cancel()'/>
				</div>
			</div>
			<div class="model-bg"></div>
		</div>
		<div class="model" v-show="showViewM">
			<div class="model-view-imgM">
				<div class="modei-box">
					<img style="width:350px;height:150px; " :src="imageShow" alt="" @click='cancelM()'/>
				</div>
			</div>
			<div class="model-bg"></div>
		</div>
	</div>
</template>

<script>
	var Toast={
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
	            var node=document.createElement("div");
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
				fo: {
	                token: '',
	                key: null
	            },
	            hret: '',
				showUploadList: false,
				form: {
					radis_pic: '',
					coveImg: '',
				},
				titles: ['节气名称','小图','大图'],
				tableData:[],
				model: false,
				title: '点击上传',
				id: '',
				placeName: '',
				cover: false,
				load: '上传图片',
				img: '',
				id: '',
				imgUrl: this.HOST+'/uploadImg?type=4',
				turnBtnState: true,
				JQTUGX: false,
				pic: false,
				radis_pic: false,
				bigImg: true,
				showView: false,
				showViewM: false,
				imageShow: '',
			}
		},
		created() {
			this.render();
			this.limit();
		},
		methods:{
			addPic() {
				this.uptokenPic();
			},
			uptokenPic() {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let self = this;
				self.$http.post(self.HOST+'/rollbackPic').then(function(data){
	            	self.fo.token = data.data.utoken;
	            	self.hret = data.data.onlineUrl;
	            });
			},
			limit() {
				let self = this;
				let limitCode =JSON.parse(localStorage.getItem('limitCode'));
				limitCode.forEach(function(item,index){
					if(item == 'JQTUGX'){
						self.JQTUGX = true;
					}
				});
			},
			coverUpload(file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
					this.fo.key = sfFileName(file.name);
					this.pic = false;
					this.radis_pic = true;
				}else{
					Toast.makeText('请选择正确的图片格式',3000);
					return false;
				}
			},
			errUpload(file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.radis_pic = false;
				Toast.makeText('上传失败，请重试！',3000);
			},
			coverPreview(file) {
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				this.pic = true;
				this.radis_pic = false;
				this.form.radis_pic = this.hret + file.key;
				this.form.coveImg = this.hret + file.key;
				this.title = '更换';
				$('.upload').css('margin-left','0px');
			},
			render(){
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.$http.post(self.HOST+'/solarTerms').then(function(data){
					if(data.data.status == 1){ 
						self.tableData = data.data.data;
						for(var i = 0; i < self.tableData.length; i++) {
							self.tableData[i].solar_time = new Date(self.tableData[i].solar_time*1000).format("yyyy-MM-dd");
							self.tableData[i].isPic = self.tableData[i].pic == ''?0:1;
							self.tableData[i].img = self.tableData[i].pic;
							self.tableData[i].isSmallPic = self.tableData[i].small_pic == ''?0:1;
							self.tableData[i].small_pic = self.tableData[i].small_pic;
						}
						if(self.tableData.length == 0){
							let html = '<tr class="found-tr"><td colspan="2"><div class="found"></div></td></tr>';
							$('tbody').html(html);
						}
					}else{
						alert(data.data.msg);
					}
				});
			},
			replace(id,pic, bigImg) {
				let self = this;
				if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				self.id = id;
				self.model = true;
				self.cover = true;
				self.title = '更换'
				self.load = '更换图片'
				self.form.radis_pic = pic;
				self.form.coveImg = pic;
				self.bigImg = bigImg;
			},
			upload(id, bigImg) {
				let self = this;
					if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				$('.upload').css('margin-left','57px');
				self.id = id;
				self.model = true;
				self.load = '上传图片',
				self.title = '点击上传',
				self.form.radis_pic = '';
				self.form.coveImg = '';
				self.bigImg = bigImg;
			},
			cancel() {
				this.model = false;
				this.cover = false;
				this.showView = false;
			},
			cancelM() {
				this.model = false;
				this.cover = false;
				this.showViewM = false;
			},
			viewImg(inValue){
				this.imageShow = inValue;
				this.showView = true;
			},
			viewImgM(inValue){
				this.imageShow = inValue;
				this.showViewM = true;
			},
			notPickImage(){

        	},
			confirm() {
				let self = this;
					if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
				let data = {
					id: self.id,
				}
				if(self.bigImg){
					data.pic = self.form.radis_pic;
				} else {
					data.small_pic = self.form.radis_pic;
				}
				if(self.form.radis_pic == "") {
					Toast.makeText('请选择图片');
					return false;
				} else if(!self.pic) {
					Toast.makeText('正在上传，请稍后...');
					return false;
				}else if(self.turnBtnState){
					self.turnBtnState = false;
					self.$http.post(self.HOST+'/solarTerms/update',data).then(function(data){
						if(data.data.status == 1){
							self.model = false;
                    		self.turnBtnState = true;
			            	self.render();
						}else{
							alert(data.data.msg);
                    		self.turnBtnState = true;
						}
					});
				}
			}
		}
	}
</script>

<style scoped>
	.QR{width:160px;margin:10px auto;position: relative;}
	.model-input{width:40%;margin-bottom:20px;margin-left:30%;padding:15px 0;}
	.butn{padding:0 15px;}
	.button{position: absolute;bottom: 0px;right:-80px;}
	.avatar{width:180px;height:180px;display: block;margin-bottom: 15px;}
	.model-view-img{position: fixed;top:5%;right:calc((100% - 350px)/2);border-radius: 4px;background: #fff;z-index: 11;}
	.model-view-imgM{position: fixed;top:15%;right:calc((100% - 350px)/2);border-radius: 4px;background: #fff;z-index: 11;}
	/*.model-view-img{position: fixed;top:5%;right:calc((87% - 800px)/2);width:800px;border-radius: 4px;background: #fff;z-index: 11;padding:10px 0px;}*/
	.QR-backImage{
		background: url('../../../../static/img/placeholder.png') no-repeat center top;
	}
</style>