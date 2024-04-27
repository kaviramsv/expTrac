<script>
import { mapGetters, mapActions } from "vuex";
import { onMounted } from "vue";

import ExpenseListItem from "./ExpenseListItem.vue";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { SimpleBar } from "simplebar-vue3";
import { useToast } from "vue-toastification";
import { isProxy, toRaw } from "vue";

export default {
	name: "AnomaliesList",

	setup() {
		const store = useStore();
		// let sortString = ref("");
		const toast = useToast();
		let expenses = computed(() => {
			console.log("in list", store.getters["expenses/getFilteredExpenses"]);
			return store.getters["expenses/getFilteredExpenses"];
		});

		// let sortingParam = computed(() => store.getters["anomalies/getSortingParam"]);
		// let notifiedArray = computed(() => store.getters["anomalies/getNotified"]);
		// let pager = computed(() => store.getters["anomalies/getPager"]);

		// const notify = async () => {
		// 	await store.dispatch("anomalies/fetchAnomalies");
		// };
		// function getSortClass(sortName) {
		// 	if (sortName === sortingParam.value) {
		// 		return "text-primary";
		// 	} else {
		// 		return "";
		// 	}
		// }
		// const sort = async (param) => {
		// 	// console.log("fromsort", param);
		// 	store.commit("anomalies/SET_SORTING_PARAM", param);
		// 	await store.dispatch("anomalies/fetchAnomalies");
		// };
		onMounted(async () => {
			// await store.dispatch("anomalies/fetchFields");
			await store.dispatch("expenses/fetchExpenses");
			// store.commit("anomalies/SET_SORTING_PARAM", "timestamp-d");
		});
		return {
			expenses,
			// getSortClass,
			// sort,
			// sortingParam,
			// pager,
			// notifiedArray,
			// notify,
		};
	},
	computed: {
		...mapGetters([]),
	},
	methods: {
		...mapActions([]),
	},
	components: {
		ExpenseListItem,
	},
};
</script>

<template>
	<div>
		<expense-list-item :expenses="expenses" :height="75" />
	</div>
</template>
