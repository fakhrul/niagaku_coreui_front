<template>
  <div
    class="c-app flex-row align-items-center"
    :class="{ 'c-dark-theme': $store.state.darkMode }"
  >
    <CContainer>
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
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm class="mb-2 text-center">
                  <CImg :src="logoUrl" width="300" class="mb-2"></CImg>
                  <h5>NiagaKu.COM</h5>
                  <CInput
                    placeholder="Username"
                    autocomplete="username email"
                    v-model="loginObj.email"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-user"
                    /></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="current-password"
                    v-model="loginObj.password"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-lock-locked"
                    /></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton
                        color="primary"
                        class="px-4"
                        @click.prevent="login"
                        >Login</CButton
                      >
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton
                        color="link"
                        class="px-0"
                        @click="navigateTo('/forgotPassword')"
                        >Forgot password?</CButton
                      >
                      <CButton
                        color="link"
                        class="px-0"
                        @click="navigateTo('/register')"
                        >Register now!</CButton
                      >
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
              <CCardFooter>
                <CRow>
                  <CCol class="text-center">
                    <p>{{ version }}</p>
                  </CCol>
                </CRow>
                <!-- <CRow>
                  <CCol>
                    <h3>System Admin</h3>
                    <ul>
                      <li>admin@niagaku.com</li>
                    </ul>
                  </CCol>
                </CRow> -->
                <CRow>
                  <CCol>
                    <h3>Demo Account</h3>
                    <ul>
                      <li>tenant1@niagaku.com (Admin)</li>
                      <li>accountant1_1@tenant1.com (Accountant)</li>
                      <li>staff1_1@tenant1.com (Normal Staff)</li>
                    </ul>
                  </CCol>
                </CRow>
                <!-- <CRow>
                  <CCol>
                    <h3>Tenant 2</h3>
                    <ul>
                      <li>tenant2@niagaku.com (Tenant Owner)</li>
                      <li>accountant1_1@tenant2.com (Accountant)</li>
                      <li>staff1_1@tenant2.com (Normal Staff)</li>
                    </ul>
                  </CCol>
                </CRow> -->
                
              </CCardFooter>
            </CCard>
          </CCardGroup>
          <CRow>
            <CCol class="text-right">
              version 1.12
            </CCol>
          </CRow>
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
      logoUrl: "/img/logo.png",
      loginObj: {
        email: "tenant1@niagaku.com",
        password: "",
      },
      loading: false,
    };
  },
  computed: {
    version() {
      return process.env.VUE_APP_VERSION;
    },
  },
  methods: {
    gotToAdmin() {
      this.$router.push({ path: "/pages/tenantLogin" });
    },
    login() {
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
      // Generic method to handle all navigation actions
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
};
</script>
