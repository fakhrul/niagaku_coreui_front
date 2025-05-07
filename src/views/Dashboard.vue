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
                        <CCardBody>
                          <strong>Expenses</strong>

                          <ul>
                            <li>
                              <CLink href="/tenants/otherExpense"
                                >New Expense</CLink
                              >
                            </li>
                            <li>
                              <CLink href="/employee/Receipt"
                                >New Personal Receipt</CLink
                              >
                            </li>
                          </ul>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol sm="6" md="4">
                      <CCard>
                        <CCardBody>
                          <strong>Sales</strong> Rental & Leasing
                          <ul>
                            <li>
                              <CLink href="/tenants/rentalReservation"
                                >Reservation</CLink
                              >
                            </li>
                            <li>
                              <CLink href="/tenants/rentalAvailability"
                                >Availabality</CLink
                              >
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
      <CRow>
        <CCol>
          <transition name="fade">
            <CCard v-if="show" border-color="secondary">
              <CCardHeader>
                Company Info
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
                      <CInput
                        label="Name"
                        v-model="currentBusiness.name"
                        readonly
                      />
                    </CCol>
                    <CCol sm="6" md="4">
                      <CInput
                        label="Registration No"
                        v-model="currentBusiness.regNo"
                        readonly
                    /></CCol>
                    <CCol sm="6" md="4">
                      <CInput
                        label="Tax Number"
                        v-model="currentBusiness.taxIdentificationNumber"
                        readonly
                    /></CCol>
                  </CRow>
                  <CRow>
                    <CCol sm="6" md="4">
                      <CTextarea
                        label="Address"
                        rows="5"
                        v-model="currentBusiness.address"
                        readonly
                      />
                    </CCol>
                    <CCol sm="6" md="4"> </CCol>
                    <CCol sm="6" md="4"> </CCol>
                  </CRow>
                </CCardBody>
              </CCollapse>
            </CCard>
          </transition>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <transition name="fade">
            <CCard v-if="show" border-color="secondary">
              <CCardHeader>
                Certificates
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
                  <CDataTable
                    :items="computedItems"
                    :fields="fields"
                    column-filter
                    items-per-page-select
                    :items-per-page="10"
                    hover
                    sorter
                    pagination
                    :loading="loading"
                  >
                    <template #show_index="{ index }">
                      <td class="py-2">
                        {{ index + 1 }}
                      </td>
                    </template>
                    <template #document_link="{ item }">
                      <td>
                        <CLink target="_blank" :href="item.documentUrl">{{
                          item.documentName
                        }}</CLink>
                      </td>
                    </template>
                  </CDataTable>
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
import ProfileApi from "@/lib/profileApi";
import CertificateApi from "@/lib/certificateApi";
import moment from "moment";

export default {
  name: "Dashboard",
  freeSet,
  components: {},
  data() {
    return {
      loading: true,
      items: [],
      fields: [
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        { key: "name" },
        { key: "documentType" },
        { key: "certificateNumber" },
        
        { key: "issuedDate", label: "Issued" },
        { key: "expiryDate", label: "Expiry" },
        { key: "reminderDate", label: "Reminder" },
        {
          key: "document_link",
          label: "Document",
          sorter: false,
          filter: false,
        },
       
      ],
      certificateApi: new CertificateApi(),
      profileaApi: new ProfileApi(),
      currentProfile: {},
      show: true,
      isCollapsed: true,
      addNewPopup: false,
      uploadedFiles: [],
      infoList: [],

      
      newObj: {
        name: "",
        documentId: null,
      },
    };
  },
  mounted() {
    this.$store.commit("setPageNavItems", []);
    this.fetchCurrentProfile();
    this.fetchCertificateList();
  },
  computed: {
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          issuedDate: this.getDisplayDate(item.issuedDate),
          expiryDate: this.getDisplayDate(item.expiryDate),
          reminderDate: this.getDisplayDate(item.reminderDate),
          documentName: this.getDocumentName(item),
          documentUrl: this.getDocumentUrl(item),
        };
      });
    },
    currentRole() {
      return this.currentProfile.appUser.role;
    },
    currentBusiness() {
      try {
        return this.currentProfile.defaultBusiness;
      } catch (error) {
        return null;
      }
    },
    currentBusinessShortName() {
      try {
        return this.currentProfile.defaultBusiness.shortName;
      } catch (error) {
        return "???";
      }
    },
  },

  methods: {
    getDocumentName(item) {
      console.log("item", item);
      try {
        if (item.certificateDocuments[0].document == null) return "Unknown";
      if (item.certificateDocuments[0].document.fileName == null) return "Unknown";

      return item.certificateDocuments[0].document.fileName;
      } catch (error) {
        return "Unknown";
      }
    },
    getDocumentUrl(item) {
      try {
        return apiUrl + "documents/file/" + item.certificateDocuments[0].documentId;
        
      } catch (error) {
        return "N/A";
      }
    },
    getDisplayDate(dt) {
      return moment(dt).format("DD/MM/YYYY");
    },
    fetchCertificateList() {
      var self = this;
      self.loading = false;
      self.certificateApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.items = response.result;
          console.log(self.items);
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchCurrentProfile() {
      var self = this;
      this.profileaApi
        .getCurrentProfile()
        .then((response) => {
          self.currentProfile = response.result;
          console.log("currentProfile", self.currentProfile);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
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
