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
              <strong> JournalEntry </strong>
              <div class="card-header-actions">
                <CDropdown
                  placement="bottom-end"
                  toggler-text="More Action"
                  color="light"
                  class="m-2 d-inline-block tour-cdropdown"
                  size="sm"
                >
                  <CDropdownItem @click="importFromBankStatement()"
                    >Import from Bank Statement</CDropdownItem
                  >
                </CDropdown>
              </div>
            </CCardHeader>
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

                        <!-- <template #footer>
                      <tr>
                        <td colspan="2">
                          <CButton color="light" @click="addNewItem()"
                            >Add Item</CButton
                          >
                        </td>
                        <td>Total</td>
                        <td>
                          {{ formatCurrency(totalDebit) }}
                        </td>
                        <td>
                          {{ formatCurrency(totalCredit) }}
                        </td>
                      </tr>
                    </template> -->
                      </CDataTable>

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
import JournalEntryApi from "@/lib/journalEntryApi";

export default {
  name: "JournalEntryList",
  data() {
    return {
      journalFields: [
        // {key: "id"},
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        {
          key: "description",
          label: "Description",
        },
        {
          key: "show_chartaccount",
          label: "Account",
        },

        {
          key: "debit",
          label: "Debit",
          _style: "width:100px",
        },
        {
          key: "credit",
          label: "Credit",
          _style: "width:100px",
        },
      ],

      currentPage: 1,
      itemsPerPage: 10,
      loading: true,
      items: [],
      infoList: [],
      fields: [
        // { key: "accountNo"},
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        { 
          key: "journalNo",
          label: "Journal No",
        },

        { key: "dateDisplay", label: "Date" },
        { key: "description" },
        // { key: "accountDisplay", label: "Account" },
        { key: "totalDebit" },
        { key: "totalCredit" },
        // { key: "remarks" },
        {
          key: "show_details",
          label: "",
          _style: "width:2%",
          sorter: false,
          filter: false,
        },
      ],
      details: [],
      collapseDuration: 0,
      api: new JournalEntryApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  computed: {
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          dateDisplay: helper.getDisplayDate(item.date),
          // accountDisplay: this.getChartAccountInfo(item),
        };
      });
    },
  },
  mounted() {
    this.$store.commit("setPageNavItems", ["Accounting", "Journal Entries"]);
    var self = this;
    self.refreshTable();
  },
  methods: {
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
      self.api
        .getListByCurrentBusiness()
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
