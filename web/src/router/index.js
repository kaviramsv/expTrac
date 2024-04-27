// import { createRouter, createWebHistory } from "vue-router";

// const router = createRouter({
//   history: createWebHistory(),
//   routes: [
//     {
//       path: "/",
//       component: HomeView,
//     },
//     {
//       path: "/about",
//       component: AboutView,
//     },
//   ],
// });
// export default router;
import { createRouter, createWebHistory } from "vue-router";
import store from "../../src/store/index";
// import { PERMISSIONS } from "../lib/permissions";
import HomeView from "../views/pages/HomeView.vue";
import AboutView from "../views/pages/AboutView.vue";
const routes = [
  {
    path: "/home",
    component: HomeView,
  },
  {
    path: "/about",
    component: AboutView,
  },
  {
    path: "/",
    name: "Login",
    meta: {
      requiresGuest: true,
    },
    component: () => import("../views/pages/auth/loginView.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../views/pages/dashboard/dashboardView.vue"),
  },
  {
    path: "/expense",
    name: "Expense",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../views/pages/expense/expenseListView.vue"),
  },
  // {
  // 	path: "/mail",
  // 	name: "Mailing List1",
  // 	meta: {
  // 		requiresAuth: true,
  // 		// permissions: [PERMISSIONS.ORGADMIN.DASHBOARD.READ],
  // 	},
  // 	component: () => import("../views/pages/mail/mailingList.vue"),
  // },

  {
    path: "/resetPasswordFirstTime",
    name: "ChangePasswordFirstTime",

    meta: {
      requiresAuth: true,
      // permissions: [PERMISSIONS.ORGADMIN.DASHBOARD.READ],
    },
    component: () => import("../views/pages/auth/resetPasswordMandatory.vue"),
  },
  {
    path: "/resetPassword",
    name: "ChangePassword",
    meta: {
      requiresAuth: true,
      // permissions: [PERMISSIONS.ORGADMIN.DASHBOARD.READ],
    },
    component: () => import("../views/pages/auth/resetPasswordView.vue"),
  },
  // {
  // 	path: "/anomalies",
  // 	name: "Anomalies",
  // 	meta: {
  // 		requiresAuth: true,
  // 		// permissions: [],
  // 	},
  // 	component: () => import("../views/pages/incidents/anomalyView3.vue"),
  // },
  // {
  // 	path: "/devices",
  // 	name: "DeviceList",
  // 	meta: {
  // 		requiresAuth: true,
  // 	},
  // 	component: () => import("../views/pages/deviceAnomalies/deviceListVue.vue"),
  // },

  // {
  // 	name: "Device",
  // 	props: true,
  // 	redirect: "/devices",
  // 	meta: {
  // 		requiresAuth: true,
  // 	},
  // 	component: () => import("../views/pages/deviceAnomalies/deviceView.vue"),
  // 	children: [
  // 		{
  // 			path: "/dashboard/:id",
  // 			name: "dashboard",
  // 			requiresAuth: true,
  // 			component: () =>
  // 				import("../views/pages/deviceAnomalies/deviceDashboardTabView.vue"),
  // 			props: true,
  // 		},
  // 		{
  // 			path: "/telemetry/:id",
  // 			name: "telemetry",
  // 			requiresAuth: true,
  // 			props: true,
  // 			component: () =>
  // 				import("../views/pages/deviceAnomalies/deviceTelemetryTabView.vue"),
  // 		},
  // 		{
  // 			path: "/history/:id",
  // 			name: "history",
  // 			requiresAuth: true,
  // 			props: true,
  // 			component: () => import("../views/pages/deviceAnomalies/deviceHistoryTabView.vue"),
  // 		},
  // 		{
  // 			path: "/anomaly/:id",
  // 			name: "anomaly",
  // 			requiresAuth: true,
  // 			props: true,
  // 			component: () =>
  // 				import("../views/pages/deviceAnomalies/deviceAnomaliesTabView.vue"),
  // 		},
  // 		{
  // 			path: "/dynamicThreshold/:id",
  // 			name: "threshold",
  // 			requiresAuth: true,
  // 			props: true,
  // 			component: () =>
  // 				import("../views/pages/deviceAnomalies/deviceDynamicThresholdTabView.vue"),
  // 		},

  //	],
  //},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach(function (to, from, next) {
  console.log(store.getters);
  if (to.meta.requiresAuth && !store.getters.getIsAuthenticated) {
    next({ name: "Login" });
  } else if (to.meta.requiresGuest && store.getters.getIsAuthenticated) {
    //if authenticated request to login page diverted to home page
    next({ name: "Dashboard" }); //push to /devices
  } 
  // else if (
  //   to.name !== "ChangePasswordFirstTime" &&
  //   store.getters.getIsAuthenticated &&
  //   !store.getters.getInitialPasswordReset
  // ) {
  //   next({ name: "ChangePasswordFirstTime" });
  // }
   else if (to.meta.permissions && store.getters.getIsAuthenticated) {
    // to access page that needs permissions:
    //     check if authenticated and has the permission to access the required page
    //         if yes=>requested page
    //         else =>home
    console.log("to.meta.permissions :", to.meta.permissions.length);
    let isAllowed = store.getters.getPermissions.some((p) =>
      to.meta.permissions.includes(p)
    );

    if (!isAllowed || to.meta.permissions.length < 1) return next("/");
    else {
      next();
    }
  } else {
    next();
  }
});
export default router;
