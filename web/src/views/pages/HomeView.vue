<script>
import { mapGetters, mapActions } from "vuex";
//import NavBar from "../../../components/NavBar.vue";
import MainLayout from "../layouts/MainLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { SimpleBar } from "simplebar-vue3";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { getCurrentInstance } from "vue";
export default {
  name: "DeviceDashboard",
  props: {},
  setup(props) {
    const route = useRoute();
    const store = useStore();
    const dateRange = ref(null);

    const month = ref({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    });
    let expensesTotal = computed(() => {
      return store.getters["expenses/getExpensesTotal"];
    });
    let expensesEvent = computed(() => {
      return store.getters["expenses/getExpensesPerEvent"];
    });
    let expensesMonth = computed(() => {
      return store.getters["expenses/getExpensesPerMonth"];
    });
    let expensesCard = computed(() => {
      console.log("in card", store.getters["expenses/getExpensesPerCard"]);
      return store.getters["expenses/getExpensesPerCard"];
    });
    let expensesStore = computed(() => {
      return store.getters["expenses/getExpensesPerStore"];
    });
    let expensesCategory = computed(() => {
      // console.log(
      //   "in list category",
      //   store.getters["expenses/getExpensesPerCategory"]
      // );
      return store.getters["expenses/getExpensesPerCategory"];
    });
    const basicColumnChart = ref({
      series: [
        {
          name: "Expense Count",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "bar",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "5%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },

        stroke: {
          show: true,
          width: 4,
          colors: ["transparent"],
        },

        colors: ["#3b76e1", "#63ad6f"],

        yaxis: {
          title: {
            text: "Expense in $",
          },
        },
        grid: {
          borderColor: "#f1f1f1",
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " $";
            },
          },
        },
      },
    });
    const donutCategoryChart = ref({
      series: [],
      chartOptions: {
        chart: {
          height: 200,
          type: "donut",
        },
        dataLabels: {
          enabled: true,

          legend: {
            position: "right",
          },
        },
        labels: [],
        legend: {
          position: "right",
        },
        colors: [
          "#00a5e3",
          "#e77577",
          "#ffbf65",
          "#4d5061",
          "#85b093",
          "#2e1c2b",
          "#a5a5a5",
          "#737ba5",
          "#f4845f",
          // "#3484c5",
          // "#260046",
          // "#baceba",
          // "#737ba5",
          // "#c08283",
          // "#ADB5BD",
          // "#274C77",
          // "#407F82",
          // "#6E92C4",
          // "#E9CBCA",
          // "#6C001B",
          // "#6f708e",
          // "#A396A1",
          // "#CD5C5C",
          // "#c8ccd4",
          // "#9aa0c8",
          // "#68507b",
          // "#42aeb5",
        ],
      },
    });
    const donutStoreChart = ref({
      series: [],
      chartOptions: {
        chart: {
          height: 200,
          type: "donut",
        },
        dataLabels: {
          enabled: true,

          legend: {
            position: "right",
          },
        },
        labels: [],
        legend: {
          position: "right",
        },
        colors: [
          "#00a5e3",
          "#e77577",
          "#ffbf65",
          "#85b093",
          "#4d5061",

          "#a5a5a5",
          "#621708",
          "#737ba5",
          "#d8e2dc",
          // "#86737c",
          // "#7f324c",
          // "#2e94a8",
          // "#85b093",
          // "#3484c5",
          // "#260046",
          // "#baceba",
          //
          // "#274C77",
          // "#407F82",
          // "#6E92C4",
          // "#E9CBCA",
          // "#6C001B",
          // "#6f708e",
          // "#A396A1",
          // "#CD5C5C",
          // "#c8ccd4",
          // "#9aa0c8",
          // "#68507b",
          // "#42aeb5",
        ],
      },
    });
    const getColour = (colour) => {
      if (colour === "red") return "bg-danger";
      if (colour === "grey") return "bg-secondary";
      if (colour === "blue") return "bg-primary";
      if (colour === "black") return "bg-white text-danger";
      else return "bg-dark";
    };
    const updateChart = () => {
      console.log("in update", expensesMonth.value);
      basicColumnChart.value.series = [
        {
          name: "Daily Expense",
          data: expensesMonth.value, //fro
        },
      ];
      donutCategoryChart.value.series = expensesCategory.value.y;

      donutCategoryChart.value.chartOptions = {
        ...donutCategoryChart.value.chartOptions,
        ...{
          labels: expensesCategory.value.x,
        },
      };
      donutStoreChart.value.series = expensesStore.value.y;

      donutStoreChart.value.chartOptions = {
        ...donutStoreChart.value.chartOptions,
        ...{
          labels: expensesStore.value.x,
        },
      };
    };
  
    const handleSubmit = async (modelData) => {
      // do something else with the data
      if (!modelData) {
        modelData = {
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        };
        month.value = {
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        };
      }
      await store.dispatch("expenses/fetchExpensesPerEvent", {
        month: (modelData.month + 1).toString(),
        year: modelData.year.toString(),
      });
      await store.dispatch("expenses/fetchExpensesPerMonth", {
        month: (modelData.month + 1).toString(),
        year: modelData.year.toString(),
      });
      await store.dispatch("expenses/fetchExpensesPerStore", {
        month: (modelData.month + 1).toString(),
        year: modelData.year.toString(),
      });
      await store.dispatch("expenses/fetchExpensesPerCard", {
        month: (modelData.month + 1).toString(),
        year: modelData.year.toString(),
      });
      await store.dispatch("expenses/fetchExpensesPerCategory", {
        month: (modelData.month + 1).toString(),
        year: modelData.year.toString(),
      });
      await store.dispatch("expenses/fetchTotalExpensesforMonth", {
        month: (modelData.month + 1).toString(),
        year: modelData.year.toString(),
      });
      updateChart();
    };

    onMounted(async () => {
      await store.dispatch("expenses/fetchExpensesPerEvent", {
        //props.deviceid doesnt work
        month: (month.value.month + 1).toString(),
        year: month.value.year.toString(),
      });
      await store.dispatch("expenses/fetchExpensesPerMonth", {
        month: (month.value.month + 1).toString(),
        year: month.value.year.toString(),
      });
      await store.dispatch("expenses/fetchExpensesPerStore", {
        month: (month.value.month + 1).toString(),
        year: month.value.year.toString(),
      });
      await store.dispatch("expenses/fetchExpensesPerCard", {
        month: (month.value.month + 1).toString(),
        year: month.value.year.toString(),
      });
      await store.dispatch("expenses/fetchExpensesPerCategory", {
        month: (month.value.month + 1).toString(),
        year: month.value.year.toString(),
      });
      await store.dispatch("expenses/fetchTotalExpensesforMonth", {
        month: (month.value.month + 1).toString(),
        year: month.value.year.toString(),
      });
      updateChart();
    });
    return {
      month,
      dateRange,
      handleSubmit,
      expensesEvent,
      expensesMonth,
      basicColumnChart,
      donutCategoryChart,
      expensesStore,
      expensesCategory,
      donutStoreChart,
      expensesTotal,
      expensesCard,
      getColour,
    };
  },
  computed: {
    ...mapGetters({
      isLoadingDashboard: "expenses/getLoadingDashboard",
    }),
  },
  watch: {
    isLoadingDashboard(val, oldval) {
      console.log("val changed");
    },
  },
  methods: {
    ...mapActions(),

    // updateData: function () {
    //   console.log("in update");
    //   // this.basicColumnChart.series = this.anomaliesPerDay.telemetry;
    //   this.basicColumnChart.updateSeries(this.anomaliesPerDay.telemetry);
    // },

    // removeData: function () {
    //   if (this.updatingDonutChart.series.length === 1) return;
    //   var arr = this.updatingDonutChart.series.slice();
    //   arr.pop();
    //   this.updatingDonutChart.series = arr;
    // },

    // randomize: function () {
    //   this.updatingDonutChart.series = this.updatingDonutChart.series.map(function () {
    //     return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    //   });
    // },

    // reset: function () {
    //   this.updatingDonutChart.series = [44, 55, 13, 33];
    // },
  },
  components: {
    //MainLayout,
    //NavBar
    SimpleBar,
    VueDatePicker,
    Loading,
    MainLayout,
  },
  data() {
    return {};
  },
};
</script>
<template>
  <MainLayout>
    <div class="row pb-0 m-0 p-2 pt-3">
      <!-- <div class="row mb-2 px-5">
        <div class="col">
          <h6 class="font-size-14 text-uppercase text-muted">
            Expenses for the Month
          </h6>
        </div>
      </div> -->
        <loading
        :active="isLoadingDashboard"
        :can-cancel="false"
        :is-full-page="false"
        :enforce-focus="true"
        loader="bars"
        :width="100"
        :height="100"
        color="var(--primary)"
      />
      <div class="row pb-0 mb-2">
        <div class="col-auto">
          <h6 class="font-size-14 text-uppercase text-muted">
            Expenses for the Month
          </h6>
        </div>
      </div>
      <div class="row pb-0 mb-0">
        <div class="col-auto">
          <p class="">
            Pick a Month
            <VueDatePicker
              v-model="month"
              :teleport="true"
              month-picker
              @update:model-value="handleSubmit"
            />
          </p>
        </div>
      </div>
      <div class="col-xxl-9">
        <!-- //credit cards -->
        <div class="row">
          <div class="col-xl-3 col-lg-6" v-for="exp in expensesCard" :key="exp">
            <div class="card">
              <div
                class="card bg-gradient text-white visa-card mb-0"
                :class="getColour(exp.colour)"
              >
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <i
                        v-if="exp.type == 'visa'"
                        class="fa-brands fa-cc-visa text-white fa-lg"
                        style=""
                      ></i>
                      <i
                        v-if="exp.type == 'master'"
                        class="fa-brands fa-cc-mastercard text-white fa-lg"
                        style=""
                      ></i>
                      <i
                        v-if="exp.name == 'Cash'"
                        class="fa-solid fa-money-check-dollar fa-2xl"
                      ></i>
                    </div>

                    <div class="ms-auto">
                      <h5 class="m-0 p-0">$${{ exp.amount ||0}}</h5>
                    </div>
                    <div><i class="bx bx-chip h1 text-warning"></i></div>
                  </div>
                  <div
                    class="mt-2 d-flex justify-content-center align-items-center g-4"
                     
                        v-if="exp.name != 'Cash'"
                       
                  >
                    <div class="me-2">****</div>
                    <div class="me-2">****</div>
                    <div class="me-2">{{ exp.ending }}</div>
                  </div>
                  <div
                    class="mt-2 d-flex justify-content-center align-items-center g-4"
                     
                        v-if="exp.name == 'Cash'"
                       
                  >
                    <div class="me-2">&nbsp;</div>
                    <div class="me-2">&nbsp;</div>
                    <div class="me-2">&nbsp;</div>
                  </div>
                  <div class="mt-2">
                    <p class="text-white float-end mb-0">{{ exp.expiry }}</p>
                    <p class="text-white mb-0">{{ exp.name }}</p>
                  </div>
                </div>
              </div>
              <!-- end card body -->
            </div>
            <!-- end card -->
          </div>

          <!-- end col -->
        </div>
        <!-- // donuts -->
        <div class="row mt-2 mb-2">
          <div class="col-lg-6">
            <div class="card m-0 p-0 border-primary">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <div class="flex-grow-1">
                    <h5 class="card-title mb-3">Category</h5>
                  </div>
                </div>
                <!-- donutStoreChart -->

                <apexchart
                  class="mt-2"
                  height="220"
                  type="donut"
                  :options="donutCategoryChart.chartOptions"
                  :series="donutCategoryChart.series"
                ></apexchart>
              </div>
              <!-- end card body -->
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card m-0 p-0 border-primary">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <div class="flex-grow-1">
                    <h5 class="card-title mb-3">Store</h5>
                  </div>
                </div>
                <!-- donutStoreChart -->

                <apexchart
                  class="mt-2"
                
                  height="220"
                  type="donut"
                  :options="donutStoreChart.chartOptions"
                  :series="donutStoreChart.series"
                ></apexchart>
              </div>
              <!-- end card body -->
            </div>
          </div>

          <!-- <div class="col-lg-4">
            <div class="card border-primary">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <div class="flex-grow-1">
                    <h5 class="card-title font-weight-bold text-primary mb-3">
                      Total Expenditure
                    </h5>
                    <h1 class="text-primary mb-3 display-4 float-end">
                      2400 $
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
        <!--monthly-->
        <div class="row card m-0 p-0 bg-light">
          <apexchart
            height="350"
            type="bar"
            :series="basicColumnChart.series"
            :options="basicColumnChart.chartOptions"
          ></apexchart>
        </div>
      </div>
      <div class="col-xxl-3">
        <div class="card mb-3 border-primary">
          <div class="card-body">
            <div class="d-flex align-items-start">
              <div class="flex-grow-1">
                <h5 class="card-title font-weight-bold text-primary mb-3">
                  Total Expenditure
                </h5>
                <h1 class="text-primary float-end">{{ expensesTotal }} $</h1>
              </div>
            </div>
          </div>
        </div>
        <div class="card overflow-hidden bg-light">
          <div class="card-header bg-light">
            <h5 class="card-title">Top Tags for the Month</h5>
          </div>
          <div class="card-body" v-if="expensesEvent.length >=1 ">
            <div
              v-for="exp in expensesEvent"
              :key="exp"
              class="d-flex align-items-center border-bottom p-2"
            >
              <div class="flex-grow-1 d-flex">
                <i class="fas fa-star text-warning align-middle me-4 mt-1"></i>
                <div>
                  <h6 class="events font-size-10 m-0 p-0">{{ exp.event }}..</h6>
                  <p class="events font-size-8">
                    {{ new Date(exp.timestamp).toLocaleString() }}
                  </p>
                </div>
              </div>
              <div class="flex-shrink-0">
                <div class="float-end">
                  <!-- <span class="bg-primary badge">300 </span> -->
                  <p class="text-primary">{{ exp.expense }}$</p>
                </div>
              </div>
            </div>
          </div>
           <div class="card-body mt-0" v-else><h5 class="text-black">No Events Yet</h5></div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
<style lang="scss" scoped></style>
