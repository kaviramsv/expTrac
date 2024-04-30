import { createRouter, createWebHistory } from "vue-router";
import store from "../../src/store/index";
// import { PERMISSIONS } from "../lib/permissions";
import HomeView from "../views/pages/HomeView.vue";
import AboutView from "../views/pages/AboutView.vue";
const routes = [
  {
    path: "/home",
    component: HomeView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/about",
    component: AboutView,
    meta: {
      requiresAuth: true,
    },
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
    path: "/expense",
    name: "Expense",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../views/pages/expense/expenseListView.vue"),
  },
 

  {
    path: "/resetPasswordFirstTime",
    name: "ChangePasswordFirstTime",

    meta: {
      requiresAuth: true,     
    },
    component: () => import("../views/pages/auth/resetPasswordMandatory.vue"),
  },
  {
    path: "/resetPassword",
    name: "ChangePassword",
    meta: {
      requiresAuth: true,    
    },
    component: () => import("../views/pages/auth/resetPasswordView.vue"),
  },
  
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
    next({ name: "Home" }); 
  } 
  
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
