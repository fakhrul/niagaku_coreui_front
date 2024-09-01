<template>
  <div
    class="d-flex align-items-center justify-content-center min-vh-100"
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
        <CCol md="6" lg="5">
          <CCard class="mx-4 mb-0 text-center">
            <CCardBody class="p-5">
              <!-- Success Icon or Image -->
              <CIcon
                name="cil-check-circle"
                size="4xl"
                style="color: #756cfb"
                class="mb-4"
              />

              <!-- Main Message -->
              <h2 class="mb-3" style="color: #756cfb">
                Registration Completed!
              </h2>
              <p class="text-muted mb-4">
                We've sent a verification link to your email.
              </p>
              <p class="text-muted mb-4">
                Please verify your email to activate your account.
              </p>

              <!-- Email Input for Resending Verification -->
              <CRow>
                <CCol>
                  <CInput
                    placeholder="Enter your email"
                    autocomplete="email"
                    prepend="@"
                    v-model="email"
                    aria-label="Email Address"
                    class="mb-3"
                    :disabled="loading"
                    style="border-color: #756cfb"
                    :invalid="!isValidEmail && email.length > 0"
                    @input="validateEmail"
                  />
                  <CSmall
                    v-if="!isValidEmail && email.length > 0"
                    class="text-danger"
                  >
                    Please enter a valid email address.
                  </CSmall>
                </CCol>
              </CRow>
              <CRow
                ><CCol>
                  <!-- Call to Action Buttons -->
                  <CButton
                    color="primary"
                    class="mb-3"
                    :disabled="loading || !isValidEmail"
                    style="background-color: #756cfb; border-color: #756cfb"
                    @click.prevent="resendVerification"
                  >
                    <CSpinner v-if="loading" size="sm" /> Resend Verification
                    Email
                  </CButton>
                  <CButton
                    color="secondary"
                    class="mb-3"
                    variant="outline"
                    @click="navigateToLogin"
                  >
                    Go to Login Page
                  </CButton>
                </CCol></CRow
              >
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: "RegisterCompleted",
  data: () => ({
    email: "", // User's email input
    infoList: [],
    loading: false, // Loading state
    isValidEmail: false,
  }),
  methods: {
    resendVerification() {
      // Check if email input is valid
      if (!this.isValidEmail) {
        this.toast("Error", "Please enter your email address.", "danger");
        return;
      }

      this.loading = true;
      var resendDto = {
        email: this.email,
      };

      auth
        .resendVerificationEmail(resendDto)
        .then((response) => {
          this.loading = false;
          this.toast("Info", "Verification email has been resent.", "info");
        })
        .catch(({ data }) => {
          this.loading = false;
          console.log(data);
          this.toast("Error", helper.getErrorMessage(data), "danger");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    validateEmail() {
      const regex = /^\S+@\S+\.\S+$/;
      this.isValidEmail = regex.test(this.email);
    },
    navigateToLogin() {
      this.$router.push({ path: "/login" });
    },
    toast(header, message, color) {
      this.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.c-icon {
  margin-bottom: 1rem;
}
</style>
