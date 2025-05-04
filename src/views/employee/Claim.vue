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
            <strong> Claim </strong>
            <small>{{ obj.claimNo }}</small>
            <a
              href=""
              target="_blank"
              :class="helper.getBadgeClass(obj.claimStateDescription)"
            >
              {{ obj.claimStateDescription }}
            </a>
            <div class="card-header-actions">
              <CDropdown
                placement="bottom-end"
                toggler-text="Action"
                color="light"
                class="m-2 d-inline-block tour-cdropdown"
                size="sm"
              >
                <CDropdownItem @click="addNew()">Add New</CDropdownItem>
                <!-- <CDropdownItem @click="onConvertToReceipt(obj)"
                  >Convert To Receipt</CDropdownItem
                > -->
                <CDropdownDivider />
                <CDropdownHeader>Change Status To:</CDropdownHeader>
                <template v-for="status in computedClaimStates">
                  <CDropdownItem @click="changeState(status)">{{
                    status.name
                  }}</CDropdownItem>
                </template>
                <CDropdownDivider />
              </CDropdown>
              <!-- <CDropdown
                size="sm"
                toggler-text="Help"
                color="link"
                class="m-0 d-inline-block"
              >
                <CDropdownItem @click="startTour"
                  >Onboarding Tour</CDropdownItem
                >
                <CDropdownItem disabled>Quick Info</CDropdownItem>
                <CDropdownItem disabled>Help Center & FAQ</CDropdownItem>
                <CDropdownItem disabled>Video Tutorial</CDropdownItem>
                <CDropdownItem disabled>Live Chat</CDropdownItem>
                <CDropdownItem disabled>Send Feedback</CDropdownItem>
              </CDropdown> -->
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol>
                <CInput
                  horizontal
                  label="Date"
                  type="date"
                  :value="computeDate"
                  @change="setDate"
                />
                <!-- <CInput label="Claim No" horizontal v-model="obj.claimNo" /> -->
              </CCol>
              <CCol>
                <!-- <CInput
                  horizontal
                  label="Date"
                  type="date"
                  :value="computeDate"
                  @change="setDate"
                /> -->
              </CCol>
              <CCol>
                <!-- <CSelect
                  horizontal
                  :value.sync="selectedClaimState"
                  :options="claimStates"
                  label="Claim State"
                /> -->
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CDataTable :items="computedClaimItems" :fields="claimFields">
                  <template #show_index="{ index }">
                    <td class="py-2">
                      {{ index + 1 }}
                    </td>
                  </template>
                  <template #show_date="{ item }">
                    <td>
                      <CInput type="date" v-model="item.date" />
                    </td>
                  </template>

                  <template #show_item="{ item }">
                    <td>
                      <CInput v-model="item.name" min="1"></CInput>
                    </td>
                  </template>
                  <template #show_description="{ item }">
                    <td>
                      <CTextarea
                        placeholder=""
                        v-model="item.description"
                        rows="1"
                      />
                    </td>
                  </template>
                  <template #show_quantity="{ item }">
                    <td>
                      <CInput v-model="item.quantity" min="1"></CInput>
                    </td>
                  </template>
                  <template #show_unit="{ item }">
                    <td>
                      <CInput v-model="item.unit" min="1"></CInput>
                    </td>
                  </template>
                  <template #show_receipt="{ item }">
                    <td class="py-2">
                      <div v-if="item.receipt && item.receipt.documentId">
                        <div v-if="item.receipt.document">
                          <div v-if="helper.isPdf(item.receipt.document)">
                            <iframe
                              :src="helper.getDocumentUrl(item.receipt.document)"
                              style="
                                width: 100%;
                                height: 150px;
                                border: 1px solid #ccc;
                              "
                            ></iframe>
                          </div>
                          <div v-else>
                            <CImg
                              :src="helper.getDocumentUrl(item.receipt.document)"
                              style="
                                max-width: 100%;
                                max-height: 150px;
                                object-fit: contain;
                              "
                              class="border rounded"
                            />
                          </div>
                        </div>
                        <a
                          :href="helper.getDocumentUrl(item.receipt.document)"
                          target="_blank"
                          >View Receipt</a
                        >
                        <CButton
                          size="sm"
                          color="info"
                          @click="openReceiptPicker(item)"
                          >Change</CButton
                        >
                        <CButton
                          size="sm"
                          color="info"
                          @click="removeReceipt(item)"
                          >Remove</CButton
                        >

                      </div>
                      <div v-else>
                        <CButton
                          size="sm"
                          color="info"
                          @click="openReceiptPicker(item)"
                          >Add Receipt</CButton
                        >
                      </div>
                    </td>
                  </template>
                  <template #show_price="{ item }">
                    <td>
                      <CInput
                        v-model="item.amount"
                        min="0"
                        step="0.01"
                      ></CInput>
                    </td>
                  </template>
                  <template #show_total="{ item }">
                    <td>
                      {{ helper.formatCurrency(getTotalItemPrice(item)) }}
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
                        :disabled="index === computedClaimItems.length - 1"
                      >
                        ↓
                      </CButton>
                    </td>
                  </template>
                  <template #show_remove="{ item }">
                    <td class="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        square
                        size="sm"
                        @click="onRemoveClaimItem(item)"
                      >
                        Remove
                      </CButton>
                    </td>
                  </template>

                  <template #footer>
                    <td colspan="2">
                      <CButton @click="addNewItem()" color="primary"
                        >Add Item</CButton
                      >
                    </td>
                    <td colspan="5" class="text-right">
                      <strong>Total:</strong>
                    </td>
                    <td>{{ helper.formatCurrency(grandTotal) }}</td>
                  </template>
                </CDataTable>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" @click="submit"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            >
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <CModal :show.sync="showReceiptModal" title="Select Receipt" size="xl">
      <div>
        <CButton color="primary" size="sm" @click="createNewReceipt"
          >Add New Receipt</CButton
        >
        <CRow class="mb-3">
          <CCol md="4">
            <CInput
              label="Search Company"
              placeholder="e.g. Tesco"
              v-model="filterCompany"
            />
          </CCol>
          <CCol md="4">
            <CInput
              label="Min Amount"
              placeholder="e.g. 100"
              v-model.number="filterAmount"
              type="number"
            />
          </CCol>
          <CCol md="4">
            <CInput label="Date" type="date" v-model="filterDate" />
          </CCol>
        </CRow>
        <!-- <CRow>
          <CCol>
            <CSelect
  label="Sort By"
  :options="['Date Desc', 'Date Asc', 'Amount High', 'Amount Low']"
  v-model="sortOption"
