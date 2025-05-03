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
              <strong> Transaction </strong>
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
    <CModal
      title="Search for Matching Details"
      :show.sync="importFromBankStatementPopup"
      size="xl"
    >
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardBody>
              <CDataTable
                :items="computedBankStatementList"
                :fields="bankStatementFieldList"
                column-filter
                sorter
                :loading="loading"
              >
                <template #show_details="{ item }">
                  <td class="py-2">
                    <!-- <div v-if="isExtractBankStatementLoading">
                      <CProgress :value="progressValue" class="mb-4">
                        <CProgressBar :value="progressValue" color="primary">
                          Extracting... {{ progressValue }}%
                        </CProgressBar>
                      </CProgress>
                    </div> -->

                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="onBankStatementSelected(item)"
                    >
                      Import
                    </CButton>
                  </td>
                </template>
              </CDataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CModal>
    <!-- <CModal
      title="Search for Matching Details"
      :show.sync="isExtractBankStatementLoading"
      size="lg"
    >
      
    </CModal> -->

    <CModal
      title="Extracting Bank Statement"
      :show.sync="isExtractBankStatementLoading"
      size="lg"
      :closeOnBackdrop="false"
      :showClose="false"
      centered
    >
      <CProgress :value="progressValue" show-percentage animated> </CProgress>
      <div slot="footer" class="w-100">
        <CButton
          v-if="progressValue >= 100"
          class="ml-1 mr-1 float-right"
          color="primary"
          @click="onCloseExtractingBankStatement()"
        >
          OK
        </CButton>
        <div v-if="progressValue >= 100" class="mt-2 text-center text-success">
          Extract completed successfully!
        </div>
      </div>
    </CModal>

    <CModal
      title="Import Bank Transaction"
      size="lg"
      :show.sync="importBankTransactionPopup"
      :no-close-on-backdrop="true"
    >
      <CForm>
        <CDataTable
          :items="computedBankTransctionItems"
          :fields="bankTransactionFields"
          items-per-page-select
          :items-per-page="itemsPerPage"
          hover
          striped
          small
          bordered
          pagination
          @page-change="onPageChange"
        >
          <template #show_select-header="">
            <CInputCheckbox
              :checked="isBankTransactionAllSelected"
              @change="toggleBankTranasctionSelectAll"
            />
          </template>

          <template #show_select="{ item }">
            <td class="py-2">
              <CInputCheckbox
                :checked="selectedBankTransactions.includes(item.id)"
                @change="toggleSelectionBankTransaction(item.id)"
              />
            </td>
          </template>
        </CDataTable>
      </CForm>

      <!-- Modal Footer -->
      <template #footer>
        <CButton color="secondary" @click="selectAllBankTranasctions">
          Select All
        </CButton>
        <CButton color="secondary" @click="deselectAllBankTranasctions"> Deselect All </CButton>

        <CButton color="secondary" @click="importBankTransactionPopup = false">
          Cancel
        </CButton>
        <CButton color="primary" @click="saveBankTransactions">
          Save Changes
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import TransactionApi from "@/lib/transactionApi";
import BankStatementApi from "../../lib/bankStatementApi";
import ResitAiApi from "@/lib/resitaiApi";

