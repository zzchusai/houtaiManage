<!--审核详情  -->
<template>
 <div class="fl sf-main ">
<div class="main-top zoom pl30" style="height:55px;margin:15px 30px 0px 30px">
            <div class="lf" style="margin-top:10px">审核管理 / <span class="zClr-999">提现审核</span> <span class="zClr-999">/审核详情</span>
            </div>
             </div>
               <div class="tab-main ml30">
                   <div style="padding-bottom: 50px;">
                       <div class="addsset-main">
             <el-form  label-width="120px" class="edit">
            <el-form-item label='用户名：' >
              <div>{{item.nickname}}   </div>
            </el-form-item>
             <el-form-item label='提现账号：' >
               <div>  {{item.payNumb}} </div>
            </el-form-item>
             <el-form-item label='账户余额：' >
               <div> {{(item.account/100).toFixed(2)}} </div>
            </el-form-item>
             <el-form-item label='申请金额：' >
               <div>{{(item.price/100).toFixed(2)}}   </div>
            </el-form-item>
             <el-form-item label='申请时间：' >
               <div>  {{item.create_time}} </div>
            </el-form-item>
             <el-form-item label='审核结果：' >
               <div v-if="item.state==0">
                 <el-radio v-model="radio" label="0" >通过</el-radio>
							<el-radio v-model="radio" label="1">不通过</el-radio>
               </div>
               <div v-if="item.state==1">审核通过</div>
                 <div v-if="item.state==2">审核不通过</div>
            </el-form-item>
             <el-form-item label='原因：' v-if="radio==1&&item.state!=2" >
              <textarea  cols="20" rows="5" style="border:1px solid #d8d8d8;margin-top:10px;font-size:18px" placeholder="请输入审核不通过原因" v-model="reason"></textarea>
            </el-form-item>
              <el-form-item label='原因：' v-if="item.state==2">
               <div>  {{item.not_pass_reason}} </div>
            </el-form-item>
            <el-form-item label='操作人：' v-if="item.state!=0">
               <div> {{item.operator}}  </div>
            </el-form-item>
            <el-form v-if="item.state==0">
                        <div class="mt30" style="margin-bottom:50px;margin-left:50px">
                            <el-button  class="btn-main button" style="top:0;right:0;width:80px" type="primary" @click.stop="onSubmit()">确定</el-button>
                            <el-button class="button back" style="top:0;width:80px;margin-left:30px" type="primary"  @click.stop="isShow">退出</el-button>
                        </div>
                    </el-form>
             </el-form>
             </div>
              </div>
                </div>
                 <sf-popups :message="sfMessage" @sfCancel="isShow()" @sfConfirm="goto()" v-show="modelAdd"></sf-popups>
              </div>
</template>

<script>
import sfPopups from '../../component/popups/popups'
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
  data () {
    return {
        radio:"0",
       sfMessage:'退出后内容不再保留，确定退出？',
       modelAdd:false,
       transfer_id:'',
       item:{},
       reason:''
    };
  },

  components: {
     sfPopups,
  },
  created(){
    let self=this;
     self.transfer_id=self.$route.query.transfer_id;
    this.getDetail()
  },
  methods: {
    isShow(){
                let vm = this;
                if (!window.navigator.onLine) {
                    window.location.reload();
                    return false;
                }
                vm.modelAdd = !vm.modelAdd;
            },
  goto(){
    this.$router.push('/checkCash')
  },
  //获取个人审核详情
  getDetail(){
     let self=this;
     if (window.navigator.onLine==false) {
            this.$router.push('/outline')
               return false;
         }
    self.$http.post(self.HOST+'/depositCheckDetail',{transfer_id:self.transfer_id}).then(function(res){
      if(res.data.status==1){
         self.item=res.data.data;
         if ( self.item.create_time) 
							{
								 self.item.create_time = new Date( self.item.create_time * 1000).format("yyyy-MM-dd");
							} else {
								 self.item.create_time = '';
							}
							if (! self.item.avatar) {
								 self.item.avatar = '../../../../static/img/avatar.png';
								// item.avatar = JSON.parse(item.avatar);
              }
      }else{
        alert(res.data.msg)
      }
    })
         
  },
  //确定
  onSubmit(){
     let self=this;
     if (window.navigator.onLine==false) {
            this.$router.push('/outline')
               return false;
         }
         let data={};
         //审核通过
       if(self.radio==0){
         data={
           transfer_id:self.transfer_id,
           status:1,
         }
         }else{
           //审核不通过
           if(self.reason==''){
             self.reason='未知错误，请联系客服';
           }else{
             self.reason=self.reason
             }
           data={
            transfer_id:self.transfer_id,
            status:0,
            reason:self.reason
           }
         }
         self.$http.post(self.HOST+'/depositCheckTransfer',data).then(function(res){
           if(res.data.status==1){
            self.getDetail()
           }else{
             Toast.makeText(res.data.msg)
           }
      })
  }
  }
}

</script>
<style  scoped>
 .addsset-main{width:500px;margin:0 auto;padding-top:30px;word-break: break-all;word-wrap: break-word;}
</style>