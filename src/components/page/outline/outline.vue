
<template>
	<div class="outline main">
    <!-- 断网跳转页面 -->
		<div class="found"></div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
               timer:''
			}
		},
		mounted() {
			if(window.navigator.onLine){
				if(window.location.reload){
				   window.history.go(-1);
				}
			}else{
				self.timer=null;
			}
		},
		methods:{

		}
	}
</script>

<style scoped>
</style>