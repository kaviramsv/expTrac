<script>
import { mapGetters, mapActions } from "vuex";

import { useStore } from "vuex";
import { onMounted, ref, computed } from "vue";
export default {
  name: "LoginView",
  // data: {
  //   errors: [],
  //   username: null,
  //   password: null,
  // },
  setup() {
    const store = useStore();
    let authError = computed(() => {
      return store.getters["getAuthError"];
    });
    let userName = ref("");
    let userNameError = ref("");

    let password = ref("");
    let passwordError = ref("");
    let showPassword = ref(false);
    const togglePasswordField = () => {
      showPassword.value = !showPassword.value;
    };

    const login = async () => {
      if (!userName.value) {
        userNameError.value = "Name required.";
      }
      if (!password.value) {
        passwordError.value = "Password required.";
      }
      if (!userNameError.value && !passwordError.value) {
        console.log("in submit");
        let credentials = {
          userName: userName.value,
          password: password.value,
        };
        await store.dispatch("logIn", credentials);
      }
    };

    onMounted(() => {
      console.log("mounted in the composition api!");
    });
    return {
      login,
      userName,
      userNameError,
      password,
      passwordError,
      authError,
      store,
      togglePasswordField,
      showPassword,
    };
  },
  methods: {
    ...mapActions([]),
  },
  computed: {
    ...mapGetters(["getUserName", "getToken", "getIsAuthenticated"]),
  },
  methods: {},
};
</script>

