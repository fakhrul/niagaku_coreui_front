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
            <strong>Quotation</strong> <small class="ml-1">vue-select</small>
            <a
              href="https://coreui.io/pro/vue/"
              rel="noreferrer noopener"
              target="_blank"
              class="badge badge-danger ml-1"
            >
              CoreUI Pro
            </a>
            <div class="card-header-actions">
              <a
                href="https://vue-select.org/"
                rel="noreferrer noopener"
                target="_blank"
                class="card-header-action"
              >
                <small class="text-muted">docs</small>
              </a>
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
                  label="Quotation No"
                  placeholder=""
                  v-model="obj.quotationNumber"
              /></CCol>
              <CCol> <CInput label="Date" type="date" /></CCol>
              <CCol> <CInput label="Expiry" type="date" /></CCol>
              <CCol> <CInput label="Reference" /></CCol>
            </CRow>

            <CRow>
              <CCol col="6">
                <CTextarea label="Quotation Title" placeholder="" rows="2" />
              </CCol>
              <CCol col="6"> </CCol>
            </CRow>

            <CRow>
              <CCol>
                <CDataTable :items="computedItems" :fields="quotationFields">
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
                      <CInput v-model="item.price" min="0" step="0.01"></CInput>
                    </td>
                  </template>
                  <template #show_total="{ item }">
                    <td>
                      {{ getTotalItemPrice(item) }}
                    </td>
                  </template>
                  <template #footer>
                    <td><CButton @click="addNewItem()" color="primary">Add</CButton></td>
                    <td colspan="4" class="text-right">
                      <strong>Grand Total:</strong>
                    </td>
                    <td>{{ grandTotal.toFixed(2) }}</td>
                  </template>
                </CDataTable>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                
              </CCol>
            </CRow>

            <CRow>
              <CCol>
                <CTextarea label="Term & Conditions" placeholder="" rows="2" />
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
  </div>
</template>

<script>
import QuotationApi from "@/lib/quotationApi";
import CustomerApi from "@/lib/customerApi";
import ProductApi from "@/lib/productApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const quotationItems = [];
const quotationFields = [
  {
    key: "show_index",
    label: "#",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
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
];

export default {
  name: "Quotation",
  components: {
    vSelect,
  },
  data: () => {
    return {
      // Quotation Itm
      quotationItems: quotationItems.map((item, id) => {
        return { ...item, id };
      }),

      quotationFields,

      selectedItem: null,
     
      selectedCustomer: null,
      organizationTypeList: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new QuotationApi(),
      customerApi: new CustomerApi(),
      productApi: new ProductApi(),
      customerItems: [],
      productItems:[],
    };
  },
  mounted() {
    var self = this;
    self.refreshCustomer();
    self.refreshProduct();
    self.resetObj();

    // self.quotationItems = [
    //   {
    //     id: 1,
    //     item: "",
    //     description: "",
    //     quantity: 0,
    //     pricePerUnit: 0,
    //     totalAmount: 0,
    //   },
    //   {
    //     id: 2,
    //     item: "",
    //     description: "",
    //     quantity: 0,
    //     pricePerUnit: 0,
    //     totalAmount: 0,
    //   },
    // ];
  },
  computed: {
    computedItems() {
      return this.quotationItems.map((item) => {
        return {
          ...item,
          productName: item.product.name,
          totalAmountPerItem: this.getTotalItemPrice(item),
        };
      });
    },
    grandTotal() {
      var total = 0;
      for (var i = 0; i < this.quotationItems.length; i++) {
        var item = this.quotationItems[i];
        total += item.price * item.quantity;
      }
      return total;
    },
  },
  methods: {
    
    addNewItem() {
      this.computedItems.push({
        product: {},
        price: 0,
        quantity: 0,
        description: "",
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

    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
            self.selectedCustomer = self.obj.customer;
            self.quotationItems = self.obj.items;
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
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.toast("Success", "Updated", "success");
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
