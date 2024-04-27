import { useToast } from "vue-toastification";
import axios from "axios";
const toast = useToast();
import router from "../../router";

const state = {
  thresholds: [],
  duplicateError: "",
  // showSuccess: false,
};

const getters = {
  getThresholds(state) {
    return state.thresholds;
  },
  getCountThresholds(state) {
    return state.thresholds.length;
  },
};
// appliedTo: {
//   devices: [
//     {
//       deviceName: "MCIX8M-EVKA",
//       location: "Ottawa",
//       type: "HVAC - 1",
//       os: "3.3",
//       fw: "2.3",
//       hw: "1.2.3",
//     },
//     {
//       deviceName: "MCIX8M-EVKE",
//       location: "Toronto",
//       type: "HVAC - 1",
//       os: "3.2",
//       fw: "2.5",
//       hw: "1.2.3",
//     },
//     {
//       deviceName: "MCIX8M-EVKF",
//       location: "Ottawa ",
//       type: "HVAC - 1",
//       os: "3.3",
//       fw: "2.4",
//       hw: "1.2.2",
//     },
//     {
//       deviceName: "MCIX8M-EVKB",
//       location: "Toronto",
//       type: "HVAC - 1",
//       os: "3.4",
//       fw: "2.3",
//       hw: "1.2.3",
//     },

//     {
//       deviceName: "MCIX8M-EVKA",
//       location: "Toronto",
//       type: "HVAC - 1",
//       os: "3.5",
//       fw: "2.5",
//       hw: "1.2.4",
//     },
//     {
//       deviceName: "MCIX8M-EVKE",
//       location: "Toronto",
//       type: "HVAC - 1",
//       os: "3.4",
//       fw: "2.6",
//       hw: "1.2.2",
//     },
//     {
//       deviceName: "MCIX8M-EVKF",
//       location: "Toronto",
//       type: "HVAC - 1",
//       os: "3.4",
//       fw: "2.3",
//       hw: "1.2.3",
//     },
//     {
//       deviceName: "MCIX8M-EVKB",
//       location: "Ottawa",
//       type: "HVAC - 1",
//       os: "3.4",
//       fw: "2.3",
//       hw: "1.2.5",
//     },
//   ],
//   deviceGroups: [
//     {
//       name: "Devices Toronto",

//       type: "HVAC - 1",
//     },

//     {
//       name: "HVAC 3 Devices",

