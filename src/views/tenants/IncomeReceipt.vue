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
    <div>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              <strong>Receipt</strong>
              <small>{{ obj.incomeReceiptNumber }}</small>
              <a href="" target="_blank" :class="getBadgeClass()">
                {{ obj.statusDescription }}
              </a>
              <div class="card-header-actions">
                <!-- <CButton size="sm" color="primary" @click="preview">
                  Preview</CButton
                > -->
                <CDropdown
                  placement="bottom-end"
                  toggler-text="Change Status"
                  color="primary"
                  class="m-2 d-inline-block tour-cdropdown"
                  size="sm"
                >
                  <!-- <template v-for="status in quotationStatuses">
                    <CDropdownItem @click="changeState(status)">{{
                      status.name
                    }}</CDropdownItem>
                  </template> -->
                </CDropdown>
                <!-- Start Tour Button -->
                <!-- <CButton size="sm" color="info" @click="startTour">
                  Guide
                </CButton> -->

                <CDropdown
                  size="sm"
                  toggler-text="Help"
                  color="link"
                  class="m-0 d-inline-block"
                >
                  <!-- <CIcon name="cil-x-circle"/> -->
                  <CDropdownItem @click="startTour"
                    >Onboarding Tour</CDropdownItem
                  >
                  <CDropdownItem disabled>Quick Info</CDropdownItem>
                  <CDropdownItem disabled>Help Center & FAQ</CDropdownItem>
                  <CDropdownItem disabled>Video Tutorial</CDropdownItem>
                  <CDropdownItem disabled>Live Chat</CDropdownItem>
                  <CDropdownItem disabled>Send Feedback</CDropdownItem>
                </CDropdown>
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm="12" md="12" lg="4">
                  <v-select
                    class="form-control-lg"
                    style="width: 100%; padding: 0"
                    v-model="selectedCustomer"
                    :label="'name'"
                    :options="customerItemsWithAddNew"
                    placeholder="Select customer"
                    @input="handleCustomerSelect"
                  />
                  <div class="text-muted small mt-1">Custoner</div>
                </CCol>
                <CCol sm="12" md="12" lg="4">
                  <CInput
                    size="lg"
                    description="Receipt No"
                    placeholder=""
                    v-model="obj.incomeReceiptNumber"
                /></CCol>
                <CCol sm="12" lg="4">
                  <CInput
                    size="lg"
                    description="Date"
                    type="date"
                    :value="computeIssuedDate"
                    @change="setIssuedDate"
                  />

                  <!-- <input
                  type="date"
                  :value="computeIssuedDate"
                  @change="setIssuedDate"
                  class="mr-2"
                /> -->
                </CCol>
                <!-- <CCol sm="12" lg="2">
                  <CInput
                    label="Expiry"
                    type="date"
                    :value="computeExpiryDate"
                    @change="setExpiryDate"
                /></CCol> -->
                <!-- <CCol sm="12" lg="2">
                  <CInput label="Reference" v-model="obj.reference"
                /></CCol> -->
              </CRow>

              <CRow>
                <CCol>
                  <CTextarea
                    label="Receipt Title"
                    v-model="obj.title"
                    placeholder=""
                    rows="2"
                    @keydown="handleKeyDown($event, item)"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <!-- Wrap CDataTable with draggable -->

                  <CDataTable
                    :items="computedincomeReceiptItems"
                    :fields="incomeReceiptFields"
                  >
                    <!-- <template #show_drag="{ item, index }">
                      <td>
                        <i class="cil-cursor-move">Move</i>
                      </td>
                    </template> -->

                    <template #show_index="{ index }">
                      <td class="py-2">
                        {{ index + 1 }}
                      </td>
                    </template>
                    <template #show_item="{ item }">
                      <td>
                        <CFormGroup>
                          <template #input>
                            <v-select
                              style="width: 100%"
                              v-model="item.product"
                              :label="'name'"
                              :options="productItems"
                              placeholder="Select product"
                            />
                          </template>
                        </CFormGroup>
                      </td>
                    </template>
                    <template #show_description="{ item }">
                      <td>
                        <CTextarea
                          placeholder=""
                          v-model="item.description"
                          rows="3"
                          @keydown="handleKeyDown($event, item)"
                        />
                      </td>
                    </template>
                    <template #show_quantity="{ item }">
                      <td>
                        <CInput v-model="item.quantity" min="1"></CInput>
                      </td>
                    </template>
                    <template #show_price="{ item }">
                      <td>
                        <CInput
                          v-model="item.price"
                          min="0"
                          step="0.01"
                        ></CInput>
                      </td>
                    </template>
                    <template #show_total="{ item }">
                      <td>
                        {{ getTotalItemPrice(item) }}
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
                          :disabled="index === incomeReceiptItems.length - 1"
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
                      <td>
                        <CButton @click="addNewItem()" color="primary"
                          >Add</CButton
                        >
                      </td>
                      <td colspan="5" class="text-right">
                        <strong>Grand Total:</strong>
                      </td>
                      <td>{{ grandTotal.toFixed(2) }}</td>
                    </template>
                  </CDataTable>
                </CCol>
              </CRow>
              <CRow>
                <CCol> </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CTextarea
                    label="Term & Conditions"
                    v-model="obj.note"
                    placeholder=""
                    rows="2"
                  />
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="submit"
                class="tour-submit-button"
                ><CIcon name="cil-check-circle" /> Submit</CButton
              >
              <CButton class="ml-1" color="secondary" @click="cancel">
                Cancel
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Preview</CCardHeader>
            <CCardBody>
              <WidgetsReportIncomeReceipt
                :receipt="computedPreviewItem"
              ></WidgetsReportIncomeReceipt>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <!-- <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Preview</CCardHeader>
            <CCardBody>
              <WidgetsReportIncomeReceipt
              :receipt="previewObj"
            ></WidgetsReportIncomeReceipt>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> -->


      <!-- <CRow>
        <CCol>
          <WidgetsReportQuotation :quotation="obj"></WidgetsReportQuotation>
        </CCol>
      </CRow> -->
    </div>
    <div>
      <CModal
        title="Receipt Preview"
        :show.sync="receiptPreviewPopup"
        size="xl"
      >
        <CRow>
          <CCol>
            <WidgetsReportIncomeReceipt
              :receipt="previewObj"
            ></WidgetsReportIncomeReceipt>
          </CCol>
        </CRow>
      </CModal>
    </div>
    <div>
      <CModal
        title="Add New Customer"
        size="xl"
        :show.sync="addCustomerFormPopup"
        @update:show="onCustomerPopupConfirmation"
      >
        <CRow form>
          <CCol md="6">
            <CInput
              label="Name"
              v-model="itemAddNewCustomer.name"
              placeholder="Customer Sdn Bhd"
              required
              was-validated
            />
            <CInput
              label="Contact Name"
              v-model="itemAddNewCustomer.contactName"
            />
            <CInput
              label="Contact Email"
              v-model="itemAddNewCustomer.contactEmail"
            />
            <CInput
              label="Contact Phone"
              v-model="itemAddNewCustomer.contactPhone"
            />
          </CCol>
          <CCol md="6">
            <CTextarea
              label="Address"
              placeholder="No. 123, Jalan Example
