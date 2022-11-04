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
      <CCard>
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 class="card-title mb-0">Your Drawings</h4>
              <div class="small text-muted">
                Total Drawing: {{ items.length }}
              </div>
            </CCol>
            <CCol sm="7">
              <CButton class="float-right" color="primary" @click="addNew">
                <CIcon :content="$options.freeSet.cilPlus" />
              </CButton>
            </CCol>
          </CRow>
          <CRow class="text-center" style="margin-top: 20px">
            <template v-for="item in items">
              <CCol class="mb-5" col="2" sm="2" :key="item.id">
                <div @click="onLoadWorkspace(item)">
                  {{ item.name }}
                  <CImg
                    thumbnail
                    :src="floorPlanUrl(item)"
                    height="150"
                    width="150"
                    style="margin-top: 10px"
                  />
                </div>
                <!-- <CIcon :height="42" :content="icon" />
                    <div>{{ toKebabCase(iconName) }}</div> -->
              </CCol>
            </template>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
    <div>
      <CModal
        title="Add New Drawing"
        :show.sync="addNewPopup"
        size="xl"
        @update:show="onAddNewConfirmation"
        :closeOnBackdrop="false"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <CInput label="Name" horizontal v-model="newObj.name" />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> Image </CCol>
                <CCol sm="9">
                  <WidgetsUploadImage
                    :floorPlanUrl="newFloorPlanUrl"
                    @uploaded="uploaded"
                  />
                </CCol>
              </CRow>
            </CForm>
            <CButton type="submit" size="sm" color="primary" @click="submit"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            >
          </CCol>
        </CRow>
      </CModal>
    </div>
  </div>
</template>

<script>
import FloorPlanApi from "../lib/floorPlanApi";
import { freeSet } from "@coreui/icons";
import WidgetsUploadImage from "./widgets/WidgetsUploadImage.vue";

const items = [];
const fields = [
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
  name: "Dashboard",
  freeSet,
  components: {
    WidgetsUploadImage,
  },
  data() {
    return {
      addNewPopup: false,
      uploadedFiles: [],
      infoList: [],

      items: items.map((item, id) => {
        return { ...item, id };
      }),
      newObj: {
        name: "",
        documentId: null,
      },
      fields,
      api: new FloorPlanApi(),
    };
  },
  mounted() {
    var self = this;
    self.refreshTable();
  },
  computed: {
    newFloorPlanUrl() {
      var self = this;
      console.log('process.env.VUE_APP_API_URL',process.env.VUE_APP_API_URL);
      return (
        process.env.VUE_APP_API_URL + "documents/file/" + self.newObj.documentId
      );
    },
  },

  methods: {
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },

    submit() {},
    uploaded(data) {
      this.uploadedFiles = data.uploadedFiles;
      console.log('this.uploadedFiles',this.uploadedFiles)
      if (this.uploadedFiles == null) return;
      if (this.uploadedFiles.length > 0)
        this.newObj.documentId = this.uploadedFiles[0].id;
    },

    addNew() {
      this.newObj = {
        name: "",
      };
      this.uploadedFiles = [];
      this.addNewPopup = true;
    },
    onAddNewConfirmation(status, evt, accept) {
      if (accept) {
        if (this.uploadedFiles.length > 0)
          this.newObj.documentId = this.uploadedFiles[0].id;

        this.api
          .create(this.newObj)
          .then((response) => {
            this.toast("Success", "New drawing added", "success");
            this.refreshTable();
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },
    floorPlanUrl(item) {
      console.log('process.env.VUE_APP_API_URL',process.env.VUE_APP_API_URL);

      return process.env.VUE_APP_API_URL + "documents/file/" + item.documentId;
    },
    onAddNewWorkspace() {
      alert("In Development");
    },
    onLoadWorkspace(item) {
      var self = this;
      self.$router.push({
        path: `/Workspace/${item.id}`,
      });
    },
    refreshTable() {
      var self = this;
      self.api
        .getList()
        .then((response) => {
          self.items = response.result;
        })
        .catch(({ data }) => {});
    },
  },
};
</script>
