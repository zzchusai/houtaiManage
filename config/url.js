var url = (function(){
	var mock = false;
	var prodEnv = require('./dev.env');
//	var url = process.env.API_ROOT;
	var url = 'http://192.168.199.100:8100';
	if(mock) {
	    
	}
	else{
		return {
		    MOCK: mock,
			/**精视传媒的url配置***/
			//初始化菜单
			web:url,//初始化菜单选项
		}
	}
})();

module.exports = url;