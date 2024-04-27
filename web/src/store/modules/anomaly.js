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
	//FILTER BOX FIELDS from backend
	anomalyDeviceIDFields: [],
	anomalyDeviceNameFields: [],
	anomalyStatusFields: [],
	anomalySensorFields: [],
	//LOADING INDICATOR FOR AXIOS - FETCH ANOMALIES
	isLoadingAnomalies: false,
	//SELECTED FILTERS from UI
	selectedDeviceId: [],
	selectedDeviceName: [],
	selectedSensorName: [],
	selectedStatus: [],
	selectedDateFrom: "",
	selectedDateTo: "",
	notified: [],
	pager: {},
	page: "",
};

const getters = {
	getPage: (state) => state.page,
	getPager: (state) => state.pager,
	getNotified: (state) => state.notified,
	getAnomalies: (state) => state.anomalies,
	getTimeline: (state) => state.timeline,
	getAnomalyDetails: (state) => state.anomalyDetails,
	getSortingParam: (state) => state.sortingParam,
	//FILTER BOX FIELDS
	getAnomalydeviceIDFields: (state) => state.anomalyDeviceIDFields,
	getAnomalydeviceNameFields: (state) => state.anomalyDeviceNameFields,
	getAnomalyStatusFields: (state) => state.anomalyStatusFields,
	getAnomalySensorFields: (state) => state.anomalySensorFields,
	getLoadingAnomalies: (state) => state.isLoadingAnomalies,
	//SELECTED filter fields from Ui
	getSelectedDeviceId: (state) => state.selectedDeviceId,
	getSelectedDeviceName: (state) => state.selectedDeviceName,
	getSelectedSensorName: (state) => state.selectedSensorName,
	getSelectedStatus: (state) => state.selectedStatus,
	getSelectedDateFrom: (state) => state.selectedDateFrom,
	getSelectedDateTo: (state) => state.selectedDateTo,
	includeIssueBySearch: (state) => (anomaly) => {
		const flatten = (input) => {
			// console.log("anomaly", input);
			if (typeof input === "object") {
				return (Array.isArray(input) ? input : Object.values(input || "")).reduce(
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
		let concatenatedFlattenedRecord = flatten(anomaly).join("");
		console.log("search", concatenatedFlattenedRecord);
		return concatenatedFlattenedRecord
			.toLowerCase()
			.includes(state.searchInputValue.toLowerCase());
	},

	//composite filter

	getFilteredAnomalies: (state, getters) => {
		let filtered = [...state.anomalies];
		// console.log("filtered", filtered, state.sortingParam);
		// if (state.sortingParam == "name-a") {
		// 	filtered = [...filtered].sort((a, b) => {
		// 		const nameA = toRaw(a).deviceName; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
		// 		const nameB = toRaw(b).deviceName;
		// 		if (nameA < nameB) {
		// 			return -1;
		// 		}
		// 		if (nameA > nameB) {
		// 			return 1;
		// 		}
		// 		return 0;
		// 	});
		// 	// console.log("filtered", filtered);
		// }
		// //sort name -descending
		// if (state.sortingParam == "name-d") {
		// 	filtered = [...filtered].sort((a, b) => {
		// 		const nameA = toRaw(a).deviceName; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
		// 		const nameB = toRaw(b).deviceName;
		// 		if (nameA < nameB) {
		// 			return 1;
		// 		}
		// 		if (nameA > nameB) {
		// 			return -1;
		// 		}
		// 		return 0;
		// 	});
		// 	//console.log("filtered", filtered);
		// }
		// if (state.sortingParam == "status-a") {
		// 	filtered = [...filtered].sort((a, b) => {
		// 		const statusA = toRaw(a).status; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
		// 		const statusB = toRaw(b).status;
		// 		if (statusA < statusB) {
		// 			return -1;
		// 		}
		// 		if (statusA > statusB) {
		// 			return 1;
		// 		}
		// 		return 0;
		// 	});
		// 	//console.log("filtered", filtered);
		// }
		// //sort name -descending
		// if (state.sortingParam == "status-d") {
		// 	filtered = [...filtered].sort((a, b) => {
		// 		const statusA = toRaw(a).status; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
		// 		const statusB = toRaw(b).status;
		// 		if (statusA < statusB) {
		// 			return 1;
		// 		}
		// 		if (statusA > statusB) {
		// 			return -1;
		// 		}
		// 		return 0;
		// 	});
		// 	//console.log("filtered", filtered);
		// }
		// if (state.sortingParam == "anomaly-a") {
		// 	filtered = [...filtered].sort((a, b) => {
		// 		const anomalyA = Math.abs(toRaw(a).percentage_difference); // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
		// 		const anomalyB = Math.abs(toRaw(b).percentage_difference);
		// 		if (anomalyA < anomalyB) {
		// 			return -1;
		// 		}
		// 		if (anomalyA > anomalyB) {
		// 			return 1;
		// 		}
		// 		return 0;
		// 	});
		// 	//console.log("filtered", filtered);
		// }
		// if (state.sortingParam == "anomaly-d") {
		// 	filtered = [...filtered].sort((a, b) => {
		// 		const anomalyA = Math.abs(toRaw(a).percentage_difference); // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
		// 		const anomalyB = Math.abs(toRaw(b).percentage_difference);
		// 		if (anomalyA < anomalyB) {
		// 			return 1;
		// 		}
		// 		if (anomalyA > anomalyB) {
		// 			return -1;
		// 		}
		// 		return 0;
		// 	});
		// 	//console.log("filtered", filtered);
		// }
		// if (state.sortingParam == "timestamp-a") {
		// 	filtered = [...filtered].sort((a, b) => {
		// 		const timestampA = toRaw(a).timestamp; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
		// 		const timestampB = toRaw(b).timestamp;
		// 		//console.log(timestampA, timestampB);
		// 		if (timestampA < timestampB) {
		// 			return -1;
		// 		}
		// 		if (timestampA > timestampB) {
		// 			return 1;
		// 		}
		// 		return 0;
		// 	});
		// 	//console.log("filtered", filtered);
		// }
		// if (state.sortingParam == "timestamp-d") {
		// 	filtered = [...filtered].sort((a, b) => {
		// 		const timestampA = toRaw(a).timestamp; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
		// 		const timestampB = toRaw(b).timestamp;
		// 		if (timestampA < timestampB) {
		// 			return 1;
		// 		}
		// 		if (timestampA > timestampB) {
		// 			return -1;
		// 		}
		// 		return 0;
		// 	});
		// 	//console.log("filtered", filtered);
		// }

		return filtered.filter((anomaly) => getters.includeIssueBySearch(anomaly));
	},
};

const actions = {
	async fetchAnomalies({ dispatch, commit, getters, rootGetters }) {
		let url = process.env.VUE_APP_BACKEND_API + "expense?page=" + getters.getPage;

		// let bodyParams1 = {
		//   ...(params?.deviceIdList.length && { deviceID: params.deviceIdList }),
		//   ...(params?.deviceNameList.length && { deviceName: params.deviceNameList }),
		//   ...(params?.sensorList.length && { sensorName: params.sensorList }),
		//   ...(params?.statusList.length && { status: params.statusList }),
		//   ...(params?.date1 && { date1: params.date1 }),
		//   ...(params?.date2 && { date2: params.date2 }),
		// };
		let bodyParams = {
			...(getters?.getSelectedDeviceId?.length && { deviceID: getters?.getSelectedDeviceId }),
			...(getters?.getSelectedDeviceName?.length && {
				deviceName: getters?.getSelectedDeviceName,
			}),
			...(getters?.getSelectedSensorName?.length && {
				sensorName: getters?.getSelectedSensorName,
			}),
			...(getters?.getSelectedStatus?.length && { status: getters?.getSelectedStatus }),
			...(getters?.getSelectedDateFrom && { date1: getters?.getSelectedDateFrom }),
			...(getters?.getSelectedDateTo && { date2: getters?.getSelectedDateTo }),
			...(getters?.getSortingParam && { sort: getters?.getSortingParam }),
		};
		console.log("url", url, bodyParams);
		// if (rootGetters.getIsAuthenticated) {
		try {
			commit("setLoadingAnomalies", true);
			const response = await axios.post(url, bodyParams);
			console.log("anomaly list", response.data);
			commit("SET_ANOMALIES", response.data.data.telemetry);
			commit("SET_PAGER", response.data.data.pager);
			commit("setLoadingAnomalies", false);
		} catch (error) {
			console.error(error);
			//commit("SET_ISSUES_FOR_DATE", []);

			// commit("setDeviceError", "Failed to load device data");
		}
		//}
	},

	async fetchFields({ dispatch, commit, getters, rootGetters }) {
		let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/v2/fields";
		try {
			const response = await axios.get(url);
			commit("setLoadingAnomalies", true);
			//console.log("fields", response.data.data);
			commit("SET_DEVICE_ID_FIELDS", response.data.data.deviceID);
			commit("SET_DEVICE_NAME_FIELDS", response.data.data.deviceName);
			commit("SET_STATUS_FIELDS", response.data.data.status);
			commit("SET_SENSOR_FIELDS", response.data.data.sensor);
			commit("setLoadingAnomalies", false);
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
		//console.log("anomaly.js", anomalyId, name, description);
		let status = {
			statusName: name,
			statusDescription: description,
			timestamp: Date.now(),
			changedBy: rootGetters.getUserId,
		};
		let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/v2/" + anomalyId;
		// let url = "http://localhost:81/api/anomalyHistory/" + anomalyId;
		console.log("status", status);
		try {
			const response = await axios.put(url, status);

			//console.log("fields", response);
			document.getElementById(formId).click();
			//find obj to be replaced
			const newObjRef = [...getters.getAnomalies].find(
				(anomaly) => anomaly._id === anomalyId
			);
			//copy of obj to be replaced
			const newObj = structuredClone(newObjRef);
			//modify obj to be replaced
			newObj.status = name;
			//console.log("obj to be replaced", newObj);
			const anomaliesRef = structuredClone(getters.getAnomalies);
			//console.log(anomaliesRef);
			const newAnomalies = anomaliesRef.map((anomaly) =>
				anomaly._id === anomalyId ? newObj : anomaly
			);
			//console.log("new anomalies", newAnomalies);
			commit("SET_ANOMALIES", newAnomalies);
			if (!getters.getAnomalyStatusFields.includes(name)) {
				commit("SET_STATUS_FIELDS", [...getters.getAnomalyStatusFields, name]); //add
			}
		} catch (error) {
			//commit("SET_ISSUES", []);
			//console.error(error);
			// commit("setDeviceError", "Failed to load device data");
		}
	},
	async fetchStatusTimeline({ dispatch, commit, getters, rootGetters }, anomalyId) {
		//console.log("here issue.js", anomalyId);
		let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/v2/statusTimeline/" + anomalyId;
		// let url = process.env.VUE_APP_BACKEND_API + "incident/byorg/" + rootGetters.getOrgId;
		// let url = "http://localhost:81/api/anomalyHistory/statusTimeline/" + anomalyId;
		//console.log("url", url);

		try {
			const response = await axios.get(url);

			//console.log("TIMELINE", response.data.data);
			commit("SET_TIMELINE", response.data.data);

			////console.log("inci thres", data);
		} catch (error) {
			//console.error(error);
		}
	},

	async fetchAnomaly({ dispatch, commit, getters, rootGetters }, anomalyId) {
		//console.log("here issue.js", anomalyId);

		let url = process.env.VUE_APP_BACKEND_API + "anomalyHistory/v2/anomaly/" + anomalyId;
		// let url = "http://localhost:81/api/anomalyHistory/anomaly/" + anomalyId;
		//console.log("url", url);

		try {
			const response = await axios.get(url);

			//console.log("anomaly details", response.data.data);
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
	SET_DEVICE_NAME_FIELDS(state, anomalyDeviceNameFields) {
		state.anomalyDeviceNameFields = anomalyDeviceNameFields;
	},
	SET_STATUS_FIELDS(state, anomalyStatusFields) {
		state.anomalyStatusFields = anomalyStatusFields;
	},
	SET_DEVICE_ID_FIELDS(state, anomalyDeviceIDFields) {
		state.anomalyDeviceIDFields = anomalyDeviceIDFields;
	},
	SET_SENSOR_FIELDS(state, anomalySensorFields) {
		state.anomalySensorFields = anomalySensorFields;
	},
	//search input
	SET_INPUT_VALUE(state, searchInput) {
		//console.log("search Input", searchInput);
		state.searchInputValue = searchInput;
	},

	SET_SORTING_PARAM(state, param) {
		state.sortingParam = param;
		//console.log("sorting Param", state.sortingParam);
	},

	setLoadingAnomalies(state, bool) {
		state.isLoadingAnomalies = bool;
	},
	SET_SELECTED_DEVICE_ID(state, deviceId) {
		state.selectedDeviceId = deviceId;
	},
	SET_SELECTED_DEVICE_NAME(state, deviceName) {
		state.selectedDeviceName = deviceName;
	},
	SET_SELECTED_SENSOR_NAME(state, sensorName) {
		state.selectedSensorName = sensorName;
	},
	SET_SELECTED_STATUS(state, status) {
		state.selectedStatus = status;
	},
	SET_SELECTED_DATE_FROM(state, date1) {
		state.selectedDateFrom = date1;
	},
	SET_SELECTED_DATE_TO(state, date2) {
		state.selectedDateTo = date2;
	},
	SET_NOTIFIED(state, id) {
		state.notified.push(id);
	},
	SET_PAGER(state, pager) {
		state.pager = pager;
	},
	SET_PAGE(state, page) {
		state.page = page;
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
