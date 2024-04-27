import router from "../../router";
import axios from "axios";
//1. should auth module be name spaced??
import { useToast } from "vue-toastification";

const toast = useToast();
const state = {
  userName: "",
  isAuthenticated: false,
  isInitialPasswordReset: false,
  token: "",
  //role details
  roleId: 0,
  roleName: "",
  isRoleLocked: false,
  permissions: [],
  //org details
  orgId: 0,
  orgName: "",
  isOrgLocked: false,
  isOrgActive: false,
  //userId
  userId: 0,
  isUserActive: false,
  //2. isUserLocked: false,//??
  authError: "",
};

const getters = {
  getUserName(state) {
    return state.userName;
  },
  getToken(state) {
    return state.token;
  },
  getIsAuthenticated(state) {
    return state.isAuthenticated;
  },
  getInitialPasswordReset(state) {
    return state.isInitialPasswordReset;
  },
  getPermissions(state) {
    return state.permissions;
  },
  hasPermission(state) {
    return (allowedPermissions) => {
      return state.permissions.some((p) => allowedPermissions.includes(p)); // return true/false  based on component permission passed in
    };
  },
  getRoleId(state) {
    return state.roleId;
  },
  getRoleName(state) {
    return state.roleName;
  },
  getIsRoleLocked(state) {
    return state.isRoleLocked;
  },
 
  //org details
  getOrgId(state) {
    return state.orgId;
  },
  getOrgName(state) {
    return state.orgName;
  },
  getIsOrgLocked(state) {
    return state.isOrgLocked;
  },
  getIsOrgActive(state) {
    return state.isOrgLocked;
  },
  //userId
  getUserId(state) {
    return state.userId;
  },
  getAuthError(state) {
    return state.authError;
  },
  getIsUserActive(state) {
    return state.isUserActive;
  },
};
// console.log("auth:", credentials);
// commit("isAuthenticated", true);
// commit("setUserName", "temp");
// router.push("/resetPassword");
const actions = {
  async logIn({ commit, rootState }, credentials) {
    console.log("auth:", credentials);
    const data = {
      username: credentials.userName.trim(),
      password: credentials.password.trim(),
    };
    let url = "http://localhost:3500/api/" + "auth/login";
    try {
      const response = await axios.post(url, data);
      console.log("auth:", response.data.data);
      if (response.data.success) {
        commit("isAuthenticated", true);
        commit("setUserName", credentials.userName);
        commit("setToken", response.data.data.token);
        commit("setUserId", response.data.data.userId);

        //if true=first time
        if (response.data.data.isLoggingInFirstTime === true) {
          console.log("first time");
          commit("isInitialPasswordReset", false);
          //pw reset set to false to indicate it is still in process and shud
          //continue to stay in this page till true(when set in reset pwd mandatory page)
          router.push("/resetPasswordFirstTime");
        }
        if (response.data.data.isLoggingInFirstTime === false) {
          console.log("not first time");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error(error);
      commit("setAuthError", error.response.data.message);

      router.push("/");
    }
  },
  async logOut({ commit }) {
    console.log("in log outr");
    commit("isAuthenticated", false);
    commit("setUserId", "");
    commit("setUserName", "");
    commit("setAuthError", "");
    commit("setToken", "");
    router.push({ name: "Login" });
  },
  async reset({ dispatch, commit, getters, rootGetters }, credentials) {
    console.log("credentials", credentials);
    //call backend--store new password
    //once success
    let data = {
      username: getters.getUserName,
      oldPassword: credentials.oldPassword.trim(),
      newPassword: credentials.newPassword.trim(),
    };
    let url = process.env.VUE_APP_BACKEND_API + "auth/resetPassword";
    try {
      const response = await axios.put(url, data);
      console.log("auth:", response.data.data);
      if (response.data.success) {
        if (credentials.isFirstTime) {
          commit("isInitialPasswordReset", true);
        }
        toast.success("Password update Successful", {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: "fa fa-check",
          rtl: false,
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      //?what shud happen in error case
      //?toast
      //commit("setAuthError", error.response.data.message);
      toast.error(error.response.data.message, {
        position: "top-right",
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: "fa fa-check",
        rtl: false,
      });
    }
  },
  async refresh({ commit }, token) {
    commit("updateToken", token);
    commit("isAuthenticated", false);
  },
};
const mutations = {
  setUserName(state, value) {
    state.userName = value;
  },
  isAuthenticated(state, value) {
    state.isAuthenticated = value;
  },
  isInitialPasswordReset(state, value) {
    state.isInitialPasswordReset = value;
  },
  //USER
  setUserId(state, value) {
    state.userId = value;
  },

  setAuthError(state, value) {
    state.authError = value;
  },
  setToken(state, token) {
    state.token = token;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
//5. any best practises to be followed?naming conventions
//6.error handling best practises??
