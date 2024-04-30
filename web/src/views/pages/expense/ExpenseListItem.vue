<script>
import { mapGetters, mapActions } from "vuex";
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import * as timeago from "timeago.js";
import { SimpleBar } from "simplebar-vue3";
import { isProxy, toRaw } from "vue";
import Footer from "../../../components/Footer.vue";
export default {
  name: "ExpenseListItem",
  props: {
    expenses: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const store = useStore();
   
    const timeagoString = (t) => {
      return timeago.format(t, "en_US");
    };

    let pager = computed(() => store.getters["expenses/getPager"]);
    let sortingParam = computed(
      () => store.getters["expenses/getSortingParam"]
    );
    onMounted(() => {
      console.log("mounted in the composition api!");
    });
    return {
      //clearTimeline,
      timeagoString,
      store,
      pager,
      sortingParam,
    };
  },
  computed: {
    ...mapGetters([]),

    scrollHeight() {
      console.log("in scroll height: ", this.height);
      return {
        /* variables you want to pass to css */
        height: this.height + "vh",
      };
    },
  },
  methods: {
    ...mapActions([]),
 
  },
  components: {
    SimpleBar,
    Footer,
  },
  data() {
    return {
      lineChartOptions1: {
        chartOptions: {
          chart: {
            type: "line",
            width: 120,
            height: 25,
            sparkline: {
              enabled: true,
            },
          },
          colors: ["#808080", "#f56e6e"],
          stroke: {
            curve: "smooth",
            width: [3, 3],

            dashArray: [5, 0],
          },
          xaxis: {
            categories: ["a", "c", "v", "b", "db", "dd"],
          },
          tooltip: {
            fixed: {
              enabled: false,
            },

            y: [
              {
                title: {
                  formatter: function (val) {
                    return val;
                  },
                },
              },
              {
                title: {
                  formatter: function (val) {
                    return val;
                  },
                },
              },
            ],
            
            marker: {
              show: true,
            },
          },
        },
      },
    };
  },
  watch: {
    "$route.query.page": {
      immediate: true,
      async handler(page) {
        page = parseInt(page) || 1;
        if (page !== this.pager.currentPage) {
          // fetch(`/api/items?page=${page}`, { method: "GET" })
          //   .then((response) => response.json())
          //   .then(({ pager, pageOfItems }) => {
          //     this.pager = pager;
          //     this.pageOfItems = pageOfItems;
          //   });
          this.store.commit("expenses/SET_PAGE", page);
          await this.store.dispatch("expenses/fetchExpenses");
        }
      },
    },
  },
};
</script>

