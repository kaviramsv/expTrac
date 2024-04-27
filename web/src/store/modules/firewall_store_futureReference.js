import axios from "axios";

const state = {
  firewalls: [],
};

const getters = {
  getFirewalls(state) {
    return state.firewalls;
  },
  getCountDevices(state) {
    return state.firewalls.length;
  },
};
const actions = {
  async fetchFirewalls({ dispatch, commit, getters, rootGetters }) {
    console.log("rg", typeof rootGetters.getOrgId);
    let url = process.env.VUE_APP_DEVICES_ENDPOINT + rootGetters.getOrgId;

    try {
      //   const response = await axios.get(url);
      //   console.log("API response devices :", response.data.data.devices);
      //   commit("setDevices", response.data.data.devices);
      const data = [
        {
          _id: 1,
          name: "Firewall Policy - Ottawa",
          description: "Firewall Policy for location Ottawa ",
          appliedTo: {
            devices: [
              {
                deviceName: "MCIX8M-EVKA",
                location: "Ottawa",
                type: "HVAC - 1",
                os: "3.3",
                fw: "2.3",
                hw: "1.2.3",
              },
              {
                deviceName: "MCIX8M-EVKE",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.2",
                fw: "2.5",
                hw: "1.2.3",
              },
              {
                deviceName: "MCIX8M-EVKF",
                location: "Ottawa ",
                type: "HVAC - 1",
                os: "3.3",
                fw: "2.4",
                hw: "1.2.2",
              },
              {
                deviceName: "MCIX8M-EVKB",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.4",
                fw: "2.3",
                hw: "1.2.3",
              },

              {
                deviceName: "MCIX8M-EVKA",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.5",
                fw: "2.5",
                hw: "1.2.4",
              },
              {
                deviceName: "MCIX8M-EVKE",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.4",
                fw: "2.6",
                hw: "1.2.2",
              },
              {
                deviceName: "MCIX8M-EVKF",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.4",
                fw: "2.3",
                hw: "1.2.3",
              },
              {
                deviceName: "MCIX8M-EVKB",
                location: "Ottawa",
                type: "HVAC - 1",
                os: "3.4",
                fw: "2.3",
                hw: "1.2.5",
              },
            ],
            deviceGroups: [
              {
                name: "Devices Toronto",

                type: "HVAC - 1",
              },

              {
                name: "HVAC 3 Devices",

                type: "HVAC - 3",
              },
            ],
          },
          rules: {
            ingress: [
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
            ],
            egress: [
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "65535",
                destinationIP: "19.7.8.3/0",
                destinationPort: "*",
              },
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
            ],
          },
        },
        {
          _id: 2,
          name: "Firewall Policy - Toronto",
          description: "Firewall Policy for location Ottawa ",
          appliedTo: {
            devices: [
              {
                deviceName: "MCIX8M-EVKA",
                location: "Ottawa",
                type: "HVAC - 1",
                os: "3.3",
                fw: "2.3",
                hw: "1.2.3",
              },
              {
                deviceName: "MCIX8M-EVKE",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.2",
                fw: "2.5",
                hw: "1.2.3",
              },
              {
                deviceName: "MCIX8M-EVKF",
                location: "Ottawa ",
                type: "HVAC - 1",
                os: "3.3",
                fw: "2.4",
                hw: "1.2.2",
              },
              {
                deviceName: "MCIX8M-EVKB",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.4",
                fw: "2.3",
                hw: "1.2.3",
              },

              {
                deviceName: "MCIX8M-EVKA",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.5",
                fw: "2.5",
                hw: "1.2.4",
              },
              {
                deviceName: "MCIX8M-EVKE",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.4",
                fw: "2.6",
                hw: "1.2.2",
              },
              {
                deviceName: "MCIX8M-EVKF",
                location: "Toronto",
                type: "HVAC - 1",
                os: "3.4",
                fw: "2.3",
                hw: "1.2.3",
              },
              {
                deviceName: "MCIX8M-EVKB",
                location: "Ottawa",
                type: "HVAC - 1",
                os: "3.4",
                fw: "2.3",
                hw: "1.2.5",
              },
            ],
            deviceGroups: [
              {
                name: "Devices Toronto",

                type: "HVAC - 1",
              },

              {
                name: "HVAC 3 Devices",

                type: "HVAC - 3",
              },
            ],
          },
          rules: {
            ingress: [
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
            ],
            egress: [
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "65535",
                destinationIP: "19.7.8.3/0",
                destinationPort: "*",
              },
              {
                protocol: "TCP",
                sourceIP: "192.168.7.0/0",
                sourcePort: "20",
                destinationIP: "19.7.8.3/0",
                destinationPort: "30",
              },
            ],
          },
        },
      ];
      const uid = function () {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
      };
      //add additional id fields to each of ingress egress rules to track ingress and egress fields
      let modifiedData = data.map((obj) => ({
        ...obj,
        rules: {
          ingress: [...obj.rules.ingress.map((ingObject) => ({ ...ingObject, id: uid() }))],
          egress: [...obj.rules.egress.map((egObject) => ({ ...egObject, id: uid() }))],
        },
      }));

      console.log("filtered", modifiedData);
      commit("setFirewalls", modifiedData);
    } catch (error) {
      console.error(error.response.data);
      // commit("setDeviceError", "Failed to load device data");
    }
  },

  async updateIngress({ dispatch, commit, getters, rootGetters }, ingressRule) {
    console.log("In store ingress", ingressRule);
    let newIngress = {
      protocol: ingressRule.selectedProtocol,
      sourceIP: ingressRule.sourceIP,
      sourcePort: ingressRule.sourcePort,
      destinationIP: ingressRule.destinationIP,
      destinationPort: ingressRule.destinationPort,
      sourceNet: ingressRule.sourceNet,
      destinationNet: ingressRule.destinationNet,
    };
    const obj = getters.getFirewalls.find((firewall) => firewall._id === ingressRule.firewallId);
    console.log(obj);
    //check if a similar record exists in ingress table
    const upd = { ...obj, rules: { ...obj.rules, ingress: [...obj.rules.ingress, newIngress] } };
    console.log("upd", upd);
  },

  async updateEgress({ dispatch, commit, getters, rootGetters }, egressRule) {
    console.log("In store egress", egressRule);
    let newEgress = {
      protocol: egressRule.selectedProtocol,
      sourceIP: egressRule.sourceIP,
      sourcePort: egressRule.sourcePort,
      destinationIP: egressRule.destinationIP,
      destinationPort: egressRule.destinationPort,
      sourceNet: egressRule.sourceNet,
      destinationNet: egressRule.destinationNet,
    };

    //destructure and remove ids from ingress and egress
    let restoredData = getters.getFirewalls.map((obj) => ({
      ...obj,
      rules: {
        ingress: [...obj.rules.ingress.map(({ id, ...ingObject }) => ({ ingObject }))],
        egress: [...obj.rules.egress.map(({ id, ...egObject }) => ({ egObject }))],
      },
    }));
    //find the firewall id where egress has to be added
    const obj = restoredData.find((firewall) => firewall._id === egressRule.firewallId);
    console.log(obj);
    //check if a similar record exists in egress table

    //add the new ingress
    const upd = { ...obj, rules: { ...obj.rules, egress: [...obj.rules.egress, newEgress] } };
    console.log("upd", upd);
    const rules = { rules: { ...obj.rules, egress: [...obj.rules.egress, newEgress] } };
    console.log("upd", rules);
    //api
  },
};

const mutations = {
  setFirewalls(state, firewalls) {
    state.firewalls = firewalls;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
