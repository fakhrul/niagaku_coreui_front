<template>
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
            <strong> JournalEntry </strong> Information
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                type="date"
                :value="computeTransactionDate"
                @change="setTransactionDate"
                label="Date"
                horizontal
              />
              <!-- <CInput label="Reference" v-model="obj.reference" horizontal /> -->
              <CInput
                label="Description"
                v-model="obj.description"
                horizontal
              />
              <CRow>
                <CCol>
                  <CDataTable :items="obj.items" :fields="journalFields">
                    <template #show_index="{ index }">
                      <td class="py-2">
                        {{ index + 1 }}
                      </td>
                    </template>
                    <template #show_account="{ item }">
                      <td>
                        <CFormGroup>
                          <template #input>
                            <v-select
                              style="width: 100%"
                              v-model="item.chartAccount"
                              :label="`itemDisplay`"
                              :options="computedChartAccountItems"
                              placeholder="Select COA"
                            />
                          </template>
                        </CFormGroup>
                      </td>
                    </template>
                    <template #show_description="{ item }">
                      <td>
                        <CInput
                          v-model="item.description"
                          horizontal
                        />
                      </td>
                    </template>
                    <template #show_debit="{ item }">
                      <td>
                        <CInput
                          v-model="item.debit"
                          min="0"
                          step="0.01"
                        ></CInput>
                      </td>
                    </template>
                    <template #show_credit="{ item }">
                      <td>
                        <CInput
                          v-model="item.credit"
                          min="0"
                          step="0.01"
                        ></CInput>
                      </td>
                    </template>
                    <template #show_move="{ item, index }">
                      <td class="py-2">
                        <CButton
                          color="primary"
                          size="sm"
                          @click="moveItem(index, 'up')"
                          :disabled="index === 0"
                        >
                          ↑
                        </CButton>
                        <CButton
                          color="primary"
                          size="sm"
                          @click="moveItem(index, 'down')"
                          :disabled="index === obj.items.length - 1"
                        >
                          ↓
                        </CButton>
                      </td>
                    </template>
                    <template #show_remove="{ item }">
                      <td class="py-2">
                        <CDropdown
                          color="secondary"
                          split
                          toggler-text="Remove"
                          class="m-2"
                          @click="onRemoveItem(item)"
                        >
                          <!-- <CDropdownItem @click="createInvoiceByItem(item)"
                            >Create Invoice</CDropdownItem
                          > -->
                        </CDropdown>
                      </td>
                    </template>

                    <template #footer>
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
                    </template>
                  </CDataTable>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" @click="submit"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            >
            <CButton class="ml-1" color="secondary" @click="cancel">
              Cancel
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    
  </div>
</template>

