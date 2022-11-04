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
              <strong> MinimumNumberOfExit </strong> Information
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput
                  label="Building Code"
                  horizontal
                  readonly
                  v-model="selectedBuildingCode.name"
                >
                  <template #append>
                    <CButton color="primary" @click="onSearchBuildingCode()">
                      Search
                    </CButton>
                  </template>
                </CInput>
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    No Of Door
                  </CCol>
                  <CCol sm="9">
                    <CDataTable
                      :items="minimumNumberOfExitItemList"
                      :fields="minimumNumberOfExitItemFieldList"
                      striped
                      caption="Striped Table"
                    >
                      <template #show_details="{ item, index }">
                        <td class="py-2">
                          <CButton
                            color="primary"
                            variant="outline"
                            square
                            size="sm"
                            @click="onRemove(item)"
                          >
                            Remove
                          </CButton>
                        </td>
                      </template>
                    </CDataTable>
                    <CButton
                      size="sm"
                      color="primary"
                      @click="onAddParameter()"
                    >
                      Add
                    </CButton>
                  </CCol>
                </CRow>
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
        title="Search for Rule"
        :show.sync="buildingCodeSearchPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CCard>
              <!-- <CCardHeader> <strong> Campaign </strong> List </CCardHeader> -->
              <CCardBody>
                <CDataTable
                  :items="buildingCodeList"
                  :fields="buildingCodeFieldList"
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
    <div>
      <CModal
        title="Add Parameter"
        :show.sync="addParameterPopup"
        size="xl"
        @update:show="onAddParameterConfirmation"
      >
        <CRow>
          <CCol sm="12">
            <CCard>
              <!-- <CCardHeader> <strong> Campaign </strong> List </CCardHeader> -->
              <CCardBody>
                <CForm>
                  <CInput
                    label="From"
                    horizontal
                    v-model="newParam.occupantLoadFactorBegin"
                  />
                  <CInput
                    label="To"
                    horizontal
                    v-model="newParam.occupantLoadFactorEnd"
                  />
                  <CInput
                    label="Minimum Door"
                    horizontal
                    v-model="newParam.count"
                  />
                </CForm>
              </CCardBody>
              <!-- <CCardFooter> </CCardFooter> -->
            </CCard>
          </CCol>
        </CRow>
      </CModal>
    </div>
  </div>
</template>

<script>
import BuildingCodeApi from "../../lib/buildingCodeApi";
import MinimumNumberOfExitApi from "../../lib/minimumNumberOfExitApi";

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

