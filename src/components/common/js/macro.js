var config = require('../../../../config');

console.log(process.env.NODE_ENV);

// let  sf_logo_icon = "";
// if (process.env.NODE_ENV === 'development') {
	//线上
	// const sf_logo_icon = "http://admin.sfys365.com:8100/img/share.png";
    //测试
   const sf_logo_icon = "http://testadmin.sfys365.xyz:8100/img/share.png";

module.exports = {
	sf_logo_icon:sf_logo_icon

}