<template>
 
  <span>
    <!-- style="height: calc(100vh-90px-70px)" -->
    <!-- :style="scrollHeight" -->
    <!-- <SimpleBar data-simplebar :style="scrollHeight" style="margin-top: 2vh"> -->

    <!-- <SimpleBar data-simplebar :style="scrollHeight"> -->
    <!-- <ul class="list-unstyled"> -->
    <!-- <li v-for="expense in expenses" :key="expense?._id"> -->
    <!-- <div class="row m-0 w-90">
        <div class="card p-0 bg-gray">
          <div class="card-body px-3 py-0 bg-gray"> -->
    <!-- <p class="card-title-desc">
								Add <code>.table-hover</code> to enable a hover state on table rows
								within a <code>&lt;tbody&gt;</code>.
							</p> -->
    <div class="px-2 px-lg-5">
      <div
        class="position-relative table-responsive mb-0"
        style="height: calc(63vh)"
      >
        <table class="table table-hover mb-0 border-dark-300">
          <thead class="table-light sticky-top top-0" style="z-index: 10">
            <tr>
              <th>
                Date<span v-if="sortingParam == 'timestamp-a'"
                  ><i class="fa fa-sort-alpha-down ms-2 text-primary"></i></span
                ><span v-if="sortingParam == 'timestamp-d'"
                  ><i class="fa fa-sort-alpha-down-alt ms-2 text-primary"></i
                ></span>
              </th>
              <th class="d-none d-lg-table-cell">
                Category
                <span v-if="sortingParam == 'category-a'"
                  ><i class="fa fa-sort-alpha-down ms-2 text-primary"></i></span
                ><span v-if="sortingParam == 'category-d'"
                  ><i class="fa fa-sort-alpha-down-alt ms-2 text-primary"></i
                ></span>
              </th>
              <th>
                Shop
                <span v-if="sortingParam == 'shop-a'"
                  ><i class="fa fa-sort-alpha-down ms-2 text-primary"></i></span
                ><span v-if="sortingParam == 'shop-d'"
                  ><i class="fa fa-sort-alpha-down-alt ms-2 text-primary"></i
                ></span>
              </th>
              <th class="d-none d-lg-table-cell">Spend For</th>
              <th>Tag</th>
              <th>
                Amount<span v-if="sortingParam == 'amount-a'"
                  ><i class="fa fa-sort-alpha-down ms-2 text-primary"></i></span
                ><span v-if="sortingParam == 'amount-d'"
                  ><i class="fa fa-sort-alpha-down-alt ms-2 text-primary"></i
                ></span>
              </th>
              <th class="text-light">&nbsp;Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(expense, index) in expenses" :key="expense?._id">
              <td>
                {{ new Date(expense?.timestamp).toLocaleString() }}
              </td>
              <td class="d-none d-lg-table-cell">
                {{ expense?.category }}
              </td>
              <td>
                {{ expense?.shop }}
              </td>
              <td class="d-none d-lg-table-cell">
                {{ expense?.spendFor }}
              </td>
              <td>
                {{ expense?.tag }}
              </td>
              <td>
                {{ expense?.amount }}
              </td>
              <td class="text-nowrap">
                <span class="ms-5">
                  <button
                    class="me-4"
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#timelineModal"
                  >
                    <i class="fa-solid fa-eye text-secondary"></i>
                  </button>
                </span>
                <span>
                  <button
                    class="me-4"
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#timelineModal"
                  >
                    <i class="fa-solid fa-pencil text-success"></i>
                  </button>
                </span>
                <span>
                  <button
                    class="me-2"
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#timelineModal"
                  >
                    <i class="fa-solid fa-trash text-danger"></i>
                  </button>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      id="timelineModal"
      class="modal fade"
      data-bs-backdrop="false"
      tabindex="-1"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content px-5">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div>
              <h5 class="font-size-16 text-primary mb-4">
                Get In touch to View More Details
              </h5>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary waves-effect"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- class="card-footer d-flex justify-content-end text-center bg-light text-dark"
    style="
      position: fixed;
      bottom: 0;
      right: 0px;
      width: 100vw;
      height: 6vh;
      padding-bottom: 1vh;
      padding-top: 1vh;
    " -->
    <Footer>
      <div
        class="d-flex justify-content-between text-center text-dark"
        style=""
      >
        <!-- z-index: 3000; -->
        <p class="ms-5 text-muted d-none d-md-block" v-if=" pager.totalItems>=50 && pager.currentPage!=pager.endPage" >
          Showing {{ pager.currentPage * pager.pageSize -50+1}} -
          {{ pager.currentPage * pager.pageSize  }} of
          {{ pager.totalItems }} Total Items
        </p>
      <!-- <p class="ms-5 text-muted d-none d-md-block" v-else >
          Showing {{ pager.totalItems }} of
          {{ pager.totalItems }} Total Items
        </p> -->
              <p class="ms-5 text-muted d-none d-md-block" v-if="pager.currentPage==pager.endPage" >
          {{ pager.currentPage * pager.pageSize -50+1}} -
          {{ pager.totalItems }} of
          {{ pager.totalItems }} Total Items
        </p>
        <ul
          v-if="pager.pages && pager.pages.length"
          class="pagination d-flex justify-content-end gap-2 mb-0 pb-0 text-center"
        >
          <li
            :class="{ disabled: pager.currentPage === 1 }"
            class="page-item first-item pb-0"
          >
            <router-link :to="{ query: { page: 1 } }" class="page-link"
              ><i class="fas fa-angle-double-left"></i>
            </router-link>
          </li>
          <li
            :class="{ disabled: pager.currentPage === 1 }"
            class="page-item previous-item pb-0"
          >
            <router-link
              :to="{ query: { page: pager.currentPage - 1 } }"
              class="page-link"
              ><i class="fa-solid fa-angle-left"></i
            ></router-link>
          </li>
          <li
            v-for="page in pager.pages"
            :key="page"
            :class="{ active: pager.currentPage === page }"
            class="page-item number-item pb-0"
          >
            <router-link :to="{ query: { page: page } }" class="page-link">{{
              page
            }}</router-link>
          </li>
          <li
            :class="{ disabled: pager.currentPage === pager.totalPages }"
            class="page-item next-item pb-0"
          >
            <router-link
              :to="{ query: { page: pager.currentPage + 1 } }"
              class="page-link"
              ><i class="fa-solid fa-angle-right"></i
            ></router-link>
          </li>
          <li
            :class="{ disabled: pager.currentPage === pager.totalPages }"
            class="page-item last-item"
          >
            <router-link
              :to="{ query: { page: pager.totalPages } }"
              class="page-link"
              ><i class="fa-solid fa-angle-double-right"></i
            ></router-link>
          </li>
        </ul>
      </div>
    </Footer>
  </span>
</template>
<!-- //:series="lineChartOptions1.series" -->
<!-- --bs-pagination-disabled-color: #858687;
--bs-pagination-disabled-bg: #a9afb6; -->
<style scoped>
ol {
  list-style-type: decimal !important;
  list-style-position: inside;
}

.page-item.disabled .page-link {
  color: rgb(73, 87, 94) !important ;
  background: #868d8e !important ;
}


</style>
