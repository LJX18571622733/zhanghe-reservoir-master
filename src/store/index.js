import Vue from "vue";
import Vuex from "vuex";

import river from "./modules/index";
import sys from "./modules/sys";
import menu from "./modules/menu";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    river,
    sys,
    menu
  },
  getters
});

export default store;
