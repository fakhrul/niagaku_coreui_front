<template>
  <div class="verify-email">
    <div v-if="loading">Verifying your email, please wait...</div>
    <div v-if="!loading && success">
      Your email has been successfully verified!
      <CButton color="link" class="px-0" @click="navigateTo('/')"
        >Go To Login Page</CButton
      >
    </div>
    <div v-if="!loading && !success">
      Verification failed. Please try again or contact support.
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "VerifyEmail",
  data() {
    return {
      loading: true,
      success: false,
    };
  },
  mounted() {
    // alert('asds');
    this.verifyEmail();
  },
  methods: {
    navigateTo(path) {
      // Generic method to handle all navigation actions
      this.$router.push({ path: path });
    },
    
    verifyEmail() {
      const token = this.$route.query.token;
      const email = this.$route.query.email;

      var verifyDto = {
        email: email,
        token: token,
      };

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
.verify-email {
  text-align: center;
  margin-top: 50px;
}
</style>
  