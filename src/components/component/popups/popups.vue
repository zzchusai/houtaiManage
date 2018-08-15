<!--弹出层对话框组件-->
<template>
    <div class="model">
        <div class="model-main">
            <div class="model-del">{{message}}</div>
            <div class="model-btn zoom">
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
                if(!window.navigator.onLine){
                    window.location.reload();
                    return false;
                }
                this.$emit('sfCancel',false); //主动触发sfCancel方法，'false'为向父组件传递的数据
            },
            confirm() {
                if(!window.navigator.onLine){
                    window.location.reload();
                    return false;
                }
                this.$emit('sfConfirm',false);
            },
        }
    }
</script>