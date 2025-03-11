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
              <strong>Purchase Order</strong>
              <small>{{ obj.orderNumber }}</small>
              <a href="" target="_blank" :class="getBadgeClass()">
                {{ obj.statusDescription }}
              </a>
              <div class="card-header-actions">
                <!-- <CDropdown
                  placement="bottom-end"
                  toggler-text="Change Status"
                  color="primary"
                  class="m-2 d-inline-block"
                  size="sm"
                >
                  <template v-for="status in purchaseorderStatuses">
                    <CDropdownItem @click="changeState(status)">{{
                      status.name
                    }}</CDropdownItem>
                  </template>
                </CDropdown> -->
                <CDropdown
                  placement="bottom-end"
                  toggler-text="Action"
                  color="light"
                  class="m-2 d-inline-block tour-cdropdown"
                  size="sm"
                >
                  <CDropdownItem @click="onConvertToInvoice(obj)"
                    >Convert To Invoice</CDropdownItem
                  >
                  <CDropdownDivider />
                  <CDropdownHeader>Change Status To:</CDropdownHeader>
                  <template v-for="status in purchaseorderStatuses">
                    <CDropdownItem @click="changeState(status)">{{
                      status.name
                    }}</CDropdownItem>
                  </template>
                </CDropdown>
                <CDropdown
                  size="sm"
                  toggler-text="Help"
                  color="link"
                  class="m-0 d-inline-block"
                >
                  <!-- <CIcon name="cil-x-circle"/> -->
                  <!-- <CDropdownItem @click="startTour"
                    >Onboarding Tour</CDropdownItem
                  > -->
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
                <CCol sm="12" md="12" lg="6">
                  <v-select
                    class="form-control-lg"
                    style="width: 100%"
                    v-model="selectedVendor"
                    :label="'name'"
                    :options="vendorItemsWithAddNew"
                    placeholder="Select Supplier"
                    @input="handleVendorSelect"
                  />
                  <div class="text-muted small mt-1">Custoner</div>
                </CCol>
                <CCol sm="12" md="12" lg="6"
                  ><CInput
                    size="lg"
                    placeholder="PO No"
                    v-model="obj.orderNumber"
                    description="P.O. No"
                  >
                    <!-- <template #prepend-content><CIcon name="cil-envelope-closed"/></template>  -->
                  </CInput></CCol
                >
              </CRow>

              <CRow>
                <CCol sm="12" md="8" lg="4">
                  <CInput
                    type="date"
                    size="lg"
                    :value="computeIssuedDate"
                    @change="setIssuedDate"
                    description="Issue Date"
                  />

                
                </CCol>
                <CCol sm="12" md="8" lg="4">
                  <CInput
                    size="lg"
                    description="Expriry Date"
                    type="date"
                    :value="computeExpiryDate"
                    @change="setExpiryDate"
                /></CCol>
                <CCol sm="12" md="8" lg="4">
                  <CInput
                    size="lg"
                    description="Reference"
                    v-model="obj.reference"
                /></CCol>
              </CRow>


              <CRow>
                <CCol>
                  <CTextarea
                    label="Title"
                    v-model="obj.title"
                    placeholder=""
                    rows="2"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <!-- Wrap CDataTable with draggable -->

                  <CDataTable
                    :items="computedPurchaseOrderItems"
                    :fields="purchaseOrderFields"
                  >
                    <template #show_drag="{ item, index }">
                      <td>
                        <i class="cil-cursor-move">Move</i>
                      </td>
                    </template>

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
                              v-model="item.purchaseProduct"
                              :label="'name'"
                              :options="computeProductItemsWithAddNew"
                              placeholder="Select product"
                              @input="handleProductSelect($event, item)"
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
                          rows="1"
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
                          :disabled="index === purchaseOrderItems.length - 1"
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
                        <CButton color="light" @click="addNewItem()"
                          >Add Item</CButton
                        >
                      </td>
                      <td colspan="3" class="text-right">
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
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Preview</CCardHeader>
            <CCardBody>
              <WidgetsReportPurchaseOrder
                :document="computedPreviewItem"
              ></WidgetsReportPurchaseOrder>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <!-- <CRow>
        <CCol>
          <WidgetsReportPurchaseOrder :purchaseorder="obj"></WidgetsReportPurchaseOrder>
        </CCol>
      </CRow> -->
    </div>
    <div>
      <CModal
        title="PurchaseOrder Preview"
        :show.sync="purchaseorderPreviewPopup"
        size="xl"
      >
        <CRow>
          <CCol>
            <!-- <WidgetsReportPurchaseOrder :purchaseorder="previewObj"></WidgetsReportPurchaseOrder> -->
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal
        title="Add New Vendor"
        size="xl"
        :show.sync="addVendorFormPopup"
        @update:show="onVendorPopupConfirmation"
      >
        <CRow form>
          <CCol md="6">
            <CInput
              label="Name"
              v-model="itemAddNewVendor.name"
              placeholder="Vendor Sdn Bhd"
              required
              was-validated
            />
            <CInput
              label="Contact Name"
              v-model="itemAddNewVendor.contactName"
            />
            <CInput
              label="Contact Email"
              v-model="itemAddNewVendor.contactEmail"
            />
            <CInput
              label="Contact Phone"
              v-model="itemAddNewVendor.contactPhone"
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
              v-model="itemAddNewVendor.address"
              required
              was-validated
            />
            <CInput label="City" v-model="itemAddNewVendor.city" />
            <CInput label="Country" v-model="itemAddNewVendor.country" />
            <CInput label="State" v-model="itemAddNewVendor.state" />
            <CInput label="Postcode" v-model="itemAddNewVendor.postcode" />
            <CInput label="Phone" v-model="itemAddNewVendor.phone" />
            <CInput label="Website" v-model="itemAddNewVendor.website" />
          </CCol>
        </CRow>
      </CModal>
    </div>
    <div>
      <CModal
        title="Add New Product"
        size="xl"
        :show.sync="addPoductFormPopup"
        @update:show="onProductPopupConfirmation"
      >
        <CRow form>
          <CCol md="12">
            <CInput label="Name" horizontal v-model="itemAddNewProduct.name" />
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label">
                Description
              </CCol>
              <CCol sm="9">
                <CTextarea placeholder="" rows="5" v-model="itemAddNewProduct.description" />
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CModal>
    </div>
  </div>
