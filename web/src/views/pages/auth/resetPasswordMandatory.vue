<script>
import { mapGetters, mapActions } from "vuex";
import MainLayout from "../../layouts/mainLayout.vue";
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
		//let password = "password";
		const firstTimeLogin = ref(true);

		let newPassword = ref("");
		let newPasswordError = ref("");
		let oldPassword = ref("");
		let oldPasswordError = ref("");

		let confirmPassword = ref("");
		let confirmPasswordError = ref("");
		let passwordMismatchError = ref("");
		let showOldPassword = ref(false);
		const toggleOldPasswordField = () => {
			showOldPassword.value = !showOldPassword.value;
		};
		let showNewPassword = ref(false);
		const toggleNewPasswordField = () => {
			showNewPassword.value = !showNewPassword.value;
		};
		let showConfirmPassword = ref(false);
		const toggleConfirmPasswordField = () => {
			showConfirmPassword.value = !showConfirmPassword.value;
		};
		const reset = async (e) => {
			console.log("hi");
			//   if (oldPassword != password) {
			//     passwordMismatchError = "Old password is wrong"
			//   }

			if (!oldPassword.value) {
				oldPasswordError.value = "Old Password required.";
			}
			if (!newPassword.value) {
				newPasswordError.value = "New Password required.";
			}
			if (!confirmPassword.value) {
				confirmPasswordError.value = "Confirm Password required.";
			}
			if (newPassword.value != confirmPassword.value) {
				passwordMismatchError.value = "Passwords does not match.";
			}

			if (
				!oldPasswordError.value &&
				!newPasswordError.value &&
				!confirmPasswordError.value &&
				!passwordMismatchError.value
			) {
				console.log("in submit");
				let credentials = {
					oldPassword: oldPassword.value,
					newPassword: newPassword.value,
					isFirstTime: true,
				};
				await store.dispatch("reset", credentials);
			}
		};

		onMounted(() => {
			console.log("mounted in the composition api!");
		});
		return {
			reset,
			firstTimeLogin,
			oldPassword,
			oldPasswordError,
			newPassword,
			newPasswordError,
			confirmPassword,
			confirmPasswordError,
			passwordMismatchError,
			showOldPassword,
			toggleOldPasswordField,
			showNewPassword,
			toggleNewPasswordField,
			showConfirmPassword,
			toggleConfirmPasswordField,
		};
	},
	methods: {
		...mapActions([]),
	},
	computed: {
		...mapGetters(["isAuthenticated"]),
	},
	methods: {
		// ...mapActions(["logIn", "logOut"]),
	},
	components: {},
};
</script>
<!-- //min-vh-100 -->
<template>
	<div class="auth-page">
		<div class="container-fluid p-0 vh-100" style="background: #172d3c">
			<div class="row g-0 align-items-center vh-100" style="background: #172d3c">
				<div class="col-xxl-4 col-lg-4 col-md-6 ms-2 me-1">
					<div class="row justify-content-center g-0">
						<div class="col-xl-9">
							<div class="p-4">
								<div class="card mb-0">
									<div class="card-body">
										<div class="auth-full-page-content rounded d-flex p-3 my-2">
											<div class="w-100">
												<div class="d-flex flex-column h-100">
													<div class="mb-4 mb-md-5">
														<router-link
															to="/"
															class="d-block auth-logo"
														>
															<img
																src="@/assets/images/logo-dark.png"
																alt=""
																height="40"
																class="auth-logo-dark me-start"
															/>
															<img
																src="@/assets/images/logo-light.png"
																alt=""
																height="40"
																class="auth-logo-light me-start"
															/>
														</router-link>
													</div>
													<div class="auth-content my-auto">
														<div class="text-center mt-2">
															<h5 class="mb-1">Change Password!</h5>
															<p class="text-muted mt-2">
																Change your password to continue to
																Trustcore BA.
															</p>
														</div>
														<div class="mt-4 pt-2">
															<div
																class="form-floating form-floating-custom mb-4"
															>
																<input
																	:type="
																		showOldPassword
																			? 'text'
																			: 'password'
																	"
																	class="form-control"
																	placeholder="Old Password"
																	id="formrow-old-password"
																	fdprocessedid="copw7j"
																	v-model="oldPassword"
																	@input="oldPasswordError = ''"
																/>

																<button
																	type="button"
																	class="btn btn-link position-absolute h-100 end-0 top-0"
																	id="password-addon"
																	:onClick="
																		toggleOldPasswordField
																	"
																	v-if="showOldPassword"
																>
																	<i
																		class="mdi mdi-eye-off font-size-18 text-muted"
																	></i>
																</button>
																<button
																	v-if="!showOldPassword"
																	type="button"
																	class="btn btn-link position-absolute h-100 end-0 top-0"
																	id="password-addon"
																	:onClick="
																		toggleOldPasswordField
																	"
																>
																	<i
																		class="mdi mdi-eye font-size-18 text-muted"
																	></i>
																</button>

																<label
																	class="form-label mb-0"
																	for="formrow-old-password"
																	>Old Password</label
																>

																<div class="form-floating-icon">
																	<eva-icon
																		name="people-outline"
																	></eva-icon>
																</div>
																<div
																	v-if="oldPasswordError"
																	class="text-danger font-size-12"
																>
																	{{ oldPasswordError }}
																</div>
															</div>

															<div
																class="form-floating form-floating-custom mb-4 auth-pass-inputgroup"
															>
																<input
																	:type="
																		showNewPassword
																			? 'text'
																			: 'password'
																	"
																	class="form-control pe-5"
																	placeholder="Enter New Password"
																	id="formrow-new-password"
																	fdprocessedid="npw7j"
																	v-model="newPassword"
																	@input="
																		newPasswordError = '';
																		passwordMismatchError = '';
																	"
																/>

																<button
																	type="button"
																	class="btn btn-link position-absolute h-100 end-0 top-0"
																	id="password-addon"
																	:onClick="
																		toggleNewPasswordField
																	"
																	v-if="showNewPassword"
																>
																	<i
																		class="mdi mdi-eye-off font-size-18 text-muted"
																	></i>
																</button>
																<button
																	v-if="!showNewPassword"
																	type="button"
																	class="btn btn-link position-absolute h-100 end-0 top-0"
																	id="password-addon"
																	:onClick="
																		toggleNewPasswordField
																	"
																>
																	<i
																		class="mdi mdi-eye font-size-18 text-muted"
																	></i>
																</button>
																<label
																	class="form-label mb-0"
																	for="formrow-new-password"
																	>New Password</label
																>
																<div class="form-floating-icon">
																	<eva-icon
																		name="lock-outline"
																	></eva-icon>
																</div>
																<div
																	v-if="passwordMismatchError"
																	class="text-danger font-size-12"
																>
																	{{ passwordMismatchError }}
																</div>
															</div>
															<div
																class="form-floating form-floating-custom mb-4 auth-pass-inputgroup"
															>
																<input
																	:type="
																		showConfirmPassword
																			? 'text'
																			: 'password'
																	"
																	class="form-control pe-5"
																	placeholder="Retype New Password"
																	id="formrow-confirm-password"
																	fdprocessedid="cpw7j"
																	v-model="confirmPassword"
																	@input="
																		confirmPasswordError = '';
																		passwordMismatchError = '';
																	"
																/>

																<button
																	type="button"
																	class="btn btn-link position-absolute h-100 end-0 top-0"
																	id="password-addon"
																	:onClick="
																		toggleConfirmPasswordField
																	"
																	v-if="showConfirmPassword"
																>
																	<i
																		class="mdi mdi-eye-off font-size-18 text-muted"
																	></i>
																</button>
																<button
																	v-if="!showConfirmPassword"
																	type="button"
																	class="btn btn-link position-absolute h-100 end-0 top-0"
																	id="password-addon"
																	:onClick="
																		toggleConfirmPasswordField
																	"
																>
																	<i
																		class="mdi mdi-eye font-size-18 text-muted"
																	></i>
																</button>
																<label
																	class="form-label mb-0"
																	for="formrow-confirm-password"
																	>Confirm New Password</label
																>
																<div class="form-floating-icon">
																	<eva-icon
																		name="lock-outline"
																	></eva-icon>
																</div>
																<div
																	v-if="confirmPasswordError"
																	class="text-danger font-size-12"
																>
																	{{ confirmPasswordError }}
																</div>
															</div>

															<div class="mb-3">
																<button
																	class="btn btn-primary w-100 waves-effect waves-light"
																	type="submit"
																	@click="reset"
																>
																	Reset Password
																</button>
															</div>
														</div>

														<div class="mt-4 pt-3 text-center">
															<p class="text-muted mb-0">
																Don't have an account ?
																<router-link
																	to="/auth/register"
																	class="text-primary fw-semibold"
																>
																	Signup now
																</router-link>
															</p>
														</div>
													</div>
													<div class="mt-4 text-center">
														<p class="mb-0">
															©
															{{ new Date().getFullYear() }} Trustcore
															Technologies.
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
				<!-- <div class="col-xxl-8 col-lg-8 col-md-6"> -->
				<div class="col-xxl-7 col-lg-7 col-md-6 ms-4">
					<div
						class="auth-bg d-flex"
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
							<img
								src="@/assets/images/logo-dark-sm.png"
								alt=""
								height="250"
								class="auth-logo-dark me-start opacity-75"
							/>

							<!-- <div class="col-xl-12 p-0"> -->
							<!-- <img src="@/assets/images/ff2.jpg" class="img-fluid" alt="" /> -->

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
				<!-- end col -->
			</div>
			<!-- end row -->
		</div>
	</div>
</template>
