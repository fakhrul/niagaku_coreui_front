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
          <CCardHeader> <strong> Claim </strong> Information </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput label="No" horizontal v-model="obj.claimNo" />
              <CInput label="Name" horizontal v-model="obj.profile.fullName" />
              <CInput label="Business" horizontal v-model="obj.business.name" />
              <CInput label="Date" horizontal v-model="obj.date" />
              <CInput
                label="Total Amount"
                horizontal
                v-model="obj.totalAmount"
              />
              <!-- <CInput label="State" horizontal v-model="obj.claimState" /> -->
              <CSelect
                horizontal
                :value.sync="selectedClaimState"
                :options="claimStates"
                label="Claim State"
              />
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" @click="submit"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            >
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader> <strong> Claim </strong> Details </CCardHeader>
          <CCardBody>
            <CDataTable :items="computedClaimItems" :fields="claimFields">
              <template #show_index="{ index }">
                <td class="py-2">
                  {{ index + 1 }}
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
              <template #show_price="{ item }">
                <td>
                  <CInput v-model="item.amount" min="0" step="0.01"></CInput>
                </td>
              </template>
              <template #show_total="{ item }">
                <td>
                  {{ getTotalItemPrice(item) }}
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
                  <CButton @click="addNewItem()" color="primary">Add</CButton>
                </td>
                <td colspan="5" class="text-right">
                  <strong>Grand Total:</strong>
                </td>
                <td>{{ grandTotal.toFixed(2) }}</td>
              </template>
            </CDataTable>
          </CCardBody>
          <CCardFooter> </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import ClaimApi from "@/lib/claimApi";

const claimItems = [];
const claimFields = [
  {
    key: "show_index",
    label: "#",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
  // { key: "productName", label: "Item" },
  {
    key: "date",
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
    key: "show_remove",
    _style: "width:1%",
  },
];

export default {
  name: "Claim",
  data: () => {
    return {
      // Quotation Itm
      claimItems: claimItems.map((item, id) => {
        return { ...item, id };
      }),

      claimFields,

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
    self.resetObj();
  },
  computed: {
    computedClaimItems() {
      return this.claimItems.map((item) => {
        return {
          ...item,
          // productName: item.product.name,
          // totalAmountPerItem: this.getTotalItemPrice(item),
        };
      });
    },
    grandTotal() {
      var total = 0;
      for (var i = 0; i < this.claimItems.length; i++) {
        var item = this.claimItems[i];
        total += item.amount * item.quantity;
      }
      return total;
    },
  },
  methods: {
    onRemoveClaimItem(item) {
      var self = this;
      if (self.computedClaimItems != null) {
        for (var i = 0; i < self.computedClaimItems.length; i++) {
          if (self.computedClaimItems[i].id === item.id) {
            self.computedClaimItems.splice(i, 1);
          }
        }
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
      this.computedClaimItems.push({
        id: this.generateGUID(),
        name: "",
        amount: 0,
        unit: "L.S.",
        quantity: 0,
        description: "",
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
          var obj = response.result;
          this.claimStates = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));

          console.log(this.claimStates);
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
            self.claimItems = self.obj.items;

            // Set selectedClaimState to match the current state of the claim
            self.selectedClaimState = self.obj.claimState;

            // var claimState ={
            //   value: self.obj.claimState,
            //   label: self.obj.claimStateDescription,
            // };
            // console.log(claimState);
            // self.selectedClaimState = self.obj.claimState;
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

      console.log(self.selectedClaimState);
      if (self.selectedClaimState) {
        self.obj.claimState = self.selectedClaimState;
        self.obj.items = self.computedClaimItems;

        if (!self.obj.id) {
          this.api
            .create(self.obj)
            .then((response) => {
              self.toast("Success", "Update Success", "success");
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
      } else {
        self.toast("Error", "Please select a valid claim state.", "danger");
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
