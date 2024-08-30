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
         
        </CCardBody>
      </CCard>
    </div>
    
  </div>
</template>

<script>
import { freeSet } from "@coreui/icons";

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
    };
  },
  mounted() {
    var self = this;
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

      return apiUrl + "documents/file/" + item.documentId;
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
