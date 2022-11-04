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
              <strong> EgressParameter </strong> Information
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
                <CInput
                  label="Minimum Door Width (mm)"
                  horizontal
                  v-model="obj.minimumEgressDoorWidthInMM"
                />
                <CInput
                  label="Minimum Stair Width (mm)"
                  horizontal
                  v-model="obj.minimumEgressStairWidthInMM"
                />
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Stair Width
                  </CCol>
                  <CCol sm="9">
                    <CDataTable
                      :items="computedParamExitStairWidthItemList"
                      :fields="paramExitStairWidthItemFieldList"
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
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Door Width
                  </CCol>
                  <CCol sm="9">
                    <CDataTable
                      :items="computedParamExitDoorWidthItemList"
                      :fields="paramExitStairWidthItemFieldList"
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
                            @click="onRemoveDoor(item)"
                          >
                            Remove
                          </CButton>
                        </td>
                      </template>
                    </CDataTable>
                    <CButton
                      size="sm"
                      color="primary"
                      @click="onAddParameterDoor()"
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
        title="Search for Code"
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
                  <CSelect
                    label="Building Category"
                    horizontal
                    :options="buildingCategoryList"
                    :value.sync="newParam.olfMainCategoryId"
                  >
                  </CSelect>

                  <CInput
                    label="Exit Width Per Person (mm)"
                    horizontal
                    v-model="newParam.widthPerPersonInMm"
                  />
                </CForm>
              </CCardBody>
              <!-- <CCardFooter> </CCardFooter> -->
            </CCard>
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal
        title="Add Door Parameter"
        :show.sync="addParameterDoorPopup"
        size="xl"
        @update:show="onAddParameterDoorConfirmation"
      >
        <CRow>
          <CCol sm="12">
            <CCard>
              <!-- <CCardHeader> <strong> Campaign </strong> List </CCardHeader> -->
              <CCardBody>
                <CForm>
                  <CSelect
                    label="Building Category"
                    horizontal
                    :options="buildingCategoryList"
                    :value.sync="newParam.olfMainCategoryId"
                  >
                  </CSelect>

                  <CInput
                    label="Exit Width Per Person (mm)"
                    horizontal
                    v-model="newParam.widthPerPersonInMm"
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
import BuildingCodeApi from "@/lib/buildingCodeApi";
import ParamEgressApi from "../../lib/paramEgressApi";
import OlfMainCategoryApi from "../../lib/olfMainCategoryApi";

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

