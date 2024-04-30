<script>
import { mapGetters, mapActions } from "vuex";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { onMounted, toRaw } from "vue";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import multiselect from "vue-multiselect";
import { SimpleBar } from "simplebar-vue3";
export default {
  name: "AnomalyTopBar",
  setup() {
    const store = useStore();
    const selectedCategory = ref([]);
    const selectedShop = ref([]);
    const selectedTag = ref([]);
    const selectedSpendFor = ref([]);
    const selectedCardName = ref([]);
    const total = ref(0);
    const dateRange = ref(null);
    const date1 = ref(null);
    const date2 = ref(null);

    let categoryFields = computed(
      () => store.getters["expenses/getCategoryFields"]
    );
    let shopFields = computed(() => store.getters["expenses/getShopFields"]);
    let tagFields = computed(() => store.getters["expenses/getTagFields"]);
    let spendForFields = computed(
      () => store.getters["expenses/getSpendForFields"]
    );
    let cardNameFields = computed(
      () => store.getters["expenses/getCardNameFields"]
    );
    //====expense list
    let expenses = computed(
      () => store.getters["expenses/getFilteredExpenses"]
    );
    let sum = computed(() => store.getters["expenses/getSum"]);

    let sortingParam = computed(
      () => store.getters["expenses/getSortingParam"]
    );

    let pager = computed(() => store.getters["expenses/getPager"]);

    const selectCategory = () => {
      console.log("selcte category", selectedCategory.value);
      // store.commit("expenses/SET_SELECTED_CATEGORY", selectedCategory.value);
    };
    const selectShop = () => {
      console.log("selcte card name", selectedShop.value);
      // store.commit("expenses/SET_SELECTED_SHOP", selectedShop.value);
    };
    const selectTag = () => {
      console.log("selcte tag name", selectedTag.value);
      // store.commit("expenses/SET_SELECTED_TAG", selectedTag.value);
    };
    const selectSpendFor = () => {
      // store.commit("expenses/SET_SELECTED_SPEND_FOR", selectedSpendFor.value);
    };
    const selectCardName = () => {
      // store.commit("expenses/SET_SELECTED_CARD_NAME", selectedCardName.value);
    };
    const handleDateRange = (modelData) => {
      // do something else with the data
      dateRange.value = toRaw(modelData);
      // console.log("dtRange:", toRaw(modelData), toRaw(dateRange.value)[0].toISOString().substring(0, 10), toRaw(dateRange.value)[1].toISOString().substring(0, 10));
       if (dateRange.value != null) {
        date1.value=toRaw(dateRange.value)[0].toISOString().substring(0, 10);
        date2.value = toRaw(dateRange.value)[1].toISOString().substring(0, 10);
        // date1.value = new Date(
        //   toRaw(dateRange.value).toISOString().substring(0, 10)
        // ).getTime();
        // let nextDay = new Date(
        //   toRaw(dateRange.value).toISOString().substring(0, 10)
        // );
        // date2.value = nextDay.setDate(nextDay.getDate() + 1);
      } else {
        date1.value = null;
        date2.value = null;
      }
      //for muti range
      // store.commit("anomalies/SET_SELECTED_DATE_RANGE", [
      //   toRaw(dateRange.value)[0],
      //   toRaw(dateRange.value)[1],
      // ]);

      // if (dateRange.value != null) {
      //   date1.value = new Date(
      //     toRaw(dateRange.value).toISOString().substring(0, 10)
      //   ).getTime();
      //   let nextDay = new Date(
      //     toRaw(dateRange.value).toISOString().substring(0, 10)
      //   );
      //   date2.value = nextDay.setDate(nextDay.getDate() + 1);
      // } else {
      //   date1.value = null;
      //   date2.value = null;
      // }
    };
    const handleSearch = async () => {
      console.log("dtRange:", dateRange.value, date1.value, date2.value);

      // const params = {
      //   deviceIdList: toRaw(selectedDeviceIds.value),
      //   deviceNameList: toRaw(selectedName.value),
      //   sensorList: toRaw(selectedSensor.value),
      //   statusList: toRaw(selectedStatus.value),
      //   date1: toRaw(dateRange.value)?.[0]?.toISOString() || new Date(1704124607000).toISOString(), //JAN 1-2024
      //   date2: toRaw(dateRange.value)?.[1]?.toISOString() || new Date().toISOString(), //TODAY
      // };
      // console.log("params", params);
      store.commit("expenses/SET_SELECTED_CATEGORY", selectedCategory.value);
      store.commit("expenses/SET_SELECTED_SHOP", selectedShop.value);
      store.commit("expenses/SET_SELECTED_TAG", selectedTag.value);
      store.commit("expenses/SET_SELECTED_SPEND_FOR", selectedSpendFor.value);
      store.commit("expenses/SET_SELECTED_CARD_NAME", selectedCardName.value);
      if (
        date1.value != null ||
        date2.value != null ||
        date1.value != undefined ||
        date2.value != undefined
      ) {
        store.commit(
          "expenses/SET_SELECTED_DATE_FROM",
          new Date(date1.value).toISOString()
        );
        store.commit(
          "expenses/SET_SELECTED_DATE_TO",
          new Date(date2.value).toISOString()
        );
      }
      if (
        date1.value == null ||
        date2.value == null ||
        date1.value == undefined ||
        date2.value == undefined
      ) {
        store.commit("expenses/SET_SELECTED_DATE_FROM", "");
        store.commit("expenses/SET_SELECTED_DATE_TO", "");
      }

      // //JAN 1-2024
      // store.commit("anomalies/SET_SELECTED_DATE_FROM", toRaw(dateRange.value)?.[0]?.toISOString());
      // //TODAY
      // // || new Date().toISOString()
      // store.commit("anomalies/SET_SELECTED_DATE_TO", toRaw(dateRange.value)?.[1]?.toISOString());

      await store.dispatch("expenses/fetchExpenses");
    };
    function getSortClass(sortName) {
      if (sortName === sortingParam.value) {
        return "text-primary";
      } else {
        return "";
      }
    }
    const sort = async (param) => {
      // console.log("fromsort", param);
      store.commit("expenses/SET_SORTING_PARAM", param);
      await store.dispatch("expenses/fetchExpenses");
    };
    const notify = async () => {
      await store.dispatch("expenses/fetchExpenses");
    };
    const addExpense = async () => {
      console.log("in add expense");
    };
    onMounted(async () => {
      store.commit("expenses/SET_SELECTED_CATEGORY", []);
      store.commit("expenses/SET_SELECTED_SHOP", []);
      store.commit("expenses/SET_SELECTED_TAG", []);
      store.commit("expenses/SET_SELECTED_SPEND_FOR", []);
      store.commit("expenses/SET_SELECTED_CARD_NAME", []);
      store.commit("expenses/SET_SELECTED_DATE_FROM", "");
      store.commit("expenses/SET_SELECTED_DATE_TO", "");
      store.commit("expenses/SET_SORTING_PARAM", "");
      //console.log("mounted in the composition api anomaly list!");
      await store.dispatch("expenses/fetchFields");
      // await store.dispatch("expenses/fetchExpenses");
      // store.commit("anomalies/SET_SORTING_PARAM", "");
      store.commit("expenses/SET_SORTING_PARAM", "timestamp-d");
    });
    return {
      //filters
      categoryFields,
      shopFields,
      tagFields,
      spendForFields,
      cardNameFields,
      //selected values
      selectedCategory,
      selectedShop,
      selectedTag,
      selectedSpendFor,
      selectedCardName,
      //functions
      selectCategory,
      selectShop,
      selectTag,
      selectSpendFor,
      selectCardName,
      handleSearch,
      dateRange,
      handleDateRange,
      pager,
      sortingParam,
      getSortClass,
      notify,
      sort,
      expenses,
      addExpense,
      sum,
    };
  },
  computed: {
    ...mapGetters([]),
  },

  methods: {
    ...mapActions([]),
    // addTag(newTag) {
    //   const tag = {
    //     name: newTag,
    //     code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
    //   };
    //   this.options.push(tag);
    //   this.value.push(tag);
    // },
  },
  components: {
    VueDatePicker,
    multiselect,
    // SimpleBar,
  },
  data() {
    return {};
  },
};
</script>
<!-- <VueDatePicker
        :min-time="{ hours: 0, minutes: 0, seconds: 0 }"
        :model-value="dateRange"
        @update:model-value="handleDateRange"
        range
      ></VueDatePicker> -->
