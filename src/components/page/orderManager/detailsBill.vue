<!--审核详情  -->
<template>
 <div class="fl sf-main ">
<div class="main-top zoom pl30" style="border-bottom: 1px solid #d8d8d8;height:55px;margin:20px 30px 0px 30px;">
            <div class="lf" style="margin-left:-24px">订单及账单管理 / <span class="zClr-999">账单列表</span> <span class="zClr-999">/账单详情</span>
            </div>
             </div>
               <div class="tab-main ml30">
                   <div style="padding-bottom: 50px;">
                       <div class="addsset-main">
             <el-form  label-width="120px" class="edit">
            <el-form-item label='用户名：' >
              <div> {{item.nickname}}  </div>
            </el-form-item>
             <el-form-item label='用户ID：' >
               <div> {{item.user_id}}  </div>
            </el-form-item>
             <el-form-item label='类型：' >
              <div v-if="item.type==1">退款</div>
              <div v-if="item.type==2">悬赏问答.消费</div>
              <div v-if="item.type==3">提现</div>
              <div v-if="item.type==4">悬赏问答.审核通过</div>
            </el-form-item>
             <el-form-item label='金额：' >
               <div style="color:red"  v-if="item.type==1||item.type==3||item.type==4">-{{(item.price/100).toFixed(2)}}</div>
               <div v-if="item.type==2">+{{(item.price/100).toFixed(2)}}</div>
              </el-form-item>
             <el-form-item label='余额：' >
               <div>  {{(item.account/100).toFixed(2)}} </div>
            </el-form-item>
             <el-form-item label='时间：' >
                 <div>{{item.create_time}}</div>
            </el-form-item>
            <el-form-item label='对方账户：' v-if="item.type==3">
               <div> {{item.payNumb}}  </div>
            </el-form-item>
             <el-form-item label='账单号：'>
               <div> {{item.bill_no}}  </div>
            </el-form-item>
             <el-form-item label='订单号：' v-if="item.out_trade_no!=''">
               <div> {{item.out_trade_no}}  </div>
            </el-form-item>
              <el-form-item label='订单号：' v-if="item.out_trade_no==''">
               <div><i>-</i><i style="margin-left:10px">-</i><i style="margin-left:10px">-</i></div>
            </el-form-item>
             </el-form>
             </div>
              </div>
                </div>
              </div>
</template>

<script>
export default {
  data () {
    return {
       bill_id:'',
       item:{}
    };
  },
  created(){
    let self=this;
    self.bill_id=self.$route.query.bill_id;
    this.getDetail()
  },
  methods: {
  //获取个人账单详情
         getDetail(){
           let self=this;
            if (window.navigator.onLine==false) {
                this.$router.push('/outline')
                     return false;
              }
              self.$http.post(self.HOST+'/billDetail',{bill_id:self.bill_id}).then(function(res){
                if(res.data.status==1){
                  let item=res.data.data;
                 if (item.create_time) 
						   	{
								item.create_time = new Date(item.create_time * 1000).format("yyyy-MM-dd");
							 } else {
								item.create_time = '';
						 	}
							if (!item.avatar) {
								item.avatar = '../../../../static/img/avatar.png';
								// item.avatar = JSON.parse(item.avatar);
							 }
					 	   self.item = item;
                }else {
						sfLayer.makeText(res.data.msg); 
               }
              })
       }
     }
}

</script>
<style  scoped>
 .addsset-main{width:500px;margin:0 auto;padding-top:30px;word-break: break-all;word-wrap: break-word;}
</style>