<template>
  <div class="auth-page">
    <div class="container-fluid p-0 vh-100" style="background: #172d3c">
      <div
        class="row g-0 align-items-center vh-100 w-90 d-flex justify-content-between"
        style="background: #172d3c"
      >
        <!-- end col -->
        <!-- <div class="col-xxl-8 col-lg-8 col-md-6"> -->
        <div class="col-xxl-7 col-lg-7 col-md-6 ms-5 ps-5">
          <div
            class="auth-bg d-flex ms-5"
            style="
              -webkit-border-radius: 50px;
              -moz-border-radius: 50px;
              border-radius: 50px;
              border: none;
            "
          >
            <div class="bg-overlay bg-white"></div>
            <!-- end bubble effect -->
            <div class="" style="display: block; margin: auto">
              <!-- <div class="col-xl-12 p-0"> -->
              <!-- <img src="@/assets/images/ff2.jpg" class="img-fluid" alt="" /> -->
              <!-- <img
								src="@/assets/images/logo-dark-sm.png"
								alt=""
								height="250"
								class="auth-logo-dark me-start"
							/> -->
              <!-- <div class="p-0 p-sm-4 px-xl-0 py-5 mb-4">
                  <div
                    id="reviewcarouselIndicators"
                    class="carousel slide auth-carousel"
                    data-bs-ride="carousel"
                  >
                    <div class="carousel-indicators carousel-indicators-rounded">
                      <button
                        type="button"
                        data-bs-target="#reviewcarouselIndicators"
                        data-bs-slide-to="0"
                        class="active"
                        aria-current="true"
                        aria-label="Slide 1"
                      ></button>
                      <button
                        type="button"
                        data-bs-target="#reviewcarouselIndicators"
                        data-bs-slide-to="1"
                        aria-label="Slide 2"
                      ></button>
                      <button
                        type="button"
                        data-bs-target="#reviewcarouselIndicators"
                        data-bs-slide-to="2"
                        aria-label="Slide 3"
                      ></button>
                    </div>

                    <div class="carousel-inner w-50 mx-auto">
                      <div class="carousel-item active">
                        <div class="testi-contain text-center">
                          <h5 class="font-size-15 mt-2">
                            “I feel confident imposing change on myself”
                          </h5>
                          <p class="font-size-15 text-muted mt-3 mb-0">
                            Vestibulum auctor orci in risus iaculis consequat suscipit felis rutrum
                          </p>
                        </div>
                      </div>

                      <div class="carousel-item">
                        <div class="testi-contain text-center">
                          <h5 class="font-size-15 mt-2">
                            “Our task must be to free widening our circle”
                          </h5>
                          <p class="font-size-15 text-muted mt-3 mb-0">
                            Curabitur eget nulla eget augue dignissim condintum Nunc imperdiet
                          </p>
                        </div>
                      </div>

                      <div class="carousel-item">
                        <div class="testi-contain text-center">
                          <h5 class="font-size-15 mt-2">
                            “I've learned that people will forget what you”
                          </h5>
                          <p class="font-size-15 text-muted mt-3 mb-0">
                            Pellentesque lacinia scelerisque arcu in aliquam augue molestie rutrum
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                 
                </div> -->
              <!-- end review carousel -->
              <!-- </div> -->
            </div>
          </div>
        </div>
        <div class="col-xxl-4 col-lg-4 col-md-6 me-5">
          <div class="row justify-content-center g-0">
            <div class="col-xl-9">
              <div class="p-4">
                <div class="card mb-0">
                  <div class="card-body">
                    <div class="auth-full-page-content rounded d-flex p-3 my-2">
                      <div class="w-100">
                        <div class="d-flex flex-column h-100">
                          <div class="mb-4 mb-md-5">
                            <router-link to="/" class="d-block auth-logo">
                              <!-- <img
                                src="@/assets/images/logo-dark.png"
                                alt=""
                                height="40"
                                class="auth-logo-dark me-start"
                              /> -->
                              <!-- <img
                                src="@/assets/images/logo-light.png"
                                alt=""
                                height="40"
                                class="auth-logo-light me-start"
                              /> -->
                            </router-link>
                          </div>
                          <div class="auth-content my-auto">
                            <div class="text-center mt-2">
                              <h5 class="mb-1">Welcome Back !</h5>
                              <p class="text-muted mt-2">Sign in</p>
                            </div>
                            <form @submit.prevent class="mt-4 pt-2">
                              <div
                                v-if="authError"
                                class="text-danger font-size-12 mb-2"
                              >
                                {{ authError }}
                              </div>
                              <div
                                class="form-floating form-floating-custom mb-4 auth-pass-inputgroup"
                              >
                                <input
                                  type="text"
                                  class="form-control"
                                  id="input-username"
                                  placeholder="Enter User Name"
                                  v-model="userName"
                                  @input="
                                    userNameError = '';
                                    store.commit('setAuthError', '');
                                  "
                                />
                                <label for="input-username">Username</label>
                                <div class="form-floating-icon">
                                  <eva-icon name="people-outline"></eva-icon>
                                </div>
                                <div
                                  v-if="userNameError"
                                  class="text-danger font-size-12"
                                >
                                  {{ userNameError }}
                                </div>
                              </div>

                              <div
                                class="form-floating form-floating-custom mb-4 auth-pass-inputgroup"
                              >
                                <input
                                  :type="showPassword ? 'text' : 'password'"
                                  class="form-control pe-5"
                                  id="password-input"
                                  placeholder="Enter Password"
                                  v-model="password"
                                  @input="
                                    passwordError = '';
                                    store.commit('setAuthError', '');
                                  "
                                />

                                <button
                                  type="button"
                                  class="btn btn-link position-absolute h-100 end-0 top-0"
                                  id="password-addon"
                                  :onClick="togglePasswordField"
                                  v-if="showPassword"
                                >
                                  <i class="fa-solid fa-eye-slash"></i>
                                </button>
                                <button
                                  v-if="!showPassword"
                                  type="button"
                                  class="btn btn-link position-absolute h-100 end-0 top-0"
                                  id="password-addon"
                                  :onClick="togglePasswordField"
                                >
                                  <i class="fa-solid fa-eye"></i>
                                </button>
                                <label for="password-input">Password</label>
                                <div class="form-floating-icon">
                                  <eva-icon name="lock-outline"></eva-icon>
                                </div>
                                <div
                                  v-if="passwordError"
                                  class="text-danger font-size-12"
                                >
                                  {{ passwordError }}
                                </div>
                              </div>

                              <div class="mb-3">
                                <button
                                  class="btn btn-primary w-100 waves-effect waves-light"
                                  type="submit"
                                  @click="login"
                                >
                                  Log In
                                </button>
                              </div>
                            </form>

                            <!-- <div class="mt-4 pt-3 text-center">
                              <p class="text-muted mb-0">
                                Don't have an account ?
                                <router-link to="/auth/register" class="text-primary fw-semibold">
                                  Signup now
                                </router-link>
                              </p>
                            </div> -->
                          </div>
                          <div class="mt-4 text-center">
                            <p class="mb-0">
                              ©
                              {{ new Date().getFullYear() }} Expense Tracker
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- end auth full page content -->
        </div>
        <!-- end col -->
      </div>
      <!-- end row -->
    </div>
    <!-- end container fluid -->
  </div>
</template>