<!-- <div class="row m-0 mb-4 row-cols justify-content-center">
  <div class="col-lg-2">
    <h6 class="font-size-10 text-primary">Pick The Date</h6>
 
    <VueDatePicker
      :model-value="dateRange"
      @update:model-value="handleDateRange"
      :enable-time-picker="false"
      :max-date="new Date()"
      :teleport="true"
    ></VueDatePicker>
  </div>

  <div class="col-lg-2">
    <h6 class="text-primary">Category</h6>
    <multiselect
      v-model="selectedCategory"
      :options="categoryFields"
      tag-placeholder="Add this as new tag"
      placeholder="Pick a Catgeory"
      :multiple="true"
      :close-on-select="true"
      :taggable="true"
      @tag="addTag"
      @select="selectCategory"
      @change="selectCategory"
      @remove="selectCategory"
    >
    </multiselect>
  </div>
  <div class="col-lg-2">
    <h6 class="font-size-12 text-primary">Store</h6>
    <multiselect
      v-model="selectedShop"
      :options="shopFields"
      :multiple="true"
      :close-on-select="true"
      placeholder="Pick a Store"
      @select="selectShop"
      @change="selectShop"
      @remove="selectShop"
    >
    </multiselect>
  </div>
  <div class="col-lg-2">
    <h6 class="font-size-12 text-primary">Tag</h6>
    <multiselect
      v-model="selectedTag"
      :options="tagFields"
      :multiple="true"
      :close-on-select="true"
      placeholder="Pick a Tag"
      @select="selectTag"
      @change="selectTag"
      @remove="selectTag"
    >
    </multiselect>
  </div>
  <div class="col-lg-2">
    <h6 class="font-size-12 text-primary">Spend For</h6>
    <multiselect
      v-model="selectedSpendFor"
      :options="spendForFields"
      :multiple="true"
      :close-on-select="true"
      placeholder="Pick a Tag"
      @select="selectSpendFor"
      @change="selectSpendFor"
      @remove="selectSpendFor"
    >
    </multiselect>
  </div>
  <div class="col-lg-1">
    <h6 class="font-size-12 text-primary">Card Name</h6>
    <multiselect
      v-model="selectedCardName"
      :options="cardNameFields"
      :multiple="true"
      :close-on-select="true"
      placeholder="Pick a Tag"
      @select="selectCardName"
      @change="selectCardName"
      @remove="selectCardName"
    >
    </multiselect>
  </div>

  <div class="col-md-1">
    <h6 class="font-size-12 text-uppercase text-primary">&nbsp;</h6>
    <button class="btn btn-primary btn-sm" @click="handleSearch">
    -->

