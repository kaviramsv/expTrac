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
  <div class="auth-page text-black-50  " style="background-color:#41587adc,">
    <div class="container-fluid p-0 vh-100">
      <div
        class="row g-0 align-items-center vh-100 w-90 d-flex justify-content-between"     
      >
       
         <div class="col-xxl-2 col-lg-4 col-md-6 me-5"></div>
         
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
                            <div class="text-center text-black-50 mt-0 ">
                            
                              <h1 class="mb-5 text-primary"  style="font-family: Pacifico, cursive;">Expense Tracker</h1>
                              <h4 class="mb-3 text-dark-subtle fw-bold ">Sign In</h4>
                            
                            </div>
                            <form @submit.prevent class="mt-4 pt-2">
                            
                              <div
                                v-if="authError"
                                class="text-danger font-size-12 mb-2"
                              >
                                {{ authError }}
                              </div>
                              <div
                                class="form-floating form-floating-custom mb-4 "
                              >
                                <input
                                  type="text"
                                  class="form-control "
                                  id="input-username"
                                  placeholder="Enter User Name"
                                  v-model="userName"
                                  autocomplete="off"
                                  @input="
                                    userNameError = '';
                                    store.commit('setAuthError', '');
                                  "
                                />
                                <label for="input-username "><p class="text-black-50">Username</p></label>
                          
                                <div
                                  v-if="userNameError"
                                  class="text-danger font-size-12"
                                >
                                  {{ userNameError }}
                                </div>
                              </div>

                              <div
                                class="form-floating form-floating-custom mb-4 "
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
                                <label for="input-username "><p class="text-black-50">Password</p></label>
                                
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
                          <div class="mt-4 text-center text-black-50">
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
          <div class="col-xxl-2 col-lg-4 col-md-6 me-5"></div>
        <!-- end col -->
      </div>
      <!-- end row -->
    </div>
    <!-- end container fluid -->
  </div>
</template>
