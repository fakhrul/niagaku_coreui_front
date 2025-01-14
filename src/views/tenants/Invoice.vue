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
              <strong>Invoice</strong>
              <small>{{ obj.invoiceNumber }}</small>
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
                  <template v-for="status in invoiceStatuses">
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
                    <template #label>Customer </template>
                    <template #input>
                      <v-select
                        style="width: 100%"
                        v-model="selectedCustomer"
                        :label="'name'"
                        :options="customerItems"
                        placeholder="Select customer"
                      />
                    </template>
                  </CFormGroup>
                </CCol>
                <CCol
                  ><CInput
                    label="Invoice No"
                    placeholder=""
                    v-model="obj.invoiceNumber"
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
                    label="Invoice Title"
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
                    :items="computedInvoiceItems"
                    :fields="invoiceFields"
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
                          :disabled="index === invoiceItems.length - 1"
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
          <WidgetsReportInvoice :invoice="obj"></WidgetsReportInvoice>
        </CCol>
      </CRow> -->
    </div>
    <div>
      <CModal
        title="Invoice Preview"
        :show.sync="invoicePreviewPopup"
        size="xl"
      >
        <CRow>
          <CCol>
            <WidgetsReportInvoice :invoice="previewObj"></WidgetsReportInvoice>
          </CCol>
        </CRow>
      </CModal>
    </div>
  </div>
</template>

<script>
import InvoiceApi from "@/lib/invoiceApi";
import CustomerApi from "@/lib/customerApi";
import ProductApi from "@/lib/productApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import moment from "moment";
import WidgetsReportInvoice from "../widgets/WidgetsReportInvoice";
import QuotationApi from "@/lib/quotationApi";

