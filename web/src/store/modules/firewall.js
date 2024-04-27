import { useToast } from "vue-toastification";
import axios from "axios";
const toast = useToast();
import router from "../../router";

const state = {
  firewalls: [],
  duplicateError: "",
  // showSuccess: false,
};

const getters = {
  getFirewalls(state) {
    return state.firewalls;
  },
  getIngressCountFirewalls(state) {
    console.log(state.firewalls.ingressRules);
    return state.firewalls[0].ingressRules.length;
  },
  getEgressCountFirewalls(state) {
    console.log(state.firewalls.egressRules);
    return state.firewalls[0].egressRules.length;
  },
  getDuplicateError(state) {
    return state.duplicateError;
  },
  getShowSuccess(state) {
    return state.showSuccess;
  },
};
const actions = {
  async fetchFirewalls({ dispatch, commit, getters, rootGetters }) {
    console.log("rg", typeof rootGetters.getOrgId);

    let url = process.env.VUE_APP_BACKEND_API + "firewall/byorg/" + rootGetters.getOrgId;
    console.log("get endpoint", url);
    try {
      const response = await axios.get(url);
      console.log("API response firewall :", response.data.data.firewalls);
      let data = response.data.data.firewalls;
      const uid = function () {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
      };

      //add additional id fields to each of ingress egress rules to track ingress and egress fields
      let modifiedData = data.map((obj) => ({
        ...obj,
        ingressRules: [...obj.ingressRules.map((ruleObject) => ({ ...ruleObject, id: uid() }))],
        egressRules: [...obj.egressRules.map((ruleObject) => ({ ...ruleObject, id: uid() }))],
      }));

      console.log("filtered", modifiedData);
      commit("setFirewalls", modifiedData);
    } catch (error) {
      console.error(error);
      // commit("setDeviceError", "Failed to load device data");
    }
  },

  // async updateIngress({ dispatch, commit, getters, rootGetters }, ingressRule) {
  //   console.log("In store ingress", ingressRule);
  //   let newIngress = {
  //     protocol: ingressRule.selectedProtocol,
  //     sourceIP: ingressRule.sourceIP,
  //     sourcePort: ingressRule.sourcePort,
  //     destinationIP: ingressRule.destinationIP,
  //     destinationPort: ingressRule.destinationPort,
  //     sourceNet: ingressRule.sourceNet,
  //     destinationNet: ingressRule.destinationNet,
  //   };
  //   const obj = getters.getFirewalls.find((firewall) => firewall._id === ingressRule.firewallId);
  //   console.log(obj);
  //   //check if a similar record exists in ingress table
  //   // const upd = { ...obj, rules: { ...obj.rules, ingress: [...obj.rules.ingress, newIngress] } };
  //   // console.log("upd", upd);
  // },

  async addIngress({ dispatch, commit, getters, rootGetters }, addedRule) {
    console.log("In store INgress", addedRule, typeof addedRule.destinationPort);
    let newRule = {
      protocol: addedRule.protocol,
      sourceIP: addedRule.sourceIP,
      sourcePort: addedRule.sourcePort,
      destinationIP: addedRule.destinationIP,
      destinationPort: addedRule.destinationPort,
      action: addedRule.action,
    };
    if (addedRule.description && addedRule.description.trim().length > 0) {
      newRule.description = addedRule.description;
    }
    //destructure and remove ids from RULES
    let restoredData = getters.getFirewalls.map((obj) => ({
      ...obj,
      ingressRules: [...obj.ingressRules.map(({ id, ...item }) => ({ ...item }))],
    }));
    console.log("restoredData", restoredData);
    //find the firewall obj where RULE has to be added
    const obj = restoredData.find((firewall) => firewall._id === addedRule.firewallId);
    console.log(obj);

    //check if a similar record exists in table
    // const i = obj.ingressRules.findIndex(
    //   (ruleObject) =>
    //     ruleObject.sourceIP == addedRule.sourceIP &&
    //     ruleObject.sourcePort == addedRule.sourcePort &&
    //     ruleObject.destinationIP == addedRule.destinationIP &&
    //     ruleObject.destinationPort == addedRule.destinationPort
    // );
    // console.log("duplicate exist at", i);
    // //for accessing error from form
    // if (i > -1) {
    //   commit(
    //     "setDuplicateError",
    //     `Same Rule Already Exists!Please Refer Row ${i + 1} of the Ingress Rules Table.`
    //   );
    // }

    //add the entire new firewall object
    // const upd = { ...obj, rules: [...obj.rules, newRule] };

    //updatedRules

    let updIngressRules;

    if (addedRule.command === "APPEND") {
      updIngressRules = [...obj.ingressRules, newRule];
      console.log("upd", updIngressRules, "userid", rootGetters.getUserId);
    } else {
      updIngressRules = [newRule, ...obj.ingressRules];
    }

    let jsonCommand = {
      cmd: addedRule.command,
      chain: "INPUT",
      action: addedRule.action,
      ...(addedRule.sourceIP != "0.0.0.0/0" && { saddr: addedRule.sourceIP }),
      ...(addedRule.sourcePort != "*" && { sport: Number(addedRule.sourcePort) }),
      ...(addedRule.destinationIP != "0.0.0.0/0" && { daddr: addedRule.destinationIP }),
      ...(addedRule.destinationPort != "*" && { dport: Number(addedRule.destinationPort) }),
      ...(addedRule.protocol != "ALL" && { proto: addedRule.protocol }),
    };

    console.log("json", jsonCommand);

    const data = {
      ingressRules: updIngressRules,
      actionBy: rootGetters.getUserId,
      commandToSendToDevice: jsonCommand,
    };

    console.log("data", data);

    //if no duplicate records

    // if (i <= -1) {
    let url = process.env.VUE_APP_BACKEND_API + "firewall" + "/" + addedRule.firewallId;
    console.log("firewall add,", url);
    try {
      const response = await axios.put(url, data);
      console.log("FROM API", response.data);
      //find the firewall to be changed
      const obj = getters.getFirewalls.find((firewall) => firewall._id === addedRule.firewallId);
      console.log(obj);
      //modify the firewall -by adding new rule
      newRule.id = Date.now().toString(36) + Math.random().toString(36).substring(2);

      let rulesObject;
      if (addedRule.command === "APPEND") {
        rulesObject = {
          ...obj,
          ingressRules: [...obj.ingressRules, newRule],
        };
      } else {
        rulesObject = {
          ...obj,
          ingressRules: [newRule, ...obj.ingressRules],
        };
      }

      //find the firewalls to be retained
      const firewalls_unmodified = getters.getFirewalls.filter(
        (firewall) => firewall._id != addedRule.firewallId
      );
      //concatenate = combine old+ new
      const newFws = [...firewalls_unmodified, rulesObject];

      console.log("newfws", newFws);

      // commit("setShowSuccess", true);

      //if success
      //1.close modal
      //2.commit firewalls
      //3.show success toast
      document.getElementById(addedRule.modalID).click();
      // router.go();=========================================check if we need this
      commit("setFirewalls", newFws);
      toast.success("Successfully added new Rule", {
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

      // router.push("/firewall");
      //if no error-
      // a.show success toast  b.route to same page
      //handle error?=show toast
      //handle success?=show toast
    } catch (error) {
      commit("setDuplicateError", `Server Error!`);

      console.log("fw err:", error.response);
    }
    // }
  },
  async addEgress({ dispatch, commit, getters, rootGetters }, addedRule) {
    console.log("In store egress", addedRule, typeof addedRule.destinationPort);
    let newRule = {
      protocol: addedRule.protocol,
      sourceIP: addedRule.sourceIP,
      sourcePort: addedRule.sourcePort,
      destinationIP: addedRule.destinationIP,
      destinationPort: addedRule.destinationPort,
      action: addedRule.action,
    };
    if (addedRule.description && addedRule.description.trim().length > 0) {
      newRule.description = addedRule.description;
    }
    //destructure and remove ids from RULES
    let restoredData = getters.getFirewalls.map((obj) => ({
      ...obj,
      egressRules: [...obj.egressRules.map(({ id, ...item }) => ({ ...item }))],
    }));
    console.log("restoredData", restoredData);
    //find the firewall obj where RULE has to be added
    const obj = restoredData.find((firewall) => firewall._id === addedRule.firewallId);
    console.log(obj);

    //check if a similar record exists in table--do not delete
    // const i = obj.egressRules.findIndex(
    //   (ruleObject) =>
    //     ruleObject.sourceIP == addedRule.sourceIP &&
    //     ruleObject.sourcePort == addedRule.sourcePort &&
    //     ruleObject.destinationIP == addedRule.destinationIP &&
    //     ruleObject.destinationPort == addedRule.destinationPort
    // );
    // console.log("duplicate exist at", i);
    // //for accessing error from form
    // if (i > -1) {
    //   commit(
    //     "setDuplicateError",
    //     `Same Rule Already Exists!Please Refer Row ${i + 1} of the Egress Rules Table.`
    //   );
    // }

    //add the entire new firewall object
    // const upd = { ...obj, rules: [...obj.rules, newRule] };

    //updatedRules

    let updEgressRules;

    if (addedRule.command === "APPEND") {
      updEgressRules = [...obj.egressRules, newRule];
      console.log("upd", updEgressRules, "userid", rootGetters.getUserId);
    } else {
      updEgressRules = [newRule, ...obj.egressRules];
    }

    let jsonCommand = {
      cmd: addedRule.command,
      chain: "OUTPUT",
      action: addedRule.action,
      ...(addedRule.sourceIP != "0.0.0.0/0" && { saddr: addedRule.sourceIP }),
      ...(addedRule.sourcePort != "*" && { sport: Number(addedRule.sourcePort) }),
      ...(addedRule.destinationIP != "0.0.0.0/0" && { daddr: addedRule.destinationIP }),
      ...(addedRule.destinationPort != "*" && { dport: Number(addedRule.destinationPort) }),
      ...(addedRule.protocol != "ALL" && { proto: addedRule.protocol }),
    };

    console.log("json", jsonCommand);

    const data = {
      egressRules: updEgressRules,
      actionBy: rootGetters.getUserId,
      commandToSendToDevice: jsonCommand,
    };

    console.log("data", data);

    //if no duplicate records

    // if (i <= -1) {

    let url = process.env.VUE_APP_BACKEND_API + "firewall" + "/" + addedRule.firewallId;
    console.log("firewall add,", url);
    try {
      const response = await axios.put(url, data);
      console.log("FROM API", response.data);
      //find the firewall to be changed
      const obj = getters.getFirewalls.find((firewall) => firewall._id === addedRule.firewallId);
      console.log(obj);
      //modify the firewall -by adding new rule
      newRule.id = Date.now().toString(36) + Math.random().toString(36).substring(2);

      let rulesObject;
      if (addedRule.command === "APPEND") {
        rulesObject = {
          ...obj,
          egressRules: [...obj.egressRules, newRule],
        };
      } else {
        rulesObject = {
          ...obj,
          egressRules: [newRule, ...obj.egressRules],
        };
      }

      //find the firewalls to be retained
      const firewalls_unmodified = getters.getFirewalls.filter(
        (firewall) => firewall._id != addedRule.firewallId
      );
      //concatenate = combine old+ new
      const newFws = [...firewalls_unmodified, rulesObject];

      console.log("newfws", newFws);

      // commit("setShowSuccess", true);

      //if success
      //1.close modal
      //2.commit firewalls
      //3.show success toast
      document.getElementById(addedRule.modalID).click();
      // router.go();=========================================check if we need this
      commit("setFirewalls", newFws);
      toast.success("Successfully added new Rule", {
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

      // router.push("/firewall");
      //if no error-
      // a.show success toast  b.route to same page
      //handle error?=show toast
      //handle success?=show toast
    } catch (error) {
      commit("setDuplicateError", `Server Error!`);

      console.log("fw err:", error.response);
    }
    // }
  },
  // async editIngress({ dispatch, commit, getters, rootGetters }, editedRule) {
  //   console.log("edited", editedRule);
  //   let newRule = {
  //     protocol: editedRule.selectedProtocol,
  //     sourceIP: editedRule.sourceIP,
  //     sourcePort: editedRule.sourcePort,
  //     destinationIP: editedRule.destinationIP,
  //     destinationPort: editedRule.destinationPort,
  //     sourceCIDR: editedRule.sourceNet,
  //     destinationCIDR: editedRule.destinationNet,
  //     description: editedRule.description,
  //   };
  //   console.log("newRule", newRule, editedRule.index);
  //   //find the firewall obj where RULE has to be added
  //   const obj = getters.getFirewalls.find((firewall) => firewall._id === editedRule.firewallId);
  //   console.log("obj", obj);
  //   //find index to be inserted
  //   const indexOfRule = obj.rules.findIndex((rule) => rule.id === editedRule.id);
  //   console.log("indexOfRule", indexOfRule);
  //   //find the rulesToBeRetained = id not equal to ruleIds
  //   const newRulesArray = obj.rules
  //     .filter((rule) => rule.id != editedRule.id)
  //     .map(({ id, ...item }) => ({ ...item }));
  //   console.log("rules not to be modified", newRulesArray);

  //   //check if a similar record exists in table=among rest of rules
  //   const rest = obj.rules.filter((rule) => rule.id != editedRule.id);
  //   console.log("rest", rest);
  //   const i = obj.rules
  //     .filter((rule) => rule.id != editedRule.id)
  //     .findIndex(
  //       (ruleObject) =>
  //         ruleObject.protocol == editedRule.selectedProtocol &&
  //         ruleObject.sourceIP == editedRule.sourceIP &&
  //         ruleObject.sourcePort == editedRule.sourcePort &&
  //         ruleObject.sourceCIDR == editedRule.sourceNet &&
  //         ruleObject.destinationIP == editedRule.destinationIP &&
  //         ruleObject.destinationPort == editedRule.destinationPort &&
  //         ruleObject.destinationCIDR == editedRule.destinationNet
  //     );
  //   console.log("duplicate exist at", i);

  //   if (i > -1) {
  //     commit(
  //       "setDuplicateError",
  //       `Same Rule Already Exists !Please Refer the row ${i + 1} of the Rules Table.`
  //     );
  //   }

  //   newRulesArray.splice(indexOfRule, 0, newRule);

  //   console.log("neweditedRulesArray", newRulesArray);
  //   //updated rules
  //   const data = {
  //     rules: newRulesArray,
  //     actionBy: rootGetters.getUserId,
  //   };

  //   console.log("data", data);
  //   if (i <= -1) {
  //     let url = process.env.VUE_APP_FIREWALL_UPDATE_ENDPOINT + editedRule.firewallId;
  //     try {
  //       const response = await axios.put(url, data);
  //       console.log("FROM API", response.data);

  //       //if success
  //       //1.close modal
  //       //2.commit firewalls
  //       //3.show success toast
  //       document.getElementById(editedRule.modalID).click();
  //       // commit("setFirewalls", newFws);

  //       router.go();
  //       toast.success("Successfully added new Rule", {
  //         position: "top-right",
  //         timeout: 5000,
  //         closeOnClick: true,
  //         pauseOnFocusLoss: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         draggablePercent: 0.6,
  //         showCloseButtonOnHover: false,
  //         hideProgressBar: true,
  //         closeButton: "button",
  //         icon: "fa fa-check",
  //         rtl: false,
  //       });
  //     } catch (error) {
  //       commit("setDuplicateError", `Server Error!`);
  //       console.log("fw err:", error.response);
  //     }
  //   } //if
  // },
  async deleteEgress(
    { dispatch, commit, getters, rootGetters },
    { ruleId, fwId, instance, ruleNumber, fw }
  ) {
    console.log("to be deleted", ruleId, fwId);
    console.log("rulenumber to be deleted ", ruleNumber);

    //find the firewall obj where RULE has to be deleted
    const obj = getters.getFirewalls.find((firewall) => firewall._id === fwId);
    console.log("firewall obj", obj);

    //Remove the rule which is clicked;Retain the other ones
    const newRules = obj.egressRules
      .filter((rule) => rule.id != ruleId)
      .map(({ id, ...item }) => ({ ...item }));
    console.log("Modified Rules", newRules);

    let jsonCommand = {
      cmd: "DELETE",
      chain: "OUTPUT",
      action: fw.action,
      ...(fw.sourceIP != "0.0.0.0/0" && { saddr: fw.sourceIP }),
      ...(fw.sourcePort != "*" && { sport: Number(fw.sourcePort) }),
      ...(fw.destinationIP != "0.0.0.0/0" && { daddr: fw.destinationIP }),
      ...(fw.destinationPort != "*" && { dport: Number(fw.destinationPort) }),
      ...(fw.protocol != "ALL" && { proto: fw.protocol }),
    };

    let url = process.env.VUE_APP_BACKEND_API + "firewall" + "/" + fwId;
    console.log("firewall del eg,", url);
    const data = {
      egressRules: newRules,
      actionBy: rootGetters.getUserId,
      commandToSendToDevice: jsonCommand,
    };

    instance
      .$swal({
        title: "Delete Egress",
        text: "Are you sure want to delete this Egress Rule?",
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
          try {
            const response = await dispatch("deleteRule", { url, data, ruleId, fwId });
            const fwObj = getters.getFirewalls.find((firewall) => firewall._id === fwId);
            console.log(obj);

            // //grab all the new rules
            const newRules = fwObj.egressRules.filter((rule) => rule.id != ruleId);

            // //modify the firewall -by adding new rules(removing the deleteted)
            const fwObj1 = {
              ...fwObj,
              egressRules: [...newRules],
            };
            const rest = getters.getFirewalls.filter((firewall) => firewall._id != fwId);

            // //concatenate = combine old+ new
            const newFws = [...rest, fwObj1];
            console.log("newfws", newFws);
            commit("setFirewalls", newFws);
            instance.$swal("Deleted!", "Rule has been deleted.", "success");
          } catch (err) {
            instance.$swal("Cancelled", "Rule could not be deleted", "error");
            console.log(err);
          }
        }
      });
  },
  async deleteIngress(
    { dispatch, commit, getters, rootGetters },
    { ruleId, fwId, instance, ruleNumber, fw }
  ) {
    console.log("to be deleted", ruleId, fwId);
    console.log("rulenumber to be deleted ", ruleNumber);

    //find the firewall obj where RULE has to be deleted
    const obj = getters.getFirewalls.find((firewall) => firewall._id === fwId);
    console.log("firewall obj", obj);

    //Remove the rule which is clicked;Retain the other ones
    const newRules = obj.ingressRules
      .filter((rule) => rule.id != ruleId)
      .map(({ id, ...item }) => ({ ...item }));
    console.log("Modified Rules", newRules);
    let jsonCommand = {
      cmd: "DELETE",
      chain: "INPUT",
      action: fw.action,
      ...(fw.sourceIP != "0.0.0.0/0" && { saddr: fw.sourceIP }),
      ...(fw.sourcePort != "*" && { sport: Number(fw.sourcePort) }),
      ...(fw.destinationIP != "0.0.0.0/0" && { daddr: fw.destinationIP }),
      ...(fw.destinationPort != "*" && { dport: Number(fw.destinationPort) }),
      ...(fw.protocol != "ALL" && { proto: fw.protocol }),
    };
    // let jsonCommand = {
    //   cmd: "DELETE",
    //   chain: "INPUT",
    //   rulenum: ruleNumber,
    // };

    let url = process.env.VUE_APP_BACKEND_API + "firewall" + "/" + fwId;

    const data = {
      ingressRules: newRules,
      actionBy: rootGetters.getUserId,
      commandToSendToDevice: jsonCommand,
    };

    instance
      .$swal({
        title: "Delete Ingress",
        text: "Are you sure want to delete this Ingress Rule?",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "rgb(127, 131, 139)",
        confirmButtonColor: "rgb(245, 110, 110)",
        confirmButtonText: "Confirm Delete",
        reverseButtons: true,
      })
      .then(async (result) => {
        console.log("result", result);
        if (result.value) {
          try {
            const response = await dispatch("deleteRule", { url, data, ruleId, fwId });
            const fwObj = getters.getFirewalls.find((firewall) => firewall._id === fwId);
            console.log(obj);

            // //grab all the new rules
            const newRules = fwObj.ingressRules.filter((rule) => rule.id != ruleId);

            // //modify the firewall -by adding new rules(removing the deleteted)
            const fwObj1 = {
              ...fwObj,
              ingressRules: [...newRules],
            };
            const rest = getters.getFirewalls.filter((firewall) => firewall._id != fwId);

            // //concatenate = combine old+ new
            const newFws = [...rest, fwObj1];
            console.log("newfws", newFws);
            commit("setFirewalls", newFws);
            instance.$swal("Deleted!", "Rule has been deleted.", "success");
          } catch (err) {
            instance.$swal("Cancelled", "Rule could not be deleted", "error");
            console.log(err);
          }
        }
      });
  },
  async deleteRule(
    { dispatch, commit, getters, rootGetters },
    { url, data, ruleId, fwId, modalID }
  ) {
    //--------------------TRY -CATCH
    try {
      const response = await axios.put(url, data);
      console.log("FROM API", response.data);
    } catch (error) {
      return Promise.reject(error);
    }
    //--------------------END T-C
  },
};

const mutations = {
  setFirewalls(state, firewalls) {
    state.firewalls = firewalls;
  },
  setDuplicateError(state, error) {
    state.duplicateError = error;
  },
  // setShowSuccess(state, value) {
  //   state.showSuccess = value;
  // },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
