<template>
  <div
    class="c-app d-flex align-items-center min-vh-100"
    :class="{ 'c-dark-theme': $store.state.darkMode }"
  >
    <CContainer fluid>
      <CToaster :autohide="3000">
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
      </CToaster>

      <CRow class="justify-content-center">
        <CCol md="8" lg="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <div class="text-center mb-4">
                <!-- <img
                  src="/img/logo.png"
                  alt="Logo"
                  class="img-fluid mb-3"
                  style="max-height: 80px"
                /> -->
                <CIcon
                  name="cilPen"
                  size="4xl"
                  style="color: #756cfb"
                  class="mb-4"
                />
                <h1 class="text-primary" style="color: #756cfb">Register</h1>
                <p class="text-muted">Create your account to get started</p>
              </div>
              <CForm>
                <!-- Enhanced input fields with branding colors -->
                <CInput
                  placeholder="Email"
                  autocomplete="email"
                  prepend="@"
                  v-model="loginObj.email"
                  :invalid="!isValidEmail && loginObj.email.length > 0"
                  @input="validateEmail"
                  aria-label="Email Address"
                  class="mb-3"
                  style="border-color: #756cfb"
                />
                <CSmall
                  v-if="!isValidEmail && loginObj.email.length > 0"
                  class="text-danger"
                >
                  Please enter a valid email address.
                </CSmall>

                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="new-password"
                  v-model="loginObj.password"
                  :invalid="!isValidPassword && loginObj.password.length > 0"
                  @input="validatePassword"
                  aria-label="Password"
                  class="mb-3"
                  style="border-color: #756cfb"
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

                <CInput
                  placeholder="Repeat password"
                  type="password"
                  autocomplete="new-password"
                  v-model="loginObj.passwordConfirmation"
                  :invalid="
                    !passwordsMatch && loginObj.passwordConfirmation.length > 0
                  "
                  @input="validatePasswordConfirmation"
                  aria-label="Confirm Password"
                  class="mb-3"
                  style="border-color: #756cfb"
                >
                  <template #prepend-content>
                    <CIcon name="cil-lock-locked" />
                  </template>
                </CInput>
                <CSmall
                  v-if="
                    !passwordsMatch && loginObj.passwordConfirmation.length > 0
                  "
                  class="text-danger"
                >
                  Passwords do not match.
                </CSmall>

                <!-- Enhanced button with branding color -->
                <CButton
                  :color="loading ? 'secondary' : 'success'"
                  :disabled="loading"
                  block
                  @click.prevent="register"
                  style="background-color: #756cfb; border-color: #756cfb"
                >
                  <CSpinner v-if="loading" size="sm" /> Create Account
                </CButton>
              </CForm>
              <!-- Link to Go Back to Login Page -->
              <p class="text-center mt-4">
                <a
                  href="#"
                  @click.prevent="navigateToLogin"
                  style="color: #756cfb"
                  >Already registered? Log in here.</a
                >
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: "Register",
  data: () => {
    return {
      infoList: [],
      loginObj: {
        email: "",
        password: "",
        passwordConfirmation: "",
      },
      loading: false,
      isValidEmail: true,
      isValidPassword: true,
      passwordsMatch: true,
    };
  },
  methods: {
    navigateToLogin() {
      this.$router.push({ path: "/login" });
    },

    register() {
      if (!this.isValidEmail || !this.isValidPassword || !this.passwordsMatch) {
        this.toast(
          "Error",
          "Please fix the errors before submitting.",
          "danger"
        );
        return;
      }

      this.loading = true;
      var registerDto = {
        email: this.loginObj.email,
        password: this.loginObj.password,
        passwordConfirmation: this.loginObj.passwordConfirmation,
      };

      auth
        .register(registerDto)
        .then((response) => {
          this.loading = false;
          this.$router.push({ path: "/pages/registerCompleted" });
        })
        .catch((error) => {
          this.loading = false;
          let errorMessage = "An unknown error occurred.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            errorMessage = error.response.data.message;
          }
          this.toast("Error", errorMessage, "danger");
        });
    },
    toast(header, message, color) {
      this.infoList.push({
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
      this.isValidPassword = this.loginObj.password.length >= 8;
    },
    validatePasswordConfirmation() {
      this.passwordsMatch =
        this.loginObj.password === this.loginObj.passwordConfirmation;
    },
  },
};
</script>