<template>
  <div class="px-5 pt-5 pb-0" style="height: calc(100vh-7vh-63vh)">
    <!-- <div
      class="m-0 mb-4 d-sm-block d-md-block d-lg-flex g-5 flex-wrap justify-content-around align-items-center p-auto"
    > -->
    <div class="row row-cols">
      <div class="col-xl-11 col-10 px-auto">
        <div class="d-flex flex-column">
          <div
            class="row row-cols-xxl-6 row-cols-xl-2 row-cols-lg-2 row-cols-md-1 row-cols-sm-1 row-cols-1"
          >
            <div class="col" style="">
              <h6 class="font-size-10 text-muted">Pick The Date</h6>
              <VueDatePicker
            :enable-time-picker="false"
            :model-value="dateRange"
            @update:model-value="handleDateRange"
             :partial-range="false"
            range
              :max-date="new Date()"
          ></VueDatePicker>
              <!-- <VueDatePicker
                :model-value="dateRange"
                @update:model-value="handleDateRange"
                :enable-time-picker="false"
                :max-date="new Date()"
                :teleport="true"
              ></VueDatePicker> -->
            </div>

            <div class="col" style="">
              <h6 class="text-muted">Category</h6>
              <multiselect
                v-model="selectedCategory"
                :options="categoryFields"
                tag-placeholder="Add this as new tag"
                placeholder="Pick a Catgeory"
                :multiple="true"
                :close-on-select="true"
                :taggable="true"
                @tag="addTag"
                @select="selectCategory"
                @change="selectCategory"
                @remove="selectCategory"
              >
              </multiselect>
            </div>
            <div class="col" style="">
              <h6 class="font-size-12 text-muted">Store</h6>
              <multiselect
                v-model="selectedShop"
                :options="shopFields"
                :multiple="true"
                :close-on-select="true"
                placeholder="Pick a Store"
                @select="selectShop"
                @change="selectShop"
                @remove="selectShop"
              >
              </multiselect>
            </div>
            <div class="col" style="">
              <h6 class="font-size-12 text-muted">Tag</h6>
              <multiselect
                v-model="selectedTag"
                :options="tagFields"
                :multiple="true"
                :close-on-select="true"
                placeholder="Pick a Tag"
                @select="selectTag"
                @change="selectTag"
                @remove="selectTag"
              >
              </multiselect>
            </div>
            <div class="col" style="">
              <h6 class="font-size-12 text-muted">Spend For</h6>
              <multiselect
                v-model="selectedSpendFor"
                :options="spendForFields"
                :multiple="true"
                :close-on-select="true"
                placeholder="Pick a Tag"
                @select="selectSpendFor"
                @change="selectSpendFor"
                @remove="selectSpendFor"
              >
              </multiselect>
            </div>
            <div class="col" style="">
              <h6 class="font-size-12 text-muted">Card Name</h6>
              <multiselect
                v-model="selectedCardName"
                :options="cardNameFields"
                :multiple="true"
                :close-on-select="true"
                placeholder="Pick a Tag"
                @select="selectCardName"
                @change="selectCardName"
                @remove="selectCardName"
              >
              </multiselect>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-1 col-md-10 col-sm-10">
        <div class="" style="">
          <h6 class="font-size-12 text-uppercase">&nbsp;</h6>
          <button class="btn btn-primary" @click="handleSearch">
            &nbsp;Search&nbsp;
          </button>
        </div>
      </div>
    </div>
    <!-- from anomaly list-->
    <div
      class="pt-4 pb-2 mx-0 me-5 d-sm-block d-md-block d-lg-flex justify-content-between align-items-center"
    >
      <div class="">
        <card class="bg-primary" style="">
          <p class="m-0 p-0 text-muted">
            Total Spending<span
              ><h1>{{ sum }}</h1></span
            >
          </p>
        </card>
      </div>

      <!-- <h5 class="font-size-18 text-muted">
        Total Records: {{ pager.totalItems }}
      </h5> -->
      <div
        class="d-sm-block d-md-block d-lg-flex justify-content-between align-items-center g-2"
      >
        <div class="me-2 mt-2 text-start">
          <!-- <span class="text-muted font-size-12">Sorted By</span> -->
          <p
            v-if="sortingParam == 'category-a'"
            class="text-muted font-size-12"
          >
            Ascending: Category
          </p>
          <p
            v-if="sortingParam == 'category-d'"
            class="text-muted font-size-12"
          >
            Descending: Category
          </p>
          <p v-if="sortingParam == 'shop-a'" class="text-muted font-size-12">
            Ascending: Store Name
          </p>
          <p v-if="sortingParam == 'shop-d'" class="text-muted font-size-12">
            Descending: Store Name
          </p>
          <p v-if="sortingParam == 'amount-a'" class="text-muted font-size-12">
            Ascending: Amount
          </p>
          <p v-if="sortingParam == 'amount-d'" class="text-muted font-size-12">
            Descending: Amount
          </p>
          <p
            v-if="sortingParam == 'timestamp-a'"
            class="text-muted font-size-12"
          >
            Ascending: Timestamp
          </p>
          <p
            v-if="sortingParam == 'timestamp-d'"
            class="text-muted font-size-12"
          >
            Descending: Timestamp
          </p>
        </div>
        <div class="ms-2 dropdown mb-2">
          <button
            class="btn btn-outline-secondary btn-sm w-xs"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fas fa-sort"></i> Sort
          </button>
          <div
            class="dropdown-menu"
            aria-labelledby="dropdownMenuButton"
            style="z-index: 9999"
          >
            <a
              class="dropdown-item font-size-10"
              href="#"
              v-if="sortingParam != 'category-a'"
              v-on:click="sort('category-a')"
              :class="getSortClass('category-d')"
              ><i class="fas fa-sort-alpha-down font-size-10 me-2"></i>Sort By
              Category</a
            >
            <a
              class="dropdown-item font-size-10"
              href="#"
              v-if="sortingParam == 'category-a'"
              v-on:click="sort('category-d')"
              :class="getSortClass('category-a')"
              ><i class="fas fa-sort-alpha-down-alt font-size-10 me-2"></i>Sort
              By Category</a
            >
            <a
              class="dropdown-item font-size-10"
              href="#"
              v-if="sortingParam != 'shop-a'"
              v-on:click="sort('shop-a')"
              :class="getSortClass('shop-d')"
              ><i class="fas fa-sort-alpha-down font-size-10 me-2"></i>Sort By
              Store Name</a
            >
            <a
              class="dropdown-item font-size-10"
              href="#"
              v-if="sortingParam == 'shop-a'"
              v-on:click="sort('shop-d')"
              :class="getSortClass('shop-a')"
              ><i class="fas fa-sort-alpha-down-alt font-size-10 me-2"></i>Sort
              By Store Name</a
            >
            <a
              class="dropdown-item font-size-10"
              href="#"
              v-if="sortingParam != 'amount-a'"
              v-on:click="sort('amount-a')"
              :class="getSortClass('amount-d')"
              ><i class="fas fa-sort-alpha-down font-size-10 me-2"></i>Sort By
              Amount</a
            >
            <a
              class="dropdown-item font-size-10"
              href="#"
              v-if="sortingParam == 'amount-a'"
              v-on:click="sort('amount-d')"
              :class="getSortClass('amount-a')"
              ><i class="fas fa-sort-alpha-down-alt font-size-10 me-2"></i>Sort
              By Amount</a
            >
            <a
              class="dropdown-item font-size-10"
              href="#"
              v-if="sortingParam != 'timestamp-a'"
              v-on:click="sort('timestamp-a')"
              :class="getSortClass('timestamp-d')"
              ><i class="fas fa-sort-alpha-down font-size-10 me-2"></i>Sort By
              Timestamp</a
            >
            <a
              class="dropdown-item font-size-10"
              href="#"
              v-if="sortingParam == 'timestamp-a'"
              v-on:click="sort('timestamp-d')"
              :class="getSortClass('timestamp-a')"
              ><i class="fas fa-sort-alpha-down-alt font-size-10 me-2"></i>Sort
              By Timestamp</a
            >
          </div>
        </div>
        <div class="ms-2 mb-2">
          <button class="btn btn-sm btn-primary" @click="notify">
            <i class="mdi mdi-file-refresh-outline me-1"></i>Reload
          </button>
        </div>
        <div class="ms-2 mb-2">
          <button
            class="btn btn-sm btn-outline-primary"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#addExpenseModal"
            @click="addExpense"
          >
            <i class="fas fa-plus me-1"></i>Add Expense
          </button>
        </div>
      </div>
    </div>
    <div
      id="addExpenseModal"
      class="modal fade"
      data-bs-backdrop="false"
      tabindex="-1"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg bg-light">
        <div class="modal-content bg-light px-5">
          <div class="modal-header bg-light">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body bg-light">
            <div>
              <h5 class="font-size-16 text-primary mb-4">Add Expense</h5>
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
  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style lang="scss">
