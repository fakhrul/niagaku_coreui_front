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
              <!-- Icon or Image for Visual Appeal -->
              <CIcon
                name="cil-envelope-closed"
                size="4xl"
                style="color: #756cfb"
                class="mb-4"
              />

              <!-- Main Heading and Instructions -->
              <h2 class="mb-3" style="color: #756cfb">Forgot Your Password?</h2>
              <p class="text-muted mb-4">
                Enter your email address below, and we'll send you a link to
                reset your password.
              </p>

              <!-- Email Input Field -->
              <CInput
                placeholder="Enter your email"
                autocomplete="email"
                prepend="@"
                v-model="email"
                aria-label="Email Address"
                class="mb-3"
                :disabled="loading"
                style="border-color: #756cfb"
              />

              <!-- Send Reset Link Button -->
              <CButton
                color="primary"
                class="mb-3"
                :disabled="loading"
                style="background-color: #756cfb; border-color: #756cfb"
                @click="sendResetLink"
              >
                <CSpinner v-if="loading" size="sm" /> Send Reset Link
              </CButton>

              <!-- Link to Go Back to Login Page -->
              <p class="mt-4">
                <a
                  href="#"
                  @click.prevent="navigateToLogin"
                  style="color: #756cfb"
                  >Remembered your password? Log in here.</a
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
  name: "ForgotPassword",
  data: () => ({
    email: "", // User's email input
    infoList: [],
    loading: false, // Loading state
  }),
  methods: {
    sendResetLink() {
      // Validate email input
      if (!this.email) {
        this.toast("Error", "Please enter your email address.", "danger");
        return;
      }

      this.loading = true;
      var resendDto = {
        email: this.email,
      };

      auth
        .sendForgotPassword(resendDto)
        .then((response) => {
          this.loading = false;
          this.toast(
            "Info",
            "A reset link has been sent to your email.",
            "info"
          );
        })
        .catch(({ data }) => {
          this.loading = false;
          console.log(data);
          this.toast("Error", helper.getErrorMessage(data), "danger");
        })
        .finally(() => {
          this.loading = false;
        });

      // try {
      //   // Make API call to your .NET backend
      //   const response = await axios.post('/api/account/forgotPassword', null, {
      //     params: {
      //       email: this.email
      //     }
      //   });

      //   // Show success message
      //   this.toast('Info', 'A reset link has been sent to your email.', 'info');
      // } catch (error) {
      //   // Error handling
      //   let errorMessage = 'Unable to send reset link. Please try again later.';
      //   if (error.response && error.response.data) {
      //     errorMessage = error.response.data;
      //   }
      //   this.toast('Error', errorMessage, 'danger');
      // } finally {
      //   this.loading = false;
      // }
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
  