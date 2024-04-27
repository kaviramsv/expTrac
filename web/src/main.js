// import { createApp } from "vue";
// import "./style.css";
// import store from "./store/index.js";
// import axios from "axios";
// import VueAxios from "vue-axios";
// import App from "./App.vue";
// import router from "./router";

// import "bootstrap/dist/css/bootstrap.css";

// createApp(App).use(router).use(VueAxios, axios).use(store).mount("#app");
import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store/index.js";
import axios from "axios";
import VueAxios from "vue-axios";
import BootstrapVueNext from "bootstrap-vue-next";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "./assets/app.scss";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import VueApexCharts from "vue3-apexcharts";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const toastOptions = {
  transition: "Vue-Toastification__fade",
  maxToasts: 2,
  newestOnTop: true,
};
const alertOptions = {
  confirmButtonColor: "#41b882",
  cancelButtonColor: "#ff7674",
};

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    console.log("error,", error);
    //

    if (error.response.status === 401) {
      store.dispatch("logOut");
    }

    return Promise.reject(error);

    //  else {
    //   store.dispatch("logOut");
    // }
  }
);

// Add a request interceptor
axios.interceptors.request.use(
  async function (config) {
    console.log(store.state.auth.token);
    // config.headers = {
    //   Authorization: `Bearer ${store.state.auth.token}`,
    // };
    // console.log("config", config);
    config.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.state.auth.token}`,
    };
    config.withCredentials = true;
    console.log("config", config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// axios
//   .get("http://localhost:81/checklogin")
//   .then(() => {
//     console.log("isAuthenticated", "in main js");
//     store.commit("isAuthenticated", true);
//   })
//   .catch(() => store.commit("isAuthenticated", false))
//   .finally(() => {
createApp(App)
  .use(VueAxios, axios)
  .use(store)
  .use(router)
  .use(Toast, toastOptions)
  .use(VueSweetalert2, alertOptions)
  .use(VueApexCharts)
  .use(BootstrapVueNext)
  .component("VueDatePicker", VueDatePicker)
  .mount("#app");
