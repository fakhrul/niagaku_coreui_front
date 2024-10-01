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
                <CButton size="sm" color="primary" @click="preview">
                  Preview</CButton
                >
                <CDropdown
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
                </CDropdown>
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol
                  ><CFormGroup wrapperClasses="input-group pt-2">
                    <template #label>Vendor/Supplier </template>
                    <template #input>
                      <v-select
                        style="width: 100%"
                        v-model="selectedVendor"
                        :label="'name'"
                        :options="vendorItems"
                        placeholder="Select vendor"
                      />
                    </template>
                  </CFormGroup>
                </CCol>
                <CCol
                  ><CInput
                    label="PO No"
                    placeholder=""
                    v-model="obj.orderNumber"
                /></CCol>
                <CCol>
                  <CInput
                    label="Date"
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
                <CCol>
                  <CInput
                    label="Expiry"
                    type="date"
                    :value="computeExpiryDate"
                    @change="setExpiryDate"
                /></CCol>
                <CCol>
                  <CInput label="Reference" v-model="obj.reference"
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
const purchaseOrderFields = [
  {
    key: "show_index",
    label: "#",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
  { key: "position", label: "Position" },
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
];

export default {
  name: "PurchaseOrder",
  components: {
    vSelect,
    WidgetsReportPurchaseOrder,
  },
  data: () => {
    return {
      previewObj: null,
      purchaseorderPreviewPopup: false,
      purchaseorderStatuses: [],
      issuedDate: Date(),
      expiryDate: Date(),
      // PurchaseOrder Itm
      purchaseOrderItems: purchaseOrderItems.map((item, id) => {
        return { ...item, id };
      }),

      purchaseOrderFields,

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