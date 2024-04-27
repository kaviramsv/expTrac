import axios from "axios";
import { isProxy, toRaw } from "vue";
import router from "../../router";
const state = {
  // layoutMode: 'dark',
  expenses: [],
  pager: {},
  isLoadingExpenses: false,
  page: "",
  sum: 0,
  // //FILTER BOX FIELDS from backend
  categoryFields: [],
  shopFields: [],
  tagFields: [],
  spendForFields: [],
  cardNameFields: [],
  //selected filetrs
  selectedCategory: [],
  selectedShop: [],
  selectedTag: [],
  selectedSpendFor: [],
  selectedCardName: [],
  selectedDateFrom: [],
  selectedDateTo: [],
  sortingParam: "",
  //dashboard
  isLoadingDashboard: false,
  expensesEvent: [],
  expensesMonth: [],
  expensesStore: [],
  expensesCategory: [],
  expensesTotal: 0,
  expensesCard: [],
};

const getters = {
  getExpensesTotal: (state) => state.expensesTotal,
  getExpensesPerCard: (state) => state.expensesCard,
  getExpensesPerStore: (state) => state.expensesStore,
  getExpensesPerCategory: (state) => state.expensesCategory,
  getExpensesPerMonth: (state) => state.expensesMonth,
  getExpensesPerEvent: (state) => state.expensesEvent,
  getLoadingDashboard: (state) => state.isLoadingDashboard,
  getExpenses: (state) => state.expenses,
  getPager: (state) => state.pager,
  getLoadingExpenses: (state) => state.isLoadingExpenses,
  getPage: (state) => state.page,
  // //FILTER BOX FIELDS
  getCategoryFields: (state) => state.categoryFields,
  getShopFields: (state) => state.shopFields,
  getTagFields: (state) => state.tagFields,
  getSpendForFields: (state) => state.spendForFields,
  getCardNameFields: (state) => state.cardNameFields,
  // //SELECTED filter fields from Ui
  getSelectedCategory: (state) => state.selectedCategory,
  getSelectedShop: (state) => state.selectedShop,
  getSelectedTag: (state) => state.selectedTag,
  getSelectedCardName: (state) => state.selectedCardName,
  getSelectedSpendFor: (state) => state.selectedSpendFor,
  getSelectedDateFrom: (state) => state.selectedDateFrom,
  getSelectedDateTo: (state) => state.selectedDateTo,
  getSortingParam: (state) => state.sortingParam,
  getSum: (state) => state.sum,
  includeIssueBySearch: (state) => (anomaly) => {
    const flatten = (input) => {
      // console.log("anomaly", input);
      if (typeof input === "object") {
        return (
          Array.isArray(input) ? input : Object.values(input || "")
        ).reduce((acc, x) => acc.concat(flatten(x)), []);
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

  getFilteredExpenses: (state, getters) => {
    let filtered = [...state.expenses];

    return filtered.filter((expense) => getters.includeIssueBySearch(expense));
  },
};

const actions = {
  async fetchExpenses({ dispatch, commit, getters, rootGetters }) {
    // let url = process.env.VUE_APP_BACKEND_API + "expense?page=" + getters.getPage;
    let url = "http://localhost:3500/api/" + "expense?page=" + getters.getPage;
    let bodyParams = {
      ...(getters?.getSelectedCategory?.length && {
        category: getters?.getSelectedCategory,
      }),
      ...(getters?.getSelectedShop?.length && {
        shop: getters?.getSelectedShop,
      }),
      ...(getters?.getSelectedTag?.length && {
        tag: getters?.getSelectedTag,
      }),
      ...(getters?.getSelectedCardName?.length && {
        cardName: getters?.getSelectedCardName,
      }),
      ...(getters?.getSelectedSpendFor?.length && {
        spendFor: getters?.getSelectedSpendFor,
      }),
      ...(getters?.getSelectedDateFrom && {
        date1: getters?.getSelectedDateFrom,
      }),
      ...(getters?.getSelectedDateTo && { date2: getters?.getSelectedDateTo }),
      ...(getters?.getSortingParam && { sort: getters?.getSortingParam }),
    };
    console.log("url", url, bodyParams);
    // if (rootGetters.getIsAuthenticated) {
    try {
      commit("setLoadingExpenses", true);
      const response = await axios.post(url, bodyParams);
      console.log("EXPENSE list", response.data);
      commit("SET_EXPENSES", response.data.data.expense);
      commit("SET_PAGER", response.data.data.pager);
      commit("SET_SUM", response.data.data.sum);
      commit("setLoadingExpenses", false);
    } catch (error) {
      console.error(error);
      //commit("SET_ISSUES_FOR_DATE", []);

      // commit("setDeviceError", "Failed to load device data");
    }
    //}
  },

  async fetchFields({ dispatch, commit, getters, rootGetters }) {
    let url = "http://localhost:3500/api/" + "expense/fields";
    try {
      const response = await axios.get(url);
      commit("setLoadingExpenses", true);
      //console.log("fields", response.data.data);
      commit("SET_CATEGORY_FIELDS", response.data.data.category);
      commit("SET_SHOP_FIELDS", response.data.data.shop);
      commit("SET_TAG_FIELDS", response.data.data.tag);
      commit("SET_SPEND_FOR_FIELDS", response.data.data.spendFor);
      commit("SET_CARD_NAME_FIELDS", response.data.data.cardName);
      commit("setLoadingExpenses", false);
      //console.log("inci thres", data);
    } catch (error) {
      //commit("SET_ISSUES", []);
      console.error(error);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchExpensesPerEvent(
    { dispatch, commit, getters, rootGetters },
    { month, year }
  ) {
    //console.log("rg", typeof rootGetters.getOrgId);

    let url = "http://localhost:3500/api/" + "expense/event";
    let bodyParams = { month, year };
    console.log("body params", url, bodyParams);
    try {
      commit("setLoadingDashboard", true);
      const response = await axios.post(url, bodyParams);
      console.log("expenses per event:", response.data.data.expense);
      commit("SET_EXPENSES_PER_EVENT", response.data.data.expense);
      commit("setLoadingDashboard", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchExpensesPerMonth(
    { dispatch, commit, getters, rootGetters },
    { month, year }
  ) {
    //console.log("rg", typeof rootGetters.getOrgId);

    let url = "http://localhost:3500/api/" + "expense/day";
    let bodyParams = { month, year };
    console.log("body params", url, bodyParams);
    try {
      commit("setLoadingDashboard", true);
      const response = await axios.post(url, bodyParams);
      console.log("expenses per month:", response.data.data.expense);
      commit("SET_EXPENSES_PER_MONTH", response.data.data.expense);
      commit("setLoadingDashboard", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchExpensesPerCategory(
    { dispatch, commit, getters, rootGetters },
    { month, year }
  ) {
    //console.log("rg", typeof rootGetters.getOrgId);

    let url = "http://localhost:3500/api/" + "expense/category";
    let bodyParams = { month, year };
    console.log("body params", url, bodyParams);
    try {
      commit("setLoadingDashboard", true);
      const response = await axios.post(url, bodyParams);
      console.log("expenses per category:", response.data.data.expense);
      commit("SET_EXPENSES_PER_CATEGORY", response.data.data.expense);
      commit("setLoadingDashboard", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchExpensesPerStore(
    { dispatch, commit, getters, rootGetters },
    { month, year }
  ) {
    //console.log("rg", typeof rootGetters.getOrgId);

    let url = "http://localhost:3500/api/" + "expense/store";
    let bodyParams = { month, year };
    console.log("body params", url, bodyParams);
    try {
      commit("setLoadingDashboard", true);
      const response = await axios.post(url, bodyParams);
      console.log("expenses per store:", response.data.data.expense);
      commit("SET_EXPENSES_PER_STORE", response.data.data.expense);
      commit("setLoadingDashboard", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchTotalExpensesforMonth(
    { dispatch, commit, getters, rootGetters },
    { month, year }
  ) {
    //console.log("rg", typeof rootGetters.getOrgId);

    let url = "http://localhost:3500/api/" + "expense/total";
    let bodyParams = { month, year };
    console.log("body params", url, bodyParams);
    try {
      commit("setLoadingDashboard", true);
      const response = await axios.post(url, bodyParams);
      console.log("expenses per store:", response.data.data.expense);
      commit("SET_EXPENSES_TOTAL", response.data.data.expense);
      commit("setLoadingDashboard", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async fetchExpensesPerCard(
    { dispatch, commit, getters, rootGetters },
    { month, year }
  ) {
    //console.log("rg", typeof rootGetters.getOrgId);

    let url = "http://localhost:3500/api/" + "expense/card";
    let bodyParams = { month, year };
    console.log("body params", url, bodyParams);
    try {
      commit("setLoadingDashboard", true);
      const response = await axios.post(url, bodyParams);
      console.log("expenses per card:", response.data.data.expense);
      commit("SET_EXPENSES_PER_CARD", response.data.data.expense);
      commit("setLoadingDashboard", false);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
};
const mutations = {
  SET_EXPENSES_TOTAL(state, expenses) {
    state.expensesTotal = expenses;
  },
  SET_EXPENSES_PER_CARD(state, expenses) {
    state.expensesCard = expenses;
  },
  SET_EXPENSES_PER_STORE(state, expenses) {
    state.expensesStore = expenses;
  },
  SET_EXPENSES_PER_CATEGORY(state, expenses) {
    state.expensesCategory = expenses;
  },
  SET_EXPENSES_PER_MONTH(state, expenses) {
    state.expensesMonth = expenses;
  },
  SET_EXPENSES_PER_EVENT(state, expenses) {
    state.expensesEvent = expenses;
  },
  SET_EXPENSES(state, expenses) {
    state.expenses = expenses;
  },
  setLoadingExpenses(state, bool) {
    state.isLoadingExpenses = bool;
  },
  setLoadingDashboard(state, bool) {
    state.isLoadingDashboard = bool;
  },
  SET_PAGER(state, pager) {
    state.pager = pager;
  },
  SET_PAGE(state, page) {
    state.page = page;
  },
  SET_SUM(state, sum) {
    state.sum = sum;
  },
  // //fields-api-for filters
  SET_CATEGORY_FIELDS(state, categoryFields) {
    state.categoryFields = categoryFields;
  },
  SET_SHOP_FIELDS(state, shopFields) {
    state.shopFields = shopFields;
  },
  SET_TAG_FIELDS(state, tagFields) {
    state.tagFields = tagFields;
  },
  SET_SPEND_FOR_FIELDS(state, spendForFields) {
    state.spendForFields = spendForFields;
  },
  SET_CARD_NAME_FIELDS(state, cardNameFields) {
    state.cardNameFields = cardNameFields;
  },
  //selected filters
  SET_SELECTED_CATEGORY(state, category) {
    state.selectedCategory = category;
  },
  SET_SELECTED_SHOP(state, shop) {
    state.selectedShop = shop;
  },
  SET_SELECTED_TAG(state, tag) {
    state.selectedTag = tag;
  },
  SET_SELECTED_SPEND_FOR(state, spendFor) {
    state.selectedSpendFor = spendFor;
  },
  SET_SELECTED_CARD_NAME(state, cardName) {
    state.selectedCardName = cardName;
  },
  SET_SELECTED_DATE_FROM(state, date1) {
    state.selectedDateFrom = date1;
  },
  SET_SELECTED_DATE_TO(state, date2) {
    state.selectedDateTo = date2;
  },
  SET_SORTING_PARAM(state, param) {
    state.sortingParam = param;
    //console.log("sorting Param", state.sortingParam);
  },
  // //search input
  // SET_INPUT_VALUE(state, searchInput) {
  // 	//console.log("search Input", searchInput);
  // 	state.searchInputValue = searchInput;
  // },

  // SET_SELECTED_DEVICE_ID(state, deviceId) {
  // 	state.selectedDeviceId = deviceId;
  // },
  // SET_SELECTED_DEVICE_NAME(state, deviceName) {
  // 	state.selectedDeviceName = deviceName;
  // },
  // SET_SELECTED_SENSOR_NAME(state, sensorName) {
  // 	state.selectedSensorName = sensorName;
  // },
  // SET_SELECTED_STATUS(state, status) {
  // 	state.selectedStatus = status;
  // },

  // SET_NOTIFIED(state, id) {
  // 	state.notified.push(id);
  // },
  // SET_PAGER(state, pager) {
  // 	state.pager = pager;
  // },
  // SET_PAGE(state, page) {
  // 	state.page = page;
  // },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