const invoiceItems = [];
const invoiceFields = [
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
  name: "Invoice",
  components: {
    vSelect,
    WidgetsReportInvoice,
  },
  data: () => {
    return {
      quotationApi: new QuotationApi(),
      previewObj: {
        business: {
          name: "",
          address: "",
        },
        items: [],
        note: "",
      },
      invoicePreviewPopup: false,
      invoiceStatuses: [],
      issuedDate: Date(),
      expiryDate: Date(),
      // Invoice Itm
      invoiceItems: invoiceItems.map((item, id) => {
        return { ...item, id };
      }),

      invoiceFields,

      selectedItem: null,

      selectedCustomer: null,
      organizationTypeList: [],
      infoList: [],
      obj: {
        invoiceNumber: "",
      },
      submitted: false,
      api: new InvoiceApi(),
      customerApi: new CustomerApi(),
      productApi: new ProductApi(),
      customerItems: [],
      productItems: [],
    };
  },
  mounted() {
    var self = this;
    this.fetchInvoiceStatuses();
    self.refreshCustomer();
    self.refreshProduct();
    if (self.$route.name === "InvoiceConvertFromQuot") {
      this.processInvoiceConvertFromQuot();
    } else if (self.$route.name === "InvoiceConvertFromItem") {
      this.processInvoiceConvertFromItem();
    } else {
      self.resetObj();
    }
  },
  computed: {
    computeExpiryDate() {
      return moment(this.expiryDate).format("YYYY-MM-DD");
    },
    computeIssuedDate() {
      return moment(this.issuedDate).format("YYYY-MM-DD");
    },

    computedInvoiceItems() {
      return this.invoiceItems.map((item) => {
        return {
          ...item,
          productName: item.product.name,
          totalAmountPerItem: this.getTotalItemPrice(item),
        };
      });
    },
    grandTotal() {
      var total = 0;
      for (var i = 0; i < this.invoiceItems.length; i++) {
        var item = this.invoiceItems[i];
        total += item.price * item.quantity;
      }
      return total;
    },
  },
  methods: {
    cancel() {
      this.$router.push({ path: "/tenants/InvoiceList" });
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
    fetchInvoiceStatuses() {
      var self = this;
      self.api
        .getInvoiceStatus()
        .then((response) => {
          this.invoiceStatuses = response.result;
          console.log(this.invoiceStatuses);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    preview() {
      this.previewObj = this.obj;
      this.previewObj.items = this.computedInvoiceItems;
      this.invoicePreviewPopup = true;
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
      this.computedInvoiceItems.forEach((item, index) => {
        item.position = index + 1;
      });
    },

    moveItem(index, direction) {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < this.computedInvoiceItems.length) {
        const temp = this.computedInvoiceItems[index];
        this.$set(
          this.computedInvoiceItems,
          index,
          this.computedInvoiceItems[newIndex]
        );
        this.$set(this.computedInvoiceItems, newIndex, temp);

        // Update positions after swapping
        this.computedInvoiceItems[index].position = index + 1;
        this.computedInvoiceItems[newIndex].position = newIndex + 1;
      }
    },

    // moveItem(index, direction) {
    //   const newIndex = direction === "up" ? index - 1 : index + 1;
    //   if (newIndex >= 0 && newIndex < this.computedInvoiceItems.length) {
    //     const temp = this.computedInvoiceItems[index];
    //     this.$set(this.computedInvoiceItems, index, this.invoiceItems[newIndex]);
    //     this.$set(this.computedInvoiceItems, newIndex, temp);
    //   }
    // },
    // onProductChange(item, product) {
    //   alert("asdasd");
    //   console.log(item);
    //   console.log(product);
    // },
    onRemoveClaimItem(item) {
      var self = this;
      if (self.invoiceItems != null) {
        for (var i = 0; i < self.invoiceItems.length; i++) {
          if (self.invoiceItems[i].id === item.id) {
            self.invoiceItems.splice(i, 1);
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
      const newPosition = this.invoiceItems.length + 1;
      this.invoiceItems.push({
        id: this.generateGUID(),
        product: this.productItems[0],
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

    refreshCustomer() {
      var self = this;
      self.loading = false;
      self.customerApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.customerItems = response.result;

          // for (let i = 0; i < response.result.length; i++) {
          //   self.customerItems.push({
          //     value: response.result[i].id,
          //     label: response.result[i].name,
          //   });
          // }
        })
        .catch(({ data }) => {});
    },
    processInvoiceConvertFromItem() {
      var self = this;
      self.quotationApi
        .getItem(self.$route.params.id)
        .then((response) => {
          self.obj = self.getEmptyObj();
          var item = response.result;
          console.log("item", item);
          let currentDate = new Date();
          this.issuedDate = new Date(
            currentDate.toISOString().split("T")[0] + "T00:00:00"
          ); // Set issuedDate
          currentDate.setDate(currentDate.getDate() + 30);
          this.expiryDate = new Date(
            currentDate.toISOString().split("T")[0] + "T00:00:00"
          ); // Set expiry date

          self.selectedCustomer = item.quotation.customer;

          // if (quotation.items.length > 0) {
          //   if (quotation.items[0].position == 0) {
          //     for (var i = 0; i < quotation.items.length; i++) {
          //       quotation.items[i].position = i + 1;
          //     }
          //   }
          // }
          this.obj.items.push({
            id: this.generateGUID(),
            product: item.product,
            price: item.price,
            quantity: item.quantity,
            description: item.description,
            position: 1,
          });

          this.invoiceItems = this.obj.items;
          console.log(this.invoiceItems);

          this.api
            .getNextNumber()
            .then((response) => {
              self.obj.invoiceNumber = response.result;
            })
            .catch(({ data }) => {});

          // for (var i = 0; i < self.obj.items.length; i++) {
          //   delete self.obj.items[i].id;
          // }

          // Optionally modify any other fields if required
          this.toast(
            "Info",
            "You are convert quotation item to invoice.",
            "info"
          );
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    processInvoiceConvertFromQuot() {
      var self = this;
      self.quotationApi
        .get(self.$route.params.id)
        .then((response) => {
          self.obj = self.getEmptyObj();
          var quotation = response.result;
          let currentDate = new Date();
          this.issuedDate = new Date(
            currentDate.toISOString().split("T")[0] + "T00:00:00"
          ); // Set issuedDate
          currentDate.setDate(currentDate.getDate() + 30);
          this.expiryDate = new Date(
            currentDate.toISOString().split("T")[0] + "T00:00:00"
          ); // Set expiry date

          self.selectedCustomer = quotation.customer;

          if (quotation.items.length > 0) {
            if (quotation.items[0].position == 0) {
              for (var i = 0; i < quotation.items.length; i++) {
                quotation.items[i].position = i + 1;
              }
            }
          }

          self.invoiceItems = self.obj.items = quotation.items;

          this.api
            .getNextNumber()
            .then((response) => {
              console.log(response.result);
              self.obj.invoiceNumber = response.result;
              console.log(self.obj);
            })
            .catch(({ data }) => {});

          for (var i = 0; i < self.obj.items.length; i++) {
            delete self.obj.items[i].id;
          }

          // Optionally modify any other fields if required
          this.toast("Info", "You are convert quotation to invoice.", "info");
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

            self.invoiceItems = self.obj.items;
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
            self.obj.invoiceNumber = response.result;
            console.log(self.obj.invoiceNumber);
          })
          .catch(({ data }) => {});
      }
    },
    onSubmit() {
      var self = this;
      self.obj.items = self.computedInvoiceItems;
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
              path: `/tenants/Invoice/${newObj.id}`,
            });

            self.resetObj();
            // self.$router.push({ path: "/tenants/invoiceList" });
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
            //  self.$router.push({ path: "/tenants/invoiceList" });
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
        invoiceNumber: "",
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

<style scoped>
.table {
  width: 100%;
  margin-top: 20px;
}
</style>