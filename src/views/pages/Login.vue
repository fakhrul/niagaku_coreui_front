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
                  <h5>Billing Record & Analysis System</h5>
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
                    autocomplete="curent-password"
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
                    <!-- <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0"
                        >Forgot password?</CButton
                      >
                      <CButton color="link" class="d-lg-none"
                        >Register now!</CButton
                      >
                    </CCol> -->
                  </CRow>
                </CForm>
              </CCardBody>
              <CCardFooter>
                <CRow>
                  <CCol class="text-center">
                    <p>{{ version }}</p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <h3>System Admin</h3>
                    <ul>
                      <li>admin@niagaku.com</li>
                    </ul>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <h3>Tenant 1</h3>
                    <ul>
                      <li>tenant1@niagaku.com</li>
                      <li>accountant1_1@tenant1.com</li>
                      <li>accountant1_2@tenant1.com</li>
                      <li>staff1_1@tenant1.com</li>
                      <li>staff1_2@tenant1.com</li>
                      <li>staff1_3@tenant1.com</li>
                    </ul>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <h3>Tenant 2</h3>
                    <ul>
                      <li>tenant2@niagaku.com</li>
                      <li>accountant1_1@tenant2.com</li>
                      <li>accountant1_2@tenant2.com</li>
                      <li>staff1_1@tenant2.com</li>
                      <li>staff1_2@tenant2.com</li>
                      <li>staff1_3@tenant2.com</li>
                    </ul>
                  </CCol>
                </CRow>
              </CCardFooter>

            </CCard>
          </CCardGroup>
          <CRow>
            <CCol class="text-right">
              version 1.12
              <!-- <CLink @click="gotToAdmin">Admin Login</CLink> -->
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
      logoUrl: "img/logo.png",
      loginObj: {
        email: "admin@niagaku.com",
        password: "qwe123",
        // authenticated: true,
      },
    };
  },
  computed: {
    version() {
      return process.env.VUE_APP_VERSION;
    },
  },
  methods: {
    gotToAdmin() {
      var self = this;
      self.$router.push({ path: "/pages/tenantLogin" });
    },

    login() {
      var self = this;
      let data = {
        email: self.loginObj.email,
        password: self.loginObj.password,
      };
      auth
        .doLogin(data)
        .then((response) => {
          //      console.log(response.result);
          console.log(response);
          auth.recordLogin(response.accessToken, response, false);
          self.$router.push({ path: "/" });
          // self.$router.push({ path: "/" });
        })
        .catch(({ data }) => {
          //alert(data.exceptionMessage);
          //      console.log(data);
          self.toast(
            "Error",
            data.responseException.exceptionMessage.title,
            "danger"
          );
        });
    },

    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
  },
};
</script>