Taman Example, 
12345 Kuala Lumpur,
Malaysia"
              rows="5"
              v-model="itemAddNewCustomer.address"

            />

            <CInput label="Phone" v-model="itemAddNewCustomer.phone" />
            <CInput label="Website" v-model="itemAddNewCustomer.website" />
          </CCol>
        </CRow>
      </CModal>
    </div>
  </div>
</template>

<script>
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css"; // Import Shepherd.js default style

import IncomeReceiptApi from "@/lib/incomeReceiptApi";
import CustomerApi from "@/lib/customerApi";
import ProductApi from "@/lib/productApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import moment from "moment";
import WidgetsReportIncomeReceipt from "../widgets/WidgetsReportIncomeReceipt";

// const incomeReceiptItems = [];
// const incomeReceiptFields = [
//   {
//     key: "show_index",
//     label: "#",
//     _style: "width:1%",
//     sorter: false,
//     filter: false,
//   },
//   // { key: "position", label: "Position" },
//   // { key: "productName", label: "Item" },
//   {
//     key: "show_item",
//     label: "Item",
//   },
//   {
//     key: "show_description",
//     label: "Description",
//   },
//   {
//     key: "show_quantity",
//     label: "Quantity",
//     _style: "width:100px",
//   },
//   {
//     key: "show_price",
//     label: "Price",
//     _style: "width:100px",
//   },
//   {
//     key: "show_total",
//     label: "Total",
//   },
//   {
//     key: "show_move",
//     _style: "width:1%",
//   },
//   {
//     key: "show_remove",
//     _style: "width:1%",
//   },
// ];

