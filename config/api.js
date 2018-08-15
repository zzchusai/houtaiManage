//import api from './config/api';
//Vue.prototype.$api = api;

// 配置API接口地址
var root = process.env.API_ROOT;
// 引用superagent
var request = require('superagent');
// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filter_null(o) {
  for (var key in o) {
    if (o[key] == null) {
      delete o[key]
    }
    if (toType(o[key]) == 'string') {
      o[key] = o[key].trim()
      if (o[key].length == 0) {
        delete o[key]
      }
    }
  }
  return o
}
/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  https://cnodejs.org/api/v1 的接口，如果是其他接口
  需要根据接口的参数进行调整。参考说明文档地址：
  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
*/
function _api_base(method, url, params, success, failure ,ismock,form, upload) {
  if(!!upload){
    var r = request(method, url);
  }
  else if(ismock){
    var r = request('get', url);
  }
  else{
    var r = request(method, url).type('application/json;charset=utf-8');
  }
//var token = localStorage.getItem('token');
////console.log(token);
//if(!!token){
//  r.set('token',token);
//}
//else{
//  if(location.href.indexOf('login') == -1){
//    //this.$message('token失效，请重新登录');
//    location.href='./';
//    return;
//  }
//}
  if(!!form){
    r.type('form');
  }
  /*if(method === 'GET'){
    r.responseType('arraybuffer');
  }*/
  if (params) {
    //params = filter_null(params);
    if (method === 'POST' || method === 'PUT') {
      if (toType(params) == 'object') {
        params = JSON.stringify(params);
      }
      r = r.send(params)
    } else if (method == 'GET' || method === 'DELETE') {
      r = r.query(params);
    }
  }
  r.end(function(err, res) {
    if (err) {
    	
      //alert('api error, HTTP CODE: ' + res.status);
//    if(res.status == 401){
//      //this.$message('token失效，请重新登录');
////      location.href='./';
//      return;
//    } 
//    else{
//      //this.$message('error'+res.status+'错误');
//    }
    }else{
      if(method === 'POST'){
        if (JSON.parse(res.text).success == true) {
          success(JSON.parse(res.text));
        }
        else{
          failure(JSON.parse(res.text));
        }       
      }
    	else{
        if(res.status == 200){
          if (JSON.parse(res.text).success == true) {
            success(JSON.parse(res.text));
          }
          else{
            failure(JSON.parse(res.text));
          }
        }
        else if(res.status == 401){
          //this.$message('token失效，请重新登录');
//        location.href='./';
          return;
        }
        /*if (JSON.parse(res.text).code == 'ACK') {
          success(JSON.parse(res.text));
        }
        else{
          failure(JSON.parse(res.text));
        }*/
        //return success(JSON.parse(res.text));
      }
    };
    /*if (res.code == 'ACK') {
      if (success) {
        //success(res.body);
        success(res);
        // console.log(res);
      }
    } else {
      if (failure) {
        failure(res.code);
      } else {
        alert('error: ' + JSON.stringify(res.code));
      }
    }*/
  });
};
// 返回在vue模板中的调用接口
export default {
  get: function(url, params, success, failure,ismock, form,upload) {
    return _api_base('GET',  url, params, success, failure,ismock,form,upload)
  },
  post: function(url, params, success, failure,ismock, form,upload) {
    return _api_base('POST',  url, params, success, failure,ismock,form,upload)
  },
  put: function(url, params, success, failure,ismock, form,upload) {
    return _api_base('PUT',  url, params, success, failure,ismock,form,upload)
  },
  delete: function(url, params, success, failure,ismock, form,upload) {
    return _api_base('DELETE',  url, params, success, failure,ismock,form,upload)
  },
  /*get: function(url, params, success, failure, form) {
    return _api_base('GET', root + '/' + url, params, success, failure,form)
  },*/
}