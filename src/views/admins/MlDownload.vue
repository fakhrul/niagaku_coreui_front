<template>
  <div class="wrapper">
    <div>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Machine Learning </strong> Information </CCardHeader>
            <CCardBody>
            </CCardBody>
            <CCardFooter>
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="onSubmit"
                ><CIcon name="cil-check-circle" /> Download</CButton
              >

            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import BillApi from "@/lib/billApi";

export default {
  name: "MlDownload",
  data: () => {
    return {
      billApi: new BillApi(),
    };
  },
  mounted() {
   
  },
 
  computed: {
  
  
  },
  methods: {
    onSubmit() {
      this.billApi
          .getBillDataSet()
          .then((response) => {
          })
          .catch(({ data }) => {
            // self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
    },

  },
};
</script>
