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
            <CCardHeader> <strong> Pay Slip </strong> List </CCardHeader>
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
                <template #show_details="{ item, index }">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="showDetails(item, index)"
                    >
                    Details
                    </CButton>

                    
                  </td>
                </template>
              </CDataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import PaySlipApi from "@/lib/paySlipApi";
import moment from "moment";

const items = [];
const fields = [
  {
    key: "show_index",
    label: "#",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
  // { key: "accountNo"},
  { key: "date" },
  { key: "profileName" },
  { key: "paySlipTypeDescription" },
  { key: "businessName" },
  { key: "totalAmount" },
  { key: "statusDescription" },
  { key: "paymentMethodDescription" },
  { key: "remarks" },
  {
    key: "show_details",
    label: "",
    _style: "width:2%",
    sorter: false,
    filter: false,
  },
];



export default {
  name: "PaySlipList",
  data() {
    return {
      loading: true,
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      infoList: [],
      fields,
      details: [],
      collapseDuration: 0,
      api: new PaySlipApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  mounted() {
    this.$store.commit("setPageNavItems", []);
    var self = this;
    self.refreshTable();
  },
  computed: {
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          date: this.getDisplayDateTime(item.date),
          profileName: item.profile.fullName,
          businessName: item.business.name,
        };
      });
    },
   
  },
  methods: {
    getDisplayDateTime(dt) {
      return moment(dt).format("DD/MM/YYYY");
    }, toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    showDetails(item) {
      var self = this;
      self.$router.push({
        path: `/employee/PaySlip/${item.id}`,
      });
    },
    refreshTable() {
      var self = this;
      self.loading = false;
      self.api
        .getListByCurrentProfile()
        .then((response) => {
          self.items = response.result;
          console.log(self.items);
          self.loading = false;
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