/>
          </CCol>
        </CRow> -->

        <CRow class="mt-3">
          <CCol
            v-for="receipt in filteredReceipts"
            :key="receipt.id"
            sm="6"
            md="4"
            lg="3"
            class="mb-4"
          >
            <CCard
              @click="selectReceipt(receipt)"
              class="cursor-pointer h-100 shadow-sm"
            >
              <CCardBody>
                <div class="mb-2">
                  <strong>{{ helper.getDisplayDate(receipt.date) }}</strong
                  ><br />
                  <strong>{{ receipt.companyName }}</strong
                  ><br />
                  Amount: {{ helper.formatCurrency(receipt.totalAmount) }}
                </div>

                <div v-if="receipt.document">
                  <div v-if="helper.isPdf(receipt.document)">
                    <iframe
                      :src="helper.getDocumentUrl(receipt.document)"
                      style="width: 100%; height: 150px; border: 1px solid #ccc"
                    ></iframe>
                  </div>
                  <div v-else>
                    <CImg
                      :src="helper.getDocumentUrl(receipt.document)"
                      style="
                        max-width: 100%;
                        max-height: 150px;
                        object-fit: contain;
                      "
                      class="border rounded"
                    />
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </CModal>
  </div>
</template>

<script>
import ClaimApi from "@/lib/claimApi";
import ReceiptApi from "@/lib/receiptApi";
import moment from "moment";

