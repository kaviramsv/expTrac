import { createStore } from "vuex";
import authModule from "./modules/auth.js";
import expenseModule from "./modules/expense.js";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
	modules: {
		auth: authModule,
		expenses: { ...expenseModule, namespaced: true },		
	},
	strict: process.env.NODE_ENV !== "production",
	plugins: [createPersistedState()],
});

export default store;