.dp__input {
  background-color: var(--dp-background-color);
  border-radius: var(--dp-border-radius);
  font-family: var(--dp-font-family);
  border: 1px solid var(--dp-border-color);
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  font-size: 11px;
  line-height: calc(var(--dp-font-size) * 1.5);
  padding: var(--dp-input-padding);
  padding-left: 35px;
  color: var(--dp-text-color);
  box-sizing: border-box;
}
.dp__input_icons {
  display: inline-block;
  width: 12px;
  height: 12px;
  stroke-width: 0;
  font-size: 12px;
  line-height: calc(12px * 1.5);
  padding: 6px 12px;
  color: var(--dp-icon-color);
  box-sizing: content-box;
}

.multiselect,
.multiselect__input,
.multiselect__single {
  font-family: inherit;
  font-size: 12px;
  touch-action: manipulation;
}
.multiselect__option--highlight {
  outline: #1f1e6a;
  background: #f3f3f3;
  color: #9a1d22;
}

.multiselect__option--highlight::after {
  content: attr(data-select);
  background: #f3f3f3;
  color: #9a1d22;
}
.multiselect__tag {
  position: relative;
  display: inline-block;
  padding: 4px 26px 4px 10px;
  border-radius: 5px;
  margin-right: 10px;
  color: #9a1d22;
  background: #f3f3f3;
  line-height: 1;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
}
.multiselect__option--selected {
  background: #f3f3f3;
  color: #9a1d22;
  font-weight: bold;
}
.multiselect__option--selected.multiselect__option--highlight {
  background: #fff;
  color: #9a1d22;
}
.multiselect__tags {
  min-height: 40px;
  display: block;
  padding: 8px 40px 0 8px;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-size: 12px;
}

.multiselect__option--selected.multiselect__option--highlight::after {
  background: #fff;
  color: #9a1d22;
  content: attr(data-deselect);
}
.multiselect__tag-icon {
  cursor: pointer;
  margin-left: 7px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-weight: 400;
  font-style: initial;
  width: 22px;
  text-align: center;
  line-height: 12px;
  transition: all 0.2s ease;
  border-radius: 5px;
  color: #fff;
}

.multiselect__tag-icon::after {
  content: "×";
  color: #9a1d22;
  font-size: 12px;
}
.multiselect__option--selected {
  color: #9a1d22;
  font-weight: 300;
}

.multiselect__option--selected::after {
  content: attr(data-selected);
  color: #9a1d22;
  background: inherit;
}

</style>
