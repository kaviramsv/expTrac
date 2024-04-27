import axios from "axios";
import { isProxy, toRaw } from "vue";
import router from "../../router";
const state = {
  // layoutMode: 'dark',
  anomalies: [],
  anomalyDetails: [], //single details for accordion
  timeline: [],
  selectedSeverity: [],
  selectedIssueStatus: [],
  selectedTriggerParameter: [],
  selectedDeviceType: [],
  selectedAssignedTo: [],
  searchInputValue: "",
  sortingParam: "",
  anomalyDeviceIDparams: [],
  anomalyDeviceNameparams: [],
  anomalyStatusparams: [],
  anomalySensorparams: [],
  isLoadingAnomalies: false,
};

const getters = {
  // getLayoutType: (state) => state.layoutType,
  // getIssues: (state) => state.anomalies,
  getAnomalies: (state) => state.anomalies,
  getTimeline: (state) => state.timeline,
  getAnomalyDetails: (state) => state.anomalyDetails,
  getSortingParam: (state) => state.sortingParam,
  getAnomalydeviceIDparams: (state) => state.anomalyDeviceIDparams,
  getAnomalydeviceNameparams: (state) => state.anomalyDeviceNameparams,
  getAnomalyStatusparams: (state) => state.anomalyStatusparams,
  getAnomalySensorparams: (state) => state.anomalySensorparams,
  getLoadingAnomalies: (state) => state.isLoadingAnomalies,

  includeIssueBySearch: (state) => (issue) => {
    const flatten = (input) => {
      if (typeof input === "object") {
        return (Array.isArray(input) ? input : Object.values(input)).reduce(
          (acc, x) => acc.concat(flatten(x)),
          []
        );
      } else {
        return [input];
      }
    };

    if (!state.searchInputValue) {
      return true;
    }
    let concatenatedFlattenedRecord = flatten(issue).join("");
    console.log("search", concatenatedFlattenedRecord);
    return concatenatedFlattenedRecord.toLowerCase().includes(state.searchInputValue.toLowerCase());
  },

  //composite filter

  getFilteredAnomalies: (state, getters) => {
    let filtered = [...state.anomalies];
    console.log("filtered", filtered, state.sortingParam);
    if (state.sortingParam == "name-a") {
      filtered = [...filtered].sort((a, b) => {
        const nameA = toRaw(a).deviceName; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
        const nameB = toRaw(b).deviceName;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      console.log("filtered", filtered);
    }
    //sort name -descending
    if (state.sortingParam == "name-d") {
      filtered = [...filtered].sort((a, b) => {
        const nameA = toRaw(a).deviceName; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
        const nameB = toRaw(b).deviceName;
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      });
      console.log("filtered", filtered);
    }
    if (state.sortingParam == "status-a") {
      filtered = [...filtered].sort((a, b) => {
        const statusA = toRaw(a).status; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
        const statusB = toRaw(b).status;
        if (statusA < statusB) {
          return -1;
        }
        if (statusA > statusB) {
          return 1;
        }
        return 0;
      });
      console.log("filtered", filtered);
    }
    //sort name -descending
    if (state.sortingParam == "status-d") {
      filtered = [...filtered].sort((a, b) => {
        const statusA = toRaw(a).status; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
        const statusB = toRaw(b).status;
        if (statusA < statusB) {
          return 1;
        }
        if (statusA > statusB) {
          return -1;
        }
        return 0;
      });
      console.log("filtered", filtered);
    }
    if (state.sortingParam == "anomaly-a") {
      filtered = [...filtered].sort((a, b) => {
        const anomalyA = Math.abs(toRaw(a).anomalies[0].percentage_difference); // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
        const anomalyB = Math.abs(toRaw(b).anomalies[0].percentage_difference);
        if (anomalyA < anomalyB) {
          return -1;
        }
        if (anomalyA > anomalyB) {
          return 1;
        }
        return 0;
      });
      console.log("filtered", filtered);
    }
    if (state.sortingParam == "anomaly-d") {
      filtered = [...filtered].sort((a, b) => {
        const anomalyA = Math.abs(toRaw(a).anomalies[0].percentage_difference); // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
        const anomalyB = Math.abs(toRaw(b).anomalies[0].percentage_difference);
        if (anomalyA < anomalyB) {
          return 1;
        }
        if (anomalyA > anomalyB) {
          return -1;
        }
        return 0;
      });
      console.log("filtered", filtered);
    }
    if (state.sortingParam == "timestamp-a") {
      filtered = [...filtered].sort((a, b) => {
        const timestampA = toRaw(a).timestamp; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
        const timestampB = toRaw(b).timestamp;
        console.log(timestampA, timestampB);
        if (timestampA < timestampB) {
          return -1;
        }
        if (timestampA > timestampB) {
          return 1;
        }
        return 0;
      });
      console.log("filtered", filtered);
    }
    if (state.sortingParam == "timestamp-d") {
      filtered = [...filtered].sort((a, b) => {
        const timestampA = toRaw(a).timestamp; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
        const timestampB = toRaw(b).timestamp;
        if (timestampA < timestampB) {
          return 1;
        }
        if (timestampA > timestampB) {
          return -1;
        }
        return 0;
      });
      console.log("filtered", filtered);
    }
    if (state.sortingParam == "reset") {
      filtered = [...filtered];
    }

    return filtered.filter((anomaly) => getters.includeIssueBySearch(anomaly));
  },
};

const actions = {
  // changeLayoutType({ commit }, { layoutType }) {
  //   commit('CHANGE_LAYOUT', layoutType);
  // },
  async fetchIssues({ dispatch, commit, getters, rootGetters }, params) {
    console.log("here in fetchIssues ", params);
    let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory";

    let bodyParams = {
      ...(params?.deviceIdList.length && { deviceID: params.deviceIdList }),
      ...(params?.statusList.length && { status: params.statusList }),
      ...(params?.date1 && { date1: params.date1 }),
      ...(params?.date2 && { date2: params.date2 }),
    };
    console.log("url", url, bodyParams);
    // if (rootGetters.getIsAuthenticated) {
    try {
      commit("setLoadingAnomalies", true);
      const response = await axios.post(url, bodyParams);
      console.log("anomaly list", response.data);
      commit("SET_ANOMALIES", response.data.data.telemetry);
      commit("setLoadingAnomalies", false);
    } catch (error) {
      console.error(error);
      //commit("SET_ISSUES_FOR_DATE", []);
      //console.error(error);
      // commit("setDeviceError", "Failed to load device data");
    }
    //}
  },

  async fetchFields({ dispatch, commit, getters, rootGetters }) {
    let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/fields";
    try {
      const response = await axios.get(url);

      console.log("fields", response.data.data);
      commit("SET_SELECTED_DEVICE_ID_PARAMS", response.data.data.deviceID);
      commit("SET_SELECTED_DEVICE_NAME_PARAMS", response.data.data.deviceName);
      commit("SET_SELECTED_STATUS_PARAMS", response.data.data.status);
      commit("SET_SELECTED_SENSOR_PARAMS", response.data.data.sensor);

      //console.log("inci thres", data);
    } catch (error) {
      //commit("SET_ISSUES", []);
      console.error(error);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async changeStatus(
    { dispatch, commit, getters, rootGetters },
    { anomalyId, name, description, formId }
  ) {
    console.log("anomaly.js", anomalyId, name, description);
    let status = {
      statusName: name,
      statusDescription: description,
      timestamp: Date.now(),
      changedBy: "63f53014032e0a4b2239e956",
    };
    let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/" + anomalyId;
    // let url = "http://localhost:81/api/anomalyHistory/" + anomalyId;
    console.log("url", url);
    try {
      const response = await axios.put(url, status);

      console.log("fields", response);
      document.getElementById(formId).click();
      //find obj to be replaced
      const newObjRef = [...getters.getAnomalies].find((anomaly) => anomaly._id === anomalyId);
      //copy of obj to be replaced
      const newObj = structuredClone(newObjRef);
      //modify obj to be replaced
      newObj.status = name;
      console.log("obj to be replaced", newObj);
      const anomaliesRef = structuredClone(getters.getAnomalies);
      console.log(anomaliesRef);
      const newAnomalies = anomaliesRef.map((anomaly) =>
        anomaly._id === anomalyId ? newObj : anomaly
      );
      console.log("new anomalies", newAnomalies);
      commit("SET_ANOMALIES", newAnomalies);
    } catch (error) {
      //commit("SET_ISSUES", []);
      console.error(error);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchStatusTimeline({ dispatch, commit, getters, rootGetters }, anomalyId) {
    console.log("here issue.js", anomalyId);
    let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/statusTimeline/" + anomalyId;
    // let url = process.env.VUE_APP_BACKEND_API + "incident/byorg/" + rootGetters.getOrgId;
    // let url = "http://localhost:81/api/anomalyHistory/statusTimeline/" + anomalyId;
    console.log("url", url);

    try {
      const response = await axios.get(url);

      console.log("TIMELINE", response.data.data);
      commit("SET_TIMELINE", response.data.data);

      //console.log("inci thres", data);
    } catch (error) {
      console.error(error);
    }
  },

  async fetchAnomaly({ dispatch, commit, getters, rootGetters }, anomalyId) {
    console.log("here issue.js", anomalyId);

    let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/anomaly/" + anomalyId;
    // let url = "http://localhost:81/api/anomalyHistory/anomaly/" + anomalyId;
    console.log("url", url);

    try {
      const response = await axios.get(url);

      console.log("anomaly details", response.data.data);
      commit("SET_ANOMALY_DETAILS", response.data.data);

      //console.log("inci thres", data);
    } catch (error) {
      //commit("SET_ISSUES", []);
      console.error(error);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  // commit("SET_ISSUES", data);
};
// anomalyDeviceIDparams: [],
//   anomalyDeviceNameparams: [],
//   anomalyStatusparams: [],
//   anomalySensorparams: [],
const mutations = {
  SET_ANOMALY_DETAILS(state, data) {
    state.anomalyDetails = data;
  },
  SET_TIMELINE(state, data) {
    state.timeline = data;
  },
  SET_ANOMALIES(state, anomalies) {
    state.anomalies = anomalies;
  },
  //fields-api-for filters
  SET_SELECTED_DEVICE_NAME_PARAMS(state, anomalyDeviceNameparams) {
    state.anomalyDeviceNameparams = anomalyDeviceNameparams;
  },
  SET_SELECTED_STATUS_PARAMS(state, anomalyStatusparams) {
    state.anomalyStatusparams = anomalyStatusparams;
  },
  SET_SELECTED_DEVICE_ID_PARAMS(state, anomalyDeviceIDparams) {
    state.anomalyDeviceIDparams = anomalyDeviceIDparams;
  },
  SET_SELECTED_SENSOR_PARAMS(state, anomalySensorparams) {
    state.anomalySensorparams = anomalySensorparams;
  },
  //search input
  SET_INPUT_VALUE(state, searchInput) {
    console.log("search Input", searchInput);
    state.searchInputValue = searchInput;
  },

  SET_SORTING_PARAM(state, param) {
    state.sortingParam = param;
    console.log("sorting Param", state.sortingParam);
  },

  setLoadingAnomalies(state, bool) {
    state.isLoadingAnomalies = bool;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
// SET_SELECTED_DEVICES(state, selectedDevices) {
//   state.selectedDevices = selectedDevices;
//   console.log("selected devices", state.selectedDevices);
// },
// SET_SELECTED_SENSOR(state, selectedSensor) {
//   state.selectedSensor = selectedSensor;
//   console.log("selected sensors", state.selectedSensor);
// },
// SET_SELECTED_STATUS(state, selectedStatus) {
//   state.selectedStatus = selectedStatus;
//   console.log("selected status", state.selectedStatus);
// },
// SET_SELECTED_DATE_RANGE(state, selectedDateRange) {
//   state.selectedDateRange = selectedDateRange;
//   console.log("selected date", state.selectedDateRange);
// },