export default {
  name: "IncomeReceipt",
  components: {
    vSelect,
    WidgetsReportIncomeReceipt,
  },
  data: () => {
    return {
      itemAddNewCustomer: {},
      addCustomerFormPopup: false,


      incomeReceiptFields: [
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        // { key: "position", label: "Position" },
        // { key: "productName", label: "Item" },
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
          key: "show_price",
          label: "Price",
          _style: "width:100px",
        },
        {
          key: "show_total",
          label: "Total",
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
      previewObj: {
        business: {
          name: "",
          address: "",
          phone: "",
        },
        items: [],
        note: "",
      },
      receiptPreviewPopup: false,
      // quotationStatuses: [],
      issuedDate: Date(),
      expiryDate: Date(),
      // Quotation Itm
      // incomeReceiptItems: incomeReceiptItems.map((item, id) => {
      //   return { ...item, id };
      // }),

      incomeReceiptItems: [],

      selectedItem: null,

      selectedCustomer: null,
      organizationTypeList: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new IncomeReceiptApi(),
      customerApi: new CustomerApi(),
      productApi: new ProductApi(),
      customerItems: [],
      productItems: [],
    };
  },
  mounted() {
    var self = this;
    // this.fetchQuotationStatuses();
    self.refreshCustomer();
    self.refreshProduct();
    self.resetObj();
  },
  computed: {
    customerItemsWithAddNew() {
      return [
        ...this.customerItems,
        { id: "add_new", name: "-- Add New --" }, // Fixed "Add New" option
      ];
    },
    computedPreviewItem() {
      return {
        ...this.obj,
        items: this.computedincomeReceiptItems,
      };
    },

    computeExpiryDate() {
      return moment(this.expiryDate).format("YYYY-MM-DD");
    },
    computeIssuedDate() {
      return moment(this.issuedDate).format("YYYY-MM-DD");
    },

    computedincomeReceiptItems() {
      return this.incomeReceiptItems.map((item) => {
        return {
          ...item,
          productName: item.product.name,
          totalAmountPerItem: this.getTotalItemPrice(item),
        };
      });
    },
    grandTotal() {
      var total = 0;
      for (var i = 0; i < this.incomeReceiptItems.length; i++) {
        var item = this.incomeReceiptItems[i];
        total += item.price * item.quantity;
      }
      return total;
    },
  },
  methods: {
    onCustomerPopupConfirmation(status, evt, accept) {
      if (accept) {
        this.customerApi
          .create(this.itemAddNewCustomer)
          .then((response) => {
            console.log("onCustomerPopupConfirmation", response);

            var addedCustomer = response.result;
            this.refreshCustomer();
            this.selectedCustomer = addedCustomer;

            // self.$router.push({ path: "/tenants/customerList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      this.itemAddNewCustomer = {};
    },

    handleCustomerSelect(selected) {
      if (selected.id === "add_new") {
        // Trigger action to add a new customer
        this.addNewCustomer();
        this.selectedCustomer = null; // Reset selection
      }
    },
    addNewCustomer() {
      this.itemAddNewCustomer = {};
      this.addCustomerFormPopup = true;
    },
    cancel() {
      this.$router.push({ path: "/tenants/incomeReceipt" });
    },

    handleKeyDown(event, item) {
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;

      if (event.key === "Tab") {
        //check if user click tab or enter
        event.preventDefault();
        item.description =
          item.description.substring(0, start) +
          "    " + // 4 spaces
          item.description.substring(end);

        //start and end = current position of cursor, if tab, add 4 spaces
        this.$nextTick(() => {
          event.target.selectionStart = event.target.selectionEnd = start + 4; //tam
        });
      }

      if (event.key === "Enter") {
        //if user clicks enter, gets the cursor position & insert new line (\n)
        item.description =
          item.description.substring(0, start) +
          "\n" +
          item.description.substring(end);

        // Move cursor
        this.$nextTick(() => {
          event.target.selectionStart = event.target.selectionEnd = start + 1;
        });
      }
    },

    startTour() {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        cancelIcon: {
          enabled: true,
        },
        defaultStepOptions: {
          scrollTo: { behavior: "smooth", block: "center" },
          // classes: 'shadow-md bg-purple-dark',
          classes: "class-1 class-2",
        },
      });

      // Step 1: Explain Quotation Header
      tour.addStep({
        id: "quotation-header",
        text: "This is the quotation header where you can see the quotation number and status.",
        attachTo: {
          element: ".card-header-actions",
          on: "bottom",
        },
        buttons: [{ text: "Next", action: tour.next }],
      });

      // Step 2: Change Status
      tour.addStep({
        id: "change-status",
        text: "Use this dropdown to change the status of the quotation.",
        attachTo: { element: ".tour-cdropdown", on: "bottom" },
        buttons: [
          { text: "Back", action: tour.back },
          { text: "Next", action: tour.next },
        ],
      });

      // Step 3: Preview Button
      tour.addStep({
        id: "preview-button",
        text: "Click this button to preview the quotation before submission.",
        attachTo: { element: ".preview-button", on: "bottom" },
        buttons: [
          { text: "Back", action: tour.back },
          { text: "Next", action: tour.next },
        ],
      });

      // Step 4: Submit Button
      tour.addStep({
        id: "tour-submit-button",
        text: "Click here to submit your completed quotation.",
        attachTo: { element: ".tour-submit-button", on: "right" },
        buttons: [
          { text: "Back", action: tour.back },
          { text: "Finish", action: tour.complete },
        ],
      });

      // Start the tour
      tour.start();
    },
    // changeState(item) {
    //   var self = this;
    //   self.obj.status = item.id;
    //   if (self.obj.id) {
    //     this.api
    //       .updateState(self.obj)
    //       .then((response) => {
    //         self.resetObj();
    //       })
    //       .catch(({ data }) => {
    //         self.toast("Error", helper.getErrorMessage(data), "danger");
    //       });
    //   }
    // },
    // fetchQuotationStatuses() {
    //   var self = this;
    //   self.api
    //     .getQuotationStatus()
    //     .then((response) => {
    //       this.quotationStatuses = response.result;
    //       console.log(this.quotationStatuses);
    //     })
    //     .catch(({ data }) => {
    //       self.toast("Error", helper.getErrorMessage(data), "danger");
    //     });
    // },

    preview() {
      this.previewObj = {
        ...this.obj,
        items: this.computedincomeReceiptItems,
        expiryDate: this.expiryDate, // Add this line to include the expiry date
      };

      this.receiptPreviewPopup = true;
    },
    getBadgeClass() {
      if (this.obj.statusDescription == "Draft") {
        return "badge badge-secondary ml-1";
      } else if (this.obj.statusDescription == "Accepted") {
        return "badge badge-primary ml-1";
      } else if (this.obj.statusDescription == "Sent") {
        return "badge badge-success ml-1";
      } else if (this.obj.statusDescription == "Rejected") {
        return "badge badge-warning ml-1";
      } else if (this.obj.statusDescription == "Cancelled") {
        return "badge badge-danger ml-1";
      } else {
        return "badge badge-secondary ml-1";
      }
    },
    setExpiryDate(e) {
      this.expiryDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    setIssuedDate(e) {
      this.issuedDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    updatePositions() {
      this.computedincomeReceiptItems.forEach((item, index) => {
        item.position = index + 1;
      });
    },

    moveItem(index, direction) {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < this.computedincomeReceiptItems.length) {
        const temp = this.computedincomeReceiptItems[index];
        this.$set(
          this.computedincomeReceiptItems,
          index,
          this.computedincomeReceiptItems[newIndex]
        );
        this.$set(this.computedincomeReceiptItems, newIndex, temp);

        // Update positions after swapping
        this.computedincomeReceiptItems[index].position = index + 1;
        this.computedincomeReceiptItems[newIndex].position = newIndex + 1;
      }
    },

    onRemoveClaimItem(item) {
      var self = this;
      if (self.computedincomeReceiptItems != null) {
        for (var i = 0; i < self.computedincomeReceiptItems.length; i++) {
          if (self.computedincomeReceiptItems[i].id === item.id) {
            self.computedincomeReceiptItems.splice(i, 1);
          }
        }
      }

      this.updatePositions(); // Update positions after removal
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
      console.log(this.incomeReceiptItems);
      const newPosition = this.incomeReceiptItems.length + 1;
      this.incomeReceiptItems.push({
        id: this.generateGUID(),
        product: this.productItems[0],
        price: 0,
        quantity: 0,
        description: "",
        position: newPosition,
      });
      console.log(this.incomeReceiptItems);
    },
    getTotalItemPrice(item) {
      try {
        return item.quantity * item.price;
      } catch (error) {
        return 0;
      }
    },
    refreshProduct() {
      var self = this;
      self.productApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.productItems = response.result;
          console.log("self.productItems", self.productItems);
        })
        .catch(({ data }) => {});
    },

    refreshCustomer() {
      var self = this;
      self.loading = false;
      self.customerApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.customerItems = response.result;
          console.log("self.customerItems", self.customerItems);
        })
        .catch(({ data }) => {});
    },

    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            console.log(response);
            self.obj = response.result;
            console.log("self.obj", self.obj);

            this.issuedDate = self.obj.issuedDate;
            this.expiryDate = self.obj.dueDate;
            self.selectedCustomer = self.obj.customer;

            if (self.obj.items.length > 0) {
              if (self.obj.items[0].position == 0) {
                for (var i = 0; i < self.obj.items.length; i++) {
                  self.obj.items[i].position = i + 1;
                }
              }
            }

            self.incomeReceiptItems = self.obj.items;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        self.obj = self.getEmptyObj();

        let currentDate = new Date();
        this.issuedDate = new Date(
          currentDate.toISOString().split("T")[0] + "T00:00:00"
        ); // Set issuedDate
        currentDate.setDate(currentDate.getDate() + 30);
        this.expiryDate = new Date(
          currentDate.toISOString().split("T")[0] + "T00:00:00"
        ); // Set expiry date

        this.api
          .getNextNumber()
          .then((response) => {
            console.log(response.result);
            self.obj.incomeReceiptNumber = response.result;
            console.log(self.obj);
          })
          .catch(({ data }) => {});
      }
    },
    onSubmit() {
      var self = this;
      self.obj.items = self.computedincomeReceiptItems;
      self.obj.issuedDate = self.issuedDate;
      self.obj.dueDate = self.expiryDate;

      self.obj.items.forEach((item) => {
        item.productId = item.product.id;
      });
      console.log(self.obj.items);
      if (self.selectedCustomer) {
        self.obj.customerId = self.selectedCustomer.id;
      }

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.toast("Success", "Updated", "success");
            var newObj = response.result;
            self.$router.push({
              path: `/tenants/IncomeReceipt/${newObj.id}`,
            });

            self.resetObj();
            // self.$router.push({ path: "/tenants/quotationList" });
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
            //  self.$router.push({ path: "/tenants/quotationList" });
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
        incomeReceiptNumber: "",
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

<style scoped>
.table {
  width: 100%;
  margin-top: 20px;
}

.small-text {
  font-size: 0.5em !important;
}
</style>