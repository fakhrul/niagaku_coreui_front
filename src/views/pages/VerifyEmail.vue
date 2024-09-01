<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="8" lg="6">
          <CCard class="mx-4 mb-0 text-center">
            <CCardBody class="p-5">
              <!-- Loading State -->
              <div v-if="loading">
                <CSpinner class="mb-4" size="lg" style="color: #756CFB;" />
                <p class="text-muted">Verifying your email, please wait...</p>
              </div>

              <!-- Success Message -->
              <div v-if="!loading && success">
                <CIcon name="cil-check-circle" size="4xl" style="color: #756CFB;" class="mb-4" />
                <h2 class="mb-3" style="color: #756CFB;">Email Verified!</h2>
                <p class="text-muted mb-4">Your email has been successfully verified.</p>
                <CButton color="primary" style="background-color: #756CFB; border-color: #756CFB;" @click="navigateTo('/login')">
                  Go To Login Page
                </CButton>
              </div>

              <!-- Failure Message -->
              <div v-if="!loading && !success">
                <CIcon name="cil-x-circle" size="4xl" style="color: red;" class="mb-4" />
                <h2 class="mb-3" style="color: red;">Verification Failed</h2>
                <p class="text-muted mb-4">Verification failed. Please try again or contact support.</p>
                <CButton color="secondary" variant="outline" @click="navigateTo('/')">
                  Return to Home
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "VerifyEmail",
  data() {
    return {
      loading: true,
      success: false,
    };
  },
  mounted() {
    this.verifyEmail();
  },
  methods: {
    navigateTo(path) {
      this.$router.push({ path: path });
    },
    
    verifyEmail() {
      const token = this.$route.query.token;
      const email = this.$route.query.email;

      const verifyDto = {
        email: email,
        token: token,
      };

      // API call to verify email
      auth
        .verifyEmail(verifyDto)
        .then((response) => {
          this.success = true;
        })
        .catch((error) => {
          this.success = false;
        })
        .finally(() => {
          this.loading = false;
          // }
        });
    },
  },
};
</script>

<style scoped>
.c-icon {
  margin-bottom: 1rem;
}
</style>
