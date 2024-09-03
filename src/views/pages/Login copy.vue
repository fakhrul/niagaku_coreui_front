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
                <img src="/img/logo.png" alt="Niaga-ku Logo" class="img-fluid mb-3" style="max-height: 80px;" />
                <h1 class="text-primary" style="color: #756CFB;">Login</h1>
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
                  style="border-color: #756CFB;"
                >
                  <template #prepend-content>
                    <CIcon name="cil-user" />
                  </template>
                </CInput>
                <CSmall v-if="!isValidEmail && loginObj.email.length > 0" class="text-danger">
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
                  style="border-color: #756CFB;"
                >
                  <template #prepend-content>
                    <CIcon name="cil-lock-locked" />
                  </template>
                </CInput>
                <CSmall v-if="!isValidPassword && loginObj.password.length > 0" class="text-danger">
                  Password must be at least 8 characters long.
                </CSmall>

                <CButton :color="loading ? 'secondary' : 'success'" :disabled="loading" block @click.prevent="login" style="background-color: #756CFB; border-color: #756CFB;">
                  <CSpinner v-if="loading" size="sm" /> Login
                </CButton>

                <div class="d-flex justify-content-between mt-3">
                  <CButton color="link" class="px-0" @click="navigateTo('/forgotPassword')">
                    Forgot password?
                  </CButton>
                  <CButton color="link" class="px-0" @click="navigateTo('/register')">
                    Register now!
                  </CButton>
                </div>
              </CForm>
            </CCardBody>

            <!-- <CCardFooter class="text-center">
              <p class="mb-2">{{ version }}</p>
              <h3>Demo Account</h3>
              <ul class="list-unstyled">
                <li>tenant1@niagaku.com (Admin)</li>
                <li>accountant1_1@tenant1.com (Accountant)</li>
                <li>staff1_1@tenant1.com (Normal Staff)</li>
              </ul>
            </CCardFooter> -->
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: () => {
    return {
      infoList: [],
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
    version() {
      return process.env.VUE_APP_VERSION;
    },
  },
  methods: {
    login() {
      if (!this.isValidEmail || !this.isValidPassword) {
        this.toast("Error", "Please fix the errors before submitting.", "danger");
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
        .catch((error) => {
          this.loading = false;
          let errorMessage = "An unknown error occurred.";
          if (
            error.data &&
            error.data.responseException &&
            error.data.responseException.exceptionMessage
          ) {
            errorMessage = error.data.responseException.exceptionMessage.title;
          }
          this.toast("Error", errorMessage, "danger");
        });
    },
    navigateTo(path) {
      this.$router.push({ path: path });
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
  },
};
</script>
