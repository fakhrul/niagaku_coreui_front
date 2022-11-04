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
              <strong> Occupant Load Factor </strong> Information
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
                  label="Main Category"
                  horizontal
                  readonly
                  v-model="selectedMainCategory.name"
                >
                  <template #append>
                    <CButton color="primary" @click="onSearchMainCategory()">
                      Search
                    </CButton>
                  </template>
                </CInput>

                <CInput
                  label="Sub Category"
                  horizontal
                  readonly
                  v-model="selectedSubCategory.name"
                >
                  <template #append>
                    <CButton color="primary" @click="onSearchSubCategory()">
                      Search
                    </CButton>
                  </template>
                </CInput>

                <CInput label="Value" horizontal v-model="obj.olfValue" />
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" color="primary" @click="submit"
                ><CIcon name="cil-check-circle" /> Submit</CButton
              >
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
    <div>
      <CModal :show.sync="mainCategorySearchPopup" size="xl">
        <template #header>
          <h6 class="modal-title">Select Main Category</h6>
        </template>
        <template #footer>
          <CButton @click="mainCategorySearchPopup = false" color="secondary"
            >Close</CButton
          >
          <CButton @click="addNewMainCategory()" color="primary"
            >Add New</CButton
          >
          <!-- <CButton @click="darkModal = false" color="success">Accept</CButton> -->
        </template>

        <CRow>
          <CCol sm="12">
            <CDataTable
              :items="mainCategoryList"
              :fields="mainCategoryFieldList"
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
                    @click="onMainCategorySelected(item, index)"
                  >
                    Select
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal :show.sync="subCategorySearchPopup" size="xl">
        <template #header>
          <h6 class="modal-title">Select Sub Category</h6>
        </template>
        <template #footer>
          <CButton @click="subCategorySearchPopup = false" color="secondary"
            >Close</CButton
          >
          <CButton @click="addNewSubCategory()" color="primary"
            >Add New</CButton
          >
          <!-- <CButton @click="darkModal = false" color="success">Accept</CButton> -->
        </template>

        <CRow>
          <CCol sm="12">
            <CDataTable
              :items="subCategoryList"
              :fields="subCategoryFieldList"
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
                    @click="onSubCategorySelected(item, index)"
                  >
                    Select
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal :show.sync="buildingCodeSearchPopup" size="xl">
        <template #header>
          <h6 class="modal-title">Select Building Code</h6>
          <!-- <CButtonClose @click="darkModal = false" class="text-white" /> -->
        </template>
        <template #footer>
          <CButton @click="buildingCodeSearchPopup = false" color="secondary"
            >Close</CButton
          >
          <CButton @click="addNewBuildingCode()" color="primary"
            >Add New</CButton
          >
          <!-- <CButton @click="darkModal = false" color="success">Accept</CButton> -->
        </template>

        <CRow>
          <CCol sm="12">
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
                    @click="onBuildingCodeSelected(item, index)"
                  >
                    Select
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal
        title="Add New Building Code"
        :show.sync="addNewBuildingCodePopup"
      >
        <CForm>
          <CInput label="Code" horizontal v-model="newBuildingCodeObj.code" />
          <CInput label="Name" horizontal v-model="newBuildingCodeObj.name" />
          <CInput
            label="Description"
            horizontal
            v-model="newBuildingCodeObj.description"
          />
        </CForm>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onNewBuildingCodeConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="addNewBuildingCodePopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal
        title="Add New Main Category"
        :show.sync="addNewMainCategoryPopup"
      >
        <CForm>
          <CInput label="Code" horizontal v-model="newMainCategoryObj.code" />
          <CInput label="Name" horizontal v-model="newMainCategoryObj.name" />
          <CInput
            label="Description"
            horizontal
            v-model="newMainCategoryObj.description"
          />
        </CForm>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onNewMainCategoryConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="addNewMainCategoryPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal title="Add New Sub Category" :show.sync="addNewSubCategoryPopup">
        <CForm>
          <CInput label="Code" horizontal v-model="newSubCategoryObj.code" />
          <CInput label="Name" horizontal v-model="newSubCategoryObj.name" />
          <CInput
            label="Description"
            horizontal
            v-model="newSubCategoryObj.description"
          />
        </CForm>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onNewSubCategoryConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="addNewSubCategoryPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>
  </div>
