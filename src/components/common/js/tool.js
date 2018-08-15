import Vue from 'vue';
String.prototype.isLimit = function(){
	// console.log(Vue.$store);
    let limits = window.localStorage.getItem("sfLimits");
    return limits.indexOf(this)>-1;

}
