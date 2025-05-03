<template>
  <CModal title="Add New Product" size="xl" :show.sync="show">
    <CRow form>
      <CCol md="12">
        <CInput label="Name" horizontal v-model="product.name" />
        <CRow form class="form-group">
          <CCol tag="label" sm="3" class="col-form-label"> Description </CCol>
          <CCol sm="9">
            <CTextarea placeholder="" rows="5" v-model="product.description" />
          </CCol>
        </CRow>
        <CRow form class="form-group">
          <CCol tag="label" sm="3" class="col-form-label"> Account </CCol>
          <CCol sm="9">
            <v-select
              style="width: 100%"
              v-model="product.chartAccount"
              :label="`itemDisplay`"
              :options="chartOfAccountItems"
              placeholder="Select COA"
            />
          </CCol>
        </CRow>

      </CCol>
    </CRow>

    <template #footer>
      <CButton color="secondary" @click="$emit('update:show', false)"
        >Cancel</CButton
      >
      <CButton color="primary" @click="save">Save</CButton>
    </template>
  </CModal>
</template>
  
  <script>
import ProductApi from "@/lib/productApi";
import ChartOfAccountApi from "../../lib/chartOfAccountApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "WidgetEditProductModal",
  components: {
    vSelect,
  },
  props: {
    show: Boolean,
    obj: Object,
  },
  data() {
    return {
      //   selectedChartAccount: null,
      chartOfAccountApi: new ChartOfAccountApi(),
      chartOfAccountItems: [],

      //   filteredChartAccounts: [],

      product: {
        name: "",
        chartAccount: null,
        description: "",
      },
      api: new ProductApi(),
    };
  },
  watch: {
    obj: {
      handler(newVal) {
        this.product = { ...newVal };
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.fetchChartOfAccount();
  },
  methods: {
    fetchChartOfAccount() {
      var self = this;
      self.chartOfAccountApi
        .getListByCurrentBusiness()
        .then((response) => {
          var allChartOfAccounts = response.result;
          this.chartOfAccountItems = allChartOfAccounts.filter(
            (a) => a.accountTypeDescription === "Income"
          );
        })
        .catch(({ data }) => {});
    },

    save() {
      if (!this.product.name) {
        this.$emit("error", "Product name is required.");
        return;
      }

      if (this.product.chartAccount !== null) {
        this.product.chartAccountId = this.product.chartAccount.id;
      } else {
        this.$emit("error", "Chart of Account is required.");
        return;
      }

      const action = this.product.id
        ? this.api.update(this.product)
        : this.api.create(this.product);

      action
        .then((response) => {
          const result = response.result || this.product;
          this.$emit("save", result);
          this.$emit("update:show", false);
        })
        .catch(({ data }) => {
          this.$emit("error", helper.getErrorMessage(data));
        });
    },
  },
};
</script>
  