export default {
  name: "TransactionList",
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      selectedBankTransactions: [], // Array to hold selected bank transactions
      bankTransactionItems: [], // Array to hold bank transaction items
      bankTransactionFields: [
        {
          key: "show_select",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        "dateDisplay",
        "description",
        "transactionTypeDescription",
        "amount",
      ], // Array to hold bank transaction fields
      importBankTransactionPopup: false,

      isExtractBankStatementLoading: false,
      progressValue: 0,
      bankStatementApi: new BankStatementApi(),
      importFromBankStatementPopup: false,
      bankStatementItems: [],
      selectedBankStatement: null,
      bankStatementFieldList: [
        { key: "bankName" },
        { key: "dateDisplay" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
      ],

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
        { key: "dateDisplay" },
        { key: "description" },
        { key: "matchName", label: "Name" },
        { key: "transactionTypeDescription" },
        { key: "amount" },
        { key: "categoryDisplay" },
        { key: "transactionMatchDisplay" },
        { key: "remarks" },

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
      api: new TransactionApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  computed: {
    visibleBankTransctionItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.computedBankTransctionItems.slice(
        start,
        start + this.itemsPerPage
      );
    },
    isBankTransactionAllSelected() {
      return (
        this.visibleBankTransctionItems.length > 0 &&
        this.visibleBankTransctionItems.every((item) =>
          this.selectedBankTransactions.includes(item.id)
        )
      );
    },
    computedBankTransctionItems() {
      return this.bankTransactionItems.map((item) => {
        return {
          ...item,
          date: this.getDate(item),
          dateDisplay: this.getDisplayDate(item),
          amount: this.getAmount(item),
          description: item.transaction_description,
          transactionTypeDescription: this.getTransactoinTypeDescription(item),
          transactionType: this.getTransactoinType(item),
          transactionSourceType: 1,
          sourceBankStatementId: this.getSelectedBankStatementId(),
        };
      });
    },

    computedBankStatementList() {
      return this.bankStatementItems.map((item) => {
        return {
          ...item,
          bankName: item.bank ? item.bank.name : "",
          dateDisplay: helper.getDisplayDate(item.date),
        };
      });
    },
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          dateDisplay: helper.getDisplayDate(item.date),
          matchName: this.getMatchName(item),
          categoryDisplay: this.getChartAccountInfo(item),
          transactionMatchDisplay: this.getTransactionMatchDisplay(item),
          remarks: item.remarks ? item.remarks: "",
        };
      });
    },
  },
  mounted() {
    var self = this;
    self.refreshTable();
  },
  methods: {
    getSelectedBankStatementId() {
      if (this.selectedBankStatement) {
        return this.selectedBankStatement.id;
      }
      return null;
    },
    onPageChange(page) {
      this.currentPage = page;
    },

    toggleSelectionBankTransaction(id) {
      const index = this.selectedBankTransactions.indexOf(id);
      if (index === -1) {
        // Add to selection
        this.selectedBankTransactions.push(id);
      } else {
        // Remove from selection
        this.selectedBankTransactions.splice(index, 1);
      }

      console.log(
        "this.selectedBankTransactions",
        this.selectedBankTransactions
      );
    },
    deselectAllBankTranasctions() {
      this.selectedBankTransactions = [];
    },
    selectAllBankTranasctions()
    {
      this.selectedBankTransactions = []; // Reset first to force reactivity
      this.$nextTick(() => {
        this.selectedBankTransactions = this.computedBankTransctionItems.map((item) => item.id);
      });

    },
    toggleBankTranasctionSelectAll() {
      const visibleIds = this.visibleBankTransctionItems.map((i) => i.id);
      if (this.isBankTransactionAllSelected) {
        // deselect them
        this.selectedBankTransactions = this.selectedBankTransactions.filter(
          (id) => !visibleIds.includes(id)
        );
      } else {
        // add any missing IDs
        this.selectedBankTransactions = Array.from(
          new Set([...this.selectedBankTransactions, ...visibleIds])
        );
      }

      // if (this.isBankTransactionAllSelected) {
      //   this.selectedBankTransactions = []; // Deselect all items
      // } else {
      //   this.$nextTick(() => {
      //     this.selectedBankTransactions = this.computedBankTransctionItems.map((item) => item.id);
      //   });
      // }
    },
    getDisplayDate(item) {
      let date = this.getDate(item);
      return helper.getDisplayDate(date);
    },
    getDate(item) {
      if (!item.entry_date) return null;

      const parts = item.entry_date.split("/");

      let day, month, year;

      if (parts.length === 2) {
        // Format: DD/MM — assume current year
        [day, month] = parts;
        year = new Date().getFullYear();
      } else if (parts.length === 3) {
        [day, month, year] = parts;
        year = year.length === 2 ? `20${year}` : year;
      } else {
        return null;
      }

      // Convert to integers and construct Date object
      const dateObj = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );

      return isNaN(dateObj.getTime()) ? null : dateObj;
    },
    getAmount(item) {
      if (!item.transaction_amount) return 0.0;
      return parseFloat(item.transaction_amount);
    },
    getTransactoinTypeDescription(item) {
      let amount = this.getAmount(item);
      if (!amount) return "Unknown";
      return parseFloat(amount) < 0 ? "Debit" : "Credit";
    },
    getTransactoinType(item) {
      let amount = this.getAmount(item);
      if (!amount) return 0;
      return parseFloat(amount) < 0 ? 1 : 0;
    },
    saveBankTransactions() {
      if (this.selectedBankTransactions.length === 0) {
        this.toast(
          "Error",
          "Please select at least one event to save.",
          "danger"
        );
        return;
      }

      const selectedTransactions = this.computedBankTransctionItems.filter(
        (event) => this.selectedBankTransactions.includes(event.id)
      );

      console.log("Batch selectedTransactions:", selectedTransactions);

      this.api
        .addBatch(selectedTransactions)
        .then((response) => {
          this.refreshTable();
          this.infoList.push({
            header: "Success",
            message: "Reservation update",
            color: "success",
          });
          // this.batchEditPopup = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        })
        .finally(() => {
          this.selectedBankTransactions = [];
          this.importBankTransactionPopup = false;
        });
    },
    onCloseExtractingBankStatement() {
      this.isExtractBankStatementLoading = false;
    },
    onBankStatementSelected(item) {
      this.selectedBankStatement = item;
      var documentUrl = apiUrl + "documents/file/" + item.documentId;
      this.isExtractBankStatementLoading = true;

      this.extractImageFromUrl(documentUrl);
      this.importFromBankStatementPopup = false;
    },
    extractImageFromUrl(imageUrl) {
      this.progressValue = 0; // Reset progress
      this.bankTransactionItems = [];

      const interval = setInterval(() => {
        if (this.progressValue < 95) {
          this.progressValue += 5; // Simulate progress
        }
      }, 500);

      // Fetch the image from the URL
      fetch(imageUrl)
        .then((response) => {
          return response.blob();
        })
        .then((imageBlob) => {
          // Create a FormData object to send the image Blob and OCR engine choice
          const formData = new FormData();
          formData.append("file", imageBlob, "image.jpg"); // Append the image as a Blob
          formData.append("document_type", "bank_statement"); // Append the OCR engine
          formData.append("bank_statement_name", "maybank"); // Append the OCR engine

          // Use your custom API wrapper to make the call
          const resitAiApi = new ResitAiApi();
          return resitAiApi.extract(formData); // Return the API call so we can chain the next .then()
        })
        .then((result) => {
          // Handle the result of the extraction
          this.progressValue = 100; // Complete progress
          this.toast("Success", "Extracted info successfully", "success");

          this.bankTransactionItems = result.parsed_data.transactions;
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch or the API call
          console.error("Error extracting data:", error);
          this.toast("Error", "Failed to extract data.", "danger");
        })
        .finally(() => {
          // Optionally, do something after the entire chain is complete, like hiding a loading spinner
          console.log("Extraction process finished.");
          clearInterval(interval);
          this.isExtractBankStatementLoading = false; // Hide the loading modal
          this.importBankTransactionPopup = true; // Show the import bank transaction popup
          this.isLoading = false;
        });
    },

    importFromBankStatement() {
      this.selectedBankStatement = null;
      this.bankStatementItems = [];
      var self = this;
      self.bankStatementApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.bankStatementItems = response.result;
          console.log("bankStatementItems", self.bankStatementItems);
          self.importFromBankStatementPopup = true;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    getTransactionMatchDisplay(item) {
      try {
        if (item.transactionMatchType === 0) {
          return item.invoice.info;
        } else if (item.transactionMatchType === 1) {
          return item.expense.info;
        }
      } catch (error) {
        console.error("Error:", error);
      }
      return "";
    },
    getChartAccountInfo(item) {
      try {
        return `${item.chartAccount.accountNo} - ${
          item.chartAccount.category
        } - ${item.chartAccount.name.trim()}`;
      } catch (error) {
        return "";
      }
    },
    getMatchName(item) {
      try {
        if (item.transactionMatchType === 0) {
          return item.invoice.customer.name;
        } else if (item.transactionMatchType === 1) {
          return item.invoice.vendor.name;
        }
      } catch (error) {
        console.error("Error:", error);
      }
      return "";
    },
    setDefault(item) {},
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
        path: `/tenants/Transaction/${item.id}`,
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
      this.$router.push({ path: "/tenants/Transaction" });
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
