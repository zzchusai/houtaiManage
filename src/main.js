import Vue from "vue";
import App from "./App";
import router from "./router";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-default/index.css"; // 默认主题
import "babel-polyfill";
//import api from '../config/api.js';
//import url from '../config/url.js';
import VueQuillEditor from "vue-quill-editor";
import Quill from "quill";
import vueResource from "vue-resource";
import store from "./components/common/js/sf.store.js";
import base from "./components/common/js/base.js";
import macro from "./components/common/js/macro.js";
import tool from "./components/common/js/tool.js";
//加载自定义权限指令
require("./components/directive/v-xlimit.js");
import jxUI from "./components/component/index.js";
//加载VUE拖拽组件
import VueDND from "awe-dnd";
Vue.use(base);
Vue.prototype.macro = macro;
Vue.use(VueDND);
Vue.use(jxUI);
console.log(jxUI);
console.log(ElementUI);
var $http = axios.create({});
//Vue.prototype.$api = api;
Vue.prototype.$http = $http;
Vue.prototype.HOST = "/web";
//Vue.prototype.url = url;

Date.prototype.format = function(format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return format;
};

Vue.use(ElementUI);
Vue.use(VueQuillEditor); 
Vue.use(vueResource);
Vue.prototype.$axios = axios;
Vue.http.interceptors.push((request, next) => {
  var access_token;
  if (window.localStorage.access_token) {
    access_token = JSON.parse(localStorage.getItem("access_token"));
    request.headers.set("AccessToken", access_token);
  }
  //setting request.headers
  next(response => {
    return response;
  });
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
