<template>
    <div class="wrapper" @click="popup">
        <v-head></v-head>
        <div class="content">
        	<v-sidebar></v-sidebar>
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
	import Vue from 'vue';
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        },
        created() {
       	
        },
        methods: {
        	popup() {
        		if($('.popup').css('display') == 'block'){
        			$('.popup').hide();
        		}
        	}
        }
    }
</script>
<style type="text/css">
	.el-submenu__title{
		text-align: left !important;
		padding-left: 10px;
	}
	.erjiMenu>.el-submenu>.el-submenu__title{
		padding-left: 40px !important;
	}
	.el-submenu__title,.el-menu-item{
		height: 44px;
		line-height: 44px;
		color: #fff;
	}
	.el-submenu__title{padding-left:13%!important;}
	.el-submenu__title:hover{background: #c19c75!important;}
	.el-submenu__title i:last-child{display: none;}
	.el-submenu .el-menu-item {
	    height: 42px;
	    line-height: 42px;
	    padding: 0 45px;
	    background: #2D3F51;
	}
	.content{background: #4A5065;overflow: hidden;position: relative;}
	.el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active{background: #c19c75!important;}
	@media only screen and (max-width: 1920px){
		#sidebar .menuStyleOne .el-submenu__title{font-size: 18px;}
	}
	@media only screen and (max-width: 1600px){
		#sidebar .menuStyleOne .el-submenu__title{font-size: 16px;}
	}
	@media only screen and (max-width: 1400px){
		#sidebar .menuStyleOne .el-submenu__title{font-size: 14px;}
	}
	@media only screen and (max-width: 1200px){
		#sidebar .menuStyleOne .el-submenu__title{font-size: 14px;}
	}
	@media only screen and (max-width: 1150px){
		#sidebar .menuStyleOne .el-submenu__title{font-size: 14px;}
	}
		@media only screen and (max-width: 900px){
		#sidebar .menuStyleOne .el-submenu__title{font-size: 14px;}
	}
</style>