export default {
  name: "Claim",
  data: () => {
    return {
      filterCompany: "",
      filterAmount: null,
      filterDate: "",
      receiptApi: new ReceiptApi(),
      showReceiptModal: false,
      availableReceipts: [],
      currentItemForReceipt: null,
      claimItems: [],
      claimFields: [
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        // { key: "position", label: "Position" },
        // { key: "date", label: "date" },
        {
          key: "show_date",
          label: "Date",
        },
        {
          key: "show_item",
          label: "Item",
        },
        {
          key: "show_description",
          label: "Description",
        },
        {
          key: "show_quantity",
          label: "Quantity",
          _style: "width:100px",
        },
        {
          key: "show_unit",
          label: "Unit",
          _style: "width:100px",
        },

        {
          key: "show_price",
          label: "Price",
          _style: "width:100px",
        },
        {
          key: "show_total",
          label: "Total",
        },
        {
          key: "show_receipt",
          label: "Receipt",
          _style: "width:160px",
        },
        {
          key: "show_move",
          _style: "width:1%",
        },
        {
          key: "show_remove",
          _style: "width:1%",
        },
      ],
      helper,
      date: Date(),

      // Quotation Itm
      // claimItems: claimItems.map((item, id) => {
      //   return { ...item, id };
      // }),

      // claimFields,

      claimStates: [],
      selectedClaimState: null,
      organizationTypeList: [],
      infoList: [],
      obj: {
        profile: {
          fullName: "",
        },
        business: {
          name: "",
        },
      },
      submitted: false,
      api: new ClaimApi(),
    };
  },
  mounted() {
    var self = this;
    this.fetchClaimStates();
    this.initializeDefaultDate();
    self.resetObj();
  },
  computed: {
    filteredReceipts() {
      return this.availableReceipts
        .filter((r) => {
          const matchesCompany =
            this.filterCompany === "" ||
            r.companyName
              ?.toLowerCase()
              .includes(this.filterCompany.toLowerCase());
          const matchesAmount =
            !this.filterAmount || r.totalAmount >= this.filterAmount;
          const matchesDate =
            !this.filterDate ||
            helper.getDisplayDate(r.date) === this.filterDate;
          return matchesCompany && matchesAmount && matchesDate;
        })
        .sort((a, b) => {
          return new Date(b.date) - new Date(a.date); // Sort by newest
        });
    },
    computedClaimStates() {
      let statuses = this.claimStates.filter(
        (status) => status.name != this.obj.claimStateDescription
      );

      if (this.obj.id == null) return [];

      if (this.obj.claimStateDescription === "Draft")
        return statuses.filter((status) => status.name == "Submit");
      if (this.obj.claimStateDescription === "Approve")
        return statuses.filter(
          (status) => status.name == "Paid" || status.name == "Cancelled"
        );
      else return [];
    },

    computeDate() {
      return moment(this.date).format("YYYY-MM-DD");
    },
    computedClaimItems() {
      return this.claimItems.map((item) => {
        return {
          ...item,
          date: moment(item.date).format("YYYY-MM-DD"),
          // productName: item.product.name,
          // totalAmountPerItem: this.getTotalItemPrice(item),
        };
      });
    },
    grandTotal() {
      var total = 0;
      for (var i = 0; i < this.computedClaimItems.length; i++) {
        var item = this.computedClaimItems[i];
        total += item.amount * item.quantity;
      }
      return total;
    },
  },
  methods: {
    removeReceipt(item) {
      item.receipt = null;
      item.receiptId = null;
    },
    openReceiptPicker(item) {
      this.currentItemForReceipt = item;
      this.filterCompany = "";
      this.filterAmount = null;
      this.filterDate = "";

      this.fetchAvailableReceipts();
      this.showReceiptModal = true;
    },
    fetchAvailableReceipts() {
      this.receiptApi.getListByCurrentUser().then((response) => {
        this.availableReceipts = response.result || [];
        console.log("availabelReceipts", response.result);
      });
    },
    selectReceipt(receipt) {
      this.currentItemForReceipt.receipt = receipt;
      this.currentItemForReceipt.receiptId = receipt.id;
      this.showReceiptModal = false;
    },
    createNewReceipt() {
      this.$router.push("/receipt/new"); // or open a modal form
    },
    changeState(item) {
      this.obj.claimState = item.id;
      if (this.obj.id) {
        this.api
          .updateState(this.obj, null)
          .then((response) => {
            this.resetObj();
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          })
          .finally(() => {});
      }
    },
    moveItem(index, direction) {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < this.computedClaimItems.length) {
        const temp = this.computedClaimItems[index];
        this.$set(
          this.computedClaimItems,
          index,
          this.computedClaimItems[newIndex]
        );
        this.$set(this.computedClaimItems, newIndex, temp);

        // Update positions after swapping
        this.computedClaimItems[index].position = index + 1;
        this.computedClaimItems[newIndex].position = newIndex + 1;
      }
    },

    onRemoveClaimItem(item) {
      var self = this;
      if (self.computedClaimItems != null) {
        for (var i = 0; i < self.computedClaimItems.length; i++) {
          if (self.computedClaimItems[i].id === item.id) {
            self.computedClaimItems.splice(i, 1);
          }
        }
      }

      this.updatePositions(); // Update positions after removal
    },

    updatePositions() {
      this.computedClaimItems.forEach((item, index) => {
        item.position = index + 1;
      });
    },

    setItemDate(e) {
      console.log(e);
    },
    initializeDefaultDate() {
      const today = new Date();
      this.date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
    },

    setDate(e) {
      this.date = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    // onRemoveClaimItem(item) {
    //   var self = this;
    //   if (self.computedClaimItems != null) {
    //     for (var i = 0; i < self.computedClaimItems.length; i++) {
    //       if (self.computedClaimItems[i].id === item.id) {
    //         self.computedClaimItems.splice(i, 1);
    //       }
    //     }
    //   }
    // },
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
      const today = new Date();
      const newPosition = this.claimItems.length + 1;
      this.claimItems.push({
        id: this.generateGUID(),
        date: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        ),
        name: "",
        amount: 0,
        unit: "L.S.",
        quantity: 1,
        description: "",
        position: newPosition,
      });
    },
    getTotalItemPrice(item) {
      try {
        return item.quantity * item.amount;
      } catch (error) {
        return 0;
      }
    },

    fetchClaimStates() {
      var self = this;
      self.api
        .getClaimState()
        .then((response) => {
          // var obj = response.result;
          this.claimStates = response.result;
          // this.claimStates = obj.map((state) => ({
          //   value: state.id,
          //   label: state.name,
          // }));
          // console.log("this.claimStates",this.claimStates);
          self.selectedClaimState = 0;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
            // self.claimItems = self.obj.items;

            // Set selectedClaimState to match the current state of the claim
            self.selectedClaimState = self.obj.claimState;

            if (self.obj.items.length > 0) {
              if (self.obj.items[0].position == 0) {
                for (var i = 0; i < self.obj.items.length; i++) {
                  self.obj.items[i].position = i + 1;
                }
              }
            }
            self.claimItems = self.obj.items;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        self.obj = self.getEmptyObj();
        this.api
          .getNextReferenceNumber()
          .then((response) => {
            self.obj.claimNo = response.result;
            console.log(response.result);
          })
          .catch(({ data }) => {});
      }
    },
    onSubmit() {
      var self = this;
      self.obj.date = self.date;
      self.obj.claimState = self.selectedClaimState;
      for (let i = 0; i < self.computedClaimItems.length; i++)
        self.computedClaimItems[i].date = new Date(
          self.computedClaimItems[i].date + "T00:00:00"
        );
      self.obj.items = self.computedClaimItems;

      console.log(self.obj.items);
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.toast("Success", "Update Success", "success");
            var newObj = response.result;
            self.$router.push({
              path: `/employee/Claim/${newObj.id}`,
            });

            this.resetObj();
            // self.$router.push({ path: "/employee/claimList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            // self.$router.push({ path: "/employee/claimList" });
            self.toast("Success", "Update Success", "success");
            this.resetObj();
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
      return {
        claimNo: "",
        claimState: 0,
        claimStateDescription: "Draft",
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
