<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <CContainer fluid>
      <CToaster :autohide="3000">
        <template v-for="info in infoList">
          <CToast :key="info.message" :show="true" :header="info.header" :color="info.color">
            {{ info.message }}.
          </CToast>
        </template>
      </CToaster>

      <CRow class="justify-content-center">
        <CCol md="8" lg="6">
          <CCard class="mx-4 mb-0 text-center">
            <CCardBody class="p-5">
              <!-- Visual cue for resetting password -->
              <CIcon name="cil-lock-unlocked" size="4xl" style="color: #756CFB;" class="mb-4" />

              <!-- Main Heading and Instructions -->
              <h2 class="mb-3" style="color: #756CFB;">Reset Your Password</h2>
              <p class="text-muted mb-4">Enter your new password below to reset your account password.</p>

              <!-- Password Input Fields -->
              <CForm class="mb-3">
                <CInput
                  placeholder="New Password"
                  type="password"
                  v-model="password"
                  aria-label="New Password"
                  :disabled="loading"
                  class="mb-3"
                  style="border-color: #756CFB;"
                />

                <CInput
                  placeholder="Confirm New Password"
                  type="password"
                  v-model="passwordConfirmation"
                  aria-label="Confirm New Password"
                  :disabled="loading"
                  class="mb-3"
                  style="border-color: #756CFB;"
                />

                <!-- Submit Button -->
                <CButton color="primary" class="mb-3" :disabled="loading" style="background-color: #756CFB; border-color: #756CFB;" @click.prevent="resetPassword">
                  <CSpinner v-if="loading" size="sm" /> Reset Password
                </CButton>
              </CForm>

              <!-- Link to Go Back to Login Page -->
              <p class="mt-4">
                <a href="#" @click.prevent="navigateTo('/login')" style="color: #756CFB;">Back to Login</a>
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
  name: "ResetPassword",
  data() {
    return {
      loading: false,  // Loading state
      success: false,
      password: "",
      passwordConfirmation: "",
      infoList: [],  // Toast messages list
    };
  },
  methods: {
    navigateTo(path) {
      this.$router.push({ path: path });
    },

    resetPassword() {
      // Basic validation for empty fields
      if (!this.password || !this.passwordConfirmation) {
        this.toast('Error', 'Please fill in all fields.', 'danger');
        return;
      }

      // Check if passwords match
      if (this.password !== this.passwordConfirmation) {
        this.toast('Error', 'Passwords do not match.', 'danger');
        return;
      }

      // Extract token and email from the route query
      const token = this.$route.query.token;
      const email = this.$route.query.email;

      // Prepare DTO for the API call
      const verifyDto = {
        email: email,
        token: token,
        password: this.password,
        cPassword: this.passwordConfirmation,
      };

      console.log('verifyDto',verifyDto)
      // Set loading state
      this.loading = true;

      // API call to reset password
      auth
        .resetPassword(verifyDto)
        .then((response) => {
          this.loading = false;
          this.toast('Success', 'Your password has been reset successfully.', 'success');
          // this.$router.push({ path: '/login' })
          this.password = "";
          this.passwordConfirmation = "";
        })
        .catch(({ data }) => {
          this.loading = false;
          console.log(data);
          this.toast("Error", helper.getErrorMessage(data), "danger");
        })
        .finally(() => {
          this.loading = false;
        });
      
      // axios.post('/api/account/resetPassword', verifyDto)
      //   .then((response) => {
      //     this.toast('Success', 'Your password has been reset successfully.', 'success');
      //     this.success = true;
      //   })
      //   .catch((error) => {
      //     let errorMessage = 'Unable to reset password. Please try again later.';
      //     if (error.response && error.response.data) {
      //       errorMessage = error.response.data;
      //     }
      //     this.toast('Error', errorMessage, 'danger');
      //     this.success = false;
      //   })
      //   .finally(() => {
      //     this.loading = false;
      //   });
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
