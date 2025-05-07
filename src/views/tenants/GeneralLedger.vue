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
            <CCardHeader>
              <strong> GeneralLedger </strong>
              <div class="card-header-actions">
                <CButton color="light" @click="showFilter = !showFilter">
                  Filter
                </CButton>
                <CDropdown
                  placement="bottom-end"
                  toggler-text="More Action"
                  color="light"
                  class="m-2 d-inline-block tour-cdropdown"
                >
                  <CDropdownItem @click="importFromBankStatement()"
                    >Import from Bank Statement</CDropdownItem
                  >
                </CDropdown>
              </div>
            </CCardHeader>
            <CCardBody>
              <div v-if="showFilter" class="mb-3">
                <CRow>
                  <CCol md="4">
                    <label>Start Date</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="filter.startDate"
                    />
                  </CCol>
                  <CCol md="4">
                    <label>End Date</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="filter.endDate"
                    />
                  </CCol>
                  <CCol md="4">
                    <label>Chart Account</label>
                        <select
                          class="form-control"
                          v-model="filter.chartAccountId"
                        >
                          <option :value="null">-- All Accounts --</option>
                          <option
                            v-for="acc in chartOfAccountItems"
                            :key="acc.id"
                            :value="acc.id"
                          >
                            {{ acc.itemDisplay }}
                          </option>
                        </select>
                  </CCol>
                </CRow>
                <div class="mt-3 text-right">
                  <CButton size="sm" color="primary" @click="applyFilter"
                    >Apply</CButton
                  >
                  <CButton size="sm" color="light" @click="resetFilter"
                    >Reset</CButton
                  >
                </div>
              </div>
              <div>
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
                        <CDataTable
                          :items="item.items"
                          :fields="journalFields"
                          border
                          small
                          hover
                          striped
                          bordered
                        >
                          <template #show_index="{ index }">
                            <td class="py-2">
                              {{ index + 1 }}
                            </td>
                          </template>
                          <template #show_chartaccount="{ item }">
                            <td class="py-2">
                              {{ item.chartAccount.itemDisplay }}
                            </td>
                          </template>
                        </CDataTable>
                      </CCardBody>
                    </CCollapse>
                  </template>
                </CDataTable>
              </div>

              <!-- <CDataTable
                  :items="computedItems"
                  :fields="fields"
                  striped
                  small
                  bordered
                /> -->
              <!-- <div v-for="item in computedItems" :key="item.accountNo">
                <h5 class="mt-4">{{ item.displayName }}</h5>
                <CDataTable
                  :items="item.entries"
                  :fields="ledgerFields"
                  striped
                  small
                  bordered
                />
              </div> -->
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import ReportApi from "@/lib/reportApi";

export default {
  name: "GeneralLedger",
  data() {
    return {
      loading: false,
      chartOfAccountItems: [],
      showFilter: false,
      fields: [
        "accountName",
        {
          key: "totalDebit",
          label: "Total Debit",
          _style: "width:100px",
        },
        {
          key: "totalCredit",
          label: "Total Credit",
          _style: "width:100px",
        },
        {
          key: "show_details",
          label: "",
          _style: "width:2%",
          sorter: false,
          filter: false,
        },
      ],
      journalFields: ["date", "journalNo", "description", "debit", "credit"],

      // ledgerFields: [
      //   { key: "date", label: "Date" },
      //   { key: "description", label: "Description" },
      //   { key: "debit", label: "Debit", _style: "width:100px" },
      //   { key: "credit", label: "Credit", _style: "width:100px" },
      //   { key: "balance", label: "Balance", _style: "width:100px" },
      // ],
      filter: {
        startDate: null,
        endDate: null,
        chartAccountId: null,
      },
      items: [],
      infoList: [],
      api: new ReportApi(),
    };
  },
  computed: {
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
  mounted() {
    this.$store.commit("setPageNavItems", ["Accounting", "General Ledger"]);
    var self = this;
    self.refreshTable();
  },
  methods: {
    resetFilter() {
      this.filter.startDate = null;
      this.filter.endDate = null;
      this.filter.chartAccountId = null;
      // this.showFilter = false;
    },

    applyFilter() {
      // this.showFilter = false;
      this.refreshTable();
    },
    getChartAccountInfo(item) {
      try {
        return item.chartAccount.itemDisplay;
      } catch (error) {
        return "";
      }
    },

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

      const params = {
        startDate: this.filter.startDate,
        endDate: this.filter.endDate,
        chartAccountId: this.filter.chartAccountId,
      };
      console.log("params", params);
      self.api
        .getGeneralLedger(params)
        .then((response) => {
          self.items = response.result;
          console.log("items", self.items);
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onEdit(item) {
      var self = this;
      self.$router.push({
        path: `/tenants/JournalEntry/${item.id}`,
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
      this.$router.push({ path: "/tenants/JournalEntry" });
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
