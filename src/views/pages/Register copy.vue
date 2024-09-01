<template>
  <div class="c-app d-flex align-items-center min-vh-100" :class="{ 'c-dark-theme': $store.state.darkMode }">
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
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Register</h1>
                <p class="text-muted">Create your account</p>
                <CInput
                  placeholder="Email"
                  autocomplete="email"
                  prepend="@"
                  v-model=loginObj.email
                />
                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="new-password"
                  v-model=loginObj.password
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CInput
                  placeholder="Repeat password"
                  type="password"
                  autocomplete="new-password"
                  class="mb-4"
                  v-model=loginObj.passwordConfirmation
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CButton color="success" block @click.prevent="register">Create Account</CButton>
              </CForm>
            </CCardBody>
          
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data: () => {
    return {
      infoList: [],
      loginObj: {
        email: "",
        password: "",
        passwordConfirmation: "",
      },
      loading: false,
    };
  },
  methods: {
    gotToAdmin() {
      this.$router.push({ path: "/pages/tenantLogin" });
    },
    register() {
      this.loading = true;
      // let data = {
      //   email: this.loginObj.email,
      //   password: this.loginObj.password,
      // };
      
      var registerDto = {
        email: this.loginObj.email,
        password: this.loginObj.password,
        passwordConfirmation:this.loginObj.passwordConfirmation,
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
  },

}
</script>
