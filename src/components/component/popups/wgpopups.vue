<!--弹出层对话框组件-->
<template>
    <div class="model">
        <div class="model-main">
            <div class="model-del">{{message}}</div>
            <div class="wgbtn" style="width:300px;height:34px;margin:0 auto;margin-top:-20px">
             <i class="cicle qindu" @click="selectqdwg()"></i>
             <span style="line-height:34px;display:inline-block;float:left;margin-left:4px">轻度违规</span>
             <i class="cicle zhongdu" @click="selectzdwg()"></i>
                 <span style="line-height:34px;display:inline-block;float:left;margin-left:4px">重度违规</span>
                 </div>
            <div class="model-btn zoom" style="padding-top:20px">
                <div class="butn btn-small btn-cancel lf mt5 pl15 pr15" @click="cancel()">取消</div>
                <div class="butn btn-small btn-main rt mt5 pl15 pr15" @click="confirm()">确认</div>
            </div>
        </div>
        <div class="model-bg"></div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
            }
        },
        created() {
        },
//        组件参数定义默认值
        props: {
            message: {
                type: String,
                default:'确定删除?',   //默认值
            },
        },
        methods: {
            cancel() {
                let self=this;
                if(!window.navigator.onLine){
                    window.location.reload();
                    return false;
                }
                self.$emit('sfCancel',false); //主动触发sfCancel方法，'false'为向父组件传递的数据
            },
            confirm() {
                if(!window.navigator.onLine){
                    window.location.reload();
                    return false;
                }
                // console.log(this.radio)
                //清空进入之前轻度和重度按钮的样式
                let qWidth='';
                let zWidth='';
                //兼容火狐和Chrome
             if( $('.qindu').css('borderWidth')&& $('.zhongdu').css('borderWidth')){
               qWidth=$('.qindu').css('borderWidth').replace('px','');
               zWidth=$('.zhongdu').css('borderWidth').replace('px','')
                }else{
                qWidth=$('.qindu').css('border-left-width').replace('px','');
                zWidth=$('.zhongdu').css('border-left-width').replace('px','')
                } 
                  this.$emit('sfConfirm',qWidth,zWidth);
            },
            selectwg(a,b){
                if( $('.qindu').css('borderWidth')&& $('.zhongdu').css('borderWidth')){
                $('.qindu').css('borderWidth',a);
                $('.zhongdu').css('borderWidth',b)
                }else{
                $('.qindu').css('border-left-width',a).css('border-right-width',a).css('border-top-width',a).css('border-bottom-width',a);
                $('.zhongdu').css('border-left-width',b).css('border-right-width',b).css('border-top-width',b).css('border-bottom-width',b);
                } 
            },
            selectqdwg(){
                let a='6px';
                let b='1px'
                this.selectwg(a,b)
            },
            selectzdwg(){
                let a='1px';
                let b='6px'
                this.selectwg(a,b)
           },
        }
    }
</script>
<style scoped>
.cicle{
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #20a0ff;
    cursor: pointer;
    box-sizing: border-box;
    float: left;
    margin-left: 40px;
    margin-top: 8px;
}
</style>
