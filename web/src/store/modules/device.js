import axios from "axios";

const state = {
  devices: [],
  deviceDetails: [],
  anomaliesDay: [],
  anomaliesSensor: [],
  deviceTelemetry: [],
  isLoadingDevices: false,
  isLoadingDashboard: false,
  isLoadingTelemetry: false,
  deviceSensors: [],
};

const getters = {
  getDevices(state) {
    return state.devices;
  },
  getDeviceDetails(state) {
    return state.deviceDetails;
  },
  getAnomaliesPerDay(state) {
    return state.anomaliesDay;
  },
  getAnomaliesPerSensor(state) {
    return state.anomaliesSensor;
  },
  getCountDevices(state) {
    return state.devices.length;
  },
  getDeviceTelemetry(state) {
    return state.deviceTelemetry;
  },
  getLoadingDevices(state) {
    return state.isLoadingDevices;
  },
  getLoadingDashboard(state) {
    return state.isLoadingDashboard;
  },
  getLoadingTelemetry(state) {
    return state.isLoadingTelemetry;
  },
  getDeviceSensorFields(state) {
    return state.deviceSensors;
  },
};
const actions = {
  async fetchDevices({ dispatch, commit, getters, rootGetters }) {
    //console.log("rg", typeof rootGetters.getOrgId);
    let url = process.env.VUE_APP_BACKEND_API + "device";

    try {
      commit("setLoadingDevices", true);
      const response = await axios.get(url);
      console.log("API response devices :", response.data.data);
      commit("SET_DEVICES", response.data.data);
      commit("setLoadingDevices", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchDevice({ dispatch, commit, getters, rootGetters }, deviceID) {
    //console.log("rg", typeof rootGetters.getOrgId);
    let url = process.env.VUE_APP_BACKEND_API + "device/" + deviceID;

    try {
      const response = await axios.get(url);
      console.log("API response device:", response.data.data);
      commit("SET_DEVICE_DETAILS", response.data.data);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchAnomaliesPerDay(
    { dispatch, commit, getters, rootGetters },
    { deviceID, month, year }
  ) {
    //console.log("rg", typeof rootGetters.getOrgId);

    let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/v2/anomaly/day";
    let bodyParams = { deviceID, month, year };
    console.log("body params", url, bodyParams);
    try {
      commit("setLoadingDashboard", true);
      const response = await axios.post(url, bodyParams);
      console.log("anomalies perday:", response.data.data);
      commit("SET_ANOMALIES_PER_DAY", response.data.data);
      commit("setLoadingDashboard", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchAnomaliesPerSensor(
    { dispatch, commit, getters, rootGetters },
    { deviceID, month, year }
  ) {
    //console.log("rg", typeof rootGetters.getOrgId);
    let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/v2/anomaly/sensor";
    let bodyParams = { deviceID, month, year };
    try {
      commit("setLoadingDashboard", true);
      const response = await axios.post(url, bodyParams);
      console.log("anomalies per SENSOR:", response.data.data);
      commit("SET_ANOMALIES_PER_SENSOR", response.data.data);
      commit("setLoadingDashboard", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchDeviceTelemetry({ dispatch, commit, getters, rootGetters }, deviceID) {
    let url = process.env.VUE_APP_BACKEND_API + "device/telemetry/" + deviceID;
    console.log("deviceID", deviceID, url);
    try {
      commit("setLoadingTelemetry", true);
      const response = await axios.get(url);
      console.log("API response device:", response.data.data);
      commit("SET_DEVICE_TELEMETRY", response.data.data);
      commit("setLoadingTelemetry", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchDeviceSensors({ dispatch, commit, getters, rootGetters }, deviceID) {
    let url = process.env.VUE_APP_BACKEND_API + "device/sensors/" + deviceID;
    console.log("deviceID", deviceID, url);
    try {
      const response = await axios.get(url);
      console.log("API response device:", response.data.data.sensor);
      commit("SET_DEVICE_SENSORS", response.data.data.sensor);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
};

const mutations = {
  SET_DEVICE_TELEMETRY(state, data) {
    state.deviceTelemetry = data;
  },
  SET_DEVICES(state, devices) {
    state.devices = devices;
  },
  SET_DEVICE_SENSORS(state, sensors) {
    state.deviceSensors = sensors;
  },
  SET_DEVICE_DETAILS(state, data) {
    state.deviceDetails = data;
  },
  SET_ANOMALIES_PER_DAY(state, data) {
    state.anomaliesDay = data;
  },
  SET_ANOMALIES_PER_SENSOR(state, data) {
    state.anomaliesSensor = data;
  },
  setLoadingDevices(state, bool) {
    state.isLoadingDevices = bool;
  },
  setLoadingDashboard(state, bool) {
    state.isLoadingDashboard = bool;
  },
  setLoadingTelemetry(state, bool) {
    state.isLoadingTelemetry = bool;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