<script>
import JournalEntryApi from "@/lib/journalEntryApi";
import moment from "moment";
import ChartOfAccountApi from "../../lib/chartOfAccountApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "JournalEntry",
  components: {
    vSelect,
  },
  data: () => {
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
          key: "show_description",
          label: "Description",
        },
        {
          key: "show_account",
          label: "Account",
        },

        {
          key: "show_debit",
          label: "Debit",
          _style: "width:100px",
        },
        {
          key: "show_credit",
          label: "Credit",
          _style: "width:100px",
        },

        {
          key: "show_move",
          label: "",
          _style: "width:1%",
        },
        {
          key: "show_remove",
          label: "Action",
          _style: "width:1%",
        },
      ],

      loading: false,
      // selectedChartOfAccount: null,
      chartOfAccountItems: [],
      chartOfAccountApi: new ChartOfAccountApi(),
      infoList: [],
      obj: {
        date: new Date(),
      },
      submitted: false,
      api: new JournalEntryApi(),
    };
  },
  mounted() {
    var self = this;
    this.fetchChartOfAccount();
  },
  computed: {
    totalDebit() {
      let total = 0;
      for (const item of this.obj.items || []) {
        const debit = parseFloat(item.debit);
        if (!isNaN(debit)) {
          total += debit;
        }
      }
      return total;
    },
    totalCredit() {
      let total = 0;
      for (const item of this.obj.items || []) {
        const credit = parseFloat(item.credit);
        if (!isNaN(credit)) {
          total += credit;
        }
      }
      return total;
    },

    selectedBankStatementInfo() {
      if (this.obj.bankStatement != null) return this.obj.bankStatement.info;
      else return "";
    },
    selectedMatchInfo() {
      if (this.selectedMatch != null) return this.selectedMatch.info;
      else return "";
    },
    computedMatchList() {
      return this.matchList.map((item) => {
        return {
          ...item,
        };
      });
    },

    computedChartAccountItems() {
      return this.chartOfAccountItems.map((item) => {
        return {
          ...item,
          itemDisplay: `${item.accountNo} - ${
            item.category
          } - ${item.name.trim()}`,
        };
      });
    },

    computeTransactionDate() {
      return moment(this.obj.date).format("YYYY-MM-DD");
    },
  },
  watch: {
   
  },
  methods: {
    formatCurrency(amount) {
      try {
        return amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } catch {
        return amount;
      }
    },

    generateGUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    addNewItem() {
      console.log("addNewItem", this.obj);
      if (this.obj.items.length == 0) {
        this.obj.items.push({
          id: this.generateGUID(),
          chartAccount: null,
          debit: 0,
          credit: 0,
          description: "New Journal",
          position: 1,
        });
      } else {
        const newPosition = this.obj.items.length + 1;
        this.obj.items.push({
          id: this.generateGUID(),
          chartAccount: null,

          debit: 0,
          credit: 0,
          description: "New Journal",
          position: newPosition,
        });
      }
    },

    moveItem(index, direction) {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < this.obj.items.length) {
        const temp = this.obj.items[index];
        this.$set(this.obj.items, index, this.obj.items[newIndex]);
        this.$set(this.obj.items, newIndex, temp);

        // Update positions after swapping
        this.obj.items[index].position = index + 1;
        this.obj.items[newIndex].position = newIndex + 1;
      }
    },
    onRemoveItem(item) {
      var self = this;
      if (self.obj.items != null) {
        for (var i = 0; i < self.obj.items.length; i++) {
          if (self.obj.items[i].id === item.id) {
            self.obj.items.splice(i, 1);
          }
        }
      }

      this.updatePositions(); // Update positions after removal
    },
   
    findChartAccount(id) {
      return (
        this.computedChartAccountItems.find((item) => item.id === id) || null
      );
    },
    fetchChartOfAccount() {
      var self = this;
      self.chartOfAccountApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.chartOfAccountItems = response.result;
          self.resetObj();

          // self.chartAccountItemsLoaded = true;
        })
        .catch(({ data }) => {});
    },
    setTransactionDate(e) {
      this.obj.date = new Date(e + "T00:00:00"); // ISO format assumes local time
    },

    cancel() {
      this.$router.push({ path: "/tenants/JournalEntryList" });
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log("self.obj", self.obj);
          })
          .catch(({ data }) => {
            console.log("error", data);
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
    onSubmit() {
      var self = this;
      let haveError = false;
      self.obj.items.forEach(journalitem => {
        if(journalitem.chartAccount == null) {
          haveError = true;
          return;
        }
        else {
          journalitem.chartAccountId = journalitem.chartAccount.id;
        }
      });

      if (haveError) {
        self.toast("Error", "Please select chart of account for all items", "danger");
        return;
      }
     
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.toast("Success", "Updated", "success");

            // self.$router.push({ path: "/tenants/journalEntryList" });
            self.$router.push({
              path: `/tenants/journalEntry/${newObj.id}`,
            });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Success", "Updated", "success");

            self.resetObj();

            // self.$router.push({ path: "/tenants/journalEntryList" });
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
      this.resetObj();
      this.submitted = false;
      this.$v.$reset();
    },
    getEmptyObj() {
      let currentDate = new Date();
      let transactiondate = new Date(
        currentDate.toISOString().split("T")[0] + "T00:00:00"
      );
      return {
        date: transactiondate,
        items: [],
        // code: "",
        // name: "",
        // decsription: "",
      };
    },
    submit() {
      this.onSubmit();
      this.submitted = true;
    },
  },
};
</script>
