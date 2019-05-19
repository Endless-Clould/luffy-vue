import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  // 数据仓库,类似vue里面的data
  state: {
    cart: {
      count: 0,
    }
  },
  // 数据操作方法,类似vue里面的methods
  mutations: {
    addcart(state, data) {
      // 修改商品课程的总数
      state.cart.count = data.count;
      // state.cart.course_list = data.course_list;
    }
  }
});
