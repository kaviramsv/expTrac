<script>
import { mapGetters, mapActions } from "vuex";

import ExpenseList from "./ExpenseList.vue";
import ExpenseTopBar from "./ExpenseTopBar.vue";
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

import MainLayout from "../../layouts/MainLayout.vue";
export default {
  name: "ExpenseView",
  setup() {
    onMounted(() => {
      console.log("mounted in the composition expes list view!");
    });
  },
  computed: {
    ...mapGetters({
      isLoadingExpenses: "expenses/getLoadingExpenses",
    }),
  },
  watch: {
    isLoadingExpenses(val, oldval) {
      console.log("val changed");
    },
  },
  methods: {
    ...mapActions([]),
  },
  components: {
    MainLayout,
    ExpenseList,
    ExpenseTopBar,
    Loading,
    // eslint-disable-next-line
    //SimpleBar,
  },
};
</script>

<template>
  <MainLayout :pagetitle="'Expenses'">
    <!-- style="height: calc(100vh-15vh)" -->
    <div class="w-100" style="">
      <!-- <anomaly-top-bar /> -->
      <!-- <div class="col-lg-12">
				<div class="input-group rounded mb-3">
					<div class="input-group-text"><i class="bx bx-search font-size-14" /></div>

					<input
						class="form-control"
						placeholder="Search..."
						type="text"
						v-model="search"
						@input="handleSearch"
						style="font-size: small"
					/>
				</div>-->
      <loading
        :active="isLoadingExpenses"
        :can-cancel="false"
        :is-full-page="false"
        :enforce-focus="true"
        loader="bars"
        :width="100"
        :height="100"
        color="var(--primary)"
      />
      <expense-top-bar />
      <ExpenseList />
    </div>
    <!-- </div> -->
  </MainLayout>
</template>
