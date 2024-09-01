<template>
    <div class="d-flex align-items-center min-vh-100">
      <CContainer fluid>
        <CRow class="justify-content-center">
          <CCol md="6">
            <CCard class="mx-4 mb-0">
              <CCardBody class="p-4">
                <CForm class="mb-2 text-center">
                  <p class="text-muted">Registration Completed. </p>
                  <p class="text-muted">Verification had been sent to your email.</p>
                  <p class="text-muted">Please Verify Your Email.</p>
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
    name: "RegisterCompleted",
    data: () => {
      return {
        infoList: [],
      };
    },
    mounted() {
    },
    methods: {
    },
  };
  </script>
  
  <style lang="scss" scoped>
  
  </style>