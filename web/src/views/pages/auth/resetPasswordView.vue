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

		const reset = async () => {
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
		};
	},
	methods: {
		...mapActions([]),
	},
	computed: {
		...mapGetters(["getIsAuthenticated", "getInitialPasswordReset"]),
	},
	methods: {
		// ...mapActions(["logIn", "logOut"]),
	},
	components: {
		MainLayout,
	},
};
</script>
<!-- //min-vh-100 -->
<template>
	<MainLayout :pagetitle="'Change Password'">
		<div class="auth-page">
			<div class="jumbotron d-flex align-items-center mt-4">
				<div class="container-fluid p-0">
					<div class="row g-0 align-items-center justify-content-center">
						<div class="col-xxl-6 col-lg-6 col-md-8">
							<div class="row justify-content-center g-0">
								<div class="col-xl-9">
									<div class="p-4">
										<div class="card mb-0">
											<div class="card-body">
												<div
													class="auth-full-page-content rounded d-flex p-3 my-2"
												>
													<div class="w-100">
														<div class="d-flex flex-column h-100">
															<div class="mb-4 mb-md-5">
																<!-- <div class="text-center mt-4 mb-4 w-70">
                                  <p class="font-size-20 fw-semibold mt-2">Reset Password</p>
                                </div> -->

																<div class="w-75 m-auto">
																	<div class="mt-4 mb-3 w-70">
																		<p
																			class="font-size-22 fw-semibold mt-2"
																		>
																			Change Password
																		</p>
																	</div>
																	<br />

																	<div class="mb-4">
																		<label
																			class="form-label mb-0"
																			for="formrow-old-password"
																			>Old Password</label
																		><input
																			type="text"
																			class="form-control"
																			placeholder="Old Password"
																			id="formrow-old-password"
																			fdprocessedid="copw7j"
																			v-model="oldPassword"
																			@input="
																				oldPasswordError =
																					''
																			"
																		/>
																		<div
																			v-if="oldPasswordError"
																			class="text-danger font-size-12"
																		>
																			{{ oldPasswordError }}
																		</div>
																	</div>

																	<div class="mb-4">
																		<div
																			v-if="
																				passwordMismatchError
																			"
																			class="text-danger font-size-12"
																		>
																			{{
																				passwordMismatchError
																			}}
																		</div>
																		<label
																			class="form-label mb-0"
																			for="formrow-new-password"
																			>New Password</label
																		><input
																			type="text"
																			class="form-control"
																			placeholder="Enter New Password"
																			id="formrow-new-password"
																			fdprocessedid="npw7j"
																			v-model="newPassword"
																			@input="
																				newPasswordError =
																					'';
																				passwordMismatchError =
																					'';
																			"
																		/>
																		<div
																			v-if="newPasswordError"
																			class="text-danger font-size-12"
																		>
																			{{ newPasswordError }}
																		</div>
																	</div>
																	<div class="mb-4">
																		<label
																			class="form-label mb-0"
																			for="formrow-confirm-password"
																			>Confirm New
																			Password</label
																		><input
																			type="text"
																			class="form-control"
																			placeholder="Retype New Password"
																			id="formrow-confirm-password"
																			fdprocessedid="cpw7j"
																			v-model="
																				confirmPassword
																			"
																			@input="
																				confirmPasswordError =
																					'';
																				passwordMismatchError =
																					'';
																			"
																		/>
																		<div
																			v-if="
																				confirmPasswordError
																			"
																			class="text-danger font-size-12"
																		>
																			{{
																				confirmPasswordError
																			}}
																		</div>
																	</div>
																	<br />

																	<div>
																		<div class="d-grid gap-4">
																			<button
																				class="btn btn-primary"
																				@click="reset"
																			>
																				<i
																					class="fas fa-pen me-2"
																				></i
																				>Change Password
																			</button>
																		</div>
																	</div>
																</div>
															</div>
															<!-- <div class="mt-4 text-center">
                                <p class="mb-0">
                                  © {{ new Date().getFullYear() }} Trustcore Technologies.
                                </p>
                              </div> -->
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
		</div>
	</MainLayout>
</template>
