<template>
  <div>
    <!-- Toast Notifications -->
    <CToaster :autohide="3000" placement="top-end">
      <template v-for="info in infoList">
        <CToast
          :key="info.message"
          :show="true"
          :header="info.header"
          :color="info.color"
          class="shadow-sm"
        >
          {{ info.message }}
        </CToast>
      </template>
    </CToaster>

    <!-- Page Header -->
    <CCard class="mb-4 border-0 shadow-sm">
      <CCardBody class="p-4">
        <CRow class="align-items-center">
          <CCol md="6">
            <h1 class="mb-1 font-weight-bold">
              {{ obj.id ? "Edit Invoice" : "Create Invoice" }}
            </h1>
            <p class="text-medium-emphasis mb-0">
              {{
                obj.id
                  ? `Editing invoice ${obj.invoiceNumber}`
                  : "Create a new invoice for your customer"
              }}
            </p>
          </CCol>
          <CCol md="6" class="d-flex justify-content-end">
            <CBadge :class="getBadgeClass()" class="mr-3 p-2">
              {{ obj.statusDescription || "Draft" }}
            </CBadge>
            <CDropdown
              placement="bottom-end"
              toggler-text="Actions"
              color="primary"
              class="mr-2"
              size="sm"
            >
              <CDropdownItem @click="addNew()">New Invoice</CDropdownItem>
              <CDropdownItem @click="onConvertToReceipt(obj)"
                >Convert To Receipt</CDropdownItem
              >
              <CDropdownDivider />
              <CDropdownHeader>Change Status To:</CDropdownHeader>
              <template v-for="status in computedInvoiceStatuses">
                <CDropdownItem @click="changeState(status)">{{
                  status.name
                }}</CDropdownItem>
              </template>
            </CDropdown>
            <CDropdown size="sm" toggler-text="Help" color="light">
              <CDropdownItem @click="startTour">Onboarding Tour</CDropdownItem>
              <CDropdownItem disabled>Quick Info</CDropdownItem>
              <CDropdownItem disabled>Help Center & FAQ</CDropdownItem>
              <CDropdownItem disabled>Video Tutorial</CDropdownItem>
              <CDropdownItem disabled>Live Chat</CDropdownItem>
              <CDropdownItem disabled>Send Feedback</CDropdownItem>
            </CDropdown>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Main Form -->
    <CRow>
      <CCol lg="8">
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 p-4">
            <h5 class="mb-0">Invoice Details</h5>
          </CCardHeader>
          <CCardBody class="p-4">
            <!-- Customer & Invoice Info -->
            <CRow>
              <CCol md="6">
                <CFormGroup>
                  <CLabel class="font-weight-bold">Customer</CLabel>
                  
                  <v-select
                    class="mb-3"
                    v-model="selectedCustomer"
                    :label="'name'"
                    :options="customerItemsWithAddNew"
                    placeholder="Select customer"
                    @input="handleCustomerSelect"
                  >
                    <span slot="no-options" @click="addNewCustomer">
                      No More Options. Click to add New.
                    </span>
                  </v-select>

                  <div
                    v-if="selectedCustomer && selectedCustomer.id !== 'add_new'"
                    class="customer-details p-3 bg-light rounded mb-3"
                  >
                    <div class="d-flex align-items-center mb-2">
                      <div
                        class="c-avatar c-avatar-sm bg-primary-gradient text-white mr-2"
                      >
                        {{
                          selectedCustomer.name
                            ? selectedCustomer.name.charAt(0)
                            : "?"
                        }}
                      </div>
                      <div class="font-weight-bold">
                        {{ selectedCustomer.name }}
                      </div>
                    </div>
                    <div
                      class="small text-muted mb-1"
                      v-if="selectedCustomer.address"
                    >
                      <CIcon name="cil-location-pin" />
                      {{ selectedCustomer.address }}
                    </div>
                    <div
                      class="small text-muted mb-1"
                      v-if="selectedCustomer.contactEmail"
                    >
                      <CIcon name="cil-envelope-closed" />
                      {{ selectedCustomer.contactEmail }}
                    </div>
                    <div
                      class="small text-muted"
                      v-if="selectedCustomer.contactPhone"
                    >
                      <CIcon name="cil-phone" />
                      {{ selectedCustomer.contactPhone }}
                    </div>
                  </div>
                </CFormGroup>

                <CFormGroup>
                  <CLabel class="font-weight-bold">Contact Person</CLabel>
                  <CInput
                    placeholder="Contact person name"
                    v-model="obj.contactName"
                  />
                </CFormGroup>
              </CCol>

              <CCol md="6">
                <CFormGroup>
                  <CLabel class="font-weight-bold">Invoice Number</CLabel>
                  <CInput
                    placeholder="Auto-generated if left empty"
                    v-model="obj.invoiceNumber"
                  />
                </CFormGroup>

                <CRow>
                  <CCol sm="6">
                    <CFormGroup>
                      <CLabel class="font-weight-bold">Issue Date</CLabel>
                      <CInput
                        type="date"
                        :value="computeIssuedDate"
                        @change="setIssuedDate"
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol sm="6">
                    <CFormGroup>
                      <CLabel class="font-weight-bold">Due Date</CLabel>
                      <CInput
                        type="date"
                        :value="computeExpiryDate"
                        @change="setExpiryDate"
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>

                <CFormGroup>
                  <CLabel class="font-weight-bold">Reference</CLabel>
                  <CInput
                    placeholder="PO number or reference"
                    v-model="obj.reference"
                  />
                </CFormGroup>
              </CCol>
            </CRow>

            <CFormGroup>
              <CLabel class="font-weight-bold">Invoice Title</CLabel>
              <CTextarea
                v-model="obj.title"
                placeholder="Enter a descriptive title for this invoice"
                rows="2"
              />
            </CFormGroup>

            <!-- Invoice Items -->
            <div class="mt-4">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h5 class="mb-0">Invoice Items</h5>
                <CButton color="primary" size="sm" @click="addNewItem()">
                  <CIcon name="cil-plus" /> Add Item
                </CButton>
              </div>

              <div class="table-responsive">
                <table class="table table-hover border">
                  <thead>
                    <tr>
                      <th style="width: 50px">#</th>
                      <th>Item</th>
                      <th>Description</th>
                      <th style="width: 100px">Quantity</th>
                      <th style="width: 100px">Unit</th>
                      <th style="width: 150px">Price</th>
                      <th style="width: 150px">Total</th>
                      <th style="width: 100px">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in computedInvoiceItems"
                      :key="item.id"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>
                        <v-select
                          v-model="item.product"
                          :label="'name'"
                          :options="computeProductItemsWithAddNew"
                          placeholder="Select product"
                          @input="handleProductSelect($event, item)"
                        />
                      </td>
                      <td>
                        <CTextarea
                          placeholder="Item description"
                          v-model="item.description"
                          rows="2"
                        />
                      </td>
                      <td>
                        <CInput v-model="item.quantity" type="number" min="1" />
                      </td>
                      <td>
                        <CInput v-model="item.unit" />
                      </td>
                      <td>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text">Rp</span>
                          </div>
                          <CInput
                            v-model="item.price"
                            type="number"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </td>
                      <td class="font-weight-bold">
                        {{ formatCurrency(getTotalItemPrice(item)) }}
                      </td>
                      <td>
                        <CButtonGroup>
                          <CButton
                            color="light"
                            size="sm"
                            @click="moveItem(index, 'up')"
                            :disabled="index === 0"
                            title="Move Up"
                          >
                            <CIcon name="cil-arrow-top" />
                          </CButton>
                          <CButton
                            color="light"
                            size="sm"
                            @click="moveItem(index, 'down')"
                            :disabled="index === invoiceItems.length - 1"
                            title="Move Down"
                          >
                            <CIcon name="cil-arrow-bottom" />
                          </CButton>
                          <CButton
                            color="light"
                            size="sm"
                            @click="onRemoveClaimItem(item)"
                            title="Remove"
                          >
                            <CIcon name="cil-trash" />
                          </CButton>
                        </CButtonGroup>
                      </td>
                    </tr>
                    <tr v-if="computedInvoiceItems.length === 0">
                      <td colspan="8" class="text-center py-4">
                        <div class="text-muted">
                          <CIcon name="cil-basket" size="xl" />
                          <p class="mt-2">No items added yet</p>
                          <CButton
                            color="primary"
                            size="sm"
                            @click="addNewItem()"
                            >Add Item</CButton
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="6" class="text-right font-weight-bold">
                        Subtotal:
                      </td>
                      <td class="font-weight-bold">
                        {{ formatCurrency(grandTotal) }}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colspan="6" class="text-right font-weight-bold">
                        Tax (0%):
                      </td>
                      <td class="font-weight-bold">{{ formatCurrency(0) }}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colspan="6" class="text-right font-weight-bold">
                        Grand Total:
                      </td>
                      <td class="font-weight-bold">
                        {{ formatCurrency(grandTotal) }}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Mobile View for Items -->
              <div class="d-md-none">
                <div
                  v-for="(item, index) in computedInvoiceItems"
                  :key="item.id"
                  class="mb-3 border rounded p-3"
                >
                  <div
                    class="d-flex justify-content-between align-items-center mb-2"
                  >
                    <h6 class="mb-0">Item #{{ index + 1 }}</h6>
                    <CButtonGroup>
                      <CButton
                        color="light"
                        size="sm"
                        @click="moveItem(index, 'up')"
                        :disabled="index === 0"
                      >
                        <CIcon name="cil-arrow-top" />
                      </CButton>
                      <CButton
                        color="light"
                        size="sm"
                        @click="moveItem(index, 'down')"
                        :disabled="index === invoiceItems.length - 1"
                      >
                        <CIcon name="cil-arrow-bottom" />
                      </CButton>
                      <CButton
                        color="light"
                        size="sm"
                        @click="onRemoveClaimItem(item)"
                      >
                        <CIcon name="cil-trash" />
                      </CButton>
                    </CButtonGroup>
                  </div>

                  <div class="form-group">
                    <label>Product</label>
                    <v-select
                      v-model="item.product"
                      :label="'name'"
                      :options="computeProductItemsWithAddNew"
                      placeholder="Select product"
                      @input="handleProductSelect($event, item)"
                    />
                  </div>

                  <div class="form-group">
                    <label>Description</label>
                    <CTextarea
                      placeholder="Item description"
                      v-model="item.description"
                      rows="2"
                    />
                  </div>

                  <CRow>
                    <CCol xs="6">
                      <div class="form-group">
                        <label>Quantity</label>
                        <CInput v-model="item.quantity" type="number" min="1" />
                      </div>
                    </CCol>
                    <CCol xs="6">
                      <div class="form-group">
                        <label>Unit</label>
                        <CInput v-model="item.unit" />
                      </div>
                    </CCol>
                  </CRow>

                  <div class="form-group">
                    <label>Price</label>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Rp</span>
                      </div>
                      <CInput
                        v-model="item.price"
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div
                    class="d-flex justify-content-between mt-2 pt-2 border-top"
                  >
                    <div class="text-muted">Total:</div>
                    <div class="font-weight-bold">
                      {{ formatCurrency(getTotalItemPrice(item)) }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="computedInvoiceItems.length === 0"
                  class="text-center py-4 border rounded"
                >
                  <div class="text-muted">
                    <CIcon name="cil-basket" size="xl" />
                    <p class="mt-2">No items added yet</p>
                    <CButton color="primary" size="sm" @click="addNewItem()"
                      >Add Item</CButton
                    >
                  </div>
                </div>

                <div class="mt-3 p-3 border rounded bg-light">
                  <div class="d-flex justify-content-between mb-2">
                    <div>Subtotal:</div>
                    <div class="font-weight-bold">
                      {{ formatCurrency(grandTotal) }}
                    </div>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <div>Tax (0%):</div>
                    <div class="font-weight-bold">{{ formatCurrency(0) }}</div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <div class="font-weight-bold">Grand Total:</div>
                    <div class="font-weight-bold">
                      {{ formatCurrency(grandTotal) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Terms & Conditions -->
            <div class="mt-4">
              <CFormGroup>
                <CLabel class="font-weight-bold">Terms & Conditions</CLabel>
                <CTextarea
                  v-model="obj.note"
                  placeholder="Enter your terms and conditions"
                  rows="5"
                />
              </CFormGroup>
            </div>
          </CCardBody>
          <CCardFooter
            class="bg-transparent d-flex justify-content-between p-4"
          >
            <CButton color="light" @click="cancel"> Cancel </CButton>
            <CButton color="primary" @click="submit">
              <CIcon name="cil-check-circle" />
              {{ obj.id ? "Update Invoice" : "Create Invoice" }}
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>

      <!-- Sidebar -->
      <CCol lg="4">
        <!-- Invoice Summary -->
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 p-4">
            <h5 class="mb-0">Invoice Summary</h5>
          </CCardHeader>
          <CCardBody class="p-4">
            <div class="d-flex justify-content-between mb-3">
              <div class="text-muted">Subtotal:</div>
              <div class="font-weight-bold">
                {{ formatCurrency(grandTotal) }}
              </div>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <div class="text-muted">Tax (0%):</div>
              <div class="font-weight-bold">{{ formatCurrency(0) }}</div>
            </div>
            <!-- Replace CSeparator with a simple horizontal rule -->
            <hr class="my-3" />
            <div class="d-flex justify-content-between mb-3">
              <div class="font-weight-bold">Grand Total:</div>
              <div class="font-weight-bold h4">
                {{ formatCurrency(grandTotal) }}
              </div>
            </div>

            <CButton color="success" block class="mt-3">
              <CIcon name="cil-envelope-letter" /> Send to Customer
            </CButton>
            <CButton color="light" block class="mt-2">
              <CIcon name="cil-print" /> Print Invoice
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol
        ><!-- Invoice Preview -->
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 p-4">
            <h5 class="mb-0">Preview</h5>
          </CCardHeader>
          <CCardBody class="p-0">
            <div class="invoice-preview">
              <WidgetsReportInvoice
                :invoice="computedPreviewItem"
              ></WidgetsReportInvoice>
            </div>
          </CCardBody> </CCard
      ></CCol>
    </CRow>

    <!-- Add Customer Modal -->
    <CModal
      title="Add New Customer"
      size="lg"
      :show.sync="addCustomerFormPopup"
      @update:show="onCustomerPopupConfirmation"
    >
      <CRow>
        <CCol md="6">
          <CFormGroup>
            <CLabel class="font-weight-bold">Company Name</CLabel>
            <CInput
              v-model="itemAddNewCustomer.name"
              placeholder="Customer Sdn Bhd"
              required
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel class="font-weight-bold">Contact Name</CLabel>
            <CInput
              v-model="itemAddNewCustomer.contactName"
              placeholder="Contact person name"
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel class="font-weight-bold">Contact Email</CLabel>
            <CInput
              v-model="itemAddNewCustomer.contactEmail"
              placeholder="contact@example.com"
              type="email"
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel class="font-weight-bold">Contact Phone</CLabel>
            <CInput
              v-model="itemAddNewCustomer.contactPhone"
              placeholder="+60 12 345 6789"
            />
          </CFormGroup>
        </CCol>
        <CCol md="6">
          <CFormGroup>
            <CLabel class="font-weight-bold">Address</CLabel>
            <CTextarea
              placeholder="No. 123, Jalan Example
Taman Example, 
12345 Kuala Lumpur,
Malaysia"
              rows="5"
              v-model="itemAddNewCustomer.address"
              required
            />
          </CFormGroup>
          <CRow>
            <CCol sm="6">
              <CFormGroup>
                <CLabel class="font-weight-bold">City</CLabel>
                <CInput v-model="itemAddNewCustomer.city" placeholder="City" />
              </CFormGroup>
            </CCol>
            <CCol sm="6">
              <CFormGroup>
                <CLabel class="font-weight-bold">Postcode</CLabel>
                <CInput
                  v-model="itemAddNewCustomer.postcode"
                  placeholder="Postcode"
                />
              </CFormGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6">
              <CFormGroup>
                <CLabel class="font-weight-bold">State</CLabel>
                <CInput
                  v-model="itemAddNewCustomer.state"
                  placeholder="State"
                />
              </CFormGroup>
            </CCol>
            <CCol sm="6">
              <CFormGroup>
                <CLabel class="font-weight-bold">Country</CLabel>
                <CInput
                  v-model="itemAddNewCustomer.country"
                  placeholder="Country"
                />
              </CFormGroup>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <template #footer>
        <CButton color="light" @click="addCustomerFormPopup = false">
          Cancel
        </CButton>
        <CButton color="primary" @click="confirmAddCustomer">
          Add Customer
        </CButton>
      </template>
    </CModal>

    <!-- Add Product Modal -->
    <CModal
      title="Add New Product"
      size="lg"
      :show.sync="addPoductFormPopup"
      @update:show="onProductPopupConfirmation"
    >
      <CRow>
        <CCol md="12">
          <CFormGroup>
            <CLabel class="font-weight-bold">Product Name</CLabel>
            <CInput
              v-model="itemAddNewProduct.name"
              placeholder="Product name"
              required
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel class="font-weight-bold">Description</CLabel>
            <CTextarea
              placeholder="Product description"
              rows="5"
              v-model="itemAddNewProduct.description"
            />
          </CFormGroup>
          <CRow>
            <CCol sm="6">
              <CFormGroup>
                <CLabel class="font-weight-bold">Default Price</CLabel>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Rp</span>
                  </div>
                  <CInput
                    v-model="itemAddNewProduct.defaultPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </CFormGroup>
            </CCol>
            <CCol sm="6">
              <CFormGroup>
                <CLabel class="font-weight-bold">Default Unit</CLabel>
                <CInput
                  v-model="itemAddNewProduct.defaultUnit"
                  placeholder="e.g. pcs, kg, hours"
                />
              </CFormGroup>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <template #footer>
        <CButton color="light" @click="addPoductFormPopup = false">
          Cancel
        </CButton>
        <CButton color="primary" @click="confirmAddProduct">
          Add Product
        </CButton>
      </template>
    </CModal>

    <!-- Chart of Account Modal -->
    <CModal
      title="Select Chart of Account"
      size="lg"
      :show.sync="chooseAccountPopup"
      @update:show="onAccountPopupConfirmation"
    >
      <CRow>
        <CCol md="12">
          <CFormGroup>
            <CLabel class="font-weight-bold">Select Account</CLabel>
            <v-select
              v-model="selectedChartAccount"
              :label="`itemDisplay`"
              :options="filteredChartAccounts"
              placeholder="Select Chart of Account"
            />
          </CFormGroup>
        </CCol>
      </CRow>
      <template #footer>
        <CButton color="light" @click="chooseAccountPopup = false">
          Cancel
        </CButton>
        <CButton
          color="primary"
          :disabled="!selectedChartAccount"
          @click="confirmAccountSelection"
        >
          Confirm
        </CButton>
      </template>
    </CModal>
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
import BusinessApi from "@/lib/businessApi";
import ChartOfAccountApi from "../../lib/chartOfAccountApi";

export default {
  name: "Invoice",
  components: {
    vSelect,
    WidgetsReportInvoice,
  },
  data: () => {
    return {
      chooseAccountPopup: false,
      selectedChartAccount: null,
      pendingStatusChange: null,
      filteredChartAccounts: [],
      chartOfAccountItems: [],
      chartOfAccountApi: new ChartOfAccountApi(),

      itemPendingNewProduct: null,
      itemAddNewProduct: {},
      addPoductFormPopup: false,

      itemAddNewCustomer: {
        name: "",
      },
      addCustomerFormPopup: false,

      businessApi: new BusinessApi(),

      quotationApi: new QuotationApi(),
      previewObj: {
        business: {
          name: "",
          address: "",
        },
        items: [],
        note: "",
      },
      invoiceStatuses: [],
      issuedDate: Date(),
      expiryDate: Date(),

      // Invoice Items
      invoiceItems: [],

      invoiceFields: [
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
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
          key: "show_move",
          _style: "width:1%",
        },
        {
          key: "show_remove",
          _style: "width:1%",
        },
      ],

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
    this.fetchChartOfAccount();

    if (self.$route.name === "InvoiceConvertFromQuot") {
      this.processInvoiceConvertFromQuot();
    } else if (self.$route.name === "InvoiceConvertFromItem") {
      this.processInvoiceConvertFromItem();
    } else {
      self.resetObj();
    }
  },
  computed: {
    computedInvoiceStatuses() {
      let statuses = this.invoiceStatuses.filter(
        (status) => status.name != this.obj.statusDescription
      );

      if (this.obj.statusDescription === "Draft")
        return statuses.filter((status) => status.name == "Approve");
      if (this.obj.statusDescription === "Approve")
        return statuses.filter(
          (status) => status.name == "Paid" || status.name == "Cancelled"
        );
      else return [];
    },
    computeProductItemsWithAddNew() {
      return [...this.productItems, { id: "add_new", name: "-- Add New --" }];
    },

    customerItemsWithAddNew() {
      return [...this.customerItems, { id: "add_new", name: "-- Add New --" }];
    },
    computedPreviewItem() {
      return {
        ...this.obj,
        items: this.computedInvoiceItems,
        expiryDate: this.expiryDate,
      };
    },
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
      for (var i = 0; i < this.computedInvoiceItems.length; i++) {
        var item = this.computedInvoiceItems[i];
        total += item.price * item.quantity;
      }
      return total;
    },
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    },

    fetchChartOfAccount() {
      var self = this;
      self.chartOfAccountApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.chartOfAccountItems = response.result;
          console.log("self.chartOfAccountItems", self.chartOfAccountItems);
        })
        .catch(({ data }) => {});
    },

    onProductPopupConfirmation(status, evt, accept) {
      if (accept) {
        this.productApi
          .create(this.itemAddNewProduct)
          .then((response) => {
            console.log("onProductPopupConfirmation", response);
            var addedProduct = response.result;
            this.refreshProduct();
            this.itemPendingNewProduct.product = addedProduct;
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.itemPendingNewProduct.product = null;
      }
      this.itemAddNewProduct = {};
    },

    confirmAddProduct() {
      this.productApi
        .create(this.itemAddNewProduct)
        .then((response) => {
          var addedProduct = response.result;
          this.refreshProduct();
          if (this.itemPendingNewProduct) {
            this.itemPendingNewProduct.product = addedProduct;
          }
          this.toast("Success", "Product added successfully", "success");
          this.addPoductFormPopup = false;
        })
        .catch(({ data }) => {
          this.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    handleProductSelect(selected, item) {
      if (selected.id === "add_new") {
        this.itemPendingNewProduct = item;
        this.itemAddNewProduct = {};
        this.addPoductFormPopup = true;
      }
    },

    startTour() {},
    onConvertToReceipt(item) {},
    addNew() {
      this.$router.push({ path: "/tenants/Invoice" });
    },
    onCustomerPopupConfirmation(status, evt, accept) {
      if (accept) {
        this.customerApi
          .create(this.itemAddNewCustomer)
          .then((response) => {
            console.log("onCustomerPopupConfirmation", response);

            var addedCustomer = response.result;
            this.refreshCustomer();
            this.selectedCustomer = addedCustomer;
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      this.itemAddNewCustomer = {};
    },

    confirmAddCustomer() {
      this.customerApi
        .create(this.itemAddNewCustomer)
        .then((response) => {
          var addedCustomer = response.result;
          this.refreshCustomer();
          this.selectedCustomer = addedCustomer;
          this.toast("Success", "Customer added successfully", "success");
          this.addCustomerFormPopup = false;
        })
        .catch(({ data }) => {
          this.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    handleCustomerSelect(selected) {
      if (selected.id === "add_new") {
        this.addNewCustomer();
        this.selectedCustomer = null;
      }
    },
    addNewCustomer() {
      this.selectedCustomer = null;
      this.itemAddNewCustomer = {};
      this.addCustomerFormPopup = true;
    },
    cancel() {
      this.$router.push({ path: "/tenants/InvoiceList" });
    },
    changeState(item) {
      this.pendingStatusChange = item;
      if (item.name === "Paid" || item.name === "Cancelled") {
        const type = item.name === "Paid" ? "Asset" : "Income";
        this.filteredChartAccounts = this.chartOfAccountItems.filter(
          (a) => a.accountTypeDescription === type
        );

        this.chooseAccountPopup = true;
      } else {
        this.proceedChangeState(null); // Auto for Approve, etc.
      }
    },
    onAccountPopupConfirmation(visible) {
      this.chooseAccountPopup = visible;
    },

    confirmAccountSelection() {
      this.proceedChangeState(this.selectedChartAccount);
      this.selectedChartAccountId = null;
    },

    proceedChangeState(account) {
      var self = this;
      self.obj.status = self.pendingStatusChange.id;
      let accountId = null;
      if (account != null) accountId = account.id;

      if (self.obj.id) {
        this.api
          .updateState(self.obj, accountId)
          .then((response) => {
            self.resetObj();
            self.toast("Success", "Invoice status updated", "success");
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          })
          .finally(() => {
            this.chooseAccountPopup = false;
            this.pendingStatusChange = null;
          });
      }
    },
    fetchInvoiceStatuses() {
      var self = this;
      self.api
        .getInvoiceStatus()
        .then((response) => {
          this.invoiceStatuses = response.result;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    getBadgeClass() {
      if (this.obj.statusDescription == "Draft") {
        return "badge badge-secondary";
      } else if (this.obj.statusDescription == "Accepted") {
        return "badge badge-primary";
      } else if (this.obj.statusDescription == "Sent") {
        return "badge badge-success";
      } else if (this.obj.statusDescription == "Rejected") {
        return "badge badge-warning";
      } else if (this.obj.statusDescription == "Cancelled") {
        return "badge badge-danger";
      } else {
        return "badge badge-secondary";
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

    onRemoveClaimItem(item) {
      var self = this;
      if (self.invoiceItems != null) {
        for (let i = 0; i < self.invoiceItems.length; i++) {
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
        product:
          this.productItems.length > 0 ? this.productItems[0] : { name: "" },
        price: 0,
        quantity: 1,
        unit: "L.S.",
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
          let currentDate = new Date();
          this.issuedDate = new Date(
            currentDate.toISOString().split("T")[0] + "T00:00:00"
          ); // Set issuedDate
          currentDate.setDate(currentDate.getDate() + 30);
          this.expiryDate = new Date(
            currentDate.toISOString().split("T")[0] + "T00:00:00"
          ); // Set expiry date

          self.selectedCustomer = item.quotation.customer;

          this.obj.items.push({
            id: this.generateGUID(),
            product: item.product,
            price: item.price,
            quantity: item.quantity,
            description: item.description,
            position: 1,
          });

          this.invoiceItems = this.obj.items;

          this.api
            .getNextNumber()
            .then((response) => {
              self.obj.invoiceNumber = response.result;
            })
            .catch(({ data }) => {});

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
              for (let i = 0; i < quotation.items.length; i++) {
                quotation.items[i].position = i + 1;
              }
            }
          }

          self.invoiceItems = self.obj.items = quotation.items;

          this.api
            .getNextNumber()
            .then((response) => {
              self.obj.invoiceNumber = response.result;
            })
            .catch(({ data }) => {});

          for (let i = 0; i < self.obj.items.length; i++) {
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
            this.issuedDate = self.obj.issuedDate;
            this.expiryDate = self.obj.dueDate;
            self.selectedCustomer = self.obj.customer;

            if (self.obj.items.length > 0) {
              if (self.obj.items[0].position == 0) {
                for (let i = 0; i < self.obj.items.length; i++) {
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
          })
          .catch(({ data }) => {});

        this.businessApi
          .getCurrentActiveBusiness()
          .then((response) => {
            self.obj.note = response.result.invoiceDefaultFooter;
          })
          .catch(({ data }) => {});
      }
    },
    onSubmit() {
      var self = this;
      self.obj.items = self.computedInvoiceItems;
      self.obj.issuedDate = self.issuedDate;
      self.obj.dueDate = self.expiryDate;

      let isItemsInvalid = false;

      self.obj.items.forEach((item) => {
        if (!item.product || !item.product.id) {
          isItemsInvalid = true;
        }
        item.productId = item.product.id;
      });

      if (self.selectedCustomer) {
        self.obj.customerId = self.selectedCustomer.id;
      }

      //validate
      if (self.obj.customerId == null) {
        self.toast("Error", "Please select customer.", "danger");
        return;
      }

      if (self.obj.items.length == 0) {
        self.toast("Error", "Please add item.", "danger");
        return;
      }
      if (isItemsInvalid) {
        self.toast("Error", "Please select product.", "danger");
        return;
      }

      if (self.grandTotal == 0) {
        self.toast("Error", "Amount is zero.", "danger");
        return;
      }

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.toast("Success", "Invoice created successfully", "success");
            var newObj = response.result;
            self.$router.push({
              path: `/tenants/Invoice/${newObj.id}`,
            });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Success", "Invoice updated successfully", "success");
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
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
    getEmptyObj() {
      return {
        invoiceNumber: "",
        items: [],
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
.customer-details {
  transition: all 0.3s ease;
}

.invoice-preview {
  transform: scale(0.8);
  transform-origin: top center;
  overflow: hidden;
  border: 1px solid #ebedef;
  border-radius: 0.25rem;
}

/* Custom styling for mobile view */
@media (max-width: 767.98px) {
  .table-responsive {
    display: none;
  }

  .invoice-preview {
    transform: scale(0.7);
  }
}

@media (min-width: 768px) {
  .d-md-none {
    display: none;
  }
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #321fdb 0%, #1f67db 100%);
}
</style>
