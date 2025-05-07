<template>
  <div
    class="c-app d-flex align-items-center min-vh-100"
    :class="{ 'c-dark-theme': $store.state.darkMode }"
  >
    <CContainer fluid>
      <!-- <CToaster :autohide="3000">
        <template v-for="info in infoList">
          <CToast
            :key="info.message"
            :show="true"
            :header="info.header"
            :color="info.color"
          >
            {{ info.message }}.
          </CToast>
        </template>
      </CToaster> -->
      <ToastContainer :toasts="toasts" />
      <CRow class="justify-content-center">
        <CCol md="8" lg="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <div class="text-center mb-4">
                <!-- Use logoUrl from Vuex store -->
                <img
                  id="logo"
                  :src="logoUrl"
                  alt="Logo"
                  class="img-fluid mb-3"
                  style="max-height: 80px"
                />
                <!-- Use primaryColor from Vuex store for dynamic styling -->
                <h1 class="text-primary" :style="{ color: primaryColor }">
                  Login
                </h1>
                <p class="text-muted">Sign in to your account</p>
              </div>
              <CForm class="text-center">
                <CInput
                  placeholder="Email"
                  autocomplete="username email"
                  v-model="loginObj.email"
                  :invalid="!isValidEmail && loginObj.email.length > 0"
                  @input="validateEmail"
                  aria-label="Email Address"
                  class="mb-3"
                  :style="{ borderColor: primaryColor }"
                  data-test-id="usernameInput"
                >
                  <template #prepend-content>
                    <CIcon name="cil-user" />
                  </template>
                </CInput>
                <CSmall
                  v-if="!isValidEmail && loginObj.email.length > 0"
                  class="text-danger"
                >
                  Please enter a valid email address.
                </CSmall>

                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="current-password"
                  v-model="loginObj.password"
                  :invalid="!isValidPassword && loginObj.password.length > 0"
                  @input="validatePassword"
                  aria-label="Password"
                  class="mb-3"
                  :style="{ borderColor: primaryColor }"
                  data-test-id="passwordInput"
                >
                  <template #prepend-content>
                    <CIcon name="cil-lock-locked" />
                  </template>
                </CInput>
                <CSmall
                  v-if="!isValidPassword && loginObj.password.length > 0"
                  class="text-danger"
                >
                  Password must be at least 8 characters long.
                </CSmall>

                <!-- <CButton
                  :color="loading ? 'secondary' : 'success'"
                  :disabled="loading"
                  block
                  @click.prevent="login"
                  :style="{
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                  }"
                >
                  <CSpinner v-if="loading" size="sm" /> Login
                </CButton> -->
                <CButton
                  :color="loading ? 'secondary' : 'success'"
                  :disabled="loading"
                  block
                  @click.prevent="login"
                  style="background-color: #756cfb; border-color: #756cfb"
                  data-test-id="loginButton"
                >
                  <CSpinner v-if="loading" size="sm" /> Login
                </CButton>

                <div class="d-flex justify-content-between mt-3">
                  <CButton
                    color="link"
                    class="px-0"
                    @click="navigateTo('/forgotPassword')"
                  >
                    Forgot password?
                  </CButton>
                  <CButton
                    color="link"
                    class="px-0"
                    @click="navigateTo('/register')"
                  >
                    Register now!
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { mapState } from "vuex"; // Import Vuex helpers
import ToastContainer from "../widgets/ToastContainer.vue";

export default {
  name: "Login",
  components: {
    ToastContainer,
  },
  data: () => {
    return {
      toasts: [],
      loginObj: {
        email: "",
        password: "",
      },
      loading: false,
      isValidEmail: true,
      isValidPassword: true,
    };
  },
  computed: {
    ...mapState({
      // logoUrl: (state) => state.logoUrl, // Access the logo from Vuex
      logoUrl: (state) => state.logoUrl || "/logo.png", // Access the logo from Vuex
      primaryColor: (state) => state.primaryColor || "#756CFB", // Access the primary color from Vuex
    }),
  },
  methods: {
    login() {
      if (!this.isValidEmail || !this.isValidPassword) {
        this.toast(
          "Error",
          "Please fix the errors before submitting.",
          "danger"
        );
        return;
      }

      this.loading = true;
      let data = {
        email: this.loginObj.email,
        password: this.loginObj.password,
      };
      auth
        .doLogin(data)
        .then((response) => {
          this.loading = false;
          auth.recordLogin(response.accessToken, response, false);
          this.$router.push({ path: "/" });
        })
        .catch(({ data }) => {
          this.toast("Error", data || "Login failed", "danger");
          this.loading = false;
        });
    },
    navigateTo(path) {
      this.$router.push({ path: path });
    },
    toast(header, message, color) {
      this.toasts.push({
        header: header,
        message: message,
        color: color,
      });
    },
    validateEmail() {
      const regex = /^\S+@\S+\.\S+$/;
      this.isValidEmail = regex.test(this.loginObj.email);
    },
    validatePassword() {
      this.isValidPassword = this.loginObj.password.length >= 1;
    },
  },
};
</script>
