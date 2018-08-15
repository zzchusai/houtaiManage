import Vue from 'vue'
import store from '../common/js/sf.store.js';
Vue.directive('xlimit', {
    bind: function (el, binding ,vnode) {
        //vnode.context为当前Vue实例的this
        let bBoole = false;
        let limitCode = vnode.context.$store.getters.getSfLimits;
        limitCode.forEach(function(item,index){
            if(item == binding.value){
                el.style.display = 'black';
                bBoole = true;
            }
        });
        if(!bBoole){
            el.style.display = 'none';
        }
    }
});

Vue.directive('limitLines', {
    bind: function (el, binding ,vnode) {
        let linesHieght = parseFloat($(el).css('line-height')); 
        let divH = linesHieght *parseFloat(binding.value);
        let l =$(el);
        while ($(el).outerHeight() > divH) {    
            $(el).text($(el).text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));    
        };
    },
});