</template>

<script>
import BuildingCodeApi from "../../lib/buildingCodeApi";
import OlfMainCategoryApi from "../../lib/olfMainCategoryApi";
import OlfSubCategoryApi from "../../lib/olfSubCategoryApi";
import OccupantLoadFactorApi from "../../lib/occupantLoadFactorApi";

// import { validationMixin } from "vuelidate";
// import {
//   required,
//   minLength,
//   email,
//   sameAs,
//   helpers,
//   numeric,
//   maxLength,
// } from "vuelidate/lib/validators";
// import { resolvePlugin } from "@babel/core";

const subCategoryList = [];
const subCategoryFieldList = [
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

const mainCategoryList = [];
const mainCategoryFieldList = [
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

export default {
  name: "Map",
  data: () => {
    return {
      buildingCodeSearchPopup: false,
      addNewBuildingCodePopup: false,
      mainCategorySearchPopup: false,
      addNewMainCategoryPopup: false,
      subCategorySearchPopup: false,
      addNewSubCategoryPopup: false,

      organizationTypeList: [],
      infoList: [],
      newBuildingCodeObj: {
        code: "",
        name: "",
        description: "",
      },
      newMainCategoryObj: {
        code: "",
        name: "",
        description: "",
      },
      newSubCategoryObj: {
        code: "",
        name: "",
        description: "",
      },
      buildingCodeList: buildingCodeList.map((item, id) => {
        return { ...item, id };
      }),
      buildingCodeFieldList,

      mainCategoryList: mainCategoryList.map((item, id) => {
        return { ...item, id };
      }),
      mainCategoryFieldList,

      subCategoryList: subCategoryList.map((item, id) => {
        return { ...item, id };
      }),
      subCategoryFieldList,

      obj: {
        value: 0,
      },
      selectedSubCategory: {
        id: null,
        name: "",
        code: "",
      },
      selectedMainCategory: {
        id: null,
        name: "",
        code: "",
      },
      selectedBuildingCode: {
        id: null,
        name: "",
        code: "",
      },
      submitted: false,
      buildingCodeApi: new BuildingCodeApi(),
      olfMainCategoryApi: new OlfMainCategoryApi(),
      olfSubCategoryApi: new OlfSubCategoryApi(),
      occupantLoadFactorApi: new OccupantLoadFactorApi(),
      loading: false,
    };
  },
  mounted() {
    var self = this;
    // self.refreshOrganizationType();
    self.resetObj();
  },
  computed: {
    computedBuildingCodeList() {
      return this.buildingCodeList.map((item) => {
        return {
          ...item,
          buildingCodeCategoryName: this.getBuildingCodeCategoryName(item),
          // buildingRuleName: this.getBuildingRuleName(item),
        };
      });
    },
  },
  methods: {
    onNewMainCategoryConfirmation() {
      this.onSubmitMainCategory();
      this.addNewMainCategoryPopup = false;
    },

    onSubmitMainCategory() {
      var self = this;
      if (!self.newMainCategoryObj.id) {
        this.olfMainCategoryApi
          .create(self.newMainCategoryObj)
          .then((response) => {
            self.refreshTableMainCategory();
            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.newMainCategoryObj)
          .then((response) => {
            self.refreshTableMainCategory();

            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },

    onNewSubCategoryConfirmation() {
      this.onSubmitSubCategory();
      this.addNewSubCategoryPopup = false;
    },

    onSubmitSubCategory() {
      var self = this;
      if (!self.newSubCategoryObj.id) {
        this.olfSubCategoryApi
          .create(self.newSubCategoryObj)
          .then((response) => {
            self.refreshTableSubCategory();
            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.newSubCategoryObj)
          .then((response) => {
            self.refreshTableSubCategory();

            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },

    onNewBuildingCodeConfirmation() {
      this.onSubmitBuildingCode();
      this.addNewBuildingCodePopup = false;
    },

    onSubmitBuildingCode() {
      var self = this;
      if (!self.newBuildingCodeObj.id) {
        this.buildingCodeApi
          .create(self.newBuildingCodeObj)
          .then((response) => {
            self.refreshTableBuildingCode();
            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.newBuildingCodeObj)
          .then((response) => {
            self.refreshTableBuildingCode();

            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },
    addNewMainCategory() {
      this.newMainCategoryObj.code = "";
      this.newMainCategoryObj.name = "";
      this.newMainCategoryObj.description = "";

      this.addNewMainCategoryPopup = true;
    },
    addNewSubCategory() {
      this.newSubCategoryObj.code = "";
      this.newSubCategoryObj.name = "";
      this.newSubCategoryObj.description = "";

      this.addNewSubCategoryPopup = true;
    },
    addNewBuildingCode() {
      this.newBuildingCodeObj.code = "";
      this.newBuildingCodeObj.name = "";
      this.newBuildingCodeObj.description = "";

      this.addNewBuildingCodePopup = true;
    },
    getBuildingCodeCategoryName(item) {
      try {
        return item.buildingCodeCategory.name;
      } catch (error) {}
      return "N/A";
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.occupantLoadFactorApi
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log("self.obj",self.obj)
            self.selectedBuildingCode = self.obj.buildingCode;
            self.selectedMainCategory = self.obj.olfMainCategory;
            self.selectedSubCategory = self.obj.olfSubCategory;
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
      self.obj.buildingCodeId = self.selectedBuildingCode.id.toString();
      self.obj.olfMainCategoryId = self.selectedMainCategory.id.toString();
      self.obj.olfSubCategoryId = self.selectedSubCategory.id.toString();

      if (!self.obj.id) {
        this.occupantLoadFactorApi
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/occupantLoadFactorList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.occupantLoadFactorApi
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/occupantLoadFactorList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    onReset() {
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
      this.onSubmit();
      this.submitted = true;
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
      self.buildingCodeSearchPopup = false;
    },
    refreshTableBuildingCode() {
      var self = this;
      self.loading = true;
      self.buildingCodeList = [];
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

    onSearchMainCategory() {
      var self = this;
      self.refreshTableMainCategory();
      self.mainCategorySearchPopup = true;
    },
    onMainCategorySelected(item, index) {
      var self = this;
      self.selectedMainCategory = item;
      self.obj.olfMainCategoryId = item.id.toString();
      //self.obj.map = self.mapList[index];

      // self.selectedLocation = {
      //   id: null,
      //   name: "",
      //   code: "",
      // };
      self.mainCategorySearchPopup = false;
    },
    refreshTableMainCategory() {
      var self = this;
      self.loading = true;
      self.mainCategoryList = [];
      self.olfMainCategoryApi
        .getList()
        .then((response) => {
          self.mainCategoryList = response.result;
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          // console.log(data);
        });
    },

    onSearchSubCategory() {
      var self = this;
      self.refreshTableSubCategory();
      self.subCategorySearchPopup = true;
    },
    onSubCategorySelected(item, index) {
      var self = this;
      self.selectedSubCategory = item;
      self.obj.olfSubCategoryId = item.id.toString();
      self.subCategorySearchPopup = false;
    },
    refreshTableSubCategory() {
      var self = this;
      self.loading = true;
      self.mainCategoryList = [];
      self.olfSubCategoryApi
        .getList()
        .then((response) => {
          self.subCategoryList = response.result;
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
