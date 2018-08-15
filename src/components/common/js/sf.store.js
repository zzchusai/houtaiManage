import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default  new Vuex.Store({
    // 定义状态
    state: {
        sfLimits: [],//权限状态
    },
    getters:{
        getSfLimits(state){
             //先从state里面获取用权限
             let sfLimits = state.sfLimits;
             //如果 state 里面获取不到，那么从localStorage里面获取 解决页面刷新时 vuex 会重置状态
            if(sfLimits.length<=0){

                sfLimits = JSON.parse( window.localStorage.getItem('sfLimits') || null);
            }
            return sfLimits;

        }
    },

    mutations: {
        sfIncrement (state,oLimits) {
            // 变更权限状态
            state.sfLimits = oLimits;
            //解决页面刷新时 vuex 会重置状态
            window.localStorage.setItem("sfLimits", JSON.stringify(oLimits));
        }
    }
})
