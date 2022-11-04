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
            <CCardHeader> <strong> Room </strong> Information </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput
                  label="Category"
                  horizontal
                  readonly
                  v-model="selectedBuildingCodeCategory.name"
                >
                  <template #append>
                    <CButton
                      color="primary"
                      @click="onSearchBuildingCodeCategory()"
                    >
                      Search
                    </CButton>
                  </template>
                </CInput>
                <CInput label="Code" horizontal v-model="obj.name" />
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
    <div>
      <CModal
        title="Search for Maps"
        :show.sync="buildingCodeCategorySearchPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CCard>
              <!-- <CCardHeader> <strong> Campaign </strong> List </CCardHeader> -->
              <CCardBody>
                <CDataTable
                  :items="buildingCodeCategoryList"
                  :fields="buildingCodeCategoryFieldList"
                  column-filter
                  items-per-page-select
                  :items-per-page="10"
                  hover
                  sorter
                  pagination
                  :loading="loading"
                >
                  <template #show_details="{ item, index }">
                    <td class="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        square
                        size="sm"
                        @click="onBuildingCodeSelected(item, index)"
                      >
                        Select
                      </CButton>
                    </td>
                  </template>
                </CDataTable>
              </CCardBody>
              <CCardFooter> </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CModal>
    </div>
  </div>
</template>

<script>
import RoomApi from "../../lib/roomApi";
import BuildingCodeApi from "../../lib/buildingCodeApi";

import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  email,
  sameAs,
  helpers,
  numeric,
  maxLength,
} from "vuelidate/lib/validators";
import { resolvePlugin } from "@babel/core";

const buildingCodeCategoryList = [];
const buildingCodeCategoryFieldList = [
  // { key: "id", _style: "min-width:50px" },
  { key: "code", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "Map",
  data: () => {
    return {
      organizationTypeList: [],
      infoList: [],
      buildingCodeCategorySearchPopup: false,
      buildingCodeCategoryList: buildingCodeCategoryList.map((item, id) => {
        return { ...item, id };
      }),
      buildingCodeCategoryFieldList,
      obj: {
        name: "",
        code: "",
        assemblyConcentrated: "",
        assemblyLessConcentrated: "",
        standingSpace: "",
        kitchen: "",
      },
      selectedBuildingCodeCategory: {
        id: null,
        name: "",
        code: "",
      },
      submitted: false,
      buildingCodeApi: new BuildingCodeApi(),
      api: new RoomApi(),
      loading: false,
    };
  },
  mounted() {
    var self = this;
    // self.refreshOrganizationType();
    self.resetObj();
  },
  // validations: {
  //   obj: {
  //     code: {
  //       required,
  //       minLength: minLength(2),
  //       maxLength: maxLength(20),
  //     },
  //     name: {
  //       required,
  //       minLength: minLength(2),
  //       maxLength: maxLength(20),
  //     },
  //   },
  // },
  computed: {
    // formString() {
    //   return JSON.stringify(this.obj, null, 4);
    // },
    // isValid() {
    //   return !this.$v.obj.$invalid;
    // },
    // isDirty() {
    //   return this.$v.obj.$anyDirty;
    // },
  },
  methods: {
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            if (self.$route.params.id) {
              if (self.obj.buildingCodeId) {
                self.buildingCodeApi
                  .get(self.obj.buildingCodeId)
                  .then((response) => {
                    //console.log(response.result)
                    self.selectedBuildingCodeCategory = response.result;
                    // self.selectedBuildingCodeCategory.name = response.result.name;
                  })
                  .catch(({ data }) => {
                    self.toast("Error", helper.getErrorMessage(data), "danger");
                  });
              }
            }
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
    onSubmit() {
      //evt.preventDefault();
      var self = this;
      // self.obj.buildingCodeId = self.selectedBuildingCodeCategory.Id.toString();
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: `/tenant/WorkSpace/${self.obj.floorPlanId}` });
            
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            console.log(self.obj);
            self.$router.push({ path: `/tenant/WorkSpace/${self.obj.floorPlanId}` });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
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
    onBuildingCodeSelected(item, index) {
      var self = this;
      self.selectedBuildingCodeCategory = item;
      self.obj.buildingCodeId = item.id.toString();
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
      self.buildingCodeApi
        .getList()
        .then((response) => {
          self.buildingCodeCategoryList = response.result;
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
