import router from "../../router";
import axios from "axios";
import { useToast } from "vue-toastification";
import { toRaw } from "vue";

const toast = useToast();
//1. should auth module be name spaced??
const state = {
  emails: [],
  addSuccess: false,
};

const getters = {
  getEmails(state) {
    return state.emails;
  },
  getAddSuccess(state) {
    return state.addSuccess;
  },
};
const actions = {
  async fetchEmails({ dispatch, commit, getters, rootGetters }) {
    let url = process.env.VUE_APP_BACKEND_API + "contact/";
    try {
      const response = await axios.get(url);

      let emails = response.data.data.mails;

      commit("setEmails", emails);
    } catch (error) {
      console.error(error);
      // commit("setDeviceError", "Failed to load device data");
    }
  },
  async postEmails({ dispatch, commit, getters, rootGetters }, contactDetails) {
    console.log("contact,", contactDetails);
    let copyList = [...getters.getEmails];
    console.log("copylist", copyList);
    const i = copyList.findIndex((item) => item.email == contactDetails.email);
    console.log("i", i);
    // document.getElementById(contactDetails.addModal).click();
    if (i >= 0) {
      //if duplicate exists
      toast.warning("Email Already Exists, Please Modify", {
        position: "top-right",
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: "fa fa-exclamation-circle",
        rtl: false,
      });
    } else {
      let data = {
        name: contactDetails.name.trim(),
        email: contactDetails.email.trim(),
      };
      let url = process.env.VUE_APP_BACKEND_API + "contact/";
      try {
        const response = await axios.post(url, data);
        if (response.data.success) {
          console.log(
            "ADDED DATA",
            response.data.data,
            toRaw(response.data.data.data.newContactId)
          );
          let id = response.data.data.data.newContactId;
          let emails = [...getters.getEmails, { ...data, _id: id }];
          console.log("emails,emails");
          commit("setEmails", emails);
          toast.success("Successfully added new Contact to the Mailing", {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: "fa fa-check",
            rtl: false,
          });
          document.getElementById(contactDetails.addModal).click();
          commit("ADD_SUCCESS", true);
        }
      } catch (error) {
        console.log(error);
        toast.warning(error.response.data.message, {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: "fa fa-exclamation-circle",
          rtl: false,
        });
      }
    }
  },
  async deleteEmail(
    { dispatch, commit, getters, rootGetters },
    { emailId, instance }
  ) {
    console.log("contact,", emailId);
    instance
      .$swal({
        title: "Delete Email",
        text: "Are you sure want to delete this Email Address?",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "rgb(127, 131, 139)",
        confirmButtonColor: "rgb(245, 110, 110)",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
      })
      .then(async (result) => {
        console.log("result", result);
        if (result.value) {
          let url = process.env.VUE_APP_BACKEND_API + "contact/";
          try {
            const response = await axios.delete(url + emailId);
            if (response.data.success) {
              let emails = [...getters.getEmails];
              const emailIndex = emails.findIndex(
                (item) => item._id == emailId
              );
              emails.splice(emailIndex, 1);
              commit("setEmails", emails);
              toast.success("Delete Successful", {
                position: "top-right",
                timeout: 5000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                draggable: true,
                draggablePercent: 0.6,
                showCloseButtonOnHover: false,
                hideProgressBar: true,
                closeButton: "button",
                icon: "fa fa-check",
                rtl: false,
              });
            }
          } catch (error) {
            console.error(error);
            // commit("setDeviceError", "Failed to load device data");
          }
        }
      });
  },
};
const mutations = {
  setEmails(state, emails) {
    state.emails = emails;
  },
  ADD_SUCCESS(state, bool) {
    state.addSuccess = bool;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
//5. any best practises to be followed?naming conventions
//6.error handling best practises??
