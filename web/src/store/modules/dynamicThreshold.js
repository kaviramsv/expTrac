import axios from "axios";

const state = {
	threshold: [],
};

const getters = {
	getThreshold(state) {
		return state.threshold;
	},
};
const actions = {
	async fetchDynamicThreshold({ dispatch, commit, getters, rootGetters }, { deviceID }) {
		//console.log("rg", typeof rootGetters.getOrgId);

		let url = process.env.VUE_APP_BACKEND_API + "dynamicThreshold";
		let bodyParams = { deviceID };
		console.log("body params", url, bodyParams);
		try {
			//   commit("setLoadingDashboard", true);
			const response = await axios.post(url, bodyParams);
			console.log("THRESHOLD", response.data.data.thresholdHistory);
			commit("SET_THRESHOLD", response.data.data.thresholdHistory);
			// //   commit("setLoadingDashboard", false);
		} catch (error) {
			console.error(error.response.data);
			// commit("setDeviceError", "Failed to load device data");
		}
	},
};

const mutations = {
	SET_THRESHOLD(state, data) {
		state.threshold = data;
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
