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
    </div>
    <div>
      <CRow>
        <CCol>
          <transition name="fade">
            <CCard v-if="show" border-color="secondary">
              <CCardHeader>
                Quick Actions
                <div class="card-header-actions">
                  <CLink href="#" class="card-header-action btn-setting">
                    <CIcon name="cil-settings" />
                  </CLink>
                  <CLink
                    class="card-header-action btn-minimize"
                    @click="isCollapsed = !isCollapsed"
                  >
                    <CIcon
                      :name="`cil-chevron-${isCollapsed ? 'bottom' : 'top'}`"
                    />
                  </CLink>
                  <CLink
                    href="#"
                    class="card-header-action btn-close"
                    v-on:click="show = false"
                  >
                    <CIcon name="cil-x-circle" />
                  </CLink>
                </div>
              </CCardHeader>
              <CCollapse :show="isCollapsed" :duration="400">
                <CCardBody>
                  <CRow>
                    <CCol sm="6" md="4">
                      <CCard border-color="secondary">
                        <CCardBody>
                          <strong>Incomes</strong>

                          <ul>
                            <li>
                              <CLink href="/tenants/Quotation"
                                >New Quotation</CLink
                              >
                            </li>
                            <li>
                              <CLink href="/tenants/Invoice">New Invoice</CLink>
                            </li>
                          </ul>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol sm="6" md="4">
                      <CCard>
                        <CCardBody> <strong>Expenses</strong>
                        
                          <ul>
                            <li>
                              <CLink href="/tenants/otherExpense"
                                >New Expense</CLink
                              >
                            </li>
                            <li>
                              <CLink href="/employee/Receipt">New Personal Receipt</CLink>
                            </li>
                          </ul>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol sm="6" md="4">
                      <CCard>
                        <CCardBody> <strong>Sales</strong> Rental & Leasing 
                          <ul>
                            <li>
                              <CLink href="/tenants/rentalReservation"
                                >Reservation</CLink
                              >
                            </li>
                            <li>
                              <CLink href="/tenants/rentalAvailability">Availabality</CLink>
                            </li>
                          </ul>
                        
                        
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCollapse>
            </CCard>
          </transition>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import { freeSet } from "@coreui/icons";
import { CCardHeader } from "@coreui/vue-pro";

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
  components: {},
  data() {
    return {
      show: true,
      isCollapsed: true,
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
      console.log("this.uploadedFiles", this.uploadedFiles);
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