</template>

<script>
import PurchaseOrderApi from "@/lib/purchaseOrderApi";
import VendorApi from "@/lib/vendorApi";
import PurchaseProductApi from "@/lib/purchaseProductApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import moment from "moment";
import WidgetsReportPurchaseOrder from "../widgets/WidgetsReportPurchaseOrder";

const purchaseOrderItems = [];
// const purchaseOrderFields = [
//   {
//     key: "show_index",
//     label: "#",
//     _style: "width:1%",
//     sorter: false,
//     filter: false,
//   },
//   { key: "position", label: "Position" },
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
  name: "PurchaseOrder",
  components: {
    vSelect,
    WidgetsReportPurchaseOrder,
  },
  data: () => {
    return {
      itemPendingNewProduct: null,
      itemAddNewProduct: {},
      addPoductFormPopup: false,

      itemAddNewVendor: {},
      addVendorFormPopup: false,

      previewObj: null,
      purchaseorderPreviewPopup: false,
      purchaseorderStatuses: [],
      issuedDate: Date(),
      expiryDate: Date(),
      // PurchaseOrder Itm
      purchaseOrderItems: purchaseOrderItems.map((item, id) => {
        return { ...item, id };
      }),

      purchaseOrderFields : [
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
    _style: "width:100px",
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

      selectedItem: null,

      selectedVendor: null,
      organizationTypeList: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new PurchaseOrderApi(),
      vendorApi: new VendorApi(),
      productApi: new PurchaseProductApi(),
      vendorItems: [],
      productItems: [],
    };
  },
  mounted() {
    var self = this;
    self.initializeDefaultDate();
    this.fetchPurchaseOrderStatuses();
    self.refreshVendor();
    self.refreshProduct();
    self.resetObj();
  },
  computed: {
    computedPreviewItem() {
      return {
        ...this.obj,
        items: this.computedPurchaseOrderItems,
        expiryDate: this.expiryDate, // Add this line to include the expiry date
      };
    },
    
    computeProductItemsWithAddNew() {
      return [
        ...this.productItems,
        { id: "add_new", name: "-- Add New --" }, // Fixed "Add New" option
      ];
    },
        vendorItemsWithAddNew() {
      return [
        ...this.vendorItems,
        { id: "add_new", name: "-- Add New --" }, // Fixed "Add New" option
      ];
    },
    computeExpiryDate() {
      return moment(this.expiryDate).format("YYYY-MM-DD");
    },
    computeIssuedDate() {
      return moment(this.issuedDate).format("YYYY-MM-DD");
    },

    computedPurchaseOrderItems() {
      return this.purchaseOrderItems.map((item) => {
        return {
          ...item,
          productName: item.purchaseProduct.name,
          totalAmountPerItem: this.getTotalItemPrice(item),
        };
      });
    },
    grandTotal() {
      var total = 0;
      for (var i = 0; i < this.purchaseOrderItems.length; i++) {
        var item = this.purchaseOrderItems[i];
        total += item.price * item.quantity;
      }
      return total;
    },
  },
  methods: {
    cancel() {
      this.$router.push({ path: "/tenants/PurchaseOrderList" });
    },

    onProductPopupConfirmation(status, evt, accept) {
      if (accept) {
        this.productApi
          .create(this.itemAddNewProduct)
          .then((response) => {
            console.log("onProductPopupConfirmation", response);
            var addedProduct = response.result;
            this.refreshProduct();
            this.itemPendingNewProduct.purchaseProduct = addedProduct;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      else
      {
        this.itemPendingNewProduct.purchaseProduct = null;
      }
      this.itemAddNewProduct = {};
    },
        handleProductSelect(selected, item) {
      if (selected.id === "add_new") {
        this.itemPendingNewProduct = item;
        this.itemAddNewProduct = {};
        this.addPoductFormPopup = true;

        // // Trigger action to add a new customer
        // this.addNewProduct();
        // this.selectedCustomer = null; // Reset selection
      }
    },
        onVendorPopupConfirmation(status, evt, accept) {
      if (accept) {
        this.vendorApi
          .create(this.itemAddNewVendor)
          .then((response) => {
            var addedVendor = response.result;
            this.refreshVendor();
            this.selectedVendor = addedVendor;

            // self.$router.push({ path: "/tenants/customerList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      this.itemAddNewVendor = {};
    },


    handleVendorSelect(selected) {
      if (selected.id === "add_new") {
        // Trigger action to add a new customer
        this.addNewVendor();
        this.selectedVendor = null; // Reset selection
      }
    },
    addNewVendor() {
      this.itemAddNewVendor = {};
      this.addVendorFormPopup = true;
    },

    initializeDefaultDate() {
      const today = new Date();
      this.issuedDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
      this.expiryDate = this.issuedDate;
    },
    changeState(item) {
      var self = this;
      self.obj.status = item.id;
      if (self.obj.id) {
        this.api
          .updateState(self.obj)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    fetchPurchaseOrderStatuses() {
      var self = this;
      self.api
        .getPurchaseOrderStatus()
        .then((response) => {
          this.purchaseorderStatuses = response.result;
          // console.log(this.purchaseorderStatuses);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    preview() {
      this.previewObj = this.obj;
      this.previewObj.items = this.computedPurchaseOrderItems;
      this.purchaseorderPreviewPopup = true;
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
      this.computedPurchaseOrderItems.forEach((item, index) => {
        item.position = index + 1;
      });
    },

    moveItem(index, direction) {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < this.computedPurchaseOrderItems.length) {
        const temp = this.computedPurchaseOrderItems[index];
        this.$set(
          this.computedPurchaseOrderItems,
          index,
          this.computedPurchaseOrderItems[newIndex]
        );
        this.$set(this.computedPurchaseOrderItems, newIndex, temp);

        // Update positions after swapping
        this.computedPurchaseOrderItems[index].position = index + 1;
        this.computedPurchaseOrderItems[newIndex].position = newIndex + 1;
      }
    },

    onRemoveClaimItem(item) {
      var self = this;
      if (self.computedPurchaseOrderItems != null) {
        for (var i = 0; i < self.computedPurchaseOrderItems.length; i++) {
          if (self.computedPurchaseOrderItems[i].id === item.id) {
            self.computedPurchaseOrderItems.splice(i, 1);
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
      // console.log(this.computedPurchaseOrderItems);

      const newPosition = this.computedPurchaseOrderItems.length + 1;
      this.computedPurchaseOrderItems.push({
        id: this.generateGUID(),
        purchaseProduct: this.productItems[0],
        price: 0,
        quantity: 0,
        description: "",
        position: newPosition,
      });
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
        })
        .catch(({ data }) => {});
    },

    refreshVendor() {
      var self = this;
      self.loading = false;
      self.vendorApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.vendorItems = response.result;

          // for (let i = 0; i < response.result.length; i++) {
          //   self.vendorItems.push({
          //     value: response.result[i].id,
          //     label: response.result[i].name,
          //   });
          // }
        })
        .catch(({ data }) => {});
    },

    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
            this.issuedDate = self.obj.issuedDate;
            this.expiryDate = self.obj.dueDate;
            self.selectedVendor = self.obj.vendor;

            if (self.obj.items.length > 0) {
              if (self.obj.items[0].position == 0) {
                for (var i = 0; i < self.obj.items.length; i++) {
                  self.obj.items[i].position = i + 1;
                }
              }
            }

            self.purchaseOrderItems = self.obj.items;



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
            self.obj.orderNumber = response.result;
          })
          .catch(({ data }) => {});

      }
    },
    onSubmit() {
      var self = this;
      self.obj.items = self.computedPurchaseOrderItems;
      self.obj.issuedDate = self.issuedDate;
      self.obj.dueDate = self.expiryDate;

      self.obj.items.forEach((item) => {
        item.purchaseProductId = item.purchaseProduct.id;
      });

      self.obj.vendorId = self.selectedVendor.id;
      console.log(self.obj.items);

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.toast("Success", "Updated", "success");
            self.resetObj();
            // self.$router.push({ path: "/tenants/purchaseorderList" });
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
            //  self.$router.push({ path: "/tenants/purchaseorderList" });
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
</style>