//       type: "HVAC - 3",
//     },
//   ],
// },
// notify: {
//   users: [
//     { name: "Benson P", role: "Admin" },
//     { name: "Claire Tom", role: "USER - L2" },
//     { name: "Sam Jacob", role: "USER - L2" },
//     { name: "Ivan James", role: "USER - L2" },
//   ],
//   roles: [
//     { name: "ADMIN", description: "Applied to All admin Staff" },
//     { name: "User - L2", description: "Applied to All Grade 2 Employees" },
//   ],
// },
const actions = {
  async fetchThresholds({ dispatch, commit, getters, rootGetters }) {
    console.log("rg", typeof rootGetters.getOrgId);
    // let data4 = [
    //   {
    //     _id: "13223456655",
    //     name: "CPU Monitor",
    //     description: "values above 80",
    //     status: "Active",
    //     severity: "WARNING",
    //     trigger_parameter: "CPU",
    //     threshold: ["Between", 65, 75],
    //     sustain_time: [15, "minutes"],
    //     orgId: "63f52fb2032e0a4b2239e953",
    //   },

    //   {
    //     _id: "13223456123",
    //     name: "Network Out - Monitor",
    //     description: "Values higher than expected",
    //     status: "Inactive",
    //     severity: "WARNING",
    //     trigger_parameter: "Network Out",
    //     threshold: ["Between", 8500, 10000],
    //     sustain_time: [15, "minutes"],
    //     orgId: "63f52fb2032e0a4b2239e953",
    //   },
    //   {
    //     _id: "256756655",
    //     name: "Network In - Monitor",
    //     description: "Network In Values higher than expected",
    //     status: "Active",
    //     severity: "CRITICAL",
    //     trigger_parameter: "Network In",
    //     threshold: ["Above", 10000, 20000],
    //     sustain_time: [15, "minutes"],
    //     orgId: "63f52fb2032e0a4b2239e953",
    //   },
    //   {
    //     _id: "13124456655",
    //     name: "Memory Monitor",
    //     description: "Memory values higher than expected",
    //     status: "Active",
    //     severity: "INFO",
    //     trigger_parameter: "Memory",
    //     threshold: ["Between", 65, 75],
    //     sustain_time: [15, "minutes"],
    //     orgId: "63f52fb2032e0a4b2239e953",
    //   },
    // ];

    let url = process.env.VUE_APP_BACKEND_API + "threshold/byorg/" + rootGetters.getOrgId;
    console.log("get endpoint", url);

    try {
      const response = await axios.get(url);
      let data = response.data.data.thresholds;
      console.log("data thres", data);
      let newData = data.map((obj) => ({ ...obj, isEditing: false }));
      commit("setThresholds", newData);
    } catch (error) {
      console.error(error);
      commit("setThresholds", []);
      // commit("setDeviceError", "Failed to load device data");
    }
  },

  async updateThreshold({ dispatch, commit, getters, rootGetters }, threshold) {
    console.log("in threshold store", threshold);

    const thresholdObject = getters.getThresholds.find((th) => th._id === threshold.id);
    //grab the old object and append only if some
    let newObj = {
      ...thresholdObject,
      isEditing: false,
      ...(threshold.name && { name: threshold.name }),
      ...(threshold.description && { description: threshold.description }),
      ...(threshold.status && { status: threshold.status }),
      ...(threshold.severity && { severity: threshold.severity }),
      ...(threshold.sustain && { sustain: threshold.sustain }),
      ...(threshold.threshold && { threshold: threshold.threshold }),
    };
    console.log("newObj", newObj);
    const objIndex = getters.getThresholds.findIndex((th) => th._id === threshold.id);
    console.log("obj", objIndex);
    let copy = JSON.parse(JSON.stringify([...getters.getThresholds]));
    console.log("copy", copy);
    //replace item at sepcified index
    copy[objIndex] = newObj;

    let url = process.env.VUE_APP_BACKEND_API + "threshold" + "/" + threshold.id;
    console.log("threshold upd url:", url);
    const data = copy.find((th) => th._id === threshold.id);
    const prev = JSON.parse(
      JSON.stringify(getters.getThresholds.find((th) => th._id === threshold.id))
    );

    const calcSustain = (sustain) => {
      if (sustain[1] == "minutes") {
        return Number(sustain[0]) * 60;
      } else {
        return Number(sustain[0]);
      }
    };
    console.log(threshold.threshold, threshold.sustain, prev.threshold, prev.sustain);
    let commandToDevice = {};
    if (
      threshold.threshold &&
      threshold.threshold.toString() === prev.threshold.toString() &&
      threshold.sustain.toString() === prev.sustain.toString()
    ) {
      console.log("no need to send ");
    } else {
      // console.log("need to send");
      commandToDevice = {
        sent_timestamp: Date.now(),
        enable: data.status === "Active" ? "true" : "false",
        min: Number(data.threshold[1]),
        max: Number(data.threshold[2]),
        sustain_time: calcSustain(data.sustain),
      };
    }

    console.log("ctd", commandToDevice);

    let consolidatedData = { ...data, commandToDevice, actionBy: rootGetters.getUserId };
    //remove is editing
    const { isEditing, ...final } = consolidatedData;
    console.log("final Data", final);
    try {
      const response = await axios.put(url, final);
      console.log("FROM API", response.data);
      commit("setThresholds", copy);
      toast.success(`Successfully updated the monitor`, {
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
    } catch (error) {
      // commit("setDuplicateError", `Server Error!`);
      console.log("fw err:", error.response);
    }
  },
};

const mutations = {
  setThresholds(state, thresholds) {
    state.thresholds = thresholds;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
