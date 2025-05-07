<template>
  <div class="wrapper">
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
    </div>
    <div>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Product </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedItems"
                :fields="fields"
                column-filter
                items-per-page-select
                :items-per-page="10"
                hover
                sorter
                pagination
                :loading="loading"
              >
                <template #show_index="{ index }">
                  <td class="py-2">
                    {{ index + 1 }}
                  </td>
                </template>
                <template #show_details="{ item, index }">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="toggleDetails(item, index)"
                    >
                      {{ Boolean(item._toggled) ? "Hide" : "Show" }}
                    </CButton>
                  </td>
                </template>
                <template #details="{ item }">
                  <CCollapse
                    :show="Boolean(item._toggled)"
                    :duration="collapseDuration"
                  >
                    <CCardBody>
                      <CButton
                        size="sm"
                        color="info"
                        class="ml-1"
                        @click="onEdit(item)"
                      >
                        Edit
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        class="ml-1"
                        @click="showDeleteConfirmation(item)"
                      >
                        Delete
                      </CButton>
                    </CCardBody>
                  </CCollapse>
                </template>
              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              >
            </CCardFooter>
          </CCard>
          <CModal
            title="Confirm Delete"
            color="warning"
            :show.sync="warningModal"
            @update:show="onDeleteConfirmation"
          >
            Are you sure you want to delete this {{ itemToDelete.code }} ?
          </CModal>
        </CCol>
      </CRow>
      <WidgetEditProductModal
        :show.sync="showProductModal"
        :obj="selectedProduct"
        @save="handleProductSave"
        @error="handleProductError"
      />
    </div>
  </div>
</template>

<script>
import ProductApi from "@/lib/productApi";
import WidgetEditProductModal from "../widgets/WidgetEditProductModal.vue";

const items = [];
const fields = [
  // { key: "accountNo"},
  {
    key: "show_index",
    label: "#",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
  { key: "name" },
  { key: "description" },
  { key: "chartOfAccountName" },
  {
    key: "show_details",
    label: "",
    _style: "width:2%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "ProductList",
  components: {
    WidgetEditProductModal,
  },
  data() {
    return {
      showProductModal: false,
      selectedProduct: {}, // Empty = new product. Can pre-fill if editing
  
      loading: true,
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      infoList: [],
      fields,
      details: [],
      collapseDuration: 0,
      api: new ProductApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  mounted() {
    this.$store.commit("setPageNavItems", ["Sales", "Products/Services"]);
    var self = this;
    self.refreshTable();
  },
  computed: {
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          chartOfAccountName: this.getChartOfAccountName(item),
        };
      });
    },
  },

  methods: {
    getChartOfAccountName(item) {
      try {
        return item.chartAccount.name;
      } catch (error) {
        return "N/A";
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
    toggleDetails(item, index) {
      this.$set(this.items[index], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    refreshTable() {
      var self = this;
      self.loading = false;
      self.api
        .getListByCurrentBusiness()
        .then((response) => {
          self.items = response.result;
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onEdit(item) {
      this.selectedProduct = item;
      this.showProductModal = true
      // var self = this;
      // self.$router.push({
      //   path: `/tenants/Product/${item.id}`,
      // });
    },
    onDeleteConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.refreshTable();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      self.itemToDelete = {};
    },
    showDeleteConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningModal = true;
    },
    addNew() {
      this.showProductModal = true
      // this.$router.push({ path: "/tenants/Product" });
    },
    handleProductSave(newProduct) {
      this.showProductModal = false;
      this.toast("Success", "Added", "success");
      this.refreshTable();
    },
    handleProductError(message) {
      this.toast("Error", message || "Error saving product.", "danger");
    },

    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
  },
};
</script>