const buildingCodeList = [];
const buildingCodeFieldList = [
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

const minimumNumberOfExitItemList = [];
const minimumNumberOfExitItemFieldList = [
  { key: "occupantLoadFactorBegin", _style: "min-width:200px;" },
  { key: "occupantLoadFactorEnd", _style: "min-width:200px;" },
  { key: "count", _style: "min-width:200px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "MinimumNumberOfExit",
  data: () => {
    return {
      addParameterPopup: false,
      organizationTypeList: [],
      infoList: [],
      buildingCodeSearchPopup: false,
      buildingCodeList: buildingCodeList.map((item, id) => {
        return { ...item, id };
      }),
      buildingCodeFieldList,
      minimumNumberOfExitItemList: minimumNumberOfExitItemList.map(
        (item, index) => {
          return { ...item, index };
        }
      ),
      minimumNumberOfExitItemFieldList,
      obj: {
        minimumNumberOfExitItems: [],
      },
      selectedBuildingCode: {
        id: null,
        name: "",
        code: "",
      },
      newParam: {
        occupantLoadFactorBegin: 0,
        occupantLoadFactorEnd: 0,
        count: 0,
      },
      submitted: false,
      buildingCodeApi: new BuildingCodeApi(),
      api: new MinimumNumberOfExitApi(),
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
    // computedBuildingCodeList() {
    //   return this.buildingCodeList.map((item) => {
    //     return {
    //       ...item,
    //       buildingCodeCategoryName: this.getBuildingCodeCategoryName(item),
    //       // buildingCodeName: this.getBuildingCodeName(item),
    //     };
    //   });
    // },
    // isValid() {
    //   return !this.$v.obj.$invalid;
    // },
    // isDirty() {
    //   return this.$v.obj.$anyDirty;
    // },
  },
  methods: {
    // getBuildingCodeCategoryName(item) {
    //   try {
    //     return item.buildingCodeCategory.name;
    //   } catch (error) {

    //   }
    //   return "N/A";
    // },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
            self.minimumNumberOfExitItemList =
              self.obj.minimumNumberOfExitItems;

            if (self.$route.params.id) {
              self.buildingCodeApi
                .get(self.obj.buildingCodeId)
                .then((response) => {
                  //console.log(response.result)
                  self.selectedBuildingCode = response.result;
                  // self.selectedBuildingCode.name = response.result.name;
                })
                .catch(({ data }) => {
                  self.toast("Error", helper.getErrorMessage(data), "danger");
                });
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
      var self = this;
      self.obj.minimumNumberOfExitItems = self.minimumNumberOfExitItemList;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/minimumNumberOfExitList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/minimumNumberOfExitList" });
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
    // onSearchBuildingCode() {
    //   var self = this;
    //   self.refreshTableBuildingCode();
    //   self.buildingCodeSearchPopup = true;
    // },
    // onBuildingCodeSelected(item, index) {
    //   var self = this;
    //   self.selectedBuildingCode = item;
    //   self.obj.buildingCodeId = item.id.toString();
    //   //self.obj.map = self.mapList[index];

    //   // self.selectedLocation = {
    //   //   id: null,
    //   //   name: "",
    //   //   code: "",
    //   // };
    //   self.buildingCodeSearchPopup = false;
    // },
    // refreshTableBuildingCode() {
    //   var self = this;
    //   self.loading = true;
    //   self.buildingCodeApi
    //     .getList()
    //     .then((response) => {
    //       self.buildingCodeList = response.result;
    //       self.loading = false;
    //     })
    //     .catch(({ data }) => {
    //       self.toast("Error", helper.getErrorMessage(data), "danger");
    //       // console.log(data);
    //     });
    // },

    onSearchBuildingCode() {
      var self = this;
      self.refreshTableBuildingCode();
      self.buildingCodeSearchPopup = true;
    },
    onBuildingCodeSelected(item, index) {
      var self = this;
      self.selectedBuildingCode = item;
      self.obj.buildingCodeId = item.id.toString();
      //self.obj.map = self.mapList[index];

      // self.selectedLocation = {
      //   id: null,
      //   name: "",
      //   code: "",
      // };
      self.buildingCodeSearchPopup = false;
    },
    refreshTableBuildingCode() {
      var self = this;
      self.loading = true;
      self.buildingCodeApi
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
    onAddParameter() {
      var self = this;
      //self.refreshTableArea();
      self.addParameterPopup = true;
    },
    onAddParameterConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        self.minimumNumberOfExitItemList.push({
          occupantLoadFactorBegin: self.newParam.occupantLoadFactorBegin,
          occupantLoadFactorEnd: self.newParam.occupantLoadFactorEnd,
          count: self.newParam.count,
        });
        // var tempList = [];
        // for (let i = 0; i <= self.areaList.length; i++) {
        //   try {
        //     if (
        //       self.areaList[i]._selected !== undefined &&
        //       self.areaList[i]._selected == true
        //     ) {
        //       tempList.push({
        //         areaId: self.areaList[i].id,
        //         area: self.areaList[i],
        //       });
        //     }
        //   } catch (err) {
        //     //     console.log(err);
        //   }
        // }
        // self.minimumNumberOfExitItemList = tempList;
        //   console.log(tempList);
      }
    },
    onRemove(item) {
      var self = this;
      const index = self.minimumNumberOfExitItemList.indexOf(item);
      if (index > -1) {
        self.minimumNumberOfExitItemList.splice(index, 1);
      }
    },
  },
};
</script>
