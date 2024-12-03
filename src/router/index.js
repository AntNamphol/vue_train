import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// Middleware ตรวจสอบการล็อกอิน
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/signup",
      name: "Signup",
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/toolbar",
      name: "Toolbar",
      component: () => import("../views/Toolbar.vue"),
      children: [
        {
          path: "/home",
          name: "Home",
          component: () => import("../views/Home.vue"),
        },
        {
          path: "/production",
          name: "Production",
          component: () => import("../views/production.vue"),
        },
        {
          path: "/shopping",
          name: "Shopping",
          component: () => import("../views/Shopping.vue"),
        },
        {
          path: "/editprofile",
          name: "Editprofile",
          component: () => import("../views/EditProfile.vue"),
        },
      ],
    },
    // Catch-all route for undefined paths
    {
      path: "*", // This will match all undefined paths
      name: "404Page",
      component: () => import("../views/404page.vue"),
    },
  ],
});

// Middleware
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  console.log(`Navigating to: ${to.name}`);
  console.log(`Authenticated: ${isAuthenticated}`);

  // Log the path to see if the redirect is happening
  if ((to.name !== "Login" && to.name !== "Signup") && !isAuthenticated) {
    console.log('Redirecting to Login...');
    next({ name: "Login" });
  } else {
    next();
  }
});


export default router;
