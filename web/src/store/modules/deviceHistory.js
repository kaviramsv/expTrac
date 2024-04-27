import axios from "axios";

const state = {
  deviceTelemetryHistory: [],
  deviceAnomalyHistory: [],
  isLoadingHistory: false,
};

const getters = {
  getDeviceTelemetryHistory(state) {
    return state.deviceTelemetryHistory;
  },
  getDeviceAnomalyHistory(state) {
    return state.deviceAnomalyHistory;
  },
  getLoadingHistory(state) {
    return state.isLoadingHistory;
  },
};
const actions = {
  async fetchDeviceHistory({ dispatch, commit, getters, rootGetters }, { date, deviceID, sensor }) {
    let url = process.env.VUE_APP_BACKEND_API + "deviceHistory";
    let body = {
      date,
      deviceID,
      sensor,
    };
    console.log("fetch history url :", url, body);
    try {
      commit("setLoadingHistory", true);
      const response = await axios.post(url, body);
      console.log("API response history :", response.data.data.history);
      commit("setDeviceHistory", response.data.data.history);
      commit("setLoadingHistory", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchAnomalyHistory(
    { dispatch, commit, getters, rootGetters },
    { date, deviceID, sensor }
  ) {
    let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/v2/anomaly/history";
    let body = {
      date,
      deviceID,
      sensor,
    };
    console.log("fetch anomaly history :", url, body);
    try {
      commit("setLoadingHistory", true);
      const response = await axios.post(url, body);
      console.log("API response anomaly history :", response.data.data.history);
      commit("setAnomalyHistory", response.data.data.history);
      commit("setLoadingHistory", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
};

const mutations = {
  setDeviceHistory(state, deviceTelemetryHistory) {
    state.deviceTelemetryHistory = deviceTelemetryHistory;
  },
  setAnomalyHistory(state, anomalyHistory) {
    state.deviceAnomalyHistory = anomalyHistory;
  },
  setLoadingHistory(state, bool) {
    state.isLoadingHistory = bool;
    console.log("in set", bool);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
