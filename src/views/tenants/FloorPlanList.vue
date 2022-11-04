<template>
  <div class="wrapper">
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
    </div>
    <div>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> FloorPlan </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="items"
                :fields="fields"
                column-filter
                items-per-page-select
                :items-per-page="10"
                hover
                sorter
                pagination
                :loading="loading"
              >
                <!-- <template #tenant_name="{ item }">
                  <td>
                    {{ item.tenant.fullName }}
                  </td>
                </template> -->
                <!-- <template #status="{item}">
              <td>
                <CBadge :color="getBadge(item.status)">
                  {{ item.status }}
                </CBadge>
              </td>
            </template>
            -->
                <template #show_details="{ item, index }">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="toggleDetails(item, index)"
                    >
                      {{ Boolean(item._toggled) ? "Hide" : "Show" }}
                    </CButton>
                  </td>
                </template>
                <template #details="{ item }">
                  <CCollapse
                    :show="Boolean(item._toggled)"
                    :duration="collapseDuration"
                  >
                    <CCardBody>
                      <p class="text-muted">Name: {{ item.name }}</p>
                      <p class="text-muted">Descirption: {{ item.description }}</p>

                      <CButton
                        size="sm"
                        color="success"
                        class="ml-1"
                        @click="onWorkspace(item)"
                      >
                        Workspace
                      </CButton>
                      <CButton
                        size="sm"
                        color="info"
                        class="ml-1"
                        @click="onEdit(item)"
                      >
                        Edit
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        class="ml-1"
                        @click="showDeleteConfirmation(item)"
                      >
                        Delete
                      </CButton>
                    </CCardBody>
                  </CCollapse>
                </template>
              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              >
            </CCardFooter>
          </CCard>
          <CModal
            title="Confirm Delete"
            color="warning"
            :show.sync="warningModal"
            @update:show="onDeleteConfirmation"
          >
            Are you sure you want to delete this {{ itemToDelete.code }} ?
          </CModal>
        </CCol>
      </CRow>

    </div>
  </div>
</template>

<script>
import FloorPlanApi from "../../lib/floorPlanApi";
// import floorPlanData from "../../data/FloorPlanData";
// import roomData from "../../data/RoomData";

// const items = [];
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

// const roomItems = roomData;
// const roomFields = [
//   { key: "id", _style: "min-width:200px;" },
//   { key: "name", _style: "min-width:200px;" },
//   { key: "coordinate", _style: "min-width:200px;", label: "OLF" },
//   { key: "type", _style: "min-width:200px;", label: "Travel Distance" },
//   {
//     key: "show_details",
//     label: "",
//     _style: "width:1%",
//     sorter: false,
//     filter: false,
//   },
// ];



export default {
  name: "FloorPlanList",
  data() {
    return {
      loading: true,
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      // roomItems: items.map((item, id) => {
      //   return { ...item, id };
      // }),
      // roomFields,
      infoList: [],
      fields,
      details: [],
      collapseDuration: 0,
      api: new FloorPlanApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  mounted() {
    var self = this;
    self.refreshTable();
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
    toggleDetails(item, index) {
      this.$set(this.items[index], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    refreshTable() {
      var self = this;
      self.loading = false;
      // self.items = floorPlanData;
      // self.roomItems= roomData;
      self.api
        .getList()
        .then((response) => {
          self.items = response.result;
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    // onAddLocation(item) {
    //   var self = this;
    //   self.$router.push({
    //     path: `/admin/advertiser/0/area/${item.id}/email/${item.email}`,
    //   });
    // },
    onWorkspace(item){
      var self = this;
      self.$router.push({
        path: `/tenant/WorkSpace/${item.id}`,
      });

    },
    onEdit(item) {
      var self = this;
      self.$router.push({
        path: `/tenant/FloorPlan/${item.id}`,
      });
    },
    onDeleteConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.refreshTable();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
      self.itemToDelete = {};
    },
    showDeleteConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningModal = true;
    },
    addNew() {
      this.$router.push({ path: "/tenant/FloorPlan" });
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
