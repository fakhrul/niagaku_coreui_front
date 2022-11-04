<template>
  <div>
    <div>
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
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              <strong> Building Code </strong> Information
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput label="Code" horizontal v-model="obj.code" />
                <CInput label="Name" horizontal v-model="obj.name" />
                <CInput
                  label="Description"
                  horizontal
                  v-model="obj.description"
                />
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" size="sm" color="primary" @click="submit"
                ><CIcon name="cil-check-circle" /> Submit</CButton
              >
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import BuildingCodeApi from "../../lib/buildingCodeApi";

export default {
  name: "BuildingCode",
  data: () => {
    return {
      infoList: [],

      obj: {
        name: "",
        code: "",
      },
      submitted: false,
      api: new BuildingCodeApi(),
      loading: false,
    };
  },
  mounted() {
    var self = this;
    self.resetObj();
  },
 
  computed: {
   
  },
  methods: {
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
    onSubmit() {
      var self = this;
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/buildingCodeList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/buildingCodeList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    onReset() {
      //evt.preventDefault();
      this.obj = {};
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },

    checkIfValid(fieldName) {
      const field = this.$v.obj[fieldName];
      if (!field.$dirty) {
        return null;
      }
      return !(field.$invalid || field.$model === "");
    },
    validate() {
      this.$v.$touch();
    },
    reset() {
      // this.obj = this.getEmptyObj();
      this.resetObj();
      this.submitted = false;
      this.$v.$reset();
    },
    getEmptyObj() {
      return {
        code: "",
        name: "",
      };
    },
    submit() {
      // if (this.isValid) {
      this.onSubmit();
      this.submitted = true;
      // }
    },
    cancel() {
      this.$router.push({ path: "/tenant/maplist" });
    },
    onSearchBuildingCodeCategory() {
      var self = this;
      self.refreshTableBuildingCodeCategory();
      self.buildingCodeCategorySearchPopup = true;
    },
    onBuildingCodeCategorySelected(item, index) {
      var self = this;
      self.selectedBuildingCodeCategory = item;
      self.obj.buildingCodeCategoryId = item.id.toString();
      //self.obj.map = self.mapList[index];

      // self.selectedLocation = {
      //   id: null,
      //   name: "",
      //   code: "",
      // };
      self.buildingCodeCategorySearchPopup = false;
    },
    refreshTableBuildingCodeCategory() {
      var self = this;
      self.loading = true;
      self.olfMainCategoryApi
        .getList()
        .then((response) => {
          self.buildingCodeList = response.result;
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          // console.log(data);
        });
    },
  },
};
</script>
