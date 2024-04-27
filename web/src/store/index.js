import { createStore } from "vuex";
import authModule from "./modules/auth.js";
import expenseModule from "./modules/expense.js";
import layoutModule from "./modules/layout.js";
import deviceModule from "./modules/device.js";
import deviceHistoryModule from "./modules/deviceHistory.js";
import anomalyModule from "./modules/anomaly.js";
import notificationModule from "./modules/notification.js";
import dynamicThresholdModule from "./modules/dynamicThreshold.js";

import createPersistedState from "vuex-persistedstate";
// import todoModule from "./modules/todoList.js";
// import profileModule from "./modules/userProfile.js";
// import userModule from "./modules/user.js";
// import deviceModule from "./modules/device.js";
const store = createStore({
	modules: {
		auth: authModule,
		expenses: { ...expenseModule, namespaced: true },
		layout: layoutModule,
		notification: { ...notificationModule, namespaced: true },
		device: { ...deviceModule, namespaced: true },
		anomalies: { ...anomalyModule, namespaced: true },
		deviceHistory: { ...deviceHistoryModule, namespaced: true },
		dynamicThreshold: { ...dynamicThresholdModule, namespaced: true },

		// todo: todoModule,
		// profile: profileModule,
		// user: userModule,
		// device: deviceModule,
	},
	strict: process.env.NODE_ENV !== "production",
	plugins: [createPersistedState()],
});

export default store;