const paramExitDoorWidthItemList = [];
const paramExitStairWidthItemList = [];
const paramExitStairWidthItemFieldList = [
  { key: "olfMainCategoryName", _style: "min-width:200px;" },
  { key: "widthPerPersonInMm", _style: "min-width:200px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "EgressParameter",
  data: () => {
    return {
      addParameterPopup: false,
      addParameterDoorPopup: false,
      organizationTypeList: [],
      infoList: [],
      buildingCodeSearchPopup: false,
      buildingCodeList: buildingCodeList.map((item, id) => {
        return { ...item, id };
      }),
      buildingCodeFieldList,
      paramExitStairWidthItemList: paramExitStairWidthItemList.map(
        (item, index) => {
          return { ...item, index };
        }
      ),
      paramExitStairWidthItemFieldList,
      paramExitDoorWidthItemList: paramExitDoorWidthItemList.map(
        (item, index) => {
          return { ...item, index };
        }
      ),
      
      obj: {
        paramExitStairWidthItems: [],
        minimumEgressDoorWidthInMM: 810,
        MinimumEgressStairWidthInMM: 1100,
      },
      selectedBuildingCode: {
        id: null,
        name: "",
        code: "",
      },
      newParam: {
        olfMainCategoryId: "",
        olfMainCategory: {
          name: "",
        },
        widthPerPersonInMm: 0,
      },
      submitted: false,
      buildingCodeApi: new BuildingCodeApi(),
      api: new ParamEgressApi(),
      olfMainCategoryApi: new OlfMainCategoryApi(),
      loading: false,
      buildingCategories: [],
      buildingCategoryList: [],
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
    computedParamExitDoorWidthItemList() {
      return this.paramExitDoorWidthItemList.map((item) => {
        return {
          ...item,
          olfMainCategoryName: this.getBuildingCodeCategoryName(item),
          // buildingCodeName: this.getBuildingCodeName(item),
        };
      });
    },
    computedParamExitStairWidthItemList() {
      return this.paramExitStairWidthItemList.map((item) => {
        return {
          ...item,
          olfMainCategoryName: this.getBuildingCodeCategoryName(item),
          // buildingCodeName: this.getBuildingCodeName(item),
        };
      });
    },
    // isValid() {
    //   return !this.$v.obj.$invalid;
    // },
    // isDirty() {
    //   return this.$v.obj.$anyDirty;
    // },
  },
  methods: {
    getBuildingCodeCategoryName(item) {
      try {
        console.log(item);
        return item.olfMainCategory.name;
      } catch (error) {}
      return "N/A";
    },
    refreshTableBuildingCategory() {
      var self = this;
      self.olfMainCategoryApi
        .getList()
        .then((response) => {
          self.buildingCategories = response.result;
          self.buildingCategoryList = [];
          for (let i = 0; i < response.result.length; i++) {
            self.buildingCategoryList.push({
              value: response.result[i].id,
              label: response.result[i].name,
            });
          }

          self.newParam.olfMainCategoryId =
            self.buildingCategoryList[0].value;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
            self.paramExitStairWidthItemList =
              self.obj.paramExitStairWidthItems;
            self.paramExitDoorWidthItemList = self.obj.paramExitDoorWidthItems;

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
      self.obj.paramExitStairWidthItems =
        self.computedParamExitStairWidthItemList;
  self.obj.paramExitDoorWidthItems =
        self.computedParamExitDoorWidthItemList;
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/EgressParameterList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/EgressParameterList" });
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
      self.refreshTableBuildingCategory();
      self.addParameterPopup = true;
    },
    onAddParameterConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        self.olfMainCategoryApi
          .get(self.newParam.olfMainCategoryId)
          .then((response) => {
            self.newParam.olfMainCategory = response.result;
            self.paramExitStairWidthItemList.push({
              olfMainCategoryId: self.newParam.olfMainCategoryId,
              olfMainCategory: self.newParam.olfMainCategory,
              widthPerPersonInMm: self.newParam.widthPerPersonInMm,
            });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
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
        // self.paramExitStairWidthItemList = tempList;
        //   console.log(tempList);
      }
    },
    onRemove(item) {
      var self = this;
      console.log(item);
      const index = self.computedParamExitStairWidthItemList.indexOf(item);
      console.log(self.paramExitStairWidthItemList);
      console.log(index);
      if (index > -1) {
        self.computedParamExitStairWidthItemList.splice(index, 1);
      }
    },

    //

    onAddParameterDoor() {
      var self = this;
      //self.refreshTableArea();
      self.refreshTableBuildingCategory();
      self.addParameterDoorPopup = true;
    },
    onAddParameterDoorConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        self.olfMainCategoryApi
          .get(self.newParam.olfMainCategoryId)
          .then((response) => {
            self.newParam.olfMainCategory = response.result;
            self.paramExitDoorWidthItemList.push({
              olfMainCategoryId: self.newParam.olfMainCategoryId,
              olfMainCategory: self.newParam.olfMainCategory,
              widthPerPersonInMm: self.newParam.widthPerPersonInMm,
            });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    onRemoveDoor(item) {
      var self = this;
      console.log(item);
      const index = self.computedParamExitDoorWidthItemList.indexOf(item);
      console.log(self.paramExitDoorWidthItemList);
      console.log(index);
      if (index > -1) {
        self.computedParamExitDoorWidthItemList.splice(index, 1);
      }
    },

  },
};
</script>
